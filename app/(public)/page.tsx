import { createClient } from '@/lib/supabase/server';
import VideoCard from '@/components/VideoCard';

export default async function HomePage() {
  const supabase = createClient();
  const { data: videos, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching videos:', error);
    // Handle the error appropriately
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Latest Videos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos?.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}