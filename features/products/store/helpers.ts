/**
 * Products Store - Helpers
 * Utility functions for product operations
 * 
 * @module features/products/store/helpers
 */

import type { Product } from '@/lib/types/prisma-extended';

/**
 * Check if a product tracks stock
 * Services, digital products, and combos don't track stock directly
 */
export const canModifyStock = (product: Product | undefined): boolean => {
    if (!product) return false;
    // Services, digital products, and combos don't track stock directly
    if (product.type === 'service' || product.type === 'digital' || product.type === 'combo') return false;
    // Explicitly disabled stock tracking
    if (product.isStockTracked === false) return false;
    return true;
};
