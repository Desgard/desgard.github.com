---
layout: post
author: Desgard_Duan
title: Multithreading in Objective-C
category: learning
tag: [iOS]
---

今天开始多线程的学习，自从去年面过阿里后，线程和进程有什么区别自己已经深刻的领悟到了。但是在平时的项目学习中，很少的使用到了多线程这个技术，所以再整理一遍。毕竟，面试的时候也经常提及到。

本博文讨论的知识归结成问题如下：

> 进程和线程的定义是什么？iOS中的多线程有哪些？他们之间各有什么区别，已经分别的优劣性？

## 概述

**多线程**技术是软件开发的重要技术，也是考核程序员对程序执行情况理解深度的一个很重要的标准。所以第三篇复习文主要讨论该方面知识。

<!-- more -->

## 线程和进程

**线程**：指在系统中**正在运行的一个应用程序**。每个进程之间都是独立的，每个进程均运行在其专用且受保护的内存空间内。

<center>
<svg id="drawing" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="280" height="188" viewBox="467.5 255.5 280 188"><defs id="SvgjsDefs1001"></defs><g id="SvgjsG1007" transform="translate(519.5 350.5)"><path id="SvgjsPath1008" d="M-52 -95H228V93H-52V-95Z " fill="#ffffff" opacity="1"></path><g id="SvgjsG1009"><path id="SvgjsPath1016" d="M0 2C0 -32 44.5 -66 89 -66 " fill="none" stroke="#aaaaaa" stroke-width="1"></path><path id="SvgjsPath1017" d="M0 2C0 -10 44.5 -22 89 -22 " fill="none" stroke="#aaaaaa" stroke-width="1"></path><path id="SvgjsPath1018" d="M0 0C0 12 44.5 24 89 24 " fill="none" stroke="#aaaaaa" stroke-width="1"></path><path id="SvgjsPath1019" d="M0 0C0 34 44.5 68 89 68 " fill="none" stroke="#aaaaaa" stroke-width="1"></path></g><g id="SvgjsG1010"><g id="SvgjsG1011" transform="translate(-42 -26.5)"><path id="SvgjsPath1012" d="M0 7A7 7 0 0 1 7 0H75A7 7 0 0 1 82 7V44A7 7 0 0 1 75 51H7A7 7 0 0 1 0 44Z " stroke="#bbbbbb" stroke-width="1" fill="#737373" opacity="1"></path><g id="SvgjsG1013" transform="translate(16 8)"><g id="SvgjsG1014" transform="translate(0 0)"><text id="SvgjsText1015" font-family="微软雅黑,SimSun" fill="#ffffff" font-size="25" font-weight="normal" font-style="normal" text-anchor="start" x="0" y="26.5">内存</text></g></g></g><g id="SvgjsG1020" transform="translate(88 -85)"><path id="SvgjsPath1021" d="M0 4A4 4 0 0 1 4 0H106A4 4 0 0 1 110 4V32A4 4 0 0 1 106 36H4A4 4 0 0 1 0 32Z " stroke="#bbbbbb" stroke-width="1" fill="#00cc66" opacity="1"></path><g id="SvgjsG1022" transform="translate(16 8)"><g id="SvgjsG1023" transform="translate(0 0)"><text id="SvgjsText1024" font-family="微软雅黑,SimSun" fill="#ffffff" font-size="14" font-weight="normal" font-style="normal" text-anchor="start" x="0" y="14.84375">移动QQ进程</text></g></g></g><g id="SvgjsG1025" transform="translate(88 -41)"><path id="SvgjsPath1026" d="M0 4A4 4 0 0 1 4 0H84A4 4 0 0 1 88 4V32A4 4 0 0 1 84 36H4A4 4 0 0 1 0 32Z " stroke="#bbbbbb" stroke-width="1" fill="#00cc66" opacity="1"></path><g id="SvgjsG1027" transform="translate(16 8)"><g id="SvgjsG1028" transform="translate(0 0)"><text id="SvgjsText1029" font-family="微软雅黑,SimSun" fill="#ffffff" font-size="14" font-weight="normal" font-style="normal" text-anchor="start" x="0" y="14.84375">迅雷进程</text></g></g></g><g id="SvgjsG1030" transform="translate(88 3)"><path id="SvgjsPath1031" d="M0 4A4 4 0 0 1 4 0H126A4 4 0 0 1 130 4V32A4 4 0 0 1 126 36H4A4 4 0 0 1 0 32Z " stroke="#bbbbbb" stroke-width="1" fill="#00cc66" opacity="1"></path><g id="SvgjsG1032" transform="translate(16 8)"><g id="SvgjsG1033" transform="translate(0 0)"><text id="SvgjsText1034" font-family="微软雅黑,SimSun" fill="#ffffff" font-size="14" font-weight="normal" font-style="normal" text-anchor="start" x="0" y="14.84375">网易云音乐进程</text></g></g></g><g id="SvgjsG1035" transform="translate(88 47)"><path id="SvgjsPath1036" d="M0 4A4 4 0 0 1 4 0H89A4 4 0 0 1 93 4V32A4 4 0 0 1 89 36H4A4 4 0 0 1 0 32Z " stroke="#bbbbbb" stroke-width="1" fill="#00cc66" opacity="1"></path><g id="SvgjsG1037" transform="translate(16 8)"><g id="SvgjsG1038" transform="translate(0 0)"><text id="SvgjsText1039" font-family="微软雅黑,SimSun" fill="#ffffff" font-size="14" font-weight="normal" font-style="normal" text-anchor="start" x="0" y="14.84375">xcode进程</text></g></g></g></g></g></svg>
</center>

