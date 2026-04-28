/**
 * Hook lấy số lượng đã bảo hành của từng sản phẩm cho một khách hàng
 * Dùng để trừ vào số lượng có thể bảo hành
 * 
 * ✅ OPTIMIZED: Uses dedicated /api/warranties/claimed-quantities endpoint
 *    - Single API call (no pagination)
 *    - Aggregates directly in database
 *    - Only fetches when customerId is available
 */
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchClaimedQuantities, type ClaimedQuantitiesResponse } from '../api/warranties-api';

interface ClaimedProductInfo {
  productName: string;
  claimedQuantity: number;
  lastClaimDate: string;
  warrantyIds: string[];
}

interface UseClaimedQuantitiesResult {
  /** Map: productName (lowercase) -> số lượng đã bảo hành */
  claimedQuantities: Record<string, number>;
  /** Thông tin chi tiết về các sản phẩm đã bảo hành */
  claimedProducts: ClaimedProductInfo[];
  /** Map: productName (lowercase) -> danh sách mã phiếu BH (để hiển thị) */
  claimedProductTickets: Record<string, string[]>;
  /** Loading state */
  isLoading: boolean;
  /** Tổng số lượng đã bảo hành */
  totalClaimed: number;
  /** Số lượng phiếu COMPLETED */
  warrantiesCount: number;
}

export function useClaimedQuantities(
  customerSystemId: string | null | undefined,
  _customerName: string | null | undefined
): UseClaimedQuantitiesResult {
  // ✅ OPTIMIZED: Query chỉ chạy khi có customerId
  const { data, isLoading } = useQuery<ClaimedQuantitiesResponse>({
    queryKey: ['warranties', 'claimed-quantities', customerSystemId],
    queryFn: () => fetchClaimedQuantities(customerSystemId!),
    enabled: !!customerSystemId,
    staleTime: 2 * 60 * 1000, // 2 minutes - claimed quantities don't change often
    gcTime: 5 * 60 * 1000,
  });

  // Transform API response to expected format
  const claimedQuantities = React.useMemo(() => {
    return data?.claimedQuantities || {};
  }, [data?.claimedQuantities]);

  const claimedProducts = React.useMemo(() => {
    if (!data?.claimedProducts) return [];
    
    return data.claimedProducts.map(p => ({
      productName: p.productName,
      claimedQuantity: p.claimedQuantity,
      lastClaimDate: '', // Not returned by optimized API, but not used in current code
      warrantyIds: p.warrantyIds,
    }));
  }, [data?.claimedProducts]);

  const claimedProductTickets = React.useMemo(() => {
    const tickets: Record<string, string[]> = {};
    data?.claimedProducts?.forEach(p => {
      const key = p.productName.toLowerCase().trim();
      tickets[key] = p.warrantyIds;
    });
    return tickets;
  }, [data?.claimedProducts]);

  return {
    claimedQuantities,
    claimedProducts,
    claimedProductTickets,
    isLoading,
    totalClaimed: data?.totalClaimed || 0,
    warrantiesCount: data?.warrantiesCount || 0,
  };
}
