---
title: "Podspec 管理策略"
tags:
  - "CocoaPods 历险记"
  - "Ruby"
comments: true
show_label: "联合创作"
---

# 引子

本文是 Core 的最后一篇，它与另外两篇文章「Podfile 解析逻辑」和「PodSpec 文件分析」共同支撑起 CocoaPods 世界的骨架。CocoaPods-Core 这个库之所以被命名为 Core 就是因为它包含了 **Podfile -> Spec Repo -> PodSpec** 这条完整的链路，将散落各地的依赖库连接起来并基于此骨架不断地完善功能。

从提供各种便利的命令行工具，到依赖库与主项目的自动集成，再到提供多样的 Xcode 编译配置、单元测试、资源管理等等，最终形成了我们所见的 CocoaPods。

今天我们就来聊聊 `Spec Repo` 这个 `PodSpec` 的聚合仓库以及它的演变与问题。

# Source

作为 `PodSpec` 的聚合仓库，Spec Repo **记录着所有 `pod` 所发布的不同版本的 `PodSpec` 文件**。该仓库对应到 Core 的数据结构为 `Source`，即为今天的主角。

整个 `Source` 的结构比较简单，它基本是围绕着 Git 来做文章，主要是对 `PodSpec` 文件进行各种查找更新操作。结构如下：

```ruby
# 用于检查 spec 是否符合当前 Source 要求
require 'cocoapods-core/source/acceptor'
# 记录本地 source 的集合
require 'cocoapods-core/source/aggregate'
# 用于校验 source 的错误和警告
require 'cocoapods-core/source/health_reporter'
# source 管理器
require 'cocoapods-core/source/manager'
# source 元数据
require 'cocoapods-core/source/metadata'

module Pod
  class Source
    # 仓库默认的 Git 分支
    DEFAULT_SPECS_BRANCH = 'master'.freeze
    # 记录仓库的元数据
    attr_reader :metadata
    # 记录仓库的本地地址
    attr_reader :repo
    # repo 仓库地址 ~/.cocoapods/repos/{repo_name}
    def initialize(repo)
      @repo = Pathname(repo).expand_path
      @versions_by_name = {}
      refresh_metadata
    end
    # 读取 Git 仓库中的 remote url 或 .git 目录
    def url
      @url ||= begin
        remote = repo_git(%w(config --get remote.origin.url))
        if !remote.empty?
          remote
        elsif (repo + '.git').exist?
          "file://#{repo}/.git"
        end
      end
    end

    def type
      git? ? 'git' : 'file system'
    end
    # ...
  end
end
```

