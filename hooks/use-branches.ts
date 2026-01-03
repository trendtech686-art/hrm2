/**
 * Re-export from features/settings/branches/hooks
 * 
 * Note: useAllBranches and useDefaultBranch are exported from use-all-branches.ts
 * which provides properly typed returns. The exports are ordered so use-all-branches
 * takes precedence.
 */
export { 
  useBranches, 
  useBranch, 
  useBranchMutations, 
  branchKeys 
} from '@/features/settings/branches/hooks/use-branches';

export { 
  useAllBranches, 
  useBranchOptions, 
  useDefaultBranch, 
  useBranchFinder 
} from '@/features/settings/branches/hooks/use-all-branches';
