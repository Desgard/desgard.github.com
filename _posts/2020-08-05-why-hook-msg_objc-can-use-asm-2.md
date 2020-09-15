---
title: "为什么使用汇编可以 Hook objc_msgSend（下）- 实现与分析"
tags: 
    - "iOS 方案之本"
comments: true
---

# 背景

在上一篇文章中，我们介绍了 ARM64 中的汇编基础，并且知道了在汇编当中，调用一个方法的前后在栈空间是怎样表现的，以及内存中的几个特殊寄存器是如何操作的。

今天这篇文章，我们来详细详细分析一下使用汇编来 Hook `objc_msgSend` 方法的全部流程。

# Hook 思路梳理

对于 `objc_msgSend` 这个我们要 Hook 的方法，我们首先要搞清楚，这是一个什么样的方法？我需要用什么方案才能 Hook 到它的入口。首先我们来整理以下我们拥有的 Hook 方案：

- **基于 Objective-C Runtime 的 Method Swizzling**：也就是我们经常使用的 `class_replaceMethod` 方法；
- **基于 fishhook 的 Hook**：由于在 Mach-O 当中，有 Bind 和 Lazy Bind 的两个概念，所以 Facebook 通过修改 `__la_symbol` 和 `__nl_symbol` 两个表的指针，在二次调用的时候，直接通过 `__la_symbol_ptr` 找到函数地址直接调用，从而不用多次繁琐的进行函数寻址；
- **基于 Dobby 的 Inline Hook**：**Dobby 是通过插入 `__zDATA` 段和 `__zTEXT` 段到 Mach-O 中**。`__zDATA` 用来记录 Hook 信息（Hook 数量、每个 Hook 方法的地址）、每个 Hook 方法的信息（函数地址、跳转指令地址、写 Hook 函数的接口地址）、每个 Hook 的接口（指针）。`__zText` 用来记录每个 Hook 函数的跳转指令。Dobby 通过 mmap 把整个 Mach-O 文件映射到用户的内存空间，写入完成保存本地。**所以 Dobby 并不是在原 Mach-O 上进行操作，而是重新生成并替换。**关于 Dobby 中的奇技淫巧还有很多，如果有可能后续会出一个分析文章（插旗子）。

当然，成熟的 Hook 方案还有很多，并且这些经常出现在逆向工程中，我这里只是列举了最常用的三个。

## 什么是 Inline Hook

首先给个定义：**Inline Hook 就是在运行的流程中插入跳转指令来抢夺运行流程的一个方法**。

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardiaInline_Hook_.png)

上图展示了 Inline Hook 大致的思路：

1. 将原函数的前  N 个字节搬运到 Hook 函数的前 N 个字节；
2. 然后将原函数的前 N 个字节填充跳转到 Hook 函数的跳转指令；
3. 在 Hook 函数末尾几个字节填充跳转回原函数 +N 的跳转指令；

以上的 N 有多大，取决于你的跳转指令写得有多大（占用了多少指令）。

相较与 Inline Hook， fishhook 使用的是很 Trick 的方式，**通过劫持 stub 从而达到替换的目的**。

> 在罗巍的「iOS 应用逆向与安全之道」中将 fishhook 归类成 Inline Hook。从广义的定义上来说，只要完成重定向到我们自己的方法，并在远方法前后可定制处理就可以算作 Inline Hook。但是我和页面仔讨论的结果是，**这里的 Inline 应该要理解为 Inline Modification**，这种技术通常如上图所示，覆盖方法开头指令中的前几个字节，完成 Hook 方法的重定向工作。

# fishhook 完成跳转

### 汇编实现的 `objc_msgSend` 为什么可以当作 C 方法？

