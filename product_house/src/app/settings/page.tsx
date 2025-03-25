// src/app/settings/page.tsx
'use client';

import Link from 'next/link';
import UserSettings from '@/components/settings/user-settings';

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-4"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold mt-2">Settings</h1>
      </div>
      
      <div className="md:grid md:grid-cols-4 md:gap-6">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
            <nav className="space-y-2">
              <a href="#user-settings" className="block py-2 px-3 rounded-md bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                User Settings
              </a>
              <a href="#account" className="block py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                Account
              </a>
              <a href="#integrations" className="block py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                Integrations
              </a>
            </nav>
          </div>
        </div>
        
        <div className="mt-5 md:mt-0 md:col-span-3">
          <div id="user-settings">
            <UserSettings />
          </div>
        </div>
      </div>
    </div>
  );
}