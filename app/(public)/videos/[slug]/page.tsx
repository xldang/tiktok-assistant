import { createClient } from '@/lib/supabase/server';
import { Asset, Video } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import DownloadButton from '@/components/DownloadButton';
import Giscus from '@/components/Giscus';
import { generateThumbnailUrl, isImage } from '@/lib/utils';

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
                {isImage(asset.type) ? (
                  <div className="flex-shrink-0 mr-4 w-24 h-24 relative">
                    <Image 
                      src={generateThumbnailUrl(asset.blob_url, 200)} 
                      alt={asset.name} 
                      fill
                      className="object-cover rounded-md"
                      sizes="100px"
                      onError={(e) => {
                        // Fallback to original URL if thumbnail generation fails
                        const target = e.target as HTMLImageElement;
                        if (target.src !== asset.blob_url) {
                          target.src = asset.blob_url;
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 mr-4 w-24 h-24 flex items-center justify-center bg-gray-200 rounded-md">
                    <span className="text-xs text-gray-600">File</span>
                  </div>
                )}
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
        {/* 
          To use Giscus, you need to:
          1. Set up a GitHub discussion repository
          2. Configure Giscus at https://giscus.app/
          3. Replace the placeholder values below with your actual Giscus configuration
        */}
        <Giscus
          repo="your-github-username/your-repo-name"
          repoId="your-repo-id"
          category="General"
          categoryId="your-category-id"
          mapping="pathname"
          theme="light"
        />
      </div>
    </div>
  );
}