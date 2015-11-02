---
layout: post
author: Desgard_Duan
title: AutoLayout学习(1)
category: learning
tag: [iOS]
---

学习了一天的`iOS`的`自动布局`(`AutoLayout`)，自己来整理一下学习到的东西。
<div>
    <img src="http://i13.tietuku.com/6d985ed273b4cf0a.png">
</div>
<!-- more -->
##初识AutoLayout
很多人觉得`AutoLayout`很难、约束的选择性太多，抽象性增加，看书或者看博客永远都是停留在文字，无法结合实际图，所以很难下手。所以，自己在学习`AutoLayout`之前，也将例子中的图案按照自己的想法在纸上打了个草稿，在增加约束时候，自己也就有了一定的感觉。

##追溯AutoLayout
* `AutoLayout`是一种布局技术，专门用来布局UI界面。用来取代Frame布局在遇见屏幕尺寸多重多样的不足。
* `AutoLayout`自iOS6开始引入，由于Xcode4开发能力有限，当时并没有得到极大推广。
* 在iOS7（Xcode5）开始，`AutoLayout`的开发效率得到了很大的提升。

##学习AutoLayout属性
###Pin属性
<div>
<img src='http://i13.tietuku.com/28ab0e3d71d1581a.png' />
</div>
（以下从上到下依次介绍）

* 距离边缘最上面的四个许仙表示某个View的距离上边、左边、右边、下边的距离。
* 选项`Constrain To Margins`是iPhone6出现。（PS.Apple在一般的界面编写时，有些间距较为好看，因为ratina分辨率很大。当勾选上这个选项，这个View距离四周的值就变成了`输入数值 + 8`。一般建议不勾选，也许是Apple为之后的storyboard设计留的彩蛋）。
* `Width`和`Height`分别控制了控件的宽度和高度。
* `Equal Widths`和`Equal Heights`，用来控制选中的多个View等宽、高。
* `AspectRatio`比例约束，如果我们认为等宽高操作就是1:1特殊的比例约束，那么这个就很容易理解了。

----
###Align属性
<div>
    <img src='http://i13.tietuku.com/b3003e2fb1f60016.png' />
</div>

* `Leading Edges` 左对齐
* `Trailing Edges` 右对齐
* `Top Edges` 上对齐
* `Bottom Edges` 下对齐
* `Horizontal Centers` 水平中心对齐
* `Vertical Centers` 竖向中心对齐
* `Baselines` 基线对齐
* `Horizontal Center in Container` 对齐容器中的水平中心
* `Vertical Center in Container` 对齐容器中的竖向中心

----

###UILable内建高度自适应高度
如Label控件，默认是有宽度的，宽度就是字体自适应宽度。<br />
这样，我们就可以不给UILabel高度，把Label的`NumberOfLine = 0`就可以自适应高度了。

----

###应用时候的一些小技巧
* 有时候约束太多的时候，我们可以给某个View起名字，这样就能很方便的看到是哪一个View了。
* View总是选不中的时候，按`<CR> + <SHIFT> + [鼠标左键]`。
* 关于`Scrollview`的介绍，详见此文：[《AutoLayout深入浅出三[相遇Scrollview]》](http://grayluo.github.io/WeiFocusIo/autolayout/2015/01/27/autolayout3/)

----

##总结
本文仅是初步认识`AutoLayout`的功能，笔者也是刚刚接触，将总结的东西整理了一下。之后，还会逐渐深入的探讨关于`AutoLayout`问题。在iOS7之后的StoryBoard里面开发其实就是用ViewController当做View来用，如果觉得复杂，可以把View抽象出去。




