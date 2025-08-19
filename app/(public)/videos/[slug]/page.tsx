import { createClient } from '@/lib/supabase/server';
import { Asset, Video } from '@/lib/types';
import Link from 'next/link';
import DownloadButton from '@/components/DownloadButton';
import AssetImage from '@/components/AssetImage';
import CommentForm from '@/components/Comments';
import { CommentsList } from '@/components/Comments';
import { getCommentsForVideo } from '@/lib/queries/comments';

export default async function VideoDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user;
  
  // Decode the slug in case it contains special characters
  const decodedSlug = decodeURIComponent(params.slug);
  
  // Fetch video data
  const { data: video, error: videoError } = await supabase
    .from('videos')
    .select('*')
    .eq('slug', decodedSlug)
    .single();

  if (videoError || !video) {
    return <div>Video not found</div>;
  }

  // Fetch assets for this video
  const { data: assets, error: assetsError } = await supabase
    .from('assets')
    .select('*')
    .eq('video_id', video.id)
    .order('created_at', { ascending: false });

  if (assetsError) {
    console.error('Error fetching assets:', assetsError);
  }

  // Fetch comments for this video
  const comments = await getCommentsForVideo(video.id);

  

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to Home
        </Link>
        {isAdmin && (
          <Link 
            href={`/admin/videos/${video.id}/edit`} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm cursor-pointer"
          >
            Edit Video
          </Link>
        )}
      </div>
      
      <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
      
      {video.tiktok_url && (
        <div className="mb-4">
          <a 
            href={video.tiktok_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm"
          >
            View on TikTok
          </a>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">制作思路</h2>
        <p className="text-gray-700">{video.description}</p>
      </div>
      
      {video.tags && video.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2">标签</h3>
          <div className="flex flex-wrap gap-2">
            {video.tags.map((tag: string, index: number) => (
              <span key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">视频素材</h2>
        {assets && assets.length > 0 ? (
          <div className="space-y-4">
            {assets.map((asset) => (
              <div key={asset.id} className="border rounded-lg p-4 flex items-center">
                <AssetImage asset={asset} />
                <div className="flex-grow">
                  <h3 className="font-medium">{asset.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{asset.type}</p>
                </div>
                <div className="flex-shrink-0">
                  <DownloadButton assetId={asset.id} url={asset.blob_url} filename={asset.name} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>暂无素材可供下载</p>
        )}
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">评论</h2>
        <CommentForm videoId={video.id} />
        <CommentsList comments={comments} />
      </div>
    </div>
  );
}