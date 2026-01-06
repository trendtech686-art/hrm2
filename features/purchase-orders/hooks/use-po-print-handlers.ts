/**
 * Hook cho print handlers của PurchaseOrder
 * Tách từ page.tsx để giảm kích thước file
 */
import React from 'react';
import { toast } from 'sonner';
import type { PurchaseOrder } from '@/lib/types/prisma-extended';
import { usePrint } from '@/lib/use-print';
import { useBranchFinder } from '@/features/settings/branches/hooks/use-all-branches';
import { useSupplierFinder } from '@/features/suppliers/hooks/use-all-suppliers';
import { useStoreInfoData } from '@/features/settings/store-info/hooks/use-store-info';
import { 
  convertPurchaseOrderForPrint,
  mapPurchaseOrderToPrintData,
  mapPurchaseOrderLineItems,
  createStoreSettings,
} from '@/lib/print/purchase-order-print-helper';
import type { SimplePrintOptionsResult } from '@/components/shared/simple-print-options-dialog';

export function usePurchaseOrderPrintHandlers() {
  const { print, printMultiple } = usePrint();
  const { findById: findBranchById } = useBranchFinder();
  const { findById: findSupplierById } = useSupplierFinder();
  const { info: storeInfo } = useStoreInfoData();

  const [isPrintDialogOpen, setIsPrintDialogOpen] = React.useState(false);
  const [pendingPrintPOs, setPendingPrintPOs] = React.useState<PurchaseOrder[]>([]);

  const handlePrint = React.useCallback((po: PurchaseOrder) => {
    const branch = findBranchById(po.branchSystemId);
    const supplier = findSupplierById(po.supplierSystemId);
    const storeSettings = branch 
      ? createStoreSettings(branch)
      : createStoreSettings(storeInfo);
    const poData = convertPurchaseOrderForPrint(po, { branch, supplier });
    
    print('purchase-order', {
      data: mapPurchaseOrderToPrintData(poData, storeSettings),
      lineItems: mapPurchaseOrderLineItems(poData.items),
    });
    toast(`Đang in đơn nhập hàng ${po.id}`);
  }, [findBranchById, findSupplierById, storeInfo, print]);

  const openBulkPrintDialog = React.useCallback((selectedPOs: PurchaseOrder[]) => {
    if (selectedPOs.length === 0) {
      toast.error('Chưa chọn đơn hàng', {
        description: 'Vui lòng chọn ít nhất một đơn hàng',
      });
      return;
    }
    setPendingPrintPOs(selectedPOs);
    setIsPrintDialogOpen(true);
  }, []);

  const closePrintDialog = React.useCallback(() => {
    setIsPrintDialogOpen(false);
    setPendingPrintPOs([]);
  }, []);

  const handlePrintConfirm = React.useCallback((options: SimplePrintOptionsResult) => {
    const { branchSystemId, paperSize } = options;
    
    const printOptionsList = pendingPrintPOs.map(po => {
      const branch = branchSystemId 
        ? findBranchById(branchSystemId)
        : findBranchById(po.branchSystemId);
      const supplier = findSupplierById(po.supplierSystemId);
      const storeSettings = branch 
        ? createStoreSettings(branch)
        : createStoreSettings(storeInfo);
      const poData = convertPurchaseOrderForPrint(po, { branch, supplier });
      
      return {
        data: mapPurchaseOrderToPrintData(poData, storeSettings),
        lineItems: mapPurchaseOrderLineItems(poData.items),
        paperSize,
      };
    });
    
    printMultiple('purchase-order', printOptionsList);
    
    toast.success('Đã gửi lệnh in', {
      description: pendingPrintPOs.map(p => p.id).join(', ')
    });
    
    closePrintDialog();
  }, [pendingPrintPOs, findBranchById, findSupplierById, storeInfo, printMultiple, closePrintDialog]);

  return {
    handlePrint,
    isPrintDialogOpen,
    pendingPrintPOs,
    openBulkPrintDialog,
    closePrintDialog,
    handlePrintConfirm,
  };
}
