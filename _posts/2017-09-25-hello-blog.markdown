---
layout:     post
title:      "Welcome to WenShan Blog"
subtitle:   " \"Hello World, Hello Blog\""
date:       2017-09-24 10:57:00
author:     "Tian"
categories: Life
header-img: "img/post-bg-2015.jpg"
catalog: true
tags:
    - 生活
---

> “Let's do it. ”


## 前言

很久之前就想搭建一个自己的博客，一直没有动手。

趁着周末，花了大半天的时间，**Wenshan Blog** 开通了。

## 正文

#### 方案选择

对比了比较流行的 *WordPress* 和 *Github Pages*，最终选择了 [GitHub Pages](https://pages.github.com/) + [Jekyll](http://jekyllrb.com/) 的方案。

在阮一峰前辈的[「搭建一个免费的，无限流量的 Blog — Github Pages 和 Jekyll 入门」](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html) 一文中说：

> …
>
> 整个思路到这里就很明显了。你先在本地编写符合 Jekyll 规范的网站源码，然后上传到 GitHub，由 GitHub 生成并托管整个网站。
>
> 这种做法的好处是：
> * 免费，无限流量。
> * 享受 Git 的版本管理功能，不用担心文章遗失。
> * 你只要用自己喜欢的编辑器写文章就可以了，其他事情一概不用操心，都由 GitHub 处理。
>
> 它的缺点是：
> * 有一定技术门槛，你必须要懂一点 Git 和网页开发。
> * 它生成的是静态网页，添加动态功能必须使用外部服务，比如评论功能就只能用 Disqus。 
> * 它不适合大型网站，因为没有用到数据库，每运行一次都必须遍历全部的文本文件，网站越大，生成时间越长。
>
> …

对于我来说，最大的优点是

* 免费，无限流量
* 用熟悉的 Git 管理，不用担心文章遗失
* Markdown 编辑方便优雅，利于迁移

#### 技术实现

搭建的详细过程暂且不表，网上的教程浩如烟海，我也是学习前辈们的教程搭建的，在这里就不拾人牙慧了。

如果使用别人开源的源码，一切顺利的话，可以在半个小时内把架子搭建完成。

我主要 fork 了 [*Hux*](https://github.com/Huxpro/huxpro.github.io) 和 [*qiubaiying*](https://github.com/qiubaiying/qiubaiying.github.io) 的 Repository，他们都写了详尽的搭建步骤，如果有兴趣可以去为他们的项目 Star 一下。

博客的样式就和你现在看到的差不多，但是我习惯以时间为博文分类。以 Tag 分类的方法，当 Tag 多的时候博客会看上去乱乱的。

Thanks to [*BruceZhaoR*](https://github.com/BruceZhaoR/brucezhaor.github.io)，在他的 Repository 里，我找到了增加 **Archives** 的方法。

新建 [*archives.html*](https://github.com/tianws/tianws.github.io/blob/master/archives.xml) ，然后修改 index.html 即可。

我短暂的两个月的前端生涯，也算是帮助我能稍微改改大神的代码，不然我真的对前端代码一窍不通。

这也更加告诉我要 **stay curious**，多接触不同的技术，你不知道什么时候会用得上。: )

周末做的就这些了，填了一些个人信息，选了几个好看的背景。功能还不是很多，但也够用了，以后有时间再慢慢改吧。

域名就先不买了，这个博客主要还是写给自己看的，等自己成为大牛，再买个好域名推广一下，嘿嘿。

#### 计划

这个博客主要写原创内容，感想类居多。

技术笔记就主要用 Evernote 了，比博客方便多了。如果有原创的笔记也会复制到博客上记录一下。

## 后记

正式拥抱开源世界应该是从去年把 Linux 作为工作环境开始的，这一年多以来，大到开发框架 -- [OpenCV](http://opencv.org/)、[Caffe](http://caffe.berkeleyvision.org/)、[Tensorflow](https://www.tensorflow.org/)，小到编辑器与编辑器配置 -- [vim](https://vim.sourceforge.io/)、[vim-bootstrap](http://www.vim-bootstrap.com/)，甚至我的 [操作系统](http://cn.ubuntu.com/) 本身，几乎都是免费开源的软件。

开源软件给了我们免费、安全、灵活的使用体验，同时我们将代码开源后，又会有世界各地的人帮我们测试、改进，贡献自己的智慧和力量。

全世界智慧而又无私奉献的人一起构建了这个神奇的世界。（可以看看这篇[「如何成为一名黑客」](https://dayone.me/2iX7zHp)，Cool Hacker ! ）

这篇博客搭建参考了 [*Hux*](https://github.com/Huxpro/huxpro.github.io)、[*qiubaiying*](https://github.com/qiubaiying/qiubaiying.github.io) 和 [*BruceZhaoR*](https://github.com/BruceZhaoR/brucezhaor.github.io) 的 Repository，如果你对我的 [Repository](https://github.com/tianws/tianws.github.io) 感兴趣，也可以直接 fork，如果你能将作者保留在底部，或者给我的项目 Star 一下，我将非常感谢你。

感谢开源世界，感谢各路大神。

<p align="right">—— Tian 写于 2017.09.24，北京</p>
##  UPDATE

---

*更换 livere 评论系统，国内用户可正常访问。*

<p align="right">—— 2017.10.29，北京</p>
---

*增加了外链视频和外链音乐的功能，增加了 video.html，修改了 post.html。视频自适应页面大小，移动端 PC 端都支持。*

<p align="right">—— 2017.12.17，北京</p>
---

*增加播放本地视频的功能，整理了代码。*

<p align="right">—— 2019.01.23，北京</p>
---

*增加 Simple-Jekyll-Search 文章搜索功能。*

<p align="right">—— 2020.11.25，北京</p>
---

*增加「作品集」页面。*

<p align="right">—— 2025.08.13，北京</p>
---

*使用 npm scripts 替代 Grunt 构建系统，更新项目维护文档。*

<p align="right">—— 2025.08.15，北京</p>
---

*添加了 `sitemap.xml` 与 `robots.txt` 以改善搜索引擎优化（SEO）。*

<p align="right">—— 2025.08.15，北京</p>
---

*建立标准化图片处理流程，自动压缩图片并生成 WebP 版本；全站启用 WebP 优化，提升网站加载性能。*

<p align="right">—— 2025.08.21，北京</p>