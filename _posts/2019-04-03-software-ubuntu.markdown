---
layout:     post
title:      "Ubuntu 常用软件和设置"
subtitle:   ""
date:       2019-04-03 10:00:00
author:     "Tian"
categories: Skill
header-img: "img/post-bg-ubuntu.jpg"
header-mask: 0.4
catalog: true
tags:
    - 环境配置
    - Ubuntu
    - 工具
---

## 一、科学上网

**（1）V2Ray**

- 服务器：[安装脚本](<https://github.com/233boy/v2ray>)

- Windows：[V2RayN](<https://github.com/233boy/v2ray/wiki/V2RayN%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B>)

- MacOS：[V2RayX](<https://github.com/Cenmrev/V2RayX/releases>)、[V2RayU](https://github.com/yanue/V2rayU)

   `brew cask install v2rayx`

   `brew cask install v2rayu`

- Linux：[v2ray](<https://www.v2ray.com/>)：（或者图形化界面 [Qv2ray](https://qv2ray.github.io/getting-started/)）

```bash
sudo bash go.sh -p "socks5://192.168.146.204:1080" (更新脚本 sudo bash <(curl -L -s https://install.direct/go.sh))
sudo cp config.json /etc/v2ray/config.json
service v2ray start
# 之后可以使用 service v2ray start|stop|status|reload|restart|force-reload 控制 V2Ray 的运行。
```

**（2）proxychains-ng**

下载 [安装包](<https://github.com/rofl0r/proxychains-ng/releases>)（或者直接`sudo apt install proxychains4`）

```bash
# 安装
./configure --prefix=/usr --sysconfdir=/etc
make
[optional] sudo make install
[optional] sudo make install-config (installs proxychains.conf)
# if you dont install, you can use proxychains from the build directory like this: ./proxychains4 -f src/proxychains.conf telnet google.com 80

# 配置
sudo vim /etc/proxychains.conf # 编辑最后一行，其他按需编辑
cp /etc/proxychains.conf ~/.proxychains/proxychains.conf # 如果没有 root 权限的话，可以把配置文件放在家目录

# 卸载
sudo make install DESTDIR=foo
sudo make install-config DESTDIR=foo
## 根据 foo 路径删除对应文件
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

bash、tmux、vim、ranger 等美化见 [config](https://github.com/tianws/config)。

ranger 另外安装 xsel、mediainfo 和 highlight 可以拓展功能。

[参考1](https://zhuanlan.zhihu.com/p/26032793)（这个还写了很多解决Ubuntu问题的总结）、[参考2](https://www.jianshu.com/p/4bd2d9b1af41)

---

更新：Ubuntu 18.04 换了 gnome3，不用 unity 了，美化方案如下

美化 gnome 需要两个工具：gnome-tweak-tool 和 chrome-gnome-shell，前者是 Gnome 的设置工具，后者可以使我们直接在 https://extensions.gnome.org/ 的网页上安装 extension。安装这两个工具的命令如下：

```bash
sudo aptitude install gnome-tweak-tool
sudo aptitude install chrome-gnome-shell
```

确认 gnome-shell 版本后，就可以在 https://extensions.gnome.org/ 和 gnome-tweak-tool 上安装和管理拓展了。

安装的拓展：

- Frippery Move Clock，把时钟移到右边以给 top panel 留出位置
- Hide Activities，隐藏左上角活动按钮，可用 `sudo aptitude install gnome-shell-extension-hide-activities` 安装
- pixelsaver，标题栏移到 top panel 中，可用 `sudo aptitude install gnome-shell-extension-pixelsaver` 安装
- remove dropdown arrows，隐藏右上角的箭头，可用 `sudo aptitude install gnome-shell-extension-remove-dropdown-arrows` 安装
- Dash to dock，可设置的 Dash 栏
- Dynamic panel transparency，top panel 自动透明

重启 gnome-shell：按 Alt+F2，输入 r，按 Enter 运行。

参考[这篇](https://www.cnblogs.com/youxia/p/LinuxDesktop003.html)。

图标还是用 paper，主题用自带的已经很好看了。

登陆界面换壁纸，参考[这篇](https://blog.csdn.net/Briliantly/article/details/84207763)。

## 三、常用软件

#### 1、GUI软件

- redshfit-gtk：护眼（更新：18.04 自带，不需要安装了）

- 搜狗拼音：输入法

- chrome：浏览器

- typora：编辑器

- pycharm：IDE

- kazam：录屏软件

- peek：gif录制软件

- synergy：键鼠共享软件 [安装使用方法](<https://tianws.github.io/skill/2019/04/20/synergy/>)

- motrix：下载软件

- lepton：gist客户端

- vlc：视频播放器

- albert：快捷启动软件

- utools：快捷启动软件，插件更丰富

- tusk：印象笔记非官方客户端

- Indicator Stickynotes：便签

- 网易云音乐：官方客户端 推荐 [1.0.0版本](http://s1.music.126.net/download/pc/netease-cloud-music_1.0.0_amd64_ubuntu16.04.deb)

- flameshot：截图软件 [安装方法](https://github.com/lupoDharkael/flameshot)

  设置快捷键：设置->键盘->快捷键->自定义快捷键->命令`flameshot gui`,快捷键`Ctrl+Shift+J`
  
  文件名编辑：%F_%H-%M-%S
  
- station：网页聚合软件（同类型的还有 franz 和 rambox）

- imagine：图片压缩软件

- gThumb：图片处理软件

- picGo：图片上传软件

- gpick：取色工具（同类型还有 gcolor2 和 pick）

- pomodoro-indicator：番茄钟插件（更新：18.04 gnome 插件商店就有）

  ```bash
  sudo add-apt-repository ppa:atareao/atareao
  sudo apt-get update
  sudo apt-get install pomodoro-indicator
  ```
  
- hardinfo：系统配置查询软件

- mailspring：邮件客户端

  > 将旧机器 ~/.thunderbird 文件夹拷贝到新机器，可以无缝转移 thunderbird 邮箱的设置和邮件。
  >
  > 将旧机器 ~/.config/Mailspring 文件夹拷贝到新机器，也许也可以无缝转移邮箱的设置和邮件？

- dukto：局域网传输工具

- clipto.pro：剪切板同步工具

- sylashy：自动换壁纸工具

- Beyond Compare：代码比较工具

- 坚果云：同步盘（18.04 采用源码安装才安装成功，要显示图标需要安装 topicons plus 插件，[参考官网回复](http://help.jianguoyun.com/?p=4793)）

- MEGA：同步盘

- understand：看代码工具（[注册破解](https://www.macxin.com/archives/10419.html)）

#### 2、命令行软件

- htop：资源管理

- ranger：文件管理器

- feh：图片查看

- screenfetch：查看电脑信息工具

- jekyll：博客

  ```bash
  # jekyll：博客
  sudo apt-get install ruby-full build-essential zlib1g-dev
  gem install jekyll bundler
  npm install simple-jekyll-search # jekyll search

    # 测试博客
  cd my-blog-path
  bundle install # 根据 Gemfile 安装声明的依赖，并生成 Gemfile.lock 快照
  bundle exec jekyll serve # 启动 jekyll serve
  ```

#### 3、更多软件

- [20 Must-Have Ubuntu Apps in 2019](<https://www.fossmint.com/best-ubuntu-apps/>)
- [超赞的 Linux 软件](<https://alim0x.gitbooks.io/awesome-linux-software-zh_cn/content/>)

## 四、zsh

**安装**

```bash
## install zsh
sudo apt install zsh # install zsh
zsh --version # Expected result: zsh 5.1.1 or more recent.
cat /etc/shells # 检查有没有 zsh 没有的话执行 `sudo sh -c "echo $(which zsh) >> /etc/shells"`
chsh -s $(which zsh) # Make zsh your default shell
# Log out and login back again to use your new default shell.
echo $SHELL # Expected result: /bin/zsh or similar.
$SHELL --version # Expected result: 'zsh 5.1.1' or similar

## install oh-my-zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
# or
sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
```

**美化**

```bash
## 自定义 zsh 主题
cd ~/.oh-my-zsh
mkdir custom/themes
cp themes/robbyrussell.zsh-theme custom/themes/
vim custom/themes/robbyrussell.zsh-theme
# 第二行改成下面的内容
PROMPT='${ret_status}[%m] %{$fg[cyan]%}%~%{$reset_color%} $(git_prompt_info)'

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

## powerlevel9k 主题也不错，如果屏幕大可以尝试。
```

**插件和设置**

```bash
# 插件
## zsh-autosuggestions 命令提示 ctrl + f 采纳
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
plugins=(.. zsh-autosuggestions)
## zsh-syntax-highlighting 命令高亮
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
plugins=(.. zsh-syntax-highlighting)
## colored-man-pages
plugins=(.. colored-man-pages)
## z
plugins=(.. z)
z -x ## 删除无效路径

# 设置
vim ~/.zshrc
## 最后添加下面几行
unsetopt correct_all # 关闭自动修正
unsetopt AUTO_CD # 关闭自动 cd
setopt noautomenu  # 关闭选择模式，选择模式下 ctrl + f(forward) / b(backward) / p(previous) / n(next) 左右上下
setopt nomenucomplete
source /etc/zsh_command_not_found # zsh 提示
```

## 五、PT站

```bash
# 买的 vps 有 ipv6 地址，可以登录一些高校 PT 站
## 比如北邮 PT 站 https://bt.byr.cn/
##　用学校邮箱可以申请

# vps 开启 ipv6
## ssr 开启 ipv6
## config 里设置
"server": "0.0.0.0",
"server_ipv6": "::",

# ubuntu 下用 Deluge
sudo apt install deluge
sudo apt install deluged # 程序提示报错，所以再安了这个
## 设置里面把 DHT 关掉，否则key容易被盗
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

参考：[「Ubuntu 16.04 安装 IntelliJ IDEA 时快捷键冲突设置」](https://www.cnblogs.com/EasonJim/p/7858021.html)

解决快捷键冲突可以有如下方法：

1、直接修改 IDEA 的，但是不建议这么干，因为多平台时，或者去到另外一台电脑时，统一的快捷键能更快的适应新的开发环境。

2、通过修改系统默认的快捷键。

3、就这两种方式，对于哪种好一些，这个需要自己去权衡。

一、下面是 Ubuntu 下的快捷键冲突：

- 禁用阴影窗口操作，分配给 Ctrl+Alt+S（设置对话框）
- 更改或禁用锁定屏幕操作，分配给 Ctrl+Alt+L（重新格式化代码）
- 更改或禁用启动终端操作，分配给 Ctrl+Alt+T（环绕）（这个虽然经常使用，可以改成 Ctrl+G）
- 更改或禁用切换到工作区操作，分配给 Ctrl+Alt+Arrow Keys（导航，Ctrl+Alt+Shift+Arrow Keys 一起屏蔽）
- 禁用移动窗口动作，分配给 Alt+F7（查找用法）
- 更改或禁用调整窗口操作，分配给 Alt+F8（评估表达式） 

修改方法：系统设置 -> 键盘 -> 快捷键，找到上面对应的快捷键去掉。

二、修改搜狗输入法：

- 代码提示分配给 Ctrl+空格（打开输入法）（关掉，直接使用 Ctrl+Shift 进行切换打开）
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
- Ctrl+Alt+H（切换单词提示，在键盘 - 汉语设置）
- Ctrl+Alt+N（当前输入内容加入用户词典，在键盘 - 汉语设置）

三、其它

- 网易云音乐禁用全局设置

## 八、禁用访客登录

```bash
sudo vim /usr/share/lightdm/lightdm.conf.d/50-guest-wrapper.conf
# 追加 allow-guest=false
reboot
```

## 九、apt 找不到 arm64 源

同事的笔记本安装了 arm64 架构的软件，导致 `sudo apt update` 的时候出现以下问题：

```bash
N: Skipping acquire of configured file 'non-free/binary-arm64/Packages' as repository 'http://repository.spotify.com stable InRelease' doesn't support architecture 'arm64'
E: Failed to fetch http://archive.ubuntu.com/ubuntu/dists/xenial/main/binary-arm64/Packages  404  Not Found [IP: 91.189.88.161 80]
E: Failed to fetch http://archive.ubuntu.com/ubuntu/dists/xenial-updates/main/binary-arm64/Packages  404  Not Found [IP: 91.189.88.161 80]
E: Failed to fetch http://archive.ubuntu.com/ubuntu/dists/xenial-backports/main/binary-arm64/Packages  404  Not Found [IP: 91.189.88.161 80]
E: Failed to fetch http://archive.ubuntu.com/ubuntu/dists/xenial-security/main/binary-arm64/Packages  404  Not Found [IP: 91.189.88.161 80]
E: Some index files failed to download. They have been ignored, or old ones used instead.
```

解决方法：[参考](<https://askubuntu.com/questions/917081/how-to-get-rid-of-arm64-in-apt>)

查看架构：

```bash
$dpkg --print-architecture
amd64

$dpkg --print-foreign-architectures
i386
arm64
```

我的正常的主机，第二条只有 `i386`，没有 `arm64`，这个是导致问题的原因。

方法一：删除 `arm64` 架构（没有试过）

```bash
sudo dpkg --remove-architecture arm64
# 如果有下面的 error，说明有 arm64 的软件存在
# dpkg: error: cannot remove architecture 'arm64' currently in use by the database
## 可以查找并删除软件
dpkg -l | grep arm64
## 或者强制删除架构
sudo dpkg --force-architecture --remove-architecture arm64
## 接下来
sudo rm -rf /var/lib/apt/lists/*
sudo apt clean
sudo apt update
```

方法二：修改 apt 源（推荐）

```bash
sudo vim /etc/apt/sources.list
# 加上字段
deb [arch=amd64,i386] <url>
# 接下来
sudo rm -rf /var/lib/apt/lists/*
sudo apt clean
sudo apt update
```

## 十、apt-key 删除

添加私有 apt 源常常要如下操作：

```bash
echo "deb [arch=amd64] http://storage.googleapis.com/bazel-apt stable jdk1.8" | sudo tee /etc/apt/sources.list.d/bazel.list
curl https://bazel.build/bazel-release.pub.gpg | sudo apt-key add -
sudo apt-get update && sudo apt-get install bazel
```

如果要卸载：

```bash
sudo apt --purge bazel
sudo rm /etc/apt/sources.list.d/bazel.list
```

关键是 apt-key 不好删除，可以按照下面的方法删除：

```bash
curl https://bazel.build/bazel-release.pub.gpg | sudo apt-key --keyring /tmp/test add -
sudo apt-key --keyring /tmp/test list
## output
---------
pub   4096R/48457EE0 2016-05-24 [有效至：2020-05-23]
uid                  Bazel Developer (Bazel APT repository key) <bazel-dev@googlegroups.com>
sub   4096R/43FF45F9 2016-05-24 [有效至：2020-05-23]

sudo apt-key del 48457EE0
```

## 十一、将文件中的 tab 转换为空格

1、使用 sed:

`sed -i 's/^I/    /g' filename`，其中 `^I` 是在命令行中输入 `<Ctrl-V><Tab>` 来键入，将所有 tab 替换为 4 个空格。

2、使用 expand 和 unexpand 命令：

```bash
expand -t 4 filename > newfile    #将文件中的 tab 扩展为 4 个空格。
unexpand -t 4 filename > newfile  #将文件中的空格还原为 tab。
```

3、使用 vim:

（1）用 vim 替换命令：

`:%s/^I/    /g`，同样是输入 `<Ctrl-V><Tab>` 来键入 `^I`，同样将所有 tab 替换为 4 个空格。

（2）用vim retab命令：

```bash
# tab 替换为空格
:set ts=4 # ts 是 tabstop 的缩写，设 TAB 宽4个空格
:set expandtab
:%retab! # 加 ! 是用于处理非空白字符之后的 tab，即替换所有的 tab，不加 ! 则只处理行首的 tab

# 空格替换为tab
:set ts=4
:set noexpandtab
:%retab!
```

（3）对于新文件，在 .vimrc 中添加以下代码，重启 vim 即可按 tab 产生 4 个空格：

```bash
set ts=4
set expandtab
```

## 十二、设置软件开机启动

在命令行输入：

```bash
gnome-session-properties
```

然后设置即可。

---

更新：18.04 可直接在 gnome-tweak-tool 中设置。

## 十三、终端光标不显示解决方法

```bash
echo -e "\033[?25l"  # 隐藏光标
echo -e "\033[?25h"  # 显示光标
```

## 十四、为 APPImage 程序创建快捷方式

```bash
sudo vim /usr/share/applications/shoadowsocks.desktop # 以 shoadowsocks 举例

# 编辑
[Desktop Entry]
Type=Application
Version=V3.0.0alpha
Encoding=UTF-8
Name=shadowsocks-qt5
Comment=shadowsocks qt application
Icon=shadowsocks
Exec=/Path/to/your/Shadowsocks-Qt5-v3.0.0alpha-amd64.AppImage
Terminal=false
StartupNotify=true
Categories=Internet
MimeType=application/shadowsocks
```

## 十五、删除 ppa 并还原软件版本

首先，安装 `ppa-purge` 软件：

```bash
sudo apt install ppa-purge
```

安装好后，使用 `ppa-purge` 来移除：

```bash
# 比如用下列命令新增了一个 ppa
sudo add-apt-repository ppa:yogarine/eclipse/ubuntu
# 移除时用 ppa-purge 替换掉 add-apt-repository 即可，注意会连 ppa 安装的软件一起移除或者恢复版本
sudo ppa-purge ppa:yogarine/eclipse/ubuntu 
# 最后删除 /etc/apt/sources.list.d 下相应的 list 文件

# 如果忘了 ppa 链接，可这样找回
history | grep add-apt-repository
```

参考：

- [如何通过apt-get降级软件包？](https://ubuntuqa.com/article/137.html)
- [Ubuntu 用指令移除 PPA 儲存庫](https://www.arthurtoday.com/2011/05/ubuntu-ppa.html)
- [NEWBIE GUIDE: HOW TO USE PPA PURGE](http://www.ubuntubuzz.com/2012/02/newbie-guide-how-to-use-ppa-purge.html)

## 十六、连接 airpods pro

1. 安装 bluez 蓝牙堆栈

   ```bash
   sudo apt install bluez*
   ```

2. 在 `/etc/bluetooth/main.conf` 中设置 `ControllerMode = bredr`

3. `sudo /etc/init.d/bluetooth restart`

4. 尝试再次配对

参考：

- [配对Apple Airpods作为耳机](https://www.it-swarm.net/zh/sound/配对apple-airpods作为耳机/961146368/)

## 十七、Windows 和 Ubuntu 双系统时间异常

1. 为什么会异常

   ​        装了ubuntu双系统后回到windows，可能会发现自己windows的系统时间错了，大概会慢8小时的样子(不同地区不一样)。

   ​        简单来说就是因为ubuntu和windows计算时间的方式不一样。ubuntu是将UTC(协调世界时，本初子午线时间)记录在机器时间。ubuntu显示时间时将机器时间+8得到北京时间，显示在时间栏。windows将当地时间（例如，北京时间）直接保存到机器中，直接调用机器时间，直接显示。然后当ubuntu将本初子午线时间同步到你的机器时间后，这个机器时间加8正好就是北京时间。你再回到windows，windows把这个机器时间当作当地时间直接显示出来，就比北京慢了8小时。

2. 解决方案

   ```bash
   # 安装ntpdate：
   sudo apt-get install ntpdate
   
   # 设置校正服务器：
   sudo ntpdate time.windows.com
   
   # 设置硬件时间为本地时间：
   sudo hwclock --localtime --systohc
   ```

3. 参考：

   - [WIN10/Ubuntu双系统常见问题](https://zhuanlan.zhihu.com/p/62303240)