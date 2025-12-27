/**
 * Supplier Import/Export Configuration
 * 
 * Nhập/Xuất danh sách nhà cung cấp
 */

import type { Supplier, SupplierStatus } from '@/lib/types/prisma-extended';
import type { ImportExportConfig, FieldConfig } from '@/lib/import-export/types';
import { asBusinessId, asSystemId } from '@/lib/id-types';

// ============================================
// FIELD CONFIGURATION
// ============================================

export const supplierFields: FieldConfig<Supplier>[] = [
  // Thông tin cơ bản
  {
    key: 'id',
    label: 'Mã NCC (*)',
    type: 'string',
    required: true,
    example: 'NCC001',
    group: 'Thông tin cơ bản',
    defaultSelected: true,
  },
  {
    key: 'name',
    label: 'Tên nhà cung cấp (*)',
    type: 'string',
    required: true,
    example: 'Công ty ABC',
    group: 'Thông tin cơ bản',
    defaultSelected: true,
  },
  {
    key: 'taxCode',
    label: 'Mã số thuế',
    type: 'string',
    required: false,
    example: '0123456789',
    group: 'Thông tin cơ bản',
    defaultSelected: true,
  },
  {
    key: 'status',
    label: 'Trạng thái',
    type: 'string',
    required: false,
    example: 'Đang Giao Dịch',
    group: 'Thông tin cơ bản',
    defaultSelected: true,
  },
  
  // Liên hệ
  {
    key: 'phone',
    label: 'Số điện thoại (*)',
    type: 'string',
    required: true,
    example: '0901234567',
    group: 'Liên hệ',
    defaultSelected: true,
  },
  {
    key: 'email',
    label: 'Email (*)',
    type: 'string',
    required: true,
    example: 'contact@abc.com',
    group: 'Liên hệ',
    defaultSelected: true,
  },
  {
    key: 'address',
    label: 'Địa chỉ (*)',
    type: 'string',
    required: true,
    example: '123 Nguyễn Huệ, Q1, TP.HCM',
    group: 'Liên hệ',
    defaultSelected: true,
  },
  {
    key: 'website',
    label: 'Website',
    type: 'string',
    required: false,
    example: 'https://abc.com',
    group: 'Liên hệ',
  },
  {
    key: 'contactPerson',
    label: 'Người liên hệ',
    type: 'string',
    required: false,
    example: 'Nguyễn Văn A',
    group: 'Liên hệ',
  },
  
  // Ngân hàng
  {
    key: 'bankAccount',
    label: 'Số tài khoản',
    type: 'string',
    required: false,
    example: '123456789012',
    group: 'Ngân hàng',
  },
  {
    key: 'bankName',
    label: 'Tên ngân hàng',
    type: 'string',
    required: false,
    example: 'Vietcombank',
    group: 'Ngân hàng',
  },
  
  // Khác
  {
    key: 'accountManager',
    label: 'Nhân viên phụ trách',
    type: 'string',
    required: false,
    example: 'Trần Văn B',
    group: 'Khác',
  },
  {
    key: 'currentDebt',
    label: 'Công nợ hiện tại',
    type: 'number',
    required: false,
    example: '0',
    group: 'Khác',
  },
  {
    key: 'notes',
    label: 'Ghi chú',
    type: 'string',
    required: false,
    example: 'NCC uy tín',
    group: 'Khác',
  },
];

// ============================================
// MAIN CONFIG
// ============================================

export const supplierImportExportConfig: ImportExportConfig<Supplier> = {
  entityType: 'suppliers',
  entityDisplayName: 'Nhà cung cấp',
  
  fields: supplierFields,
  
  templateFileName: 'Mau_Nha_Cung_Cap.xlsx',
  sheetName: 'NhaCungCap',
  
  // Import settings
  upsertKey: 'id',
  allowUpdate: true,
  allowInsert: true,
  
  requirePreview: true,
  maxRows: 1000,
  maxErrorsAllowed: 0,
  
  // Validate each row
  validateRow: (row, _index, existingData, mode) => {
    const errors: Array<{ field?: string; message: string }> = [];
    const supplier = row as Partial<Supplier>;
    
    // Mã NCC bắt buộc
    if (!supplier.id?.toString().trim()) {
      errors.push({ field: 'id', message: 'Mã NCC không được để trống' });
    }
    
    // Tên NCC bắt buộc
    if (!supplier.name?.trim()) {
      errors.push({ field: 'name', message: 'Tên NCC không được để trống' });
    }
    
    // SĐT bắt buộc
    if (!supplier.phone?.trim()) {
      errors.push({ field: 'phone', message: 'Số điện thoại không được để trống' });
    }
    
    // Email bắt buộc
    if (!supplier.email?.trim()) {
      errors.push({ field: 'email', message: 'Email không được để trống' });
    }
    
    // Địa chỉ bắt buộc
    if (!supplier.address?.trim()) {
      errors.push({ field: 'address', message: 'Địa chỉ không được để trống' });
    }
    
    // Validate email format
    if (supplier.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplier.email)) {
      errors.push({ field: 'email', message: 'Email không hợp lệ' });
    }
    
    // Check duplicate id
    if (mode === 'insert-only' && supplier.id) {
      const duplicate = existingData.find(s => 
        s.id.toString().toUpperCase() === supplier.id!.toString().toUpperCase()
      );
      if (duplicate) {
        errors.push({ field: 'id', message: `Mã NCC "${supplier.id}" đã tồn tại` });
      }
    }
    
    // Validate status
    const validStatuses: SupplierStatus[] = ['Đang Giao Dịch', 'Ngừng Giao Dịch'];
    if (supplier.status && !validStatuses.includes(supplier.status as SupplierStatus)) {
      errors.push({ field: 'status', message: `Trạng thái không hợp lệ. Chọn: ${validStatuses.join(', ')}` });
    }
    
    return errors;
  },
  
  // Transform row to Supplier object
  postTransformRow: (row) => {
    const now = new Date().toISOString();
    
    return {
      systemId: asSystemId(''), // Will be generated
      id: asBusinessId(String(row.id || '').trim()),
      name: String(row.name || '').trim(),
      taxCode: String(row.taxCode || '').trim(),
      phone: String(row.phone || '').trim(),
      email: String(row.email || '').trim(),
      address: String(row.address || '').trim(),
      website: row.website ? String(row.website).trim() : undefined,
      contactPerson: row.contactPerson ? String(row.contactPerson).trim() : undefined,
      bankAccount: row.bankAccount ? String(row.bankAccount).trim() : undefined,
      bankName: row.bankName ? String(row.bankName).trim() : undefined,
      accountManager: String(row.accountManager || '').trim(),
      status: (row.status as SupplierStatus) || 'Đang Giao Dịch',
      currentDebt: Number(row.currentDebt) || 0,
      notes: row.notes ? String(row.notes).trim() : undefined,
      createdAt: now,
      updatedAt: now,
    } as Supplier;
  },
};
