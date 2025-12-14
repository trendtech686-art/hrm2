/**
 * Shared Employee Column Factories
 * 
 * This module provides reusable column definitions for employee tables.
 * Used by both regular columns.tsx and trash-columns.tsx to reduce duplication.
 */

import * as React from "react";
import { formatDateCustom } from '../../lib/date-utils.ts';
import type { Employee } from './types.ts';
import type { Branch } from "../settings/branches/types.ts";
import { Checkbox } from "../../components/ui/checkbox.tsx";
import { DataTableColumnHeader } from "../../components/data-table/data-table-column-header.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import type { ColumnDef } from '../../components/data-table/types.ts';

// ============================================
// Utility Functions
// ============================================

export const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return '';
  return new Intl.NumberFormat('vi-VN').format(value);
};

export const formatDateDisplay = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return formatDateCustom(date, "dd/MM/yyyy");
};

export const formatAddress = (address: any): string => {
  if (!address) return '';
  if (typeof address === 'string') return address;
  
  const parts = [
    address.street,
    address.ward,
    address.district,
    address.province
  ].filter(Boolean);
  
  return parts.join(', ');
};

// ============================================
// Base Column Factories
// ============================================

/**
 * Create select checkbox column
 */
export const createSelectColumn = (): ColumnDef<Employee> => ({
  id: "select",
  header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
    <Checkbox
      checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
      onCheckedChange={(value) => onToggleAll?.(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ onToggleSelect, isSelected }) => (
    <Checkbox
      checked={isSelected}
      onCheckedChange={onToggleSelect}
      aria-label="Select row"
    />
  ),
  size: 48,
  meta: {
    displayName: "Chọn",
    sticky: "left",
  }
});

/**
 * Create employee ID column
 */
export const createIdColumn = (): ColumnDef<Employee> => ({
  id: "id",
  accessorKey: "id",
  header: ({ sorting, setSorting }) => (
    <DataTableColumnHeader 
      title="Mã NV"
      sortKey="id"
      isSorted={sorting?.id === 'id'}
      sortDirection={sorting?.desc ? 'desc' : 'asc'}
      onSort={() => setSorting?.((s: any) => ({ id: 'id', desc: s.id === 'id' ? !s.desc : false }))}
    />
  ),
  cell: ({ row }) => <span className="font-mono">{row.id}</span>,
  meta: {
    displayName: "Mã NV",
    group: "Thông tin cơ bản"
  },
});

/**
 * Create full name column
 */
export const createFullNameColumn = (): ColumnDef<Employee> => ({
  id: "fullName",
  accessorKey: "fullName",
  header: ({ sorting, setSorting }) => (
    <DataTableColumnHeader 
      title="Họ và tên"
      sortKey="fullName"
      isSorted={sorting?.id === 'fullName'}
      sortDirection={sorting?.desc ? 'desc' : 'asc'}
      onSort={() => setSorting?.((s: any) => ({ id: 'fullName', desc: s.id === 'fullName' ? !s.desc : false }))}
    />
  ),
  cell: ({ row }) => (
    <div className="max-w-[200px] truncate" title={row.fullName}>
      {row.fullName}
    </div>
  ),
  meta: {
    displayName: "Họ và tên",
    group: "Thông tin cá nhân"
  },
});

/**
 * Create gender column
 */
export const createGenderColumn = (): ColumnDef<Employee> => ({
  id: "gender",
  accessorKey: "gender",
  header: "Giới tính",
  cell: ({ row }) => row.gender,
  meta: {
    displayName: "Giới tính",
    group: "Thông tin cá nhân"
  },
});

/**
 * Create department column
 */
export const createDepartmentColumn = (): ColumnDef<Employee> => ({
  id: "department",
  accessorKey: "department",
  header: "Phòng ban",
  cell: ({ row }) => row.department || '-',
  meta: {
    displayName: "Phòng ban",
    group: "Thông tin công việc"
  },
});

/**
 * Create job title column
 */
export const createJobTitleColumn = (): ColumnDef<Employee> => ({
  id: "jobTitle",
  accessorKey: "jobTitle",
  header: "Chức danh",
  cell: ({ row }) => row.jobTitle || '-',
  meta: {
    displayName: "Chức danh",
    group: "Thông tin công việc"
  },
});

/**
 * Create branch column
 */
