---
title: "版本管理工具及 Ruby 工具链环境"
tags: 
    - "CocoaPods 历险记"
    - "Ruby"
comments: true
show_label: "联合创作"
---


# 背景


`CocoaPods` 作为业界标准，各位 iOS 开发同学应该都不陌生。不过很多同学对 `CocoaPods` 的使用基本停留在 `pod install` 和 `pod update` 上。一旦项目组件化，各业务线逻辑拆分到独立的 `Pod` 中后，光了解几个简单 `Pod` 命令是无法满足需求的，同时还面临开发环境的一致性，`Pod` 命令执行中的各种异常错误，都要求我们对其有更深层的认知和 🤔。


关于 `CocoaPods` 深入的文章有很多，推荐 ObjC China 的这篇，[深入理解 CocoaPods](https://objccn.io/issue-6-4/)，而本文希望从依赖管理工具的角度来谈谈 `CocoaPods` 的管理理念。


# Version Control System (VCS)

> Version control systems are a category of software tools that help a software team manage changes to source code over time. Version control software keeps track of every modification to the code in a special kind of database.



软件工程中，版本控制系统是敏捷开发的重要一环，为后续的持续集成提供了保障。`Source Code Manager` (SCM) 源码管理就属于 VCS 的范围之中，熟知的工具有如 `Git` 。而 `CocoaPods` 这种针对各种语言所提供的 `Package Manger (PM) `也可以看作是 SCM 的一种。


而像 `Git` 或 `SVN` 是针对项目的单个文件的进行版本控制，而 PM 则是以每个独立的 Package 作为最小的管理单元。包管理工具都是结合 `SCM` 来完成管理工作，对于被 PM 接管的依赖库的文件，通常会在 `Git` 的 `.ignore` 文件中选择忽略它们。


例如：在 `Node` 项目中一般会把 `node_modules` 目录下的文件 ignore 掉，在 iOS/macOS 项目则是 `Pods`。


## Git Submodule

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1591500594410-f99fd015-3566-49c7-a11f-09f49b1ef142.png)

> Git submodules allow you to keep a git repository as a subdirectory of another git repository. Git submodules are simply a reference to another repository at a particular snapshot in time. Git submodules enable a Git repository to incorporate and track version history of external code.



`Git Submodules` 可以算是 PM 的“青春版”，它将单独的 Git 仓库以子目录的形式嵌入在工作目录中。它不具备 PM 工具所特有的[语义化版本](https://semver.org/)管理、无法处理依赖共享与冲突等。只能保存每个依赖仓库的文件状态。


`Git` 在提交更新时，会对所有文件制作一个快照并将其存在数据库中。Git 管理的文件存在 3 种状态：


- **working director：** 工作目录，即我们肉眼可见的文件
- **stage area：** 暂存区 (或称 `index area` )，存在 `.git/index` 目录下，保存的是执行 `git add` 相关命令后从工作目录添加的文件。
- **commit history：** 提交历史，存在 `.git/` 目录下，到这个状态的文件改动算是入库成功，基本不会丢失了。

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1591356928689-4afddee3-9ca8-4392-8ccc-00ac114e4fe9.jpeg)

Git submodule 是依赖 `.gitmodules` 文件来记录子模块的。


```ruby
[submodule "ReactNative"]
	path = ReactNative
	url = https://github.com/facebook/ReactNative.git
```


`.gitmodules` 仅记录了 path 和 url 以及模块名称的基本信息， 但是我们还需要记录每个 Submodule Repo 的 commit 信息，而这 commit 信息是记录在 `.git/modules` 目录下。同时被添加到 `.gitmodules` 中的 path 也会被 git 直接 ignore 掉。


## Package Manger


作为 Git Submodule 的强化版，PM 基本都具备了语义化的版本检查能力，依赖递归查找，依赖冲突解决，以及针对具体依赖的构建能力和二进制包等。简单对比如下：



| **Key File** | **Git submodule** | **CocoaPods** | **SPM** | **npm** |
| --- | --- | --- | --- | --- |
| **描述文件** | .gitmodules | Podfile | Package.swift | Package.json |
| **锁存文件** | .git/modules | Podfile.lock | Package.resolved | package-lock.json |



从 👆 可见，PM 工具基本围绕这个两个文件来现实包管理：


