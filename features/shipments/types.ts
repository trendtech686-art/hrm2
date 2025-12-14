/**
 * Shipment Types
 * 
 * Shipment là entity riêng biệt, linked với Packaging qua packagingSystemId
 * SystemId format: SHIPMENT000001
 * BusinessId format: VC000001
 */

import type { SystemId, BusinessId } from '../../lib/id-types.ts';
import type { OrderDeliveryStatus, OrderPrintStatus } from '../orders/types.ts';
import type { HistoryEntry } from '@/lib/activity-history-helper';

export type ShipmentReconciliationStatus = 'Chưa đối soát' | 'Đã đối soát';
export type ShipmentPayer = 'Người gửi' | 'Người nhận';

export type Shipment = {
    // ========================================
    // IDs
    // ========================================
    systemId: SystemId;           // SHIPMENT000001
    id: BusinessId;               // VC000001 (Vận Chuyển)
    
    // Links
    packagingSystemId: SystemId;  // PACKAGE000001 - 1:1 relationship
    orderSystemId: SystemId;      // ORDER000001
    orderId: BusinessId;          // DH000001
    
    // ========================================
    // Carrier Info
    // ========================================
    trackingCode?: string;        // Mã vận đơn từ hãng vận chuyển
    carrier?: string;             // Tên hãng vận chuyển (GHN, GHTK, J&T, etc.)
    service?: string;             // Tên dịch vụ (Chuẩn, Nhanh, etc.)
    
    // ========================================
    // Status
    // ========================================
    deliveryStatus?: OrderDeliveryStatus;  // Chờ lấy hàng, Đang giao, Đã giao, etc.
    printStatus: OrderPrintStatus;          // Đã in, Chưa in
    reconciliationStatus?: ShipmentReconciliationStatus;  // Đối soát với hãng
    partnerStatus?: string;                 // Trạng thái từ đối tác vận chuyển
    
    // ========================================
    // Financial
    // ========================================
    shippingFeeToPartner?: number;  // Phí trả cho đối tác vận chuyển
    codAmount?: number;              // Tiền thu hộ COD
    payer?: ShipmentPayer;          // Ai trả phí vận chuyển
    
    // ========================================
    // Dates
    // ========================================
    createdAt: string;              // Ngày tạo vận đơn (ISO)
    dispatchedAt?: string;          // Ngày xuất kho (ISO)
    deliveredAt?: string;           // Ngày giao thành công (ISO)
    cancelledAt?: string;           // Ngày hủy (ISO)
    
    // ========================================
    // Physical Properties
    // ========================================
    weight?: number;                // Khối lượng (grams)
    dimensions?: string;            // Kích thước "DxRxC cm"
    noteToShipper?: string;         // Ghi chú cho shipper
    
    // ========================================
    // GHTK Specific (optional)
    // ========================================
    ghtkStatusId?: number;
    ghtkReasonCode?: string;
    ghtkReasonText?: string;
    ghtkTrackingId?: string;
    estimatedPickTime?: string;
    estimatedDeliverTime?: string;
    lastSyncedAt?: string;
    actualWeight?: number;
    actualFee?: number;
    activityHistory?: HistoryEntry[];
};

/**
 * ShipmentView - Extended type for list display
 * Includes denormalized fields from Order and Customer
 */
export type ShipmentView = Shipment & {
    // From Order
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerEmail: string;
    branchName: string;
    
    // From Packaging
    packagingDate?: string;         // confirmDate của packaging
    
    // Calculated
    totalProductQuantity: number;
    customerDue: number;            // Số tiền khách còn nợ
    
    // Employee names
    creatorEmployeeName: string;
    dispatchEmployeeName?: string;
    cancelingEmployeeName?: string;
};
