---
layout:     post
title:      "Reference Counting Brief Analysis"
subtitle:   "浅谈ObjC引用计数"
date:       2016-06-22 01:01:00
author:     "Desgard_Duan"
header-img: "img/home-bg-art.jpg"
tags:
    - Objective-C
---

## Begin

这篇文不像动画那么有趣。记录的是我在学习Reference Counting中遇到的坑。倘若你之前只是听说过但是没有具体的实践过，我想你在阅读本文后会有很大的收获。

## Manual Reference Counting Introduce

笔者学习iOS开发一年有余，对于我的iOS入门书籍，是*Objective-C Programming: The Big Nerd Ranch Guide*，在23.4部分，对Referrence Counting会有介绍。我们对MRC最初的认识就是，**retain计数加一，release计数减一，autorelease计数将来会减一，retainCount可以返回引用计数**。当引用计数减到0时，系统将会自动调用对象的`dealloc`方法，你可以把它类比成C#中的`dispose`方法，而原先的可发人员可以在`dealloc`中释放或清理资源。

也许第一遍看这些知识你正处于一个入门开发学习状态而没有进行试验，当我们深入去学习这门语言之后，你会发现很多问题。接下来，我们一一提出并解决。

> alloc/retain/release/dealloc是如何实现的？

由于**Cocoa framework**的闭源，我们只能通过其互换框架**[GNUstep](http://gnustep.org/)**来了解其原理。首先我们通过`alloc`方法入手。

{% highlight ruby %}
+ (id) alloc {
    return [self allocWithZone: NSDefaultMallocZone()];
}

+ (id) allocWithZone: (NSZone *)z {
    return NSAllocateObject(self, 0, z);
}
{% endhighlight %}

`alloc`方法会调用`NSAllocateObject`函数。具体是做什么的呢？我们往后看。


{% highlight ruby %}
struct obj_layout {
    NSUInteger retained;
};

inline id NSAllocateObject(Class aClass, NSUInteger extraBytes, NSZone *zone) {
    int size = /* 计算容纳对象所需要的内存大小 */
    // 分配内存空间
    id new = NSZoneMalloc(zone, size);
    // 空间数据置0
    memset(new, 0, size);
    new = (id)&((struct obj_layout *) new)[1];
}
{% endhighlight %}

<center>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="processonSvg1000" viewBox="248.0 139.0 471.0 276.0" width="471.0" height="276.0"><defs id="ProcessOnDefs1001"><marker id="ProcessOnMarker1018" markerUnits="userSpaceOnUse" orient="auto" markerWidth="16.23606797749979" markerHeight="10.550836550532098" viewBox="-1.0 -1.3763819204711736 16.23606797749979 10.550836550532098" refX="-1.0" refY="3.8990363547948754"><path id="ProcessOnPath1019" d="M12.0 3.8990363547948754L0.0 7.798072709589751V0.0Z" stroke="#323232" stroke-width="2.0" fill="#323232" transform="matrix(1.0,0.0,0.0,1.0,0.0,0.0)"/></marker></defs><g id="ProcessOnG1002"><path id="ProcessOnPath1003" d="M248.0 139.0H719.0V415.0H248.0V139.0Z" fill="none"/><g id="ProcessOnG1004"><g id="ProcessOnG1005" transform="matrix(1.0,0.0,0.0,1.0,381.0,159.0)" opacity="1.0"><path id="ProcessOnPath1006" d="M0.0 0.0L191.0 0.0L191.0 195.0L0.0 195.0Z" stroke="#323232" stroke-width="2.0" stroke-dasharray="none" opacity="1.0" fill="none"/><path id="ProcessOnPath1007" d="M0.0 0.0L191.0 0.0L191.0 40.0L0.0 40.0Z" stroke="#323232" stroke-width="2.0" stroke-dasharray="none" opacity="1.0" fill="#ffffff"/><g id="ProcessOnG1008" transform="matrix(1.0,0.0,0.0,1.0,10.0,10.0)"><text id="ProcessOnText1009" fill="#000000" font-weight="normal" font-style="normal" text-decoration="blink" font-family="微软雅黑" text-anchor="middle" font-size="16" x="85.5" y="16.4">retained</text></g></g><g id="ProcessOnG1010" transform="matrix(1.0,0.0,0.0,1.0,396.0,218.0)" opacity="1.0"><path id="ProcessOnPath1011" d="M0.0 0.0L161.0 0.0L161.0 111.0L0.0 111.0Z" stroke="#323232" stroke-width="0.0" stroke-dasharray="none" opacity="1.0" fill="none"/><g id="ProcessOnG1012" transform="matrix(1.0,0.0,0.0,1.0,0.0,31.125)"><text id="ProcessOnText1013" fill="#000000" font-weight="normal" font-style="normal" text-decoration="blink" font-family="微软雅黑" text-anchor="middle" font-size="13" x="80.5" y="13.325">全部置0</text><text id="ProcessOnText1014" fill="#000000" font-weight="normal" font-style="normal" text-decoration="blink" font-family="微软雅黑" text-anchor="middle" font-size="13" x="80.5" y="29.575"></text><text id="ProcessOnText1015" fill="#000000" font-weight="normal" font-style="normal" text-decoration="blink" font-family="微软雅黑" text-anchor="middle" font-size="13" x="80.5" y="45.825">【对象存储区域】</text></g></g><g id="ProcessOnG1016"><path id="ProcessOnPath1017" d="M331.0 199.0L355.0 199.0L355.0 199.0L363.7639320225002 199.0" stroke="#323232" stroke-width="2.0" stroke-dasharray="none" fill="none" marker-end="url(#ProcessOnMarker1018)"/></g><g id="ProcessOnG1020" transform="matrix(1.0,0.0,0.0,1.0,268.0,170.0)" opacity="1.0"><path id="ProcessOnPath1021" d="M0.0 0.0L113.0 0.0L113.0 26.0L0.0 26.0Z" stroke="#323232" stroke-width="0.0" stroke-dasharray="none" opacity="1.0" fill="none"/><g id="ProcessOnG1022" transform="matrix(1.0,0.0,0.0,1.0,0.0,4.875)"><text id="ProcessOnText1023" fill="#000000" font-weight="normal" font-style="normal" text-decoration="blink" font-family="微软雅黑" text-anchor="middle" font-size="13" x="56.5" y="13.325">alloc返回指针</text></g></g><g id="ProcessOnG1024" transform="matrix(1.0,0.0,0.0,1.0,572.0,173.0)" opacity="1.0"><path id="ProcessOnPath1025" d="M0.0 0.0L127.0 0.0L127.0 20.0L0.0 20.0Z" stroke="#323232" stroke-width="0.0" stroke-dasharray="none" opacity="1.0" fill="none"/><g id="ProcessOnG1026" transform="matrix(1.0,0.0,0.0,1.0,0.0,1.875)"><text id="ProcessOnText1027" fill="#000000" font-weight="normal" font-style="normal" text-decoration="blink" font-family="微软雅黑" text-anchor="middle" font-size="13" x="63.5" y="13.325">struct obj_layout</text></g></g><g id="ProcessOnG1028" transform="matrix(1.0,0.0,0.0,1.0,382.0,369.0)" opacity="1.0"><path id="ProcessOnPath1029" d="M0.0 0.0L188.0 0.0L188.0 26.0L0.0 26.0Z" stroke="#323232" stroke-width="0.0" stroke-dasharray="none" opacity="1.0" fill="none"/><g id="ProcessOnG1030" transform="matrix(1.0,0.0,0.0,1.0,0.0,4.875)"><text id="ProcessOnText1031" fill="#000000" font-weight="normal" font-style="normal" text-decoration="blink" font-family="微软雅黑" text-anchor="middle" font-size="13" x="94.0" y="13.325">alloc返回对象的内存图</text></g></g></g></g></svg>
</center>


`NSAllocateObject`函数通过调用`NSZoneMalloc`函数来分配存放对象所需的内存空间，之后将该内存空间置0，最后返回作为对象而使用的指针。那么`NSZone`又是什么？之前我想让大家移至[CocoaDev](http://www.cocoadev.com/index.pl?NSZone)，但是现在作者不在维护了。这里所说的`NSZone`我做了一下翻译：

*从大体上来说，`NSZone`是Apple分配和释放内存的一种方式，它不是一个对象，而是使用C语言中的结构体来存储关于对象的内存管理信息。基本上，不需开发者去管理它，**Cocoa Application**使用一个默认的`NSZone`来对应用的对象进行管理。但是当默认的`NSZone`里面管理了大量数据的时候，你会想要一个自己控制的`NSZone`。中重视和，大量对象的释放可能会导致严重的**内存碎片化**，Cocoa本身有做过优化，每次`alloc`时会尝试着填满内存空隙，但如此开销会很大。于是，为了优化效率，你可以自己创建`NSZone`，当你有大量的`alloc`请求时，就全部转移到指定的`NSZone`，便可减少大量的时间开销。而且，使用`NSZone`还可以一次性的将你创建在`NSZone`的东西全部清除，避免逐个`dealloc`。*

熟悉C或者C++的读者，读过以后可以立马反应到，这其实就是一个官方封装的**内存池**。无论是**优化内存碎片化**还是**对象统一释放**，都是内存池的显著特点。总的来说，当你需要大量创建对象的时候，使用`NSZone`能提高效率的。在**Cocoabuilder**中，有一篇叫*[what's an NSZone?](http://www.cocoabuilder.com/archive/cocoa/65056-what-an-nszone.html#65056)*的帖子中，Timothy J. Wood写道：由于历史原因，现在已经不能创建一个真正的`NSZone`，而是在Main Zone中创建一个Child Zone，这样不会使存储单元过度碎片化。发表日期是2002年，也就是说，Cocoa很早之前就已经注意到内存碎片的危险，而改善了Zone方法。

再来说一下`retain`和`release`。我们也从**GNUstep**源码入手：

{% highlight ruby %}
- (id) retain {
    NSIncrementExtraRefCount(self);
    return self;
}

inline void NSIncrementExtraRefCount(id anObject) {
    // 判断计数最大值
    if (((struct obj_layout *)anObject)[-1].retained == UINT_MAX - 1) {
        [NSException raise: NSInternalInconsistencyException 
                    format: @"NSIncrementExtraRefCount() asked to increment too far"];
    }
    ((struct obj_layout *)anObject)[-1].retained++;
}
{% endhighlight %}

大概扫一遍代码，其实我们只是对计数的上线做了一个判断。`UINT_MAX - 1`这是个什么东西呢。直接敲到**Xcode**中发现这个值得`18446744073709551615`，转换成二进制`1111 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111 1111`，也就是我们常说的$$2^{64} - 1$$。这个值也就是`-1`在内存当中的补码存储形式。记住这个值，我们后面还会遇到。


{% highlight ruby %}
- (void) release {
    if (NSDecrementExtraRefCountWasZero(self)) {
        [self dealloc];
    }
}

bool NSDerementExtraRefCountWasZero(id anObject) {
    if (((strcut obj_layout *)anObject)[-1].retained == 0) {
        return YES;
    } else {
        ((struct obj_layout *) anObject)[-1].retained --;
        return NO;
    }
}
{% endhighlight %}

`release`类比于上面的`retain`也就好理解多了，这里我们只要有一个下限判断，如果计数等于0的时候，调用`dealloc`实例方法，废弃对象。

{% highlight ruby %}
- (void) dealloc {
    NSDeallocateobject(self);
}

inline void NSDeallocateObject(id anObject) {
    struct obj_layout *o = &((strcut obj_layout *)anObject)[-1];
    free(o);
}
{% endhighlight %}

上述代码仅废弃了由`alloc`分配的内存块。最后简单看一下`retainCount`的实现

{% highlight ruby %}
- (NSUInteger) retainCount {
    return NSExtraRefCount(self) + 1;
}

inline NSUInteger NSExtraRefCount(id anObject) {
    return ((struct obj_layout *)anObject)[-1].retained;
}
{% endhighlight %}

<center>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="processonSvg1000" viewBox="173.0 239.0 453.0 299.0" width="453.0" height="299.0"><defs id="ProcessOnDefs1001"><linearGradient id="ProcessOnLinearGradient1007" x1="0.9469983318002789" y1="0.9928809777420872" x2="0.4119770267643943" y2="0.0"><stop id="ProcessOnStop1008" stop-opacity="1.0" stop-color="#9dd7ed" offset="0.0"/><stop id="ProcessOnStop1009" stop-opacity="1.0" stop-color="#899dc0" offset="1.0"/></linearGradient><linearGradient id="ProcessOnLinearGradient1014" x1="0.9469983318002789" y1="0.8982876587814846" x2="0.4119770267643943" y2="0.0"><stop id="ProcessOnStop1015" stop-opacity="1.0" stop-color="#f5ecba" offset="0.0"/><stop id="ProcessOnStop1016" stop-opacity="1.0" stop-color="#f4d000" offset="1.0"/></linearGradient><marker id="ProcessOnMarker1019" markerUnits="userSpaceOnUse" orient="auto" markerWidth="16.23606797749979" markerHeight="10.550836550532098" viewBox="-1.0 -1.3763819204711736 16.23606797749979 10.550836550532098" refX="-1.0" refY="3.8990363547948754"><path id="ProcessOnPath1020" d="M12.0 3.8990363547948754L0.0 7.798072709589751V0.0Z" stroke="#323232" stroke-width="2.0" fill="#323232" transform="matrix(1.0,0.0,0.0,1.0,0.0,0.0)"/></marker><marker id="ProcessOnMarker1027" markerUnits="userSpaceOnUse" orient="auto" markerWidth="16.23606797749979" markerHeight="10.550836550532098" viewBox="-1.0 -1.3763819204711736 16.23606797749979 10.550836550532098" refX="-1.0" refY="3.8990363547948754"><path id="ProcessOnPath1028" d="M12.0 3.8990363547948754L0.0 7.798072709589751V0.0Z" stroke="#323232" stroke-width="2.0" fill="#323232" transform="matrix(1.0,0.0,0.0,1.0,0.0,0.0)"/></marker></defs><g id="ProcessOnG1002"><path id="ProcessOnPath1003" d="M173.0 239.0H626.0V538.0H173.0V239.0Z" fill="none"/><g id="ProcessOnG1004"><g id="ProcessOnG1005" transform="matrix(1.0,0.0,0.0,1.0,328.0,289.0)" opacity="1.0"><path id="ProcessOnPath1006" d="M0.0 0.0L176.0 0.0L176.0 80.0L0.0 80.0L0.0 0.0Z" stroke="#0b6cc3" stroke-width="2.0" stroke-dasharray="none" opacity="1.0" fill="url(#ProcessOnLinearGradient1007)"/><g id="ProcessOnG1010" transform="matrix(1.0,0.0,0.0,1.0,10.0,31.875)"><text id="ProcessOnText1011" fill="#000000" font-weight="normal" font-style="normal" text-decoration="blink" font-family="微软雅黑" text-anchor="middle" font-size="13" x="78.0" y="13.325">struct obj_layout</text></g></g><g id="ProcessOnG1012" transform="matrix(1.0,0.0,0.0,1.0,328.0,369.0)" opacity="1.0"><path id="ProcessOnPath1013" d="M0.0 0.0L176.0 0.0L176.0 99.0L0.0 99.0Z" stroke="#dc5712" stroke-width="2.0" stroke-dasharray="none" opacity="1.0" fill="url(#ProcessOnLinearGradient1014)"/></g><g id="ProcessOnG1017"><path id="ProcessOnPath1018" d="M239.0 370.0L282.0 370.0L282.0 370.0L309.7639320225002 370.0" stroke="#323232" stroke-width="2.0" stroke-dasharray="none" fill="none" marker-end="url(#ProcessOnMarker1019)"/></g><g id="ProcessOnG1021" transform="matrix(1.0,0.0,0.0,1.0,193.0,322.0)" opacity="1.0"><path id="ProcessOnPath1022" d="M0.0 0.0L124.0 0.0L124.0 47.0L0.0 47.0Z" stroke="#323232" stroke-width="0.0" stroke-dasharray="none" opacity="1.0" fill="none"/><g id="ProcessOnG1023" transform="matrix(1.0,0.0,0.0,1.0,0.0,15.375)"><text id="ProcessOnText1024" fill="#000000" font-weight="normal" font-style="normal" text-decoration="blink" font-family="微软雅黑" text-anchor="middle" font-size="13" x="62.0" y="13.325">anObject对象指针</text></g></g><g id="ProcessOnG1025"><path id="ProcessOnPath1026" d="M503.5621532777801 370.53570957044417L534.0 370.53570957044417L534.0 259.0L416.0 259.0L416.0 273.7639320225002" stroke="#323232" stroke-width="2.0" stroke-dasharray="none" fill="none" marker-end="url(#ProcessOnMarker1027)"/></g><g id="ProcessOnG1029" transform="matrix(1.0,0.0,0.0,1.0,538.0,300.0)" opacity="1.0"><path id="ProcessOnPath1030" d="M0.0 0.0L68.0 0.0L68.0 50.0L0.0 50.0Z" stroke="#323232" stroke-width="0.0" stroke-dasharray="none" opacity="1.0" fill="none"/><g id="ProcessOnG1031" transform="matrix(1.0,0.0,0.0,1.0,0.0,16.875)"><text id="ProcessOnText1032" fill="#000000" font-weight="normal" font-style="normal" text-decoration="blink" font-family="微软雅黑" text-anchor="middle" font-size="13" x="34.0" y="13.325">访问头部</text></g></g><g id="ProcessOnG1033" transform="matrix(1.0,0.0,0.0,1.0,287.5,474.0)" opacity="1.0"><path id="ProcessOnPath1034" d="M0.0 0.0L257.0 0.0L257.0 44.0L0.0 44.0Z" stroke="#323232" stroke-width="0.0" stroke-dasharray="none" opacity="1.0" fill="none"/><g id="ProcessOnG1035" transform="matrix(1.0,0.0,0.0,1.0,0.0,13.875)"><text id="ProcessOnText1036" fill="#000000" font-weight="normal" font-style="normal" text-decoration="blink" font-family="微软雅黑" text-anchor="middle" font-size="13" x="128.5" y="13.325">通过对象访问对象内存头部</text></g></g></g></g></svg>
</center>

如上示意图，指向`struct obj_layout`的指针减去`struct obj_layout`大小的地址，即可找到访问对象内存头部。因为分配时全部置0，由`NSExtraRefCount(self) + 1`得出，`retainCount`为1，可以推测出，`retain`方法使`retained`属性加1，而`release`减1。

在苹果的官方实现中，`__CFDoExternRefoperation`函数中可以发现苹果采用了一个**引用计数表**，结构类似于**散列**，来管理内存块以及引用计数。这也是官方代码和GNUstep的一点区别。（官方代码可以从[这里](http://www.opensource.apple.com/source/objc4)查看。）

更多的了解苹果源码可以参考书籍*[Pro multithreading and memory management for iOS and OS X](https://book.douban.com/subject/24720270/)*

## When to use -retainCount

> When to use -retainCount

这个子标题的答案是什么呢？最后揭晓。

初学Reference Counting，我们会使用`retainCount`来进行一些实验。例如这个代码：

{% highlight ruby %}
NSString *string = @"Some";
NSLog(@"retainCount: %lu", [string retainCount]);

NSNumber *number1 = @1;
NSLog(@"retainCount: %lu", [number1 retainCount]);

NSNumber *number2 = @3.14;
NSLog(@"retainCount: %lu", [number2 retainCount]);
{% endhighlight %}

输出结果为如下：

{% highlight ruby %}
2016-06-24 10:18:57.797 text[43373:4020361] retainCount: 18446744073709551615
2016-06-24 10:18:57.798 text[43373:4020361] retainCount: 9223372036854775807
2016-06-24 10:18:57.798 text[43373:4020361] retainCount: 1
{% endhighlight %}

第一次看到这些值的时候，都会大声惊叹：“Why？”其实，第一个值是之前见过的$$2^{64} - 1$$，第二个值是$$2^{63} - 1$$。为什么会这样，愿意是因为我们的编译器将其实现为*Singleton Object*（也就是我们常说的**单例对象**）。编译时编译器会把其对象所表示的数据放到应用程序的二进制文件中，这样的话运行程序就可以直接使用，无需再创建`NSString`对象。这是一种编译优化手段，我们称之为**编译器常量**（Compile-time Constant）。而对于`NSNumber`来说，它使用了一种**标签指针**（Tagged Pointer）机制来标注特定类型的数值，这不依赖与`NSNumber`对象，而是把与数值有关的全部消息都放在标签指针中，并对它执行响应操作。而这些标签指针系统会在**消息派发阶段**（objc_msgSend）来检测标签指针，从而获得数据信息。`NSNumber`这种优化只在某些场合使用，比如例中的浮点数对象就没有优化，所以其保留计数为1。

我们来验证一下`NSString`的单例存储：

{% highlight ruby %}
NSString *a = @"gua";
NSString *b = @"gua";
NSLog(@"%p", a);
NSLog(@"%p", b);
{% endhighlight %}

{% highlight ruby %}
2016-06-24 10:37:39.511 text[43524:4042012] 0x106ddb050
2016-06-24 10:37:39.512 text[43524:4042012] 0x106ddb050
{% endhighlight %}

结果发现我们一旦有一个`NSString`对象，并且它的值为@"gua"的时候，其指针指向的地址单元永远是一致的。倘若不是单例对象，则不可能出现相同地址。可能你会纠结于那么不同的单例对象为何引用计数还会不相同？其实这里我们无需关注这个问题，我们只要肯定的是，**单例对象的引用计数始终不会改变**。其实这也反应这么一种思想：**我们不应该总是依赖保留计数的具体值来编码**。

其实`retainCount`这个属性很早就被苹果公司放弃使用了。两个原因：

* `retainCount`没有考虑后续的自动释放操作，只是不停地通过释放操作来降低保留计数，直至是对象为系统回收。假如此对象在自动释放池里，那么稍后系统清空是还要继续释放，导致crash。
* `retainCount`有回收不确定性。`retainCount`可能永远不得0，因为有时系统会优化对象的释放行为，在保留计数是1的时候，就回收了。只有当系统不打算优化时，计数值才会递减至0。

苹果的[官方文档](https://developer.apple.com/library/ios/documentation/Cocoa/Reference/Foundation/Protocols/NSObject_Protocol/index.html#//apple_ref/occ/intfm/NSObject/retainCount)也对其没有价值有了很详尽的说明。在官方引入ARC时，毫不犹豫的将其放弃，我们就更不应该使用了。

综上，回答标题问题：**[When to use -retainCount？](http://sdarlington.github.io/) The answer is Never!**

## End

这篇博文只是简单的给出了引用计数是如何工作的，以及避免使用`retainCount`的原因，后续我希望进一步探究**iOS内存管理**的其他细节问题，希望读者与笔者一样，共同探究问题，挖掘本质。倘若文章有错误，望指出继而共勉。

--- 

[lots-of-problems-about-nsstring-reference-count](http://stackoverflow.com/questions/37985945/lots-of-problems-about-nsstring-reference-count)

