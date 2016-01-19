---
layout: post
author: Desgard_Duan
title: Learning Delegate Model in iOS
category: learning
tag: [iOS]
---

今天在写项目`SunnySportRunning`时候出现了一个小的问题。[问题](http://segmentfault.com/q/1010000004324655)如下描述：

> 在`ICSDrawerController`为主视图控制器，但是其中的某个`UIButtonView`是由`StatusViewController`来控制。当`UIButtonView`触发后，我想让主视图跳转到下一界面，跳转方式为拥有导航栈的`push`方法。

<!-- more -->
对问题分析了一番，该问题的难点在于触发时间与需执行的方法不在一个类中，所以涉及到两个对象间的信息交互。于是引出了使用**委托**（又叫**代理**，Proxy）设计模式，而在**iOS**开发中，**Proxy**模式即为**Delegate**模式，我们可以借助**objective-c**协议中的 **protocol** （更多了解可以查看 iOS Develop Library 中关于**protocol**的介绍[Working with Protocol](https://developer.apple.com/library/ios/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/WorkingwithProtocols/WorkingwithProtocols.html)），便可以很方便的实现这种设计模式。

##什么是代理？
苹果的官方文档是如此给出的。
> Delegation is a simple and powerful pattern in which one object in a program acts on behalf of, or in coordination with, another object. The delegating object keeps a reference to the other object—the delegate—and at the appropriate time sends a message to it. The message informs the delegate of an event that the delegating object is about to handle or has just handled. The delegate may respond to the message by updating the appearance or state of itself or other objects in the application, and in some cases it can return a value that affects how an impending event is handled. The main value of delegation is that it allows you to easily customize the behavior of several objects in one central object.


翻译一下：代理是一种简单且功能强大的设计模式，这种模式用于一个对象与工程中其他对象进行交互。**Delegating Object**中维护一个`delegate`的引用，并且在合适的时间向该代理发送消息。这个消息**Delegating Object**将处理或是处理完成某一个事件。这个代理可以通过更新自己或者是其它对象的**View**来响应**Delegating Object**发送过来的事件消息。或是在某些情况下能返回一个值来形象其它即将发生的事件响应方法。代理设计模式的主要价值是它可以让你容易定制各种对象的行为。

##Cocoa中的代理
**Cocoa Touch**框架中大量使用了该设计模式，观看源码，在每个UI控件类里都声明了类型为**id**的**delegate**，以下属性十分常见。
<div>
<pre class="brush: applescript">
// weak reference
@property (nonamtic, assign)id&ltUIActionSheetDelegate&gt delegate; 
</pre>
</div>
从尖括号写法，可以看出这个代理要遵循某一个协议，也就是说只有遵循了这个协议的类对象才具备代理资格。这同时也要求了代理类必须在头文件中声明`protocal_name`协议并实现其中的`@required`方法，`@optional`的方法是可选的。

以下总结了各个协议的作用以及用法：

- 协议是一组通信协议，一般用作两个类之间的通信。
- 协议声明了一组所有类对象都可以实现的接口。
- 协议不是类，用`@protocol`关键字声明一个协议。
- 与协议有关的两个对象、代理者和委托者。
- 代理，实现协议的某个方法，相当于实现这个协议。
- 委托，用自己的方法，制定要实现协议方法的对象（代理），代理来实现对应的方法。

其中，两个预编译指令，`@optional`表示可以选择实现的方法，`@required`表示强制执行的方法。

##运用案例
这里我引用下**关东升**作者的*《iOS开发指南》*一书的书中案例，从而介绍代理设计模式的实现原理和应用场景。

###背景
古希腊有一位哲学家，他毕生只做三件事情：“睡觉”“吃饭”和“工作”。为了更好的生活，提高工作效率，他回找一个徒弟，把这些事情委托给他徒弟做。然而要成为他的徒弟，需要实现一个协议，洗衣要求能够处理“睡觉”“吃饭”和“工作”的问题。下图可以描述三者之间的关系：

![img](http://i8.tietuku.com/30b9c348e8590f07.png)

###分析
哲学家类图中，通用类`Philosopher`保持只想委托对象`ViewController`的**弱引用**`id<PhilosopherDelegate> delegate`，委托对象`ViewController`就是哲学家的“徒弟”，他实现协议`PhilosopherDelegate`，`PhilosopherDelegate`规定了3个方法`- (void) sleep`、`- (void) eat`、`- (void) work`方法。

###代码实例
下面看一下实现代码。
####PhilosopherDelegate.h
<div>
<pre class="brush: applescript">
@protocol PhilosopherDelegate
@required
- (void) sleep;
- (void) eat;
- (void) work;
@end
</pre>
</div>

委托协议`PhilosopherDelegate`定义了3个方法，协议没有**.m**文件，它的定义可以放在别的**.h**文件中。它的实现类就是委托类`ViewController`。相关代码如下。
####ViewController.h
<div>
<pre class="brush: applescript">
@interface ViewController: UIViewController&ltPhilosopherDelegate&gt
@end
</pre>
</div>
####ViewController.m
<div>
<pre class="brush: applescript">
@implementation ViewController

- (void) viewDidLoad {
    [super viewDidLoad];
    Philospher *obj = [[Philosopher alloc] init];
    obj.delegate = self;
    [obj start];
}

#pragma - PhilosopherDelegate方法实现
- (void) sleep {
    NSLog (@"sleep...zzz..");
}
- (void) eat {
    NSLog (@"eat...eheh...");
}
- (void) work {
    NSLog (@"work...lala...");
}

@end
</pre>
</div>
委托对象如何与通用类简历引用关系呢？我们通过`viewDidLoad`方法中的`obj.delegate = self`语句来制定委托对象和通用类间的引用关系。一般情况下通用类**由框架直接提供**，在这个例子中我们根据需要自己是想了通用类`Philosopher`。
####Philosopher.h
<div>
<pre class="brush: applescript">
#import "PhilosipherDelegate.h"

@interface Philosopher: NSObject {
    NSTimer *timer;
    int count;
}

@property (nonatomic, weak) id&ltPhilosopherDelegate&gt delegate;
- (void) start;
- (void) handle;

@end

</pre>
</div>
`Pohilosopher.h`中定义**delegate属性**，它的类型是`id<PhilosopherDelegate>`，它可以保存委托对象的引用，属性`weak`说明是弱引用。
####Philosopher.m
<div>
<pre class="brush: applescript">
#import “Philosopher.h”  
  
@implementation Philosopher  
  
@synthesize delegate; 
-(void) start {  
    count= 0;  
    timer = [NSTimer scheduledTimerWithTimeInterval:3.0 
        target:self selector: @selector(handle) 
        userInfo: nil repeats:YES];   
}  
  
-(void)handle {  
    switch (count) {  
        case 0:  
            [self.delegate sleep];  
            count++;  
            break;  
        case 1:  
            [self.delegate eat];  
            count++;  
            break;  
        case 2:  
            [self.delegate work];  
            [timer invalidate];  
            break;  
    }  
}  
  
@end  
</pre>
</div>

###案例总结
在本例中`Philosopher`模拟一些通用类发出调用，这个调用的发出是通过`NSTimer`每3秒发出一个，依次向委托对象发出消息`sleep`、`eat`和`work`。代码中`self.delegate`是指向委托对象`ViewController`的引用，`[self.delegate sleep]`是调用`ViewController`中的`sleep`方法。

##代理模式回顾
###什么时候我们应该使用代理模式？
我觉得即为：“页面B向页面A传递消息的时候”。答案看起来也十分显然，在页面B中，我们设置都不知道有页面A的存在，想页面A传值就是更无从谈起了。那么此时可行的方案就是在页面B中定义一个协议，声明一个代理对象；在页面A中，将自己设置为页面B的代理并且完成代理方法。

由此，得到一个结论：

**当一个对象无法直接获取到另一个对象的指针，又希望对那个变量进行一些操作时， 可以使用代理模式。**

###代理模式到底做了了什么？
道理模式其实总结一下只有两个关注点：**协议**和**代理者**。

- **协议**：定义了一组方法，由某个类负责实现。
- **代理者**：作为某个类的一个属性，通常是另一个类的实例对象，可以负责完成原来这个类不方便或者无法完成的任务。

首先谈一谈代理者，在脑中重新回想一下代理模式的实现过程。在页面B中定义了一个代理对象的时候，好像和定义一个普通的`property`十分类似。所以对于代理可以用**一个属性**来概括。

当然，代理者并不是一个普通的属性，否则只需要重写一下B的初始化方法即可达到效果。

<div>
<pre class="brush: applescript">
self.BVC = [[BViewController alloc] initWithDelegate: self];
</pre>
</div>
然后再`BViewController.m`中定义一个`AViewController *avc`，并在初始化方法中赋值即可。

代理者定义时，基本上是固定格式：
<div>
<pre class="brush: applescript">
id &ltSomeDelegate&gt delegate;
</pre>
</div>
所以，对于代理的优势是，其核心优势在于**实现解耦**。
###协议的优点
- 易于检查

可以利用Xcode的检查机制，对于定义的`@required`方法，如果实现了协议而没有实现这个方法，编译器将会有警告，这样可以防止因为倏忽，忘记实现某个代码的情况，而由于objective-c的运行是特性，这样的错误往往运行阶段才会导致程序崩溃。

- 有利于代码的封装

如果一个类，实现了某个协议，那么这个协议中的方法不必再**.h**中被声明，就可以呗定义协议的类调用，这样可以减少一个类暴露给外部的方法。

- 有利于程序的结构化和层次化

避免了自己再次构思一种方法。协议的集成极致使得其更加强大。

##回归问题
问题变的很简单，只要用`ICSDrawerController`对类`StatusViewController`做代理实现触发方法即可。延伸一下，也可以使用`block`进行实现。之后也想去看看`block`方法，进一步学习`objective-c`。
