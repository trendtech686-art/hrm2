import * as React from 'react';

export function useMediaQuery(query: string) {
  // Use undefined initially to indicate "not yet determined"
  // This helps avoid hydration mismatches
  const [value, setValue] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = () => setValue(mediaQueryList.matches);
    
    // Set initial value
    listener();
    
    // Add listener
    mediaQueryList.addEventListener('change', listener);
    
    // Cleanup
    return () => mediaQueryList.removeEventListener('change', listener);
  }, [query]);

  // Return false during SSR and initial hydration to match server render
  return value ?? false;
}
