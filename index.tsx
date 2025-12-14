import * as React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'reactflow/dist/style.css'; // ← ReactFlow styles

import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from './lib/router-provider.tsx';
import { ThemeProvider } from './components/theme-provider.tsx';
import { BreakpointProvider } from './contexts/breakpoint-context.tsx';
import { AuthProvider } from './contexts/auth-context.tsx';
import { Toaster } from './components/ui/sonner.tsx';
import { ghtkSyncService } from './lib/ghtk-sync-service.ts';
import { queryClient } from './lib/query-client.ts';

// Main app component
function App() {
  // Start GHTK auto-sync when app mounts
  React.useEffect(() => {
    console.log('[App] Starting GHTK auto-sync service...');
    ghtkSyncService.startAutoSync();
    
    return () => {
      console.log('[App] Stopping GHTK auto-sync service...');
      ghtkSyncService.stopAutoSync();
    };
  }, []);
  
  return <RouterProvider />;
}

// Render app
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <BreakpointProvider>
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </BreakpointProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
