/**
 * Cost Adjustments Store - Action Slice
 * Confirm and Cancel operations
 * 
 * @module features/cost-adjustments/store/action-slice
 */

import type { SystemId } from '../../../lib/id-types';
import { asSystemId } from '../../../lib/id-types';
import type { CostAdjustment, CostAdjustmentStatus } from './types';
import { useProductStore } from '../../products/store';

// ============================================
// CONFIRM OPERATION
// ============================================

/**
 * Confirm cost adjustment and update product cost prices
 * Returns updated data array if successful, null otherwise
 */
export const confirmCostAdjustment = (
  data: CostAdjustment[],
  systemId: string | SystemId,
  confirmedBySystemId: string | SystemId,
  confirmedByName: string
): CostAdjustment[] | null => {
  const adjustment = data.find(item => item.systemId === systemId);
  if (!adjustment || adjustment.status !== 'draft') return null;
  
  // Update product cost prices in product store
  const productStore = useProductStore.getState();
  adjustment.items.forEach(item => {
    const existingProduct = productStore.findById(asSystemId(item.productSystemId));
    if (!existingProduct) return;
    productStore.update(asSystemId(item.productSystemId), {
      ...existingProduct,
      costPrice: item.newCostPrice,
    });
  });
  
  // Return updated data
  return data.map(item => 
    item.systemId === systemId
      ? {
          ...item,
          status: 'confirmed' as CostAdjustmentStatus,
          confirmedDate: new Date().toISOString(),
          confirmedBySystemId,
          confirmedByName,
          updatedAt: new Date().toISOString(),
          updatedBy: confirmedBySystemId,
        }
      : item
  );
};

// ============================================
// CANCEL OPERATION
// ============================================

/**
 * Cancel cost adjustment
 * Returns updated data array if successful, null otherwise
 */
export const cancelCostAdjustment = (
  data: CostAdjustment[],
  systemId: string | SystemId,
  cancelledBySystemId: string | SystemId,
  cancelledByName: string,
  reason?: string
): CostAdjustment[] | null => {
  const adjustment = data.find(item => item.systemId === systemId);
  if (!adjustment || adjustment.status !== 'draft') return null;
  
  return data.map(item => 
    item.systemId === systemId
      ? {
          ...item,
          status: 'cancelled' as CostAdjustmentStatus,
          cancelledDate: new Date().toISOString(),
          cancelledBySystemId,
          cancelledByName,
          cancelReason: reason ?? '',
          updatedAt: new Date().toISOString(),
          updatedBy: cancelledBySystemId,
        }
      : item
  );
};
