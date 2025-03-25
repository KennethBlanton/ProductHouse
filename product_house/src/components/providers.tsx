// src/components/providers.tsx
'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ConversationProvider } from '@/contexts/ConversationContext';
import { AuthProvider } from '@/contexts/AuthContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ConversationProvider>
          {children}
        </ConversationProvider>
      </AuthProvider>
    </SessionProvider>
  );
}