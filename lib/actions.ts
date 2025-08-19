'use server';

import { createClient } from '@/lib/supabase/client'; // Use client client
import { revalidatePath } from 'next/cache';

export async function logDownload(assetId: string) {
  // Create a new client client (will be anonymous if no session)
  const supabase = createClient();

  // Increment download_count
  await supabase.rpc('increment_download_count', { asset_id: assetId });

  // Log the download
  await supabase.from('download_log').insert([{ asset_id: assetId }]);

  revalidatePath(`/videos/.*`, 'page');
  revalidatePath('/assets');
  revalidatePath('/admin/videos/.*', 'page');
}