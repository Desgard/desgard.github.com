---
layout: post
title: "Learning Key-Value Observing"
date: 2016-05-13 01:01:00
image: '/assets/img/'
description: 'KVO, I need to get it.'
tags:
- iOS
categories:
- Happy time in iOS
twitter_text: 'Learning Key Value Observing'
weibo_text: 'Learning Key Value Observing'
---

最近在忙于做各种项目，也就没有时间来动笔写一些知识性的总结。前几天在看《Pro Objective-C Design Patterns for iOS》时，看到了观察者模式中的KVO实现方式，于是自己又将旧知识回顾了一下，并且深入学习。

## 何为KVO？

**Key-Value Observing**是Objc中对**观察者设计模式**的一种实现。（笔者注：另外一种是**通知机制：Notification**。）

KVO提供了一种机制，制定一个被观察对象，当对象某个属性发生更改时，并作出相应处理。且不需要给被观察对象添加任何额外的代买，就能使用KVO机制。

在MVC设计架构下的项目，KVO机制很适合实现Model模型和View视图之间的通信。例如：在模型类A创建属性数据，在控制器中创建观察者，一旦属性数据发生改变就使观察者收到通知，通过KVO后再使控制器使用回调方法处理实现视图B的更新。

## 实现原理

在[Apple的API官方文档](https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/KeyValueObserving/Articles/KVOImplementation.html)中，有以下对于KVO的介绍：

> Automatic key-value observing is implemented using a technique called isa-swizzling… When an observer isregistered for an attribute of an object the isa pointer of the observed object is modified, pointing to an intermediate class rather than at the true class

KVO的实现依赖于Objc强大的`Runtime`，以上文档简易介绍了：KVO被观察对象的**isa指针**会指向一个中间类，而不是原来真正的类。在Google一番之后，得到了KVO基本的原理：

### 基本原理

当观察某个对象A时，KVO机制会动态创建一个对象A当前类的子类，并为这个新的子类重写了呗观察属性keyPath的setter方法。setter方法随后负责通知观察对象属性的改变状况。Apple使用了**isa-swizzling**（isa混写）来实现KVO。当观察对象A时，KVO机制动态创建一个新的名为：`NSKVONotifying_A`重写观察属性的setter方法，setter方法会负责在调用原setter方法的前后，通知所有观察对象值的更改情况。

* `NSKVONotifying_A`类剖析：过程中，被观察对象的isa指针从指向原来的A类，被KVO机制修改为指向**系统新创建的子类`NSKVONotifying_A`，从而实现当前类的属性值改变的监听。
    * 所以当我们从应用层面上看来，没有完全意识到有新类出现，这是系统“隐瞒”了对KVO底层实现过程，让我们以为是原来的类。但如果此时创建一个新的`NSKVONotifying_A`的类，就会发现系统运行到注册KVO代码时候程序就崩溃，英文系统在注册监听的时候动态创建了名为`NSKVONotifying_A`的中间类，并指向这个中间类。
* isa指针的作用：每个对象都有isa指针，该指向该对象的类，它告诉Runtime系统这个对象的类是什么。所以对象注册为观察者时，isa指针指向新子类，于是这个被观察的对象变成新子类的的实例了。因而在该对象上对setter的调用则会调用重写的setter，从而激活键值通知机制。
* 子类setter方法剖析：KVO键值观察通知依赖于`NSObject`的两个方法，`willChangeValueForKey: `和`didChangeValueForKey: `，在存取数值的前后分别调用两个方法。

## KVO的特点

观察者贯彻的是属性，只有遵循KVO变更属性值的方式才会执行KVO的回调方法，例如是否执行了setter方法，或者是否使用了KVC赋值方法。如果赋值没有通过setter方法或者KVC，而是直接修改属性对应的成员变量，例如调用`_name = @"newName";`，此类操作是不会触发KVO机制，更不会调用回调方法。

所以使用KVO机制前提是遵循KVO属性设置方式来变更属性值。

## KVO的简单使用

虽然了解过KVO的原理，但是始终没有机会去使用KVO。这里用一个简单的小例子来使用一下KVO机制。假设我们现在有一个`Student`类，他可以提供当前学生正在进行的课程。但是学生上的课并不由自己决定，要由其他因素决定，比如随着时间变化所上的课程要发生变化。另外，我们做有个显示界面，为了使用KVO，用这个View实时监视Student当前课程，并且显示出来。每当Student课程更换时，我们可以第一时间获取到变化情况，并且做出相应的动作。

以下是`Student.h`

{% highlight ruby %}
@interface Student : NSObject {
    NSString *name;
    NSString *courseName;
}

-(void)changeCourseName:(NSString*) newCourseName;
@end
{% endhighlight %}

我们简单的实现以下初始化`newCourseName`方法

{% highlight ruby %}
#import "Student.h"

@implementation Student

-(void)changeCourseName:(NSString*) newCourseName {
    courseName = newCourseName;
}

@end
{% endhighlight %}

然后简单的实现一下显示层的控制器代码：

{% highlight ruby %}
#import "ViewController.h"
#import "Student.h"

@interface ViewController() {
    Student *student;
}

@end

@implementation ViewController

- (void) observeValueForKeyPath: (NSString *)keyPath
                       ofObject: (id)object
                         change: (NSDictionary *)change
                        context: (void *)context {
    if ([keyPath isEqual:@"courseName"]) {
        NSLog(@"PageView课程被改变了");
        NSLog(@"PageView新课程是:%@ 老课程是:%@", [change objectForKey:@"new"], [change objectForKey:@"old"]);
    }
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    student = [[Student alloc] init];
    [student addObserver: self
              forKeyPath: @"courseName"
                 options: (NSKeyValueObservingOptionOld|NSKeyValueObservingOptionNew)
                 context: nil];
    [student changeCourseName: @"数学课"];
    NSLog(@"初始值:%@", [student valueForKey:@"courseName"]);
    
    [student setValue:@"化学课" forKey:@"courseName"];
}

@end
{% endhighlight %}

执行后我们得到以下输出：

{% highlight ruby %}
2016-05-14 12:25:35.624 testiOS[21345:5994119] 初始值:数学课
2016-05-14 12:25:35.625 testiOS[21345:5994119] PageView课程被改变了
2016-05-14 12:25:35.625 testiOS[21345:5994119] PageView新课程是:化学课 老课程是:数学课
{% endhighlight %}


分析输出结果，我们可以发现，当调用`Student`的setter方法，我们的观察者View就可以直接获取到这个动作，并且回调函数`observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context`，从而实现了KVO机制下的`观察者模式`。

## 一些总结

对比其他的回调方式，KVO机制的运用的实现，更多的由系统支持，相比Notification、Delegate等更加简洁一些，并且还能提供观察属性的最新值以及原始值。但相应的在创建子类、重写方法等等方面的内存消耗是很巨大的。所以对于两个类之间的通信，我们可以根据实际开发的环境采用不同的方法，使得开发的项目更加简洁实用。

另外要注意的是，由于这种集成方式的注入是在运行时，而不是在编译时实现的，如果给定的实例没有观察者，那么KVO不会有任何开销。相比于Delegate和Notification，这也是KVO零开销观察的优势所在。

---



[Glow技术博客·如何自己动手实现 KVO【顾鹏】](http://tech.glowing.com/cn/implement-kvo/)

[KVO Implementation【Mike Ash】](https://www.mikeash.com/pyblog/friday-qa-2009-01-23.html)

[Key-Value Observing Done Right【Mike Ash】](https://www.mikeash.com/pyblog/key-value-observing-done-right.html)