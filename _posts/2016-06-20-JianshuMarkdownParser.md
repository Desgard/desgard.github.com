---
layout:     post
title:      "Python Makes Me a Lazy Gua"
subtitle:   "Jianshu To Guardia文字爬文"
date:       2016-06-20 01:01:00
author:     "Desgard_Duan"
header-img: "img/post-bg-type.jpg"
tags:
    - Python
---

曾经由于[王垠](http://www.yinwang.org/)的影响，知道了简书。从那以后，在我的穿戴设备上统一卸载了知乎，安装了简书。因为感觉简书的清新和简介更合我胃口。当我开始学习iOS开发的时候，从Google上获取信息经常可以搜索到国人在简书上的博文，感觉简书已经不再单是文艺清新的体验，在互联网开发者的大军下又称为了一个知识园地。现在的简书其内涵价值远高于初。

之后经朋友邀请，加入了[Bestswifer](https://bestswifter.com/)的群，然后又结识了许许多多的同龄iOS开发大牛：[Jim](http://kuailejim.com/)、[LastDays](http://lastdays.cn/)、[Halfrost](https://halfrost.com/)等，他们水平都非常高，现在也就职于各一线互联网企业，博主十分钦佩。他们每个人在简书上都成立个人专栏，进行知识探求。在简书上获取知识成为一个iOS Developer的日常。

我希望我的博文平台也同步迁移到简书，但是同时更新简书和个人站点是一件很繁琐的事情。试想，在简书上编辑好的文字，然后复制粘贴→修改标记→核对标题时间→创建md文件……一趟下来，最少度过了20分钟。为了处理这些零碎的时间，打算编写个`Jianshu Markdown`转换为`krandom Markdown`的爬虫来处理效率问题。

<center>
<svg id="drawing" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="495" height="398.66668701171875" viewBox="143 55.66667175292969 495 398.66668701171875"><defs id="SvgjsDefs1001"></defs><g id="SvgjsG1007"><path id="SvgjsPath1008" d="M143 55.66667175292969H638V454.33335876464844H143V55.66667175292969Z " fill-opacity="1" fill="#ffffff"></path><g id="SvgjsG1009"><g id="SvgjsG1010" transform="translate(163 124)" opacity="0.5"><path id="SvgjsPath1011" d="M0 133C0 -44.333333333333336 264 -44.333333333333336 264 133C264 310.3333333333333 0 310.3333333333333 0 133Z " stroke-width="0" stroke="#a0bf7c" fill="#a0bf7c" opacity="1"></path></g><g id="SvgjsG1012" transform="translate(354 120)" opacity="0.5"><path id="SvgjsPath1013" d="M0 133C0 -44.333333333333336 264 -44.333333333333336 264 133C264 310.3333333333333 0 310.3333333333333 0 133Z " stroke-width="0" stroke="#2476c0" fill="#2476c0" opacity="1"></path></g><g id="SvgjsG1014" transform="translate(184 237)" opacity="1"><path id="SvgjsPath1015" d="M0 0L160 0L160 40L0 40Z " stroke-dasharray="none" stroke-width="0" stroke="#323232" fill="none" opacity="1"></path><g id="SvgjsG1016" transform="matrix(1 0 0 1 0 10.625)" fill="#ffffff"><text id="SvgjsText1017" font-family="Arial,宋体" fill="#323232" font-size="15" font-weight="bold" font-style="normal" text-anchor="middle" text-decoration="blink" x="80" y="14">HTML Tags</text></g></g><g id="SvgjsG1018" transform="translate(195 311)" opacity="1"><path id="SvgjsPath1019" d="M0 0L160 0L160 40L0 40Z " stroke-dasharray="none" stroke-width="0" stroke="#323232" fill="none" opacity="1"></path><g id="SvgjsG1020" transform="matrix(1 0 0 1 0 -8.125)" fill="#ffffff"><text id="SvgjsText1021" font-family="Arial,宋体" fill="#323232" font-size="15" font-weight="normal" font-style="normal" text-anchor="middle" text-decoration="blink" x="80" y="14">&lt;a&gt;</text><text id="SvgjsText1022" font-family="Arial,宋体" fill="#323232" font-size="15" font-weight="normal" font-style="normal" text-anchor="middle" text-decoration="blink" x="80" y="32.75">&lt;h1&gt;</text><text id="SvgjsText1023" font-family="Arial,宋体" fill="#323232" font-size="15" font-weight="normal" font-style="normal" text-anchor="middle" text-decoration="blink" x="80" y="51.5">...</text></g></g><g id="SvgjsG1024" transform="translate(423 237)" opacity="1"><path id="SvgjsPath1025" d="M0 0L160 0L160 40L0 40Z " stroke-dasharray="none" stroke-width="0" stroke="#323232" fill="none" opacity="1"></path><g id="SvgjsG1026" transform="matrix(1 0 0 1 0 10.625)" fill="#ffffff"><text id="SvgjsText1027" font-family="Arial,宋体" fill="#323232" font-size="15" font-weight="bold" font-style="normal" text-anchor="middle" text-decoration="blink" x="80" y="14">krandom Markdown</text></g></g><g id="SvgjsG1028" transform="translate(423 311)" opacity="1"><path id="SvgjsPath1029" d="M0 0L160 0L160 40L0 40Z " stroke-dasharray="none" stroke-width="0" stroke="#323232" fill="none" opacity="1"></path><g id="SvgjsG1030" transform="matrix(1 0 0 1 0 -8.125)" fill="#ffffff"><text id="SvgjsText1031" font-family="Arial,宋体" fill="#323232" font-size="15" font-weight="normal" font-style="normal" text-anchor="middle" text-decoration="blink" x="80" y="14">[Text](url)</text><text id="SvgjsText1032" font-family="Arial,宋体" fill="#323232" font-size="15" font-weight="normal" font-style="normal" text-anchor="middle" text-decoration="blink" x="80" y="32.75"># text</text><text id="SvgjsText1033" font-family="Arial,宋体" fill="#323232" font-size="15" font-weight="normal" font-style="normal" text-anchor="middle" text-decoration="blink" x="80" y="51.5">...</text></g></g><g id="SvgjsG1034" transform="translate(307 224)" opacity="1"><path id="SvgjsPath1035" d="M0 0L160 0L160 40L0 40Z " stroke-dasharray="none" stroke-width="0" stroke="#323232" fill="none" opacity="1"></path><g id="SvgjsG1036" transform="matrix(1 0 0 1 0 1.25)" fill="#ffffff"><text id="SvgjsText1037" font-family="Tahoma,宋体" fill="#323232" font-size="15" font-weight="bold" font-style="normal" text-anchor="middle" text-decoration="blink" x="80" y="15">inner</text><text id="SvgjsText1038" font-family="Tahoma,宋体" fill="#323232" font-size="15" font-weight="bold" font-style="normal" text-anchor="middle" text-decoration="blink" x="80" y="33.75">HTML</text></g></g></g></g></svg>
</center>

由于尚未`Python`开发经验，搜索了大量信息后，决定使用`BeautifulSoup`第三方库来实现`HTML`中`Dom`树的解析，在通过`正则表达式`将有用的标签信息搜取出来，针对于我的日常需要，只转换主要的几个标签即可。我在[Github](https://github.com/dgytdhy/JianshuMarkdownParser.py)上已经写出了爬虫的demo，现在已经可以支持`<h>`、`<a>`、`<p>`、`<img>`、`<pre>`等常用标签的转换，在后期的编写时，对于文章信息做一个解析即可完成。

下面是目前的一个成果截图。如果你也有相同的需求，或者对这个项目有兴趣，可以一起贡献代码。然后再根据自己的`markdown`引擎解析器，制作自己的站点博文同步爬虫。

![](/assets/img/post_img/2016-06-20/screenshot.png)

--- 

[Github【Desgard_Duan】](https://github.com/dgytdhy/JianshuMarkdownParser.py)
