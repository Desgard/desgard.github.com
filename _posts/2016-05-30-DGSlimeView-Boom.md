---
layout:     post
title:      "Particle Explosion Effect"
subtitle:   "QQ消息气泡继续探究，粒子爆炸动画效果"
date:       2016-05-30 01:01:00
author:     "Desgard_Duan"
header-img: "img/post-bg-Tencent.jpg"
tags:
    - iOS
    - Objective-C
    - Bézier Curve
---

在阅读之前，请先阅读上一篇博文[《模仿QQ消息气泡动画》](http://desgard.com/2016/05/28/DGSlimeView/)。因为该文是在上一个效果的基础上，继续探究贝塞尔曲线的用法。

在上一篇文章的结尾，引出了一个问题，就是如何实现QQ消息气泡的爆炸效果。从视觉角度来看，手机QQ中的气泡，在爆炸的时候，是一个**含有很多图片的帧动画**，但是这种效果是非矢量的。那么有没有一种办法是通过对UIView的处理，从而达到视觉上的爆炸效果呢。笔者在大量的google后，发现了这么一篇文章[《如何制作一个炫酷好玩的爆炸效果》](http://xxycode.com/ru-he-zhi-zuo-ge-xuan-ku-hao-wan-de-bao-zha-xiao-guo-2/)，这是模仿一个国外的安卓开发者的一个作品[ExplosionField](https://github.com/tyrantgit/ExplosionField)。这篇文章提供了思路，决定也来实现一下这种粒子爆炸特效。

在剖析制作思路之前，我先放出最终的效果图：

<img src="/assets/img/post_img/2016-05-30/progress.gif" width="300px"/>

我们接着上一篇文章的思路继续思考。当我们拖动手指让`headDot`与`trailDot`的圆心距大于`maxDistance`的时候，就要开始触发headDot的爆炸动画。

## 对UIView进行粒子化分块

我们拿到要进行爆炸操作的View，然后对他横向、纵向等量分割，这样就会拿出很多View的小矩形（如下图）。在图中，红色的颗粒状部分即为我们需要的粒子部分。为了稍后我们要控制这些View粒子，并给予其下落动画，我们将她们装在一个数组中来操作。这里我们还需要注意一个事情，如果我们这次做的View拥有很大的尺寸，我们在粒子化分块的过程中，可能会分割成$$10^6$$~$$10^8$$个View，很显然我们的手机CPU是不怎么吃得消的。所以我们让这些图形以及它们的动画效果在layer层进行处理，这样就会启用GPU来渲染动画，以保证我们的手机性能。

<img src="/assets/img/post_img/2016-05-30/source2.jpeg"/>

以下代码展现的是对View进行分块，为每一个例子生成一个layer对象，并防止在管理layer对象的数组中。

{% highlight ruby %}
#pragma mark - 进入动画
- (void) boom: (CGPoint) point {
    self.backgroundColor = self.superview.backgroundColor;
    self.origin = point;
    for (int i = 0; i < 8; ++ i) {
        for (int j = 0; j < 8; ++ j) {
            CGFloat pw = MIN(self.frame.size.width, self.frame.size.height) / 8.f;
            CALayer *shape = [[CALayer alloc] init];
            shape.backgroundColor = DGThemeColor.CGColor;
            shape.cornerRadius = pw / 2;
            shape.frame = CGRectMake(i * pw, j * pw, pw, pw);
            [self.layer.superlayer addSublayer: shape];
            [self.boomCells addObject: shape];
        }
    }
    [self cellAnimation];
}
{% endhighlight %}

## 对每个粒子绘制贝塞尔曲线路径，并实现下落动画

例子爆炸一般是要遵循一个抛物线运动的规律。我们可以对一个物体进行受力分析和运动分析从而得出二次函数的表达式。当我们把例子的下落位置定位巨他无限远的正下方，这时候我们在屏幕上随机给出二阶贝塞尔曲线的控制点坐标，我们发现到屏幕边缘的地方，就是贝塞尔路径的一部分，也就是我们看到的轨迹，这样很接近于物体爆炸后粒子随机散落的过程。其实过程相当简单，你说呢？

<img src="/assets/img/post_img/2016-05-30/source3.png"/>

在完成贝塞尔路径之后，我们要注意一个细节问题。由于爆炸开始时，物体加速度瞬间提示很快。在添加CA动画效果的时候，我们要选用最接近于该场景的**缓动函数**来描述加速度。关于缓动函数，我们可以参见前端技术中的[缓动函数表](http://easings.net/zh-cn)，其中`EaseOut`函数很符合我们该场景下加速度的变化规律，对应在CA动画中也就是`kCAMediaTimingFunctionEaseOut`。

给出代码：

{% highlight ruby %}
#pragma mark - 粒子动画
- (void) cellAnimation {
    for (CALayer *shape in self.boomCells) {
        CAKeyframeAnimation *ani = [CAKeyframeAnimation animationWithKeyPath: @"position"];
        ani.path = [self makeRandomPath: shape].CGPath;
        ani.fillMode = kCAFillModeForwards;
        ani.timingFunction = [CAMediaTimingFunction functionWithName: kCAMediaTimingFunctionEaseOut];
        ani.duration = 3;
        ani.removedOnCompletion = NO;
        [shape addAnimation: ani forKey: @"moveAnimation"];
    }
}

#pragma mark - 随机曲线路径
- (UIBezierPath *) makeRandomPath: (CALayer *) alayer {
    UIBezierPath *path = [UIBezierPath bezierPath];
    CGFloat delta = self.frame.size.width / 2;
    CGPoint po = CGPointMake(self.origin.x + alayer.position.x - delta, self.origin.y + alayer.position.y - delta);
    [path moveToPoint: po];

    CGPoint pod = CGPointMake(self.superview.center.x, self.superview.frame.size.height * 4);
    long widL = [UIScreen mainScreen].bounds.size.width;
    long heiL = [UIScreen mainScreen].bounds.size.height;
    [path addQuadCurveToPoint: pod controlPoint:CGPointMake((random() % widL), random() % heiL)];
    return path;
}
{% endhighlight %}

至此我们完成了这个简单的粒子爆炸动画。对于该动画的延伸：如果我们想对于一个UIImage进行粒子爆炸，我们在粒子化分块的时候，需要提取像素颜色，取色时候需要对这一块的颜色做一个折中处理。大家有兴趣可以自行去实现。最后放出文中用例的源码以及相关文章。大家喜欢的话，可以到github上奉献颗星星。>_<!

---

[github代码](https://github.com/dgytdhy/DGSlimeView)

[如何制作一个炫酷好玩的爆炸效果【XXY】](http://xxycode.com/ru-he-zhi-zuo-ge-xuan-ku-hao-wan-de-bao-zha-xiao-guo-2/)

