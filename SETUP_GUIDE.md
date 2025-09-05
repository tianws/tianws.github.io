---
layout: none
permalink: /SETUP_GUIDE.html
hide-in-nav: true
---

# Jekyll 博客环境搭建与使用指南

本指南旨在提供一个完整的、从零开始的教程，帮助您在 **Ubuntu** 或 **macOS** 系统上搭建、使用并维护此 Jekyll 博客项目。

---

## 第一部分：环境搭建

此部分将引导您完成运行本项目所需的所有核心依赖的安装。请根据您的操作系统选择对应的指南。

### A. Ubuntu 环境搭建 (使用 RVM)

本节将引导您在一个全新的 Ubuntu 系统 (推荐 20.04/22.04 LTS) 上完成环境搭建。

#### 第 1 步：准备基础环境
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl gnupg2 build-essential
```

#### 第 2 步：安装 RVM 和 Ruby
```bash
# 导入 RVM 的 GPG 公钥
# 官方的命令可能会遇到“不支持的操作”的问题，用下面的方法绕过
curl -sSL https://rvm.io/mpapis.asc | gpg --import -
curl -sSL https://rvm.io/pkuczynski.asc | gpg --import -

# 安装 RVM
\curl -sSL https://get.rvm.io | bash -s stable

# 加载 RVM 环境 (新终端会自动加载)
echo "source ~/.rvm/scripts/rvm" >> ~/.bashrc && source ~/.rvm/scripts/rvm

# 安装 Ruby 并设为默认
rvm install 3.1.2
rvm use 3.1.2 --default
```

#### 第 3 步：安装 Bundler 和 Node.js
```bash
# 安装 Bundler
gem install bundler

# 安装 NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 加载 NVM 环境 (新终端会自动加载)
source ~/.bashrc

# 安装 Node.js LTS 版本
nvm install --lts
```

---

### B. macOS 环境搭建 (使用 rbenv)

本节将指导您在 macOS 系统上，使用 [Homebrew](https://brew.sh/) 和 `rbenv` 搭建一个干净、现代的开发环境。

#### 第 1 步：安装 Homebrew 和构建工具
```bash
# 安装 Homebrew (如果尚未安装)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 automake 等工具，以防后续 npm install 编译原生模块时报错
brew install automake libtool
```

#### 第 2 步：安装并配置 rbenv
```bash
# 安装 rbenv
brew install rbenv

# 运行 init 命令获取配置指令
rbenv init
```
根据 `rbenv init` 命令的提示，你需要将一行命令添加到你的 Shell 配置文件中。对于 Zsh (macOS 默认)，通常是执行以下操作：
```bash
# 如果你不确定，请严格遵循 `rbenv init` 在你终端里打印的指引。
echo 'eval "$(rbenv init - zsh)"' >> ~/.zshrc
```

完成后，**重启终端**使配置生效。

#### 第 3 步：安装 Ruby 和 Bundler
```bash
# 安装指定版本的 Ruby
rbenv install 3.1.2

# 将此版本设为全局默认
rbenv global 3.1.2

# 安装 Bundler
gem install bundler

ruby -v
# 应显示: ruby 3.1.2...

bundle -v
# 应显示 Bundler version X.X.X
```

#### 第 4 步：安装 NVM 和 Node.js
```bash
# 安装 NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 加载 NVM (新终端会自动加载)
source ~/.zshrc

# 安装 Node.js LTS 版本
nvm install --lts
```

---

## 第二部分：项目安装与使用

#### 第 1 步：安装项目依赖
环境配置完成后，克隆本仓库并进入目录，然后安装项目自身的依赖。
```bash
# 克隆仓库 (如果尚未克隆)
git clone https://github.com/tianws/tianws.github.io.git
cd tianws.github.io

# 安装 Ruby 和 Node.js 依赖
bundle install
npm install
```

#### 第 2 步：本地运行与开发
本项目使用 npm scripts 来自动化所有任务。
```bash
# 启动开发服务器
npm run dev
```
这个命令会做以下几件事：
*   启动 Jekyll 服务器，您可以通过 `http://localhost:4000` 访问。
*   自动监控 `.less` 和 `.js` 文件的变化并重新编译。
*   通过 LiveReload 自动刷新浏览器。

如果您只想手动编译一次所有资源（CSS, JS），可以运行：
```bash
npm run build
```

---

## 第三部分：内容创作与资源管理

### 1. 撰写新文章
1.  在 `_posts` 目录下创建新文件。
2.  文件名必须遵循 `YYYY-MM-DD-你的文章标题.markdown` 的格式。
3.  添加必要的 Front Matter 信息（可参考已有文章）。

### 2. 资源工作流 (图片与视频)

- **原图目录**: `_source_images/` (存放高质量原图，需 Git 跟踪)
- **发布目录**: `img/` (存放压缩和转换WebP后的图片，需 Git 跟踪)
- **工作流程**:
  1.  在 `_source_images/` 中添加或修改原图。
  2.  运行 `npm run optimize:img` 来自动处理图片并输出到 `img/`。
  3.  提交代码时，同时提交 `_source_images/` 和 `img/` 的更改。
   
