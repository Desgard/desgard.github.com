---
layout:     post
title:      "Show TODO And FIXME As Warnings In Xcode"
subtitle:   "利用xcode黑魔法，控制warn提示"
date:       2016-05-16 01:01:00
author:     "Desgard_Duan"
header-img: "img/post-bg-rwd.jpg"
tags:
    - iOS
    - shell
---

很多时候我们遇到过这样的问题：

> 在修改代码的时候，我们跳转到其他相关联的代码片段修改，之后又返回到原来的地方继续修改。或者，在修改的时候，测试人员跟你说有一个很严重的bug，于是我们会放下手上的工作，开始修改它处代码。

其实遇到上述情况，最好的做法是加一段`警告注释`，这样做的好处快速定位、提醒未完成事项，更可以协助他人做出修改批注。其效果如下图所示：


![](/assets/img/post_img/Warning-Freedom.png)

下面来实现以下以上效果，将所有标记为`// TODO:`和`// FIXME:`注释标记，让编译器建立该行为警告部分。

### Instructions 

* 点击工程目录栏中的`Project Navigator`（一般是项目工程的最上方选项）
* 点击`Build Phases`一栏
* 点击`Add Build Phase`在该栏下的左上角
* 在`shell`文本编辑下插入以下`Shell`脚本

### Bash Script For "Run Script" Build Phase


{% highlight ruby %}
KEYWORDS="TODO:|FIXME:|\?\?\?:|\!\!\!:"
find "${SRCROOT}" \( -name "*.h" -or -name "*.m" \) -print0 | xargs -0 egrep --with-filename --line-number --only-matching "($KEYWORDS).*\$" | perl -p -e "s/($KEYWORDS)/ warning: \$1/"
{% endhighlight %}

[代码链接](https://github.com/dgytdhy/shell/blob/master/xcode_auto_warn.sh)

插入`shell`脚本之后，就可以在项目中添加`// TODO:`类的注释，这样编译器就会将其自动跟踪添加为警告状态。你可以自行对齐增加事情状态含义，也可以自定义添加更具体的警告描述在注释中。`shell`脚本主要就是`正则表达式`的简单运用，不难理解。

个人对以上warn的定义：

* `// TODO:` ：将要处理的事项
* `// FIXME:` ：继续之前的修改项
* `// !!!` ：code review中对代码的修正，提示编写者
* `// ???` ：code review中对代码的疑问，询问编写者

---

[谈谈Objective-C的警告【王巍】](https://onevcat.com/2013/05/talk-about-warning/)