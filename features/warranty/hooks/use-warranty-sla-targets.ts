/**
 * Hook to fetch warranty SLA targets from DB settings
 * Converts DB format (priority-based) to flat format used by warranty-sla-utils
 */

'use client';

import { useWarrantySettingSection } from '@/features/settings/warranty/hooks/use-warranty-settings';
import { DEFAULT_WARRANTY_SLA_TARGETS, type WarrantySLATargets } from '../warranty-sla-utils';

interface SlaDbTargets {
  low?: { responseTime?: number; resolveTime?: number };
  medium?: { responseTime?: number; resolveTime?: number };
  high?: { responseTime?: number; resolveTime?: number };
  urgent?: { responseTime?: number; resolveTime?: number };
}

/**
 * Convert DB SLA targets (priority-based, hours for resolveTime) to flat format (minutes)
 * Uses "medium" priority as default since tickets don't have priority field
 */
function convertDbToFlat(dbTargets: SlaDbTargets): WarrantySLATargets {
  const medium = dbTargets.medium;
  if (!medium) return DEFAULT_WARRANTY_SLA_TARGETS;

  return {
    response: medium.responseTime ?? DEFAULT_WARRANTY_SLA_TARGETS.response,
    processing: (medium.resolveTime ?? 24) * 60, // DB stores hours → convert to minutes
    return: DEFAULT_WARRANTY_SLA_TARGETS.return,  // No DB equivalent, keep default
  };
}

/**
 * Hook to get warranty SLA targets from DB settings
 * Returns flat SLA targets { response, processing, return } in minutes
 */
export function useWarrantySLATargets(): WarrantySLATargets {
  const { data } = useWarrantySettingSection<SlaDbTargets>('sla-targets');
  if (!data || typeof data !== 'object') return DEFAULT_WARRANTY_SLA_TARGETS;
  return convertDbToFlat(data);
}
