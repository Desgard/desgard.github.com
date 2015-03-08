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

###NYIST_2 括号配对问题###
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

###NYIST_5 Binary String Matching###
<code>STL</code> 水过，应该是 <code>KMP</code>，结果暴力过了。谴责测试数据。<br />
<div>
<pre class="brush: cpp">
#include "bits/stdc++.h"

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