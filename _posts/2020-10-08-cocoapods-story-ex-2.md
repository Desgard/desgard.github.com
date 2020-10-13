---
title: "Ruby 黑魔法 - eval 和 alias"
tags: 
    - "CocoaPods 历险记"
    - "Ruby in CocoaPods"
    - "Ruby"
comments: true
---

CocoaPods 是使用 Ruby 这门脚本语言实现的工具。Ruby 有很多优质的特性被 CocoaPods 所利用，为了在后续的源码阅读中不会被这些用法阻塞，所以在这个系列中，会给出一些 CocoaPods 的番外篇，来介绍 Ruby 及其当中的一些语言思想。

今天这一篇我们来聊聊 Ruby 中的一些十分“动态”的特性：**eval 特性和 alias 特性**。

# 说说 Eval 特性

## 源自 Lisp 的 Evaluation 

在一些语言中，`eval` 方法是**将一个字符串当作表达式执行而返回一个结果的方法**；在另外一些中，`eval` 它所传入的不一定是字符串，还有可能是抽象句法形势，Lisp 就是这种语言，并且 Lisp 也是首先提出使用 `eval` 方法的语言，并提出了 Evaluation 这个特性。**这也使得 Lisp 这门语言可以实现脱离编译这套体系而动态执行的结果**。

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia20201009091350.png)

Lisp 中的 `eval` 方法预期是：**将表达式作为参数传入到 `eval` 方法，并声明给定形式的返回值，运行时动态计算**。

下面是一个 Lisp Evaluation 代码的例子（ [Scheme](https://zh.wikipedia.org/wiki/Scheme) 方言 RRS 及以后版本）：

```python
; 将 f1 设置为表达式 (+ 1 2 3)
(define f1 '(+ 1 2 3))
 
; 执行 f1 (+ 1 2 3) 这个表达式，并返回 6
(eval f1 user-initial-environment)
```

可能你会觉得：**这只是一个简单的特性，为什么会称作黑魔法特性？**

因为 Evaluation 这种可 eval 特性是很多思想、落地工具的基础。为什么这么说，下面来说几个很常见的场景。


## REPL 的核心思想

如果你是 iOSer，你一定还会记得当年 Swift 刚刚诞生的时候，有一个主打的功能就是 **REPL 交互式开发环境**。

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1601284781928-6b274959-8352-4ad8-a71b-c7f7e5f9cba9.png)

当然，作为动态性十分强大的 Lisp 和 Ruby 也有对应的 REPL 工具。例如 Ruby 的 irb 和 pry 都是十分强大的 REPL。为什么这里要提及 REPL 呢？**因为在这个名字中，E 就是 eval 的意思。**

REPL 对应的英文是 **Read-Eval-Print Loop**。

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1602156287860-47a6a0d4-e12b-40bd-8a02-7f18a56acf4e.png)


- Read 读入一个来自于用户的表达式，将其放入内存；
- Eval 求值函数，负责处理内部的数据结构并对上下文逻辑求值；
- Print 输出方法，将结果呈现给用户，完成交互。

REPL 的模型让大家对于语言的学习和调试也有着增速作用，因为“Read - Eval - Print” 这种循环要比 “Code - Compile - Run - Debug” 这种循环更加敏捷。

在 Lisp 的思想中，为了实现一个 Lisp REPL ，只需要实现这三个函数和一个轮循的函数即可。当然这里我们忽略掉复杂的求值函数，因为它就是一个解释器。

有了这个思想，一个最简单的 REPL 就可以使用如下的形式表达：

```ruby
# Lisp 中
(loop (print (eval (read))))

# Ruby 中
while [case]
  print(eval(read))
end
```

## 简单聊聊 HotPatch

大约在 2 年前，iOS 比较流行使用 JSPatch/RN 基于 JavaScriptCore 提供的 iOS 热修复和动态化方案。其核心的思路基本都是下发 JavaScript 脚本来调用 Objective-C，从而实现逻辑注入。

