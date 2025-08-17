import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  const supabase = createClient();

  // First, get all videos (without filtering by tags in the database query)
  const { data: allVideos, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ error: 'Error fetching videos' }, { status: 500 });
  }

  // Filter videos based on title, slug, or tags
  const filteredVideos = allVideos.filter(video => {
    // Check title
    if (video.title && video.title.toLowerCase().includes(query.toLowerCase())) {
      return true;
    }
    
    // Check slug
    if (video.slug && video.slug.toLowerCase().includes(query.toLowerCase())) {
      return true;
    }
    
    // Check tags
    if (video.tags && Array.isArray(video.tags)) {
      return video.tags.some((tag: string) => 
        tag && tag.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return false;
  });

  return NextResponse.json(filteredVideos);
}