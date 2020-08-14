---
title:      "BannerHoverView - 解耦 TableView Header 实现悬停"
date:       2017-05-31 01:01:00
author:     "Desgard_Duan"
categories:
- Swift
tags:
- Swift 
---


邻近毕业，在完成毕设及论文之余，在帮助老师的创业公司写一个体育类 App。在其中遇到了这么一个需求，如下动图所示：

<img src= "http://7xwh85.com1.z0.glb.clouddn.com/%E6%9C%AA%E5%91%BD%E5%90%8D.gif" width="240px">

其实在很多的 App 中都需要这样的样式，尤其在个人设置页面中需要让个人信息的 Banner 视图部分悬停在顶部作为一个 Navigation Bar 的占位从而合理的展示页面。如何流畅的展现这个滑动过程呢？这篇博文为解决该布局和页面需求做出一个实验性的探索。

## 悬停效果

对于悬停的第一反应，自然是想起了 TableView 的 Header 悬停。但是如果采取 Header 的部分视图悬停，在实现起来难度就稍微大一点（使 Section 的最后一个 Cell 与 Header 一起编写逻辑，给用户部分悬停的错觉即可）。

再来说一些状态的回调。我们希望在滑动过程中拿出这几种状态来进行处理，滑动到顶部状态、底部状态以及在滑动过程中的状态。

在 **BannerHoverView** 中，为了实现多种状态的识别我使用了 KVO 来对滑动的 offset 参数进行观察，从而得到特定时刻的滑动状态。而对于悬停的实现，来通过计算来确定最新的 frame 即可。下面来具体说明实现方法。

