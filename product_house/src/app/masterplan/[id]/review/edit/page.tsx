// src/app/masterplan/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMasterplan } from '@/hooks/useMasterplan';
import { useToast } from '@/contexts/ToastContext';
import Loading from '@/components/ui/loading';
import Error from '@/components/ui/error';
import AIRefinement from '@/components/masterplan/ai-refinement';

interface MasterplanEditPageProps {
  params: {
    id: string;
  };
}

export default function MasterplanEditPage({ params }: MasterplanEditPageProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const { masterplan, loading, error, updateMasterplan } = useMasterplan(params.id);
  
  const [title, setTitle] = useState('');
  const [sections, setSections] = useState<Array<{ id: string; title: string; content: string }>>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Initialize form data when masterplan is loaded
  useEffect(() => {
    if (masterplan) {
      setTitle(masterplan.title);
      setSections(
        masterplan.sections.map(section => ({
          id: section.id,
          title: section.title,
          content: section.content
        }))
      );
    }
  }, [masterplan]);

  // Set unsaved changes flag when form data changes
  useEffect(() => {
    if (masterplan) {
      const hasUnsavedChanges = 
        title !== masterplan.title || 
        sections.some((section, index) => 
          section.title !== masterplan.sections[index].title || 
          section.content !== masterplan.sections[index].content
        );
      
      setUnsavedChanges(hasUnsavedChanges);
    }
  }, [title, sections, masterplan]);

  // Warn users about unsaved changes when leaving the page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [unsavedChanges]);

  const handleUpdateSection = (id: string, field: 'title' | 'content', value: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const handleAIRefinement = (sectionId: string, newContent: string) => {
    handleUpdateSection(sectionId, 'content', newContent);
  };

  const handleSave = async () => {
    if (!masterplan) return;
    
    setIsSaving(true);
    
    try {
      // Create updated masterplan
      await updateMasterplan(masterplan.id, {
        title,
        sections: sections.map(section => ({
          ...section,
          level: masterplan.sections.find(s => s.id === section.id)?.level || 1
        }))
      });
      
      setUnsavedChanges(false);
      addToast('Masterplan saved successfully!', 'success');
      
      // Redirect back to masterplan view
      router.push(`/masterplan/${params.id}`);
    } catch (err) {
      addToast('Failed to save masterplan. Please try again.', 'error');
      console.error('Error saving masterplan:', err);
    } finally {
      setIsSaving(false);
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
            href={`/masterplan/${params.id}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Back to Masterplan
          </Link>
        </div>
      </div>
    );
  }

  if (!masterplan) {
    return (
      <div className="container mx-auto px-4 py-8">
// src/app/masterplan/[id]/edit/page.tsx (continued)
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
            href={`/masterplan/${params.id}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-4"
          >
            ← Back to Masterplan
          </Link>
          <h1 className="text-2xl font-bold inline-block">
            Edit: {masterplan.title}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/masterplan/${params.id}`)}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !unsavedChanges}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : unsavedChanges ? 'Save Changes' : 'Saved'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-6 mb-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Masterplan Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2"
          />
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={section.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-6">
            <div className="mb-4">
              <label 
                htmlFor={`section-${section.id}-title`} 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Section {index + 1} Title
              </label>
              <input
                type="text"
                id={`section-${section.id}-title`}
                value={section.title}
                onChange={(e) => handleUpdateSection(section.id, 'title', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2"
              />
            </div>
            <div className="mb-2">
              <label 
                htmlFor={`section-${section.id}-content`} 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Content
              </label>
              <textarea
                id={`section-${section.id}-content`}
                value={section.content}
                onChange={(e) => handleUpdateSection(section.id, 'content', e.target.value)}
                rows={6}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2"
              />
            </div>
            <div className="flex justify-end">
              <AIRefinement
                sectionId={section.id}
                sectionTitle={section.title}
                content={section.content}
                onUpdate={handleAIRefinement}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}