'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import { upload } from '@vercel/blob/client';
import { Video, Asset } from '@/lib/types';

export default function EditVideoPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const supabase = createClient();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [tags, setTags] = useState('');

  useEffect(() => {
    const fetchVideoAndAssets = async () => {
      const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();
      if (videoData) {
        setVideo(videoData);
        setTags(videoData.tags.join(', '));
      } else {
        console.error('Error fetching video:', videoError);
      }

      const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select('*')
        .eq('video_id', id);
      if (assetsData) {
        setAssets(assetsData);
      } else {
        console.error('Error fetching assets:', assetsError);
      }
    };
    if (id) {
      fetchVideoAndAssets();
    }
  }, [id, supabase]);

  const handleUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video) return;

    let coverImageUrl = video.cover_image_url;
    if (inputFileRef.current?.files && inputFileRef.current.files.length > 0) {
      const file = inputFileRef.current.files[0];
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      coverImageUrl = newBlob.url;
    }

    const { error } = await supabase
      .from('videos')
      .update({
        title: video.title,
        slug: video.slug,
        tiktok_url: video.tiktok_url,
        description: video.description,
        tags: tags.split(',').map((tag) => tag.trim()),
        cover_image_url: coverImageUrl,
      })
      .eq('id', id);

    if (error) {
      alert('Error updating video: ' + error.message);
    } else {
      router.push('/admin/videos');
    }
  };

  const handleDeleteVideo = async () => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) {
        alert('Error deleting video: ' + error.message);
      } else {
        router.push('/admin/videos');
      }
    }
  };

  const handleAddAsset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const assetName = (form.elements.namedItem('assetName') as HTMLInputElement).value;
    const assetFile = (form.elements.namedItem('assetFile') as HTMLInputElement).files?.[0];

    if (!assetFile) {
      alert('Please select a file to upload.');
      return;
    }

    const newBlob = await upload(assetFile.name, assetFile, {
      access: 'public',
      handleUploadUrl: '/api/upload',
    });

    const { data, error } = await supabase.from('assets').insert([
      {
        video_id: id,
        name: assetName,
        type: assetFile.type,
        blob_url: newBlob.url,
      },
    ]).select();

    if (error) {
      alert('Error adding asset: ' + error.message);
    } else if (data) {
      setAssets([...assets, data[0]]);
      form.reset();
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      const { error } = await supabase.from('assets').delete().eq('id', assetId);
      if (error) {
        alert('Error deleting asset: ' + error.message);
      } else {
        setAssets(assets.filter((asset) => asset.id !== assetId));
      }
    }
  };

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Edit Video</h1>
      <form onSubmit={handleUpdateVideo} className="max-w-lg space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={video.title}
            onChange={(e) => setVideo({ ...video, title: e.target.value })}
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
            value={video.slug}
            onChange={(e) => setVideo({ ...video, slug: e.target.value })}
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
            value={video.tiktok_url}
            onChange={(e) => setVideo({ ...video, tiktok_url: e.target.value })}
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
            value={video.description}
            onChange={(e) => setVideo({ ...video, description: e.target.value })}
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
          {video.cover_image_url && (
            <img src={video.cover_image_url} alt="Cover" className="mt-4 h-32" />
          )}
        </div>
        <div>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Video
          </button>
          <button
            type="button"
            onClick={handleDeleteVideo}
            className="px-4 py-2 ml-4 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Video
          </button>
        </div>
      </form>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Assets</h2>
        <div className="bg-white shadow-md rounded-lg p-8">
          {/* Asset list */}
          <div className="space-y-4">
            {assets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{asset.name}</p>
                  <a href={asset.blob_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500">
                    {asset.blob_url}
                  </a>
                </div>
                <button
                  onClick={() => handleDeleteAsset(asset.id)}
                  className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Add new asset form */}
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">Add New Asset</h3>
            <form onSubmit={handleAddAsset} className="flex items-center space-x-4">
              <input
                type="text"
                name="assetName"
                placeholder="Asset name"
                required
                className="block w-full px-3 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <input
                type="file"
                name="assetFile"
                required
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Add Asset
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