-  **视频目录**: `video/`文件夹

### 3. 在文章中插入内容

为了启用 WebP 懒加载和统一的样式，**必须使用 `include` 语法**插入图片和视频。

##### 插入图片
```liquid
{% include image.html src="/img/your-image-path.png" alt="这里是图片的描述" %}
```
- `src`: **必须**是图片在 `img/` 发布目录下的**完整路径**（以 `/` 开头）。
- `alt`: 图片的描述文字，用于 SEO 和可访问性。

##### 插入视频
使用 `local_video.html` 组件来插入本地视频。
```liquid
{% include local_video.html src="/video/your-video.mp4" poster="/img/video/poster/your-poster.png" %}
```
- `src`: **必须**是视频文件在 `video/` 目录下的**完整路径**。
- `poster`: **必须**是视频封面图片在 `img/` 目录下的**完整路径**。如果某个视频不需要封面，则直接省略 `poster` 参数即可。

---

## 第四部分：项目维护

### 1. 依赖更新
定期更新项目的依赖包是一个好习惯，但建议在单独的 Git 分支上进行测试。
```bash
npm update
bundle update
```

### 2. 旧文章图片格式迁移
此脚本用于将旧的 Markdown 图片格式 `![]()` 自动转换为新的 `include` 格式。
```bash
# 运行前请确保已提交所有改动
python3 scripts/migrate_images.py
```

---

## 附录：常见问题排查 (Troubleshooting)

### 问题一：RVM GPG 公钥导入失败 (Ubuntu)
- **错误现象:** `gpg: 从公钥服务器接收失败：不支持的操作`
- **解决方案:** 本指南 Ubuntu 部分提供的 `curl ... | gpg --import -` 命令已包含此问题的修复。

### 问题二：安装 RVM 时报权限不够 (Ubuntu)
- **错误现象:** `mktemp: 无法通过模板 "/usr/share/rvm-exec-test.XXXXXX" 创建文件: 权限不够`
- **原因:** 系统中可能存在一个旧的、通过其他方式（如 PPA）安装的**系统级 RVM**。
- **解决方案:** 需要彻底清理旧的 RVM 再重新安装。

### 问题三：`bundle update` 时依赖版本冲突
在执行 `bundle update` 时，你可能会遇到因版本不兼容导致的失败。

#### 1. RubyGems 版本过低
- **错误现象:** `... requires rubygems version >= 3.3.22, which is incompatible with the current version, 3.3.7`
- **原因:** 某个 Gem 包需要一个比您系统中安装的 RubyGems （Ruby 的包管理器）更新的版本。
- **解决方案:** 安装一个与当前 Ruby 版本兼容的、较新的 RubyGems。
  ```bash
  # 1. 安装一个指定版本的 rubygems-update 包 (例如 3.4.22)
  gem install rubygems-update -v 3.4.22
  # 2. 运行该包来执行更新
  update_rubygems
  ```

#### 2. Gem 包与 Ruby 版本不兼容
- **错误现象:** `... requires ruby version >= 3.2, which is incompatible with the current version, ruby 3.1.2p20`
- **原因:** `bundle update` 试图安装某个 Gem 包的最新版，但其依赖了更高版本的 Ruby。
- **解决方案:** 在 `Gemfile` 文件中，明确限制导致问题的 Gem 包的版本。例如，我们遇到的 `jekyll-sass-converter` 问题：
  ```ruby
  # Gemfile
  gem 'jekyll-sass-converter', '~> 2.1'
  ```

### 问题四：嵌入的视频尺寸超出页面范围
- **错误现象:** 文章中嵌入的本地视频，其宽度和高度不会自适应，导致在移动端或小屏幕上显示不全。
- **原因:** 用于包裹视频的 HTML 容器（如 `.vid-wrap`）缺少必要的 CSS 响应式样式。
- **解决方案:** 为视频容器补充“宽高比”相关的 CSS 样式。在 `less/hux-blog.less` 文件中添加如下代码，即可让视频自适应父容器宽度，并保持16:9的宽高比。
  ```css
  .vid-wrap {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
    height: 0;
    overflow: hidden;
    background-color: black;

    video,
    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  }

### 问题五：`npm install` 报错 `aclocal: command not found` (macOS)
- **错误现象:** 在执行 `npm install` 过程中，出现 `make: aclocal: Command not found` 或类似的错误提示。
- **原因:** 这是因为项目中某个依赖（通常是需要编译的 C/C++ 原生模块）使用了 GNU Autotools 作为构建系统。macOS 默认的开发环境没有包含 `automake` 这套工具，因此缺少 `aclocal` 等关键命令。
- **解决方案:**
  1. **安装构建工具:** 使用 Homebrew 安装 `automake` 和 `libtool`。
     ```bash
     brew install automake libtool
     ```
  2. **(推荐) 清理环境:** 删除可能已损坏的 `node_modules` 目录，确保一个干净的安装环境。
     ```bash
     rm -rf node_modules
     ```
  3. **重新安装:** 再次运行 `npm install` 即可。
     ```bash
     npm install
     ```
