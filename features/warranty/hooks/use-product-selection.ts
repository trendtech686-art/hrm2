/**
 * Hook xử lý chọn sản phẩm và kiểm tra bảo hành
 * ✅ Tách riêng: chọn sp nhanh vs check BH (chỉ chạy khi user bấm nút)
 */
import * as React from 'react';
import { toast } from 'sonner';
import type { Product } from '@/features/products/types';
import type { Order } from '@/features/orders/types';
import { generateSubEntityId } from '@/lib/id-utils';
import { useAllPricingPolicies } from '@/features/settings/pricing/hooks/use-all-pricing-policies';
import {
  checkMultipleProductsWarranty,
  createWarrantyProductFromSelection,
  type WarrantyProductField,
} from '../utils/warranty-products-helpers';
import { type WarrantyCheckResult } from '../utils/warranty-checker';

interface UseProductSelectionOptions {
  customerName: string;
  allOrders: Order[];
  productInsertPosition: 'top' | 'bottom';
  append: (product: WarrantyProductField) => void;
  pricingPolicyId?: string;
}

interface UseProductSelectionResult {
  warrantyCheckResults: Record<string, WarrantyCheckResult>;
  setWarrantyCheckResults: React.Dispatch<React.SetStateAction<Record<string, WarrantyCheckResult>>>;
  handleSelectProduct: (product: Product) => void;
  handleSelectProducts: (products: Product[]) => void;
  /** ✅ Check warranty cho tất cả products hiện tại và cập nhật vào state */
  checkAllProductsWarranty: (products: WarrantyProductField[], customerName: string, allOrders: Order[], claimedQuantities: Record<string, number>, claimedProductTickets: Record<string, string[]>) => void;
}

export function useProductSelection({
  customerName: _customerName,
  allOrders: _allOrders,
  productInsertPosition,
  append,
  pricingPolicyId,
}: UseProductSelectionOptions): UseProductSelectionResult {
  const [warrantyCheckResults, setWarrantyCheckResults] = React.useState<Record<string, WarrantyCheckResult>>({});

  // ✅ Lấy default pricing policy để set giá mặc định
  const { data: pricingPolicies = [] } = useAllPricingPolicies();
  const defaultPricingPolicy = React.useMemo(() => {
    return pricingPolicies.find(p => p.isDefault && p.type === 'Bán hàng');
  }, [pricingPolicies]);

  // ✅ Helper function để lấy giá từ product theo policy đang chọn
  const getDefaultPrice = React.useCallback((product: Product): number => {
    // 1. Ưu tiên giá từ bảng giá đang chọn
    if (pricingPolicyId && product.prices?.[pricingPolicyId] !== undefined) {
      return product.prices[pricingPolicyId];
    }
    // 2. Fallback: giá từ bảng giá mặc định
    if (defaultPricingPolicy && product.prices?.[defaultPricingPolicy.systemId] !== undefined) {
      return product.prices[defaultPricingPolicy.systemId];
    }
    // 3. Fallback: lấy giá đầu tiên trong bảng prices
    if (product.prices && Object.keys(product.prices).length > 0) {
      const firstPolicyId = Object.keys(product.prices)[0];
      return product.prices[firstPolicyId] || 0;
    }
    // 4. Fallback cuối: costPrice
    return product.costPrice || 0;
  }, [pricingPolicyId, defaultPricingPolicy]);

  // ✅ Check all products warranty - CHỈ chạy khi user bấm nút "Kiểm tra BH"
  const checkAllProductsWarranty = React.useCallback((
    products: WarrantyProductField[],
    customerName: string,
    allOrders: Order[],
    claimedQuantities: Record<string, number> = {},
    claimedProductTickets: Record<string, string[]> = {} // ✅ Thêm param
  ) => {
    if (!customerName || products.length === 0) {
      toast.warning('Vui lòng chọn khách hàng và thêm sản phẩm trước');
      return;
    }

    const startTime = performance.now();

    const productsForCheck = products.map(p => ({
      systemId: p.productSystemId || p.systemId || '',
      id: p.sku || '',
      name: p.productName || '',
      costPrice: p.unitPrice,
      warrantyPeriodMonths: 12,
    }));

    const { results } = checkMultipleProductsWarranty(
      customerName,
      productsForCheck,
      allOrders,
      claimedQuantities,
      claimedProductTickets // ✅ Truyền vào
    );

    // ✅ Cập nhật state 1 lần duy nhất
    setWarrantyCheckResults(results);

    // ✅ Toast thông báo kết quả
    const elapsed = Math.round(performance.now() - startTime);
    const validCount = Object.values(results).filter(r => r.isValid).length;
    const totalCount = Object.values(results).length;

    if (validCount === totalCount) {
      toast.success(`Kiểm tra BH hoàn tất (${elapsed}ms) - Tất cả ${totalCount} sản phẩm còn bảo hành`);
    } else if (validCount > 0) {
      toast.warning(`Kiểm tra BH hoàn tất (${elapsed}ms) - ${validCount}/${totalCount} sản phẩm còn bảo hành`);
    } else {
      toast.error(`Kiểm tra BH hoàn tất (${elapsed}ms) - Không có sản phẩm nào còn bảo hành`);
    }
  }, []);

  // ✅ Chọn 1 sản phẩm - KHÔNG tự động check BH (chỉ thêm vào form)
  const handleSelectProduct = React.useCallback((product: Product) => {
    const defaultPrice = getDefaultPrice(product);

    const newProduct = createWarrantyProductFromSelection({
      systemId: product.systemId,
      id: product.id,
      name: product.name,
      costPrice: defaultPrice,
      warrantyPeriodMonths: product.warrantyPeriodMonths,
      thumbnailImage: product.thumbnailImage,
    });

    newProduct.systemId = generateSubEntityId('WP');
    append(newProduct);
  }, [append, getDefaultPrice]);

  // ✅ Chọn nhiều sản phẩm - KHÔNG tự động check BH (chỉ thêm vào form)
  const handleSelectProducts = React.useCallback((products: Product[]) => {
    const newProducts = products.map((product) => {
      const defaultPrice = getDefaultPrice(product);

      const newProduct = createWarrantyProductFromSelection({
        systemId: product.systemId,
        id: product.id,
        name: product.name,
        costPrice: defaultPrice,
        warrantyPeriodMonths: product.warrantyPeriodMonths,
        thumbnailImage: product.thumbnailImage,
      });
      return newProduct;
    });

    if (productInsertPosition === 'top') {
      newProducts.reverse().forEach((p) => append(p));
    } else {
      newProducts.forEach((p) => append(p));
    }
  }, [productInsertPosition, append, getDefaultPrice]);

  return {
    warrantyCheckResults,
    setWarrantyCheckResults,
    handleSelectProduct,
    handleSelectProducts,
    checkAllProductsWarranty,
  };
}
