---
layout:     post
title:      "QQ Message Bubble's Copy - DGSlimeView"
subtitle:   "模仿QQ消息气泡动画"
date:       2016-05-28 01:01:00
author:     "Desgard_Duan"
header-img: "img/post-bg-Tencent.jpg"
tags:
    - iOS
    - Objective-C
    - Bézier Curve
---

<img src="/assets/img/post_img/2016-05-28-demo.gif" width="300px" />

上周开始学习[贝塞尔曲线](https://en.wikipedia.org/wiki/B%C3%A9zier_curve)，其动机是因为买了Kitten-Yang的那本[《A Guide To iOS Animation 2nd Edition》](http://book.kittenyang.com/)，于是也对动画和贝塞尔曲线产生了兴趣。在生活当中很多时候，我们都能见到贝塞尔曲线这个词，因为他从一开始在汽车车体工艺设计逐渐的发扬，最终又在计算机图形学领域占有重要的地位。关于贝塞尔曲线的发展和简单的原理，可以看[《贝塞尔曲线扫盲》](http://www.html-js.com/article/1628)这篇文章来科普一下。


而在iOS开发中，由于在iOS 7.0之后扁平化UI设计中，由于省去了传统的iOS金属纹理、礼盒皮式的设计。这样，开发者就更加需要学习动画和绘矢量图的能力。下面我把这个动画的代码按照思路分析一下：


## 1.分析UI层次

在做一个动画样式之前，我们应该把作品的UI结构计划好。在这个动画中，我们需要准备两个圆形的Dot，因为在一个Dot在拖动离开原来位置的时候，为了模拟现实场景，原处应该也会保留一点印记。

在拖动过程中，我们在两个Dot的中间部分进行贝塞尔曲线的绘图，从而模拟“藕断丝连”的效果。

<img src="/assets/img/post_img/2016-05-28-img2.png"/>

## 2.完成headDot的Pan手势（跟随）

接下来，我们考虑用户操作的角度。用户会拖动外层的headDot，这时候headDot的位置随着手指的拖动会跟随行动。而内层的trailDot会保持位置不变。我们对于headDot，增加一个`UIPanGestureRecognizer`类型手势，即可达到效果。这里我们给出初始化即添加手势代码：

{% highlight ruby %}
- (instancetype) initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame: frame]) {
        self.maxDistance = 180;
        
        self.shapLayer.frame = CGRectMake(0, 0, CGRectGetWidth(frame), CGRectGetHeight(frame));
        self.headDot.center = self.center;
        self.trailDot.center = self.center;
        
        [self.layer addSublayer: self.shapLayer];
        [self addSubview: self.trailDot];
        [self addSubview: self.headDot];    // 注意加入顺序
        
        UIPanGestureRecognizer *panGestrue = [[UIPanGestureRecognizer alloc] initWithTarget: self
                                                                                     action: @selector(panHeadDot:)];
        [self.headDot addGestureRecognizer: panGestrue];
        
    }
    return self;
}
{% endhighlight %}

## 3.完成贝塞尔曲线闭合图形的绘制

那么说了半天贝塞尔曲线，这里终于用到了。在headDot随着我们手势拖动的同时，我们需要在两个圆中间绘制一个曲边矩形。如下图的<font color="blue">蓝边</font>内区域所示。在连接两个圆的圆心组成连心线`RR'`，过两个圆心分别做垂线，得到`AB`、`DC`。连接`AD`、`BC`，取中点`O`和`P`，我们将其作为两条贝塞尔曲线的Control Point，对`AD`、`BC`进行绘制曲线，得到效果。

<img src="/assets/img/post_img/2016-05-28-img1.png"/>

这里我们给出贝塞尔曲线闭合图形的绘制代码，其中公式全部由上图得来：

{% highlight ruby %}
#pragma mark - 绘制贝塞尔图形
- (void) reloadBeziePath {
    CGFloat r1 = self.trailDot.frame.size.width / 2.0f;
    CGFloat r2 = self.headDot.frame.size.width / 2.0f;
    
    CGFloat x1 = self.trailDot.center.x;
    CGFloat y1 = self.trailDot.center.y;
    CGFloat x2 = self.headDot.center.x;
    CGFloat y2 = self.headDot.center.y;
    
    CGFloat distance = sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    
    CGFloat sinDegree = (x2 - x1) / distance;
    CGFloat cosDegree = (y2 - y1) / distance;
    
    CGPoint pointA = CGPointMake(x1 - r1 * cosDegree, y1 + r1 * sinDegree);
    CGPoint pointB = CGPointMake(x1 + r1 * cosDegree, y1 - r1 * sinDegree);
    CGPoint pointC = CGPointMake(x2 + r2 * cosDegree, y2 - r2 * sinDegree);
    CGPoint pointD = CGPointMake(x2 - r2 * cosDegree, y2 + r2 * sinDegree);
    CGPoint pointN = CGPointMake(pointB.x + (distance / 2) * sinDegree, pointB.y + (distance / 2) * cosDegree);
    CGPoint pointM = CGPointMake(pointA.x + (distance / 2) * sinDegree, pointA.y + (distance / 2) * cosDegree);
    
    UIBezierPath *path = [UIBezierPath bezierPath];
    [path moveToPoint: pointA];
    [path addLineToPoint: pointB];
    [path addQuadCurveToPoint: pointC controlPoint: pointN];
    [path addLineToPoint: pointD];
    [path addQuadCurveToPoint: pointA controlPoint: pointM];
    
    self.shapLayer.path = path.CGPath;
}
{% endhighlight %}

