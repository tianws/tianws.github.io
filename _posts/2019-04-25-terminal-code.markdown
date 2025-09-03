---
layout:     post
title:      "常用脚本工具整理"
subtitle:   "md5sum、命令行查看配置"
date:       2019-04-25 00:00:00
author:     "Tian"
categories: Skill
header-img: "img/post-bg-terminal.jpg"
header-mask: 0.7
catalog: true
tags:
    - 技术
    - Linux
    - 工具
---

## 一、用 md5sum 校验文件完整性

#### 命令选项

```bash
md5sum
-b 以二进制模式读入文件内容
-t 以文本模式读入文件内容
-c 根据已生成的 md5 值，对现存的文件进行校验
-w 当校验不正确时给出警告信息。
--status 校验完成后，不生成错误或正确的提示信息，可以通过命令的返回值来判断
```

#### 使用举例

1. 生成文件 md5 值

   ```bash
   md5sum data
   0axxxxxxxxx data
   ```

2. 使用通配符对多个文件进行 md5

   ```bash
   md5sum *
   0axxxxxxx data
   14dxxxxxx data2
   ```

3. md5 值重定向

   ```bash
   # 单个文件重定向
   md5sum data > data.md5
   # 多个文件重定向
   md5sum * > d.md5
   cat d.md5
   0axxxxxxx data
   14xxxxxxx data2
   # 重定向追加
   md5sum data3 >> d.md5
   ```

4. md5 校验

   ```bash
   # 显示校验信息
   md5sum -c d.md5
   data: OK
   data2: OK
   data3: OK
   # 不显示校验信息，以命令返回值来判断
   md5sum -c --status d.md5
   echo $?
   0
   # 多个文件校验和grep连用，将正确的信息过滤掉
   md5sum -c d.md5 | grep -v OK
   ```

#### 特殊说明

> 1) `md5sum` 是校验文件内容，与文件名是否相同无关
>
> 2) `md5sum` 逐像素校验，所以文件越大，校验时间越长

#### 参考

