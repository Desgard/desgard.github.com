---
layout: post
author: Desgard_Duan
title: SWJTU ACM校队选拔赛 Section Ⅰ 题解
category: learning
tag: [ACM]
---
其实我觉得题目难度还算一般，毕竟自己水平也是凑凑合合，很难很难的题目也出不来。<br />
下面是这场比赛的题解，大家可以看懂思路，然后自己去拍一版代码，这里也会给出数据的标程。<br />
<br />
 ![img](/public/ach_img/2015-3-28-1.jpg "ACM")
<!-- more -->
##题解列表##
###A.冬瓜与JM的绝世博弈 SWJTU2203###
就是一个简单的统计各个字符的个数进行比较，水题一个。注意的是字母对应要依照题目来，并不是简单的单词开头字母，告诉大家审题的重要。
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"
using namespace std;

char Maps[8][8];
int ans_W = 0, ans_B = 0;
map&ltchar, int&gt Hash;

void init () {
    Hash['q'] = Hash['Q'] = 9;
    Hash['r'] = Hash['R'] = 5;
    Hash['b'] = Hash['B'] = 3;
    Hash['n'] = Hash['N'] = 3;
    Hash['p'] = Hash['P'] = 1;
}

int main () {
    data();
    init ();
    while (cin >> Maps[0][0]) {
        ans_W = ans_B = 0;
        for (int i = 0; i < 8; ++ i) {
            for (int j = 0; j < 8; ++ j) {
                if (i != 0 || j != 0) cin >> Maps[i][j];
                if (Maps[i][j] >= 'a' && Maps[i][j] <= 'z') {
                    ans_B += Hash[Maps[i][j]];
                }
                if (Maps[i][j] >= 'A' && Maps[i][j] <= 'Z') {
                    ans_W += Hash[Maps[i][j]];
                }
            }
        }
        if (ans_W == ans_B) {
            puts ("Draw");
            continue;
        }
        ans_W > ans_B ? puts("White") : puts("Black");
    }
    return 0;
}
</pre>
</div>
###B."RUO"型查错机 SWJTU2204###
考验的是大家编写代码的能力。这里我们使用下标对待更换的字母和目标字母进行记录，而数组存值为当前字母下标。例如：<br />
我们用一个数组<code>vis[x][y] = index</code>进行标记，<code>x</code>为待更换的字母，<code>y</code>为目标更换字母，<code>index</code>为当前字母位置。然后，我们对两个
字符串进行扫描，将所有情况记录到vis数组中。<br />
经过我们对该题目的分析，我们知道仅存在三种情况：一.没有可以匹配的字母；二.交换后成功匹配数加一；三.交换后成功匹配数加二。<br />
有了如上分析，我们只有对处理串进行两次次遍历。第一次：若出现<code>vis[x][y] != 0 && vis[y][x] != 0</code>则为情况三。如果出现<code>vis[x][z] != 0 && vis[z][y] != 0</code>
则为情况二。<br />
如此，解决此题。
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"
using namespace std;
string s1, s2;
int vis[30][30], len, cnt = 0;

int main () {
    while (cin >> len >> s1 >> s2) {
        bool ok = 0;
        cnt = 0;
        memset (vis, 0, sizeof (vis));
        for (int i = 0; i < len; ++ i) {
            if (s1[i] != s2[i]) {
                cnt ++;
                vis[s1[i] - 'a'][s2[i] - 'a'] = i + 1;
            }
        }
        for (int i = 0; i < 26; ++ i) {
            for (int j = 0; j < 26; ++ j) {
                if (i == j) continue;
                if (vis[i][j] && vis[j][i]) {
                    printf ("%d\n", cnt - 2);
                    printf ("%d %d\n", vis[i][j], vis[j][i]);
                    goto END;
                }
            }
        }
        for (int i = 0; i < 26; ++ i) {
            for (int j = 0; j < 26; ++ j) {
                if (i != j && vis[i][j] != 0) {
                    for (int k = 0; k < 26; ++ k) {
                        if (j != k && vis[j][k] != 0) {
                            printf ("%d\n", cnt - 1);
                            printf ("%d %d\n", vis[i][j], vis[j][k]);
                            goto END;
                        }
                    }
                }
            }
        }
        printf ("%d\n", cnt);
        puts("-1 -1");
        END:;
    }
    return 0;
}

