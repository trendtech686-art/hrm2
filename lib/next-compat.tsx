/**
 * Next.js Compatibility Layer
 * Re-exports navigation utilities with React Router-like API for easier migration
 */

import * as React from 'react';
import NextLink from 'next/link';
import { useParams as useNextParams, useRouter, usePathname, useSearchParams, redirect } from 'next/navigation';

// Re-export Next.js navigation hooks
export { useRouter, usePathname, useSearchParams };

// useSearchParamsWithSetter - hook to get and set search params
export function useSearchParamsWithSetter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const setSearchParams = React.useCallback((updater: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams)) => {
    const currentParams = new URLSearchParams(searchParams?.toString() || '');
    const newParams = typeof updater === 'function' ? updater(currentParams) : updater;
    const search = newParams.toString();
    router.push(search ? `${pathname}?${search}` : pathname);
  }, [searchParams, router, pathname]);
  
  return [searchParams, setSearchParams] as const;
}

// useParams - re-export with correct typing
export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return useNextParams() as T;
}

// Type for navigate function (compatibility with React Router)
export type NavigateFunction = (to: string, options?: { replace?: boolean; state?: any }) => void;

// useNavigate hook that returns a function similar to React Router
export function useNavigate(): NavigateFunction {
  const router = useRouter();
  return React.useCallback((to: string, options?: { replace?: boolean; state?: any }) => {
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [router]);
}

// useLocation hook - compatibility with React Router
export function useLocation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return {
    pathname,
    search: searchParams?.toString() ? `?${searchParams.toString()}` : '',
    state: null, // Next.js doesn't support state in the same way
    hash: typeof window !== 'undefined' ? window.location.hash : '',
  };
}

// Link component - wrapper that converts `to` prop to `href`
type LinkProps = Omit<React.ComponentProps<typeof NextLink>, 'href'> & {
  to?: string;
  href?: string;
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, href, ...props }, ref) => {
    const finalHref = to || href || '#';
    return <NextLink ref={ref} href={finalHref} {...props} />;
  }
);
Link.displayName = 'Link';

// Navigate component - for declarative navigation/redirects
export function Navigate({ to, replace, state }: { to: string; replace?: boolean; state?: any }) {
  const router = useRouter();
  React.useEffect(() => {
    // Note: Next.js doesn't support state parameter, but we accept it for compatibility
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [router, to, replace]);
  return null;
}

// BrowserRouter - no-op wrapper for tests
export function BrowserRouter({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// MemoryRouter - no-op wrapper for tests (React Router compatibility)
export function MemoryRouter({ children, initialEntries }: { children: React.ReactNode; initialEntries?: string[] }) {
  return <>{children}</>;
}

// Routes - no-op wrapper for tests (React Router compatibility)
export function Routes({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Route - no-op wrapper for tests (React Router compatibility)
export function Route({ element }: { path?: string; element: React.ReactNode }) {
  return <>{element}</>;
}

// Re-export everything as default for `import * as ReactRouterDOM`
const ReactRouterDOM = {
  Link,
  Navigate,
  BrowserRouter,
  MemoryRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
  useRouter,
  usePathname,
  useSearchParams,
};

export default ReactRouterDOM;
