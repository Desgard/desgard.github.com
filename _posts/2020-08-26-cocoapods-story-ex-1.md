---
title: "CocoaPods 中的 Ruby 特性之 Mix-in"
tags: 
    - "CocoaPods 历险记"
    - "Ruby in CocoaPods"
    - "Ruby"
comments: true
---

CocoaPods 是使用 Ruby 这门脚本语言实现的工具。Ruby 有很多优质的特性被 CocoaPods 所利用，为了在后续的源码阅读中不会被这些用法阻塞，所以在这个系列中，会给出一些 CocoaPods 的番外篇，来介绍 Ruby 及其当中的一些语言思想。

# 面向对象中的继承

## 构造一个动物类

`Mix-in` 在有些编程书中也被翻译成「混入模式」。根据字面意思，`Mix-in` 就是通过“混入”额外的功能，从而简化多层次的复杂继承关系。

我们举一个例子来说明。假如我们设计了一个 `Animal` 类，并且要实现一下四种动物的定义：

- `Dog` - 狗
- `Bat` - 蝙蝠
- `Parrot` - 鹦鹉
- `Ostrich` - 鸵鸟

如果按照哺乳动物和鸟类动物来归类，则可以设计出以下类的层级关系：

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia20201008221926.png)

但如果按照“能跑”和“能飞”来归类，则应该设计以下的类层次：

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia20201008221940.png)

但是在我们的代码中又想拥有之前哺乳动物和鸟类动物也增加进来，那么我们就要设计更加复杂的层次：

- 动物
    - 哺乳动物（Mammal）
        - 能飞（MFly）
        - 能跑（MRun）
    - 鸟类动物（Bird）
        - 能飞（BFly）
        - 能跑（BRun）

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia20201008221955.png)

如果继续增加分类手段，例如“宠物类”和“非宠物类”，则类的数量就会以指数级别增长，难以维护且可读性极差。

那么我们应该用什么方式来解决这个问题呢？

## 使用多继承解决

首先，我们可以按照哺乳动物和鸟类动物来进行继承关系的描述。由于 Python 支持多继承语法，所以我们下面用 Python 来描述一下使用多继承来描述上述场景：

```python
class Animal(object):
  pass

# 动物大类
class Mammal(Animal):
  pass

class Bird(Animal):
  pass
```

现在，我们给动物加上加上 `Runnable` 和 `Flyable` 的功能，当我们定义好这两个描述能力的类，使用多继承来描述每个动物即可：

```python
# 描述能力的类
class Runnable(object):
  def run(self):
    print('Running...')

class Flyable(object):
  def fly(self):
    print('Flying...')

# 每个动物
class Dog(Mammal, Runnable):
  pass

class Bat(Mammal, Flyable):
    pass
```

通过多重继承，一个子类可以获得多个父类的所有功能，并且其继承的关系树如下：

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia20201008222008.png)

## 多继承的问题

Ruby 这门语言是不支持多继承的，取而代之是使用 Mix-in。那么多继承到底有什么样的问题呢？

在「松本行弘的程序世界」中，作者列举了以下三点：

1. **结构复杂化** - 如果是单继承，一个类的父类是什么，父类的父类是什么，这些十分明确。因为单一继承关系中，是一棵多叉树结构。但是如果是多重继承，继承关系就十分复杂了。
2. **优先顺序模糊** - 假如有 A、C 同时继承了基类，B 继承了 A，然后 D 又同时继承了 B 和 C，所以此时 D 继承父类方法的顺序应该是 D ⇒ B ⇒ A ⇒ C 还是 D ⇒ B ⇒ C ⇒ A？又或者是其他顺序？如此优先顺序十分模糊。
3. **功能冲突** - 因为多重继承有多个父类，所以当不同的父类中更有相同的方法时就会产生冲突。如果 B 和 C 同时又有相同的方法时，D 继承的是哪个实现就会产生冲突。

但是单一继承又会有上文提到的缺陷。那么我们要如何平衡这个问题呢？其实方法很简单，**引入“受限制的多重继承”特性即可。**

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia20201008222026.png)

抛开各个编程语言只讨论面向对象思想，继承关系在最终的表现结果上往往只有两种含义：

- **类有哪些方法** - 子类对于父类属性描述的继承；
- **类的方法具体的实现是什么样的** - 子类对于父类方法实现逻辑的继承；

在静态语言中，这两者的区别更加的明显，几乎都是以关键字来做含义的隔离。例如 Java 中用 `extend` 实现单一继承，使用 `implements` 来间接实现多重继承；在 Swift 中，我们也会使用 `class` 和 `protocol` 来区别两种场景。

但是仅仅是区分了上述两种继承含义，这并不完美。Java 中用 `implements` 来实现多重继承，虽然避免来功能的冲突性，但是 `implements` 是无法共享的（这里的前提是 Java 8 之前，在 Java 8 之后，`interface` 可以使用 `default` 关键字增加默认实现），**如果想实现共享就要用组合模式来调用别的 `class` 从而实现共通功能，十分麻烦**。

在如此背景下我们来介绍 Ruby 中的 Mix-in 模式。

# Mix-in 以及其意义

上面说到，我们需要提供一种“受限制的多重继承”的特殊的继承方式，我们将这种继承简化称呼为**规格继承**。简单来讲，**规格继承就是指不但会将方法名继承下去，并且可以定义某些继承方法的默认实现。**

**如果你是 Swift 玩家，那么会立马反应过来，这就是 `protocol` 的 `extension` 默认实现。**是的，Mix-in 就是这个含义。在 Ruby 中 Mix-in 的语法是通过 `module` 和 `include` 方式来实现的，我们来举个例子说明一下。

