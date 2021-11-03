---
title: "PancakeHunny 闪电贷 LP 池操控攻击分析"
tags:
  - "Blockchain"
  - "DeFi"
  - "Web3"
comments: true
show_label: "Blockchain"
---

# 背景

2021 年 10 月 20 日 UTC 时间上午 9 点，PancakeHunny 平台遭遇闪电贷智能合约攻击，攻击者通过操纵 PCS 上的 WBNB/TUSD 的流动性从而操纵了兑换比例，实现了 HUNNY 铸币合约的大量铸币，完成攻击。

最终攻击者获利 230 万美元（64.2 万是稳定币 + 435.31 ETH），并且大量铸造 HUNNY 代币，将 HUNNY 的价格从 0.3 抛售到 0.1 美元。
​

![](https://raw.githubusercontent.com/Desgard/img/master/img/1635583246116-9c41c78d-cfc2-4008-8ad1-2682ae038fe4.png)

这一操作的 TxHash 从 bscscan 上可以找到：[0x1b698231965b72f64d55c561634600b087154f71bc73fc775622a45112a94a77](https://bscscan.com/tx/0x1b698231965b72f64d55c561634600b087154f71bc73fc775622a45112a94a77)。
​
下面我们来复盘一下整个攻击手法和流程。

# 代码中的根本原因

可以查看合约 [VaultStrategyAlpacaRabbit](https://bscscan.com/address/0x27d4ca4bb855e435959295ec273fa16fe8caea14#code)，这个合约是可升级合约的原合约地址。目前该合约仍旧由线上 [TUSD 单币池合约地址](https://bscscan.com/address/0xef43313e8218f25fe63d5ae76d98182d7a4797cc)进行代理转发（也就是线上还没有进行更换），但是目前官方已经发现了问题，已经关闭了该池的铸币（那其实还不如直接存 Alpaca Finance）。
​
我们在 [VaultStrategyAlpacaRabbit](https://bscscan.com/address/0x27d4ca4bb855e435959295ec273fa16fe8caea14#code) 合约中，可看到以下代码：

![](https://raw.githubusercontent.com/Desgard/img/master/img/1635956502729-dab865ce-a8bc-4ee7-9104-991739decb3b.png)
​

在上述代码中，黄色高亮的一行就是此次攻击的根本原因。原因就是因为这个 swap 的 Path 最终选用的是 `[ALPACA, WBNB, TUSD]` ，**然而 TUSD/WBNB 的 LP Token 其流动性仅有 2 美元（这是目前的情况，可以**[**查看 PCS 的流动性数据**](https://pancakeswap.finance/info/pool/0x1b011a21c02194a449e32f729489d299f907e71a)**）**，于是攻击者就通过闪电贷放大资金量，从而控制这组 LP Token 的兑换汇率，从而进行攻击。
​

![](https://raw.githubusercontent.com/Desgard/img/master/img/1635957697293-931a04a8-5b51-416f-999b-f2a7fe26ab52.png)

接下来我们来分步骤解析这个过程：
​

- 攻击者利用闪电贷，借出 270 万 TUSD，并且全部通过 `[TUSD, WBNB]` 的 Path 兑换成了 WBNB。根据 AMM 的恒定乘积公式 $$x \times y = k$$ ，由于大量的 TUSD 进入到了 TUSD/WBNB Lp 池中，**所以通过十分少量的 WBNB 沿着相反的 Path 就能兑换出大量的 TUSD**。
- 第二步，攻击者会将一笔可观的 TUSD 数额放入 TUSD 单币池中，让其占据了该池 99% 的收益。此时因为步骤一种操控了 Lp 池，大量的 TUSD 会被兑换出来。
- 第三步，攻击者会调用 `getReward()` 方法，这个方法会调用 `_withdrawStakingToken()` 方法，其中会返回 `withdrawAmount` 这个变量。

```rust
withdrawAmount = _stakingToken.balanceOf(address(this)).sub(stakingTokenBefore);
```

它会通过 `_stakingToken` 也就是我们的 TUSD 总量来计算。而 `withdrawAmount` 就是用来传入到 `minter` 中，其价值的 30% 为总量负责铸造 HUNNY 代币的数量控制变量，从而造成大量的 `HUNNY` 被铸造。

- 攻击者抛售大量的 `HUNNY` 完成此次经济攻击。

# 复盘

攻击者完成本次攻击，是与以往的 `BUNNY` 攻击有所区别的，`BUNNY` 中的错误实在是太低级了，使用了账户余额的代币数量来铸造 `BUNNY` 。虽然 `HUNNY` 通过使用增量变量的方式避免了 `BUNNY` 的漏洞，但对于 LP Token 市值太低容易操纵这一环节没有戒备心，从而导致了经济漏洞。
​

反思：在制作机枪池的时候，如果有 Minter 进行铸造操纵，一定要慎之又慎，来验证每一步用到的数量关系，再进行代码编写。
