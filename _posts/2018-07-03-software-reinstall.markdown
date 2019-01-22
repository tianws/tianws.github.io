---
layout:     post
title:      "ubuntu重装之「软件配置」"
subtitle:   "ubuntu重装——篇二"
date:       2018-07-03 10:00:00
author:     "Tian"
categories: Skill
header-img: "img/post_2018_01_27.jpg"
catalog: true
tags:
    - 环境配置
---

## 一、科学上网

**（1）[ssr](<https://github.com/the0demiurge/CharlesScripts/blob/master/charles/bin/ssr>)**

install path : ~/.local/bin

**（2）proxychains**

```bash
sudo apt install proxychains
sudo vim /etc/proxychains.conf # 编辑最后一行
```

**（3）~~[gfwlist](https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt)~~**

**（4）~~pac~~**

```bash
pip install genpac
genpac --pac-proxy "SOCKS5 127.0.0.1:8606" --gfwlist-proxy="SOCKS5 127.0.0.1:1080" --gfwlist-url=https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt --output="autoproxy.pac"
```

[点击查看更多genpac参数](https://github.com/JinnLynn/genpac#usage)

**（5）更新**

由于gfwlist很多地址没有收录，推荐用白名单代理。

[项目地址](https://github.com/breakwa11/gfw_whitelist)

## 二、美化

```bash
sudo apt-get install unity-tweak-tool
sudo apt-get install gnome-tweak-tool
# 主题 flatabulous-theme
sudo add-apt-repository ppa:noobslab/themes
sudo apt-get update
sudo apt-get install arc-flatabulous-theme
# 图标 paper
sudo add-apt-repository ppa:snwh/pulp
sudo apt-get update
sudo apt-get install paper-icon-theme
# power-line
sudo apt install powerline
```

bash、tmux、vim、range等美化见[config](https://github.com/tianws/config)。

[参考1](https://zhuanlan.zhihu.com/p/26032793)（这个还写了很多解决Ubuntu问题的总结）、[参考2](https://www.jianshu.com/p/4bd2d9b1af41)

## 三、常用软件

#### 1、GUI软件

- redshfit-gtk：护眼
- 搜狗拼音：输入法
- chrome：浏览器
- typora：编辑器
- pycharm：IDE

#### 2、命令行软件

- htop：资源管理

- ranger：文件管理器

- feh：图片查看


## 四、zsh

```bash
## install zsh
sudo apt install zsh # install zsh
zsh --version # Expected result: zsh 5.1.1 or more recent.
cat /etc/shells # 检查有没有zsh 没有的话执行 `sudo sh -c "echo $(which zsh) >> /etc/shells"`
chsh -s $(which zsh) # Make zsh your default shell
# Log out and login back again to use your new default shell.
echo $SHELL # Expected result: /bin/zsh or similar.
$SHELL --version # Expected result: 'zsh 5.1.1' or similar

## install oh-my-zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
# or
sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"

## 自定义zsh主题
cd ~/.oh-my-zsh
mkdir custom/themes
cp themes/robbyrussell.zsh-theme custom/themes/
vim custom/themes/robbyrussell.zsh-theme
# 第二行改成下面的内容
PROMPT='${ret_status}[%m] %{$fg[cyan]%}%~%{$reset_color%} $(git_prompt_info)'
```

```
# 简单说明
%n The username
%m The computer's hostname(truncated to the first period)
%M The computer's hostname
%l The current tty
%? The return code of the last-run application.
%# The prompt based on user privileges
# 时间
%T System time(HH:MM)
%* System time(HH:MM:SS)
%D System date(YY-MM-DD)
# 目录
%~ The current working directory.
If you are in you are in your $HOME, this will be replaced by ~.
%d The current working directory.
#　设置颜色
%{$fg[red]%}
%{$fg_bold[red]%}　# 加粗
%{$reset_color%}　# 重置颜色
```

更新：powerlevel9k主题也不错，如果屏幕大可以尝试。

```bash
## 插件
# zsh-autosuggestions 命令提示 ctrl + f 采纳
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
plugins=(.. zsh-autosuggestions)
# colored-man-pages
plugins=(.. colored-man-pages)
## 设置
vim ~/.zshrc
## 最后添加下面几行
unsetopt correct_all # 关闭自动修正
unsetopt AUTO_CD # 关闭自动cd
setopt noautomenu  # 关闭选择模式，选择模式下ctrl + f(forward) / b(backward) / p(previous) / n(next)左右上下
setopt nomenucomplete

```

## 五、PT站

```bash
## 买的vps有ipv6地址，可以登录一些高校PT站
## 比如北邮PT站 https://bt.byr.cn/
##　用学校邮箱可以申请

## vps开启ipv6
# ssr开启ipv6
# config里设置
"server": "0.0.0.0",
"server_ipv6": "::",

## ubuntu下用Deluge
sudo apt install deluge
sudo apt install deluged # 程序提示报错，所以再安了这个
## 设置里面把DHT关掉，否则key容易被盗
## 设置对应的代理即可
```

