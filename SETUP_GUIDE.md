# Jekyll 博客 Ubuntu 环境搭建与调试指南

本指南旨在提供一个完整的、从零开始的教程，帮助您在一个全新的 Ubuntu 系统 (推荐 20.04/22.04 LTS) 上搭建并调试此 Jekyll 博客项目。

---

### 第一步：在 Ubuntu 上准备基础环境

此步骤将安装运行本项目所需的所有核心依赖：Ruby, Bundler, 和 Node.js。

#### 1. 更新系统并安装通用依赖

打开终端，运行以下命令来更新系统并安装编译 Ruby 可能需要的库：
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl gnupg2 build-essential
```

#### 2. 安装 RVM (Ruby Version Manager) 和 Ruby

我们使用 RVM 来安装和管理 Ruby 版本，这是官方推荐的稳定方法。

a. **导入 RVM 的 GPG 公钥:**
此步骤用于验证 RVM 安装脚本的安全性。如果遇到问题，请参考文末的排查指南。
```bash
# gpg2 --keyserver keyserver.ubuntu.com --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
# 官方的命令会遇到“不支持的操作”的问题，用下面的方法绕过
curl -sSL https://rvm.io/mpapis.asc | gpg --import -
curl -sSL https://rvm.io/pkuczynski.asc | gpg --import -
```

b. **使用 curl 安装 RVM:**
```bash
\curl -sSL https://get.rvm.io | bash -s stable
```

c. **加载 RVM 环境:**
为了立即使用 RVM，需要运行以下命令。
```bash
source ~/.rvm/scripts/rvm
```
为了让新打开的终端窗口能自动加载 RVM，请将此命令添加到您的 `~/.bashrc` 或 `~/.zshrc` 文件中：
```bash
echo "source ~/.rvm/scripts/rvm" >> ~/.bashrc
# 如果您使用 Zsh，请运行下面这行
# echo "source ~/.rvm/scripts/rvm" >> ~/.zshrc
```

d. **安装一个稳定的 Ruby 版本:**
```bash
rvm install 3.1.2
rvm use 3.1.2 --default
```

e. **验证 Ruby 是否安装成功:**
```bash
ruby -v
# 应显示: ruby 3.1.2p20 ...
```

#### 3. 安装 Bundler

Bundler 是 Ruby 的依赖包管理器。
```bash
gem install bundler
```

#### 4. 安装 NVM (Node Version Manager) 和 Node.js

我们使用 NVM 来安装和管理 Node.js 版本。

a. **使用 curl 安装 NVM:**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

b. **加载 NVM 环境:**
运行 `source ~/.bashrc` (或 `source ~/.zshrc`) 或重新打开终端以加载 NVM。

c. **安装 Node.js LTS 版本:**
```bash
nvm install --lts
```

d. **验证 Node.js 是否安装成功:**
```bash
node -v
npm -v
```

---

### 第二步：安装项目依赖

环境就绪后，现在可以安装博客项目自身的依赖了。

1.  **克隆本仓库 (如果尚未克隆):**
    ```bash
    git clone https://github.com/tianws/tianws.github.io.git
    cd tianws.github.io
    ```

2.  **安装 Ruby 依赖:**
    ```bash
    bundle install
    ```

3.  **安装 Node.js 依赖:**
    ```bash
    npm install
    ```

---

### 第三步：本地运行与开发

本项目使用 npm scripts 来自动化构建和监控文件。您只需要一个终端窗口即可开始开发。

#### 启动开发服务器

在项目根目录下，运行以下命令：
```bash
npm run dev
```

这个命令会做以下几件事：
*   启动 Jekyll 服务器，您可以通过 `http://localhost:4000` 访问。
*   自动监控 `.less` 和 `.js` 文件的变化。
*   当您修改前端文件时，会自动重新编译，并通过 LiveReload 刷新浏览器。

基本上，这是一个“一站式”的开发命令。

#### 手动构建

如果您只想手动编译一次前端资源（CSS 和 JavaScript），而不是启动服务器，可以运行：
```bash
npm run build
```

---

### 第四步：如何撰写新文章

1.  在 `_posts` 目录下创建一个新文件。
2.  文件名必须遵循 `YYYY-MM-DD-你的文章标题.markdown` 的格式。
3.  添加必要的 Front Matter 信息（可参考已有文章）。

---

## 常见问题排查 (Troubleshooting)

如果您在安装过程中遇到问题，请参考以下解决方案。

### 问题一：导入 RVM 的 GPG 密钥时报错

- **错误现象:**
  ```
  gpg: 从公钥服务器接收失败：不支持的操作
  ```
- **原因:**
  网络问题或防火墙阻止了标准的密钥服务器端口。
- **解决方案:**
  本文档中的命令 (`curl ... | gpg --import -`) 已使用此方案，通常不会失败。这是一种绕过密钥服务器的稳定方法。

### 问题二：安装 RVM 时报“权限不够”

- **错误现象:**
  ```
  mktemp: 无法通过模板 "/usr/share/rvm-exec-test.XXXXXX" 创建文件: 权限不够
  ```
- **原因:**
  这个问题几乎总是因为系统中存在一个旧的、不完整的、或通过其他方式（如 PPA）安装的**系统级 RVM**。其残留的配置文件或环境变量“欺骗”了新的安装脚本，让它误以为需要管理员权限来修改系统文件。正确的 RVM 安装应完全在您的用户主目录下。

- **解决方案:**
  需要进行一次彻底的清理，然后重新安装。请按以下顺序执行清理步骤：

  1.  **使用 `ppa-purge` 清理 PPA (如果曾添加过):**
      ```bash
      sudo apt update
      sudo apt install ppa-purge
      sudo ppa-purge ppa:rael-gc/rvm
      ```

  2.  **删除所有已知的 RVM 配置文件和目录:**
      ```bash
      # 删除系统级和用户级的 RVM 文件
      sudo rm -rf /etc/rvmrc /etc/profile.d/rvm.sh /usr/local/rvm ~/.rvm
      # 使用 find 命令进行更彻底的搜索和删除
      sudo find /etc -name "*rvm*" -exec sudo rm -f {} \;
      ```

  3.  **检查并清理硬编码的环境变量:**
      检查 `/etc/environment` 以及 `/etc/security/pam_env.conf` 等文件，确保其中不包含任何 `rvm` 相关的路径。

  4.  **重启电脑:**
      在极少数情况下（如此次调试过程），即使删除了所有配置文件，环境变量可能依然存在于当前的用户登录会话内存中。**重启电脑是清除这些“幽灵”变量的最有效方法。**

  5.  **验证清理效果:**
      重启后，打开新终端，运行 `env | grep -i rvm`。此命令**必须没有任何输出**。如果确认环境干净，再重新执行 RVM 的安装步骤。
