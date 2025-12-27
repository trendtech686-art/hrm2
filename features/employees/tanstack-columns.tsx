// TanStack React Table Implementation - Employees Page
// File: features/employees/tanstack-columns.tsx

import * as React from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '../../lib/date-utils';
import type { Employee } from '@/lib/types/prisma-extended';
import type { Branch } from '../settings/branches/types';
import { Checkbox } from '../../components/ui/checkbox';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  Pencil, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
  Calendar,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return '';
  return new Intl.NumberFormat('vi-VN').format(value);
};

export const createEmployeeColumns = (
  router: AppRouterInstance,
  onDelete: (systemId: string) => void,
  branches: Branch[]
): ColumnDef<Employee>[] => [
  // Checkbox Column
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Employee ID - Clickable (using systemId)
  {
    accessorKey: 'systemId',
    header: 'Mã NV',
    cell: info => (
      <Button
        variant="link"
        className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-800"
        onClick={() => router.push(`/employees/${info.row.original.systemId}`)}
      >
        {info.getValue() as string}
      </Button>
    ),
    enableSorting: true,
  },

  // Full Name with Avatar
  {
    accessorKey: 'fullName',
    header: 'Họ và tên',
    cell: info => {
      const employee = info.row.original;
      const initials = employee.fullName
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || '??';

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={employee.avatarUrl} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{info.getValue() as string}</span>
            {employee.workEmail && (
              <span className="text-xs text-muted-foreground">{employee.workEmail}</span>
            )}
          </div>
        </div>
      );
    },
    enableSorting: true,
  },

  // Gender
  {
    accessorKey: 'gender',
    header: 'Giới tính',
    cell: info => {
      const gender = info.getValue() as string;
      if (!gender) return '-';
      return gender === 'male' ? 'Nam' : gender === 'female' ? 'Nữ' : 'Khác';
    },
    enableSorting: true,
    filterFn: 'equals',
  },

  // Date of Birth
  {
    accessorKey: 'dateOfBirth',
    header: 'Ngày sinh',
    cell: info => {
      const date = info.getValue() as string;
      return date ? formatDate(date) : '-';
    },
    sortingFn: 'datetime',
    enableSorting: true,
  },

  // Phone
  {
    accessorKey: 'phone',
    header: 'Số điện thoại',
    cell: info => {
      const phone = info.getValue() as string;
      return phone ? (
        <a
          href={`tel:${phone}`}
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <Phone className="h-3 w-3" />
          {phone}
        </a>
      ) : '-';
    },
  },

  // Email
  {
    accessorKey: 'email',
    header: 'Email',
    cell: info => {
      const email = info.getValue() as string;
      return email ? (
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <Mail className="h-3 w-3" />
          {email}
        </a>
      ) : '-';
    },
    enableSorting: true,
  },

  // Branch
  {
    accessorKey: 'branchSystemId',
    header: 'Chi nhánh',
    cell: info => {
      const branchSystemId = info.getValue() as string;
      const branch = branches.find(b => b.systemId === branchSystemId);
      return branch ? (
        <div className="flex items-center gap-2">
          <Building2 className="h-3 w-3 text-muted-foreground" />
          <Badge variant="outline">{branch.name}</Badge>
        </div>
      ) : '-';
    },
    enableSorting: true,
    filterFn: 'equals',
  },

  // Department
  {
    accessorKey: 'department',
    header: 'Phòng ban',
    cell: info => {
      const dept = info.getValue() as string;
      return dept ? <Badge variant="secondary">{dept}</Badge> : '-';
    },
    enableSorting: true,
    filterFn: 'includesString',
  },

  // Job Title
  {
    accessorKey: 'jobTitle',
    header: 'Chức vụ',
    cell: info => (info.getValue() as string) || '-',
    enableSorting: true,
  },

  // Status
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: info => {
      const status = info.getValue() as string;
      
      const config = {
        active: { label: 'Đang làm', variant: 'default' as const },
        inactive: { label: 'Nghỉ việc', variant: 'secondary' as const },
        probation: { label: 'Thử việc', variant: 'outline' as const },
      };

      const statusConfig = config[status as keyof typeof config] || {
        label: status,
        variant: 'outline' as const,
      };

      return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>;
    },
    filterFn: 'equals',
    enableSorting: true,
  },

  // Hire Date
  {
    accessorKey: 'hireDate',
    header: 'Ngày vào',
    cell: info => {
      const date = info.getValue() as string;
      return date ? (
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          {formatDate(date)}
        </div>
      ) : '-';
    },
    sortingFn: 'datetime',
    enableSorting: true,
  },

  // Salary
  {
    accessorKey: 'salary',
    header: 'Lương',
    cell: info => {
      const salary = info.getValue() as number;
      return salary ? (
        <span className="font-mono text-sm">
          {formatCurrency(salary)} đ
        </span>
      ) : '-';
    },
    enableSorting: true,
  },

  // Actions
  {
    id: 'actions',
    header: 'Thao tác',
    cell: ({ row }) => {
      const employee = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Mở menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => router.push(`/employees/${employee.systemId}`)}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/employees/${employee.systemId}/edit`)}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(employee.systemId)}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
