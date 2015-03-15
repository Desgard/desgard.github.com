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