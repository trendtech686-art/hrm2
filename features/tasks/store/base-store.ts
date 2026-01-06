/**
 * Tasks Store - Base Store Setup
 * Core store configuration using store factory
 * 
 * @module features/tasks/store/base-store
 */

import { createCrudStore } from '../../../lib/store-factory';
import type { Task, TaskAssignee } from '../types';
import { asSystemId } from '../../../lib/id-types';

// ============================================
// DATA MIGRATION
// ============================================

/**
 * Migrate existing tasks to multiple assignees format
 * @deprecated This migration is no longer needed for new data
 */
const _migrateTasksToMultipleAssignees = (tasks: Task[]): Task[] => {
    return tasks.map(task => {
        // Ensure startDate exists for all tasks
        const taskWithStartDate = {
            ...task,
            startDate: task.startDate || task.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        };
        
        // Skip if already has assignees array
        if (taskWithStartDate.assignees && taskWithStartDate.assignees.length > 0) {
            return taskWithStartDate;
        }
        
        // Migrate single assignee to array format
        if (taskWithStartDate.assigneeId && taskWithStartDate.assigneeName) {
            const assignee: TaskAssignee = {
                systemId: asSystemId(`assignee-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
                employeeSystemId: taskWithStartDate.assigneeId,
                employeeName: taskWithStartDate.assigneeName,
                role: 'owner',
                assignedAt: taskWithStartDate.createdAt || new Date().toISOString(),
                assignedBy: taskWithStartDate.assignerId || taskWithStartDate.createdBy || asSystemId('SYSTEM'),
            };
            
            return {
                ...taskWithStartDate,
                assignees: [assignee],
            };
        }
        
        // No assignee
        return {
            ...taskWithStartDate,
            assignees: [],
        };
    });
};

// Initialize store with empty data (seed data removed)
export const baseStore = createCrudStore<Task>([], 'internal-tasks');
