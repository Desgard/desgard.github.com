---
layout: post
author: Desgard_Duan
title: 用javaScript获取地址栏参数
category: learning
tag: [JavaScript]
---

 ![img](/public/ach_img/2015-8-16-1.jpg "冬瓜私房猫")
挺好玩的功能，自己决定试一试！

<!-- more -->
获取JavScript执行函数名称的方法，具体的函数如下：

函数名称为`getFuncName`，在为了获取JavaScript函数名称的时候，直接使用`getFuncName`函数

##方法一
<div>
<pre class="brush: js">
	String.prototype.getQuery = function(name) {  
	　　var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  
	　　var r = this.substr(this.indexOf("\?")+1).match(reg);  
	　　if (r!=null) return unescape(r[2]); 
		return null;  
	}  
	var strHref = "http://www.desgard.com/index.htm?a=aaa&b=bbb&c=ccc";  
	alert(strHref.getQuery("a"));  
	alert(strHref.getQuery("b"));  
	alert(strHref.getQuery("c"));
</pre>
</div>

##方法二
<div>
<pre class="brush: js">
function getUrlPara (paraName) {  
	var sUrl = location.href; 
	var sReg = "(?:\\?|&){1}" + paraName + "=([^&]*)"; 
	var re = new RegExp (sReg,"gi"); 
	re.exec (sUrl); 
	return RegExp.$1; 
} 
// 应用实例：test_para.html?a=11&b=22&c=33 
alert (getUrlPara ("a")); 
alert (getUrlPara ("b")); 
</pre>
</div>

##方法三
<div>
<pre class="brush: js">
function Request (strName) {  
	var strHref = "www.desgard.com/index.htm?a=aaa&b=bbb&c=ccc";  
	var intPos = strHref.indexOf("?");  
	var strRight = strHref.substr(intPos + 1);  
	var arrTmp = strRight.split("&");  
	for (var i = 0; i < arrTmp.length; ++ i) {  
		var arrTemp = arrTmp[i].split("=");  
		if(arrTemp[0].toUpperCase() == strName.toUpperCase()) 
			return arrTemp[1];  
	}  
	return "";  
}  
alert(Request("a"));  
alert(Request("b"));  
alert(Request("c")); 
</pre>
</div>

其中，第三种方法没有使用正则表达式，而是使用了`split()`方法，这个方法在`JavaScript`还是在`Java`中都是处理字符串很常见的函数，据说面试经常会考~