import { create } from 'zustand';

// Layout store for general UI state (not for page titles/breadcrumbs)
// Note: Page titles and breadcrumbs are now managed by PageHeaderContext
type LayoutState = {
  // Reserved for future UI state management
};

export const useLayoutStore = create<LayoutState>((set) => ({}));
