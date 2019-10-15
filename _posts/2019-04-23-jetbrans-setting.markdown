---
layout:     post
title:      "常用IDE的配置"
subtitle:   "PyCharm、CLion设置和使用"
date:       2019-04-23 10:00:00
author:     "Tian"
categories: Skill
header-img: "img/post-bg-jetbrans.jpg"
header-mask: 0.5
catalog: true
tags:
    - 环境配置
    - 工具
---

我主要的开发语言是python和C++，一般写代码用的工具是Jetbrains家的PyCharm和CLion。这两个IDE快捷键和操作技巧都相似，这篇博客我用PyCharm作为例子，介绍下使用这些工具常用的一些技巧。

## [Install](<https://www.jetbrains.com/help/pycharm/installation-guide.html?section=Linux#toolbox>)

有三种方式可以安装：

1. [Toolbox App](<https://www.jetbrains.com/toolbox/app/>)
2. Standalone installation
3. Install as a snap package

推荐第一种，可以统一管理所有JetBrains家的软件。

## Settings

1. 关闭碍眼的波浪线

   右下角的人头按钮，选择`Syntax`级别的即可。

2. 文件头注释

   `Setting -> Editor -> File and Code Templates -> Python Script`

   ```bash
   #!/usr/bin/env python3
   # -*- coding: utf-8 -*-
   # @File  : ${NAME}.py
   # @Author: ${USER}
   # @Date  : ${DATE}
   ```

3. 开启内存指示器

   Setting -> Appearance & Behavior -> Appearance -> Window Options -> Display memory indicator

   开启后右下角有内存占用指示。

4. 鼠标滚轮调整编辑器字体大小

   Setting -> Editor -> General -> Mouse -> Change font size (Zoom) with Ctrl + Mouse Wheel

   开启后`Ctrl+鼠标滚轮`可以调节编辑器字体大小。

5. 字体样式及其他

   - IDE样式：Setting -> Appearance & Behavior -> Appearance -> UI Options -> Theme

     推荐`Darcula`

   - 字体：Setting -> Editor -> Font

     字体推荐`DejaVu Sans Mono`

   - 编辑器样式：Setting -> Editor -> Color Scheme -> Scheme

     推荐`Darcula`或者`Monokai`

   其他设置选项可以看看[官方文档](<https://www.jetbrains.com/help/pycharm/settings-preferences-dialog.html>)

6. 自动导入模块

   Setting -> Editor -> Auto import -> Python -> Show import popup

   或者右下角人头`Import popup`
   
7. 设置同步

   Setting -> IDE Setting Sync

   需要JetBrains账号，同步设置到服务器上。
   
8. 插件

   - .ignore：生成.gitignore文件
   - Key promoter X：提示快捷键
   - Git Commit Template：git commit message规范
   - Statistic：代码统计
   - Translation：翻译
   - Rainbow Brackets：括号着色

 

## Usage

1. 代码模板

   `Ctrl+J`：开启代码模板，有许多预设的模板，比如main、for循环等。

2. 格式化代码

   `Ctrl+Alt+L`：将代码格式化成`PEP8`python编码规范的代码，简单好用。

3. 误删文件找回

   项目目录右键 -> Local History -> Show History -> Revert

4. 用书签快速定位

   `Ctrl+Shift+n`：打上书签，标记为n

   `Ctrl+n`：跳转到标记为n的书签

   `Shift+F11`：查看书签列表

5. console命令行调试

   Debug栏 -> Python Shell按钮

   可以获取程序运行中所有的变量的值，也可以重新赋值。

6. Import 优化

   `Ctrl+Alt+O`：自动删除冗余的import语句

7. Surround With代码

   `Ctrl+Alt+T`：选择包围代码的语句

8. 折叠代码

   `Ctrl+-/=`：折叠/打开代码

   `Ctrl+Shift+-/=`：折叠/打开所有代码

9. 另起一行

   `Shift+Enter`：向下另起一行

   `Ctrl+Shift+Enter`：向上另起一行

10. 搜索

    双击`Shift`搜索一切

11. 导航

    `Alt+Left/Right`：标签页左右切换

    `Alt+Up/Down`：光标在方法间上下切换

    `Ctrl+Lef/Right`：单词级别的移动

    `Ctrl+Shift+Left/Right`：单词级别的移动带选择

12. 多光标

    `Ctrl+Shift+Alt+鼠标左键`：多光标编辑

    `Alt+Shift+Insert`：列选模式，或者右键 -> Column Selection Mode

13. 提示

    1. 拼写提示：

       `Ctrl+Space`启动拼写提示，包括点号之后的成员提示。

       使用提示：

       `Enter`：提示添加到当前光标位置

       `Tab`：提示替换掉光标右边的字符串

    2. 参数提示

       `Ctrl+P`：提示参数信息

    3. 智能提示

       `Alt+Enter`：相当于点击右边的小灯泡，可以按照提示导入模块、插入docString等

## 参考

- [最全Pycharm教程](<https://blog.csdn.net/u013088062/article/details/50388329>)
- [受用一生的高效PyCharm使用技巧](https://mp.weixin.qq.com/s?__biz=MzI0ODcxODk5OA==&mid=2247503862&idx=6&sn=7c96a01a956de53f9e743ed291dd18a8&chksm=e99efc0fdee97519db74be861eb0b428dc5e1ebd8962d157cc706bb36c20524d278d0aebc208&mpshare=1&scene=1&srcid=#rd)
- [受用一生的高效PyCharm使用技巧（二）](https://mp.weixin.qq.com/s?__biz=MzI0ODcxODk5OA==&mid=2247504394&idx=3&sn=504b2e440d5bb7ca7525f70542f886d6&chksm=e99ee1f3dee968e59c08f47bfd90b5c2d6ccc91ee9dd1c18b2e1c097bf4bb40dc5e38b662707&mpshare=1&scene=1&srcid=#rd)
- [你有哪些想要分享的 PyCharm 使用技巧？](<https://www.zhihu.com/question/37787004>)
- [IntelliJ IDEA 简体中文专题教程](<https://github.com/judasn/IntelliJ-IDEA-Tutorial>)
