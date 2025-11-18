import React from 'react';

interface UserContextValue {
  currentUser: string | undefined; // Employee systemId
  setCurrentUser: (systemId: string | undefined) => void;
}

const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = React.useState<string | undefined>(() => {
    // Load from localStorage on init
    return localStorage.getItem('hrm-current-user') || undefined;
  });

  React.useEffect(() => {
    // Persist to localStorage
    if (currentUser) {
      localStorage.setItem('hrm-current-user', currentUser);
    } else {
      localStorage.removeItem('hrm-current-user');
    }
  }, [currentUser]);

  const value = React.useMemo(
    () => ({ currentUser, setCurrentUser }),
    [currentUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useCurrentUser() {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useCurrentUser must be used within UserProvider');
  }
  return context;
}

// Helper to get current user systemId (for store factories)
export function getCurrentUserSystemId(): string | undefined {
  return localStorage.getItem('hrm-current-user') || undefined;
}
