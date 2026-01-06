/**
 * Hook xử lý chọn sản phẩm và kiểm tra bảo hành
 */
import * as React from 'react';
import { toast } from 'sonner';
import type { Product } from '@/features/products/types';
import type { Order } from '@/features/orders/types';
import {
  checkProductWarranty,
  checkMultipleProductsWarranty,
  createWarrantyProductFromSelection,
} from '../utils/warranty-products-helpers';
import { type WarrantyCheckResult } from '../utils/warranty-checker';

interface UseProductSelectionOptions {
  customerName: string;
  allOrders: Order[];
  productInsertPosition: 'top' | 'bottom';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  append: (product: any) => void;
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
}: UseProductSelectionOptions): UseProductSelectionResult {
  const [warrantyCheckResults, setWarrantyCheckResults] = React.useState<Record<string, WarrantyCheckResult>>({});

  const handleSelectProduct = React.useCallback((product: Product) => {
    const newProduct = createWarrantyProductFromSelection({
      systemId: product.systemId,
      id: product.id,
      name: product.name,
      costPrice: product.costPrice,
      warrantyPeriodMonths: product.warrantyPeriodMonths,
    });

    // Sử dụng systemId cố định
    newProduct.systemId = `WP_${Date.now()}`;

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
  }, [customerName, allOrders, append]);

  const handleSelectProducts = React.useCallback((products: Product[]) => {
    const newProducts = products.map((product) => {
      const newProduct = createWarrantyProductFromSelection({
        systemId: product.systemId,
        id: product.id,
        name: product.name,
        costPrice: product.costPrice,
        warrantyPeriodMonths: product.warrantyPeriodMonths,
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
  }, [customerName, allOrders, productInsertPosition, append]);

  return {
    warrantyCheckResults,
    setWarrantyCheckResults,
    handleSelectProduct,
    handleSelectProducts,
  };
}
