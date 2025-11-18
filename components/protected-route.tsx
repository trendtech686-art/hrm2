import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../lib/router';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  
  // Check if user is logged in
  const user = localStorage.getItem('user');
  
  if (!user) {
    // Redirect to login page, but save the attempted URL
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location.pathname }} replace />;
  }
  
  return <>{children}</>;
}