export const createBranchColumn = (branches: Branch[]): ColumnDef<Employee> => ({
  id: "branchSystemId",
  accessorKey: "branchSystemId",
  header: "Chi nhánh",
  cell: ({ row }) => {
    const branch = branches.find(b => b.systemId === row.branchSystemId);
    return branch?.name || row.branchSystemId || '-';
  },
  meta: {
    displayName: "Chi nhánh",
    group: "Thông tin công việc"
  },
});

/**
 * Create employment status column
 */
export const createEmploymentStatusColumn = (): ColumnDef<Employee> => ({
  id: "employmentStatus",
  accessorKey: "employmentStatus",
  header: "Trạng thái",
  cell: ({ row }) => {
    const status = row.employmentStatus;
    const variant = status === "Đang làm việc" ? "default" :
                    status === "Tạm nghỉ" ? "secondary" : "destructive";
    return <Badge variant={variant} className="text-body-xs">{status}</Badge>;
  },
  meta: {
    displayName: "Trạng thái",
    group: "Thông tin công việc"
  },
});

/**
 * Create phone column
 */
export const createPhoneColumn = (): ColumnDef<Employee> => ({
  id: "phone",
  accessorKey: "phone",
  header: "Điện thoại",
  cell: ({ row }) => row.phone || '-',
  meta: {
    displayName: "Điện thoại",
    group: "Thông tin liên hệ"
  },
});

/**
 * Create work email column
 */
export const createWorkEmailColumn = (): ColumnDef<Employee> => ({
  id: "workEmail",
  accessorKey: "workEmail",
  header: "Email công việc",
  cell: ({ row }) => (
    <div className="max-w-[180px] truncate" title={row.workEmail}>
      {row.workEmail || '-'}
    </div>
  ),
  meta: {
    displayName: "Email công việc",
    group: "Thông tin liên hệ"
  },
});

/**
 * Create hire date column
 */
export const createHireDateColumn = (): ColumnDef<Employee> => ({
  id: "hireDate",
  accessorKey: "hireDate",
  header: "Ngày vào làm",
  cell: ({ row }) => formatDateDisplay(row.hireDate),
  meta: {
    displayName: "Ngày vào làm",
    group: "Thông tin công việc"
  },
});

/**
 * Create base salary column
 */
export const createBaseSalaryColumn = (): ColumnDef<Employee> => ({
  id: "baseSalary",
  accessorKey: "baseSalary",
  header: "Lương cơ bản",
  cell: ({ row }) => formatCurrency(row.baseSalary),
  meta: {
    displayName: "Lương cơ bản",
    group: "Lương & Phụ cấp"
  },
});

/**
 * Create deleted at column (for trash view)
 */
export const createDeletedAtColumn = (): ColumnDef<Employee> => ({
  id: "deletedAt",
  accessorKey: "deletedAt",
  header: ({ sorting, setSorting }) => (
    <DataTableColumnHeader 
      title="Ngày xóa"
      sortKey="deletedAt"
      isSorted={sorting?.id === 'deletedAt'}
      sortDirection={sorting?.desc ? 'desc' : 'asc'}
      onSort={() => setSorting?.((s: any) => ({ id: 'deletedAt', desc: s.id === 'deletedAt' ? !s.desc : false }))}
    />
  ),
  cell: ({ row }) => formatDateDisplay(row.deletedAt || undefined),
  meta: {
    displayName: "Ngày xóa",
    group: "Thông tin xóa"
  },
});

// ============================================
// Column Set Helpers
// ============================================

/**
 * Get base columns shared between regular and trash views
 */
export const getBaseColumns = (branches: Branch[]): ColumnDef<Employee>[] => [
  createSelectColumn(),
  createIdColumn(),
  createFullNameColumn(),
  createDepartmentColumn(),
  createJobTitleColumn(),
  createBranchColumn(branches),
  createEmploymentStatusColumn(),
];

/**
 * Get personal info columns
 */
export const getPersonalInfoColumns = (): ColumnDef<Employee>[] => [
  createGenderColumn(),
  createPhoneColumn(),
  createWorkEmailColumn(),
];

/**
 * Get employment columns
 */
export const getEmploymentColumns = (): ColumnDef<Employee>[] => [
  createHireDateColumn(),
  createBaseSalaryColumn(),
];
