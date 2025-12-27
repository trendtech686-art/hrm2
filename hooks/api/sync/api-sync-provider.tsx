/**
 * API Sync Provider
 * 
 * Provides data synchronization from PostgreSQL API to Zustand stores.
 * Wraps the application to ensure data is loaded from database on startup.
 * 
 * Usage in app/layout.tsx or app/providers.tsx:
 * ```tsx
 * import { ApiSyncProvider } from '@/hooks/api/sync/api-sync-provider'
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <ApiSyncProvider>
 *       {children}
 *     </ApiSyncProvider>
 *   )
 * }
 * ```
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useApiSync, type SyncState } from './use-api-sync';

interface ApiSyncContextValue {
  syncState: SyncState;
  isInitialized: boolean;
  isAllSynced: boolean;
  hasErrors: boolean;
}

const ApiSyncContext = createContext<ApiSyncContextValue | null>(null);

export function useApiSyncContext() {
  const context = useContext(ApiSyncContext);
  if (!context) {
    throw new Error('useApiSyncContext must be used within ApiSyncProvider');
  }
  return context;
}

interface ApiSyncProviderProps {
  children: ReactNode;
  /**
   * If true, shows a loading state while syncing
   * Default: false (app renders immediately, sync happens in background)
   */
  blockUntilSynced?: boolean;
  /**
   * Custom loading component while syncing
   */
  loadingComponent?: ReactNode;
}

export function ApiSyncProvider({ 
  children, 
  blockUntilSynced = false,
  loadingComponent 
}: ApiSyncProviderProps) {
  const syncData = useApiSync();

  // Show loading if configured to block until synced
  if (blockUntilSynced && !syncData.isInitialized) {
    return (
      <>
        {loadingComponent || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Đang đồng bộ dữ liệu...</p>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <ApiSyncContext.Provider value={syncData}>
      {children}
    </ApiSyncContext.Provider>
  );
}

/**
 * Hook to check if specific stores are synced
 */
export function useSyncStatus(stores: (keyof SyncState)[]) {
  const { syncState, isInitialized } = useApiSyncContext();
  
  return {
    isLoading: !isInitialized || stores.some(s => syncState[s] === 'syncing'),
    isSuccess: stores.every(s => syncState[s] === 'success'),
    hasError: stores.some(s => syncState[s] === 'error'),
    statuses: Object.fromEntries(stores.map(s => [s, syncState[s]])),
  };
}
