# Jekyll 博客 Ubuntu 环境搭建与使用指南

本指南旨在提供一个完整的、从零开始的教程，帮助您在一个全新的 Ubuntu 系统 (推荐 20.04/22.04 LTS) 上搭建、使用并维护此 Jekyll 博客项目。

---

## 第一部分：环境搭建

此部分将引导您完成运行本项目所需的所有核心依赖的安装。

### 第一步：准备基础环境

此步骤将安装 Ruby, Bundler, 和 Node.js。

#### 1. 更新系统并安装通用依赖
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl gnupg2 build-essential
```

#### 2. 安装 RVM (Ruby Version Manager) 和 Ruby
我们使用 RVM 来安装和管理 Ruby 版本，这是官方推荐的稳定方法。

a. **导入 RVM 的 GPG 公钥:**
```bash
# 官方的命令可能会遇到“不支持的操作”的问题，用下面的方法绕过
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

1.  **克隆本仓库 (如果尚未克隆):**
    ```bash
    git clone https://github.com/tianws/tianws.github.io.git
    cd tianws.github.io
    ```

2.  **安装 Ruby 和 Node.js 依赖:**
    ```bash
    bundle install
    npm install
    ```

---

## 第二部分：日常使用与维护

### 第三步：本地运行与开发

本项目使用 npm scripts 来自动化构建和监控文件。您只需要一个终端窗口即可开始开发。

#### 启动开发服务器
```bash
npm run dev
```
这个命令会做以下几件事：
*   启动 Jekyll 服务器，您可以通过 `http://localhost:4000` 访问。
*   自动监控 `.less` 和 `.js` 文件的变化并重新编译。
*   通过 LiveReload 自动刷新浏览器。

#### 手动构建
如果您只想手动编译一次所有资源（CSS, JS），可以运行：
```bash
npm run build
```

---

### 第四步：内容创作与资源管理

#### 1. 撰写新文章
1.  在 `_posts` 目录下创建一个新文件。
2.  文件名必须遵循 `YYYY-MM-DD-你的文章标题.markdown` 的格式。
3.  添加必要的 Front Matter 信息（可参考已有文章）。

#### 2. 资源工作流 (图片与视频)

##### 图片工作流 (WebP 优化)
为了在保证图片质量的同时，最大化网站性能，项目采用源码与生成资源分离的工作流，并自动生成 WebP 格式。

- **原图目录**: `_source_images/`
  - 这是所有图片（包括文章内图片、视频封面等）的“源码”目录，请将所有未经压缩的高质量原图存放在这里，并保持您希望的子目录结构。
  - 这个目录是您图片资产的永久备份，需要被 Git 跟踪。

- **发布目录**: `img/`
  - 这个目录存放的是网站最终使用的、经过压缩和 WebP 转换后的图片。
  - **重要**: 此目录也需要被 Git 跟踪并提交，以确保图片能在线上网站（GitHub Pages）正常显示。

- **工作流程总结**:
  1.  在 `_source_images/` 中添加或修改高清原图。
  2.  运行 `npm run optimize:img` 命令。该命令会自动压缩原图，并为每张图生成对应的 `.webp` 版本，然后存放到 `img/` 目录。
  3.  提交代码时，需要同时提交对 `_source_images/` 和 `img/` 两个目录的更改。

##### 视频文件
视频文件（如 `.mp4`）直接存放在根目录的 `video/` 文件夹下即可。

#### 3. 在文章中插入内容

##### 插入图片 (新规范)
为了启用 WebP 懒加载，**必须使用下面的 `include` 语法**来插入图片。请不要再使用标准的 Markdown `![]()` 语法。

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

### 第五步：项目维护

#### 1. 依赖更新
定期更新项目的依赖包是一个好习惯，可以获取新功能和安全修复。但这也可能引入不兼容的更新。

- **建议的更新命令:**
  ```bash
  # 更新 Node.js 依赖
  npm update
  # 更新 Ruby 依赖
  bundle update
  ```
- **最佳实践:**
  在一个单独的 Git 分支（如 `dev`）上执行更新，在本地运行 `npm run dev` 并仔细测试网站各项功能，确认无误后再合并到主分支。

#### 2. 旧文章图片格式迁移
我们创建了一个一次性的迁移脚本，用于将旧文章中可能存在的 `![]()` 格式图片，自动转换为新的 `{% include image.html %}` 格式。

- **使用场景**: 当你克隆了一个旧版本的仓库，并希望对其中的文章内容进行现代化改造时。
- **运行命令**:
  ```bash
  python3 scripts/migrate_images.py
  ```
- **注意**: 此脚本会直接修改 `_posts` 目录下的文件。建议在运行前先提交当前所有改动，创建一个安全的还原点。

---

## 附录：常见问题排查 (Troubleshooting)

如果您在安装或使用过程中遇到问题，请参考以下解决方案。

### 问题一：导入 RVM 的 GPG 公钥时报错
- **错误现象:** `gpg: 从公钥服务器接收失败：不支持的操作`
- **原因:** 网络问题或防火墙阻止了标准的密钥服务器端口。
- **解决方案:** 本指南“第一步”中的命令 (`curl ... | gpg --import -`) 已使用此方案，通常不会失败。

### 问题二：安装 RVM 时报“权限不够”
- **错误现象:** `mktemp: 无法通过模板 "/usr/share/rvm-exec-test.XXXXXX" 创建文件: 权限不够`
- **原因:** 系统中可能存在一个旧的、不完整的、或通过其他方式（如 PPA）安装的**系统级 RVM**。
- **解决方案:** 需要进行一次彻底的清理，然后重新安装。详情请参考本文档“第一步”中关于 RVM 安装失败的详细排查步骤。

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
  ```