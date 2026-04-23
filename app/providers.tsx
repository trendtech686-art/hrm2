"use client"

import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeColorMeta } from '@/components/theme-color-meta'
import { BreakpointProvider } from '@/contexts/breakpoint-context'
import { AuthProvider as LegacyAuthProvider } from '@/contexts/auth-context'
import { AuthProvider as NextAuthProvider } from '@/components/providers/auth-provider'
import { PageHeaderProvider } from '@/contexts/page-header-context'
import { useIdlePreload } from '@/hooks/use-route-prefetch'
import { useCaptureQueryClient } from '@/features/settings/printer/hooks/use-print-template-config'
import { Toaster } from '@/components/ui/sonner'
import { getQueryClient } from '@/lib/query-client'
import { ServiceWorkerRegister } from '@/components/pwa/service-worker-register'
import { PWAInstallPrompt } from '@/components/pwa/pwa-install-prompt'
import { NotificationPermissionPrompt } from '@/components/pwa/notification-permission-prompt'
import { OfflineQueueIndicator } from '@/components/pwa/offline-queue-indicator'



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
          <ThemeColorMeta />
          <BreakpointProvider>
            <LegacyAuthProvider>
                <PageHeaderProvider>
                  <RoutePrefetcher />
                  <PrintTemplateConfigBridge />
                  <ServiceWorkerRegister />
                  {children}
                  <PWAInstallPrompt />
                  <NotificationPermissionPrompt />
                  <OfflineQueueIndicator />
                  <Toaster />
                </PageHeaderProvider>
            </LegacyAuthProvider>
          </BreakpointProvider>
        </ThemeProvider>
      </NextAuthProvider>
    </QueryClientProvider>
  )
}
