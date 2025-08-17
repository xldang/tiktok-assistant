import Link from 'next/link';
import { Video } from '@/lib/types';

type VideoCardProps = {
  video: Video;
};

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/videos/${video.slug}`}>
      <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <img
          src={video.cover_image_url || '/placeholder-image.jpg'}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">{video.title}</h3>
          <p className="text-gray-700 text-base">
            {video.description}
          </p>
        </div>
      </div>
    </Link>
  );
}