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
[传送门](http://acm.nyist.net/JudgeOnline/problemset.php?typeid=4 )<br />
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