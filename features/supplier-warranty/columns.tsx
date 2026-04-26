'use client'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { formatDateCustom } from '@/lib/date-utils'
import type { ColumnDef } from '@/components/data-table/types'
import type { SupplierWarranty } from './types'

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const STATUS_MAP: Record<string, { label: string; variant: 'success' | 'secondary' | 'warning' | 'destructive' | 'default' }> = {
  DRAFT: { label: 'Nháp', variant: 'secondary' },
  APPROVED: { label: 'Đã duyệt', variant: 'default' },
  PACKED: { label: 'Đã đóng gói', variant: 'default' },
  EXPORTED: { label: 'Đã xuất kho', variant: 'warning' },
  SENT: { label: 'Đã gửi', variant: 'warning' },
  DELIVERED: { label: 'Giao thành công', variant: 'success' },
  CONFIRMED: { label: 'Đã xác nhận', variant: 'success' },
  COMPLETED: { label: 'Hoàn thành', variant: 'success' },
  CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
}

export const getColumns = (): ColumnDef<SupplierWarranty>[] => [
  {
    id: 'select',
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? 'indeterminate' : false}
          onCheckedChange={(value) => onToggleAll?.(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ isSelected, onToggleSelect }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          aria-label="Select row"
        />
      </div>
    ),
    size: 48,
    meta: { displayName: 'Chọn', sticky: 'left' },
  },
  {
    id: 'id',
    accessorKey: 'id',
    header: 'Mã phiếu',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-primary">{row.id}</span>
    ),
    meta: { displayName: 'Mã phiếu' },
    size: 130,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const config = STATUS_MAP[row.status] || { label: row.status, variant: 'secondary' as const }
      return <Badge variant={config.variant}>{config.label}</Badge>
    },
    meta: { displayName: 'Trạng thái' },
    size: 120,
  },
  {
    id: 'supplierName',
    accessorKey: 'supplierName',
    header: 'Nhà cung cấp',
    cell: ({ row }) => (
      <span className="text-sm">{row.supplierName}</span>
    ),
    meta: { displayName: 'NCC' },
    size: 180,
  },
  {
    id: 'reason',
    accessorKey: 'reason',
    header: 'Lý do',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground line-clamp-1">{row.reason || '—'}</span>
    ),
    meta: { displayName: 'Lý do' },
    size: 200,
  },
  {
    id: 'itemCount',
    header: 'Số SP',
    cell: ({ row }) => (
      <span className="text-sm">{row.items?.length ?? 0}</span>
    ),
    meta: { displayName: 'Số SP' },
    size: 80,
  },
  {
    id: 'trackingNumber',
    accessorKey: 'trackingNumber',
    header: 'Mã vận đơn',
    cell: ({ row }) => (
      <span className="text-sm">{row.trackingNumber || '—'}</span>
    ),
    meta: { displayName: 'MVĐ' },
    size: 140,
  },
  {
    id: 'sentDate',
    accessorKey: 'sentDate',
    header: 'Ngày gửi',
    cell: ({ row }) => (
      <span className="text-sm">{row.sentDate ? formatDateCustom(new Date(row.sentDate), 'dd/MM/yyyy') : '—'}</span>
    ),
    meta: { displayName: 'Ngày gửi' },
    size: 110,
  },
  {
    id: 'totalWarrantyCost',
    accessorKey: 'totalWarrantyCost',
    header: 'Tổng BH',
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.totalWarrantyCost ? formatCurrency(row.totalWarrantyCost) : '—'}</span>
    ),
    meta: { displayName: 'Tổng BH' },
    size: 130,
  },
  {
    id: 'totalReturnedItems',
    accessorKey: 'totalReturnedItems',
    header: 'Trả lại',
    cell: ({ row }) => (
      <span className="text-sm">{row.totalReturnedItems || '—'}</span>
    ),
    meta: { displayName: 'Trả lại' },
    size: 80,
  },
  {
    id: 'createdByName',
    accessorKey: 'createdByName',
    header: 'Người tạo',
    cell: ({ row }) => (
      <span className="text-sm">{row.createdByName || '—'}</span>
    ),
    meta: { displayName: 'Người tạo' },
    size: 130,
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Ngày tạo',
    cell: ({ row }) => (
      <span className="text-sm">{formatDateCustom(new Date(row.createdAt), 'dd/MM/yyyy')}</span>
    ),
    meta: { displayName: 'Ngày tạo' },
    size: 110,
  },
]
