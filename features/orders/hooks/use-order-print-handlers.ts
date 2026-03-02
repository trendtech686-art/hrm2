/**
 * Hook chứa các print handlers sử dụng trong OrdersPage
 * Tách từ page.tsx để giảm kích thước file
 */
import React from 'react';
import { toast } from 'sonner';
import type { Order } from '@/lib/types/prisma-extended';
import type { TemplateType } from '@/features/settings/printer/types';
import type { PrintOptions } from '@/lib/use-print';
import { usePrint } from '@/lib/use-print';
import { useBranchFinder } from '@/features/settings/branches/hooks/use-all-branches';
import { useCustomerFinder } from '@/features/customers/hooks/use-all-customers';
import { 
  convertOrderForPrint,
  convertPackagingToDeliveryForPrint,
  convertToShippingLabelForPrint,
  convertToPackingForPrint,
  mapOrderToPrintData,
  mapOrderLineItems,
  mapDeliveryToPrintData,
  mapDeliveryLineItems,
  mapShippingLabelToPrintData,
  mapPackingToPrintData,
  mapPackingLineItems,
  createStoreSettings,
} from '@/lib/print/order-print-helper';
import type { PrintOptionsResult, OrderPrintTemplateType } from '@/components/shared/print-options-dialog';

export function useOrderPrintHandlers() {
  const { print } = usePrint();
  const { findById: findCustomerById } = useCustomerFinder();
  const { findById: findBranchById } = useBranchFinder();

  const handlePrintOrder = React.useCallback((order: Order) => {
    const customer = findCustomerById(order.customerSystemId);
    const branch = findBranchById(order.branchSystemId);
    const storeSettings = createStoreSettings(branch);
    const orderData = convertOrderForPrint(order, { customer });
    
    print('order', {
      data: mapOrderToPrintData(orderData, storeSettings),
      lineItems: mapOrderLineItems(orderData.items),
      entityType: 'order',
      entityId: order.systemId,
    });
    toast.success(`Đang in đơn hàng ${order.id}`);
  }, [findCustomerById, findBranchById, print]);

  const handlePrintPacking = React.useCallback((order: Order) => {
    const packaging = order.packagings?.[order.packagings.length - 1];
    if (!packaging) {
      toast.error('Đơn hàng chưa có phiếu đóng gói');
      return;
    }
    
    const customer = findCustomerById(order.customerSystemId);
    const branch = findBranchById(order.branchSystemId);
    const storeSettings = createStoreSettings(branch);
    const packingData = convertToPackingForPrint(order, packaging, { customer });
    
    print('packing', {
      data: mapPackingToPrintData(packingData, storeSettings),
      lineItems: mapPackingLineItems(packingData.items),
      entityType: 'packaging',
      entityId: packaging.systemId,
    });
    toast.success(`Đang in phiếu đóng gói ${packaging.id}`);
  }, [findCustomerById, findBranchById, print]);

  const handlePrintShippingLabel = React.useCallback((order: Order) => {
    const packaging = order.packagings?.find(p => p.status === 'Đã đóng gói');
    if (!packaging) {
      toast.error('Đơn hàng chưa có đóng gói xác nhận');
      return;
    }
    
    const customer = findCustomerById(order.customerSystemId);
    const branch = findBranchById(order.branchSystemId);
    const storeSettings = createStoreSettings(branch);
    const labelData = convertToShippingLabelForPrint(order, packaging, { customer });
    
    print('shipping-label', {
      data: mapShippingLabelToPrintData(labelData, storeSettings),
      entityType: 'packaging',
      entityId: packaging.systemId,
    });
    toast.success(`Đang in nhãn giao hàng ${order.id}`);
  }, [findCustomerById, findBranchById, print]);

  const handlePrintDelivery = React.useCallback((order: Order) => {
    const packaging = order.packagings?.find(p => p.status === 'Đã đóng gói');
    if (!packaging) {
      toast.error('Đơn hàng chưa có đóng gói xác nhận');
      return;
    }
    
    const customer = findCustomerById(order.customerSystemId);
    const branch = findBranchById(order.branchSystemId);
    const storeSettings = createStoreSettings(branch);
    const deliveryData = convertPackagingToDeliveryForPrint(order, packaging, { customer });
    
    print('delivery', {
      data: mapDeliveryToPrintData(deliveryData, storeSettings),
      lineItems: mapDeliveryLineItems(deliveryData.items),
      entityType: 'packaging',
      entityId: packaging.systemId,
    });
    toast.success(`Đang in phiếu giao hàng ${order.id}`);
  }, [findCustomerById, findBranchById, print]);

  const printActions = React.useMemo(() => ({
    onPrintOrder: handlePrintOrder,
    onPrintPacking: handlePrintPacking,
    onPrintShippingLabel: handlePrintShippingLabel,
    onPrintDelivery: handlePrintDelivery,
  }), [handlePrintOrder, handlePrintPacking, handlePrintShippingLabel, handlePrintDelivery]);

  return {
    handlePrintOrder,
    handlePrintPacking,
    handlePrintShippingLabel,
    handlePrintDelivery,
    printActions,
  };
}

