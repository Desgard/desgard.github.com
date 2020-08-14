---
title:      "Swift Probe - Optional"
date:       2017-07-14 01:01:00
author:     "Desgard_Duan"
categories:
- Swift
tags:
- Swift 
---


最近在研究 Swift 中好玩的东西，打算将一些学习笔记，整理成一个系列便于自己温习且与大家交流。这次来玩弄一下 Optional。

## Optional 引入由来

Optional 特性是 Swift 中的一大特色，用来解决变量是否存有 `nil` 值的情况。这样既可减少在数据传递过程中，由于 `nil` 带来的不确定性，防止未处理 `nil` 而带来的程序崩溃。

Optional 在高级语言中其实并不是 Swift 的首创，而是效仿其他语言学习来的特性。2015 年的时候，为了迎合 Swift 的 Optional 特性，在 Objective-C 中也引入了 Nullability 特性。Swift 作为一个强类型语言，需要在编译期进行安全检查，所以引入了类型推断的特性。为了保证推断的安全，于是又引入了 Optional 特性。

如果没有 Optional 到底有如何的危险呢？我们用 C++ 的一个例子来看一下：

{% highlight ruby %}
#include <iostream>
using namespace std;
int main() {
    auto numbers = { 1, 2, 3 };
    auto iterator_of_4 = std::find(numbers.begin(), numbers.end(), 4);

    if (iterator_of_4 == numbers.end()) {
        // 未查找到 4 的操作
        cout << "Not found 4" << endl;
    } else {
        // 代码执行
        cout << "Got it" << endl;
    }
    return 0;
}
{% endhighlight %}

在使用迭代器的时候，我们往往要判断迭代器是否已经遍历到末尾，才可以去继续操作。因为有**值不存在的情况**，所以在以往的操作中都会使用**一个特殊值来表示某种特殊的含义**，通常情况下对于这种特殊值称作 *Sentinal Value*，在很多算法书中称其为**哨兵值**。使用哨兵值会有这么两个弊端：其一是**形如 `std::find` 或者是 `std::binary_search` 这种方法都从它们各自的签名以及调用上，都无法得知它的错误情况，以及对应的错误情况处理方式**。另外，以哨兵值的方式，使我们无法通过编译器来强制错误处理的行为。因为编译器对此是毫无感知的，其哨兵值都是由语言作者或是后期开发人员的约定俗成，例如 C 中文件读取的 `open` 函数，在读取失败下为 `-1`，或是上例中 `numbers.end()` 这个迭代位，只有在程序崩溃之后，才能显出原形。

