import { getCurrentDate, toISODateTime } from '../../../lib/date-utils.ts';
import { createCrudStore } from '../../../lib/store-factory.ts';
import type { WarrantyTicket } from '../types.ts';
import { warrantyInitialData } from '../initial-data.ts';

// Utility: Get Current User Info
export function getCurrentUserName(): string {
  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      return user.name || 'Admin';
    }
  } catch (e) {
    console.error('Lỗi khi lấy thông tin user hiện tại:', e);
  }
  return 'Admin';
}

export function getCurrentUserSystemId(): string {
  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      return user.systemId || 'EMP000001';
    }
  } catch (e) {
    console.error('Lỗi khi lấy systemId user hiện tại:', e);
  }
  return 'EMP000001';
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
