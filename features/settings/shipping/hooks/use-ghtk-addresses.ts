/**
 * useGHTKAddresses - React Query hooks for GHTK addresses
 * 
 * Tối ưu:
 * 1. Sử dụng React Query caching thay vì manual cache
 * 2. StaleTime dài (1 giờ) vì dữ liệu ít thay đổi
 * 3. Enabled option để lazy loading
 */

import { useQuery } from '@tanstack/react-query';
import { getBaseUrl } from '@/lib/api-config';
import { loadShippingConfig } from '@/lib/utils/shipping-config-migration';

// ============================================
// TYPES
// ============================================

export interface GHTKPickAddress {
  id: string;
  name: string;
  address: string;
  province: string;
  district: string;
  ward?: string;
  tel: string;
}

export interface GHTKSpecificAddress {
  id: string;
  name: string;
}

interface GHTKCredentials {
  apiToken: string;
  partnerCode: string;
}

// ============================================
// HELPERS
// ============================================

function getGHTKCredentials(): GHTKCredentials | null {
  const config = loadShippingConfig();
  const ghtkData = config.partners.GHTK;
  
  if (!ghtkData?.accounts?.length) return null;
  
  const account = ghtkData.accounts.find(a => a.isDefault && a.active)
    || ghtkData.accounts.find(a => a.active)
    || ghtkData.accounts[0];
  
  if (!account?.active || !account.credentials.apiToken) return null;
  
  return {
    apiToken: account.credentials.apiToken as string,
    partnerCode: (account.credentials as { partnerCode?: string }).partnerCode || 'GHTK',
  };
}

// ============================================
// API FUNCTIONS
// ============================================

async function fetchGHTKPickAddresses(credentials: GHTKCredentials): Promise<GHTKPickAddress[]> {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/shipping/ghtk/list-pick-addresses`);
  url.searchParams.append('apiToken', credentials.apiToken);
  url.searchParams.append('partnerCode', credentials.partnerCode);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      return data.data.map((item: { pick_address_id?: string; id?: string; pick_name?: string; name?: string; address?: string; pick_tel?: string; tel?: string }) => ({
        id: item.pick_address_id || item.id,
        name: item.pick_name || item.name || 'Kho hàng',
        address: item.address || '',
        province: '',
        district: '',
        ward: '',
        tel: item.pick_tel || item.tel || '',
      }));
    }

    throw new Error(data.message || 'Không thể lấy danh sách kho');
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Timeout khi lấy danh sách kho');
    }
    throw error;
  }
}

async function fetchGHTKSpecificAddresses(
  credentials: GHTKCredentials,
  province: string,
  district: string,
  ward: string,
): Promise<GHTKSpecificAddress[]> {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/shipping/ghtk/get-specific-addresses`);
  url.searchParams.append('province', province);
  url.searchParams.append('district', district);
  url.searchParams.append('ward_street', ward);
  url.searchParams.append('apiToken', credentials.apiToken);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      let addresses = data.data.map((name: string, index: number) => ({
        id: `${name}-${index}`,
        name: name,
      }));

      // Move "Khác" to the top
      const khacIndex = addresses.findIndex((addr: GHTKSpecificAddress) => addr.name === 'Khác');
      if (khacIndex > 0) {
        const khac = addresses[khacIndex];
        addresses = [khac, ...addresses.slice(0, khacIndex), ...addresses.slice(khacIndex + 1)];
      }

      return addresses;
    }

    throw new Error(data.message || 'Không thể lấy danh sách địa chỉ');
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Timeout khi lấy địa chỉ chi tiết');
    }
    throw error;
  }
}

// ============================================
// QUERY KEYS
// ============================================

export const ghtkKeys = {
  all: ['ghtk'] as const,
  pickAddresses: () => [...ghtkKeys.all, 'pick-addresses'] as const,
  specificAddresses: (province: string, district: string, ward: string) => 
    [...ghtkKeys.all, 'specific-addresses', province, district, ward] as const,
};

// ============================================
// HOOKS
// ============================================

interface UseGHTKPickAddressesOptions {
  enabled?: boolean;
}

/**
 * Hook lấy danh sách kho lấy hàng từ GHTK
 * 
 * @example
 * const { data: pickAddresses, isLoading } = useGHTKPickAddresses({ enabled: isOpen });
 */
export function useGHTKPickAddresses(options: UseGHTKPickAddressesOptions = {}) {
  const { enabled = true } = options;
  const credentials = getGHTKCredentials();

  return useQuery({
    queryKey: ghtkKeys.pickAddresses(),
    queryFn: () => {
      if (!credentials) {
        throw new Error('GHTK chưa được cấu hình');
      }
      return fetchGHTKPickAddresses(credentials);
    },
    enabled: enabled && !!credentials,
    staleTime: 60 * 60 * 1000, // 1 hour - danh sách kho ít thay đổi
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}

interface UseGHTKSpecificAddressesOptions {
  province: string;
  district: string;
  ward: string;
  enabled?: boolean;
}

/**
 * Hook lấy danh sách địa chỉ chi tiết từ GHTK
 * 
 * @example
 * const { data: addresses, isLoading } = useGHTKSpecificAddresses({
 *   province: 'Hà Nội',
 *   district: 'Cầu Giấy', 
 *   ward: 'Nghĩa Đô',
 *   enabled: !!ward,
 * });
 */
export function useGHTKSpecificAddresses(options: UseGHTKSpecificAddressesOptions) {
  const { province, district, ward, enabled = true } = options;
  const credentials = getGHTKCredentials();

  const hasRequiredData = !!province && !!ward;

  return useQuery({
    queryKey: ghtkKeys.specificAddresses(province, district, ward),
    queryFn: () => {
      if (!credentials) {
        throw new Error('GHTK chưa được cấu hình');
      }
      return fetchGHTKSpecificAddresses(credentials, province, district, ward);
    },
    enabled: enabled && hasRequiredData && !!credentials,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });
}
