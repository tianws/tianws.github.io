---
layout:     post
title:      "深度学习炼丹炉配置（一）—— docker 和 sshfs 环境配置"
subtitle:   ""
date:       2020-06-02 10:00:00
author:     "Tian"
categories: Skill
header-img: "img/post-bg-docker.jpg"
header-mask: 0.8
catalog: true
tags:
    - 环境配置
    - Docker
---

## 一、需求

想象一下这样的场景，某天，你登上你常用的服务器，打算运行一下你早已开发调试完成的程序，但是和以往不同的是，这一次你一运行，就报了一大堆的错误。你各种排查，最后发现原因是服务器上你程序依赖的库的版本被同事给改了，而你还不能擅自改回来，因为改动后同事的程序就没法运行了。

另一个场景，某天，你好不容易实现了一个新的想法，兴冲冲地想去训练一下看看，你登上你常用的服务器，发现显卡资源全都被占满了。等？等是不可能等的。于是你马不停蹄地向另一台空闲的服务器上迁移你的项目，等你花了大半天的时间，废了九牛二虎之力，在另一台服务器上重新配置了环境、传输了数据集、拷贝了代码，并做完了完整性校验。然后发现这台服务器又被另一个同事占满了，只剩你面对终端凌乱。

你吸取了教训，在所有的服务器上都配置了环境，放上了常用的数据集和代码，这下哪台服务器空闲我就用哪台总没问题了吧。但是随着时间的推移，你自己也分不清各台服务器上的代码，哪份是最新的，哪份是弃置的了。更严重的是，每台服务器上你都保存了一份数据集，占用了大量的磁盘空间，导致部门服务器的磁盘空间不足，经常要你清理。

上面的场景是我的真实写照，如果你也遇到过以上的一种或多种的问题，或者你只是想拥有一个方便纯粹的开发环境，那可以接着看下去，我们会设计一个开发环境搭建流程，使得我们的开发环境具有以下几个特点：

1. 沙盒：环境只利用服务器系统的内核与驱动等少数底层资源，不管服务器的系统发生什么变化都不会影响到我们的环境，同样地，不管我们的环境有什么变化，也不会影响到服务器的系统环境；

2. 一键迁移：如果要迁移我们的项目到一台新服务器上，只需要一两行代码，就可以完全复现我们的环境，并且和原来的环境完全一致，包括我们常用的工具和配置也可以完全还原；
3. 无冗余：我们的数据和代码只需要保存一份，就可以在各个服务器上调用；

## 二、方案

大家应该已经猜到了，我们主要用到的工具就是 docker 和 sshfs。

### （一）docker 配置

用 docker 配置深度学习开发环境的文章有很多，比如：