为了突出 Optional 的必要性，[泊学网](https://boxueio.com/series/optional-is-not-an-option/ebook/138)（笔者也是最近才看过的，这里推荐一下😎）中给出了一个哨兵值方案也无法解决的问题，这是一个 Objective-C 的例子：

{% highlight ruby %}
NSString *tmp = nil;

if ([tmp rangeOfString: @"Swift"].location != NSNotFound) {
    // Will print out for nil string
    NSLog(@"Something about swift");
}
{% endhighlight %}

虽然 `tmp` 的值为 `nil`，但调用 `tmp` 的 `rangeOfString` 方法却是合法的，它会返回一个值为 0 的 `NSRange` ，所以 `location` 的值也是 0。但是 `NSNotFound` 的值却是 `NSIntegerMax`。所以尽管 `tmp` 的值为 `nil`， 我们还能够在 Terminal 中看到 `Something about swift` 的输出。所以，当为 `nil` 的时候，我们仍旧需要特殊考虑。


于是，这就是 Optional 的由来，为了解决使用 Sentinal Value 约定而无法解决的问题。

## 使用 Optional 实现方法

这里是 Swift Probe 系列，所以我们不说其用法。在 Swift 的源码中，Optional 以枚举类型来定义的：

{% highlight ruby %}
@_fixed_layout
public enum Optional<Wrapped> : ExpressibleByNilLiteral {
	case none
	case some(Wrapped)
	
	public init(_ some: Wrapped)
	public func map(_ transform: (Wrapped) throws -> U) rethrows -> U?
	public func flatMap(_ transform: (Wrapped) throws -> U?) rethrows -> U?
	public init(nilLiteral: ())
	public var unsafelyUnwrapped: Wrapped { get }
}
{% endhighlight %}

当然在枚举中还有很多方法并没有列出，之后我们详细来谈。在枚举定义之前，有一个属性标识（attribute）  - `@_fixed_layout`，由此标识修饰的类型在 SIL （Swift intermediate
 Language）生成阶段进行处理。它的主要作用是将这个类型确定为固定布局，也就是在内存中这个类型的空间占用确定且无法改变。
 
由于 Optional 是多类型的，所以我们通过 `<Wrapped>` 来声明泛型。`ExpressibleByNilLiteral` 协议仅仅定义了一个方法：

{% highlight ruby %}
init(nilLiteral: ())    // 使用 nil 初始化一个实例
{% endhighlight %}

不看方法，仅仅看这个枚举定义，其实我们就可以模拟一些很简单的方法。例如我们来解决上文中 C++ `std::find` 那个问题，对 `Array` 数据结构来写一个 `extension`：

{% highlight ruby %}
import Foundation

enum Optional<Wrapped> {
    case none
    case some(Wrapped)
}

extension Array where Element: Equatable {
    func find(_ element: Element) -> Optional<Index> {
        var index = startIndex
        while index != endIndex {
            if self[index] == element {
                return .some(index)
            }
            formIndex(after: &index)
        }
        return .none
    }
}
{% endhighlight %}

代码很简单，就是将当前数组做一次遍历来查找这个元素，如果找到则返回一个  `some` 类别代表这个 Optional 结果是存在的。如果没有则返回 `none`。我们来测试一下：

![](/assets/images/blog/14996701635735/14998196038583.jpg)


发现如果 `find` 方法在 `Array` 中无法找到对应元素，则会返回一个 `none` 的 Optional 对象。

由于在 Swift 的源码中已经定义了 Optional，并且使用特定的重载标记符号进行简化，所以我们也可以简写上述的 `find` ：

{% highlight ruby %}
extension Array where Element: Equatable {
    func find(_ element: Element) -> Index? {
        var index = startIndex
        while index != endIndex {
            if self[index] == element {
                return index
            }
            formIndex(after: &index)
        }
        return nil
    }
}
{% endhighlight %}

由于 Swift 通过 `?` 来对 Optional 类型做了简化，所以我们将返回值修改成 `Index?` 即可。其他地方也类似，如果有值直接返回，没有则返回 `nil`。我们使用 `if let` 范式来验证一下 Optional 的作用：

![](/assets/images/blog/14996701635735/14998277800625.jpg)

## Optional 中 map 和 flatMap 实现

在引入之前，我们来看以下代码：

{% highlight ruby %}
import Foundation

let author: String? = "gua"
var AUTHOR: String? = nil

if let author = author {
    let AUTHOR = author.uppercased()
}
{% endhighlight %}

我们通过一段小写的 Optional 字符串常量做出修改后来为其他进行赋值。那么如果我们 `AUTHOR` 是个常量应该怎么做呢？其实字符串就是一个包含字符量和 `nil` 量的集合，处理这种集合的时候使用 `map` 就可以解决了：

{% highlight ruby %}
var AUTHOR: String? = author.map { $0.uppercased() } // Optional("GUA")
{% endhighlight %}

这样我们就得到了一个新的 Optional 常量。那么 `map` 方法对于 Optional 量是怎么处理的呢？来阅读以下源码：

{% highlight ruby %}
@_inlineable
public func map<U>(
    _ transform: (Wrapped) throws -> U
    ) rethrows -> U? {
    switch self {
    case .some(let y):
        return .some(try transform(y))
    case .none:
        return .none
    }
}
{% endhighlight %}

首先要说明的是 `Wrapped` ，这是 `Optional` 类型的泛型参数，表示 Optional 实际包装的的值类型。

另外来解释一下 `rethrows` 关键字：有这么一个场景，在很多方法中要传入一个闭包来执行，当传入的闭包中没有异常我们就不需要处理，有异常的时候，我们需要使用 `throws` 关键字来声明以下，代表我们需要进行异常处理。但是某些情况下，一个闭包函数本身不会产生异常，但是作为其他函数的参数就会出现异常情况。这时候我们使用 `rethrows` 对函数进行声明从而向上层传递异常情况。

暂且我们先不去考虑异常情况，根据源码的思路自行实现一个 `map` 方法来处理 Optional 问题：

{% highlight ruby %}
extension Optional {
    func myMap<T>(_ transform: (Wrapped) -> T) -> T? {
        if let value = self {
            return transform(value)
        }
        return nil
    }
}
{% endhighlight %}

很简单的就实现了等同之前 `map` 效果的功能。

根据此处的 `map` 实现，继续引入下一个示例：

{% highlight ruby %}
let stringOne: String? = "1"
let ooo = stringOne.map { Int($0) } // Optional<Optional<Int>>
{% endhighlight %}

由于 `Int($0)` 会返回一个 `Int?` 的 Optional 量，而 `map` 由之前的源码可知，又会返回一个 Optional 类型，因此 `ooo` 变量就是一个双层嵌套 Optional 对象。而我们希望的仅仅是返回一个 `Int` 型整数就好了，此时引入 `flatMap` 来解决这个问题：

{% highlight ruby %}
let stringOne: String? = "1"
let ooo = stringOne.flatMap { Int($0) } // Optional<Int>
{% endhighlight %}

`flatMap` 与 `map` 的区别是对 closure 参数的返回值进行处理，之后对其值直接返回，而不会像 `map` 一样对其进行一次 `.some()` 的 Optional 封装：

{% highlight ruby %}
@_inlineable
public func flatMap<U>(
    _ transform: (Wrapped) throws -> U?
    ) rethrows -> U? {
    switch self {
    case .some(let y):
        return try transform(y)
    case .none:
        return .none
    }
}
{% endhighlight %}

以上就是对于 Optional 的 `map` 和 `flatMap` 分析。

## Nil Coalescing 实现

有时候我们需要在 Optional 值为 `nil` 的时候，设定一个默认值。用以往的方法，肯定会使用三元操作符：

{% highlight ruby %}
var userInput: String? = nil
let username = userInput != nil ? userInput! : "Gua"
{% endhighlight %}

如此写法过于冗长，对开发者十分不友好。为了表意清晰，代码方便，Swift 引入了 Nil Coalescing 来简化书写。于是之前的 `username` 的定义可以简写成这样：

{% highlight ruby %}
let username = userInput ?? "Gua"
{% endhighlight %}

`??` 操作符强制要求可能为 `nil` 的变量要写在左边，默认值写在右边，这样也统一了代码风格。我们深入到源码来看 Nil Coalescing 操作符的实现：

{% highlight ruby %}
@_transparent
public func ?? <T>(optional: T?, defaultValue: @autoclosure () throws -> T) rethrows -> T {
    switch optional {
    case .some(let value):
        return value
    case .none:
        return try defaultValue()
    }
}
{% endhighlight %}

解释两个标记：

1. `@_transparent`：标明该函数应该在 pipeline 中更早的进行函数内联操作。用于非常原始、简单的函数操作。他与 `@_inline` 的区别就是在没有优化设置的 debug 模式下也会使得函数内连接，与 `@_inline (__always)` 标记十分相似。
2. `@autoclosure`：这个标记在 @Onevcat 的 [Swifter Tips](http://swifter.tips/autoclosure/) 用已经有很好的介绍和实用场景说明。其作用是**将一句表达式自动地封装成一个闭包**。这样封装的目的是当默认值是经过一系列计算得到结构环境下，实用 `@autoclosure` 封装会简化传统闭包的开销，因为如果是传统闭包需要先执行再判断，而 `@autoclosure` 巧妙的避免了这一点。


## 结语

Swift 源码分析是笔者一直想开的新坑。本文仅仅介绍了 Optional 的实现中最核心的部分，然而只是 Swift 的冰山一角。希望与读者多多交流，共同进步。


## 参考文献

[Apple Swift Source Code](https://github.com/apple/swift/blob/master/stdlib/public/core/Optional.swift)

[Swift 烧脑体操（一） - Optional 的嵌套](http://blog.devtang.com/2016/02/27/swift-gym-1-nested-optional/)


