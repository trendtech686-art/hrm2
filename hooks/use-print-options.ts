/**
 * Hook để quản lý print options
 * Sử dụng React Query (via useUserPreference) để tránh duplicate fetches
 */

import { useUserPreference } from './use-user-preference'
import type { PaperSize } from '@/features/settings/printer/types'

// ==================== Print Options (Full) ====================

export interface PrintOptionsDefaults {
  branchSystemId: string;
  paperSize: PaperSize;
  printOrder: boolean;
  printDelivery: boolean;
  printPacking: boolean;
  printShippingLabel: boolean;
  printProductLabel: boolean;
}

const DEFAULT_PRINT_OPTIONS: PrintOptionsDefaults = {
  branchSystemId: '',
  paperSize: 'A4',
  printOrder: true,
  printDelivery: false,
  printPacking: false,
  printShippingLabel: false,
  printProductLabel: false,
}

/**
 * Hook để quản lý print options cho order print dialog
 */
export function usePrintOptions(): [
  PrintOptionsDefaults,
  (options: PrintOptionsDefaults) => void,
  boolean
] {
  return useUserPreference<PrintOptionsDefaults>('print-options-default', DEFAULT_PRINT_OPTIONS, 'ui')
}

// ==================== Simple Print Options ====================

export interface SimplePrintOptionsDefaults {
  branchSystemId: string;
  paperSize: PaperSize;
}

const DEFAULT_SIMPLE_PRINT_OPTIONS: SimplePrintOptionsDefaults = {
  branchSystemId: '',
  paperSize: 'A4',
}

/**
 * Hook để quản lý simple print options
 */
export function useSimplePrintOptions(options?: { enabled?: boolean }): [
  SimplePrintOptionsDefaults,
  (options: SimplePrintOptionsDefaults) => void,
  boolean
] {
  return useUserPreference<SimplePrintOptionsDefaults>('simple-print-options-default', DEFAULT_SIMPLE_PRINT_OPTIONS, 'ui', options)
}
