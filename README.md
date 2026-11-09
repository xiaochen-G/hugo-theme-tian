# tian — 朋友圈风 Hugo 主题（毛玻璃版）

一款以「微信朋友圈」动态流为骨架、披上 Apple 风毛玻璃皮肤的 Hugo 博客主题，并深度集成了自托管的 **Waline** 评论系统（内置 Cloudflare Turnstile 人机验证与点赞按钮）。

本主题由 [Sigu 博客](https://blog.bke.us.ci) 的实站配置整理开源：它是上游主题 [Amigo](https://github.com/zqlit/Hugo-Theme-Amigo) 的衍生版本，朋友圈布局、多图九宫格、音乐 / 视频 / 语音等能力来自 Amigo；毛玻璃皮肤、Waline 集成与一整套部署细节来自本站的实际打磨。

- **在线演示**：https://blog.bke.us.ci
- **许可**：MIT（上游与第三方来源见 [NOTICE](NOTICE)）

## 特性

- 📱 **朋友圈动态流**：文章以动态卡片的形式按时间排列，支持多图九宫格、Live Photo、音乐、视频、语音气泡等朋友圈同款元素（来自 Amigo）；
- 🧊 **毛玻璃皮肤**：蓝 / 粉 / 紫三色柔光打底，文章卡片、签名条、页脚、顶栏都是半透明磨砂玻璃面板，全屏导航菜单也换成了粉蓝渐变毛玻璃（去掉 Amigo 原来的黑色罩，深色模式为深靛蓝渐变），点缀色为苹果蓝 `#0071e3`；皮肤是一个独立样式文件 `static/css/glass.css`，不改主题本体即可增删；
- 🌗 **深色模式**：亮 / 暗双套玻璃配色，跟随系统或手动切换；
- 💬 **Waline 评论（自托管）**：客户端文件随主题本地托管、**不依赖任何外部 CDN**；访客填昵称即可评论，无需注册；
- 🛡️ **Turnstile 人机验证**：验证码组件直接嵌在评论编辑器内，无 token 的提交会被服务端拒绝，挡机器人效果明显；
- 👍 **点赞按钮**：文章页带 Waline reaction 点赞（本地爱心图标）；
- ❤️ **头像爱心**：点击首页封面头像不再切换深浅色（顶栏有专门的切换按钮），改为弹出大爱心 + 小爱心上飘动画，名字下方还有一颗玻璃小药丸显示爱心总数；计数复用 Waline 的 article 接口（`reaction0`，按页面路径区分），每位访客一颗、再点取消，逻辑在 `static/js/hearts.js`；该功能依赖站点参数 `walineServer`，未配置 Waline 时自动不启用；计数先读本地缓存即时显示、再在后台刷新，请求带超时与多次重试、失败不显示假 0，点按在触摸阶段接管以兼容老内核手机浏览器（小米自带浏览器实测修复）；另外 `amigoConfig.headerMedia` 默认留空，关掉 Amigo 的封面 Live Photo 视频生成——封面没有同名 .mp4 时，那个 404 视频元素会被部分手机浏览器接管成全屏播放器；
- 🔗 **页脚署名**：页脚的主题名链接指向本仓库，访客可以顺着找到主题出处；
- 🖥️ **宽屏适配与细节打磨**：主页在平板 / 电脑 / 大屏上分档加宽（800 / 880 / 960px，文章页保持原阅读宽度，手机端不变），封面高度随宽度增加；窗口 ≥1440px 时，主页与文章页的内容列两侧空白处都会出现玻璃小面板（文章页按 680px 列宽单独定位）——左栏是博主名片（头像 / 简介 / 文章数）加一张访客欢迎卡片（访客自己的位置 / IP / 设备，多源兜底查询，国内外访客都能显示），右栏是站点导航 + 今日日期；全屏菜单的胶囊按钮改为等宽、文字居中，配图等小元素的圆角从 3~4px 统一到 10~12px；实现在 `static/css/wide.css` 与 `static/js/sidepanels.js`，导航链接可在脚本里改成自己的；
- 🧩 **评论开关规则**：文章默认开启评论；独立页面（如「关于」）在 front matter 写 `comments: true` 单独开启，写 `comments: false` 可关掉某篇文章的评论；
- 🚫 **默认关闭 PJAX**：评论组件在 PJAX 下容易重复初始化，本主题的实站选择是关掉 PJAX 换评论稳定（配置见下文）。
- ⚡ **页面预加载**：内置 [instant.page](https://instant.page) 5.2.0（MIT，自托管于 `static/js/instantpage.js`，不依赖第三方 CDN）——访客悬停 / 按下站内链接时提前预取目标页，整页跳转也能近乎秒开；省流量模式与慢速网络下自动不预取，老内核浏览器不支持 ES 模块时自动跳过、无副作用。

## 环境要求

- Hugo（建议 extended 版）≥ 0.120
- 一台能跑 Node.js 的服务器或 Serverless 平台，用于部署 Waline 服务端（可以和博客不在同一台机器上）

## 快速开始

### 1. 安装主题

```bash
hugo new site myblog && cd myblog
git clone https://github.com/xiaochen-G/hugo-theme-tian themes/tian
```

### 2. 站点配置

把主题根目录的 `hugo.toml` 作为起点复制到站点根目录，按需修改。最少要改这几处：

```toml
baseURL = "https://你的域名/"
languageCode = "zh-cn"
title = "你的站名"
theme = "tian"

[params]
  username = "你的名字"
  avatar = "/images/avatar.jpg"        # 头像，放 static/images/ 下
  description = "一句签名"
  cover = "/images/cover.jpg"          # 首页封面图
  headerMedia = "/images/cover.jpg"    # 必须与 cover 显式写成同一个值，
                                       # 否则会命中主题演示视频默认值

  # ---- 评论（Waline）----
  commentMode = "waline"               # 故意用主题不认识的值：
                                       # 让 Amigo 自带的 Artalk/Twikoo 分支全部不触发，
                                       # 评论统一走本主题注入的 Waline
  walineServer = "https://你的-waline-域名"        # 第 4 步部署的 Waline 服务端地址
  walineTurnstileKey = "你的 Turnstile 站点密钥"    # 可选，见第 5 步

  enablePjax = false                   # 关掉 PJAX，保评论组件稳定
```

头像与封面图放到站点的 `static/images/` 目录（文件名与配置对应即可）。封面建议宽幅横图（约 3:1），因为横幅高约 230px、按 cover 方式裁切。

### 3. 写文章

```bash
hugo new content posts/hello.md
```

在 `content/posts/` 下写 Markdown 即可，首页会把它们渲染成朋友圈动态流。独立页面（如关于页）放在 `content/` 根下，例如 `content/about.md`：

```markdown
---
title: "关于"
url: "/about/"
comments: true
---
```

`comments: true` 是独立页面开启评论的开关，别漏。

### 4. 部署 Waline 服务端（评论后端）

Waline 官方服务端包是 `@waline/vercel`（注意：npm 上的包名就是这个，不是 `@waline/server`）。最省事的方式是任意一台小服务器 + Node.js + SQLite：

```bash
mkdir -p /opt/waline && cd /opt/waline
npm init -y
npm i @waline/vercel
```

用 systemd 常驻一个启动入口，再准备环境变量文件，关键项：

| 变量 | 说明 |
|---|---|
| `SITE_NAME` / `SITE_URL` | 站点名与博客地址 |
| `SECURE_DOMAINS` | 允许调用评论接口的域名，逗号分隔（博客域名、评论域名都加上） |
| `COMMENT_AUDIT` | 留空即评论直接显示；设 `true` 则先审后发 |
| `TURNSTILE_SECRET` | Turnstile 私钥（第 5 步），与前端站点密钥配对 |
| `SQLITE_PATH` | SQLite 数据文件路径（不用外部数据库时靠它持久化） |

然后用 Caddy / Nginx 把一个子域名（如 `talk.example.com`）反代到 Waline 的本地端口（默认 8360），站点配置里的 `walineServer` 就填这个子域名。管理后台在 `https://talk.example.com/ui`，首次打开时注册的账号即管理员。

> 实站经验：Waline 进程内存约 190MB，和博客挤在 464MB 内存的小机器上也能跑，但余量不多；机器更小时建议把 Waline 单独部署。

### 5. （可选但推荐）开启 Turnstile 人机验证

1. 在 Cloudflare 控制台 → Turnstile 新建小部件，域名填博客域名与评论域名，类型选「托管」；
2. **站点密钥**填进站点配置的 `walineTurnstileKey`，**私钥**填进 Waline 服务端的 `TURNSTILE_SECRET` 并重启服务；
3. 验证：不带 token 直接向 Waline 评论接口发请求应被拒绝（403）；网页上评论框内会出现验证组件，通过后即可提交。

### 6. 构建与上线

```bash
hugo --minify
```

把生成的 `public/` 交给任意静态托管即可（Caddy / Nginx / GitHub Pages / Cloudflare Pages 都行）。实站的做法：本地 `hugo` 构建后同步到服务器，由 Caddy 直接伺服 `public/`，前面再挂一层 Cloudflare。

## 关于二进制资源（字体 / 演示素材）

本仓库**未包含**以下二进制文件，克隆后请按需补齐（不补也能构建，只是图标与演示内容不完整）：

- **图标字体**：`static/fonts/remixicon.woff2`、`remixicon.woff`、`remixicon.ttf`、`remixicon.eot`——从 [Remix Icon 官方发布](https://github.com/Remix-Design/RemixIcon/releases)下载同名字体文件放入 `static/fonts/`；缺失时页面上的图标会显示为空白方框；
- **演示图片 / 视频**：`static/images/`（头像、封面、示例配图）与 `static/videos/` 下的演示素材，用你自己的文件替换即可，路径与站点配置对应；
- **可选展示字体**：`static/fonts/` 下的平方桥木体、阿里妈妈方圆体、站酷快乐体（woff2 / ttf），版权归各自作者；不补时回退系统字体，不影响阅读。

## 目录速览

- `layouts/` — 在 Amigo 布局基础上改了两处：`_default/baseof.html`（挂载 glass.css、hearts.css、wide.css 与爱心、两侧面板脚本，并注入 Waline 服务器地址）、`_default/single.html`（注入 Waline 评论）；评论组件在 `layouts/partials/comments.html`，服务器地址与 Turnstile 密钥都从站点参数读取；页脚署名在 `layouts/partials/footer.html`；
- `static/css/glass.css` — 全部毛玻璃皮肤，想微调颜色 / 透明度改这一个文件；
- `static/css/hearts.css` + `static/js/hearts.js` — 首页点头像的爱心动画与计数（依赖 Waline 的 article 接口）；
- `static/css/wide.css` + `static/js/sidepanels.js` — 宽屏加宽、两侧玻璃面板、菜单居中与圆角打磨；
- `static/waline/` — Waline 官方客户端（@waline/client 3.16.2）本地托管；
- `hugo.toml` — 带中文注释的配置模板；
- `exampleSite/` — 示例内容。

## 致谢

- 上游主题 [Amigo](https://github.com/zqlit/Hugo-Theme-Amigo)（作者 zqlit，MIT）——本主题的底座；
- [Waline](https://github.com/walinejs/waline)（MIT）——评论系统；
- [Remix Icon](https://github.com/Remix-Design/RemixIcon)——图标字体。

本站的搭建与改版过程记录在 [Sigu 博客](https://blog.bke.us.ci)。
