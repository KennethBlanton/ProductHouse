// src/app/masterplan/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MasterplanFormat } from '@/types/masterplan';
import { useMasterplan } from '@/hooks/useMasterplan';
import { useToast } from '@/contexts/ToastContext';
import Loading from '@/components/ui/loading';
import Error from '@/components/ui/error';
import ExportMasterplan from '@/components/masterplan/export-masterplan';

interface MasterplanPageProps {
  params: {
    id: string;
  };
}

export default function MasterplanPage({ params }: MasterplanPageProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'preview' | 'export'>('preview');
  const [activeFormat, setActiveFormat] = useState<MasterplanFormat>('markdown');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const {
    masterplan,
    loading,
    error,
    removeMasterplan
  } = useMasterplan(params.id);

  // Handle delete masterplan
  const handleDeleteMasterplan = async () => {
    try {
      await removeMasterplan(params.id);
      addToast('Masterplan deleted successfully', 'success');
      router.push('/masterplan');
    } catch (error) {
      addToast('Failed to delete masterplan', 'error');
      console.error('Error deleting masterplan:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loading message="Loading masterplan..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Error 
          message={error}
          onRetry={() => router.refresh()} 
        />
        <div className="mt-4">
          <Link
            href="/masterplan"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Back to Masterplans
          </Link>
        </div>
      </div>
    );
  }

  if (!masterplan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Error 
          message="Masterplan not found"
          onRetry={() => router.refresh()}
        />
        <div className="mt-4">
          <Link
            href="/masterplan"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Back to Masterplans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/masterplan"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-4"
          >
            ← Back to Masterplans
          </Link>
          <h1 className="text-2xl font-bold inline-block">{masterplan.title}</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/masterplan/${params.id}/review`)}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-md"
          >
            Review
          </button>
          <button
            onClick={() => router.push(`/masterplan/${params.id}/edit`)}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md"
          >
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <div>
            <p>
              <span className="font-medium">Version:</span> {masterplan.version}
            </p>
            <p>
              <span className="font-medium">Created:</span>{' '}
              {new Date(masterplan.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label htmlFor="formatSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Format:
              </label>
              <select
                id="formatSelect"
                value={activeFormat}
                onChange={(e) => setActiveFormat(e.target.value as MasterplanFormat)}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md p-2"
              >
                {Object.keys(masterplan.formats).map((format) => (
                  <option key={format} value={format}>
                    {format.charAt(0).toUpperCase() + format.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'preview'
              ? 'bg-blue-600 dark:bg-blue-700 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'export'
              ? 'bg-blue-600 dark:bg-blue-700 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Export
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-6">
        {activeTab === 'preview' ? (
          <div className="prose dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300">
            <pre className="whitespace-pre-wrap font-sans">{masterplan.formats.markdown}</pre>
          </div>
        ) : (
          <ExportMasterplan masterplan={masterplan} />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this masterplan? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMasterplan}
                className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}