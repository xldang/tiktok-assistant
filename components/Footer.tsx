export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">TikTok Creator Site</h2>
            <p className="text-gray-400 text-sm mt-1">Sharing creative process and resources</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} TikTok Creator Site. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Built with Next.js, Supabase, and Vercel
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}