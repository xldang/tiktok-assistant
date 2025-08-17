import ClientNavbar from '@/components/ClientNavbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <ClientNavbar />
        <main className="flex-grow container mx-auto p-4 pt-20">
          {children}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}