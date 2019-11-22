---
layout:     post
title:      "Windows 10 重装"
subtitle:   "重装 Windows 10，并保留正版系统和正版 Office"
date:       2018-07-05 10:00:00
author:     "Tian"
categories: Skill
header-img: "img/post-bg-windows.jpg"
header-mask: 0.5
catalog: true
tags:
    - 环境配置
    - Windows
---

## 一、重置电脑

电脑是同事换下来的，预装 Windows 10 和正版 Office2016，我想重置电脑并保留正版 Windows 系统和正版 Office。

### （1）查看系统版本

右键点击开始菜单——系统，能看到系统版本。可以看到此电脑预装的是 64 位的「Windows 10 家庭中文版」，这也是绝大多数笔记本预装的版本。

### （2）查看 Windows 10 序列号

本机的 Windows 10 的序列号很容易查出来，按 `Win` + `R`，运行 `powershell`，然后执行以下命令：

```
(Get-WmiObject -query 'select * from SoftwareLicensingService').OA3xOriginalProductKey
```

把上面查到的序列号记下来（用手机拍下来即可），比如「QWERT-ASDFG-ZXCVB-QWERT-ASDFG」。

### （3）查看 Office 版本

新建一个 Word 文档，点击 **文件** -> **账户**，看到已经是激活成功的了，绑定的是同事的微软账号。

### （4）重置电脑

在 **Windows设置** -> **更新和安全** -> **恢复** -> **重置此电脑**

按照提示选择，选择清除所有数据。

等待一段时间，电脑会重启几次，最后按照提示按 F9，重启，系统就重置完毕。

### （5）激活

#### 系统激活

进入系统，电脑重置回出厂设置，按照提示进入系统。

在 **控制面板** -> **系统和安全** -> **系统**

看到系统版本 Windows 10 家庭中文版，已经激活成功，我们的序列号没有派上用场，这是因为主板集成了正版信息，大部分情况下重置或者重装同样版本的系统自动激活。

#### Office激活

因为预装了 Office，新建 Word 文档，会提示你激活 Office，并要求你把密钥添加到微软账户。

我们根据提示尝试添加到自己的微软账户，提示「此产品密钥有效，但它已使用其他Microsoft账户兑换：xxx@xxx.com」。

这是因为预装的 Office 密钥已经和同事的微软账户绑定了，我们用同事的微软账号登录即能激活。

但是预装的 Office 是 32 位版的，我们想要 64 位的，32 位和 64 位Office的差别在 [这里](https://www.jianshu.com/p/ffe68ee96b84)。

在 [这里](https://support.office.com/zh-cn/article/%E4%BB%8E-pc-%E5%8D%B8%E8%BD%BD-office-9dd49b83-264a-477a-8fcc-2fdf5dbf61d8) 下载完全卸载工具，卸载预装的 Office。

然后用绑定了密钥的账户登录 [Office Account](https://stores.office.com/myaccount/noproducts.aspx?ui=zh-CN&rs=zh-CN&ad=CN) 下载安装 64 位的Office。

在线安装，大概要一个小时左右，完成。

## 二、子系统 Ubuntu

因为工作环境是 Linux，用 Windows 10 的 Ubuntu 子系统能很方便地和工作机以及服务器交互。

打开 Microsoft Store，搜索 Ubuntu，可以免费下载。

安装方法在描述里说明地很清楚了。

**控制面板** -> **程序** -> **启用或关闭Windows功能** -> **点选「适用于Linux的Windows子系统」**

按照提示重启后，下载安装 Microsoft Store 里的 Ubuntu 就可以了。

在 Ubuntu 的状态栏右键点击，可以在默认值或者属性里设置字体和颜色。

## 三、参考链接

- [参考](https://www.jianshu.com/p/92ccdc138b46)





