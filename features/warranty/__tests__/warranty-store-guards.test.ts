import { describe, it, expect } from 'vitest';
import { useWarrantyStore } from '@/features/warranty/store';
import type { ResolutionType, WarrantyStatus, WarrantyStore } from '@/features/warranty/types';
import { WARRANTY_STATUS_LABELS, WARRANTY_STATUS_COLORS, RESOLUTION_LABELS } from '@/features/warranty/types';
import { WARRANTY_STATUS_MAP, WARRANTY_RESOLUTION_MAP } from '@/components/StatusBadge';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
  ? ((<T>() => T extends B ? 1 : 2) extends (<T>() => T extends A ? 1 : 2) ? true : false)
  : false;
type Expect<T extends true> = T;

const WARRANTY_STATUSES = ['incomplete', 'pending', 'processed', 'returned', 'completed', 'cancelled'] as const satisfies ReadonlyArray<WarrantyStatus>;
type _EnsureWarrantyStatuses = Expect<Equal<WarrantyStatus, (typeof WARRANTY_STATUSES)[number]>>;

const WARRANTY_RESOLUTIONS = ['return', 'replace', 'deduct', 'out_of_stock'] as const satisfies ReadonlyArray<ResolutionType>;
type _EnsureWarrantyResolutions = Expect<Equal<ResolutionType, (typeof WARRANTY_RESOLUTIONS)[number]>>;

const REQUIRED_METHODS: Array<keyof WarrantyStore> = [
  'addProduct',
  'updateProduct',
  'removeProduct',
  'updateStatus',
  'addHistory',
  'recalculateSummary',
  'calculateSummary',
  'calculateSettlementStatus',
  'generateNextSystemId',
];

describe('useWarrantyStore guards', () => {
  it('exposes the critical warranty-specific helpers', () => {
    const state = useWarrantyStore.getState();

    REQUIRED_METHODS.forEach((method) => {
      expect(typeof (state as any)[method]).toBe('function');
    });
  });

  it('keeps all warranty status maps in sync', () => {
    WARRANTY_STATUSES.forEach((status) => {
      expect(WARRANTY_STATUS_COLORS[status]).toBeDefined();
      expect(WARRANTY_STATUS_MAP[status]).toBeDefined();
    });
  });

  it('keeps resolution helpers aligned with status badge presets', () => {
    WARRANTY_RESOLUTIONS.forEach((resolution) => {
      expect(RESOLUTION_LABELS[resolution]).toBeDefined();
      expect(WARRANTY_RESOLUTION_MAP[resolution]).toBeDefined();
    });
  });
});
