---
layout: post
author: Desgard_Duan
title: The 11th SWJTU Collegiate Programming Contest - Qualification Round - Trial Problem Solving
category: learning
tag: [ACM]
---

 ![img](/public/ach_img/2015-4-25-1.jpg "Qualification")
以下是今天题目的解题报告，今天做题情况并没有我想象的那么理想，希望有些兴趣的同学在赛后能将没有解出的题目补下~<br />

<!-- more -->
##Problem A. A+B##
###撰：段昊宇###
是一道<code>模拟题</code>，这题考察的是大家对于语言的基本功，并没有任何算法而言。只要耐心去做，有语言基础的同学都应该可以顺利解决。以下是参考代码。

<div>
<pre class="brush: cpp">
#include "cstdio"
#include "cstring"
using namespace std;
char *out[5][10] =  {
{"+-+", "  +", "+-+", "+-+", "+ +", "+-+", "+-+", "+-+", "+-+", "+-+"},
{"| |", "  |", "  |", "  |", "| |", "|  ", "|  ", "  |", "| |", "| |"},
{"+ +", "  +", "+-+", "+-+", "+-+", "+-+", "+-+", "  +", "+-+", "+-+"},
{"| |", "  |", "|  ", "  |", "  |", "  |", "| |", "  |", "| |", "  |"},
{"+-+", "  +", "+-+", "+-+", "  +", "+-+", "+-+", "  +", "+-+", "+-+"}
};
char in[5][1024];

int main() {
    int a = 0, b = 0, i, j, k, l, *p = &a;
    for ( i = 0; i < 5; i++) gets(in[i]);
    for ( i = 0, l = strlen(in[0]); i < l; i += 4) {
        if (in[0][i] == ' ' && in[0][i + 1] == ' ' && in[0][i + 2] == ' ') {
            p = &b;
            i += 4;
        }
        for ( k = 0; k < 5; k++) in[k][i + 3] = '\0';
        for ( j = 0; j < 10; j++) {
            for ( k = 0; k < 5; k++) 
            	if (strcmp(out[k][j], in[k] + i)) break;
            if (k == 5) break;
        }
        *p = (*p) * 10 + j;
    }
    for ( a += b, i = 10; a / i; i *= 10);
    for ( j = 0; j < 5; j++) {
        for ( k = i / 10; k; k /= 10) {
            printf("%s%c", out[j][a / k % 10], k == 1 ? '\n' : ' ');
        }
    }
    return 0;
}
</pre>
</div>

##Problem B. Air Strike##
###撰：段昊宇###
就是给定两个圆的圆心，以及两个圆的面积相加之和，再给定一系列点，要你分配这两个圆面积，使得圆覆盖的点做多，求至少多少点未被覆盖。<br />
只需<code>枚举</code>圆的半径即可。<br />
<div>
<pre class="brush: cpp">
#include "iostream"
#include "cstdio"
#include "cmath"
#include "algorithm"
using namespace std;

const double pi = 3.141;
const int maxn = 1000;

struct point {
    double x, y;
    double getdis(point p) {
        return sqrt((x - p.x) * (x - p.x) + (y - p.y) * (y - p.y));
    }
};

point a, b;
int n, casen = 0;
double disa[maxn + 10], disb[maxn + 10], sum;

void input() {
    point p;
    scanf("%lf%lf", &a.x, &a.y);
    scanf("%lf%lf", &b.x, &b.y);
    scanf("%lf", &sum);
    for(int i = 0; i < n; i++) {
        scanf("%lf%lf", &p.x, &p.y);
        disa[i] = p.getdis(a);
        disb[i] = p.getdis(b);
    }
}

void computing() {
    int ans = 0;
    double ra, rb;
    for(int i = 0; i < n; i++) {
        int tmp = 0;
        ra = disa[i];
        if(pi * ra * ra > sum) continue;
        rb = sqrt(max(sum / pi - ra * ra, 0.000));
        for(int j = 0; j < n; j++) {
            if(disa[j] <= ra || disb[j] <= rb) {
                tmp++;
            }
        }
        if(tmp > ans) ans = tmp;
    }
    for(int i = 0; i < n; i++) {
        int tmp = 0;
        rb = disb[i];
        if(pi * rb * rb > sum) continue;
        ra = sqrt(max(sum / pi - rb * rb, 0.000));
        for(int j = 0; j < n; j++) {
            if(disa[j] <= ra || disb[j] <= rb) {
                tmp++;
            }
        }
        if(tmp > ans) ans = tmp;
    }
    casen++;
    printf("%d. %d\n", casen, n - ans);
}