**线程**：线程是进程的基本执行单元，一个进程（程序）的所有任务都在线程中执行。一个进程想要执行任务，必须得有线程（每一个进程至少需要有一条线程）。


<center>
<svg id="drawing" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="355" height="144" viewBox="423 277.5 355 144"><defs id="SvgjsDefs1001"></defs><g id="SvgjsG1007" transform="translate(519.5 350.5)"><path id="SvgjsPath1008" d="M-96.5 -73H258.5V71H-96.5V-73Z " fill="#ffffff" opacity="1"></path><g id="SvgjsG1009"><path id="SvgjsPath1016" d="M0 2C0 -21 66.5 -44 133 -44 " fill="none" stroke="#aaaaaa" stroke-width="1"></path><path id="SvgjsPath1017" d="M0 0C0 1 66.5 2 133 2 " fill="none" stroke="#aaaaaa" stroke-width="1"></path><path id="SvgjsPath1018" d="M0 0C0 23 66.5 46 133 46 " fill="none" stroke="#aaaaaa" stroke-width="1"></path></g><g id="SvgjsG1010"><g id="SvgjsG1011" transform="translate(-86.5 -26.5)"><path id="SvgjsPath1012" d="M0 7A7 7 0 0 1 7 0H164A7 7 0 0 1 171 7V44A7 7 0 0 1 164 51H7A7 7 0 0 1 0 44Z " stroke="#bbbbbb" stroke-width="1" fill="#5fd5a4" opacity="1"></path><g id="SvgjsG1013" transform="translate(16 8)"><g id="SvgjsG1014" transform="translate(0 0)"><text id="SvgjsText1015" font-family="微软雅黑,SimSun" fill="#ffffff" font-size="25" font-weight="normal" font-style="normal" text-anchor="start" x="0" y="26.5">移动QQ进程</text></g></g></g><g id="SvgjsG1019" transform="translate(132.5 -63)"><path id="SvgjsPath1020" d="M0 4A4 4 0 0 1 4 0H84A4 4 0 0 1 88 4V32A4 4 0 0 1 84 36H4A4 4 0 0 1 0 32Z " stroke="#bbbbbb" stroke-width="1" fill="#ff9999" opacity="1"></path><g id="SvgjsG1021" transform="translate(16 8)"><g id="SvgjsG1022" transform="translate(0 0)"><text id="SvgjsText1023" font-family="微软雅黑,SimSun" fill="#ffffff" font-size="14" font-weight="normal" font-style="normal" text-anchor="start" x="0" y="14.84375">聊天线程</text></g></g></g><g id="SvgjsG1024" transform="translate(132.5 -19)"><path id="SvgjsPath1025" d="M0 4A4 4 0 0 1 4 0H112A4 4 0 0 1 116 4V32A4 4 0 0 1 112 36H4A4 4 0 0 1 0 32Z " stroke="#bbbbbb" stroke-width="1" fill="#ff9999" opacity="1"></path><g id="SvgjsG1026" transform="translate(16 8)"><g id="SvgjsG1027" transform="translate(0 0)"><text id="SvgjsText1028" font-family="微软雅黑,SimSun" fill="#ffffff" font-size="14" font-weight="normal" font-style="normal" text-anchor="start" x="0" y="14.84375">消息推送线程</text></g></g></g><g id="SvgjsG1029" transform="translate(132.5 25)"><path id="SvgjsPath1030" d="M0 4A4 4 0 0 1 4 0H56A4 4 0 0 1 60 4V32A4 4 0 0 1 56 36H4A4 4 0 0 1 0 32Z " stroke="#bbbbbb" stroke-width="1" fill="#ff9999" opacity="1"></path><path id="SvgjsPath1031" d="M60 19L76 19 " stroke="rgba(0, 0, 0, 0)" stroke-width="1"></path><g id="SvgjsG1032" transform="translate(61 11)"><path id="SvgjsPath1033" d="M0 7A7 7 0 0 1 7 0A7 7 0 1 1 0 7Z " fill="#ffffff"></path><path id="SvgjsPath1034" d="M7 1A6 6 0 0 0 1 7A6 6 0 1 0 7 1ZM0 7A7 7 0 0 1 7 0A7 7 0 1 1 0 7ZM3 6H6V3H8V6H11V8H8V11H6V8H3V6Z " fill="#7c8084"></path></g><g id="SvgjsG1035" transform="translate(16 8)"><g id="SvgjsG1036" transform="translate(0 0)"><text id="SvgjsText1037" font-family="微软雅黑,SimSun" fill="#ffffff" font-size="14" font-weight="normal" font-style="normal" text-anchor="start" x="0" y="14.84375">……</text></g></g></g></g></g></svg>
</center>

