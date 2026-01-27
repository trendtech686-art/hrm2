import { create } from 'zustand';

/**
 * UI Store - Kept in Zustand (NOT migrated to React Query)
 * 
 * Purpose: Manages pure UI state that requires instant, synchronous reactivity
 * 
 * Why Zustand:
 * - Pure UI state (sidebar open/collapsed) - no server sync needed
 * - Requires instant, synchronous updates for smooth UX
 * - Local-only state that should NOT persist to database
 * - Shared across layout components (header, sidebar, main-layout)
 * - Zero network overhead - pure client state
 * 
 * This is a CORRECT use case for Zustand. Do NOT migrate to React Query.
 */
type UiState = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  isSidebarCollapsed: boolean;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (isCollapsed: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true, // Default to open for desktop, will be adjusted by initializer
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  isSidebarCollapsed: false,
  toggleSidebarCollapse: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (isCollapsed) => set({ isSidebarCollapsed: isCollapsed }),
}));
