# TikTok Creator Content and Asset Sharing Website

This is a full-stack application built with Next.js, Supabase, and Vercel Blob. It allows a TikTok creator to share their video creation process and assets with their audience.

## Features

### Public Features
- Browse videos and their creation process.
- Download assets like images, audio, and subtitles.
- Filter and sort assets in the asset library.
- Contact the creator through a contact form.

### Admin Features
- Secure login with email and password.
- Manage site settings (title, subtitle, cover image).
- Change admin password.
- Full CRUD (Create, Read, Update, Delete) for videos and their assets.
- Upload files to Vercel Blob.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **File Storage**: Vercel Blob
- **Deployment**: Vercel

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1.  Create a new project on [Supabase](https://supabase.com/).
2.  Go to the "SQL Editor" and run the SQL from the `schema.sql` file to create the database tables and policies.
3.  In your Supabase project, go to "Project Settings" > "API" and get your Project URL and `anon` public key.
4.  You will also need the `service_role` key for some operations. Be careful with this key and do not expose it on the client-side.

### 4. Set up Vercel Blob

1.  Create a new Blob store on [Vercel](https://vercel.com/).
2.  Get your Blob read-write token.

### 5. Set up environment variables

Create a `.env.development.local` file in the root of the project and add the following environment variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

Replace the placeholder values with your actual credentials.

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The admin section is available at [http://localhost:3000/admin](http://localhost:3000/admin).

## Future Improvements

- **Giscus Comment System**: Integrate [Giscus](https://giscus.app/) for comments on the video detail pages.
- **Advanced Analytics**: Implement more detailed analytics for asset downloads.
- **User Roles**: Add more user roles for more complex permission management.
- **Testing**: Add unit and integration tests.