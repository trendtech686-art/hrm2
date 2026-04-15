/**
 * Hook xử lý chọn sản phẩm và kiểm tra bảo hành
 */
import * as React from 'react';
import { toast } from 'sonner';
import type { Product } from '@/features/products/types';
import type { Order } from '@/features/orders/types';
import { generateSubEntityId } from '@/lib/id-utils';
import { useAllPricingPolicies } from '@/features/settings/pricing/hooks/use-all-pricing-policies';
import {
  checkProductWarranty,
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
}

export function useProductSelection({
  customerName,
  allOrders,
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

  const handleSelectProduct = React.useCallback((product: Product) => {
    const defaultPrice = getDefaultPrice(product);
    
    const newProduct = createWarrantyProductFromSelection({
      systemId: product.systemId,
      id: product.id,
      name: product.name,
      costPrice: defaultPrice, // ✅ Sử dụng giá mặc định thay vì costPrice
      warrantyPeriodMonths: product.warrantyPeriodMonths,
      thumbnailImage: product.thumbnailImage, // ✅ Thêm ảnh sản phẩm
    });

    // Sử dụng systemId cố định
    newProduct.systemId = generateSubEntityId('WP');

    append(newProduct);
    
    // Kiểm tra bảo hành nếu đã chọn khách hàng
    if (customerName) {
      const checkResult = checkProductWarranty(
        customerName,
        {
          systemId: product.systemId,
          id: product.id,
          name: product.name,
          costPrice: product.costPrice,
          warrantyPeriodMonths: product.warrantyPeriodMonths,
        },
        1,
        allOrders
      );
      
      // Show toast if there are warnings
      if (checkResult.warnings.length > 0) {
        if (checkResult.isValid) {
          toast.warning(`Cảnh báo: ${product.name}`, {
            description: checkResult.warnings.join('\n'),
            duration: 5000,
          });
        } else {
          toast.error(`Không hợp lệ: ${product.name}`, {
            description: checkResult.warnings.join('\n'),
            duration: 6000,
          });
        }
      }
      
      setWarrantyCheckResults(prev => ({
        ...prev,
        [product.name]: checkResult,
      }));
    }
  }, [customerName, allOrders, append, getDefaultPrice]);

  const handleSelectProducts = React.useCallback((products: Product[]) => {
    const newProducts = products.map((product) => {
      const defaultPrice = getDefaultPrice(product);
      
      const newProduct = createWarrantyProductFromSelection({
        systemId: product.systemId,
        id: product.id,
        name: product.name,
        costPrice: defaultPrice, // ✅ Sử dụng giá mặc định
        warrantyPeriodMonths: product.warrantyPeriodMonths,
        thumbnailImage: product.thumbnailImage, // ✅ Thêm ảnh sản phẩm
      });
      return newProduct;
    });

    if (productInsertPosition === 'top') {
      newProducts.reverse().forEach((p) => append(p));
    } else {
      newProducts.forEach((p) => append(p));
    }
    
    // Kiểm tra bảo hành cho tất cả sản phẩm
    if (customerName) {
      const { results, warnings } = checkMultipleProductsWarranty(
        customerName,
        products.map(p => ({
          systemId: p.systemId,
          id: p.id,
          name: p.name,
          costPrice: p.costPrice,
          warrantyPeriodMonths: p.warrantyPeriodMonths,
        })),
        allOrders
      );
      
      setWarrantyCheckResults(prev => ({ ...prev, ...results }));
      
      // Show consolidated toast if there are warnings
      if (warnings.length > 0) {
        toast.warning(`Cảnh báo bảo hành (${warnings.length} SP)`, {
          description: warnings.slice(0, 3).join('\n') + (warnings.length > 3 ? `\n...và ${warnings.length - 3} SP khác` : ''),
          duration: 6000,
        });
      }
    }
  }, [customerName, allOrders, productInsertPosition, append, getDefaultPrice]);

  return {
    warrantyCheckResults,
    setWarrantyCheckResults,
    handleSelectProduct,
    handleSelectProducts,
  };
}
