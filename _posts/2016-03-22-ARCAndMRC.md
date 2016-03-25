---
layout: post
author: Desgard_Duan
title: Reference Counting in Objective-C
category: learning
tag: [iOS]
---

这几天没有更新博文，一直忙碌于实习学习`golang`，还有投递简历、准备各种面试和笔试。但是自身的内功修炼还是要跟上。自己感觉`ARC`机制并没有理解透，所以再记录一篇博文深入的理解下。

## 概述

**Objective-C**中提供了两种内存管理机制**MRC(Mannu Reference Counting)**和**ARC(Automatic Reference Counting)**，分别提供对内存的手动和自动管理，从而满足了不同的需求。这篇文将从以下问题理解引用计数机制的意义。

> ARC是什么？
> ARC和MRC在内存管理的区别在哪里？
> ARC什么情况下会出现内存泄露？
> **Toll-Free Bridging**是什么？

<!-- more -->

## 理解

自动销毁不被引用的对象的机制称为ARC。ARC是自动引用计数(Automatic Reference Counting)的简称。通俗的来说ARC，就是：**每个对象都会对指向自己的对象进行计数。当引用数为0时，就会认为不需要给对象了，程序就会自动销毁该对象。**

先简单说说MRC。在MRC的内存管理模式下，与对变量的管理相关方法有：**retain**、**release**和**autorelease**。retain和release方法操作的是引用计数，当引用计数为0时，便自动释放内存。并且可以用NSAutoreleasePool对象，对加入自动释放池(autorelease调用)的变量进行管理，当drain时回收内存。

* retain：该方法的作用是将内存数据的所有权附给另一指针的变量，引用计数加一。
* release：该方法是释放指针变量对内存数据的所有权，引用数减一。
* autorelease：该方法是将该对象内存的管理放到**autoreleasepool**中。

### 在ARC下测试应用引用计数实验

~~~ ruby
#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
    NSDate *a = [[NSDate alloc] init];
    NSLog(@"%d", [a retainCount]);
    NSDate *b = [a retain];
    NSLog(@"%d", [a retainCount]);
    [b release];
    NSLog(@"%d", [a retainCount]);
    [a release];
    NSLog(@"%d", [a retainCount]);
    return 0;
}
~~~

其输出结果让人有些不解，如果有人知道其原理，麻烦务必告诉我。

~~~ ruby
2016-03-25 10:13:19.779 test[1263:30108] 1
2016-03-25 10:13:19.780 test[1263:30108] 2
2016-03-25 10:13:19.780 test[1263:30108] 1
2016-03-25 10:13:19.780 test[1263:30108] 1
~~~

前三行的输出是意料之中的，但是最后一行应该引用计数为0，自己极不理解，希望知道的人告予我们，感谢。

### 关于autorelease的一些测试代码

如果我们不知道一个引用在何时应该被`release`掉，我们可以调用`@autoreleasepool`或者直接创建`NSAutoreleasePool`实例。

~~~ ruby
NSAutoreleasePool *a = [[NSAutoreleasePool alloc] init];
NSDate *x = [[[NSDate alloc] init] autorelease];
~~~

~~~ ruby
@autoreleasepool {
    NSDate *x = [[[NSDate alloc] init] autorelease];
}
~~~

也就是说，在创建对象的时候，发送**autorelease**消息，然后当`NSAutoreleasePool`结束时，标记过`autorelease`消息的对象就会自动被release掉。

在ARC机制启动的时候，不用手动发送**autorelease**消息，ARC机制会自动加载该消息，在`@autoreleasepool`中写的实例，效果同`NSAutoreleasePool`。

