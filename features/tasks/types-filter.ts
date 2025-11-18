/**
 * Advanced Filter Types for Task Management
 * Supports complex filtering with AND/OR conditions
 */

export type FilterOperator = 
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'in'
  | 'not_in'
  | 'greater_than'
  | 'less_than'
  | 'is_empty'
  | 'is_not_empty'
  | 'before'
  | 'after'
  | 'between';

export type FilterField = 
  | 'status'
  | 'priority'
  | 'assigneeId'
  | 'createdBy'
  | 'department'
  | 'dueDate'
  | 'createdAt'
  | 'progress'
  | 'estimatedHours'
  | 'actualHours';

export interface FilterCondition {
  id: string;
  field: FilterField;
  operator: FilterOperator;
  value: any;
}

export type FilterLogic = 'AND' | 'OR';

export interface FilterGroup {
  id: string;
  logic: FilterLogic;
  conditions: FilterCondition[];
}

export interface SavedView {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isDefault?: boolean;
  isShared?: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  
  // Filter configuration
  filterGroups: FilterGroup[];
  groupLogic: FilterLogic; // AND/OR between groups
  
  // View settings
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  viewMode?: 'list' | 'kanban';
  showSubtasks?: boolean;
  groupBy?: string;
}

export interface QuickFilter {
  id: string;
  name: string;
  icon: string;
  color: string;
  filter: (task: any) => boolean;
}

// Quick Filter Presets
export const QUICK_FILTERS: QuickFilter[] = [
  {
    id: 'my-tasks',
    name: 'Công việc của tôi',
    icon: 'User',
    color: 'blue',
    filter: (task) => {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const employee = JSON.parse(localStorage.getItem('employee') || '{}');
      return task.assigneeId === employee.systemId;
    },
  },
  {
    id: 'overdue',
    name: 'Quá hạn',
    icon: 'AlertCircle',
    color: 'red',
    filter: (task) => {
      if (!task.dueDate || task.status === 'Hoàn thành' || task.status === 'Đã hủy') {
        return false;
      }
      return new Date(task.dueDate) < new Date();
    },
  },
  {
    id: 'high-priority',
    name: 'Ưu tiên cao',
    icon: 'ArrowUp',
    color: 'orange',
    filter: (task) => task.priority === 'Cao' || task.priority === 'Khẩn cấp',
  },
  {
    id: 'in-progress',
    name: 'Đang thực hiện',
    icon: 'Clock',
    color: 'green',
    filter: (task) => task.status === 'Đang thực hiện',
  },
  {
    id: 'due-today',
    name: 'Hạn hôm nay',
    icon: 'Calendar',
    color: 'purple',
    filter: (task) => {
      if (!task.dueDate) return false;
      const today = new Date();
      const due = new Date(task.dueDate);
      return (
        today.getDate() === due.getDate() &&
        today.getMonth() === due.getMonth() &&
        today.getFullYear() === due.getFullYear()
      );
    },
  },
  {
    id: 'due-this-week',
    name: 'Hạn tuần này',
    icon: 'CalendarDays',
    color: 'indigo',
    filter: (task) => {
      if (!task.dueDate) return false;
      const today = new Date();
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() + (7 - today.getDay()));
      const due = new Date(task.dueDate);
      return due >= today && due <= weekEnd;
    },
  },
  {
    id: 'no-assignee',
    name: 'Chưa gán người',
    icon: 'UserX',
    color: 'gray',
    filter: (task) => !task.assigneeId,
  },
  {
    id: 'created-by-me',
    name: 'Tôi tạo',
    icon: 'UserPlus',
    color: 'teal',
    filter: (task) => {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      return task.createdBy === user.username;
    },
  },
];

// Field metadata for filter builder
export interface FilterFieldMeta {
  field: FilterField;
  label: string;
  type: 'string' | 'number' | 'date' | 'select' | 'multiselect';
  operators: FilterOperator[];
  options?: { value: string; label: string }[];
}

export const FILTER_FIELD_META: FilterFieldMeta[] = [
  {
    field: 'status',
    label: 'Trạng thái',
    type: 'select',
    operators: ['equals', 'not_equals', 'in', 'not_in'],
    options: [
      { value: 'Chưa bắt đầu', label: 'Chưa bắt đầu' },
      { value: 'Đang thực hiện', label: 'Đang thực hiện' },
      { value: 'Đang chờ', label: 'Đang chờ' },
      { value: 'Hoàn thành', label: 'Hoàn thành' },
      { value: 'Đã hủy', label: 'Đã hủy' },
    ],
  },
  {
    field: 'priority',
    label: 'Độ ưu tiên',
    type: 'select',
    operators: ['equals', 'not_equals', 'in', 'not_in'],
    options: [
      { value: 'Thấp', label: 'Thấp' },
      { value: 'Trung bình', label: 'Trung bình' },
      { value: 'Cao', label: 'Cao' },
      { value: 'Khẩn cấp', label: 'Khẩn cấp' },
    ],
  },
  {
    field: 'assigneeId',
    label: 'Người thực hiện',
    type: 'select',
    operators: ['equals', 'not_equals', 'in', 'not_in', 'is_empty', 'is_not_empty'],
  },
  {
    field: 'department',
    label: 'Phòng ban',
    type: 'select',
    operators: ['equals', 'not_equals', 'in', 'not_in'],
  },
  {
    field: 'dueDate',
    label: 'Ngày hết hạn',
    type: 'date',
    operators: ['before', 'after', 'between', 'is_empty', 'is_not_empty'],
  },
  {
    field: 'createdAt',
    label: 'Ngày tạo',
    type: 'date',
    operators: ['before', 'after', 'between'],
  },
  {
    field: 'progress',
    label: 'Tiến độ',
    type: 'number',
    operators: ['equals', 'greater_than', 'less_than', 'between'],
  },
  {
    field: 'estimatedHours',
    label: 'Giờ dự kiến',
    type: 'number',
    operators: ['equals', 'greater_than', 'less_than', 'between', 'is_empty', 'is_not_empty'],
  },
];
