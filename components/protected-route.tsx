import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../lib/router';
import { useAuth } from '../contexts/auth-context.tsx';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    // Redirect to login page, but save the attempted URL
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location.pathname }} replace />;
  }
  
  return <>{children}</>;
}
