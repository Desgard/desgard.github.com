---
layout:     post
title:      "If you like me, Thumb Up!"
description:   "模仿Facebook Paper中的Like Button."
date:       2016-06-09 01:01:00
author:     "Desgard_Duan"
comments: 	 true
tags:
    - iOS
    - Objective-C
---

端午节本来想出去玩耍，但是可恶的天气。好吧，在屋子里接着写代码。之后一个月就要安心复习了。

这次做的东西受到了Facebook Paper的like按钮影响，也自己做了一个来玩。其实网上早就有现成的轮子，但是个人觉得他们的封装太繁琐，所以自己按照自己的实现思路来实现了一下。

![](http://7xwh85.com1.z0.glb.clouddn.com/2016-06-09-img0.gif)

## 拆解动画

这次写的动画要简单的多。看到上面的成果图之后，很显然的就能看出分成两部分。

* 按钮缩放动画
* 粒子爆炸动画

下面我们逐一攻克。

## 缩放动画

除去粒子爆炸效果，就是一个大拇指的缩放动画。为了让体验最佳，当我们手指按下按钮的时候，最好有一个动画的过渡来告知按钮已被按下。而在所以动画动作，最好的体现手法就是按钮的放缩，这也符合物理中力学的按压动作，使物体产生形变。

至于实现起来就很容易了，我们用`transform`属性，对目标View添加放缩动画，再按帧加载，来控制View的变换情况。帧动画在之前的[Particle Explosion Effect](http://desgard.com/2016/05/30/DGSlimeView-Boom/)有所提及，即使不看讲解直接看代码的参数名称也是一目了然的，这里直接给出代码，不再讲解：

{% highlight ruby %}
#pragma mark - Methods
- (void) clickButtonPress {
    if (isSelected) [self popInsideWithDuration: 0.5];
    else {
        [self popOutsideWithDuration: 0.5];
        // [self.explodeAnimationView animate];
    };
}

- (void) popOutsideWithDuration: (NSTimeInterval) duringTime {
    __weak typeof(self) weakSelf = self;
    self.transform = CGAffineTransformIdentity;
    
    [UIView animateKeyframesWithDuration: duringTime delay: 0 options: 0 animations: ^{
        [weakSelf setImage: [UIImage imageNamed: @"Like-Blue"] forState: UIControlStateNormal];
        [UIView addKeyframeWithRelativeStartTime: 0
                                relativeDuration: 1 / 3.0
                                      animations: ^{
                                          typeof(self) strongSelf = weakSelf;
                                          strongSelf.transform = CGAffineTransformMakeScale(1.5, 1.5);
                                      }];
        [UIView addKeyframeWithRelativeStartTime: 1 / 3.0
                                relativeDuration: 1 / 3.0
                                      animations: ^{
                                          typeof(self) strongSelf = weakSelf;
                                          strongSelf.transform = CGAffineTransformMakeScale(0.8, 0.8);
                                      }];
        [UIView addKeyframeWithRelativeStartTime: 2 / 3.0
                                relativeDuration: 1 / 3.0
                                      animations: ^{
                                          typeof(self) strongSelf = weakSelf;
                                          strongSelf.transform = CGAffineTransformMakeScale(1.0, 1.0);
                                      }];
    } completion: ^(BOOL finished) {
        isSelected = YES;
    }];
}

- (void) popInsideWithDuration: (NSTimeInterval) duringTime {
    __weak typeof(self) weakSelf = self;
    self.transform = CGAffineTransformIdentity;
    
    [UIView animateKeyframesWithDuration: duringTime delay: 0 options: 0 animations: ^{
        [weakSelf setImage: [UIImage imageNamed: @"Like-PlaceHold"] forState: UIControlStateNormal];
        [UIView addKeyframeWithRelativeStartTime: 0
                                relativeDuration: 1 / 2.0
                                      animations: ^{
                                          typeof(self) strongSelf = weakSelf;
                                          strongSelf.transform = CGAffineTransformMakeScale(0.8, 0.8);
                                      }];
        [UIView addKeyframeWithRelativeStartTime: 1 / 2.0
                                relativeDuration: 1 / 2.0
                                      animations: ^{
                                          typeof(self) strongSelf = weakSelf;
                                          strongSelf.transform = CGAffineTransformMakeScale(1.0, 1.0);
                                      }];
    } completion: ^(BOOL finished) {
        isSelected = NO;
    }];

}
{% endhighlight %}

## 粒子爆炸动画

这里的爆炸，我们不需要像之前的气泡爆炸一样，来切割View。想法是之前消息气泡的动画是为了让消息气泡有一种破裂的感觉，所以我们直接对视图进行粒子分割。而这里的粒子动画，就好像是拇指视图在经过按压之后，在墙面上敲击震动后扬起的灰尘，这些粒子不是属于原视图的。我们在多次观看最终结果图后，发现这是最合理的思路。

当我们确定思路后，我们会发现工作量减少了很多。因为我们使用`CALayer`的一个高性能原生粒子引擎来解决`CAEmitterLayer`。详细的相关属性和方法可以查看[CAEmitterLayer官方文档](https://developer.apple.com/library/ios/documentation/GraphicsImaging/Reference/CAEmitterLayer_class/)。这里还是简单的介绍一下这个类，我们可以把`CAEmitterLayer`当做许多`CAEmitterCell`的容器，每一个cell也就是我们细化出的每一刻粒子。然而我们只需要定义一个`CAEmitterLayer`粒子效果来作为粒子样式模板即可，`CAEmitterLayer`负责基于模板实例化该样式的粒子流，使他们同时刻以动画形式表现。

以下是初始化`CAEmitterLayer`以及`CAEmitterCell`的代码：

{% highlight ruby %}
#pragma mark - Initial Function
- (void) StartUp {
    self.clipsToBounds = NO;
    self.userInteractionEnabled = NO;
    
    CAEmitterCell *emitter = [CAEmitterCell emitterCell];
    
    emitter.contents                = (id)[UIImage imageNamed: @"Like-Sparkle"].CGImage;
    emitter.name                    = @"explosion";
    emitter.alphaRange              = 0.2f;
    emitter.alphaSpeed              = -1.f;
    emitter.lifetime                = 0.7f;
    emitter.lifetimeRange           = 0.3f;
    emitter.birthRate               = 0;
    emitter.velocity                = 40.0f;
    emitter.velocityRange           = 10.0f;
    emitter.emissionRange           = M_PI_4;
    emitter.scale                   = 0.05f;
    emitter.scaleRange              = 0.02;
    
    _emitterLayer = [CAEmitterLayer layer];
    _emitterLayer.name              = @"emitterLayer";
    _emitterLayer.emitterShape      = kCAEmitterLayerCircle;
    _emitterLayer.emitterMode       = kCAEmitterLayerOutline;
    _emitterLayer.emitterPosition   = self.center;
    _emitterLayer.emitterSize       = CGSizeMake(25, 0);
    _emitterLayer.renderMode        = kCAEmitterLayerOldestFirst;
    _emitterLayer.masksToBounds     = NO;
    _emitterLayer.emitterCells      = @[emitter];
    _emitterLayer.frame             = [UIScreen mainScreen].bounds;
    
    [self.layer addSublayer: _emitterLayer];
    
    _emitterLayer.emitterPosition   = self.center;
}
{% endhighlight %}

`CAMitterCell` 的属性基本上可以分为 3 种：

* 这种粒子的某一属性的初始值。比如，color属性指定了一个可以混合图片内容颜色的混合色。
* 粒子某一属性的变化范围。比如 `emissionRange` 属性的值是2π，这意味着例子可以从360度任意位置反射出来。如果指定一个小一些的值，就可以创造出一个圆锥形。
* 指定值在时间线上的变化。

总结了以上一般性规律，我们对 `CAMitterCell` 的认识又进了一步。我想，你以及可以用他来制作火焰或者下雪的动效了。对吧~

## 写在最后

以上就是简单的点赞按钮动画效果。

在制作完这个样例 push 到 github 上之后，我还配置了 `CocoaPods` 安装方式（这也是我第一个支持 CocoaPods 的开源小库，走个国际范嘛~）。有机会的话，下次我们来分享如何装载 `.podspec` 文件，最近要开始突击期末考试了，暂停写代码，说不定下次再分享作品就是在上海了~

---

[DGThumbUpButton Github](https://github.com/dgytdhy/DGThumbUpButton)