通过对[Apple文档](https://developer.apple.com/library/ios/documentation/Cocoa/Conceptual/MemoryMgmt/Articles/mmAutoreleasePools.html)的总结，大概有一下场景会使用到`@autoreleasepool`块

* 基于命令行的程序（OS X Application Command Line Done），也就是没有UI Framework。
* 循环中会创建大量的临时变量。（在下一次迭代前，会将这些对象自动释放，有利于程序的最大内存占用）。
* 创建一个非Cocoa程序创建线程。
* 后台长时间运行的任务。

#### 利用@autoreleasepool优化循环demo

~~~ ruby
// 官方文档的demo
– (id)findMatchingObject:(id)anObject {
    id match;
    while (match == nil) {
        @autoreleasepool {
 
            /* Do a search that creates a lot of temporary objects. */
            match = [self expensiveSearchForObject:anObject];
            if (match != nil) {
                [match retain]; /* Keep match around. */
            }
        }
    }
    return [match autorelease];   /* Let match go and return it. */
}
~~~

另外还有一个很好的可视化实验，可以看这个大神的[github](https://github.com/zekunyan/AutoReleasePoolTestExample)

之后可以说说两种RC机制管理内存方式的区别。对于Objective-C，一块内存地址可以被多个对象引用，每引用一次，其引用计数就会增1；对象每接触一次引用，其引用计数就会减一。MRC在内存管理上需要我们手动完成，即调用`retain`、`release`来增减对应对象的引用计数，**手动实现谁引用，谁释放的过程**。而在ARC机制下，我们将所有的引用计数使用**自释放池**（auroreleasepool）来管理，无需自己手动操作。从而防止了不应该的空引用问题。

那么使用ARC机制就不会出现内存泄露的问题吗？答案肯定是否定的。在笔者google了大量的资料后，发现使用ARC机制后，还会出现以下两种最常见的泄露问题。

### 循环参照

如下场景，有A、B两个类。A中有个属性参照B，B中也有个属性参照A，如果A和B都是`strong`参照的话，两个对象都无法释放。这种问题在代理声明(delegate)的时候经常会发生。

~~~ ruby
// SampleViewController.h

#import "SampleClass.h"

@interface SampleViewController
@property (nonatomic, strong) SampleClass *sampleClass;
@end
~~~

~~~ ruby
// SampleClass.h

#import "SampleViewController.h"

@interface SampleClass
@property (nonatomic, strong) SampleViewController *delegate;
@end
~~~

在解决以上问题中，只要把`SampleClass`中的`delegate`属性的`strong`改为`weak`即可。其解决原因我们需要看属性的各种**修饰属性**具体描述。

在ARC机制下，引入的`strong`和`weak`的变量修饰属性，笔者觉得最好的定义在《Learning Cocoa with Objective-C, 4th Edition》这本书的34页中。【文章末尾处会给出这本书的pdf下载链接】：

* **strong**：会创建一个强引用对象直接存储在内存中。
* **weak**：会创建一个若引用对象指向数据，储存在内存中，但是不会增加引用计数。所以若引用对象总能保证一个数据引用对象，故**weak具有线程安全性**。

单说strong和weak的区别实在不好表述，但是我们可以这么去想，结合下面的例子更加清晰：**当一个变量如果没有strong引用指向时，在函数块结束后立即release。**

~~~ ruby
import "ViewController.h"

@interface ViewController ()

@property (nonatomic, strong) NSDate *sr;
@property (nonatomic, weak) NSDate *wr;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self func1];
    [self func2];
}

- (void) func1 {
    NSDate *d1 = [[NSDate alloc] init];
    NSDate *d2 = [[NSDate alloc] init];
    self.sr = d1;
    self.wr = d2;
    NSLog(@"1: %@", self.sr);
    NSLog(@"2: %@", self.wr);
}

- (void) func2 {
    // 更换函数域后，查看引用的指向真值情况
    NSLog(@"3: %@", self.sr);
    NSLog(@"4: %@", self.wr);
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

@end
~~~

#### 输出结果

~~~ ruby
2016-03-25 15:54:05.767 testiOS[13021:321445] 1: 2016-03-25 07:54:05 +0000
2016-03-25 15:54:05.768 testiOS[13021:321445] 2: 2016-03-25 07:54:05 +0000
2016-03-25 15:54:05.768 testiOS[13021:321445] 3: 2016-03-25 07:54:05 +0000
2016-03-25 15:54:05.768 testiOS[13021:321445] 4: (null)
~~~

所以，当两个类进行强引用相互参照的时候，就无法使引用release，从而造成内存泄露问题。

### VC死循环

如果某个视图控制器中有无限循环，也会导致即使控制器对应的视图关掉了，其控制器也不会被释放。这种问题通常发生于**animation处理**。

~~~ ruby
CATransition *transition = [CATransition animation];
transition.duration = 0.5;
transition.repeatCount = HUGE_VALL;
[self.view.layer addAnimation: transition forKey: "myAnimation"];
~~~

如果Animation重复次数是一个很大的值，其视图已经释放，而控制器的引用仍然保留，显然造成泄露。

最后简单了解一下**Toll-Free Bridging**。有些数据类型能够在**Core Foundation Framework**和**Foundation Framework**之间交换使用。这以为这，对于同一个数据类型，既可以将其作为参数传入Core Foundation函数，也可以将其作为接收者对其发送 Objective-C 消息。这种在 Core Foundation 和 Foundation 之间交换使用数据类型的技术就叫 Toll-Free Bridging。

举例下

~~~ ruby
// ARC 环境下 
// Bridging from ObjC to CF 
NSString *hello = @"world"; 
CFStringRef world = (__bridge CFStringRef)(hello); 
NSLog(@"%ld", CFStringGetLength(world)); 
~~~

大多数的Core Foundation 和 Foundation 的数据类型可以使用这个技术相互转换，Apple 的文档里有一个[列表](https://developer.apple.com/library/ios/documentation/General/Conceptual/CocoaEncyclopedia/Toll-FreeBridgin/Toll-FreeBridgin.html)，列出了支持这项技术的数据类型。

如果以后有机会，在对Toll-Free Bridging深入的学习。

---

### 相关资料

[《Learning Cocoa with Objective-C, 4th Edition》](http://pan.baidu.com/s/1skDb0L3)