- **描述文件**：声明了项目中存在哪些依赖，版本限制；
- **锁存文件（Lock 文件）**：记录了依赖包最后一次更新时的全版本列表。



除了这两个文件之外，中心化的 PM 一般会提供依赖包的托管服务，比如 npm 提供的 [npmjs.com](https://www.npmjs.com/) 可以集中查找和下载 npm 包。如果是去中心化的 PM 比如 `iOS` 的 `Carthage` 和 `SPM` 就只能通过 Git 仓库的地址了。


## CocoaPods

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1591610249202-498640a5-1265-4cbd-ad45-a23644b393e8.png)

`CocoaPods` 是开发 iOS/macOS 应用程序的一个第三方库的依赖管理工具。 利用 `CocoaPods`，可以定义自己的依赖关系（简称 `Pods`），以及在整个开发环境中对第三方库的版本管理非常方便。


下面我们以 `CocoaPods` 为例。

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1591356928500-57c852dd-59f0-4983-8665-e2bd5d3eab88.jpeg)

### `Podfile`

`Podfile` 是一个文件，以 DSL（其实直接用了 Ruby 的语法）来描述依赖关系，用于定义项目所需要使用的第三方库。该文件支持高度定制，你可以根据个人喜好对其做出定制。更多相关信息，请查阅 [Podfile 指南](http://guides.cocoapods.org/syntax/podfile.html)。


### `Podfile.lock`

这是 `CocoaPods` 创建的最重要的文件之一。它记录了需要被安装的 Pod 的每个已安装的版本。如果你想知道已安装的 `Pod` 是哪个版本，可以查看这个文件。推荐将 `Podfile.lock` 文件加入到版本控制中，这有助于整个团队的一致性。


### `Manifest.lock`

这是每次运行 `pod install` 命令时创建的 `Podfile.lock` 文件的副本。如果你遇见过这样的错误 **沙盒文件与 `Podfile.lock` 文件不同步 (The sandbox is not in sync with the `Podfile.lock`)**，这是因为 `Manifest.lock` 文件和 `Podfile.lock` 文件不一致所引起。由于 `Pods` 所在的目录并不总在版本控制之下，这样可以保证开发者运行 App 之前都能更新他们的 `Pods`，否则 App 可能会 crash，或者在一些不太明显的地方编译失败。


### Master Specs Repo

> Ultimately, the goal is to improve discoverability of, and engagement in, third party open-source libraries, by creating a more centralized ecosystem.



作为包管理工具，`CocoaPods` 的目标是为我们提供一个更加集中的生态系统，来提高依赖库的可发现性和参与度。本质上是为了提供更好的检索和查询功能，可惜成为了它的问题之一。因为 `CocoaPods` 通过官方的 Spec 仓库来管理这些注册的依赖库。随着不断新增的依赖库导致 Spec 的更新和维护成为了使用者的包袱。


好在这个问题在 1.7.2 版本中已经解决了，`CocoaPods` 提供了 [Mater Repo CDN](http://blog.cocoapods.org/CocoaPods-1.7.2/) ，可以直接 CDN 到对应的 Pod 地址而无需在通过本地的 Spec 仓库了。同时在 1.8 版本中，官方默认的 Spec 仓库已替换为 CDN，其地址为  [https://cdn.cocoapods.org](https://cdn.cocoapods.org)。


![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1591356928577-dbe39320-0571-46f1-af74-9215de67e9e8.jpeg)


# Ruby 生态及工具链


对于一部分仅接触过 `CocoaPods` 的同学，其 PM 可能并不熟悉。其实 `CocoaPods` 的思想借鉴了其他语言的 PM 工具，例：[`RubyGems`](https://rubygems.org/), [`Bundler`](https://bundler.io/), [`npm`](https://www.npmjs.com/) 和 [`Gradle`](https://gradle.org/)。


我们知道 `CocoaPods` 是通过 Ruby 语言实现的。它本身就是一个 `Gem` 包。理解了 Ruby 的依赖管理有助于我们更好的管理不同版本的 `CocoaPods` 和其他 `Gem`。同时能够保证团队中的所有同事的工具是在同一个版本，这也算是敏捷开发的保证吧。


## `RVM` & `rbenv`

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1591692379182-19a05f9c-2e20-4f53-9e73-eda10d2969ae.png)

**[`RVM`](https://rvm.io/)** 和 **[`rbenv`](https://github.com/rbenv/rbenv)** 都是管理多个 Ruby 环境的工具，它们都能提供不同版本的 Ruby 环境管理和切换。


个人目前使用 `rbenv`，至于 [Why rbenv](https://github.com/rbenv/rbenv/wiki/Why-rbenv%3F) 感兴趣的同学可以看看，最终还是看个人。

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1591356928575-cdb4c8e7-c5ea-4654-8b2c-89751b9dab21.jpeg)

## RubyGems

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1591610289342-050f57ac-98c2-4cba-b766-a914977ce7c6.png)


> The RubyGems software allows you to easily download, install, and use ruby software packages on your system. The software package is called a “gem” which contains a packaged Ruby application or library.


[RubyGems](https://rubygems.org/) 是 Ruby 的一个包管理工具，这里面管理着用 Ruby 编写的工具或依赖我们称之为 Gem。


并且 RubyGems 还提供了 Ruby 组件的托管服务，可以集中式的查找和安装 library 和 apps。当我们使用 `gem install xxx` 时，会通过 `rubygems.org` 来查询对应的 Gem Package。而 iOS 日常中的很多工具都是 Gem 提供的，例：`Bundler`，`fastlane`，`jazzy`，`CocoaPods` 等。


在默认情况下 Gems 总是下载 library 的最新版本，这无法确保所安装的 library 版本符合我们预期。因此我们还缺一个工具。

## Bundler

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1591610297193-96c92d15-aa48-4136-abf3-fd8dcb5f2835.png)


[Bundler](https://bundler.io/) 是管理 Gem 依赖的工具，可以隔离不同项目中 Gem 的版本和依赖环境的差异，也是一个 Gem。


Bundler 通过读取项目中的依赖描述文件 `Gemfile` ，来确定各个 Gems 的版本号或者范围，来提供了稳定的应用环境。当我们使用 `bundle install` 它会生成 `Gemfile.lock` 将当前 librarys 使用的具体版本号写入其中。之后，他人再通过 `bundle install` 来安装 libaray 时则会读取 `Gemfile.lock` 中的 librarys、版本信息等。


### `Gemfile`

**可以说 `CocoaPods**` 其实是 iOS 版的 RubyGems + Bundler 组合。Bundler 依据项目中的 `Gemfile` 文件来管理 Gem，而 `CocoaPods` 通过 Podfile 来管理 Pod。**

[Gemfile](https://bundler.io/v2.0/gemfile.html) 配置如下：


```ruby
source 'https://gems.example.com' do
  gem 'cocoapods', '1.8.4'
  gem 'another_gem', :git => 'https://looseyi.github.io.git', :branch => 'master'
end
```


可见，Podfile 的 DSL 写法和 Gemfile 如出一辙。那什么情况会用到 Gemfile 呢 ？


`CocoaPods` 每年都会有一些重大版本的升级，前面聊到过 `CocoaPods` 在 `install` 过程中会对项目的 `.xcodeproj` 文件进行修改，不同版本其有所不同，这些在变更都可能导致大量 `conflicts`，处理不好，项目就不能正常运行了。我想你一定不愿意去修改 `.xcodeproj` 的冲突。


如果项目是基于 `fastlane` 来进行持续集成的相关工作以及 App 的打包工作等，也需要其版本管理等功能。


# 如何安装一套可管控的 Ruby 工具链？


讲完了这些工具的分工，然后来说说实际的运用。我们可以使用 `homebrew` + `rbenv` + `RubyGems` + `Bundler` 这一整套工具链来控制一个工程中 Ruby 工具的版本依赖。

以下是我认为比较可控的 Ruby 工具链分层管理图。下面我们逐一讲述每一层的管理方式，以及实际的操作方法。

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1591692591825-5e8b38bb-cf2d-4435-b9b1-704b02df1202.png)

## 1. 使用 `homebrew` 安装 `rbenv`

```shell
$ brew install rbenv
```

安装成功后输入 `rbenv` 就可以看到相关提示：

```shell
$ rbenv

rbenv 1.1.2
Usage: rbenv <command> [<args>]

Some useful rbenv commands are:
   commands    List all available rbenv commands
   local       Set or show the local application-specific Ruby version
   global      Set or show the global Ruby version
   shell       Set or show the shell-specific Ruby version
   install     Install a Ruby version using ruby-build
   uninstall   Uninstall a specific Ruby version
   rehash      Rehash rbenv shims (run this after installing executables)
   version     Show the current Ruby version and its origin
   versions    List installed Ruby versions
   which       Display the full path to an executable
   whence      List all Ruby versions that contain the given executable

See `rbenv help <command>' for information on a specific command.
For full documentation, see: https://github.com/rbenv/rbenv#readme
```

## 2. 使用 `rbenv` 管理 Ruby 版本


使用 `rbenv` 来安装一个 Ruby 版本，这里我使用刚刚  release Ruby 2.7：

```shell
$ rbenv install 2.7.0
```

这个安装过程有些长，因为要下载 `openssl` 和 Ruby 的解释器，大概要 20 分钟左右。


安装成功后，我们让其在本地环境中生效：

```shell
$ rbenv shell 2.7.0
```

> 输入上述命令后，可能会有报错。 `rbenv` 提示我们在 `.zshrc` 中增加一行 `eval "$(rbenv init -)"` 语句来对 `rbenv` 环境进行初始化。如果报错，我们增加并重启终端即可。

```shell
$ ruby --version
ruby 2.7.0p0 (2019-12-25 revision 647ee6f091) [x86_64-darwin19]
$ which ruby
/Users/gua/.rbenv/shims/ruby
```

切换之后我们发现 Ruby 已经切换到 `rbenv` 的管理版本，并且其启动 `PATH` 也已经变成 `rbenv` 管理下的 Ruby。并且我们可以看一下 Ruby 捆绑的 `Gem` 的 `PATH` ：

```shell
$ which gem
/Users/bytedance/.rbenv/shims/gem
```

对应的 `Gem` 也已经变成 `rbenv` 中的 `PATH` 。

## 3. 查询系统级 `Gem` 依赖


如此，我们使用 `rbenv` 已经对 Ruby 及其 `Gem` 环境在版本上进行了环境隔离。我们可以通过 `gem list` 命令来查询当前系统环境下所有的 `Gem` 依赖：

```shell
$ gem list

*** LOCAL GEMS ***

activesupport (4.2.11.3)
...
claide (1.0.3)
cocoapods (1.9.3)
cocoapods-core (1.9.3)
cocoapods-deintegrate (1.0.4)
cocoapods-downloader (1.3.0)
cocoapods-plugins (1.0.0)
cocoapods-search (1.0.0)
cocoapods-stats (1.1.0)
cocoapods-trunk (1.5.0)
cocoapods-try (1.2.0)
```

记住这里的 `CocoaPods` 版本，我们后面项目中还会查询。


如此我们已经完成了全部的 Ruby、Gem 环境的配置，我们通过一张漏斗图再来梳理一下：


![image.png]()


# 如何使用 Bundler 管理工程中的 Gem 环境

下面我们来实践一下，如何使用 `Bundler` 来锁定项目中的 `Gem` 环境，从而让整个团队统一 `Gem` 环境中的所有 Ruby 工具版本。从而避免文件冲突和不必要的错误。


下面是在工程中对于 `Gem` 环境的层级图，我们可以在项目中增加一个 `Gemfile` 描述，从而锁定当前项目中的 `Gem` 依赖环境。

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1591770762979-60f1adee-7b73-4ca8-b6a1-dbc917ae024e.png)

以下也会逐一讲述每一层的管理方式，以及实际的操作方法。

## 1. 在 iOS 工程中初始化 `Bundler` 环境

首先我们有一个 iOS Demo 工程 - `GuaDemo` ：
```shell
$ ls -al
total 0
drwxr-xr-x   4 gua  staff   128 Jun 10 14:47 .
drwxr-xr-x@ 52 gua  staff  1664 Jun 10 14:47 ..
drwxr-xr-x   8 gua  staff   256 Jun 10 14:47 GuaDemo
drwxr-xr-x@  5 gua  staff   160 Jun 10 14:47 GuaDemo.xcodeproj
```

首先先来初始化一个 `Bundler`  环境（其实就是自动创建一个 `Gemfile` 文件）：

```shell
$ bundle init

Writing new Gemfile to /Users/Gua/GuaDemo/Gemfile
```

## 2. 在 `Gemfile` 中声明使用的 `CocoaPods` 版本并安装


之后我们编辑一下这个 `Gemfile` 文件，加入我们当前环境中需要使用 `CocoaPods 1.5.3` 这个版本，则使用 `Gemfile` 的 DSL 编写以下内容：

```ruby
# frozen_string_literal: true

source "https://rubygems.org"

git_source(:github) {|repo_name| "https://github.com/#{repo_name}" }

# gem "rails"
gem "cocoapods", "1.5.3"

```

编写之后执行一下 `bundle install` ：

```ruby
$ bundle install
Fetching gem metadata from https://gems.ruby-china.com/............
Resolving dependencies...
...
Fetching cocoapods 1.5.3
Installing cocoapods 1.5.3
Bundle complete! 1 Gemfile dependency, 30 gems now installed.
```

发现 `CocoaPods 1.5.3` 这个指定版本已经安装成功，并且还保存了一份 `Gemfile.lock` 文件用来锁存这次的依赖结果。

## 3. 使用当前环境下的 `CocoaPods` 版本操作 iOS 工程

此时我们可以检查一下当前 `Bundler` 环境下的 `Gem` 列表：

```ruby
$ bundle exec gem list

*** LOCAL GEMS ***

activesupport (4.2.11.3)
atomos (0.1.3)
bundler (2.1.4)
CFPropertyList (3.0.2)
claide (1.0.3)
cocoapods (1.5.3)
...
```
发现相比于全局 `Gem` 列表，这个列表精简了许多，并且也只是基础 `Gem` 依赖和 `CocoaPods` 的 `Gem` 依赖。此时我们使用 `bundle exec pod install` 来执行 Install 这个操作，就可以使用 `CocoaPods 1.5.3` 版本来执行 `Pod` 操作了（当然，前提是你还需要写一个 `Podfile` ，大家都是 iOSer 这里就略过了）。

```ruby
$ bundle exec pod install
Analyzing dependencies
Downloading dependencies
Installing SnapKit (5.0.1)
Integrating client project
[!] Please close any current Xcode sessions and use `GuaDemo.xcworkspace` for this project from now on.
Sending stats
Pod installation complete! There is 1 dependency from the Podfile and 1 total pod installed.
```
可以再来看一下 `Podfile.lock` 文件：
```ruby
cat Podfile.lock
PODS:
  - SnapKit (5.0.1)

DEPENDENCIES:
  - SnapKit (~> 5.0.0)

SPEC REPOS:
  https://github.com/cocoapods/specs.git:
    - SnapKit

SPEC CHECKSUMS:
  SnapKit: 97b92857e3df3a0c71833cce143274bf6ef8e5eb

PODFILE CHECKSUM: 1a4b05aaf43554bc31c90f8dac5c2dc0490203e8

COCOAPODS: 1.5.3
```

发现使用的 `CocoaPods` 的版本确实是 `1.5.3` 。而当我们不使用 `bundle exec` 执行前缀，则会使用系统环境中的 `CocoaPods` 版本。如此我们也就验证了工程中的 `Gem` 环境和系统中的环境可以通过 `Bundler` 进行隔离。

# 总结

- 通过版本管理工具演进的角度可以看出，CocoaPods 的诞生并非一蹴而就，也是不断地借鉴其他管理工具的优点，一点点的发展起来的。VCS 工具从早期的 `SVN`、`Git`，再细分出 `Git Submodule`，再到各个语言的 `Package Manager` 也是一直在发展的。
- 虽然 `CocoaPods` 作为包管理工具控制着 iOS 项目的各种依赖库，但其自身同样遵循着严格的版本控制并不断迭代。希望大家可以从本文中认识到版本管理的重要性。
- 通过实操 `Bundler` 管理工程的全流程，学习了 `Bundler` 基础，并学习了如何控制一个项目中的 `Gem` 版本信息。


后续我们将会围绕 `CocoaPods` ，从工具链逐渐深入到细节，根据我们的使用经验，逐一讲解。


# 知识点问题梳理


1. `PM` 是如何进行依赖库的版本管理？
1. `Ruby` 和 `RVM/rbenv` 之间的关系是什么？
1. `Gem`、`Bundler` 和 `CocaPods` 之间的关系是什么？
1. 如何通过 `Bundler` 来管理工程中的 `Gem` 环境？如何锁死工程内部的 `CocoaPods` 版本？