JSPatch 尤其被大家所知，需要编写大量的 JavaScript 代码来调用 Objective-C 方法，当然官方也看到了这一效率的洼地，并制作了 JSPatch 的语法转化器来间接优化这一过程。

但是无论如何优化，其实最大的根本问题是 Objective-C 这门语言不具备 Evaluation 的可 eval 特性，倘若拥有该特性，那其实就可以跨越使用 JavaScript 做桥接的诸多问题。

我们都知道 Objective-C 的 Runtime 利用消息转发可以动态执行任何 Objective-C 方法，这也就给了我们一个启示。假如我们**自制一个轻量级解释器，动态解释 Objective-C 代码，利用 Runtime 消息转发来动态执行 Objective-C 方法，就可以实现一个“准 eval 方法”**。

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1602158120322-b10b302a-4bde-4a4e-8324-4f5830e7c2fc.png)

这种思路在 GitHub 上也已经有朋友开源出了 Demo - [OCEval](https://github.com/lilidan/OCEval)。不同于 Clang 的编译过程，他进行了精简：

1. 去除了 Preprocesser 的预编译环节，保留了 Lexer 词法分析和 Parser 语法分析，
1. 利用 `NSMethodSignature` 封装方法，结合递归下降，使用 Runtime 对方法进行消息转发。

利用这种思路的还有另外一个 [OCRunner](https://github.com/SilverFruity/OCRunner) 项目。

这些都是通过自制解释器，实现 eval 特性，进而配合 libffi 来实现。

## Ruby 中的 `eval` 和 `binding`

**Ruby 中的 eval 方法其实很好理解，就是将 Ruby 代码以字符串的形式作为参数传入，然后进行执行。**

```ruby
str = 'Hello'
puts eval("str + ' CocoaPods'") # Hello CocoaPods
```

上面就是一个例子，我们发现传入的代码 `str + ' CocoaPods'`  在 `eval` 方法中已经变成 Ruby 代码执行，并返回结果 `'Hello CocoaPods'`  字符串。

在[「Podfile 的解析逻辑」](/2020/09/16/cocoapods-story-4.html)中讲到， CocoaPods 中也使用了 `eval` 方法，从而以 Ruby 脚本的形式，执行了 `Podfile` 文件中的逻辑。

```ruby
def self.from_ruby(path, contents = nil)
  # ... 
  podfile = Podfile.new(path) do
    begin
      # 执行 Podfile 中的逻辑
      eval(contents, nil, path.to_s)
    rescue Exception => e
      message = "Invalid `#{path.basename}` file: #{e.message}"
      raise DSLError.new(message, path, e, contents)
    end
  end
  podfile
end
```

当然，在 CocoaPods 中仅仅是用了 `eval` 方法的第一层，对于我们学习者来说肯定不能满足于此。

在 Ruby 中， `Kernel` 有一个方法 `binding` ，它会返回一个 Binding 类型的对象。这个 Binding 对象就是我们俗称的**绑定**，它封装了当前执行上下文的所有绑定，包括变量、方法、Block 和 `self` 的名称绑定等，这些绑定直接决定了面向对象语言中的执行环境。

那么这个 Binding 对象在 `eval` 方法中怎么使用呢？其实就是 `eval` 方法的第二个参数。这个在 CocoaPods 中运行 Podfile 代码中并没有使用到。我们下面来做一个例子：

```ruby
def foo 
  name = 'Gua'
  binding
end

eval('p name', foo) # Gua
```

在这个例子中，我们的 `foo` 方法就是我们上面说的执行环境，在这个环境里定义了 `name` 这个变量，并在方法体最后返回 `binding` 方法调用结果。在下面使用 `eval` 方法的时候，当作 `Kernel#binding` 入参传入，便可以成功输出 `name` 变量。

## `TOPLEVEL_BINDING` 全局常量

在 Ruby 中 `main` 对象是最顶级范围，Ruby 中的任何对象都至少需要在次作用域范围内被实例化。为了随时随地地访问 `main` 对象的上下文，Ruby 提供了一个名为 `TOPLEVEL_BINDING` 的全局常量，**它指向一个封装了顶级绑定的对象**。
便于理解，举个例子：

```ruby
@a = "Hello"

class Addition
  def add
    TOPLEVEL_BINDING.eval("@a += ' Gua'")
  end
end

Addition.new.add

p TOPLEVEL_BINDING.receiver # main
p @a # Hello Gua
```

这段代码中，`Binding#receiver` 方法返回 `Kernel#binding` 消息的接收者。为此，则保存了调用执行上下文 - 在我们的示例中，是 `main` 对象。

然后我们在 Addition 类的实例中使用 `TOPLEVEL_BINDING` 全局常量访问全局的 `@a` 变量。

## 总说 Ruby Eval 特性

以上的简单介绍如果你曾经阅读过 SICP（Structture and Interpretation of Computer Programs）这一神书的第四章后，一定会有更加深刻的理解。

**我们将所有的语句当作求值，用语言去描述过程，用与被求值的语言相同的语言写出的求值器被称作元循环；eval 在元循环中，参数是一个表达式和一个环境，这也与 Ruby 的 `eval` 方法完全吻合。**

不得不说，Ruby 的很多思想，站在 SICP 的肩膀上。

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1602158921983-a4538257-84e2-48e8-bd24-6d6d3bbc9eb0.png)

# 类似于 Method Swizzling 的 `alias`

对于广大 iOSer 一定都十分了解被称作 Runtime 黑魔法的 Method Swizzling。这其实是动态语言大都具有都特性。

在 iOS 中，使用 Selector 和 Implementation（即 IMP）的指向交换，从而实现了方法的替换。这种替换是发生在运行时的。

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1602159208203-64baa017-a1e9-4383-9b78-d79f675bce67.png)

