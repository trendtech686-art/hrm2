/**
 * Tasks Store - Main Entry Point
 * Combines all slices into a single store export
 * 
 * @deprecated Use React Query hooks instead:
 * - `useTasks()` for list
 * - `useTask(id)` for single
 * - `useTaskMutations()` for create/update/delete
 * 
 * Import from: `@/features/tasks/hooks/use-tasks`
 * 
 * This store will be removed in a future version.
 * Current usage kept for backward compatibility only.
 * 
 * @module features/tasks/store/index
 */

import type { Task } from '../types';
import type { SystemId } from '../../../lib/id-types';
import { asSystemId } from '../../../lib/id-types';
import { baseStore } from './base-store';
import { createActivity, getActivityDescription } from './helpers';
import { autoManageTimer, syncTimerWithApi } from './timer-slice';
import { addAssignee, removeAssignee, updateAssigneeRole } from './assignee-slice';
import { approveTask, rejectTask, restoreTimer } from './approval-slice';

// ============================================
// COMBINED STORE HOOK
// ============================================

export const useTaskStore = () => {
    const store = baseStore();
    
    return {
        ...store,
        
        // Override add to log creation activity
        add: (newTask: Omit<Task, 'systemId'>) => {
            // Ensure startDate is always set
            const taskWithDefaults = {
                ...newTask,
                startDate: newTask.startDate || new Date().toISOString().split('T')[0],
            };
            
            const result = store.add(taskWithDefaults);
            if (result) {
                const activity = createActivity(result.systemId, 'created');
                activity.description = getActivityDescription(activity);
                
                // Log assignment if assignee exists
                if (result.assigneeName) {
                    const assignActivity = createActivity(result.systemId, 'assigned', {
                        newValue: result.assigneeName,
                    });
                    assignActivity.description = getActivityDescription(assignActivity);
                    
                    store.update(result.systemId, {
                        ...result,
                        activities: [activity, assignActivity],
                    });
                } else {
                    store.update(result.systemId, {
                        ...result,
                        activities: [activity],
                    });
                }
            }
            return result;
        },
        
        // Override update to include auto timer logic and activity logging
        update: (id: SystemId | string, updates: Partial<Task>) => {
            const task = store.findById(id as SystemId);
            if (!task) {
                return;
            }
            
            const enhancedUpdates = autoManageTimer(task, updates);
            store.update(asSystemId(id), { ...task, ...enhancedUpdates });
            
            // Sync timer with API
            syncTimerWithApi(
                enhancedUpdates.timerRunning,
                enhancedUpdates.timerStartedAt,
                task.systemId
            );
        },
        
        // Get tasks assigned to specific user
        getMyTasks: (userId: SystemId) => {
            return store.data.filter(task => 
                task.assignees?.some(a => a.employeeSystemId === userId) || 
                task.assigneeId === userId // Backward compatibility
            );
        },
        
        // Get tasks created by specific user (assigner)
        getCreatedByMe: (userId: SystemId) => {
            return store.data.filter(task => task.assignerId === userId);
        },
        
        // Assignee operations
        addAssignee,
        removeAssignee,
        updateAssigneeRole,
        
        // Approval operations
        approveTask,
        rejectTask,
        restoreTimer,
    };
};
