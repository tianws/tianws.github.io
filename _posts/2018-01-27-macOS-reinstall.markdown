---
layout:     post
title:      "MacOS环境配置"
subtitle:   "重装MacBook系统"
date:       2018-01-27 10:00:00
author:     "Tian"
categories: Skill
header-img: "img/post_2018_01_27.jpg"
catalog: true
tags:
    - 环境配置
    - MacOS
---

macbook用了一年多了，之前安装软件没注意，现在发现系统的环境很乱，作为有系统洁癖的人，肯定不能忍啊，重装了系统，重配了环境。

## 一、重装系统

### （1）备份

不管是什么系统，备份都是重中之重。系统崩了可以重装，软件没了可以重装，数据没了那可能就再也找不回来了。

macOS提供了Time Machine功能，能很方便的备份数据甚至整个系统。我是单独拿了一个500G的移动硬盘作为Time Machine的备份盘，再也不用担心数据备份的问题了。

重装系统前，做一次完整备份。使用方法见[*Time Machine说明*](https://support.apple.com/zh-cn/HT201250) 。

### （2）用U盘制作MacOS启动盘

题外插一句，官网介绍macOS可以用[*恢复功能*](https://support.apple.com/zh-cn/HT204904) 重装，但是有BUG，我用恢复功能联网重装，等了一下午（如果网速慢，等一天都有可能），进度条终于跑完了，最后提示“未能创建用于 apfs 安装的预启动卷宗”，重装失败。查看log，有很多Error，提示磁盘已经是APFS，转换失败。猜测是我的MacBook Pro出厂磁盘格式是HFS+，后来升级系统换成了APFS，重装前我也把磁盘格式化成APFS，但是联网重装系统的脚本是按照我出厂的HFS+配置写的，所以安装失败。

于是放弃这种浪费时间浪费精力的方式，用Time Machine还原回原系统，制作U盘启动盘来重装。

1、下载macOS安装包

进App Store，搜索macOS，找到macOS High Sierra，下载。安装包会像其他软件一样下载到应用程序文件夹下。

2、制作启动盘

打开终端，插入U盘（至少12GB）。输入命令：

```bash
High\ Sierra.app/Contents/Resources/createinstallmedia --volume /Volumes/TIANWS
```

最后的TIANWS是我的U盘的名字，其他名字换成对应名称即可。

回车确认，会提示你会清除U盘数据，按Y回车确认，等一会儿，启动盘制作完毕。

另：上述命令是High Sierra的命令，其他版本的命令和更多细节请查看[*官网说明*](https://support.apple.com/zh-cn/HT201372)。

### （3）重装系统

重启电脑，开机前一直按住option键不放，进入设置界面，选择U盘启动器。

先用磁盘工具格式化内置硬盘，再选择重新安装macOS，这次一分钟进度条就走完了，电脑重启，出现苹果标志，进度条走完，全新的macOS系统就装好了，赶快用Time Machine备份一下吧，下次再想重装就直接用Time Machine还原就行啦。

## 二、系统设置

打开**系统偏好设置**，说明很详细，按照自己喜好设置就行啦。只记录一点特别的设置备忘。

```bash
sudo scutil --set HostName MacBookPro # 修改主机名
sudo scutil --set ComputerName MacBookPro # 修改共享名称
```

辅助功能触控板选项设置三指拖移。

**vps**

```bash
vim ~/.ssh/config
# 加入下面配置
Host vps
  User [root]
  Hostname [IP]
  Port [Port]
  IdentityFile ~/.ssh/id_rsa

ssh-copy-id vps
# 输一次密码后以后就不用输了
ssh vps
```

## 三、Homebrew

[**Homebrew**](https://brew.sh/)类似于**Ubuntu**的**apt**和**CentOS**的**yum**的包管理工具，它会下载源码解压然后`./configure && make install`，并自动配置好环境和路径，用来安装和管理软件再方便不过了。

### （1）安装

终端下输入：

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

脚本会自动安装所需的依赖，比如**Xcode command line tools**。

### （2）常用命令

```bash
brew --help #简洁命令帮助
man brew #完整命令帮助
brew install git #安装软件包(这里是示例安装的Git版本控制)
brew uninstall git #卸载软件包
brew search git #搜索软件包
brew list #显示已经安装的所有软件包
brew update #同步远程最新更新情况，对本机已经安装并有更新的软件用*标明
brew outdated #查看已安装的哪些软件包需要更新
brew upgrade git #更新单个软件包Quickly remove something from /usr/local
brew info git #查看软件包信息
brew home git #访问软件包官方站
brew cleanup #清理所有已安装软件包的历史老版本
brew cleanup git #清理单个已安装软件包的历史版本
brew cleanup -n #查看会被清理的软件包
```

### （3）程序安装路径：`/usr/local`

```bash
-bin #用于存放所安装程序的启动链接（相当于快捷方式）
-Cellar #所有brew安装的程序，都将以[程序名/版本号]存放于本目录下
-etc #brew安装程序的配置文件默认存放路径
-Library #Homebrew 系统自身文件夹
-Formula #程序的下载路径和编译参数及安装路径等配置文件存放地
-Homebrew #brew程序自身命令集
```

安装好的这些软件都会统一安装到`/usr/local/Cellar/`目录下，统一管理。而且`/usr/local/Cellar/`目录会被软链到`/usr/local/opt/`下，任何的增删改都会保持这2个目录的同步。并且已经软链好各种命令到`/usr/local/bin`下。这样全局都可以使用这些命令了。

### （4）Tips and Tricks

```bash
brew unlink <formula> # 快速从`/usr/local`中移除软件
brew link <formula> # 移回`/usr/local`
```

```bash
brew info <formula> # 查看已经安装，但是未激活的软件版本
brew switch <formula> <version> # 切换版本
```

```bash
brew install --only-dependencies <formula> # 只安装软件依赖，不安装软件
```

```bash
 sudo launchctl config user path "/usr/local/bin:$PATH" # 为GUI apps的搜索加`/usr/local/bin路径`
```

### （5）卸载

```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"
```

更多使用说明详见[*Homebrew官网*](https://docs.brew.sh/)。

## 四、Homebrew-Cask

[**Homebrew-Cask**](https://caskroom.github.io/)是Homebrew的拓展，它能够安装上千种macOS的应用程序。

我们平时安装软件先去App Store搜索，但是Mac App Store上架应用数量太少了，而且审核很慢，版本陈旧。如果不符合要求我们会去官网下载安装包，然后拖拽到Application下安装。

有了Homebrew-Cask，我们就能省去这些步骤，一两行命令就能安装完毕。

### （1）安装

终端下输入：

```bash
brew tap caskroom/cask
```

### （2）常用命令

```bash
brew cask install qq # 下载安装软件
brew cask uninstall(rm) qq # 卸载软件
brew cask search（-S） qq # 模糊搜索软件，如果不加软件名，就列出所有它支持的软件
brew cask info qq # 显示这个软件的详细信息，如果已经用cask安装了，也会显示其安装目录信息等
brew cask list(ls) # 列出本机按照过的软件列表
brew cask cleanup #  清除下载的缓存以及各种链接信息
brew cask outdated # 列出所有outdated的软件
brew cask upgrade [qq] # 安装outdated的软件
brew update && brew upgrade brew-cask # 更新cask自身
brew cask reinstall APP # 重装APP
```

### （3）程序安装路径

安装在`/usr/local/Caskroom`，然后移动到`/Application`，网上的有人说`/Application`存放的是软链，我查看了并不是，可能是新版本更新了策略。

更多用法见[**Homebrew-Cask官方说明**](https://github.com/caskroom/homebrew-cask/blob/master/USAGE.md)，或者`man brew-cask`。

## 五、安装软件

我安装软件的选择是，先在App Stroe中搜索有没有（比如付费软件），如果没有，再在brew cask中搜索，如果再没有，去官网手动下载安装。

### （1）GUI软件

```bash
brew cask install iterm2 # 终端
brew cask install iina # 播放器
brew cask install shadowsocksx-ng # 科学上网 
# 安装需要翻墙
# 同一局域网内可科学上网的ip改为0.0.0.0
# mac终端下执行 export ALL_PROXY=socks5://ip:端口
# 即可暂时在当前终端科学上网，成功安装shadowsocksx-ng
brew cask install google-chrome # 浏览器
brew cask install typora # 写作工具
brew cask install fliqlo # 屏保工具
brew cask install spectacle # 窗口管理工具
brew cask install zotero # 文献管理工具
brew cask install qlcolorcode qlstephen qlmarkdown quicklook-json qlimagesize betterzip webpquicklook qlvideo # 快速预览工具
brew cask install itsycal # 简洁日历
brew cask install miniconda # python包管理工具 默认环境python3
# 在.zshrc 中加入 “exprot PATH=/usr/local/miniconda3/bin:"$PATH"”
```

### （2）命令行工具

**zsh & oh-my-zsh** ：[zsh安装](https://github.com/robbyrussell/oh-my-zsh/wiki/Installing-ZSH) ， [oh-my-zsh安装](https://github.com/robbyrussell/oh-my-zsh)

```bash
# 安装zsh和插件
brew install zsh zsh-completions zsh-syntax-highlighting # 两个插件的作用分别是补全和高亮命令
# 安装oh-my-zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
# 修改~/.zshrc
DISABLE_AUTO_UPDATE="true"
source /usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
fpath=(/usr/local/share/zsh-completions $fpath)
# 修改/home/tianws/.oh-my-zsh/themes/robbyrussell.zsh-theme第二行
PROMPT='${ret_status}[%m] %{$fg[cyan]%}%~%{$reset_color%} $(git_prompt_info)'
# [%m]是机器名，可以去掉
# 修改后robbyrussell主题，路径提示就是完整的了
```

**Powerline** ： [字体安装文档](https://github.com/powerline/fonts)，[Powerline文档](https://powerline.readthedocs.io/en/latest/installation/osx.html#fonts-installation)

```bash
# 安装字体
cd ~
mkdir source
# clone
git clone https://github.com/powerline/fonts.git --depth=1
# install
cd fonts
./install.sh # 卸载一样的流程，这里执行./uninstall.sh
# clean-up a bit
cd ..
rm -rf fonts
# 现在iTerm2的字体里可以选择Powerline字体了

### coreutils下的ls文件夹在zsh里不高亮，已卸载
## 安装coreutils，用linux的GNU命令替换mac的BSD命令
#brew install coreutils
## 将下面几行同样加入~/.bash_profile：
## coreutils的安装提示
## export PATH="/usr/local/opt/coreutils/libexec/gnubin:$PATH"
## export MANPATH="/usr/local/opt/coreutils/libexec/gnuman:$MANPATH"
## 更好的方法：
#if brew list | grep coreutils > /dev/null ; then
#  PATH="$(brew --prefix coreutils)/libexec/gnubin:$PATH"
#  alias ls='ls -F --show-control-chars --color=auto'
#  eval `gdircolors -b $HOME/.dir_colors`
#fi

# 安装Powerline
pip install --user powerline-status
```

**vim** ：[vim-bootstrap](http://www.vim-bootstrap.com/)

```bash
brew install vim
# 然后按照上面的链接配置，挺好用的
```

**tmux** ：[oh-my-tmux](https://github.com/gpakosz/.tmux)

```bash
brew install tmux
# 然后按上面的链接配置
```

**Python** ：[参考链接](https://www.learnopencv.com/install-opencv3-on-macos/)

```bash
# python
brew install python2
brew install python3
# 执行下面语句检查是否安装成功
which python2 # 应该输出 /usr/local/bin/python2
which python3 # 应该输出 /usr/local/bin/python3
# 注意，老版homebrew会软链接python2为/usr/local/bin/python
# 执行python命令会默认执行brew安装的python2
# 而新版的规则是
# （1）软链接python2为/usr/local/bin/python2
# （2）软链接python3为/usr/local/bin/python3
# （3）python命令会指向系统自带的/usr/bin/python，而不是brew安装的python
# 我们希望使用brew安装的更便于管理的python，那就要输入python2和python3命令，如果嫌这样很麻烦，可以在~/.zshrc中加几行：

# Adding this line to end of .bash_profile will make python command 
# point to python2
export PATH="/usr/local/opt/python/libexec/bin:$PATH" 
```

**OpenCV** ：[参考链接](https://www.learnopencv.com/install-opencv3-on-macos/)

```bash
# 上一步的python安装好后执行
brew install opencv # 会自动安装好依赖，注意提示，可能有些环境配置的操作需要做，安装好后brew安装的python可以使用cv2了
# conda环境的python还不能导入cv2，所以把~/.zshrc的环境变量注释了，要用时再解注就行了，或者用下面的命令软链
cd /usr/local/miniconda3/lib/python3.6/site-packages
ln -s /usr/local/opt/opencv3/lib/python3.6/site-packages/cv2.cpython-36m-darwin.so cv2.so
# 还是更习惯用conda自己安装管理python包，不建议上面这样做
```

**其他命令行工具**：

```bash
brew install aria2 wget axel youtu-dl # 下载工具 有这些可以摆脱迅雷、百度网盘等一众软件了
brew install cmake # 编译工具
gem install jekyll jekyll-paginate# 博客调试工具
```

