---
layout:     post
title:      "Docker空间告急？一键迁移数据目录，还你一个清爽的根分区！"
subtitle:   "“/var/lib/docker” 肥大症的终极解决方案"
date:       2025-09-10 10:00:00
author:     "Tian"
categories: Skill
header-img: "img/post-bg-docker.jpg"
header-mask: 0.8
catalog: true
tags:
    - Docker
    - Linux
---

## 一、问题的由来

“磁盘空间不足！”

相信每个在Linux上深度使用Docker的开发者或运维人员，都或多或少被这个红色警报惊吓过。随着镜像和容器的日积月累，默认位于 `/var/lib/docker` 的数据目录会像滚雪球一样越来越大，最终将根分区（`/`）撑满，导致各种服务异常。

我的服务器最近就亮起了红灯。`/` 目录的可用空间岌岌可危。检查发现，罪魁祸首正是 `/var/lib/docker` 这个“巨无霸”。

幸运的是，我有一块挂载在 `/home/largedata` 的大容量数据盘。于是，一个清晰的计划浮出水面：将 Docker 的“家”从拥挤的市中心（`/`）搬到宽敞的郊区（`/home/largedata`），一劳永逸地解决空间焦虑。

## 二、两步走策略：先治标，后治本

面对这个问题，我采取了“先急救，后根治”的策略。

### **第一步：紧急清理（治标）**

在“搬家”之前，得先给“旧房子”做个大扫除，释放一些空间，确保系统能正常呼吸。Docker 自带的 `prune` 命令就是最好的清洁工具。

> **警告：** 下面的命令会删除未使用的资源，请在执行前确认没有需要保留的已停止容器或悬空镜像。

1.  **最强力的自动清理命令：**
    这个命令会进行最全面的清理，包括所有未被使用的镜像（不仅仅是悬空的）。

    ```bash
    sudo docker system prune -a --volumes
    ```

    *   `-a` (`--all`)：会删除所有当前没有被任何容器使用的镜像。
    *   `--volumes`：会删除所有未被任何容器使用的卷（**注意：如果有些卷您以后还想用，请不要加这个参数，否则里面的数据会丢失！**）

2.  **如果不想那么激进，可以分步清理：**

    *   **删除已停止的容器：**
        ```bash
        sudo docker container prune
        ```
    *   **删除悬空镜像（dangling images）：**
        ```bash
        sudo docker image prune
        ```
    *   **删除所有未使用的镜像：**
        ```bash
        sudo docker image prune -a
        ```
    *   **删除未使用的卷（请谨慎！）：**
        ```bash
        sudo docker volume prune
        ```
    *   **删除未使用的网络：**
        ```bash
        sudo docker network prune
        ```

执行完这些清理命令后，`/var/lib/docker` 目录的大小会显著减少，为接下来的迁移操作提供了宝贵的缓冲空间。

### **第二步：迁移 Docker 数据目录（治本）**

这是最核心、最能一劳永逸解决问题的步骤。我们将告诉 Docker Daemon（Docker 的后台服务）以后去 `/home/largedata/docker` 存取数据，而不是默认的 `/var/lib/docker`。

**操作步骤如下：**

1.  **创建新的 Docker 数据目录：**
    在您的大硬盘上创建一个专门给 Docker 使用的文件夹。

    ```bash
    sudo mkdir -p /home/largedata/docker
    ```

2.  **停止 Docker 服务：**
    在移动文件之前，必须完全停止 Docker，防止数据在迁移过程中损坏。

    ```bash
    sudo systemctl stop docker
    sudo systemctl stop docker.socket
    ```

3.  **配置 Docker Daemon：**
    这是最关键的一步。我们将通过修改（或创建）Docker 的配置文件 `/etc/docker/daemon.json` 来指定新的数据目录。

    *   使用您熟悉的编辑器打开该文件（如果不存在，这个命令会自动创建它）：
        ```bash
        sudo nano /etc/docker/daemon.json
        ```
    *   在文件中输入以下内容。如果文件已有内容，请确保添加 `"data-root"` 键值对，并注意 JSON 格式的逗号。
        ```json
        {
          "data-root": "/home/largedata/docker"
        }
        ```
    *   保存并关闭文件。

4.  **移动现有的 Docker 数据：**
    现在，我们将旧目录中的所有内容原封不动地复制到新目录。推荐使用 `rsync` 而不是 `cp`，因为它能更好地处理权限和硬链接，效率也更高。

    ```bash
    sudo rsync -avxS /var/lib/docker/ /home/largedata/docker/
    ```

    *   `-a`：归档模式，保留权限、所有者等信息。
    *   `-v`：显示详细过程。
    *   `-x`：不跨越文件系统边界。
    *   `-S`：处理稀疏文件。
    *   **注意：** 源目录 `/var/lib/docker/` 后面的 `/` 很重要，它表示复制目录下的内容，而不是目录本身。

5.  **备份并重命名旧目录：**
    为了安全起见，我们先不直接删除旧目录，而是将其重命名。这样如果出现问题，还能快速恢复。

    ```bash
    sudo mv /var/lib/docker /var/lib/docker.old
    ```

6.  **重启 Docker 服务并验证：**

    *   重新加载 systemd 配置，让它知道服务配置已更改：
        ```bash
        sudo systemctl daemon-reload
        ```
    *   启动 Docker 服务：
        ```bash
        sudo systemctl start docker
        ```
    *   检查 Docker 是否正常运行，并确认数据目录已更改。执行以下命令：
        ```bash
        docker info | grep "Docker Root Dir"
        ```
    *   如果一切顺利，您应该会看到如下输出：
        ```
        Docker Root Dir: /home/largedata/docker
        ```
    *   您还可以运行 `docker ps -a` 和 `docker images` 等命令，看看之前的容器和镜像是否都还在。

7.  **确认无误后，删除旧数据目录：**
    在确认 Docker 已经使用新目录并且所有数据都正常之后，您就可以安全地删除旧的备份目录，彻底释放根分区的空间了。

    ```bash
    sudo rm -rf /var/lib/docker.old
    ```

    **警告：** 在执行此命令前，请务必再三确认您的容器、镜像和数据都完好无损！

## 三、总结

通过以上“先清理、后迁移”的两步操作，不仅可以解决当前根分区爆满的燃眉之急，还能通过将 Docker 数据目录永久迁移到大容量磁盘的方式，彻底避免未来再次发生同样的问题。这是管理 Docker 存储的最佳实践，强烈推荐给所有遇到类似困扰的朋友。
