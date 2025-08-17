'use client';

import { useState, useEffect } from 'react';
import { Video } from '@/lib/types';

type SidebarProps = {
  onSearch: (query: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export default function Sidebar({ onSearch, searchQuery, setSearchQuery }: SidebarProps) {
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      onSearch(searchQuery);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索视频标题或标签..."
            className="form-input rounded-r-none flex-grow min-w-0"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary rounded-l-none whitespace-nowrap"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : '搜索'}
          </button>
        </div>
      </form>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-3">功能区</h3>
        <p className="text-gray-600 text-sm">更多功能即将推出...</p>
      </div>
    </div>
  );
}