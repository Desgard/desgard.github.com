---
layout: post
author: Desgard_Duan
title: Using Block —— Closure in Objective-C
category: learning
tag: [iOS]
---
记得大一的时候，**Java SE8**带着强大的**Lambda 表达式**横空出世，当时学习了之后觉得**Lambda**的方式其实与**C++**中的匿名类非常类似，但是其结构更轻量，更短小，略甜的语法糖。在一篇教程上如此给出 了一个**Lambda 表达式**的例子：

~~~ruby
// 初学 Lambda 表达式
public class FirstLambdaExpression {  
    public String variable = "Class Level Variable";  
    public static void main(String[] arg) {  
        new FirstLambdaExpression().lambdaExpression();  
    }  
    public void lambdaExpression(){  
        String variable = "Method Local Variable";  
        String nonFinalVariable = "This is non final variable";  
        new Thread (() -> {  
            // Below line gives compilation error  
            // String variable = "Run Method Variable"  
            System.out.println("->" + variable);  
            System.out.println("->" + this.variable);  
       }).start();  
    }  
} 
~~~

<!-- more -->

#### 输出

~~~ruby
// 输出
->Method Local Variable   
->Class Level Variable
~~~

由此，我们可以看出**Lambda 表达式**来编写匿名类的时候，解决了变量的可见性问题。代码注释中也强调了**Lambda 表达式**不允许创建覆盖变量。

当然，我今天说的主要是**Objective-C**下的闭包问题，我先搜索了下[wiki](https://en.wikipedia.org/wiki/Closure_%28computer_science)，关于闭包的定义，翻译过来，闭包就是一个函数（或只想函数的指针），再加上该函数执行的外部的上下文变量（有时候也称作自由变量）。

**block**实际上就是**Objective-C**语言对于闭包的实现。**block**配合上`dispatch_queue`，可以方便地实现简单的多线程编程和异步编程，关于这个可以去看**唐巧**大神的一篇文章：[使用GCD](http://blog.devtang.com/blog/2012/02/22/use-gcd/)

**block**本质上是其他变量类似。不同的是，**block**存储的数据是一个函数体。使用**block**可以像调用其他标准函数一样，传入参数，并得到返回值。脱字符`^`是**block**的语法标记。下图是经典的**block**语法讲解：

![gras](http://i12.tietuku.com/2290a9c820fddf29.png)

### (1) 参数是NSString的block

~~~ruby
// (1)block块
void (^printBlock)(NSString *x);  
printBlock = ^(NSString* str) {
    NSLog(@"print:%@", str);  
};  
printBlock(@"hello world!"); 
~~~

#### 输出

~~~ruby
// console 输出
print:hello world!
~~~

### (2)block中用在字符串数组排序

~~~ruby
// (2)block块
NSArray *stringArray = [NSArray arrayWithObjects:@"abc 1", 
    @"abc 21", @"abc 12",@"abc 13",@"abc 05",nil];  
NSComparator sortBlock = ^(id string1, id string2) {
    return [string1 compare:string2];  
};  
NSArray *sortArray = [stringArray 
    sortedArrayUsingComparator: sortBlock];  
NSLog(@"sortArray:%@", sortArray);  
~~~

#### 输出

~~~ruby
// console 输出
sortArray:(
    "abc 05",
    "abc 1",
    "abc 12",
    "abc 13",
    "abc 21"
)
~~~

### (3) 在block中使用局部变量和全局变量

在代码块中可以使用和改变全局变量。

~~~ruby
// (3)block块
int global = 1000;
int main(int argc, const char * argv[]) {
    @autoreleasepool {
        void(^block)(void) = ^(void) {
            global++;
            NSLog(@"global:%d", global);
        };
        block();
        NSLog(@"global:%d", global);
    }
    return 0;
}
~~~

#### 输出

~~~ruby
// console输出
global:1001
global:1001
</pre>
</div>
而**局部变量可以使用，但是不能改变**。
<div>
<pre class="brush: applescript">
// (4)block
int local = 500;
void(^block)(void) = ^(void) {
    local ++;
    NSLog(@"local:%d", local);
};
block();
NSLog(@"local:%d", local);
~~~

以上**block**中改变局部变量编译不通过。若想在**block**中改变局部变量，在局部变量前面加入关键字：`__block`

~~~ruby
// (5)block
__block int local = 500;
void(^block)(void) = ^(void)
{
    local++;
    NSLog(@"local:%d", local);
};
block();
NSLog(@"local:%d", local);
~~~

#### 输出

~~~ruby
// console 输出
local:501
local:501
~~~

### (4)block的递归调用

**block**想要递归调用，其变量必须是全局变量或者是静态变量，这样在程序启动的时候**block**变量就初始化了，可以递归调用。

~~~ruby
// (6)block
static void (^ const blocks)(int) = ^(int i) {
    if (i > 0) {
        NSLog(@"num:%d", i);
        blocks(i - 1);
    }
};
blocks(3);
~~~

#### 输出

~~~ruby
// console 输出
num:3
num:2
num:1
~~~

## 尾声

**block**在作用域、内存管理等方面具有自己独特的特性和需要留意的地方，在许多场景也很多实用的功能。虽然有时理解起来有点费劲，但是用好了，相信用好了可以大大提高代码可读性和效率等。