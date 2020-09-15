---
title: "为什么使用汇编可以 Hook objc_msgSend（上）- 汇编基础"
tags: 
    - "iOS 方案之本"
comments: true
---

# 背景

1. 在方法的启动耗时中，需要去 Hook `objc_msgSend` 来达到监控所有 ObjC 方法的目的。对应的文章在这里「[App 启动速度怎么做优化与监控？](https://time.geekbang.org/column/article/85331)」。
2. 在二进制重排启动优化中，我们需要通过 Hook 所有在启动时期运行的方法，才能找到方法的执行顺序，从而确定 order file 中的符号要如何排序。在确定 ObjC 方法的顺序时，我们也需要对 `objc_msgSend` 方法进行 Hook，其原理也和背景 1 是相同。对应的方案在这里「[抖音研发实践：基于二进制文件重排的解决方案 APP启动速度提升超 15%](https://mp.weixin.qq.com/s?__biz=MzI1MzYzMjE0MQ==&mid=2247485101&idx=1&sn=abbbb6da1aba37a04047fc210363bcc9&scene=21)」

在这两个方案中，我们都使用了内联汇编的方式。我们分成两篇文章来讲述这个方法的所有细节以及设计到的各个基础知识。当然这一切要求你有 ARM 汇编的基础知识，所以这篇文章，会从汇编基础开始讲起。

# 零基础入门 ARM 汇编基础

> 当然这里的零基础其实是加引号的，你需要简单的了解 iOS 的内存分区，并且你已经知道了方法调用是栈特性的。

## iOS 内存分区及栈区

在了解汇编基础之前，我们先来复习一下 iOS 的内存分区，并且从中拉出我们需要和汇编一起研究的栈(Stack) 区：

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardiaiOS%20%E5%86%85%E5%AD%98%E5%88%86%E5%8C%BA%E5%8F%8A%E6%A0%88%E5%8C%BA%E6%94%BE%E5%A4%A7.png)

上图中，我们将栈区当中对于 `func X` 这个方法的存储区域单独拿出来研究，在这个区域里存储着 `func X` 这个方法的局部变量。那么右图中的 `FP`、`SP` 又是什么？

## 向低地址增长的特性

有一个很重要的地方，**iOS 内存的栈空间是向低地址生长的**！换句话说，在图示中靠下的位置是栈顶，靠上方的位置是栈底：

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia%E5%90%91%E6%A0%88%E9%A1%B6%E4%BD%8E%E5%9C%B0%E5%9D%80%E7%9A%84%E5%A2%9E%E9%95%BF%E6%96%B9%E5%90%91.png)

## 通用寄存器、 SP 寄存器

> 当然除了这两种寄存器以外，还有 **PC 寄存器**、**浮点寄存器**以及**状态寄存器**。在 Hook `objc_msgSend` 方法时，**其实也要预先记录浮点寄存器以保证数据完整性**。这个问题我们后续在源码分析时会做详细讲解。

为了了解栈区中的 `FP` 、`SP` ，我们来详细的了解一下 ARM64 中的通用寄存器。

ARM64 有 31 个通用寄存器，每个寄存器可以存取一个 64 位的数据。我们可以通过 X0 - X30 来对这些寄存器进行寻址。对应 X0 - X30，W0 - W30 对应的就是**相同单元数的低 32 位**。W0 - W30 当进行写入操作时，**会将高 32 位清零**。

对于这 31 个通用寄存器我们用图来描述一下：

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia31%20%E4%B8%AA%E9%80%9A%E7%94%A8%E5%AF%84%E5%AD%98%E5%99%A8.png)

这里我们来解释一下每一个寄存器具体的作用：

- X0 - X7：这 8 个寄存器主要**用来存储传递参数**。如果参数超过 8 个，**则会通过栈来传递**；**X0 也用来存放上文方法的返回值**；
- **X29**：即我们通常所说的帧指针 FP（Frame Pointer），**指向当前方法栈的底部**（这里有很多书是说“指向栈的底部”，这是不准确的说法。实验的结果告诉我是指向当前方法栈的底部）。
- **X30**：即链接寄存器 LR（Link Register）。为什么叫做链接，是**因为这个寄存器会记录着当前方法的调用方地址**，即当前方法调用完成时应该返回的位置。例如我们遇到 Crash 要获取方法堆栈，其本质就是不断的向上递归**每一个 X30 寄存器的记录状态（也就是栈上 X30 寄存器的内容）**来找到上层调用方。（在后文中有图示说明）

除了这些通用寄存器，还有一个最重要的 SP 寄存器：

