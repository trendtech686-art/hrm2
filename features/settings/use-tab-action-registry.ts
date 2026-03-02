import * as React from 'react';

export type RegisterTabActions = (actions?: React.ReactNode[]) => void;

export type TabActionRegistry = {
  headerActions: React.ReactNode[];
  registerActions: (tabValue: string) => RegisterTabActions;
  setHeaderActions: React.Dispatch<React.SetStateAction<React.ReactNode[]>>;
};

export function useTabActionRegistry(activeTab: string): TabActionRegistry {
  const [headerActions, setHeaderActions] = React.useState<React.ReactNode[]>([]);
  // Track which tab registered actions last
  const lastRegisteredTabRef = React.useRef<string | null>(null);

  const registerActions = React.useCallback(
    (tabValue: string) => (actions?: React.ReactNode[]) => {
      const next = actions ?? [];
      
      // Always update if this is the active tab
      // This ensures fresh handlers are used (no stale closures)
      if (tabValue === activeTab) {
        lastRegisteredTabRef.current = tabValue;
        setHeaderActions(next);
      }
    },
    [activeTab],
  );

  // Don't clear actions on tab change - let the new active tab overwrite
  // This avoids race conditions between clearing and registering
  // The new active tab will call registerActions which will setHeaderActions with fresh content

  return {
    headerActions,
    registerActions,
    setHeaderActions,
  };
}
