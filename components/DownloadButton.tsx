'use client';

import { logDownload } from '@/lib/actions';

type DownloadButtonProps = {
  assetId: string;
  blobUrl: string;
};

export default function DownloadButton({ assetId, blobUrl }: DownloadButtonProps) {
  const handleDownload = async () => {
    await logDownload(assetId);
    window.open(blobUrl, '_blank');
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
    >
      Download
    </button>
  );
}