```ruby
class Animal
end

class Mammal < Animal
end

class Bird < Animal
end

module RunMixin
  def run
      puts "I can run"
  end
end

module FlyMinxin
  def fly
      puts "I can fly"
  end
end

class Dog < Mammal
    include RunMixin
end

class Parrot < Bird
    include FlyMinxin
end

dog = Dog.new
dog.run       # "I can run"

parrot = Parrot.new
parrot.fly    # "I can fly"
```

通过这种方式，我们将 Run 和 Fly 的能力抽象成了两个 `module` ，当描述对应 `class` 时需要的时候，就使用 Min-in 模式将其 `include` 就可以获得对应能力。

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia20201008222041.png)

那么如果我们将 Mammal 哺乳动物和 Bird 鸟类动物封装成 Mix-in ，并将 Fly 和 Run 做成一级 `class` 这样可以吗？**在实现上是可以的，但是并不推荐**。

这里简单说一下原因：因为 Mix-in 期望是一个行为的集合，并且这个行为可以添加到任意的 `class` 中。从某种程度上来说，**继承描述的是“它是什么”，而 Mix-in 描述的是“它能做什么”**。从这一点出发，**Mix-in 的设计是单一职责的**，并且 **Mix-in 实际上对宿主类一无所知**，**也有一种情况是只要宿主类有某个属性，就可以加入 Mix-in**。

# Mix-in in CocoaPods

在 CocoaPods 的 `config.rb` 中，其中有很多关于 Pods 的配置字段、CocoaPods 的一些关键目录，并且还持有一些单例的 Manager。

在[「整体把握 CocoaPods 核心组件」](/2020/08/17/cocoapods-story-2.html)一文中，我们介绍来 `pod install` 的过程都是在 `installer.rb` 中完成的，而这个 `Installer` 的 `class` ，中的定义是这样的：

```ruby
module Pod
	class Installer
		autoload :Analyzer,                     'cocoapods/installer/analyzer'
    autoload :InstallationOptions,          'cocoapods/installer/installation_options'
    autoload :PostInstallHooksContext,      'cocoapods/installer/post_install_hooks_context'
    #...

    include Config::Mixin
  
    #...
	end
end
```

我们可以看到 `Installer` 拿入了 `Config::Mixin` 这个 `module`。而这个 `config` 属性其实就是 CocoaPods 中的**一些全局配置变量**和**一些配置字段**。

例如我们在 `write_lockfiles`  方法中来查看 `config` 的用法：

```ruby
def write_lockfiles
  # 获取 lockfile 数据
  @lockfile = generate_lockfile
	
	# 将 lockfile 数据写入 Podfile.lock 
  UI.message "- Writing Lockfile in #{UI.path config.lockfile_path}" do
    @lockfile.write_to_disk(config.lockfile_path)
  end

	# 将 lockfile 数据写入 manifest.lock 
  UI.message "- Writing Manifest in #{UI.path sandbox.manifest_path}" do
    @lockfile.write_to_disk(sandbox.manifest_path)
  end
end
```

这里面的 `config` 就是通过 Mix-in 方式拿进来的变量，意在更加容易的去访问那些全局变量和配置字段。

我们在写入文件的位置下一个断点，可以清楚的打印 `lockfile_path` ；当然我也可以使用 `config` 打印其他的重要信息：

```ruby
config.lockfile_path     # lockfile 的 Path
config.installation_root # 执行 install 的目录
config.podfile           # 解析后的 Podfile 实例
config.sandbox           # 当前工程的 sandbox 目录
# ...
```

具体的属性可以查看 `config.rb` 中的代码来确定。既然 `Config` 已经变成一个 Mix-in ，在 CocoaPods 中引入的地方自然就会很多了：

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia20201008222206.png)

# 简单说一句 Duck Typing 思想

> 下面是一点对于编程思想的思考，可以不看。

最后我们来说一个高级的东西（其实只是名字很高级），那就是 Duck Typing，在很多书中也被称作**鸭子类型**。

Duck Typing 描述的是这么一个思想：**如果一个事物不是鸭子（Duck），如果它走起路来像一只鸭子，叫起来也像一只鸭子，即我们可以说它从表现来看像一只鸭子，那么我们就可以认为它是一只鸭子**。

这种思想应用到编程中是什么样的呢？**简而言之，一个约定要求必须实现某些功能，而某个类实现类这个功能，就可以把这个类当作约定的具体实现来使用**。

我们从这个角度来看，其实 Mix-in 这种模式就更加区别于多继承，而是一种 Duck Typing 思想的语法糖。我们不用将一层层 `interface` 全部继承，而是**声明即实现**。

Duck Typing 是一种设计语言的思想，如果你想了解的更多，也可以从 Duck Test 这种测试方式开始了解。

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia20201008222222.png)

# 总结

本文从 CocoaPods 中使用到的 Ruby 语法特性说起，讲述了在 Ruby 当中，为了解决多继承中的问题从而引入的 Mix-in 模式，并且 Ruby 也为其定义了 `module` 和 `include` 关键字的语法糖。从 Mix-in 模式里，我们可以了解多继承的一些缺点，并且懂得提出了 Mix-in 是为了解决什么问题。最后稍微引入了 Duck Typing 这种程序设计思想，有兴趣的朋友可以自行研究。

# 知识点问题梳理

这里罗列了一些问题用来考察你是否已经掌握了这篇文章，如果没有建议你加入**收藏**再次阅读：

1. 什么是 Mix-in，它与多继承是什么关系？
2. Mix-in 在大多数编程语言中是如何落地的？分别说说 Java、Ruby、Swift？
3. 多继承的缺点有什么？
4. 在 CocoaPods 中是如何使用 Mix-in 特性的？