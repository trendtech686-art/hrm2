import * as React from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { formatDateCustom } from '../../lib/date-utils';
import type { InventoryCheck } from '@/lib/types/prisma-extended';
import { Checkbox } from '../../components/ui/checkbox';
import { DataTableColumnHeader } from '../../components/data-table/data-table-column-header';
import { Badge } from '../../components/ui/badge';
import type { ColumnDef } from '../../components/data-table/types';
import { Button } from '../../components/ui/button';
import { MoreHorizontal, Pencil, XCircle, Printer } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import type { SystemId } from '@/lib/id-types';

const formatDate = (d?: string) => (d ? formatDateCustom(new Date(d), 'dd/MM/yyyy HH:mm') : '');

// Helper to normalize status for comparison (DB returns uppercase, app uses lowercase)
const normalizeStatus = (status?: string) => status?.toLowerCase() || '';

export const getColumns = (
  onEdit: (item: InventoryCheck) => void,
  onCancel: (item: InventoryCheck) => void,
  onBalance: (item: InventoryCheck) => void,
  router: AppRouterInstance,
  onPrint?: (item: InventoryCheck) => void,
  findEmployeeById?: (id: SystemId) => { fullName?: string } | undefined,
) : ColumnDef<InventoryCheck>[] => [
  // 1 - Select
  {
    id: 'select',
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
      <Checkbox
        checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? 'indeterminate' : false}
        onCheckedChange={(v) => onToggleAll?.(!!v)}
      />
    ),
    cell: ({ onToggleSelect, isSelected }) => (
      <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
    ),
    size: 48,
    meta: { displayName: 'Chọn', sticky: 'left' },
  },

  // 2 - ID (clickable)
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader
        title="Mã"
        sortKey="id"
        isSorted={sorting?.id === 'id'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: { id: string; desc: boolean }) => ({ id: 'id', desc: s.id === 'id' ? !s.desc : false }))}
      />
    ),
    cell: ({ row }) => (
      <div
        className="font-medium text-primary cursor-pointer hover:underline"
        onClick={() => router.push(`/inventory-checks/${row.systemId}`)}
      >
        {row.id}
      </div>
    ),
    meta: { displayName: 'Mã phiếu' },
  },

  // 3 - Branch
  {
    id: 'branch',
    accessorKey: 'branchName',
    header: 'Chi nhánh',
    cell: ({ row }) => row.branchName,
    meta: { displayName: 'Chi nhánh' },
  },

  // 4 - Status
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = normalizeStatus(row.status);
      const variant = status === 'balanced' || status === 'completed' ? 'secondary' 
        : status === 'draft' ? 'outline' 
        : status === 'in_progress' || status === 'pending' ? 'default'
        : 'destructive';
      const label = status === 'draft' ? 'Nháp' 
        : status === 'balanced' || status === 'completed' ? 'Đã cân bằng' 
        : status === 'in_progress' || status === 'pending' ? 'Đang xử lý'
        : status === 'cancelled' ? 'Đã hủy'
        : row.status;
      return <Badge variant={variant}>{label}</Badge>;
    },
    meta: { displayName: 'Trạng thái' },
  },

  // 5 - Created At
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Ngày tạo',
    cell: ({ row }) => formatDate(row.createdAt as string | undefined),
    meta: { displayName: 'Ngày tạo' },
  },

  // 6 - Created By
  {
    id: 'createdBy',
    accessorKey: 'createdBy',
    header: 'Người tạo',
    cell: ({ row }) => {
      if (!row.createdBy) return '-';
      const employee = findEmployeeById?.(row.createdBy as SystemId);
      return employee?.fullName || row.createdBy;
    },
    meta: { displayName: 'Người tạo' },
  },

  // 7 - Balanced At
  {
    id: 'balancedAt',
    accessorKey: 'balancedAt',
    header: 'Ngày cân bằng',
    cell: ({ row }) => formatDate(row.balancedAt as string | undefined),
    meta: { displayName: 'Ngày cân bằng' },
  },

  // 8 - Items count
  {
    id: 'itemsCount',
    header: 'Số dòng',
    cell: ({ row }) => row.items?.length ?? 0,
    meta: { displayName: 'Số dòng' },
  },

  // 9 - System qty total
  {
    id: 'systemQty',
    header: 'Tổng hệ thống',
    cell: ({ row }) => row.items?.reduce((s, i) => s + (i.systemQuantity || 0), 0),
    meta: { displayName: 'Tổng hệ thống' },
  },

  // 10 - Actual qty total
  {
    id: 'actualQty',
    header: 'Tổng thực tế',
    cell: ({ row }) => row.items?.reduce((s, i) => s + (i.actualQuantity || 0), 0),
    meta: { displayName: 'Tổng thực tế' },
  },

  // 11 - Difference total
  {
    id: 'difference',
    header: 'Chênh lệch',
    cell: ({ row }) => row.items?.reduce((s, i) => s + ((i.actualQuantity || 0) - (i.systemQuantity || 0)), 0),
    meta: { displayName: 'Chênh lệch' },
  },

  // 12 - Item preview
  {
    id: 'itemPreview',
    header: 'Mô tả hàng',
    cell: ({ row }) => (
      <div className="max-w-60 truncate" title={row.items?.map(i => i.productName).slice(0,3).join(', ')}>
        {row.items?.map(i => i.productName).slice(0,3).join(', ')}{row.items && row.items.length > 3 ? '...' : ''}
      </div>
    ),
    meta: { displayName: 'Mô tả hàng' },
  },

  // 13 - Note
  {
    id: 'note',
    accessorKey: 'note',
    header: 'Ghi chú',
    cell: ({ row }) => (
      <div className="max-w-60 truncate" title={row.note ?? undefined}>{row.note}</div>
    ),
    meta: { displayName: 'Ghi chú' },
  },

  // 14 - Actions (sticky right)
  {
    id: 'actions',
    header: () => <div className="text-center">Hành động</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onPrint?.(row)}>
              <Printer className="mr-2 h-4 w-4" />
              In phiếu kiểm
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row)}>
              <Pencil className="mr-2 h-4 w-4" />
              Sửa
            </DropdownMenuItem>
            {normalizeStatus(row.status) === 'draft' && (
              <DropdownMenuItem onClick={() => onBalance(row)}>
                Cân bằng
              </DropdownMenuItem>
            )}
            {normalizeStatus(row.status) === 'draft' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => onCancel(row)}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Hủy phiếu
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    meta: { displayName: 'Hành động', sticky: 'right' },
    size: 90,
  }
];