在 Ruby 中，也有类似的方法。为了全面的了解 Ruby 中的 “Method Swizzling”，我们需要了解这几个关于元编程思想的概念：**Open Class 特性与环绕别名。**这两个特性也是实现 CocoaPods 插件化的核心依赖。

## Open Class 与特异方法

Open Class 特性就是在一个类已经完成定义之后，再次向其中添加方法。在 Ruby 中的实现方法就是**定义同名类**。

在 Ruby 中不会像 Objective-C 和 Swift 一样被认为是编译错误，后者需要使用 Category 和 Extension 特殊的关键字语法来约定是扩展。**而是把同名类中的定义方法全部附加到已定义的旧类中，不重名的增加，重名的覆盖**。以下为示例代码：

```ruby
class Foo
  def m1
    puts "m1"
  end
end

class Foo
  def m2 
    puts "m2"
  end
end

Foo.new.m1 # m1
Foo.new.m2 # m2

class Foo
  def m1
    puts "m1 new"
  end
end

Foo.new.m1 # m1 new
Foo.new.m2 # m2
```

**特异方法**和 Open Class 有点类似，不过**附加的方法不是附加到类中，而是附加到特定到实例中**。被附加到方法仅仅在目标实例中存在，不会影响该类到其他实例。示例代码：

```ruby
class Foo
  def m1
    puts "m1"
  end
end

foo1 = Foo.new

def foo1.m2()
  puts "m2"
end

foo1.m1 # m1
foo1.m2 # m2

foo2 = Foo.new
foo2.m1 # m1
# foo2.m2 undefined method `m2' for #<Foo:0x00007f88bb08e238> (NoMethodError)
```

## 环绕别名（Around Aliases）

其实环绕别名只是一种特殊的写法，这里使用了 Ruby 的 `alias` 关键字以及上文提到的 Open Class 的特性。

首先先介绍一下 Ruby 的 `alias` 关键字，其实很简单，**就是给一个方法起一个别名**。但是 `alias` 配合上之前的 Open Class 特性，就可以达到我们所说的 Method Swizzling 效果。

```ruby
class Foo
  def m1
    puts "m1"
  end
