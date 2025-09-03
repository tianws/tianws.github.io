---
layout:     post
title:      "博客评论系统迁移：从 LiveRe 到 Twikoo"
subtitle:   "追求更快、更纯粹、更可控的评论体验"
date:       2025-09-03 20:00:00
author:     "Tian"
categories: Skill
header-img: "img/post-bg-message.png"
header-mask: 0.8
catalog: true
tags:
    - 博客
---

## 一、前言

最近，我下定决心将博客的评论系统从使用了多年的**来必力 (LiveRe)** 迁移到了更现代化、更开放的 **Twikoo**。整个过程虽然涉及后端部署、前端适配和历史数据迁移，但最终的结果非常令人满意。迁移后，评论区的加载速度、用户体验和可控性都得到了质的飞跃。

本文将详细记录我从放弃来必力到选择并成功部署 Twikoo 的全过程，希望能为同样在寻找更优评论解决方案的博主们提供一些参考。

## 二、为什么要放弃来必力？

来必力曾经是一款相当不错的评论系统，但随着时间的推移，我逐渐发现了它的一些难以忍受的缺点：

1.  **中国大陆访问速度缓慢**：这是最核心的问题。来必力的服务器位于海外，导致在国内访问时，评论区经常需要长时间加载，甚至加载失败，严重影响了读者的互动体验。
2.  **侵入式广告**：免费版的来必力会在评论区中插入广告，这与我追求简洁、纯粹的博客风格背道而驰。
3.  **管理后台 Bug 频出且长期不修复**：我发现来必力的管理后台存在一些明显 Bug，例如评论管理`undefined`等，但这些问题长期得不到修复。这让我对其运营和维护状况产生了担忧。
4.  **“跑路”风险**：作为一个免费的第三方服务，其稳定性和持久性始终是一个未知数。考虑到数据安全和服务的可持续性，我担心它有朝一日会停止服务，让我的历史评论数据付之一炬。

基于以上原因，我决定寻找一个替代方案。

## 三、为什么选择 Twikoo？

在对市面上的几款主流开源评论系统进行调研后，我最终选择了 **Twikoo**。它的以下特性完美地满足了我的需求：

* **开源免费**：完全开源，没有付费限制。
* **部署灵活**：支持多种 Serverless 平台（如Vercel, Netlify, Hugging Face等）进行私有化部署，数据完全掌握在自己手中。
* **功能强大**：支持邮件通知、垃圾评论过滤、自定义表情、代码高亮等现代化评论系统所需的核心功能。
* **轻量快速**：前后端分离，前端加载迅速，不依赖笨重的第三方库。
* **易于定制**：提供了丰富的配置项，并且可以方便地通过自定义CSS进行深度美化。

## 四、迁移与部署过程

整个迁移过程主要分为后端部署、前端适配和历史数据迁移三大部分。其中，后端部署是核心，也是最容易出错的地方。下面，我将严格按照官方的推荐流程，手把手带你完成。

### 准备工作

在开始之前，请确保你拥有以下三个账号，它们都有免费的套餐，足够个人博客使用：
1.  **GitHub 账号**：代码的家，用于存放和管理 Twikoo 的云函数代码。
2.  **MongoDB Atlas 账号**：数据的仓库，我们将用它来存储所有的评论。
3.  **Netlify 账号**：网站的“工厂”，我们将用它来托管和运行 Twikoo 的后端服务。

### 第一步：准备数据库 (MongoDB Atlas)

此流程需要我们手动配置一个数据库来存放评论数据。我们将使用 MongoDB Atlas，它为 Twikoo 提供数据库托管服务，并有永久免费的额度。