一个线程中任务的执行时串行的，如果要在一个线程中执行多个任务，那么只能一个一个地按顺序执行这些任务。也就是说，在同一时间内，一个线程只能执行一个任务。这也就是常说的**线程的串行**。

## 多线程

同一时间，CPU只能处理一条线程在工作，多线程并发执行，其实是CPU快速地在多条线程之间的调度，如果CPU调度线程的时间足够快，就造成了多线程并发的假象。但是如果线程很多的情况下，则会消耗大量的CPU资源，每条线程被调度执行的频次会降低，即效率降低。

<center>
<svg id="drawing" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="515" height="312" viewBox="253.5 221.5 515 312"><defs id="SvgjsDefs1041"><marker id="SvgjsMarker1077" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" viewBox="0 0 5 5" orient="auto" markerUnits="userSpaceOnUse"><path id="SvgjsPath1078" d="M0 2.5A2.5 2.5 0 0 1 2.5 0A2.5 2.5 0 1 1 0 2.5 " fill="#71cb2d"></path></marker><marker id="SvgjsMarker1079" markerWidth="9" markerHeight="9" refX="0" refY="4.5" viewBox="0 0 9 9" orient="auto" markerUnits="userSpaceOnUse"><path id="SvgjsPath1080" d="M9 4.5L0 9L0 0Z " fill="#71cb2d"></path></marker><marker id="SvgjsMarker1083" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" viewBox="0 0 5 5" orient="auto" markerUnits="userSpaceOnUse"><path id="SvgjsPath1084" d="M0 2.5A2.5 2.5 0 0 1 2.5 0A2.5 2.5 0 1 1 0 2.5 " fill="#71cb2d"></path></marker><marker id="SvgjsMarker1085" markerWidth="9" markerHeight="9" refX="0" refY="4.5" viewBox="0 0 9 9" orient="auto" markerUnits="userSpaceOnUse"><path id="SvgjsPath1086" d="M9 4.5L0 9L0 0Z " fill="#71cb2d"></path></marker><marker id="SvgjsMarker1089" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" viewBox="0 0 5 5" orient="auto" markerUnits="userSpaceOnUse"><path id="SvgjsPath1090" d="M0 2.5A2.5 2.5 0 0 1 2.5 0A2.5 2.5 0 1 1 0 2.5 " fill="#71cb2d"></path></marker><marker id="SvgjsMarker1091" markerWidth="9" markerHeight="9" refX="0" refY="4.5" viewBox="0 0 9 9" orient="auto" markerUnits="userSpaceOnUse"><path id="SvgjsPath1092" d="M9 4.5L0 9L0 0Z " fill="#71cb2d"></path></marker></defs><g id="SvgjsG1042" transform="translate(519.5 350.5)"><path id="SvgjsPath1043" d="M-266 -129H249V183H-266V-129Z " fill="#ffffff" opacity="1"></path><g id="SvgjsG1044"><path id="SvgjsPath1051" d="M0 2C0 -49 44.5 -100 89 -100 " fill="none" stroke="#aaaaaa" stroke-width="1"></path><path id="SvgjsPath1052" d="M0 0C0 51 44.5 102 89 102 " fill="none" stroke="#aaaaaa" stroke-width="1"></path><path id="SvgjsPath1053" d="M0 2C0 -49 -43.5 -100 -91 -100 " fill="none" stroke="#aaaaaa" stroke-width="1"></path><path id="SvgjsPath1054" d="M0 0C0 51 -43.5 102 -91 102 " fill="none" stroke="#aaaaaa" stroke-width="1"></path><g id="SvgjsG1075"><path id="SvgjsPath1076" d="M169 -99C229 -66 239 57 169 101 " fill="none" stroke-dasharray="none" stroke="#71cb2d" stroke-width="1" marker-start="url(#SvgjsMarker1077)" marker-end="url(#SvgjsMarker1079)"></path></g><g id="SvgjsG1081"><path id="SvgjsPath1082" d="M123 124C96 173 -109 173 -129 124 " fill="none" stroke-dasharray="none" stroke="#71cb2d" stroke-width="1" marker-start="url(#SvgjsMarker1083)" marker-end="url(#SvgjsMarker1085)"></path></g><g id="SvgjsG1087"><path id="SvgjsPath1088" d="M-169 101C-256 54 -249 -74 -169 -99 " fill="none" stroke-dasharray="none" stroke="#71cb2d" stroke-width="1" marker-start="url(#SvgjsMarker1089)" marker-end="url(#SvgjsMarker1091)"></path></g></g><g id="SvgjsG1045"><g id="SvgjsG1046" transform="translate(-42 -26.5)"><path id="SvgjsPath1047" d="M0 7A7 7 0 0 1 7 0H75A7 7 0 0 1 82 7V44A7 7 0 0 1 75 51H7A7 7 0 0 1 0 44Z " stroke="#bbbbbb" stroke-width="1" fill="#737373" opacity="1"></path><g id="SvgjsG1048" transform="translate(16 8)"><g id="SvgjsG1049" transform="translate(0 0)"><text id="SvgjsText1050" font-family="微软雅黑,SimSun" fill="#ffffff" font-size="25" font-weight="normal" font-style="normal" text-anchor="start" x="0" y="26.5">进程</text></g></g></g><g id="SvgjsG1055" transform="translate(88 -119)"><path id="SvgjsPath1056" d="M0 4A4 4 0 0 1 4 0H70A4 4 0 0 1 74 4V32A4 4 0 0 1 70 36H4A4 4 0 0 1 0 32Z " stroke="#bbbbbb" stroke-width="1" fill="#00cc66" opacity="1"></path><g id="SvgjsG1057" transform="translate(16 8)"><g id="SvgjsG1058" transform="translate(0 0)"><text id="SvgjsText1059" font-family="微软雅黑,SimSun" fill="#ffffff" font-size="14" font-weight="bold" font-style="normal" text-anchor="start" x="0" y="14.84375">线程①</text></g></g></g><g id="SvgjsG1060" transform="translate(88 81)"><path id="SvgjsPath1061" d="M0 4A4 4 0 0 1 4 0H70A4 4 0 0 1 74 4V32A4 4 0 0 1 70 36H4A4 4 0 0 1 0 32Z " stroke="#bbbbbb" stroke-width="1" fill="#00cc66" opacity="1"></path><g id="SvgjsG1062" transform="translate(16 8)"><g id="SvgjsG1063" transform="translate(0 0)"><text id="SvgjsText1064" font-family="微软雅黑,SimSun" fill="#ffffff" font-size="14" font-weight="bold" font-style="normal" text-anchor="start" x="0" y="14.84375">线程②</text></g></g></g><g id="SvgjsG1065" transform="translate(-164 81)"><path id="SvgjsPath1066" d="M0 4A4 4 0 0 1 4 0H70A4 4 0 0 1 74 4V32A4 4 0 0 1 70 36H4A4 4 0 0 1 0 32Z " stroke="#bbbbbb" stroke-width="1" fill="#00cc66" opacity="1"></path><g id="SvgjsG1067" transform="translate(16 8)"><g id="SvgjsG1068" transform="translate(0 0)"><text id="SvgjsText1069" font-family="微软雅黑,SimSun" fill="#ffffff" font-size="14" font-weight="bold" font-style="normal" text-anchor="start" x="0" y="14.84375">线程③</text></g></g></g><g id="SvgjsG1070" transform="translate(-164 -119)"><path id="SvgjsPath1071" d="M0 4A4 4 0 0 1 4 0H70A4 4 0 0 1 74 4V32A4 4 0 0 1 70 36H4A4 4 0 0 1 0 32Z " stroke="#bbbbbb" stroke-width="1" fill="#00cc66" opacity="1"></path><g id="SvgjsG1072" transform="translate(16 8)"><g id="SvgjsG1073" transform="translate(0 0)"><text id="SvgjsText1074" font-family="微软雅黑,SimSun" fill="#ffffff" font-size="14" font-weight="bold" font-style="normal" text-anchor="start" x="0" y="14.84375">线程④</text></g></g></g></g></g></svg>
</center>

