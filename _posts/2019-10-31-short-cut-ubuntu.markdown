---
layout:     post
title:      "Ubuntu 快捷键和鼠标全局手势配置"
subtitle:   "Unity Tweak Tool、Compiz Config Settings Manager、Easystroke"
date:       2019-10-31 10:00:00
author:     "Tian"
categories: Skill
header-img: "img/post-bg-ubuntu.jpg"
header-mask: 0.4
catalog: true
tags:
    - 环境配置
    - Linux
    - 工具
typora-root-url: ../
---

## 一、前言

Ubuntu 用了有几年了，积累了很多经验，在之前的博文[「Ubuntu 常用软件和设置」](https://wenshan.site/skill/2019/04/03/software-ubuntu/)中记录了常用的软件和遇到一些问题时的解决方法，这篇博文着重记录下 Ubuntu 的**快捷键**和**全局鼠标手势**的配置，用的熟练了可以大大提高工作效率，节约时间。

需求：

1. 快速将窗口在多显示屏间移动
2. 快速最大化、最小化、管理移动窗口
3. 快速打开、关闭常用软件

## 二、系统设置

Ubuntu 16.04 自带的设置里其实已经有丰富的快捷键了，我们只需要设置一下，就可以用的很顺手了。

**1、显示器设置**

{% include image.html src="/img/in-post/2019-10-31-short-cut-ubuntu/01.png" alt="01" %}

注意 `粘滞边缘` 关闭，鼠标穿过显示器时会流畅很多。

**2、键盘设置**

这里有丰富的快捷键，我的设置如下：

{% include image.html src="/img/in-post/2019-10-31-short-cut-ubuntu/02.png" alt="02" %}

仔细设置后，基本上窗口的放大缩小等快捷键就可以很顺手的使用了，我常用的快捷键有：

- 最大化窗口：`Ctrl+Super+上`
- 恢复窗口（再次执行会最小化）：`Ctrl+Super+下`
- 关闭窗口：`Ctrl+Q`
- 切换桌面：`Ctrl+Super+D`
- 打开终端：`Ctrl+Alt+T`
- 打开 home 文件夹：`Super+E`
- 锁定屏幕：`Super+L`
- 全屏截图：`PrtSc`
- 对选定窗口截图：`Alt+PrtSc`
- 选区截图：`Shift+PrtSc`

**3、终端设置**

终端也是常用的程序，它默认的新建标签页和关闭标签页和 Chrome 等常用的不同，我们可以通过编辑 -> 首选项 -> 快捷键来设置。

常用快捷键：

- 复制：`Shift+Ctrl+C`
- 粘贴：`Shift+Ctrl+V`
- 放大：`Ctrl++`
- 缩小：`Ctrl+-`

- 新建标签页：`Ctrl+T`
- 关闭标签页：`Ctrl+W`
- 切换到第 Num 个标签页：`Alt+Num`

## 三、Unity Tweak Tool设置

Unity Tweak Tool 是一个流行的 Unity 桌面定制工具。顾名思义，该工具只适用于 Unity 桌面，所以从 Ubuntu18.04 开始，默认桌面改为了 Gnome，就不能用了，应该也有其他的工具可以代替。

我为了一些软件的稳定，目前还用的 16.04，这里记录下 Unity Tweak Tool 关于快捷键的设置。

{% include image.html src="/img/in-post/2019-10-31-short-cut-ubuntu/03.png" alt="03" %}

这里的常用快捷键是窗口平铺：`Super+W`

{% include image.html src="/img/in-post/2019-10-31-short-cut-ubuntu/04.png" alt="04" %}

这里的窗口吸附也可以设置成需要的，管理窗口也很好用。

这个软件还有很多其他的配置，这里不赘述了。

## 四、多显示器切换

我有两台显示器，我经常有这样的需求，要把窗口从这台显示器移动到另外一台。

Windows 10 自带了多显示器切换快捷键 `Shift+Super+方向键`，但是 Ubuntu 没有。

经过查找，在 [这篇问答](https://askubuntu.com/questions/141752/keyboard-shortcut-to-move-windows-between-monitors) 中找到了答案。

需要通过 Compiz Config Settings Manager 这个软件来实现：

1. 安装 Compiz Config Settings Manager：

   `sudo apt-get install compizconfig-settings-manager compiz-plugins-extra`

2. 运行（可以在 Dash 中搜索 Compiz）

3. 窗口管理 -> 勾选 Put -> 设置 Put：设置快捷键

   {% include image.html src="/img/in-post/2019-10-31-short-cut-ubuntu/05.png" alt="05" %}

4. 重启生效

现在就可以用快捷键 `Shift+Super+左/右` 在显示器间移动窗口了。

---

更新：

18.04 自带了在显示器间移动窗口的快捷键，也是`Shift+Super+左/右` 在显示器间移动窗口，不需要用这个软件了。

## 五、鼠标手势

通过上面的设置，快捷键基本够用了。更进一步的，我们可以通过鼠标，更方便地控制窗口和系统。

这里推荐一个软件，Easystroke，免费开源，而且很好用。

1. 安装 Easystroke：`sudo apt install easystroke`

2. 设置：比较简单，根据个人的需求来设置，这里贴上我的设置

   {% include image.html src="/img/in-post/2019-10-31-short-cut-ubuntu/06.png" alt="06" %}
   
   ---
   
   更新：
   
   {% include image.html src="/img/in-post/2019-10-31-short-cut-ubuntu/07.png" alt="2020-05-19 16-26-12 的屏幕截图" %}

## 六、总结

经过上面的配置，我们就能愉快地用鼠标手势和快捷键来使用 Ubuntu 啦。