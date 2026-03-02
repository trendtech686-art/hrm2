import * as React from 'react';
import { formatDateForDisplay } from '@/lib/date-utils';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ColumnDef } from '@/components/data-table/types';
import type { PayrollTemplate } from '@/lib/payroll-types';
import type { SystemId } from '@/lib/id-types';

type PayrollTemplateHandlers = {
  onEdit: (systemId: SystemId) => void;
  onDelete: (systemId: SystemId) => void;
  onToggleDefault: (template: PayrollTemplate, isDefault: boolean) => void;
  isPending?: boolean;
};

export function getPayrollTemplateColumns(handlers: PayrollTemplateHandlers): ColumnDef<PayrollTemplate>[] {
  return [
    {
      id: 'id',
      accessorKey: 'id',
      header: 'Mã mẫu',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">{row.id}</span>
      ),
      size: 120,
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Tên mẫu',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.name}</p>
          {row.description && (
            <p className="text-xs text-muted-foreground line-clamp-1">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      id: 'componentCount',
      header: 'Số thành phần',
      cell: ({ row }) => (
        <span className="text-center">{row.componentSystemIds.length} thành phần</span>
      ),
      size: 120,
    },
    {
      id: 'isDefault',
      header: 'Mặc định',
      cell: ({ row }) => (
        <Switch
          checked={row.isDefault}
          onCheckedChange={(checked) => handlers.onToggleDefault(row, checked)}
          disabled={handlers.isPending}
          aria-label={row.isDefault ? 'Đang là mẫu mặc định' : 'Đặt làm mẫu mặc định'}
        />
      ),
      size: 100,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: 'Ngày tạo',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.createdAt ? formatDateForDisplay(row.createdAt) : '—'}
        </span>
      ),
      size: 120,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handlers.onEdit(row.systemId)}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handlers.onDelete(row.systemId)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa mẫu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      size: 80,
      meta: { displayName: '', sticky: 'right' },
    },
  ];
}
