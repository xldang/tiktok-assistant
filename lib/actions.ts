'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function logDownload(assetId: string) {
  const supabase = createClient();

  // Increment download_count
  await supabase.rpc('increment_download_count', { asset_id: assetId });

  // Log the download
  await supabase.from('download_log').insert([{ asset_id: assetId }]);

  revalidatePath(`/videos/.*`, 'page');
  revalidatePath('/assets');
  revalidatePath('/admin/videos/.*', 'page');
}