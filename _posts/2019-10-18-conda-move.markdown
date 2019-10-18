---
layout:     post
title:      "Conda环境迁移"
subtitle:   ""
date:       2019-10-18 10:00:00
author:     "Tian"
categories: Skill
header-img: "img/post-bg-terminal.jpg"
header-mask: 0.7
catalog: true
tags:
    - 环境配置
    - 工具
typora-root-url: ../
---

> 内容来自[conda官方博文](https://www.anaconda.com/moving-conda-environments/)

Conda是著名的包管理器和虚拟环境管理器。

在配置完项目环境，并编写和测试代码后，您可能希望将其移至另一台计算机。

Conda提供了多种保存和移动环境的方法。

## Clone

在本地，conda可以方便地创建环境的快照或者备份：

```bash
conda create --name snapshot --clone myenv
```

## Spec List

如果需要在具有**相同操作系统**的计算机之间复制环境，则可以生成`spec list`。  

**生成`spec list`文件：**

```bash
conda list --explicit > spec-list.txt
```

**重现环境：**

```bash
conda create  --name python-course --file spec-list.txt
```

## Environment.yml

也可以使用– `-export`选项生成一个`environment.yml`文件，以在**不同的平台和操作系统之间**复现项目环境。 `spec list`文件和`environment.yml`文件之间的区别在于：`environment.yml`文件不针对特定操作系统，并且使用YAML格式。`environment.yml`仅列出了软件包名称，由conda基于软件包的名称构建环境。 另一个区别是 `-export`还包括使用pip安装的软件包，而`spec list`则没有。

 **导出`environment.yml`文件：**

```bash
conda env export > environment.yml
```

> 注意：如果当前路径已经有了environment.yml文件，conda会重写这个文件

**重现环境：**

```bash
conda env create -f environment.yml
```

## Conda Pack

`Conda-pack`是一个命令行工具，用于打包conda环境，其中包括该环境中安装的软件包的所有二进制文件。 当您想在有限或没有网络访问的系统中重现环境时，此功能很有用。上面的方法均从其各自的存储库下载软件包以创建环境。而此方法不需要。**注意，conda-pack指定平台和操作系统，目标计算机必须具有与源计算机相同的平台和操作系统。**

要安装conda-pack，请确保您位于root或base环境中，以便conda-pack在子环境中可用。Conda-pack可通过conda-forge或者PyPI安装。

**conda-forge:**

```bash
conda install -c conda-forge conda-pack
```

**PyPI:**

```bash
pip install conda-pack
```

**打包一个环境：**

```bash
# Pack environment my_env into my_env.tar.gz
conda pack -n my_env

# Pack environment my_env into out_name.tar.gz
conda pack -n my_env -o out_name.tar.gz

# Pack environment located at an explicit path into my_env.tar.gz
conda pack -p /explicit/path/to/my_env
```

**重现环境：**

```bash
# Unpack environment into directory `my_env`
mkdir -p my_env
tar -xzf my_env.tar.gz -C my_env

# Use Python without activating or fixing the prefixes. Most Python
# libraries will work fine, but things that require prefix cleanups
# will fail.
./my_env/bin/python

# Activate the environment. This adds `my_env/bin` to your path
source my_env/bin/activate

# Run Python from in the environment
(my_env) $ python

# Cleanup prefixes from in the active environment.
# Note that this command can also be run without activating the environment
# as long as some version of Python is already installed on the machine.
(my_env) $ conda-unpack
```

## Summary

Conda提供了多种复制项目环境的方法。 创建环境的克隆可以提供定制的基本环境或该环境的快照。`spec list`和`conda-pack`可创建特定于平台和操作系统的环境副本。 其中`spec list`使用网络来下载环境中特定的软件包，而`conda-pack`可以打包包括软件包二进制文件在内的整个环境，这在带宽不足或没有网络的情况下很有用。 conda导出`environment.yml`的方式非常适合在不同平台和操作系统之间重新创建环境。

更多详情请见 [docs.conda.io](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#create-env-from-file) 和 [conda-pack project page](https://conda.github.io/conda-pack/).