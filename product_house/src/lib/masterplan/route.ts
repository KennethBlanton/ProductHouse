// src/app/api/masterplan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ClaudeAPI } from '@/lib/api/claude';

// Initialize the Claude API
const claudeApi = new ClaudeAPI();

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages must be an array' },
        { status: 400 }
      );
    }
    
    // Generate masterplan with Claude API
    const masterplanContent = await claudeApi.generateMasterplan(messages);
    
    return NextResponse.json({ content: masterplanContent });
  } catch (error) {
    console.error('Error in masterplan generation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}