int main() {
    while(scanf("%d", &n) != EOF && n) {
        input();
        computing();
    }
    return 0;
}
</pre>
</div>

##Problem C. The Calculator Of DongGua##
###撰：段昊宇###
一道<code>数据结构</code>关于<code>栈</code>的经典例题，这道题用<code>Dijkstra双栈法</code>可能会简化代码的工作量，大家可以尝试下。<br />
<div>
<pre class="brush: cpp">
#include "stack"
#include "cstdio"
#include "cctype"
#include "cstring"
#include "cstdlib"
using namespace std;

int priority(char c) {
    if(c == '=')    return 0;
    if(c == '+')    return 1;
    if(c == '-')    return 1;
    if(c == '*')    return 2;
    if(c == '/')    return 2;
    return 0;
}

void compute(stack&ltdouble&gt& Num, stack&ltchar&gt& Op) {
    double b = Num.top();
    Num.pop();
    double a = Num.top();
    Num.pop();
    switch(Op.top()) {
    case '+':
        Num.push(a + b);
        break;
    case '-':
        Num.push(a - b);
        break;
    case '*':
        Num.push(a * b);
        break;
    case '/':
        Num.push(a / b);
        break;
    }
    Op.pop();
}

int main() {
    int z;
    char str[1005];
    stack&ltdouble&gt Num;
    stack&ltchar&gt Op;
    scanf("%d", &z);
    while(z--) {
        scanf("%s", str);
        int len = strlen(str);
        for(int i = 0; i < len; i++) {
            if(isdigit(str[i])) {
                double n = atof(&str[i]);
                while(i < len && (isdigit(str[i]) || str[i] == '.'))
                    i++;
                i--;
                Num.push(n);
            } else {
                if(str[i] == '(')
                    Op.push(str[i]);
                else if(str[i] == ')') {
                    while(Op.top() != '(')
                        compute(Num, Op);
                    Op.pop();
                } else if(Op.empty() || priority(str[i]) > priority(Op.top()))
                    Op.push(str[i]);
                else {
                    while(!Op.empty() && priority(str[i]) <= priority(Op.top()))
                        compute(Num, Op);
                    Op.push(str[i]);
                }
            }
        }
        Op.pop();
        printf("%.2f\n", Num.top());
        Num.pop();
    }
    return 0;
}
</pre>
</div>

##Problem D. A Game About Cards##
###撰：朱吴帅###
题意大概就是你有n张牌，第1次把上面的1张牌放到底部，然后最上面的牌就是1，然后拿走1。第2次把上面的2张牌依次放到底部，然后最上面的牌就是2，然后拿走2....重复这个过程，直到所有的牌都被拿走。问一开始的牌应该从上到下怎么放，才能完成这个过程。具体实现的话就是通过模拟逆向还原，借助队列还原牌组，从最后一张n开始还原，然后将n反着向前放，一直模拟到1即可还原整个牌组。<br />
<div>
<pre class="brush: cpp">
#include "iostream"
#include "cstdio"
#include "cmath"
#include "algorithm"
#include "queue"

using namespace std;

