/**
 * Hook lấy số lượng đã bảo hành của từng sản phẩm cho một khách hàng
 * Dùng để trừ vào số lượng có thể bảo hành
 */
import * as React from 'react';
import { useWarrantiesByCustomer } from './use-warranties';
import type { WarrantyTicket } from '@/lib/types/prisma-extended';

interface ClaimedProductInfo {
  productName: string;
  claimedQuantity: number;
  lastClaimDate: string;
}

interface UseClaimedQuantitiesResult {
  /** Map: productName -> số lượng đã bảo hành */
  claimedQuantities: Record<string, number>;
  /** Thông tin chi tiết về các sản phẩm đã bảo hành */
  claimedProducts: ClaimedProductInfo[];
  /** Loading state */
  isLoading: boolean;
}

/**
 * Extract warranties array from paginated response or return as-is
 */
function extractWarrantiesArray(data: unknown): WarrantyTicket[] {
  if (!data) return [];
  // Handle paginated response: { data: [...], total: X }
  if (typeof data === 'object' && 'data' in (data as Record<string, unknown>)) {
    const d = data as { data: WarrantyTicket[] };
    return Array.isArray(d.data) ? d.data : [];
  }
  // Handle direct array
  if (Array.isArray(data)) return data;
  return [];
}

/**
 * Hook để lấy số lượng đã bảo hành của khách hàng
 * Chỉ lấy các warranty tickets đã hoàn tất (COMPLETED)
 */
export function useClaimedQuantities(
  customerSystemId: string | null | undefined,
  customerName: string | null | undefined
): UseClaimedQuantitiesResult {
  // Lấy tất cả warranties của khách hàng (chỉ completed)
  const { data, isLoading } = useWarrantiesByCustomer(customerSystemId, {
    status: 'COMPLETED',
    enabled: !!customerSystemId && !!customerName,
  });

  const warranties = React.useMemo(() => extractWarrantiesArray(data), [data]);

  // Debug log
  console.log('[useClaimedQuantities] warranties count:', warranties.length);
  console.log('[useClaimedQuantities] sample warranty:', warranties[0]?.products);

  const claimedQuantities = React.useMemo(() => {
    const quantities: Record<string, number> = {};

    warranties.forEach((warranty) => {
      // Lấy products từ warranty (được lưu dạng JSON)
      const products = warranty.products as Array<{
        productName?: string;
        quantity?: number;
        resolution?: string;
      }> | null;

      if (products && Array.isArray(products)) {
        products.forEach((product) => {
          // ✅ Chỉ đếm sản phẩm có resolution = 'return' hoặc 'replace'
          // KHÔNG đếm 'out_of_stock' vì đó không phải BH thực sự
          const isWarrantyClaim = product.resolution === 'return' || product.resolution === 'replace';

          // Debug
          console.log('[useClaimedQuantities] product:', product.productName, 'resolution:', product.resolution, 'isWarrantyClaim:', isWarrantyClaim, 'qty:', product.quantity);

          if (product.productName && product.quantity && isWarrantyClaim) {
            const name = product.productName.toLowerCase().trim();
            quantities[name] = (quantities[name] || 0) + product.quantity;
          }
        });
      }
    });

    console.log('[useClaimedQuantities] final claimedQuantities:', quantities);
    return quantities;
  }, [warranties]);

  const claimedProducts = React.useMemo(() => {
    const productsMap: Record<string, ClaimedProductInfo> = {};

    warranties.forEach((warranty) => {
      const products = warranty.products as Array<{
        productName?: string;
        quantity?: number;
        resolution?: string;
      }> | null;
      // Handle both Date object and ISO string from API
      let completedAt = '';
      if (warranty.completedAt) {
        if (typeof warranty.completedAt === 'string') {
          completedAt = warranty.completedAt;
        } else if (typeof warranty.completedAt.toISOString === 'function') {
          completedAt = warranty.completedAt.toISOString();
        }
      }

      if (products && Array.isArray(products)) {
        products.forEach((product) => {
          // ✅ Chỉ đếm sản phẩm có resolution = 'return' hoặc 'replace'
          const isWarrantyClaim = product.resolution === 'return' || product.resolution === 'replace';

          if (product.productName && product.quantity && isWarrantyClaim) {
            const name = product.productName.toLowerCase().trim();
            if (!productsMap[name]) {
              productsMap[name] = {
                productName: product.productName,
                claimedQuantity: 0,
                lastClaimDate: '',
              };
            }
            productsMap[name].claimedQuantity += product.quantity;
            // Cập nhật ngày gần nhất
            if (completedAt && completedAt > productsMap[name].lastClaimDate) {
              productsMap[name].lastClaimDate = completedAt;
            }
          }
        });
      }
    });

    return Object.values(productsMap);
  }, [warranties]);

  return {
    claimedQuantities,
    claimedProducts,
    isLoading,
  };
}
