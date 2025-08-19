import Link from 'next/link';
import Image from 'next/image';
import { Video } from '@/lib/types';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type VideoCardProps = {
  video: Video;
  isAdmin?: boolean;
};

export default function VideoCardWithMenu({ video, isAdmin = false }: VideoCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/videos/${video.id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      const { error } = await supabase.from('videos').delete().eq('id', video.id);
      if (error) {
        alert('Error deleting video: ' + error.message);
      } else {
        // Refresh the page to reflect the deletion
        window.location.reload();
      }
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="card h-full flex flex-col relative">
      <Link href={`/videos/${video.slug}`}>
        <div className="relative">
          <div className="w-full h-48 relative">
            <Image
              src={video.cover_image_url || '/placeholder-image.jpg'}
              alt={video.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        <div className="p-5 flex-grow flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg mb-2 text-gray-900">{video.title}</h3>
            {isAdmin && (
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setMenuOpen(!menuOpen);
                  }}
                  className="btn btn-sm btn-ghost p-2 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>
                {menuOpen && (
                  <div 
                    ref={menuRef}
                    className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg py-1 z-20"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleEdit();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDelete();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="text-gray-600 text-sm flex-grow">
            {video.description?.substring(0, 100)}{video.description && video.description.length > 100 ? '...' : ''}
          </p>
          {video.tags && video.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {video.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="badge badge-secondary text-xs">
                  {tag}
                </span>
              ))}
              {video.tags.length > 3 && (
                <span className="badge badge-secondary text-xs">
                  +{video.tags.length - 3}
                </span>
              )}
            </div>
          )}
          <div className="mt-4 text-xs text-gray-500">
            {new Date(video.created_at).toLocaleDateString('zh-CN')}
          </div>
        </div>
      </Link>
    </div>
  );
}