int main() {
    int n, T;
    scanf("%d", &T);
    while(T--) {
        queue &ltint&gt q;
        scanf("%d", &n);
        q.push(n);
        for(int i = n - 1; i >= 1; --i) {
            q.push(i);
            for(int j = 1; j <= i; ++j) {
                int x = q.front();
                q.pop();
                q.push(x);
            }
        }
        int s[105];
        int cnt = 0;
        for(int i = 1; i <= n; ++i) {
            s[cnt++] = q.front();
            q.pop();
        }
        for(int i = cnt - 1; i >= 0; --i) {
            if(i != cnt - 1)putchar(' ');
            printf("%d", s[i]);
        }
        puts("");
    }
    return 0;
}
</pre>
</div>
##Problem E. RUO’s Palindrome##
###撰：张羿辰###
这道题采用的是<code>DP</code>的思想（和判定回文并没有太大关系）<br />
我们假设<code>DP[i][j]</code>为从i到j的回文串个数<br />
显然，<code>DP[i][j] = DP[i + 1][j]（从i+1到j的个数）+DP[i][j + 1]（从i到j + 1的个数）</code>；<br />
其次，假若是<code>str[i] != str[j]</code>，意味着我们中间的<code>DP[i + 1][j - 1]</code>被重复计算了，因此<code>DP[i][j] -= DP[i + 1][j - 1]</code>；<br />
若<code>str[i] == str[j]</code>，那么不论从<code>i + 1 </code>到 <code>j - 1</code>中怎么取，都能满足，因此重复部分抵消，而且这时候str[i]和str[j]可以组成回文，所以这里我们要DP[i][j] += 1；<br />
数据的话<code>DP[i][i] = 1</code>，然后依次类推求出<code>DP[0][len - 1]</code>就是结果。<br />
<div>
<pre class="brush: cpp">
#include "cstring"
#define MAXM 500100
#define mod 1000007
#define inf 100000000
using namespace std;
long long dp[1010][1010];
char s[1010];
void get_ans(int len) {
    memset(dp, 0, sizeof(dp));
    for (int i = 0; i < len; ++i) {
        for (int j = 0; j < len - i; ++j) {
            if (i == 0) dp[j][j + i] = (long long)1;
            else {
                dp[j][j + i] = dp[j + 1][j + i] + 
                		dp[j][j + i - 1] - dp[j + 1][j + i - 1] ;
                if (s[j] == s[j + i]) 
                	dp[j][j + i] += dp[j + 1][j + i - 1]+(long long)1;
            }
        }
    }
    printf("%lld\n", dp[0][len - 1] % mod);
}
int main() {
    int t;
    while (~scanf("%d", &t)) {
        for (int i = 1; i <= t; ++i) {
            scanf("%s", s);
            printf("Case #%d: ", i);
            get_ans(strlen(s));
        }
    }
    return 0;
}


</pre>
</div>
##Problem F. Absent-minded DongGua##
###撰：段昊宇###
题意是可以随意更改向量里面元素的位置，使得<code> A · B </code>达到最小值。<br />
根据<code>数学归纳法</code>可以证得 A、B 两个向量一个升序排列，一个降序排列再进行内积运算取得最小值。于是我们将向量读入进行升序和降序排列求解即可。<br />
很多同学的代码错误很可惜，是因为数据量问题。试想一个极限向量，都由100,000构成，内积求得的结果明显为<code>100,000×100,000×800</code>，此时<code>int</code>数据类型明显超出范围，所以需要改成<code>64位</code>的<code>long long</code>或者<code>__int64</code>。

<div>
<pre class="brush: cpp">
#include "iostream"
#include "cstdio"
#include "algorithm"
#include "cstring"
#define maxn 1000
using namespace std;

long long a[maxn], b[maxn];

int main() {
    int cases = 1, n;
    while(scanf("%d", &n) != EOF) {
        for(int i = 0; i < n; i++)
            scanf("%lld", &a[i]);
        for(int i = 0; i < n; i++)
            scanf("%lld", &b[i]);
        sort(a, a + n);
        sort(b, b + n);
        long long ans = 0;
        for(int i = 0; i < n; i++)
            ans += a[i] * b[n - 1 - i];
        printf("Case #%d:\n%lld\n", cases++, ans);
    }
    return 0;
}

</pre>
</div>

##Problem G. The 3n + 1 problem##
###撰：朱吴帅###
好像这题挂了一堆TLE，因为询问可能比HDU多很多，然后可以思考预处理后用<code>线段树</code>保存预处理的值，然后询问时直接查[a,b]的最大值，询问是log(n)的复杂度,这样貌似就可以2S左右过~<br />
<code>另外还有其他做法，以后会更新</code>
<div>
<pre class="brush: cpp">
#include "cstdio"
#include "iostream"
#include "algorithm"
#include "climits"

using namespace std;

int cnt(long long n) {
    int ans = 1;
    while(n != 1) {
        if(n & 1)
            n = 3 * n + 1;
        else n >>= 1;
        ans++;
    }
    return ans;
}

int _max, qL, qR, v;
const int maxnode = 1000005 * 4;

int maxv[maxnode], addv[maxnode];

