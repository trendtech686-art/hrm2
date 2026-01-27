import * as React from 'react';

export type RegisterTabActions = (actions?: React.ReactNode[]) => void;

export type TabActionRegistry = {
  headerActions: React.ReactNode[];
  registerActions: (tabValue: string) => RegisterTabActions;
  setHeaderActions: React.Dispatch<React.SetStateAction<React.ReactNode[]>>;
};

export function useTabActionRegistry(activeTab: string): TabActionRegistry {
  const [headerActions, setHeaderActions] = React.useState<React.ReactNode[]>([]);
  const lastActionsRef = React.useRef<React.ReactNode[] | null>(null);

  const sameActions = React.useCallback((a: React.ReactNode[] | null, b: React.ReactNode[] | null) => {
    if (a === b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }, []);

  const registerActions = React.useCallback(
    (tabValue: string) => (actions?: React.ReactNode[]) => {
      if (tabValue === activeTab) {
        const next = actions ?? [];
        if (!sameActions(lastActionsRef.current, next)) {
          lastActionsRef.current = next;
          setHeaderActions(next);
        }
      }
    },
    [activeTab, sameActions],
  );

  React.useEffect(() => {
    lastActionsRef.current = null;
    setHeaderActions([]);
  }, [activeTab]);

  return {
    headerActions,
    registerActions,
    setHeaderActions,
  };
}
