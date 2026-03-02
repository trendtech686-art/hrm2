import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Edit, Copy, RotateCcw, Trash2, Users } from 'lucide-react';
import type { ColumnDef } from '@/components/data-table/types';
import type { CustomRole } from './hooks/use-role-settings';

type RoleHandlers = {
  onEditInfo: (role: CustomRole) => void;
  onDuplicate: (role: CustomRole) => void;
  onEditPermissions: (role: CustomRole) => void;
  onReset: (roleId: string) => void;
  onDelete: (role: CustomRole) => void;
  employeeCountByRole: Record<string, number>;
};

export function getRoleColumns(handlers: RoleHandlers): ColumnDef<CustomRole>[] {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Tên vai trò',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
      size: 200,
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: 'Mô tả',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.description}</span>
      ),
      size: 250,
    },
    {
      id: 'permissionCount',
      header: 'Số quyền',
      cell: ({ row }) => (
        <Badge variant="outline">{row.permissions.length}</Badge>
      ),
      size: 100,
    },
    {
      id: 'employeeCount',
      header: 'Nhân viên',
      cell: ({ row }) => (
        <Badge variant="secondary">
          <Users className="h-3 w-3 mr-1" />
          {handlers.employeeCountByRole[row.id] || 0}
        </Badge>
      ),
      size: 120,
    },
    {
      id: 'type',
      header: 'Loại',
      cell: ({ row }) => (
        row.isDefault ? (
          <Badge variant="outline" className="text-xs">Mặc định</Badge>
        ) : (
          <Badge variant="secondary" className="text-xs">Tùy chỉnh</Badge>
        )
      ),
      size: 100,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlers.onEditInfo(row)}
            title="Sửa thông tin"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlers.onDuplicate(row)}
            title="Sao chép"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary"
            onClick={() => handlers.onEditPermissions(row)}
            title="Phân quyền"
          >
            <Shield className="h-4 w-4" />
          </Button>
          {row.isDefault ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => handlers.onReset(row.id)}
              title="Khôi phục mặc định"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => handlers.onDelete(row)}
              title="Xóa vai trò"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
      size: 180,
      meta: { displayName: 'Thao tác', sticky: 'right' },
    },
  ];
}
