---
layout: post
author: Desgard_Duan
title: SDWebImage Introduce
category: learning
tag: [iOS]
---

今天腾讯的面试好惨，最后惨遭拒绝。错过了一次很好的机会。应该按照面试官说的，多补补基础，学习底层的、原理性的知识。开始查漏补缺。

iOS中缓存处理的三种方式中，其中最麻烦、最困难、最占内存资源的是图片缓存。先不考虑缓存问题，先使用iOS的原生方法，通过URL地址，从网络上获取图片。

~~~ruby
- (UIImage *)getImageFromURL: (NSString *)fileURL {
    UIImage *result;
    NSData *data = [NSData dataWithContentsOfURL: [NSURL URLWithString: fileURL]];
    result = [UIImage imageWithData: data];
    return result;
}
~~~

<!-- more -->

这么做会有一个很常见的问题，对于同一个URL进行多次请求，由于返回的数据相同，于是会造成：

* 用户流量浪费
* 程序响应速度不够快

解决上面的问题，一般考虑对数据进行缓存。第一次请求数据时，内存缓存中没有数据，硬盘缓存中没有数据。当服务器返回数据时，需要以下步骤：

* 使用服务器的数据（比如解析、显示）
* 将服务器的数据缓存到硬盘（沙盒）

此时缓存的情况是：**内存缓存中有数据、硬盘缓存中有数据**。

再次请求数据中分为两种情况：

* 如果程序程序没有被关闭，一直在运行。那么此时内存缓存中有数据，硬盘缓存中有数据。如果此时再次请求数据，直接使用内存缓存中的数据即可。

* 如果程序重新启动，那么此时内存缓存已经消失，没有数据；硬盘缓存依旧存在，还有数据。如果此时再次请求数据，需要读取内存中缓存的数据。（从硬盘缓存中读取数据后，内存缓存中又有数据）。

由于**GET**请求一般用来查询数据，**POST**请求一般是发送大量数据给服务器处理，其**变动性比较大**。因此，**一般只对GET请求进行缓存，而不对POST请求进行缓存**。在iOS中，可以使用`NSURLCache`类缓存数据。自iOS 5之后，同时支持内存缓存和硬盘缓存。

## NSURLCache简介

* iOS中缓存技术用到了`NSURLCache`类。原理：**一个NSURLRequest**对应一个**NSCachedURLResponse**。缓存技术：把缓存的数据都保存到数据库中。

获得全局缓存对象（没必要手动创建）

~~~ruby
NSURLCache *cache = [NSURLCache shareURLCache];
~~~

设置内存缓存的最大容量（字节为单位，默认为521KB）

~~~ruby
- (void)setMemoryCapacity: (NSUInteger) memoryCapacity;
~~~

设置硬盘缓存的最大容量（字节为单位，默认为10M）

~~~ruby
// 硬盘缓存位置：沙盒/Library/Caches
- (void)setDiskCapacity: (NSUInteger) diskCapacity;
~~~

取得某个请求的缓存

~~~ruby
- (NSCachedURLResponse *)cachedResponseForRequest: (NSURLRequest *) request;
~~~

清除某个请求的缓存

~~~ruby
- (void)removeCachedReponseForRequest: (NSURLRequest *) request;
~~~

清除所有的缓存

~~~ruby
- (void)removeAllCachedReponses;
~~~

七种缓存策略：（实际上能用的只有4种）

~~~ruby
// 默认的缓存策略（取决于协议）
NSURLRequestUseProtocolCachePolicy
// 忽略缓存，重新请求
NSURLRequestReloadIgnoringLocalCacheData 
// 未实现
NSURLRequestReloadIgnoringLocalAndRemoteCacheData
// 忽略缓存，重新请求
NSURLRequestReloadIgnoringCacheData = NSURLRequestReloadIgnoringLocalCacheData 
// 有缓存就用缓存，没有缓存就重新请求
NSURLRequestReturnCacheDataElseLoad
// 有缓存就用缓存，没有缓存就不发请求，当做请求出错处理（用于离线模式）
NSURLRequestReturnCacheDataDontLoad
// 未实现
NSURLRequestReloadRevalidatingCacheData 
~~~

## 终板代码示例

~~~ruby
- (void)touchesBegan: (NSSet *)touches withEvent: (UIEvent *)event {
    // 1.创建请求
    NSURL *url = [NSURL URLWithString: @"#"];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL: url];
    
    // 2.设置缓存策略（有缓存用缓存，没有重新请求）
    request.cachePolicy = NSURLRequestReturnCacheDataElseLoad;
    
    // 3.发送请求
    [NSURLConnection sendAsynchronousRequest: request
                     queue: [NSOperationQueue mainQueue]
completionHandle: ^(NSURLRequest *reponse, NSData *data, NSError *connectionError) {
        if (data) {
            NSDictionary *dict = [NSJSONSerialization JSONObjectWithData: data options: NSJSONReadingMutableLeaves error: nil];
        }
    }];
}

~~~

## SDWebImage介绍

使用**SDWebImage**，可以很好的处理图片缓存问题。以下是方法介绍：

~~~ruby
// 在需要的时候导入头文件
#import "UIImageView+WebCache.h"

// 图片缓存的基本代码
[self.image sd_setImageWithURL: imagePath];

// 用block可以在加载后完成其他动作
[self.image sd_setImageWithURL: imagePath
            completed: ^(UIImage *image, NSError *error, SDImageCacheType   cacheSType, NSURL *imageURL) {
    NSLog(@"ready!");
}];

// 给一张图片，加载后切换
[self.img1 sd_setImageWithURL: imagePath placeholderImage: [UIImage imageNamed: @"default"]];
~~~

