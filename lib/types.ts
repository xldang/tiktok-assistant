export type Video = {
  id: string;
  title: string;
  slug: string;
  tiktok_url: string;
  cover_image_url: string;
  description: string;
  tags: string[];
  created_at: string;
};

export type Asset = {
  id: string;
  video_id: string;
  name: string;
  type: string;
  blob_url: string;
  download_count: number;
  created_at: string;
  videos?: Video | null;
};
