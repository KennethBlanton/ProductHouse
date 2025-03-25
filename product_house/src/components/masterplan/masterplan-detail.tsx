// src/components/masterplan/masterplan-detail.tsx
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

interface MasterplanDetailProps {
  id: string;
}

export default function MasterplanDetail({ id }: MasterplanDetailProps) {
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
  } = useMasterplan(id);

  // Handle delete masterplan
  const handleDeleteMasterplan = async () => {
    try {
      await removeMasterplan(id);
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
            onClick={() => router.push(`/masterplan/${id}/review`)}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-md"
          >
            Review
          </button>
          <button
            onClick={() => router.push(`/masterplan/${id}/edit`)}
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

      {/* Rest of the component remains the same... */}
    </div>
  );
}