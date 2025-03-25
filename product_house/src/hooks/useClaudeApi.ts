// src/hooks/useClaudeApi.ts
'use client';

import { useState } from 'react';
import { Message } from '@/types/conversation';

interface UseClaudeApiOptions {
  baseUrl?: string;
}

export function useClaudeApi({ baseUrl = '/api/claude' }: UseClaudeApiOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const generateMasterplan = async (messages: Message[]) => {
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
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      return data.content;
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
  };
}