接下来按照次序依次将多线程方式讨论一下。

## NSThread

**NSThread**是iOS三种多线程方法里面相对轻量级的，但需要**管理线程的声明
周期、同步、加锁问题，所以会导致一些性能的开销。

### 线程的创建与启用

* 动态创建方法

~~~ ruby
- (id)initWithTarget: (id)target selector: (SEL)selector object: (id)argument;
~~~

~~~ ruby
- (void)viewDidLoad {
    [super viewDidLoad];
    // 初始化线程
    NSThread *thread = [[NSThread alloc] initWithTarget: self selector: @selector(run) object:nil];
    // 设置线程的优先级[0.0, 1.0]，1为最高
    thread.threadPriority = 1;
    [thread start];
}
~~~

* 参数解析
    * **selector**：线程执行的方法，select最多只能接收一个参数；
    * **targe**：selector消息发送的对象；
    * **argument**：传给selector的唯一参数，也可以是nil。

* 静态方法

~~~ ruby
+ (void)detachNewThreadSelector:(SEL)selector toTarget:(id)target withObject:(id)argument;
~~~

~~~ ruby
// 调用完成后，会马上创建并开启新线程
[NSThread detachNewThreadSelector:@selector(run) toTarget:self withObject:nil];
~~~

这种利用`单例模式`提供的接口较为特殊，在官方文档中也被称作*Convenient method*。这个方法可以**直接生成一个线程**并**立即启动**它。而且**无需为线程的清理负责**。

