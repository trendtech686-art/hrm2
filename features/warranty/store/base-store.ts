import { getCurrentDate, toISODateTime } from '../../../lib/date-utils';
import { createCrudStore } from '../../../lib/store-factory';
import type { WarrantyTicket } from '../types';
import { warrantyInitialData } from '../initial-data';
import { getCurrentUserInfo, getCurrentUserSystemId } from '../../../contexts/auth-context';

// Utility: Get Current User Info
export function getCurrentUserName(): string {
  return getCurrentUserInfo().name;
}

// Utility: Generate Public Tracking Code
export function generatePublicTrackingCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create Base Store with createCrudStore
export const baseStore = createCrudStore<WarrantyTicket>(warrantyInitialData, 'warranty', {
  businessIdField: 'id',
  persistKey: 'hrm-warranty-tickets',
  getCurrentUser: getCurrentUserSystemId,
});

// Export original CRUD methods for overriding
export const originalAdd = baseStore.getState().add;
export const originalUpdate = baseStore.getState().update;
export const originalRemove = baseStore.getState().remove;
