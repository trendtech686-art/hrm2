import * as React from "react";
import type { ColumnDef } from "../../components/data-table/types";
import { DataTableColumnHeader } from "../../components/data-table/data-table-column-header";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Eye, MoreHorizontal, Pencil, XCircle } from "lucide-react";
import { generatePath, ROUTES } from "../../lib/router";
import { formatDate, formatDateCustom, toISODate, toISODateTime } from '../../lib/date-utils';
import type { Receipt } from "../receipts/types";
import type { Payment } from "../payments/types";
import { Checkbox } from "../../components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import type { CashAccount } from "./types";

const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

type CashbookTransaction = (Receipt & { type: 'receipt' }) | (Payment & { type: 'payment' });

const isReceipt = (transaction: CashbookTransaction): transaction is Receipt & { type: 'receipt' } => {
  return transaction?.type === 'receipt';
};

const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return formatDateCustom(date, "dd/MM/yyyy");
};

const formatDateTimeDisplay = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return formatDateCustom(date, "dd/MM/yyyy HH:mm");
};

const getStatusBadge = (status?: Receipt['status'] | Payment['status']) => {
  const normalizedStatus = status === 'cancelled' ? 'cancelled' : 'completed';
  const variants: Record<'completed' | 'cancelled', { label: string; variant: 'default' | 'destructive' }> = {
    completed: { label: 'Hoàn thành', variant: 'default' },
    cancelled: { label: 'Đã hủy', variant: 'destructive' },
  };
  const config = variants[normalizedStatus];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const getColumns = (
  accounts: CashAccount[],
  onCancel: (systemId: string) => void,
  navigate: (path: string) => void
): ColumnDef<CashbookTransaction>[] => [
  {
    id: "select",
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
        <Checkbox
            checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
            onCheckedChange={(value) => onToggleAll?.(!!value)}
            aria-label="Select all"
        />
    ),
    cell: ({ onToggleSelect, isSelected }) => (
        <Checkbox
            checked={isSelected}
            onCheckedChange={onToggleSelect}
            aria-label="Select row"
        />
    ),
    size: 48,
    meta: {
        displayName: "Chọn",
        sticky: "left",
    }
  },
  {
    id: "type",
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => {
      const transaction = row;
      if (!transaction) return null;
      return (
        <Badge variant={isReceipt(transaction) ? "default" : "destructive"}>
          {isReceipt(transaction) ? 'Thu' : 'Chi'}
        </Badge>
      );
    },
    meta: {
      displayName: "Loại phiếu",
      group: "Thông tin chung"
    },
  },
  {
    id: "id",
    accessorKey: "id",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader
        title="Mã phiếu"
        sortKey="id"
        isSorted={sorting?.id === 'id'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: any) => ({ id: 'id', desc: s.id === 'id' ? !s.desc : false }))}
      />
    ),
    cell: ({ row }) => {
      const id = row?.id;
      if (!id) return <div className="font-medium text-muted-foreground">N/A</div>;
      return <div className="font-medium">{id}</div>;
    },
    meta: {
      displayName: "Mã phiếu",
      group: "Thông tin chung"
    },
  },
  {
    id: "date",
    accessorKey: "date",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader
        title="Ngày"
        sortKey="date"
        isSorted={sorting?.id === 'date'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: any) => ({ id: 'date', desc: s.id === 'date' ? !s.desc : false }))}
      />
    ),
    cell: ({ row }) => row?.date ? formatDateDisplay(row.date) : 'N/A',
    meta: {
      displayName: "Ngày",
      group: "Thông tin chung"
    },
  },
  {
    id: "amount",
    accessorKey: "amount",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader
        title="Số tiền"
        sortKey="amount"
        isSorted={sorting?.id === 'amount'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: any) => ({ id: 'amount', desc: s.id === 'amount' ? !s.desc : false }))}
      />
    ),
    cell: ({ row }) => {
      const transaction = row;
      if (!transaction?.amount) return <div className="text-right">N/A</div>;
      const isReceiptTx = isReceipt(transaction);
      return (
        <div className={`text-right font-medium ${isReceiptTx ? 'text-green-600' : 'text-red-600'}`}>
          {isReceiptTx ? '+' : '-'}{formatCurrency(transaction.amount)} ₫
        </div>
      );
    },
    meta: {
      displayName: "Số tiền",
      group: "Thông tin chung"
    },
  },
  {
    id: "targetName",
    header: "Người nộp/nhận",
    cell: ({ row }) => {
      const transaction = row;
      if (!transaction) return <div>N/A</div>;
      const name = isReceipt(transaction) ? transaction.payerName : transaction.recipientName;
      return (
        <div className="max-w-[200px] truncate" title={name}>
          {name || 'N/A'}
        </div>
      );
    },
    meta: {
      displayName: "Người nộp/nhận",
      group: "Thông tin giao dịch"
    },
  },
  {
    id: "paymentMethodName",
    accessorKey: "paymentMethodName",
    header: "Hình thức",
    cell: ({ row }) => row?.paymentMethodName || 'N/A',
    meta: {
      displayName: "Hình thức thanh toán",
      group: "Thông tin thanh toán"
    },
  },
  {
    id: "accountSystemId",
    accessorKey: "accountSystemId",
    header: "Tài khoản",
    cell: ({ row }) => {
      const account = accounts.find(a => a.systemId === row?.accountSystemId);
      return (
        <div className="max-w-[150px] truncate" title={account?.name}>
          {account?.name || row?.accountSystemId || 'N/A'}
        </div>
      );
    },
    meta: {
      displayName: "Tài khoản",
      group: "Thông tin thanh toán"
    },
  },
  {
    id: "paymentReceiptTypeName",
    accessorKey: "paymentReceiptTypeName",
    header: "Loại nghiệp vụ",
    cell: ({ row }) => row?.paymentReceiptTypeName || 'N/A',
    meta: {
      displayName: "Loại nghiệp vụ",
      group: "Phân loại"
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => row?.status ? getStatusBadge(row.status) : 'N/A',
    meta: {
      displayName: "Trạng thái",
      group: "Thông tin chung"
    },
  },
  {
    id: "branchName",
    accessorKey: "branchName",
    header: "Chi nhánh",
    cell: ({ row }) => row?.branchName || 'N/A',
    meta: {
      displayName: "Chi nhánh",
      group: "Thông tin chi nhánh"
    },
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Diễn giải",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate" title={row?.description}>
        {row?.description || 'N/A'}
      </div>
    ),
    meta: {
      displayName: "Diễn giải",
      group: "Thông tin chung"
    },
  },
  {
    id: "runningBalance",
    accessorKey: "runningBalance",
    header: "Số dư",
    cell: ({ row }) => {
      const balance = row?.runningBalance;
      return balance != null ? (
        <div className="text-right">{formatCurrency(balance)} ₫</div>
      ) : '-';
    },
    meta: {
      displayName: "Số dư",
      group: "Tài chính"
    },
  },
  {
    id: "createdBy",
    accessorKey: "createdBy",
    header: "Người tạo",
    cell: ({ row }) => row?.createdBy || 'N/A',
    meta: {
      displayName: "Người tạo",
      group: "Thông tin hệ thống"
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader
        title="Ngày tạo"
        sortKey="createdAt"
        isSorted={sorting?.id === 'createdAt'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: any) => ({ id: 'createdAt', desc: s.id === 'createdAt' ? !s.desc : false }))}
      />
    ),
    cell: ({ row }) => row?.createdAt ? formatDateTimeDisplay(row.createdAt) : 'N/A',
    meta: {
      displayName: "Ngày tạo",
      group: "Thông tin hệ thống"
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Hành động</div>,
    cell: ({ row }) => {
      const transaction = row;
      const isCancelled = transaction.status === 'cancelled';
      const isReceiptTx = isReceipt(transaction);
      const viewRoute = isReceiptTx ? ROUTES.FINANCE.RECEIPT_VIEW : ROUTES.FINANCE.PAYMENT_VIEW;
      const editRoute = isReceiptTx ? ROUTES.FINANCE.RECEIPT_EDIT : ROUTES.FINANCE.PAYMENT_EDIT;

      return (
        <div className="flex items-center justify-center gap-0.5">
          {isCancelled ? (
            <div className="text-xs text-muted-foreground px-2">Đã hủy</div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(generatePath(editRoute, { systemId: transaction.systemId }));
                  }}
                >
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel(transaction.systemId);
                  }}
                >
                  Hủy phiếu
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      );
    },
    size: 90,
    meta: {
      displayName: "Hành động",
      sticky: "right",
    },
  },
];

export type { CashbookTransaction };
