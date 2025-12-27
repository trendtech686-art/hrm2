// Re-export all task types from central prisma-extended
export type {
  TaskPriority,
  TaskStatus,
  AssigneeRole,
  ApprovalStatus,
  TaskActivityAction,
  TaskActivity,
  TaskComment,
  TaskAttachment,
  CompletionEvidence,
  ApprovalHistory,
  TaskAssignee,
  Task,
} from '@/lib/types/prisma-extended';

export {
  TASK_PRIORITIES,
  TASK_STATUSES,
  ASSIGNEE_ROLES,
} from '@/lib/types/prisma-extended';
