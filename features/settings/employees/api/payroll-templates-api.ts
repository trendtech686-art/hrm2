/**
 * Payroll Templates API Functions
 */

import type { PayrollTemplate } from '@/lib/payroll-types';

const API_URL = '/api/settings/payroll-templates';

// ========================================
// Fetch all payroll templates
// ========================================
export async function fetchPayrollTemplates(): Promise<PayrollTemplate[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Không thể tải danh sách mẫu bảng lương');
  }
  const result = await response.json();
  return result.data ?? [];
}

// ========================================
// Save all payroll templates
// ========================================
export async function savePayrollTemplates(templates: PayrollTemplate[]): Promise<PayrollTemplate[]> {
  const response = await fetch(API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(templates),
  });
  if (!response.ok) {
    throw new Error('Không thể lưu danh sách mẫu bảng lương');
  }
  const result = await response.json();
  return result.data ?? [];
}

// ========================================
// Create a new template (helper)
// ========================================
export async function createPayrollTemplate(
  templates: PayrollTemplate[],
  newTemplate: Omit<PayrollTemplate, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>
): Promise<PayrollTemplate[]> {
  const now = new Date().toISOString();
  const nextNum = templates.length + 1;
  
  const template: PayrollTemplate = {
    ...newTemplate,
    systemId: `PAYTPL${String(nextNum).padStart(6, '0')}` as PayrollTemplate['systemId'],
    id: `PT${String(nextNum).padStart(6, '0')}` as PayrollTemplate['id'],
    createdAt: now,
    updatedAt: now,
  };

  // If this is default, unset others
  let updatedTemplates = [...templates];
  if (template.isDefault) {
    updatedTemplates = updatedTemplates.map(t => ({ ...t, isDefault: false }));
  }
  
  return savePayrollTemplates([...updatedTemplates, template]);
}

// ========================================
// Update a template (helper)
// ========================================
export async function updatePayrollTemplate(
  templates: PayrollTemplate[],
  systemId: string,
  updates: Partial<PayrollTemplate>
): Promise<PayrollTemplate[]> {
  const now = new Date().toISOString();
  
  const updatedTemplates = templates.map(t => {
    if (t.systemId === systemId) {
      return { ...t, ...updates, updatedAt: now };
    }
    // If setting this one as default, unset others
    if (updates.isDefault && t.systemId !== systemId) {
      return { ...t, isDefault: false };
    }
    return t;
  });
  
  return savePayrollTemplates(updatedTemplates);
}

// ========================================
// Delete a template (helper)
// ========================================
export async function deletePayrollTemplate(
  templates: PayrollTemplate[],
  systemId: string
): Promise<PayrollTemplate[]> {
  const filtered = templates.filter(t => t.systemId !== systemId);
  
  // Ensure at least one default exists
  if (filtered.length > 0 && !filtered.some(t => t.isDefault)) {
    filtered[0].isDefault = true;
  }
  
  return savePayrollTemplates(filtered);
}
