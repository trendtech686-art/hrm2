import type { TaskPriority, TaskAssignee } from './types';
import type { SystemId } from '../../lib/id-types';

export type TemplateCategory = 
  | 'Development'    // Phát triển phần mềm
  | 'Design'         // Thiết kế
  | 'Marketing'      // Marketing
  | 'Sales'          // Bán hàng
  | 'Support'        // Hỗ trợ khách hàng
  | 'HR'             // Nhân sự
  | 'Operations'     // Vận hành
  | 'Finance'        // Tài chính
  | 'Other';         // Khác

export interface TaskTemplateSubtask {
  title: string;
  description?: string;
  estimatedHours?: number;
  order: number;
}

export interface TaskTemplate {
  systemId: SystemId;
  id: string; // TMPL-XXX
  name: string;
  description: string;
  category: TemplateCategory;
  
  // Default values for new tasks
  priority: TaskPriority;
  estimatedHours?: number;
  
  // Pre-configured assignees (roles only, specific people assigned when using template)
  assigneeRoles: Array<{
    role: 'owner' | 'contributor' | 'reviewer';
    description: string; // e.g., "Backend Developer", "UX Designer"
  }>;
  
  // Pre-configured subtasks
  subtasks: TaskTemplateSubtask[];
  
  // Template checklist items (converted to task description)
  checklistItems?: string[];
  
  // Metadata
  usageCount: number; // How many times this template has been used
  isActive: boolean;  // Can be archived
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  
  // Custom fields (Week 5)
  customFields?: Record<string, any>;
}

export interface UseTemplateOptions {
  templateId: string;
  title: string;
  dueDate: string;
  assignees: TaskAssignee[]; // Map template roles to actual employees
  customValues?: Record<string, any>; // Override template defaults
}
