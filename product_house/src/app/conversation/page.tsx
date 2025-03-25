'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ConversationPageProps {
  params: {
    id: string;
  };
}

export default function ConversationPage({ params }: ConversationPageProps) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; content: string; sender: 'user' | 'assistant' }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = { id: `msg-${Date.now()}`, content: message, sender: 'user' as const };
    setMessages([...messages, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    // Mock AI response - will be replaced with real API call later
    setTimeout(() => {
      const assistantMessage = { 
        id: `msg-${Date.now() + 1}`, 
        content: "I'm analyzing your requirements. Please tell me more about your project.", 
        sender: 'assistant' as const 
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-4 h-[calc(100vh-144px)] flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 mr-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-xl font-semibold inline-block">Conversation {params.id}</h1>
        </div>
        <button
          onClick={() => alert('Masterplan generation is not implemented yet')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          Generate Masterplan
        </button>
        </div>
      
      <div className="flex-1 border border-gray-200 bg-white rounded-md overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Start a conversation by typing a message below.</p>
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
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div>{msg.content}</div>
                    <div
                      className={`text-xs mt-1 ${
                        msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                      }`}
                    >
                      {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={1}
                className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                Press Enter to send
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}