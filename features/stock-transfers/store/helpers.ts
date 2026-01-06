/**
 * Stock Transfers Store - Helpers
 * ID generation utilities
 * 
 * @module features/stock-transfers/store/helpers
 */

import { asSystemId, asBusinessId, type SystemId, type BusinessId } from '../../../lib/id-types';

/**
 * Generate next business ID
 */
export const generateNextId = (currentCounter: number): BusinessId => {
  return asBusinessId(`PCK${String(currentCounter + 1).padStart(6, '0')}`);
};

/**
 * Generate system ID
 */
export const generateSystemId = (currentCounter: number): SystemId => {
  return asSystemId(`TRANSFER${String(currentCounter + 1).padStart(6, '0')}`);
};
