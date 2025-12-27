/**
 * Shipment Store - Entity riêng cho vận đơn
 * 
 * ⚠️ ID Format theo ID-GOVERNANCE.md:
 * - SystemId: SHIPMENT000001
 * - BusinessId: VC000001
 * 
 * Relationship: Shipment 1:1 Packaging (via packagingSystemId)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SystemId, BusinessId } from '../../lib/id-types';
import { asSystemId, asBusinessId } from '../../lib/id-types';
import { generateSystemId, generateBusinessId, getMaxSystemIdCounter, getMaxBusinessIdCounter } from '../../lib/id-utils';
import type { Shipment } from '@/lib/types/prisma-extended';

// ========================================
// CONSTANTS
// ========================================

const SHIPMENT_SYSTEM_ID_PREFIX = 'SHIPMENT';
const SHIPMENT_BUSINESS_ID_PREFIX = 'VC';

// ========================================
// INITIAL SEED DATA
// ========================================

const initialData: Shipment[] = [
    {
        systemId: asSystemId('SHIPMENT000001'),
        id: asBusinessId('VC000001'),
        packagingSystemId: asSystemId('PACKAGE000001'),
        orderSystemId: asSystemId('ORDER000001'),
        orderId: asBusinessId('DH000001'),
        trackingCode: 'GHN000001',
        carrier: 'GHN',
        service: 'Chuẩn',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Đã đối soát',
        shippingFeeToPartner: 25000,
        codAmount: 0,
        payer: 'Người gửi',
        createdAt: '2025-11-01 08:30',
        dispatchedAt: '2025-11-02 08:00',
        deliveredAt: '2025-11-05 15:30',
    },
    {
        systemId: asSystemId('SHIPMENT000002'),
        id: asBusinessId('VC000002'),
        packagingSystemId: asSystemId('PACKAGE000002'),
        orderSystemId: asSystemId('ORDER000002'),
        orderId: asBusinessId('DH000002'),
        trackingCode: 'JT000245',
        carrier: 'J&T Express',
        service: 'Gói chuẩn',
        deliveryStatus: 'Đang giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 30000,
        codAmount: 5000000,
        payer: 'Người nhận',
        createdAt: '2025-11-03 16:00',
        dispatchedAt: '2025-11-04 09:00',
    },
    // Thêm dữ liệu mẫu mới
    {
        systemId: asSystemId('SHIPMENT000003'),
        id: asBusinessId('VC000003'),
        packagingSystemId: asSystemId('PACKAGE000005'),
        orderSystemId: asSystemId('ORDER000005'),
        orderId: asBusinessId('DH000005'),
        trackingCode: 'GHTK123456',
        carrier: 'GHTK',
        service: 'Nhanh',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 35000,
        codAmount: 12500000,
        payer: 'Người nhận',
        createdAt: '2025-11-08 10:00',
        dispatchedAt: '2025-11-08 14:00',
        deliveredAt: '2025-11-10 11:30',
    },
    {
        systemId: asSystemId('SHIPMENT000004'),
        id: asBusinessId('VC000004'),
        packagingSystemId: asSystemId('PACKAGE000006'),
        orderSystemId: asSystemId('ORDER000006'),
        orderId: asBusinessId('DH000006'),
        trackingCode: 'VTP789012',
        carrier: 'Viettel Post',
        service: 'Tiêu chuẩn',
        deliveryStatus: 'Đang giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 28000,
        codAmount: 8900000,
        payer: 'Người nhận',
        createdAt: '2025-11-09 09:15',
        dispatchedAt: '2025-11-09 15:30',
    },
    {
        systemId: asSystemId('SHIPMENT000005'),
        id: asBusinessId('VC000005'),
        packagingSystemId: asSystemId('PACKAGE000007'),
        orderSystemId: asSystemId('ORDER000007'),
        orderId: asBusinessId('DH000007'),
        trackingCode: 'GHN345678',
        carrier: 'GHN',
        service: 'Express',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 45000,
        codAmount: 23800000,
        payer: 'Người nhận',
        createdAt: '2025-11-07 08:00',
        dispatchedAt: '2025-11-07 10:00',
        deliveredAt: '2025-11-08 09:30',
    },
    {
        systemId: asSystemId('SHIPMENT000006'),
        id: asBusinessId('VC000006'),
        packagingSystemId: asSystemId('PACKAGE000008'),
        orderSystemId: asSystemId('ORDER000008'),
        orderId: asBusinessId('DH000008'),
        trackingCode: 'BEST567890',
        carrier: 'Best Express',
        service: 'Tiết kiệm',
        deliveryStatus: 'Chờ lấy hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 22000,
        codAmount: 4500000,
        payer: 'Người nhận',
        createdAt: '2025-11-10 07:30',
    },
    {
        systemId: asSystemId('SHIPMENT000007'),
        id: asBusinessId('VC000007'),
        packagingSystemId: asSystemId('PACKAGE000009'),
        orderSystemId: asSystemId('ORDER000009'),
        orderId: asBusinessId('DH000009'),
        trackingCode: 'NJV901234',
        carrier: 'Ninja Van',
        service: 'Standard',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Đã đối soát',
        shippingFeeToPartner: 32000,
        codAmount: 15600000,
        payer: 'Người gửi',
        createdAt: '2025-11-05 11:00',
        dispatchedAt: '2025-11-05 16:00',
        deliveredAt: '2025-11-07 14:30',
    },
    {
        systemId: asSystemId('SHIPMENT000008'),
        id: asBusinessId('VC000008'),
        packagingSystemId: asSystemId('PACKAGE000010'),
        orderSystemId: asSystemId('ORDER000010'),
        orderId: asBusinessId('DH000010'),
        trackingCode: 'JT567891',
        carrier: 'J&T Express',
        service: 'Siêu tốc',
        deliveryStatus: 'Đang giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 55000,
        codAmount: 31200000,
        payer: 'Người nhận',
        createdAt: '2025-11-10 14:00',
        dispatchedAt: '2025-11-10 16:30',
    },
];

// ========================================
// STORE INTERFACE
// ========================================

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

// ========================================
// HELPER FUNCTIONS
// ========================================

let shipmentSystemIdCounter = 0;
let shipmentBusinessIdCounter = 0;

function initCounters(shipments: Shipment[]) {
    shipmentSystemIdCounter = getMaxSystemIdCounter(shipments, SHIPMENT_SYSTEM_ID_PREFIX);
    shipmentBusinessIdCounter = getMaxBusinessIdCounter(shipments, SHIPMENT_BUSINESS_ID_PREFIX);
}

function getNextShipmentSystemId(): SystemId {
    shipmentSystemIdCounter++;
    return generateSystemId('shipments', shipmentSystemIdCounter) as SystemId;
}

function getNextShipmentBusinessId(): BusinessId {
    shipmentBusinessIdCounter++;
    return generateBusinessId('shipments', shipmentBusinessIdCounter) as BusinessId;
}

// Initialize counters
initCounters(initialData);

// ========================================
// STORE CREATION
// ========================================

export const useShipmentStore = create<ShipmentStoreState>()(
    persist(
        (set, get) => ({
            data: initialData,
            
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
        }),
        {
            name: 'hrm-shipments',
            partialize: (state) => ({ data: state.data }),
            onRehydrateStorage: () => (state) => {
                if (state?.data) {
                    initCounters(state.data);
                    // ✅ MIGRATION: Merge seed data - add new shipments from initialData if not exist
                    const existingIds = new Set(state.data.map(s => s.systemId));
                    const newShipments = initialData.filter(s => !existingIds.has(s.systemId));
                    if (newShipments.length > 0) {
                        useShipmentStore.setState(prev => ({
                            data: [...prev.data, ...newShipments]
                        }));
                        initCounters([...state.data, ...newShipments]);
                    }
                }
            },
        }
    )
);
