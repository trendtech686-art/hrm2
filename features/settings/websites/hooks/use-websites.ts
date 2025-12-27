/**
 * Websites Settings React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/websites-api';
import type { WebsiteDefinition } from '@/lib/types/prisma-extended';

export const websiteKeys = {
  all: ['websites'] as const,
  lists: () => [...websiteKeys.all, 'list'] as const,
  details: () => [...websiteKeys.all, 'detail'] as const,
  detail: (code: string) => [...websiteKeys.details(), code] as const,
  active: () => [...websiteKeys.all, 'active'] as const,
};

export function useWebsites() {
  return useQuery({ queryKey: websiteKeys.lists(), queryFn: api.fetchWebsites, staleTime: 1000 * 60 * 30 });
}

export function useWebsiteByCode(code: string | undefined) {
  return useQuery({ queryKey: websiteKeys.detail(code!), queryFn: () => api.fetchWebsiteByCode(code!), enabled: !!code });
}

export function useActiveWebsites() {
  return useQuery({ queryKey: websiteKeys.active(), queryFn: api.fetchActiveWebsites, staleTime: 1000 * 60 * 30 });
}

export function useWebsiteMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: websiteKeys.all });
  return {
    create: useMutation({ mutationFn: api.createWebsite, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ code, data }: { code: string; data: Partial<WebsiteDefinition> }) => api.updateWebsite(code, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteWebsite, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}