![banne](http://7xwh85.com1.z0.glb.clouddn.com/banner-1.png)



## BannerHoverView 实现

先来看一下参数属性：

{% highlight ruby %}
static private let eps: CGFloat = 1e-6
    
public var headerScrollView: UIScrollView!
public var top: CGFloat = 0
public fileprivate(set) var bottom: CGFloat = 0
public fileprivate(set) var isTop: Bool = false
public fileprivate(set) var isBottom: Bool = true
fileprivate var completeBlock: ((BannerHoverView) -> Void)?
fileprivate var startBlock: ((BannerHoverView) -> Void)?
fileprivate var scrollBlock: ((BannerHoverView, CGFloat) -> Void)?
{% endhighlight %}

* **eps**：用于 double 类型判等方法。
* **headerScrollView**：这是一个引用传递属性，用于将 View Controller 中的 Scroll View 传递进来。
* **top**：悬停高度。
* **bottom**：Banner 默认状态下总高度。
* **isTop**：判断 Banner 是否为顶部状态。
* **isBottom**：判断 Banner 是否为底部状态。
* **completeBlock**：Banner 到达底部时候的回调闭包。
* **startBlock**：Banner 到底顶部时候的回调闭包。
* **scrollBlock**：滑动状态中的回调。`CGFloat` 参数为滑动进度，范围为 [0, 1] 闭区间。

> 这里使用 eps 的原因是因为 double 的精度。不知道的可以感受一下下图出现的原因。在四则运算中，加减法对精度的影响较小，而乘法对精度的影响更大，除法最大。在 **BannerHoverView** 中因为关系到 alpha 值的改变，所以还是尽量保证精度问题。

![](http://7xwh85.com1.z0.glb.clouddn.com/14961963046903.jpg)


### willMove 方法

{% highlight ruby %}
public override func willMove(toWindow newWindow: UIWindow?) {
   super.willMove(toWindow: newWindow)
   headerScrollView.contentInset = UIEdgeInsets.init(top: bottom, left: 0, bottom: 0, right: 0)
   // 感谢 @Josscii 的 PR
   headerScrollView.scrollIndicatorInsets = UIEdgeInsets.init(top: bottom, left: 0, bottom: 0, right: 0)
}
{% endhighlight %}

`willMove` 这个方法即为 `willMoveToWindow`。在 View Controller 的 `viewWillAppear` 周期方法中会调用其子视图中该方法。而在 **BannerHoverView** 中，这个时机十分适合设置 Table View 的上下偏移，以及 Indicator 的上下偏移。由于其 bottom 属性已经在初始化的时候确定。

## 用 KVO 对 Offset 进行监听的核心部分

{% highlight ruby %}
// MARK: - KVO
override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
   if let new = change?[NSKeyValueChangeKey.newKey] {
       let point = (new as! NSValue).cgPointValue
       updateSubViewsWithScrollOffset(newOffset: point)
   }
}
{% endhighlight %}

在 `observeValue` 方法中，我需要获得的是 Table View 的 `contentOffset` 属性，拿到的是一个 Point 对象。然后根据这个新的坐标，来更新视图操作，即调用 `updateSubViewsWithScrollOffset` 方法。

{% highlight ruby %}
fileprivate func updateSubViewsWithScrollOffset(newOffset: CGPoint) {
   var newOffset = newOffset
   // 取出额外滚动区域的顶部位置，然后取反
   let startChangeOffset = -headerScrollView.contentInset.top
   // 计算滑动点，通过 top 和 startChangeOffset 来确定滑动区域
   newOffset = CGPoint.init(x: newOffset.x, y: newOffset.y < startChangeOffset ? startChangeOffset : min(newOffset.y, -top))
   // 根据滑动点范围确定 frame 的 y 坐标
   let newY = -newOffset.y - bottom
   // 根据滑动确定 frame 新值
   frame = CGRect.init(x: 0, y: newY, width: frame.size.width, height: frame.size.height)
   // 计算总滑动距离
   let distance = -top - startChangeOffset
   // 计算滑动距离百分比
   let percent = 1 - (newOffset.y - startChangeOffset) / distance
   
   // 回调处理部分，更新状态
   if 1.0 - percent > BannerHoverView.eps && percent - 0.0 > BannerHoverView.eps {
       isBottom = false
       isTop = false
   }
   else if isBottom == false && isTop == false {
       if 1.0 - percent < BannerHoverView.eps {
           isTop = true
           if let topAction = completeBlock {
               topAction(self)
           }
       }
       else if percent - 0.0 < BannerHoverView.eps {
           isBottom = true
           if let bottomAction = startBlock {
               bottomAction(self)
           }
       }
   }
   // 调用滑动时期闭包方法
   if let scrollAction = scrollBlock {
       scrollAction(self, percent)
   }
}
{% endhighlight %}

在更新滑动的操作中，无非就是在做两件事情：

1. 判断滑动坐标是否越界（bottom 和 top 参数进行限制）。
2. 判断滑动状态以触发不同状态的回调方法。

这大概 30 行左右的代码就是 **BannerHoverView** 的核心部分，感觉较为精简。如果有更好的实现方法，欢迎 PR。

## 在 View Controller 初始化 BannerHoverView

你只需要三步就可以初始化 BannerHoverView 并使用：

* 对其中的 `headerScrollView` 进行关联：

{% highlight ruby %}
// TableView Initial
tableView = UITableView.init(frame: view.bounds, style: .grouped)
tableView.dataSource = self
tableView.delegate = self

// BannerHoverView Initial
bannerHoverView = SampleView.init(frame: CGRect.init(x: 0, y: 0, width: view.frame.size.width, height: 280))
// Hover Height(Remaining part when BannerHoverView arrived at the top position)
bannerHoverView.top = 65
// Scroll Property Setting
bannerHoverView.headerScrollView = tableView

// Add Observer
tableView.addObserver(bannerHoverView, forKeyPath: "contentOffset", options: NSKeyValueObservingOptions.new, context: nil)
        
view.addSubview(tableView)
view.addSubview(bannerHoverView)
{% endhighlight %}

* 在 deinit 中删除 KVO 监听

{% highlight ruby %}
deinit {
    tableView.removeObserver(bannerHoverView, forKeyPath: "contentOffset")
}
{% endhighlight %}

* 继承 `BannerHoverView` 来定制悬停部分视图：

{% highlight ruby %}
class SampleView: BannerHoverView {
    override init(frame: CGRect) {
        super.init(frame: frame)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    self.setScrollAction { (view, offset) in
        // offset - distance percent
    }

    self.setTopAction { (view) in
        // scroll top callback
    }

    self.setBottomAction { (view) in
        // scroll bottom callback
    }
}
{% endhighlight %}

以上便是 **BannerHoverView** 的实现思路，希望这个思路可以给大家启发，也希望得到更好的解决办法，在讨论中学习最优雅的实现方式。

> Github：[https://github.com/Desgard/BannerHoverView](https://github.com/Desgard/BannerHoverView)

