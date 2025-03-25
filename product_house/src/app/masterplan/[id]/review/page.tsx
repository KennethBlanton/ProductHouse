// src/app/masterplan/[id]/review/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Masterplan, MasterplanComment, MasterplanSection } from '@/types/masterplan';
import { useMasterplanCollaboration } from '@/hooks/useMasterplanCollaboration';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import CommentInterface from '@/components/masterplan/comments/comment-interface';
import ReviewWorkflow from '@/components/masterplan/review-workflow';
import VersionHistory from '@/components/masterplan/version-history';
import Loading from '@/components/ui/loading';
import Error from '@/components/ui/error';
import AIRefinement from '@/components/masterplan/ai-refinement';
import { useMasterplan } from '@/hooks/useMasterplan';

interface MasterplanReviewPageProps {
  params: {
    id: string;
  };
}

export default function MasterplanReviewPage({ params }: MasterplanReviewPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { masterplan, loading, error, updateMasterplan } = useMasterplan(params.id);
  
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'comments' | 'workflow' | 'versions'>('comments');
  
  // Use the enhanced collaboration hook
  const {
    masterplan: collabMasterplan,
    comments,
    versions,
    loading: collabLoading,
    error: collabError,
    saving,
    addComment,
    deleteComment,
    createVersion,
    restoreVersion,
    applyAIRefinement
  } = useMasterplanCollaboration(params.id);

  const handleAddComment = async (
    comment: Omit<MasterplanComment, 'id' | 'timestamp'>
  ) => {
    await addComment(comment);
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
  };

  const handleAIRefinement = async (sectionId: string, newContent: string) => {
    await applyAIRefinement(sectionId, newContent);
    addToast('Section updated successfully', 'success');
  };
  
  const handleApplyReviewChanges = async (updatedSections: MasterplanSection[]) => {
    await createVersion(updatedSections);
    addToast('Changes applied and new version created', 'success');
  };
  
  const handleRestoreVersion = async (versionId: string) => {
    await restoreVersion(versionId);
    addToast('Version restored successfully', 'success');
  };

  const toggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  // Count comments per section
  const getCommentCount = (sectionId: string) => {
    return comments.filter(comment => comment.sectionId === sectionId).length;
  };

  if (loading || collabLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loading message="Loading masterplan..." />
      </div>
    );
  }

  if (error || collabError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Error message={error || collabError || "Unknown error"} onRetry={() => router.refresh()} />
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

  if (!masterplan || !collabMasterplan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Error message="Masterplan not found" onRetry={() => router.refresh()} />
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
          <h1 className="text-2xl font-bold mt-2">
            Review: {masterplan.title}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/masterplan/${params.id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-md"
          >
            Edit Masterplan
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">{masterplan.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Version {masterplan.version} • Updated: {new Date(masterplan.updatedAt).toLocaleString()}
            </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'} total
          </div>
        </div>
        
        <div className="flex gap-2 mt-2">
          <div className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded text-xs flex items-center gap-1">
            <span className="font-medium">Clarification</span>
            <span className="bg-blue-200 dark:bg-blue-800 px-1 rounded">
              {comments.filter(c => c.category === 'clarification').length}
            </span>
          </div>
          <div className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded text-xs flex items-center gap-1">
            <span className="font-medium">Risk</span>
            <span className="bg-red-200 dark:bg-red-800 px-1 rounded">
              {comments.filter(c => c.category === 'risk').length}
            </span>
          </div>
          <div className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded text-xs flex items-center gap-1">
            <span className="font-medium">Modification</span>
            <span className="bg-green-200 dark:bg-green-800 px-1 rounded">
              {comments.filter(c => c.category === 'modification').length}
            </span>
          </div>
          <div className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded text-xs flex items-center gap-1">
            <span className="font-medium">Technical</span>
            <span className="bg-purple-200 dark:bg-purple-800 px-1 rounded">
              {comments.filter(c => c.category === 'technical').length}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {masterplan.sections.map((section) => (
          <div
            key={section.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
          >
            <div
              className={`p-4 cursor-pointer ${
                activeSection === section.id
                  ? 'bg-gray-50 dark:bg-gray-700'
                  : ''
              }`}
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{section.title}</h3>
                <div className="flex items-center gap-2">
                  {getCommentCount(section.id) > 0 && (
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                      {getCommentCount(section.id)} {getCommentCount(section.id) === 1 ? 'comment' : 'comments'}
                    </span>
                  )}
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      activeSection === section.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {activeSection === section.id && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap">{section.content}</div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <AIRefinement
                    sectionId={section.id}
                    sectionTitle={section.title}
                    content={section.content}
                    onUpdate={handleAIRefinement}
                  />
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <CommentInterface
                    sectionId={section.id}
                    sectionTitle={section.title}
                    comments={comments}
                    onAddComment={handleAddComment}
                    onDeleteComment={handleDeleteComment}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}