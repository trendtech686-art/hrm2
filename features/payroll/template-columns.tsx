import * as React from 'react';
import { Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '../../components/ui/button.tsx';
import { Checkbox } from '../../components/ui/checkbox.tsx';
import { Switch } from '../../components/ui/switch.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu.tsx';
import type { ColumnDef } from '../../components/data-table/types.ts';
import type { PayrollTemplate } from '../../lib/payroll-types.ts';
import type { SystemId } from '../../lib/id-types.ts';
import { formatDateForDisplay } from '@/lib/date-utils';

const formatComponentCount = (count: number) => `${count} thành phần`;

const formatDate = (dateString?: string) => {
  if (!dateString) return '—';
  return formatDateForDisplay(dateString);
};

export const getTemplateColumns = (
  onEdit: (systemId: SystemId) => void,
  onDelete: (systemId: SystemId) => void,
  onToggleDefault: (template: PayrollTemplate, isDefault: boolean) => void
): ColumnDef<PayrollTemplate>[] => [
  // Select column - sticky left
  {
    id: 'select',
    size: 48,
    meta: {
      displayName: 'Chọn',
      sticky: 'left',
    },
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
      <Checkbox
        checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? 'indeterminate' : false}
        onCheckedChange={(value) => onToggleAll?.(!!value)}
        aria-label="Chọn tất cả"
        className="h-4 w-4"
      />
    ),
    cell: ({ onToggleSelect, isSelected }) => (
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggleSelect}
        aria-label="Chọn dòng này"
        className="h-4 w-4"
      />
    ),
  },
  // ID column
  {
    id: 'id',
    accessorKey: 'id',
    size: 120,
    meta: {
      displayName: 'Mã mẫu',
    },
    header: 'Mã mẫu',
    cell: ({ row }) => (
      <span className="font-mono text-body-xs text-muted-foreground">
        {row.id}
      </span>
    ),
  },
  // Name column
  {
    id: 'name',
    accessorKey: 'name',
    size: 250,
    meta: {
      displayName: 'Tên mẫu',
    },
    header: 'Tên mẫu',
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.name}</p>
        {row.description && (
          <p className="text-body-xs text-muted-foreground line-clamp-1">
            {row.description}
          </p>
        )}
      </div>
    ),
  },
  // Component count column
  {
    id: 'componentCount',
    accessorKey: 'componentSystemIds',
    size: 130,
    meta: {
      displayName: 'Số thành phần',
    },
    header: 'Số thành phần',
    cell: ({ row }) => (
      <span className="text-body-sm">
        {formatComponentCount(row.componentSystemIds.length)}
      </span>
    ),
  },
  // Default column - Switch toggle
  {
    id: 'isDefault',
    accessorKey: 'isDefault',
    size: 140,
    meta: {
      displayName: 'Mặc định',
    },
    header: 'Mặc định',
    cell: ({ row }) => (
      <div className="flex items-center">
        <Switch
          checked={row.isDefault}
          onCheckedChange={(checked) => onToggleDefault(row, checked)}
          aria-label={row.isDefault ? 'Đang là mẫu mặc định' : 'Đặt làm mẫu mặc định'}
        />
      </div>
    ),
  },
  // Created at column
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    size: 150,
    meta: {
      displayName: 'Ngày tạo',
    },
    header: 'Ngày tạo',
    cell: ({ row }) => (
      <span className="text-body-xs text-muted-foreground">
        {formatDate(row.createdAt)}
      </span>
    ),
  },
  // Actions column - sticky right with DropdownMenu
  {
    id: 'actions',
    size: 80,
    meta: {
      displayName: 'Hành động',
      sticky: 'right',
    },
    header: () => <div className="text-center">Hành động</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row.systemId);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row.systemId);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa mẫu
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
