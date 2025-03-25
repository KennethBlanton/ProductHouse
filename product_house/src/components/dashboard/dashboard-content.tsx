// src/components/dashboard/dashboard-content.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMasterplan } from '@/hooks/useMasterplan';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';

export default function DashboardContent() {
  const router = useRouter();
  const { masterplans, loading: masterplansLoading } = useMasterplan();
  const { user } = useAuth();
  
  // Mock conversation data - in a real app, this would come from an API
  const conversations = [
    { 
      id: 'conv-1', 
      title: 'E-Commerce Platform', 
      updatedAt: new Date().toISOString(),
      messageCount: 12
    },
    { 
      id: 'conv-2', 
      title: 'Mobile App Requirements', 
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      messageCount: 8
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <Link
          href="/conversation"
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-md"
        >
          New Conversation
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Conversations</h2>
        
        {conversations.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
            <p className="text-gray-500 dark:text-gray-400">No conversations yet. Start a new one!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {conversations.map((conversation) => (
              <Link 
                key={conversation.id}
                href={`/conversation/${conversation.id}`}
                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md p-4 hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
              >
                <h3 className="font-medium mb-2">{conversation.title}</h3>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{new Date(conversation.updatedAt).toLocaleDateString()}</span>
                  <span>{conversation.messageCount} messages</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Masterplans</h2>
        
        {masterplansLoading ? (
          <div className="flex justify-center py-8">
            <Loading size="small" message="Loading masterplans..." />
          </div>
        ) : masterplans.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
            <p className="text-gray-500 dark:text-gray-400">No masterplans generated yet.</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Start a conversation and generate your first masterplan!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {masterplans.slice(0, 3).map((masterplan) => (
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
            {masterplans.length > 3 && (
              <Link
                href="/masterplan"
                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md p-4 hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer text-center flex items-center justify-center"
              >
                <span className="text-blue-600 dark:text-blue-400">View all masterplans</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}