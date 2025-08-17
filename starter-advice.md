非常好！以下是为你量身定制的**TikTok 创作者素材展示下载网站**的**完整技术行动方案**（Technical Execution Plan），从项目启动到部署上线，覆盖所需步骤、技术选型、操作指南和资源管理。

---

# ✅ TikTok 素材助理网站：完整技术实施行动方案

---

## 1️⃣ 项目目标

* 用于展示 TikTok 视频制作理念与过程；
* 公开对应的**素材下载**（图片/音频/字幕等）；
* 用户可搜索、评论、下载素材，系统自动记录下载行为；
* 你可作为管理员登录后台，修改站点配置（标题、副标题等）；
* 前端使用现代栈（Next.js + Tailwind），后端依赖 Supabase 和 Vercel Blob。

---

## 2️⃣ 技术选型概览

| 类型   | 选型                           | 说明               |
| ---- | ---------------------------- | ---------------- |
| 前端框架 | Next.js (App Router)         | 文件路由、SEO 友好      |
| 样式库  | Tailwind CSS                 | 快速响应式设计          |
| 数据库  | Supabase (PostgreSQL + Auth) | 管理视频、素材、用户等      |
| 存储   | Vercel Blob                  | 用于存储素材文件（图片、音频等） |
| 后台认证 | Supabase Auth                | 管理员登录 / 修改密码     |
| 评论   | Giscus（GitHub Issue）         | 无需部署，嵌入式评论       |
| 分析系统 | Supabase + 下载日志表             | 统计素材下载数据         |
| 搜索   | Supabase 全文索引 + 前端模糊匹配       |                  |
| 表单系统 | Formspree / React Hook Form  | 联系表单提交           |

---

## 3️⃣ 项目目录结构（简化）

```
tiktok-creator-site/
├── pages/
│   ├── index.tsx                  # 首页
│   ├── videos/[slug].tsx          # 单视频页
│   ├── assets/index.tsx           # 素材页
│   ├── contact.tsx                # 联系页
│   └── admin/                     # 后台管理
│       ├── login.tsx
│       ├── index.tsx
│       ├── settings.tsx
│       └── change-password.tsx
├── lib/                           # 封装库
│   ├── supabase.ts
│   ├── vercel-blob.ts
│   ├── auth.ts
│   └── analytics.ts
├── styles/                        # 样式
│   └── globals.css
├── public/                        # 静态资源
├── .env.local.example             # 环境变量模板
├── README.md
├── tailwind.config.js
└── next.config.js
```

---

## 4️⃣ 数据表结构（Supabase）

### 🔹 表 1：videos

| 字段名               | 类型      | 描述           |
| ----------------- | ------- | ------------ |
| id                | UUID    | 主键           |
| title             | TEXT    | 视频标题         |
| slug              | TEXT    | 页面路径 slug    |
| tiktok\_url       | TEXT    | TikTok 原视频地址 |
| cover\_image\_url | TEXT    | 封面图链接        |
| description       | TEXT    | 制作说明         |
| tags              | TEXT\[] | 标签列表         |

---

### 🔹 表 2：assets（素材）

| 字段名             | 类型      | 描述                    |
| --------------- | ------- | --------------------- |
| id              | UUID    | 主键                    |
| video\_id       | UUID    | 关联视频                  |
| name            | TEXT    | 素材名                   |
| type            | TEXT    | image / audio / srt 等 |
| blob\_url       | TEXT    | 下载地址                  |
| download\_count | INTEGER | 下载次数                  |

---

### 🔹 表 3：download\_log

| 字段名         | 类型        | 描述   |
| ----------- | --------- | ---- |
| id          | UUID      | 主键   |
| video\_id   | UUID      | 所属视频 |
| asset\_url  | TEXT      | 下载链接 |
| created\_at | TIMESTAMP | 下载时间 |

---

### 🔹 表 4：site\_config（仅一行）

| 字段名               | 类型        | 描述    |
| ----------------- | --------- | ----- |
| id                | UUID      | 主键    |
| site\_title       | TEXT      | 网站标题  |
| site\_subtitle    | TEXT      | 网站副标题 |
| cover\_image\_url | TEXT      | 首页封面图 |
| updated\_at       | TIMESTAMP | 更新时间  |

---

## 5️⃣ 关键模块开发任务

### ✅ 素材上传与下载

* 登录后台 ➝ 上传素材 ➝ 存入 Vercel Blob ➝ 将返回的 URL 存入 `assets` 表；
* 每次用户点击下载，记录到 `download_log` 表，并更新 `download_count`;

---

### ✅ 管理员系统

* Supabase Auth 实现登录登出；
* `/admin/login.tsx`: 登录表单；
* `/admin/index.tsx`: 管理首页（欢迎 + 数据统计）；
* `/admin/settings.tsx`: 管理标题/副标题等配置；
* `/admin/change-password.tsx`: 修改密码表单；
* 所有 `/admin/**` 路由通过 SSR 强制登录验证。

---

### ✅ 评论系统

* 嵌入 Giscus（需 GitHub 仓库授权）；
* 评论区在每个视频页自动按 slug 建立评论线程。

---

### ✅ 分析系统

* Supabase 查询 `download_log` 聚合：

```sql
SELECT asset_url, COUNT(*) AS downloads
FROM download_log
GROUP BY asset_url
ORDER BY downloads DESC
LIMIT 10;
```

---

## 6️⃣ 项目部署流程

### 📦 使用 Gemini CLI 构建项目骨架

```bash
gemini create tiktok-assistant
cd tiktok-assistant
```

### 💻 初始化 Git 仓库并推送至 GitHub

```bash
git init
git remote add origin https://github.com/xldang/tiktok-assistant.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 🚀 部署到 Vercel

1. 登录 [vercel.com](https://vercel.com)
2. 连接 GitHub 仓库；
3. 在项目 Settings → Environment Variables 添加：

   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `SUPABASE_SERVICE_ROLE_KEY`
   * `VERCEL_BLOB_READ_WRITE_TOKEN`
4. 一键部署
```bash
git push

---

## 7️⃣ 后续优化建议（可选）

| 功能     | 建议                     |
| ------ | ---------------------- |
| 用户注册   | 允许粉丝注册、收藏素材            |
| 多语言支持  | 国际化 i18n 插件            |
| 课程系统   | 发布剪辑教程、付费会员专区          |
| API 接口 | 对外提供 JSON Feed / RSS 等 |

---

