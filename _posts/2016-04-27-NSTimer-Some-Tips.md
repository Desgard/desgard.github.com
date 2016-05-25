---
layout:     post
title:      "Some Tips About NSTimer"
subtitle:   "NSTimer其实不难"
date:       2016-04-26 01:01:00
author:     "Desgard_Duan"
header-img: "img/post-bg-timer.jpg"
tags:
    - iOS
    - Objective-C
---
在制作之前的项目还有正在接手的跑步软件中，都使用到了`NSTimer`。今天深究后，发现之前写的代码在使用`NSTimer`时出现了内存泄露。于是查阅了相关文档，进行进一步的学习。

## NSTimer

### 从一个fire触发方法开始

先用`NSTimer`做一个简单的循环器，每间隔3秒输出一个Circle.。以下就是直接做法：

{% highlight ruby %}
@interface ViewController()
@property (nonatomic, weak) NSTimer *timer;
@end

@implementation ViewController
- (void)viewDidLoad {
    [super viewDidLoad];
    _timer = [NSTimer scheduledTimerWithTimeInterval: 3.0f
                                              target: self
                                            selector: @selector(log:)
                                            userInfo: nil
                                             repeats: YES];
    
    [_timer fire];
}

- (void) log: (id) userInfo {
    NSLog(@"Circle.");
}
@end
{% endhighlight %}

运行之后效果可以实现，但是当从这个界面跳转到其他的界面时，控制台还在不断输出Circle.，看来`NSTimer`并没有停止。

### 让人迷惑的invalidate

通过查阅`NSTimer`中的方法，我们发现了`invalidate`方法，直觉上讲是与`fire`相对应的方法，于是在`dealloc`周期末尾中插入一下代码：

{% highlight ruby %}
- (void) dealloc {
    [_timer invalidate];
}
{% endhighlight %}

再次启动程序发现还是没有停止。其原因，其实是`NSTimer`的**强引用机制**，在`Timer`添加到`Runloop`的时候，会被`Runloop`强引用：

> Note in particular that run loops maintain strong references to their timers, so you don’t have to maintain your own strong reference to a timer after you have added it to a run loop.

然后`Timer`又会对`Target`强引用，也就是对于`self`而言的。于是变成了iOS中最忌讳的**循环引用**问题。

> Target is the object to which to send the message specified by aSelector when the timer fires. The timer maintains a strong reference to target until it (the timer) is invalidated.

`NSTimer`强引用了`self`，导致`self`无法释放，所以`dealloc`形同虚设，`self`的生命周期无法完成。所以，我们需要去主动调用`invalidate`方法，我们可以另外增加一个按钮来执行终止操作。在官方文档中，我们要注意这两点关于`NSTimer`释放的问题：

> 1.You must send this message from the thread on which the timer was installed. If you send this message from another thread, the input source associated with the timer may not be removed from its run loop, which could prevent the thread from exiting properly.

即**线程单一性**问题，我们可以把每个线程当做一个消息发出者，这也就好似KVC的思想，谁（哪个线程）创建，谁停止。否则的话导致资源不能正确释放。

> 2.This method is the only way to remove a timer from an NSRunLoop object. The NSRunLoop object removes and releases the timer, either just before the invalidate method returns or at some later point.If it was configured with target and user info objects, the receiver releases its references to those objects as well.

