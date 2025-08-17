'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type SiteConfig = {
  site_title: string;
  site_subtitle: string;
  cover_image_url: string;
};

export default function SettingsPage() {
  const router = useRouter();
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
      
      try {
        const newBlob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        setBlob(newBlob);
        coverImageUrl = newBlob.url;
      } catch (error: any) {
        console.error('Upload error:', error);
        alert('Error uploading cover image: ' + error.message);
        return;
      }
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
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8 pt-24">
      <div className="flex items-center mb-6">
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mr-4">
          Site Settings
        </span>
        <button
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Back
        </button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Site Settings</h1>
      </div>
      
      <div className="card">
        <div className="p-6">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label htmlFor="site_title" className="form-label">
                Site Title
              </label>
              <input
                id="site_title"
                type="text"
                value={config.site_title}
                onChange={(e) => setConfig({ ...config, site_title: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="site_subtitle" className="form-label">
                Site Subtitle
              </label>
              <input
                id="site_subtitle"
                type="text"
                value={config.site_subtitle}
                onChange={(e) => setConfig({ ...config, site_subtitle: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="cover_image" className="form-label">
                Cover Image
              </label>
              <input
                id="cover_image"
                name="file"
                ref={inputFileRef}
                type="file"
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              />
              {config.cover_image_url && (
                <img src={config.cover_image_url} alt="Cover" className="mt-4 h-48 w-full object-cover rounded-lg" />
              )}
            </div>
            {blob && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 font-medium">New image uploaded successfully!</p>
                <a href={blob.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-sm">
                  View uploaded image
                </a>
              </div>
            )}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="btn-primary"
              >
                Update Settings
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}