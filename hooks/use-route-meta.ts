import { useLocation, matchPath } from 'react-router-dom';
import { routeDefinitions } from '../lib/route-definitions';
import type { RouteMetadata } from '../lib/router';

/**
 * Hook to get metadata for the current route
 * Supports dynamic routes with parameters (e.g., /employees/:systemId)
 */
export function useRouteMeta(): RouteMetadata | null {
  const location = useLocation();

  const findRouteMeta = (routes: typeof routeDefinitions): RouteMetadata | null => {
    for (const route of routes) {
      // Try to match the route pattern
      const match = matchPath(route.path, location.pathname);
      
      if (match && route.meta) {
        return route.meta;
      }
      
      // Check children routes
      if (route.children) {
        const childMeta = findRouteMeta(route.children);
        if (childMeta) return childMeta;
      }
    }
    return null;
  };

  return findRouteMeta(routeDefinitions);
}
