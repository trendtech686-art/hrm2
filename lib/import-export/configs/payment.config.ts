/**
 * Payment (Phiếu Chi) Import/Export Configuration
 * 
 * Nhập/Xuất phiếu chi
 */

import type { Payment, PaymentStatus, PaymentCategory } from '@/lib/types/prisma-extended';
import type { ImportExportConfig, FieldConfig } from '@/lib/import-export/types';
import type { Customer, Supplier, Employee, Branch, PaymentType, PaymentMethod, TargetGroup } from '@/lib/types/prisma-extended';
import { asBusinessId, asSystemId } from '@/lib/id-types';

// ============================================
// HELPER FUNCTIONS (Accept data as parameters)
// ============================================

const findBranch = (identifier: string, branches: Branch[]) => {
  if (!identifier || !branches) return undefined;
  const normalized = identifier.trim().toLowerCase();
  
  const byId = branches.find(b => b.id.toLowerCase() === normalized);
  if (byId) return byId;
  
  return branches.find(b => b.name.toLowerCase().includes(normalized));
};

const getDefaultBranch = (branches: Branch[]) => {
  if (!branches || branches.length === 0) return undefined;
  return branches.find(b => b.isDefault) || branches[0];
};

const findPaymentType = (identifier: string, paymentTypes: PaymentType[]) => {
  if (!identifier || !paymentTypes) return undefined;
  const normalized = identifier.trim().toLowerCase();
  
  return paymentTypes.find(t => 
    t.id.toLowerCase() === normalized || 
    t.name.toLowerCase().includes(normalized)
  );
};

const findPaymentMethod = (identifier: string, paymentMethods: PaymentMethod[]) => {
  if (!identifier || !paymentMethods) return undefined;
  const normalized = identifier.trim().toLowerCase();
  
  return paymentMethods.find(m => 
    m.id.toLowerCase() === normalized || 
    m.name.toLowerCase().includes(normalized)
  );
};

const getDefaultPaymentMethod = (paymentMethods: PaymentMethod[]) => {
  if (!paymentMethods || paymentMethods.length === 0) return undefined;
  return paymentMethods.find(m => m.isDefault) || paymentMethods[0];
};

const findTargetGroup = (identifier: string, targetGroups: TargetGroup[]) => {
  if (!identifier || !targetGroups) return undefined;
  const normalized = identifier.trim().toLowerCase();
  
  return targetGroups.find(g => 
    g.id.toLowerCase() === normalized || 
    g.name.toLowerCase().includes(normalized)
  );
};

const findRecipient = (recipientType: string, recipientName: string, customers: Customer[], suppliers: Supplier[], employees: Employee[]) => {
  if (!recipientName) return undefined;
  const normalized = recipientName.trim().toLowerCase();
  
  if ((recipientType.includes('Khách hàng') || recipientType === 'KHACHHANG') && customers) {
    return customers.find(c => 
      c.id.toLowerCase() === normalized || 
      c.name.toLowerCase().includes(normalized)
    );
  }
  
  if ((recipientType.includes('Nhà cung cấp') || recipientType === 'NHACUNGCAP') && suppliers) {
    return suppliers.find(s => 
      s.id.toLowerCase() === normalized || 
      s.name.toLowerCase().includes(normalized)
    );
  }
  
  if ((recipientType.includes('Nhân viên') || recipientType === 'NHANVIEN') && employees) {
    return employees.find(e => 
      e.id.toLowerCase() === normalized || 
      e.fullName?.toLowerCase().includes(normalized)
    );
  }
  
  return undefined;
};

// ============================================
// FIELD CONFIGURATION
// ============================================

export const paymentFields: FieldConfig<Payment>[] = [
  {
    key: 'id',
    label: 'Mã phiếu (*)',
    type: 'string',
    required: true,
    example: 'PC001',
    group: 'Thông tin phiếu',
    defaultSelected: true,
  },
  {
    key: 'date',
    label: 'Ngày chi (*)',
    type: 'string',
    required: true,
    example: '2024-01-15',
    group: 'Thông tin phiếu',
    defaultSelected: true,
  },
  {
    key: 'amount',
    label: 'Số tiền (*)',
    type: 'number',
    required: true,
    example: '1000000',
    group: 'Thông tin phiếu',
    defaultSelected: true,
  },
  {
    key: 'description',
    label: 'Diễn giải (*)',
    type: 'string',
    required: true,
    example: 'Chi tiền mua hàng',
    group: 'Thông tin phiếu',
    defaultSelected: true,
  },
  {
    key: 'recipientTypeName' as keyof Payment,
    label: 'Loại đối tượng (*)',
    type: 'string',
    required: true,
    example: 'Nhà cung cấp',
    group: 'Đối tượng',
    defaultSelected: true,
  },
  {
    key: 'recipientName',
    label: 'Người nhận (*)',
    type: 'string',
    required: true,
    example: 'Công ty ABC',
    group: 'Đối tượng',
    defaultSelected: true,
  },
  {
    key: 'paymentReceiptTypeName',
    label: 'Loại phiếu chi (*)',
    type: 'string',
    required: true,
    example: 'Thanh toán nhà cung cấp',
    group: 'Phân loại',
    defaultSelected: true,
  },
  {
    key: 'paymentMethodName',
    label: 'Phương thức TT',
    type: 'string',
    required: false,
    example: 'Chuyển khoản',
    group: 'Phân loại',
    defaultSelected: true,
  },
  {
    key: 'branchName',
    label: 'Chi nhánh',
    type: 'string',
    required: false,
    example: 'Chi nhánh chính',
    group: 'Phân loại',
  },
  {
    key: 'status',
    label: 'Trạng thái',
    type: 'string',
    required: false,
    example: 'completed',
    group: 'Phân loại',
  },
];

