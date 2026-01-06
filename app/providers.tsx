"use client"

import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import { BreakpointProvider } from '@/contexts/breakpoint-context'
import { AuthProvider as LegacyAuthProvider } from '@/contexts/auth-context'
import { AuthProvider as NextAuthProvider } from '@/components/providers/auth-provider'
import { PageHeaderProvider } from '@/contexts/page-header-context'
import { useIdlePreload } from '@/hooks/use-route-prefetch'
// TEMPORARILY DISABLED: ApiSyncProvider gây chậm compile vì import 60+ stores
// import { ApiSyncProvider } from '@/hooks/api/sync'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/lib/query-client'

// Component to enable route prefetching
function RoutePrefetcher() {
  useIdlePreload();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextAuthProvider>
        <ThemeProvider>
          <BreakpointProvider>
            <LegacyAuthProvider>
              {/* TEMPORARILY DISABLED: ApiSyncProvider */}
              {/* <ApiSyncProvider> */}
                <PageHeaderProvider>
                  <RoutePrefetcher />
                  {children}
                  <Toaster />
                </PageHeaderProvider>
              {/* </ApiSyncProvider> */}
            </LegacyAuthProvider>
          </BreakpointProvider>
        </ThemeProvider>
      </NextAuthProvider>
    </QueryClientProvider>
  )
}
