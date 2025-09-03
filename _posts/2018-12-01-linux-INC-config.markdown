---
layout:     post
title:      "Linux 调整网卡工作模式"
subtitle:   "用 ethtool 命令设置网口速率"
date:       2018-12-01 00:00:00
author:     "Tian"
categories: Skill
header-img: "img/post-bg-terminal.jpg"
header-mask: 0.7
catalog: true
tags:
    - 技术
    - Linux
    - 网络
typora-root-url: ../
---

## 痛点

经常要向服务器上传下载数据，但是我的传输速度只有 10MB/s，传输个大一点的数据集就要几个小时，严重影响了工作效率。

和同事们吐槽时，海军说他与服务器或者与贝贝的机器之间传输速率能到 100MB/s，但是和会长的机器之间只能到 10MB/s。

看样子应该不是服务器的问题，一定是我的机器哪里配置的有问题。

但是平时需要传大数据的时候不多，于是一直没动力去排查这个问题。

今天又要传个数据集到服务器上，看着那龟速简直不能忍，下定决心一定要搞定这个问题。

## 排查过程

（一）代理排查

海军说可能是网络代理的原因，有道理，因为我和会长的机器共同点是都用了一样的代理，如果数据绕道代理一定会降速。

但是如果绕道应该不会达到 10MB/s 这么快，我一般外网的最高下载速度是 2MB/s。

姑且一试，我把代理关了，甚至把和代理相关的软件比如 proxychains 都卸载了，然后试验，仍然是 10MB/s。

（二）软件排查

因为我传输一般用 scp，我想可能是 scp 设置不对？

于是翻看了文档和教程，用了加速的命令，试验下来对一些数据有速度提升，但是达不到 100MB/s。

（三）网卡排查

在网上的帖子中，有一个运维记录了这样的问题，他的局域网内几台交换机网络传输速度慢，经过排查，发现是有的机器是全双工状态，有的是半双工状态，将状态改成自适应后，故障解决。

这个和我遇到的问题很相似，而且 10MB/s 和 100MB/s 差不多就是百兆网口和千兆网口的最大速率，于是开始排查网卡的问题。

## 解决方案

```bash
ifconfig # 看激活的网卡名字
sudo ethtool enp2s0 # 查看网卡信息
```

我的机器输出：

```bash
Settings for enp2s0:
	Supported ports: [ TP MII ]
	Supported link modes:   10baseT/Half 10baseT/Full 
	                        100baseT/Half 100baseT/Full 
	                        1000baseT/Half 1000baseT/Full 
	Supported pause frame use: No
	Supports auto-negotiation: Yes
	Advertised link modes:  10baseT/Half 10baseT/Full 
	                        100baseT/Half 100baseT/Full 
	                        1000baseT/Full 
	Advertised pause frame use: Symmetric Receive-only
	Advertised auto-negotiation: Yes
	Link partner advertised link modes:  10baseT/Half 10baseT/Full 
	                                     100baseT/Half 100baseT/Full 
	                                     1000baseT/Full 
	Link partner advertised pause frame use: Symmetric
	Link partner advertised auto-negotiation: Yes
	Speed: 100Mb/s
	Duplex: Full
	Port: MII
	PHYAD: 0
	Transceiver: internal
	Auto-negotiation: on
	Supports Wake-on: pumbg
	Wake-on: d
	Current message level: 0x00000033 (51)
			       drv probe ifdown ifup
	Link detected: yes

```

海军的机器输出：

```bash
Settings for enp0s31f6:
    Supported ports: [ TP ]
    Supported link modes:   10baseT/Half 10baseT/Full
                            100baseT/Half 100baseT/Full
                            1000baseT/Full
    Supported pause frame use: No
    Supports auto-negotiation: Yes
    Advertised link modes:  10baseT/Half 10baseT/Full
                            100baseT/Half 100baseT/Full
                            1000baseT/Full
    Advertised pause frame use: No
    Advertised auto-negotiation: Yes
    Speed: 1000Mb/s
    Duplex: Full
    Port: Twisted Pair
    PHYAD: 1
    Transceiver: internal
    Auto-negotiation: on
    MDI-X: on (auto)
    Supports Wake-on: pumbg
    Wake-on: g
    Current message level: 0x00000007 (7)
                   drv probe link
    Link detected: yes
```

可以看到 Speed 一栏，海军的是 1000Mb/s，我的是 100Mb/s，差不多就分别代表了我们的 100MB/s 和 10MB/s 的速度，虽然自适应打开了，但不知道为啥给我设置的是 100Mb/s 的速度，明明可以支持 1000Mb/s 的。

设置网卡：

```bash
sudo ethtool -s enp2s0 autoneg on speed 1000 duplex full #手动设置网卡为自适应，速度为 1000，全双工模式

# 说明
#修改linux网卡的工作模式：
ethtool –r ethX                    ## 重置 ethX 网口到自适应模式
ethtool –S ethX                    ## 查询 ethX 网口收发包统计
ethtool –s ethX [speed 10|100|1000]        ## 设置网口速率 10/100/1000M
[duplex half|full]                ## 设置网口半/全双工
[autoneg on|off]                ## 设置网口是否自协商
```

再次试验，和服务器之间的速度变成 101MB/s！

原来要传输一个小时的文件，现在几分钟就搞定！ enjoy！

<img src="https://raw.githubusercontent.com/tianws/tianws.github.io/master/img/in-post/2018-12-01-linux-INC-config/image.jpg" width="40%" alt="AltText" />

## Tips

一、设置网卡的命令除了 `ethtool` 还有 `mii-tool`，但是 `mii-tool` 只能支持百兆网卡设备，除非有些比较老的网卡只能支持 `mii-tool`，一般不建议使用。除了上面的用法，这两个命令还有很多功能，感兴趣的可以研究下。

二、网上说上面的设置重启后会失效，如果要永久更改，需要修改相应的配置文件，但是我重启后 Speed 仍然是1000，所以更改配置的方法就没试，就不写在博客里了。

三、用 scp 传输低压缩率的数据的时候，可以加上 -C，scp 会先压缩后传输，传输速率会大大提高。加快压缩命令可参考：`scp -P port -C ufile user@host:~/ufile`

---

## 参考

- [局域网内传输速度慢的解决办法](https://blog.csdn.net/kfanning/article/details/5481650)

- [ubuntu设置网卡速率](https://blog.csdn.net/samssm/article/details/46831783)

- [linux 查看网卡速度调整工作模式](http://ask.apelearn.com/question/14382)

- [压榨SCP传输速度](http://blog.51cto.com/weipengfei/1350338)

- [Linux下常用的文件传输方式介绍与比较](http://mingxinglai.com/cn/2014/03/copy-file-in-linux/)