// src/components/masterplan/comments/comment-interface.tsx
'use client';

import { useState } from 'react';
import { MasterplanComment, MasterplanSection } from '@/types/masterplan';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

interface CommentInterfaceProps {
  sectionId: string;
  sectionTitle: string;
  comments: MasterplanComment[];
  onAddComment: (comment: Omit<MasterplanComment, 'id' | 'timestamp'>) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

export default function CommentInterface({
  sectionId,
  sectionTitle,
  comments,
  onAddComment,
  onDeleteComment
}: CommentInterfaceProps) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [category, setCategory] = useState<MasterplanComment['category']>('clarification');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      addToast('You must be logged in to add comments', 'error');
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onAddComment({
        userId: user.id,
        userName: user.name,
        sectionId,
        content: newComment,
        category,
        mentions: extractMentions(newComment)
      });

      setNewComment('');
      setCategory('clarification');
      setShowComments(true);
      addToast('Comment added successfully', 'success');
    } catch (error) {
      addToast('Failed to add comment', 'error');
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await onDeleteComment(commentId);
      addToast('Comment deleted successfully', 'success');
    } catch (error) {
      addToast('Failed to delete comment', 'error');
      console.error('Error deleting comment:', error);
    }
  };

  // Extract @mentions from comment text
  const extractMentions = (text: string): string[] => {
    const mentions = text.match(/@(\w+)/g) || [];
    return mentions.map(mention => mention.substring(1));
  };

  // Get category badge classes
  const getCategoryClasses = (category: MasterplanComment['category']) => {
    switch (category) {
      case 'clarification':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'risk':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'modification':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'technical':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const sectionComments = comments.filter(comment => comment.sectionId === sectionId);

  return (
    <div className="mt-2">
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      >
        <svg
          className={`w-4 h-4 mr-1 transition-transform ${showComments ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Comments ({sectionComments.length})
      </button>

      {showComments && (
        <div className="mt-2 space-y-4">
          {sectionComments.length > 0 ? (
            <div className="space-y-3">
              {sectionComments.map(comment => (
                <div
                  key={comment.id}
                  className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium">{comment.userName}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                        {new Date(comment.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`text-xs px-2 py-1 rounded ${getCategoryClasses(comment.category)}`}
                      >
                        {comment.category}
                      </span>
                      {user?.id === comment.userId && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                          aria-label="Delete comment"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 whitespace-pre-wrap">{comment.content}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              No comments on this section yet
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-3">
            <div className="mb-2">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder={`Add a comment on "${sectionTitle}". Use @username to mention someone.`}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
                disabled={isSubmitting}
              />
            </div>
            <div className="flex justify-between items-center">
              <select
                value={category}
                onChange={e => setCategory(e.target.value as MasterplanComment['category'])}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md p-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                disabled={isSubmitting}
              >
                <option value="clarification">Clarification Needed</option>
                <option value="risk">Potential Risk</option>
                <option value="modification">Suggested Modification</option>
                <option value="technical">Technical Concern</option>
              </select>
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-3 py-1 rounded-md text-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add Comment'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}