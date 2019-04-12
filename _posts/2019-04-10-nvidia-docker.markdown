---
layout:     post
title:      "NVIDIA-Docker的安装和配置"
subtitle:   ""
date:       2019-04-10 10:00:00
author:     "Tian"
categories: Skill
header-img: "img/post_2018_01_27.jpg"
catalog: true
tags:
    - 环境配置
    - Docker
---

## 先决条件

运行安装nvidia-docker 2.0需要以下先决条件：

1. GNU/Linux x86_64 with kernel version > 3.10
2. Docker >= 1.12
3. NVIDIA GPU with Architecture > Fermi (2.1)
4. [NVIDIA drivers](http://www.nvidia.com/object/unix.html) ~= 361.93 (untested on older versions)

你的GPU驱动可能限制你能运行的CUDA镜像 (见 [CUDA requirements](https://github.com/NVIDIA/nvidia-docker/wiki/CUDA#requirements))

Docker CE 支持`x86_64`(或者`amd64`)，`armhf`，`arm64`，`s390x` (IBM Z), 和 `ppc64le` (IBM Power) 架构。

## 卸载nvidia-docker 1.0

在继续下一步之前，必须完全卸载nvidia-docker 1.0版本。而且必须`stop`和`remove`所有的nvidia-docker 1.0启动的容器。

#### Ubuntu distributions

```bash
docker volpeizhiume ls -q -f driver=nvidia-docker | xargs -r -I{} -n1 docker ps -q -a -f volume={} | xargs -r docker rm -f
sudo apt-get purge nvidia-docker
```

## 安装nvidia-docker 2.0

**确保你已经安装了[NVIDIA驱动](<https://github.com/NVIDIA/nvidia-docker/wiki/Frequently-Asked-Questions#how-do-i-install-the-nvidia-driver>)和[docker](<https://docs.docker.com/install/>)支持的[版本](<https://github.com/NVIDIA/nvidia-docker/wiki/Frequently-Asked-Questions#which-docker-packages-are-supported>)**（见上面的先决条件）

**如果你有修改`/etc/docker/daemon.json`，`nvidia-docker2`可能会覆盖它**

#### Ubuntu distributions

1. 按照[文档](<https://nvidia.github.io/nvidia-docker/>)安装配置Repository：

```bash
# In order to setup the nvidia-docker repository for your distribution, follow the instructions below.
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | \
  sudo apt-key add -
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | \
  sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get update

# In order to update the nvidia-docker repository key for your distribution, follow the instructions below.
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | \
  sudo apt-key add -
```

2. 安装`nvidia-docker2`并且更新`Docker daemon`配置：

```bash
sudo apt-get install nvidia-docker2
sudo pkill -SIGHUP dockerd
```

#### 使用老版本的docker

用`apt-cache madison nvidia-docker2 nvidia-container-runtime` 或者 `yum search --showduplicates nvidia-docker2 nvidia-container-runtime` 列出可用的版本，然后在安装时指定版本，例如：

```bash
sudo apt-get install -y nvidia-docker2=2.0.1+docker1.12.6-1 nvidia-container-runtime=1.1.0+docker1.12.6-1
```

## 验证

使用时必须选择`nvidia`作为runtime：

```bash
docker run --runtime=nvidia --rm nvidia/cuda nvidia-smi
```

## 参考

[官方文档](<https://github.com/NVIDIA/nvidia-docker/wiki/Installation-(version-2.0)>)