- **SP 寄存器**：即我们通常说的栈帧 SP（Stack Pointer）。**指向当前方法栈的顶部**，与通用寄存器低 32 位的访问方法一样，你也可以**通过 WSP 来访问 SP 的低 32 位**。

当看完介绍，（同我刚刚看完文档一样）你肯定会有一个疑问：X29 和 X30 感觉栈中的每个方法都会存在一个，例如 Crash 之后，我需要找到调用方的地址，这时候我去访问 X30 寄存器，**但是我调用方也会存在调用方，这时候我应该去访问谁来找到父亲的父亲呢**？难道这些寄存器不是唯一的吗？

带着这样的疑问我们继续来讲栈中的方法。

## 栈空间开辟和释放

我们通过上层的高级语言得知，我们不断的递归调用一个方法，就会造成 StackOverFlow，**也就是”爆栈”了**。也许你会说：因为我们需要在栈区反复的给即将运行的方法开辟空间，所以爆栈了。这所谓的开空间，是一个什么样的操作？在栈区当中的表现又是什么样的？

我们上面说道，`FP` 始终指向当前方法的栈底，`SP` 始终指向当前方法的栈顶。所以在栈区中，不断向更深层次调用方法就如同下图所示：

<video src="https://github.com/Desgard/img/raw/master/img/%E4%B8%BA%E4%BB%80%E4%B9%88%E4%BD%BF%E7%94%A8%E6%B1%87%E7%BC%96%E5%8F%AF%E4%BB%A5%20Hook%20objc_msgSend%EF%BC%88%E4%B8%8A%EF%BC%89-%20%E6%B1%87%E7%BC%96%E5%9F%BA%E7%A1%80%203e0cf5eda593427d9252934d06e0c829.m4v" width="100%" controls="controls">
您的浏览器不支持 video 标签。
</video>

对应的，当我们需要释放一个区域，其实也是 `SP` 指针下沉的过程：

<video src="https://github.com/Desgard/img/raw/master/img/%E4%B8%BA%E4%BB%80%E4%B9%88%E4%BD%BF%E7%94%A8%E6%B1%87%E7%BC%96%E5%8F%AF%E4%BB%A5%20Hook%20objc_msgSend%EF%BC%88%E4%B8%8A%EF%BC%89-%20%E6%B1%87%E7%BC%96%E5%9F%BA%E7%A1%80%203e0cf5eda593427d9252934d06e0c829%201.m4v" width="100%" controls="controls">
您的浏览器不支持 video 标签。
</video>

由于 `SP` 是始终指向栈顶（低地址）的，这就好比我们在数据结构中学的栈一样，每次进行 `Push` 压栈的时候，其顶部指针就会上移（向低地址偏移），而当进行弹栈 `Pop` 操作时，指针下沉（向高地址偏移）。在方法栈中，我们的方法就相当于一个又一个栈内元素，与之对应的就是 `SP` 指针的上移和下沉。

> 上面这段话有一些绕，所以我在操作的地方都增加了地址的高低方向。**这个向下增长的栈和我们以往见到的向上生长的栈是完全相反的，**这个一定要注意。

这样我们也就可以解释的通什么是”爆栈“了，我们发现方法压栈操作执行时，在汇编层执行的是类似于 `sub  sp, sp, #0xN` 这种操作，这个指令决定了 `SP` 是往低地址逐渐逼近。**所以当 SP 移动到栈区的最低位置（接近于堆区），则称之为”爆栈“**。

# 函数在汇编中的表现

从以往的定义中我们知道，栈区其实是存放临时变量、记录函数调用的区域。我们的函数因为有了栈，所以才会具有递归的特点。但是 SP 、 FP 和 LR 只有一个，那么我们在 Crash 的时候是如何回溯到当前所有的堆栈情况的呢？（当然这里的回溯方式只是通过寄存器 FP 寄存器方式，当然回溯的方法还有一种 **Compact Unwind 方式**，这个我们后续文章中再做讲述）。

我们也一步一步来，首先来了解一下函数在栈区中的结构。

## 函数的栈区结构

我们从一个例子来切入，假如我们在执行 `main()` 方法。此时我们来模拟一下当前的栈区空间：


