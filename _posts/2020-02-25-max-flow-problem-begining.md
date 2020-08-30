---
title: "初识最大流问题"
tags: 
    - 一瓜算法小册
    - 图论
comments: true
repository: "algo"
key: "part4/ch03/1-maximum-flow-basic/"
---


在阅读之前先来提出几个问题。如果这些问题你都知道答案那就可以直接跳过，期待下一篇文章了：  

- 什么是网络流模型？
- 网络流有哪些经典问题？
- 哪些问题能转化成网络流问题？

这篇文章会用一个描述的方式来先认识这些概念问题，而代替很多书上的符号标记。

## 流网络与最大流问题

首先网络流问题都是建立在流网络上的。这一点不要弄混，所谓流网络首先它是一个有向图，并且图中每条边都有一个非负的容量值。这个容量值我们暂时可以理解成边的权，但是这个权有着它自身的含义。我们来针对流网路举一个例子：

> 假设有这么一个例子，这次 2019-nCoV 疫情让口罩变成了稀缺资源。所以，全国各地都在为武汉捐献物资。假设现在因为种种原因，我们只能通过地面线路来运输口罩物资，并且每一条线路是有流量限制的。假设不考虑运输速度，并且源点 S （杭州）的口罩物资产量是足够多的，我们需要求解汇点 T（武汉）在不计速度的情况下能收到多少物资？

![问题示意](https://mmbiz.qpic.cn/mmbiz_png/zOnpE47IbCXIXrxZV4tiaHa4oRhzbwRTJibQECIdGciaHaRrx8ssqOI0zcDduadEUNTd1n4LfqRibbWU6f88ZY1dZg/640?wx_fmt=png)

上面的流网络可能我们很难一眼看出答案，那么我们先简化一下场景。我们删几条边来看下这个问题：

![问题简化](https://mmbiz.qpic.cn/mmbiz_png/zOnpE47IbCXIXrxZV4tiaHa4oRhzbwRTJpNjR2yqtX7aYkRia5QJX9QiaZkbEEJ5tPAgBibLLp3WhJHgEsU6V8dib7Q/640?wx_fmt=png)

对于这个流网络，我们可以轻松的获得汇点`T`的最大流量。

![最大流求解](https://mmbiz.qpic.cn/mmbiz_png/zOnpE47IbCXIXrxZV4tiaHa4oRhzbwRTJUrU5sGmu1GUzfVb5S1fLu1d7Qs5ibGc23Yc3QOpBdfRNsMRZplIm3LQ/640?wx_fmt=png)

因为在这个图中，只有两条路径，分别是`S → A → B → T`和`S → C → D → T`两条路径来输送流量，前者最大流量是 12 ，后者是 4，所以最大流量总和是 16。这其实就是流网络的一个经典问题模型 —— **最大流问题（Maximum-Flow Problem）**。

## 网络流问题的一些关键概念

在上述场景中，我们讲述了最大流问题是在研究什么样的问题。接下来，我们来定义一些网络流问题当中的一些关键概念。这些概念有助于理解以后学习网络流中出现的各种名词。

### 什么是增广路？

首先我们来说什么是增广（Augmenting）？在最大流问题中，我们每次找的一条可以增加汇点流量的路径，即在网络中找出一条可以到汇点 T 的道路，并且求出这条道路所有边剩余容量的最小值 d，并在上所有边的流量都加上这个 d，这个过程就是增广。而增广路（Augmenting Path）就是这条可以给 T 带来更多流量的路径。

![增广路](https://mmbiz.qpic.cn/mmbiz_png/zOnpE47IbCXIXrxZV4tiaHa4oRhzbwRTJKd6kUM0zdDGDiccOribe5a2hKXaVzPHUiaNnWJamZcqiaMHQFwl7Gt7oiaA/640?wx_fmt=png)

比如上图中，`S → A → B → T`和`S → C → D → T`就是两条增广路。

### 最大流中的增广路定理

由上面的定义，可以知道当一个流网络中，仍旧存在增广路的时候，此时汇点 T 是可以继续增加流量的，所以此时的情况肯定没有达到最大流。反之，**当且仅当网络中不存在 S-T 有增广路时，此时的流是从 S 到 T 的最大流**。这个就是最大流中的增广路定理。

### 什么是残余网络？

![残余网络](https://mmbiz.qpic.cn/mmbiz_png/zOnpE47IbCXIXrxZV4tiaHa4oRhzbwRTJIIUnLMcgeWEASaQEEsn2ZpsYtgNr2c3tu02N1EGicDEib3SSE3Eajb4Q/640?wx_fmt=png)

继续用上文中的那个场景，当已经选出`S → A → B → T`这条增广路的时候，我们将已经消费的流量记录在每条边流量的左方。像这种已经消费部分流量的网络，我们将其叫做残余网络。

## 最小割最大流定理

首先先了解一下什么是最小割，对于一个有向图，已知原点 S 和汇点 T。当我们拆掉图中的某几条边使得没有从 S 到 T 的通路，并保证所减的边的权重和最小。

在上面的例子中，相信大家很快就能找到这两条边，那就是`AB`和`DT`。我们用图来说明一下：

![最小割](https://mmbiz.qpic.cn/mmbiz_png/zOnpE47IbCXIXrxZV4tiaHa4oRhzbwRTJBDLRdAy1sRJ79xpicrkpZvlFO7aHAvmgdsvIJnjEgg7EI2GD2leRZkg/640?wx_fmt=png)

当通过割线`l`来删除`AB`和`DT`，此时发现起点 S 已经无法走到汇点 T 了。我们将这样的集合划分`(S, T)`称为`s-t`割，且具有容量定义：

$$
c(S, T)=\sum_{u \in S,v \in T}^{} c(u, v)
$$

这个式子左边的意思就是我们将这个图通过割线的分割后，就出现了 S, T 两部分，即包含起点 S 的部分和包含汇点 T 的部分。

而式子右边的意思是我们从 S 部分任取一个点，从 T 部分任取一个点，假设`uv`是一条边，则我们把这种情况的所有边容量加和。

这里的加和要以 S 到 T 为正向，则反向的容量就是负权。根据这种描述，我们就可以将图转化成以下模型：

![流与割的关系](https://mmbiz.qpic.cn/mmbiz_png/zOnpE47IbCXIXrxZV4tiaHa4oRhzbwRTJFoCpicOQX9z8Y2dgT1W8bD2icDlMPceX47EhEm3zwwhVexuSIRNTiasZA/640?wx_fmt=png)

假设`f(u, v)`代表是从`u`节点到`v`节点流过的流量，那么对于上面 S、T 两个虚拟的集合节点来说，肯定就有以下公式：

$$
f(S, T) \leq c(S,T)
$$

而流量什么时候到达最大值`c(S, T)`呢，我们上文说过，**当没有其他增广路的时候**。所以我们说，在最大流问题中，**一个流网络的最大流等于其最小割**。

## 小结

以上讨论中，我们已经学习了在网络流当中的一些相对重要的定义。根据上面的分析，你应该清楚如果我们想解决最大流问题，首先应该**实现找到增广路的算法。** 但是只找到增广路就可以解决了吗？你可以用上文提到的没有删减边的例子再试试。
