---
layout: post
author: Desgard_Duan
title: Automatic Reference Counting in Objective-C
category: learning
tag: [iOS]
---
假期项目总结第一篇。想把假期在项目中学到的东西总结一番。

##概述
在**Objective-C**中，内容的引用计数让人恼火。尤其是涉及到**arc**、**blocks**等等的时候。当**ARC**机制开启后，只有对应用计数机制更加了解，才能避免**Cycle Retain**、**Crash**等问题的出现。

但是由于使用**ARC**可以显著提高编码效率，所以建议尽量启用**ARC**，**Objective-C**中内存管理主要依赖引用计数，二队应用技术的影响又依赖修饰属性（即`@property`属性），我们先从此说起。

<!-- more -->
##属性
### （1）修饰属性
####读写控制
* **readwrite**：可读科协，会自动生成`getter`和`setter`方法。
* **readonly**：只读，只会生成`getter`方法，不会生成`setter`方法。

####引用方式
* **copy**：拷贝，复制一个对象并创建`strong`关联，引用计数为1，原来对象计数不变。。
* **assign**：赋值，不涉及引用计数的变化，弱引用。**ARC**中对象不能使用`assign`，但原始类型(`bool`、`int`、`float`)仍然可以使用。
* **retain**：持有，对原对象引用计数加1，强引用。**ARC**中使用`strong`。
* **weak**：复制（ARC），比`assign`多了一个功能，对象释放后把指针为`nil`，避免了野指针。
* **strong**：持有（ARC），等同于`retain`。

####线程安全
* **nonatomic**：非**原子操作(atomic operation)**，不加同步，多线程访问可提高性能，但不是线程安全的。
* **atomic**：原子操作，与`nonatomic`相反。

### （2）修饰变量
* **__strong**：是缺省的关键词，强引用。
* **__weak**：声明了一个可以自动置`nil`的弱引用（**ARC**中）。
* **__unsafe_unretained**：声明一个弱引用，但是不会自动`nil`化（只有**iOS 4** 才应该使用）。
* **__autoreleasing**：用来修饰一个函数的参数，这个参数会在函数返回的时候被自动释放(类似`autorelease`)。

### （3）默认的引用计数
* **alloc**：分配对象，分配后引用计数为1。
* **autorelease**：对象引用计数减1，但如果为0不马上释放，等待最近一个**pool**时释放。

##使用ARC
ARC，全称叫**Automatic Reference Counting**，该机制从**iOS 5**开始开始导入。简单地说，就是代码中自动加入了**retain/release**。

打开**ARC**时，不能使用**retainrelease autorelease**操作的，原先需要手动添加的用来处理内存管理的引用计数的代码可以自动地由编译器完成了，但是需要在对象属性上使用`weak`和`strong`, 其中`strong`就相当于`retain`属性，而`weak`相当于`assign`，基础类型还是使用`assign`。

### （1）strong还是weak
* 说到底就是一个归属权的问题。小心出现循环引用导致内存无法释放，或者需要引用的对象过早被释放。大体上：**IBOutlet**可以为`weak`，**NSString**为`copy`或`strong`，**Delegate**一般为`weak`，基础类型用`assign`，不过要注意具体使用情况。

### （2）outlet使用strong还是weak
* 官方文档建议一般**outlet**属性都推荐使用`weak`，不是直接作为**main view**里面一个subView直接显示出来，而是需要通过实例化创建出来的view，应该使用`strong`(自己创建的自己当然要保持引用了)。但是要注意使用`weak`时不要丢失对象的所有权，否则应该使用`strong`。

### （3）delegate使用strong还是weak
* **delegate**主要涉及到互相引用和**crash(引用被释放)问题**，为了防止这两个问题发生，**delegate**一般使用`weak`。先看代码：

<div>
<pre class="brush: applescript">
// MyClassDelegate协议
@protocol MyClassDelegate &ltNSObject&gt
- (void)myClassOnSomeEvent: (MyClass *)myClass;
@end
 
// MyClass类
@interface MyClass
// (1)这里使用weak
@property (weak, nonatomic) id&ltMyClassDelegate&gt delegate;   
@end
 
@interface myViewController
//在myViewController中创建一个MyClass
@property (strong, nonatomic) MyClass *myClass;
@end
 
@implementation myViewController
- (void)someAction {
    myClass = [[MyClass alloc] init];    // (2)
    myClass.delegate = self;             // (3)
    // ....
}
@end
</pre>
</div>

在**myViewController**中，执行**(2)**时，**myViewController**将会持有一个**MyClass的引用**。执行**(3)**时，**myClass**也会应用**myViewController**。

##关于block和引用计数
### （1）修饰block
如果需要**block**在它被声明的作用域被销毁后继续使用的话，你就需要做一份拷贝。拷贝会把**block**移到堆里面。所以，使用**@property**时设置通常如下：
<div>
<pre class="brush: applescript">
// 声明方式
@property(copy, nonatomic) void(^block)(void);
</pre>
</div>

###（2）retain cycle 的问题
**block**在实现时就会对它引用到的它所在方法中定义的栈变量进行一次只读拷贝，然后在**block**块内使用该只读拷贝。所以在使用**block**过程中，经常会遇到**retain cycle**的问题，例如：
<div>
<pre class="brush: applescript">
- (void)dealloc {
   [[NSNotificationCenter defaultCenter]removeObserver:_observer];
}
 - (void)loadView {
    [super loadView];
    _observer = [[NSNotificationCenterdefaultCenter] 
        addObserverForName:@"testKey"
                        object:nil
                        queue:nil
                        usingBlock:^(NSNotification*note) {
        [sselfdismissModalViewControllerAnimated:YES];
    }];
}
</pre>
</div>
在**block**中使用**self**之前先用一个**__weak**变量引用**self**，导致**block**不会**retain self**，打破**retain cycle**，然后在**block**中使用**wself**之前先用**__strong**类型变量引用**wself**，以确保使用过程中不会**deallo**c。简而言之就是推迟对**self**的**retain**，在使用时才进行**retain**。

###（3）return一个block
返回一个**block**时，**ARC**会自动将**block**加上**autorelease**，所以需要注意，如果执行过程中不能接受在**runloop**接受后才释放**block**，就需要自己加入**@autoreleasepool**块，但是测试发现64位iOS/mac时，系统会自动在使用结束后立即释放，32位则要等到**runloop**结束。

<div>
<pre class="brush: applescript">
- (void)test {
   //@autoreleasepool{
   AutoTest *a = [AutoTestsAutoTest];
   NSLog(@“1”);
   a = nil;
   NSLog(@"2");
   a = [[AutoTest alloc] init];
   //}
   NSLog(@"3");
}
- (IBAction)ok:(id)sender {
   [self test];
   NSLog(@"4");
}
</pre>
</div>

####执行结果
<div>
<pre class="brush: ps">
// console 输出
1释放23释放4   64位
123释放4释放   32位
12释放释放34   32位＋@autoreleasepool
</pre>
</div>

###（4）block作为参数
**block**作为参数时，如果使用范围超过了**block**的作用域（比如异步时，或者将**block**传递给其他对象等等），则需要**copy**此**block**，**copy**建议在使用此**block**的方法内实现（谁使用，谁管理），而不是在传递参数时**copy**。注意，**block**过一个**strong**类型的指针时，会自动**copy**。经过**copy**过的**block**会从栈空间移动到堆上，并且，**copy**一个已经在堆上的**block**时，此**block**不会受影响。