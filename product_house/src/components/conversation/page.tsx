'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewConversationPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateConversation = () => {
    setIsCreating(true);
    
    // Mock creating a conversation - will be replaced with real API call later
    setTimeout(() => {
      const newConversationId = `conv-${Date.now()}`;
      router.push(`/conversation/${newConversationId}`);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Start a New Conversation</h1>
        
        <div className="bg-white border border-gray-200 rounded-md p-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Conversation Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., E-Commerce Platform Requirements"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          <button
            onClick={handleCreateConversation}
            disabled={isCreating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {isCreating ? 'Creating...' : 'Start Conversation'}
          </button>
        </div>
      </div>
    </div>
  );
}