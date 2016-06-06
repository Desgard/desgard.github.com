---
layout:     post
title:      "Recreating Skype's Action Sheet Animation"
subtitle:   "模仿Skype上滑菜单动画"
date:       2016-06-05 01:01:00
author:     "Desgard_Duan"
header-img: "img/post-bg-Tencent.jpg"
tags:
    - iOS
    - Objective-C
    - Bézier Curve
---

最近维持着平时学语言底层，周末做动效的学习节奏。学习到了很多。在制作动效的时候，尤其是在写贝塞尔曲线的代码，自己都会用纸笔计算坐标以及绘出大致的图形，是一个很有趣的过程。

这次的作品是受到skype的启发。在skype的iOS版本app中，点击照相按钮，会出现上滑菜单。查看效果的地址可以点[这里](http://capptivate.co/2015/02/01/skype-qik/)。这是类似于一种多弹簧的一个组合。

![](/assets/img/post_img/2016-06-05/demo0.gif)

## 分析并拆解动画

### 视图拆解

我们可以把这个动画的整体View拆解成两个部分组成，菜单顶端的边缘部分**Type1、Type3**和中央部分**Type2**。其中，Type2是作为贝塞尔曲线的control点，而Type1和Type3是定点。而且在RectView的上半部分，还要加入一处空白的位置来作为贝塞尔图形的上下文。

### 动画拆解

其实在进行过视图拆解后，动画拆解就十分容易了。全动效是模仿着不同压力成都下的三个弹簧，而且，它们的顶点始终是一条贝塞尔曲线。而弯曲程度和弯曲方向只由control点来控制。通过观察官方效果图，control点是一个连续性上下平移的店，所以我们只需要给出一个先增后减，再增减（重复这个弹簧过程，每次转向会有峰值衰减），直到最终结果为0时，就停止运动，即Type1、Type2、Type3三个顶点在水平方向为一条直线。

![](/assets/img/post_img/2016-06-05/demo1.png)

![](/assets/img/post_img/2016-06-05/demo2.png)

## 利用UIView的drawRect:函数来刷新图形

在动效执行时候，往往是每经历一个不同的手势状态，就要重新绘制贝塞尔图形。在之前的[QQ Message Bubble's Copy - DGSlimeView](http://desgard.com/2016/05/28/DGSlimeView/)中，通过`panHeadDot: (UIPanGestureRecognizer *)`回调函数，在`UIGestureRecognizerStateChanged`状态下我们可以实现这种效果。但是这里并不需要手势而不断更新。这里我们使用`CADisplayLink`来实现界面重绘。而在我们使用该函数之前，我们要了解一些关于`UIView`的知识，关于`drawRect:`在什么情况下会自动调用：

- 若在`UIView`初始化时没有设置Rect大小，将导致`drawRect:`不被自动调用。`drawRect`调用时在`loadView`和`viewDidLoad`两方法之后。
- 该方法在调用`sizeToFit`后会被自动调用。
- 通过设置`contentMode`属性值为`UIViewContentModeRedraw`，将在每次设置或更高`frame`的时候自动调用。
- 直接调用`setNeedsDisplay`或者`setNeedsDisplayInRect`后将会触发`drawRect`，前提是该`View`的`Rect`不能为0.

在重构界面的最后，我们了解一下`CADisplayLink`。简单地理解，`CADisplayLink`就是一个定时器，每隔$$\frac{1}{60}$$秒（约16.667ms）刷新一次。使用的时候，我们要把它添加到一个runloop中，并给他绑定`target`和`SEL`，在`SEL`的函数对象中，我们重新计算我们需要的数值，再根据`drawRect`自动调用的性质，主动调用函数`setNeedsDisplay`也就完成了界面的刷新。

对于该示例，我们给出刷新的代码：

{% highlight ruby %}
#pragma mark - 动画之前的runloop绑定部分
- (void) beforeAnimation {
    if (self.displayLink == nil) {
        // 为CADisplayLink绑定Target和SEL
        self.displayLink = [CADisplayLink displayLinkWithTarget: self selector: @selector(displayLinkAction:)];
        // 将CADisplayLink对象加入runloop中
        [self.displayLink addToRunLoop: [NSRunLoop mainRunLoop] forMode: NSDefaultRunLoopMode];
    }
    // 手动计数正在进行动画的视图数量
    self.animationCount ++;     
}

#pragma mark - 预备刷新界面
- (void) displayLinkAction: (CADisplayLink *)dis{
    CALayer *sideHelperPresentationLayer   =  (CALayer *)[helperSideView.layer presentationLayer];
    CALayer *centerHelperPresentationLayer =  (CALayer *)[helperCenterView.layer presentationLayer];
    
    CGRect centerRect = [[centerHelperPresentationLayer valueForKeyPath:@"frame"] CGRectValue];
    CGRect sideRect = [[sideHelperPresentationLayer valueForKeyPath:@"frame"] CGRectValue];
    
    // 计算制定序列，下文会讲到
    diff = sideRect.origin.y - centerRect.origin.y;

    // 重新绘制视图
    // 在receiver标上一个需要被重新绘图的标记，在下一个draw周期自动重绘
    [self setNeedsDisplay];
}
{% endhighlight %}

## 计算弹性数组序列

先要确定我们的目标：**构造一个连续序列，这个序列的末状态是0，过程中先增大，再减小，再增大……重复以上过程，因为阻尼衰减，到最后会停留在0，则序列结束。**这个连续序列就好比缓动函数中的[EaseOutElastic](http://www.xuanfengge.com/easeing/easeing/#easeOutElastic)。

在iOS7之后，Apple在[UIView Class Refference](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIView_Class/#//apple_ref/occ/clm/UIView/animateWithDuration:delay:usingSpringWithDamping:initialSpringVelocity:options:animations:completion:)增加了弹簧动画效果。

{% highlight ruby %}
+ (void)animateWithDuration: (NSTimeInterval)duration
                      delay: (NSTimeInterval)delay
     usingSpringWithDamping: (CGFloat)dampingRatio
      initialSpringVelocity: (CGFloat)velocity
                    options: (UIViewAnimationOptions)options
                 animations: (void (^)(void))animations
                 completion: (void (^)(BOOL finished))completion
{% endhighlight %}

我们的灵感来自于官方的这个函数。这里在构造序列的时候，**通过两个视图在不同的时间内执行弹簧动画**，即可得到我们所需要的序列（文字说的不明白，可以看我录制图）。这种方法在Kitten-Yang的书中第二章也详细的介绍了，被称作**辅助视图(Side Helper View)**法。这里我把效果放慢，大家观察两个不同颜色的Rect在Y轴上的距离变化：

![](/assets/img/post_img/2016-06-05/demo3.gif)

这里输出的序列数据也就是上面代码中的`diff`，这时候在回头看之前的代码是否都明确了？想想其实也很容易的^_^。这时候我们只要以计算出的序列数值来改变贝塞尔曲线的control点，每次绘制一遍贝塞尔图形即可，我们通过重写`drawRect`来实现。上代码：

{% highlight ruby %}
#define buttonSpace 30
#define menuBlankWidth 80
#define wid [UIScreen mainScreen].bounds.size.width
#define hei [UIScreen mainScreen].bounds.size.height
#define kwid keyWindow.frame.size.width
#define khei keyWindow.frame.size.height
#define swid self.frame.size.width
#define shei self.frame.size.height

#pragma mark - Overide
- (void) drawRect:(CGRect)rect {
    UIBezierPath *path = [UIBezierPath bezierPath];
    [path moveToPoint: CGPointMake(0, shei)];
    [path addLineToPoint: CGPointMake(0, shei - khei / 2 )];
    [path addQuadCurveToPoint: CGPointMake(wid, shei - khei / 2)
                 controlPoint: CGPointMake(swid / 2,  diff + menuBlankWidth)];
    [path addLineToPoint: CGPointMake(wid, shei)];
    [path closePath];
    
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextAddPath(context, path.CGPath);
    [_menuColor set];
    CGContextFillPath(context);
}
{% endhighlight %}

## 收尾工作

以上介绍了这个动效的全部思路，最后的工作就是对runloop进行释放。这里我先贴出代码：

{% highlight ruby %}
#pragma mark - 动画完成之后调用
- (void) finishAnimation {
    self.animationCount --;
    if (self.animationCount == 0) {
        // Notice
        [self.displayLink invalidate];
        self.displayLink = nil;
    }
}
{% endhighlight %}

留意Notice部分。这种做法的原因如果大家写过C那就一定很清楚，在调用`invalidate`之后，知识进行了内存空间的释放（相当于C中的free），指针此时会指向一个无效对象，通常称之为**悬挂指针（Dangling Pointer）**，所以我们通过将指针指向`nil`，使之彻底清空，防止crash。如果大家想深入理解，可以翻看[Effective Objective-C 2.0](https://book.douban.com/subject/25829244/)一书的[Item 29: Understand Reference Counting](https://ishepherdminer.gitbooks.io/effective-objective-c-diary/content/di_29_67613a_li_jie_yin_yong_ji_shu.html)。

<img src="/assets/img/post_img/2016-06-05/demo00.gif" width="300px"/>

## 写在最后

意思文中只是讲解了核心的思想和代码，建议大家去访问我的[github仓库](https://github.com/dgytdhy/DGGooeySlideMenu)下载代码，结合代码理解思路。喜欢的话，大家也可以来个star。

---

[Github【Desgard_Duan】](https://github.com/dgytdhy/DGGooeySlideMenu)

[A Guide To iOS Animation 2.0 · 2.玩转贝塞尔曲线【Kitten-Yang】](http://book.kittenyang.com/)

[Effective Objective-C 2.0 · Understand Reference Counting【Matt Galloway 】](https://ishepherdminer.gitbooks.io/effective-objective-c-diary/content/di_29_67613a_li_jie_yin_yong_ji_shu.html)
