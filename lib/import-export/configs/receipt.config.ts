/**
 * Receipt (Phiếu Thu) Import/Export Configuration
 * 
 * Nhập/Xuất phiếu thu
 */

import type { Receipt, ReceiptStatus, ReceiptCategory } from '@/lib/types/prisma-extended';
import type { ImportExportConfig, FieldConfig } from '@/lib/import-export/types';
import type { Customer, Supplier, Employee, Branch, ReceiptType, PaymentMethod, TargetGroup } from '@/lib/types/prisma-extended';
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

const findReceiptType = (identifier: string, receiptTypes: ReceiptType[]) => {
  if (!identifier || !receiptTypes) return undefined;
  const normalized = identifier.trim().toLowerCase();
  
  return receiptTypes.find(t => 
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

const findPayer = (payerType: string, payerName: string, customers: Customer[], suppliers: Supplier[], employees: Employee[]) => {
  if (!payerName) return undefined;
  const normalized = payerName.trim().toLowerCase();
  
  if ((payerType.includes('Khách hàng') || payerType === 'KHACHHANG') && customers) {
    return customers.find(c => 
      c.id.toLowerCase() === normalized || 
      c.name.toLowerCase().includes(normalized)
    );
  }
  
  if ((payerType.includes('Nhà cung cấp') || payerType === 'NHACUNGCAP') && suppliers) {
    return suppliers.find(s => 
      s.id.toLowerCase() === normalized || 
      s.name.toLowerCase().includes(normalized)
    );
  }
  
  if ((payerType.includes('Nhân viên') || payerType === 'NHANVIEN') && employees) {
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

export const receiptFields: FieldConfig<Receipt>[] = [
  {
    key: 'id',
    label: 'Mã phiếu (*)',
    type: 'string',
    required: true,
    example: 'PT001',
    group: 'Thông tin phiếu',
    defaultSelected: true,
  },
  {
    key: 'date',
    label: 'Ngày thu (*)',
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
    example: 'Thu tiền bán hàng',
    group: 'Thông tin phiếu',
    defaultSelected: true,
  },
  {
    key: 'payerTypeName' as keyof Receipt,
    label: 'Loại đối tượng (*)',
    type: 'string',
    required: true,
    example: 'Khách hàng',
    group: 'Đối tượng',
    defaultSelected: true,
  },
  {
    key: 'payerName',
    label: 'Người nộp (*)',
    type: 'string',
    required: true,
    example: 'Nguyễn Văn A',
    group: 'Đối tượng',
    defaultSelected: true,
  },
  {
    key: 'paymentReceiptTypeName',
    label: 'Loại phiếu thu (*)',
    type: 'string',
    required: true,
    example: 'Thu tiền khách hàng',
    group: 'Phân loại',
    defaultSelected: true,
  },
  {
    key: 'paymentMethodName',
    label: 'Phương thức TT',
    type: 'string',
    required: false,
    example: 'Tiền mặt',
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

export const receiptImportExportConfig: ImportExportConfig<Receipt> = {
  entityType: 'receipts',
  entityDisplayName: 'Phiếu thu',
  
  fields: receiptFields,
  
  templateFileName: 'Mau_Phieu_Thu.xlsx',
  sheetName: 'PhieuThu',
  
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
    const receipt = row as Partial<Receipt>;
    
    if (!receipt.id?.toString().trim()) {
      errors.push({ field: 'id', message: 'Mã phiếu không được để trống' });
    }
    
    if (!receipt.date) {
      errors.push({ field: 'date', message: 'Ngày thu không được để trống' });
    }
    
    if (!receipt.amount || receipt.amount <= 0) {
      errors.push({ field: 'amount', message: 'Số tiền phải lớn hơn 0' });
    }
    
    if (!receipt.description?.trim()) {
      errors.push({ field: 'description', message: 'Diễn giải không được để trống' });
    }
    
    if (!receipt.payerTypeName) {
      errors.push({ field: 'payerTypeName', message: 'Loại đối tượng không được để trống' });
    }
    
    if (!receipt.payerName?.trim()) {
      errors.push({ field: 'payerName', message: 'Người nộp không được để trống' });
    }
    
    if (!receipt.paymentReceiptTypeName) {
      errors.push({ field: 'paymentReceiptTypeName', message: 'Loại phiếu thu không được để trống' });
    }
    
    // Check duplicate
    if (mode === 'insert-only' && receipt.id) {
      const duplicate = existingData.find(r => 
        r.id.toString().toUpperCase() === receipt.id!.toString().toUpperCase()
      );
      if (duplicate) {
        errors.push({ field: 'id', message: `Mã phiếu "${receipt.id}" đã tồn tại` });
      }
    }
    
    return errors;
  },
  
  // Transform row to Receipt object
  postTransformRow: (row, _index, context) => {
    const ctx = context as { storeContext?: { branchStore?: { data: Branch[] }; receiptTypeStore?: { data: ReceiptType[] }; paymentMethodStore?: { data: PaymentMethod[] }; targetGroupStore?: { data: TargetGroup[] }; customerStore?: { data: Customer[] }; supplierStore?: { data: Supplier[] }; employeeStore?: { data: Employee[] } } } | undefined;
    const now = new Date().toISOString();
    
    // Get data from context
    const branches = ctx?.storeContext?.branchStore?.data || [];
    const receiptTypes = ctx?.storeContext?.receiptTypeStore?.data || [];
    const paymentMethods = ctx?.storeContext?.paymentMethodStore?.data || [];
    const targetGroups = ctx?.storeContext?.targetGroupStore?.data || [];
    const customers = ctx?.storeContext?.customerStore?.data || [];
    const suppliers = ctx?.storeContext?.supplierStore?.data || [];
    const employees = ctx?.storeContext?.employeeStore?.data || [];
    
    const defaultBranch = getDefaultBranch(branches);
    const defaultPaymentMethod = getDefaultPaymentMethod(paymentMethods);
    
    // Lookup entities
    const branch = findBranch(row.branchName as string, branches) || defaultBranch;
    const receiptType = findReceiptType(row.paymentReceiptTypeName as string, receiptTypes);
    const paymentMethod = findPaymentMethod(row.paymentMethodName as string, paymentMethods) || defaultPaymentMethod;
    const targetGroup = findTargetGroup(row.payerTypeName as string, targetGroups);
    const payer = findPayer(row.payerTypeName as string || '', row.payerName as string || '', customers, suppliers, employees);
    
    return {
      systemId: asSystemId(''), // Will be generated
      id: asBusinessId(String(row.id || '').trim()),
      date: String(row.date || now.split('T')[0]),
      amount: Number(row.amount) || 0,
      
      payerTypeSystemId: targetGroup?.systemId || asSystemId('KHAC'),
      payerTypeName: targetGroup?.name || String(row.payerTypeName || 'Khác'),
      payerName: String(row.payerName || '').trim(),
      payerSystemId: payer?.systemId,
      
      description: String(row.description || '').trim(),
      
      paymentMethodSystemId: paymentMethod?.systemId || asSystemId(''),
      paymentMethodName: paymentMethod?.name || String(row.paymentMethodName || 'Tiền mặt'),
      
      accountSystemId: asSystemId(''), // Cash account to be set later
      paymentReceiptTypeSystemId: receiptType?.systemId || asSystemId(''),
      paymentReceiptTypeName: receiptType?.name || String(row.paymentReceiptTypeName || ''),
      
      branchSystemId: branch?.systemId || asSystemId(''),
      branchName: branch?.name || '',
      
      createdBy: asSystemId(''),
      createdAt: now,
      
      status: (row.status as ReceiptStatus) || 'completed',
      category: (row.category as ReceiptCategory) || 'other',
    } as Receipt;
  },
};
