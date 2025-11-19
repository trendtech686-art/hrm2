import { createCrudStore } from '../../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { ShippingPartner } from './types.ts';
import Fuse from 'fuse.js';
import type { SystemId } from '@/lib/id-types';

// FIX: Replaced import from a non-existent module and replaced it with a mock function.
const connectPartner = async (partnerId: string, credentials: any): Promise<{ success: boolean; message: string }> => {
    console.log(`Connecting to ${partnerId} with`, credentials);
    // Simulate success for known partners if they have credentials.
    if (credentials && Object.values(credentials).every(v => v)) {
        return { success: true, message: 'Kết nối thành công.' };
    }
    return { success: false, message: 'Thông tin kết nối không hợp lệ.' };
};

type ShippingPartnerStoreExtension = {
  searchShippingPartners: (query: string, page: number, limit?: number) => Promise<{ items: { value: string; label: string }[], hasNextPage: boolean }>;
    connect: (systemId: SystemId, credentials: Record<string, any>) => Promise<{ success: boolean; message: string }>;
    disconnect: (systemId: SystemId) => void;
};

const baseStore = createCrudStore<ShippingPartner>(initialData, 'shipping-partners', {
  // ⚠️ DEPRECATED: Store này không còn dùng để lưu credentials nữa
  // Credentials giờ được lưu trong shipping_partners_config (localStorage)
  // Xem: lib/utils/shipping-config-migration.ts và lib/utils/get-shipping-credentials.ts
  persistKey: 'hrm-shipping-partners' // Keep for backward compatibility
});

const fuse = new Fuse(baseStore.getState().data, {
    keys: ['name', 'id', 'phone'],
    threshold: 0.3,
});

const storeExtension: ShippingPartnerStoreExtension = {
    searchShippingPartners: async (query: string, page: number, limit: number = 20) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const allPartners = baseStore.getState().data;
                const results = query ? fuse.search(query).map(r => r.item) : allPartners;
                
                const start = (page - 1) * limit;
                const end = start + limit;
                const paginatedItems = results.slice(start, end);

                resolve({
                    items: paginatedItems.map(p => ({ value: p.systemId, label: p.name })),
                    hasNextPage: end < results.length,
                });
            }, 300);
        });
    },
    connect: async (systemId: SystemId, credentials: Record<string, any>) => {
        // ⚠️ DEPRECATED: Không nên dùng hàm này nữa
        // Vui lòng cấu hình trong Settings → Đối tác vận chuyển
        // Credentials sẽ được lưu vào shipping_partners_config
        console.warn('[ShippingPartnerStore] connect() is deprecated. Use shipping_partners_config instead.');
        
        const partner = baseStore.getState().findById(systemId);
        if (!partner) return { success: false, message: 'Không tìm thấy đối tác vận chuyển.' };
        
        console.log('[ShippingPartnerStore] Connecting partner:', { systemId, credentials });
        
        const result = { success: true, message: 'Kết nối thành công.' };
        
        if (result.success) {
            baseStore.setState(state => {
                const newData = state.data.map(p => 
                    p.systemId === systemId 
                    ? { ...p, isConnected: true, status: 'Đang hợp tác' as const, credentials } 
                    : p
                );
                
                console.log('[ShippingPartnerStore] Updated partner:', newData.find(p => p.systemId === systemId));
                
                return { data: newData };
            });
        }
        return result;
    },
    disconnect: (systemId: SystemId) => {
        // ⚠️ DEPRECATED: Không nên dùng hàm này nữa
        console.warn('[ShippingPartnerStore] disconnect() is deprecated. Use shipping_partners_config instead.');
        
        baseStore.setState(state => ({
            data: state.data.map(p => 
                p.systemId === systemId 
                ? { ...p, isConnected: false, status: 'Ngừng hợp tác', credentials: {}, configuration: {} } 
                : p
            )
        }));
    },
};

baseStore.setState(storeExtension as any);

type ShippingPartnerStoreState = ReturnType<typeof baseStore.getState> & ShippingPartnerStoreExtension;

// Export with proper Zustand hook typing
export const useShippingPartnerStore: {
  (): ShippingPartnerStoreState;
  <U>(selector: (state: ShippingPartnerStoreState) => U): U;
  getState: () => ShippingPartnerStoreState;
  setState: typeof baseStore.setState;
  subscribe: typeof baseStore.subscribe;
} = baseStore as any;
