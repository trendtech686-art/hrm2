/**
 * Products Store - Search Slice
 * Fuzzy search functionality using Fuse.js
 * 
 * @module features/products/store/search-slice
 */

import Fuse from 'fuse.js';
import type { SystemId } from '../../../lib/id-types';
import { asSystemId } from '../../../lib/id-types';
import { baseStore } from './base-store';

// ============================================
// SEARCH
// ============================================

export const searchProducts = async (
    query: string, 
    page: number = 1, 
    limit: number = 10
): Promise<{ items: { value: SystemId; label: string }[], hasNextPage: boolean }> => {
    const allProducts = baseStore.getState().data;
    
    // Create fresh Fuse instance with current data (avoid stale data)
    const fuse = new Fuse(allProducts, {
        keys: ['name', 'id', 'sku', 'barcode'],
        threshold: 0.3,
    });
    
    const results = fuse.search(query);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);

    return {
        items: paginatedResults.map(result => ({
            value: asSystemId(result.item.systemId),
            label: `${result.item.name} (${result.item.id})`,
        })),
        hasNextPage: endIndex < results.length,
    };
};
