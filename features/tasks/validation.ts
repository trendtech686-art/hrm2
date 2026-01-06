import { z } from 'zod';

// =============================================================================
// TASK VALIDATION SCHEMAS
// =============================================================================

/**
 * Task Priority & Status
 */
export const taskPrioritySchema = z.enum([
  'Thấp',
  'Trung bình',
  'Cao',
  'Khẩn cấp',
  'low',
  'medium',
  'high',
  'urgent',
]);

export const taskStatusSchema = z.enum([
  'Chưa bắt đầu',
  'Đang thực hiện',
  'Đang chờ',
  'Chờ duyệt',
  'Chờ xử lý',
  'Hoàn thành',
  'Đã hủy',
]);

export const assigneeRoleSchema = z.enum([
  'owner',
  'contributor',
  'reviewer',
]);

/**
 * Task Assignee Schema
 */
export const taskAssigneeSchema = z.object({
  employeeSystemId: z.string().min(1, 'Vui lòng chọn nhân viên'),
  role: assigneeRoleSchema.default('contributor'),
});

export type TaskAssigneeInput = z.infer<typeof taskAssigneeSchema>;

/**
 * Subtask Schema
 */
export const subtaskSchema = z.object({
  id: z.string().optional(),
  title: z.string()
    .min(1, 'Tiêu đề không được để trống')
    .max(200, 'Tiêu đề không được quá 200 ký tự'),
  completed: z.boolean().default(false),
  dueDate: z.date().optional(),
  assigneeId: z.string().optional(),
});

export type SubtaskInput = z.infer<typeof subtaskSchema>;

/**
 * Create Task Schema
 */
export const createTaskSchema = z.object({
  // Required
  title: z.string()
    .min(1, 'Tiêu đề không được để trống')
    .max(200, 'Tiêu đề không được quá 200 ký tự'),
  
  // Optional info
  description: z.string().max(5000, 'Mô tả không được quá 5000 ký tự').optional(),
  
  // Priority & Status
  priority: taskPrioritySchema.default('Trung bình'),
  status: taskStatusSchema.default('Chưa bắt đầu'),
  
  // Dates
  startDate: z.date().optional(),
  dueDate: z.date().optional(),
  
  // Assignees
  assignees: z.array(taskAssigneeSchema).default([]),
  assigneeId: z.string().optional(), // Primary assignee
  
  // Subtasks
  subtasks: z.array(subtaskSchema).default([]),
  
  // Related entities
  relatedEntityType: z.string().optional(),
  relatedEntityId: z.string().optional(),
  
  // Category/Tags
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  
  // Estimated time (minutes)
  estimatedTime: z.number().min(0).optional(),
  
  // Branch
  branchSystemId: z.string().optional(),
}).refine(
  (data) => {
    if (data.startDate && data.dueDate) {
      return data.startDate <= data.dueDate;
    }
    return true;
  },
  {
    message: 'Ngày bắt đầu phải trước ngày kết thúc',
    path: ['dueDate'],
  }
);

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

/**
 * Update Task Schema
 */
export const updateTaskSchema = z.object({
  title: z.string()
    .min(1, 'Tiêu đề không được để trống')
    .max(200, 'Tiêu đề không được quá 200 ký tự')
    .optional(),
  description: z.string().max(5000).optional(),
  priority: taskPrioritySchema.optional(),
  status: taskStatusSchema.optional(),
  startDate: z.date().nullable().optional(),
  dueDate: z.date().nullable().optional(),
  assignees: z.array(taskAssigneeSchema).optional(),
  assigneeId: z.string().nullable().optional(),
  subtasks: z.array(subtaskSchema).optional(),
  progress: z.number().min(0).max(100).optional(),
  estimatedTime: z.number().min(0).optional(),
  actualTime: z.number().min(0).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

/**
 * Complete Task Schema (with evidence)
 */
export const completeTaskSchema = z.object({
  evidence: z.object({
    images: z.array(z.string()).default([]),
    note: z.string().max(2000).optional(),
  }).optional(),
  completionNote: z.string().max(1000).optional(),
});

export type CompleteTaskInput = z.infer<typeof completeTaskSchema>;

/**
 * Task Comment Schema
 */
export const taskCommentSchema = z.object({
  content: z.string()
    .min(1, 'Nội dung không được để trống')
    .max(2000, 'Nội dung không được quá 2000 ký tự'),
  attachments: z.array(z.string()).optional(),
});

export type TaskCommentInput = z.infer<typeof taskCommentSchema>;

/**
 * Timer Control Schema
 */
export const timerControlSchema = z.object({
  action: z.enum(['start', 'stop', 'pause', 'resume']),
  note: z.string().max(500).optional(),
});

export type TimerControlInput = z.infer<typeof timerControlSchema>;

/**
 * List Tasks Query Schema
 */
export const listTasksQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  assigneeId: z.string().optional(),
  branchSystemId: z.string().optional(),
  category: z.string().optional(),
  startDateFrom: z.string().optional(),
  startDateTo: z.string().optional(),
  dueDateFrom: z.string().optional(),
  dueDateTo: z.string().optional(),
  sortBy: z.enum(['createdAt', 'dueDate', 'priority', 'status', 'title']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;

/**
 * Approve/Reject Evidence Schema
 */
export const evidenceReviewSchema = z.object({
  action: z.enum(['approve', 'reject']),
  comment: z.string().max(1000).optional(),
});

export type EvidenceReviewInput = z.infer<typeof evidenceReviewSchema>;