通过查看 `objc_msgSend` ，我们知道 Runtime 的 Method Swizzling 并不适用，因为它并不是 Objective-C 方法，调用时并不会有我们经常说的“消息转发”；通过查看 Runtime 源码，我们发现 `objc_msgSend` 是使用纯汇编实现函数，通过[汇编文件](https://github.com/RetVal/objc-runtime/blob/57c4bc7b95efb6ef5b903ab7844c859a9faef3ad/runtime/Messengers.subproj/objc-msg-arm64.s#L334-L573)我们可以看到以下定义：

```wasm
ENTRY _objc_msgSend
```

这里的 `ENTRY` 是什么意思呢？在文件中继续搜索 `ENTRY` 我们找到了这么一个宏：

```cpp
.macro ENTRY /* name */
	.text
	.align 5
	.globl    $0
$0:
.endmacro
```

这里定义了一个汇编宏，表示在 text 段定义一个 global 的 `_objc_msgSend` ，`$0` 其实就是这个宏传入的参数，也就是一个方法入口。我们可以手动将这个宏来展开：

```cpp
.text
.align 5
.globl _objc_msgSend

; ...
```

这里我们发现，**在第三行的位置通过 C 的 name mangling 命名规则，将符号 `_objc_msgSend` 映射为 C 的全局方法符号**。也就是说，这段汇编可以通过头文件声明，**便已完成了 C 的函数定义。我们在后续处理的时候可以将其视为 C 方法。**

当然我们也可以使用 MachOView 来验证这个符号名。

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardiaUntitled.png)

这里如果不太明白如何使用纯汇编实现 C 方法，可以看高级页面仔的这篇文章「在Xcode工程中嵌入汇编代码」。

## fishhook 实现的基础

既然我们将 `objc_msgSend` 已经视作 C 方法，那么我就可以使用 fishhook 来完成 **Inline Hook 的第一步：跳到 Hook 方法**。fishhook 是如何做的呢？它是在什么阶段完成这个动作的？来看下图：

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardiaApp_.png)

我们知道，Apple 自身的共享缓存库其实不会编译进我们自己的 Mach-O 中的，而是在 App 启动后的动态链接才会去做重绑定操作。这里我们要如何去验证呢？首先我们写一个 fishhook 的 demo：

```objectivec
#import "ViewController.h"
#import "fishhook.h"

@implementation ViewController

static void (*ori_nslog)(NSString * format, ...);

void new_nslog(NSString * format, ...) {
    //自定义的替换函数
    format = [format stringByAppendingFormat:@" Gua "];
    ori_nslog(format);
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    NSLog(@"hello world");
    
    struct rebinding nslog;
    
    nslog.name = "NSLog";
    nslog.replacement = new_nslog;
    nslog.replaced = (void *)&ori_nslog;
    rebind_symbols((struct rebinding[1]){nslog}, 1);
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    NSLog(@"hello world");
}

@end
```

编译运行之后发现输出 `hello world` ，点击屏幕后，成功 Hook `NSLog` 方法，输出 `hello world Gua` 。

```c
2020-08-02 23:41:50.846939+0800 TestHook[13516:519138] hello world
2020-08-02 23:41:53.681944+0800 TestHook[13516:519138] hello world Gua
```

为什么可以 Hook？函数地址不是在编译之后就确定了吗？

其实并不是，我们可以使用 `nm -n` 命令来查看一下所有的方法符合及其对应地址：

```c
$ nm -n TestHook.app/TestHook
								 U _NSLog
                 U _NSStringFromClass
                 U _OBJC_CLASS_$_UIResponder
                 U _OBJC_CLASS_$_UISceneConfiguration
                 U _OBJC_CLASS_$_UIViewController
                 ...
								 U _objc_msgSend
                 U _objc_msgSendSuper2
                 U _objc_opt_class
								 ...
0000000100006690 b _ori_nslog
0000000100006698 b __rebindings_head
```

在这里我们就可以发现，其实 `NSLog`  方法其实并没有地址，这些系统库函数并不会打入到我们的 App 包中；当我们使用它们时，**dyld 就要从共享的动态库中查找对应方法，然后将具体的函数地址绑定到之前声明的地方**，从而实现系统库方法的调用。

另外说句题外话作为了解，**对于这种可在主存中任意位置正确地执行，并且不受其绝对地址影响的技术**，在计算机领域称之为 **PIC（Position Independent Code）技术**。

## fishhook 对于 Mach-O 利用

首先我们要知道 Mach-O 中 `__DATA` 段有两个 Section 与动态符号绑定有关系：

