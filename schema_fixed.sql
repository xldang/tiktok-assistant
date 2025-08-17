-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  slug TEXT UNIQUE,
  tiktok_url TEXT,
  cover_image_url TEXT,
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  name TEXT,
  type TEXT, -- image/audio/srt
  blob_url TEXT,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create download_log table
CREATE TABLE IF NOT EXISTS download_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create site_config table
CREATE TABLE IF NOT EXISTS site_config (
  id INT PRIMARY KEY DEFAULT 1, -- Enforce singleton row
  site_title TEXT,
  site_subtitle TEXT,
  cover_image_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed initial site_config data
INSERT INTO site_config (site_title, site_subtitle) VALUES ('My TikTok Site', 'Welcome!');

-- Enable Row Level Security for all tables
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow public read access to all tables
CREATE POLICY "Allow public read access" ON videos FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON assets FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON download_log FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON site_config FOR SELECT USING (true);

-- Allow admin full access to all tables
-- This assumes you have a way to identify admins, e.g., using a custom claim in JWT
-- For simplicity, we'll allow all authenticated users to have full access.
-- You should replace `authenticated` with a more specific role in a real application.
CREATE POLICY "Allow full access for authenticated users" ON videos FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for authenticated users" ON assets FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for authenticated users" ON download_log FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for authenticated users" ON site_config FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Create a function to increment the download count
CREATE OR REPLACE FUNCTION increment_download_count(asset_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE assets
  SET download_count = download_count + 1
  WHERE id = asset_id_param;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to the function
GRANT EXECUTE ON FUNCTION increment_download_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_download_count(UUID) TO anon;