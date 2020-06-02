---
layout:     post
title:      "Docker 容器内用户管理"
subtitle:   "给 Docker 容器设置合适的用户和权限"
date:       2020-05-29 10:00:00
author:     "Tian"
categories: Skill
header-img: "img/post-bg-docker.jpg"
header-mask: 0.8
catalog: true
tags:
    - 环境配置
    - Docker
---

## 一、问题

默认情况下，容器中的进程以 root 用户执行，并且这个 root 用户和宿主机中的 root 是同一个用户，这意味着：

1. 容器中运行的进程，在合适的机会下，有权限控制宿主机中的一切；
2. 容器中运行的进程，以 root 用户执行，外界很难追溯到真实的用户；
3. 容器进程生成的文件，是 root 用户所有，普通用户没有权限读取修改。

总之，这种方式是很不方便且很不安全的。

## 二、解决方案

#### 1、在容器里中新建并切换用户

最直接的方案是在容器里新建一个非 root 用户，并切换，dockerfile 如下：

```bash
RUN useradd --create-home --no-log-init --shell /bin/bash docker \
&& adduser docker sudo \
&& echo 'docker:123456' | chpasswd

USER docker:docker
```

这段代码新建了一个 docker 用户，并加入 sudo 组，设置其密码为 `123456`。

#### 2、用 fixuid 库修改容器里非 root 用户的 uid 和 gid

用上面的代码新建非 root 用户后，该用户的 uid 和 gid 一般是 1000:1000。

 docker 和宿主机共享一套内核，内核控制的 uid 和 gid 则仍然只有一套（详见[这篇文章](https://www.cnblogs.com/sparkdev/p/9614164.html)）。换句话说，我们在容器里以新建的 docker 用户（uid 1000）执行进程，宿主机会认为该进程是宿主机上 uid 为 1000 的用户执行的，而这个用户不一定是我们的账户，相当于我们冒名顶替了别人的用户，这样上面的问题 2 也不能得到解决。

要解决这个问题，可以在新建用户的时候指定 uid 为我们用户的 uid（比如 1002）：

```bash
RUN addgroup --gid 1002 docker && \
    adduser --uid 1002 --ingroup docker --home /home/docker --shell /bin/sh  --gecos "" docker
```

但是在给别人用这个镜像的时候，uid 可能又不一样，这样写死很不方便，所以更好的解决方法是用 [fixuid](https://github.com/boxboat/fixuid)，来在容器启动的时候切换 uid：

```bash
# 新建用户代码和上面一样
RUN useradd --create-home --no-log-init --shell /bin/bash docker \
&& adduser docker sudo \
&& echo 'docker:123456' | chpasswd

# 安装配置 fixuid
RUN USER=docker && \
    GROUP=docker && \
    curl -SsL https://github.com/boxboat/fixuid/releases/download/v0.4.1/fixuid-0.4.1-linux-amd64.tar.gz | tar -C /usr/local/bin -xzf - && \
    chown root:root /usr/local/bin/fixuid && \
    chmod 4755 /usr/local/bin/fixuid && \
    mkdir -p /etc/fixuid && \
    printf "user: $USER\ngroup: $GROUP\n" > /etc/fixuid/config.yml

USER docker:docker
ENTRYPOINT ["fixuid"]
```

在启动容器的时候加上 `-u $(id -u):$(id -g)` 指定 uid 和 gid 即可：

```bash
docker run --rm -it -u $(id -u):$(id -g) <image name> sh
```

现在我们再启动容器，容器中的进程就是以我们的用户执行的了。

## 参考

- [理解 docker 容器中的 uid 和 gid](<https://www.cnblogs.com/sparkdev/p/9614164.html>)
- [fixuid github 仓库](https://github.com/boxboat/fixuid)

