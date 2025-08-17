'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';

type SiteConfig = {
  site_title: string;
  site_subtitle: string;
  cover_image_url: string;
};

export default function SettingsPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .single();
      if (data) {
        setConfig(data);
      } else {
        console.error('Error fetching site config:', error);
      }
    };
    fetchConfig();
  }, [supabase]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    let coverImageUrl = config.cover_image_url;

    if (inputFileRef.current?.files && inputFileRef.current.files.length > 0) {
      const file = inputFileRef.current.files[0];
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      setBlob(newBlob);
      coverImageUrl = newBlob.url;
    }

    const { error } = await supabase
      .from('site_config')
      .update({
        site_title: config.site_title,
        site_subtitle: config.site_subtitle,
        cover_image_url: coverImageUrl,
      })
      .eq('id', 1);

    if (error) {
      alert('Error updating settings: ' + error.message);
    } else {
      alert('Settings updated successfully!');
    }
  };

  if (!config) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Site Settings</h1>
      <form onSubmit={handleUpdate} className="max-w-lg space-y-6">
        <div>
          <label htmlFor="site_title" className="block text-sm font-medium text-gray-700">
            Site Title
          </label>
          <input
            id="site_title"
            type="text"
            value={config.site_title}
            onChange={(e) => setConfig({ ...config, site_title: e.target.value })}
            className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="site_subtitle" className="block text-sm font-medium text-gray-700">
            Site Subtitle
          </label>
          <input
            id="site_subtitle"
            type="text"
            value={config.site_subtitle}
            onChange={(e) => setConfig({ ...config, site_subtitle: e.target.value })}
            className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700">
            Cover Image
          </label>
          <input
            id="cover_image"
            name="file"
            ref={inputFileRef}
            type="file"
            className="block w-full mt-1 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
          {config.cover_image_url && (
            <img src={config.cover_image_url} alt="Cover" className="mt-4 h-32" />
          )}
        </div>
        {blob && (
          <div>
            <p>New image uploaded:</p>
            <a href={blob.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              {blob.url}
            </a>
          </div>
        )}
        <div>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Settings
          </button>
        </div>
      </form>
    </div>
  );
}
