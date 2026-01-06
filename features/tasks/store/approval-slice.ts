/**
 * Tasks Store - Approval Slice
 * Task approval and rejection operations
 * 
 * @module features/tasks/store/approval-slice
 */

import type { SystemId } from '../../../lib/id-types';
import { getCurrentUserInfo } from '../../../contexts/auth-context';
import { createActivity } from './helpers';
import { baseStore } from './base-store';

// ============================================
// APPROVAL OPERATIONS
// ============================================

/**
 * Approve task completion
 */
export const approveTask = (taskId: string) => {
    const task = baseStore.getState().findById(taskId as SystemId);
    if (!task) return;
    
    const user = getCurrentUserInfo();
    const activity = createActivity(taskId, 'evidence_approved', {
        description: `${user.name} đã phê duyệt công việc`,
    });
    
    const approvalRecord = {
        id: `approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'approved' as const,
        reviewedBy: user.systemId,
        reviewedByName: user.name,
        reviewedAt: new Date().toISOString(),
    };
    
    baseStore.getState().update(taskId as SystemId, {
        ...task,
        status: 'Hoàn thành',
        completedDate: new Date().toISOString(),
        approvalStatus: 'approved',
        rejectionReason: undefined,
        approvalHistory: [...(task.approvalHistory || []), approvalRecord],
        activities: [...(task.activities || []), activity],
    });
};

/**
 * Reject task completion
 */
export const rejectTask = (taskId: string, reason: string) => {
    const task = baseStore.getState().findById(taskId as SystemId);
    if (!task) return;
    
    const user = getCurrentUserInfo();
    const activity = createActivity(taskId, 'evidence_rejected', {
        description: `${user.name} đã yêu cầu làm lại: ${reason}`,
    });
    
    const approvalRecord = {
        id: `approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'rejected' as const,
        reviewedBy: user.systemId,
        reviewedByName: user.name,
        reviewedAt: new Date().toISOString(),
        reason,
    };
    
    baseStore.getState().update(taskId as SystemId, {
        ...task,
        status: 'Đang thực hiện',
        approvalStatus: 'rejected',
        rejectionReason: reason,
        approvalHistory: [...(task.approvalHistory || []), approvalRecord],
        activities: [...(task.activities || []), activity],
    });
};

/**
 * Restore running timer on page load - uses API
 */
export const restoreTimer = async () => {
    try {
        const res = await fetch('/api/active-timer');
        if (!res.ok) return;
        
        const timerData = await res.json();
        if (!timerData || !timerData.taskId) return;
        
        const { taskId, startTime } = timerData;
        const task = baseStore.getState().findById(taskId);
        if (!task) {
            // Timer exists but task not found, delete timer
            fetch('/api/active-timer', { method: 'DELETE' }).catch(() => {});
            return;
        }
        
        baseStore.getState().update(taskId as SystemId, {
            ...task,
            timerRunning: true,
            timerStartedAt: startTime,
            totalTrackedSeconds: (task.totalTrackedSeconds || 0),
        });
    } catch (error) {
        console.error('Error restoring timer from API:', error);
    }
};
