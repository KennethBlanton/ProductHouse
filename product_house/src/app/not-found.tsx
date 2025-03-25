// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">The page you are looking for does not exist.</p>
      <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
        Return to Home
      </Link>
    </div>
  );
}