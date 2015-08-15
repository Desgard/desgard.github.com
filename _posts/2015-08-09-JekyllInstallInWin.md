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
DevKit 是一个在 Windows 上帮助简化安装及使用 Ruby C/C++ 扩展如 RDiscount 和 RedCloth 的工具箱。 详细的安装指南可以在程序的[wiki页面](https://github.com/oneclick/rubyinstaller/wiki/Development-Kit#installation-instructions)阅读。<br />
一、再次前往 [Ruby下载页面](http://rubyinstaller.org/downloads/)<br />
二、下载同系统及 Ruby 版本相对应的 DevKit 安装包。<br />
三、运行安装包并解压缩至某文件夹，如 C:\DevKit<br />
四、通过初始化来创建 config.yml 文件。在命令行窗口内，输入下列命令：<br />
> cd “C:\DevKit”


> ruby dk.rb init


> notepad config.yml

五、在打开的记事本窗口中，于末尾添加新的一行 - C:\Ruby200-x64，保存文件并退出。<br />
六、回到命令行窗口内，审查（非必须）并安装。<br />
> ruby dk.rb review


> ruby dk.rb install

##安装 Jekyll
一、确保 gem 已经正确安装
> gem -v

输出示例：
> 2.0.14

二、安装 <code>Jekyll gem</code>
> gem install jekyll

##启动 Jekyll
按照官方的 [Jekyll 快速开始手册](http://jekyllrb.com/docs/quickstart/)的步骤， 一个新的 Jekyll 博客可以被建立并在localhost:4000浏览。

> jekyll new myblog

> cd myblog

> jekyll server

