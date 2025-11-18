import * as React from "react";
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import { Badge } from "../../components/ui/badge.tsx";
import type { ColumnDef } from '../../components/data-table/types.ts';
// Unified data structure that will be created in the page component
export type StockVoucher = {
  systemId: string;
  id: string;
  type: 'Nhập hàng' | 'Xuất trả NCC';
  date: string;
  supplierName: string;
  purchaseOrderId: string;
  creatorName: string;
  totalQuantity: number;
  link: string; // Used for navigation on row click
};



export const getColumns = (): ColumnDef<StockVoucher>[] => [
  {
    id: "id",
    accessorKey: "id",
    header: "Mã phiếu",
    cell: ({ row }) => <div className="font-medium">{row.id}</div>,
    meta: { displayName: "Mã phiếu" },
  },
  {
    id: "type",
    accessorKey: "type",
    header: "Loại phiếu",
    cell: ({ row }) => (
      <Badge variant={row.type === 'Nhập hàng' ? 'success' : 'destructive'} className={row.type === 'Nhập hàng' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
        {row.type}
      </Badge>
    ),
    meta: { displayName: "Loại phiếu" },
  },
  {
    id: "date",
    accessorKey: "date",
    header: "Ngày tạo",
    cell: ({ row }) => formatDate(row.date),
    meta: { displayName: "Ngày tạo" },
  },
  {
    id: "supplierName",
    accessorKey: "supplierName",
    header: "Nhà cung cấp",
    cell: ({ row }) => row.supplierName,
    meta: { displayName: "Nhà cung cấp" },
  },
  {
    id: "purchaseOrderId",
    accessorKey: "purchaseOrderId",
    header: "Đơn mua hàng",
    cell: ({ row }) => row.purchaseOrderId,
    meta: { displayName: "Đơn mua hàng" },
  },
  {
    id: "creatorName",
    accessorKey: "creatorName",
    header: "Người tạo",
    cell: ({ row }) => row.creatorName,
    meta: { displayName: "Người tạo" },
  },
  {
    id: 'totalQuantity',
    accessorKey: 'totalQuantity',
    header: 'Tổng SL',
    cell: ({ row }) => row.totalQuantity,
    meta: { displayName: 'Tổng SL' },
  },
];
