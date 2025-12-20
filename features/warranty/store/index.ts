import { create } from 'zustand';
import { getCurrentDate, toISODateTime } from '../../../lib/date-utils';
import { getWorkflowTemplate } from '../../settings/printer/workflow-templates-page';
import { toast } from 'sonner';
import { asSystemId } from '../../../lib/id-types';
import type { SystemId } from '../../../lib/id-types';
import {
  notifyWarrantyCreated,
} from '../notification-utils';
import { triggerWarrantyDataUpdate } from '../use-realtime-updates';
import type { WarrantyTicket, WarrantyProduct } from '../types';
import type { WarrantyStore } from '../types';

// Import base store và các modules
import {
  baseStore,
  originalAdd,
  originalUpdate,
  originalRemove,
  generatePublicTrackingCode,
  getCurrentUserName,
} from './base-store';

import {
  commitWarrantyStock,
  uncommitWarrantyStock,
} from './stock-management';

import {
  addProduct,
  updateProduct,
  removeProduct,
  recalculateSummary,
  calculateSummary,
  calculateSettlementStatus,
  addHistory,
} from './product-management';

import {
  updateStatus,
} from './status-management';

// Override add() for custom logic
baseStore.setState({
  add: (item: Omit<WarrantyTicket, 'systemId'>) => {
    // Auto ID generation by createCrudStore
    const newTicket = originalAdd(item);
    
    // Copy workflow template subtasks
    const subtasks = getWorkflowTemplate('warranty');
    if (subtasks && subtasks.length > 0) {
      newTicket.subtasks = subtasks;
    }
    
    // Generate public tracking code
    if (!newTicket.publicTrackingCode) {
      newTicket.publicTrackingCode = generatePublicTrackingCode();
    }
    
    // Commit stock for replace products
    commitWarrantyStock(newTicket);
    
    // Add initial history
    if (!newTicket.history || newTicket.history.length === 0) {
      newTicket.history = [{
        systemId: asSystemId(`WH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
        action: 'Tạo phiếu bảo hành',
        actionLabel: 'Tạo phiếu bảo hành',
        performedBy: getCurrentUserName(),
        performedAt: toISODateTime(getCurrentDate()),
      }];
    }
    
    // Update state to include subtasks, history, publicTrackingCode
    baseStore.setState((state) => ({
      data: state.data.map(t => t.systemId === newTicket.systemId ? newTicket : t)
    }));
    
    // Send notification
    notifyWarrantyCreated(newTicket.id);
    
    // Trigger realtime update
    triggerWarrantyDataUpdate();
    
    return newTicket;
  },
  
  update: (systemId: SystemId, updates: any) => {
    const oldTicket = baseStore.getState().data.find(t => t.systemId === systemId);
    if (!oldTicket) return;
    
    // Check if history is explicitly provided
    const hasExplicitHistory = updates.history && updates.history.length > (oldTicket.history?.length || 0);
    
    // Track changes for auto-history
    const changes: string[] = [];
    
    if (!hasExplicitHistory) {
      if (updates.customerName && updates.customerName !== oldTicket.customerName) {
        changes.push(`Tên khách hàng: "${oldTicket.customerName}" → "${updates.customerName}"`);
      }
      if (updates.customerPhone && updates.customerPhone !== oldTicket.customerPhone) {
        changes.push(`Số điện thoại: "${oldTicket.customerPhone}" → "${updates.customerPhone}"`);
      }
      if (updates.trackingCode && updates.trackingCode !== oldTicket.trackingCode) {
        changes.push(`Mã vận đơn: "${oldTicket.trackingCode}" → "${updates.trackingCode}"`);
      }
    }
    
    originalUpdate(systemId, updates);
    
    // Add auto-history
    if (!hasExplicitHistory && changes.length > 0) {
      changes.forEach(change => {
        addHistory(systemId, change, getCurrentUserName());
      });
    }
    
    // Trigger realtime update
    triggerWarrantyDataUpdate();
  },
  
  remove: (systemId: SystemId) => {
    const ticket = baseStore.getState().data.find(t => t.systemId === systemId);
    
    if (ticket) {
      // Add history before deletion
      addHistory(systemId, 'Xóa phiếu bảo hành (chuyển vào thùng rác)', getCurrentUserName());
      
      // Uncommit stock
      uncommitWarrantyStock(ticket);
    }
    
    originalRemove(systemId);
    
    // Trigger realtime update
    triggerWarrantyDataUpdate();
  },
});

export const useWarrantyStore = create<WarrantyStore>()((set, get) => ({
  ...baseStore.getState(),
  
  // Warranty-specific methods
  addProduct,
  updateProduct,
  removeProduct,
  updateStatus,
  addHistory,
  recalculateSummary,
  calculateSummary,
  calculateSettlementStatus,
  
  // Placeholder methods for backward compatibility
  addComment: () => console.warn('addComment: Use generic Comments component instead'),
  updateComment: () => console.warn('updateComment: Use generic Comments component instead'),
  deleteComment: () => console.warn('deleteComment: Use generic Comments component instead'),
  replyComment: () => console.warn('replyComment: Use generic Comments component instead'),
  generateNextSystemId: () => {
    // Generate next systemId using same pattern as createCrudStore
    const maxSystemId = baseStore.getState().data.reduce((max, item) => {
      const match = item.systemId.match(/WARRANTY(\d{6})/);
      return match ? Math.max(max, parseInt(match[1])) : max;
    }, 0);
    return asSystemId(`WARRANTY${String(maxSystemId + 1).padStart(6, '0')}`);
  },
  _migrate: () => console.warn('_migrate: No longer needed with createCrudStore'),
}));

// Subscribe to base store changes
baseStore.subscribe((state) => {
  useWarrantyStore.setState(state as any);
});
