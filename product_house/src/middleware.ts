import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a simplified version - we'll implement proper auth later
export async function middleware(request: NextRequest) {
  // For now, just allow all requests
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};