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

<!-- more -->

> Quartz 2D is an advanced, two-dimensional drawing engine available for iOS application development and to all Mac OS X application environments outside of the kernel. Quartz 2D provides low-level, lightweight 2D rendering with unmatched output fidelity regardless of display or printing device. Quartz 2D is resolution- and device-independent; you don’t need to think about the final destination when you use the Quartz 2D application programming interface (API) for drawing.

`Quartz 2D`是比较先进的、在二维绘图中广泛应用的`iOS`应用程序开发以及`OS X`应用开发的环境引擎。`Quartz 2D`提供低级别的，轻量级的2D渲染，具有高性能的高保真输出，不论在显示器还是其他的前端设备。`Quartz 2D`是与分辨率和设备无关的。当你使用`Quartz 2D`的应用程序接口(API)进行绘图时，不需要考虑最终的目标，意其十分自由。

用户坐标空间是发出的所有描画命令的工作环境。该空间的单位由点来表示。设备坐标空间指的是设备内在的坐标空间，由像素来表示。缺省情况下，用户坐标空间上的一个点等于设备坐标空间的一个像素，这意味着一个点等于1/160英寸。然而，不应该假定这个比例总是1:1。

`UIColor` 对象提供了一些便利方法，用于通过`RGB`、`HSB`、`和灰度值指定颜色值`。
您也可以使用`Core Graphics `框架中的`CGContextSetRGBStrokeColor`和
`CGContextSetRGBFillColor`函数来创建和设置颜色。

路径轮廓可以用像`CGContextStrokePath`这样的函数来画，即用当前的笔划颜色画出以路径为中心位置的线。路径的填充则可以用`CGContextFillPath`函数来实现，它的功能是用当前的填充颜色或样式填充路径线段包围的区域。

##Sample
<div>
<pre class="brush: applescript">
//设置上下文
CGContextRef context = UIGraphicsGetCurrentContext();

//画一条线
//线条颜色
CGContextSetStrokeColorWithColor
    (context, [UIColor redColor].CGColor);
//线条宽度
CGContextSetLineWidth(context, 5.0);
//开始画线, x，y 为开始点的坐标
CGContextMoveToPoint(context, 20, 20);
//画直线, x，y 为线条结束点的坐标
CGContextAddLineToPoint(context, 300, 20);
//开始画线
CGContextStrokePath(context); 


//绘制贝兹曲线
//贝兹曲线是通过移动一个起始点
//然后通过两个控制点,还有一个中止点
//调用CGContextAddCurveToPoint() 函数绘制
CGContextSetLineWidth(context, 2.0);
CGContextSetStrokeColorWithColor
    (context, [UIColor blueColor].CGColor);
CGContextMoveToPoint(context, 10, 10);
CGContextAddCurveToPoint(context, 200, 50, 100, 400, 300, 400);
CGContextStrokePath(context);


//绘制连续的曲线
CGContextSetLineWidth(context, 5.0);
CGContextSetStrokeColorWithColor
    (context, [UIColor greenColor].CGColor);
//开始画线, x，y 为开始点的坐标
CGContextMoveToPoint(context, 230, 150);
//画三次点曲线
CGContextAddCurveToPoint(context, 310, 100, 300, 200, 220, 220);
//画三次点曲线
CGContextAddCurveToPoint(context, 290, 140, 280, 180, 240, 190);

//开始画线
CGContextStrokePath(context);


//绘制虚线

//线条颜色
CGContextSetRGBStrokeColor(context, 0.1, 0.2, 0.3, 1);
float dashArray1[] = {3, 2};
//画虚线,可参考
CGContextSetLineDash(context, 0, dashArray1, 2);
//开始画线, x，y 为开始点的坐标
CGContextMoveToPoint(context, 5, 70);
//画直线, x，y 为线条结束点的坐标
CGContextAddLineToPoint(context, 310, 70);
//开始画线
CGContextStrokePath(context);

//绘制虚曲线
//线条颜色
CGContextSetRGBStrokeColor(context, 0.3, 0.2, 0.1, 1);
float dashArray2[] = {3, 2, 10};
//画虚线
CGContextSetLineDash(context, 0, dashArray2, 3);
//开始画线, x，y 为开始点的坐标
CGContextMoveToPoint(context, 5, 90);
CGContextAddCurveToPoint(context, 200, 50, 100, 400, 300, 400);
//开始画线
CGContextStrokePath(context);



//绘制连续的曲线
CGContextSetLineWidth(context, 5.0);
float dashArray3[] = {3, 2, 10, 20, 5};
//画虚线
CGContextSetLineDash(context, 0, dashArray3, 5);
CGContextSetStrokeColorWithColor
    (context, [UIColor greenColor].CGColor);
//开始画线, x，y 为开始点的坐标
CGContextMoveToPoint(context, 5, 400);
//画三次点曲线
CGContextAddCurveToPoint(context, 50, 200, 80, 300, 100, 220);
//画二次点曲线
CGContextAddQuadCurveToPoint(context, 150, 100, 200, 200);
//画三次点曲线
CGContextAddCurveToPoint(context, 240, 400, 10, 50, 300, 300);
//开始画线
CGContextStrokePath(context);



//画一个方形图形 没有边框
//方框的填充色
CGContextSetRGBFillColor(context, 0, 0.25, 0, 0.5); 
//画一个方框
CGContextFillRect(context, CGRectMake(5, 150, 100, 100)); 

//画弧线
//线条颜色
CGContextSetRGBStrokeColor(context, 0.3, 0.4, 0.5, 1);
CGContextAddArc(context, 180, 200, 50, 0, 180*(M_PI/180), 0);

//开始画线
CGContextStrokePath(context);

//画方形边框
//设置上下文
CGContextRef context5 = UIGraphicsGetCurrentContext(); 
CGContextSetLineWidth(context5, 3.0);
CGContextSetRGBStrokeColor(context5, 0.8, 0.1, 0.8, 1);
//画方形边框, 参数2:方形的坐标。
CGContextStrokeRect(context5, CGRectMake(5, 5, 300, 400));


//画椭圆
CGRect aRect= CGRectMake(80, 80, 160, 100);
CGContextSetRGBStrokeColor(context, 0.6, 0.9, 0, 1.0);
CGContextSetLineWidth(context, 3.0);
//椭圆, 参数2:椭圆的坐标。
CGContextAddEllipseInRect(context, aRect); 
CGContextDrawPath(context, kCGPathStroke);

//画实心圆
//画实心圆,参数2:圆坐标。可以是椭圆
CGContextFillEllipseInRect(context,
    CGRectMake(95, 195, 200.0, 100));

//画一个菱形
CGContextSetLineWidth(context, 2.0);
CGContextSetStrokeColorWithColor(context,
    [UIColor blueColor].CGColor);
CGContextMoveToPoint(context, 100, 100);
CGContextAddLineToPoint(context, 150, 150);
CGContextAddLineToPoint(context, 100, 200);
CGContextAddLineToPoint(context, 50, 150);
CGContextAddLineToPoint(context, 100, 100);
CGContextStrokePath(context);

//填充了一段路径:
CGContextMoveToPoint(context, 100, 100);
CGContextAddLineToPoint(context, 150, 150);
CGContextAddLineToPoint(context, 100, 200);
CGContextAddLineToPoint(context, 50, 150);
CGContextAddLineToPoint(context, 100, 100);
CGContextSetFillColorWithColor(context,
    [UIColor redColor].CGColor);
CGContextFillPath(context);

</pre>
</div>

[XGRoundIcon.m](#)<br />
个人编写，利用CGContextRef类库编写，将方形图像处理为圆形。



