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

import type { TaskPriority as _TaskPriority } from '@/lib/types/prisma-extended';

/**
 * Chuẩn hoá `TaskPriority` (union tiếng Anh + tiếng Việt) về key tiếng Việt.
 *
 * Dùng khi cần index Record chỉ có 4 key tiếng Việt (ví dụ `priorityColors`,
 * `SLASettings` trong `features/settings/tasks/types.ts`). Dữ liệu cũ trong
 * DB có thể còn dùng `"low" | "medium" | "high" | "urgent"` — helper này map
 * về key chuẩn để tránh lỗi TS7053 khi index.
 */
export type TaskPriorityVi = 'Thấp' | 'Trung bình' | 'Cao' | 'Khẩn cấp';

export function normalizeTaskPriority(priority: _TaskPriority): TaskPriorityVi {
  switch (priority) {
    case 'low':
      return 'Thấp';
    case 'medium':
      return 'Trung bình';
    case 'high':
      return 'Cao';
    case 'urgent':
      return 'Khẩn cấp';
    default:
      return priority;
  }
}
