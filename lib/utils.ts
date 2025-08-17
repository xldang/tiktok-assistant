/**
 * Generate a thumbnail URL for an image
 * This function appends query parameters to the image URL to resize it
 * while maintaining the original URL for downloads
 */
export function generateThumbnailUrl(originalUrl: string, width: number = 300): string {
  // For Vercel Blob URLs, we can add resize parameters
  if (originalUrl.includes('vercel-storage.com')) {
    // Add width parameter for resizing
    const separator = originalUrl.includes('?') ? '&' : '?';
    return `${originalUrl}${separator}w=${width}`;
  }
  
  // For other URLs, return as is (could implement other services later)
  return originalUrl;
}

/**
 * Check if a URL is an image
 */
export function isImage(type: string): boolean {
  return type.startsWith('image/');
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate a URL-safe slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}