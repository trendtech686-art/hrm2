"use client"

import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import { BreakpointProvider } from '@/contexts/breakpoint-context'
import { AuthProvider as LegacyAuthProvider } from '@/contexts/auth-context'
import { AuthProvider as NextAuthProvider } from '@/components/providers/auth-provider'
import { PageHeaderProvider } from '@/contexts/page-header-context'
import { useIdlePreload } from '@/hooks/use-route-prefetch'
import { useCaptureQueryClient } from '@/features/settings/printer/hooks/use-print-template-config'
import { Toaster } from '@/components/ui/sonner'
import { getQueryClient } from '@/lib/query-client'



// Component to enable route prefetching
function RoutePrefetcher() {
  useIdlePreload();
  return null;
}

// Capture QueryClient reference for non-hook contexts (e.g. print-service.ts)
function PrintTemplateConfigBridge() {
  useCaptureQueryClient();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <NextAuthProvider>
        <ThemeProvider>
          <BreakpointProvider>
            <LegacyAuthProvider>
                <PageHeaderProvider>
                  <RoutePrefetcher />
                  <PrintTemplateConfigBridge />
                  {children}
                  <Toaster />
                </PageHeaderProvider>
            </LegacyAuthProvider>
          </BreakpointProvider>
        </ThemeProvider>
      </NextAuthProvider>
    </QueryClientProvider>
  )
}
