# Project: TikTok Creator Content and Asset Sharing Website

This document outlines the plan for creating a website for a TikTok creator to share video creation ideas and source materials.

## 1. Project Goal

To build a full-stack application using Next.js, Supabase, and Vercel Blob that allows a TikTok creator to manage and share their content, and for visitors to view and download creative assets.

## 2. Core Features

### Visitor Features:
- View videos with descriptions and embedded TikToks.
- Browse and download creative assets (images, audio, subtitles).
- Search for videos by title or tags.
- Leave comments via Giscus.
- Submit contact information.
- View asset download statistics.

### Admin Features:
- Secure login/logout (Supabase Auth).
- Password management.
- Website configuration (title, subtitle, cover image).
- Full CRUD (Create, Read, Update, Delete) operations for videos and assets.
- View asset download analytics.

## 3. Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI State Management**: React Hooks + SWR
- **Database & Auth**: Supabase (PostgreSQL)
- **File Storage**: Vercel Blob
- **Comments**: Giscus
- **Deployment**: Vercel

## 4. Project Structure (App Router)

```
/app
├── (public)
│   ├── layout.tsx
│   ├── page.tsx                     # Home page
│   ├── videos
│   │   └── [slug]
│   │       └── page.tsx             # Video detail page
│   ├── assets
│   │   └── page.tsx                 # Asset library page
│   └── contact
│       └── page.tsx                 # Contact form page
└── (admin)
    ├── admin
    │   ├── layout.tsx               # Admin layout with auth check
    │   ├── page.tsx                 # Admin dashboard
    │   ├── login
    │   │   └── page.tsx             # Admin login page
    │   ├── settings
    │   │   └── page.tsx             # Site settings page
    │   └── change-password
    │       └── page.tsx             # Change password page
    └── api
        └── ...                      # API routes for uploads, etc.

/components
/lib
├── supabase
│   ├── client.ts
│   └── server.ts
├── vercel-blob.ts
└── queries.ts                       # SWR data fetching hooks
/styles
/public
```

## 5. Database Schema (Supabase)

**`videos`**
```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  slug TEXT UNIQUE,
  tiktok_url TEXT,
  cover_image_url TEXT,
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

**`assets`**
```sql
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  name TEXT,
  type TEXT, -- image/audio/srt
  blob_url TEXT,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

**`download_log`**
```sql
CREATE TABLE download_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

**`site_config`**
```sql
CREATE TABLE site_config (
  id INT PRIMARY KEY DEFAULT 1, -- Enforce singleton row
  site_title TEXT,
  site_subtitle TEXT,
  cover_image_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Seed initial config
INSERT INTO site_config (site_title, site_subtitle) VALUES ('My TikTok Site', 'Welcome!');
```

## 6. Implementation Steps

1.  **Project Setup**: Initialize a new Next.js project with TypeScript and Tailwind CSS.
2.  **Supabase Setup**:
    *   Create a new Supabase project.
    *   Run the SQL scripts above to create the database tables.
    *   Enable Row Level Security (RLS) and define policies for data access.
    *   Set up Supabase environment variables in `.env.development.local`.
3.  **Vercel Blob Setup**:
    *   Integrate the Vercel Blob storage.
    *   Add environment variables to `.env.development.local`.
4.  **Authentication**:
    *   Implement the admin login page (`/admin/login`).
    *   Create a middleware to protect all `/admin/**` routes, redirecting unauthenticated users to the login page.
    *   Use the Supabase server client for SSR authentication checks.
5.  **Admin Panel**:
    *   Build the site settings page to update the `site_config` table.
    *   Implement file uploads for the cover image using the client-side upload approach for Vercel Blob as described in the documentation.
    *   Build the video and asset management dashboard (CRUD functionality).
6.  **Public Pages**:
    *   Develop the home page to fetch and display recent videos.
    *   Create the dynamic video details page `[slug]`.
    *   Implement the asset download functionality, which will trigger an API call to log the download and increment the `download_count`.
    *   Build the main assets library page with filtering and sorting.
7.  **Final Touches**:
    *   Integrate Giscus for comments.
    *   Create the contact page.
    *   Ensure all pages are responsive.
    *   Write a `README.md` with setup and run instructions.

This plan provides a comprehensive roadmap for the project. I will now proceed with the implementation based on these steps.