![](https://raw.githubusercontent.com/Desgard/img/master/img/guardiamain()%20%E6%96%B9%E6%B3%95%E5%9C%A8%E6%A0%88%E5%8C%BA%E4%B8%AD%E7%9A%84%E4%BD%8D%E7%BD%AE.png)

此时在栈上会分配一个区域，即从 `FP`（`main` 方法的栈底）到 `SP` （`main` 方法的栈顶）。

## 函数调用时栈区表现

这时候，我们的代码在 `main` 方法中，需要调用 `gua` 这个方法，根据我们编程经验，这时候我们需要将 `gua` 这个方法入栈了，那么这个这个入栈过程是什么样的呢？用动画来演示一下整个过程：

<video src="https://github.com/Desgard/img/raw/master/img/%E4%B8%BA%E4%BB%80%E4%B9%88%E4%BD%BF%E7%94%A8%E6%B1%87%E7%BC%96%E5%8F%AF%E4%BB%A5%20Hook%20objc_msgSend%EF%BC%88%E4%B8%8A%EF%BC%89-%20%E6%B1%87%E7%BC%96%E5%9F%BA%E7%A1%80%203e0cf5eda593427d9252934d06e0c829%202.m4v" width="100%" controls="controls">
您的浏览器不支持 video 标签。
</video>



在这个动画中我们拿出一个指令来解释一下：

## `stp  x29, x30, [sp, #0x10]`

这里我们需要记录 `x29` 和 `x30` 寄存器，也就是上文所说的 `FP` 和 `LR` 。为什么要记录这个呢？

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardiaUntitled%203.png)

因为 `FP` 存储的是方法栈底，而 `LR` 指向**方法结束阶段返回的上层方法的地址**（这里的说法经 @leo 提议，参考了文档描述 「*A link register is a special-purpose register which holds the address to return to when a function call completes.」*翻译而来，更加准确）**。**可以想象一下，**当我们知道这两个信息是不是就可以恢复方法的调用栈了？**

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardiaUntitled%204.png)

通过这种方式，我们了解了通过栈空间来回溯调用栈的基本思路，当然在实际实现中，很多 API 已经被系统库封装好了，我们仅仅需要在高级语言层面进行调用获取即可。

## 关于 `stp` 指令的解释

`stp` 指令是 `str` 的变种指令，`p` 可以理解成 `pair` 的意思，可以同时操作两个寄存器。举一个例子：

```cpp
stp x29, x30, [sp, #0x10] 	; 将 x29, x30 的值存入 sp 偏移 16 个字节的位置 
```

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardiastp_.gif)

这里我们需要注意的一个点，在后面对于 `objc_msgSend` 方法 Hook 的汇编代码中，会有这么一条指令：

```cpp
stp q6, q7, [sp, #-32]!
```

这与上面所说的 `stp` 命令不太一样。我们注意到差异是在 `sp` 偏移寻址的标记后多了一个 `!` 。则这条命令可以等效于：

```cpp
sub sp, sp, #32
stp q6, q7, [sp]
add ap, sp 

```

也就是说，在执行上文，在执行上文的 stp 指令后，还会使 sp 寄存器也产生偏移。如此就可以达到持续入栈的效果，类似于 ARM32 中的 push 指令。

# 总结

本文并没有解释 `objc_msgSend`  Hook 方案中的内联汇编代码，但是后续学习它，本文讲解了 ARM64 的汇编基础，其中包括的知识有：

也就是说，在执行完上文的 stp 指令后，还会使 sp 寄存器也产生偏移。如此就可以达到持续入栈的效果，类似于 ARM32 中的 push 指令。

- iOS 的内存分区及栈区；
- ARM64 中的寄存器及其含义；
- 开辟和释放栈空间以及什么是"爆栈"；
- 方法调用时的栈空间表现；
- 函数栈基于寄存器的回溯思路方案；
- `stp` 命令解释；

希望这些基础可以烂熟于心，从而开始后续更加深入的方案学习！

# 文章推荐与鸣谢

- [iOS 汇编入门教程（一）ARM64汇编基础](https://juejin.im/post/5aabcae1f265da238d507a68)  **@高级页面仔**
- [iOS 汇编精讲](https://blog.csdn.net/Hello_Hwc/article/details/80028030)  **@leo**
- [iOS 开发同学的arm64汇编入门](http://blog.cnbluebox.com/blog/2017/07/24/arm64-start/)  刘坤
- 「iOS 应用逆向与安全之道」  罗巍

特别感谢好友 **@linxi** 、**@高级页面仔**、**@Jadyn**、**@leo** 对于文章的斧正。另外推荐几个关于 ARM64 汇编学习及调试的优秀资料：

- [iOS 调试进阶](https://zhuanlan.zhihu.com/c_142064221)
- [ARM 官方文档](http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.dui0802a/STUR_fpsimd.html)