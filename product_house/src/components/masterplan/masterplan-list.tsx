// src/components/masterplan/masterplan-list.tsx
'use client';

import Link from 'next/link';
import { useMasterplan } from '@/hooks/useMasterplan';
import Loading from '@/components/ui/loading';
import Error from '@/components/ui/error';

export default function MasterplanList() {
  const { masterplans, loading, error } = useMasterplan();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loading message="Loading masterplans..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Error message={error} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Masterplans</h1>
        <Link
          href="/conversation"
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-md"
        >
          New Conversation
        </Link>
      </div>

      {masterplans.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {masterplans.map((masterplan) => (
            <Link 
              key={masterplan.id}
              href={`/masterplan/${masterplan.id}`}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md p-4 hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
            >
              <h3 className="font-medium mb-2">{masterplan.title}</h3>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Version {masterplan.version}</span>
                <span>{new Date(masterplan.updatedAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
          <p className="text-gray-500 dark:text-gray-400">No masterplans found.</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Start a conversation and generate your first masterplan!
          </p>
          <div className="mt-4">
            <Link
              href="/conversation"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-md inline-block"
            >
              Start a Conversation
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}