import { createClient } from '@/lib/supabase/server';
import ClientNavbar from '@/components/ClientNavbar';
import { AuthProvider } from '@/contexts/AuthContext';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <ClientNavbar />
        <main className="container mx-auto px-4 py-8 pt-20">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}