---
title: "LP Token 价格计算推导及安全性"
tags:
  - "Blockchain"
  - "DeFi"
  - "Web3"
comments: true
show_label: "Blockchain"
---

# 背景

在实现 CakeBot 的 USDT/USDC 池时，需要计算 LP Token 的代币价值，从而方便的给用户提示 LP Token 当前准确的价格，来计算收益率。所以对 LP Token 的价值计算做了一点深入的研究，并且还翻阅到 Alpha Finance 团队的关于安全获取 LP 价格的方法。
本位将这些学习笔记分享给大家。
​

# 一般 LP Token 价格的获取方法

我们知道对于一般 Token 的价格，在 Cex 中其实是市场上交易撮合的成交价。在 Dex 中，由于 AMM 做市商模型通过一组 LP 来构建价格的锚定。所以如果我们想获取到一个 Token 的价格，都是通过对于稳定币 USDT、USDC 或者 BUSD 的币对关系，从而反映现实世界的价格。
​

我们知道 LP Token 是不具有流动性池的，如果有那就是套娃了。那么我们应该如何去计算价格呢？其实我们只需要用总增发量和货币价格反推即可。
​

$$
Cap_x = P_x \times T_x
$$

​

任意一个 Token X 的总市值是 $Cap_x$，是用当前的价格 $P_x$ 和当前总铸造数量 $T_x$相乘可得。对于 LP Token，我们可以用这个公式来反推币价。因为在 LP Token 中，总市值是可以通过两种币的数量和对应价格求得，并且总的制造数量也是已知的。
​

所以我们可以如此计算 LP Token 总价格：
​

$$
P_{LP} = \frac{Cap_{LP}}{T_{LP}} = \frac{r_0 \times price_0 + r_1 \times price_1}{totalSupply}
$$

​

其中，$r_0$和 $r_1$就是 LP Token 合约中两种代币的存量，$price_0$和 $price_1$分别代表 $r_0$和 $r_1$ 对应 Token 的价格。市面上无论 BSC、ETH 还是 Polygon 还是 Heco 链等，其 LP 代币基本都是 fork Uniswap 的，所以 $r_0$和 $r_1$、$price_0$和 $price_1$ 都是能拿到的。
​

上面的公式我们其实可以看出，是通过市值反推价格，也没有什么巨大的逻辑问题。当我们需要访问其币价的时候已经可以满足需求。在 Web3.js 前端中，我们就可以照此拿到结果。

```javascript
export const getLpTokenPrice = async (
  lpAddress: string,
  lib: any,
  price0: BigNumber,
  price1: BigNumber
) => {
  const lpToken = getPancakeLp(lib, lpAddress);
  let [r0, r1] = (await lpToken.getReserves()).map((n) => bignumberToBN(n));
  let totalSupply = bignumberToBN(await lpToken.totalSupply());
  return r0
    .multipliedBy(price0)
    .plus(r1.multipliedBy(price1))
    .dividedBy(totalSupply);
};
```

至此，我的需求完成。

# 延时喂价漏洞

对于上文公式：
​

$$price_{lp}= \frac{r_0 \times price_0 + r_1 \times price_1}{totalSupply}$$

其实乍一看是不存在问题的。但是如果我们所做的需求，不仅仅是一个价格展示，而是一个借贷系统，用这种方式来获取清算系数，就会**存在被闪电贷的风险**。虽然 $price_0$和 $price_1$不能被操控，但是 $r_0$和 $r_1$是可以的。黑客可以通过操作 $r_0$ 和 $r_1$，从而对价格实现控制。

