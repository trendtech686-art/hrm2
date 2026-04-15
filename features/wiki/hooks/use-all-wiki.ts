/**
 * useAllWiki - Convenience hook for components needing all wiki articles as flat array
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 */

import { useQuery } from '@tanstack/react-query';
import { fetchWikiArticles } from '../api/wiki-api';
import { wikiKeys } from './use-wiki';

export function useAllWiki() {
  const query = useQuery({
    queryKey: [...wikiKeys.all, 'all'],
    queryFn: async () => {
      const res = await fetchWikiArticles();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
