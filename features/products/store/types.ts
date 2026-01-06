/**
 * Products Store - Types
 * Type definitions for the product store
 * 
 * @module features/products/store/types
 */

import type { Product } from '@/lib/types/prisma-extended';
import type { CrudState } from '../../../lib/store-factory';
import type { SystemId } from '../../../lib/id-types';

export interface ProductStoreState extends CrudState<Product> {
    // Inventory operations
    updateInventory: (productSystemId: SystemId, branchSystemId: SystemId, quantityChange: number) => void;
    commitStock: (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => void;
    uncommitStock: (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => void;
    dispatchStock: (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => void;
    completeDelivery: (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => void;
    returnStockFromTransit: (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => void;
    
    // Price tracking
    updateLastPurchasePrice: (productSystemId: SystemId, price: number, date: string) => void;
    
    // Search
    searchProducts: (query: string, page: number, limit?: number) => Promise<{ items: { value: SystemId; label: string }[], hasNextPage: boolean }>;
}
