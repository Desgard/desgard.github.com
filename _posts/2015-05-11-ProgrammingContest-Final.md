---
layout: post
author: Desgard_Duan
title: The 11th SWJTU Collegiate Programming Contest - Final Problem Solving
category: learning
tag: [ACM]
---

 ![img](/public/ach_img/2015-4-25-1.jpg "Qualification")
风风火火的校赛终于结束了，各支队伍都棒棒嗒~以下是决赛的题解，想补提的同学可以到OJ上继续提交，题目已经加至Problem。<br />

<!-- more -->
##Problem A. Lazy DongGua##
###撰：段昊宇###
<code>字符串</code><code>乱搞</code><br />
题目的意思就是将一个字符串，删去一个字串，能否出现 <code>donggua</code>。由于字符串长度 ≤ 100， 所以枚举所有的情况一一判断 

<div>
<pre class="brush: cpp">
#include "iostream"
#include "cstring"
#include "cstdio"
using namespace std;
string DG = "donggua";
int main () {
    string s;
    while (cin >> s) {
        for (int i = 0; i < s.size(); ++ i) {
            for (int j = i + 1; j <= s.size(); ++ j) {
                string ne = s.substr(0, i) + s.substr(j);
                if (ne == DG) {
                    puts("YES");
                    goto E;
                }
            }
        }
        puts ("NO"); E:;
    }
    return 0;
}

</pre>
</div>

##Problem B. Cards##
###撰：陈平###
<code>动态规划</code><br />
> dp[i][j]表示:还剩下i张卡牌没有使用，还有j张卡牌叠在一起没有被扔掉的方案数。


因此就得到两种转移，一种是上一张卡牌造成了丢掉，一种是没造成丢掉。因此
> dp[i][j]=dp[i-1][j-2]+dp[i-1][j+1]


<strong>另外注意</strong><code>j==2</code>的时候，<code>dp[i][2]=dp[i-1][3]+2*dp[i-1][0]</code>，这是因为这种情况下，卡牌的颜色就任意了，而之前的方程卡牌的颜色被限制了。
<div>
<pre class="brush: cpp">
#include "cstdlib"
#include "cstdio"
#include "iostream"
#include "cstring"
using namespace std;
const int MOD = int(1e9) + 7;
int dp[1005][1005];
int N;

void solve() {
    dp[0][0] = 1;
    for (int i = 1; i <= 1000; ++i) {
        for (int j = 0; j <= 1000; ++j) {
            if (j + 1 <= 1000) {
                dp[i][j] = dp[i - 1][j + 1];
                dp[i][j] %= MOD;
            }
            if (j - 2 >= 0) {
                dp[i][j] += dp[i - 1][j - 2];
                dp[i][j] %= MOD;
                if (j == 2) {
                    dp[i][j] += dp[i - 1][j - 2];
                    dp[i][j] %= MOD;
                }
            }
        }
    }
}

int main() {
    solve();
    while (scanf("%d", &N) != EOF) {
        printf("%d\n", dp[N][0]);
    }
    return 0;
}

</pre>
</div>

##Problem C. Set change##
###撰：陈平###
<code>模拟 </code><br />
当集合长度为2时：直接模拟即可(最多26次)。<br />
当集合长度大于2时：<br />
<ol>
	<li>定义集合的奇偶性为该集合所有数字之和的奇偶性。</li>
	<li>因为每次变化操作数字的和共增加了2，所以当集合的奇偶性不同时答案一定为No。</li>
	<li>当集合的奇偶性相同时可证明答案一定为Yes，证明如下：对于任意3个位置的数字(x1,x2,x3),可进行如下变化： 
> (x1,x2,x3) → (x1,x3 + 1,x2 + 1) → (x2 + 2,x3 + 1,x1 + 1) → (x2 + 2,x1 + 2,x3 + 2) → (x1 + 3,x2 + 3,x3 + 2).(记为变化方式①)。 


在变化方式①的基础上，再将这3个位置的数字两两各交换12次，即 得:

