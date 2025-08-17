'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import { upload } from '@vercel/blob/client';
import { Video, Asset } from '@/lib/types';
import { generateThumbnailUrl, isImage } from '@/lib/utils';
import Link from 'next/link';

export default function EditVideoPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const supabase = createClient();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [tags, setTags] = useState('');
  const [assetName, setAssetName] = useState('');

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

    // Validate slug
    if (!video.slug) {
      alert('Please enter a slug');
      return;
    }

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
      // Redirect to the video detail page using the slug
      router.push(`/videos/${video.slug}`);
    }
  };

  const handleDeleteVideo = async () => {
    if (window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) {
        alert('Error deleting video: ' + error.message);
      } else {
        router.push('/admin/videos');
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Automatically fill asset name with file name (without extension)
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      setAssetName(fileName);
    }
  };

  const handleAddAsset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const assetFile = (form.elements.namedItem('assetFile') as HTMLInputElement).files?.[0];

    if (!assetFile) {
      alert('Please select a file to upload.');
      return;
    }

    // Use the assetName state or fallback to file name
    const name = assetName || assetFile.name.replace(/\.[^/.]+$/, "");

    try {
      const newBlob = await upload(assetFile.name, assetFile, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      const { data, error } = await supabase.from('assets').insert([
        {
          video_id: id,
          name: name,
          type: assetFile.type,
          blob_url: newBlob.url,
        },
      ]).select();

      if (error) {
        alert('Error adding asset: ' + error.message);
      } else if (data) {
        setAssets([...assets, data[0]]);
        form.reset();
        setAssetName(''); // Reset asset name after successful upload
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Error uploading file: ' + error.message);
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (window.confirm('Are you sure you want to delete this asset? This action cannot be undone.')) {
      const { error } = await supabase.from('assets').delete().eq('id', assetId);
      if (error) {
        alert('Error deleting asset: ' + error.message);
      } else {
        setAssets(assets.filter((asset) => asset.id !== assetId));
      }
    }
  };

  if (!video) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8 pt-24">
      {video && (
        <Link href={`/videos/${video.slug}`} className="text-blue-500 hover:underline mb-4 block">
          &larr; Back to Video
        </Link>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Editing: {video.title}</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleUpdateVideo}
            className="btn-primary cursor-pointer"
          >
            Update Video
          </button>
          <button
            onClick={handleDeleteVideo}
            className="btn-secondary bg-red-500 hover:bg-red-600 cursor-pointer"
          >
            Delete Video
          </button>
        </div>
      </div>
      
      <div className="card">
        <div className="p-6">
          <form onSubmit={handleUpdateVideo} className="space-y-6">
            <div>
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={video.title}
                onChange={(e) => setVideo({ ...video, title: e.target.value })}
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
                value={video.slug}
                onChange={(e) => setVideo({ ...video, slug: e.target.value })}
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
                value={video.tiktok_url}
                onChange={(e) => setVideo({ ...video, tiktok_url: e.target.value })}
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
                value={video.description}
                onChange={(e) => setVideo({ ...video, description: e.target.value })}
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
              {video.cover_image_url && (
                <img src={video.cover_image_url} alt="Cover" className="mt-4 h-32 object-cover rounded-lg" />
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Assets</h2>
        </div>
        
        <div className="card">
          <div className="p-6">
            {/* Asset list */}
            <div className="space-y-4 mb-8">
              {assets.length > 0 ? (
                assets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-4">
                      {isImage(asset.type) ? (
                        <img 
                          src={generateThumbnailUrl(asset.blob_url, 100)} 
                          alt={asset.name} 
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-md">
                          <span className="text-xs text-gray-600">File</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-gray-600 capitalize">{asset.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="badge badge-primary">
                        {asset.download_count} downloads
                      </span>
                      <a 
                        href={asset.blob_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-700 cursor-pointer"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="text-sm text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No assets found</p>
              )}
            </div>

            {/* Add new asset form */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold mb-4">Add New Asset</h3>
              <form onSubmit={handleAddAsset} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="assetName" className="form-label">
                    Asset Name
                  </label>
                  <input
                    type="text"
                    name="assetName"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    placeholder="Asset name"
                    required
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="assetFile" className="form-label">
                    File
                  </label>
                  <input
                    type="file"
                    name="assetFile"
                    onChange={handleFileChange}
                    required
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="btn-primary w-full cursor-pointer"
                  >
                    Add Asset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}