* 隐式创建线程（匿名）

~~~ ruby
[self performSelectorInBackground: @selector(run) withObject: nil];
~~~

### 线程的操作

#### 获取当前进程

~~~ ruby
NSThread *current = [NSThread currentThread];
~~~

#### 获取主线程

~~~ ruby
NSThread *main = [NSThread mainThread];
~~~

#### 暂停当前进程

~~~ ruby
[NSThread sleepForTimeInterval: 2];
~~~

~~~ ruby
NSDate *date = [NSDate dateWithTimeInterval: 2 sinceDate: [NSDate date]];
[NSThread sleepUntilDate: date];
~~~

#### 线程中的通信

* 在指定线程上进行操作

~~~ ruby
[self performSelector:@selector(run) onThread:thread withObject:nil waitUntilDone:YES];  
~~~

* 在主线程上执行操作

~~~ ruby
[self performSelectorOnMainThread:@selector(run) withObject:nil waitUntilDone:YES];  
~~~

* 在当前线程执行操作

~~~ ruby
[self performSelector:@selector(run) withObject:nil];  
~~~

#### 线程的同步与线程锁

当我们将两个线程对象的开启写在一起时，就会产生多个线程并行，如下程序输出所示。但是，有些线程我们希望在其他线程之后进行，这就需要对线程进行**加锁（lock）**操作。

