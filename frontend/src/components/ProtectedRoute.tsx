'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode, useState } from 'react';

export default function ProtectedRoute({ children, requiredRole }: { children: ReactNode, requiredRole?: 'USER' | 'ADMIN' }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const token = localStorage.getItem('sel_auth_token');
    const savedUserStr = localStorage.getItem('sel_auth_user');

    if (!token || !savedUserStr) {
      router.replace('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUserStr);
      const userRole = (user?.role || parsedUser.role || '').toUpperCase();
      const targetRole = requiredRole?.toUpperCase();

      if (targetRole && userRole !== targetRole) {
        // Wrong role for this specific page
        router.replace(userRole === 'ADMIN' ? '/admin' : '/marketplace');
      } else {
        // Authorized!
        setIsAuthorized(true);
      }
    } catch (e) {
      router.replace('/login');
    }
  }, [user, isLoading, isAuthenticated, router, requiredRole]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#0078d4]" />
          <p className="text-[10px] font-mono text-[#0078d4] uppercase tracking-widest animate-pulse">
            Verifying Authority...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}