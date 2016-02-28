---
layout: post
author: Desgard_Duan
title: Lazy Instantiation In Objective-C
category: learning
tag: [iOS]
---
> 之前在创建`UITableView`的时候，使用懒加载。但是在初始化过程中，使用了`self.tableView`，导致运行崩溃。从而发现这一块知识的漏洞。这里总结一下。

在使用`UITableView`的时候，在官方文档中，推荐使用**Lazy Instantiation**进行初始化，也就是我们所说的**延迟加载（懒加载）**。懒加载并不是什么新技术，在其他的语言中早就出现。在之前个人学习过的**JavaScript**中，为了对网页性能进行效率优化，其中一种方案就是使用**Lazy Instantiation**从而按需加载，例如谷歌的图片搜索页、迅雷首页、淘宝网等等。

在**Objective-C**中，懒加载有两个好处：

* 不必将创建对象的代码全部写在`viewDidLoad`方法中，代码的可读性更强。
* 每个控件的`getter`方法中分别负责各自的实例化处理，代码彼此之间的独立性强，松耦合。
* 只有当真正需要资源时，再去加载，节省了内存资源。

<!-- more -->
懒加载是通过`getter`方法从而实现的，效果是**只有对象需要使用的时候，对象才会被加载，否则该对象永远不会被加载，也不会再用内存**。在程序启动的时候不加载资源，只有在运行当需要一些资源时，再去加载这些资源。

虽然在**ARC机制**下，系统自动帮我们管理内存，但是尽可能的少使用和及时的释放内存是十分有必要的，毕竟手机的内存还是很有限的。

例如应用的登录界面通常是`UILabel`和`UITextField`相结合，我们自定义一个`LTView类`包含`titleLabel属性`和`textField属性`。
<div>
<pre class="brush: applescript">
#import &ltUIKit/UIKit.h&gt

@interface LTView: UIView

// 左侧的titleLabel
@property (nonatomic, retain) UILabel *titleLabel;
// 右侧的textField
@property (nonatomic, retain) UITextField *textField;

@end
</pre>
</div>
然后我们通过重写属性的`getter`方法可以完成**Lazy Instantiation（懒加载）**（有些书上也称：*Lazy Loading*）模式，使用懒加载可以将代码按照模块封装，同时提高类的灵活度，也可以在一定时期内节省内存的使用，对于当前的`LTView`，使用懒加载表示我提供了两个子视图，如果需要使用，秩序调用`getter`方法既可以显示该子视图，如果不需要，`LTView`就是一个空的视图。

<div>
<pre class="brush: applescript">
// LTView.m
// 重写titleLable的getter方法
- (UILabel *) titleLabel {
    // 首先判断titleLabel是否已经存在
    // 如果不存在才进行初始化
    // 如果存在，直接return
    if (!_titleLabel) {
        _titleLabel = [[[UILabel alloc] initWithFrame: 
            CGRectMake(10, 5, 100, self.frame.size.height - 10)]
            autorelease];
        _titleLabel.textAlignment = NSTextAlignmentCenter;
        [self addSubview: _titleLabel];
    }
    return _titleLabel;
}

// 重写textField的getter方法
- (UITextField *) textField {
    if (!_textField) {
        _textField = [[[UITextField alloc] initWithFrame: 
            CGRectMake(120, 5, self.frame.size.width - 130, 
            self.frame.size.height - 10)] autorelease];
        _textField.borderStyle = UITextBorderStyleRoundedRect;
        _textField.clearButtonMode = UITextFieldViewModeWhileEditing;
        [self addSubview: _textField];
    }
    return _textField;
}
</pre>
</div>

** 注意以下两点：**

* 以上是Apple官方提倡的做法。其内部做的iOS系统中很多地方都用到了懒加载的方式，比如控制器的View的创建。
* 在懒加载重写`getter`过程中，切记不要使用`self.titleLabel`这种方法。通过`self.xxx`是对属性的访问，而使用`_xxx`是对局部变量的访问。懒加载中实际上是访问其变量的`getter`方法，所以使用`self.xxx`写法会抛出警告。