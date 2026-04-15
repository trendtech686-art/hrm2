import { ColumnDef } from "../../components/data-table/types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Badge } from "../../components/ui/badge";
import Link from "next/link";

export interface PriceHistoryEntry {
  systemId: string; // Required for RelatedDataTable
  id: string;
  date: string;
  price: number;
  supplierName: string;
  reference: string; // e.g., PO number or Receipt number
  referenceSystemId?: string; // For clickable link
  purchaseOrderId?: string; // Link to purchase order
  type: 'manual' | 'receipt';
  note?: string;
  branchSystemId?: string;
  branchName?: string;
  createdByName?: string; // Người tạo
}

export const purchasePriceHistoryColumns: ColumnDef<PriceHistoryEntry>[] = [
  {
    id: "date",
    accessorKey: "date",
    header: "Ngày cập nhật",
    cell: ({ row }) => {
      // Validate date before formatting to avoid "Invalid time value" error
      if (!row.date) return '-';
      const date = new Date(row.date);
      if (isNaN(date.getTime())) return '-';
      return format(date, "dd/MM/yyyy HH:mm", { locale: vi });
    },
    meta: { displayName: "Ngày cập nhật" }
  },
  {
    id: "price",
    accessorKey: "price",
    header: "Giá nhập",
    cell: ({ row }) => {
      const amount = row.price;
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    },
    meta: { displayName: "Giá nhập" }
  },
  {
    id: "supplierName",
    accessorKey: "supplierName",
    header: "Nhà cung cấp / Nguồn",
    cell: ({ row }) => {
      return <div className="text-sm font-medium">{row.supplierName}</div>;
    },
    meta: { displayName: "Nhà cung cấp" }
  },
  {
    id: "createdByName",
    accessorKey: "createdByName",
    header: "Người tạo",
    cell: ({ row }) => {
      return <div className="text-sm">{row.createdByName || '-'}</div>;
    },
    meta: { displayName: "Người tạo" }
  },
  {
    id: "branchName",
    accessorKey: "branchName",
    header: "Chi nhánh",
    cell: ({ row }) => {
      return <div className="text-sm">{row.branchName || '-'}</div>;
    },
    meta: { displayName: "Chi nhánh" }
  },
  {
    id: "reference",
    accessorKey: "reference",
    header: "Chứng từ",
    cell: ({ row }) => {
      // Nếu có referenceSystemId (inventory receipt), link đến phiếu nhập
      // Nếu có purchaseOrderId, link đến đơn nhập hàng
      if (row.referenceSystemId) {
        return (
          <Link 
            href={`/inventory-receipts/${row.referenceSystemId}`}
            className="font-mono text-xs text-primary hover:underline"
          >
            {row.reference}
          </Link>
        );
      }
      if (row.purchaseOrderId) {
        return (
          <Link 
            href={`/purchase-orders/${row.purchaseOrderId}`}
            className="font-mono text-xs text-primary hover:underline"
          >
            {row.reference}
          </Link>
        );
      }
      return <div className="font-mono text-xs">{row.reference}</div>;
    },
    meta: { displayName: "Chứng từ" }
  },
  {
    id: "type",
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => {
      const type = row.type;
      return (
        <Badge variant={type === 'receipt' ? 'default' : 'secondary'}>
          {type === 'receipt' ? 'Nhập hàng' : 'Thủ công'}
        </Badge>
      );
    },
    meta: { displayName: "Loại" }
  },
  {
    id: "note",
    accessorKey: "note",
    header: "Ghi chú",
    cell: ({ row }) => {
      return <div className="text-sm text-muted-foreground truncate max-w-50">{row.note}</div>;
    },
    meta: { displayName: "Ghi chú" }
  },
];
