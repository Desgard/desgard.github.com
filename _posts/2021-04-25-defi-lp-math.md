---
title: "Liquidity Providers 的数学原理"
tags:
  - "Blockchain"
  - "DeFi"
comments: true
show_label: "Blockchain"
---

最近半年多一直在币圈玩 DeFi，这半年来增加了好多十分神奇的玩法，这都要得益于 Uniswap 的创新。

看了这么多 Up 主的视频，讲的都云里雾里的，其实就是简单的几个公式，这篇文章我们来从头推导一下无偿损失的公式，来计算一下**为什么当单币种价格有强烈浮动的时候，为什么会有无偿损失**。

# Liquidity Providers 代币是什么

流动性提供者代币（Liquidity Providers Token），也就是我们经常说的 LP 代币，这是一个什么东西呢？

可以举一个最简单的例子，加入我们现在使用 BUSD 来购买 BNB，我们经常使用交易所的朋友们知道，交易所的挣钱模式是**用户在交易时从交易金额中进行抽成来赚取手续费**。

其实很多中心化交易所（CEX）看到了盈利模式中的用户激励机制，那就是你如果邀请别人试用我们的产品，那么**交易所在进行手续费抽成的过程中，也会将其再次抽成，作为那些 KOL 的奖励**。

而 Uniswap 这种去中心化交易所（DEX）就无法利用这种机制进行用户增长，因为所有的 DEX 没有用户注册机制，只需要连接用户的数字钱包即可完成交易。

于是，Uniswap 就设计了另外一种激励模式，**AMM（Automated Market Maker） - 自动化做市商模型**。关于自动化做市商这里我们不详细的去讲，我们只要了解以下几个动作代表了什么意思就可以（这里使用 BNB 和 BUSD 交易以及 PancakeSwap 平台为例）：

