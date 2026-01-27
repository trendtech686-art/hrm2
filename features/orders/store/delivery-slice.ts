/**
 * Order Store - Delivery Slice
 * Dispatch, complete, fail, and cancel delivery operations
 * 
 * @module features/orders/store/delivery-slice
 */

import { toISODateTime } from '../../../lib/date-utils';
import { toast } from 'sonner';
import type { OrderDeliveryStatus, PackagingStatus, OrderMainStatus, OrderPayment } from '@/lib/types/prisma-extended';
import type { Packaging } from '@/lib/types/prisma-extended';
import type { SystemId } from '../../../lib/id-types';
import { asSystemId } from '../../../lib/id-types';

import { useEmployeeStore } from '../../employees/store';
import { useProductStore } from '../../products/store';
import { isComboProduct } from '../../products/combo-utils';
import { useStockHistoryStore } from '../../stock-history/store';
import { useCustomerStore } from '../../customers/store';
import { useReceiptStore } from '../../receipts/store';
import type { Receipt } from '../../receipts/types';
import { useReceiptTypeStore } from '../../settings/receipt-types/store';
import { useCashbookStore } from '../../cashbook/store';
import { getSalesSettingsSync } from '../../settings/sales/sales-management-service';
import {
    getCurrentUserInfo,
    createHistoryEntry,
    appendHistoryEntry,
} from '../../../lib/activity-history-helper';

import { baseStore } from './base-store';
import {
    processLineItemStock,
    ensureCancellationAllowed,
    getBranchId,
    applyPaymentToOrder,
} from './helpers';

// ============================================
// DELIVERY SLICE
// ============================================

