import * as React from 'react';
// FIX: Use named imports for react-router-dom to fix module export errors.
import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar.tsx';
import { Header } from './header.tsx';
import { useUiStore } from '../../lib/ui-store.ts';
import { useMediaQuery } from '../../lib/use-media-query.ts';
import { cn } from '../../lib/utils.ts';
import { ModalProvider } from '../../contexts/modal-context.tsx';
import { ResponsiveContainer } from '../ui/responsive-container.tsx';
import { PageHeader } from './page-header.tsx';
import { useIdlePreload } from '../../hooks/use-route-prefetch.ts';

// Component to initialize UI store state based on media query
function UiStateInitializer() {
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

    // Set initial sidebar state based on screen size, and update on change
    React.useEffect(() => {
        setSidebarOpen(isDesktop);
    }, [isDesktop, setSidebarOpen]);

    return null;
}




export function MainLayout() {
  const { isSidebarOpen, setSidebarOpen, isSidebarCollapsed } = useUiStore();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  
  // NOTE: Idle preload disabled - most pages are now direct imports for instant navigation
  // Only Wiki, Reports, and Settings remain lazy-loaded
  
  return (
    <>
      <UiStateInitializer />
      <ModalProvider>
        <div className="flex min-h-screen bg-secondary/10">
          <Sidebar />
          <div className={cn(
            "flex flex-col flex-1 min-w-0 transition-all duration-300",
            isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
          )}>
            <Header />
            <div className="flex-1 flex flex-col px-4 md:px-6">
              <PageHeader />
              <main className="flex-1 w-full">
                {/* Content area with vertical padding only */}
                <div className="py-4 mobile:py-3">
                  <Outlet />
                </div>
              </main>
            </div>
          </div>
          {/* Overlay for mobile sidebar */}
          {isSidebarOpen && !isDesktop && (
            <div 
              className="fixed inset-0 z-20 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      </ModalProvider>
    </>
  );
}
