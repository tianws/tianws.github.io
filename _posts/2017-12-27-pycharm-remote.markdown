---
layout:     post
title:      "Pycharm远程编程配置方法"
subtitle:   "本地编码，远程服务器自动同步执行"
date:       2017-12-27 10:00:00
author:     "Tian"
categories: Skill
header-img: "img/post-bg-terminal.jpg"
header-mask: 0.7
catalog: true
tags:
    - 工具
    - 开发环境
---

一个好的IDE能使编程事半功倍，而往往运行环境上没有条件装IDE。我们常常在本机用IDE编程完毕后，scp到服务器上运行，要做小的调试再用vim等编辑器来改代码。这样做很容易使本地和服务器上的代码不同步，虽然可以通过git等工具解决，但步骤太过繁琐。

我本人的开发场景是，本机和服务器都是Ubuntu，但是只有服务器上有高性能显卡，所以很多任务只能在服务器上用vim编程实现，虽然vim也可以配置的很强大，但我还是习惯把它当成一个轻量级的编辑器来使用。

在本机，我主要用Jetbrains的产品，本文以Pycharm为例，在本机搭建远程编程环境，在本机无缝使用服务器的环境和性能。

## 安装Pycharm

安装Pycharm推荐使用以下的安装方式：

```shell
sudo snap install [pycharm-professional|pycharm-community] --classic
```

支持Ubuntu16.04以后的系统，方便管理。

注意要选择professional版本，community版本没有remote功能。

其他安装方式见[*Pycharm官网*](https://www.jetbrains.com/pycharm/download/#section=linux) 。

## 设置远程python解释器

用Pycharm打开python项目，依次选择File -> Settings -> Project Interpreter

点选右边的齿轮，选择Add Remote...

![](https://raw.githubusercontent.com/tianws/tianws.github.io/master/img/in-post/20171227/pycharm_settings.png)

填好ssh登录信息，选择需要的Python解释器路径，OK。

如果有另外的环境配置，比如用特定版本的opencv，之前在服务器上我们通过在.bashrc或者.zshrc里配置PATHONPATH或者PATH变量来实现，现在服务器上的这些变量在本机的Pycharm里失效了。

我们同样可以在Pycharm里指定：

依次点选右边的齿轮-> Show all... -> 选择我们的解释器 -> 点选Paths

然后添加我们需要指定的路径即可。

![](https://raw.githubusercontent.com/tianws/tianws.github.io/master/img/in-post/20171227/path_settings.png)

现在我们的程序可以用远程服务器的环境和算力运行了。

## ssh转发x11图形UI

我们做CV的，最后肯定要把图像显示出来。

我们可以利用ssh转发X11。

#### 服务器端

```shell
vim /etc/ssh/sshd_conf
# 找到这一行
# X11Forwrding yes
# 这条配置的意义是允许ssh的x11转发
service sshd restart # 重启sshd
echo $DISPLAY # 输出 localhost:13.0
```

#### 本机端

点选Run -> edit Configurations -> 添加 DISPLAY=localhost:13.0

![](https://raw.githubusercontent.com/tianws/tianws.github.io/master/img/in-post/20171227/x11_settings.png)

现在运行程序，可以在本机实时显示图像了。

完成，现在可以近似地认为服务器上的显卡和环境就装在你本机了，可以开心地写BUG了，enjoy！

---

更新：这篇写的比我更详细。[使用PyCharm进行远程开发和调试](https://www.xncoding.com/2016/05/26/python/pycharm-remote.html)