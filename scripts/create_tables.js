const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  try {
    // Create videos table
    const { error: videoError } = await supabase.rpc('exec_sql', {
      sql: 'CREATE TABLE IF NOT EXISTS videos (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT, slug TEXT UNIQUE, tiktok_url TEXT, cover_image_url TEXT, description TEXT, tags TEXT[], created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone(\'utc\'::text, now()) NOT NULL);'
    });
    
    if (videoError) {
      console.error('Error creating videos table:', videoError);
    } else {
      console.log('Videos table created successfully');
    }
    
    // Create assets table
    const { error: assetError } = await supabase.rpc('exec_sql', {
      sql: 'CREATE TABLE IF NOT EXISTS assets (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), video_id UUID REFERENCES videos(id) ON DELETE CASCADE, name TEXT, type TEXT, blob_url TEXT, download_count INTEGER DEFAULT 0, created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone(\'utc\'::text, now()) NOT NULL);'
    });
    
    if (assetError) {
      console.error('Error creating assets table:', assetError);
    } else {
      console.log('Assets table created successfully');
    }
    
    // Create download_log table
    const { error: logError } = await supabase.rpc('exec_sql', {
      sql: 'CREATE TABLE IF NOT EXISTS download_log (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), asset_id UUID REFERENCES assets(id) ON DELETE CASCADE, created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone(\'utc\'::text, now()) NOT NULL);'
    });
    
    if (logError) {
      console.error('Error creating download_log table:', logError);
    } else {
      console.log('Download_log table created successfully');
    }
    
    // Create site_config table
    const { error: configError } = await supabase.rpc('exec_sql', {
      sql: 'CREATE TABLE IF NOT EXISTS site_config (id INT PRIMARY KEY DEFAULT 1, site_title TEXT, site_subtitle TEXT, cover_image_url TEXT, updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone(\'utc\'::text, now()) NOT NULL);'
    });
    
    if (configError) {
      console.error('Error creating site_config table:', configError);
    } else {
      console.log('Site_config table created successfully');
    }
    
    // Insert initial site_config data
    const { error: insertError } = await supabase
      .from('site_config')
      .insert([{ site_title: 'My TikTok Site', site_subtitle: 'Welcome!' }]);
    
    if (insertError) {
      console.error('Error inserting initial site_config data:', insertError);
    } else {
      console.log('Initial site_config data inserted successfully');
    }
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

createTables();