import { useMemo } from 'react';
import type { Product } from '../features/products/types';

/**
 * Hook tạo cache Map cho products để lookup O(1) thay vì O(n)
 * 
 * Performance:
 * - Trước: Linear search O(n) - với 500 products × 20 lookups = 10,000 comparisons
 * - Sau: Hash lookup O(1) - 20 lookups instant
 * 
 * @param products - Danh sách products từ store
 * @returns Object với các Map để lookup nhanh
 */
export function useProductCache(products: Product[]) {
  return useMemo(() => {
    const bySKU = new Map<string, Product>();
    const bySystemId = new Map<string, Product>();
    const byName = new Map<string, Product>();
    
    products.forEach(product => {
      // Index by SKU (id field)
      if (product.id) {
        bySKU.set(product.id, product);
      }
      
      // Index by systemId
      if (product.systemId) {
        bySystemId.set(product.systemId, product);
      }
      
      // Index by name (for search)
      if (product.name) {
        byName.set(product.name.toLowerCase(), product);
      }
    });
    
    return {
      bySKU,
      bySystemId,
      byName,
      // Helper methods
      getBySKU: (sku: string) => bySKU.get(sku),
      getBySystemId: (systemId: string) => bySystemId.get(systemId),
      getByName: (name: string) => byName.get(name.toLowerCase()),
    };
  }, [products]);
}
