import { createClient } from '@/lib/supabase/server';
import { Comment } from '@/lib/types';

export async function getCommentsForVideo(videoId: string): Promise<Comment[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('video_id', videoId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
  
  return data || [];
}