export const deliverySlice = {
    dispatchFromWarehouse: (orderSystemId: SystemId, packagingSystemId: SystemId, employeeId: SystemId) => {
        // Check negative stock out setting
        const { allowNegativeStockOut } = getSalesSettingsSync();
        if (!allowNegativeStockOut) {
            const order = baseStore.getState().data.find(o => o.systemId === orderSystemId);
            if (order) {
                const { findById: findProductById } = useProductStore.getState();
                for (const item of order.lineItems) {
                    const product = findProductById(asSystemId(item.productSystemId));
                    
                    if (product && isComboProduct(product) && product.comboItems) {
                        for (const comboItem of product.comboItems) {
                            const childProduct = findProductById(asSystemId(comboItem.productSystemId));
                            const requiredQty = item.quantity * comboItem.quantity;
                            const currentStock = childProduct?.inventoryByBranch?.[order.branchSystemId] || 0;
                            if (currentStock < requiredQty) {
                                toast.error(`Không thể xuất kho: Sản phẩm "${childProduct?.name}" không đủ tồn kho (Có: ${currentStock}, Cần: ${requiredQty})`);
                                return baseStore.getState();
                            }
                        }
                    } else {
                        const currentStock = product?.inventoryByBranch?.[order.branchSystemId] || 0;
                        if (currentStock < item.quantity) {
                            toast.error(`Không thể xuất kho: Sản phẩm "${item.productName}" không đủ tồn kho (Có: ${currentStock}, Cần: ${item.quantity})`);
                            return baseStore.getState();
                        }
                    }
                }
            }
        }

        baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;

            const { addEntry: addStockHistory } = useStockHistoryStore.getState();
            const employeeData = useEmployeeStore.getState().findById(employeeId as SystemId);
            const now = toISODateTime(new Date());
            
            order.lineItems.forEach(item => {
                const processedItems = processLineItemStock(item, getBranchId(order), 'dispatch', item.quantity);
                
                processedItems.forEach(processedItem => {
                    const product = useProductStore.getState().findById(processedItem.productSystemId);
                    const currentStock = product?.inventoryByBranch?.[getBranchId(order)] || 0;
                    
                    addStockHistory({
                        date: now,
                        productId: processedItem.productSystemId,
                        action: 'Xuất kho (Đơn hàng)',
                        quantityChange: -processedItem.quantity,
                        newStockLevel: currentStock,
                        documentId: order.id,
                        branchSystemId: asSystemId(getBranchId(order)),
                        branch: order.branchName,
                        employeeName: employeeData?.fullName || 'Hệ thống',
                    });
                });
            });
            
            const now2 = toISODateTime(new Date());
            
            const updatedPackagings = order.packagings.map(p => 
                p.systemId === packagingSystemId ? { ...p, deliveryStatus: 'Đang giao hàng' as OrderDeliveryStatus } : p
            );

            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: 'Đang giao hàng' as OrderDeliveryStatus,
                stockOutStatus: 'Xuất kho toàn bộ' as const,
                dispatchedDate: now2,
                dispatchedByEmployeeId: employeeId,
                dispatchedByEmployeeName: employeeData?.fullName,
                status: order.status === 'Đặt hàng' ? 'Đang giao dịch' : order.status,
            };
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
        });
    },

    completeDelivery: (orderSystemId: SystemId, packagingSystemId: SystemId, employeeId: SystemId) => {
        baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;
            
            // Complete delivery (supports combo)
            order.lineItems.forEach(item => {
                processLineItemStock(item, getBranchId(order), 'complete', item.quantity);
            });

            const updatedPackagings = order.packagings.map(p => 
                p.systemId === packagingSystemId ? { ...p, deliveryStatus: 'Đã giao hàng' as OrderDeliveryStatus, deliveredDate: toISODateTime(new Date()) } : p
            );
            
            const isAllDelivered = updatedPackagings.every(p => p.status === 'Hủy đóng gói' || p.deliveryStatus === 'Đã giao hàng');
            let newStatus = order.status;
            let newCompletedDate = order.completedDate;
            
            // When all delivered → create debt (if any) and update stats
            if (isAllDelivered && order.status !== 'Hoàn thành') {
                const totalPaid = (order.payments || []).reduce((sum, p) => sum + p.amount, 0);
                const debtAmount = Math.max(0, order.grandTotal - totalPaid);
                
                if (debtAmount > 0) {
                    const { addDebtTransaction } = useCustomerStore.getState();
                    const dueDate = new Date();
                    dueDate.setDate(dueDate.getDate() + 30);
                    addDebtTransaction(order.customerSystemId, {
                        systemId: asSystemId(`DEBT_${order.systemId}`),
                        orderId: order.id,
                        orderDate: order.orderDate.split('T')[0],
                        amount: debtAmount,
                        dueDate: dueDate.toISOString().split('T')[0],
                        isPaid: false,
                        remainingAmount: debtAmount,
                        notes: 'Công nợ từ đơn hàng đã giao thành công',
                    });
                }
                
                const { incrementOrderStats } = useCustomerStore.getState();
                incrementOrderStats(order.customerSystemId, order.grandTotal);
            }
            
            if (isAllDelivered && order.paymentStatus === 'Thanh toán toàn bộ') {
                newStatus = 'Hoàn thành';
                newCompletedDate = toISODateTime(new Date());
            }

            const employee = useEmployeeStore.getState().findById(employeeId as SystemId);
            const updatedOrder = { 
                ...order, 
                packagings: updatedPackagings, 
                deliveryStatus: 'Đã giao hàng' as OrderDeliveryStatus, 
                status: newStatus, 
                completedDate: newCompletedDate,
                activityHistory: appendHistoryEntry(
                    order.activityHistory,
                    createHistoryEntry(
                        'status_changed',
                        getCurrentUserInfo(),
                        `${employee?.fullName || 'Nhân viên'} đã xác nhận giao hàng thành công${newStatus === 'Hoàn thành' ? '. Đơn hàng hoàn thành' : ''}`
                    )
                ),
            };
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
        });
    },

    failDelivery: (orderSystemId: SystemId, packagingSystemId: SystemId, employeeId: SystemId, reason: string) => {
        baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;
            const { incrementFailedDeliveryStats } = useCustomerStore.getState();
            
            // Return stock from transit (supports combo)
            order.lineItems.forEach(item => {
                processLineItemStock(item, getBranchId(order), 'return', item.quantity);
            });

            // Update customer failed delivery stats
            incrementFailedDeliveryStats(order.customerSystemId);

            const updatedPackagings = order.packagings.map(p => 
                p.systemId === packagingSystemId ? { ...p, deliveryStatus: 'Chờ giao lại' as OrderDeliveryStatus, notes: `Giao thất bại: ${reason}` } : p
            );
            
            const updatedOrder = { ...order, packagings: updatedPackagings, deliveryStatus: 'Chờ giao lại' as OrderDeliveryStatus };
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
        });
    },

    // Cancel delivery - NO stock return (goods lost/shipper keeps)
    cancelDeliveryOnly: (orderSystemId: SystemId, packagingSystemId: SystemId, employeeId: SystemId, reason: string) => {
        const currentOrder = baseStore.getState().data.find(o => o.systemId === orderSystemId);
        if (!ensureCancellationAllowed(currentOrder, 'hủy giao hàng')) {
            return;
        }

        baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;

            const employeeData = useEmployeeStore.getState().findById(employeeId as SystemId);

            const updatedPackagings = order.packagings.map(p => 
                p.systemId === packagingSystemId ? { 
                    ...p, 
                    status: 'Hủy đóng gói' as PackagingStatus,
                    deliveryStatus: 'Đã hủy' as OrderDeliveryStatus,
                    cancelReason: `Hủy giao hàng: ${reason}`, 
                    cancelDate: toISODateTime(new Date()),
                    cancelingEmployeeId: employeeId,
                    cancelingEmployeeName: employeeData?.fullName || 'Hệ thống',
                } : p
            );
            
            const allCancelled = updatedPackagings.every(p => p.deliveryStatus === 'Đã hủy' || p.status === 'Hủy đóng gói');
            const hasAnyActive = updatedPackagings.some(p => p.deliveryStatus && p.deliveryStatus !== 'Đã hủy' && p.status !== 'Hủy đóng gói');
            
            let newOrderStatus = order.status;
            let newDeliveryStatus = order.deliveryStatus;
            
            if (allCancelled) {
                newOrderStatus = 'Đang giao dịch' as OrderMainStatus;
                newDeliveryStatus = 'Chưa giao hàng' as OrderDeliveryStatus;
            } else if (hasAnyActive) {
                const activePackaging = updatedPackagings.find(p => p.deliveryStatus && p.deliveryStatus !== 'Đã hủy');
                if (activePackaging?.deliveryStatus) {
                    newDeliveryStatus = activePackaging.deliveryStatus;
                }
            }
            
            const updatedOrder = { 
                ...order, 
                packagings: updatedPackagings,
                status: newOrderStatus,
                deliveryStatus: newDeliveryStatus
            };
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
        });
    },

    // Cancel delivery and receive goods back - RETURN stock to warehouse
    cancelDelivery: (orderSystemId: SystemId, packagingSystemId: SystemId, employeeId: SystemId, reason: string) => {
        const currentOrder = baseStore.getState().data.find(o => o.systemId === orderSystemId);
        if (!ensureCancellationAllowed(currentOrder, 'hủy giao hàng')) {
            return;
        }

        baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;
            
            // Return stock from transit (supports combo)
            order.lineItems.forEach(item => {
                processLineItemStock(item, getBranchId(order), 'return', item.quantity);
            });

            const employeeData = useEmployeeStore.getState().findById(employeeId as SystemId);

            const updatedPackagings = order.packagings.map(p => 
                p.systemId === packagingSystemId ? { 
                    ...p, 
                    status: 'Hủy đóng gói' as PackagingStatus,
                    deliveryStatus: 'Đã hủy' as OrderDeliveryStatus,
                    cancelReason: `Hủy giao hàng: ${reason}`, 
                    cancelDate: toISODateTime(new Date()),
                    cancelingEmployeeId: employeeId,
                    cancelingEmployeeName: employeeData?.fullName || 'Hệ thống',
                } : p
            );
            
            const allCancelled = updatedPackagings.every(p => p.deliveryStatus === 'Đã hủy' || p.status === 'Hủy đóng gói');
            const hasAnyActive = updatedPackagings.some(p => p.deliveryStatus && p.deliveryStatus !== 'Đã hủy' && p.status !== 'Hủy đóng gói');
            
            let newOrderStatus = order.status;
            let newDeliveryStatus = order.deliveryStatus;
            
            if (allCancelled) {
                newOrderStatus = 'Đang giao dịch' as OrderMainStatus;
                newDeliveryStatus = 'Chưa giao hàng' as OrderDeliveryStatus;
            } else if (hasAnyActive) {
                const activePackaging = updatedPackagings.find(p => p.deliveryStatus && p.deliveryStatus !== 'Đã hủy');
                if (activePackaging?.deliveryStatus) {
                    newDeliveryStatus = activePackaging.deliveryStatus;
                }
            }
            
            const updatedOrder = { 
                ...order, 
                packagings: updatedPackagings,
                status: newOrderStatus,
                deliveryStatus: newDeliveryStatus
            };
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
        });
    },

    confirmCodReconciliation: (shipments: (Packaging & { orderSystemId: SystemId })[], employeeId: SystemId) => {
        const { add: addReceipt } = useReceiptStore.getState();
        const { accounts } = useCashbookStore.getState();
        const { data: receiptTypes } = useReceiptTypeStore.getState();
        const employee = useEmployeeStore.getState().findById(employeeId as SystemId);
        const allOrders = baseStore.getState().data;
    
        const totalByPartnerAndBranch: Record<string, { total: number; ids: string[]; branchSystemId: string; branchName: string; partnerName: string; shipmentSystemIds: string[] }> = {};
    
        shipments.forEach(shipment => {
            const order = allOrders.find(o => o.systemId === shipment.orderSystemId);
            if (!order || !shipment.carrier) return;
    
            const key = `${shipment.carrier}-${getBranchId(order)}`;
            if (!totalByPartnerAndBranch[key]) {
                totalByPartnerAndBranch[key] = { total: 0, ids: [], branchSystemId: getBranchId(order), branchName: order.branchName, partnerName: shipment.carrier, shipmentSystemIds: [] };
            }
            totalByPartnerAndBranch[key].total += shipment.codAmount || 0;
            totalByPartnerAndBranch[key].ids.push(shipment.trackingCode || shipment.id);
            totalByPartnerAndBranch[key].shipmentSystemIds.push(shipment.systemId);
        });
    
        const createdReceipts: (Receipt & { shipmentSystemIds: string[] })[] = [];
    
        Object.values(totalByPartnerAndBranch).forEach(group => {
            const account = accounts.find(acc => acc.type === 'bank' && acc.branchSystemId === group.branchSystemId) || accounts.find(acc => acc.type === 'bank');
            const category = receiptTypes.find(c => c.id === 'DOISOATCOD');
            if (account && category) {
                const newReceiptData = {
                    id: '',
                    date: toISODateTime(new Date()),
                    amount: group.total,
                    payerType: 'Đối tác vận chuyển',
                    payerName: group.partnerName,
                    description: `Đối soát COD cho các vận đơn: ${group.ids.join(', ')}`,
                    paymentMethod: 'Chuyển khoản',
                    accountSystemId: account.systemId,
                    originalDocumentId: group.ids.join(', '),
                    createdBy: employee?.fullName || 'N/A',
                    branchSystemId: group.branchSystemId,
                    branchName: group.branchName,
                    paymentReceiptTypeSystemId: category.systemId,
                    paymentReceiptTypeName: category.name,
                    status: 'completed' as const,
                    createdAt: toISODateTime(new Date()),
                    updatedAt: toISODateTime(new Date()),
                    affectsDebt: false,
                };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- addReceipt accepts partial data
                const newReceipt = addReceipt(newReceiptData as any);
                if (newReceipt) {
                    createdReceipts.push({ ...newReceipt, shipmentSystemIds: group.shipmentSystemIds });
                }
            }
        });
    
        baseStore.setState(state => {
            const updates = new Map<string, { newPayments: OrderPayment[]; reconciledShipmentIds: string[] }>();
    
            shipments.forEach(shipment => {
                const receiptForShipment = createdReceipts.find(v => v.shipmentSystemIds.includes(shipment.systemId));
                if (!receiptForShipment || !shipment.codAmount || shipment.codAmount <= 0) return;
    
                const orderSystemId = shipment.orderSystemId;
                const orderUpdates = updates.get(orderSystemId) || { newPayments: [], reconciledShipmentIds: [] };
    
                const newPayment: OrderPayment = {
                    systemId: receiptForShipment.systemId,
                    id: receiptForShipment.id,
                    date: receiptForShipment.date,
                    method: 'Đối soát COD',
                    amount: shipment.codAmount || 0,
                    createdBy: asSystemId('SYSTEM'),
                    description: `Thanh toán COD cho vận đơn ${shipment.trackingCode || shipment.id}`,
                };
                orderUpdates.newPayments.push(newPayment);
                orderUpdates.reconciledShipmentIds.push(shipment.systemId);
                updates.set(orderSystemId, orderUpdates);
            });
    
            if (updates.size === 0) return state;
    
            const newData = state.data.map(order => {
                if (updates.has(order.systemId)) {
                    const orderUpdates = updates.get(order.systemId)!;
                    let updatedOrder = { ...order };

                    updatedOrder.packagings = updatedOrder.packagings.map(p =>
                        orderUpdates.reconciledShipmentIds.includes(p.systemId)
                            ? { ...p, reconciliationStatus: 'Đã đối soát' as const }
                            : p
                    );

                    for (const payment of orderUpdates.newPayments) {
                        updatedOrder = applyPaymentToOrder(updatedOrder, payment);
                    }
    
                    return updatedOrder;
                }
                return order;
            });
    
            return { data: newData };
        });
    },
};
