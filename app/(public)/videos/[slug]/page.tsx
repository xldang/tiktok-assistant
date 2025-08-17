import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

type VideoPageProps = {
  params: {
    slug: string;
  };
};

import DownloadButton from '@/components/DownloadButton';

export default async function VideoPage({ params }: VideoPageProps) {
  const supabase = createClient();
  const { data: video, error: videoError } = await supabase
    .from('videos')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (videoError || !video) {
    notFound();
  }

  const { data: assets, error: assetsError } = await supabase
    .from('assets')
    .select('*')
    .eq('video_id', video.id);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">{video.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="aspect-w-16 aspect-h-9 mb-8">
            <iframe
              src={`https://www.tiktok.com/embed/v2/${video.tiktok_url.split('/').pop()}`}
              className="w-full h-full"
              allowFullScreen
              title={video.title}
            ></iframe>
          </div>
          <div className="prose lg:prose-xl">
            <p>{video.description}</p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Assets</h2>
          <div className="space-y-4">
            {assets?.map((asset) => (
              <div key={asset.id} className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium">{asset.name}</p>
                  <p className="text-sm text-gray-500">{asset.type}</p>
                </div>
                <DownloadButton assetId={asset.id} blobUrl={asset.blob_url} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
