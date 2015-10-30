---
layout: post
author: Desgard_Duan
title: SQLite细究
category: learning
tag: [iOS]
---
最近发现了学习专业课程的乐趣，感觉对于信号的处理好有趣，于是很少去看技术书籍了。于是决定整理一下之前学习过的`SQLite`，从而带动学习`iOS`的兴趣。<br />

![img](http://pic.baike.soso.com/p/20140320/20140320092927-992957696.jpg)

`SQLite`相对于`MySQL`和`Oracle`要轻量、较小很多。就如他的logo一样，像一只羽毛，但是却少了它鸟儿却无法飞翔。

<!-- more -->

##简介

`SQLite`，是一款轻型的数据库，是遵守ACID的关系型数据库管理系统。它的设计目标是嵌入式的，目前`Android`和`iOS`的设备内置的都是`SQLite`数据库。`SQLite`虽然娇小，但也支持事务和多数的`SQL92标准`。



##主要提点
* `Zero-Configuration` 无需安装和管理配置。
* `Serverless` 无需服务器支持。
* `Single Database File` 数据文件存储在一个单一的磁盘文件。
* `Stable Cross-Platform Database File` 数据库文件格式跨平台，无论是大小端，或者是32bit或64bit机器都没有关系
* `Compact` 完整特性的`SQLite`编译出来在`500KiB`左右，裁剪特性甚至可以得到低于`300KiB`的库。
* `Manifest typing` 可以声明数据库字段类型，但是字段存储的类型实际的存储类型和实际值相关，单独的一个字段可能包含不同存储类的值。
* `Variable-length records` 可变长度记录，例如你存储一个字符到`VARCHAR(100)` 的列，实际需要的存储空间一个字符加一个字节的存储空间。
* `SQL statements compile into virtual machine code SQL`语句会被编译成虚拟机代码，这种虚拟机代码直白可读，便于调试。
* `Public domain` 完全开源。
* `SQL language extensions`

##主要缺点
* `SQLite` 只提供数据库级的锁定，所以不支持高并发。
* 不支持存储过程。
* `SQLite`没有用户帐户概念，而是根据文件系统确定所有数据库的权限。这会使强制执行存储配额发生困难,强制执行用户许可变得不可能。

当然，如果只在移动设备上使用数据库，由于`SQLite`的缺点不明显，最合适不过。

##事物与锁
`SQLite`的事务和锁是很重要的概念。
###锁
SQLite有5个不同的锁状态

* UNLOCKED（未加锁）
* SHARED（共享）
* RESERVED（保留）
* PENDING（未决）
* EXCLUSIVE（排它）

`SQLite`有一个加锁表，记录数据库连接的锁状态。每个数据库连接在同一时刻只能处于其中一个锁状态。每种状态(UNLOCKED)都有一种锁与之对应。
###读
数据库连接最初处于`UNLOCKED状态`，在此状态下，连接还没有存取数据库。当连接到了一个数据库，甚至已经用BEGIN开始了一个事务时，连接都还处于`UNLOCKED状态`。为了能够从数据库中读取数据，连接必须必须进入`SHARED状态`，也就是说首先要获得一个`SHARED锁``。多个连接可以同时获得并保持共享锁，也就是说多个连接可以同时从同一个数据库中读数据，SQLite`是支持并发`读取数据`的。
###写
一个连接想要写数据库，它必须首先获得一个`RESERVED锁`。一个数据库上同时只能有一个`RESERVED锁`，保留锁可以与共享锁共存，`RESERVED锁`即不阻止其它拥有SHARED锁的连接继续读数据库，也不阻止其它连接获得新的`SHARED锁`。 一旦一个连接获得了`RESERVED锁`，它就可以将数据写入缓冲区，而不是实际地写到磁盘。 当连接想要提交修改(或事务)时，需要获得`PENDING锁`，之后连接就不能再获得新的`SHARED锁`了，但已经拥有`SHARED锁`的连接仍然可以继续正常读数据库。当所有其它`SHARED锁`都被释放时，拥有`PENDING锁`的连接就可以将其锁提升至`EXCLUSIVE锁`，此时就可以将以前对缓冲区所做的修改写到数据库文件。所以SQLite是**不支持并发**写的。
###事务
SQLite有三种不同的事务

* DEFERRED（推迟）
* MMEDIATE（立即）
* EXCLUSIVE（排它）

事务类型在BEGIN命令中指定：
<div>
    <img src="http://cc.cocimg.com/api/uploads/20150824/1440382995962962.gif">
</div>

###DEFERRED
一个`DEFERRED事务`不获取任何锁(直到它需要锁的时候)，BEGIN语句本身也不会做什么事情——它开始于`UNLOCK状态`。默认情况下就是这样的，如果仅仅用BEGIN开始一个事务，那么事务就是DEFERRED的，同时它不会获取任何锁；当对数据库进行第一次读操作时，它会获取SHARED锁；同样，当进行第一次写操作时，它会获取`RESERVED锁`。

###MMEDIATE 
由BEGIN开始的`IMMEDIATE事务`会尝试获取`RESERVED锁`。如果成功，BEGIN IMMEDIATE保证没有别的连接可以写数据库。但是，别的连接可以对数据库进行读操作；但是，`RESERVED锁`会阻止其它连接的BEGIN IMMEDIATE或者BEGIN EXCLUSIVE命令，当其它连接执行上述命令时，会返回`SQLITE_BUSY错误`。这时你就可以对数据库进行修改操作了，但是你还不能提交，当你COMMIT时，会返回`SQLITE_BUSY错误`，这意味着还有其它的**读事务没有完成**，得**等它们执行完后才能提交事务**。
###EXCLUSIVE 
`EXCLUSIVE事务`会试着获取对数据库的`EXCLUSIVE锁`。这与IMMEDIATE类似，但是一旦成功，EXCLUSIVE事务保证没有其它的连接，所以就可对数据库进行读写操作了。
###死锁
如果两个以BEGIN DEFERRED开始事务的连接都处于`SHARED状态`，并且都在等待对方结束SHARED从而进入RESERVED的话，就会进入`死锁状态`。所以**BEGIN DEFERRED开始的事务是有可能产生死锁的**。

