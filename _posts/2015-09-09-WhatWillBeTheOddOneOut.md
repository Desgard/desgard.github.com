---
layout: post
author: Desgard_Duan
title: JavaScript的let语句
category: learning
tag: [JavaScript]
---
又是一道题目引发的经历：<br />
今天在做`codewars`的时候，遇到了这么一道题目：<br />
[题目链接](http://www.codewars.com/kata/55b080eabb080cd6f8000035/train/javascript)
##Instructions
Write a `function oddOneOut(str)` that will take in a string and return the unpaired characters in the order it was encountered as an array.

E.g

str = `'Hello World'` will return `["H", "e", " ", "W", "r", "l", "d"]`<br /> 
str = `'Codewars'` -> `["C", "o", "d", "e", "w", "a", "r", "s"] (no letter has a pair) `<br /> 
str = `'woowee'` -> `[] (all letters pair up) `<br /> 
str = `'wwoooowweeee'` -> `[] `<br /> 
str = `'racecar'` -> `["e"]`<br /> 
str = `'Mamma'` -> `["M"]`<br /> 
str = `'Mama'` -> `["M", "m"]`<br /> 

 
*Letters are case-sensitive.*

##Hint
JavaScript runs on Node v0.10.21. All code is ran through BabelJS (ES 2015 supported)


<!-- more -->

##题目解析
看到第一眼，就想到了用`数组`去记录元素个数，然后每两个进行消除即可。在`JavaScript`中，`Array()`对象支持`字典`功能，比较方便的处理了计数问题。<br />
于是，有了如下的第一反应的代码。<br />

<div>
<pre class="brush: js">
function oddOneOut(str) {
	// code me
	var lett = "1234567890=+-ร—รท//?:;,.abcdefghijklmnopqrstu
		vwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\u0020";
	var strr = str;
	var ss = str;
	var lee = new Array();
	var dou = new Array();
	for (var i = 0; i < lett.length; ++ i) {
		lee[lett[i]] = 0;
		dou[lett[i]] = 0;
	}
	// console.log(lee);
	for (var i = 0; i < ss.length; ++ i) {
		lee[ss[i]] ++;
	}
	// console.log(lee);
	var res = new Array();
	for (var i = 0; i < strr.length; ++ i) {
		var now = strr[i];
		if (lee[now] >= 2) {
			dou[now] ++;
			if (dou[now] == 2) {
				dou[now] = 0;
				lee[now] -= 2;
			}
		} else {
			res.push(strr[i]);
		}
	}
	return res;
}
</pre>
</div>
这个思路写出的代码十分冗长，而且可读性 并不是十分清晰。在翻看`Solutions`的时候看见了如下优质代码：

<div>
<pre class="brush: js">
function oddOneOut(str) {
	let chars = new Set();
	for (let c of str) {
    	if (chars.has(c))
			chars.delete(c);
    	else
			chars.add(c);
	}
	return Array.from(chars);
}
</pre>
</div>

下面我们队这段代码进行分析。

以下是`Dash文档`上面给出的`Set()对象`描述：
> Set objects are collections of values, you can iterate its elements in insertion order. A value in the Set may only occur once; it is unique in the Set's collection.'

简单的说，`Set()对象`是一个`集合`，相同的元素在其中有且只有一个。<br />
这段代码用`Set()`作为字符的容器，然后没遇到一个就从中查找，有重复就将其中的对应元素删除，没有的话就添加。<br />
这里我们特别注意到了这么一句。
<div>
<pre class="brush: js">
function oddOneOut(str) {
	for (let c of str) 
</pre>
</div>

其中的`let`关键字，作用其实和`var`很是类似，但是要注意他们的区别。let的作用域是块，而var的作用域是函数。以上的例子我们无法明确的看出区别，下面放一个号例子。
<div>
<pre class="brush: js">
var a = 5;
var b = 10;

if (a === 5) {
	let a = 4; // The scope is inside the if-block
	var b = 1; // The scope is inside the function
	console.log(a);  // 4
	console.log(b);  // 1
} 
console.log(a); // 5
console.log(b); // 1
</pre>
</div>
`let`在循环遍历中要注意作用域的问题，循环体中是可以引用在for申明时用let定义的变量，尽管let不是出现在大括号之间。
<div>
<pre class="brush: js">
var i = 0;
for (let i = i; i < 10 ;i ++ ) {
	console.log(i);
}
</pre>
</div>

#####域作用规则
> for (let expr1; expr2; expr3) statement

在这个例子中，*expr2*, *expr3*, 和 *statement are* 是包含中在一个隐含域块中，其中也包含了 *expr1*.

> 最后请注意：该新特性属于 ECMAScript 2015（ES6）规范，在使用时请注意浏览器兼容性。