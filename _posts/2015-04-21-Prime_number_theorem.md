---
layout: post
author: Desgard_Duan
title: NEFU117 巧遇素数定理（Prime number theorem）
category: learning
tag: [ACM]
---

半个月没有更新博客，其实也学了好多很帅的东西。今天中午恰巧看到这个<code>素数定理</code>，突然想起了前一段时间别人问的一道题。当时毫无思路，这次就秒出了。<br />
数论真神奇！<br />
 ![img](/public/ach_img/2015-4-21-0.png "prm_num_the")

<!-- more -->
##题意##
给出一个数 <code>N</code>，求解小于10^N素数个数<code>a</code>的位数是多少。<br />

##思路 ##
这题目就是那种知道公式的一下子就能导出来，不知道的肯定不会做的那种。<br />
所以这题的解法，大家要自学下<code>素数定理</code>。<br />

##素数定理##
> 对正实数x，定义π(x)为素数计数函数，亦即不大于x的素数个数。数学家找到了一些函数来估计π(x)的增长。以下是第一个这样的估计。
<div align="center">
<img src="/public/ach_img/2015-4-21-1.png" title="prm_num_the">
</div>
> 其中ln x为x的自然对数。上式的意思是当x趋近∞，π(x)与x/ln x的比值趋近1。但这不表示它们的数值随着x增大而接近。


##求解##
根据素数定理，于是我们可以得到以下推倒过程：<br /><br />
###一、我们设π(10^N)的位数为<code>x</code>，则<code>x</code>为本题之解。###
###二、根据素数定理，列式求解即可。###
<hr />
列出方程：
<div>
<img src="/public/ach_img/2015-4-21-2.png" title="prm_num_the" height="44px">
</div><br />
对两边求对数：
<div>
<img src="/public/ach_img/2015-4-21-3.png" title="prm_num_the" height="44px">
</div><br />
对最后的得数<strong>向上取整</strong>求出答案。<br />

<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"
using namespace std;
int main () {
    double n;
    while (~scanf ("%lf", &n)) {
        double ans = n - log10(n) - log10(log(10));
        printf ("%d\n", (int)ceil(ans));
    }
    return 0;
}
</pre>
</div>

