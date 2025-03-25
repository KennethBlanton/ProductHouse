// src/components/layout/header.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, isAuthenticated, login, logout, loading } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-blue-600">
            AI Product Dev Assistant
          </Link>
          
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/masterplan" className="text-gray-700 hover:text-blue-600">
                Masterplans
              </Link>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {loading ? (
            <div>Loading...</div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:block text-sm text-gray-700">
                {user?.name}
              </div>
              <div className="relative group">
                <button
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
                >
                  {user?.picture ? (
                    <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-medium">{user?.name?.charAt(0)}</span>
                  )}
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-sm text-gray-500 truncate">{user?.email}</div>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => login()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}