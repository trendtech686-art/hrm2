/**
 * Shipment Store - Types
 * Store interface definitions
 * 
 * @module features/shipments/store/types
 */

import type { SystemId, BusinessId } from '../../../lib/id-types';
import type { Shipment } from '@/lib/types/prisma-extended';

export interface ShipmentStoreState {
    data: Shipment[];
    
    // CRUD
    findById: (systemId: string) => Shipment | undefined;
    findByPackagingSystemId: (packagingSystemId: string) => Shipment | undefined;
    findByTrackingCode: (trackingCode: string) => Shipment | undefined;
    
    // Actions
    createShipment: (data: Omit<Shipment, 'systemId' | 'id'>) => Shipment;
    updateShipment: (systemId: SystemId, updates: Partial<Shipment>) => void;
    deleteShipment: (systemId: SystemId) => void;
    
    // Counters
    getNextSystemId: () => SystemId;
    getNextBusinessId: () => BusinessId;
}

export type { Shipment };
