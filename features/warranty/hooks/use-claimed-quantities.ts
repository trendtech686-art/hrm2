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
  warrantyIds: string[]; // ✅ Danh sách mã phiếu BH
}

interface UseClaimedQuantitiesResult {
  /** Map: productName -> số lượng đã bảo hành */
  claimedQuantities: Record<string, number>;
  /** Thông tin chi tiết về các sản phẩm đã bảo hành */
  claimedProducts: ClaimedProductInfo[];
  /** Map: productName -> danh sách mã phiếu BH (để hiển thị) */
  claimedProductTickets: Record<string, string[]>;
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
  _customerName: string | null | undefined
): UseClaimedQuantitiesResult {
  // Lấy tất cả warranties của khách hàng (chỉ completed)
  const { data, isLoading } = useWarrantiesByCustomer(customerSystemId, {
    status: 'COMPLETED',
  });

  const warranties = React.useMemo(() => extractWarrantiesArray(data), [data]);

  // Debug log
  console.warn('[useClaimedQuantities] warranties count:', warranties.length);
  console.warn('[useClaimedQuantities] sample warranty:', warranties[0]?.products);

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
          // ✅ Tính cả resolution 'return', 'replace', 'exchange', 'out_of_stock' đều là bảo hành
          const isWarrantyClaim = 
            product.resolution === 'return' || 
            product.resolution === 'replace' ||
            product.resolution === 'exchange' ||
            product.resolution === 'out_of_stock';

          if (product.productName && product.quantity && isWarrantyClaim) {
            const name = product.productName.toLowerCase().trim();
            quantities[name] = (quantities[name] || 0) + product.quantity;
          }
        });
      }
    });

    console.warn('[useClaimedQuantities] final claimedQuantities:', JSON.stringify(quantities));
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
      const completedAt = warranty.completedAt || '';

      if (products && Array.isArray(products)) {
        products.forEach((product) => {
          // ✅ Tính cả resolution 'return', 'replace', 'exchange', 'out_of_stock' đều là bảo hành
          const isWarrantyClaim = 
            product.resolution === 'return' || 
            product.resolution === 'replace' ||
            product.resolution === 'exchange' ||
            product.resolution === 'out_of_stock';

          if (product.productName && product.quantity && isWarrantyClaim) {
            const name = product.productName.toLowerCase().trim();
            if (!productsMap[name]) {
              productsMap[name] = {
                productName: product.productName,
                claimedQuantity: 0,
                lastClaimDate: '',
                warrantyIds: [],
              };
            }
            productsMap[name].claimedQuantity += product.quantity;
            // Cập nhật ngày gần nhất
            if (completedAt && completedAt > productsMap[name].lastClaimDate) {
              productsMap[name].lastClaimDate = completedAt;
            }
            // ✅ Thêm mã phiếu BH nếu chưa có
            if (warranty.id && !productsMap[name].warrantyIds.includes(warranty.id)) {
              productsMap[name].warrantyIds.push(warranty.id);
            }
          }
        });
      }
    });

    return Object.values(productsMap);
  }, [warranties]);

  // ✅ Tạo map để lookup nhanh: productName -> danh sách mã phiếu BH
  const claimedProductTickets = React.useMemo(() => {
    const tickets: Record<string, string[]> = {};
    claimedProducts.forEach(p => {
      const key = p.productName.toLowerCase().trim();
      tickets[key] = p.warrantyIds;
    });
    // Debug log
    if (Object.keys(tickets).length > 0) {
      console.warn('[useClaimedQuantities] claimedProductTickets:', JSON.stringify(tickets));
    }
    return tickets;
  }, [claimedProducts]);

  return {
    claimedQuantities,
    claimedProducts,
    claimedProductTickets,
    isLoading,
  };
}
