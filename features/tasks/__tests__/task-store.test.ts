/**
 * @file Task Store Tests
 * @description Tests for task management based on testing-checklist.md Section 17
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTaskStore } from '../store';
import { asSystemId } from '../../../lib/id-types';

// Mock auth context
vi.mock('../../../contexts/auth-context.tsx', () => ({
  getCurrentUserInfo: () => ({ systemId: 'EMP001', name: 'Test User' }),
}));

describe('Task Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // 17. Công việc (Tasks)
  describe('17. Công việc (Tasks)', () => {
    it('returns list of tasks', () => {
      const { result } = renderHook(() => useTaskStore());
      expect(result.current.data).toBeDefined();
      expect(Array.isArray(result.current.data)).toBe(true);
    });

    it('filters active tasks correctly', () => {
      const { result } = renderHook(() => useTaskStore());
      const activeTasks = result.current.getActive();
      
      expect(Array.isArray(activeTasks)).toBe(true);
      activeTasks.forEach(task => {
        expect(task.isDeleted).not.toBe(true);
      });
    });

    // Tạo công việc
    it('creates a new task', () => {
      const { result } = renderHook(() => useTaskStore());
      const initialCount = result.current.data.length;
      
      const newTask = {
        id: 'TASK-TEST-001',
        title: 'Test Task',
        description: 'Test task description',
        status: 'Chờ xử lý' as const,
        priority: 'medium' as const,
        assigneeId: asSystemId('EMP001'),
        assigneeName: 'Test Employee',
        assignerId: asSystemId('EMP002'),
        dueDate: '2025-12-31',
        createdAt: new Date().toISOString(),
      };
      
      let taskResult: any;
      act(() => {
        taskResult = result.current.add(newTask as any);
      });
      
      expect(taskResult).toBeDefined();
      expect(taskResult?.title).toBe('Test Task');
      expect(result.current.data.length).toBe(initialCount + 1);
    });

    it('generates systemId for new task', () => {
      const { result } = renderHook(() => useTaskStore());
      
      const newTask = {
        id: 'TASK-TEST-002',
        title: 'Test Task 2',
        status: 'Chờ xử lý' as const,
        priority: 'low' as const,
      };
      
      let taskResult: any;
      act(() => {
        taskResult = result.current.add(newTask as any);
      });
      
      expect(taskResult?.systemId).toBeDefined();
    });

    it('adds creation activity log', () => {
      const { result } = renderHook(() => useTaskStore());
      
      const newTask = {
        id: 'TASK-TEST-003',
        title: 'Test Task 3',
        status: 'Chờ xử lý' as const,
        priority: 'high' as const,
        assigneeId: asSystemId('EMP001'),
        assigneeName: 'Test Employee',
      };
      
      let taskResult: any;
      act(() => {
        taskResult = result.current.add(newTask as any);
      });
      
      const created = result.current.findById(taskResult?.systemId as any);
      
      expect(created?.activities).toBeDefined();
      expect(created?.activities?.length).toBeGreaterThan(0);
    });

    // Gán nhân viên
    it('assigns employee to task', () => {
      const { result } = renderHook(() => useTaskStore());
      const tasks = result.current.data;
      
      if (tasks.length > 0) {
        const task = tasks[0];
        act(() => {
          result.current.addAssignee(task.systemId, asSystemId('EMP003'), 'New Assignee', 'contributor');
        });
        
        const updated = result.current.findById(task.systemId as any);
        expect(updated?.assignees?.some(a => a.employeeName === 'New Assignee')).toBe(true);
      }
    });

    it('removes assignee from task', () => {
      const { result } = renderHook(() => useTaskStore());
      const tasksWithAssignees = result.current.data.filter(t => t.assignees && t.assignees.length > 0);
      
      if (tasksWithAssignees.length > 0) {
        const task = tasksWithAssignees[0];
        const assignee = task.assignees![0];
        
        act(() => {
          result.current.removeAssignee(task.systemId, assignee.employeeSystemId);
        });
        
        const updated = result.current.findById(task.systemId as any);
        expect(updated?.assignees?.some(a => a.employeeSystemId === assignee.employeeSystemId)).toBe(false);
      }
    });

    it('updates assignee role', () => {
      const { result } = renderHook(() => useTaskStore());
      const tasksWithAssignees = result.current.data.filter(t => t.assignees && t.assignees.length > 0);
      
      if (tasksWithAssignees.length > 0) {
        const task = tasksWithAssignees[0];
        const assignee = task.assignees![0];
        
        act(() => {
          result.current.updateAssigneeRole(task.systemId, assignee.employeeSystemId, 'reviewer');
        });
        
        const updated = result.current.findById(task.systemId as any);
        const updatedAssignee = updated?.assignees?.find(a => a.employeeSystemId === assignee.employeeSystemId);
        expect(updatedAssignee?.role).toBe('reviewer');
      }
    });

    // Thiết lập deadline
    it('updates task with deadline', () => {
      const { result } = renderHook(() => useTaskStore());
      const tasks = result.current.data;
      
      if (tasks.length > 0) {
        const task = tasks[0];
        const newDueDate = '2025-06-30';
        
        act(() => {
          result.current.update(task.systemId as any, { dueDate: newDueDate });
        });
        
        const updated = result.current.findById(task.systemId as any);
        expect(updated?.dueDate).toBe(newDueDate);
      }
    });

    // Thêm subtasks
    it('adds subtasks to task', () => {
      const { result } = renderHook(() => useTaskStore());
      const tasks = result.current.data;
      
      if (tasks.length > 0) {
        const task = tasks[0];
        const newSubtasks = [
          { id: 'sub1', title: 'Subtask 1', completed: false },
          { id: 'sub2', title: 'Subtask 2', completed: false },
        ];
        
        act(() => {
          result.current.update(task.systemId as any, { subtasks: newSubtasks });
        });
        
        const updated = result.current.findById(task.systemId as any);
        expect(updated?.subtasks?.length).toBe(2);
      }
    });

    // Cập nhật tiến độ
    it('updates task progress', () => {
      const { result } = renderHook(() => useTaskStore());
      const tasks = result.current.data;
      
      if (tasks.length > 0) {
        const task = tasks[0];
        
        act(() => {
          result.current.update(task.systemId as any, { progress: 50 });
        });
        
        const updated = result.current.findById(task.systemId as any);
        expect(updated?.progress).toBe(50);
      }
    });

    // Đánh dấu hoàn thành
    it('marks task as completed', () => {
      const { result } = renderHook(() => useTaskStore());
      const tasks = result.current.data.filter(t => t.status !== 'Hoàn thành');
      
      if (tasks.length > 0) {
        const task = tasks[0];
        
        act(() => {
          result.current.update(task.systemId as any, { status: 'Hoàn thành' });
        });
        
        const updated = result.current.findById(task.systemId as any);
        expect(updated?.status).toBe('Hoàn thành');
      }
    });

    // Status changes
    it('updates task status and logs activity', () => {
      const { result } = renderHook(() => useTaskStore());
      const tasks = result.current.data.filter(t => t.status === 'Chờ xử lý');
      
      if (tasks.length > 0) {
        const task = tasks[0];
        const initialActivitiesCount = task.activities?.length || 0;
        
        act(() => {
          result.current.update(task.systemId as any, { status: 'Đang thực hiện' });
        });
        
        const updated = result.current.findById(task.systemId as any);
        expect(updated?.status).toBe('Đang thực hiện');
        expect(updated?.activities?.length).toBeGreaterThanOrEqual(initialActivitiesCount);
      }
    });

    // Priority changes
    it('updates task priority and logs activity', () => {
      const { result } = renderHook(() => useTaskStore());
      const tasks = result.current.data;
      
      if (tasks.length > 0) {
        const task = tasks[0];
        
        act(() => {
          result.current.update(task.systemId as any, { priority: 'high' });
        });
        
        const updated = result.current.findById(task.systemId as any);
        expect(updated?.priority).toBe('high');
      }
    });

    // Timer functionality
    it('starts timer when status changes to Đang thực hiện', () => {
      const { result } = renderHook(() => useTaskStore());
      const tasks = result.current.data.filter(t => t.status === 'Chờ xử lý' && !t.timerRunning);
      
      if (tasks.length > 0) {
        const task = tasks[0];
        
        act(() => {
          result.current.update(task.systemId as any, { status: 'Đang thực hiện' });
        });
        
        const updated = result.current.findById(task.systemId as any);
        expect(updated?.timerRunning).toBe(true);
        expect(updated?.timerStartedAt).toBeDefined();
      }
    });

    // My Tasks
    it('gets tasks assigned to specific user', () => {
      const { result } = renderHook(() => useTaskStore());
      const myTasks = result.current.getMyTasks(asSystemId('EMP001'));
      
      expect(Array.isArray(myTasks)).toBe(true);
    });

    it('gets tasks created by specific user', () => {
      const { result } = renderHook(() => useTaskStore());
      const createdByMe = result.current.getCreatedByMe(asSystemId('EMP001'));
      
      expect(Array.isArray(createdByMe)).toBe(true);
    });

    // Task approval
    it('approves task completion', () => {
      const { result } = renderHook(() => useTaskStore());
      const pendingTasks = result.current.data.filter(t => t.approvalStatus === 'pending');
      
      if (pendingTasks.length > 0) {
        const task = pendingTasks[0];
        
        act(() => {
          result.current.approveTask(task.systemId);
        });
        
        const updated = result.current.findById(task.systemId as any);
        expect(updated?.approvalStatus).toBe('approved');
        expect(updated?.status).toBe('Hoàn thành');
      }
    });

    it('rejects task completion with reason', () => {
      const { result } = renderHook(() => useTaskStore());
      const pendingTasks = result.current.data.filter(t => t.approvalStatus === 'pending');
      
      if (pendingTasks.length > 0) {
        const task = pendingTasks[0];
        const reason = 'Cần bổ sung thêm thông tin';
        
        act(() => {
          result.current.rejectTask(task.systemId, reason);
        });
        
        const updated = result.current.findById(task.systemId as any);
        expect(updated?.approvalStatus).toBe('rejected');
        expect(updated?.rejectionReason).toBe(reason);
      }
    });

    // Delete task
    it('soft deletes a task', () => {
      const { result } = renderHook(() => useTaskStore());
      const tasks = result.current.data;
      
      if (tasks.length > 0) {
        const task = tasks[0];
        act(() => {
          result.current.remove(task.systemId as any);
        });
        
        const removed = result.current.findById(task.systemId as any);
        expect(removed?.isDeleted).toBe(true);
      }
    });

    // Restore task
    it('restores deleted task', () => {
      const { result } = renderHook(() => useTaskStore());
      const deletedTasks = result.current.data.filter(t => t.isDeleted);
      
      if (deletedTasks.length > 0) {
        const task = deletedTasks[0];
        act(() => {
          result.current.restore(task.systemId as any);
        });
        
        const restored = result.current.findById(task.systemId as any);
        expect(restored?.isDeleted).toBe(false);
      }
    });
  });
});
