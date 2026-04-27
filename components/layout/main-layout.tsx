'use client'

import { useEffect, useState, type ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useUiStore } from '../../lib/ui-store';
import { cn } from '../../lib/utils';
import { ModalProvider } from '../../contexts/modal-context';
import { PageHeader } from './page-header';
import { useInitIntegrationSettings } from '../../hooks/use-init-integration-settings';
import { MobileBottomNav } from '../mobile/mobile-bottom-nav';

// Component to initialize UI store state based on media query
function UiStateInitializer() {
    const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
    
    // Initialize integration settings from database
    useInitIntegrationSettings();

    // Set initial sidebar state based on screen size, and update on change
    // Uses matchMedia directly to avoid the intermediate false from useMediaQuery
    useEffect(() => {
        const mql = window.matchMedia('(min-width: 1024px)');
        setSidebarOpen(mql.matches);
        
        const listener = () => setSidebarOpen(mql.matches);
        mql.addEventListener('change', listener);
        return () => mql.removeEventListener('change', listener);
    }, [setSidebarOpen]);

    return null;
}

interface MainLayoutProps {
  children?: ReactNode;
}


export function MainLayout({ children }: MainLayoutProps) {
  const { isSidebarOpen, setSidebarOpen, isSidebarCollapsed } = useUiStore();
  const [isMounted, setIsMounted] = useState(false);
  
  // Track when component is mounted to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // NOTE: Idle preload disabled - most pages are now direct imports for instant navigation
  // Only Wiki, Reports, and Settings remain lazy-loaded
  
  return (
    <>
      <UiStateInitializer />
      <ModalProvider>
        <div className="flex min-h-screen bg-secondary/10">
          <Sidebar />
          <div className={cn(
            "flex flex-col flex-1 min-w-0 transition-[margin-left] duration-300",
            isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
          )}>
            <Header />
            <div className="flex-1 flex flex-col px-4 md:px-6">
              <PageHeader />
              <main className="flex-1 w-full pt-1 pb-18 md:pb-4">
                {children}
              </main>
            </div>
          </div>
          {/* Overlay for mobile sidebar - lg:hidden ensures it never shows on desktop */}
          {isMounted && isSidebarOpen && (
            <div 
              className="fixed inset-0 z-20 bg-black/50 lg:hidden"
              role="button"
              tabIndex={0}
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
                  setSidebarOpen(false)
                }
              }}
            />
          )}
          <MobileBottomNav />
        </div>
      </ModalProvider>
    </>
  );
}
