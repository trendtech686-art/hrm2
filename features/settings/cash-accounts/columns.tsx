import * as React from 'react';
import type { CashAccount } from '../../cashbook/types';
import type { ColumnDef } from '@/components/data-table/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { SystemId } from '@/lib/id-types';

const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

interface CashAccountWithBalance extends CashAccount {
  currentBalance: number;
  isLowBalance?: boolean;
  isHighBalance?: boolean;
}

interface ColumnOptions {
  onEdit: (item: CashAccount) => void;
  onDelete: (systemId: SystemId) => void;
  onToggleStatus: (item: CashAccount, isActive: boolean) => void;
  onToggleDefault: (item: CashAccount, isDefault: boolean) => void;
  onSetDefault: (item: CashAccount) => void;
  getBranchName: (branchSystemId?: string) => string;
}

export const getCashAccountColumns = ({
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleDefault,
  onSetDefault,
  getBranchName,
}: ColumnOptions): ColumnDef<CashAccountWithBalance>[] => [
  {
    id: 'id',
    header: 'Mã tài khoản',
    cell: ({ row }) => <span className="font-medium">{row.id}</span>,
    meta: { displayName: 'Mã tài khoản' }
  },
  {
    id: 'name',
    header: 'Tên tài khoản',
    cell: ({ row }) => <span className="font-medium">{row.name}</span>,
    meta: { displayName: 'Tên tài khoản' }
  },
  {
    id: 'type',
    header: 'Loại',
    size: 100,
    cell: ({ row }) => (
      <Badge variant={row.type === 'cash' ? 'default' : 'secondary'}>
        {row.type === 'cash' ? 'Tiền mặt' : 'Ngân hàng'}
      </Badge>
    ),
    meta: { displayName: 'Loại' }
  },
  {
    id: 'bankInfo',
    header: 'Ngân hàng',
    cell: ({ row }) => {
      if (row.type === 'bank' && row.bankName) {
        return (
          <div>
            <div className="font-medium">{row.bankName}</div>
            {row.bankAccountNumber && (
              <div className="text-xs text-muted-foreground">{row.bankAccountNumber}</div>
            )}
          </div>
        );
      }
      return <span className="text-muted-foreground">—</span>;
    },
    meta: { displayName: 'Ngân hàng' }
  },
  {
    id: 'branch',
    header: 'Chi nhánh',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {getBranchName(row.branchSystemId) || '—'}
      </span>
    ),
    meta: { displayName: 'Chi nhánh' }
  },
  {
    id: 'balance',
    header: () => <div className="text-right">Số dư hiện tại</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <div className={`font-medium ${row.isLowBalance ? 'text-orange-600' : row.isHighBalance ? 'text-red-600' : ''}`}>
          {formatCurrency(row.currentBalance)}
        </div>
      </div>
    ),
    meta: { displayName: 'Số dư hiện tại' }
  },
  {
    id: 'minBalance',
    header: () => <div className="text-right">Tối thiểu</div>,
    cell: ({ row }) => (
      <div className="text-right text-muted-foreground">
        {row.minBalance ? formatCurrency(row.minBalance) : '—'}
      </div>
    ),
    meta: { displayName: 'Tối thiểu' }
  },
  {
    id: 'maxBalance',
    header: () => <div className="text-right">Tối đa</div>,
    cell: ({ row }) => (
      <div className="text-right text-muted-foreground">
        {row.maxBalance ? formatCurrency(row.maxBalance) : '—'}
      </div>
    ),
    meta: { displayName: 'Tối đa' }
  },
  {
    id: 'isDefault',
    header: 'Mặc định',
    size: 100,
    cell: ({ row }) => (
      <Switch
        checked={row.isDefault ?? false}
        onCheckedChange={(checked) => onToggleDefault(row, checked)}
      />
    ),
    meta: { displayName: 'Mặc định' }
  },
  {
    id: 'isActive',
    header: 'Trạng thái',
    size: 100,
    cell: ({ row }) => (
      <Switch
        checked={row.isActive ?? true}
        onCheckedChange={(checked) => onToggleStatus(row, checked)}
      />
    ),
    meta: { displayName: 'Trạng thái' }
  },
  {
    id: 'actions',
    header: '',
    size: 80,
    cell: ({ row }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row)}>Chỉnh sửa</DropdownMenuItem>
            {!row.isDefault && (
              <DropdownMenuItem onClick={() => onSetDefault(row)}>
                Đặt làm mặc định
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDelete(row.systemId)}
              className="text-destructive"
            >
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    meta: { displayName: 'Thao tác' }
  },
];
