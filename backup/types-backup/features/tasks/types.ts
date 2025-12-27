import type { SystemId, BusinessId } from '../../lib/id-types';

// Task priorities
export const TASK_PRIORITIES = ['Thấp', 'Trung bình', 'Cao', 'Khẩn cấp', 'low', 'medium', 'high', 'urgent'] as const;
export type TaskPriority = typeof TASK_PRIORITIES[number];

// Task statuses
export const TASK_STATUSES = [
  'Chưa bắt đầu',
  'Đang thực hiện',
  'Đang chờ',
  'Chờ duyệt',
  'Chờ xử lý',
  'Hoàn thành',
  'Đã hủy'
] as const;
export type TaskStatus = typeof TASK_STATUSES[number];

// Assignee roles
export const ASSIGNEE_ROLES = ['owner', 'contributor', 'reviewer'] as const;
export type AssigneeRole = typeof ASSIGNEE_ROLES[number];

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type TaskActivityAction = 
  | 'created' 
  | 'updated' 
  | 'status_changed' 
  | 'assigned' 
  | 'assignee_added'
  | 'assignee_removed'
  | 'priority_changed'
  | 'progress_updated'
  | 'timer_started'
  | 'timer_stopped'
  | 'subtask_completed'
  | 'subtask_uncompleted'
  | 'completed'
  | 'commented'
  | 'evidence_submitted'
  | 'evidence_approved'
  | 'evidence_rejected';

export interface TaskActivity {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  action: TaskActivityAction;
  fieldName?: string | undefined;
  oldValue?: string | undefined;
  newValue?: string | undefined;
  description?: string | undefined; // Human-readable description
  timestamp: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface CompletionEvidence {
  images: string[];        // URLs of uploaded images (max 5)
  note: string;            // Required note (min 10 chars)
  submittedAt: string;     // Timestamp
  submittedBy: string;     // User systemId
  submittedByName: string; // User name
}

export interface ApprovalHistory {
  id: string;
  status: ApprovalStatus;
  reviewedBy: string;      // Admin systemId
  reviewedByName: string;  // Admin name
  reviewedAt: string;
  reason?: string | undefined;         // For rejection
}

// Multiple Assignees Support
export interface TaskAssignee {
  systemId: SystemId;  // Task assignee systemId
  employeeSystemId: SystemId;  // Employee systemId (branded)
  employeeName: string;
  role: AssigneeRole;
  assignedAt: string;
  assignedBy: SystemId;  // User systemId who assigned (branded)
}

export interface Task {
  systemId: SystemId;  // Task systemId (branded)
  id: BusinessId;  // Task businessId (branded)
  title: string;
  description: string;
  type?: string | undefined;  // Task type from settings (Phát triển, Thiết kế, etc.)
  
  // Multiple assignees
  assignees: TaskAssignee[];
  
  // Deprecated - kept for backward compatibility, auto-populated from assignees[0]
  assigneeId: SystemId;  // Employee systemId (branded)
  assigneeName: string;
  assignerId: SystemId;  // Assigner systemId (branded)
  assignerName: string;
  priority: TaskPriority;
  status: TaskStatus;
  startDate: string;
  dueDate: string;
  completedDate?: string | undefined;
  estimatedHours?: number | undefined;
  actualHours?: number | undefined;
  progress: number; // 0-100
  comments?: TaskComment[] | undefined;
  attachments?: TaskAttachment[] | undefined;
  subtasks?: Array<{ id: string; title: string; completed: boolean }> | undefined;
  activities?: TaskActivity[] | undefined;
  // Time tracking fields
  timerRunning?: boolean | undefined;
  timerStartedAt?: string | undefined;
  totalTrackedSeconds?: number | undefined;
  // Completion evidence (for user tasks)
  requiresEvidence?: boolean | undefined;       // Admin sets this when creating task
  completionEvidence?: CompletionEvidence | undefined;
  approvalStatus?: ApprovalStatus | undefined;  // pending, approved, rejected
  approvalHistory?: ApprovalHistory[] | undefined; // Track all approvals/rejections
  rejectionReason?: string | undefined;         // Latest rejection reason
  createdAt: string;
  updatedAt: string;
  createdBy: SystemId;  // Creator systemId (branded)
  updatedBy: SystemId;  // Last updater systemId (branded)
  isDeleted?: boolean | undefined;
}
