/**
 * Hooks Index
 * 
 * Re-export all custom hooks
 * 
 * @example
 * import { useOptimisticMutation, usePrefetch } from '@/lib/hooks';
 */

// Optimistic Updates
export {
  useOptimisticMutation,
  useOptimisticDelete,
  useOptimisticStatusUpdate,
  useOptimisticToggle,
} from './use-optimistic-mutation';

// Prefetching
export {
  usePrefetch,
  usePrefetchOnHover,
  usePrefetchLink,
} from './use-prefetch';

// Search Params
export { useSearchParamsWithSetter } from './use-search-params-setter';
