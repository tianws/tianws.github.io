---
layout:     post
title:      "Linux挂载远程目录"
subtitle:   "sshfs、NFS的介绍与使用"
date:       2018-11-14 00:00:00
author:     "Tian"
categories: Skill
header-img: "img/post-bg-terminal.jpg"
header-mask: 0.7
catalog: true
tags:
    - 环境配置
    - 开发环境
---

## 需求

我的程序和数据都部署在103服务器上，有一天，我终于实现了一个想法，兴冲冲地想运行看看，但是一看103显卡被占满了，而且同事要训练很多天，那怎么办，等他训练完？

等？等是不可能等的。我一看，102服务器现在还空着，马不停蹄地开始往102服务器上拷贝数据和程序，因为数据量大，拷贝了几个小时，等我终于把102的数据、环境、程序都调试好，准备开始训练，发现102显卡又被占了。。。

![images](https://raw.githubusercontent.com/tianws/tianws.github.io/master/img/in-post/20181114/images.jpeg)

发现了吗，在这个过程中，有三点浪费：

1、 时间的浪费：我花费了大量的时间在传数据、调程序、配环境等琐事上；

2、精力的浪费：不得不承认，这些琐事相当耗神，我得考虑路径，得考虑数据传输的完整性，哪一点有问题都得慢慢排查解决；

3、磁盘空间的浪费：每个服务器都有一份数据和程序的备份，占用了大量硬盘空间，而且随着项目的进行，有的备份是过时的，时间久了我自己都不清楚应该用哪个备份了。

所以我想要只保留一份数据和程序，但是能够快速挂载到任何服务器上运行。

## 方案

你应该想到了，只要把程序和数据放到“移动硬盘”上，用的时候插到对应服务器上就行了，哈哈。

对于Linux服务器来说，挂载远程目录就是这个“移动硬盘”。

#### 方案一 SSHFS

ssh和scp大家都用过，sshfs也和他们是一个“部门”的，他可以让我们通过SSH文件传输协议（SFTP）挂载远程的文件系统并且在本地机器上和远程的目录进行交互。

使用方法很简单：

```bash
# 客户端安装sshfs
sudo apt install sshfs 

# 创建挂载目录
mkdir -p ~/sshfs/103 

# 用SSHFS挂载远程的文件系统
sshfs tianws@103:/home/tianws ~/sshfs/103 

# 验证远程文件系统挂载成功
ls ~/sshfs/103
df -hT

# 永久挂载远程文件系统
sudo vim /etc/fstab
# 添加至最后一行，确保服务器之间允许ssh无密码登录
sshfs#tianws@103:/home/tianws ~/sshfs/103 fuse.sshfs defaults 0 0 
# 如果服务器配置为基于ssh秘钥的认证方式，加入下行
sshfs#tianws@103:/home/tianws ~/sshfs/103 fuse.sshfs IdentityFile=~/.ssh/id_rsa defaults 0 0
# 更新fstab文件使修改生效
sudo mount -a

# 卸载远程的文件系统
umount ~/sshfs/103
```

#### 方案二 NFS

nfs(network file system)网络文件系统工具，通过网络使不同机器或者操作系统之间分享部分文件，用于宿主机和目标机之间的文件共享。

```bash
# 安装nfs(两台机器都需要安装)
sudo apt install nfs-kernel-server

# 配置
## 服务端103
### （1）在/etc/exports文件添加可以共享的文件夹和允许的客户端地址
/home/tianws 172.22.52.120(rw,no_root_squash,async)
### （2）重启nfs服务
sudo systemctl restart nfs-server.service
## 客户端120
### （1）创建挂载的目录
mkdir -p ~/sshfs/103
### （2）挂载远程目录
sudo mount -t nfs 103:/home/tianws ~/sshfs/103
```

## 使用

因为方案二需要管理员权限，所以我用的是方案一，通过一通操作，103服务器上的家目录被挂载到102上的`~/sshfs/103`路径下，将程序中路径全部换为相对路径，就可以直接在102上运行了。

方案二感觉是更通用的方案，服务端配置好后，客户端不需要认证登录就可以挂载，更加的方便，适合服务器的管理员做通用的管理。

## 其他

（1）这一套流程我最担心的是因为读取数据方式由直接读取本地硬盘变成了通过网络读取远程目录，会不会导致数据读取部分成为训练的瓶颈。实践下来，训练表现良好，几乎可以用满GPU，和原来直接硬盘读取没有观察到太大差别。这也可能是因为我的数据是放在103上的固态硬盘，服务器之间的网络带宽也足够，所以没有引起瓶颈，如果用机械硬盘，也许会降低训练速度。

（2）在前一篇博客[Linux自动监控目录变化并同步](https://tianws.github.io/skill/2018/10/27/auto-synchronization/)中，我通过监控和同步两个步骤满足了需求，这样其实也会导致产生两份备份，而且那个方案脚本略复杂，容易出幺蛾子，如果用今天的远程挂载的方法，可以更完美的解决问题。

## 参考

[系统运维-如何使用SSHFS 通过SSH 挂载远程的Linux 文件系统或者目录](https://linux.cn/article-7855-1.html)

[Linux下挂载远程磁盘- nfs - 简书](https://www.jianshu.com/p/cc2893b2a8b8)

