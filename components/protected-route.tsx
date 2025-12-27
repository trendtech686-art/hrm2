'use client'

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ROUTES } from '../lib/router';
import { useAuth } from '../contexts/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login page, but save the attempted URL
      sessionStorage.setItem('redirect-after-login', pathname);
      router.replace(ROUTES.AUTH.LOGIN);
    }
  }, [isAuthenticated, pathname, router]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
}
