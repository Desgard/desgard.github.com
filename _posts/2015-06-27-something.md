---
layout: post
author: Desgard_Duan
title: add(x)(y)(z)....的实现
category: learning
tag: [JavaScript]
---
今天在<code>Vim</code>群里看见某个朋友说的一个需要使用<code>JavaScript</code>实现的功能。于是自己深入的研究了一下这个问题。觉得收获挺大。

<!-- more -->
##问题描述##
函数<code>add</code>可以实现连续的加法运算：<br />
函数<code>add</code>语法如下：<br />
<code>add(num1)(num2)(num3)(...)...;</code><br />
使用举例如下 ：<br />
<code>add(10)(10) = 20;</code><br />
<code>add(10)(20)(30) = 60;</code><br />
##想法##
我看了他的问题，直接就写出了一般方法代码：
<div>
<pre class="brush: cpp">
var add = function(a){
    return function(b){
        return function(c){
            return a + b + c;
        };
    };
};
</pre>
</div>
然而，这并不能解决一般问题，如果涉及到多个参数的累加，需要对函数回调进行进一步的改进。<br />
