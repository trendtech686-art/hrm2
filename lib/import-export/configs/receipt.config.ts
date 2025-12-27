/**
 * Receipt (Phiếu Thu) Import/Export Configuration
 * 
 * Nhập/Xuất phiếu thu
 */

import type { Receipt, ReceiptStatus, ReceiptCategory } from '@/lib/types/prisma-extended';
import type { ImportExportConfig, FieldConfig } from '@/lib/import-export/types';
import { useCustomerStore } from '@/features/customers/store';
import { useSupplierStore } from '@/features/suppliers/store';
import { useEmployeeStore } from '@/features/employees/store';
import { useBranchStore } from '@/features/settings/branches/store';
import { useReceiptTypeStore } from '@/features/settings/receipt-types/store';
import { usePaymentMethodStore } from '@/features/settings/payments/methods/store';
import { useTargetGroupStore } from '@/features/settings/target-groups/store';
import { asBusinessId, asSystemId } from '@/lib/id-types';

// ============================================
// HELPER FUNCTIONS
// ============================================

const getCustomerStore = () => useCustomerStore.getState();
const getSupplierStore = () => useSupplierStore.getState();
const getEmployeeStore = () => useEmployeeStore.getState();
const getBranchStore = () => useBranchStore.getState();
const getReceiptTypeStore = () => useReceiptTypeStore.getState();
const getPaymentMethodStore = () => usePaymentMethodStore.getState();
const getTargetGroupStore = () => useTargetGroupStore.getState();

const findBranch = (identifier: string) => {
  if (!identifier) return undefined;
  const store = getBranchStore();
  const normalized = identifier.trim().toLowerCase();
  
  const byId = store.data.find(b => b.id.toLowerCase() === normalized);
  if (byId) return byId;
  
  return store.data.find(b => b.name.toLowerCase().includes(normalized));
};

const getDefaultBranch = () => {
  const store = getBranchStore();
  return store.data.find(b => b.isDefault) || store.data[0];
};

const findReceiptType = (identifier: string) => {
  if (!identifier) return undefined;
  const store = getReceiptTypeStore();
  const normalized = identifier.trim().toLowerCase();
  
  return store.data.find(t => 
    t.id.toLowerCase() === normalized || 
    t.name.toLowerCase().includes(normalized)
  );
};

const findPaymentMethod = (identifier: string) => {
  if (!identifier) return undefined;
  const store = getPaymentMethodStore();
  const normalized = identifier.trim().toLowerCase();
  
  return store.data.find(m => 
    m.id.toLowerCase() === normalized || 
    m.name.toLowerCase().includes(normalized)
  );
};

const getDefaultPaymentMethod = () => {
  const store = getPaymentMethodStore();
  return store.data.find(m => m.isDefault) || store.data[0];
};

const findTargetGroup = (identifier: string) => {
  if (!identifier) return undefined;
  const store = getTargetGroupStore();
  const normalized = identifier.trim().toLowerCase();
  
  return store.data.find(g => 
    g.id.toLowerCase() === normalized || 
    g.name.toLowerCase().includes(normalized)
  );
};

const findPayer = (payerType: string, payerName: string) => {
  if (!payerName) return undefined;
  const normalized = payerName.trim().toLowerCase();
  
  if (payerType.includes('Khách hàng') || payerType === 'KHACHHANG') {
    const store = getCustomerStore();
    return store.data.find(c => 
      c.id.toLowerCase() === normalized || 
      c.name.toLowerCase().includes(normalized)
    );
  }
  
  if (payerType.includes('Nhà cung cấp') || payerType === 'NHACUNGCAP') {
    const store = getSupplierStore();
    return store.data.find(s => 
      s.id.toLowerCase() === normalized || 
      s.name.toLowerCase().includes(normalized)
    );
  }
  
  if (payerType.includes('Nhân viên') || payerType === 'NHANVIEN') {
    const store = getEmployeeStore();
    return store.data.find(e => 
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
  postTransformRow: (row) => {
    const now = new Date().toISOString();
    const defaultBranch = getDefaultBranch();
    const defaultPaymentMethod = getDefaultPaymentMethod();
    
    // Lookup entities
    const branch = findBranch(row.branchName as string) || defaultBranch;
    const receiptType = findReceiptType(row.paymentReceiptTypeName as string);
    const paymentMethod = findPaymentMethod(row.paymentMethodName as string) || defaultPaymentMethod;
    const targetGroup = findTargetGroup(row.payerTypeName as string);
    const payer = findPayer(row.payerTypeName as string || '', row.payerName as string || '');
    
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
