// src/components/auth/protected-route.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

export default function ProtectedRoute({ 
  children, 
  requiredRole = 'user' 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth?callbackUrl=' + encodeURIComponent(window.location.href));
    }
    
    if (!loading && isAuthenticated && requiredRole === 'admin' && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router, user, requiredRole]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading message="Checking authentication..." />
      </div>
    );
  }

  // If authenticated (and has required role if specified), render children
  if (isAuthenticated && (requiredRole !== 'admin' || user?.role === 'admin')) {
    return <>{children}</>;
  }

  // Return null while redirecting (the useEffect will handle the redirect)
  return null;
}