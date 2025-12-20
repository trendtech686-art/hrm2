/**
 * Inventory Handlers Hook
 * Handles inventory adjustment through inventory check creation
 */

import * as React from 'react';
import { toast } from 'sonner';
import { Complaint, ComplaintAction } from '../types';
import { asSystemId, asBusinessId, type SystemId } from '@/lib/id-types';
import type { Order } from '../../orders/types';
import type { Employee } from '../../employees/types';

interface UseInventoryHandlersProps {
  complaint: Complaint | null;
  currentUser: { systemId: SystemId; name: string };
  updateComplaint: (systemId: SystemId, updates: Partial<Complaint>) => void;
  relatedOrder: Order | null | undefined;
  employee: Employee | null | undefined;
}

export function useInventoryHandlers({
  complaint,
  currentUser,
  updateComplaint,
  relatedOrder,
  employee,
}: UseInventoryHandlersProps) {
  
  // ==========================================
  // PROCESS INVENTORY BUTTON
  // ==========================================
  const handleProcessInventory = React.useCallback(() => {
    if (!complaint) return false;
    
    if (complaint.verification !== "verified-correct") {
      toast.error("Vui lòng xác nhận khiếu nại đúng trước khi xử lý tồn kho");
      return false;
    }
    
    return true; // Allow opening dialog
  }, [complaint]);

  // ==========================================
  // INVENTORY ADJUSTMENT SUBMISSION
  // ==========================================
  const handleInventoryAdjustment = React.useCallback(async (
    inventoryAdjustments: Record<SystemId, number>,
    reason: string
  ) => {
    if (!complaint) return;

    try {
      // Get branch from linked order or use default branch
      let branchSystemId = relatedOrder?.branchSystemId;
      
      // Fallback to employee's branch or default
      if (!branchSystemId) {
        branchSystemId = employee?.branchSystemId || asSystemId('BRANCH000001');
        console.warn('Order không có branch, dùng fallback:', branchSystemId);
      }

      // LAZY LOAD: Import InventoryCheckStore instead of ProductStore
      const { useInventoryCheckStore } = await import('../../inventory-checks/store');
      const { useProductStore } = await import('../../products/store');
      const addInventoryCheck = useInventoryCheckStore.getState().add;
      const products = useProductStore.getState().data;
      
      // Build inventory check items
      const inventoryCheckItems: any[] = [];
      
      const adjustmentEntries = Object.entries(inventoryAdjustments) as Array<[SystemId, number]>;

      for (const [productSystemId, quantityAdjusted] of adjustmentEntries) {
        if (quantityAdjusted === 0) continue;
        
        const affectedProduct = complaint.affectedProducts?.find(p => p.productSystemId === productSystemId);
        if (!affectedProduct) continue;
        
        // Get current product to find system quantity
        const product = products.find(p => p.systemId === productSystemId);
        const branchInventory = (product as any)?.inventory?.find((inv: any) => inv.branchSystemId === branchSystemId);
        const systemQuantity = branchInventory?.quantity || 0;
        const actualQuantity = systemQuantity + quantityAdjusted;
        
        inventoryCheckItems.push({
          productSystemId,
          productId: affectedProduct.productId,
          productName: affectedProduct.productName,
          unit: product?.unit || 'Cái',
          systemQuantity,
          actualQuantity,
          difference: quantityAdjusted,
          reason: quantityAdjusted < 0 ? 'damaged' : 'return',
          note: reason,
        });
      }
      
      // Create inventory check record (draft status)
      const inventoryCheck = addInventoryCheck({
        id: asBusinessId(''), // Empty = auto-generate PKK business ID
        branchSystemId,
        branchName: relatedOrder?.branchName || 'Chi nhánh',
        status: 'draft',
        createdBy: currentUser.systemId,
        createdAt: new Date().toISOString(),
        note: `Kiểm kê từ khiếu nại ${complaint.id}: ${reason}`,
        items: inventoryCheckItems,
      });
      
      // ⚠️ IMPORTANT: Tìm action verified-correct CUỐI CÙNG trong timeline và update metadata
      const updatedTimeline = [...complaint.timeline];
      const lastVerifiedCorrectIndex = updatedTimeline
        .map((a, i) => ({ action: a, index: i }))
        .reverse()
        .find(({ action }) => action.actionType === 'verified-correct')?.index;
      
      if (lastVerifiedCorrectIndex !== undefined) {
        updatedTimeline[lastVerifiedCorrectIndex] = {
          ...updatedTimeline[lastVerifiedCorrectIndex],
          metadata: {
            ...updatedTimeline[lastVerifiedCorrectIndex].metadata,
            inventoryCheckSystemId: inventoryCheck.systemId,
          },
        };
      }
      
      // Thêm action mới cho "Xử lý tồn kho"
      const adjustmentDetails = inventoryCheckItems.map(item => 
        `${item.productName}: ${item.difference > 0 ? '+' : ''}${item.difference} ${item.unit}`
      ).join(', ');
      
      const inventoryAction: ComplaintAction = {
        id: asSystemId(`action_${Date.now()}`),
        actionType: "commented" as const,
        performedBy: currentUser.systemId,
        performedAt: new Date(),
        note: `Xử lý tồn kho: ${reason}\nPhiếu kiểm kê: ${inventoryCheck.id}\nĐiều chỉnh: ${adjustmentDetails}`,
      };
      
      updatedTimeline.push(inventoryAction);
      
      // Update complaint - CHỈ CẬP NHẬT timeline, KHÔNG CẬP NHẬT inventoryAdjustment chung
      updateComplaint(complaint.systemId, {
        timeline: updatedTimeline,
      } as any);
      
      toast.success(`Đã tạo phiếu kiểm kê ${inventoryCheck.id}`);
      
      // Don't navigate - keep user on complaint page
      // User can click the link in compensation section to view inventory check
    } catch (error) {
      console.error('Inventory adjustment error:', error);
      toast.error("Lỗi khi tạo phiếu kiểm kê: " + (error as Error).message);
    }
  }, [complaint, currentUser, updateComplaint, relatedOrder, employee]);

  return {
    handleProcessInventory,
    handleInventoryAdjustment,
  };
}