> (x1 +3+12+12,x2 +3+12+12,x3 +2+12+12)即(x1 +27,x2 + 27,x3 + 26)(记为变化方式②)。 


因为26为周期，所以变化方式②等同于(x1,x2,x3) → (x1 + 1,x2 + 1,x3)。即保证了不改变数字位置顺序的情况下对两个数字进行了+1操作。 所以每次我们只需任选和B该位置不相同的两个位置的数字进行变化 方式②的操作，那么最后要么A完全变为B，要么A和B只有一个位置的数字不相同，对于只有一个位置数字不相同的情况，因为集合奇偶性相同，所以可进行变化①的操作使得该位置的差值平摊到另外两个位置，再对这另外两个位置进行变化②的操作即得到了B。</li>
</ol>
<div>
<pre class="brush: cpp">
#include "cstdio"
#include "cstring"
#include "cstdlib"
#include "algorithm"
#include "cmath"
using namespace std;
const int MAXN = 120;
int A[MAXN], B[MAXN];
int n;

int main() {
    while (scanf("%d", &n) != EOF) {
        for(int i = 0; i < n; scanf("%d", &A[i++]));
        for(int i = 0; i < n; scanf("%d", &B[i++]));
        bool ok = false;
        if (n == 2) {
            for (int i = 0; i < 26; i++) {
                if (A[0] == B[0] && A[1] == B[1]) {
                    ok = true;
                    break;
                }
                swap(A[0], A[1]);
                A[0] = A[0] == 26 ? 1 : A[0] + 1;
                A[1] = A[1] == 26 ? 1 : A[1] + 1;
            }
        } else {
            int f1 = 0, f2 = 0;
            for (int i = 0; i < n; i++) {
                f1 += A[i];
                f2 += B[i];
            }
            if ((f1 & 1) == (f2 & 1)) ok = true;
        }
        puts(ok ? "Yes" : "No");
    }
    return 0;
}
</pre>
</div>

##Problem D. Best Time to Buy and Sell Stock##
###撰：王跃###
<code>乱搞</code><br />
简单题目，查找一个最大差值即可，保存一个最大差值即可。
<div>
<pre class="brush: cpp">
int sell = -inf, buy = 0;
for (int i = 0; i < n; i++) {
    buy = max(buy, d[i] + sell);
    sell = max(sell, buy - sell);
}
</pre>
</div>
##Problem E. Best Time to Buy and Sell Stock Ⅱ##
###撰：王跃###
<code>动态规划</code><br />
上一题的拓展，可以做K次交易，动态规划，写法特别多。给一个比好的方法，我们考虑只交易两次：
<div>
<pre class="brush: cpp">
int maxProfit(int[] prices, int n) {
    int buy1 = -inf, buy2 = -inf;
    int sell1 = 0, sell2 = 0;
    for(int i; i < n; i++) {
        sell2 = max(sell2, buy2 + prices[i]);
        buy2 = max(buy2, sell1 - prices[i]);
        sell1 = max(sell1, buy1 + prices[i]);
        buy1 = max(buy1, 0 - prices[i]);
    }
    return sell2;
}
</pre>
</div>
看懂这个就可以写k次了
<div>
<pre class="brush: cpp">
int buy[21];
int sell[21];
int maxProfit(int k, int prices[], int n) {
    rep(i, k + 1) {
        buy[i] = -inf;
        sell[i] = 0;
    }
    int mx = 0;
    for (int i = 0; i < n; ++i) {
        cur = 0;
        for(int j = k; j > 0; --j) {
            sell[j] = max(sell[j], buy[j] + prices[i]);
            buy[j] = max(buy[j], buy[j - 1] - prices[i]);
            mx = max(mx, sell[j]);
        }
    }
    return rele[k];
}

</pre>
</div>

##Problem F. Not a easy problem##
###撰：王跃###
<code>数论</code><br />
 ![img](/public/ach_img/2015-5-12-1.png "~")

<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"

