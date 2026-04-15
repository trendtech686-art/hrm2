/**
 * usePrintData hook — Lazy loading print data
 * 
 * ⚡ PERFORMANCE: Single API call returning ALL data needed for printing:
 * - Store info (company name, logo, address, etc.)
 * - Print template configurations
 * - General settings (currency, date format, etc.)
 * 
 * LAZY LOADING: Data is only fetched when `enabled` is true.
 * Typically triggered when user clicks print button.
 */

import { useQuery } from '@tanstack/react-query'

export interface StoreInfo {
  companyName: string
  brandName: string
  logo: string
  taxCode: string
  registrationNumber: string
  representativeName: string
  representativeTitle: string
  hotline: string
  email: string
  website: string
  headquartersAddress: string
  ward: string
  district: string
  province: string
  note: string
  bankAccountName: string
  bankAccountNumber: string
  bankName: string
  updatedAt: string | null
}

export interface PrintTemplateConfig {
  templates: Record<string, unknown>
  defaultSizes: Record<string, string>
}

export interface PrintData {
  storeInfo: StoreInfo
  printTemplateConfig: PrintTemplateConfig
  general: Record<string, unknown>
}

const EMPTY_PRINT_DATA: PrintData = {
  storeInfo: {
    companyName: '',
    brandName: '',
    logo: '',
    taxCode: '',
    registrationNumber: '',
    representativeName: '',
    representativeTitle: '',
    hotline: '',
    email: '',
    website: '',
    headquartersAddress: '',
    ward: '',
    district: '',
    province: '',
    note: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankName: '',
    updatedAt: null,
  },
  printTemplateConfig: {
    templates: {},
    defaultSizes: {},
  },
  general: {},
}

async function fetchPrintData(): Promise<PrintData> {
  const res = await fetch('/api/settings/print-data')
  if (!res.ok) throw new Error('Failed to fetch print data')
  return res.json()
}

/**
 * Hook for lazy loading print data
 * 
 * @param enabled - Whether to fetch data. Set to true when user initiates print.
 * 
 * @example
 * ```tsx
 * const [isPrinting, setIsPrinting] = useState(false);
 * const { data: printData, isLoading } = usePrintData(isPrinting);
 * 
 * const handlePrint = async () => {
 *   setIsPrinting(true);
 *   // printData will be fetched and available
 * };
 * ```
 */
export function usePrintData(enabled: boolean = false) {
  const query = useQuery({
    queryKey: ['settings', 'print-data'],
    queryFn: fetchPrintData,
    enabled,
    staleTime: 30 * 60 * 1000, // 30 minutes - settings rarely change
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  return {
    data: query.data ?? EMPTY_PRINT_DATA,
    storeInfo: query.data?.storeInfo ?? EMPTY_PRINT_DATA.storeInfo,
    printTemplateConfig: query.data?.printTemplateConfig ?? EMPTY_PRINT_DATA.printTemplateConfig,
    general: query.data?.general ?? EMPTY_PRINT_DATA.general,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  }
}

/**
 * Hook that returns a function to prefetch print data
 * Use this to prefetch data before user clicks print
 */
export function usePrefetchPrintData() {
  return {
    prefetch: () => {
      // Trigger a fetch that will be cached
      fetch('/api/settings/print-data')
    },
  }
}
