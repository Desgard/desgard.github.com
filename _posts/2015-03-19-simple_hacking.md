---
layout: post
author: Desgard_Duan
title: Simple Hacking 行政视频挂机方案(for SWJTU)
category: learning
tag: [JavaScript]
---
本方法思想有学长 MMG 提供，个人只是修改了部分代码以便自己使用。想刷行政的小伙伴们注意了，虽然博主自己在用，但是不能保证<code>100%</code>
成功。供大家学习参考，如果没挂够自己理想的学时，不要怨我哦~

 ![img](/public/ach_img/2015-1-30-1.jpg "Geek冬瓜")
<!-- more -->
##使用说明##
<strong>Ⅰ</strong>.打开一个<a href="http://202.115.71.131/course/page/widered/index.jsp?c_id=196&c_name=3C0CD8506934059CA20281C5737DA286&c_count=0BDC281BA283D098&c_domain=289F67C16B2D311A&c_template=B7564C0FD61B679B"><strong>视频页面</strong></a>，
并且保证已经<strong>成功登录</strong>。<br /><br />
<strong>Ⅱ</strong>.打开<strong>控制台</strong>。<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Chrome浏览器</strong>：页面空白处<code>右键</code>--> <code>审查元素</code>--><code>Console</code>；<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Firefox浏览器</strong>：页面空白处<code>右键</code>--><code>查看元素</code>--><code>控制台</code>；<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>IE浏览器</strong>：<code>F12</code>--><code>控制台</code><br /><br />
<strong>Ⅲ</strong>.将<strong>代码君</strong>（建议点击<a href="http://paste.ubuntu.com/10625786/"><code>完整版代码君</code></a>）黏上去，猛戳<strong>回车↵</strong>。  >_<<br /><br />
<strong>Ⅳ</strong>.去<strong>碎觉</strong>。
##实现效果##
将以上代码成功嵌入后，视频页面会发出提示。并且在右侧<strong>视频简介</strong>的盒子下面会出现<strong>使用说明</strong>。<br />
###手动计时方案###
方案如果想立即计时，则可点击右上方的<strong>手动计时</strong>按钮，再去查询累计时间后会发现自己立即添加了一条观看记录，时间为从<strong>首次打开视频</strong>或者<strong>上次手动（自动）计时</strong>
到现在的时间。<br />
###自动计时方案###
每次出现弹窗输入验证码的时候，大家千万不要害怕。在10s后如果没有填写，<strong>并不会停止计时</strong>，而是会在累计时间中多一条观看记录。所以，这就方便
啦~大家只要将代码复制到页面，就可以<strong>撒手不管</strong>咯！yeah！小睡之后，你就会发现累计时间多了这么多条记录呢！如下如下！<br /><br /><br />
 ![img](/public/ach_img/2015-3-19-1.jpg "Geek冬瓜")

##代码君##
[完整版代码君](http://paste.ubuntu.com/10625786/ "完整版代码")
<div>
<pre class="brush: cpp">
/**
 * @file simple_hacking.js
 * @author Desgard_Duan
 * @email gua@desgard.com
 * @source 来自 MMG 学长的思路，自己又重写了几个地方。
 */

/**
 * @description 重写 OutMessage() 非必需
 * @see line:17
 * @author: MMG
 */
function OutMessage() {
	document.getElementById("message").style.display = "";
	document.getElementById("block").style.display = "";
	run = true;
	cTime = 10; 
	line = false;
	TimeClose();
}

function TimeClose() {
	if (run) {
		window.setTimeout("TimeClose()", 1000);
		if (cTime == -1) {
			is_upload = 3;
			random = -1;
			HiddenMessage();
			UpdateUserTime();
		}
		document.getElementById("showtime").innerHTML = cTime;
		cTime--;
	}
}

function updateUserData() {
	var state_id = xmlHttp.responseXML.getElementsByTagName("select_state")[0].firstChild.nodeValue;
	var select_message = xmlHttp.responseXML.getElementsByTagName("select_message")[0].firstChild.nodeValue;
	//HiddenMessage();
	if (state_id == "0") {
		alert(select_message + "，如果连续弹出该对话框说明没有计时，第一重新登录，第二请使用IE或Chrome浏览器，请勿使用360浏览器。");
		window.setTimeout("UpdateUserTime()", 10000);
	} else if (state_id == "2") {
		alert(select_message + "，本次计时已结束，页面将关闭，如需继续观看本视频请重新打开网页");
		window.close();
	} else if (state_id == "3") {
		console.log("本次计时结束，将会开始新的计时"); // 啥也木有发生～
		/*
		 * 原函数：
		 * alert(select_message);  //state_id=="3" 意味着“停止计时”生效，select_message为：窗口将关闭
		 * window.close();
		 *
		 */
		window.is_upload = 0; // 有此参数，即可将setType参数定为"ADD"
		// 在新的session中，让random与cTime重新开始
		reWriteCONST();
		line = true; // FromUserLogin()函数中的if condition，令其为true.
		UpdateUserTime();
	} else {
		sid = select_message;
		is_upload = 1;
		document.getElementById("ranstring").value = "";
		GetPhotoAgain();
		FromUserLogin();
	}
}

var reWriteCONST = function() {
	window.random = 450; // 由于服务器对用户长时间不进行观看的检测为1850s，则在给random
						 // 赋值的时候，<= 1850 即可。
						 // 建议控制在以下范围
						 // 1200 <= random <= 1850
	console.log("Bingo~");
}
setTimeout(reWriteCONST, 5000);

/**
 * @description: 可选择添加模块，点击按钮后可手动录入时间而不退出观看。
 */
function StopVideo() {
	ret = true;
	if (ret) {
		is_upload = 3;
		random = -1;
		UpdateUserTime();
	}
}

/**
 * @description: 前台显示，友好相关
alert ("冬瓜：成功载入脚本")
document.getElementById("viewTitle").innerHTML="<div><font color='red'>已将脚本覆盖成功。</font></div>";

var inps = document.getElementsByTagName('input');
for(var i=0; i < inps.length; i ++) {
    if(inps[i].name == 'btn1') {
        inps[i].value = "手动计时按钮";
		break;
    }
}

document.getElementsByClassName("listCourseRightTitle")[1].innerHTML = "插件功能说明";
document.getElementsByClassName("listCourseRightContent")[0].innerHTML = "<p>1.点击<font color='red'>手动计时</font>按钮会自动在学时上刷新当前观看时间，且不会使得"+
				"计时结束。<p>2.每次弹出验证码窗口的时候，不必填写验证码。等时间结束后自动计时。</p>" + 
				"<hr /><p><font size='3px'  face='微软雅黑'>如果还有疑问请访问：<a href='http://www.desgard.com'>desgard.com</a>向我进行留言。</font></p><img src='http://www.desgard.com/public/img/Desgard_Duan.jpg'>"
 */
</pre>
</div>