import * as React from "react";

type Breakpoint = "mobile" | "tablet" | "desktop" | "wide";

interface BreakpointContextValue {
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  width: number;
}

const BreakpointContext = React.createContext<BreakpointContextValue | undefined>(undefined);

function getBreakpoint(width: number): Breakpoint {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  if (width < 1536) return "desktop";
  return "wide";
}

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface BreakpointProviderProps {
  children: React.ReactNode;
  debounceMs?: number;
}

/**
 * BreakpointProvider - Centralized responsive breakpoint management
 * Benefits:
 * - Single resize listener for entire app
 * - Debounced updates (performance)
 * - SSR-safe
 * - Shared state across all components
 */
export function BreakpointProvider({ 
  children, 
  debounceMs = 150 
}: BreakpointProviderProps) {
  const [width, setWidth] = React.useState(() => 
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    
    const handleResize = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setWidth(window.innerWidth);
      }, debounceMs);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (timeout) clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [debounceMs]);

  const breakpoint = React.useMemo(() => getBreakpoint(width), [width]);

  const value = React.useMemo<BreakpointContextValue>(
    () => ({
      breakpoint,
      isMobile: breakpoint === "mobile",
      isTablet: breakpoint === "tablet",
      isDesktop: breakpoint === "desktop" || breakpoint === "wide",
      isWide: breakpoint === "wide",
      width,
    }),
    [breakpoint, width]
  );

  return (
    <BreakpointContext.Provider value={value}>
      {children}
    </BreakpointContext.Provider>
  );
}

/**
 * useBreakpoint - Hook to access current breakpoint
 * @returns Breakpoint context with responsive flags
 * @example
 * const { isMobile, isDesktop } = useBreakpoint();
 */
export function useBreakpoint(): BreakpointContextValue {
  const context = React.useContext(BreakpointContext);
  if (context === undefined) {
    throw new Error('useBreakpoint must be used within BreakpointProvider');
  }
  return context;
}

/**
 * withBreakpoint - HOC to inject breakpoint props
 * @example
 * const MyComponent = withBreakpoint(({ isMobile }) => (
 *   <div>{isMobile ? 'Mobile' : 'Desktop'}</div>
 * ));
 */
export function withBreakpoint<P extends object>(
  Component: React.ComponentType<P & BreakpointContextValue>
): React.FC<P> {
  return (props: P) => {
    const breakpoint = useBreakpoint();
    return <Component {...props} {...breakpoint} />;
  };
}