~~~ ruby
- (void) run {
    NSLog(@"Hello world");
    NSThread *th1 = [[NSThread alloc] initWithTarget: self selector: @selector(threadOneMethod) object:nil];
    NSThread *th2 = [[NSThread alloc] initWithTarget: self selector: @selector(threadTwoMethod) object:nil];
    
    [th1 start];
    [th2 start];
}

- (void) threadOneMethod {
    for (int i = 0; i < 10; ++ i) {
        NSLog(@"1");
    }
    NSLog(@"thread one");
}

- (void) threadTwoMethod {
    for (int i = 0; i < 10; ++ i) {
        NSLog(@"2");
    }
    NSLog(@"thread two");
}
~~~

输出

~~~ ruby
2016-03-27 15:43:01.533 testiOS[11127:689330] Hello world
2016-03-27 15:43:01.533 testiOS[11127:689478] 1
2016-03-27 15:43:01.533 testiOS[11127:689479] 2
2016-03-27 15:43:01.534 testiOS[11127:689478] 1
2016-03-27 15:43:01.534 testiOS[11127:689479] 2
2016-03-27 15:43:01.534 testiOS[11127:689478] 1
2016-03-27 15:43:01.534 testiOS[11127:689479] 2
2016-03-27 15:43:01.534 testiOS[11127:689478] 1
2016-03-27 15:43:01.534 testiOS[11127:689479] 2
2016-03-27 15:43:01.534 testiOS[11127:689478] 1
2016-03-27 15:43:01.534 testiOS[11127:689479] 2
2016-03-27 15:43:01.535 testiOS[11127:689478] 1
2016-03-27 15:43:01.535 testiOS[11127:689479] 2
2016-03-27 15:43:01.535 testiOS[11127:689478] 1
2016-03-27 15:43:01.535 testiOS[11127:689479] 2
2016-03-27 15:43:01.535 testiOS[11127:689478] 1
2016-03-27 15:43:01.535 testiOS[11127:689479] 2
2016-03-27 15:43:01.535 testiOS[11127:689478] 1
2016-03-27 15:43:01.536 testiOS[11127:689479] 2
2016-03-27 15:43:01.536 testiOS[11127:689478] 1
2016-03-27 15:43:01.536 testiOS[11127:689479] 2
2016-03-27 15:43:01.536 testiOS[11127:689478] thread one
2016-03-27 15:43:01.536 testiOS[11127:689479] thread two
~~~

这里我们可以使用`@synchronized`，`@synchronized`的作用其实是创建一个线程互斥所，保证此时没有其他线程对`self`对象进行修改。这个是Objective-C的一个锁定令牌，防止`self`对象在同一时间内被其他线程访问，对线程起到保护作用。一般在public属性的时候使用，如单例模式或者操作类的static变量中使用。

~~~ ruby
- (void) threadOneMethod {
    @synchronized (@"lock") {
        for (int i = 0; i < 10; ++ i) {
            NSLog(@"1");
        }
    }
    NSLog(@"thread one");
}

