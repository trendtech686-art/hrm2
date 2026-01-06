/**
 * Cost Adjustments Store - Helpers
 * Utility functions and ID generation
 * 
 * @module features/cost-adjustments/store/helpers
 */

import { asSystemId, type SystemId } from '../../../lib/id-types';

const PREFIX = 'DCGV'; // Điều chỉnh giá vốn

/**
 * Generate system ID from counter
 */
export const generateSystemIdFromCounter = (counter: number): SystemId => {
  return asSystemId(`COST_ADJ${String(counter + 1).padStart(6, '0')}`);
};

/**
 * Generate next business ID based on existing data
 */
export const generateNextBusinessId = (existingData: { id: string }[]): string => {
  let maxNum = 0;
  existingData.forEach(item => {
    const match = item.id.match(/^DCGV(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });
  return `${PREFIX}${String(maxNum + 1).padStart(6, '0')}`;
};

/**
 * Check if business ID exists in data
 */
export const isBusinessIdExists = (data: { id: string }[], businessId: string): boolean => {
  return data.some(item => item.id === businessId);
};

/**
 * Calculate adjustment amount and percent
 */
export const calculateAdjustment = (oldCostPrice: number, newCostPrice: number) => {
  const adjustmentAmount = newCostPrice - oldCostPrice;
  const adjustmentPercent = oldCostPrice > 0 
    ? ((newCostPrice - oldCostPrice) / oldCostPrice) * 100 
    : 0;
  
  return { adjustmentAmount, adjustmentPercent };
};
