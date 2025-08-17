import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          TikTok Creator Site
        </Link>
        <div className="space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link href="/assets" className="text-gray-300 hover:text-white">
            Assets
          </Link>
          <Link href="/contact" className="text-gray-300 hover:text-white">
            Contact
          </Link>
          <Link href="/admin" className="text-gray-300 hover:text-white">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
