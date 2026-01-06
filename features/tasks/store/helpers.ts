/**
 * Tasks Store - Helpers
 * Utility functions for task operations
 * 
 * @module features/tasks/store/helpers
 */

import type { TaskActivity } from '../types';
import { getCurrentUserInfo } from '../../../contexts/auth-context';

// ============================================
// ACTIVITY HELPERS
// ============================================

/**
 * Create activity log entry
 */
export const createActivity = (
    taskId: string,
    action: TaskActivity['action'],
    details?: Partial<TaskActivity>
): TaskActivity => {
    const user = getCurrentUserInfo();
    return {
        id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        taskId,
        userId: user.systemId,
        userName: user.name,
        action,
        timestamp: new Date().toISOString(),
        ...details,
    };
};

/**
 * Generate human-readable description for activity
 */
export const getActivityDescription = (activity: TaskActivity): string => {
    const { action, userName, oldValue, newValue, fieldName } = activity;
    
    switch (action) {
        case 'created':
            return `${userName} đã tạo công việc`;
        case 'assigned':
            return `${userName} đã giao việc cho ${newValue}`;
        case 'assignee_added':
            return `${userName} đã thêm ${newValue} vào công việc`;
        case 'assignee_removed':
            return `${userName} đã xóa ${newValue} khỏi công việc`;
        case 'status_changed':
            return `${userName} đã thay đổi trạng thái từ "${oldValue}" sang "${newValue}"`;
        case 'priority_changed':
            return `${userName} đã thay đổi độ ưu tiên từ "${oldValue}" sang "${newValue}"`;
        case 'progress_updated':
            return `${userName} đã cập nhật tiến độ: ${newValue}%`;
        case 'timer_started':
            return `${userName} đã bắt đầu đếm giờ`;
        case 'timer_stopped':
            return `${userName} đã dừng đếm giờ (${newValue})`;
        case 'subtask_completed':
            return `${userName} đã hoàn thành: "${newValue}"`;
        case 'subtask_uncompleted':
            return `${userName} đã bỏ hoàn thành: "${newValue}"`;
        case 'completed':
            return `${userName} đã hoàn thành công việc`;
        case 'commented':
            return `${userName} đã thêm bình luận`;
        case 'evidence_submitted':
            return `${userName} đã gửi bằng chứng hoàn thành`;
        case 'evidence_approved':
            return `${userName} đã phê duyệt công việc`;
        case 'evidence_rejected':
            return `${userName} đã yêu cầu làm lại`;
        case 'updated':
            return fieldName 
                ? `${userName} đã cập nhật ${fieldName}`
                : `${userName} đã cập nhật công việc`;
        default:
            return `${userName} đã thực hiện hành động`;
    }
};
