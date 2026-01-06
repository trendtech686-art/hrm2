/**
 * Tasks Store - Assignee Slice
 * Assignee management operations
 * 
 * @module features/tasks/store/assignee-slice
 */

import type { TaskAssignee, AssigneeRole } from '../types';
import type { SystemId } from '../../../lib/id-types';
import { asSystemId } from '../../../lib/id-types';
import { getCurrentUserInfo } from '../../../contexts/auth-context';
import { createActivity, getActivityDescription } from './helpers';
import { baseStore } from './base-store';

// ============================================
// ASSIGNEE OPERATIONS
// ============================================

/**
 * Add assignee to task
 */
export const addAssignee = (
    taskId: string, 
    employeeId: SystemId, 
    employeeName: string, 
    role: AssigneeRole = 'contributor'
) => {
    const task = baseStore.getState().findById(taskId as SystemId);
    if (!task) return;
    
    const user = getCurrentUserInfo();
    const assignees = task.assignees || [];
    
    // Check if already assigned
    if (assignees.some(a => a.employeeSystemId === employeeId)) {
        return;
    }
    
    const newAssignee: TaskAssignee = {
        systemId: asSystemId(`assignee-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
        employeeSystemId: employeeId,
        employeeName,
        role,
        assignedAt: new Date().toISOString(),
        assignedBy: asSystemId(user.systemId),
    };
    
    const updatedAssignees = [...assignees, newAssignee];
    const activities = [...(task.activities || [])];
    
    const activity = createActivity(taskId, 'assignee_added', {
        newValue: `${employeeName} (${role})`,
    });
    activity.description = getActivityDescription(activity);
    activities.push(activity);
    
    // Update backward compatibility fields
    const owner = updatedAssignees.find(a => a.role === 'owner') || updatedAssignees[0];
    
    baseStore.getState().update(taskId as SystemId, {
        ...task,
        assignees: updatedAssignees,
        assigneeId: (owner?.employeeSystemId ?? asSystemId('')),
        assigneeName: owner?.employeeName || '',
        activities,
    });
};

/**
 * Remove assignee from task
 */
export const removeAssignee = (taskId: string, employeeId: SystemId) => {
    const task = baseStore.getState().findById(taskId as SystemId);
    if (!task) return;
    
    const assignees = task.assignees || [];
    const removedAssignee = assignees.find(a => a.employeeSystemId === employeeId);
    
    if (!removedAssignee) return;
    
    const updatedAssignees = assignees.filter(a => a.employeeSystemId !== employeeId);
    const activities = [...(task.activities || [])];
    
    const activity = createActivity(taskId, 'assignee_removed', {
        newValue: removedAssignee.employeeName,
    });
    activity.description = getActivityDescription(activity);
    activities.push(activity);
    
    // Update backward compatibility fields
    const owner = updatedAssignees.find(a => a.role === 'owner') || updatedAssignees[0];
    
    baseStore.getState().update(taskId as SystemId, {
        ...task,
        assignees: updatedAssignees,
        assigneeId: owner?.employeeSystemId || asSystemId(''),
        assigneeName: owner?.employeeName || '',
        activities,
    });
};

/**
 * Update assignee role
 */
export const updateAssigneeRole = (taskId: string, employeeId: SystemId, newRole: AssigneeRole) => {
    const task = baseStore.getState().findById(taskId as SystemId);
    if (!task) return;
    
    const assignees = task.assignees || [];
    const assigneeIndex = assignees.findIndex(a => a.employeeSystemId === employeeId);
    
    if (assigneeIndex === -1) return;
    
    const updatedAssignees = [...assignees];
    updatedAssignees[assigneeIndex] = {
        ...updatedAssignees[assigneeIndex],
        role: newRole,
    };
    
    // Update backward compatibility fields if owner changed
    const owner = updatedAssignees.find(a => a.role === 'owner') || updatedAssignees[0];
    
    baseStore.getState().update(taskId as SystemId, {
        ...task,
        assignees: updatedAssignees,
        assigneeId: owner?.employeeSystemId || asSystemId(''),
        assigneeName: owner?.employeeName || '',
    });
};
