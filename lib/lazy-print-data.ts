/**
 * Lazy Print Data - Utility for loading print settings on-demand
 * 
 * ⚡ PERFORMANCE: Instead of loading store info at component mount,
 * this fetches all print-related settings only when print is triggered.
 * 
 * @example
 * // Before (eager loading - called on mount)
 * const { info: storeInfo } = useStoreInfoData();
 * const handlePrint = () => {
 *   const storeSettings = createStoreSettings(storeInfo);
 *   // ...print
 * };
 * 
 * // After (lazy loading - called on print)
 * const handlePrint = async () => {
 *   const { storeInfo } = await fetchPrintData();
 *   const storeSettings = createStoreSettings(storeInfo);
 *   // ...print
 * };
 */

export interface PrintDataResponse {
  storeInfo: {
    companyName?: string;
    brandName?: string;
    headquartersAddress?: string;
    hotline?: string;
    email?: string;
    province?: string;
    logo?: string;
    taxCode?: string;
    bankAccount?: string;
    bankName?: string;
    bankBranch?: string;
    website?: string;
    representativeName?: string;
    representativeTitle?: string;
  } | null;
  printTemplateConfig: {
    templates: Record<string, unknown>;
    defaultSizes: Record<string, string>;
  } | null;
  general: Record<string, unknown> | null;
}

/**
 * Fetch print data lazily from the combined API endpoint.
 * Call this inside your print handler instead of using useStoreInfoData().
 * 
 * The data is cached by browser for subsequent calls within the same session.
 */
export async function fetchPrintData(): Promise<PrintDataResponse> {
  const response = await fetch('/api/settings/print-data');
  if (!response.ok) {
    throw new Error('Failed to fetch print data');
  }
  return response.json();
}

/**
 * Create a memoized fetch function for use inside React components.
 * Useful when you need to reference the function in useCallback dependencies.
 */
export function createFetchPrintData() {
  return async () => fetchPrintData();
}
