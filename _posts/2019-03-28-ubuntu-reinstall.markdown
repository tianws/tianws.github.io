---
layout:     post
title:      "Ubuntu系统重装"
subtitle:   "新Ubuntu系统安装步骤"
date:       2019-03-28 10:00:00
author:     "Tian"
categories: Skill
header-img: "img/post-bg-ubuntu.jpg"
header-mask: 0.4
catalog: true
tags:
    - 环境配置
    - Ubuntu
---

## 一、制作系统盘

### （1）下载ubuntu16.04LTS

下载链接：[BitTorrent](http://releases.ubuntu.com/16.04/ubuntu-16.04.4-desktop-amd64.iso.torrent)

### （2）烧制系统盘

#### i. 命令行烧制

```bash
sudo fdisk -l # 查看磁盘信息
sudo umount /dev/sdc* # umount
sudo mkfs.vfat /dev/sdc -I # 格式化位FAT格式
sudo dd if=/../../..ios of=/dev/sdc status=progress # of为制作U盘启动盘
```

#### ii. 软件烧制

官网给的[教程](https://tutorials.ubuntu.com/tutorial/tutorial-create-a-usb-stick-on-ubuntu#0)是用**Startup Disk Creator**烧制，还有windows和macOS系统下烧制的方法。

没试过，详见链接。

## 二、安装ubuntu

选择install，安装说明很详细，略过。

分区的部分选择自己设置，我主机有256G的固态硬盘，和1T的机械硬盘，分区如下：

- **128G固态**：

  /EFI == 100M（主分区-起始位置），近几年出厂的主板，系统用UEFI，那么就需要分一个EFI分区，如果不分这个分区安装不报错，可以不分。建议用UEFI启动，开机比较快。

  /swap == 16G（逻辑分区-结束位置）交换空间，我主机16G内存，所以分了16G给它。

  / == 余下所有（主分区-起始位置）系统分区，`/boot`、`/home`什么的不用单独分。

- **1T机械**：

  /DATA == 1T（逻辑分区）单独分出来，系统自动挂载机械硬盘到`/DATA`，一般的数据都放在这个盘，系统重装时，保留这个盘不格式化，重新挂载上去就行了。

在Red Hat Enterprise Linux 中，以下是设置合适的交换分区大小的规则：

| 物理内存 | 交换分区（SWAP） |
| :------: | :--------------: |
|   <=4G   |      至少4G      |
|  4~16G   |      至少8G      |
| 16G~64G  |     至少16G      |
| 64G~256G |     至少32G      |

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

## 四、保存数据至/DATA

#### 1. 将家目录迁移至/DATA：

```bash
cd ~
DESTINATION='/DATA/Home_Dirs/'

for i in *
do
	if test -d $i
	then
		echo moving $i
		mv $i $DESTINATION
		ln -s $DESTINATION$i $i
	fi
done
```

#### 2.利用网线传输数据：

1. 网线连接新旧机器
2. 在旧机器新建网络配置
3. 在新网络配置里选择IPV4 Setting，在Method项选择Shared to other computers，点击save按钮
4. 连接成功，查看新旧机器ip，即可scp传输

> 如果新机器没接显示器，可用nmap查询：
>
> ```bash
> sudo apt install nmap
> ip a # 查询本机ip，如10.42.0.1
> nmap 10.42.0/24 # 输出新机器ip地址
> ```
>

> 将旧机器~/.thunderbird文件夹拷贝到新机器，可以无缝转移邮箱的设置和邮件。

## 五、安装cuda、cudnn

见[NVIDIA显卡配置](https://tianws.github.io/skill/2018/07/04/cuda-dl/)

## 六、系统以及软件配置

见[ubuntu软件和系统配置](<https://tianws.github.io/skill/2019/04/03/software-ubuntu/>)

