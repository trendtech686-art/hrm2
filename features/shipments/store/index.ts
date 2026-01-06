/**
 * Shipment Store - Main Entry
 * Combined store with all slices
 * 
 * @module features/shipments/store
 */

import { create } from 'zustand';
import type { SystemId } from '../../../lib/id-types';

// Types
import type { ShipmentStoreState, Shipment } from './types';
export type { ShipmentStoreState, Shipment } from './types';

// Helpers
import { 
    getNextShipmentSystemId, 
    getNextShipmentBusinessId 
} from './helpers';

// ========================================
// STORE CREATION
// ========================================

export const useShipmentStore = create<ShipmentStoreState>()(
    (set, get) => ({
            data: [],
            
            findById: (systemId: string) => {
                return get().data.find(s => s.systemId === systemId);
            },
            
            findByPackagingSystemId: (packagingSystemId: string) => {
                return get().data.find(s => s.packagingSystemId === packagingSystemId);
            },
            
            findByTrackingCode: (trackingCode: string) => {
                return get().data.find(s => s.trackingCode === trackingCode);
            },
            
            createShipment: (data: Omit<Shipment, 'systemId' | 'id'>) => {
                const newShipment: Shipment = {
                    systemId: getNextShipmentSystemId(),
                    id: getNextShipmentBusinessId(),
                    ...data,
                };
                
                set(state => ({
                    data: [...state.data, newShipment]
                }));
                
                return newShipment;
            },
            
            updateShipment: (systemId: SystemId, updates: Partial<Shipment>) => {
                set(state => ({
                    data: state.data.map(s => 
                        s.systemId === systemId 
                            ? { ...s, ...updates }
                            : s
                    )
                }));
            },
            
            deleteShipment: (systemId: SystemId) => {
                set(state => ({
                    data: state.data.filter(s => s.systemId !== systemId)
                }));
            },
            
            getNextSystemId: () => getNextShipmentSystemId(),
            getNextBusinessId: () => getNextShipmentBusinessId(),
        })
);
