// src/app/masterplan/page.tsx
'use client';

import ProtectedRoute from '@/components/auth/protected-route';
import MasterplanList from '@/components/masterplan/masterplan-list';

export default function MasterplanPage() {
  return (
    <ProtectedRoute>
      <MasterplanList />
    </ProtectedRoute>
  );
}