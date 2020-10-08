---
title: "Podfile 的解析逻辑"
tags: 
    - "CocoaPods 历险记"
    - "Ruby"
comments: true
show_label: "联合创作"
---

# 引子

<br />在上文 [CocoaPods 命令解析](/2020/09/02/cocoapods-story-3.html) 中，我们通过对 **CLAide** 的源码分析，了解了 CocoaPods 是如何处理 `pod` 命令，多级命令又是如何组织和嵌套的，并解释了命令行输出所代表的含义。今天我们开始学习 `Podfile` 。<br />
<br />大多 iOS 工程师最先接触到的 CocoaPods 概念应该是 `Podfile`，而 `Podfile` 属于 `cocoapods-core`（以下简称 **Core**） 的两大概念之一。另外一个则是 [`Podspec`](https://guides.cocoapods.org/syntax/podspec.html) (用于描述 Pod Library 的配置文件)，只有当你需要开发 Pod 组件的时候才会接触。<br />
<br />在介绍 Podfile 的内容结构之前，必须要谈谈 Xcode 的工程结构。
<a name="7ae87fa4"></a>
# Xcode 工程结构

<br />我们先来看一个极简 Podfile 声明：<br />

```ruby
target 'Demo' do
	pod 'Alamofire', :path => './Alamofire'
end
```

<br />它编译后的工程目录如下：<br />

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1599993134156-fe45b615-5b0f-4e71-bd5c-a03cd6b55217.jpeg)

<br />如你所见 Podfile 的配置是围绕 Xcode 的这些工程结构：**Workspace、Project、Target 及 Build Setting **来展开的。<br />作为包管理工具 CocoaPods 将所管理的 Pods 依赖库组装成一个个 Target，统一放入 `Pods project` 中的 `Demo target`，并自动配置好 Target 间的依赖关系。<br />
<br />之后将 `Example` 主工程和 `Pods` 工程一起打包到新建的 `Example.workspace`，配好主工程与 `Pods` 工程之间的依赖，完成最终转换。<br />
<br />接下来，我们来聊一聊这些 Xcode 结构：<br />

<a name="9f0655f1"></a>
## Target - 最小可编译单元


