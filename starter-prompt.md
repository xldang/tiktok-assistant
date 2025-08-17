

# 项目名称：TikTok 创作者内容与素材分享网站

## 🧑 项目背景：
我是一个 TikTok 视频创作者，计划搭建一个网站，用于展示我每条 TikTok 视频的创作思路、原始素材（如高清图、配音、字幕等），供感兴趣的观众访问和下载。网站面向用户开放，但部分管理功能仅限我本人登录后台使用。

---

## ✅ 网站目标功能

### 访客可见功能：
- 视频展示页（封面图 + 嵌入 TikTok + 简要说明 + 素材下载）
- 素材分类展示和下载页
- 视频搜索功能（按标题/标签）
- 评论系统（使用 Giscus 嵌入）
- 联系表单（提交邮箱信息）
- 素材下载行为记录与统计排行展示

### 管理员功能：
- 登录登出（基于 Supabase Auth）
- 修改登录密码
- 设置网站基础信息（标题、副标题、封面图）
- 视频和素材数据管理（上传、编辑、删除）
- 查看素材下载统计分析排行

---

## ⚙️ 技术选型

| 模块 | 技术 |
|------|------|
| 前端框架 | Next.js 14（使用 App Router） |
| 样式库 | Tailwind CSS |
| 状态管理 | React hooks + SWR |
| 数据库 | Supabase（PostgreSQL + Auth） |
| 文件存储 | Vercel Blob |
| 评论系统 | Giscus |
| 表单系统 | Formspree 或 Supabase |
| 部署方式 | 创建项目 ➝ 推送到 GitHub ➝ 自动部署到 Vercel |

---

## 🗂 项目结构要求（初始化建议）

```

/pages
├── index.tsx                  # 首页：展示最近视频卡片
├── videos/\[slug].tsx          # 视频详情页
├── assets/index.tsx           # 素材库页面
├── contact.tsx                # 联系表单页
└── admin/
├── login.tsx             # 管理员登录页
├── index.tsx             # 管理后台首页（数据面板）
├── settings.tsx          # 设置网站信息
└── change-password.tsx   # 修改密码

/components                      # 所有 UI 模块组件
/lib
├── supabase.ts                # Supabase 客户端
├── vercel-blob.ts             # 文件上传逻辑封装
├── auth.ts                    # SSR 鉴权逻辑封装
└── analytics.ts               # 下载记录逻辑封装

/styles                          # Tailwind 样式
/public                          # 静态文件

````

---

## 🧾 数据表结构定义（Supabase SQL）

### 1. videos
```sql
id UUID PRIMARY KEY,
title TEXT,
slug TEXT UNIQUE,
tiktok_url TEXT,
cover_image_url TEXT,
description TEXT,
tags TEXT[]
````

### 2. assets

```sql
id UUID PRIMARY KEY,
video_id UUID REFERENCES videos(id),
name TEXT,
type TEXT, -- image/audio/srt
blob_url TEXT,
download_count INTEGER DEFAULT 0
```

### 3. download\_log

```sql
id UUID PRIMARY KEY,
video_id UUID REFERENCES videos(id),
asset_url TEXT,
created_at TIMESTAMP DEFAULT now()
```

### 4. site\_config

```sql
id UUID PRIMARY KEY,
site_title TEXT,
site_subtitle TEXT,
cover_image_url TEXT,
updated_at TIMESTAMP DEFAULT now()
```

---

## 🔐 管理员认证要求

* 使用 Supabase Auth 的 email/password 登录方式
* 所有 `/admin/**` 页面必须 SSR 鉴权，未登录自动重定向到 `/admin/login`
* 登录成功后获取 JWT，登录状态持久化

---

## 🧩 每个页面需实现的要点

### `/index.tsx`

* 展示最近 6 条视频卡片
* 使用站点标题、副标题（读取 site\_config 表）
* 链接到视频详情页

### `/videos/[slug].tsx`

* 获取当前视频数据、相关素材列表
* 嵌入 TikTok 视频
* 显示制作思路、标签
* 素材区展示并提供下载按钮（点击记录 download\_log）

### `/assets/index.tsx`

* 所有素材统一展示
* 支持筛选（按类型 / 视频名称）
* 显示下载次数排序

### `/admin/settings.tsx`

* 显示并修改 site\_config 表数据（标题、副标题、封面图）
* 使用 Vercel Blob 上传封面图

### `/admin/change-password.tsx`

* 登录状态下修改密码（使用 supabase.auth.updateUser）

---

## 📥 其他要求

* 使用 `.env.development.local` 管理 Supabase/Vercel 环境变量
* 提供 README.md 文件，说明如何启动开发环境
* 所有文件组织整洁，符合 Next.js App Router 规范
* 所有页面必须响应式布局，兼容移动端
* 文件上传需使用 Vercel Blob SDK 封装在 `/lib/vercel-blob.ts`

---

## 🚀 最终目标

将基于以上说明，输出整个项目的结构化代码，具备：

* 完整功能逻辑
* 可以直接部署的结构
* 与 Supabase/Vercel 可连接运行

请将完整项目代码按模块生成，确保组件分离、结构清晰、注释充分。

```
