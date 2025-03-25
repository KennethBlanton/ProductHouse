// src/lib/api/claude.ts
import { Message } from '@/types/conversation';

interface ClaudeRequestOptions {
  messages: Message[];
  maxTokens?: number;
  temperature?: number;
  system?: string;
  stream?: boolean;
}

interface ClaudeResponse {
  id: string;
  content: string;
  stopReason: string;
  model: string;
}

/**
 * Wrapper for the Claude API
 */
export class ClaudeAPI {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_CLAUDE_API_KEY || '';
    this.baseUrl = 'https://api.anthropic.com/v1';
    this.model = process.env.NEXT_PUBLIC_CLAUDE_MODEL || 'claude-3-opus-20240229';
    
    if (!this.apiKey) {
      console.warn('Claude API key is not set');
    }
  }

  /**
   * Format messages for Claude API
   */
  private formatMessages(messages: Message[]) {
    return messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
  }

  /**
   * Send a completion request to Claude API
   */
  async complete({ 
    messages, 
    maxTokens = 4000, 
    temperature = 0.7,
    system,
    stream = false
  }: ClaudeRequestOptions): Promise<ClaudeResponse> {
    try {
      const formattedMessages = this.formatMessages(messages);
      
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',