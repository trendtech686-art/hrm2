/**
 * Inventory Handlers Hook
 * Handles inventory adjustment through inventory check creation
 */

import * as React from 'react';
import { toast } from 'sonner';
import { Complaint, ComplaintAction } from '../types';
import { asSystemId, asBusinessId, type SystemId, type BusinessId } from '@/lib/id-types';
import { generateSubEntityId } from '@/lib/id-utils';
import type { Order } from '../../orders/types';
import type { Employee } from '../../employees/types';
import { logError } from '@/lib/logger'

interface UseInventoryHandlersProps {
  complaint: Complaint | null;
  currentUser: { systemId: SystemId; name: string };
  updateComplaint: (systemId: SystemId, updates: Partial<Complaint>) => Promise<void> | void;
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
      }

      // LAZY LOAD: Import Server Actions
      const { createInventoryCheckAction } = await import('@/app/actions/inventory-checks');
      const { getProductAction } = await import('@/app/actions/products');
      
      // Build inventory check items
      type DifferenceReason = 'other' | 'damaged' | 'wear' | 'return' | 'transfer' | 'production';
      const inventoryCheckItems: Array<{
        productSystemId: SystemId;
        productId: BusinessId;
        productName: string;
        unit: string;
        systemQuantity: number;
        actualQuantity: number;
        difference: number;
        reason?: DifferenceReason;
        note?: string;
      }> = [];
      
      const adjustmentEntries = Object.entries(inventoryAdjustments) as Array<[string, number]>;

      for (const [compositeKey, quantityAdjusted] of adjustmentEntries) {
        if (quantityAdjusted === 0) continue;
        
        // Parse composite key: "productSystemId_index" to get index
        const idx = parseInt(compositeKey.split('_').pop() || '0', 10);
        const affectedProduct = complaint.affectedProducts?.[idx];
        if (!affectedProduct) continue;
        
        const productSystemId = asSystemId(affectedProduct.productSystemId);
        
        // Get current product from DB to find system quantity
        const productResult = await getProductAction(productSystemId);
        const product = productResult.success ? productResult.data : null;
        
        // Get inventory for branch from inventoryByBranch JSON field
        const inventoryByBranch = (product?.inventoryByBranch as Record<string, number>) ?? {};
        const systemQuantity = inventoryByBranch[branchSystemId] || 0;
        const actualQuantity = systemQuantity + quantityAdjusted;
        
        inventoryCheckItems.push({
          productSystemId,
          productId: asBusinessId(affectedProduct.productId as string),
          productName: affectedProduct.productName,
          unit: product?.unit || 'Cái',
          systemQuantity,
          actualQuantity,
          difference: quantityAdjusted,
          reason: (quantityAdjusted < 0 ? 'damaged' : 'return') as DifferenceReason,
          note: reason,
        });
      }
      
      // Create inventory check record (draft status) using Server Action
      const createResult = await createInventoryCheckAction({
        branchId: branchSystemId,
        branchSystemId,
        branchName: relatedOrder?.branchName || 'Chi nhánh',
        checkDate: new Date().toISOString(),
        description: `Kiểm kê từ khiếu nại ${complaint.id}: ${reason}`,
        createdBy: currentUser.systemId,
        items: inventoryCheckItems.map(item => ({
          productId: item.productId,
          productSystemId: item.productSystemId,
          productName: item.productName,
          systemQuantity: item.systemQuantity,
          actualQuantity: item.actualQuantity,
          difference: item.difference,
          notes: item.note,
        })),
      });
      
      if (!createResult.success || !createResult.data) {
        toast.error(createResult.error || 'Lỗi tạo phiếu kiểm kê');
        return;
      }
      
      const inventoryCheck = createResult.data;
      
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
        id: asSystemId(generateSubEntityId('ACTION')),
        actionType: "commented" as const,
        performedBy: currentUser.systemId,
        performedAt: new Date(),
        note: `Xử lý tồn kho: ${reason}\nPhiếu kiểm kê: ${inventoryCheck.id}\nĐiều chỉnh: ${adjustmentDetails}`,
      };
      
      updatedTimeline.push(inventoryAction);
      
      // Update complaint - CHỈ CẬP NHẬT timeline, KHÔNG CẬP NHẬT inventoryAdjustment chung
      updateComplaint(complaint.systemId, {
        timeline: updatedTimeline,
      } as Partial<Complaint>);
      
      toast.success(`Đã tạo phiếu kiểm kê ${inventoryCheck.id}`);
      
      // Don't navigate - keep user on complaint page
      // User can click the link in compensation section to view inventory check
    } catch (error) {
      logError('Inventory adjustment error', error);
      toast.error("Lỗi khi tạo phiếu kiểm kê: " + (error as Error).message);
    }
  }, [complaint, currentUser, updateComplaint, relatedOrder, employee]);

  return {
    handleProcessInventory,
    handleInventoryAdjustment,
  };
}
