'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';
import { generateSlug } from '@/lib/utils';
import Link from 'next/link';

export default function NewVideoPage() {
  const router = useRouter();
  const supabase = createClient();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  // Generate slug from title
  useEffect(() => {
    if (title) {
      setSlug(generateSlug(title));
    }
  }, [title]);

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate slug
    if (!slug) {
      alert('Please enter a slug');
      return;
    }

    let coverImageUrl = '';
    if (inputFileRef.current?.files && inputFileRef.current.files.length > 0) {
      const file = inputFileRef.current.files[0];
      
      try {
        const newBlob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        coverImageUrl = newBlob.url;
      } catch (error: any) {
        console.error('Upload error:', error);
        alert('Error uploading cover image: ' + error.message);
        return;
      }
    }

    const { data, error } = await supabase.from('videos').insert([
      {
        title,
        slug,
        tiktok_url: tiktokUrl,
        description,
        tags: tags.split(',').map((tag) => tag.trim()),
        cover_image_url: coverImageUrl,
      },
    ]).select();

    if (error) {
      alert('Error adding video: ' + error.message);
    } else if (data && data.length > 0) {
      // Redirect to the video detail page
      router.push(`/videos/${data[0].slug}`);
    } else {
      router.push('/admin/videos');
    }
  };

  return (
    <div className="p-8 pt-24">
      <div className="flex items-center mb-6">
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-4">
          Add New Video
        </span>
        <button
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Back
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Add New Video</h1>
      
      <div className="card">
        <div className="p-6">
          <form onSubmit={handleAddVideo} className="space-y-6">
            <div>
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="slug" className="form-label">
                Slug
              </label>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="form-input"
              />
              <p className="text-sm text-gray-500 mt-1">This will be used in the URL. Use lowercase letters, numbers, and hyphens only.</p>
            </div>
            <div>
              <label htmlFor="tiktokUrl" className="form-label">
                TikTok URL
              </label>
              <input
                id="tiktokUrl"
                type="text"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="tags" className="form-label">
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
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
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="btn-primary"
              >
                Add Video
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