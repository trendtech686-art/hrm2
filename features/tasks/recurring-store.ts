import { createCrudStore } from '../../lib/store-factory';
import { asSystemId } from '../../lib/id-types';
import type { RecurringTask, RecurrencePattern } from './recurring-types';
import type { Task } from './types';
import { calculateNextOccurrence, shouldContinueRecurrence } from './recurring-types';

const initialData: RecurringTask[] = [];

const baseStore = createCrudStore<RecurringTask>(initialData, 'task-templates');

export const useRecurringTaskStore = () => {
  const store = baseStore();

  return {
    ...store,

    // Get active recurring tasks
    getActive: () => {
      return store.data.filter(rt => rt.isActive && !rt.isPaused);
    },

    // Get paused recurring tasks
    getPaused: () => {
      return store.data.filter(rt => rt.isActive && rt.isPaused);
    },

    // Toggle pause
    togglePause: (recurringTaskId: string) => {
      const task = store.findById(asSystemId(recurringTaskId));
      if (!task) return;

      store.update(asSystemId(recurringTaskId), {
        ...task,
        isPaused: !task.isPaused,
        updatedAt: new Date().toISOString(),
      });
    },

    // Deactivate recurring task
    deactivate: (recurringTaskId: string) => {
      const task = store.findById(asSystemId(recurringTaskId));
      if (!task) return;

      store.update(asSystemId(recurringTaskId), {
        ...task,
        isActive: false,
        updatedAt: new Date().toISOString(),
      });
    },

    // Update next occurrence date
    updateNextOccurrence: (recurringTaskId: string) => {
      const task = store.findById(asSystemId(recurringTaskId));
      if (!task) return;

      const nextDate = calculateNextOccurrence(
        task.recurrencePattern,
        task.nextOccurrenceDate 
          ? new Date(task.nextOccurrenceDate)
          : new Date(task.startDate)
      );

      const shouldContinue = shouldContinueRecurrence(
        task.recurrencePattern,
        task.occurrenceCount,
        nextDate
      );

      store.update(asSystemId(recurringTaskId), {
        ...task,
        nextOccurrenceDate: nextDate ? nextDate.toISOString().split('T')[0] : undefined,
        isActive: shouldContinue,
        updatedAt: new Date().toISOString(),
      });
    },

    // Mark task as created
    markTaskCreated: (recurringTaskId: string, createdTaskId: string) => {
      const task = store.findById(asSystemId(recurringTaskId));
      if (!task) return;

      const createdTaskIds = [...task.createdTaskIds, createdTaskId];
      const occurrenceCount = task.occurrenceCount + 1;

      store.update(asSystemId(recurringTaskId), {
        ...task,
        createdTaskIds,
        occurrenceCount,
        lastCreatedDate: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Calculate and update next occurrence - call method directly
      const nextDate = calculateNextOccurrence(
        task.recurrencePattern,
        new Date(task.nextOccurrenceDate || task.startDate)
      );

      const shouldContinue = shouldContinueRecurrence(
        task.recurrencePattern,
        occurrenceCount,
        nextDate
      );

      store.update(asSystemId(recurringTaskId), {
        ...task,
        createdTaskIds,
        occurrenceCount,
        lastCreatedDate: new Date().toISOString(),
        nextOccurrenceDate: nextDate ? nextDate.toISOString().split('T')[0] : undefined,
        isActive: shouldContinue,
        updatedAt: new Date().toISOString(),
      });
    },

    // Generate task from recurring task
    generateTask: (recurringTask: RecurringTask, scheduledDate: string): Omit<Task, 'systemId'> => {
      const dueDate = new Date(scheduledDate);
      dueDate.setDate(dueDate.getDate() + recurringTask.durationDays);

      const startDate = new Date(scheduledDate);
      if (recurringTask.createDaysBefore > 0) {
        startDate.setDate(startDate.getDate() - recurringTask.createDaysBefore);
      }

      // Get owner for backward compatibility
      const owner = recurringTask.assignees.find(a => a.role === 'owner') || recurringTask.assignees[0];

      const task: Omit<Task, 'systemId'> = {
        id: '', // Will be auto-generated
        title: `${recurringTask.title} (${scheduledDate})`,
        description: recurringTask.description,
        assignees: recurringTask.assignees,
        assigneeId: owner?.employeeSystemId || '',
        assigneeName: owner?.employeeName || '',
        assignerId: recurringTask.assignerId,
        assignerName: recurringTask.assignerName,
        priority: recurringTask.priority,
        status: 'Chưa bắt đầu',
        startDate: startDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        estimatedHours: recurringTask.estimatedHours,
        progress: 0,
        subtasks: recurringTask.subtasks?.map((st, idx) => ({
          ...st,
          id: `subtask-${Date.now()}-${idx}`,
        })),
        activities: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
      };

      return task;
    },

    // Get tasks that should be created today
    getTasksToCreateToday: (): Array<{ recurring: RecurringTask; scheduledDate: string }> => {
      const today = new Date().toISOString().split('T')[0];
      const activeTasks = store.data.filter(rt => rt.isActive && !rt.isPaused);

      const tasksToCreate: Array<{ recurring: RecurringTask; scheduledDate: string }> = [];

      activeTasks.forEach(task => {
        const nextDate = task.nextOccurrenceDate;
        if (!nextDate) return;

        // Check if we should create task today
        const createDate = new Date(nextDate);
        if (task.createDaysBefore > 0) {
          createDate.setDate(createDate.getDate() - task.createDaysBefore);
        }

        const createDateStr = createDate.toISOString().split('T')[0];
        if (createDateStr <= today) {
          tasksToCreate.push({
            recurring: task,
            scheduledDate: nextDate,
          });
        }
      });

      return tasksToCreate;
    },

    // Process recurring tasks (should be called daily by cron/scheduler)
    processRecurringTasks: (taskStore: any) => {
      const today = new Date().toISOString().split('T')[0];
      const activeTasks = store.data.filter(rt => rt.isActive && !rt.isPaused);

      const tasksToCreate: Array<{ recurring: RecurringTask; scheduledDate: string }> = [];

      activeTasks.forEach(task => {
        const nextDate = task.nextOccurrenceDate;
        if (!nextDate) return;

        // Check if we should create task today
        const createDate = new Date(nextDate);
        if (task.createDaysBefore > 0) {
          createDate.setDate(createDate.getDate() - task.createDaysBefore);
        }

        const createDateStr = createDate.toISOString().split('T')[0];
        if (createDateStr <= today) {
          tasksToCreate.push({
            recurring: task,
            scheduledDate: nextDate,
          });
        }
      });

      if (tasksToCreate.length === 0) return;

      tasksToCreate.forEach(({ recurring, scheduledDate }) => {
        try {
          // Generate task inline
          const dueDate = new Date(scheduledDate);
          dueDate.setDate(dueDate.getDate() + recurring.durationDays);

          const startDate = new Date(scheduledDate);
          if (recurring.createDaysBefore > 0) {
            startDate.setDate(startDate.getDate() - recurring.createDaysBefore);
          }

          const owner = recurring.assignees.find(a => a.role === 'owner') || recurring.assignees[0];

          const newTask: Omit<Task, 'systemId'> = {
            id: '',
            title: `${recurring.title} (${scheduledDate})`,
            description: recurring.description,
            assignees: recurring.assignees,
            assigneeId: owner?.employeeSystemId || '',
            assigneeName: owner?.employeeName || '',
            assignerId: recurring.assignerId,
            assignerName: recurring.assignerName,
            priority: recurring.priority,
            status: 'Chưa bắt đầu',
            startDate: startDate.toISOString().split('T')[0],
            dueDate: dueDate.toISOString().split('T')[0],
            estimatedHours: recurring.estimatedHours,
            progress: 0,
            subtasks: recurring.subtasks?.map((st, idx) => ({
              ...st,
              id: `subtask-${Date.now()}-${idx}`,
            })),
            activities: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'SYSTEM',
            updatedBy: 'SYSTEM',
          };

          const createdTask = taskStore.add(newTask);
          if (createdTask) {
            // Mark as created
            const task = store.findById(asSystemId(recurring.systemId));
            if (!task) return;

            const createdTaskIds = [...task.createdTaskIds, createdTask.systemId];
            const occurrenceCount = task.occurrenceCount + 1;

            // Calculate next occurrence
            const nextDate = calculateNextOccurrence(
              task.recurrencePattern,
              new Date(task.nextOccurrenceDate || task.startDate)
            );

            const shouldContinue = shouldContinueRecurrence(
              task.recurrencePattern,
              occurrenceCount,
              nextDate
            );

            store.update(asSystemId(recurring.systemId), {
              ...task,
              createdTaskIds,
              occurrenceCount,
              lastCreatedDate: new Date().toISOString(),
              nextOccurrenceDate: nextDate ? nextDate.toISOString().split('T')[0] : undefined,
              isActive: shouldContinue,
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error('Failed to create recurring task:', error);
        }
      });
    },
  };
};
