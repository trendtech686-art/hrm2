/**
 * useAllTargetGroups - Convenience hook for flat array of target groups
 * Returns all target groups (equivalent to old store's data array)
 */

import { useTargetGroups } from './use-target-groups';

export function useAllTargetGroups() {
  const { data, ...rest } = useTargetGroups({});
  return {
    data: data?.data || [],
    ...rest,
  };
}

export function useTargetGroupFinder() {
  const { data: targetGroups = [] } = useAllTargetGroups();
  
  const findById = (systemId: string) => {
    return targetGroups.find(tg => tg.systemId === systemId) ?? null;
  };
  
  return { findById };
}