// ============================================
// MAIN CONFIG
// ============================================

export const paymentImportExportConfig: ImportExportConfig<Payment> = {
  entityType: 'payments',
  entityDisplayName: 'Phiếu chi',
  
  fields: paymentFields,
  
  templateFileName: 'Mau_Phieu_Chi.xlsx',
  sheetName: 'PhieuChi',
  
  // Import settings
  upsertKey: 'id',
  allowUpdate: false,
  allowInsert: true,
  
  requirePreview: true,
  maxRows: 2000,
  maxErrorsAllowed: 0,
  
  // Validate each row
  validateRow: (row, _index, existingData, mode) => {
    const errors: Array<{ field?: string; message: string }> = [];
    const payment = row as Partial<Payment>;
    
    if (!payment.id?.toString().trim()) {
      errors.push({ field: 'id', message: 'Mã phiếu không được để trống' });
    }
    
    if (!payment.date) {
      errors.push({ field: 'date', message: 'Ngày chi không được để trống' });
    }
    
    if (!payment.amount || payment.amount <= 0) {
      errors.push({ field: 'amount', message: 'Số tiền phải lớn hơn 0' });
    }
    
    if (!payment.description?.trim()) {
      errors.push({ field: 'description', message: 'Diễn giải không được để trống' });
    }
    
    if (!payment.recipientTypeName) {
      errors.push({ field: 'recipientTypeName', message: 'Loại đối tượng không được để trống' });
    }
    
    if (!payment.recipientName?.trim()) {
      errors.push({ field: 'recipientName', message: 'Người nhận không được để trống' });
    }
    
    if (!payment.paymentReceiptTypeName) {
      errors.push({ field: 'paymentReceiptTypeName', message: 'Loại phiếu chi không được để trống' });
    }
    
    // Check duplicate
    if (mode === 'insert-only' && payment.id) {
      const duplicate = existingData.find(p => 
        p.id.toString().toUpperCase() === payment.id!.toString().toUpperCase()
      );
      if (duplicate) {
        errors.push({ field: 'id', message: `Mã phiếu "${payment.id}" đã tồn tại` });
      }
    }
    
    return errors;
  },
  
  // Transform row to Payment object
  postTransformRow: (row, _index, context?: { storeContext?: { branchStore?: { data: Branch[] }; paymentTypeStore?: { data: PaymentType[] }; paymentMethodStore?: { data: PaymentMethod[] }; targetGroupStore?: { data: TargetGroup[] }; customerStore?: { data: Customer[] }; supplierStore?: { data: Supplier[] }; employeeStore?: { data: Employee[] } } }) => {
    const now = new Date().toISOString();
    
    // Get data from context
    const branches = context?.storeContext?.branchStore?.data || [];
    const paymentTypes = context?.storeContext?.paymentTypeStore?.data || [];
    const paymentMethods = context?.storeContext?.paymentMethodStore?.data || [];
    const targetGroups = context?.storeContext?.targetGroupStore?.data || [];
    const customers = context?.storeContext?.customerStore?.data || [];
    const suppliers = context?.storeContext?.supplierStore?.data || [];
    const employees = context?.storeContext?.employeeStore?.data || [];
    
    const defaultBranch = getDefaultBranch(branches);
    const defaultPaymentMethod = getDefaultPaymentMethod(paymentMethods);
    
    // Lookup entities
    const branch = findBranch(row.branchName as string, branches) || defaultBranch;
    const paymentType = findPaymentType(row.paymentReceiptTypeName as string, paymentTypes);
    const paymentMethod = findPaymentMethod(row.paymentMethodName as string, paymentMethods) || defaultPaymentMethod;
    const targetGroup = findTargetGroup(row.recipientTypeName as string, targetGroups);
    const recipient = findRecipient(row.recipientTypeName as string || '', row.recipientName as string || '', customers, suppliers, employees);
    
    return {
      systemId: asSystemId(''), // Will be generated
      id: asBusinessId(String(row.id || '').trim()),
      date: String(row.date || now.split('T')[0]),
      amount: Number(row.amount) || 0,
      
      recipientTypeSystemId: targetGroup?.systemId || asSystemId('KHAC'),
      recipientTypeName: targetGroup?.name || String(row.recipientTypeName || 'Khác'),
      recipientName: String(row.recipientName || '').trim(),
      recipientSystemId: recipient?.systemId,
      
      description: String(row.description || '').trim(),
      
      paymentMethodSystemId: paymentMethod?.systemId || asSystemId(''),
      paymentMethodName: paymentMethod?.name || String(row.paymentMethodName || 'Tiền mặt'),
      
      accountSystemId: asSystemId(''), // Cash account to be set later
      paymentReceiptTypeSystemId: paymentType?.systemId || asSystemId(''),
      paymentReceiptTypeName: paymentType?.name || String(row.paymentReceiptTypeName || ''),
      
      branchSystemId: branch?.systemId || asSystemId(''),
      branchName: branch?.name || '',
      
      createdBy: asSystemId(''),
      createdAt: now,
      
      status: (row.status as PaymentStatus) || 'completed',
      category: (row.category as PaymentCategory) || 'other',
    } as Payment;
  },
};
