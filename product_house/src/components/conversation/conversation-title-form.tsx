// src/components/conversation/conversation-title-form.tsx
'use client';

import { useState } from 'react';

interface ConversationTitleFormProps {
  initialTitle: string;
  onSubmit: (title: string) => Promise<void>;
  onCancel: () => void;
}

export default function ConversationTitleForm({
  initialTitle,
  onSubmit,
  onCancel
}: ConversationTitleFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // src/components/conversation/conversation-title-form.tsx (continued)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(title);
    } catch (error) {
      console.error('Error updating title:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Conversation Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for this conversation"
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2"
          disabled={isSubmitting}
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-md disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}