end

foo = Foo.new
foo.m1 # m1

class Foo
  alias :origin_m1 :m1
  def m1
    origin_m1
    puts "Hook it!"
  end
end

foo.m1 
# m1
# Hook it!
```

虽然在第一个位置已经定义了 `Foo#m1`  方法，但是由于 Open Class 的重写机制以及 `alias` 的别名设置，我们将 `m1` 已经修改成了新的方法，旧的 `m1` 方法使用 `origin_m1` 也可以调用到。如此也就完成了类似于 Objective-C 中的 Method Swizzling 机制。

总结一下环绕别名，其实就是**给方法定义一个别名，然后重新定义这个方法，在新的方法中使用别名调用老方法**。

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia1602159579722-ad6461a6-31cd-407e-b718-089e9398cee3.png)

## 猴子补丁（Monkey Patch）

既然说到了 `alias` 别名，那么就顺便说一下**猴子补丁**这个特性。猴子补丁**区别于环绕别名的方式，它主要目的是在运行时动态替换并可以暂时性避免程序崩溃**。

先聊聊背景，由于 Open Class 和环绕别名这两个特性，Ruby 在运行时改变属性已经十分容易了。但是如果我们现在有一个需求，就是 **需要动态的进行 Patch ** ，而不是只要 `alias` 就全局替换，这要怎么做呢？

这里我们引入 Ruby 中的另外两个关键字 `refine` 和 `using` ，通过它们我们可以动态实现 Patch。举个例子：

```ruby
class Foo
  def m1
    puts "m1"
  end
end

foo = Foo.new
foo.m1 # m1

"""
定义一个 Patch
"""

module TemproaryPatch
  refine Foo do 
    def m1 
      puts "m1 bugfix"
    end
  end
end

using TemproaryPatch

foo2 = Foo.new
foo2.m1 # m1 bugfix
```

上面代码中，我们先使用了 `refine` 方法重新定义了 `m1` 方法，定义完之后它并不会立即生效，而是在我们使用 `using TemporaryPatch` 时，才会生效。这样也就实现了动态 Patch 的需求。

## 总说 alias 特性

Ruby 的 `alias` 使用实在时太灵活了，这也导致了为什么 Ruby 很容易的就可以实现插件化能力。因为所有的方法都可以通过环绕别名的方式进行 Hook ，从而实现自己的 Gem 插件。

除了以上介绍的一些扩展方式，其实 Ruby 还有更多修改方案。例如 `alias_method` 、 `extend` 、 `refinement` 等。如果后面 CocoaPods 有所涉及，我们也会跟进介绍一些。

# 总结

本文通过 CocoaPods 中的两个使用到的特性 Eval 和 Alias，讲述了很多 Ruby 当中有意思的语法特性和元编程思想。Ruby 在众多的语言中，因为注重思想和语法优雅脱颖而出，也让我个人对语言有很大的思想提升。

如果你有经历，我也强烈推荐你阅读 SICP 和「Ruby 元编程」这两本书，相信它们也会让你在语言设计的理解上，有着更深的认识。从共性提炼到方法论，从语言升华到经验。

# 知识点问题梳理

这里罗列了四个问题用来考察你是否已经掌握了这篇文章，你可以在评论区及时回答问题与作者交流。如果没有建议你加入**收藏**再次阅读：

1. REPL 的核心思想是什么？与 Evaluation 特性有什么关系？
1. Ruby 中 `eval` 方法作用是什么？Binding 对象用来干什么？
1. Ruby 是否可以实现 Method Swizzling 这种功能？
1. Open Class 是什么？环绕别名如何利用？
