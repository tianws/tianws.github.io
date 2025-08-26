---
layout:     post
title:      "用 Xrdp 连接 Ubuntu 远程桌面"
subtitle:   ""
date:       2019-10-23 10:00:00
author:     "Tian"
categories: Skill
header-img: "img/post-bg-ubuntu.jpg"
header-mask: 0.4
catalog: true
tags:
    - 环境配置
    - Ubuntu
typora-root-url: ../
---

## 前言

以前通过 VNC 的方式连接远程桌面，具体方式已经记不清了，只记得很繁杂。后来通过 ssh -X 的方式可视化远程服务器的内容，很快很好用。

今天又有了需要远程桌面的需求了，折腾了一下，采用 RDP（Remote Desktop Connection）的方式连接，很简单，为避免遗忘，记录一下。

## Step 1：安装 Xrdp Server

> xrdp 是一个使用 RDP 的开源远程桌面服务端协议。
>
> 它提供了功能齐全的 Linux terminal server，能够接受来自 rdesktop，freerdp 和 Microsoft 终端服务器 / 远程桌面客户端的连接。 

在服务端：

```bash
sudo apt install xrdp
sudo systemctl enable xrdp
```

然后退出或者重启你的桌面。

## Step 2：从 Ubuntu 连接

Ubuntu 自带了远程桌面软件 Remmina，新建远程桌面，按照需求填写：

{% include image.html src="/img/in-post/2019-10-23-remote-desktop/01.png" alt="01" %}

然后连接即可。

{% include image.html src="/img/in-post/2019-10-23-remote-desktop/04.png" alt="04" %}

## Step 3：从 Windows 10 连接

打开 Windows 10 自带远程桌面连接程序：

{% include image.html src="/img/in-post/2019-10-23-remote-desktop/02.png" alt="02" %}

“Module” 中选择 sesman-Xvnc，username 和 password 中填入相应的用户和密码即可。

## 其他

1. 远程桌面使用 tab 键：

   打开 菜单 -> 设置 -> 窗口管理器，或者在终端中输入 xfwm4-settings 打开（xfwm4 就是 xfce4 window manger 的缩写）选择键盘，可以看到窗口快捷键中动作一列有「切换同一应用程序的窗口」选项，将该选项的快捷键清除后关闭窗口即可。

2. ~~remmina复制粘贴~~

   > 注意：新版会连不上，使用`sudo ppa-purge ppa:remmina-ppa-team/remmina-next`删除ppa并恢复老版

   实际上 Ubuntu 16.04 上自带的 Remmina 太旧了，存在无法在远程电脑和本地进行复制粘贴的问题。其实只要更新下 Remmina 的版本即可解决：
   
   ```bash
   sudo apt-add-repository ppa:remmina-ppa-team/remmina-next
   sudo apt-get update
   sudo apt-get install remmina remmina-plugin-rdp
   ```

3. xrdp 重连到同一个 session

   查看已经启动的 session 端口：

   ```bash
   netstat -tulpn | grep vnc
   ```

   会有类似于下列输出：

   ```bash
   tcp	0	0	127.0.0.1:5917	0.0.0.0:*	LISTEN	26698/Xvnc
   ```

   所以可知端口是 `5917`。

   编辑配置文件 `/etc/xrdp/xrdp.ini`：

   ```bash
   [xrdp1]字段下
   port=-1
   改成
   port=ask5917
   ```

   这样客户端连接的时候会询问端口，而且默认填写 5917。

   同一个端口为同一个 session，这样就可以管理 session了。

4. 关闭 session

   {% include image.html src="/img/in-post/2019-10-23-remote-desktop/05-1571818753923.png" alt="05" %}

   选择 Log Out 的时候，勾掉 `Save session for future logins`，即可关闭 session。

## 参考

- [Connect To Ubuntu 16.04 17.10 18.04 Desktop Via Remote Desktop Connection (RDP) With Xrdp](https://websiteforstudents.com/connect-to-ubuntu-16-04-17-10-18-04-desktop-via-remote-desktop-connection-rdp-with-xrdp/)
- [xrdp完美实现Windows远程访问Ubuntu 16.04](https://www.cnblogs.com/xuliangxing/p/7560723.html)
- [Ubuntu16.04 Remmina远程复制粘贴](https://blog.csdn.net/TurboIan/article/details/85130054)
- [How do I set up xrdp session that reuses an existing session?](https://askubuntu.com/questions/133343/how-do-i-set-up-xrdp-session-that-reuses-an-existing-session)
- [远程桌面关闭后如何恢复原会话连接](https://blog.csdn.net/wangleiwavesharp/article/details/71218862)

