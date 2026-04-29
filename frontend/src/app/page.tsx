'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Redirect based on role
    if (user?.role === 'ADMIN') {
      router.push('/admin');
    } else if (user?.role === 'USER') {
      router.push('/marketplace');
    }
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-primary dark:bg-bg-dark">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-dark mx-auto mb-4" />
        <p className="text-text-muted dark:text-text-dark-muted">Loading...</p>
      </div>
    </div>
  );
}
