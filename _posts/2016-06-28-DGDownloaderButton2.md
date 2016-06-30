---
layout:     post
title:      "Drip Into A River · Part II"
subtitle:   "DGDownloaderButton-水滴汇集下载按钮特效"
date:       2016-06-29 01:01:00
author:     "Desgard_Duan"
header-img: "img/post-bg-cal.jpg"
tags:
    - iOS
    - Objective-C
    - Bézier Curve
---

> 这篇是关于水滴汇集特效的系列二，如果没有看过系列一，可以点击[这里](https://desgard.com/2016/06/28/DGDownloaderButton/)查看。

## “振动波”效果

分解一下震动效果的全过程。

<img src="/assets/img/post_img/2016-06-29/img_1.gif" width="300px"/>

稍加注意，整个动画需要由4各部分组成：

* 效果一：整体视图先变小；
* 效果二：瞬间变大，然后变小并带有弹簧效果；
* 效果三：在效果二的同时，复制视图，将复制的视图逐渐变大，并修改其*alpha*值;
* 效果四：在效果二、效果三的同时，提示用户处于已完成的状态

在排除效果四的情况下，其余效果我们都可以通过*UIView Animation*来实现。我先给出代码。

{% highlight ruby %}
#pragma mark - 结束动画
- (void) endAnimation {
    self.layer.borderColor = [UIColor clearColor].CGColor;
    // 定义复制视图，使用以下方法
    // 其实是新定义一个UIView，然后将其所有属性拷贝过来
    UIView *viewShot = [NSKeyedUnarchiver unarchiveObjectWithData:[NSKeyedArchiver archivedDataWithRootObject: self.progressView]];
    viewShot.alpha = 0.4f;
    viewShot.layer.cornerRadius = viewShot.frame.size.width / 2.f;
    // 为了不影响缩小后的视觉，所以提前将复制视图缩小
    viewShot.transform = CGAffineTransformMakeScale(.9, .9);
    [self addSubview: viewShot];
    // 视图缩小动画
    [UIView animateWithDuration: .9
                          delay: 1.2
                        options: UIViewAnimationOptionCurveEaseInOut
                     animations:^{
                         _progressView.transform = CGAffineTransformMakeScale(.9, .9);
                     }
                     completion:^(BOOL finished) {
                         // “振动波”效果
                         [UIView animateWithDuration: 2.1
                                          animations:^{
                                              viewShot.transform = CGAffineTransformMakeScale(3, 3);
                                              viewShot.alpha = 0;
                                              // 显示完成状态标识
                                              self.successView.alpha = 1;
                                          }
                                          completion:^(BOOL finished) {
                                              [viewShot removeFromSuperview];
                                          }];
                         // 弹簧震动效果
                         [UIView animateWithDuration: 1.f
                                               delay: 0.2 // 延时2s，测试得出最好效果
                              usingSpringWithDamping: 0.4
                               initialSpringVelocity: 0
                                             options: UIViewAnimationOptionCurveEaseInOut
                                          animations:^{
                                              // 视图瞬间增大一下
                                              _progressView.transform = CGAffineTransformMakeScale(1.8, 1.8);
                                              _progressView.transform = CGAffineTransformMakeScale(1.0, 1.0);
                                          }
                                          completion:^(BOOL finished) {
                                              
                                          }];
                     }];
}
{% endhighlight %}

由于多个参数，多个block，代码可能有点乱，将窗口拉大至能够单行显示每一行代码，就可以很清晰的看出嵌套层次。

在弹簧的震动效果中的`delay`和`usingSpringWithDamping`即延时和震动阻尼两个参数上，我做了多次试验，也询问了身边同学的意见，最终决定了此参数。另外一个需要注意的地方，虽然完成后的**√**并不是我们动画的主要部分，这个特效我自己也尝试了一下，感觉效果不佳，所以我最终采用渐变的方法使它出现。对于原型图上的动效方式，可以参考一下[OnOffButton](https://github.com/rakaramos/OnOffButton)。

以下是实际效果：

<img src="/assets/img/post_img/2016-06-29/img_2.gif" width="300px"/>

## 关于水滴粘连动画的讨论

在水滴汇集的动画中，需要在中心位置展示进度的视图逐渐增大。虽然这样效果可以实现，但是有一些细节问题。例如系列一提到的**水滴粘连效果**。例如下图：

<img src="/assets/img/post_img/2016-06-29/img_3.png" width="300px"/>

我在之前写过一篇[文章](https://desgard.com/2016/05/28/DGSlimeView/)，是[Kitten-Yang](http://kittenyang.com/drawablebubble/)给出的一个*Bubble效果*的思路，通过贝塞尔曲线实现这种效果。另外，更进一步的，也可以使用*计算机图形学*中的**[元球算法(Metaball)](https://en.wikipedia.org/wiki/Metaballs)**来实现这个效果。

虽然我这里有很多思路，但是我在给出的实例代码中并没有采纳。因为在第一版代码中，我做了尝试，使用的是*Kitten-Yang*的*Bubble效果*。在重绘界面的时候使用了`CADisplayLink`。于此，进度动画也就不能使用单纯的**UIKit Animation**进行制作。所以对于进度圆的制作，我用了`CAShapelayer`不断的来画圆，每次半径增加一点，然后`CADisplayLink`刷新视图，继续画圆……如此循环。虽然实现上没有什么问题，而且每种状态的进度圆半径我都能获取到，但是随着运行动画时间的增加，硬件加速经常会有卡顿的情况，以至于最终水滴动画都无法很流畅的展示。再三考虑，我更换了思路。

这个也是一直困扰着我的原因，我没有更好的思路来实现粘连动画，所以最终放弃了它。倘若各位围观大神有更好的思路，欢迎大家的建议，小弟也不胜感激。

## 对于第一篇文章的一些疑问

#### Q: 笔者在文中的插图是如何制作的？

说实话，我没有更好的方式。我是用Keynote将自定义图形组合而来。这是受到了*Kitten-Yang*的启发，我是他的粉丝。

#### Q: 笔者在第一篇中，是如何做到在外围圆环上随机生成水滴？

其实只是将周角分为360份，然后对这360个度数做了随机，得到角度后如下计算坐标。当然当角度大于180°时候更改下三角函数符号即可。

<img src="/assets/img/post_img/2016-06-29/img_4.jpeg"/>

{% highlight ruby %}
#pragma mark - 计算Begin Point Postion
+ (CGPoint) calcBeginPoint: (CGPoint)O radius: (CGFloat)r coefficent: (CGFloat)c {
    CGFloat dis = r * c;
    CGPoint ans;
    // 生成角度
    int angel = arc4random() % 360;
    if (angel <= 180) {
        double theta = (double)angel / 360 * M_PI * 2;
        ans = CGPointMake(O.x + dis * cos(theta), O.y - dis * sin(theta));
    } else {
        double theta = (double)(360 - angel) / 360 * M_PI * 2;
        ans = CGPointMake(O.x + dis * cos(theta), O.y + dis * sin(theta));
    }
    return ans;
}
{% endhighlight %}


## 尾声

对于水滴汇集按钮特效的思路解析大概就是这样。自己在制作该作品的过程中巩固了一下**UIKit Animation**、**Core Animation**，又一次实践了**贝塞尔曲线**，收获很大。在阅读完[*iOS Core Animation: Advanced Techniques*](https://www.gitbook.com/book/zsisme/ios-/details)之后，在实习之余自己会更加关注*facebook*的**pop**动画库以及**Swift 3.0**中的`UIViewPropertyAnimator`类。希望以后能继续为大家分享知识。

这次微博转发量有点大，自己也受宠若惊~还是多谢大家支持。




