// src/app/masterplan/page.tsx
'use client';

import Link from 'next/link';
import { useMasterplan } from '@/hooks/useMasterplan';

export default function MasterplanListPage() {
  const { masterplans, loading, error } = useMasterplan();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-pulse">Loading masterplans...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Masterplans</h1>
      </div>

      {masterplans.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {masterplans.map((masterplan) => (
            <Link 
              key={masterplan.id}
              href={`/masterplan/${masterplan.id}`}
              className="border border-gray-200 bg-white rounded-md p-4 hover:border-blue-500 transition-colors cursor-pointer"
            >
              <h3 className="font-medium mb-2">{masterplan.title}</h3>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Version {masterplan.version}</span>
                <span>{new Date(masterplan.updatedAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white border border-gray-200 rounded-md">
          <p className="text-gray-500">No masterplans found.</p>
          <p className="mt-2 text-sm text-gray-500">
            Start a conversation and generate your first masterplan!
          </p>
          <div className="mt-4">
            <Link
              href="/conversation"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-block"
            >
              Start a Conversation
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}