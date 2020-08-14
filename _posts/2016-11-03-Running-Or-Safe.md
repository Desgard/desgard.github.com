---
title:      "玩转运动世界校园"
date:       2016-11-03 01:01:00
author:     "Desgard_Duan"
categories:
- Python
tags:
- Python
---

原文链接：[www.hackswjtu.com](http://www.hackswjtu.com/Running-or-Safe/)

作者：冬瓜

---

> 最近由于礼品机制，官方服务器人工查询可能较为严格。所以在实验的时候切勿使用个人账号进行脚本刷数据，以免造成被拉黑的情况。

上个礼拜，我们的小组织 [HackSwjtu](https://github.com/HackSwjtu) 破解了 *运动世界校园* 这款 app。与其说是破解 app，不如说是我们破解了它的网络接口。

以下是我们进行这个小项目的全部过程。

## 意外截获请求负载信息

*运动世界校园* 拥有一套很有意思的跑步规则，在选择目标距离后，在地图上回“随机”给出多个待检测点，而在这些点中，你必须要经过几个，路线随意，这样才完成了跑步评测的第一步。而在跑步结束后，软件还会计算你的跑步平均速度，如果偏差太大（过快或过慢）也不会记录成为有效成绩。

好奇心驱使下，我们对其进行抓包，想看一看大致的实现过程。我们分别对**设置目标距离**、**产生随机点**和**上传数据**三个请求进行了抓包，其结果如下（测试环境 iOS 9.3）：

### 设置目标点 及 产生随机点

{% highlight ruby %}
POST http://gxapp.iydsj.com/api/v2/campus/901/get/1/distance/3 
Host: gxapp.iydsj.com
uid: 47881
Accept: */*
Authorization: Basic MTRwXBd3MjU1MzU6MTk5NzAyLjZXWGz=
Proxy-Connection: keep-alive
osType: 1
appVersion: 1.2.0
Accept-Language: zh-Hans-CN;q=1
Accept-Encoding: gzip, deflate
Content-Type: application/json
DeviceId: FC139628-F5F6-423A-ADBF-C8E310FCB713
CustomDeviceId: FC139628-F5F6-423A-ADBF-C8E310FCB713_iOS_sportsWorld_campus
Content-Length: 45
User-Agent: SWCampus/1.2.0 (iPhone; iOS 9.3.4; Scale/3.00)
Connection: keep-alive
json: {"longitude":103.991842,"latitude":30.766178}
{% endhighlight %}


### 数据上传

{% highlight ruby %} 
POST http://gxapp.iydsj.com/api/v2/users/47881/running_records/add 
Host: gxapp.iydsj.com
uid: 47881
Accept: */*
Authorization: Basic MTRwXBd3MjU1MzU6MTk5NzAyLjZXWGz=
Proxy-Connection: keep-alive
osType: 1
appVersion: 1.2.0
Accept-Language: zh-Hans-CN;q=1
Accept-Encoding: gzip, deflate
Content-Type: application/json
DeviceId: FC139628-F5F6-423A-ADBF-C8E310FCB713
CustomDeviceId: FC139628-F5F6-423A-ADBF-C8E310FCB713_iOS_sportsWorld_campus
Content-Length: 89183
User-Agent: SWCampus/1.2.0 (iPhone; iOS 9.3.4; Scale/3.00)
Connection: keep-alive

json: {"totalDis":3.24,"sportType":1,"speed":12,"fivePointJson":"{"useZip" : false, "fivePointJson" : "[{"flag":"1476258220000","isPass":true,"lat":"30.772452","lon":"103.988141","isFixed":"0"},{"flag":"1476258220000","isPass":true,"lat":"30.769404","lon":"103.991393","isFixed":"0"},{"flag": ...

// 数据量过大，部分显示
{% endhighlight %}

我们发现一个严重的问题，在这两步关键的操作上，没有我们经常见到的 token 认证，只是在请求头的 *Authorization* 中增加了一个字段验证。而且从格式上来看，很容易就能猜到这是个 *Base64* 转码方式。我们使用 Base64 解码方式将其转回，发现了具有如下规则：

{% highlight ruby %}
Basic [username]:[passward]
{% endhighlight %}

这是一个极不负责任的认证提交数据方式。试想，如果用户非正常方式进行提交数据，因为不经过分发 token 进行在线认证，**很容易就能造出虚假数据出来**。

是的，我们就是这么做的。

## 进行跑步数据的处理及分析

我们展示一个接近完整的跑步数据：

{% highlight ruby %}
{
	"totalDis":3.24,
	"sportType":1,
	"speed":12,
	"fivePointJson":
		"{
			"useZip" : false,  
			"fivePointJson" : 				
            "[{
				"flag":"1476258220000",
				"isPass":true,
				"lat":"30.772452",
				"lon":"103.988141",
				"isFixed":"0"
			},
			{
				"flag":"1476258220000",
				"isPass":true,
				"lat":"30.769404",
				"lon":"103.991393",
				"isFixed":"0"
			},
			{
				"flag":"1476258220000",
				"isPass":true,
				"lat":"30.768566",
				"lon":"103.989982",
				"isFixed":"0"
			},	
			{
				"flag":"1476258220000",
				"isPass":false,
				"lat":"30.774981",
				"lon":"104.000061",
				"isFixed":"0"
			},
			{
				"flag":"1476258220000",
				"isPass":true,
				"lat":"30.775152",
				"lon":"103.990113",
				"isFixed":"1"
			}]"}",
		"selDistance":3,
		"unCompleteReason":4,
		"allLocJson":
		"{
			"useZip" : false,  
			"allLocJson" : 		
			"[{
				"speed":"0",
				"id":"1",
				"pointid":"1",
				"radius":"65.000000",
				"gaintime":"1476258220000",
				"createtime":"",
				"modifytime":"",
				"type":"5",
				"totaldis":"0",
				"lat":"30.766170",
				"flag":"1476258220000",
				"avgspeed":"0",
				"totaltime":"2.000000",
				"lng":"103.991934",
				"locationtype":"0"
			},
			....,
			{
				"speed":"0",
				"id":"294",
				"pointid":"294",
				"radius":"10.000000",
				"gaintime":"1476260686000",
				"createtime":"",
				"modifytime":"",
				"type":"6",
				"totaldis":"3241",
				"lat":"30.766135",
				"flag":"1476258220000",
				"avgspeed":"0",
				"totaltime":"2159.000000",
				"lng":"103.992010",
				"locationtype":"0"
			}]
		"}",
	"complete":true,
	"startTime":1476258220000,
	"stopTime":1476260686000,
	"totalTime":2466
}
{% endhighlight %}

其中我们仍然省略了大量的跑步打点数据，因为实在是太多。根据 json 数据每个属性的名字，我们能猜出个大概。而且在最外层数据中，我们发现 ：`totalDis`、`speed` 、 `fivePointJson` 、 `complete` 、 `startTime` 、 `stopTime` 、 `totalTime` 这几个属性，这是一件很可笑的事情。**对于所有的数据处理，都是在 client 端进行的，而后台的服务器仅仅提供了数据库的记录作用**。

经过几组数据的测试，我们发现在 server 端，仅仅对当次提交的 `speed` 数据进行判断，而 `speed` 数据居然没有经过 `totalTime` 和 `totalDis` 的验证。**而后两者仅仅是用来在 client 端起显示作用（奇葩的逻辑）**。

而对于 `startTime` 和 `stopTime` 两个属性，自然就能猜测到这是系统默认生成的当前时间的时间戳，从末尾的三个0就可以暴露出它设置成为毫秒级别。

我们再来看 `fivePointJson` 这个属性的结构：

{% highlight ruby %}
"flag":"1476258220000",
"isPass":true,
"lat":"30.775152",
"lon":"103.990113",
"isFixed":"1"
{% endhighlight %}

`flag` 自然也是时间戳，并且可以惊讶的发现他与 `startTime` 相同。而是否通过，仅仅使用了 `isPass` 这个布尔值来记录。实在是令人无语。

我们将数据保存下来，进行一次虚假提交，不出意外增加了一次新的记录。

<img src="http://7xwh85.com1.z0.glb.clouddn.com/ss.jpg" width="300px"/>

但是知道了这些，我们还是无法解决一个重要的问题，即跑步路径坐标。并且在我们的提交尝试中，如果跑步路径的 json 格式提交错误，就会造成在 client 端无法显示 Running Route 的问题。由于这个 app 使用了百度地图第三方sdk，所以我们的第一想法是通过百度地图路径规划功能，从一条路径中取点进行构造 route。可是在构造的时候会遇到很多问题，比如取点的距离与跑步速度不统一等等，其问题可以参见我们的 *[HaRunGo iOS repo](https://github.com/HackSwjtu/HackRunningGo-iOS)* 。

而在 app 中会有一个 *约跑功能* ，我们可以看见他人的跑步路线。因此我们打算采取偷梁换柱的方式，将他人跑步数据进行抓取，进而修改成自己此时的信息及时间戳即可。

### 约跑请求

{% highlight ruby %}
{
	"error":10000,
	"message":"成功",
	"data":
	{
		"roomInfoModel":
		{
			"beginTime":"2016-10-21 20:17:13",
			"endTime":"2016-10-21 20:44:42",
			"distance":3.0,
			"locDesc":"人体机能实验室",
			"finishNum":2
		},
		"roomersModelList":
		[{
			"finished":true,
			"uid":57446,
			"unid":901,
			"icon":
			"http://imgs.gxapp.iydsj.com/imgs/d30a0bff-1b20-4504-91b9-49ae65ada0a6.jpeg",
			"sex":1,
			"name":"杨xx",
			"endTime":"2016-10-21 20:44:42",
			"points":"{...}"
		},
		{
			"finished":true,
			"uid":57276,
			"unid":901,
			"icon":"http://imgs.gxapp.iydsj.com/imgs/null",
			"sex":0,
			"name":"李x",
			"endTime":"2016-10-21 20:44:42",
			"points":"{...}"
		},...
		]
	}
}
{% endhighlight %}

为了保护大家的隐私，我没有展示完整姓名。从获取到的数据中，我们发现 `points` 的格式与我们想要的跑步路线是完全一致的。因此我们对其进行数据解析，并处理时间戳生成我们所需要的数据。进而再将处理过后的数据进行整合，通过上传数据接口对个人用户进行认证，制造一条近乎完美的跑步数据出来。

> 其上传数据及处理数据可以阅读我们的上传数据脚本 [HaRunGo](https://github.com/HackSwjtu/HackRunningGo-SC/blob/master/HaRunGo.py)，而对于网络约跑的采点流程可以详见更新静态跑步路线脚本 [updateRoutes.py](https://github.com/HackSwjtu/HackRunningGo-SC/blob/master/updateRoutes.py)


## HackRunningGo-SC Work Flow

我们对于以上的分析及实验进行整合，将所有的工作流程完整的写在了两个 Python 脚本中，并且开源以便大家学习、以便学校修正 bug 使用。可以详见我们的 [GitHub repo](https://github.com/HackSwjtu/HackRunningGo-SC)

如果想尝试使用，请先确保你具有 `Python 2.7` 的系统环境，然后依次按照以下流程：

### 1.clone 我们的 HackRunningGo-SC repo

从 GitHub 上将我们的 repo clone 到本地，并访问 *HackRunningGo-SC* 目录：

{% highlight ruby %}
git clone https://github.com/HackSwjtu/HackRunningGo-SC.git 
cd HackRunningGo-SC
{% endhighlight %}

![A96C4679-72D9-4F60-A50C-E51CD40657ED](http://7xwh85.com1.z0.glb.clouddn.com/A96C4679-72D9-4F60-A50C-E51CD40657ED.png)

### 2.更新本地跑步路线静态数据（可选择）

从约跑记录中将数据取出，并将所需数据收集至 `route.data` 文件中。

{% highlight ruby %}
python updateRoutes.py
{% endhighlight %}

### 3.在 `user.data` 中添加用户信息

在 `user.data` 文件中添加登录所需的用户名和密码，**一行一条，以空格分割**。

{% highlight ruby %}
bash \[id] [password] >> user.data
cat user.data
{% endhighlight %}

![ss2](http://7xwh85.com1.z0.glb.clouddn.com/ss2.jpg)

### 4.运行主脚本将路线录入

{% highlight ruby %}
python HaRunGo.py
{% endhighlight %}

整个使用流程是十分简单的，但是这个脚本希望大家能作为学习参考，更希望官方能对 body 中的数据进行更加严格的加密，对登录状况采取更加科学的 token 认证方式。

## 再谈信息泄露问题

在约跑记录网络接口中，我们能够获取到每个用户的真实姓名、性别、头像，**这是极其严重的个人信息泄露**！

从今年 5 月份阿里安全部门的大牛 @蒸米spark 在微博上爆料搜狗和百度输入在采集个人聊天习惯的同时，上传数据居然使用明文进行数据提交。在整个流程中使用 http 协议，丝毫没有考虑数据加密的问题。

而在跑步记录的上传中，毫无例外也采用了明文的方式。更加让人气愤的是，在约跑功能中，很轻易的就能拿到他人姓名和性别信息。这些泄露方式很有可能为诈骗者提供更快捷的信息渠道，而大学生也是初入社会的学生团体，社会阅历及信息保护的意识经验远远不足，更应该是各大互联网公司着重保护的对象集体。

一旦一块移动客户端 app 与个人的身体信息、聊天信息、财政信息相关联时，就要时刻主要到对于用户信息的保护。从之前的 163 邮箱事件、icloud 相册泄露事件再到最近沸沸扬扬的[雅虎邮寄信息泄露事件](http://usa.people.com.cn/n1/2016/0923/c241376-28735538.html)，网民用户的安全问题日益严峻。而如今的校园跑步软件，没有实名制认证机制可以随意注册，真的太过于裸露。

在斥责 app 制作公司的同时，也提醒广大用户多加注意个人隐私的保护，提高个人信息的安全意识，在有法却无严厉监管的环境下我们只有自我提高。（这实属无奈之举）

## 写在最后

这篇文章是我们 [HackSwjtu](https://github.com/HackSwjtu) 的第一篇公示技术博文，以此希望 *运动世界校园* 的供应商 **杭州万航信息科技有限公司** 早日对数据问题进行修复更新，也希望我交大的信息学院在关注学科排名的同时，提升学院技术。

当然，如果你是 SWJTU 的一名 Hack，或是一名 Geek，并且有志于加入我们的 GitHub 组织，你可以通过[这个链接](http://www.hackswjtu.com/I-want-you/)，并且按照其中的联系方式联系我。我会及时反馈，并安排线上面试。

![](http://ofmxkmiv3.bkt.clouddn.com/banner.png)
