---
layout: post
author: Desgard_Duan
title: Markdown Engine Update
category: learning
tag: [git]
---

在**2016-03-01**博客更新时，我收到了github给我发送的**warning**邮件。

~~~ruby
The page build completed successfully, but returned the following warning:

You are currently using the 'rdiscount' Markdown engine, which will not be supported on GitHub Pages after May 1st. At that time, your site will use 'kramdown' for markdown rendering instead. To suppress this warning, remove the 'markdown' setting in your site's '_config.yml' file and confirm your site renders as expected. For more information, see https://help.github.com/articles/updating-your-markdown-processor-to-kramdown.

GitHub Pages was recently upgraded to Jekyll 3.0. It may help to confirm you're using the correct dependencies:

  https://github.com/blog/2100-github-pages-now-faster-and-simpler-with-jekyll-3-0

For information on troubleshooting Jekyll see:

  https://help.github.com/articles/troubleshooting-jekyll-builds

If you have any questions you can contact us by replying to this email.
~~~

<!-- more -->

在万般无奈之下，只好将`Markdown`引擎更换至`kramdown`。并以此篇博文记录`kramdown`知识站点。

- [kramdown官方网站](http://kramdown.gettalong.org/)
- [kramdown简明文档](http://kramdown.gettalong.org/quickref.html)
- [jekyll kramdown 语法高亮配置](http://noyobo.com/2014/10/19/jekyll-kramdown-highlight.html)
- [kramdown语法文档翻译](http://pikipity.github.io/blog/kramdown-syntax-chinese-1.html)
- [ToC简明教程](https://ruby-china.org/topics/17028)
- [kramdown Options](http://kramdown.gettalong.org/options.html)
- [kramdown LaTeX Converter](http://kramdown.gettalong.org/converter/latex.html)
- [kramdown Math Engine MathJax](http://kramdown.gettalong.org/math_engine/mathjax.html)

---

此致纪念我逝去的`rdiscount`。