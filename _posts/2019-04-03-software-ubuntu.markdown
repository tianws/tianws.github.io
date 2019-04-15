---
layout:     post
title:      "Ubuntu软件和系统配置"
subtitle:   ""
date:       2019-04-03 10:00:00
author:     "Tian"
categories: Skill
header-img: "img/post_2018_01_27.jpg"
catalog: true
tags:
    - 环境配置
---

## 一、科学上网

**（1）V2Ray**

- 服务器：[安装脚本](<https://github.com/233boy/v2ray>)

- Windows：[V2RayN](<https://github.com/233boy/v2ray/wiki/V2RayN%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B>)

- MacOS：[V2RayX](<https://github.com/Cenmrev/V2RayX/releases>) :

   `brew cask install v2rayx`

- Linux：[v2ray](<https://www.v2ray.com/>)：

```bash
sudo bash go.sh -p "socks5://192.168.146.204:1080" (更新脚本 sudo bash <(curl -L -s https://install.direct/go.sh))
sudo cp config.json /etc/v2ray/config.json
service v2ray start
# 之后可以使用 service v2ray start|stop|status|reload|restart|force-reload 控制 V2Ray 的运行。
```

**（2）proxychains-ng**

下载[安装包](<https://github.com/rofl0r/proxychains-ng/releases>)

```bash
# 安装
./configure --prefix=/usr --sysconfdir=/etc
make
[optional] sudo make install
[optional] sudo make install-config (installs proxychains.conf)
# if you dont install, you can use proxychains from the build directory like this: ./proxychains4 -f src/proxychains.conf telnet google.com 80

# 配置
sudo vim /etc/proxychains.conf # 编辑最后一行，其他按需编辑

# 卸载
sudo make install DESTDIR=foo
sudo make install-config DESTDIR=foo
## 根据foo路径删除对应文件
```

**（3）PAC**

```bash
# [gfwlist](https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt)

# [gfw_whitelist](https://raw.githubusercontent.com/breakwa11/gfw_whitelist/master/whiteiplist.pac)

# [genpac](https://github.com/JinnLynn/genpac#usage)
pip install genpac
genpac --pac-proxy "SOCKS5 127.0.0.1:8606" --gfwlist-proxy="SOCKS5 127.0.0.1:1080" --gfwlist-url=https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt --output="autoproxy.pac"
```

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

- jekyll：博客

  ```bash
  # jekyll：博客
  sudo apt-get install ruby-full build-essential zlib1g-dev
  gem install jekyll bundler
  gem install jekyll-paginate
  ```



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

powerlevel9k主题也不错，如果屏幕大可以尝试。

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

## 六、耳机没声音

```bash
sudo apt install pavucontrol
pavucontrol
# 配置：
## HDA NVidia-侧写：关
## 内置音频-侧写：模拟立体声双工
# 输出设备：
## 内置音频-模拟立体声：模拟耳机
```

## 七、快捷键设置

参考：[Ubuntu 16.04安装IntelliJ IDEA时快捷键冲突设置](https://www.cnblogs.com/EasonJim/p/7858021.html)

解决快捷键冲突可以有如下方法：

1、直接修改IDEA的，但是不建议这么干，因为多平台时，或者去到另外一台电脑时，统一的快捷键能更快的适应新的开发环境。

2、通过修改系统默认的快捷键。

3、就这两种方式，对于哪种好一些，这个需要自己去权衡。

一、下面是Ubuntu下的快捷键冲突：

- 禁用阴影窗口操作，分配给Ctrl+Alt+S（设置对话框）
- 更改或禁用锁定屏幕操作，分配给Ctrl+Alt+L（重新格式化代码）
- 更改或禁用启动终端操作，分配给Ctrl+Alt+T（环绕）（这个虽然经常使用，可以改成Ctrl+G）
- 更改或禁用切换到工作区操作，分配给Ctrl+Alt+Arrow Keys（导航，Ctrl+Alt+Shift+Arrow Keys一起屏蔽）
- 禁用移动窗口动作，分配给Alt+F7（查找用法）
- 更改或禁用调整窗口操作，分配给Alt+F8（评估表达式） 

修改方法：系统设置->键盘->快捷键，找到上面对应的快捷键去掉。

二、修改搜狗输入法：

- 代码提示分配给Ctrl+空格（打开输入法）（关掉，直接使用Ctrl+Shift进行切换打开）
- Ctrl+Shift+F（简繁切换）
- Ctrl+,（切换搜狗输入法）
- Ctrl+5（重新载入配置）
- Ctrl+Alt+B（切换虚拟键盘）
- Shift+Space（切换全角）
- Ctrl+.（切换全角标点）
- Ctrl+Alt+S（保存配置及输入历史）
- Ctrl+Alt+P（切换嵌入预编辑字符串）
- Shift+Tab（上一个候选词）
- Tab（下一个候选词）
- Ctrl+Alt+H（切换单词提示，在键盘-汉语设置）
- Ctrl+Alt+N（但钱输入内容加入用户词典，在键盘-汉语设置）

三、其它

- 网易云音乐禁用全局设置

## 八、禁用访客登录

```bash
sudo vim /usr/share/lightdm/lightdm.conf.d/50-ubuntu.conf
# 追加 allow-guest=false
reboot
```