- [Docker+VSCode 配置属于自己的炼丹炉](https://zhuanlan.zhihu.com/p/102385239)
- [PyCharm+Docker：打造最舒适的深度学习炼丹炉](https://zhuanlan.zhihu.com/p/52827335)
- [Docker，救你于「深度学习环境配置」的苦海](https://zhuanlan.zhihu.com/p/64493662)

等等。

这些文章的 Docker 配置方式相似，我也从这些文章中受益良多，但是他们的配置方式不能满足我的需求，主要体现在：

1. 以 root 权限运行：在这些文章里，docker 容器里的进程是用 root 用户运行的，而且这个 root 用户即为服务器的 root，合适的条件下，这些进程有权限控制宿主机中的一切，这是非常危险的；另外，外界查询这些进程的启动用户都为 root，有一定的匿名性，不方便管理；还有以 root 运行进程，经常会导致文件读写权限的问题，很不方便；
2. 没有图形化转发配置：我是做 CV 的，我的程序在 docker 里运行，有时候我们想通过以图形化展示的方式看看中间结果，但是这些文章中的配置方法没有进行图形化转发；
3. 复用性不够：这些文章的 docker 配置是在已有的容器中操作的，没有写 dockerfile，时间长了做了哪些操作可能就忘了，不好复现，而且如果容器丢失，所有操作都要再来一遍；

下面就跟着我一起来配置 docker 吧。

docker 和 nvidia-docker 的安装和基本操作，本文不会介绍，请参考官方文档或者其他资料，这里给两个官网链接：[docker install](https://docs.docker.com/engine/install/)、[nvidia-docker quickstart](https://github.com/NVIDIA/nvidia-docker)。

我们选择 dockerfile 来配置 docker 镜像，这样方便维护我们的镜像。连接 docker 容器的方式我们选择 ssh ，这样可以适配更多的 IDE并且更灵活，使用的时候把 docker 容器当作一个独立的服务器来用就可以了。

#### 1、dockerfile 制作

下面会介绍一下我们的 dockerfile 具体有哪些内容，这么写的目的是什么，如果不想了解的话可以直接拉到最后查看完整的 dockerfile。

**（1） 选择镜像基底**

我们不会从零搭建我们的镜像，有很多官方的镜像给我们选择，比如对我来说，cuda、cudnn、pytorch是必装的，所以我选择在 [pytorch/pytorch:1.5-cuda10.1-cudnn7-devel](https://hub.docker.com/layers/pytorch/pytorch/1.5-cuda10.1-cudnn7-devel/images/sha256-449d5b98aa911955f55cb3ab413b81b34861ab5f4244519099328df282275690?context=explore) 这个官方镜像的基础上搭建我们的镜像，这样我们 ubuntu、cuda、cudnn、pytorch、conda 都可以直接用了。dockerfile 写法：

```dockerfile
FROM pytorch/pytorch:1.5-cuda10.1-cudnn7-devel
```

**（2）设置 apt、conda、pip代理**

由于众所周知的原因，我们访问国外的源速度很慢，或者有时候都无法连接，所以我们先设置一下代理，在 dockerfile 中写：

```dockerfile
# 设置apt、conda、pip代理镜像
RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list && apt-get clean && \
    /opt/conda/bin/conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/ && \
    /opt/conda/bin/conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/ && \
    /opt/conda/bin/conda config --set show_channel_urls yes && \
    /opt/conda/bin/pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

这样我们的 apt、conda 和 pip 就可以很快了。

**（3）开启终端色彩**

运行 docker 容器的时候，终端命令行没有颜色，看的很不舒服啊，这是因为 docker 里默认没有配置 `TERM` 导致的，所以我们配置一下终端就有颜色了：

```dockerfile
# 开启终端色彩
ENV TERM=xterm-256color
```

**（4）制作完整版 ubuntu**

官方的镜像为了控制 docker 的大小，用的是精简版的 ubuntu，很多常用的工具都没有安装，我们既然是作为开发环境来使用，完全可以恢复成完整版的 ubunutu：

```dockerfile
# 制作完整版 ubuntu
RUN export DEBIAN_FRONTEND=noninteractive && \
    bash -c 'yes | unminimize'
```

**（5）apt 安装常用软件**

为了用 ssh 连接我们的容器，我们需要安装 `openssh-server`；为了方便权限管理，我们需要安装 `sudo`；其他常用的软件可以根据个人习惯在这一步一起安装了。最后 `rm -rf /var/lib/apt/lists/*` 是为了删掉 apt 的缓存以减小镜像大小。

```dockerfile
# apt安装常用软件
RUN apt-get update && apt-get install -y --no-install-recommends \
         build-essential \
         cmake \
         git \
         curl \
         ca-certificates \
         libjpeg-dev \
         libpng-dev \
         sudo \
         openssh-server \
         bash-completion \
         vim \
         vim-gnome \
         zsh \
         tmux \
         ranger \
         xsel \
         mediainfo \
         proxychains4 \
         feh \
         apt-transport-https && \
         rm -rf /var/lib/apt/lists/*
```

**（6）设置 ssh X11 转发**

为了能转发图形化界面，我们需要修改 /etc/ssh/sshd_config 的设置：

```dockerfile
# 设置X11转发(把/etc/ssh/sshd_config 中的X11Forwarding置为yes,X11UseLocalhost置为no)
RUN sed -i "s/^.*X11Forwarding.*$/X11Forwarding yes/" /etc/ssh/sshd_config && \
    sed -i "s/^.*X11UseLocalhost.*$/X11UseLocalhost no/" /etc/ssh/sshd_config
    
EXPOSE 22
```

**（7）新建用户替代 root 并用 fixuid 管理 uid**

具体的原理可以参考我之前的博客：[Docker 容器内用户管理](https://tianws.github.io/skill/2020/05/29/docker-uid-setting/)，在这里我直接使用文章中的 dockerfile：

```dockerfile
# 新建用户并用 fixuid 管理 uid
ENV USERNAME="docker"
ENV PASSWD="123456"
RUN useradd --create-home --no-log-init --shell /bin/zsh ${USERNAME} && \
    adduser ${USERNAME} sudo && \
    echo "${USERNAME}:${PASSWD}" | chpasswd
RUN USER=${USERNAME} && \
    GROUP=${USERNAME} && \
    curl -SsL https://github.com/boxboat/fixuid/releases/download/v0.4.1/fixuid-0.4.1-linux-amd64.tar.gz | tar -C /usr/local/bin -xzf - && \
    chown root:root /usr/local/bin/fixuid && \
    chmod 4755 /usr/local/bin/fixuid && \
    mkdir -p /etc/fixuid && \
    printf "user: $USER\ngroup: $GROUP\n" > /etc/fixuid/config.yml

USER ${USERNAME}:${USERNAME}
```

**（8）配置环境变量，使ssh连接时 env 也生效**

官方的镜像用 ENV 配置了很多的环境变量，我们用 `docker run` 或者 `docker attach` 的时候这些环境变量能正常生效，但是当我们用 `ssh` 连接的时候，这些环境变量的配置就失效了，具体的原因见[这篇文章](https://www.cnblogs.com/xuxinkun/p/10531091.html)，为了使 ssh 的时候也生效，我们做下面的操作：

```dockerfile
RUN sed -i '$a\export $(cat /proc/1/environ |tr "\\0" "\\n" | xargs)' .zshrc
```

**（9）[可选] 个人常用工具个性化配置**

个人的常用工具 zsh、vim、tmux、ranger 有一些个性化配置，我也一起写到 dockerfile 里了，这样每次生成的镜像里都有我用着顺心的工具了。

```dockerfile
# 安装配置oh-my-zsh
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" && \
    curl "https://raw.githubusercontent.com/tianws/config/master/zsh/themes/robbyrussell.zsh-theme-server" -o .oh-my-zsh/custom/themes/robbyrussell.zsh-theme && \
    git clone https://github.com/zsh-users/zsh-autosuggestions .oh-my-zsh/custom/plugins/zsh-autosuggestions && \
    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git .oh-my-zsh/custom/plugins/zsh-syntax-highlighting && \
    sed -i "s/^plugins=.*$/plugins=(git colorize cp copydir z zsh-autosuggestions zsh-syntax-highlighting)/" .zshrc
    
# 配置vim
RUN curl "https://raw.githubusercontent.com/tianws/config/master/vim/vimrc" -o .vimrc

# 配置tmux
RUN curl "https://raw.githubusercontent.com/tianws/config/master/tmux/tmux_server.conf" -o .tmux.conf

# 配置ranger
RUN ranger --copy-config=all && \
    curl "https://raw.githubusercontent.com/tianws/config/master/ranger/rc.conf" -o .config/ranger/rc.conf && \
    curl "https://raw.githubusercontent.com/tianws/config/master/ranger/scope.sh" -o .config/ranger/scope.sh
```

**（10）ENTRYPOINT 和 CMD**

最后就是 dockerfile 中的 `ENTRYPOINT` 和 `CMD`了，在 docker 容器启动的时候，会自动运行 `ENTRYPOINT` 和 `CMD` 的命令，如果 `docker run` 的时候指定了命令，该命令会作为参数接在 `ENTRYPOINT` 后，并替换 dockerfile 里 `CMD` 的命令。

这里我们在 `ENTRYPOINT` 中配置 `fixuid` 命令，它会结合 `-u` 参数帮我们管理用户 uid。在 `CMD` 命令中默认启动 ssh 服务，并用 `zsh` 持久化，这样就不用像其他文章中那样手动进入容器里启动 ssh 服务了。

```dockerfile
ENTRYPOINT ["fixuid"]
CMD echo ${PASSWD} | sudo -S service ssh start && /bin/zsh
```

完整的 dockerfile 见[链接](https://github.com/tianws/config/blob/master/dockerfile/pytorch1.5-cuda10.1-cudnn7.dockerfile)。

#### 2、构建 docker 镜像

进入 dockerfile 文件夹，运行 docker build 命令：

```bash
docker build -t pytorch1.5-cuda10.1-cudnn7 -f pytorch1.5-cuda10.1-cudnn7.dockerfile .
# -t：指定镜像的名字
# -f：指定dockerfile
# 如果网络不好，可以配置代理：
## --build-arg http_proxy=http://ip:port
## --build-arg https_proxy=http://ip:port
```

然后运行 `docker images` 就可以看到生成的镜像了。

#### 3、运行 docker 容器

在服务器上，运行 docker run 命令：

```bash
docker run --gpus all --ipc=host  -p 49154:22 -it -u $(id -u):$(id -g) -h dd-docker -v /ssd/tianws:/ssd/tianws --restart=always pytorch1.5-cuda10.1-cudnn7
# --gpus all：启动 docker 时启用所有的 GPU 
# --ipc=host：增加主机与容器共享内存，pytorch 需要
# -p 49154:22：将服务器的 49154 端口映射到容器的 22 端口
# -it：分配 tty 设备支持终端登陆并打开 STDIN，用于控制台交互
# -u $(id -u):$(id -g)：指定容器的用户
# -h dd-docker：给容器的 hostname 起名为 dd-docker
# -v /ssd/tianws:/ssd/tianws：将服务器的 /ssd/tianws 目录挂载到容器的 /ssd/tianws 目录
# --restart=always：总是在容器停止时重启容器
# pytorch1.5-cuda10.1-cudnn7：镜像名
```

docker run 没有指定命令，所以容器自动执行 dockerfile 里的命令：`fixuid /bin/sh -c echo ${PASSWD} | sudo -S service ssh start && /bin/zsh `，会自动启动 ssh 服务后进入 zsh 终端。

如果想保持容器运行并退出终端，按 CTRL+P+Q；

如果想重新进入容器的 zsh 终端，执行 `docker attach containerID`。

#### 4、使用 docker 容器

本方案使用 ssh 连接容器，经过上面的配置，我们的容器已经启动并启动容器里的 ssh 服务了（可以在宿主机上通过 `docker ps -a` 查看容器状态），这个时候，我们就可以把容器当作一个只有你一个用户的服务器来使用了。

在任何能联通宿主机网络的地方（包括宿主机本身），通过 ssh 连接容器：

```bash
ssh -X USERNAME@ip -p port
# 在我们上面的例子中即为：
ssh -X docker@dd -p 49154
```

然后就可以登陆一台个人专属的“服务器”了，这个服务器已经提前配置好了需要的软件和工具，并且和宿主机的系统环境隔离，无论我们对容器系统环境做什么操作，都不会影响宿主服务器的系统。

而且通过 ssh 的 X11 图形转发，我们甚至可以在本机使用 docker 容器里的 firefox 浏览器。

#### 5、环境复用

经过上面的操作，我们有了一个比较完备的基础镜像，如果想要复用这个基础镜像，有三种方法：

1. 在要复用的宿主机上再次执行 docker build 命令用 dockerfile 生成镜像即可；

2. 用 docker save 命令把镜像打包，再在宿主机上用 docker load 加载即可，也可以结合 ssh 和 pv 命令，一个命令完成从一台机器到另一台机器的迁移：

   ```bash
   # 导出镜像并压缩
   docker save  imageName:tag | gzip > imageName-tag.tar.gz
   # 加载镜像
   gunzip -c  imageName-tag.tar.gz | docker load
   # 可以结合 ssh 和 pv 命令，一个命令完成从一个机器将镜像迁移到另一个机器，而且带进度条
   docker save <镜像名> | bzip2 | pv | ssh <用户名>@<主机名> 'cat | docker load'
   ```

3. 利用 docker hub 或者自己搭建的内网 Docker Registry 进行镜像分发；这个教程很多，这里就不赘述了。

有基础镜像还不够，有时候我们需要根据项目，在基础镜像上再加装其他的环境，这个时候也有三种方法：

1. 修改 dockerfile ，生成新的镜像，复用方法同上：

   这种方式适合改动有普适性的环境，镜像的生成历史明明白白，便于维护；

2. 直接在容器中改动，再用 docker commit 生成新的镜像，复用方法同上：

   这种方式不用写 dockerfile，比较方便，但相应的，镜像历史不清晰，不便于维护。

3. 直接在容器中改动，但不生成新的镜像，复用的时候直接将容器快照导入新机器作为新的镜像：

   ```bash
   # 导出容器并压缩
   docker export <容器名> | gzip > <容器名>.tar.gz
   # 导入容器为新的镜像
   gunzip -c <容器名>.tar.gz | docker import
   # 同样结合 ssh 和 pv 命令，写一个命令完成从一个机器将容器迁移为另一个机器的镜像，而且带进度条
docker export <容器名> | bzip2 | pv | ssh <用户名>@<主机名> 'cat | docker import'
   ```
   
   这种方式舍弃了镜像的所有历史信息，只保留当前容器的快照，无法维护，但是这种方式迁移的镜像体积要小很多。

### （二）sshfs 配置

上面我们利用 docker，有能力在新服务器上用一两行命令快速生成一套开发环境，这套开发环境自动帮我们配置好了常用的工具，可以直接使用，而且这套环境和宿主机隔离，不用担心和项目环境和宿主机的环境兼容问题。

那接下来就还有一个问题，就是数据和代码复用的问题。我们如何做到数据和代码只需要保存一份，就可以在各个服务器上调用？

举个例子，我的数据和代码都保存在 A 服务器的 /ssd/tianws 目录下，现在我在 B 服务器上用上面的方式启动了 docker 容器，里面有所有需要的开发环境，那我如何在 docker 里调用到 A 服务器上的数据和代码呢？

其实这个问题我之前的一篇文章已经讲的很清楚了，就是利用 sshfs 或者 ntfs，文章链接在这里：[炼丹师必备技能 ——Linux 挂载远程目录](https://zhuanlan.zhihu.com/p/141714106)。

我们可以用文章中的方法，在 docker 容器里挂载 sshfs 或者 ntfs 即可。但是还有更优雅的方法，那就是用 docker 的 vieux/sshfs 插件来实现我们的目标。

#### 1、安装 vieux/sshfs 插件

在 B 服务器上，通过下面的命令安装插件：

```bash
docker plugin install --grant-all-permissions vieux/sshfs
```

#### 2、通过 vieux/sshfs 驱动创建数据卷

```bash
docker volume create --driver vieux/sshfs \
    -o sshcmd=tianws@server-A:/ssd/tianws \
    -o password=yourpassword \
    dd-ssh-volume
    
# 查看 docker volume
docker volume ls
```

#### 3、启动容器时指定挂载这个数据卷

```bash
# 原本 A 服务器上的 docker run 命令：
docker run --gpus all --ipc=host  -p 49154:22 -it -u $(id -u):$(id -g) -h dd-docker --restart=always \
-v /ssd/tianws:/ssd/tianws \
pytorch1.5-cuda10.1-cudnn7

# 在 B 服务器上，修改 -v 选项，原本的本地路径更改为 docker volume 名称
docker run --gpus all --ipc=host  -p 49154:22 -it -u $(id -u):$(id -g) -h dd-docker --restart=always \
-v dd-ssh-volume:/ssd/tianws \
pytorch1.5-cuda10.1-cudnn7
```

现在，A 服务器的 /ssd/tianws 文件夹，就被挂载到 B 服务器 docker 容器里的 /ssd/tianws 目录下了，可以直接当本地文件夹来使用。

## 三、总结

网上用 docker 来配置开发环境的文章有很多，我也受益良多。但是我在实际的使用过程中，经常遇到权限管理混乱、无法图形可视化、不易维护等等问题，在摸索过程中，我一点点完善了我的 dockerfile，解决了之前遇到的问题，并且结合 sshfs 形成了一套开发环境搭建的 pipeline，用这套流程，开发环境、数据和代码就像放在 U 盘里一样，可以”即插即用“，很方便地用同样的环境调用不同机器的算力。

这套环境搭建完成后理论上可以配合任何你熟悉的远程开发 IDE，只要把 docekr 容器当作一台服务器来配置 IDE 就行了。

这篇文章是我自己的一个总结，在此分享给大家。

如果这篇文章对你有帮助，请点一个赞，如果大家需要的话，我会再更新第二、三篇，分享我常用的 IDE（VS CODE 和 Pycharm）结合这套开发环境的配置和使用方法，搭建一个完整的炼丹炉。

谢谢大家！

---

知乎镜像地址：[史上最细致深度学习炼丹炉配置（一）—— docker 和 sshfs 环境配置](https://zhuanlan.zhihu.com/p/145415086)

