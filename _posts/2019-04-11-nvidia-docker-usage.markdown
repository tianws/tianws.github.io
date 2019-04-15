---
layout:     post
title:      "NVIDIA-Docker的使用"
subtitle:   ""
date:       2019-04-11 10:00:00
author:     "Tian"
categories: Skill
header-img: "img/post_2018_01_27.jpg"
catalog: true
tags:
    - 环境配置
    - Docker
---

## Requirements

[docker CE的安装](<https://tianws.github.io/skill/2019/04/09/docker/>)和[nvidia-docker的安装](<https://tianws.github.io/skill/2019/04/10/nvidia-docker/>)见前述博文。

如果程序要在Ubuntu 16.04 x86_64系统运行，可按下列步骤安装。

### 1. 安装docker

下载[docker安装包](<https://download.docker.com/linux/ubuntu/dists/xenial/pool/stable/amd64/>)，经过测试的版本为`docker-ce_18.09.4_3-0_ubuntu-xenial_amd64.deb`

```bash
sudo apt update
sudo apt upgrade
# 卸载可能的旧版本
sudo apt remove --purge docker docker-engine docker.io containerd runc docker-ce
sudo dpkg -i /path/to/package.deb
# 配置用户身份
sudo groupadd docker
sudo usermod -aG docker $USER
# 验证是否安装成功
docker run --rm hello-world
# docker设置为开机启动
sudo systemctl enable docker
```

>提速docker hub：
>
>国内docker hub下载很慢，可以通过配置镜像的方式提速.[参考](<https://www.cnblogs.com/stulzq/p/8628019.html>)
>
>本文使用[阿里云镜像加速服务](<https://cr.console.aliyun.com/>)
>
>```bash
># 注册阿里账户并登录
># 选择镜像加速器，查看自己的镜像加速器地址
>vim /etc/docker/daemon.json
># 编辑成以下：
>{
>    "registry-mirrors": ["https://xxx.mirror.aliyuncs.com"],
>    "runtimes": {
>        "nvidia": {
>            "path": "nvidia-container-runtime",
>            "runtimeArgs": []
>        }
>    }
>}
>sudo systemctl daemon-reload
>sudo systemctl restart docker
>```

### 2. 安装nvidia-docker

```bash
# 卸载可能的旧版本
docker volpeizhiume ls -q -f driver=nvidia-docker | xargs -r -I{} -n1 docker ps -q -a -f volume={} | xargs -r docker rm -f
sudo apt-get purge nvidia-docker
# 配置Repository
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | \
  sudo apt-key add -
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | \
  sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get update
# 安装指定版本的nvidia-docker
sudo apt-get install -y nvidia-docker2=2.0.3+docker18.09.4-1 nvidia-container-runtime=2.0.0+docker18.09.4-1
```

## Usage

### 1. 构建镜像

参考[caffe Dockerfile](<https://github.com/BVLC/caffe/tree/master/docker/gpu>)、[pytorch Dockerfile](<https://github.com/pytorch/pytorch/blob/master/docker/pytorch/Dockerfile>)、[maskrcnn Dockerfile](<https://github.com/facebookresearch/maskrcnn-benchmark/blob/master/docker/Dockerfile>)编写我们的Dockerfile。

```bash
# Dockerfile
ARG CUDA="9.0"
ARG CUDNN="7"

FROM nvidia/cuda:${CUDA}-cudnn${CUDNN}-devel-ubuntu16.04

RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# install basics
RUN apt-get update -y \
 && apt-get install -y apt-utils git curl ca-certificates bzip2 cmake tree htop bmon iotop g++ \
 && apt-get install -y libglib2.0-0 libsm6 libxext6 libxrender-dev

# # Install Miniconda
# RUN curl -so /miniconda.sh https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh \
#  && chmod +x /miniconda.sh \
#  && /miniconda.sh -b -p /miniconda \
#  && rm /miniconda.sh

# Install Miniconda \下载太慢，通过add的方式拷贝过去
ADD Miniconda3-latest-Linux-x86_64.sh /miniconda.sh

RUN chmod +x /miniconda.sh \
 && /miniconda.sh -b -p /miniconda \
 && rm /miniconda.sh

ENV PATH=/miniconda/bin:$PATH

# Create a Python 3.6 environment
RUN /miniconda/bin/conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/ \
 && /miniconda/bin/conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/ \
 && /miniconda/bin/conda config --set show_channel_urls yes \
 && /miniconda/bin/conda install -y conda-build \
 && /miniconda/bin/conda create -y --name py36 python=3.6.7 \
 && /miniconda/bin/conda clean -ya

ENV CONDA_DEFAULT_ENV=py36
ENV CONDA_PREFIX=/miniconda/envs/$CONDA_DEFAULT_ENV
ENV PATH=$CONDA_PREFIX/bin:$PATH
ENV CONDA_AUTO_UPDATE_CONDA=false

# install dlr_segmentation dependencies
RUN pip install numpy ninja pillow torch==0.4.1 torchvision matplotlib cityscapesscripts

WORKDIR /segmentation-dependence
```

>conda加速：[清华大学镜像站](<https://mirror.tuna.tsinghua.edu.cn/help/anaconda/>)
>
>```bash
>conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
>conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
>conda config --set show_channel_urls yes
>```

```bash
# pull基础镜像
docker pull nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04
# build镜像
docker build -t segmentation docker/
# 导出镜像并压缩
docker save segmentation | gzip > segmentation-latest.tar.gz
# 加载镜像命令
docker load -i segmentation-latest.tar.gz
# 可以结合ssh和pv命令，写一个命令完成从一个机器将镜像迁移到另一个机器，而且带进度条
docker save <镜像名> | bzip2 | pv | ssh <用户名>@<主机名> 'cat | docker load'
```

### 2. 使用镜像

```bash
# 验证镜像是否加载成功
docker images
# 添加别名方便使用
alias dockerrun='docker run --runtime=nvidia -it --rm -u $(id -u):$(id -g) -v $(pwd):$(pwd) -w $(pwd) --name=seg --ipc=host segmentation-dependence'
# --rm 容器停止后自动删除
# -u 指定容器的用户
# -v 挂载存储卷到容器的某个目录
# -w 指定容器工作目录
# --name 指定容器名字
# --ipc=host pytorch多进程需要更大内存时设置
# -t 让Docker分配一个伪终端（pseudo-tty）并绑定到容器的标准输入上
# -i 让容器的标准输入保持打开
```

### 3. 运行程序

```bash
dockerrun cmd args
```

### 4. 常用命令

**docker 查找和删除镜像和容器：**

```bash
docker ps # 常看当前运行的容器
docker ps -a # 查看所有容器
docker stop $(docker ps -a -q) # 停止所有容器
docker rm $(docker ps -a -q) # 删除所有未运行的容器
docker container prune # 删除所有未运行的容器
docker images # 查看所有镜像
docker image ls # 查看所有镜像
docker rmi $(docker images -q) # 移除所有本地镜像
docker rmi -f $(docker images -q) # 强制移除所有镜像
```

**docker run 命令参数：**

```bash
Usage: docker run [OPTIONS] IMAGE [COMMAND] [ARG...]    

-d, --detach=false         指定容器运行于前台还是后台，默认为false     
-i, --interactive=false   打开STDIN，用于控制台交互    
-t, --tty=false            分配tty设备，该可以支持终端登录，默认为false    
-u, --user=""              指定容器的用户    
-a, --attach=[]            登录容器（必须是以docker run -d启动的容器）  
-w, --workdir=""           指定容器的工作目录   
-c, --cpu-shares=0        设置容器CPU权重，在CPU共享场景使用    
-e, --env=[]               指定环境变量，容器中可以使用该环境变量    
-m, --memory=""            指定容器的内存上限    
-P, --publish-all=false    指定容器暴露的端口    
-p, --publish=[]           指定容器暴露的端口   
-h, --hostname=""          指定容器的主机名    
-v, --volume=[]            给容器挂载存储卷，挂载到容器的某个目录    
--volumes-from=[]          给容器挂载其他容器上的卷，挂载到容器的某个目录  
--cap-add=[]               添加权限，权限清单详见：http://linux.die.net/man/7/capabilities    
--cap-drop=[]              删除权限，权限清单详见：http://linux.die.net/man/7/capabilities    
--cidfile=""               运行容器后，在指定文件中写入容器PID值，一种典型的监控系统用法    
--cpuset=""                设置容器可以使用哪些CPU，此参数可以用来容器独占CPU    
--device=[]                添加主机设备给容器，相当于设备直通    
--dns=[]                   指定容器的dns服务器    
--dns-search=[]            指定容器的dns搜索域名，写入到容器的/etc/resolv.conf文件    
--entrypoint=""            覆盖image的入口点    
--env-file=[]              指定环境变量文件，文件格式为每行一个环境变量    
--expose=[]                指定容器暴露的端口，即修改镜像的暴露端口    
--link=[]                  指定容器间的关联，使用其他容器的IP、env等信息    
--lxc-conf=[]              指定容器的配置文件，只有在指定--exec-driver=lxc时使用    
--name=""                  指定容器名字，后续可以通过名字进行容器管理，links特性需要使用名字    
--net="bridge"             容器网络设置:  
                              bridge 使用docker daemon指定的网桥       
                              host    //容器使用主机的网络    
                              container:NAME_or_ID  >//使用其他容器的网路，共享IP和PORT等网络资源    
                              none 容器使用自己的网络（类似--net=bridge），但是不进行配置   
--privileged=false         指定容器是否为特权容器，特权容器拥有所有的capabilities    
--restart="no"             指定容器停止后的重启策略:  
                              no：容器退出时不重启    
                              on-failure：容器故障退出（返回值非零）时重启   
                              always：容器退出时总是重启    
--rm=false                 指定容器停止后自动删除容器(不支持以docker run -d启动的容器)    
--sig-proxy=true           设置由代理接受并处理信号，但是SIGCHLD、SIGSTOP和SIGKILL不能被代理 
--ipc                      设置ipc命名空间，共享内存可以提高进程数据的交互速度：
							   container:<name|id>：用其他container的ipc命名空间
							   host：用host的ipc命名空间
```

**docker tag的最佳实践：**

假设我们现在发布了一个镜像 myimage，版本为 v1.9.1。那么我们可以给镜像打上四个 tag：1.9.1、1.9、1 和 latest。

我们可以通过 docker tag 命令方便地给镜像打 tag。

```bash
docker tag myimage-v1.9.1 myimage:1
docker tag myimage-v1.9.1 myimage:1.9
docker tag myimage-v1.9.1 myimage:1.9.1
docker tag myimage-v1.9.1 myimage:latest
```

过了一段时间，我们发布了 v1.9.2。这时可以打上 1.9.2 的 tag，并将 1.9、1 和 latest 从 v1.9.1 移到 v1.9.2。

命令为：

```bash
docker tag myimage-v1.9.2 myimage:1
docker tag myimage-v1.9.2 myimage:1.9
docker tag myimage-v1.9.2 myimage:1.9.2
docker tag myimage-v1.9.2 myimage:latest
```

之后，v2.0.0 发布了。这时可以打上 2.0.0、2.0 和 2 的 tag，并将 latest 移到 v2.0.0。

命令为：

```bash
docker tag myimage-v2.0.0 myimage:2
docker tag myimage-v2.0.0 myimage:2.0
docker tag myimage-v2.0.0 myimage:2.0.0
docker tag myimage-v2.0.0 myimage:latest
```

这种 tag 方案使镜像的版本很直观，用户在选择非常灵活：

1. myimage:1 始终指向 1 这个分支中最新的镜像。
2. myimage:1.9 始终指向 1.9.x 中最新的镜像。
3. myimage:latest 始终指向所有版本中最新的镜像。
4. 如果想使用特定版本，可以选择 myimage:1.9.1、myimage:1.9.2 或 myimage:2.0.0。

## 参考

- [当Docker遇见Deep Learning](<https://cloud.tencent.com/developer/news/273473>)
- [使用 Docker 安装深度学习环境](<https://zhuanlan.zhihu.com/p/31772428>)
- [docker docs](<https://docs.docker.com/get-started/>)
- [Docker — 从入门到实践](<https://yeasy.gitbooks.io/docker_practice/>)
- [tag 使用最佳实践](<https://www.ibm.com/developerworks/community/blogs/132cfa78-44b0-4376-85d0-d3096cd30d3f/entry/%E9%95%9C%E5%83%8F%E5%91%BD%E5%90%8D%E7%9A%84%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5_%E6%AF%8F%E5%A4%A95%E5%88%86%E9%92%9F%E7%8E%A9%E8%BD%AC_Docker_%E5%AE%B9%E5%99%A8%E6%8A%80%E6%9C%AF_18?lang=en>)
- [Docker 常用命令与操作](<https://www.jianshu.com/p/adaa34795e64>)