> A [target](https://developer.apple.com/library/archive/featuredarticles/XcodeConcepts/Concept-Targets.html#//apple_ref/doc/uid/TP40009328-CH4-SW1) specifies a product to build and contains the instructions for building the product from a set of files in a project or workspace.


<br />**首先是 Target，它作为工程中最小的可编译单元，根据 **[**Build Phases**](https://www.objc.io/issues/6-build-tools/build-process/#controlling-the-build-process)** 和 **[**Build Settings**](https://developer.apple.com/library/archive/featuredarticles/XcodeConcepts/Concept-Build_Settings.html#//apple_ref/doc/uid/TP40009328-CH6-SW1)** 将源码作为输入，经编译后输出结果产物**。<br />其输出结果可以是链接库、可执行文件或者资源包等，具体细节如下：<br />

- Build Setting：比如指定使用的编译器，目标平台、编译参数、头文件搜索路径等；
- Build 时的前置依赖、执行的脚本文件；
- Build 生成目标的签名、Capabilities 等属性；
- Input：哪些源码或者资源文件会被编译打包；
- Output：哪些静态库、动态库会被链接；



<a name="8fc0f046"></a>
## Project - Targets 的载体


> An [Xcode project](https://developer.apple.com/library/archive/featuredarticles/XcodeConcepts/Concept-Projects.html#//apple_ref/doc/uid/TP40009328-CH5-SW1) is a repository for all the files, resources, and information required to build one or more software products.


<br />**Project 就是一个独立的 Xcode 工程，作为一个或多个 Targets 的资源管理器，本身无法被编译。**<br />Project 所管理的资源都来自它所包含的 Targets。特点如下：<br />

- 至少包含一个或多个可编译的 Target；
- 为所包含的 Targets 定义了一份默认编译选项，如果 Target 有自己的配置，则会覆盖 Project 的预设值；
- 能将其他 Project 作为依赖嵌入其中；


<br />下图为 Project 与所包含对 Targets 的关系<br />

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1600222941789-99a85a65-f93f-48ce-92c2-53b85c576bfd.jpeg)

<a name="be439828"></a>
## Workspace - 容器


> A [workspace](https://developer.apple.com/library/archive/featuredarticles/XcodeConcepts/Concept-Workspace.html) is an Xcode document that groups projects


<br />**作为纯粹的项目容器，Workspace 不参与任何编译链接过程，仅用于管理同层级的 Project**，其特点：<br />

- **Workspace 可以包含多个 Projects**；
- 同一个 Workspace 中的 Proejct 文件对于其他 Project 是默认可见的，**这些 Projcts 会共享 `workspace build directory`** ；
- 一个 Xcode Project 可以被包含在多个不同的 Workspace 中，因为每个 Project 都有独立的 Identity，默认是 Project Name；

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1599993134181-70da3da0-70d6-46ff-b9ad-358e77f64466.jpeg)

<a name="db334362"></a>
## Scheme - 描述 Build 过程


> An [Xcode scheme](https://developer.apple.com/library/archive/featuredarticles/XcodeConcepts/Concept-Schemes.html) defines a collection of targets to build, a configuration to use when building, and a collection of tests to execute.


<br />**Scheme 是对于整个 Build 过程的一个抽象**，它描述了 Xcode 应该使用哪种 [Build Configurations](https://medium.com/practical-ios-development/some-practical-uses-for-xcode-build-schemes-and-build-configurations-swift-e50d15a1304f) 、执行什么任务、环境参数等来构建我们所需的 Target。<br />
<br />Scheme 中预设了六个主要过程： **Build、Run、Test、Profile、Analyze、Archive**。包括了我们对 Target 的所有操作，每一个过程都可以单独配置。<br />

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1600222941772-4998de2f-7375-4019-b665-77d5e7692c79.jpeg)

<a name="CocoaPods-Core"></a>
# CocoaPods-Core


> The [CocoaPods-Core](https://link.zhihu.com/?target=https%3A//github.com/CocoaPods/Core) gem provides support to work with the models of CocoaPods, for example the Podspecs or the Podfile.


<br />CocoaPods-Core 用于 CocoaPods 中配置文件的解析，包括 `Podfile`、`Podspec` 以及解析后的依赖锁存文件，如 Podfile.lock 等。<br />

<a name="49aa38a1"></a>
## CocoaPods-Core 的文件构成

<br />照例，我们先通过入口文件 `lib/cocoapods-core.rb` 来一窥 Core 项目的主要文件：<br />

```ruby
module Pod
  require 'cocoapods-core/gem_version'

  class PlainInformative < StandardError; end
  class Informative < PlainInformative; end

  require 'pathname'
  require 'cocoapods-core/vendor'
   
  # 用于存储 PodSpec 中的版本号
  autoload :Version,        'cocoapods-core/version'
  # pod 的版本限制
  autoload :Requirement,    'cocoapods-core/requirement'
  # 配置 Podfile 或 PodSpec 中的 pod 依赖
  autoload :Dependency,     'cocoapods-core/dependency'
  # 获取 Github 仓库信息
  autoload :GitHub,         'cocoapods-core/github'
  # 处理 HTTP 请求
  autoload :HTTP,           'cocoapods-core/http'
  # 记录最终 pod 的依赖信息
  autoload :Lockfile,       'cocoapods-core/lockfile'
  # 记录 SDK 的名称和 target 版本
  autoload :Platform,       'cocoapods-core/platform'
  # 对应 Podfile 文件的 class
  autoload :Podfile,        'cocoapods-core/podfile'
  # 管理 PodSpec 的集合
  autoload :Source,         'cocoapods-core/source'
  # 管理基于 CDN 来源的 PodSpec 集合
  autoload :CDNSource,      'cocoapods-core/cdn_source'
  # 管理基于 Trunk 来源的 PodSpec 集合
  autoload :TrunkSource,    'cocoapods-core/trunk_source'
  # 对应 PodSpec 文件的 class
  autoload :Specification,  'cocoapods-core/specification'
  # 将 pod 信息转为 .yml 文件，用于 lockfile 的序列化
  autoload :YAMLHelper,     'cocoapods-core/yaml_helper'
  # 记录 pod 依赖类型，是静态库/动态库
  autoload :BuildType,      'cocoapods-core/build_type'
  
  ...

  Spec = Specification
end
```

<br />将这些 Model 类按照对应的依赖关系进行划分，层级如下：<br />

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1599993134206-3a7f8fdb-611d-44c1-a2c4-026365408d5e.jpeg)

<a name="7b11f844"></a>
## Podfile 的主要数据结构

<br />先来了解 Podfile 的主要数据结构<br />

<a name="Specification"></a>
### Specification


> The Specification provides a DSL to describe a Pod. A pod is defined as a library originating from a source. A specification can support detailed attributes for modules of code  through subspecs.


<br />Specification 即存储 `PodSpec` 的内容，是用于**描述一个 Pod 库的源代码和资源将如何被打包编译成链接库或 framework**，后续将会介绍更多的细节。<br />

<a name="TargetDefinition"></a>
### TargetDefinition


> The TargetDefinition stores the information of a CocoaPods static library. The target definition can be linked with one or more targets of the user project.


<br />`TargetDefinition` 是一个多叉树结构，每个节点记录着 `Podfile` 中定义的 Pod 的 Source 来源、Build Setting、Pod 子依赖等。该树的根节点指向 `Podfile`，而 `Podfile` 中的 `root_target_definitions` 则记录着所有的 `TargetDefinition` 的根节点，正常情况下该 list 中只有一个 root 即 `**Pods.project**`。<br />
<br />为了便于阅读，简化了大量的 DSL 配置相关的方法和属性并对代码顺序做了调整，大致结构如下：<br />

```ruby
module Pod
  class Podfile
    class TargetDefinition
		# 父节点: TargetDefinition 或者 Podfile
      attr_reader :parent
      # 子节点: TargetDefinition
      attr_reader :children
      # 记录 tareget 的配置信息
      attr_accessor :internal_hash

      def root?
        parent.is_a?(Podfile) || parent.nil?
      end

      def root
        if root?
          self
        else
          parent.root
        end
      end

      def podfile
        root.parent
      end
       
      # ...
  end
end
```

<br />对应上一节 Xcode 工程结构中的 `Podfile` 关系如下：<br />

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1599993134189-fdfc2639-938d-47c7-ad69-1a8141502f8f.jpeg)

<br />CocoaPods 正是巧妙利用了 Xcode 工程结构的特点，引入  `Pods.project` 这一中间层，将主工程的 Pods 依赖全部转接到 `Pods.project` 上，最后再将 `Pods.project` 作为主项目的依赖。尽管这么做也受到了一些质疑和诟病（所谓的侵入性太强），但笔者的观点是，正得益于 `Pods.project` 这一设计隔绝了第三方依赖库对于主项目的频繁更改，也便于后续的管理和更新，体现了软件工程中的**开放-关闭原则**。<br />
<br />比如，在 Pod 1.7.0 版本中支持的 **[Multiple Xcodeproj Generation](http://blog.cocoapods.org/CocoaPods-1.7.0-beta/)** 就是解决随着项目的迭代而日益增大的 `Pods` project 的问题。试想当你的项目中存在上百个依赖库，每个依赖库的变更都会影响到你的主工程，这将是非常可怕的问题。<br />

<a name="Podfile"></a>
### Podfile


> The Podfile is a specification that describes the dependencies of the targets of one or more Xcode projects.


<br />`Podfile` 是用于描述一个或多个 Xcode Project 中各个 Targets 之间的依赖关系。<br />
<br />这些 Targets 的依赖关系对应的就是 `TargetDefinition` 树中的各子节点的层级关系。如前面所说，**有了 `Podfile` 这个根节点的指向，仅需对依赖树进行遍历，就能轻松获取完整的依赖关系**。<br />
<br />有了这层依赖树，对于某个 `Pod` 库的更新即是对树节点的更新，便可轻松的分析出此次更新涉及的影响。<br />
<br />简化调整后的 Podfile 代码如下：<br />

```ruby
require 'cocoapods-core/podfile/dsl'
require 'cocoapods-core/podfile/target_definition'

module Pod
  class Podfile

    include Pod::Podfile::DSL
    # podfile 路径
    attr_accessor :defined_in_file
    # 所有的 TargetDefinition 的根节点, 正常只有一个，即 Pods.project target
    attr_accessor :root_target_definitions
    # 记录 Pods.project 项目的配置信息
    attr_accessor :internal_hash
    # 当前 DSL 解析使用的 TargetDefinition
    attr_accessor :current_target_definition

    # ...
  end
end
```

<br />直接看 `dsl.rb`，该文件内部定义了 Podfile DSL 支持的所有方法。通过 **include** 的使用将 `Pod::Podfile::DSL` 模块 Mix-in 后插入到 Podfile 类中。<br />想了解更多 Mix-in 特性，移步 [Ruby 特性之 Mix-in](https://mp.weixin.qq.com/s?__biz=MzA5MTM1NTc2Ng==&mid=2458324049&idx=1&sn=8de53f46fbc52427cdb660b427cb8226&chksm=870e0348b0798a5ed6d14715cc4a1af93cd168a5e15198acfb3b84ea49506b0f815fa891d683&token=883887783&lang=zh_CN#rd)。<br />

<a name="Lockfile"></a>
### Lockfile


> The Lockfile stores information about the pods that were installed by  CocoaPods.


<br />**Lockfile，顾名思义是用于记录最后一次 CocoaPods 所安装的 Pod 依赖库版本的信息快照。也就是生成的 **`Podfile.lock`**。**<br />
<br />在 `pod install` 过程，Podfile 会结合它来确认最终所安装的 Pod 版本，固定 Pod 依赖库版本防止其自动更新。Lockfile 也作为 Pods 状态清单 (mainfest)，用于记录安装过程的中哪些 Pod 需要被删除或安装或更新等。<br />
<br />以开头的 Podfile 经 `pod install` 所生成的 `Podfile.lock` 为例：<br />

```ruby
PODS:
  - Alamofire (4.6.0)

DEPENDENCIES:
  - Alamofire (from `./Alamofire`)

EXTERNAL SOURCES:
  Alamofire:
    :path: "./Alamofire"

SPEC CHECKSUMS:
  Alamofire: 0dda98a0ed7eec4bdcd5fe3cdd35fcd2b3022825

PODFILE CHECKSUM: da12cc12a30cfb48ebc5d14e8f51737ab65e8241

COCOAPODS: 1.10.0.beta.2
```

<br />我们来分析一下，通过该 Lockfile 能够获取哪些信息：

| **Key** | **含义** |
| --- | --- |
| **PODS** | 记录所有 Pod 库的具体安装版本号 |
| **DEPENDENCIES** | 记录各 Pod 库之间的相互依赖关系，由于这里只有 Alamofire 且它无其他依赖，暂时无关看出区别 |
| **EXTERNAL SOURCES** | 记录部分通过外部源的 Pod 库（Git 引入、Path 引入） |
| **SPEC CHECKSUMS** | 记录当前各 Pod 库的 Podspec 文件 Hash 值，其实就是文件的 md5 |
| **PODFILE CHECKSUM** | 记录 Podfile 文件的 Hash 值，同样是 md5，确认是否有变更 |
| **COCOAPODS** | 记录上次所使用的 CocoaPods 版本 |



<a name="80b7b70d"></a>
## Podfile 内容加载


<a name="8d8c5129"></a>
### Podfile 文件类型

<br />你可以在 CocoaPods 的 `/lib/cocoapods/config.rb` 找到 Podfile 所支持的文件类型：<br />

```ruby
PODFILE_NAMES = [
   'CocoaPods.podfile.yaml',
   'CocoaPods.podfile',
   'Podfile',
   'Podfile.rb',
].freeze
```

<br />CocoaPods 按照上述命名优先级来查找工程目录下所对应的 Podfile 文件。当发现目录中存在 **CocoaPods.podfile.yaml** 文件时会优先加载。很多同学可能只知道到 Podfile 支持 Ruby 的文件格式，而不了解它还支持了 YAML 格式。YAML 是 `YAML Ain't Markup Language` 的缩写，其 [官方定义](https://yaml.org/)：<br />

> YAML is a human friendly data serialization standard for all programming languages.


<br />它是一种面向工程师友好的序列化语言。我们的 Lockfile 文件就是以 YAML 格式写入 `Podfile.lock` 中的。<br />

<a name="93616363"></a>
### Podfile 文件读取

<br />回到 `lib/cocoapods-core/podfile.rb` 来看读取方法：<br />

```ruby
module Pod

  class Podfile

    include Pod::Podfile::DSL

    def self.from_file(path)
      path = Pathname.new(path)
      unless path.exist?
        raise Informative, "No Podfile exists at path `#{path}`."
      end
			# 这里我们可以看出，Podfile 目前已经支持了结尾是 .podfile 和 .rb 后缀的文件名
      # 其实是为了改善很多编译器使用文件后缀来确认 filetype，比如 vim
      # 相比与 Podfile 这个文件名要更加的友好
      case path.extname
      when '', '.podfile', '.rb'
        Podfile.from_ruby(path)
      when '.yaml'
        # 现在也支持了 .yaml 格式
        Podfile.from_yaml(path)
      else
        raise Informative, "Unsupported Podfile format `#{path}`."
      end
    end
end
```

<br />`from_file` 在 `pod install` 命令执行后的 `verify_podfile_exists!` 中被调用的：<br />

```ruby
def verify_podfile_exists!
    unless config.podfile
        raise Informative, "No `Podfile' found in the project directory."
    end
end
```

<br />而 Podfile 文件的读取就是 `config.podfile`  里触发的，代码在 CocoaPods 的 `config.rb` 文件中：<br />

```ruby
def podfile_path_in_dir(dir)
    PODFILE_NAMES.each do |filename|
        candidate = dir + filename
        if candidate.file?
        return candidate
        end
    end
    nil
end

def podfile_path
    @podfile_path ||= podfile_path_in_dir(installation_root)
end

def podfile
    @podfile ||= Podfile.from_file(podfile_path) if podfile_path
end
```

<br />这里的方法 `podfile` 和 `podfile_path` 都是 lazy 加载的。最后 Core 的 `from_file` 将依据目录下的 `Podfile` 文件类型选择调用 `from_yaml` 或者 `from_ruby`。<br />
<br />从 `Pod::Command::Install` 命令到 Podfile 文件加载的调用栈如下：<br />

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1599993134203-782e510d-c084-4b57-98fe-970f5a38cc79.jpeg)

<a name="28797697"></a>
### Podfile From Ruby 解析

<br />当我们通过 `pod init` 来初始化 CocoaPods 项目时，默认生成的 Podfile 名称就是 `Podfile`，那就从 `Podfile.from_ruby` 开始。<br />

```ruby
def self.from_ruby(path, contents = nil)
    # ①
    contents ||= File.open(path, 'r:utf-8', &:read)
    # 兼容 1.9 版本的 Rubinius 中的编码问题
    if contents.respond_to?(:encoding) && contents.encoding.name != 'UTF-8'
        contents.encode!('UTF-8')
    end

    # 对 Podfile 中不规范的单引号或双引号进行检查，并进行自动修正，及抛出错误
    if contents.tr!('“”‘’‛', %(""'''))
        CoreUI.warn "..."
    end
    # ②
    podfile = Podfile.new(path) do
        begin
	        eval(contents, nil, path.to_s)
        rescue Exception => e
	        message = "Invalid `#{path.basename}` file: #{e.message}"
   	     raise DSLError.new(message, path, e, contents)
        end
    end
    podfile
end
```

<br />**①** 是对 Podfile 内容的读取和编码，同时对可能出现的单引号和双引号的匹配问题进行了修正。<br />**②** 以 `path` 和 `block` 为入参进行 `podfile` 类的初始化并将其放回，保存在全局的 `config.podfile` 中。<br />

> Tips: 如果要在 Ruby 对象的初始化中传入参数，需要重载 Object 的 [initialize](https://ruby-doc.org/docs/ruby-doc-bundle/UsersGuide/rg/objinitialization.html) 方法，这里的 Podfile.new(...) 本质上是 `initialize` 的方法调用。


<br />`initialize` 方法所传入的尾随闭包 `block` 的核心在于内部的 `eval` 函数（在 [CocoaPods 核心组件](https://zhuanlan.zhihu.com/p/187272448) 中有提到）：<br />

```ruby
eval(contents, nil, path.to_s)
```

<br />它将 Podfile 中的文本内容转化为方法执行，也就是说里面的参数是一段 Ruby 的代码字符串，通过 `eval` 方法可以直接执行。<br />继续看 Podfile 的 `initialize` 方法：<br />

```ruby
def initialize(defined_in_file = nil, internal_hash = {}, &block)
    self.defined_in_file = defined_in_file
    @internal_hash = internal_hash
    if block
        default_target_def = TargetDefinition.new('Pods', self)
        default_target_def.abstract = true
        @root_target_definitions = [default_target_def]
        @current_target_definition = default_target_def
        instance_eval(&block)
    else
        @root_target_definitions = []
    end
end
```

<br />它定义了三个参数：

| 参数 | 定义 |
| --- | --- |
| **defined_in_file** | `Podfile` 文件路径 |
| **internal_hash** | 通过 yaml 序列化得到的 `Podfile` 配置信息，保存在 `internal_hash` 中 |
| **block** | 用于映射 `Podfile` 的 DSL 配置 |



> 需要注意的是，通过 `from_ruby` 初始化的 `Podfile` 只传入了参数 1 和 3，参数 2 `internal_hash` 则是提供给 `from_yaml` 的。


<br />当 `block` 存在，会初始化名为 `Pods` 的 TargetDefinition 对象，用于保存 `Pods project` 的相关信息和 Pod 依赖。然后调用 _[instance_eval](https://ruby-doc.org/core-2.7.0/BasicObject.html)_ 执行传入的 `block`，将 Podfile 的 DSL 内容转换成对应的方法和参数，最终将参数存入 `internal_hash` 和对应的 `target_definitions` 中。<br />

> Tips: 在 Ruby 中存在两种不同的方式来执行代码块 `block`，分别是 `instance_eval` 和 `class_eval`。
> `class_eval` 的执行上下文与调用类相关，调用者是类名或者模块名，而 `instance_eval` 的调用者可以是类的实例或者类本身。细节看 [StackoverFlow](https://stackoverflow.com/questions/900419/how-to-understand-the-difference-between-class-eval-and-instance-eval)。



<a name="434ab4f0"></a>
### Podfile From YAML 解析

<br />YAML 格式的 Podfile 加载需要借助 **YAMLHelper** 类来完成，YAMLHelper 则是基于 [yaml](https://github.com/ruby/yaml) 的简单封装。<br />

```ruby
def self.from_yaml(path)
    string = File.open(path, 'r:utf-8', &:read)
  
    # 为了解决 Rubinius incomplete encoding in 1.9 mode
  	# https://github.com/rubinius/rubinius/issues/1539
    if string.respond_to?(:encoding) && string.encoding.name != 'UTF-8'
        string.encode!('UTF-8')
    end
    hash = YAMLHelper.load_string(string)
    from_hash(hash, path)
end

def self.from_hash(hash, path = nil)
    internal_hash = hash.dup
    target_definitions = internal_hash.delete('target_definitions') || []
    podfile = Podfile.new(path, internal_hash)
    target_definitions.each do |definition_hash|
        definition = TargetDefinition.from_hash(definition_hash, podfile)
        podfile.root_target_definitions << definition
    end
    podfile
end
```

<br />通过 `from_yaml` 将文件内容转成 Ruby hash 后转入 `from_hash` 方法。<br />
<br />区别于 `from_ruby`，这里调用的 `initialize` 将读取的 hash 直接存入 `internal_hash`，然后利用 `TargetDefinition.from_hash` 来完成的 hash 内容到 targets 的转换，因此，这里无需传入 block 进行 DSL 解析和方法转换。<br />

<a name="32e84827"></a>
## Podfile 内容解析

<br />前面提到 Podfile 的内容最终保存在 `internal_hash` 和 `target_definitions` 中，本质上都是使用了 `hash` 来保存数据。由于 YAML 文件格式的 Podfile 加载后就是 hash 对象，无需过多加工。唯一需要处理的是递归调用 TargetDefinition 的 `from_hash` 方法来解析 target 子节点的数据。<br />
<br />因此，接下来的内容解析主要针对 Ruby 文件格式的 DSL 解析，我们以 `pod` 方法为例：<br />

```ruby
target 'Example' do
	pod 'Alamofire'
end
```

<br />当解析到 `pod 'Alamofire'` 时，会先通过 `eval(contents, nil, path.to_s` 将其转换为 `dsl.rb` 中的方法：<br />

```ruby
def pod(name = nil, *requirements)
    unless name
        raise StandardError, 'A dependency requires a name.'
    end
    current_target_definition.store_pod(name, *requirements)
end
```

<br />name 为 Alamofire，由于我们没有指定对应的 Alamofire 版本，默认会使用最新版本。`requirements`  是控制 该 pod 来源获取或者 pod target 的编译选项等，例如：<br />

```ruby
pod 'Alamofire', '0.9'
pod 'Alamofire', :modular_headers => true
pod 'Alamofire', :configurations => ['Debug', 'Beta']
pod 'Alamofire', :source => 'https://github.com/CocoaPods/Specs.git'
pod 'Alamofire', :subspecs => ['Attribute', 'QuerySet']
pod 'Alamofire', :testspecs => ['UnitTests', 'SomeOtherTests']
pod 'Alamofire', :path => '~/Documents/AFNetworking'
pod 'Alamofire', :podspec => 'https://example.com/Alamofire.podspec'
pod 'Alamofire', :git => 'https://github.com/looseyi/Alamofire.git', :tag => '0.7.0'
```


> Tips：requirements 最终是以 Gem::Requirement 对象来保存的。关于 pod 详细说明请移步：[Podfile 手册](https://guides.cocoapods.org/syntax/podfile.html#pod)。


<br />对 name 进行校验后，直接转入 `current_target_definition` 毕竟 Pod 库都是存在 `Pods.project` 之下：<br />

```ruby
def store_pod(name, *requirements)
  return if parse_subspecs(name, requirements) # This parse method must be called first
  parse_inhibit_warnings(name, requirements)
  parse_modular_headers(name, requirements)
  parse_configuration_whitelist(name, requirements)
  parse_project_name(name, requirements)

  if requirements && !requirements.empty?
    pod = { name => requirements }
  else
    pod = name
  end

  get_hash_value('dependencies', []) << pod
  nil
end

def get_hash_value(key, base_value = nil)
  unless HASH_KEYS.include?(key)
    raise StandardError, "Unsupported hash key `#{key}`"
  end
  internal_hash[key] = base_value if internal_hash[key].nil?
  internal_hash[key]
end

def set_hash_value(key, value)
  unless HASH_KEYS.include?(key)
    raise StandardError, "Unsupported hash key `#{key}`"
  end
  internal_hash[key] = value
end
```

<br />经过一系列检查之后，调用 `get_hash_value` 获取 `internal_hash` 的 `dependencies`，并将 name 和 `requirements` 选项存入。<br />
<br />这里的 `dependencies` key 是定义在 TargetDefinition 文件的 `**HASH_KEYS**`，表示 Core 所支持的配置参数:<br />

```ruby
HASH_KEYS = %w(
    name
    platform
    podspecs
    exclusive
    link_with
    link_with_first_target
    inhibit_warnings
    use_modular_headers
    user_project_path
    build_configurations
    project_names
    dependencies
    script_phases
    children
    configuration_pod_whitelist
    uses_frameworks
    swift_version_requirements
    inheritance
    abstract
    swift_version
).freeze
```


> Tips：freeze 表示该数组不可修改。另外，%w 用于表示其中元素被单引号括起的数组。
> %W(#{foo} Bar Bar\ with\ space)
> => ["Foo", "Bar", "Bar with space"]
> 对应的还有 %W 表示其中元素被双引号括起的数组。


<br />整个映射过程如下：<br />

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1599993134247-591416bf-8bbb-46cb-a8b9-86c41721acde.jpeg)

<a name="f7ab0349"></a>
# 精细化的 Podfile 配置

<br />最后一节让我们来展示一下 💪，看看 `Podfile` 所谓的 `targets` 之间的依赖关系可以玩出什么花来 😂。<br />

<a name="204d60fe"></a>
## Target 嵌套

<br />最简单的 `Podfile` 就是文章开头所展示的，不过在 `Podfile` 中还可以对 Target 进行嵌套使用。假设在我们的主工程同时维护了三个项目，它们都依赖了 Alamofire，通过俄罗斯套娃就能轻松满足条件：<br />

```ruby
target 'Demo1' do
  pod 'Alamofire'

  target 'Demo2' do
    target 'Demo3' do
    end
  end
end
```

<br />编译后的 `Pods.project` 项目结构如下：<br />

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1600222941775-314f4f32-ae1d-4bb2-befc-8f46bf25c105.jpeg)

<br />我们知道，CocoaPods 在 `Pods.project` 中为每个在 Podfile 中声明的 Target 生成一个与之对应的专属 Target 来集成它的 Pod 依赖。对于有依赖关系的 Target 其生成的专属 Target 名称则会按照依赖关系叠加来命名，如  `target Demo3` 的专属 Target 名称为 **Pods-Demo1-Demo2-Demo3**。安装完成后主项目将会引入该专属 Target 来完成依赖关联，如 Demo3：<br />

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1600222941734-6b94dfeb-d608-4240-9a38-ebb812da18d0.jpeg)

<br />关于 Target 嵌套，一个父节点是可以有多个子节点的：<br />

```ruby
target 'Demo1' do
  pod 'Alamofire'

  target 'Demo2' do
  	pod 'RxSwift'
  end
  target 'Demo3' do
	  pod 'SwiftyJSON'
  end
end
```


<a name="f52857bd"></a>
## Abstract Target

<br />上面例子中，由于 Demo1 与 Demo2 都需要依赖 Alamofire，我们通过 Target 嵌套让 Demo2 来继承 Demo1 的 Pods 库依赖。这么做可能会有一个限制，就是当 Demo1 的 Pod 依赖并非 Demo2 所需要的时候，就会有依赖冗余。此时就需要 `Abstract Target` 登场了。例如：<br />

```ruby
abstract_target 'Networking' do
  pod 'Alamofire'

  target 'Demo1' do
    pod 'RxSwift'
  end
  target 'Demo2' do
    pod 'ReactCocoa'
  end
  target 'Demo3' do
  end
end
```

<br />将网络请求的 pod 依赖抽象到 `Networking` target 中，这样就能避免 Demo2 对 RxSwift 的依赖。这种方式配置所生成的 `Pods.project` 并不会存在名称为 `Networking` 的 Target，它仅会在主工程的专属 Target 中留下印记：<br />

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1600222941749-f98999d7-0a31-4523-bd31-8646c92f05fc.jpeg)

<a name="25f9c7fa"></a>
# 总结

<br />本文结合 Xcode 工程结构来展开 CocoaPods-Core 的 Podfile 之旅，主要感受如下：<br />

1. 再一次感受了 Ruby 语言的动态之美，给我一个字符串，还你一个未知世界；
1. 结合 Xcode 工程结构更好的理解了 Podfile 的设计初衷，**基础知识很重要；**
1. 所谓“算法无用论”这种事情，在计算机的世界是不存在的，没有好的数据结构知识如何更好的抽象；
1. 了解 Podfile 的 DSL 是如何映射到内存中，又是如何来存储每个关键数据的



<a name="c6813027"></a>
# 知识点问题梳理

<br />这里罗列了四个问题用来考察你是否已经掌握了这篇文章，如果没有建议你加入**收藏 **再次阅读：<br />

1. 说说 TargetDefinition 的数据结构 ？
1. 说说 TargetDefinition 与 Xcode Project 的关系 ？
1. Podfile 的文件格式有几种，分别是如何加载 ？
1. Lockfile 和 Podfile 的关系