</pre>
</div>
###C.冬瓜交大一日游 SWJTU2205###
这道题类型为<code>枚举</code>，具体的求解方法给个题目原址题解：[UESTC576](http://www.desgard.com/learning/2015/03/25/UESTC_567/)。
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"
using namespace std;

const int maxn = 1005;
int T, n, edge[maxn << 1], temp, Ca = 1;
long long res, sum;

int main () {
    int x = 4;
    scanf ("%d", &T);
    while (T --) {
        scanf ("%d", &n);
        sum = 0;
        for (int i = 1; i <= n; ++ i) {
            scanf ("%d", &edge[i]);
            edge[i + n] = edge[i];
            sum += edge[i];
        }
        printf ("Case #%d:", Ca ++);
        edge[0] = edge[n];
        edge[n * 2 + 1] = edge[1];
        for (int i = 1; i <= n; ++ i) {
            long long ans = sum - edge[i] < sum - edge[i - 1]?
                      sum - edge[i]: sum - edge[i - 1];
            long long temp = 0;
            for (int c = 0; c < n - 2; ++ c) {
                temp += edge[i + c];
                ans = min (ans, temp + sum - edge[i + c + 1]);
            }
            temp = 0;
            for (int c = 1; c < n - 1; ++ c) {
                int j = i - c;
                if (j <= 0) j += n;
                temp += edge[j];
                ans = min (ans, temp + sum - edge[j - 1]);
            }
            printf (" %lld", ans);
        }
        puts("");
    }
    return 0;
}
</pre>
</div>

###D.冬瓜查字典 SWJTU2210###
一道<code>字典树</code>的简单应用，由于仅有三个字母，所以每一层直接枚举所有情况遍历即可，复杂度<code>O(n * h)</code>。<br />
推荐大家使用这种<code>递归</code>写法实现线段树，显得清晰明了。而且代码很短。
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"
using namespace std;

const int maxn = 6e5 + 20;
const int sigma_size = 3;

struct Node {
    int cnt;
    bool isEnd;
    Node *next[sigma_size];
} trie[maxn];

typedef Node Trie;
int cnt_node = 0;

void insert_Trie (char *str, Trie *root) {
    root -> cnt ++;
    if (str[0] == 0) {
        root -> isEnd = 1;
        return ;
    }
    if (root -> next[str[0] - 'a'] == 0) {
        cnt_node ++;
        root -> next[str[0] - 'a'] = trie + cnt_node;
        root -> isEnd = 0;
    }
    insert_Trie (str + 1, root -> next[str[0] - 'a']);
}

bool query_Trie (char *str, Trie *root, bool isChange) {
    if (str[0]) {
        int index = str[0] - 'a';
        if (root -> next[index] != 0) {
            if (query_Trie (str + 1, root -> next[index], isChange)) {
                return true;
            }
        }
        if (isChange == 0) {
            for (int i = 0; i < sigma_size; ++ i) {
                if (i == index || root -> next[i] == 0) continue;
                if (query_Trie (str + 1, root -> next[i], true)) {
                    return true;
                }
            }
        }
    } else {
        if (isChange && root -> isEnd) return true;
    }
    return false;
}


char text[maxn];

int main () {
    int n, m;
    memset (trie, 0, sizeof (trie));
    scanf ("%d %d", &n, &m);
    for (int i = 0; i < n; ++ i) {
        scanf ("%s", &text);
        insert_Trie (text, trie);
    }
    for (int i = 0; i < m; ++ i) {
        scanf ("%s", &text);
        if (query_Trie (text, trie, 0)) {
            puts ("YES");
        } else {
            puts ("NO");
        }
    }
    return 0;
}
</pre>
</div>

###E.冬瓜的计算器 SWJTU2211###
一道<code>数据结构</code>的入门题，采用<code>dijkstra双栈法</code>能是代码大大简化。<br />
我们可以开两个栈（数字栈、操作符栈）。每次检测到一个元素的时候，如果是数字，先检测操作符栈最上方符号，如果是乘、除，将数字栈<em>pop</em>，
运算结果<em>push</em>；如果是操作符，只要 不是<code>)</code>，直接push，当<code>)</code>的时候，<em>pop</em>操作符栈，找到最近的一个<code>(</code>，将其中所有操作符与数字栈对应元素
进行运算，最后将<code>(</code> <em>pop</em> 即可。<br />
以下放代码：
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