`Source` 还有两个子类 **CDNSource** 和 **TrunkSource**，TrunkSouce 是 CocoaPods 的默认仓库。在版本 1.7.2 之前 Master Repo 的 URL 指向为 Github 的 [Specs 仓库](https://github.com/CocoaPods/Specs "Specs 仓库")，这也是造成我们每次 `pod install` 或 `pod update` 慢的原因之一。它不仅保存了近 10 年来 PodSpec 文件同时还包括 Git 记录，再加上墙的原因，每次更新都非常痛苦。而在 1.7.2 之后 CocoaPods 的默认 Source 终于改为了 CDN 指向，同时支持按需下载，缓解了 `pod` 更新和磁盘占用过大问题。

`Source` 的依赖关系如下：

![](https://cdn.nlark.com/yuque/0/2020/jpeg/98641/1603554440065-dd4bafb0-c7c5-4048-baa1-ff03aca64e7b.jpeg#align=left&display=inline&height=414&margin=%5Bobject%20Object%5D&originHeight=414&originWidth=896&size=0&status=done&style=none&width=896)

回到 `Source` 来看其如何初始化的，可以看到其构造函数 `#initialize(repo)` 将传入的 repo 地址保存后，直接调用了 `#refresh_metadata` 来完成元数据的加载：

```ruby
def refresh_metadata
  @metadata = Metadata.from_file(metadata_path)
end

def metadata_path
  repo + 'CocoaPods-version.yml'
end
```

## Metadata

Metadata 是保存在 repo 目录下，名为 `CocoaPods-version.yml` 的文件，**用于记录该 Source 所支持的 CocoaPods 的版本以及仓库的分片规则**。

```ruby
autoload :Digest, 'digest/md5'
require 'active_support/hash_with_indifferent_access'
require 'active_support/core_ext/hash/indifferent_access'

module Pod
  class Source
    class Metadata
      # 最低可支持的 CocoaPods 版本，对应字段 `min`
      attr_reader :minimum_cocoapods_version
      # 最高可支持的 CocoaPods 版本，对应字段 `max`
      attr_reader :maximum_cocoapods_version
      # 最新 CocoaPods 版本，对应字段 `last`
      attr_reader :latest_cocoapods_version
      # 规定截取的关键字段的前缀长度和数量
      attr_reader :prefix_lengths
      # 可兼容的 CocoaPods 最新版本
      attr_reader :last_compatible_versions
      # ...
    end
  end
end
```

这里以笔者 💻 环境中 Master 仓库下的 `CocoaPods-version.yml` 文件内容为例：

```yaml
---
min: 1.0.0
last: 1.10.0.beta.1
prefix_lengths:
  - 1
  - 1
  - 1
```

最低支持版本为 `1.0.0`，最新可用版本为 `1.10.0.beta.1`，以及最后这个 `prefix_lengths` 为 `[1, 1, 1]` 的数组。那么这个 **prefix_lengths 的作用是什么呢 ？**

要回答这个问题，我们先来看一张 `Spec Repo` 的目录结构图：

![](https://cdn.nlark.com/yuque/0/2020/jpeg/98641/1603554440138-7037ff08-7e58-4e02-bf7a-0cc4d10032a0.jpeg#align=left&display=inline&height=1168&margin=%5Bobject%20Object%5D&originHeight=1168&originWidth=3390&size=0&status=done&style=none&width=3390)

再 🤔 另外一个问题，**为什么 CocoaPods 生成的目录结构是这样 ？**

其实在 2016 年 CocoaPods Spec 仓库下的所有文件都在同级目录，不像现在这样做了分片。这个是为了解决当时用户的吐槽：[Github 下载慢](https://github.com/CocoaPods/CocoaPods/issues/4989#issuecomment-193772935 "Github 下载慢")，最终解决方案的结果就如你所见：**将 Git 仓库进行了分片**。

那么问题来了，**为什么分片能够提升 Github 下载速度？**

很重要的一点是 CocoaPods 的 `Spec Repo` 本质上是 Git 仓库，而 Git 在做变更管理的时候，会记录目录的变更，每个子目录都会对应一个 Git model。而当目录中的文件数量过多的时候，Git 要找出对应的变更就变得十分困难。有兴趣的同学可以查看[官方说明](https://blog.cocoapods.org/Master-Spec-Repo-Rate-Limiting-Post-Mortem/#too-many-directory-entries "官方说明")。

另外再补充一点，在 Linux 中最经典的一句话是：「**一切皆文件**」，不仅普通的文件和目录，就连块设备、管道、socket 等，也都是统一交给文件系统管理的。也就是说就算不用 Git 来管理 Specs 仓库，当目录下存在数以万计的文件时，如何高效查找目标文件也是需要考虑的问题。

> Tips：关于文件系统层次结构有兴趣的同学可以查看[FHS 标准](https://www.wikiwand.com/en/Filesystem_Hierarchy_Standard "FHS 标准")，以及知乎这篇：[传送门](https://zhuanlan.zhihu.com/p/183238194#tocbar--13f51dj "传送门")

回到 CocoaPods，如何对 Master 仓库目录进行分片就涉及到 metadata 类中的关键方法：

```ruby
def path_fragment(pod_name, version = nil)
  prefixes = if prefix_lengths.empty?
               []
             else
               hashed = Digest::MD5.hexdigest(pod_name)
               prefix_lengths.map do |length|
                 hashed.slice!(0, length)
               end
             end
  prefixes.concat([pod_name, version]).compact
end
```

`#path_fragment` 会依据 pod_name 和 version 来生成 pod 对应的索引目录：

1. 首先对 pod_name 进行 MD5 计算获取摘要；
1. 遍历 `prefix_lengths` 对生成的摘要不断截取指定的长度作为文件索引。

以 `AFNetworking` 为例：

```ruby
$ Digest::MD5.hexdigest('AFNetworking')
"a75d452377f3996bdc4b623a5df25820"
```

由于我们的 `prefix_lengths` 为 `[1, 1, 1]` 数组，那么它将会从左到右依次截取出一个字母，即： `a`、`7`、`5` ，这三个字母作为索引目录，它正好符合我们 👆 目录结构图中 AFNetworking 的所在位置。

## Versions

要找到 `Podfile` 中限定版本号范围的 `PodSpec` 文件还需要需要最后一步，获取当前已发布的 Versions 列表，并通过比较 Version 得出最终所需的 `PodSpec` 文件。

在上一步已通过 `metadata` 和 `pod_name` 计算出 `pod` 所在目录，接着就是找到 `pod` 目录下的 Versions 列表：

![](https://cdn.nlark.com/yuque/0/2020/jpeg/98641/1603554440134-53557a72-ffc0-4a65-bfc0-39a85635be71.jpeg#align=left&display=inline&height=948&margin=%5Bobject%20Object%5D&originHeight=948&originWidth=2680&size=0&status=done&style=none&width=2680)

获取 Versions：

```ruby
def versions(name)
  return nil unless specs_dir
  raise ArgumentError, 'No name' unless name
  pod_dir = pod_path(name)
  return unless pod_dir.exist?
  @versions_by_name[name] ||= pod_dir.children.map do |v|
    basename = v.basename.to_s
    begin
      Version.new(basename) if v.directory? && basename[0, 1] != '.'
    rescue ArgumentError
    raise Informative, 'An unexpected version directory ...'
    end
  end.compact.sort.reverse
end
```

该方法重点在于将 `pod_dir` 下的每个目录都转换成为了 **Version** 类型，并在最后进行了 sort 排序。

> `#versions` 方法主要在 `pod search` 命令中被调用，后续会介绍。

来搂一眼 Version 类：

```ruby
class Version < Pod::Vendor::Gem::Version
  METADATA_PATTERN = '(\+[0-9a-zA-Z\-\.]+)'
  VERSION_PATTERN = "[0-9]+(\\.[0-9a-zA-Z\\-]+)*#{METADATA_PATTERN}?"
  # ...
end
```

该 Version 继承于 [Gem::Version](https://www.rubydoc.info/github/rubygems/rubygems/Gem/Version "Gem::Version") 并对其进行了扩展，实现了语义化版本号的标准，sort 排序也是基于语义化的版本来比较的，这里我们稍微展开一下。

### Semantic Versioning

语义化版本号（[Semantic Versioning](https://semver.org/ "Semantic Versioning") 简称：SemVer）绝对是依赖管理工具绕不开的坎。**语义化的版本就是让版本号更具语义化，可以传达出关于软件本身的一些重要信息而不只是简单的一串数字。** 我们每次对 Pod 依赖进行更新，最后最重要的一步就是更新正确的版本号，一旦发布出去，再要更改就比较麻烦了。

> [SemVer](https://github.com/semver/semver "SemVer") 是由 Tom Preston-Werner 发起的一个关于软件版本号的命名规范，该作者为 Gravatars 创办者同时也是 GitHub 联合创始人。

那什么是语义化版本号有什么特别呢 ？我们以 AFNetworking 的 **release tag** 示例：

```
3.0.0
3.0.0-beta.1
3.0.0-beta.2
3.0.0-beta.3
3.0.1
```

这些 tags 并非随意递增的，它们背后正是遵循了语义化版本的标准。

**基本规则**

- 软件的版本通常由三位组成，如：X.Y.Z。
- 版本是严格递增的，
- 在发布重要版本时，可以发布 alpha, rc 等先行版本，
- alpha 和 rc 等修饰版本的关键字后面可以带上次数和 meta 信息，

**版本格式：**

> 主版本号.次版本号.修订号

版本号递增规则如下：

| Code status        | Stage                  | Example version |
| ------------------ | ---------------------- | --------------- |
| 新品首发           | 从 1.0.0 开始          | 1.0.0           |
| 向后兼容的 BugFix  | 增加补丁号 Z           | 1.0.1           |
| 向后兼容的 Feature | 增加次版本号 Y         | 1.1.0           |
| 向后不兼容的改动   | 增加主版本号 X         | 2.0.0           |
| 重要版本的预览版   | 补丁号后添加 alpha, rc | 2.1.0-rc.0      |

关于 CocoaPods 的 Version 使用描述，[传送门](https://guides.cocoapods.org/using/the-podfile.html#specifying-pod-versions "传送门")。

## CDNSource

CocoaPods 在 1.7.2 版本正式将 Master 仓库托管到 Netlify 的 CDN 上，当时关于如何支持这一特性的文章和说明铺天盖地，这里还是推荐大家看[官方说明](https://blog.cocoapods.org/CocoaPods-1.7.2/ "官方说明")。另外，当时感受是似乎国内的部分 iOS 同学都炸了，各种标题党：*什么最完美的升级*等等。

所以这里明确一下，对于 CocoaPods 的 Master 仓库支持了 CDN 的行为，仅解决了两个问题：

1. 利用 CDN 节点的全球化部署解决内容分发慢，提高 Specs 资源的下载速度。
1. 通过 Specs 按需下载摆脱了原有 Git Repo 模式下本地仓库的磁盘占用过大，操作卡的问题。

然而，**仅仅对 `PodSpec` 增加了 CDN 根本没能解决 GFW 导致的 Github 源码校验、更新、下载慢的问题。** 只能说路漫漫其修远兮。

> PS：作为 iOS 工程师，就经常被前端同学 😒 。你看这 CocoaPods 也太垃圾了吧！！！一旦删掉 `Pods` 目录重新 install 就卡半天，缓存基本不生效，哪像 npm 多快 balabala ...

先来看 CDNSource 结构：

```ruby
require 'cocoapods-core/source'
# ...
module Pod
  class CDNSource < Source
    def initialize(repo)
      # 标记是否正在同步文件
      @check_existing_files_for_update = false
      # 记录时间用于对比下载文件的新旧程度，以确认是否需要更新保存所下的资源
      @startup_time = Time.new
      # 缓存查询过的 PodSpec 资源
      @version_arrays_by_fragment_by_name = {}
      super(repo)
    end

    def url
      @url ||= File.read(repo.join('.url')).chomp.chomp('/') + '/'
    end

    def type
      'CDN'
    end
    # ...
  end
end
```

Source 类是基于 Github Repo 来同步更新 `PodSpec`，而 CDNSource 则是基于 CDN 服务所返回的 Response，因此将 Source 类的大部分方法重写了一个遍，具体会在 SourceManager 一节来展开。

最后看一下 `TrunkSource` 类：

```ruby
module Pod
  class TrunkSource < CDNSource
    # 新版落盘后仓库名称
    TRUNK_REPO_NAME = 'trunk'.freeze

    TRUNK_REPO_URL = 'https://cdn.cocoapods.org/'.freeze

    def url
      @url ||= TRUNK_REPO_URL
      super
    end
  end
end
```

核心就是重写了返回的 `url`，由于旧版 Spec 仓库名称为 `master` 为了加以区分，CDN 仓库则改名为 `trunk`。

# Source Manager

`Manager` 作为 source 的管理类，其主要任务为 source 的添加和获取，而对 `PodSpec` 文件的更新和查找行为则交由 source 各自实现。不过由于一个 `pod` 库可能对应多个不同的 source，这里又产生出 `Aggregate` 类来统一 `PodSpec` 的查询。

它们的关系如下：

![](https://cdn.nlark.com/yuque/0/2020/jpeg/98641/1603554440115-66b550de-dcf6-4449-9445-3af005eae414.jpeg#align=left&display=inline&height=414&margin=%5Bobject%20Object%5D&originHeight=414&originWidth=896&size=0&status=done&style=none&width=896)

Manager 实现：

```ruby
module Pod
  class Source
    class Manager
      attr_reader :repos_dir

      def initialize(repos_dir)
        @repos_dir = Pathname(repos_dir).expand_path
      end

      def source_repos
        return [] unless repos_dir.exist?
        repos_dir.children.select(&:directory?).sort_by { |d| d.basename.to_s.downcase }
      end

      def aggregate
        aggregate_with_repos(source_repos)
      end

      def aggregate_with_repos(repos)
        sources = repos.map { |path| source_from_path(path) }
        @aggregates_by_repos ||= {}
        @aggregates_by_repos[repos] ||= Source::Aggregate.new(sources)
      end

      def all
        aggregate.sources
      end
      # ...
    end
  end
end
```

Manager 类的初始化仅需要传入当前 repos 目录，即 `~/.cocoapods/repos`，而 Aggregate 的生成则保存 `repos_dir` 了目录下的 Source，用于后续处理。

先看 Source 的生成，在 `#source_from_path` 中：

```ruby
def source_from_path(path)
  @sources_by_path ||= Hash.new do |hash, key|
    hash[key] = case
                when key.basename.to_s == Pod::TrunkSource::TRUNK_REPO_NAME
                  TrunkSource.new(key)
                when (key + '.url').exist?
                  CDNSource.new(key)
                else
                  Source.new(key)
                end
  end
  @sources_by_path[path]
end
```

以 `repos_dir` 下的目录名称来区分类型，而 CDNSource 则需要确保其目录下存在名为 `.url` 的文件。同时会对生成的 source 进行缓存。

最后看 Aggregate 结构，核心就两个 search 方法：

```ruby
module Pod
  class Source
    class Aggregate
      attr_reader :sources

      def initialize(sources)
        raise "Cannot initialize an aggregate with a nil source: (#{sources})" if sources.include?(nil)
        @sources = sources
      end
      # 查询依赖对应的 specs
      def search(dependency) ... end

      # 查询某个 pod 以发布的 specs
      def search_by_name(query, full_text_search = false) ... end

      # ...
  end
end
```

## Source 源起

本节我们来谈谈 source 是如何添加到 `repo_dir` 目录下的。

由前面的介绍可知，每个 source 中自带 **url**，在 Source 类中 url 读取自 Git 仓库的 `remote.origin.url` 或本地 `.git` 目录，而在 CDNSource 中 url 则是读取自当前目录下的  `.url` 文件所保存的 URL 地址。

那 CDNSource 的  **`.url` 文件是在什么时候被写入的呢 ？**

这需要从 `Podfile` 说起。很多老项目的 `Podfile` 开头部分大都会有一行或多行 source 命令：

```ruby
source 'https://github.com/CocoaPods/Specs.git'
source 'https://github.com/artsy/Specs.git'
```

用于指定项目中 `PodSpec` 的查找源，这些指定源最终会保存在 `~/.cocoapods/repos` 目录下的仓库。

当敲下 `pod install` 命令后，在 `#resolve_dependencies` 阶段的依赖分析中将同时完成 sources 的初始化。

![](https://cdn.nlark.com/yuque/0/2020/jpeg/98641/1603554440199-179380b9-7d18-43cf-a179-70c0945fbbfa.jpeg#align=left&display=inline&height=414&margin=%5Bobject%20Object%5D&originHeight=414&originWidth=896&size=0&status=done&style=none&width=896)

```ruby
# lib/cocoapods/installer/analyzer.rb

def sources
  @sources ||= begin
    # 省略获取 podfile、plugins、dependencies 的 source url ...
    sources = ...

    result = sources.uniq.map do |source_url|
      sources_manager.find_or_create_source_with_url(source_url)
    end
    unless plugin_sources.empty?
      result.insert(0, *plugin_sources)
      plugin_sources.each do |source|
        sources_manager.add_source(source)
      end
    end
    result
  end
end
```

获取 sources url 之后会通过 `sources_manager` 来完成 source 更新，逻辑在 CocoaPods 项目的 Manager 扩展中：

```ruby
# lib/cocoapods/sources_manager.rb

module Pod
  class Source
    class Manager

      def find_or_create_source_with_url(url)
        source_with_url(url) || create_source_with_url(url)
      end

      def create_source_with_url(url)
        name = name_for_url(url)
        is_cdn = cdn_url?(url)
		  # ...
        begin
          if is_cdn
            Command::Repo::AddCDN.parse([name, url]).run
          else
            Command::Repo::Add.parse([name, url]).run
          end
        rescue Informative => e
          raise Informative, # ...
        ensure
          UI.title_level = previous_title_level
        end
        source = source_with_url(url)
        raise "Unable to create a source with URL #{url}" unless source
        source
      end
      # ...
    end
  end
end
```

查找会先调用 `#source_with_url` 进行缓存查询，如未命中则会先下载 Source 仓库，结束后重刷 aggreate 以更新 source。

```ruby
# lib/cocoapods-core/source/manager.rb

def source_with_url(url)
  url = canonic_url(url)
  url = 'https://github.com/cocoapods/specs' if url =~ %r{github.com[:/]+cocoapods/specs}
  all.find do |source|
    source.url && canonic_url(source.url) == url
  end
end

def canonic_url(url)
  url.downcase.gsub(/\.git$/, '').gsub(%r{\/$}, '')
end
```

另外，仓库的下载的则会通过 `#cdn_url?` 方法区分，最后的下载则 📦 在两个命令类中，概括如下：

- **Repo::AddCDN**：即  `pod repo add-cdn` 命令，仅有的操作是将 url 写入 `.url` 文件中。
- **Repo::Add**：即 `pod repo add` 命令，对于普通类型的 Source 仓库下载本质就是 `git clone` 操作。

简化后源的添加流程如下：

![](https://cdn.nlark.com/yuque/0/2020/jpeg/98641/1603554440106-f3bf8e93-1ee1-4b35-9f61-43afad2d62ea.jpeg#align=left&display=inline&height=414&margin=%5Bobject%20Object%5D&originHeight=414&originWidth=896&size=0&status=done&style=none&width=896)

## PodSpec 查询

同样在 `#resolve_dependencies` 的依赖仲裁阶段，当 **Molinillo** 依赖仲裁开始前，会触发缓存查询 `#find_cached_set` 并最终调用到 Aggregate 的 `#search`。完整调用栈放在 [gist](https://gist.github.com/looseyi/492b220ea7e933e972b65876e491886f "gist") 上。

我们来看看 `#search` 入口：

```ruby
# lib/cocoapods-core/source/aggregate.rb

def search(dependency)
  found_sources = sources.select { |s| s.search(dependency) }
  unless found_sources.empty?
    Specification::Set.new(dependency.root_name, found_sources)
  end
end
```

Aggregate 先遍历当前 sources 并进行 dependency 查找。由于 Git 仓库保存了完整的 PodSpecs，只要能在分片目录下查询到对应文件即可，最终结果会塞入 `Specification::Set` 返回。

> Specification::Set 记录了当前 pod 关联的 Source，一个 pod 可能存在与多个不同的 Spec 仓库 中。

### CDN 仓库查询

CDNSource 重写了 `#search` 实现：

```ruby
# lib/cocoapods-core/cdn_source.rb

def search(query)
  unless specs_dir
    raise Informative, "Unable to find a source named: `#{name}`"
  end
  if query.is_a?(Dependency)
    query = query.root_name
  end

  fragment = pod_shard_fragment(query)
  ensure_versions_file_loaded(fragment)
  version_arrays_by_name = @version_arrays_by_fragment_by_name[fragment] || {}

  found = version_arrays_by_name[query].nil? ? nil : query

  if found
    set = set(query)
    set if set.specification_name == query
  end
end
```

逻辑两步走：

1. 通过 `#ensure_versions_file_loaded` 检查 all_pods_versions 文件，如果不存在会进行下载操作。
1. 如果当前 source 包含查询的 pod，会创建 `Specification::Set` 作为查询结果，并在 `#specification_name` 方法内完成 `PodSpec` 的检查和下载。

#### 1. all_pods_versions 文件下载

依据前面提到的分片规则会将 pod 名称 MD5 分割后拼成 URL。

以 `AFNetworking` 为例，经 `#pod_shard_fragment` 分割后获取的 fragment 为 `[a, 7, 5]`，则拼接后的 URL 为 `https://cdn.cocoapods.org/all_pods_versions_a_7_5.txt`，下载后的内容大致如下：

```shell
AFNetworking/0.10.0/0.10.1/.../4.0.1
AppseeAnalytics/2.4.7/2.4.8/2.4.8.0/...
DynamsoftBarcodeReader/7.1.0/...
...
```

所包含的这些 pod 都是分片后得到的相同的地址，因此会保存在同一份 `all_pods_versions` 中。

```ruby
def ensure_versions_file_loaded(fragment)
  return if !@version_arrays_by_fragment_by_name[fragment].nil? && !@check_existing_files_for_update

  index_file_name = index_file_name_for_fragment(fragment)
  download_file(index_file_name)
  versions_raw = local_file(index_file_name, &:to_a).map(&:chomp)
  @version_arrays_by_fragment_by_name[fragment] = versions_raw.reduce({}) do |hash, row|
    row = row.split('/')
    pod = row.shift
    versions = row

    hash[pod] = versions
    hash
  end
end

def index_file_name_for_fragment(fragment)
  fragment_joined = fragment.join('_')
  fragment_joined = '_' + fragment_joined unless fragment.empty?
  "all_pods_versions#{fragment_joined}.txt"
end
```

另外每一份 pods_version 都会对应生成一个文件用于保存 ETag，具体会在下一节会介绍。

#### 2. PodSpec 文件下载

`#specification_name` 将从 `all_pods_versions` 索引文件中找出该 pod 所发布的版本号，依次检查下载对应版本的 `PodSpec.json` 文件。

```ruby
module Pod
  class Specification
    class Set
      attr_reader :name
      attr_reader :sources

      def specification_name
        versions_by_source.each do |source, versions|
          next unless version = versions.first
          return source.specification(name, version).name
        end
        nil
      end

      def versions_by_source
        @versions_by_source ||= sources.each_with_object({}) do |source, result|
          result[source] = source.versions(name)
        end
      end
      # ...
    end
  end
end
```

绕了一圈后回到 Source 的 `#versions` 方法，由于 CDN Source 不会全量下载 pod 的 PodSpec 文件，在 [**#version**](https://www.rubydoc.info/gems/cocoapods-core/Pod/CDNSource#versions-instance_method "**#version**") 的检查过程会进行下载操作。

![](https://cdn.nlark.com/yuque/0/2020/jpeg/98641/1603554440097-d2c42b93-84f0-4655-8070-e53ef66ccf90.jpeg#align=left&display=inline&height=414&margin=%5Bobject%20Object%5D&originHeight=414&originWidth=896&size=0&status=done&style=none&width=896)

### Pod Search 查询命令

CocoaPods 还提供了命令行工具 `cocoapods-search` 用于已发布的 `PodSpec` 查找：

```shell
$ pod search `QUERY`
```

它提供了 Web 查询和本地查询。本地查询则不同于 `#search`，它需要调用 Aggregate 的 `#search_by_name` ，其实现同 `#search` 类似，最终也会走到 Source 的 [#versions](https://www.rubydoc.info/gems/cocoapods-core/Pod/Source/Aggregate#search_by_name-instance_method "#versions") 方法。

![](https://cdn.nlark.com/yuque/0/2020/jpeg/98641/1603554440110-76906470-4ec9-40fb-957b-ccbf157b45e3.jpeg#align=left&display=inline&height=414&margin=%5Bobject%20Object%5D&originHeight=414&originWidth=896&size=0&status=done&style=none&width=896)

> 注意，Gti 仓库的 `#search_by_name` 查询仍旧为文件查找，不会调用其 `#versions` 方法。

## Repo 更新

`pod install` 执行过程如果带上了 `--repo-update` 命令则在 `#resolve_dependencies` 阶段会触发 `#update_repositories` 更新 Spec 仓库：

```ruby
# lib/cocoapods/installer/analyzer.rb

def update_repositories
  sources.each do |source|
    if source.updateable?
      sources_manager.update(source.name, true)
    else
      UI.message "Skipping ..."
    end
  end
  @specs_updated = true
end
```

不过 `#update` 的实现逻辑在 CocoaPods 项目的 Manager 扩展中：

```ruby
# lib/cocoapods/sources_managers.rb

def update(source_name = nil, show_output = false)
  if source_name
    sources = [updateable_source_named(source_name)]
  else
    sources = updateable_sources
  end

  changed_spec_paths = {}

  # Do not perform an update if the repos dir has not been setup yet.
  return unless repos_dir.exist?

  File.open("#{repos_dir}/Spec_Lock", File::CREAT) do |f|
    f.flock(File::LOCK_EX)
    sources.each do |source|
      UI.section "Updating spec repo `#{source.name}`" do
        changed_source_paths = source.update(show_output)
        changed_spec_paths[source] = changed_source_paths if changed_source_paths.count > 0
        source.verify_compatibility!
      end
    end
  end
  update_search_index_if_needed_in_background(changed_spec_paths)
end
```

1. 获取指定名称的 source，对 aggregate 返回的全部 sources 进行 filter，如未指定则 sources 全量。
1. 挨个调用 `source.update(show_output)`，注意 Git 和 CDN 仓库的更新方式的不同。

### Git 仓库更新

Git 仓库更新本质就是 Git 操作，即 `git pull`、`git checkout` 命令：

```ruby
def update(show_output)
  return [] if unchanged_github_repo?
  prev_commit_hash = git_commit_hash
  update_git_repo(show_output)
  @versions_by_name.clear
  refresh_metadata
  if version = metadata.last_compatible_version(Version.new(CORE_VERSION))
    tag = "v#{version}"
    CoreUI.warn "Using the ..."
    repo_git(['checkout', tag])
  end
  diff_until_commit_hash(prev_commit_hash)
end
```

`#update_git_repo` 就是 `git fetch` + `git reset --hard [HEAD]` 的结合体，更新后会进行 cocoapods 版本兼容检查，最终输出 diff 信息。

### CDN 仓库更新

Git 仓库是可以通过 Commit 信息来进行增量更新，那以静态资源方式缓存的 CDN 仓库是如何更新数据的呢 ？

像浏览器或本地缓存**本质是利用 ETag 来进行 Cache-Control**，关于 CDN 缓存可以看这篇：[传送门](https://zhuanlan.zhihu.com/p/65722520 "传送门")。

而 ETag 就是一串字符，内容通常是数据的哈希值，由服务器返回。首次请求后会在本地缓存起来，并在后续的请求中携带上 ETag 来确定缓存是否需要更新。如果 ETag 值相同，说明资源未更改，服务器会返回 304（Not Modified）响应码。

Core 的实现也是如此，它会将各请求所对应的 ETag 以文件形式存储：

![](https://cdn.nlark.com/yuque/0/2020/jpeg/98641/1603554440155-6a0b4fd1-944d-4462-b7ec-f0165a2ff986.jpeg#align=left&display=inline&height=477&margin=%5Bobject%20Object%5D&originHeight=477&originWidth=1229&size=0&status=done&style=none&width=1229)

⚠️ **注意，在这个阶段 CDNSource 仅仅是更新当前目录下的索引文件**，即 `all_pods_versions_x_x_x.txt`。

```ruby
def update(_show_output)
  @check_existing_files_for_update = true
  begin
    preheat_existing_files
  ensure
    @check_existing_files_for_update = false
  end
  []
end

def preheat_existing_files
  files_to_update = files_definitely_to_update + deprecated_local_podspecs - ['deprecated_podspecs.txt']

  concurrent_requests_catching_errors do
    loaders = files_to_update.map do |file|
      download_file_async(file)
    end
    Promises.zip_futures_on(HYDRA_EXECUTOR, *loaders).wait!
  end
end
```

### Pod Repo 更新命令

CocoaPods 对于 sources 仓库的更新也提供了命令行工具：

```shell
$ pod repo update `[NAME]`
```

其实现如下：

```ruby
# lib/cocoapods/command/repo/update.rb

module Pod
  class Command
    class Repo < Command
      class Update < Repo
        def run
          show_output = !config.silent?
          config.sources_manager.update(@name, show_output)
          exclude_repos_dir_from_backup
        end
        # ...
      end
    end
  end
end
```

在命令初始化时会保存指定的 Source 仓库名称 `@name`，接着通过 Mixin 的 `config` 来获取 `sources_manager` 触发更新。

最后用一张图来收尾 CocoaPods Workflow：

![](https://cdn.nlark.com/yuque/0/2020/jpeg/98641/1603554440228-d9d53de0-5268-413a-b71a-5acfa2bf145f.jpeg#align=left&display=inline&height=414&margin=%5Bobject%20Object%5D&originHeight=414&originWidth=896&size=0&status=done&style=none&width=896)

# 总结

最后一篇 Core 的分析文章，重点介绍了它是如何管理 `PodSpec` 仓库以及 `PodSpec` 文件的更新和查找，总结如下：

1. 了解 Source Manager 的各种数据结构以及它们之间的相互关系，各个类之间居然都做到了权责分明。
1. 通过对 Metadata 的分析了解了 Source 仓库的演变过程，并剖析了存在的问题。
1. 掌握了如何利用 CDN 来改造原有的 Git 仓库，优化 PodSpec 下载速度。
1. 发现原来 CLI 工具不仅仅可以提供给用户使用，内部调用也不是不可以。

# 知识点问题梳理

这里罗列了五个问题用来考察你是否已经掌握了这篇文章，如果没有建议你加入**收藏**再次阅读：

1. `PodSpecs` 的聚合类有哪些，可以通过哪些手段来区分他们的类型 ？
1. 说说你对 `Aggregate` 类的理解，以及它的主要作用 ？
1. `Source` 类是如何更新 `PodSpec` ？
1. Core 是如何对仓库进行分片的，它的分片方式是否支持配置 ？
1. CDN 仓库是如何来更新 `PodSpec` 文件 ？
