/**
 * Tasks Store - Timer Slice
 * Auto timer management and tracking
 * 
 * @module features/tasks/store/timer-slice
 */

import type { Task, TaskActivity } from '../types';
import { createActivity, getActivityDescription } from './helpers';

// ============================================
// TIMER MANAGEMENT
// ============================================

/**
 * Auto manage timer based on task state changes
 */
export const autoManageTimer = (task: Task, updates: Partial<Task>): Partial<Task> => {
    const newStatus = updates.status || task.status;
    const newSubtasks = updates.subtasks || task.subtasks || [];
    const activities: TaskActivity[] = [...(task.activities || [])];
    
    // Check if all subtasks completed
    const allSubtasksCompleted = newSubtasks.length > 0 && 
        newSubtasks.every(s => s.completed);
    
    // Track status change
    if (updates.status && updates.status !== task.status) {
        const activity = createActivity(task.systemId, 'status_changed', {
            oldValue: task.status,
            newValue: updates.status,
        });
        activity.description = getActivityDescription(activity);
        activities.push(activity);
    }
    
    // Track priority change
    if (updates.priority && updates.priority !== task.priority) {
        const activity = createActivity(task.systemId, 'priority_changed', {
            oldValue: task.priority,
            newValue: updates.priority,
        });
        activity.description = getActivityDescription(activity);
        activities.push(activity);
    }
    
    // Track subtask completion
    if (updates.subtasks) {
        const oldSubtasks = task.subtasks || [];
        updates.subtasks.forEach((newSub, idx) => {
            const oldSub = oldSubtasks[idx];
            if (oldSub && newSub.completed !== oldSub.completed) {
                const activity = createActivity(
                    task.systemId, 
                    newSub.completed ? 'subtask_completed' : 'subtask_uncompleted',
                    { newValue: newSub.title }
                );
                activity.description = getActivityDescription(activity);
                activities.push(activity);
            }
        });
    }
    
    // Auto start timer: status = "Đang thực hiện" và chưa có timer
    if (newStatus === 'Đang thực hiện' && !task.timerRunning) {
        const activity = createActivity(task.systemId, 'timer_started');
        activity.description = getActivityDescription(activity);
        activities.push(activity);
        
        return {
            ...updates,
            timerRunning: true,
            timerStartedAt: new Date().toISOString(),
            activities,
        };
    }
    
    // Auto stop timer: Hoàn thành hết subtasks hoặc status = "Hoàn thành"
    if (task.timerRunning && (allSubtasksCompleted || newStatus === 'Hoàn thành')) {
        const elapsed = task.timerStartedAt 
            ? Math.floor((Date.now() - new Date(task.timerStartedAt).getTime()) / 1000)
            : 0;
        
        const newTotalSeconds = (task.totalTrackedSeconds || 0) + elapsed;
        const actualHours = (newTotalSeconds / 3600).toFixed(1);
        
        const timerActivity = createActivity(task.systemId, 'timer_stopped', {
            newValue: `${actualHours}h`,
        });
        timerActivity.description = getActivityDescription(timerActivity);
        activities.push(timerActivity);
        
        // Log completion if all subtasks done
        if (allSubtasksCompleted) {
            const completedActivity = createActivity(task.systemId, 'completed');
            completedActivity.description = getActivityDescription(completedActivity);
            activities.push(completedActivity);
        }
        
        return {
            ...updates,
            timerRunning: false,
            timerStartedAt: undefined,
            totalTrackedSeconds: newTotalSeconds,
            actualHours: newTotalSeconds / 3600,
            status: allSubtasksCompleted ? 'Hoàn thành' : newStatus,
            progress: allSubtasksCompleted ? 100 : (updates.progress || task.progress),
            completedDate: allSubtasksCompleted ? new Date().toISOString().split('T')[0] : task.completedDate,
            activities,
        };
    }
    
    return { ...updates, activities };
};

/**
 * Sync timer state with API
 */
export const syncTimerWithApi = async (
    timerRunning: boolean | undefined,
    timerStartedAt: string | undefined,
    taskId: string
) => {
    if (timerRunning && timerStartedAt) {
        // Start timer via API
        try {
            await fetch('/api/active-timer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    taskId,
                    startTime: timerStartedAt,
                }),
            });
        } catch (error) {
            console.error('Error starting timer via API:', error);
        }
    } else if (timerRunning === false) {
        // Stop timer via API (delete)
        try {
            await fetch('/api/active-timer', { method: 'DELETE' });
        } catch (error) {
            console.error('Error stopping timer via API:', error);
        }
    }
};
