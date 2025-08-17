import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const supabase = createClient();
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin/login');
  }
  
  // Fetch download statistics
  const { data: topAssets, error: assetsError } = await supabase
    .from('assets')
    .select('id, name, type, download_count, videos(title)')
    .order('download_count', { ascending: false })
    .limit(10);

  if (assetsError) {
    console.error('Error fetching asset stats:', assetsError);
  }

  return (
    <div className="p-8 pt-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link 
                href="/admin/videos" 
                className="btn-primary block w-full text-center"
              >
                Manage Videos
              </Link>
              <Link 
                href="/admin/videos/new" 
                className="btn-accent block w-full text-center"
              >
                Add New Video
              </Link>
              <Link 
                href="/admin/settings" 
                className="btn-secondary block w-full text-center"
              >
                Site Settings
              </Link>
              <Link 
                href="/admin/change-password" 
                className="btn-secondary block w-full text-center"
              >
                Change Password
              </Link>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Top Downloaded Assets</h2>
            {topAssets && topAssets.length > 0 ? (
              <div className="space-y-4">
                {topAssets.map((asset) => (
                  <div key={asset.id} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-sm text-gray-600">
                        From: {(asset.videos as any)?.title || 'Unknown'} | {asset.type}
                      </p>
                    </div>
                    <span className="badge badge-primary">
                      {asset.download_count} downloads
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No download data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}