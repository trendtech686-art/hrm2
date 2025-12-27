/**
 * Activity History Helper
 * 
 * Helper để tạo các entry lịch sử hoạt động một cách nhất quán
 * Dùng chung cho tất cả các modules trong hệ thống
 * 
 * NOTE: Đã remove import useEmployeeStore để tránh circular dependency
 * và cải thiện compile time
 */

import type { HistoryEntry } from '../components/ActivityHistory';
import { getCurrentUserInfo as getAuthUserInfo } from '../contexts/auth-context';
import type { SystemId } from './id-types';

// Re-export HistoryEntry type for convenience
export type { HistoryEntry } from '../components/ActivityHistory';

/**
 * Lấy thông tin người dùng hiện tại từ auth context
 * NOTE: Avatar lookup từ employee store đã bị remove để tránh circular dependency
 */
export function getCurrentUserInfo(): { systemId: string; name: string; avatar?: string } {
  const authInfo = getAuthUserInfo();
  
  return {
    systemId: authInfo.systemId || 'SYSTEM',
    name: authInfo.name || 'Hệ thống',
    avatar: undefined, // Avatar will be fetched by component if needed
  };
}

/**
 * Lấy thông tin nhân viên từ systemId
 * NOTE: This function now requires employee data to be passed in
 * to avoid circular dependency with employee store
 */
export function getEmployeeInfoFromData(
  employeeSystemId: SystemId | string,
  employees: Array<{ systemId: string; fullName: string; avatarUrl?: string }>
): { systemId: string; name: string; avatar?: string } {
  const employee = employees.find(e => e.systemId === employeeSystemId);
  
  if (employee) {
    return {
      systemId: employee.systemId,
      name: employee.fullName,
      avatar: employee.avatarUrl,
    };
  }
  
  // Fallback to system
  return {
    systemId: String(employeeSystemId) || 'SYSTEM',
    name: 'Hệ thống',
  };
}

/**
 * @deprecated Use getEmployeeInfoFromData instead
 */
export function getEmployeeInfo(employeeSystemId: SystemId | string): { systemId: string; name: string; avatar?: string } {
  // Return minimal info without employee store lookup
  return {
    systemId: String(employeeSystemId) || 'SYSTEM',
    name: 'Hệ thống',
  };
}

/**
 * Tạo một history entry mới
 */
export function createHistoryEntry(
  action: HistoryEntry['action'],
  userOrDescription: { systemId: string; name: string; avatar?: string } | string,
  descriptionOrMetadata?: string | HistoryEntry['metadata'],
  metadata?: HistoryEntry['metadata']
): HistoryEntry {
  const hasUserObject = typeof userOrDescription === 'object' && userOrDescription !== null;
  const user = hasUserObject ? userOrDescription : getCurrentUserInfo();
  const description = (hasUserObject ? descriptionOrMetadata : userOrDescription) as string | undefined;
  const meta = (hasUserObject ? metadata : descriptionOrMetadata) as HistoryEntry['metadata'] | undefined;

  return {
    id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    action,
    timestamp: new Date(),
    user: {
      systemId: user.systemId,
      name: user.name,
      avatar: user.avatar,
    },
    description: description ?? '',
    metadata: meta,
  };
}

/**
 * Tạo history entry cho action "created"
 */
export function createCreatedEntry(
  user: { systemId: string; name: string; avatar?: string },
  description: string
): HistoryEntry {
  return createHistoryEntry('created', user, description);
}

/**
 * Tạo history entry cho action "updated"
 */
export function createUpdatedEntry(
  user: { systemId: string; name: string; avatar?: string },
  description: string
): HistoryEntry {
  return createHistoryEntry('updated', user, description);
}

/**
 * Tạo history entry cho action "status_changed"
 */
export function createStatusChangedEntry(
  user: { systemId: string; name: string; avatar?: string },
  oldStatus: string,
  newStatus: string,
  description: string
): HistoryEntry {
  return createHistoryEntry(
    'status_changed',
    user,
    description,
    { field: 'status', oldValue: oldStatus, newValue: newStatus }
  );
}

/**
 * Tạo history entry cho action "deleted"
 */
export function createDeletedEntry(
  user: { systemId: string; name: string; avatar?: string },
  description: string
): HistoryEntry {
  return createHistoryEntry('deleted', user, description);
}

/**
 * Tạo history entry cho action "assigned"
 */
export function createAssignedEntry(
  user: { systemId: string; name: string; avatar?: string },
  description: string
): HistoryEntry {
  return createHistoryEntry('assigned', user, description);
}

/**
 * Tạo history entry cho action "payment_made"
 */
export function createPaymentEntry(
  user: { systemId: string; name: string; avatar?: string },
  description: string
): HistoryEntry {
  return createHistoryEntry('payment_made', user, description);
}

/**
 * Tạo history entry cho action "comment_added"
 */
export function createCommentEntry(
  user: { systemId: string; name: string; avatar?: string },
  description: string
): HistoryEntry {
  return createHistoryEntry('comment_added', user, description);
}

/**
 * Tạo history entry cho action "cancelled"
 */
export function createCancelledEntry(
  user: { systemId: string; name: string; avatar?: string },
  description: string
): HistoryEntry {
  return createHistoryEntry('cancelled', user, description);
}

/**
 * Tạo history entry cho action "verified"
 */
export function createVerifiedEntry(
  user: { systemId: string; name: string; avatar?: string },
  description: string
): HistoryEntry {
  return createHistoryEntry('verified', user, description);
}

/**
 * Tạo history entry cho action "ended"
 */
export function createEndedEntry(
  user: { systemId: string; name: string; avatar?: string },
  description: string
): HistoryEntry {
  return createHistoryEntry('ended', user, description);
}

/**
 * Tạo history entry cho action "reopened"
 */
export function createReopenedEntry(
  user: { systemId: string; name: string; avatar?: string },
  description: string
): HistoryEntry {
  return createHistoryEntry('reopened', user, description);
}

/**
 * Tạo history entry cho product actions
 */
export function createProductEntry(
  user: { systemId: string; name: string; avatar?: string },
  action: 'product_added' | 'product_updated' | 'product_removed',
  description: string
): HistoryEntry {
  return createHistoryEntry(action, user, description);
}

/**
 * Helper để append history entry vào existing array
 */
export function appendHistoryEntry(
  existingHistory: HistoryEntry[] | undefined,
  ...newEntries: HistoryEntry[]
): HistoryEntry[] {
  return [...(existingHistory || []), ...newEntries];
}

/**
 * Helper để tạo nhiều history entries cùng lúc
 */
export function createBulkUpdateEntries(
  user: { systemId: string; name: string; avatar?: string },
  changes: Array<{ field: string; description: string }>
): HistoryEntry[] {
  return changes.map(change => createHistoryEntry('updated', user, change.description));
}
