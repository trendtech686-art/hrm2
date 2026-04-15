import * as React from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/date-utils'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { Badge } from '@/components/ui/badge'
import { Package } from 'lucide-react'
import type { ColumnDef } from '@/components/data-table/types'
import type { OrderedProductItem } from './types'

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Nháp',
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  RECEIVING: 'Đang nhận hàng',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
}

const statusVariants: Record<string, 'success' | 'default' | 'secondary' | 'warning' | 'destructive'> = {
  DRAFT: 'secondary',
  PENDING: 'warning',
  CONFIRMED: 'default',
  RECEIVING: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'destructive',
}

export const getColumns = (): ColumnDef<OrderedProductItem>[] => [
  {
    id: 'productName',
    accessorKey: 'productName',
    header: 'Sản phẩm',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.productImage ? (
          <OptimizedImage
            src={row.productImage}
            alt=""
            width={32}
            height={32}
            className="w-8 h-8 rounded object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
            <Package className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0">
          <div className="font-medium truncate">{row.productName}</div>
          <div className="text-xs text-muted-foreground">{row.productSku}</div>
        </div>
      </div>
    ),
    meta: { displayName: 'Sản phẩm' },
  },
  {
    id: 'poId',
    accessorKey: 'poId',
    header: 'Mã đơn nhập',
    cell: ({ row }) => (
      <Link
        href={`/purchase-orders/${row.poSystemId}`}
        className="text-primary hover:underline font-medium"
        onClick={(e) => e.stopPropagation()}
      >
        {row.poId}
      </Link>
    ),
    meta: { displayName: 'Mã đơn nhập' },
  },
  {
    id: 'orderDate',
    accessorKey: 'orderDate',
    header: 'Ngày đặt',
    cell: ({ row }) => row.orderDate ? formatDate(row.orderDate) : '—',
    meta: { displayName: 'Ngày đặt' },
  },
  {
    id: 'supplierName',
    accessorKey: 'supplierName',
    header: 'Nhà cung cấp',
    cell: ({ row }) => (
      <Link
        href={`/suppliers/${row.supplierSystemId}`}
        className="text-primary hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        {row.supplierName}
      </Link>
    ),
    meta: { displayName: 'Nhà cung cấp' },
  },
  {
    id: 'quantity',
    accessorKey: 'quantity',
    header: 'SL đặt',
    cell: ({ row }) => row.quantity,
    meta: { displayName: 'SL đặt' },
  },
  {
    id: 'receivedQty',
    accessorKey: 'receivedQty',
    header: 'SL nhận',
    cell: ({ row }) => row.receivedQty,
    meta: { displayName: 'SL nhận' },
  },
  {
    id: 'unitPrice',
    accessorKey: 'unitPrice',
    header: 'Đơn giá',
    cell: ({ row }) => formatCurrency(row.unitPrice),
    meta: { displayName: 'Đơn giá' },
  },
  {
    id: 'total',
    accessorKey: 'total',
    header: 'Thành tiền',
    cell: ({ row }) => formatCurrency(row.total),
    meta: { displayName: 'Thành tiền' },
  },
  {
    id: 'poStatus',
    accessorKey: 'poStatus',
    header: 'Trạng thái',
    cell: ({ row }) => (
      <Badge variant={statusVariants[row.poStatus] ?? 'default'}>
        {statusLabels[row.poStatus] ?? row.poStatus}
      </Badge>
    ),
    meta: { displayName: 'Trạng thái' },
  },
]
