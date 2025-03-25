// src/components/masterplan/ai-refinement.tsx
'use client';

import { useState } from 'react';
import { useClaudeApi } from '@/hooks/useClaudeApi';
import { useToast } from '@/contexts/ToastContext';
import Loading from '@/components/ui/loading';

interface AIRefinementProps {
  sectionId: string;
  sectionTitle: string;
  content: string;
  onUpdate: (sectionId: string, newContent: string) => void;
}

export default function AIRefinement({
  sectionId,
  sectionTitle,
  content,
  onUpdate
}: AIRefinementProps) {
  const { addToast } = useToast();
  const { sendMessage, loading } = useClaudeApi();
  const [prompt, setPrompt] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    try {
      // Create a system message that guides Claude for refinement
      const system = `
        You are an AI assistant helping to refine a section of a product masterplan.
        The user will provide you with the current content and a request for refinement.
        Maintain the original formatting and structure when appropriate.
        Return only the refined content without any explanations or additional text.
      `;
      
      // Create messages to send to Claude
      const messages = [
        {
          id: '1',
          content: `Section: ${sectionTitle}\n\nCurrent content:\n${content}\n\nRefinement request: ${prompt}`,
          sender: 'user',
          timestamp: new Date().toISOString()
        }
      ];
      
      const response = await sendMessage(messages, system);
      
      // Update the section content
      onUpdate(sectionId, response.content);
      
      // Reset and close form
      setPrompt('');
      setShowForm(false);
      
      addToast('Section successfully refined!', 'success');
    } catch (error) {
      addToast('Failed to refine section. Please try again.', 'error');
      console.error('Refinement error:', error);
    }
  };

  return (
    <div>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          AI Refinement
        </button>
      ) : (
        <form onSubmit={handleRefine} className="mt-4 space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              How would you like to improve this section?
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Make it more concise, Add more technical details, Improve clarity..."
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2"
              disabled={loading}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2">
              {loading && <Loading size="small" />}
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-3 py-1 text-sm rounded-md disabled:opacity-50"
              >
                Refine with AI
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}