#define SQR(x) ((x)*(x))
#define rep(i, n) for (int i=0; i<(n); ++i)
#define repd(i,n)  for(int i=1;i<=(n);++i)
#define repf(i, a, b) for (int i=(a); i<=(b); ++i)
#define reps(i, a, b) for (int i=(a); i>=(b); --i)
#define PB push_back
#define MP(A, B) make_pair(A, B)
#define pow2(n) (1<<(n))
#define pi acos(-1)
#define eps 0.00000001
#define lg(n) log10((n)*1.0)
#define MaxN  200000000
#define mod 1000000007
#define md(x) (((x)%mod+mod)%mod)
#define inf 2147483647
#define inf2 0x7fffffffffffffff
#define ll long long
#define typed int
using namespace std;
typedef int typec;

void RD(int &a) {
    int value = 0, s = 1;
    char c;
    while ((c = getchar()) == ' ' || c == '\n');
    if (c == '-') s = -s; else value = c-48;
    while ((c = getchar()) >= '0' && c <= '9')
        value = value * 10 + c - 48;
    a = s * value;
}
void RD(int &a,int &b){
    RD(a),RD(b);
}
void RD(int &a,int &b,int &c){
    RD(a),RD(b),RD(c);
}

ll dp[MaxN];

int main(){
    int n,T;
    RD(T);
    while(T--){
        RD(n);
        int  r = sqrt(n); 
        vector&ltint&gt V; 
        repd(i,r+1) V.PB(n/i);
        int up = *V.rbegin(); 
        reps(i, up-1, 1) V.PB(i);
        int size = V.size();
        rep(i, size) {int x = V[i];dp[x] = (ll)x*(x+1)/2-1;}
        repf(i, 2, r+1){
            if (dp[i] <= dp[i-1]) continue;
            ll pp = (ll)i*i; 
            for(vector&ltint&gt::iterator  v=V.begin();v!=V.end();++v){
                if (*v < pp) break;
                dp[*v] -= i*(dp[*v/i] - dp[i-1]);
            }
        }
        cout << dp[n] << endl; 
    }    
    return 0;
}

</pre>
</div>
##Problem G. How many left?##
###撰：陈平###
<code>数据结构</code><br />
最小生成树，边的权值为两个节点需要的糖果数量，因为第一次发糖后上帝会给他同样多的糖，实际上第一次发完糖后他的糖数没变。所以刚好满足最小生成树建立边。
<div>
<pre class="brush: cpp">
#include "iostream"
#include "cstdio"
#include "algorithm"
#define int64 long long
using namespace std;

const int MAXN = 2010;
const int MAXM = 100010;
int n, Q;
int a[MAXN], p[MAXN];
int64 m;

struct Ed {
    int u, v, w;
} edge[MAXM];


bool cmp(Ed E1, Ed E2) {
    return E1.w < E2.w;
}


int find(int x) {
    return x == p[x] ? x : p[x] = find(p[x]);
}


int64 Kruskal() {
    int64 mst = 0;
    int k = 0, i;
    for(i = 0; i <= n; i++) p[i] = i;

    for(i = 0; i < Q; i++) {
        int u = find(edge[i].u);
        int v = find(edge[i].v);
        if(u != v) {
            mst += (int64)edge[i].w;
            p[u] = v;
            k++;
        }
        if(k >= n - 1)break;
    }

    int cnt = 0;
    for(i = 1; i <= n; i++) {
        if(find(i) == i)
            cnt++;
    }

    return cnt == 1 ? mst : m + 1;
}


int main() {
    int i;
    while(scanf("%d %lld", &n, &m) != EOF) {
        for(i = 1; i <= n; scanf("%d", &a[i++]));
        scanf("%d", &Q);
        for(i = 0; i < Q; i++) {
            scanf("%d %d", &edge[i].u, &edge[i].v);
            edge[i].w = a[edge[i].u] + a[edge[i].v];
        }
        sort(edge, edge + Q, cmp);
        int64 ans = m - Kruskal();
        printf("%lld\n", ans < 0 ? -1 : ans);
    }
    return 0;
}

</pre>
</div>

