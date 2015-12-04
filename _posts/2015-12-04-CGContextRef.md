---
layout: post
author: Desgard_Duan
title: Learning CGContextRef
category: learning
tag: [iOS]
---
`CGContextRef`类库在官方文档是这么描述的：
> An opaque type that represents a Quartz 2D drawing environment.

`Quartz`是主要的绘画接口，支持基于路径的描画、抗锯齿渲染、渐变填充模式、图像、颜色、坐标控件变换、以及PDF文档的创建、显示和分析。`UIKit`为`Quartz`图像和颜色操作提供了`Objective-C`的封装。`CoreAnimation`为很多UIKit的视图属性生命的动画效果提供底层支持，也可以用于实现定制的动画。

在调用提供的`DrawRect: `方法之前，视图对象会自动配置其描画环境，使代码可以立即进行描画。作为这些配置的一部分，`UIView`对象会为当前描画环境创建一个图形上下文。（对应于`CGContextRef`封装类型）