1.  **申请账号并创建集群**：
    * 访问 [MongoDB Atlas 官网](https://www.mongodb.com/cloud/atlas/register) 申请一个账号。
    * 登录后，创建一个免费的共享套餐集群。
    * 在选择云服务商和区域 (Region) 时，Cloud Provider 选择 `AWS`，Region 可以选择一个离你部署云函数的地区较近的数据中心，这样可以降低延迟，不知道的话，可以选择 `Oregon (us-west-2)`，比较成熟，故障率低。

2.  **创建数据库用户**：
    * 在集群创建成功后，于左侧菜单中找到 `Database Access` 页面，点击 `Add New Database User`。
    * **认证方式 (Authentication Method)** 选择 **`Password`**。
    * 设置您的**用户名 (Username)** 和**密码 (Password)**。你可以自己输入，也可以点击 `Autogenerate Secure Password` 生成一个高强度密码。**请务必将用户名和密码妥善地记录下来**。
    * **数据库用户权限 (Database User Privileges)**，选择 `Built-in Role`，并从下拉菜单中选择 **`Atlas Admin`**。
    * 点击 **`Add User`** 完成创建。

3.  **配置网络访问权限**：
    * 在左侧菜单中找到 `Network Access` 页面，点击 `Add IP Address`。
    * 由于 Vercel / Netlify 等云函数的出口 IP 地址是动态的，我们需要允许所有 IP 地址的访问。点击 **`Allow Access From Anywhere`**，或自己填入 `0.0.0.0/0`。
    * 如果 Twikoo 部署在自己的服务器上，这里则应该填入服务器的固定 IP 地址。
    * 点击 **`Confirm`** 保存。

4.  **获取数据库连接字符串**：
    * 回到 `Database` 页面，找到您的集群，点击 **`Connect`** 按钮。
    * 在弹出的窗口中，选择 **`Drivers`** 方式进行连接。
    * Driver 选 `Node.js`，Version 选最新的。
    * 您会在下方看到一段连接字符串。**请立即复制这段字符串！**
    * 将字符串中的 `<username>` 和 `<password>` 替换为您在第2步中设置的**真实用户名和密码**。
    * **至此，数据库准备完毕！我们得到了最重要的数据库连接字符串。**

5.  **关于数据库名 (可选了解)**：
    * 您无需预先指定数据库名称。当 Twikoo 首次连接到您的数据库时，它会自动创建一个名为 `test` 的数据库。
    * 如果您想在同一个 MongoDB 集群上运行多个 Twikoo 实例，建立加入数据库名称并配置对应的 ACL。

### 第二步：在 Netlify 中部署 Twikoo 后端

现在，我们将通过手动导入项目的方式，在 Netlify 上部署 Twikoo。

1.  **准备代码 (Fork GitHub 仓库)**：
    * 访问 Twikoo 的官方 Netlify 部署仓库：**[https://github.com/twikoojs/twikoo-netlify](https://github.com/twikoojs/twikoo-netlify)**
    * 点击页面右上角的 **`Fork`** 按钮，将这个仓库复制一份到您自己的 GitHub 账号下。

2.  **登录 Netlify 并导入项目**：
    * 登录您的 [Netlify 账号](https://app.netlify.com/login)。
    * 进入您的团队主页，点击 **`Add new project`** -> **`Import an existing project`**。

3.  **连接 GitHub 并选择仓库**：
    * 在部署来源中，选择 **`Deploy with GitHub`**。
    * Netlify 会请求授权访问您的 GitHub 仓库，授权后，它会列出您的所有仓库。
    * 在搜索框中，输入 `twikoo-netlify` 找到并选择您刚刚 Fork 的那个仓库。

4.  **配置部署设置与环境变量**：
    * 在部署设置页面，大部分选项保持默认即可。向下滚动到 **`Environment variables`** (环境变量) 部分。
    * 点击 **`Add environment variables`** -> **`New variable`**。
    * 这是**最关键的一步**，我们需要添加一个变量来告诉 Twikoo 数据库在哪里：
        * **Key**: `MONGODB_URI`
        * **Value**: 粘贴您在**第一步第4点**中准备好的、已经填入了正确用户名和密码的**数据库连接字符串**。

5.  **开始部署**：
    * 确认环境变量填写无误后，点击页面底部的 **`Deploy site`** (或 `Deploy <你的仓库名>`) 按钮。
    * Netlify 会开始从您的 GitHub 仓库拉取代码并进行构建部署，这个过程大约需要 1-2 分钟。

6.  **获取云函数地址 (`envId`)**：
    * 部署成功后，进入 Project overview，你会看到一个链接，格式为：`https://<你的Netlify站点名>.netlify.app`
    * 点击上方的链接，如果环境配置正确，可以看到 “Twikoo 云函数运行正常” 的提示，此时的网页路径就是您的云函数地址，格式为：
    `https://<你的Netlify站点名>.netlify.app/.netlify/functions/twikoo`
    * **复制这个完整的地址**，这就是我们需要配置到前端的 `envId`。

### 第三步：集成到前端

1.  **修改博客模板**：
    * 在您博客需要显示评论区的地方，添加以下代码：

    ```html
    <div id="tcomment"></div>
    <script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.min.js"></script>
    <script>
    twikoo.init({
      envId: '您的环境id', // （https://<你的Netlify站点名>.netlify.app/.netlify/functions/twikoo）
      el: '#tcomment', // 容器元素
      // region: 'ap-guangzhou', // 环境地域，默认为 ap-shanghai，腾讯云环境填 ap-shanghai 或 ap-guangzhou；Vercel 环境不填
      // path: location.pathname, // 用于区分不同文章的自定义 js 路径，如果您的文章路径不是 location.pathname，需传此参数
      // lang: 'zh-CN', // 用于手动设定评论区语言，支持的语言列表 https://github.com/twikoojs/twikoo/blob/main/src/client/utils/i18n/index.js
    })
    </script>
    ```
    * 也可根据博客代码结构修改代码组织形式和评论区样式，各项目代码不同，这里不再赘述。

2.  **最终验证**：
    * 将 `envId` 替换为您自己的云函数地址后，保存并重新部署您的博客。
    * 访问您的文章页，如果评论框成功加载，就说明部署已圆满完成！

### 第四步：历史评论数据迁移

数据是宝贵的资产，而来必力没有提供导出评论的功能。为了保留来必力的历史评论，我新建了一个项目，用于**将来必力的数据导出，并转换为 Twikoo 兼容的 JSON 格式**，原则上经过格式转换，也可以导入到任何评论系统中。

这个过程主要包括解析来必力的数据结构、处理用户身份（游客与社交媒体用户）、以及转换评论的层级关系等。最终，通过 Twikoo 管理后台的导入功能，我成功地将所有历史评论无缝迁移到了新的系统中。

> 这部分数据迁移的代码我已经开源，并计划在后续的博文中详细介绍其实现原理和使用方法，敬请期待。

> 更新博文：[“来必力”数据导出](https://tianws.github.io/2025/09/04/livere-export/)

## 五、结论

从结果来看，这次迁移无疑是成功的。Twikoo 评论系统不仅在**加载速度**上远超来必力，彻底消除了广告的干扰，更重要的是，它让我**完全掌控了我的数据**，摆脱了对第三方服务不确定性的担忧。

整个部署过程虽然需要一些动手能力，但 Twikoo 优秀的官方文档让这一切变得有条不紊。如果你也对当前博客的评论系统不满意，并且追求速度、美观与数据自主，那么 Twikoo 绝对是一个值得你投入时间去尝试的绝佳选择。

## 参考链接

- [twikoo官方文档](https://twikoo.js.org/quick-start.html)
- [Twikoo Vercel 部署教程](https://www.bilibili.com/video/BV1Fh411e7ZH/?spm_id_from=333.337.search-card.all.click)
