import type { OrderDeliveryStatus, OrderDeliveryMethod, OrderPrintStatus } from '../orders/types.ts';

export type Shipment = {
    systemId: string; // packaging systemId
    trackingCode?: string;
    packagingDate?: string;
    recipientName: string;
    recipientPhone: string;
    shippingPartner?: string;
    deliveryStatus?: OrderDeliveryStatus;
    shippingFeeToPartner?: number;
    codAmount?: number;
    reconciliationStatus?: 'Chưa đối soát' | 'Đã đối soát';
    creationDate: string; // requestDate from packaging
    cancellationDate?: string;
    cancellationReason?: string;
    partnerStatus?: string;
    payer?: 'Người gửi' | 'Người nhận';
    packagingId: string;
    orderId: string;
    orderSystemId: string;
    printStatus: OrderPrintStatus;
    dispatchDate?: string;
    totalProductQuantity: number;
    customerDue: number;
    deliveredDate?: string;
    province?: string;
    districtWard?: string;
    recipientAddress?: string;
    recipientEmail: string;
    deliveryMethod?: OrderDeliveryMethod;
    dispatchEmployeeName?: string;
    creatorEmployeeName: string;
    cancelingEmployeeName?: string;
    branchName: string;
    notes?: string;
};
