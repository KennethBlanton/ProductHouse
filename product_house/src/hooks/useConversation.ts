// src/hooks/useConversation.ts
'use client';

import { useState, useEffect } from 'react';
import { Message, Conversation } from '@/types/conversation';
import { useClaudeApi } from './useClaudeApi';

export function useConversation(conversationId?: string) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const claudeApi = useClaudeApi();
  
  // Load conversation if ID is provided
  useEffect(() => {
    if (conversationId) {
      setLoading(true);
      
      // In a real app, fetch from API
      // For now, we'll simulate with mock data
      const mockConversation: Conversation = {
        id: conversationId,
        title: `Conversation ${conversationId}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user-1',
        messages: [],
      };
      
      setTimeout(() => {
        setConversation(mockConversation);
        setMessages(mockConversation.messages);
        setLoading(false);
      }, 500);
    }
  }, [conversationId]);
  
  // Send a message
  const sendMessage = async (content: string) => {
    try {
      setLoading(true);
      
      // Create user message
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        conversationId: conversation?.id,
        content,
        sender: 'user',
        timestamp: new Date().toISOString(),
        userId: 'user-1', // Replace with actual user ID
      };
      
      // Add to messages
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      
      // Call Claude API
      const response = await claudeApi.sendMessage(updatedMessages);
      
      // Create assistant message
      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        conversationId: conversation?.id,
        content: response.content,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      };
      
      // Add assistant message
      setMessages([...updatedMessages, assistantMessage]);
      
      return assistantMessage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Generate masterplan
  const generateMasterplan = async () => {
    try {
      setLoading(true);
      
      if (messages.length === 0) {
        throw new Error('Cannot generate masterplan from empty conversation');
      }
      
      // Call masterplan generation API
      const content = await claudeApi.generateMasterplan(messages);
      
      return content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate masterplan';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    conversation,
    messages,
    loading,
    error,
    sendMessage,
    generateMasterplan,
  };
}