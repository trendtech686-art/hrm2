import * as React from 'react';

export function usePersistentState<T>(key: string, defaultValue: T) {
  const [state, setState] = React.useState<T>(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    try {
      const stored = window.localStorage.getItem(key);
      if (!stored) return defaultValue;
      const parsed = JSON.parse(stored) as T;
      return { ...defaultValue, ...parsed };
    } catch (error) {
      console.warn(`[usePersistentState] Failed to parse state for key ${key}:`, error);
      return defaultValue;
    }
  });

  React.useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn(`[usePersistentState] Failed to persist state for key ${key}:`, error);
    }
  }, [key, state]);

  return [state, setState] as const;
}
