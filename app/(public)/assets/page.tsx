'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Asset } from '@/lib/types';
import DownloadButton from '@/components/DownloadButton';

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [assetTypes, setAssetTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const supabase = createClient();

  useEffect(() => {
    const fetchAssets = async () => {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) {
        setAssets(data);
        setFilteredAssets(data);
        const types = Array.from(new Set(data.map((asset) => asset.type)));
        setAssetTypes(types);
      } else {
        console.error('Error fetching assets:', error);
      }
    };
    fetchAssets();
  }, [supabase]);

  useEffect(() => {
    let filtered = assets;
    if (selectedType !== 'all') {
      filtered = filtered.filter((asset) => asset.type === selectedType);
    }

    if (sortBy === 'download_count') {
      filtered.sort((a, b) => b.download_count - a.download_count);
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredAssets(filtered);
  }, [assets, selectedType, sortBy]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Asset Library</h1>
      <div className="flex justify-between items-center mb-8">
        <div>
          <label htmlFor="typeFilter" className="mr-2">Filter by type:</label>
          <select
            id="typeFilter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All</option>
            {assetTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sortBy" className="mr-2">Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="created_at">Most recent</option>
            <option value="download_count">Most downloaded</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAssets.map((asset) => (
          <div key={asset.id} className="p-4 border rounded-lg">
            <h3 className="font-bold text-lg mb-2">{asset.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{asset.type}</p>
            <DownloadButton assetId={asset.id} blobUrl={asset.blob_url} />
          </div>
        ))}
      </div>
    </div>
  );
}
