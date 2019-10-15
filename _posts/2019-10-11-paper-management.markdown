---
layout:     post
title:      "文献管理"
subtitle:   "Zotero、Kami配置"
date:       2019-10-11 10:57:00
author:     "Tian"
categories: Skill
header-img: "img/post-bg-paper.jpg"
header-mask: 0.6
catalog: true
tags:
    - 环境配置
    - 工具
typora-root-url: ../
---

> 工欲善其事，必先利其器。

## 一、前言

因为工作需要，经常要阅读大量论文，所以积累了一堆论文pdf。但是如何管理这些论文，真是让人头秃。

我尝试过一些文献管理软件和管理策略，有的使用太繁琐，有的不能跨平台，有的同步有问题，最终在摸爬滚打中摸索出一套简单轻量的文献管理方法。

#### 我的需求：

1. 多平台支持，至少支持Windows、MacOS、Ubuntu
2. 跨平台同步
3. 使用简单，不需要费时间整理

## 二、配置

工具：

- Zotero
- PDF阅读器（选用Chrome拓展Kami）
- 同步盘（选用坚果云）

#### 1. Zotero

使用Zotero的原因：

- 免费开源
- 可用自己的同步盘同步
- 强大的第三方插件系统

最权威的学习资料是[官方文档](https://www.zotero.org/support/)，关于跨平台同步附件，有四种方法，具体见[链接](https://zhuanlan.zhihu.com/p/31453719)，本文采用ZotFile配合同步盘的方法，缺点是删除条目后需要手动删除附件，优点是将附件统一到同步盘管理，并有清晰的子文件夹。

个人配置步骤如下：

1. 官网注册下载安装登录

2. 编辑-> 首选项 -> 常规 -> 取消自动生成快照，避免抓取许多琐碎的网页文件

3. 编辑-> 首选项 -> 同步 -> 设置

   ![03](/img/in-post/2019-10-11-paper-management/03.png)

4. 安装ZotFile插件

   a. [下载](http://zotfile.com/index.html#changelog) zotfile-x.x.x-fx.xpi

   b. 工具-> 插件 -> 右上齿轮 -> Install Add-on From File，安装

   c. 配置同步

   ![01](/img/in-post/2019-10-11-paper-management/01.png)

   d. 配置rename规则：

   ![02](/img/in-post/2019-10-11-paper-management/02.png)

5. 安装**[zotero-scholar-citations](https://github.com/beloglazov/zotero-scholar-citations)**

   下载安装即可，[这篇博文解决在国内使用插件的网络问题](https://zhuanlan.zhihu.com/p/50789047)

6. 安装**[zotero-scihub](https://github.com/ethanwillis/zotero-scihub)**

   下载安装即可

7. （Optional）Linux版设置代理

   Zotero Linux版本质是一个bash脚本（安装方法见[官方文档](https://www.zotero.org/support/installation)），所以代理要在终端下设置才生效，设置方法：

   `vim .local/share/applications/zotero.desktop`

   ```bash
   # 第三行
   Exec=bash -c "$(dirname $(readlink -f %k))/zotero -url %U"
   # 改成
   Exec=proxychains4 bash -c "$(dirname $(readlink -f %k))/zotero -url %U"
   ```

   > 需要提前安装配置好proxychains，这里不再赘述

#### 2. Kami Chrome拓展

使用chrome看pdf，保证跨平台有一样的体验。

1. 安装Kami拓展，谷歌账户登录
2. 设置Kami拓展，允许访问文件网址
3. 系统设置默认Chrome打开PDF

## 三、使用

> 待更新

## 参考

- [Zotero 管理文献最佳实践：（1）安装与设置](https://blog.fangzhou.me/posts/20181220-zotero-tips-1/)
- [Zotero入门教程](https://github.com/redleafnew/Zotero_introduction/blob/master/zotero_intro.pdf)
- [阳志平的网志](https://www.yangzhiping.com/tech/zotero1.html)
- [Zotero 跨平台同步附件的实现](https://zhuanlan.zhihu.com/p/31453719)
- [Zotero文献管理加PDF管理（配合ZotFile插件）实现跨平台同步附件简单配置](https://zhuanlan.zhihu.com/p/36371026)
- [如何总结和整理学术文献？](https://www.zhihu.com/question/26901116/answer/39253382)
- [深入探究下Zotero是如何帮我们管理好文献的！](https://iseex.github.io/2019-01/zotero-refs-skills/)
