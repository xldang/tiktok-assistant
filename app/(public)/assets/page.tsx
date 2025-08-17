import { createClient } from '@/lib/supabase/server';
import { Asset } from '@/lib/types';
import DownloadButton from '@/components/DownloadButton';
import { generateThumbnailUrl, isImage } from '@/lib/utils';

export default async function AssetsPage() {
  const supabase = createClient();
  
  // Fetch all assets with their associated video titles
  const { data: assets, error } = await supabase
    .from('assets')
    .select(`
      *,
      videos(title)
    `)
    .order('download_count', { ascending: false });

  if (error) {
    console.error('Error fetching assets:', error);
    return <div>Error loading assets</div>;
  }

  // Group assets by type
  const assetsByType: Record<string, Asset[]> = {};
  assets.forEach(asset => {
    if (!assetsByType[asset.type]) {
      assetsByType[asset.type] = [];
    }
    assetsByType[asset.type].push(asset);
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">素材库</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">按类型筛选</h2>
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.keys(assetsByType).map(type => (
            <a 
              key={type}
              href={`#type-${type}`}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full capitalize transition-colors cursor-pointer"
            >
              {type}
            </a>
          ))}
        </div>
      </div>

      {Object.entries(assetsByType).map(([type, assets]) => (
        <div key={type} id={`type-${type}`} className="mb-12">
          <h2 className="text-xl font-semibold mb-4 capitalize">{type} 素材</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map(asset => (
              <div key={asset.id} className="card">
                <div className="p-5">
                  <div className="flex items-center space-x-4 mb-4">
                    {isImage(asset.type) ? (
                      <img 
                        src={generateThumbnailUrl(asset.blob_url, 150)} 
                        alt={asset.name} 
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-md">
                        <span className="text-xs text-gray-600">File</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-lg">{asset.name}</h3>
                      <p className="text-sm text-gray-600">
                        来自视频: {asset.videos?.title || '未知视频'}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="badge badge-primary">
                      {asset.download_count} 下载
                    </span>
                    <DownloadButton 
                      assetId={asset.id} 
                      url={asset.blob_url} 
                      filename={asset.name} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(assetsByType).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无素材</p>
        </div>
      )}
    </div>
  );
}