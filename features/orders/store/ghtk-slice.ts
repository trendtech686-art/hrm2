/**
 * Order Store - GHTK Slice
 * GHTK (Giao Hàng Tiết Kiệm) integration methods
 * 
 * @module features/orders/store/ghtk-slice
 */

import { toISODateTime } from '../../../lib/date-utils';
import { getApiUrl } from '../../../lib/api-config';
import type { OrderDeliveryStatus, OrderMainStatus, PackagingStatus, OrderDeliveryMethod } from '@/lib/types/prisma-extended';
import type { GHTKWebhookPayload } from '../types';
import type { GHTKCreateOrderParams } from '../../settings/shipping/integrations/ghtk-service';
import type { SystemId } from '../../../lib/id-types';
import { asSystemId } from '../../../lib/id-types';

import { useProductStore } from '../../products/store';
import { isComboProduct } from '../../products/combo-utils';
import { useCustomerStore } from '../../customers/store';
import { useSalesManagementSettingsStore } from '../../settings/sales/sales-management-store';

import { baseStore } from './base-store';
import { getBranchId, getComboStockItems } from './helpers';

// ============================================
// GHTK METHODS
// ============================================

export const ghtkSlice = {
    /**
     * Confirm partner shipment (GHTK API call)
     * Called when user confirms GHTK shipment creation
     */
    confirmPartnerShipment: async (
        orderSystemId: SystemId, 
        packagingSystemId: SystemId,
        _shipmentData: Record<string, unknown>
    ): Promise<{ success: boolean; message: string }> => {
        try {
            const order = baseStore.getState().data.find(o => o.systemId === orderSystemId);
            if (!order) {
                return { success: false, message: 'Không tìm thấy đơn hàng' };
            }

            // Check negative packing setting
            const { allowNegativePacking } = useSalesManagementSettingsStore.getState();
            if (!allowNegativePacking) {
                const { findById: findProductById } = useProductStore.getState();
                for (const item of order.lineItems) {
                    const product = findProductById(asSystemId(item.productSystemId));
                    
                    if (product && isComboProduct(product) && product.comboItems) {
                        for (const comboItem of product.comboItems) {
                            const childProduct = findProductById(asSystemId(comboItem.productSystemId));
                            const requiredQty = item.quantity * comboItem.quantity;
                            const currentStock = childProduct?.inventoryByBranch?.[order.branchSystemId] || 0;
                            if (currentStock < requiredQty) {
                                return { success: false, message: `Không thể tạo vận đơn: Sản phẩm "${childProduct?.name}" không đủ tồn kho` };
                            }
                        }
                    } else {
                        const currentStock = product?.inventoryByBranch?.[order.branchSystemId] || 0;
                        if (currentStock < item.quantity) {
                            return { success: false, message: `Không thể tạo vận đơn: Sản phẩm "${item.productName}" không đủ tồn kho` };
                        }
                    }
                }
            }

            // Get GHTK preview params from window (set by ShippingIntegration)
            const ghtkParams = (window as unknown as Record<string, unknown>).__ghtkPreviewParams as GHTKCreateOrderParams | undefined;
            
            if (!ghtkParams) {
                return { success: false, message: 'Thiếu thông tin vận chuyển. Vui lòng chọn dịch vụ vận chuyển.' };
            }

            // Import GHTK service dynamically
            const { GHTKService } = await import('../../settings/shipping/integrations/ghtk-service');
            const { getGHTKCredentials } = await import('../../../lib/utils/get-shipping-credentials');
            
            const { apiToken, partnerCode } = getGHTKCredentials();
            const ghtkService = new GHTKService(apiToken, partnerCode);

            // Call real GHTK API
            const result = await ghtkService.createOrder(ghtkParams);

            if (!result.success || !result.order) {
                throw new Error(result.message || 'Không thể tạo đơn vận chuyển');
            }

            // Update order with real tracking code from GHTK
            const trackingCode = result.order.label;
            const ghtkTrackingId = result.order.tracking_id;
            const estimatedPickTime = result.order.estimated_pick_time;
            const estimatedDeliverTime = result.order.estimated_deliver_time;

            baseStore.setState(state => {
                const updatedPackagings = order.packagings.map(p => {
                    if (p.systemId === packagingSystemId) {
                        return {
                            ...p,
                            deliveryMethod: 'Dịch vụ giao hàng' as OrderDeliveryMethod,
                            deliveryStatus: 'Chờ lấy hàng' as OrderDeliveryStatus,
                            carrier: 'GHTK',
                            service: result.order?.fee ? `${result.order.fee}đ` : 'Standard',
                            trackingCode: trackingCode,
                            shippingFeeToPartner: parseInt(result.order?.fee || '0') || 0,
                            codAmount: ghtkParams.pickMoney || 0,
                            payer: (ghtkParams.isFreeship === 1 ? 'Người gửi' : 'Người nhận') as 'Người gửi' | 'Người nhận',
                            noteToShipper: ghtkParams.note || '',
                            weight: ghtkParams.totalWeight || 0,
                            dimensions: `${ghtkParams.products?.[0]?.length || 10}×${ghtkParams.products?.[0]?.width || 10}×${ghtkParams.products?.[0]?.height || 10}`,
                            // Store GHTK specific data
                            ghtkTrackingId: String(ghtkTrackingId),
                            estimatedPickTime: estimatedPickTime,
                            estimatedDeliverTime: estimatedDeliverTime,
                        };
                    }
                    return p;
                });
                
                const updatedOrder = { 
                    ...order, 
                    packagings: updatedPackagings, 
                    deliveryStatus: 'Chờ lấy hàng' as OrderDeliveryStatus, 
                    status: 'Đang giao dịch' as OrderMainStatus 
                };
                
                return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
            });

            return { 
                success: true, 
                message: `Tạo vận đơn thành công! Mã vận đơn: ${trackingCode}` 
            };

        } catch (error) {
            console.error('❌ [confirmPartnerShipment] Error:', error);
            
            let errorMessage = 'Vui lòng thử lại';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            return { 
                success: false, 
                message: `Lỗi tạo đơn vận chuyển: ${errorMessage}` 
            };
        }
    },

    /**
     * Process GHTK webhook update
     * Called when GHTK pushes status update or from tracking API
     */
    processGHTKWebhook: (webhookData: GHTKWebhookPayload) => {
        baseStore.setState(state => {
            // Find order by tracking code or partner_id
            const order = state.data.find(o => 
                o.packagings.some(p => 
                    p.trackingCode === webhookData.label_id || 
                    p.systemId === webhookData.partner_id ||
                    o.systemId === webhookData.partner_id
                )
            );
            
            if (!order) {
                return state;
            }
            
            // Import status mapping dynamically
            const { getGHTKStatusInfo, getGHTKReasonText } = require('../../../lib/ghtk-constants');
            
            const statusMapping = getGHTKStatusInfo(webhookData.status_id);
            if (!statusMapping) {
                return state;
            }
            
            // Update packaging with new status
            const updatedPackagings = order.packagings.map(p => {
                if (p.trackingCode !== webhookData.label_id && 
                    p.systemId !== webhookData.partner_id) {
                    return p;
                }
                
                return {
                    ...p,
                    deliveryStatus: statusMapping.deliveryStatus,
                    partnerStatus: statusMapping.statusText,
                    ghtkStatusId: webhookData.status_id,
                    ghtkReasonCode: webhookData.reason_code,
                    ghtkReasonText: webhookData.reason 
                        ? webhookData.reason 
                        : (webhookData.reason_code ? getGHTKReasonText(webhookData.reason_code) : undefined),
                    actualWeight: webhookData.weight,
                    actualFee: webhookData.fee,
                    lastSyncedAt: toISODateTime(new Date()),
                    // Update reconciliation status if status = 6 (Đã đối soát)
                    reconciliationStatus: webhookData.status_id === 6 
                        ? 'Đã đối soát' as const 
                        : p.reconciliationStatus,
                    // Update delivered date if status = 5 or 6
                    deliveredDate: [5, 6].includes(webhookData.status_id) && !p.deliveredDate
                        ? toISODateTime(new Date())
                        : p.deliveredDate,
                };
            });
            
            // Handle stock updates based on status
            if (statusMapping.shouldUpdateStock && statusMapping.stockAction) {
                const { dispatchStock, completeDelivery: productCompleteDelivery, returnStockFromTransit } = useProductStore.getState();
                const { incrementFailedDeliveryStats } = useCustomerStore.getState();
                
                // Expand combo items to child products
                const stockItems = getComboStockItems(order.lineItems);
                
                stockItems.forEach(item => {
                    switch (statusMapping.stockAction) {
                        case 'dispatch':
                            // Status 3: Đã lấy hàng -> Move to transit
                            dispatchStock(item.productSystemId, asSystemId(getBranchId(order)), item.quantity);
                            break;
                        case 'complete':
                            // Status 5: Đã giao hàng -> Complete delivery
                            productCompleteDelivery(item.productSystemId, asSystemId(getBranchId(order)), item.quantity);
                            break;
                        case 'return':
                            // Status -1, 7, 9, 13, 20: Failed/Returned -> Return stock
                            returnStockFromTransit(item.productSystemId, asSystemId(getBranchId(order)), item.quantity);
                            break;
                    }
                });
                
                // Increment failed delivery stats for customer if return
                if (statusMapping.stockAction === 'return') {
                    const failureStatuses = [7, 9, 13, 20, 21];
                    const currentPackaging = order.packagings.find(p => p.trackingCode === webhookData.label_id);
                    const previousStatusId = currentPackaging?.ghtkStatusId;
                    
                    if (failureStatuses.includes(webhookData.status_id) && (!previousStatusId || !failureStatuses.includes(previousStatusId))) {
                        incrementFailedDeliveryStats(order.customerSystemId);
                    }
                }
            }
            
            // Determine order-level delivery status
            const allPackagingsDelivered = updatedPackagings.every(p => 
                p.status === 'Hủy đóng gói' || 
                p.deliveryStatus === 'Đã giao hàng'
            );
            
            let newOrderDeliveryStatus = order.deliveryStatus;
            let newOrderStatus = order.status;
            let newCompletedDate = order.completedDate;
            let newStockOutStatus = order.stockOutStatus;
            
            // Update order delivery status
            if (allPackagingsDelivered) {
                newOrderDeliveryStatus = 'Đã giao hàng';
                
                // Auto-complete order if delivered + paid
                if (order.paymentStatus === 'Thanh toán toàn bộ' && order.status !== 'Hoàn thành') {
                    newOrderStatus = 'Hoàn thành';
                    newCompletedDate = toISODateTime(new Date());
                    
                    // Update customer stats
                    const { incrementOrderStats } = useCustomerStore.getState();
                    incrementOrderStats(order.customerSystemId, order.grandTotal);
                }
            } else if (statusMapping.statusId === 3) {
                // Status 3: Đã lấy hàng
                newOrderDeliveryStatus = 'Đang giao hàng';
                newStockOutStatus = 'Xuất kho toàn bộ';
            } else if ([4, 10].includes(statusMapping.statusId)) {
                // Status 4, 10: Đang giao
                newOrderDeliveryStatus = 'Đang giao hàng';
            }
            
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: newOrderDeliveryStatus,
                status: newOrderStatus,
                completedDate: newCompletedDate,
                stockOutStatus: newStockOutStatus,
            };
            
            return {
                data: state.data.map(o => o.systemId === order.systemId ? updatedOrder : o)
            };
        });
    },

    /**
     * Cancel GHTK shipment
     * ⚠️ Only cancellable when order is in status: 1, 2, 12
     */
    cancelGHTKShipment: async (orderSystemId: SystemId, packagingSystemId: SystemId, trackingCode: string) => {
        try {
            // Get credentials from shipping_partners_config
            const { getGHTKCredentials } = await import('../../../lib/utils/get-shipping-credentials');
            let credentials;
            
            try {
                credentials = getGHTKCredentials();
            } catch (error) {
                return {
                    success: false,
                    message: (error instanceof Error ? error.message : String(error)) || 'Chưa cấu hình GHTK. Vui lòng vào Cài đặt → Đối tác vận chuyển.'
                };
            }
            
            const response = await fetch(getApiUrl('/shipping/ghtk/cancel-order'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trackingCode,
                    apiToken: credentials.apiToken,
                    partnerCode: credentials.partnerCode,
                }),
            });
            
            const data = await response.json();
            
            // Check response from GHTK
            if (!response.ok) {
                throw new Error(data.message || data.error || 'Failed to cancel GHTK shipment');
            }
            
            // GHTK returns success: false when cannot cancel (already picked up)
            if (data.success === false) {
                return { 
                    success: false, 
                    message: data.message || 'Không thể hủy đơn hàng' 
                };
            }
            
            // Only update state when GHTK confirms cancellation
            baseStore.setState(state => {
                const order = state.data.find(o => o.systemId === orderSystemId);
                if (!order) return state;
                
                const updatedPackagings = order.packagings.map(p => {
                    if (p.systemId !== packagingSystemId) return p;
                    
                    return {
                        ...p,
                        status: 'Hủy đóng gói' as PackagingStatus,
                        deliveryStatus: 'Đã hủy' as OrderDeliveryStatus,
                        cancelDate: toISODateTime(new Date()),
                        cancelReason: 'Hủy vận đơn GHTK',
                        ghtkStatusId: -1,
                        partnerStatus: 'Hủy đơn hàng',
                    };
                });
                
                // Do NOT rollback stock - let user decide via "Cancel delivery and receive goods" button
                
                const updatedOrder = {
                    ...order,
                    packagings: updatedPackagings,
                };
                
                return {
                    data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o)
                };
            });
            
            return { 
                success: true, 
                message: data.message || 'Đã hủy vận đơn GHTK thành công' 
            };
            
        } catch (error) {
            console.error('[GHTK] Cancel error:', error);
            return { 
                success: false, 
                message: (error instanceof Error ? error.message : String(error)) || 'Lỗi khi hủy vận đơn GHTK' 
            };
        }
    },
};
