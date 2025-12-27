/**
 * useAllWiki - Convenience hook for components needing all wiki articles as flat array
 */

import { useWikiArticles } from './use-wiki';

export function useAllWiki() {
  const query = useWikiArticles({ limit: 500 });
  
  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
