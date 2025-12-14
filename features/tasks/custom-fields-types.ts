import type { SystemId } from '../../lib/id-types';
import { formatDateForDisplay } from '@/lib/date-utils';

export type CustomFieldType = 
  | 'text'       // Short text input
  | 'textarea'   // Long text
  | 'number'     // Numeric value
  | 'date'       // Date picker
  | 'checkbox'   // Boolean
  | 'select'     // Single select dropdown
  | 'multiselect' // Multiple select
  | 'url'        // URL input
  | 'email'      // Email input
  | 'phone'      // Phone number
  | 'currency'   // Money amount
  | 'percentage'; // Percentage (0-100)

export interface CustomFieldOption {
  value: string;
  label: string;
  color?: string; // For visual distinction in UI
}

export interface CustomFieldDefinition {
  systemId: SystemId;
  id: string; // FIELD-XXX
  name: string;
  description?: string | undefined;
  type: CustomFieldType;
  
  // For select/multiselect types
  options?: CustomFieldOption[] | undefined;
  
  // Validation
  required?: boolean | undefined;
  defaultValue?: any;
  
  // For number/currency/percentage
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined; // Step increment for number inputs
  
  // For text/textarea
  maxLength?: number | undefined;
  pattern?: string | undefined; // Regex pattern
  
  // Display
  placeholder?: string | undefined;
  helpText?: string | undefined;
  
  // Categorization
  category?: string | undefined; // Group fields by category
  order: number; // Display order
  
  // Visibility & Access
  isActive: boolean;
  visibleToRoles?: string[] | undefined; // Empty = visible to all
  editableByRoles?: string[] | undefined; // Empty = editable by all
  
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomFieldValue {
  fieldId: string; // References CustomFieldDefinition.systemId
  value: any; // Type depends on field type
}

// Field categories for organization
export const FIELD_CATEGORIES = {
  GENERAL: 'Thông tin chung',
  TECHNICAL: 'Kỹ thuật',
  BUSINESS: 'Kinh doanh',
  QUALITY: 'Chất lượng',
  CUSTOM: 'Tùy chỉnh',
} as const;

// Predefined custom fields templates
export const PREDEFINED_FIELDS: Partial<CustomFieldDefinition>[] = [
  {
    name: 'Story Points',
    description: 'Agile story points estimation',
    type: 'select',
    category: 'TECHNICAL',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '5', label: '5' },
      { value: '8', label: '8' },
      { value: '13', label: '13' },
      { value: '21', label: '21' },
    ],
  },
  {
    name: 'Sprint',
    description: 'Sprint number or name',
    type: 'text',
    category: 'TECHNICAL',
    placeholder: 'Sprint 23',
  },
  {
    name: 'Client Name',
    description: 'Customer or client name',
    type: 'text',
    category: 'BUSINESS',
  },
  {
    name: 'Budget',
    description: 'Task budget',
    type: 'currency',
    category: 'BUSINESS',
    min: 0,
  },
  {
    name: 'Revenue Impact',
    description: 'Expected revenue impact',
    type: 'currency',
    category: 'BUSINESS',
  },
  {
    name: 'Risk Level',
    description: 'Risk assessment',
    type: 'select',
    category: 'QUALITY',
    options: [
      { value: 'low', label: 'Thấp', color: 'green' },
      { value: 'medium', label: 'Trung bình', color: 'yellow' },
      { value: 'high', label: 'Cao', color: 'orange' },
      { value: 'critical', label: 'Nghiêm trọng', color: 'red' },
    ],
  },
  {
    name: 'Test Coverage',
    description: 'Code test coverage percentage',
    type: 'percentage',
    category: 'QUALITY',
    min: 0,
    max: 100,
  },
  {
    name: 'External Link',
    description: 'Link to external resource',
    type: 'url',
    category: 'GENERAL',
    placeholder: 'https://...',
  },
  {
    name: 'Blocked',
    description: 'Is task blocked by dependencies?',
    type: 'checkbox',
    category: 'GENERAL',
    defaultValue: false,
  },
  {
    name: 'Environment',
    description: 'Deployment environment',
    type: 'multiselect',
    category: 'TECHNICAL',
    options: [
      { value: 'dev', label: 'Development' },
      { value: 'staging', label: 'Staging' },
      { value: 'prod', label: 'Production' },
    ],
  },
];

// Helper to validate field value
export function validateFieldValue(
  field: CustomFieldDefinition,
  value: any
): { valid: boolean; error?: string } {
  // Required check
  if (field.required && (value === null || value === undefined || value === '')) {
    return { valid: false, error: `${field.name} là bắt buộc` };
  }

  // Skip validation if empty and not required
  if (!field.required && (value === null || value === undefined || value === '')) {
    return { valid: true };
  }

  // Type-specific validation
  switch (field.type) {
    case 'number':
    case 'currency':
    case 'percentage':
      const num = Number(value);
      if (isNaN(num)) {
        return { valid: false, error: `${field.name} phải là số` };
      }
      if (field.min !== undefined && num < field.min) {
        return { valid: false, error: `${field.name} phải >= ${field.min}` };
      }
      if (field.max !== undefined && num > field.max) {
        return { valid: false, error: `${field.name} phải <= ${field.max}` };
      }
      break;

    case 'text':
    case 'textarea':
      if (field.maxLength && String(value).length > field.maxLength) {
        return { valid: false, error: `${field.name} tối đa ${field.maxLength} ký tự` };
      }
      if (field.pattern && !new RegExp(field.pattern).test(String(value))) {
        return { valid: false, error: `${field.name} không đúng định dạng` };
      }
      break;

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(value))) {
        return { valid: false, error: `${field.name} phải là email hợp lệ` };
      }
      break;

    case 'url':
      try {
        new URL(String(value));
      } catch {
        return { valid: false, error: `${field.name} phải là URL hợp lệ` };
      }
      break;

    case 'select':
      if (field.options && !field.options.some(opt => opt.value === value)) {
        return { valid: false, error: `${field.name} có giá trị không hợp lệ` };
      }
      break;

    case 'multiselect':
      if (!Array.isArray(value)) {
        return { valid: false, error: `${field.name} phải là mảng` };
      }
      if (field.options) {
        const validValues = field.options.map(opt => opt.value);
        const invalidValues = value.filter(v => !validValues.includes(v));
        if (invalidValues.length > 0) {
          return { valid: false, error: `${field.name} có giá trị không hợp lệ` };
        }
      }
      break;
  }

  return { valid: true };
}

// Helper to format field value for display
export function formatFieldValue(field: CustomFieldDefinition, value: any): string {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  switch (field.type) {
    case 'checkbox':
      return value ? 'Có' : 'Không';

    case 'currency':
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(Number(value));

    case 'percentage':
      return `${value}%`;

    case 'select':
      const option = field.options?.find(opt => opt.value === value);
      return option?.label || String(value);

    case 'multiselect':
      if (!Array.isArray(value)) return '-';
      return value
        .map(v => {
          const opt = field.options?.find(opt => opt.value === v);
          return opt?.label || v;
        })
        .join(', ');

    case 'date':
      return formatDateForDisplay(value);

    default:
      return String(value);
  }
}