void maintain(int o, int L, int R) {
    int lc = o * 2, rc = o * 2 + 1;
    maxv[o] = 0;
    if(R > L) {
        maxv[o] = max(maxv[lc], maxv[rc]);
    }
    if(addv[o]) {
        maxv[o] += addv[o];
    }
}

void update(int o, int L, int R) {
    int lc = o * 2, rc = o * 2 + 1;
    if(qL <= L && qR >= R) {
        addv[o] += v;
    } else {
        int M = L + (R - L) / 2;
        if(qL <= M) update(lc, L, M);
        if(qR > M) update(rc, M + 1, R);
    }
    maintain(o, L, R);
}

void query(int o, int L, int R, int add) {
    if(qL <= L && qR >= R) {
        _max = max(_max, maxv[o] + add);
    } else {
        int M = L + (R - L) / 2;
        if(qL <= M) query(o * 2, L, M, add + addv[o]);
        if(qR > M) query(o * 2 + 1, M + 1, R, add + addv[o]);
    }
}
int main() {
    for(int i = 1; i < 1000000; ++i) {
        v = cnt(i);
        qL = i;
        qR = i;
        update(1, 1, 1000000);
    }
    int a, b, ans;
    while(scanf("%d%d", &a, &b) == 2) {
        _max = -1;
        qL = a;
        qR = b;
        query(1, 1, 1000000, 0);
        printf("%d %d %d\n", a, b, _max);
    }
    return 0;
}

</pre>
</div>
##Problem H. A Simply Problem##
###撰：朱吴帅###
题意大概是给一些数，有两种操作，一种是在[a,b] 区间内，对（i - a）% k == 0 的加C,另一种操作是询问某个位置的值。<br />
因为这题的k比较小(k<=10)，余数的情况也很少，因此我们可以开55棵<code>树状数组</code>，用tree[x][k][mod] 表示x 对k 取余为mod，这样在询问的时候只要循环到10就可以了.然后我们要明白一个推论：
> (i-a)%k==0 可以推出 a%k==i%k==mod.


然后通过插线问点的方式更新就行了（插线问点即树状数组想更新一个区间范围[a,b]可以先更新a加上C，这样b之后的也会加上C,所以再将b后面的加上-C即可）.<br />
赛前给内存大小时好像给小了，不小心卡了<code>线段树</code>...不是有意的.<br />
<div>
<pre class="brush: cpp">
#include "iostream"
#include "cmath"
#include "algorithm"
#include "cstdio"

using namespace std;

int v[50005], tree[50005][11][11], n;

int lowbit(int x) {
    return x & (-x);
}

void update(int x, int k, int mod, int add) {
    while(x <= n) {
        tree[x][k][mod] += add;
        x += lowbit(x);
    }
}

int getsum(int x) {
    int ans = 0;
    const int a = x;
    while(x > 0) {
        for(int i = 1; i <= 10; ++i) {
            ans += tree[x][i][a % i];
        }
        x -= lowbit(x);
    }
    return ans;
}

int main() {
    int q, op, a, b, c, k;
    while(scanf("%d", &n) == 1) {
        memset(tree, 0, sizeof(tree));
        for(int i = 1; i <= n; ++i)scanf("%d", v + i);
        scanf("%d", &q);
        while(q--) {
            scanf("%d", &op);
            if(op == 1) {
                scanf("%d%d%d%d", &a, &b, &k, &c);
                update(a, k, a % k, c);
                update(b + 1, k, a % k, -c);
            } else {
                scanf("%d", &a);
                printf("%d\n", getsum(a) + v[a]);
            }
        }
    }
    return 0;
}

</pre>
</div>

##Problem I. Silly DongGua##
###撰：段昊宇###
给出一个数 <code>N</code>，求解小于10^N素数个数<code>a</code>的位数是多少。<br />
这题目就是那种知道公式的一下子就能导出来，不知道的肯定不会做的那种。<br />
所以这题的解法，大家要自学下<code>素数定理</code>。<br />

###素数定理###
> 对正实数x，定义π(x)为素数计数函数，亦即不大于x的素数个数。数学家找到了一些函数来估计π(x)的增长。以下是第一个这样的估计。
<div align="center">
<img src="/public/ach_img/2015-4-21-1.png" title="prm_num_the">
</div>
> 其中ln x为x的自然对数。上式的意思是当x趋近∞，π(x)与x/ln x的比值趋近1。但这不表示它们的数值随着x增大而接近。


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