之前漫雾团队写过一篇[「Warp Finance 被黑详解」](https://mp.weixin.qq.com/s/ues5U9Bl971hSqGO1a4SYA)的分析，采用了如下攻击流程：

1. 通过 dydx 与 Uniswap 闪电贷借出 DAI 和 WETH；
1. 用小部分 DAI 和 WETH 在 Uniswap 的 WETH-DAI LP 中添加流动性，获得 LP Token；
1. 将 LP Token 抵押到 Wrap Finance 中；
1. 用巨量的 WETH 兑换成 DAI，因为 WETH 迅速进入了 WETH-DAI 流动池，总数量大增。但是由于价格使用的是 Uniswap 的预言机，访问的是 Uniswap 的 LP 池，所以 WETH 的价格并未发生变化。从而导致 Wrap Finance 中的 WETH-DAI LP Token 价格迅速提高；
1. 由于 LP Token 单价变高，导致黑客抵押的 LP Token 可以借出更多的稳定币来获息。

​

这里，我们发现漏洞的关键地方，其实是 $price$ 计算对于借贷项目中，使用的是他人的 LP 合约，还未等套利者来平衡价格，从而终究留出了时间差。
​

为了解决这个问题，如果我们可以找到一种方式，从而规避价格查询，就能大概率防止上述漏洞。这里，Alpha Finance 给出了另外一个推导公式。

# 获取公平 LP 价格方法

首先我们在一个 LP 池中，我们能保证的是恒定乘积 $K$ 值的大小，我们定义价格比值是 $P$，那么我们会有以下关系式：
​

$$
\begin{cases}
K=r_0 \times r_1 \\
P = \frac{r_1}{r_0}
\end{cases}
$$

​

因为 $r_0$ 和 $r_1$ 在旧方法中是可以被操纵的，所以我们用 $K$ 和 $P$ 来反解真实的 $r'_{0}$ 和 $r'_1$ ：
​

$$
\begin{cases}
r'_0 = \sqrt{K / P} \\
r'_1 = \sqrt{K \times P}
\end{cases}
$$

如此，我们在带入一开始计算 $price_{lp}$的公式中：
​

$$
\begin{align}
price_{lp}   &= \frac{r'_0 \times price_0 + r'_1 \times price_1}{totalSupply} \\
   & = \frac{\sqrt{K/P}·price_0 + \sqrt{K·P}·price_1}{totalSupply} \\
    & = \frac{\sqrt{K · \frac{price_1}{price_0}·price_0^2} + \sqrt{K·\frac{price_0}{price_1}·price_1^2}}{totalSupply} \\
& = \frac{2\sqrt{K·price_0·price_1}}{totalSupply} \\
& = 2 \frac{\sqrt{r_0·r_1}·\sqrt{price_0 · price_1}}{totalSupply}
\end{align}
$$

我们可以发现，最终 Alpha Finance 给我们的推导式中，不会存在独立的 $r_0$ 和 $r_1$ ，取而代之的是它们的恒定乘积 $K$。

# 攻击可能性分析

使用以上公式，我们可以真正的避免攻击吗？

1. ​$price_0$和 $price_1$ 首先是可信源获取的正确价格，无法操纵；
2. $totalSupply$ 只是改变了质押数量，其变化与质押的两个代币数量有关系；
3. 对于 $r_0$ 和 $r_1$ ，在 Alpha Finance 的博客中提供了两种思路：
   1. 直接进行代币兑换（类似于上述攻击手段），由于 $r_0 \times r_1$ 是定值 $K$，所以无论如何变化都不会影响计算结果；
   2. 直接将 Token 打入 LP Token 合约地址中，由于 $r_0$ 和 $r_1$ 都是在二次根式下，所以付出 $x$ 倍的成果，最终只能获得 $\sqrt{x}$ 倍的收益，这显然是亏本的；

综上，在已知情况下，是可以有效避免攻击的。

# 总结

通过这次对 LP Token 价格计算的研究，并且对延时喂价漏洞的探求，了解了 LP 抵押使用一般方式计算带来的风险。计算价格的需求，一定要根据所做业务的类型，谨慎选择。

# 参考链接

- [Alpha Finance 关于获取公平 LP 价格的方法](https://blog.alphafinance.io/fair-lp-token-pricing/)
- [一种安全的 LP 价格的获取方法曾汨](https://ethfans.org/posts/a-safe-way-to-get-the-prices-of-lp-tokens)

---

> 欢迎大家使用我个人研发的 [Cakebot Finance](https://cakebot.finance/) 来体验去中心化 DAPP 挖矿。