- `__nl_symbol_ptr` ：存储了 `non-lazily` 绑定的符号，这些符号在 Mach-O 加载的时候绑定完成；
- `__la_symbol_ptr` ：存储了 `lazy` 绑定的方法，这些方法在第一次调用时，由 `dyld_stub_binder` 进行绑定；

既然 `__la_symbol_ptr` 存储了所有 `lazy` 绑定的方法，**那也就是说在这些位置应该存储了对应方法的地址。**我们通过 lldb 来验证一下。

我们在第一个 `hello world` 的位置增加断点，并使用 `image list` 命令来获取 App 的基地址：

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardiaUntitled%201.png)

在这个例子中，我们的 App 基地址为 `0x00000001063b6000` 。当然你做实验的时候可能基地址会有所改变，因为 ASLR（Address Spce Layout Randomizatio） 的缘故。

然后我们使用 MachOView 来查看在 `__la_symbol_str` 中的偏移量。

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia20200830151333.png)

发现是 `0x5000` ，所以我们在 `lldb` 中使用 `x` 命令来查看 `0x00000001063b6000 + 0x5000` 的数据是什么：

```c
(lldb)  x 0x00000001063b6000+0x5000
0x1063bb000: f0 83 3b 06 01 00 00 00 69 98 93 25 ff 7f 00 00  ..;.....i..%....
0x1063bb010: 23 53 32 49 ff 7f 00 00 54 84 3b 06 01 00 00 00  #S2I....T.;.....
```

发现在此位置的数据是 `0x01063b83f0` 。使用反汇编 `dis` 命令， 来看对应地址所指向的代码段：

```c
(lldb) dis -s 0x01063b83f0
    0x1063b83f0: pushq  $0x0
    0x1063b83f5: jmp    0x1063b83e0
    0x1063b83fa: pushq  $0xd
    0x1063b83ff: jmp    0x1063b83e0
    0x1063b8404: pushq  $0x127                    ; imm = 0x127 
    0x1063b8409: jmp    0x1063b83e0
```

那么这段代码到底是我们的 `NSLog` 的代码吗？我们可以直接对当前断点对栈顶进行一次反汇编来确定一下结果。在 `lldb` 中直接输入 `dis` 命令：

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia20200830151401.png)

可以看到汇编中 `callq`  命令对应对地址是 `0x1063b8354` 。对这个地址再次进行 `dis -s` 反汇编来查看：

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia20200830151426.png)

我们发现其中 `0x00000001063b83f0` 这个待跳转的地址，就是上面 `0x00000001063b6000 + 0x5000` 这个位置存储的地址。

再这之后，我们再对点击事件中的 `NSLog` 方法下一个断点，并且点击一下模拟器屏幕来触发一下。我们再使用 `x` 和 `dis -s` 两个命令来查看一下 `0x00000001063b6000 + 0x5000` 中的新数据：

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia20200830151447.png)

我们发现，其指向地址已经变成了 `0x01063b7380` ，使用反汇编 `dis` 命令来查看的时候，也给出了相应的函数符号 `new_nslog` 。至此，fishhook Hook C 方法已经完成。

## fishhook 思路总结

其实 fishhook 的 Hook 思路，也就是我们上述所描述的，当第一次调用系统动态库中 C 方法时，去替换掉 `__la_symbol_str` 的指针。但是它的逻辑要比这个思路还是要复杂一些，比如 fishhook 要解决以下问题：

- 使用数据结构来描述所有 Hook 方法？
- 如何通过方法名来找到对应的 Lazy 指针？
- 如何计算对应方法的地址？
- 如果是非 Lazy 表中要如何处理？
- 如何查找到对应符号名称？

诸如此类的问题还有很多。如果想看具体的实现，推荐去阅读源码。当然我们归纳 fishhook 来修改 C 方法的本质，那就是：**dyld 更新 Mach-O 二进制的 __DATA segment 的 `__la_symbol_str` 中的指针，使用 `rebind_symbol` 方法更新两个符号位置来进行符号的重新绑定。**

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardiaAug-05-2020_08-52-49.gif)

# 内联汇编实现 Hook

上文讲述了使用 fishhook 来 Hook 系统库中的 C 方法，那么我们已经完成了以下这两个阶段（绿色位置）：

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia20200830151609.png)