## 4.处理逻辑以及细节效果

最后我们要注意以下的细节优化：

* 在headDot与trailDot的距离越来远时，我们的trailDot应该按照常理变小。这里我们的做法是，引入一个`maxDistance`常量（用`c`来描述），这个值是拖动产生“藕断丝连”贝塞尔效果的最大值。trailDot变小的规则是，当圆心距越大，缩放倍数将会越来越小，但是整体的变化趋势是始终缩小的。用递推式来描述如下（`k`代表Dot的一个衡量外接正方形的量化长度）：

$$k_{2} = (1 - \frac{x}{c}) \times k_{1}$$

* 当圆心距超过`maxDistance`的时候，这时候我们启动broke动画，来摧毁贝塞尔图形。其动画为弹簧效果。
* 当手势释放外圆的时候，我们需要将headDot回弹至原位置，其动画为弹簧效果。

之后就是我们上述注意细节的代码，已经考虑逻辑之后的Pan手势代码：

{% highlight ruby %}
#pragma mark - 贝塞尔图像破裂动画
- (void) layerBroke {
    self.shapLayer.path = nil;
    [UIView animateWithDuration: 0.7f
                          delay: 0
         usingSpringWithDamping: 0.2
          initialSpringVelocity: 0
                        options: UIViewAnimationOptionBeginFromCurrentState
                     animations: ^{
                         self.trailDot.transform = CGAffineTransformMakeScale(1, 1);
                     }
                     completion:^(BOOL finished) {
        
    }];
}

#pragma mark - 还原到原位置
- (void)placeHeadDot {
    [UIView animateWithDuration: 0.5f
                          delay: 0
         usingSpringWithDamping: 0.5
          initialSpringVelocity: 0
                        options: UIViewAnimationOptionBeginFromCurrentState
                     animations: ^{
                         self.headDot.center = self.center;
                     }
                     completion: ^(BOOL finished) {
        
    }];
}

#pragma mark - 编写手势
- (void) panHeadDot: (UIPanGestureRecognizer *) panGesture {
    switch (panGesture.state) {
        case UIGestureRecognizerStateChanged: {
            // 记录手势位置
            CGPoint location = [panGesture locationInView: self.headDot.superview];
            // headDot跟随手指
            self.headDot.center = location;
            // 计算圆心距
            CGFloat distance = [self getDistanceBetweenDots];
            
            if (distance < self.maxDistance) {
                // 模拟当headDot移走后，trailDot按照圆心距变小
                // 当距离太远时，就不再发生改变
                CGFloat scale = (1 - distance / self.maxDistance);
                scale = MAX(TRAILDOT_SCALE_MIN, scale);
                self.trailDot.transform = CGAffineTransformMakeScale(scale, scale);
                
                [self reloadBeziePath];
            } else {
                [self layerBroke];
            }
            break;
        }
        
        case UIGestureRecognizerStateEnded: {
            CGFloat distance = [self getDistanceBetweenDots];
            if (distance >= self.maxDistance) {
                [self placeHeadDot];
            }
            break;
        }
            
        default:
            break;
    }
}
{% endhighlight %}

这样，我们大体上就完成了这个效果的编写。通过这个例子，对于贝塞尔曲线的熟练程度有了更加深入的掌握。另外在QQ消息气泡释放的最后，还有一连串的爆炸的动画。我感觉所使用的效果就是多个图片连续显示，实现的帧动画的效果。如果你在阅读的时候，了解这个动画，希望及时与笔者进行沟通。

在文章的最后，会放出这个例子的github源码，有需要学习的读者可以自行下载学习。当然，如果在学习之余，感觉收获很大，那就star✨一下咯~笔者还会继续更新这个动画效果，希望最终能达到QQ气泡的完全效果。

----
[github: DGSlimeView](https://github.com/dgytdhy/DGSlimeView)

[QQ中未读气泡拖拽消失的实现分析【Kitten-Yang】](http://kittenyang.com/drawablebubble/)

