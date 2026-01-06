/**
 * Customers Store - Search Slice
 * Fuzzy search functionality using Fuse.js
 * 
 * @module features/customers/store/search-slice
 */

import Fuse from 'fuse.js';
import { baseStore } from './base-store';

// ============================================
// SEARCH METHODS
// ============================================

export const searchCustomers = async (query: string, page: number, limit: number = 20) => {
    return new Promise<{ items: { value: string; label: string }[], hasNextPage: boolean }>(resolve => {
        setTimeout(() => {
            const allCustomers = baseStore.getState().data;
            
            // Create fresh Fuse instance with current data (avoid stale data)
            const fuse = new Fuse(allCustomers, {
                keys: ['name', 'id', 'phone'],
                threshold: 0.3,
            });
            
            const results = query ? fuse.search(query).map(r => r.item) : allCustomers;
            
            const start = (page - 1) * limit;
            const end = start + limit;
            const paginatedItems = results.slice(start, end);

            resolve({
                items: paginatedItems.map(c => ({ value: c.systemId, label: c.name })),
                hasNextPage: end < results.length,
            });
        }, 300);
    });
};
