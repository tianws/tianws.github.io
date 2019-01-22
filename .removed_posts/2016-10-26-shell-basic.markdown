---
layout:     post
title:      "Shell基本用法"
subtitle:   ""
date:       2016-10-26 10:00:00
author:     "Tian"
header-img: "img/post-bg-shell.jpeg"
catalog: true
tags:
    - shell
---

*以下是书上相应章节的笔记*

## 1.2 终端打印

```shell
printf "%-5s %-10s %-4s\n" No Name Mark
printf "%-5s %-10s %-4.2f\n" 1 Sarath 80.3456

# “-”表示左对齐
# “4”表示保留宽度为4
# “.2”表示保留2个小数位

```

### 1. 在echo中转义换行符

	echo -e "1\t2\t3"
    
默认情况下，echo会讲一个换行符追加到输出文本的尾部，可以使用-n来忽略结尾的换行符。
echo同样接受双引号字符串内部的转义序列作为参数，如果需要使用转义序列，则采用“echo -e”。

### 2. 打印彩色输出

在终端中生成彩色输出可以通过使用转义序列来实现。

每种颜色都有对应的颜色码：

|颜色|颜色码|
|---|----:|
|重置|0|
|黑色|30|
|红色|31|
|绿色|32|
|黄色|33|
|蓝色|34|
|洋红|35|
|青色|36|
|白色|37|

要打印彩色文本，可输入如下的命令：

```shell
echo -e "\e[1;31m This is red text \e[0m"
    
# "e[1;31" 将颜色设为红色，"\e[0m"将颜色重新置回。
```

要设置彩色背景，经常使用的颜色码是：

|颜色|颜色码|
|---|----:|
|重置|0|
|黑色|40|
|红色|41|
|绿色|42|
|黄色|43|
|蓝色|44|
|洋红|45|
|青色|46|
|白色|47|

要打印彩色文本，可输入如下命令：
	
    echo -e "\e[1;42m Green Background \e[0m"
    
## 1.3 变量和环境变量

在Bash中，每一个变量的值都是字符串，无论你给变量赋值时有没有使用引号，值都会以字符串的形式存储。

有一些特殊的变量会被shell环境和操作系统环境用来储存一些特别的值，这类变量就被称为环境变量。

当一个应用程序执行的时候，它接收一组环境变量。可以使用env命令在终端中查看所有与此终端进程相关的环境变量。对于每个进程，在其运行时的环境变量可以用下面的命令来查看：
	
    cat /proc/$PID/environ
    
其中，讲PID设置成相关进程的进程ID（PID总是一个整数）

假设有一个叫做gedit的应用程序正在运行。我们可以使用pgrep命令获得gedit的进程ID:

	$ pgrep geidt
    12501
    
通过一下命令获得与该进程相关的环境变量：

	$ cat /proc/12501/environ
    USER=tianws
    
上面的命令返回一个包含环境变量以及对应变量值的列表。每一个变量以name=value的形式来描述，彼此之间有Null字符（\0）分割。如果将\0替换成\n，那么就可以将输出重新格式化，使得每一行显示一对variable=value。替换命令可以使用tr命令来实现：
	
    $ cat /proc/12501/environ | tr '\0' '\n'
    
### 实战演练

一个变量可以通过一下方式进行赋值：

	var=value
    
如果value不包含任何空白字符（例如空格），那么它不需要使用引号进行引用，反之，则必须使用单引号或双引号。

注意：var = value不同于var=value。把var=value写成var = value是一个常见的错误，但前者是赋值操作，后者则是相等操作。

在变量名之前加上$前缀就可以打印出变量的内容：

```
var="value" #给变量var赋值
echo $var #或者echo ${var}
```

我们可以在printf或echo命令的双引号中引用变量值。

	echo "We have $count ${fruit}(s)"
    
环境变量是未在当前进程中定义，而从父进程中继承而来的变量。例如环境变量HTTP_PROXY，它定义了一个Internet连接应该使用哪一个代理服务器。

该环境变量通常被设置成：

	HTTP_PROXY=http://192.168.0.2:3128
    export HTTP_PROXY

export命令用来设置环境变量。至此之后，从当前shell脚本执行的任何程序都会继承这个变量。

PATH通常定义在/etc/environment或/etc/profile或~/.bashrc中。如果需要在PATH中添加一条新路径，可以使用：

	export PAYH="$PATH:/home/user/bin"
    
也可以使用

```
$ PATH="$PATH:/home/user/bin"
$ export PATH
```

这样，我们就将/home/user/bin添加到了PATH中。

还有一些众所周知的环境变量：HOME,PWD,USER,UID,SHELL等。

### 1.3.3 补充内容

#### 1. 获得字符串的长度

可以用下面的方法获得变量值的长度：

	length=${#var}
    
#### 2. 识别当前的shell版本

	echo $SHELL
    #也可以用 echo $0
    
#### 3. 检查是否为超级用户

UID是一个重要的环境变量，可以用于检查当前脚本是以超级用户还是以普通用户的身份运行的。例如：

```
if[$UID -ne 0];then
echo Non root user.Please run as root.
else
echo "Root user"
fi
```

root用户的UID是0。

#### 4. 修改Bash提示字符串

我们可以利用PS1环境变量来定制提示文本。默认的shell提示文本是在文件~/.bashrc中的某一行设置的。

使用如下命令列出设置PS1的那一行：

	$ cat ~/.bashrc | grep PS1
    
具体见书上相关章节
