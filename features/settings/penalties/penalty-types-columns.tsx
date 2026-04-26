import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ColumnDef } from '@/components/data-table/types';
import type { PenaltyTypeSetting } from '../penalty-types/hooks/use-penalty-types';
import type { PenaltyCategory } from './types';
import { penaltyCategoryLabels, penaltyCategoryColors } from './types';

type PenaltyTypeHandlers = {
  onEdit: (type: PenaltyTypeSetting) => void;
  onDelete: (type: PenaltyTypeSetting) => void;
  onToggleActive: (type: PenaltyTypeSetting) => void;
};

export function getPenaltyTypeColumns(handlers: PenaltyTypeHandlers): ColumnDef<PenaltyTypeSetting>[] {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Tên loại phạt',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.name}</p>
          {row.description && (
            <p className="text-xs text-muted-foreground">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      id: 'category',
      accessorKey: 'category',
      header: 'Phân loại',
      cell: ({ row }) => (
        <Badge 
          variant="outline" 
          className={penaltyCategoryColors[row.category as PenaltyCategory]}
        >
          {penaltyCategoryLabels[row.category as PenaltyCategory]}
        </Badge>
      ),
      size: 120,
    },
    {
      id: 'defaultAmount',
      accessorKey: 'defaultAmount',
      header: () => <div className="text-right">Mức phạt mặc định</div>,
      cell: ({ row }) => (
        <span className="text-right font-medium block">
          {row.defaultAmount.toLocaleString('vi-VN')}đ
        </span>
      ),
      size: 150,
    },
    {
      id: 'isActive',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <Switch
          checked={row.isActive}
          onCheckedChange={() => handlers.onToggleActive(row)}
        />
      ),
      size: 100,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-11 w-11" aria-label="Thao tác">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handlers.onEdit(row)}>
              <Pencil className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handlers.onDelete(row)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 60,
      meta: { displayName: '', sticky: 'right' },
    },
  ];
}