export function useOrderBulkPrint() {
  const { printMixedDocuments } = usePrint();
  const { findById: findCustomerById } = useCustomerFinder();
  const { findById: findBranchById } = useBranchFinder();

  const handleBulkPrintConfirm = React.useCallback((
    pendingPrintOrders: Order[],
    options: PrintOptionsResult
  ) => {
    const { branchSystemId, paperSize, printOrder, printDelivery, printPacking, printShippingLabel } = options;
    const ordersToProcess = pendingPrintOrders;
    const printMessages: string[] = [];
    const allDocuments: Array<{ type: TemplateType; options: PrintOptions }> = [];

    // Helper functions
    const createOrderPrintOptions = (order: Order) => {
      const customer = findCustomerById(order.customerSystemId);
      const branch = branchSystemId 
        ? findBranchById(branchSystemId)
        : findBranchById(order.branchSystemId);
      const storeSettings = createStoreSettings(branch);
      const orderData = convertOrderForPrint(order, { customer });
      
      return {
        data: mapOrderToPrintData(orderData, storeSettings),
        lineItems: mapOrderLineItems(orderData.items),
        paperSize,
      };
    };

    const createDeliveryPrintOptions = (order: Order) => {
      const packaging = order.packagings?.find(p => p.status === 'Đã đóng gói') 
        ?? order.packagings?.[order.packagings.length - 1];
      if (!packaging) return null;

      const customer = findCustomerById(order.customerSystemId);
      const branch = branchSystemId 
        ? findBranchById(branchSystemId)
        : findBranchById(order.branchSystemId);
      const storeSettings = createStoreSettings(branch);
      const deliveryData = convertPackagingToDeliveryForPrint(order, packaging, { customer });
      
      return {
        data: mapDeliveryToPrintData(deliveryData, storeSettings),
        lineItems: mapDeliveryLineItems(deliveryData.items),
        paperSize,
      };
    };

    const createPackingPrintOptions = (order: Order) => {
      const packaging = order.packagings?.[order.packagings.length - 1];
      if (!packaging) return null;

      const customer = findCustomerById(order.customerSystemId);
      const branch = branchSystemId 
        ? findBranchById(branchSystemId)
        : findBranchById(order.branchSystemId);
      const storeSettings = createStoreSettings(branch);
      const packingData = convertToPackingForPrint(order, packaging, { customer });
      
      return {
        data: mapPackingToPrintData(packingData, storeSettings),
        lineItems: mapPackingLineItems(packingData.items),
        paperSize,
      };
    };

    const createShippingLabelPrintOptions = (order: Order) => {
      const packaging = order.packagings?.find(p => p.status === 'Đã đóng gói');
      if (!packaging) return null;

      const customer = findCustomerById(order.customerSystemId);
      const branch = branchSystemId 
        ? findBranchById(branchSystemId)
        : findBranchById(order.branchSystemId);
      const storeSettings = createStoreSettings(branch);
      const labelData = convertToShippingLabelForPrint(order, packaging, { customer });
      
      return {
        data: mapShippingLabelToPrintData(labelData, storeSettings),
        paperSize,
      };
    };

    // Collect all documents
    ordersToProcess.forEach(order => {
      if (printOrder) {
        const printOptions = createOrderPrintOptions(order);
        allDocuments.push({ type: 'order', options: printOptions });
      }

      if (printPacking && order.packagings?.length > 0) {
        const printOptions = createPackingPrintOptions(order);
        if (printOptions) {
          allDocuments.push({ type: 'packing', options: printOptions });
        }
      }

      if (printDelivery && order.packagings?.length > 0) {
        const printOptions = createDeliveryPrintOptions(order);
        if (printOptions) {
          allDocuments.push({ type: 'delivery', options: printOptions });
        }
      }

      if (printShippingLabel && order.packagings?.some(p => p.status === 'Đã đóng gói')) {
        const printOptions = createShippingLabelPrintOptions(order);
        if (printOptions) {
          allDocuments.push({ type: 'shipping-label', options: printOptions });
        }
      }
    });

    // Generate statistics message
    if (printOrder) printMessages.push(`${ordersToProcess.length} đơn hàng`);
    const ordersWithPackaging = ordersToProcess.filter(o => o.packagings?.length > 0);
    if (printPacking && ordersWithPackaging.length > 0) printMessages.push(`${ordersWithPackaging.length} phiếu đóng gói`);
    if (printDelivery && ordersWithPackaging.length > 0) printMessages.push(`${ordersWithPackaging.length} phiếu giao hàng`);
    const ordersWithConfirmedPackaging = ordersToProcess.filter(o => o.packagings?.some(p => p.status === 'Đã đóng gói'));
    if (printShippingLabel && ordersWithConfirmedPackaging.length > 0) printMessages.push(`${ordersWithConfirmedPackaging.length} nhãn giao hàng`);

    // Print all at once
    if (allDocuments.length > 0) {
      printMixedDocuments(allDocuments);
      toast.success(`Đang in ${printMessages.join(', ')}`);
    } else {
      toast.error('Không có dữ liệu phù hợp để in');
    }
  }, [findCustomerById, findBranchById, printMixedDocuments]);

  return {
    handleBulkPrintConfirm,
  };
}

export type { OrderPrintTemplateType };
