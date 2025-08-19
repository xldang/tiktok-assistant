'use client';

import { useState, useEffect } from 'react';
import VideoCardWithMenu from '@/components/VideoCardWithMenu';
import Sidebar from '@/components/Sidebar';
import { Video } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(!!user);
    };

    checkAdminStatus();
  }, [supabase]);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        // Fetch videos
        const { data: videos, error: videosError } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);

        if (videosError) {
          console.error('Error fetching videos:', videosError);
        } else {
          setVideos(videos || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Reset search when navigating to home page
  useEffect(() => {
    const handleRouteChange = () => {
      // Check if we're on the home page
      if (window.location.pathname === '/') {
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    // Listen for route changes
    const pushState = history.pushState;
    history.pushState = function() {
      const result = pushState.apply(history, arguments as any);
      handleRouteChange();
      return result;
    };

    const replaceState = history.replaceState;
    history.replaceState = function() {
      const result = replaceState.apply(history, arguments as any);
      handleRouteChange();
      return result;
    };

    window.addEventListener('popstate', handleRouteChange);

    // Also check on initial load
    handleRouteChange();

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      history.pushState = pushState;
      history.replaceState = replaceState;
    };
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching videos:', error);
      setSearchResults([]);
    }
  };

  // Determine which videos to display
  const displayVideos = searchQuery.trim() ? searchResults : videos;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main content */}
      <div className="lg:w-3/4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {searchQuery.trim() ? `搜索结果 (${displayVideos.length} 个)` : 'Latest Videos'}
        </h1>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : displayVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayVideos.map((video) => (
              <VideoCardWithMenu key={video.id} video={video} isAdmin={isAdmin} />
            ))}
          </div>
        ) : searchQuery.trim() ? (
          <div className="text-center py-12">
            <p className="text-gray-500">没有找到相关视频</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无视频</p>
          </div>
        )}
      </div>
      
      {/* Sidebar */}
      <div className="lg:w-1/4">
        <Sidebar 
          onSearch={handleSearch} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
      </div>
    </div>
  );
}