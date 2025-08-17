'use client';

import { logDownload } from '@/lib/actions';

type DownloadButtonProps = {
  assetId: string;
  url: string;
  filename: string;
};

export default function DownloadButton({ assetId, url, filename }: DownloadButtonProps) {
  const handleDownload = async () => {
    await logDownload(assetId);
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="btn-primary text-sm"
    >
      下载
    </button>
  );
}