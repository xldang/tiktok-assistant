'use client';

import { useState } from 'react';
import VideoCard from '@/components/VideoCard';
import { Video } from '@/lib/types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error searching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">视频搜索</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索视频标题或标签..."
            className="form-input rounded-r-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary rounded-l-none"
          >
            {loading ? '搜索中...' : '搜索'}
          </button>
        </div>
      </form>

      {results.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">搜索结果 ({results.length} 个)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      ) : query && !loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">没有找到相关视频</p>
        </div>
      ) : null}
    </div>
  );
}