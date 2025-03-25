// src/hooks/useClaudeApi.ts
'use client';

import { useState } from 'react';
import { Message } from '@/types/conversation';

interface UseClaudeApiOptions {
  baseUrl?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function useClaudeApi({ baseUrl = '/api/claude' }: UseClaudeApiOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Send a message to Claude API
   */
  const sendMessage = async (messages: Message[], system?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          system,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate a masterplan from conversation messages
   */
  const generateMasterplan = async (messages: Message[], systemPrompt?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/masterplan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          systemPrompt
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate masterplan');
      }
      
      return data.content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get AI-assisted refinement for a masterplan section
   */
  const refineMasterplanSection = async (
    sectionTitle: string, 
    currentContent: string, 
    refinementPrompt: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const systemPrompt = `
        You are an AI assistant helping to refine a section of a product masterplan.
        The user will provide you with the current content and a request for refinement.
        Maintain the original formatting and structure when appropriate.
        Return only the refined content without any explanations or additional text.
      `;
      
      const messages: Message[] = [
        {
          id: '1',
          content: `Section: ${sectionTitle}\n\nCurrent content:\n${currentContent}\n\nRefinement request: ${refinementPrompt}`,
          sender: 'user',
          timestamp: new Date().toISOString()
        }
      ];
      
      const response = await sendMessage(messages, systemPrompt);
      return response.content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    sendMessage,
    generateMasterplan,
    refineMasterplanSection
  };
}