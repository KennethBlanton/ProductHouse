// src/app/api/masterplan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ClaudeAPI } from '@/lib/api/claude';

// Initialize the Claude API
const claudeApi = new ClaudeAPI();

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const { messages, systemPrompt } = await request.json();
    
    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages must be an array' },
        { status: 400 }
      );
    }
    
    // Generate masterplan with Claude API
    const masterplanContent = await claudeApi.generateMasterplan(messages, systemPrompt);
    
    return NextResponse.json({ 
      content: masterplanContent,
      success: true 
    });
  } catch (error) {
    console.error('Error in masterplan generation:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    );
  }
}