// src/app/api/claude/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Message } from '@/types/conversation';
import { ClaudeAPI } from '@/lib/api/claude';

// Initialize the Claude API
const claudeApi = new ClaudeAPI();

export async function POST(request: NextRequest) {
  try {
    const { messages, maxTokens, temperature, system } = await request.json();
    
    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages must be an array' },
        { status: 400 }
      );
    }
    
    // Complete request with Claude API
    const response = await claudeApi.complete({
      messages,
      maxTokens,
      temperature,
      system
    });
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in Claude API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}