1. **用 BNB 和 BUSD 换取 BNB-BUSD LP 代币**：相当于你为 BNB 和 BUSD 流动池增加了代币。并且你获得了 BNB ⇄ BUSD 这个交易中的对应代币份额的抽成奖励占比；
   1. 这里就体现了 DEX 通过换取流动性证明，从而完成了一种激励模式；
   1. PancakeSwap 在文档中提到，**其 0.2% 的交易手续费当中，有 0.17% 的比例是提供给 LP 持有者的抽成奖励的**。剩下的 0.03% 是平台的利润。具体规则可以查看[官方文档](https://docs.pancakeswap.finance/products/pancakeswap-exchange/trade)。
2. **BNB-BUSD 代币挖矿**：当我们拿到 BNB-BUSD LP Token 之后，我们可以继续放在 PancakeSwap 的 Farms 中进行挖矿（其年化 APR 如以下截图所示）。

![](https://raw.githubusercontent.com/Desgard/img/master/img/farms.png)

所以，看到这里你应该也明白这个 LP Token 是个什么东西了。他其实就是你**提供的流动性证明**代币，**持有这个代币你就可以获得对应币对在交易过程中手续费的抽成**。

并且**平台为了让你去填充代币池，通过质押 LP 代币挖矿的形式来吸引你去兑换，这样你也获得了收益，平台也获得了交易币对的深度池**。

# 无偿损失是如何来的？

有很多朋友应该是被 LP 代币挖矿的高收益吸引过来的。在一顿操作之后开始了挖矿，但是在 Remove LP 代币的时候，发现自己损失了好多 U。本来是来挖矿赚收益的，最后矿没挖多少，自己却亏了好多。这是怎么一回事呢？

这种情况就是我们所说的** IL 无偿损失（Impermanet Loss）**，用来指**在流动性代币价值与持有两种现货资产相比产生负收益的结果**。简单来说就是亏钱了！

为什么会产生无偿损失，我们以为 BNB 和 BUSD 提供流动性为例，来具体的描述一个场景。在例子之前我们需要了解以下变量：

## 常数 K（Constant Product）

常数 K 因子是用来为交易定价的一种方式，用这个常数来保证币对池子的价值平衡。
$$K = A \times B$$
这里面 $$A$$  和 $$B$$  是两个 Token 的数量。这里面我们用 BNB 和 BUSD 来举例子：

- A - BNB 的数量
- B - BUSD 的数量

A 和 B 带入到我们的例子中，后面用 $$C_{BNB}$$ 和 $$C_{BUSD}$$ 代替
$$K_{BNB-BUSD} = C_{BNB} \times C_{BUSD}$$

## 定价 P（Token Price）

这个是 Uniswap 中对于 LP 比对的一个条件，就是要保证当前配对时，币对中两个币的 U 本位价值相同。在这个例子中，我们引入 BNB 此时的价格 $$P_{BNB}$$  以及 BUSD 的价格 $$P_{BUSD}$$。此时我们可以得到等式：
$$P_{BNB} \times C_{BNB} = P_{BUSD} \times C_{BUSD}$$
由于我们的 BUSD 其实是和 $ 锚定的，那么其实 $$P_{BUSD} = 1$$，所以有以下式子：
$$P_{BNB} \times C_{BNB} = C_{BUSD}$$
$$P_{BNB} = \frac{C_{BUSD}}{C_{BNB}}$$

## 数量公式

我们通过上述公式来推出两个代币的定价 P 的公式：

$$
\begin{cases}
C_{BNB} = \sqrt{\frac{K_{BNB-BUSD}}{P_{BNB}}} \\
C_{BUSD} = \sqrt{K_{BNB-BUSD} \times P_{BNB}}
\end{cases}
$$

如此，我们就可以通过常数 K 以及当前的币价来推导我们代币的数量了。接下来我们来看一个实际的场景，来直接感受一下无偿损失。

## 实际场景

假如，我们在 **1 BNB = 500 BUSD 的时候，组了一组 LP** 。我们拿出了 20 个 BNB 和 10000 个 BUSD 进行 LP 流动性提供代币兑换。此时我们得到了这几个变量：

$$
\begin{cases}
P_{BNB} = 500 \\
P_{BUSD} = 1 \\
K = C_{BNB} \times C_{BUSD} = 2 \times 10^5
\end{cases}
$$

并且，我们保证此时的 K 也是后续所有情况下的常数 K，即组完 LP 代币后即时生效的常数。

过了 10 天，BNB 涨价了，**当前价格为 1 BNB = 550 BUSD 了**。随之我们的价格也变成了如下关系：

$$
\begin{cases}
P_{BNB} = 550 \\
P_{BUSD} = 1
\end{cases}
$$

我们带入到之前数量公式来计算此时 LP Token 等值的代币个数：

$$
\begin{split}

C'_{BNB} &= \sqrt{\frac{K_{BNB-BUSD}}{P_{BNB}}} \\
& = \sqrt{\frac{2 \times 10^5}{550}} \\
& \approx 19.069 \ BNB\\
C'_{BUSD} &= \sqrt{K_{BNB-BUSD} \times P_{BNB}}  \\
& = \sqrt{2 \times 10^5 \times 550} \\
& \approx 10488.09\ BUSD
\end{split}
$$

在 BNB 涨价到 550 BUSD 数量到时候，我们发现等值的 LP Token 兑换**只能换回 19.069 个 BNB 和 10488.09 个 BUSD**。如果我们来换算成 BUSD 作为单位来对比一下前后收益：

- 情况一：就是上述情况，我们持有来一定数量的 LP 代币，接触流动性后全部折算成 BUSD 可以得到以下结果：

$$
\begin{split}

V_1 & = 19.069 \times 550 + 10488.09 = 20976.04 \ BUSD

\end{split}
$$

- 情况二：如果我们持续持有 20 个 BNB 和 10000 个 BUSD，那么此时我们折算成 BUSD 可以得到以下结果：

$$V_2 = 20 \times 550 + 10000 = 21000\ BUSD$$
**经过以上分析，我们是可以看到如果我们持有 LP 代币不进行任何理财操作，其实我们组了 LP Token 后是会亏 $$21000 - 20976.04 = 23.96 \ BUSD$$的。**
\*\*

# 相关补充

## LP Token 代币数量计算

其实 LP Token 也是一种代币，它也拥有自己的合约地址。比如 Pancakeswap 上的 BNB-BUSD LP 代币合约地址 `0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16` 。是代币肯定就有一个方式来计算数量，这里 Pancakeswap 和 Uniswap 的计算方式一样，采用以下公式：

$$C_{BNB-BUSD\ LP} = \sqrt{C_{BNB}\times C_{BUSD}}$$

所以，当我们用 20 个 BNB 和 10000 个 BUSD 兑换 LP 代币的时候，我们会获得大约 447.21 个 LP Token。

## 简易的无偿损失表

这个我下一篇文会具体的推演一下如何决策以及如何与收益来共同计算。这里先引用 [「Uniswap: A Good Deal for Liquidity Providers?」](https://pintail.medium.com/uniswap-a-good-deal-for-liquidity-providers-104c0b6816f2)这篇文章中给出的结论：

- a **1.25x** price change results in a **0.6%** loss relative to HODL
- a **1.50x** price change results in a **2.0%** loss relative to HODL
- a **1.75x** price change results in a **3.8%** loss relative to HODL
- a **2x** price change results in a **5.7%** loss relative to HODL
- a **3x** price change results in a **13.4%** loss relative to HODL
- a **4x** price change results in a **20.0%** loss relative to HODL
- a **5x** price change results in a **25.5%** loss relative to HODL

![Losses/Price Change Function](https://raw.githubusercontent.com/Desgard/img/master/img/lp_function_graph.png)

# 写在最后

DeFi 是一个金融游戏，如果你什么也不做研究并且什么也不去动手计算，那么永远都是韭菜。所以希望大家对于有趣的项目，先**做好研究**以及**风险评估**，在去玩耍。
