---
layout: post
author: Desgard_Duan
title: 在Windows环境下配置Jekyll
category: learning
tag: [life]
---

 ![img](/public/ach_img/2015-8-9-1.png "github&jekyll")
之前电脑硬盘突然崩溃，造成大量的数据丢失。之后自己从github上重新把站点clone下来，结果配置本地<code>Jekyll</code>的时候出现了大量的问题。</br>
这次赶快写一篇博文，把过程记录下来。

<!-- more -->

##Jekyll 简介
<code>Jekyll</code>是一个静态网站生成工具。它允许用户使用`HTML`、`Markdown`或`Textile`来建立静态页面，然后通过模板引擎`Liquid（Liquid Templating Engine）`来运行。</br >
[原文链接:Setup Jekyll on Windows](http://yizeng.me/2013/05/10/setup-jekyll-on-windows/)

##Jekyll 的安装步骤
* 安装 Ruby
* 安装 DevKit
* 安装 Jekyll
* 安装 Pygments
	* 安装 Python
	* 安装 ‘Easy Install’
	* 安装 Pygments
* 启动 Jekyll
* 故障诊断

##安装 Ruby
一、前往[Ruby下载页面](http://rubyinstaller.org/downloads/)<br />
二、在 “RubyInstallers” 部分，选择某个版本点击下载。<br />
三、通过安装包进行安装<br />

* 最好保持默认的路径 C:\Ruby200-x64， 因为安装包明确提出 “请不要使用带有空格的文件夹 (如： Program Files)”。
* 勾选 “Add Ruby executables to your PATH”，这样执行程序会被自动添加至 PATH 而避免不必要的头疼。

![img](http://cn.yizeng.me/assets/images/posts/2013-05-11-ruby-installer.png)

四、打开一个命令提示行并输入以下命令来检测 Ruby 是否成功安装。
> ruby -v


输出实例：
> ruby 2.0.0p451 (2014-02-24) [x64-mingw32]

##安装 DevKit