##Problem H. A Easy Problem##
###撰：陈平###
<code>计算几何</code><br />
简单计算几何：求两个圆的交叉面积。
<div>
<pre class="brush: cpp">
#include "iostream"
#include "cstdio"
#include "cstring"
#include "cmath"
using namespace std;
const double PI = acos(-1.0);

struct Circle {
    double x, y;
    double r;
} c[2];

double dis(Circle a, Circle b) {
    return sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

double solve(Circle a, Circle b) {
    double d = dis(a, b);
    if (d >= a.r + b.r)
        return 0;
    if (d <= fabs(a.r - b.r)) {
        double r = a.r < b.r ? a.r : b.r;
        return PI * r * r;
    }
    double ang1 = acos((a.r * a.r + d * d - b.r * b.r) 
    			/ 2.0 / a.r / d);
    double ang2 = acos((b.r * b.r + d * d - a.r * a.r) 
    			/ 2.0 / b.r / d);
    double ret = ang1 * a.r * a.r + ang2 * b.r * b.r - 
    			d * a.r * sin(ang1);
    return ret;
}

int main() {
    while (scanf("%lf%lf%lf%lf%lf%lf", 
    	&c[0].x, &c[0].y, &c[0].r, &c[1].x, &c[1].y, &c[1].r) != EOF) {
        printf("%.3f\n", solve(c[0], c[1]));
    }
    return 0;
}


</pre>
</div>

##Problem I. Apple’s game##
###撰：陈平###
<code>动态规划</code><code>博弈</code><br />
博弈DP，<code>dp[i][j][k]</code>表示三堆石头分别为<code>i,j,k</code>状态时候是否为必胜，之后便是N,P态的转换，成必败态能到达的一定是必胜态。
<div>
<pre class="brush: cpp">
#include "iostream"
#include "cstdio"
using namespace std;
bool dp[301][301][301] = {0};
void solution() {
    for(int i = 0; i <= 300; i++) {
        for(int j = 0; j <= 300; j++) {
            for(int k = 0; k <= 300; k++) {
                if(!dp[i][j][k]) {
                    for(int r = 1; r + i <= 300; r++)
                        dp[i + r][j][k] = 1;
                    for(int r = 1; r + j <= 300; r++)
                        dp[i][j + r][k] = 1;
                    for(int r = 1; r + k <= 300; r++)
                        dp[i][j][k + r] = 1;
                    for(int r = 1; r + j <= 300 && r + i <= 300; r++)
                        dp[i + r][j + r][k] = 1;
                    for(int r = 1; r + j <= 300 && r + k <= 300; r++)
                        dp[i][j + r][k + r] = 1;
                    for(int r = 1; r + k <= 300 && r + i <= 300; r++)
                        dp[i + r][j][k + r] = 1;
                }
            }
        }
    }
}
int main() {
    int a, b, c;
    solution();
    while(scanf("%d %d %d", &a, &b, &c) != EOF) {
        printf("%d\n", dp[a][b][c]);
    }
    return 0;
}

</pre>
</div>

##Problem J. How many colorings##
###撰：王跃###
撰写中...
<div>
<pre class="brush: cpp">

</pre>
</div>

##Problem K. DongGua Miss You##
###撰：段昊宇###
<code>乱搞</code><br />
这次比赛的最后一题，之前看题册的时候，难度还是有些大，所以放了一道签到题。<br />
降序排序求前 m 数的和即可。我当时给的5s，数据并没有到 <code>1000</code>。所以，没有卡冒泡。<br /> 
<div>
<pre class="brush: cpp">
#include "iostream"
#include "cstring"
#include "algorithm"
#include "cstdio"
using namespace std;

long long b[1005000];
long long N, M;
int main() {
    while (cin >> N) {
        for (int i = 0; i < N * N; ++ i) {
            scanf ("%lld", b + i);
        }
        sort (b, b + N * N, greater&ltlong long&gt());
        cin >> M;
        long long ans = 0;
        for (int i = 0 ; i < M; ++ i) {
            ans += b[i];
        }
        cout << ans << endl;
    }
    return 0;
}

</pre>
</div>
