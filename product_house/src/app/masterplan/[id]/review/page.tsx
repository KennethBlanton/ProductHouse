// src/app/masterplan/[id]/page.tsx
'use client';

import ProtectedRoute from '@/components/auth/protected-route';
import MasterplanDetail from '@/components/masterplan/masterplan-detail';

interface MasterplanPageProps {
  params: {
    id: string;
  };
}

export default function MasterplanPage({ params }: MasterplanPageProps) {
  return (
    <ProtectedRoute>
      <MasterplanDetail id={params.id} />
    </ProtectedRoute>
  );
}