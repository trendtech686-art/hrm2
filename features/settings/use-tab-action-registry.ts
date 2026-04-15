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
  const activeTabRef = React.useRef(activeTab);
  activeTabRef.current = activeTab;

  // Cache curried functions per tabValue to ensure stable references
  const registryMapRef = React.useRef(new Map<string, RegisterTabActions>());

  const registerActions = React.useCallback(
    (tabValue: string): RegisterTabActions => {
      let cached = registryMapRef.current.get(tabValue);
      if (!cached) {
        cached = (actions?: React.ReactNode[]) => {
          const next = actions ?? [];

          // Only update if this is the currently active tab
          if (tabValue !== activeTabRef.current) return;

          lastRegisteredTabRef.current = tabValue;
          // Re-key elements to include tab identity so usePageHeader's fingerprint
          // always differs between tabs (prevents stale button after tab switch)
          const keyed = next.map(action =>
            React.isValidElement(action) && action.key != null
              ? React.cloneElement(action, { key: `${String(action.key)}-tab-${tabValue}` } as React.Attributes)
              : action
          );
          setHeaderActions(keyed);
        };
        registryMapRef.current.set(tabValue, cached);
      }
      return cached;
    },
    [],
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