- (void) threadTwoMethod {
    @synchronized (@"lock") {
        for (int i = 0; i < 10; ++ i) {
            NSLog(@"2");
        }
    }
    NSLog(@"thread two");
}
~~~

修改代码后的结果

~~~ ruby
2016-03-27 16:06:24.890 testiOS[11608:714593] Hello world
2016-03-27 16:06:24.891 testiOS[11608:714739] 1
2016-03-27 16:06:24.892 testiOS[11608:714739] 1
2016-03-27 16:06:24.892 testiOS[11608:714739] 1
2016-03-27 16:06:24.894 testiOS[11608:714739] 1
2016-03-27 16:06:24.895 testiOS[11608:714739] 1
2016-03-27 16:06:24.895 testiOS[11608:714739] 1
2016-03-27 16:06:24.896 testiOS[11608:714739] 1
2016-03-27 16:06:24.898 testiOS[11608:714739] 1
2016-03-27 16:06:24.903 testiOS[11608:714739] 1
2016-03-27 16:06:24.904 testiOS[11608:714739] 1
2016-03-27 16:06:24.904 testiOS[11608:714739] thread one
2016-03-27 16:06:24.904 testiOS[11608:714740] 2
2016-03-27 16:06:24.905 testiOS[11608:714740] 2
2016-03-27 16:06:24.906 testiOS[11608:714740] 2
2016-03-27 16:06:24.906 testiOS[11608:714740] 2
2016-03-27 16:06:24.906 testiOS[11608:714740] 2
2016-03-27 16:06:24.907 testiOS[11608:714740] 2
2016-03-27 16:06:24.907 testiOS[11608:714740] 2
2016-03-27 16:06:24.908 testiOS[11608:714740] 2
2016-03-27 16:06:24.909 testiOS[11608:714740] 2
2016-03-27 16:06:24.910 testiOS[11608:714740] 2
2016-03-27 16:06:24.914 testiOS[11608:714740] thread two
~~~

`@synchronized`中用字符串作为标志符进行判断。效果就想新创建了一个`NSLock`对象一样。这个线程锁与Java中的lock没有什么区别。

关于**NSThread**，总结一下他的特点：轻量级，但需要手动管理线程的生命后期、同步、加锁问题。

## Grand Central Dispatch

GCD是苹果公司为多喝的并行运算提出的解决方案。GCD在工作时会自动利用更多的处理器核心，一充分利用强大的机器。GCD是基于C语言的。如果使用GCD，完全有系统管理现场，我们不需要编写线程代码。只需定义想要执行的任务，然后添加到适当的**调度队列(Dispatch Queue)**。GCD会负责创建线程和调度任务，系统直接提供线程管理方案。

### 调度队列（dispath queue）

GCD中的一个重要概念是队列，它的核心理念：将长期运行的任务拆分成多个工作单元，并将这些单元添加到**dispath queue**中，系统会为我们管理这些**dispath queue**，为我们在多个县城上执行工作单元，我们不需要直接启动和管理后台线程。

系统提供了许多预定义的dispath queue，包括可以保证始终在主线程上执行工作的dispath queue。也可以创建自己的dispath queue遵循FIFO（先进先出原则），添加到dispath queue的工作单元将始终按照加入dispath queue的工作单元将始终按照加入dispath queue的顺序启动。

dispath queue按照按先进先出的顺序，串行或者并发地执行任务。

注意：

* serial dispatch queue一次只能执行一个任务，当前任务完成才开始出列兵启动下一个任务。

* concurrent dispathc queue则尽可能多地启动任务并发执行。

### 创建和管理dispatch queue

#### 一、获得全局并发Dispatch Queue（concurrent dispatch queue）

1. 并发dispatch queue可以同时并行地执行多个任务，不过并发queue仍然按先进先出的顺序来启动任务。并发queue会在之前的任务完成之前就出列下一个任务并开始执行。并发queue同时执行的任务数量会根据应用和系统动态变化，各种因素包括：可用核数量、其他进程正在执行的工作数量、其他串行dispatch queue中优先任务的数量等。

2. 系统给每个应用提供三个并发dispatch queue，整个应用内全局共享，三个queue的区别是优先级，你不需要显示地创建这些queue，每次直接调用`dispatch_get_global_queue`获得queue就行了。

