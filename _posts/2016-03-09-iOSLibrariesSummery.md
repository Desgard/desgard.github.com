---
layout: post
author: Desgard_Duan
title: iOS开发中常用第三方库
category: learning
tag: [iOS]
---

## 网络通信

### 1.ASIHHTTPRequest

一个非常经典的老库，功能完全而且强大，但停更十分久了。（iOS 5.0后停止更新）在不同的iOS版本上略微有些小问题（都是warn），所以使用的时候稍微注意即可。

[源码地址](https://github.com/pokeb/asi-http-request)

### 2.AFNetworking

轻量级通讯类哭，使用十分简单。适用于iOS以及Mac OS X。它构建于在NSURLConnection，NSOperation, 以及其他熟悉的Foundation技术之上。它拥有良好的架构。

[源码地址](https://github.com/AFNetworking/AFNetworking)

### 3.MKNetworkKit

一个使用十分方便，功能又十分强大、完整的iOS网络编程代码库，完全基于 ARC。它只有两个类, 它的目标是使用像AFNetworking这么简单，而功能像ASIHTTPRequest(已经停止维护)那么强大。

[源码地址](https://github.com/MugunthKumar/MKNetworkKit)

<!-- more -->

## Socket

### 1.CocoaAsyncSocket

AsyncSocket是封装了`CFSocket`和`CFSteam`的`TCP/IP socket`网络库。它提供了异步操作，本地cocoa类的基于delegate的完整支持。

[源码地址](https://github.com/robbiehanson/CocoaAsyncSocket)

### 2.SocketRocket 

SocketRocket是Square开发的一个实现webSocket的库，可以轻松的实现即时通信。

[源码地址](https://github.com/square/SocketRocket)

## 数据解析

### 1.SBJSON

SocketRocket是Square开发的一个实现webSocket的库，可以轻松的实现即时通信。

[源码地址](https://github.com/stig/json-framework)

### 2.JSONKit

JSONKit解析速度上最接近iOS原生解析类，当然iOS5.0才开始支持原生解析，所以选择一个库还是很必要的。

[源码地址](https://github.com/johnezang/JSONKit)

### 3.TouchJSON

应该是目前用的最多的JSON解析第三方库，当然我自己也在用。

[源码地址](https://github.com/TouchCode/TouchJSON)

### 4.GDataXML 

GDataXMLNode是`Google`提供的用于XML数据处理的类集。该类集对libxml2--DOM处理方式进行了封装，能对较小或中等的xml文档进行读写操作且支持XPath语法。

[源码地址](https://developer.apple.com/library/ios/documentation/Cocoa/Reference/Foundation/Classes/NSXMLParser_Class/index.html)

## 第三方管理

### 1.fmdb

fmdb是数据库管理库，封装了sqlite相关的sql语句，简化了数据库操作。

[源码地址](https://github.com/ccgus/fmdb)

### 2.SSZipArchive

文件打包ZIP库，与SSToolKit作者相同。

[源码地址](https://github.com/ZipArchive/ZipArchive)

### 3.SDWebImage

【写到这里停止更新，由于今天鹅厂面试的一系列问题由此展开，本文后面将会继续更新。】




