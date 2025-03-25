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
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          messages: formattedMessages,
          max_tokens: maxTokens,
          temperature,
          system,
          stream
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        id: data.id,
        content: data.content[0].text,
        stopReason: data.stop_reason,
        model: data.model
      };
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw error;
    }
  }

  /**
   * Generate masterplan from conversation using a specialized system prompt
   */
  async generateMasterplan(messages: Message[], systemPrompt?: string): Promise<string> {
    const defaultSystemPrompt = `
      You are an AI Product Development Assistant specialized in creating comprehensive masterplans.
      Your task is to analyze the conversation and extract key requirements and features.
      Format the masterplan in Markdown with the following sections:
      
      1. Project Overview
      2. Target Audience
      3. Solution Architecture
      4. Core Features and Functionality
      5. Technical Stack Recommendations
      6. Security Considerations
      7. Potential Technical Challenges
      8. Unique Value Proposition
      9. Next Steps
      10. Success Metrics
      
      Be specific, detailed, and organize information logically.
    `;
    
    try {
      const response = await this.complete({
        messages,
        maxTokens: 8000, // Give more tokens for masterplan generation
        temperature: 0.2, // Lower temperature for more consistent output
        system: systemPrompt || defaultSystemPrompt
      });
      
      return response.content;
    } catch (error) {
      console.error('Error generating masterplan:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const claudeApi = new ClaudeAPI();