~~~ ruby
// 获取默认优先级的全局并发dispatch queue
dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
~~~

* 第一个参数用于指定优先级，本别使用`DISPATCH_QUEUE_PRIPRITY_HIGH`和`DISPATCH_QUEUE_PRIORITY_LOW`两个常亮来获取高和低优先级的两个queue；
* 第二个参数默认0

3. 虽然dispatch queue是引用计数对象，但不需要`retain`和`release`全局并发queue。因为这些queue对应用是全局的，`retain`和`release`调用会忽略。也不需要存储这三个`retain`的引用，每次都会直接调用`dispatch_get_global_queue`获得queue就行了。

http://blog.csdn.net/q199109106q/article/details/8566300

#### 二、创建串行Dispatch Queue（serial dispatch queue）

1. 应用的任务需要按特殊顺序时，就需要使用串行Dispatch Queue，串行queue每次只能执行一个任务。你可以使用串行queue来代替锁，保护共享资源或可变的数据结构。和锁不同的是，串行queue确保任务按可预测的顺序执行。而且只要异步异步提交到串行queue，就永远不会死锁。

2. 必须显示创建和管理所有你使用的串行queue，应用可以创建任意数量的串行queue，但不要为了同时执行更多任务而创建更多的串行queue。如果需要并发地执行大量任务，应该把任务提交到全局并发queue中。

3. 利用`dispatch_queue_create`函数创建串行queue，两个参数分别是queue名和一组queue属性。

~~~ ruby
dispatch_queue_t queue;
queue = queue = dispatch_queue_create("cn.itcast.queue", NULL);
~~~

#### 三、运行时获得公共queue

GCD提供了函数让应用访问几个公共dispatch queue

1. 使用`dispatch_get_current_queue`函数作为调试用途，或者测试当前queue的标识。在block对象中调用这个函数会返回block提交到的queue。在block对象之外调用这个函数会返回应用的默认并发queue。

2. 使用`dispatch_get_main_queue`函数获得应用主线程关联的串行dispatch queue

3. 使用`dispatch_get_global_queue`来获得共享的并发queue

#### 四、Dispatch Queue的内存管理

1. Dispatch Queue和其他Dispatch对象都是引用计数的数据类型。当你创建一个串行dispatch queue时，初始引用计数为1，可以使用`dispatch_retain`和`dispatch_release`函数来增加或减少引用计数。当引用技术达到0时，系统会异步地销毁这个queue。

2. 对dispatch对象，`retain`和`release`十分重要，确保他们被使用时能够保留在内存中。和OC其他对象一样，使用前`retain`，使用后`release`。

3. 全局dispatch queue不需要`retain`和`release`，包括全局并发dispatch queue和main dispatch queue。

4. ARC已经能够管理GCD对象，不需要再`dispatch_retain`和`dispath_release`。

### 添加任务到queue

一般的，GCD需要采用block来封装任务内容。

实例代码

~~~ ruby
- (void) run {
    // 调用前，查看下当前线程
    NSLog(@"当前线程： %@", [NSThread currentThread]);
    
    dispatch_queue_t queue = dispatch_queue_create("desgard", NULL);
    dispatch_async(queue, ^{
        NSLog(@"开启了一个异步任务，当前线程 %@", [NSThread currentThread]);
    });
    
    dispatch_sync(queue, ^{
        NSLog(@"开启了一个同步任务，当前线程 %@", [NSThread currentThread]);
    });
}
~~~

这里先说简单的使用方式，再之后还会陆续讨论其中的一些原理。

---

### 相关资料

[Threading Programming Guide](https://developer.apple.com/library/ios/documentation/Cocoa/Conceptual/Multithreading/Introduction/Introduction.html#//apple_ref/doc/uid/10000057i-CH1-SW1)

[Multithreading and Grand Central Dispatch on iOS for Beginners Tutorial](https://www.raywenderlich.com/4295/multithreading-and-grand-central-dispatch-on-ios-for-beginners-tutorial)

