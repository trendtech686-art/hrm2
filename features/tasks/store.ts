import { createCrudStore } from '../../lib/store-factory';
import { data as initialData } from './data';
import type { Task, TaskActivity, TaskAssignee, AssigneeRole } from './types';
import { getCurrentUserInfo } from '../../contexts/auth-context';
import { asSystemId, type SystemId } from '../../lib/id-types';

const _baseStore = createCrudStore<Task>(initialData, 'internal-tasks');

// Migrate existing tasks to multiple assignees format
const migrateTasksToMultipleAssignees = (tasks: Task[]): Task[] => {
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

// Run migration on store initialization
const migratedData = migrateTasksToMultipleAssignees(initialData);

// Initialize store with migrated data
const taskStoreInstance = createCrudStore<Task>(migratedData, 'internal-tasks');

// Helper to create activity log
const createActivity = (
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

// Helper to generate human-readable description
const getActivityDescription = (activity: TaskActivity): string => {
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

export const useTaskStore = () => {
  const store = taskStoreInstance();
  
  // Auto timer management helper
  const autoManageTimer = (task: Task, updates: Partial<Task>) => {
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
      console.log('[STORE] Update called with id:', id, 'updates:', updates);
      const task = store.findById(id as SystemId);
      if (!task) {
        console.log('[STORE] Task not found!');
        return;
      }
      
      const enhancedUpdates = autoManageTimer(task, updates);
      console.log('[STORE] Enhanced updates:', enhancedUpdates);
      store.update(asSystemId(id), { ...task, ...enhancedUpdates });
      console.log('[STORE] Base store.update called');
      
      // Manage active timer via API instead of localStorage
      if (enhancedUpdates.timerRunning && enhancedUpdates.timerStartedAt) {
        // Start timer via API
        fetch('/api/active-timer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId: task.systemId,
            startTime: enhancedUpdates.timerStartedAt,
          }),
        }).catch(error => {
          console.error('Error starting timer via API:', error);
        });
      } else if (enhancedUpdates.timerRunning === false) {
        // Stop timer via API (delete)
        fetch('/api/active-timer', {
          method: 'DELETE',
        }).catch(error => {
          console.error('Error stopping timer via API:', error);
        });
      }
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
    // Add assignee to task
    addAssignee: (taskId: string, employeeId: SystemId, employeeName: string, role: AssigneeRole = 'contributor') => {
      const task = store.findById(taskId as SystemId);
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
      
      store.update(taskId as SystemId, {
        ...task,
        assignees: updatedAssignees,
        assigneeId: (owner?.employeeSystemId ?? asSystemId('')),
        assigneeName: owner?.employeeName || '',
        activities,
      });
    },
    // Remove assignee from task
    removeAssignee: (taskId: string, employeeId: SystemId) => {
      const task = store.findById(taskId as SystemId);
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
      
      store.update(taskId as SystemId, {
        ...task,
        assignees: updatedAssignees,
        assigneeId: owner?.employeeSystemId || asSystemId(''),
        assigneeName: owner?.employeeName || '',
        activities,
      });
    },
    // Update assignee role
    updateAssigneeRole: (taskId: string, employeeId: SystemId, newRole: AssigneeRole) => {
      const task = store.findById(taskId as SystemId);
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
      
      store.update(taskId as SystemId, {
        ...task,
        assignees: updatedAssignees,
        assigneeId: owner?.employeeSystemId || asSystemId(''),
        assigneeName: owner?.employeeName || '',
      });
    },
    // Restore running timer on page load - now uses API instead of localStorage
    restoreTimer: async () => {
      try {
        const res = await fetch('/api/active-timer');
        if (!res.ok) return;
        
        const timerData = await res.json();
        if (!timerData || !timerData.taskId) return;
        
        const { taskId, startTime } = timerData;
        const task = store.findById(taskId);
        if (!task) {
          // Timer exists but task not found, delete timer
          fetch('/api/active-timer', { method: 'DELETE' }).catch(() => {});
          return;
        }
        
        // Calculate elapsed time
        const _elapsed = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
        
        store.update(taskId as SystemId, {
          ...task,
          timerRunning: true,
          timerStartedAt: startTime,
          totalTrackedSeconds: (task.totalTrackedSeconds || 0),
        });
      } catch (error) {
        console.error('Error restoring timer from API:', error);
      }
    },
    
    // Approve task completion
    approveTask: (taskId: string) => {
      const task = store.findById(taskId as SystemId);
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
      
      store.update(taskId as SystemId, {
        ...task,
        status: 'Hoàn thành',
        completedDate: new Date().toISOString(),
        approvalStatus: 'approved',
        rejectionReason: undefined,
        approvalHistory: [...(task.approvalHistory || []), approvalRecord],
        activities: [...(task.activities || []), activity],
      });
    },
    
    // Reject task completion
    rejectTask: (taskId: string, reason: string) => {
      const task = store.findById(taskId as SystemId);
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
      
      store.update(taskId as SystemId, {
        ...task,
        status: 'Đang thực hiện',
        approvalStatus: 'rejected',
        rejectionReason: reason,
        approvalHistory: [...(task.approvalHistory || []), approvalRecord],
        activities: [...(task.activities || []), activity],
      });
    },
  };
};
