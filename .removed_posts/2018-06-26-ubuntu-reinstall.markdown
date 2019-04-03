---
layout:     post
title:      "ubuntu重装之「系统重装」"
subtitle:   "ubuntu重装——篇一"
date:       2018-06-26 10:00:00
author:     "Tian"
categories: Skill
header-img: "img/post_2018_01_27.jpg"
catalog: true
tags:
    - 环境配置
---

## 一、制作系统盘

### （1）下载ubuntu16.04LTS

下载链接：[BitTorrent](http://releases.ubuntu.com/16.04/ubuntu-16.04.4-desktop-amd64.iso.torrent)

### （2）烧制系统盘

#### i. 命令行烧制

```bash
sudo fdisk -l # 查看磁盘信息
sudo dd if=/../../..ios of=/dev/sdc # of为制作U盘启动盘
```

#### ii. 软件烧制

官网给的[教程](https://tutorials.ubuntu.com/tutorial/tutorial-create-a-usb-stick-on-ubuntu#0)是用**Startup Disk Creator**烧制，还有windows和macOS系统下烧制的方法。

没试过，详见链接。

## 二、安装ubuntu

选择install，安装说明很详细，略过。

分区的部分选择自己设置，我主机有256G的固态硬盘，和1T的机械硬盘，分区如下：

- **256G固态**：

  /EFI == 100M（主分区），近几年出厂的主板，系统用UEFI，那么就需要分一个EFI分区，如果不分这个分区安装不报错，可以不分。建议用UEFI启动，开机比较快。

  /boot == 1G（主分区），boot单独挂载，系统崩溃，损坏的是这个分区。重装系统时其他分区保留下来，重新挂载上去就可以用了。

  /swap == 2G（逻辑分区）交换空间，我主机16G内存，应该够用了，所以只分了2G给它。

  / == 余下所有（逻辑分区）

- **1T机械**：

  /home == 1T（逻辑分区）单独分出来，系统自动挂载机械硬盘到home，一般的数据都会在这个盘，系统坏了备份这个盘就行了。

其他的可以下一步，安装完成拔掉U盘，重启就行了。

## 三、切换英文目录

默认目录是中文，用命令行时要经常切换输入法输入中文，很麻烦，用下面的命令切换英文目录：

```bash
# Ubuntu
export LANG=en_US
xdg-user-dirs-gtk-update # 询问是否转化为英文目录，同意并关闭
export LANG=zh_CN
# 重启，开启后询问是否转化为中文目录，取消并选择不再提示

# Linux
# 找到~/.config/user-dirs.dis文件
# 修改对应的目录为英文，并创建对应文件夹，重启
```



enjoy！