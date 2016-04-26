---
layout: post
title: "To Use Layer Mask"
date: 2016-04-08 09:21:35
image: '/assets/img/'
description: 'use layer mask to decorate your app'
tags:
- iOS
categories:
- Happy time in iOS
twitter_text: 'Put your twitter description here.'
---

今天收到一个优化需求：具体内容是将音频波浪加上渐变显示的效果。原图如下。

<div>
<img src="http://cerkh.img47.wal8.com/img47/539039_20160308170255/14601058034.png" alt="6F4F715C-3B0B-40A1-9F63-12374BEE3EDF" border="0" width="50%"/>
</div>

在各种姿势的Google后，仍旧没有找到自己想要的效果。于是上[stackoverflow](http://stackoverflow.com/users/6119149/desgard-duan)询问了该问题。[问题链接](http://stackoverflow.com/questions/36490270/how-to-make-a-uiview-have-an-effect-of-transparent-gradient)

得到了很棒的回复如下：

*You can use `CAGradientLayer` as following.*

{% highlight ruby %}
gradientLayer = [CAGradientLayer layer];
gradientLayer.frame = baseView.bounds;
gradientLayer.startPoint = CGPointMake(0.5,0.0);
gradientLayer.endPoint = CGPointMake(0.5,1.0);
gradientLayer.locations = @[@(0.0), @(0.2), @(1.0)];
gradientLayer.colors = @[(id)[UIColor colorWithWhite:1.0 alpha:0.9].CGColor,
                         (id)[UIColor colorWithWhite:1.0 alpha:0.3].CGColor,
                         (id)[UIColor colorWithWhite:1.0 alpha:0.0].CGColor];
[baseView.layer addSublayer:gradientLayer];
{% endhighlight %}

*`CAGradientLayer` supports several properties to make natural gradient, such as setting gradient direction by `startPoint` and `endPoint`, changing color curve by `locations` and `colors`.*

*You also make a transparent effect by using alpha channel of color.*

简单来说，就是我可以使用`CAGradientLayer`这个类库，制作一个均匀渐变像素（可控制颜色和透明度变化）的矩形，然后在波浪的**mask层**加入它。具体他是如何实现的，我们可以先看这篇博文[《文字渐变效果：图层中的mask属性》](http://www.cocoachina.com/ios/20150716/12571.html)，这里我们强调一下mask图层的工作原理：**根据透明度进行裁剪，只保留非透明部分**。所以我们可以想到很久之前的`Flash`中的**遮蔽效果**，与之思想相同。

另外的，解释下以上代码的含义。`startPoint`和`endPoint`属性是：**线性均匀渐变的起始点和终止点**。`location`属性是：**指定确定样式的位置，从而实现想要达到的效果**。`colors`属性：**和`location`属性数量相对应，对各个特殊点的具体描述。

根据需求，在代码中插入了以下代码，Succeed！

{% highlight ruby %}
let mask = CAGradientLayer()
mask.startPoint = CGPointMake(0.05, frequencyView_y)
mask.endPoint   = CGPointMake(0.95, frequencyView_y)
mask.frame = UIScreen.mainScreen().bounds
let whiteColor = UIColor.whiteColor()
mask.colors = [whiteColor.colorWithAlphaComponent(0.0).CGColor,
               whiteColor.colorWithAlphaComponent(1.0).CGColor,
               whiteColor.colorWithAlphaComponent(1.0).CGColor,
               whiteColor.colorWithAlphaComponent(0.0).CGColor]
mask.locations = [NSNumber(double: 0.0), NSNumber(double: 0.4), 
                  NSNumber(double: 0.6), NSNumber(double: 1.0)]

frequencyView?.layer.mask = mask
{% endhighlight %}

## 最终效果：

<center><div>
<img src="http://cerkh.img47.wal8.com/img47/539039_20160308170255/s/146010580462_medium.png" alt="DE021518-5EAE-46A3-9E27-C1DFDDE2476E" border="0" width="50%"/>
</div></center>

---

## 相关资料

[《文字渐变效果：图层中的mask属性》](http://www.cocoachina.com/ios/20150716/12571.html)

[stackoverflow](http://stackoverflow.com/questions/36490270/how-to-make-a-uiview-have-an-effect-of-transparent-gradient)