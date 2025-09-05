---
layout:     post
title:      "Linux 目录监控与自动同步"
subtitle:   "rsync、inotify 的介绍与使用"
date:       2018-10-27 10:00:00
author:     "Tian"
categories: Skill
header-img: "img/post-bg-terminal.jpg"
header-mask: 0.7
catalog: true
tags:
    - Linux
    - 工具
---

## 需求

开发工作在本机工作上完成，写的代码通过 PyCharm 自动同步到服务器上，然后通过 ssh 和 tmux 在命令行远程执行。

但是 PyCharm 是单向自动同步的，无法把服务器上训练的权重和 summary 文件自动同步回本机，如果实现了这个功能有两点好处：

（1）完整备份：在本机有完整的代码和权重备份，切换服务器方便。

（2）提升效率：将训练和评测部分拆解开来，服务器专注于需要大显存和大计算能力的训练步骤，将评测和可视化部分放在本机上的显卡上进行。这样节省了服务器切换训练、评测模式时产生的时间和资源的浪费。

## 方案

-------

*2018-11-14 更新: [Linux挂载远程目录](http://127.0.0.1:4000/skill/2018/11/14/remote-filesystem/) 的方法能更完美的满足需求*

-------

**rsync + inotify-tools**

rsync 的目的是实现本地主机和远程主机上的文件同步(包括本地推到远程，远程拉到本地两种同步方式)，也可以实现本地不同路径下文件的同步，但不能实现远程路径 1 到远程路径 2 之间的同步( scp 可以实现)。

inotify-tools 是为 linux 下 inotify 文件监控工具提供的一套 c 的开发接口库函数，同时还提供了一系列的命令行工具，这些工具可以用来监控文件系统的事件。

## 安装

```bash
# rsync 系统自带
sudo apt install inotify-tools
```

## 实现

```bash
#!/bin/bash
 
watch_dir=/home/tianws/rsync/
push_to=103
dest_dir=/home/tianws/rsync/
log_dir=/home/tianws/temp/
 
# First to do is initial sync
rsync -az --delete --exclude="*.swp" --exclude="*.swx" $watch_dir $push_to:$dest_dir
 
inotifywait -mrq -e delete,close_write,moved_to,moved_from,isdir --timefmt '%Y-%m-%d %H:%M:%S' --format '%w%f:%e:%T' $watch_dir \
--exclude=".*.swp" >>$log_dir/inotifywait.log &
pid="$!" # Shell 最后运行的后台 Process 的 PID
trap 'echo I am going down, so killing off my processes..$pid; kill $pid; exit' SIGHUP SIGINT SIGQUIT SIGTERM # 程序退出时结束子进程

while true;do
     if [ -s "$log_dir/inotifywait.log" ];then # -s
        grep -i -E "delete|moved_from" $log_dir/inotifywait.log >> $log_dir/inotify_away.log
        rsync -az --delete --exclude="*.swp" --exclude="*.swx" $watch_dir $push_to:$dest_dir
        if [ $? -ne 0 ];then
           echo "$watch_dir sync to $push_to failed at `date +"%F %T"`,please check it by manual"
        fi
        cat /dev/null > $log_dir/inotifywait.log
        rsync -az --delete --exclude="*.swp" --exclude="*.swx" $watch_dir $push_to:$dest_dir
    else
        sleep 1
    fi
done
```

## 参考

- [rsync和inotify系列教程](https://www.cnblogs.com/f-ck-need-u/p/7220009.html)

- [sersync：基于 rsync + inotify 实现数据实时同步](https://linux.cn/article-6032-1.html)

- [在脚本中使用 trap](https://www.ibm.com/developerworks/cn/aix/library/au-usingtraps/index.html)

- [Linux 自动监控文件目录变化并同步](https://www.jianshu.com/p/f387b45f0f1d)

