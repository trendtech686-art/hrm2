/**
 * Cost Adjustments Store - CRUD Slice
 * Create, Read operations
 * 
 * @module features/cost-adjustments/store/crud-slice
 */

import type { BusinessId, SystemId } from '../../../lib/id-types';
import type { CostAdjustment, CostAdjustmentItem, CostAdjustmentType, CostAdjustmentStatus } from './types';
import { generateSystemIdFromCounter, generateNextBusinessId, calculateAdjustment } from './helpers';

// ============================================
// CREATE OPERATION
// ============================================

export interface CreateOptions {
  customId?: string;
  note?: string;
  reason?: string;
  referenceCode?: string;
  status?: CostAdjustmentStatus;
}

/**
 * Create new cost adjustment
 */
export const createCostAdjustment = (
  items: Omit<CostAdjustmentItem, 'adjustmentAmount' | 'adjustmentPercent'>[],
  type: CostAdjustmentType,
  createdBySystemId: string | SystemId,
  createdByName: string,
  currentCounter: number,
  existingData: CostAdjustment[],
  options?: CreateOptions
): { adjustment: CostAdjustment; newCounter: number } => {
  const systemId = generateSystemIdFromCounter(currentCounter);
  const businessId = options?.customId || generateNextBusinessId(existingData);
  
  // Calculate adjustment amounts for each item
  const processedItems: CostAdjustmentItem[] = items.map(item => {
    const { adjustmentAmount, adjustmentPercent } = calculateAdjustment(
      item.oldCostPrice, 
      item.newCostPrice
    );
    return {
      ...item,
      adjustmentAmount,
      adjustmentPercent,
    };
  });

  // Build optional fields
  const optionalFields: Partial<CostAdjustment> = {};
  if (options?.note !== undefined) {
    optionalFields.note = options.note;
  }
  if (options?.reason !== undefined) {
    optionalFields.reason = options.reason;
  }
  if (options?.referenceCode !== undefined) {
    optionalFields.referenceCode = options.referenceCode;
  }
  
  const newAdjustment: CostAdjustment = {
    systemId,
    id: businessId as BusinessId,
    type,
    status: options?.status || 'draft',
    items: processedItems,
    createdDate: new Date().toISOString(),
    createdBySystemId,
    createdByName,
    // Audit fields
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: createdBySystemId,
    updatedBy: createdBySystemId,
    ...optionalFields,
  };
  
  return {
    adjustment: newAdjustment,
    newCounter: currentCounter + 1,
  };
};

// ============================================
// READ OPERATIONS
// ============================================

/**
 * Find adjustment by system ID
 */
export const getById = (
  data: CostAdjustment[], 
  systemId: string | SystemId
): CostAdjustment | undefined => {
  return data.find(item => item.systemId === systemId);
};

/**
 * Find adjustment by business ID
 */
export const getByBusinessId = (
  data: CostAdjustment[], 
  businessId: string
): CostAdjustment | undefined => {
  return data.find(item => item.id === businessId);
};

/**
 * Get all non-cancelled adjustments
 */
export const getAll = (data: CostAdjustment[]): CostAdjustment[] => {
  return data.filter(item => item.status !== 'cancelled');
};

/**
 * Get adjustments by status
 */
export const getByStatus = (
  data: CostAdjustment[], 
  status: CostAdjustmentStatus
): CostAdjustment[] => {
  return data.filter(item => item.status === status);
};