- [Linux 命令详解：md5sum 命令](<https://blog.51cto.com/xiangpang/1711603>)
- [md5sum 命令](<http://man.linuxde.net/md5sum>)

## 二、终端查看电脑信息

#### 集成工具

- screenfetch
- neofetch
- hwinfo --short
- hardinfo（图形化）

还有一些其他的，[参考](<https://wiki.archlinux.org/index.php/List_of_applications/Utilities#System_information_viewers>)。

#### 命令行

**CPU**

```bash
# 查看cpu统计信息
lscpu

# 查看cpu型号
cat /proc/cpuinfo | grep name | cut -f 2 -d : | uniq -c # uniq -c 统计重复行的个数写在最左,cut 以：为分隔符指定第二列字段 
6  Intel(R) Core(TM) i5-9600K CPU @ 3.70GHz ## 6核i5-9600K cpu

# 查看实际cpu个数
cat /proc/cpuinfo | grep "physical id" | uniq -c 
6 physical id	: 0  ##一颗6核cpu

# 查看cpu位数
getconf LONG_BIT 
32 ## 当前cpu运行在32bit模式下，但不代表cpu不支持64bit

# 查询cpu是否支持64bit
cat /proc/cpuinfo | grep flags | grep ' lm ' | wc -l 
6 ## 结果大于0, 说明支持64bit计算. lm指long mode, 支持lm则是64bit
```

**内存**

```bash
free -m                             # 查看内存使用量和交换区使用量
cat /proc/meminfo | grep MemTotal   # 查看内存总量
cat /proc/meminfo | grep MemFree    # 查看空闲内存量
dmidecode -t memory                 # 查看内存硬件信息 
```

**磁盘**

```bash
lsblk                  # 直观查看硬盘和分区分布
fdisk -l               # 详细查看硬盘和分区分布
df -h                  # 查硬盘使用情况

mount | column -t      # 查看挂接的分区状态
swapon -s              # 查看所有交换分区
hdparm -i /dev/hda     # 查看磁盘参数(仅适用于IDE设备)
dmesg | grep IDE       # 查看启动时IDE设备检测状况
cat /proc/partitions   # 显示硬盘分区的信息
```

**系统**

```bash
lsb_release -a                   # 查看系统版本
uname -m && cat /etc/*release    # 查看系统基本信息
uname -a                         # 查看当前操作系统所有信息
cat /etc/issue                   # 查看当前操作系统发行版信息
hostname                         # 查看计算机名
lsmod                            # 列出加载的内核模块
env                              # 查看环境变量
cat /proc/loadavg                # 查看系统负载
dmidecode | grep "Product Name"  # 查看机器型号
uptime                           # 查看运行时间 负载情况
```

**网卡**

```bash
# 查看网卡硬件信息
lspci | grep -i 'eth'                             
# 查看所有网络接口
ifconfig -a / ip link show                        
# 查看某个网络接口的详细信息
ethtool enp2s0                                    
#手动设置网卡为自适应，速度为1000，全双工模式
ethtool -s enp2s0 autoneg on speed 1000 duplex full

# 说明
#修改linux网卡的工作模式：
ethtool –r ethX                    ## 重置ethX网口到自适应模式
ethtool –S ethX                    ## 查询ethX网口收发包统计
ethtool –s ethX [speed 10|100|1000]        ## 设置网口速率10/100/1000M
[duplex half|full]                ## 设置网口半/全双工
[autoneg on|off]                ## 设置网口是否自协商
```

**网络**

```bash
ifconfig               # 查看所有网络接口的属性
iptables -L            # 查看防火墙设置
route -n               # 查看路由表
netstat -lntp          # 查看所有监听端口
netstat -antp          # 查看所有已经建立的连接
netstat -s             # 查看网络统计信息
dmesg | grep -i eth    # 查看网卡信息
```

**用户**

```bash
w                         # 查看活动用户
id <用户名>                # 查看指定用户信息
last                      # 查看用户登录日志
cut -d: -f1 /etc/passwd   # 查看系统所有用户
cut -d: -f1 /etc/group    # 查看系统所有组
crontab -l                # 查看当前用户的计划任务
```

**服务**

```bash
chkconfig --list              # 列出所有系统服务
chkconfig --list | grep on    # 列出所有启动的系统服务
```

**程序**

```bash
dpkg -l                    # 查看所有安装的软件包
dpkg -S opencv             # 搜索相关的软件包
dpkg -L libopencv-dev      # 查看软件包安装位置
dpkg -s libopencv-dev      # 查看软件包信息
dpkg --info xx.deb         # 查看打包好的deb文件信息
dpkg --contents xx.deb     # 查看打包好的deb内容
dpkg -i xx.deb             # 安装deb包
dpkg -P xx.deb             # 卸载并删除配置
```

**其他**

```bash
lspci # 查看pci信息，即主板所有硬件槽信息 -v 详细信息 -t 设备树
lspci
00:00.0 Host bridge: Intel Corporation 2nd Generation Core Processor Family DRAM Controller (rev 09) #主板芯片
00:02.0 VGA compatible controller: Intel Corporation 2nd Generation Core Processor Family Integrated Graphics Controller (rev 09) #显卡
00:14.0 USB controller: Intel Corporation Panther Point USB xHCI Host Controller (rev 04) #usb控制器
00:16.0 Communication controller: Intel Corporation Panther Point MEI Controller #1 (rev 04)
00:1a.0 USB controller: Intel Corporation Panther Point USB Enhanced Host Controller #2 (rev 04)
00:1b.0 Audio device: Intel Corporation Panther Point High Definition Audio Controller (rev 04) #声卡
00:1c.0 PCI bridge: Intel Corporation Panther Point PCI Express Root Port 1 (rev c4) #pci 插槽
00:1c.2 PCI bridge: Intel Corporation Panther Point PCI Express Root Port 3 (rev c4)
00:1c.3 PCI bridge: Intel Corporation Panther Point PCI Express Root Port 4 (rev c4)
00:1d.0 USB controller: Intel Corporation Panther Point USB Enhanced Host Controller #1 (rev 04)
00:1f.0 ISA bridge: Intel Corporation Panther Point LPC Controller (rev 04)
00:1f.2 IDE interface: Intel Corporation Panther Point 4 port SATA Controller [IDE mode] (rev 04) #硬盘接口
00:1f.3 SMBus: Intel Corporation Panther Point SMBus Controller (rev 04)
00:1f.5 IDE interface: Intel Corporation Panther Point 2 port SATA Controller [IDE mode] (rev 04) #硬盘接口
02:00.0 Ethernet controller: Realtek Semiconductor Co., Ltd. RTL8111/8168B PCI Express Gigabit Ethernet controller (rev 06) #网卡
03:00.0 PCI bridge: Integrated Technology Express, Inc. Device 8893 (rev 41)

lsusb # 查看所有usb设备 -v 详细信息 -t 设备树

dmidecode -t bios # 查看bios信息

# dmidecode以一种可读的方式dump出机器的DMI(Desktop Management Interface)信息。这些信息包括了硬件以及BIOS，既可以得到当前的配置，也可以得到系统支持的最大配置，比如说支持的最大内存数等。
# 如果要查看所有有用信息
dmidecode -q
dmidecode -t [bios,  system,  baseboard,  chassis,  processor,  memory, cache,  connector,  slot] # 查看对应硬件信息
```

#### 参考

- [Linux 查看系统硬件信息(实例详解)](https://www.cnblogs.com/ggjucheng/archive/2013/01/14/2859613.html)

- [Ubuntu Service系统服务说明与使用方法](<http://www.mikewootc.com/wiki/linux/usage/ubuntu_service_usage.html>)

- [如何启动、关闭和设置ubuntu防火墙](<https://www.cnblogs.com/sweet521/p/5733466.html>)

