---
layout: post
author: Desgard_Duan
title: Extending The Class in Objective-C
category: learning
tag: [iOS]
---

最近在疯狂的复习iOS基础知识。另外有一个想法，想将MenuSideBar中的MacGua一栏改成介绍自己的项目。而总结面试知识网上一抓一大把，意义不大。

## 概述

还是引用上一篇文的格式，先给出几个问题，然后围绕这些问题来讨论。

> Extension和Category的区别？Category和继承的区别？Category可以定义变量吗？什么时候用Extension？Objective-C可以定义私有方法吗

对于一个**类（Class）**，经常会在类的头文件中声明过属性、变量及方法。头文件可以说明这个类的全部属性和方法，用于在其他的对象中进行交互。然而不是所有的属性或方法都需要在类的头文件中进行声明，有的属性或方法只有该类或其实例才需要使用的。设计实现细节的属性或方法最好在**扩展（Extension）**中声明。

<!-- more -->

## Extension

对于名字，与其说是类的扩展，不如说是类的内部声明。因为，在Extension位置上声明的变量只能用于该类。我们可以把`.h`文件看成这个类的外界接口，在其他类访问和调用该类方法以及属性时，只将`.h`文件中的对外开放，而Extension位置的属性并无法访问到。因此，Extension中声明的属性为该类的**私有成员（Private）**。

以下是Extension的声明示例代码。

~~~ ruby
// ViewController.m

#import "ViewController.h"

// Extension位置
// b为私有成员
@interface ViewController ()

@property (nonatomic, strong) NSDate *b;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

@end
~~~

对于Extension，使用起来很简单。但是下面的知识点还是应该注意下：

* Extension可以增加新的属性，即**可增加示例变量**；
* 因为Extension中的属性是Class属性的**私有表现**，所以**常常用Extension实现Class的成员私有化**；
* 通常情况下，Extension都是放在`@implementation`的上方。

其实，Extension也被称作*匿名化Category*，接下来讨论下**Category**。

## Category

Category是Objective-C中对类操作最灵活的一面，很多书上对其的翻译有很多种，这里我们称之为**类目**。类目在对于类的扩展方面有以下好处：

* 能把一个类的实现分成若干不同文件中。
* 不同类目可以单独编译，可以分开开发，最后统一合并。增加开发效率。
* 如果把一个类目（声明和实现）放在一个`.m`的文件中，那么外界不能访问。即实现了**private（私有化）**。

简单的写一下类目的用法。这里引入一个背景，加入我们想给`NSString`增加一个字符串翻转的新方法。我们可以直接增加该类的类目，达到效果。详见代码：

~~~ ruby
// NSString+ReverseString.h

#import <Foundation/Foundation.h>

@interface NSString (ReverseString)
- (id) reverseString;
@end
~~~

~~~ ruby
// NSString+ReverseString.m

#import "NSString+ReverseString.h"

@implementation NSString (ReverseString)

- (id) reverseString {
    NSInteger len = [self length];
    // stringWithCapacity 开辟内存空间
    NSMutableString *retStr = [NSMutableString stringWithCapacity: len];
    while (len > 0) {
        char c = [self characterAtIndex: --len];
        
        // 从后取出一个字符 Unicode
        NSString *s = [NSString stringWithFormat: @"%c", c];
        [retStr appendString: s];
    }
    return retStr;
}

@end
~~~

#### 测试代码

~~~ ruby
#import "ViewController.h"
#import "NSString+ReverseString.h"

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    NSString *nam = @"hello world";
    NSLog(@"%@", nam);
    NSLog(@"%@", [nam reverseString]);
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

@end
~~~

#### 输出结果

~~~ ruby
2016-03-27 07:20:47.489 testiOS[4062:293571] hello world
2016-03-27 07:20:47.489 testiOS[4062:293571] dlrow olleh
~~~

总结下**Extension**和**Category**的区别和联系：

1. 形式上来看，**Extension**是匿名的**Category**表现。但它们的目的和行为却是不同的。
2. **Extension**里的声明方法需要在主`.m`文件中`@implementation`中实现，而**Category**不强制规定。
3. **Extension**可以增加属性（变量），**Category**却不可以。

而**Category**对于类继承（Inherit）的比较：

* 继承是面向对象语言的一个特点，子类会继承父类的方法和属性。对于某些情况下，必须使用继承，例如：新扩展的方法与原方法同名，但是仍然需要父类的实现。如果使用类目，就会**直接覆盖原类方法的实现从而无法访问到原来的方法**。

在stackoverflow上有一个很不错的关于问题[Minutia on Objective-C Categories and Extensions](http://stackoverflow.com/questions/4685679/minutia-on-objective-c-categories-and-extensions)的答贴，其中一层的答案整理的很不错：

* Objective-C 2.0 增加了Extension用于解决两个问题：
    * 允许一个对象可以拥有一个私有的interface，且可由编译器验证。
    * 支持一个共有只读，私有可读的属性。
    
所以Objective-C原本可以定义私有方法，但是其 public/private 的限定不足，而**Category**就是弥补了这一缺点而在2.0版本中设计出来。这样看来，**Category**的使用条件之一就是：**实现私有属性或方法，增加类封装的安全性**。

在属性的设计中，我们经常会遇到这样的属性需求：

* Publicly-Readable Properties（共有可读）
* Private-Writealbe Properties（私有可写）

实现一个不可变（immutable）的数据结构通常有一个好处是外部代码不能用`setter`修改对象的状态，然而又希望它在内部又是一个可写的属性。**Extension**可以做到这一点：**在公共接口（声明）中，可以声明一个属性是只读的，随后在Extension中声明可读可写**，这样，对外部而言，该属性将是只读，内部则可使用setter方法。

#### 例子

~~~ ruby
// ViewController.h

#import <UIKit/UIKit.h>

@interface ViewController : UIViewController

@property (retain, readonly) NSDate *val;

@end
~~~

~~~ ruby
// ViewController.m

#import "ViewController.h"

@interface ViewController()
@property (retain, readwrite) NSDate *val;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

@end
~~~
     
---

### 相关资料

[Minutia on Objective-C Categories and Extensions](http://stackoverflow.com/questions/4685679/minutia-on-objective-c-categories-and-extensions)

[Objective-C Programming 2nd Edition](https://book.douban.com/subject/19962787/)