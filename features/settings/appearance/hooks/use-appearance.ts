/**
 * Appearance Settings React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/appearance-api';
import type { AppearanceSettings } from '../api/appearance-api';
import type { CustomThemeConfig } from '../store';

export const appearanceKeys = {
  all: ['appearance'] as const,
  settings: () => [...appearanceKeys.all, 'settings'] as const,
};

export function useAppearanceSettings() {
  return useQuery({ queryKey: appearanceKeys.settings(), queryFn: api.fetchAppearanceSettings, staleTime: 1000 * 60 * 30 });
}

export function useAppearanceMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: appearanceKeys.all });
  return {
    update: useMutation({ mutationFn: api.updateAppearanceSettings, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    saveCustomTheme: useMutation({ mutationFn: api.saveCustomTheme, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}
