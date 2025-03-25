// src/contexts/ConversationContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Message, Conversation } from '@/types/conversation';
import { claudeApi } from '@/lib/api/claude';

interface ConversationContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  loading: boolean;
  error: string | null;
  createConversation: (title?: string) => Promise<Conversation>;
  loadConversation: (id: string) => Promise<Conversation>;
  sendMessage: (message: Omit<Message, 'id'>) => Promise<Message>;
  generateMasterplan: () => Promise<string>;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export function ConversationProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Create a new conversation
  const createConversation = useCallback(async (title = 'New Conversation'): Promise<Conversation> => {
    setLoading(true);
    setError(null);

    try {
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user-placeholder', // You'll need to replace this with the actual user ID from auth
        messages: []
      };

      // In a real app, save to API/backend
      setConversations(prev => [...prev, newConversation]);
      setCurrentConversation(newConversation);
      
      return newConversation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create conversation';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load a conversation by ID
  const loadConversation = useCallback(async (id: string): Promise<Conversation> => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, fetch from API/backend
      const conversation = conversations.find(conv => conv.id === id);
      
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      setCurrentConversation(conversation);
      return conversation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load conversation';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [conversations]);

  // Send a message in the current conversation
  const sendMessage = useCallback(async (message: Omit<Message, 'id'>): Promise<Message> => {
    if (!currentConversation) {
      throw new Error('No active conversation');
    }

    setLoading(true);
    setError(null);

    try {
      // Create the user message
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        ...message,
        conversationId: currentConversation.id
      };

      // Add message to conversation
      const updatedMessages = [...currentConversation.messages, userMessage];
      
      // Update the current conversation
      const updatedConversation = {
        ...currentConversation,
        messages: updatedMessages,
        updatedAt: new Date().toISOString()
      };

      setCurrentConversation(updatedConversation);
      
      // Update the conversations list
      setConversations(prev => 
        prev.map(conv => conv.id === currentConversation.id ? updatedConversation : conv)
      );

      // In a production app, you would call the Claude API here
      // For now, we'll simulate a response
      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        conversationId: currentConversation.id,
        content: "This is a simulated response from the assistant.",
        sender: 'assistant',
        timestamp: new Date().toISOString()
      };

      // Add assistant message to conversation
      const finalMessages = [...updatedMessages, assistantMessage];
      
      // Update the current conversation again
      const finalConversation = {
        ...updatedConversation,
        messages: finalMessages,
        updatedAt: new Date().toISOString()
      };

      setCurrentConversation(finalConversation);
      
      // Update the conversations list
      setConversations(prev => 
        prev.map(conv => conv.id === currentConversation.id ? finalConversation : conv)
      );

      return assistantMessage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentConversation]);

  // Generate a masterplan from the current conversation
  const generateMasterplan = useCallback(async (): Promise<string> => {
    if (!currentConversation || currentConversation.messages.length === 0) {
      throw new Error('No active conversation or empty conversation');
    }

    setLoading(true);
    setError(null);

    try {
      // In a production app, you would call the Claude API here
      // For now, return a placeholder masterplan
      const masterplanContent = "# Generated Masterplan\n\n## Project Overview\n\nThis is a placeholder masterplan.";
      
      // Add a system message to indicate masterplan generation
      const systemMessage: Message = {
        id: `msg-${Date.now()}`,
        conversationId: currentConversation.id,
        content: "✅ Masterplan has been generated successfully.",
        sender: 'assistant',
        timestamp: new Date().toISOString()
      };
      
      // Update conversation with system message
      const updatedMessages = [...currentConversation.messages, systemMessage];
      const updatedConversation = {
        ...currentConversation,
        messages: updatedMessages,
        updatedAt: new Date().toISOString()
      };
      
      setCurrentConversation(updatedConversation);
      setConversations(prev => 
        prev.map(conv => conv.id === currentConversation.id ? updatedConversation : conv)
      );
      
      return masterplanContent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate masterplan';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentConversation]);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        currentConversation,
        loading,
        error,
        createConversation,
        loadConversation,
        sendMessage,
        generateMasterplan
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  
  return context;
}