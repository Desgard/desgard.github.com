---
layout:     post
title:      "Drip Into A River · Part I"
subtitle:   "DGDownloaderButton-水滴汇集下载按钮特效"
date:       2016-06-28 01:01:00
author:     "Desgard_Duan"
header-img: "img/home-bg-art.jpg"
tags:
    - iOS
    - Objective-C
    - Bézier Curve
---

## Sweet iOS Animation Plan

给自己制定了一个很长远的动效学习计划，**[Sweet-iOS-Animation](https://github.com/Gua-Animation/Sweet-iOS-Animation)**。其实就是促进喜欢写动效的同学，多多实现[dribbble](https://dribbble.com/)上的优秀作品。我也会定期更新原型图作品表单，收集优秀的原型图。如果大家对此学习计划也有兴趣，可以从[这里](https://github.com/Gua-Animation/Sweet-iOS-Animation)查看内容。

以上是对于学习计划的简介，下面开始这次动效分析。

## “水滴汇集”下载按钮概念图

在dribbble上发现一个创意很好的下载按钮的创意，首先要感谢原型图作者[SamuraiChen](https://dribbble.com/SamuraiChen)分享原型图[Animation on a concept draft downloads](https://dribbble.com/shots/2785355-Animation-on-a-concept-draft-downloads)。我将这个特效起名为*Drip Into a River【水滴汇集】*。以下是原型图效果：

<img src="/assets/img/post_img/2016-06-28/dribbble.gif" width="300px"/>

## 动画拆解

这个动画我们主要关注的是**水滴汇集部分**，和**下载完成后按钮的震动波扩散**两个部分。先来说说**水滴汇集动画**。

### 一、水滴汇集

* 内部的下载状态实心圆要逐渐增大；
* 外部水滴要以一个弧度飞入内部圆的圆心，并且接触时最好有粘黏效果；
* 外部水滴的起始位置大概分布在内部圆最大轮廓线环形半径的2倍左右；
* 外部水滴在飞行时，会有忽大忽小的效果。

### 二、震动波扩散

* 整体按钮先略微缩小，准备突然增大并抖动；
* 按钮变大，并带有弹簧效果，最终回复原大小；
* 抖动最猛烈时，向四周发散“振动波”效果。

我从中再次抽取主要的一些效果，进行实现。在制作的过程中，我遇到了很多问题，在本文最后部分进行讨论。

## 利用贝塞尔曲线绘制水滴路径

我绘制了一张静态描述图如下：

<img src="/assets/img/post_img/2016-06-28/img_2.jpeg"/>

在图中，我们在最外围有一个有圆环，被称为**水滴生成区**。我们所有的水滴，为了保证在汇集飞行时候弯曲轨迹，所以$$\overline{OC}$$的距离（即水滴生成区圆环半径），我们需要保证。在$$\overline{OC}$$上，取中点$$A$$，并且选取长度为$$h$$的距离，确定$$B$$点，得到$$\overline{BA} = h$$。这里的$$h$$距离需要我们去尝试，$$B$$点也就是轨迹曲线的*Control Poiont*。

在我们写代码的时候，我们会已知圆心$$O(x_1, y_1)$$，以及水滴圆心$$C(x_2, y_2)$$，以及一些距离$$\overline{OC} = radius\cdot k $$（这里的$$k$$，我定义为主半径的**倍数系数**，只用于描述外围半径和内部圆的一个半径关系）。我们设待求点坐标为$$B(x, y)$$，对以上问题进行建笛卡尔坐标系求解。

<img src="/assets/img/post_img/2016-06-28/img_3.jpeg"/>

当然这之中，我们需要使用欧几里得距离法，将$$d$$求出。
\begin{align}
x = x_a - \overline{AM} = x_a - \frac{h}{d} \cdot \overline{CN} = x_a - \frac{h}{d} \cdot (y_2 - y_a)
\end{align}
\begin{align}
y = y_a - \overline{BM} = y_a - \frac{h}{d} \cdot \overline{AN} = y _a - \frac{h}{d} \cdot (x_2 - x_a)\\
\end{align}

在推导公式后，也许你会发觉一个问题：**水滴飞行轨迹在确定起始点后，可能会有两种**。是的，这种想法是正确的，因为这两种贝塞尔轨迹是关于$$\overline{OC}$$对称的。在图中，我也给出了另外一种轨迹的*Congrol Point*位置。其实，我们发现，我们**仅需要修改$$h$$的符号，就是另外一种轨迹的计算方法**。

我在实例代码中，建立了一个`DGDownloaderMath.m`文件，这里就是存储在绘制贝塞尔曲线时，所用到的公式算法。下面代码片段是关于以上水滴飞行贝塞尔轨迹的实现方式：

{% highlight ruby %}
+ (CGPoint)calcControlPoint: (CGPoint)O1 and: (CGPoint)O2 random: (bool)isRandom {
    CGPoint O_centre = CGPointMake((O1.x + O2.x) / 2.f, (O1.y + O2.y) / 2.f);
    CGFloat d = [self calcDistance: O_centre to: O1];
    CGFloat k = d / 40.f;
    if (isRandom) {
        int isRandom_int = arc4random() % 2;
        if (isRandom_int) k = -k;
    }
    CGFloat new_x = (O1.y - O2.y) / 2.f / k + (O1.x + O2.x) / 2.f;
    CGFloat new_y = - ((O1.x - O2.x) / 2.f / k - (O1.y + O2.y) / 2.f);
    return CGPointMake(new_x, new_y);
}
{% endhighlight %}

为了生成不同轨迹效果的样式，我使用了方法`arc4random()`来生成一个二进制随机数。剩下计算方法，严格遵循以上推导公式。

之后，我们要在视图层为水滴制作**layer**样式、设计动画并提供触发动画的入口方法。

{% highlight ruby %}
#pragma mark - 动画开启入口
- (void) startAnimation {
    if (self.gameTime != nil) {
        [self stopAnimation];
    }
    self.gameTime = [CADisplayLink displayLinkWithTarget: self
                                                selector: @selector(refreshAnimation)];
    [self.gameTime addToRunLoop: [NSRunLoop currentRunLoop]
                        forMode: NSRunLoopCommonModes];
}

#pragma mark - 动画关闭方法
- (void) stopAnimation {
    // 坑点！
    // 安全释放DisplayLink切记要赋值nil
    [self.gameTime invalidate];
    self.gameTime = nil;
}

#pragma mark - 刷新动画，判断是否需要增加动点
- (void) refreshAnimation {
    if (!self.isProgressing) {
        [self stopAnimation];
    }
    // 这里是CADisplayLink触发函数
    // count属性为一个频率计数器
    // 并且最大值为49，我可以通过控制周期最大数值，
    // 从而影响生成新小球的生成频率
    _count ++; _count %= 50;
    if (_count == 40) {
        [self readyPointAnimation: [DGDownloaderMath calcBeginPoint: self.circlePoint
                                                             radius: self.circleRadius
                                                         coefficent: 2.0f]];
    }
}

#pragma mark - 进入动画，传入起始坐标点
- (void) readyPointAnimation: (CGPoint) center {
    CGFloat pointRadius = 8.f;
    CALayer *shape = [[CALayer alloc] init];
    shape.backgroundColor = DGDownloaderButtonDefaultColor.CGColor;
    shape.cornerRadius = pointRadius;
    shape.frame = CGRectMake(center.x, center.y, pointRadius * 2, pointRadius * 2);
    [self.layer addSublayer: shape];
    [self runPointAnimation: shape];
}

#pragma mark - 启动动画，向中心吸收
- (void) runPointAnimation: (CALayer *)point {
    CAKeyframeAnimation *keyAnimation = [CAKeyframeAnimation animationWithKeyPath: @"position"];
    keyAnimation.path = [self makePointPath: point].CGPath;
    keyAnimation.fillMode = kCAFillModeForwards;
    keyAnimation.timingFunction = [CAMediaTimingFunction functionWithName: kCAMediaTimingFunctionEaseIn];
    keyAnimation.duration = 2;
    keyAnimation.removedOnCompletion = NO;
    [point addAnimation: keyAnimation forKey: @"moveAnimation"];
    
    // 这里使用GCD，是为了将水滴的layer删去
    // 因为在fillMode属性为kCAFillModeForwards
    // removedOnCompletion为NO的时候
    // 水滴在动画结束后会保持在圆心的状态
    // 我们需要使用其他方法来将其删除
    // 否则会在中心进度刚开始时，影响效果
    double delay = 2;
    dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delay * NSEC_PER_SEC));
    dispatch_after(popTime, dispatch_get_main_queue(), ^{
        [point removeFromSuperlayer];
    });
}

#pragma mark - 生成曲线路径
- (UIBezierPath *) makePointPath: (CALayer *)point {
    UIBezierPath *path = [UIBezierPath bezierPath];
    [path moveToPoint: point.position];
    [path addQuadCurveToPoint: self.circlePoint
                 controlPoint: [DGDownloaderMath calcControlPoint: self.circlePoint
                                                              and: point.position
                                                           random: YES]];
    return path;
}
{% endhighlight %}

<img src="/assets/img/post_img/2016-06-28/img_4.gif" width="280px"/>

以上便是水滴汇集动画的过程解析，这个效果也是整个作品的主要部分。在整体制作过程，将知识组合使用，想必肯定能锻炼自己很多方面的能力。在下一篇，我将会主要讲解结束动画中的**“振动波”效果**，尽请期待。

---

[Github【Desgard_Duan】](https://github.com/dgytdhy/DGDownloaderButton)

[Objc中国·动画解释](http://objccn.io/issue-12-1/)

