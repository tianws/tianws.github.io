---
layout:     post
title:      "PyCharm 远程编程配置方法"
subtitle:   "本地编码，远程服务器自动同步执行"
date:       2017-12-27 10:00:00
author:     "Tian"
categories: Skill
header-img: "img/post-bg-terminal.jpg"
header-mask: 0.7
catalog: true
tags:
    - 技术
    - 工具
    - IDE
typora-root-url: ../
---

一个好的 IDE 能使编程事半功倍，而往往运行环境上没有条件装 IDE 。我们常常在本机用 IDE 编程完毕后，scp 到服务器上运行，要做小的调试再用 vim 等编辑器来改代码。这样做很容易使本地和服务器上的代码不同步，虽然可以通过 Git 等工具解决，但步骤太过繁琐。

我本人的开发场景是，本机和服务器都是 Ubuntu，但是只有服务器上有高性能显卡，所以很多任务只能在服务器上用 vim 编程实现，虽然 vim 也可以配置的很强大，但我还是习惯把它当成一个轻量级的编辑器来使用。

在本机，我主要用 JetBrains 的产品，本文以 PyCharm 为例，在本机搭建远程编程环境，在本机无缝使用服务器的环境和性能。

## 安装 PyCharm

安装 PyCharm 推荐使用以下的安装方式：

```shell
sudo snap install [pycharm-professional|pycharm-community] --classic
```

支持 Ubuntu16.04 以后的系统，方便管理。

注意要选择 Professional 版本，Community 版本没有 remote 功能。

其他安装方式见 [*PyCharm官网*](https://www.jetbrains.com/pycharm/download/#section=linux) 。

## 设置远程 Python 解释器

用 PyCharm 打开 Python 项目，依次选择 File -> Settings -> Project Interpreter

点选右边的齿轮，选择 Add Remote...

{% include image.html src="/img/in-post/2017-12-27-pycharm-remote/pycharm_settings.png" alt="pycharm_settings" %}

填好 ssh 登录信息，选择需要的 Python 解释器路径，OK。

如果有另外的环境配置，比如用特定版本的 OpenCV，之前在服务器上我们通过在 .bashrc 或者 .zshrc 里配置 `PATHONPATH` 或者 `PATH` 变量来实现，现在服务器上的这些变量在本机的 PyCharm 里失效了。

我们同样可以在 PyCharm 里指定：

依次点选右边的齿轮 -> Show all... -> 选择我们的解释器 -> 点选Paths

然后添加我们需要指定的路径即可。

{% include image.html src="/img/in-post/2017-12-27-pycharm-remote/path_settings.png" alt="path_settings" %}

现在我们的程序可以用远程服务器的环境和算力运行了。

## ssh 转发 x11 图形 UI

我们做 CV 的，最后肯定要把图像显示出来。

我们可以利用 ssh 转发 X11。

#### 服务器端

```shell
vim /etc/ssh/sshd_conf
# 找到这一行
# X11Forwrding yes
# 这条配置的意义是允许 ssh 的 x11 转发
service sshd restart # 重启 sshd
echo $DISPLAY # 输出 localhost:13.0
```

#### 本机端

点选 Run -> edit Configurations -> 添加 `DISPLAY=localhost:13.0`

{% include image.html src="/img/in-post/2017-12-27-pycharm-remote/x11_settings.png" alt="x11_settings" %}

现在运行程序，可以在本机实时显示图像了。

完成，现在可以近似地认为服务器上的显卡和环境就装在你本机了，可以开心地写 BUG 了，enjoy！

---

更新：这篇写的比我更详细。[使用PyCharm进行远程开发和调试](https://www.xncoding.com/2016/05/26/python/pycharm-remote.html)