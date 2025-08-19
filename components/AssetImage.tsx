'use client';

import Image from 'next/image';
import { useState } from 'react';
import { generateThumbnailUrl, isImage } from '@/lib/utils';

type AssetImageProps = {
  asset: {
    blob_url: string;
    name: string;
    type: string;
  };
  width?: number;
  height?: number;
};

export default function AssetImage({ asset, width = 200, height = 200 }: AssetImageProps) {
  const [imgSrc, setImgSrc] = useState(generateThumbnailUrl(asset.blob_url, width));
  
  if (!isImage(asset.type)) {
    return (
      <div className="flex-shrink-0 mr-4 w-24 h-24 flex items-center justify-center bg-gray-200 rounded-md">
        <span className="text-xs text-gray-600">File</span>
      </div>
    );
  }

  const handleError = () => {
    // Fallback to original URL if thumbnail generation fails
    if (imgSrc !== asset.blob_url) {
      setImgSrc(asset.blob_url);
    }
  };

  return (
    <div className="flex-shrink-0 mr-4 w-24 h-24 relative">
      <Image 
        src={imgSrc} 
        alt={asset.name} 
        fill
        className="object-cover rounded-md"
        sizes="100px"
        onError={handleError}
      />
    </div>
  );
}