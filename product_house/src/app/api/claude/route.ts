// src/app/api/claude/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ClaudeAPI } from '@/lib/api/claude';

// Initialize the Claude API
const claudeApi = new ClaudeAPI();

export async function POST(request: NextRequest) {
  try {
    // Check authentication (in production)
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const { messages, maxTokens, temperature, system } = await request.json();
    
    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages must be an array' },
        { status: 400 }
      );
    }
    
    // Rate limiting could be implemented here
    
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
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}