换句话说也就是我们通过 fishhook 已经完成了入口的重定向。但是 `objc_msgSend` 这个原方法我们又是不能不去调用的，**因为我们只是希望在 Hook 的前后，增加自定义的事件，并不想去完整替换原先的消息转发逻辑。**

所以，**我们只要在 Hook 方法中调用原函数就可以解决问题了。**

但是新的问题又出现了！`objc_msgSend` 到底应该如何传参呢？

## `objc_msgSend` 方法定义

在 `message.h` 文件中，`objc_msgSend` 有如下定义：

```c
objc_msgSend(id _Nullable self, SEL _Nonnull op, ...)
		OBJC_AVAILABLE(10.0, 2.0, 9.0, 1.0, 2.0);
```

看了函数定义，难点其实就是不定参数。既然是不定参数，其实我们可以根据不定参数的原理，在 `va_list` 来解析数组，就可以获取到所有参数了。虽然使用 `va_list` 是行的通的，但是我们需要考虑 `va_list` 在不同平台上的数据结构差异。这一点可以参看前辈 *bang* 在开发 `JSPatch` 的时候所做的笔记[「JSPatch 实现原理详解」](https://github.com/bang590/JSPatch/wiki/JSPatch-%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86%E8%AF%A6%E8%A7%A3)。

> 这个其实我也和页面仔讨论了一番。页面仔说其实使用 `va_list` 可变参数应该会有很大的坑，因为在 `objc_msgSend` 方法中不是传统意义上的可变参数。可以参考这篇文章「Apple 为什么要修改 objc_msgSend 的原型」。

但既然都已经对不同平台做差异化处理了，**那么干脆就直接使用内联汇编来实现传参逻辑就可以了**？在目前的 Hook 方案中，也就是直接使用 ARM 汇编来处理的。

## 记录上下文

通过上一篇文章「为什么使用汇编可以 Hook objc_msgSend（上）- 汇编基础」，我们了解到 `X0 - X7` 用来存储传递参数，我们仅从一个方法体的角度上来讲，可能参数已经是上下文的全部内容了。但是，我们从寄存器的角度上来看问题，上下文内容还有其他的东西，比如 `Q0 - Q7` 这八个浮点数寄存器。

所以为了保存方法的上下文，我们**通过将 `X0 - X9`、`Q0 - Q7` 这些寄存器的值压栈，从而记录下调用 `objc_msgSend` 方法的所有上下文**，其压栈方法直接模仿上文中调用函数时的压栈方法即可：

```c
; sp 指向栈顶
; 保存 {q0 - q7} ，偏移地址到 sp 寄存器
stp q6, q7, [sp, #-32]!
stp q4, q5, [sp, #-32]!
stp q2, q3, [sp, #-32]!
stp q0, q1, [sp, #-32]!

; 保存 {x0 - x8, lr} 
stp x8, x9, [sp, #-16]!
stp x6, x7, [sp, #-16]!
stp x4, x5, [sp, #-16]!
stp x2, x3, [sp, #-16]!
stp x0, x1, [sp, #-16]!
```

为什么这里处理参数 `X0-X7` 要记录，还需要记录 `X8` 和 `X9` 两个寄存器呢？因为我们在 `pre_objc_msgSend` 会对其改变。为了还原之前所有寄存器的状态，最保险的方式就是全部记录。

## 调用 `pre_objc_msgSend` 方法

在保存完上下文之后，定义一个 `pre_objc_msgSend` 的方法，其作用是用来自己定制 `objc_msgSend` 之前发生的事情。

往往我们 Hook `objc_msgSend` 的目的，就是想记录方法的上下文信息。例如我们想度量慢函数的时间，则我们需要其**方法名**、**所在的 `Class`** 以及**其上层调用方法和历史堆栈**等。那么在定义 `pre_objc_msgSend` 方法的如参时，我们可以将 `id self` （`self` 实例指针），`SEL _cmd` （方法 ID），`uintptr_t lr` （`LR` 寄存器，函数调用后的返回地址）传入即可。

**这里的 `LR` 记录其实并不是为我们业务而服务的，而是需要为堆栈记录，这样在 Hook 的最后可以跳转回上一层方法**。

对应的，我们定义一个带有这三个参数的 `pre_objc_msgSend` 方法：

```c
void pre_objc_msgSend(id self, SEL _cmd, uintptr_t lr) {
		// pre action...
}
```

为了将对应的参数传入，我们利用 `X0-X2` 寄存器来传参。因为 `X0` 和 `X1` 对应的就是 `self` 和 `_cmd` ，所以我们只需要将 `LR` 传递到 `X2` 中即可：

```c
; 将 lr 传入 x2
mov x2, lr
```

接下来我们来实现调用 `pre_objc_msgSend` 方法。

我先给出汇编，然后我们来解析它的意思：

```c
__asm volatile ("stp x8, x9, [sp, #-16]!\n");
__asm volatile ("mov x12, %0\n"
                :
                : "r"(&pre_objc_msgSend));
__asm volatile ("ldp x8, x9, [sp], #16\n");
__asm volatile ("blr x12\n");
```

第一行和第三行是用来记录和恢复 `X8` 和 `X9` 两个寄存器，其原因是因为使用了 `%0` 这个**指令操作数**，这是个什么东西呢？

为了讲解方便，举一个其他的例子。假如我想使用内联汇编写一个加法函数，我可以写出以下代码：

```objectivec
int arm_sum(int a, int b) {
    int sum = 0;
    asm volatile("add %0, %1, %2"   // 1
                 : "=r" (sum)       // 2
                 : "r" (a), "r" (b) // 3
                 :);
    return sum;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    int a = arm_sum(2, 3);
    NSLog(@"sum = %d", a); // sum = 5
}
```

1. 这一行称作**汇编语句模版**。`%0`、`%1`、`%2` 代表指令操作数，也可以代表通用寄存器（**需要注意的是，这不是 ARM 汇编，而是基于汇编的上层语言**）。分别代表 `sum` 、`a` 和 `b`（为什么是这个顺序？可以看下面的 2 和 3）。这种操作数在汇编语句模版中只能有 10 个，即 `%0 - %9` 。当然这里的代码在 Xcode 可能会有 warning，Xcode 建议我们修改成 `%w0` ，这个 `w` 代表这个**变量的宽度，`w` 是 32 位，`x` 是 64 位。**
2. 第一个冒号 `:` 分割的位置是**输出参数**。`=r` 其实是两个操作符，我们可以分开来看。`**=` 代表 `sum` 变量是输出操作符，`r` 代表按照顺序与某个通用寄存器相关联，由于它是第一个关联的，自然就进入了 `%0`**。
3. 第二个冒号 `:` 分割的位置是**输入参数**。继续使用操作符 `r` 将 `a` 和 `b` 以此放入通用寄存器 `%1` 和 `%2` 中。

搞懂了这个你应该就可以明白上面那个：

```objectivec
__asm volatile ("mov x12, %0\n"
                :
                : "r"(&pre_objc_msgSend));
```

是什么意思。对的，其实就是把 `pre_objc_msgSend` 的地址取出，然后放到 `X12` 寄存器。

那么为什么要记录和恢复 `X8` 和 `X9` 两个寄存器呢？我们在这里先记住一个结论：**当使用汇编语句模版时，就会用到 `X8` 、`X9` 寄存器，因为它的下层实现是通过这些通用寄存器来做的。**

所以为了恢复之前的上下文，我们就再一次的利用栈来保存一下这两个通用寄存器，在正式调用`pre_objc_msgSend` 方法之前将其复原即可。

最后一行使用 `blr x12` ，正式调用 `pre_objc_msgSend` 方法。

## 恢复上下文并调用原函数

恢复上下文和之前的记录上下文是逆操作，所以不做过多分析：

```cpp
ldp x0, x1, [sp], #16
ldp x2, x3, [sp], #16
ldp x4, x5, [sp], #16
ldp x6, x7, [sp], #16
ldp x8, x9, [sp], #16

ldp q0, q1, [sp], #32
ldp q2, q3, [sp], #32
ldp q4, q5, [sp], #32
ldp q6, q7, [sp], #32

```

继续使用我们上述方法进行调用的内联汇编代码来调用远方法 `objc_msgSend` 。在这里假设我们已经使用 fishhook 将其实现 Hook 到我们新的内联汇编方法体 `hook_objc_msgSend` ，原方法放到 `origin_objc_msgSend` 上。所以对应的内联汇编代码：

```objectivec
__asm volatile ("stp x8, x9, [sp, #-16]!\n");
__asm volatile ("mov x12, %0\n"
                :
                : "r"(&origin_objc_msgSend));
__asm volatile ("ldp x8, x9, [sp], #16\n");
__asm volatile ("blr x12\n");
```

## 调用 `post_objc_msgSend` 并恢复 `LR`

在上一篇文章我们讲述过 `LR` 寄存器是用来记录**函数调用完成时的返回地址**的。但是经历了咱们多次其他方法的调用，我们没有办法确定 `LR` 的值是正确的。**所以在 `hook_objc_msgSend` 方法的最后，我们需要将 `LR` 值进行恢复。**

那么我们用什么方法来恢复 `LR` 寄存器值呢？**这里有一种比较 trick 的方法，就是用一个全局数组来记录 `LR` 寄存器的值**。我们用数组来模拟一个栈结构，其实就可以对应的找到其  `LR` （也许你会说这里**会有线程安全的问题**。是的，我在这里只是做一个示例，如果你有更加健壮的方法，也可以去扩写）。

我们改写一下 `pre_objc_msgSend` 方法来记录 `LR` 的值：

```cpp
// 假设方法调用最多有 10000 层
uintptr_t l_ptr_t[10000];
// LR 栈的游标
int cur = 0;

void pre_objc_msgSend(id self, SEL _cmd, uintptr_t lr) {
    printf("before objc msgSend\n");
		// 记录 lr，且游标 +1
    l_ptr_t[cur ++] = lr;
}
```

根据之前的知识，我们知道方法的返回值在 `ret` 之后，会被存入 `X0` 寄存器。所以我们在 `post_objc_msgSend` 中将上文记录的 `LR` 值返回，然后在使用 `X0` 寄存器来恢复 `LR` 寄存器。

```cpp
// 返回记录的 lr 值
uintptr_t post_objc_msgSend() {
    if (cur != 0) {
        cur --;
    }
    return l_ptr_t[cur];
}

// hook_objc_msgSend 内部
...

// 省略 保存上下文过程
...
__asm volatile ("stp x8, x9, [sp, #-16]!\n");
__asm volatile ("mov x12, %0\n"
                :
                : "r"(&post_objc_msgSend));
__asm volatile ("ldp x8, x9, [sp], #16\n");
__asm volatile ("blr x12\n");

// 恢复 lr
__asm volatile ("mov lr, x0\n");

// 省略 恢复上下文过程
...

// return
__asm volatile ("ret\n");

```

如此，我们完成了使用内联汇编来 Hook `objc_msgSend` 方法的全部实现代码。

# 简单封装

在上面的全流程中，我们已经全部解析了 Hook `objc_msgSend` 的全部实现细节，但是我们发现，其实主要的子操作就分成 3 个：

1. **记录上下文；**
2. **恢复上下文；**
3. **调用方法；**

所以我们可以使用**宏**来对这三个子操作进行抽象封装。

在下面代码中，我们将三个操作分别封装成了 `save()` 、`load()` 和 `call(value)` 三个宏，这样在 Hook 流程上就一目了然了。

```cpp
#import "objc_msgSend_hook.h"
#import "fishhook.h"
#include <dispatch/dispatch.h>

#define call(value) \
__asm volatile ("stp x8, x9, [sp, #-16]!\n"); \
__asm volatile ("mov x12, %0\n" :: "r"(value)); \
__asm volatile ("ldp x8, x9, [sp], #16\n"); \
__asm volatile ("blr x12\n");

#define save() \
__asm volatile ( \
"stp x8, x9, [sp, #-16]!\n" \
"stp x6, x7, [sp, #-16]!\n" \
"stp x4, x5, [sp, #-16]!\n" \
"stp x2, x3, [sp, #-16]!\n" \
"stp x0, x1, [sp, #-16]!\n");

#define load() \
__asm volatile ( \
"ldp x0, x1, [sp], #16\n" \
"ldp x2, x3, [sp], #16\n" \
"ldp x4, x5, [sp], #16\n" \
"ldp x6, x7, [sp], #16\n" \
"ldp x8, x9, [sp], #16\n" );

__unused static id (*orig_objc_msgSend)(id, SEL, ...);

uintptr_t l_ptr_t[10000];
int cur = 0;

void pre_objc_msgSend(id self, SEL _cmd, uintptr_t lr) {
    printf("pre action...\n");
		// 做一个简单对测试，输出 ObjC 方法名
		printf("\t%s\n", object_getClassName(self));
    printf("\t%s\n", _cmd);
    l_ptr_t[cur ++] = lr;
}

uintptr_t post_objc_msgSend() {
    printf("post action...\n");
    if (cur != 0) {
        cur --;
    }
    return l_ptr_t[cur];
}

__attribute__((__naked__))
static void hook_Objc_msgSend() {
    // 记录上下文
    save()
    
    // 将 lr 传入 x2 用于 pre_objc_msgSend 传参
    __asm volatile ("mov x2, lr\n");

    // 调用 pre_objc_msgSend
    call(&pre_objc_msgSend)

    // 还原上下文
    load()
    
    // 调用 objc_msgSend 原方法
    call(orig_objc_msgSend)
    
    // 记录上下文
    save()
    
    // 调用 post_objc_msgSend
    call(&post_objc_msgSend)
    
    // 还原 lr
    __asm volatile ("mov lr, x0\n");
    
    // 还原上下文
    load()
    
    // return
    __asm volatile ("ret\n");
}

#pragma mark public

// 启动Hook 入口
void hookStart() {
    static dispatch_once_t onceToken;

    dispatch_once(&onceToken, ^{
        rebind_symbols((struct rebinding[6]){
            { 
                "objc_msgSend", 
                (void *)hook_Objc_msgSend, 
                (void **)&orig_objc_msgSend
            },
        }, 1);
    });
}
```

为什么我在 `load()` 和 `save()` 方法中没有记录和复原 `Q0 - Q7` 寄存器情况？**因为我们在整个的流程中并没有用到浮点数**。所以这些寄存器是不会被修改的，因此我们可以简化这个写法。

从这个点可以引出，**其实 Hook 方法和内联汇编是具有耦合的（通用寄存器就那么几个，大家公用），你需要为 Hook 方法中的实现来定制内联汇编的实现，才能够满足整体的需求实现**。

我在 `pre_objc_msgSend` 中增加了打印方法名和类名的测试方法，运行后可以看到效果如下图：

![](https://raw.githubusercontent.com/Desgard/img/master/img/guardia20200830151645.png)

看到这个输出，聪明的你一定已经想到了线程安全的问题了😄。

这是留给你后面的延伸作业，希望你可以继续这个问题的探究和思考。

# 总结

本文探究了使用 **fishhook + 内联汇编**实现 Hook `objc_msgSend` 的全部实现及其内在原理。其中知识包括：

- 什么是 Inline Hook 技术？
- fishhook 的实现原理是什么？
- 为什么 fishhook 可以 Hook `objc_msgSend` 方法？
- 如何使用内联汇编来进行记录上下文和还原上下文操作？
- 如何使用内联汇编通过方法地址调用方法？
- 汇编语句模版的简单使用。

以上问题也用于考察你是否对这篇文章完全掌握，如果没有建议**添加收藏**再次阅读。

当然这个实现只是一个工具，你可以用它来做很多你需要的事情。

另外，搞懂了这篇文章之后，我推荐你去再去看一看戴铭老师的「iOS 开发高手课 - 01 ｜ App 启动速度怎么做优化与监控」（并无利益，单纯推荐。这一章节可免费试读），我相信很多难点地方都会迎刃而解了。

# 文章书籍引用与鸣谢

特别感谢好友 @高级页面仔、@Boyang、@Jadyn、@酸菜鱼、@linxi 对于文章的斧正。

- 「在Xcode工程中嵌入汇编代码 · 高级页面仔」
- 「iOS 应用逆向与安全之道 · 罗巍」
- 「跟戴铭学 iOS 编程 - 理顺核心知识点 · 戴铭」
