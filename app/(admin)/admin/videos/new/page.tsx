'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';

export default function NewVideoPage() {
  const router = useRouter();
  const supabase = createClient();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    let coverImageUrl = '';
    if (inputFileRef.current?.files && inputFileRef.current.files.length > 0) {
      const file = inputFileRef.current.files[0];
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      coverImageUrl = newBlob.url;
    }

    const { error } = await supabase.from('videos').insert([
      {
        title,
        slug,
        tiktok_url: tiktokUrl,
        description,
        tags: tags.split(',').map((tag) => tag.trim()),
        cover_image_url: coverImageUrl,
      },
    ]);

    if (error) {
      alert('Error adding video: ' + error.message);
    } else {
      router.push('/admin/videos');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Add New Video</h1>
      <form onSubmit={handleAddVideo} className="max-w-lg space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            Slug
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="tiktokUrl" className="block text-sm font-medium text-gray-700">
            TikTok URL
          </label>
          <input
            id="tiktokUrl"
            type="text"
            value={tiktokUrl}
            onChange={(e) => setTiktokUrl(e.target.value)}
            required
            className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
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
        </div>
        <div>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Video
          </button>
        </div>
      </form>
    </div>
  );
}
