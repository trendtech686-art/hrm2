import * as React from 'react';

export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false);

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

  return value;
}
