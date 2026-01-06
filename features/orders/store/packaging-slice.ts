/**
 * Order Store - Packaging Slice
 * Packaging request, confirmation, and in-store pickup handling
 * 
 * @module features/orders/store/packaging-slice
 */

import { toISODateTime } from '../../../lib/date-utils';
import { toast } from 'sonner';
import type { Packaging, OrderDeliveryStatus, PackagingStatus, OrderDeliveryMethod } from '@/lib/types/prisma-extended';
import type { Shipment } from '../../shipments/types';
import type { SystemId } from '../../../lib/id-types';
import { asSystemId } from '../../../lib/id-types';

import { useEmployeeStore } from '../../employees/store';
import { useProductStore } from '../../products/store';
import { isComboProduct } from '../../products/combo-utils';
import { useStockHistoryStore } from '../../stock-history/store';
import { useShipmentStore } from '../../shipments/store';
import { useSalesManagementSettingsStore } from '../../settings/sales/sales-management-store';

import { baseStore } from './base-store';
import {
    getNextPackagingSystemId,
    buildPackagingBusinessId,
    getBranchId,
    processLineItemStock,
} from './helpers';

// ============================================
// PACKAGING SLICE
// ============================================

export const packagingSlice = {
    requestPackaging: (orderSystemId: SystemId, employeeId: SystemId, assignedEmployeeId?: SystemId) => {
        baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;
            const employee = useEmployeeStore.getState().findById(employeeId as SystemId);
            const assignedEmployee = assignedEmployeeId ? useEmployeeStore.getState().findById(assignedEmployeeId as SystemId) : null;
            
            const activePackagings = order.packagings.filter(p => p.status !== 'Hủy đóng gói');
            const activeCountAfterInsert = activePackagings.length + 1;
            const newActiveIndex = activePackagings.length;
            
            const newPackaging: Packaging = {
                systemId: getNextPackagingSystemId(),
                id: buildPackagingBusinessId(order.id, newActiveIndex, activeCountAfterInsert),
                requestDate: toISODateTime(new Date()),
                requestingEmployeeId: employeeId,
                requestingEmployeeName: employee?.fullName || 'N/A',
                assignedEmployeeId,
                assignedEmployeeName: assignedEmployee?.fullName,
                status: 'Chờ đóng gói',
                printStatus: 'Chưa in',
            };

            const updatedOrder = { ...order, packagings: [...order.packagings, newPackaging], deliveryStatus: 'Chờ đóng gói' as OrderDeliveryStatus };
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
        });
    },

    confirmPackaging: (orderSystemId: SystemId, packagingSystemId: SystemId, employeeId: SystemId) => {
        // Check negative packing setting
        const { allowNegativePacking } = useSalesManagementSettingsStore.getState();
        if (!allowNegativePacking) {
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
                                toast.error(`Không thể đóng gói: Sản phẩm "${childProduct?.name}" không đủ tồn kho (Có: ${currentStock}, Cần: ${requiredQty})`);
                                return baseStore.getState();
                            }
                        }
                    } else {
                        const currentStock = product?.inventoryByBranch?.[order.branchSystemId] || 0;
                        if (currentStock < item.quantity) {
                            toast.error(`Không thể đóng gói: Sản phẩm "${item.productName}" không đủ tồn kho (Có: ${currentStock}, Cần: ${item.quantity})`);
                            return baseStore.getState();
                        }
                    }
                }
            }
        }

        baseStore.setState(state => {
            const dataCopy = [...state.data];
            const orderIndex = dataCopy.findIndex(o => o.systemId === orderSystemId);
            if (orderIndex === -1) return state;
    
            const orderCopy = { ...dataCopy[orderIndex] };
            const packagingIndex = orderCopy.packagings.findIndex(p => p.systemId === packagingSystemId);
            if (packagingIndex === -1) return state;
            
            const employee = useEmployeeStore.getState().findById(employeeId as SystemId);
    
            const packagingsCopy = [...orderCopy.packagings];
            packagingsCopy[packagingIndex] = {
                ...packagingsCopy[packagingIndex],
                status: 'Đã đóng gói' as PackagingStatus,
                confirmDate: toISODateTime(new Date()),
                confirmingEmployeeId: employeeId,
                confirmingEmployeeName: employee?.fullName || 'N/A',
            };
    
            orderCopy.packagings = packagingsCopy;
            orderCopy.deliveryStatus = 'Đã đóng gói' as OrderDeliveryStatus;
            
            dataCopy[orderIndex] = orderCopy;
    
            return { data: dataCopy };
        });
    },

    cancelPackagingRequest: (orderSystemId: SystemId, packagingSystemId: SystemId, employeeId: SystemId, reason: string) => {
        baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;
            const employee = useEmployeeStore.getState().findById(employeeId as SystemId);

            const updatedPackagings = order.packagings.map(p => {
                if (p.systemId === packagingSystemId) {
                    return {
                        ...p,
                        status: 'Hủy đóng gói' as PackagingStatus,
                        cancelDate: toISODateTime(new Date()),
                        cancelingEmployeeId: employeeId,
                        cancelingEmployeeName: employee?.fullName || 'N/A',
                        cancelReason: reason,
                    };
                }
                return p;
            });
            const isAnyActivePackaging = updatedPackagings.some(p => p.status !== 'Hủy đóng gói');
            const updatedOrder = { ...order, packagings: updatedPackagings, deliveryStatus: isAnyActivePackaging ? order.deliveryStatus : 'Chờ đóng gói' as OrderDeliveryStatus };
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
        });
    },
    
    processInStorePickup: (orderSystemId: SystemId, packagingSystemId: SystemId) => {
        baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;
    
            const totalCount = order.packagings.length;
            const updatedPackagings = order.packagings.map((p, index) => {
                if (p.systemId === packagingSystemId) {
                    const hasId = typeof p.id === 'string' && p.id.trim().length > 0;
                    const resolvedId = hasId ? p.id : buildPackagingBusinessId(order.id, index, totalCount);
                    return {
                        ...p,
                        id: resolvedId,
                        deliveryMethod: 'Nhận tại cửa hàng' as OrderDeliveryMethod,
                        deliveryStatus: 'Đã đóng gói' as OrderDeliveryStatus,
                    };
                }
                return p;
            });
            
            const updatedOrder = { 
                ...order, 
                packagings: updatedPackagings, 
                deliveryStatus: 'Đã đóng gói' as OrderDeliveryStatus 
            };
    
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
        });
    },
    
    confirmInStorePickup: (orderSystemId: SystemId, packagingSystemId: SystemId, employeeId: SystemId) => {
        // Check negative stock out setting
        const { allowNegativeStockOut } = useSalesManagementSettingsStore.getState();
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
            if (!order) {
                console.error('❌ [confirmInStorePickup] Order not found:', orderSystemId);
                return state;
            }
    
            // Stock logic
            const { addEntry: addStockHistory } = useStockHistoryStore.getState();
            const employeeData = useEmployeeStore.getState().findById(employeeId as SystemId);
            const now = toISODateTime(new Date());
    
            order.lineItems.forEach((item) => {
                // Dispatch stock (supports combo - will dispatch child products)
                const processedItems = processLineItemStock(item, getBranchId(order), 'dispatch', item.quantity);
                
                // Add stock history entry for each processed item
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
    
            // Status update logic
            let updatedPackagings = order.packagings.map(p => {
                if (p.systemId === packagingSystemId) {
                    return { 
                        ...p, 
                        deliveryStatus: 'Đã giao hàng' as OrderDeliveryStatus, 
                        deliveredDate: toISODateTime(new Date()) 
                    };
                }
                return p;
            });
    
            const isAllDelivered = updatedPackagings.every(p => p.status === 'Hủy đóng gói' || p.deliveryStatus === 'Đã giao hàng');
            
            let newStatus = order.status === 'Đặt hàng' ? 'Đang giao dịch' : order.status;
            let newCompletedDate = order.completedDate;
            if (isAllDelivered && order.paymentStatus === 'Thanh toán toàn bộ') {
                newStatus = 'Hoàn thành';
                newCompletedDate = toISODateTime(new Date());
            }
    
            const employee = useEmployeeStore.getState().findById(employeeId as SystemId);
            
            // Create shipment record for INSTORE pickup
            const packaging = order.packagings.find(p => p.systemId === packagingSystemId);
            let newShipment: Shipment | null = null;
            if (packaging) {
                const { createShipment, updateShipment } = useShipmentStore.getState();
                newShipment = createShipment({
                    packagingSystemId: packagingSystemId,
                    orderSystemId: orderSystemId,
                    orderId: order.id,
                    trackingCode: '',
                    carrier: 'Nhận tại cửa hàng',
                    service: 'Nhận tại cửa hàng',
                    deliveryStatus: 'Đã giao hàng',
                    printStatus: 'Chưa in',
                    reconciliationStatus: 'Chưa đối soát',
                    shippingFeeToPartner: 0,
                    codAmount: 0,
                    payer: 'Người gửi',
                    createdAt: now,
                    dispatchedAt: now,
                    deliveredAt: now,
                });
                if (newShipment) {
                    updateShipment(newShipment.systemId, {
                        trackingCode: newShipment.id,
                    });
                    updatedPackagings = updatedPackagings.map(p => {
                        if (p.systemId === packagingSystemId) {
                            return { ...p, trackingCode: newShipment!.id };
                        }
                        return p;
                    });
                }
            }
            
            const updatedOrder = { 
                ...order, 
                packagings: updatedPackagings, 
                deliveryStatus: 'Đã giao hàng' as OrderDeliveryStatus,
                status: newStatus,
                completedDate: newCompletedDate,
                stockOutStatus: 'Xuất kho toàn bộ' as const,
                dispatchedDate: toISODateTime(new Date()),
                dispatchedByEmployeeId: employeeId,
                dispatchedByEmployeeName: employee?.fullName,
            };
    
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
        });
    },
};
