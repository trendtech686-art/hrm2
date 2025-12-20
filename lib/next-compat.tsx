/**
 * Next.js Navigation Compatibility Layer
 * 
 * Provides react-router-dom compatible hooks for Next.js App Router
 * This allows gradual migration without changing all imports at once
 */

'use client'

import { useRouter as useNextRouter, usePathname, useSearchParams, useParams as useNextParams } from 'next/navigation'
import { useMemo, useCallback, useEffect, useState } from 'react'
import NextLink from 'next/link'

// Type definitions for react-router-dom compatibility
export type NavigateFunction = (to: string | number, options?: { replace?: boolean; state?: any }) => void

// Re-export Next.js hooks with react-router-dom compatible interface
export function useNavigate(): NavigateFunction {
  const router = useNextRouter()
  
  return useCallback((to: string | number, options?: { replace?: boolean; state?: any }) => {
    if (typeof to === 'number') {
      // Go back/forward
      if (to < 0) {
        router.back()
      } else {
        // Next.js doesn't have forward(), use history if available
        window.history.go(to)
      }
    } else {
      if (options?.replace) {
        router.replace(to)
      } else {
        router.push(to)
      }
    }
  }, [router])
}

export function useLocation() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  return useMemo(() => ({
    pathname,
    search: searchParams.toString() ? `?${searchParams.toString()}` : '',
    hash: typeof window !== 'undefined' ? window.location.hash : '',
    state: null, // Next.js doesn't support location state directly
    key: 'default',
  }), [pathname, searchParams])
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  const params = useNextParams()
  return params as T
}

export function useSearchParamsCompat() {
  const searchParams = useSearchParams()
  
  return useMemo(() => {
    const get = (key: string) => searchParams.get(key)
    const getAll = (key: string) => searchParams.getAll(key)
    const has = (key: string) => searchParams.has(key)
    const entries = () => searchParams.entries()
    const keys = () => searchParams.keys()
    const values = () => searchParams.values()
    const toString = () => searchParams.toString()
    
    return { get, getAll, has, entries, keys, values, toString }
  }, [searchParams])
}

// useSearchParams wrapper that returns [searchParams, setSearchParams] like react-router-dom
export function useSearchParamsWithSetter(): [URLSearchParams, (params: URLSearchParams | Record<string, string>) => void] {
  const searchParams = useSearchParams()
  const router = useNextRouter()
  const pathname = usePathname()
  
  const setSearchParams = useCallback((params: URLSearchParams | Record<string, string>) => {
    const newParams = params instanceof URLSearchParams 
      ? params 
      : new URLSearchParams(params)
    router.push(`${pathname}?${newParams.toString()}`)
  }, [router, pathname])
  
  return [searchParams as unknown as URLSearchParams, setSearchParams]
}

// Re-export useSearchParams for components that just read
export { useSearchParams }

// Link component wrapper - convert 'to' prop to 'href'
export const Link = ({ to, children, ...props }: { to: string; children: React.ReactNode; [key: string]: any }) => {
  return <NextLink href={to} {...props}>{children}</NextLink>
}

// Navigate component for declarative navigation
export function Navigate({ to, replace = false, state }: { to: string; replace?: boolean; state?: any }) {
  const router = useNextRouter()
  
  useEffect(() => {
    // Note: Next.js doesn't support navigation state like react-router-dom
    // state is accepted but ignored for compatibility
    if (replace) {
      router.replace(to)
    } else {
      router.push(to)
    }
  }, [router, to, replace])
  
  return null
}

// Outlet replacement - use children prop in Next.js layouts
export function Outlet() {
  console.warn('Outlet component is not needed in Next.js. Use {children} in layout.tsx instead.')
  return null
}

// useMatch hook
export function useMatch(pattern: string) {
  const pathname = usePathname()
  
  return useMemo(() => {
    // Simple pattern matching
    const regexPattern = pattern
      .replace(/:\w+/g, '([^/]+)') // Replace :param with capture group
      .replace(/\*/g, '.*') // Replace * with wildcard
    
    const regex = new RegExp(`^${regexPattern}$`)
    const match = pathname.match(regex)
    
    if (!match) return null
    
    return {
      params: {}, // TODO: Extract params from pattern
      pathname,
      pattern: { path: pattern },
    }
  }, [pathname, pattern])
}

// createSearchParams helper
export function createSearchParams(init?: Record<string, string | string[]>) {
  const params = new URLSearchParams()
  
  if (init) {
    Object.entries(init).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v))
      } else {
        params.set(key, value)
      }
    })
  }
  
  return params
}

// generatePath helper (same as router.ts)
export function generatePath(path: string, params: Record<string, string | number>): string {
  let result = path
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value))
  })
  return result
}
// matchPath helper - matches pathname against a pattern
export function matchPath(pattern: string | { path: string; end?: boolean }, pathname: string) {
  const patternPath = typeof pattern === 'string' ? pattern : pattern.path
  const endMatch = typeof pattern === 'string' ? true : pattern.end !== false
  
  // Convert route pattern to regex
  const regexPattern = patternPath
    .replace(/:\w+/g, '([^/]+)') // Replace :param with capture group
    .replace(/\*/g, '.*') // Replace * with wildcard
  
  const regex = new RegExp(endMatch ? `^${regexPattern}$` : `^${regexPattern}`)
  const match = pathname.match(regex)
  
  if (!match) return null
  
  // Extract params from pattern
  const paramNames = (patternPath.match(/:\w+/g) || []).map(p => p.slice(1))
  const params: Record<string, string> = {}
  paramNames.forEach((name, index) => {
    if (match[index + 1]) {
      params[name] = match[index + 1]
    }
  })
  
  return {
    params,
    pathname: match[0],
    pattern: { path: patternPath },
  }
}

// Re-export usePathname for direct use
export { usePathname }

// BrowserRouter replacement - not needed in Next.js but export for compatibility
export function BrowserRouter({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// MemoryRouter replacement - for tests
export function MemoryRouter({ children }: { children: React.ReactNode; initialEntries?: string[] }) {
  return <>{children}</>
}

// Routes and Route - not needed in Next.js App Router
export function Routes({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function Route({ element }: { path?: string; element: React.ReactNode }) {
  return <>{element}</>
}