这里的意思就是说：`invalidate`方法是唯一一个把定时器从一个运行循环中移除的方法。`NSRunLoop Object`这个对象移除，并且`release`掉这个定时器。还有可能是在`invalidate`方法返回前后的某个时间段，进行`release`操作。所以我们只需要把`NSTimer`当做一个必须手动释放的类，并且这里有一个很有意思的小细节，也是我从[stackoverflow](http://stackoverflow.com/questions/15170518/how-to-stop-invalidate-nstimer)看见的。

{% highlight ruby %}
- (IBAction)stopCircle:(id)sender {
    [_timer invalidate];
    self._timer = nil; // 有趣的细节
}
{% endhighlight %}

其愿意大家可以自行google：`release`和`Object = nil`的区别。我个人的理解就是当执行`[Object release];`时，这个对象没有指向任何内存空间，这个时候它成为野指针，所以当我们对其进行访问时，会出现工程崩溃的情况。而`Object = nil;`执行后，这个对象指向了一个新的内存空间`0x0000`，即初始地址，这个时候指针有其指向的对象。所以，若一个对象在释放时需要我们手动写入`release`方法，我们在下一行紧跟`= nil;`语句，是一个很好的习惯。

### 问题回归dealloc

若我们想让改控制器销毁后才停止，我们应该怎么去搞呢？我们对官方文档中的`NSTimer`类进行分析：

* `NSTimer`被`Runloop`强引用后，若释放就需要`invalidate`方法；
* 目标是在控制器生命周期的`dealloc`中调用`invalidate`方法，但是`self`和`NSTimer`循环引用，无法执行到该位置；
* 还是需要先释放`NSTimer`，然而不调用`invalidate`就无法释放；
* 不进入`dealloc`我就不能调用`invalidate`方法；
* ……似乎我也进入了循环。

## 思路转换直至WeakTimer

### block的常客，weakSelf

在`block`中，若出现相互引用，条件发射就是对`self`做一个`weak`的声明，就能将强引用循环问题解决。于是得到以下代码。

{% highlight ruby %}
__weak typeof(self) weakSelf = self;
_timer = [NSTimer scheduledTimerWithTimeInterval: 3.0f
                                          target: weakSelf
                                        selector: @selector(log:)
                                        userInfo: nil
                                         repeats: YES];
{% endhighlight %}

这里的`__weak`关键字并没有把`self`抽离出来，`__weak`和`__strong`的区别是：在执行期间，如果`self`被释放，`NSTimer`的`target`会变成`nil`。

### 利用block，解决问题

参照网上的方式，我们可以重写`target`传入的参数。可以把`target`当做一个代理，它只要接下`NSTimer`的强引用就可以了。为了调用方便，我们使用`Category`对`NSTimer`增加扩展block方法。我们的思路已经很明确，我们将`target`做一个替代接受者，将循环的方法独立出来制作成`block`。用形象的示意图来描述下关系：

<center>
<svg id="drawing" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="624" height="222" viewBox="215 227 624 222"><defs id="SvgjsDefs1001"><marker id="SvgjsMarker1020" markerWidth="16.23606797749979" markerHeight="10.550836550532098" refX="-1" refY="3.8990363547948754" viewBox="-1 -1.3763819204711738 16.23606797749979 10.550836550532098" orient="auto" markerUnits="userSpaceOnUse"><path id="SvgjsPath1021" d="M12 3.8990363547948754L0 7.798072709589751V0Z " stroke="#323232" stroke-width="2" fill="#323232" transform="matrix(1,0,0,1,0,0)"></path></marker><marker id="SvgjsMarker1035" markerWidth="16.23606797749979" markerHeight="10.550836550532098" refX="-1" refY="3.8990363547948754" viewBox="-1 -1.3763819204711738 16.23606797749979 10.550836550532098" orient="auto" markerUnits="userSpaceOnUse"><path id="SvgjsPath1036" d="M12 3.8990363547948754L0 7.798072709589751V0Z " stroke="#323232" stroke-width="2" fill="#323232" transform="matrix(1,0,0,1,0,0)"></path></marker><marker id="SvgjsMarker1046" markerWidth="16.23606797749979" markerHeight="10.550836550532098" refX="15.23606797749979" refY="3.8990363547948754" viewBox="-1 -1.3763819204711738 16.23606797749979 10.550836550532098" orient="auto" markerUnits="userSpaceOnUse"><path id="SvgjsPath1047" d="M12 3.8990363547948754L0 7.798072709589751V0Z " stroke="#323232" stroke-width="2" fill="#323232" transform="matrix(-1,1.2246467991473532e-16,-1.2246467991473532e-16,-1,14.23606797749979,7.79807270958975)"></path></marker></defs><g id="SvgjsG1007"><path id="SvgjsPath1008" d="M215 227H839V449H215V227Z " fill-opacity="1" fill="#ffffff"></path><g id="SvgjsG1009"><g id="SvgjsG1010" transform="translate(235 253)" opacity="1"><path id="SvgjsPath1011" d="M0 4Q0 0 4 0L164 0Q168 0 168 4L168 52Q168 56 164 56L4 56Q0 56 0 52Z " stroke-dasharray="none" stroke="#323232" stroke-width="2" fill="#ffffff" opacity="1"></path><g id="SvgjsG1012" transform="matrix(1 0 0 1 10 19.875)" fill="#ffffff"><text id="SvgjsText1013" font-family="微软雅黑,黑体,Arial,SimSun" fill="#000000" font-size="13" font-weight="normal" font-style="normal" text-anchor="middle" text-decoration="blink" x="74" y="12">ViewController</text></g></g><g id="SvgjsG1014" transform="translate(525 254)" opacity="1"><path id="SvgjsPath1015" d="M0 4Q0 0 4 0L103 0Q107 0 107 4L107 50Q107 54 103 54L4 54Q0 54 0 50Z " stroke-dasharray="none" stroke="#323232" stroke-width="2" fill="#ffffff" opacity="1"></path><g id="SvgjsG1016" transform="matrix(1 0 0 1 10 18.875)" fill="#ffffff"><text id="SvgjsText1017" font-family="微软雅黑,黑体,Arial,SimSun" fill="#000000" font-size="13" font-weight="normal" font-style="normal" text-anchor="middle" text-decoration="blink" x="43.5" y="12">NSTimer</text></g></g><g id="SvgjsG1018"><path id="SvgjsPath1019" d="M403 281C451.8 281 476.2 281 509.7639320225002 281 " stroke-dasharray="2 3" stroke="#323232" stroke-width="2" fill="none" marker-end="url(#SvgjsMarker1020)"></path><g id="SvgjsG1022" transform="matrix(1 0 0 1 462.09549150281254 272.875)"><path id="SvgjsPath1023" d="M0 0H0V0H0V0Z " fill="#ffffff" transform="translate(0 0)"></path><text id="SvgjsText1024" font-family="Microsoft Yahei,SimSun" fill="#000000" font-size="13" font-weight="normal" font-style="normal" text-anchor="middle" text-decoration="blink" x="0" y="0"></text></g></g><g id="SvgjsG1025" transform="translate(382 247)" opacity="1"><path id="SvgjsPath1026" d="M0 0L160 0L160 40L0 40Z " stroke-dasharray="none" stroke-width="0" stroke="#323232" fill="none" opacity="1"></path><g id="SvgjsG1027" transform="matrix(1 0 0 1 0 11.875)" fill="#ffffff"><text id="SvgjsText1028" font-family="微软雅黑,黑体,Arial,SimSun" fill="#000000" font-size="13" font-weight="normal" font-style="normal" text-anchor="middle" text-decoration="blink" x="80" y="12">weak</text></g></g><g id="SvgjsG1029" transform="translate(265.5 388)" opacity="1"><path id="SvgjsPath1030" d="M0 4Q0 0 4 0L96 0Q100 0 100 4L100 37Q100 41 96 41L4 41Q0 41 0 37Z " stroke-dasharray="none" stroke="#323232" stroke-width="2" fill="#ffffff" opacity="1"></path><g id="SvgjsG1031" transform="matrix(1 0 0 1 10 12.375)" fill="#ffffff"><text id="SvgjsText1032" font-family="微软雅黑,黑体,Arial,SimSun" fill="#000000" font-size="13" font-weight="normal" font-style="normal" text-anchor="middle" text-decoration="blink" x="40" y="12">Target代替类</text></g></g><g id="SvgjsG1033"><path id="SvgjsPath1034" d="M578.5 308L578.5 348L315.5 348L315.5 372.7639320225002 " stroke-dasharray="none" stroke="#323232" stroke-width="2" fill="none" marker-end="url(#SvgjsMarker1035)"></path><g id="SvgjsG1037" transform="matrix(1 0 0 1 454.61803398874986 339.875)"><path id="SvgjsPath1038" d="M0 0H0V0H0V0Z " fill="#ffffff" transform="translate(0 0)"></path><text id="SvgjsText1039" font-family="Microsoft Yahei,SimSun" fill="#000000" font-size="13" font-weight="normal" font-style="normal" text-anchor="middle" text-decoration="blink" x="0" y="0"></text></g></g><g id="SvgjsG1040" transform="translate(723 261)" opacity="1"><path id="SvgjsPath1041" d="M0 4Q0 0 4 0L92 0Q96 0 96 4L96 36Q96 40 92 40L4 40Q0 40 0 36Z " stroke-dasharray="none" stroke="#323232" stroke-width="2" fill="#ffffff" opacity="1"></path><g id="SvgjsG1042" transform="matrix(1 0 0 1 10 11.875)" fill="#ffffff"><text id="SvgjsText1043" font-family="微软雅黑,黑体,Arial,SimSun" fill="#000000" font-size="13" font-weight="normal" font-style="normal" text-anchor="middle" text-decoration="blink" x="38" y="12">Runloop</text></g></g><g id="SvgjsG1044"><path id="SvgjsPath1045" d="M647.2360679774998 281L677.5 281L677.5 281L723 281 " stroke-dasharray="none" stroke="#323232" stroke-width="2" fill="none" marker-start="url(#SvgjsMarker1046)"></path><g id="SvgjsG1048" transform="matrix(1 0 0 1 685.1180339887499 272.875)"><path id="SvgjsPath1049" d="M0 0H0V0H0V0Z " fill="#ffffff" transform="translate(0 0)"></path><text id="SvgjsText1050" font-family="Microsoft Yahei,SimSun" fill="#000000" font-size="13" font-weight="normal" font-style="normal" text-anchor="middle" text-decoration="blink" x="0" y="0"></text></g></g><g id="SvgjsG1051" transform="translate(378 348)" opacity="1"><path id="SvgjsPath1052" d="M0 0L160 0L160 40L0 40Z " stroke-dasharray="none" stroke-width="0" stroke="#323232" fill="none" opacity="1"></path><g id="SvgjsG1053" transform="matrix(1 0 0 1 0 11.875)" fill="#ffffff"><text id="SvgjsText1054" font-family="微软雅黑,黑体,Arial,SimSun" fill="#000000" font-size="13" font-weight="normal" font-style="normal" text-anchor="middle" text-decoration="blink" x="80" y="12">strong</text></g></g><g id="SvgjsG1055" transform="translate(604 247)" opacity="1"><path id="SvgjsPath1056" d="M0 0L160 0L160 40L0 40Z " stroke-dasharray="none" stroke-width="0" stroke="#323232" fill="none" opacity="1"></path><g id="SvgjsG1057" transform="matrix(1 0 0 1 0 11.875)" fill="#ffffff"><text id="SvgjsText1058" font-family="微软雅黑,黑体,Arial,SimSun" fill="#000000" font-size="13" font-weight="normal" font-style="normal" text-anchor="middle" text-decoration="blink" x="80" y="12">strong</text></g></g></g></g></svg>
</center>

我们可以看出循环引用问题通过一个替代target目标，已经得以解决。下面我们用`category`为`NSTimer`类增加block方法：

{% highlight ruby %}
#import "NSTimer+Block.h"

@implementation NSTimer (Block)

+ (id) scheduledTimerWithTimeInterval: (NSTimeInterval)inTimeInterval
                              block: (void (^)())inBlock
                            repeats: (BOOL)inRepeats {
    void (^block)() = [inBlock copy];
    id ret = [self scheduledTimerWithTimeInterval: inTimeInterval
                                           target: self
                                         selector: @selector(jdExecuteSimpleBlock:)
                                         userInfo: block repeats:inRepeats];
    return ret;
}

+ (id) timerWithTimeInterval: (NSTimeInterval)inTimeInterval
                     block: (void (^)())inBlock
                   repeats: (BOOL)inRepeats {
    void (^block)() = [inBlock copy];
    id ret = [self timerWithTimeInterval: inTimeInterval
                                  target: self
                                selector: @selector(jdExecuteSimpleBlock:)
                                userInfo: block
                                 repeats: inRepeats];
    return ret;
}

+ (void) jdExecuteSimpleBlock:(NSTimer *)inTimer; {
    if([inTimer userInfo]) {
        void (^block)() = (void (^)())[inTimer userInfo];
        block();
    }
}

@end

{% endhighlight %}

最后，我们在`dealloc`声明周期中调用`invalidate`，效果实现。

{% highlight ruby %}
@interface ViewController()

@property (nonatomic, weak) NSTimer *timer;

@end

@implementation NextViewController


- (void)viewDidLoad {
    [super viewDidLoad];
    _timer = [NSTimer scheduledTimerWithTimeInterval: 3.0f
                                               block: ^{
                                                   NSLog(@"Circle");
                                               }
                                             repeats: YES];
}

- (void) dealloc {
    [_timer invalidate];
}

@end

{% endhighlight %}
