import * as React from 'react';

export type RegisterTabActions = (actions?: React.ReactNode[]) => void;

export type TabActionRegistry = {
  headerActions: React.ReactNode[];
  registerActions: (tabValue: string) => RegisterTabActions;
  setHeaderActions: React.Dispatch<React.SetStateAction<React.ReactNode[]>>;
};

export function useTabActionRegistry(activeTab: string): TabActionRegistry {
  const [headerActions, setHeaderActions] = React.useState<React.ReactNode[]>([]);

  const registerActions = React.useCallback(
    (tabValue: string) => (actions?: React.ReactNode[]) => {
      if (tabValue === activeTab) {
        setHeaderActions(actions ?? []);
      }
    },
    [activeTab],
  );

  React.useEffect(() => {
    setHeaderActions([]);
  }, [activeTab]);

  return {
    headerActions,
    registerActions,
    setHeaderActions,
  };
}
