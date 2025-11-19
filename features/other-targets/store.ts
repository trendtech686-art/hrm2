import { createCrudStore } from '../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { SystemId } from '@/lib/id-types';
import type { OtherTarget } from './types.ts';
import Fuse from 'fuse.js';

type OtherTargetStoreExtension = {
    searchOtherTargets: (
        query: string,
        page: number,
        limit?: number
    ) => Promise<{ items: { value: SystemId; label: string }[]; hasNextPage: boolean }>;
};

const baseStore = createCrudStore<OtherTarget>(initialData, 'other-targets');

const fuse = new Fuse(baseStore.getState().data, {
    keys: ['name'],
    threshold: 0.3,
});

const storeExtension: OtherTargetStoreExtension = {
    searchOtherTargets: async (query: string, page: number, limit: number = 20) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const allItems = baseStore.getState().data;
                const results = query ? fuse.search(query).map(r => r.item) : allItems;
                
                const start = (page - 1) * limit;
                const end = start + limit;
                const paginatedItems = results.slice(start, end);

                resolve({
                    items: paginatedItems.map((c) => ({ value: c.systemId, label: c.name })),
                    hasNextPage: end < results.length,
                });
            }, 300);
        });
    }
};

baseStore.setState(storeExtension as any);

type OtherTargetStore = ReturnType<typeof createCrudStore<OtherTarget>> & OtherTargetStoreExtension;

export const useOtherTargetStore = baseStore as unknown as OtherTargetStore;
