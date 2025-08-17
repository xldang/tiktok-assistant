import Link from 'next/link';
import { Video } from '@/lib/types';

type VideoCardProps = {
  video: Video;
};

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/videos/${video.slug}`}>
      <div className="card h-full flex flex-col">
        <div className="relative">
          <img
            src={video.cover_image_url || '/placeholder-image.jpg'}
            alt={video.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="font-bold text-lg mb-2 text-gray-900">{video.title}</h3>
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
      </div>
    </Link>
  );
}