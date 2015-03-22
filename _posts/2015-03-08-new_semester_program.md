---
layout: post
author: Desgard_Duan
title: 巨巨们带给我的压力
category: daily
tag: [life]
---
##立文为证##
JM 和 RUO 好努力！<br />
刷题开始，目标 NYIST 数据结构分类。 
[传送门](http://acm.nyist.net/JudgeOnline/problemset.php?typeid=4 )<br 
/>
![img](/public/ach_img/2015-3-8-1.png "DS") 
<!-- more -->

###<font color="red">NYIST_2</font> 括号配对问题###
<code>Stack</code> 的经典例题，唯一的陷阱就是注意栈空的情况。<br />
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"

stack&ltchar&gt S;
string str;

int main () {
    int T;
    cin >> T;
    while (T --){
        bool ok = 1;
        while (!S.empty()) {
            S.pop ();
        }
        cin >> str;
        for (int i = 0; i < str.size(); ++ i) {
            if (str[i] == '[' || str[i] == '(') {
                S.push (str[i]);
                continue;
            }
            if (str[i] == ']') {
                if (S.empty()) {ok = 0; break;}
                char x = S.top();
                S.pop();
                if (x != '[') {
                    ok = 0;
                    break;
                }
            }
            if (str[i]== ')') {
                if (S.empty()) {ok = 0; break;}
                char x = S.top();
                S.pop();
                if (x != '(') {
                    ok = 0;
                    break;
                }
            }
        }
        ok? puts ("Yes"): puts ("No");
    }
    return 0;
}

</pre>
</div>

###<font color="red">NYIST_5</font> Binary String Matching###
<code>STL</code> 水过，应该是 <code>KMP</code>，结果暴力过了。谴责测试数据。<br />
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"
using namespace std;
int main () {
    int T;
    cin >> T;
    while (T --) {
        string str1, str2;
        cin >> str1 >> str2;
        int ans = 0, pos = str2.find(str1, 0);
        while (pos != string :: npos) {
            ans ++;
            pos = str2.find (str1, pos + 1);
        }
        cout << ans << endl;
    }
    return 0;
}

</pre>
</div>

###<font color="red">NYIST_35</font> 表达式求值###
<code>Stack</code> 的经典应用，利用<code>dijkstra双栈</code>法是一个不错的选择。<br />
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"
using namespace std;

const int maxn = 1e3;
char stack[maxn + 2], out[2 * maxn];
double ans[maxn];
int id1, id2, id3;

char pop() {
    return stack[--id1];
}

void check(char ch) {
    char c;
    if(ch == ')') {
        while((c = pop()) != '(') out[id2++] = c;
    } else if(ch == '*' || ch == '/') {
        while(id1 && stack[id1 - 1] != '+' &&  
        	stack[id1 - 1] != '-' &&  stack[id1 - 1] != '(') {
            out[id2++] = pop();
        }
    } else if(ch == '+' || ch == '-') {
        while(id1 && stack[id1 - 1] != '(') {
            out[id2++] = pop();
        }
    }
}

void push(double a) {
    ans[id3++] = a;
}

int main() {
    char ch;
    int b, t, sign;
    double a;
    scanf("%d", &t);
    while(t--) {
        getchar();
        id1 = id2 = id3 = sign = 0;
        while((ch = getchar()) != '=') {
            if(ch >= '0' && ch <= '9' || ch == '.') {
                if(sign == 1) out[id2++] = ' ', sign = 0;
                out[id2++] = ch;
            } else if(ch == '(') {
                stack[id1++] = ch;
                sign = 1;
            } else if(ch == ')') {
                check(ch);
                sign = 1;
            } else {
                check(ch);
                stack[id1++] = ch;
                sign = 1;
            }
        }
        while(id1) out[id2++] = pop();
        for(int i = 0; i < id2; ++i) {
            if(out[i] == ' ') continue;
            if(out[i] >= '0' && out[i] <= '9' || out[i] == '.') {
                sscanf(out + i, "%lf%n", &a, &b);
                --i;
                i += b;
                push(a);
            } else if(out[i] == '+') {
                ans[id3 - 2] += ans[id3 - 1];
                --id3;
            } else if(out[i] == '-') {
                ans[id3 - 2] -= ans[id3 - 1];
                --id3;
            } else if(out[i] == '*') {
                ans[id3 - 2] *= ans[id3 - 1];
                --id3;
            } else if(out[i] == '/') {
                ans[id3 - 2] /= ans[id3 - 1];
                --id3;
            }
        }
        printf("%.2lf\n", ans[0]);
    }
    return 0;
}


</pre>
</div>

###<font color="red">NYIST_63</font> 小猴子下落###
用数组来模拟<code>满二叉树</code>效果还不错，数据量小，<code>模拟</code>即可。<br />
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"
using namespace std;
const int maxn = 1e7 + 100;
int bTree[maxn];

int main () {
    int D, n;
    while (~scanf ("%d %d", &D, &n), (D || n)) {
        memset (bTree, -1, sizeof (bTree));
        int len = pow (2, D) - 1;
        for (int i = 1; i <= len; ++ i) {
            bTree[i] = 0;
        }
        for (int i = 1; i <= n; ++ i) {
            int cur = 1;
            while (bTree[cur] != -1) {
                if (bTree[cur] == 0) {bTree[cur] = 1; cur = cur * 2;}
                if (bTree[cur] == 1) {bTree[cur] = 0; cur = cur * 2 + 1;}
            }
            if (i == n) cout << cur / 2 << endl;
        }
    }
    return 0;
}


</pre>
</div>

###<font color="red">NYIST_93</font> 汉诺塔（三）###
看题目还以为是什么神奇的<code>递归</code>，结果开3个栈<code>模拟</code>就 A 了，好水。<br />
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"
using namespace std;

stack&ltint&gt S[4];
int T, p, q, a, b;

int main () {
    cin >> T;
    while (T --) {
        for (int i = 1; i <= 3; ++ i) {
            while (!S[i].empty()) {
                S[i].pop();
            }
        }
        cin >> p >> q;
        for (int i = p; i >= 1; -- i) {
            S[1].push(i);
        }
        bool ok = 1;
        for (int index = 0; index < q; ++ index) {
            cin >> a >> b;
            if (S[a].empty()) {ok = 0; break;}
            int now = S[a].top();
            if (!S[b].empty() && S[b].top() < now) {ok = 0; break;}
            S[b].push(now);
            S[a].pop();
        }
        ok? puts("legal"): puts("illegal");
    }
    return 0;
}

</pre>
</div>

###<font color="red">NYIST_108</font> 士兵杀敌（一）###
一定要注意：<font color="red">只有一组测试数据</font>。所以在输入的时候，不能读到文件末尾，否则 TLE。<br />
简单的<code>前缀和</code>，降低复杂度至<code>O(1)</code>即可。<br />
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"
using namespace std;

const int maxn = 1e6 + 10;
int ss[maxn], s[maxn];
int main () {
    int n, m, a, b;
    scanf ("%d %d", &m, &n) ;
    memset (ss, 0, sizeof (ss));
    memset (s, 0, sizeof (s));
    for (int i = 1; i <= m; ++ i) {
    scanf ("%d", &ss[i]);
        s[i] = s[i - 1] + ss[i];
    }
    for (int i = 0; i < n; ++ i) {
    scanf ("%d %d", &a, &b);
        printf ("%d\n", s[b] - s[a - 1]);
    }

    return 0;
}

</pre>
</div>

###<font color="red">NYIST_116</font> 士兵杀敌（二）###
<code>线段树</code>单点更新，区间查询的基本操作。用<code>树状数组</code>也能很随意的搞出。<br />
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"

#define lson l, m, rt << 1
#define rson m + 1, r, rt << 1 | 1
using namespace std;

const int maxn = 1e6 + 100;
int sum[maxn << 2];

void push_up (int rt) {
    sum[rt] = sum[rt << 1] + sum[rt << 1 | 1];
}

void build (int l, int r, int rt) {
    if (l == r) {
        scanf ("%d", &sum[rt]);
        //get_val(sum[rt]);
        return ;
    }
    int m = (l + r) >> 1;
    build (lson);
    build (rson);
    push_up (rt);
}

int query (int L, int R, int l, int r, int rt) {
    if (L <= l && r <= R) {
        return sum[rt];
    }
    int m = (l + r) >> 1;
    int ret = 0;
    if (L <= m) ret += query (L, R, lson);
    if (m  < R) ret += query (L, R, rson);
    return ret;
}

void update (int p, int d, int l, int r, int rt) {
    if (l == r) {
        sum[rt] += d;
        return ;
    }
    int m = (l + r) >> 1;
    if (p <= m) update (p, d, lson);
    else update (p, d, rson);
    push_up (rt);
}

int ss[maxn], s[maxn];
char op[20];
int main () {
    int n, m, a, b;
    scanf ("%d %d", &n, &m);
    build (1, n, 1);
    for (int i = 0 ; i < m; ++ i) {
        scanf ("%s %d %d", op, &a, &b);
        if (op[0] == 'Q') {
            printf ("%d\n", query (a, b, 1, n, 1));
        } else {
            update (a, b, 1, n, 1);
        }
    }
    return 0;
}


</pre>
</div>

###<font color="red">NYIST_117</font> 求逆序数###
<code>线段树</code>怎么也过不了，<code>树状数组</code> + <code>离散化</code>却可以水过。还是感觉<code>线段树</code>
要比<code>树状数组</code>优美很多。<br />
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"
using namespace std;
const int maxn = 1000005;

struct node {
    int val, id;
} s[maxn];

int a[maxn], n;
int lowbit(int i) {
    return i & (-i);
}

void update(int i) {
    while(i <= n) {
        a[i]++;
        i += lowbit(i);
    }
}

int sum(int i) {
    int sum = 0;
    while(i > 0) {
        sum += a[i];
        i -= lowbit(i);
    }
    return sum;
}

bool cmp(node x, node y) {
    if(x.val != y.val)
        return x.val < y.val;
    return x.id < y.id;
}

int main() {
    int t, i;
    scanf("%d", &t);
    while(t--) {
        scanf("%d", &n);
        for(i = 1; i <= n; i++) {
            scanf("%d", &s[i].val);
            s[i].id = i; a[i] = 0;
        }
        long long ans = 0;
        sort(s + 1, s + n + 1, cmp);
        for(i = 1; i <= n; i++) {
            update(s[i].id);
            ans += i - sum(s[i].id);
        }
        printf("%lld\n", ans);
    }
    return 0;
}
</pre>
</div>

###<font color="red">NYIST_119</font> 士兵杀敌（三）###
裸<code>RMQ</code>运用，直接搞即可。<br />
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"
const int maxn = 1e5 + 500;
int Max[maxn][20], Min[maxn][20];
int n, nq, data, l, r;

void rmq (int num) {
    for (int j = 1; j < 20; ++ j) {
        for (int i = 1; i <= num; ++ i) {
            if (i + (1 << j) - 1 <= num) {
                Max[i][j] = max (Max[i][j - 1], 
                		Max[i + (1 << (j - 1))][j - 1]);
                Min[i][j] = min (Min[i][j - 1], 
                		Min[i + (1 << (j - 1))][j - 1]);
            }
        }
    }
}

int main () {
    while (~scanf ("%d %d", &n, &nq)) {
        for (int i = 1; i <= n; ++ i) {
            scanf ("%d", &data);
            Max[i][0] = Min[i][0] = data;
        }
        rmq (n);
        for (int i = 0; i < nq; ++ i) {
            scanf ("%d %d", &l, &r);
            int k = (int)(log(r - l + 1.0) / log (2.0));
            int Ma = max(Max[l][k], Max[r - (1 << k) + 1][k]);
            int Mi = min(Min[l][k], Min[r - (1 << k) + 1][k]);
            printf ("%d\n", Ma - Mi);
        }
    }
    return 0;
}
</pre>
</div>

###<font color="red">NYIST_123</font> 士兵杀敌（四）###
卡常数！卡常数！卡常数啊！又无奈的改版<code>树状数组</code>，喜欢<code>线代树</code>。在思考，是不是应该
学习下<code>zkw神树</code>了
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"
const int maxn = 1e6 + 100;
int M, a[maxn];

int lowbit(int i) {return i & (-i);}

void update (int i, int num) {
    while (i <= M) {
        a[i] += num;
        i += lowbit (i);
    }
}

int get_sum (int i) {
    int sum = 0;
    while (i > 0) {
        sum += a[i];
        i -= lowbit (i);
    }
    return sum;
}

int main () {
    int T, l, r, add;
    char op[20];
    scanf ("%d %d", &T, &M);
    for (int i = 0; i < T; ++ i) {
        scanf ("%s %d", op, &l);
        if (op[0] == 'A') {
            scanf ("%d %d", &r, &add);
            update (l, add);
            update (r + 1, -add);
        } else printf ("%d\n", get_sum(l));
    }
    return 0;
}

</pre>
</div>

###<font color="red">NYIST_128</font> 前缀式计算###
<code>栈</code>的基本题，水过。
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"
using namespace std;
char oneline[100010], op[105];
stack&ltdouble&gt Stack;

int main () {
    memset (oneline, 0, sizeof (0));
    while (gets (oneline)) {
        for (int i = strlen(oneline) - 1; i >= 0; -- i) {
            if (isdigit(oneline[i]) || oneline[i] == '.' ) {
                while (isdigit(oneline[i]) || oneline[i] == '.' ) {
                    i --;
                }
                double data = atof(oneline + i);
                Stack.push (data);
            } else if (!isdigit(oneline[i]) && oneline[i] != ' ') {
                double a, b;
                a = Stack.top(); Stack.pop();
                b = Stack.top(); Stack.pop();
                switch (oneline[i]) {
                    case '+': Stack.push(a + b); break;
                    case '-': Stack.push(a - b); break;
                    case '*': Stack.push(a * b); break;
                    case '/': Stack.push(a / b); break;
                }
            }
        }
        printf ("%.2lf\n", Stack.top());
        while (!Stack.empty()) Stack.pop();
    }
    return 0;
}
</pre>
</div>

###<font color="red">NYIST_129</font> 树的判定###
以前在POJ上做过的一道<code>并查集</code>基本题。开始做的时候还是有一些难度的。其中有两个地方需要注意：<br>
<li>树的基本性质：结点数 = 边数 + 1。</li>
<li>树上不会出现一个结点有两个入度。也就是，一个子结点不能拥有两个父亲结点。</li>
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"
using namespace std;

const int maxn = 10005;
int father[maxn], edge[maxn];
bool vis[maxn], flag;
int sum = 0;

int get_father (int x) {
    while (father[x] != x)  x = father[x];
    return x;
}

void _union (int p, int q) {
    int x = get_father (p);
    int y = get_father (q);
    if (x != y) {
        father[y] = x;
        sum += 1;
    } else flag = 0;
}

int main () {
    int x, y, cur = 0;
    while (~scanf ("%d %d", &x, &y)) {
        if (x < 0 && y < 0) break;
        if (x == 0 && y == 0) {
            printf("Case %d is a tree.\n", ++ cur);
            continue;
        }
        flag = 1;
        memset (vis, 0, sizeof (vis));
        memset (edge,0, sizeof (edge));
        for (int i = 0; i < maxn; ++ i) {
            father[i] = i;
        }
        vis[x] = vis[y] = 1;
        _union (x, y);
        edge[y] ++;
        while (~scanf ("%d %d", &x, &y)) {
            if (x + y == 0) break;
            vis[x] = vis[y] = 1;
            _union (x, y);
            edge[y] ++;
        }
        sort (edge, edge + maxn, greater&ltint&gt());
        if (edge[0] > 1) {flag = 0;}
        int p = 0;
        for (int i = 1; i < maxn && flag; ++ i) {
            if (vis[i] && father[i] == i) {
                p += 1;
                if (p > 1) {flag = 0; break;}
            }
        }
        flag? printf ("Case %d is a tree.\n", ++ cur):
              printf ("Case %d is not a tree.\n", ++ cur);
    }
    return 0;
}

</pre>
</div>

###<font color="red">NYIST_130</font> 相同的雪花###
挺好玩的一题，用一个类似<code>Hash</code>的数据结构能存储，<code>key</code>值
设置为数组和。之后就是将数组进行12次的移位变化，去匹配待搜索串，这里使用通过数组模拟<code>约瑟夫问题</code>
的思想进行求模比对即可。另外的，可以使用<code>循环链表</code>但是代码过于冗长。推荐<code>数组模拟 + Hash</code>查询这种
做法。
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"
using namespace std;
const int maxn = 1e6 + 1005;
int n, T, snow[maxn][6];
map&ltint, vector&ltint&gt &gt Hash;

bool cmp (int x[6], int y[6]) {
    bool vis = 0;
    for (int add = 0; add < 6; ++ add) {
        vis = 1;
        for (int i = 0; i < 6; ++ i) {
            if (x[(add + i) % 6] != y[i]) {
                vis = 0;
            }
        }
        if (vis) return true;
    }
    reverse (x, x + 6);
    for (int add = 0; add < 6; ++ add) {
        vis = 1;
        for (int i = 0; i < 6; ++ i) {
            if (x[(add + i) % 6] != y[i]) {
                vis = 0;
            }
        }
        if (vis) return true;
    }
    return false;
}

int main () {
    scanf ("%d", &T);
    while (T --) {
        Hash.clear();
        bool ok = 0;
        scanf ("%d", &n);
        for (int index = 0; index < n; ++ index) {
            for (int i = 0; i < 6; ++ i) {
                scanf ("%d", &snow[index][i]);
            }
            int cur = accumulate (snow[index], snow[index] + 6, 0);
            if (Hash[cur].size() && !ok) {
                for (int i = 0; i < Hash[cur].size(); ++ i) {
                    if (cmp(snow[Hash[cur][i]], snow[index])) {
                        ok = 1; break;
                    }
                }
            }
            Hash[cur].push_back (index);
        }
        ok? puts ("Twin snowflakes found."):
            puts ("No two snowflakes are alike.");
    }
    return 0;
}
</pre>
</div>

###<font color="red">NYIST_136</font> 等式###
手写的<code>Hash</code>，开小了会TLE，开大了会MLE，果然还是不行。用了RUO酱的<code>Hash</code>感觉自己萌萌的，
一口气A掉了不费劲。</br>
思路就是将等式拆分成两边去枚举，将<code>O(n^5)</code>的问题，使用<code>O(n^2 + n^3)</code>进行转换。缩短时间。
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"
using namespace std;
const int MAX = 100003;
const int MAXSUM = 12500000;
int Hash[1003];

void g() {
    for(int i = -50; i <= 50; i++) {
        Hash[i + 50] = i * i * i;
    }
}

template &ltclass T&gt
class hash {
private:
    int pos;
    int next[MAX];
    int head[MAX];
    int key[MAX];
    int cnt[MAX];
public:
    long long count;
    void search(const int x);
    bool search1(const int x);
    void push(const int x);
    void clear();

};

template &ltclass T&gt
inline bool hash&ltT&gt::search1(const int x) {
    int temp = abs(x) % MAX;
    int t = head[temp];
    while(t != -1) {
        if (x == key[t]) {
            cnt[t]++;
            return true;
        }
        t = next[t];
    }
    return false;
}

template &ltclass T&gt
inline void hash&ltT&gt::search(const int x) {
    int temp = abs(x) % MAX;
    int t = head[temp];
    while(t != -1) {
        if (x == -key[t]) {
            count += cnt[t];
        }
        t = next[t];
    }
}
template &ltclass T&gt
inline void hash&ltT&gt::push(const int x) {
    if(search1(x)) return;
    int temp = abs(x) % MAX;

    if (head[temp] != -1) {
        next[pos] = head[temp];
    }
    head[temp] = pos;
    key[pos] = x;
    cnt[pos] = 1;
    pos++;
}
template &ltclass T&gt
void hash&ltT&gt::clear() {
    count = 0;
    pos = 0;
    memset(next, -1, sizeof(next));
    memset(head, -1, sizeof(head));
    memset(cnt, 0, sizeof(cnt));
}
hash&ltint&gt h;

int main() {
    int T;
    scanf("%d", &T);
    memset(Hash, 0, sizeof(Hash));
    g();
    while(T--) {
        h.clear();
        int a1, a2, a3, a4, a5;
        int i, j, k;
        int n;
        scanf("%d %d %d %d %d", &a1, &a2, &a3, &a4, &a5);
        for(i = -50; i <= 50; ++ i) {
            if (i == 0) continue;
            for(j = -50; i != 0 && j <= 50; j++) {
                if(j == 0) continue;
                n = a1 * Hash[i + 50] + a2 * Hash[j + 50];
                h.push(n);
            }
        }

        for(i = -50; i <= 50; ++ i) {
            if (i == 0) continue;
            for(j = -50; i != 0 && j <= 50; ++ j) {
                if (j == 0) continue;
                for(k = -50; j != 0 && k <= 50; ++ k) {
                    if(k == 0) continue;
                    n = a3 * Hash[i + 50] + a4 * Hash[j + 50] 
                      + a5 * Hash[k + 50];
                    if(n > MAXSUM || n < -MAXSUM)
                        continue;
                    h.search(n);
                }
            }
        }
        printf("%lld\n", h.count);
    }

    return 0;
}
</pre>
</div>

###<font color="red">NYIST_138</font> 找球号(二）###
由于RUO给的<code>Hash</code>模版跪了，所以就模仿网上的方法，写了个静态<code>Hash</code>。
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"
using namespace std;

const int maxn = 1e6 + 100;
const int MOD = 100007;
int key[maxn], o[maxn], next[maxn];
int n, T, num, cnt = 0;

int main () {
    char op[10];
    memset (o, -1, sizeof (o));
    scanf ("%d", &T);
    while (T --) {
        scanf ("%s %d", op, &n);
        if (op[0] == 'A') {
            for (int i = 0; i < n; ++ i) {
                scanf ("%d", &num);
                int index = num % MOD;
                key[cnt] = num;
                next[cnt] = o[index];
                o[index] = cnt;
                cnt ++;
            }
        }
        if (op[0] == 'Q') {
            for (int i = 0; i < n; ++ i) {
                scanf ("%d", &num);
                int tmp = num % MOD, j;
                for (j = o[tmp]; j != -1; j = next[j]) {
                    if (key[j] == num) break;
                }
                puts (j + 1? "YES": "NO");
            }
        }
    }
    return 0;
}
</pre>
</div>

###<font color="red">NYIST_202</font> 红黑树###
直接跑一遍二叉树的<code>中序遍历</code>即可，不用去管旋转操作。
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"
using namespace std;
struct Node {
    int ls, rs;
} tree[20];

void search_mid (int r) {
    if (r == -1) return ;
    search_mid (tree[r].ls);
    printf ("%d\n", r);
    search_mid (tree[r].rs);
}

int main () {
    int T, a, b, c, n;
    scanf ("%d", &T);
    while (T --) {
        memset (tree, -1, sizeof (tree));
        scanf ("%d", &n);
        for (int i = 0; i < n; ++ i) {
            scanf ("%d %d %d", &a, &b, &c);
            tree[a].ls = b;
            tree[a].rs = c;
        }
        scanf ("%d", &n);
        for (int i = 0; i < n; ++ i) {
            scanf ("%d %d", &a, &b);
        }
        search_mid(0);
        puts ("");
    }
    return 0;
}
</pre>
</div>