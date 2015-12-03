---
layout: post
author: Desgard_Duan
title: 阳光体育-跑步app（iOS端）开发日志（1）
category: learning
tag: [iOS]
---
序：打算日更的开发日志，想记录下这次项目的开发全部历程，也会同步记录下当中遇到的问题，以及各种收获。

![img](http://i12.tietuku.com/d1ce01f1087b27dd.jpg)
<!-- more -->
#2015-12-01

临近期末接手了真正意义上的`iOS`正式项目，开发小组为`SWJTU Sports 风雷工作室`。

app类型是一款运动跑步软件，从类型上就能看出技术难点关键就是在于处理跑步事件的地图问题、路径划线问题以及在动点运动时候的数据记录、数据处理问题。我们通过需求分析以及前期的项目讨论、项目会议决定，采用`高德地图SDK`，于是目前`iOS`处于阅读文档的阶段。

整理一下高德地图的文档：[地图功能](http://lbs.amap.com/api/ios-sdk/guide/mapkit/)、[定位功能](http://lbs.amap.com/api/ios-location-sdk/summary/)、[路线规划](http://lbs.amap.com/api/ios-sdk/guide/searchkit/#routesearch)、[搜索](http://lbs.amap.com/getting-started/search/)

另外，整体布局需要使用`sidebar`布局，这里我使用了`github`上面的[LLSlideMenu](https://github.com/lilei644/LLSlideMenu)。

<div align="center">
    <img src="https://raw.githubusercontent.com/lilei644/LLSlideMenu/master/Preview/LLSlideMenuPreview.gif">
</div>

#2015-12-03
大体完成了Menu菜单，但是配色好丑，希望美工能早些把样品图给我。
<div align="center">
    <img src="http://i12.tietuku.com/90d02f2461683195.gif">
</div>
明后天做一下视图的跳转，整体的视图框架结构就差不多了。