// src/components/layout/header.tsx (update)
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ui/theme-toggle';
import UserMenu from '@/components/ui/user-menu';
import { useToast } from '@/contexts/ToastContext';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { addToast } = useToast();

  // Mock user - in a real app, this would come from your authentication context
  const user = {
    name: 'Demo User',
    email: 'demo@example.com',
    picture: null
  };

  const handleSignOut = () => {
    // Mock sign out - in a real app, this would actually sign the user out
    addToast('You have been signed out', 'info');
    router.push('/');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
            AI Product Dev Assistant
          </Link>
          
          <nav className="hidden md:flex space-x-4">
            <Link 
              href="/dashboard" 
              className={`${
                pathname?.startsWith('/dashboard') 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/masterplan" 
              className={`${
                pathname?.startsWith('/masterplan') 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Masterplans
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserMenu user={user} onSignOut={handleSignOut} />
        </div>
      </div>
    </header>
  );
}