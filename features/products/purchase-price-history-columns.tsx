import { ColumnDef } from "../../components/data-table/types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Badge } from "../../components/ui/badge";

export interface PriceHistoryEntry {
  systemId: string; // Required for RelatedDataTable
  id: string;
  date: string;
  price: number;
  supplierName: string;
  reference: string; // e.g., PO number or Receipt number
  type: 'manual' | 'receipt';
  note?: string;
  branchSystemId?: string;
  branchName?: string;
}

export const purchasePriceHistoryColumns: ColumnDef<PriceHistoryEntry>[] = [
  {
    id: "date",
    accessorKey: "date",
    header: "Ngày cập nhật",
    cell: ({ row }) => {
      return format(new Date(row.date), "dd/MM/yyyy HH:mm", { locale: vi });
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
      return <div className="text-body-sm font-medium">{row.supplierName}</div>;
    },
    meta: { displayName: "Nhà cung cấp" }
  },
  {
    id: "branchName",
    accessorKey: "branchName",
    header: "Chi nhánh",
    cell: ({ row }) => {
      return <div className="text-body-sm">{row.branchName || '-'}</div>;
    },
    meta: { displayName: "Chi nhánh" }
  },
  {
    id: "reference",
    accessorKey: "reference",
    header: "Chứng từ",
    cell: ({ row }) => {
      return <div className="font-mono text-body-xs">{row.reference}</div>;
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
      return <div className="text-body-sm text-muted-foreground truncate max-w-[200px]">{row.note}</div>;
    },
    meta: { displayName: "Ghi chú" }
  },
];
