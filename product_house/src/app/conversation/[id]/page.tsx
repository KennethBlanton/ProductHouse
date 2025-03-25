// src/app/conversation/[id]/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { useConversation } from '@/hooks/useConversation';
import { useMasterplan } from '@/hooks/useMasterplan';
import type { MasterplanTemplate } from '@/lib/masterplan/template';
import Loading from '@/components/ui/loading';
import TemplateSelector from '@/components/masterplan/template-selector';

interface ConversationPageProps {
  params: {
    id: string;
  };
}

export default function ConversationPage({ params }: ConversationPageProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [message, setMessage] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MasterplanTemplate | null>(null);
  
  const {
    conversation,
    messages,
    loading: conversationLoading,
    error: conversationError,
    sendMessage,
    generateMasterplan,
  } = useConversation(params.id);

  const {
    createMasterplan,
    loading: masterplanLoading,
  } = useMasterplan();

  const handleSendMessage = async () => {
    if (!message.trim() || conversationLoading) return;
    
    try {
      await sendMessage(message);
      setMessage('');
    } catch (error) {
      addToast('Failed to send message. Please try again.', 'error');
      console.error('Error sending message:', error);
    }
  };
  
  const handleTemplateSelect = async (template: MasterplanTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateModal(false);
    
    try {
      // Generate masterplan content with selected template
      const content = await generateMasterplan();
      
      // Create masterplan with template sections
      const masterplan = await createMasterplan(
        [conversation?.id || params.id],
        content,
        conversation?.title || `Masterplan ${new Date().toLocaleDateString()}`,
        ['markdown', 'pdf']
      );
      
      addToast('Masterplan generated successfully!', 'success');
      router.push(`/masterplan/${masterplan.id}`);
    } catch (error) {
      addToast('Failed to generate masterplan. Please try again.', 'error');
      console.error('Error generating masterplan:', error);
    }
  };

  const isLoading = conversationLoading || masterplanLoading;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href="/conversation" 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ←
          </Link>
          <h1 className="text-xl font-semibold inline-block">
            {conversation?.title || `Conversation ${params.id}`}
          </h1>
        </div>
        <button
          onClick={() => setShowTemplateModal(true)}
          disabled={isLoading || messages.length === 0}
          className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Generate Masterplan
        </button>
      </div>
      
      <div className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Start a conversation by typing a message below.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3/4 rounded-lg px-4 py-2 ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div
                      className={`text-xs mt-1 ${
                        msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {isLoading && (
            <div className="flex justify-center mt-4">
              <Loading size="small" message="Processing..." />
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={1}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
                Press Enter to send
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-xl w-full">
            <TemplateSelector
              onSelect={handleTemplateSelect}
              onCancel={() => setShowTemplateModal(false)}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {conversationError && (
        <div className="fixed bottom-4 right-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-md shadow-md">
          Error: {conversationError}
          <button 
            className="ml-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            onClick={() => {/* Clear error */}}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
