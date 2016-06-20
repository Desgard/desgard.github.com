---
layout:     post
title:      "The Card Interface For Signing Up"
subtitle:   "DGPopUpViewController---卡片式弹出窗口"
date:       2016-06-18 01:01:00
author:     "Desgard_Duan"
header-img: "img/post-bg-iOS10.jpg"
tags:
    - iOS
    - Objective-C
---

Apple公司在WWDC 2016前后带来了10个重大更新，其中重中之重可谓是iOS 10的更新了。iOS 10被称作iOS 7之后迎来的最大升级，在所有的革新中，无论在通知中心的UI修改，还是各处的3D Touch弹出层，都能看到`卡片式设计`的影子。笔者不是设计师，但是以一个iOS开发者的角度来看，iOS的扁平化设计风格，逐渐正在往在Google I/O 2014提出的`卡片式设计`靠拢。（关于更多的`卡片式设计`资料可查看[这里](http://www.androidpolice.com/2014/06/11/exclusive-quantum-paper-and-googles-upcoming-effort-to-make-consistent-ui-simple/?utm_source=tuicool)）。

![](/assets/img/post_img/2016-06-18/img_0.jpg)

处此大势之下，我也跟风来搞一波。首先先感谢原型图的作者`Sarah`，虽然我不是Dribbble的Pro用户，无法在您的作品上留言，但之后我会及时的联系你。以下就是原型图的效果了：

![](/assets/img/post_img/2016-06-18/img_1.gif)

## 动画分析

观察全部特效，我们发现了以下步骤

* 弹出卡片弹出窗口
* 自定义`UITextField`填写进度动画
* 卡片缩小至消失
* 弹出logo动画片尾

其中我们忽略掉一个效果，就是在原型图中，触摸键移动到NEXT按钮上的动效。因为在手机上，我们不可能持续在屏幕上滑动手指，而是采用轻按的方式。想必设计师当时忘记了使用场景，当做web来设计的。

一番动画分析之后，我们逐步击破。

## 动画拆解

### 对于弹出层的构建

笔者在实现之前，对于这个弹出的感觉就是在View上面附加一层View进行实现。我在[awesome-ios](https://github.com/vsouza/awesome-ios)搜索了其他其他关于Popup View实现的方式，在主流的[NMPopUpView](https://github.com/psy2k/NMPopUpView)、[CNPPopup](https://github.com/carsonperrotti/CNPPopupController)等都是使用了ViewController来实现，虽然现在还没有明确这样做的好处，我觉的可能是减少了当前视图的负担。因为在弹出层中，有许多需要与触控手势的控件，所以对于View的负担过重。我们规划一下文件结构：

```bash
├── DGPopUpViewController
│   ├── DGPopUpView.h
│   ├── DGPopUpView.m
│   ├── DGPopUpViewController.h
│   ├── DGPopUpViewController.m
│   ├── DGPopUpViewLoginButton.h
│   ├── DGPopUpViewLoginButton.m
│   ├── DGPopUpViewTextView.h
│   └── DGPopUpViewTextView.m
```

![](/assets/img/post_img/2016-06-18/img_2.png)

结构一目了然，`ViewController`持有`PopUpView`，`PopUpView`中带有其他的自定义控件。我们写一个对外接口，来将这层`ViewController`的视图显示在当前视图上，但是其控制器还要保持原本的控制器。另外要注意的是，在添加背景色的时候，我们用到了`UIColor`的`colorWithAlphaComponent`方法，具体的作用是对当前颜色具有透明状态。当然我们使用更改`alpha`也可修改透明状态，但是对View的修改，会影响到该View的子视图。

{% highlight ruby %}
#pragma mark - Override

#define DGPopUpViewBackgroundColor [[UIColor colorWithRed: 245 / 255.f green: 245 / 255.f blue: 245 / 255.f alpha: 1] colorWithAlphaComponent: 0.8]

- (instancetype) init {
    isOpen = YES;
    self.view.backgroundColor = DGPopUpViewBackgroundColor;
    
    [self.view addSubview: self.popUpCloseButton];
    [self.view addSubview: self.popUpView];
    
    // 尾部动画通知实现
    [[NSNotificationCenter defaultCenter] addObserver: self
                                             selector: @selector(endAnimation)
                                                 name: @"end_animation"
                                               object: nil];
    // 尾部动画调试
    // [self endAnimation];
    return self;
}

#pragma mark - Add SubView
- (void) showInView: (UIView *)aView animated: (BOOL)animated {
    self.view.center = aView.center;
    [aView addSubview: self.view];
    if (animated) {
        [self showAnimation];
    }
}
{% endhighlight %}

写完入口方法之后，我们需要做一些处理。例如，在弹出层弹出后，若点击非`PopUpView`部分，即可将`PopUpView`退出的方法即相关动画。另外，还需要构建弹出动画、尾部的logo动画。

{% highlight ruby %}
#pragma mark - Removew SubView
- (void) removeAnimation {
    self.popUpView.transform = CGAffineTransformMakeScale(1, 1);
    
    [UIView animateWithDuration: 0.6
                          delay: 0
                        options: UIViewAnimationOptionCurveEaseInOut
                     animations: ^{
                         self.popUpView.alpha = 0;
                     }
                     completion: ^(BOOL finished) {
                         [self.view removeFromSuperview];
                     }];
}

- (void) endAnimation {
    self.endView = [[UIImageView alloc] initWithImage: [UIImage imageNamed: @"end_logo"]];
    self.endView.center = self.view.center;
    [self.view addSubview: self.endView];
    
    
    self.endView.transform = CGAffineTransformMakeScale(0, 0);
    
    [UIView animateWithDuration: 1.4
                          delay: 0
                        options: UIViewAnimationOptionCurveEaseInOut
                     animations: ^{
                         self.endView.transform = CGAffineTransformMakeScale(0.6, 0.6);
                     }
                     completion: ^(BOOL finished) {
                         
                     }];
}

#pragma mark - Animation
- (void) showAnimation {
    self.view.alpha = 0.0;
    self.popUpView.transform = CGAffineTransformMakeScale(0, 0);
    [UIView animateWithDuration: 0.25
                     animations: ^{
                         self.view.alpha = 1.0;
                     }
                     completion: ^(BOOL finished) {
                         [self showPopUpView];
                     }];
}

- (void) showPopUpView {
    self.popUpView.alpha = 0.5;
    [UIView animateWithDuration: 0.8
                          delay: 0
                        options: UIViewAnimationOptionCurveEaseOut
                     animations: ^{
                         self.popUpView.transform = CGAffineTransformMakeScale(1, 1);
                         self.popUpView.alpha = 1;
                     }
                     completion: ^(BOOL finished) {
                         
                     }];
}
{% endhighlight %}

### 弹出层

在弹出层View中，我们需要做的就是在上面增加控件。弹出层需要持有的控件有三个：标题Label、自定义TextField、按钮Button。另外，需要他自身需要处理点击按钮正常退出的动画。这种弹出层退出方式与在控制器中的退出方式很显然响应者不同。在用户主动请求退出的过程中，用户主要是以控制器View作为交互对象，而点击Next按钮后的退出时与弹出层View为交互对象。这样写能让我们的代码更清晰，可读性加强。

{% highlight ruby %}
#pragma mark - Close Animation
- (void) closeAnimation {
    self.transform = CGAffineTransformMakeScale(1, 1);
    
    [UIView animateWithDuration: 0.6
                          delay: 0.3
                        options: UIViewAnimationOptionCurveEaseInOut
                     animations: ^{
                         self.transform = CGAffineTransformMakeScale(0.01, 0.01);
                         self.superview.alpha = 1;
                     }
                     completion: ^(BOOL finished) {
                         [[NSNotificationCenter defaultCenter] postNotificationName: @"end_animation" object: nil];
                         [self removeFromSuperview];
                     }];
    
}
{% endhighlight %}

### 自定义控件

这里用到的自定义有两个，第一个是NEXT的`Button`。仔细观察一下原型图，Button主要有两个特点：

* 渐出动画是在PopUpView之前就开始，而且是独立渐出
* Button的背景色是一种渐变色

对于第一个动效，只需要在PopUpView启动退出动画之前，先执行Button内部的退出动画。动画无论退出还是出现都是类似的`CGAffineTransformMakeScale`效果，无需讲述。

{% highlight ruby %}
#pragma mark - Animation
- (void) pressAnimation {
    NSLog(@"click");
    self.transform = CGAffineTransformMakeScale(1, 1);
    
    [UIView animateWithDuration: 0.6
                          delay: 0
                        options: UIViewAnimationOptionCurveEaseInOut
                     animations: ^{
                         self.transform = CGAffineTransformMakeScale(0.01, 0.01);
                     }
                     completion: ^(BOOL finished) {
                         [self removeFromSuperview];
                     }];
    
    [[NSNotificationCenter defaultCenter] postNotificationName: @"NEXT_Button" object: nil];
}
{% endhighlight %}

渐变色的处理我们可以使用`CAGradientLayer`这个类。`CAGradientLayer`是用来生成两种或更多颜色平滑渐变，使用改类的好处在于绘制时使用了硬件加速（[官方文档](https://developer.apple.com/reference/quartzcore/cagradientlayer)）。我们只要依次写出各个关键点，就可以确定颜色的一个渐变方向。直接看代码，很容易就能看懂。

{% highlight ruby %}
#pragma mark - Set Color
- (void) setColor {
    CAGradientLayer *gradientLayer = [CAGradientLayer layer];
    gradientLayer.frame = self.bounds;
    gradientLayer.locations = @[@0.3, @0.8];
    gradientLayer.colors = @[(__bridge id)[UIColor colorWithRed: 56 / 255.f green: 195 / 255.f blue: 227 / 255.f alpha: 1].CGColor,
                             (__bridge id)[UIColor colorWithRed: 16 / 255.f green: 156 / 255.f blue: 197 / 255.f alpha: 1].CGColor];
    gradientLayer.startPoint = CGPointMake(0, 0);
    gradientLayer.endPoint = CGPointMake(1, 0);
    
    [self.layer addSublayer: gradientLayer];
}
{% endhighlight %}

我们最后来说说自定义的`TextField`，`TextField`我们仅仅是在下方增加了一个类似于进度条的动画。具体的逻辑是这样，当我们手势响应一个`TextField`之后，我们就会启动动画，让进度条滑动到定点位置。而当我们退出响应该TextField的时候，先要检查text部分是否为空，然后在决定进度条是否要保存状态。先给出代码，解释一下。

{% highlight ruby %}
#pragma mark - UITextFieldDelegate
- (void)textFieldDidBeginEditing: (UITextField *)textField {
    // 确定动画类型
    CABasicAnimation *basic = [CABasicAnimation animationWithKeyPath: @"transform.scale.x"];
    // 确定锚点
    [self.progressLine.layer setAnchorPoint: CGPointMake(0, 0.5)];
    // 持续时间
    basic.duration = 0.3;
    // 重复次数
    basic.repeatCount = 1;
    // 结束后是否删除
    basic.removedOnCompletion = NO;
    // 状态点数值
    basic.fromValue = [NSNumber numberWithFloat: 1];
    basic.toValue = [NSNumber numberWithFloat: 280];
    // 完成时保存状态
    basic.fillMode = kCAFillModeForwards;
    // 增加缓动函数
    basic.timingFunction = [CAMediaTimingFunction functionWithName: kCAMediaTimingFunctionEaseIn];
    [self.progressLine.layer addAnimation: basic forKey: nil];
}

- (void)textFieldDidEndEditing:(UITextField *)textField{
    if ([self.textField.text isEqualToString: @""]) {
        CABasicAnimation *basic = [CABasicAnimation animationWithKeyPath: @"transform.scale.x"];
        [self.progressLine.layer setAnchorPoint: CGPointMake(0, 0.5)];
        basic.duration = 0.3;
        basic.repeatCount = 1;
        basic.removedOnCompletion = NO;
        basic.fromValue = [NSNumber numberWithFloat: 280];
        basic.toValue = [NSNumber numberWithFloat: 1];
        basic.fillMode = kCAFillModeForwards;
        basic.timingFunction = [CAMediaTimingFunction functionWithName: kCAMediaTimingFunctionEaseIn];
        [self.progressLine.layer addAnimation: basic forKey: nil];
    }
}
{% endhighlight %}

这里我们不在对View层进行动画，而是改用`CABasicAnimation`。好处仍旧是硬件加速。这里我们特别要注意一个地方。刚开始接触`CABasicAnimation`的时候，可能不太理解`fromValue`和`toValue`。这两个数值既不反应屏幕坐标，也不表示像素数。它的意思是起始尺寸数值的整数倍数。也就是说，这里我们假设进度条的长度为$$x$$，则该动画的过程就是把进度条长度线性的从$$x$$增长到$$280x$$，这里也就反应了一个问题，我们在**设定进度条初值的时候不能设置成0**。

<img src="/assets/img/post_img/2016-06-18/img_3.gif" width="240px"/>

## 结束语

大体上，整个卡片登录界面的实现思路就是这样，最后再次感谢原型图作者。在进行动画制作之后，强烈建议读者去学习[《iOS Core Animation: Advanced Techniques》](https://www.gitbook.com/book/zsisme/ios-/details)这本书，之后会对Core Animation会有更深层的认识。

---

[Github【Desgard_Duan】](https://github.com/dgytdhy/DGPopUpViewController)