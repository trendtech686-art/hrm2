import * as React from "react";
import { toast } from 'sonner';
import { formatDate, formatDateTime } from '../../lib/date-utils.ts';
import type { WarrantyTicket } from './types.ts';
import type { Order } from '../orders/types.ts';
import { WARRANTY_STATUS_LABELS, WARRANTY_STATUS_COLORS, WARRANTY_SETTLEMENT_STATUS_LABELS, WARRANTY_SETTLEMENT_STATUS_COLORS } from './types.ts';
import { checkWarrantyOverdue, formatTimeLeft } from './warranty-sla-utils.ts';
import { Checkbox } from "../../components/ui/checkbox.tsx";
import { DataTableColumnHeader } from "../../components/data-table/data-table-column-header.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import type { ColumnDef } from '../../components/data-table/types.ts';
import { Button } from "../../components/ui/button.tsx";
import { Pencil, Trash2, MoreHorizontal, Package, Printer, Link as LinkIcon, AlertTriangle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu.tsx";
import { useWarrantyStore } from './store.ts';
// REMOVED: Voucher store no longer exists
// import { useVoucherStore } from '../vouchers/store.ts';

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};

export const getColumns = (
  onDelete: (systemId: string) => void,
  onEdit: (ticket: WarrantyTicket) => void,
  navigate: (path: string) => void,
  orders: Order[] = [], // ✅ Add orders parameter
): ColumnDef<WarrantyTicket>[] => [
  // Select column - sticky left
  {
    id: "select",
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
      <Checkbox
        checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
        onCheckedChange={(value) => onToggleAll(!!value)}
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

  // ID column - clickable, sticky left
  {
    id: "id",
    accessorKey: "id",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Mã phiếu"
        sortKey="id"
        isSorted={sorting.id === 'id'}
        sortDirection={sorting.desc ? 'desc' : 'asc'}
        onSort={() => setSorting((s: any) => ({ id: 'id', desc: s.id === 'id' ? !s.desc : false }))}
      />
    ),
    cell: ({ row }) => (
      <div 
        className="font-medium text-primary cursor-pointer hover:underline whitespace-nowrap" 
        onClick={() => navigate(`/warranty/${row.systemId}`)}
      >
        {row.id}
      </div>
    ),
    meta: {
      displayName: "Mã phiếu",
      group: "Thông tin cơ bản"
    },
  },

  // Branch & Employee info
  {
    id: "branchName",
    accessorKey: "branchName",
    header: "Chi nhánh",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate" title={row.branchName}>
        {row.branchName}
      </div>
    ),
    meta: {
      displayName: "Chi nhánh",
      group: "Thông tin cơ bản"
    },
  },

  {
    id: "employeeName",
    accessorKey: "employeeName",
    header: "Nhân viên",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate" title={row.employeeName}>
        {row.employeeName}
      </div>
    ),
    meta: {
      displayName: "Nhân viên phụ trách",
      group: "Thông tin cơ bản"
    },
  },

  // Customer info
  {
    id: "customerName",
    accessorKey: "customerName",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Khách hàng"
        sortKey="customerName"
        isSorted={sorting.id === 'customerName'}
        sortDirection={sorting.desc ? 'desc' : 'asc'}
        onSort={() => setSorting((s: any) => ({ id: 'customerName', desc: s.id === 'customerName' ? !s.desc : false }))}
      />
    ),
    cell: ({ row }) => (
      <div className="max-w-[180px] truncate" title={row.customerName}>
        {row.customerName}
      </div>
    ),
    meta: {
      displayName: "Tên khách hàng",
      group: "Thông tin khách hàng"
    },
  },

  {
    id: "customerPhone",
    accessorKey: "customerPhone",
    header: "Số điện thoại",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.customerPhone}</div>
    ),
    meta: {
      displayName: "SĐT khách hàng",
      group: "Thông tin khách hàng"
    },
  },

  {
    id: "customerAddress",
    accessorKey: "customerAddress",
    header: "Địa chỉ",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.customerAddress}>
        {row.customerAddress || '—'}
      </div>
    ),
    meta: {
      displayName: "Địa chỉ khách hàng",
      group: "Thông tin khách hàng"
    },
  },

  // Tracking info
  {
    id: "trackingCode",
    accessorKey: "trackingCode",
    header: "Mã vận đơn / Mã tra cứu",
    cell: ({ row }) => (
      <div className="space-y-0.5">
        <div className="font-mono text-xs whitespace-nowrap">{row.trackingCode}</div>
        {row.publicTrackingCode && (
          <div className="font-mono text-[10px] text-muted-foreground">
            Tra cứu: {row.publicTrackingCode}
          </div>
        )}
      </div>
    ),
    meta: {
      displayName: "Mã vận đơn / Tra cứu",
      group: "Vận chuyển"
    },
  },

  {
    id: "shippingFee",
    accessorKey: "shippingFee",
    header: "Phí cước",
    cell: ({ row }) => (
      <div className="text-right whitespace-nowrap">
        {row.shippingFee ? `${formatCurrency(row.shippingFee)} ₫` : '—'}
      </div>
    ),
    meta: {
      displayName: "Phí cước",
      group: "Vận chuyển"
    },
  },

  // Reference fields
  {
    id: "linkedOrderId",
    accessorKey: "linkedOrderSystemId", // ✅ Use systemId
    header: "Đơn hàng liên kết",
    cell: ({ row }) => {
      if (!row.linkedOrderSystemId) return <span className="text-muted-foreground text-xs">—</span>;
      const orderBusinessId = orders.find(o => o.systemId === row.linkedOrderSystemId)?.id;
      return (
        <div 
          className="font-medium text-primary cursor-pointer hover:underline whitespace-nowrap" 
          onClick={() => navigate(`/orders/${row.linkedOrderSystemId}`)}
        >
          {orderBusinessId || row.linkedOrderSystemId}
        </div>
      );
    },
    meta: {
      displayName: "Đơn hàng liên kết",
      group: "Tham chiếu"
    },
  },

  {
    id: "referenceUrl",
    accessorKey: "referenceUrl",
    header: "Link tham chiếu",
    cell: ({ row }) => {
      if (!row.referenceUrl) return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <a 
          href={row.referenceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-xs flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <LinkIcon className="h-3 w-3" />
          Link
        </a>
      );
    },
    meta: {
      displayName: "Đường dẫn tham chiếu",
      group: "Tham chiếu"
    },
  },

  {
    id: "externalReference",
    accessorKey: "externalReference",
    header: "Mã tham chiếu",
    cell: ({ row }) => (
      <div className="font-mono text-xs whitespace-nowrap">
        {row.externalReference || '—'}
      </div>
    ),
    meta: {
      displayName: "Mã tham chiếu bên ngoài",
      group: "Tham chiếu"
    },
  },

  // Status
  {
    id: "status",
    accessorKey: "status",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Trạng thái"
        sortKey="status"
        isSorted={sorting.id === 'status'}
        sortDirection={sorting.desc ? 'desc' : 'asc'}
        onSort={() => setSorting((s: any) => ({ id: 'status', desc: s.id === 'status' ? !s.desc : false }))}
      />
    ),
    cell: ({ row }) => (
      <Badge className={WARRANTY_STATUS_COLORS[row.status]}>
        {WARRANTY_STATUS_LABELS[row.status]}
      </Badge>
    ),
    meta: {
      displayName: "Trạng thái",
      group: "Trạng thái"
    },
  },

  // SLA Status column - NEW
  {
    id: "slaStatus",
    header: "SLA",
    cell: ({ row }) => {
      const overdueStatus = checkWarrantyOverdue(row);
      
      // Nếu đã trả hàng
      if (row.status === 'returned') {
        return <span className="text-muted-foreground">Hoàn thành</span>;
      }

      // Check trạng thái quá hạn (kiểm tra từng loại)
      const isOverdue = overdueStatus.isOverdueResponse || 
                        overdueStatus.isOverdueProcessing || 
                        overdueStatus.isOverdueReturn;

      // Nếu không quá hạn - hiển thị thời gian còn lại theo trạng thái
      if (!isOverdue) {
        let timeLeft = 0;
        if (row.status === 'incomplete') {
          timeLeft = overdueStatus.responseTimeLeft;
        } else if (row.status === 'pending') {
          timeLeft = overdueStatus.processingTimeLeft;
        } else if (row.status === 'processed') {
          timeLeft = overdueStatus.returnTimeLeft;
        }
        
        const timeLeftStr = formatTimeLeft(timeLeft);
        return (
          <div className="flex items-center gap-1">
            <span className="text-green-600">Còn {timeLeftStr}</span>
          </div>
        );
      }

      // Quá hạn - hiển thị từ overdueDuration
      return (
        <div className="flex items-center gap-1 text-red-600">
          <AlertTriangle className="h-3 w-3" />
          <span>Quá {overdueStatus.overdueDuration}</span>
        </div>
      );
    },
    size: 140,
    meta: {
      displayName: "SLA",
      group: "Trạng thái"
    },
  },

  // Settlement Status - NEW: Trạng thái thanh toán
  {
    id: "settlementStatus",
    header: "Thanh toán",
    cell: ({ row }) => {
      // Chỉ hiển thị cho phiếu đã trả và có totalSettlement > 0
      if (row.status !== 'returned' || !row.summary?.totalSettlement || row.summary.totalSettlement <= 0) {
        return <span className="text-muted-foreground text-xs">—</span>;
      }

      // Get vouchers and calculate
      // REMOVED: useVoucherStore no longer exists
      // const vouchers = useVoucherStore.getState().data;
      const vouchers: any[] = [];
      const relatedVouchers = vouchers.filter(v => v.linkedWarrantySystemId === row.systemId);
      const totalPaid = relatedVouchers.reduce((sum, v) => sum + (v.amount || 0), 0);
      
      // Calculate status
      const { calculateSettlementStatus } = useWarrantyStore.getState();
      const status = calculateSettlementStatus(
        Math.abs(row.summary.totalSettlement),
        totalPaid,
        row.shippingFee || 0
      );

      return (
        <Badge className={WARRANTY_SETTLEMENT_STATUS_COLORS[status]}>
          {WARRANTY_SETTLEMENT_STATUS_LABELS[status]}
        </Badge>
      );
    },
    meta: {
      displayName: "Trạng thái thanh toán",
      group: "Trạng thái"
    },
  },

  // Products summary
  {
    id: "productsCount",
    accessorKey: "products",
    header: "Sản phẩm",
    cell: ({ row }) => {
      const totalQty = row.products?.reduce((sum, p) => sum + (p.quantity || 1), 0) || 0;
      return (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span>{totalQty}</span>
        </div>
      );
    },
    meta: {
      displayName: "Tổng số lượng sản phẩm",
      group: "Sản phẩm"
    },
  },

  {
    id: "totalProducts",
    accessorKey: "summary",
    header: "Tổng SP",
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.summary?.totalProducts || 0}</div>
    ),
    meta: {
      displayName: "Tổng sản phẩm",
      group: "Sản phẩm"
    },
  },

  {
    id: "totalReplaced",
    accessorKey: "summary",
    header: "Đổi mới",
    cell: ({ row }) => {
      // Fallback: Calculate from products if summary is missing
      let replaced = row.summary?.totalReplaced;
      if (replaced === undefined || replaced === null) {
        replaced = row.products
          ?.filter((p: any) => p.resolution === 'replace')
          .reduce((sum: number, p: any) => sum + (p.quantity || 1), 0) || 0;
      }
      if (replaced === 0) return <span className="text-muted-foreground text-xs">—</span>;
      return <div className="text-center text-green-600 font-medium">{replaced}</div>;
    },
    meta: {
      displayName: "Số lượng đổi mới",
      group: "Sản phẩm"
    },
  },

  {
    id: "totalReturned",
    accessorKey: "summary",
    header: "Trả lại",
    cell: ({ row }) => {
      // Fallback: Calculate from products if summary is missing
      let returned = row.summary?.totalReturned;
      if (returned === undefined || returned === null) {
        returned = row.products
          ?.filter((p: any) => p.resolution === 'return')
          .reduce((sum: number, p: any) => sum + (p.quantity || 1), 0) || 0;
      }
      if (returned === 0) return <span className="text-muted-foreground text-xs">—</span>;
      return <div className="text-center text-blue-600 font-medium">{returned}</div>;
    },
    meta: {
      displayName: "Số lượng trả lại",
      group: "Sản phẩm"
    },
  },

  {
    id: "totalOutOfStock",
    accessorKey: "summary",
    header: "Hết hàng",
    cell: ({ row }) => {
      // Fallback: Calculate from products if summary is missing or incorrect
      // Gộp cả "out_of_stock" và "deduct" vì đều là hết hàng → khấu trừ tiền
      let outOfStock = row.summary?.totalOutOfStock;
      let deduction = row.summary?.totalDeduction;
      
      if (outOfStock === undefined || outOfStock === null || deduction === undefined || deduction === null) {
        const outOfStockProducts = row.products?.filter((p: any) => 
          p.resolution === 'out_of_stock' || p.resolution === 'deduct'
        ) || [];
        outOfStock = outOfStockProducts.reduce((sum: number, p: any) => sum + (p.quantity || 1), 0);
        deduction = outOfStockProducts.reduce((sum: number, p: any) => {
          if (p.resolution === 'deduct') return sum + (p.deductionAmount || 0);
          if (p.resolution === 'out_of_stock') return sum + ((p.quantity || 1) * (p.unitPrice || 0));
          return sum;
        }, 0);
      }
      
      if (outOfStock === 0 && deduction === 0) return <span className="text-muted-foreground text-xs">—</span>;
      
      return (
        <div className="text-center">
          <div className="text-orange-600 font-medium">{outOfStock} SP</div>
          {deduction > 0 && (
            <div className="text-xs text-red-600 whitespace-nowrap">
              {formatCurrency(deduction)} ₫
            </div>
          )}
        </div>
      );
    },
    meta: {
      displayName: "Hết hàng (Khấu trừ tiền)",
      group: "Sản phẩm"
    },
  },

  {
    id: "totalSettlement",
    accessorKey: "summary",
    header: "Bù trừ",
    cell: ({ row }) => {
      const settlement = row.summary?.totalSettlement || 0;
      if (settlement === 0) return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <div className="text-right text-blue-600 whitespace-nowrap">
          {formatCurrency(Math.abs(settlement))} ₫
        </div>
      );
    },
    meta: {
      displayName: "Tổng tiền bù trừ",
      group: "Sản phẩm"
    },
  },

  // Images
  {
    id: "receivedImagesCount",
    accessorKey: "receivedImages",
    header: "Hình nhận",
    cell: ({ row }) => (
      <div className="text-center">{row.receivedImages?.length || 0} ảnh</div>
    ),
    meta: {
      displayName: "Số ảnh nhận hàng",
      group: "Hình ảnh"
    },
  },

  {
    id: "processedImagesCount",
    accessorKey: "processedImages",
    header: "Hình xử lý",
    cell: ({ row }) => (
      <div className="text-center">{row.processedImages?.length || 0} ảnh</div>
    ),
    meta: {
      displayName: "Số ảnh xử lý xong",
      group: "Hình ảnh"
    },
  },

  // History & Comments
  {
    id: "historyCount",
    accessorKey: "history",
    header: "Lịch sử",
    cell: ({ row }) => (
      <div className="text-center">{row.history?.length || 0}</div>
    ),
    meta: {
      displayName: "Số bản ghi lịch sử",
      group: "Lịch sử & Bình luận"
    },
  },

  {
    id: "commentsCount",
    accessorKey: "comments",
    header: "Bình luận",
    cell: ({ row }) => (
      <div className="text-center">{row.comments?.length || 0}</div>
    ),
    meta: {
      displayName: "Số bình luận",
      group: "Lịch sử & Bình luận"
    },
  },

  {
    id: "subtasksCount",
    accessorKey: "subtasks",
    header: "Công việc",
    cell: ({ row }) => {
      const count = row.subtasks?.length || 0;
      if (count === 0) return <span className="text-muted-foreground text-xs">—</span>;
      return <div className="text-center">{count}</div>;
    },
    meta: {
      displayName: "Số công việc",
      group: "Lịch sử & Bình luận"
    },
  },

  // Notes
  {
    id: "notes",
    accessorKey: "notes",
    header: "Ghi chú",
    cell: ({ row }) => {
      if (!row.notes?.trim()) return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <div className="max-w-[200px] truncate text-xs" title={row.notes}>
          {row.notes}
        </div>
      );
    },
    meta: {
      displayName: "Ghi chú",
      group: "Thông tin bổ sung"
    },
  },

  // Timestamps
  {
    id: "returnedAt",
    accessorKey: "returnedAt",
    header: "Ngày trả hàng",
    cell: ({ row }) => {
      if (!row.returnedAt) return <span className="text-muted-foreground text-xs">—</span>;
      return <div className="whitespace-nowrap text-xs">{formatDateTime(row.returnedAt)}</div>;
    },
    meta: {
      displayName: "Ngày trả hàng",
      group: "Thời gian"
    },
  },

  // Audit fields
  {
    id: "createdBy",
    accessorKey: "createdBy",
    header: "Người tạo",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.createdBy}</div>
    ),
    meta: {
      displayName: "Người tạo",
      group: "Audit"
    },
  },

  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Ngày tạo"
        sortKey="createdAt"
        isSorted={sorting.id === 'createdAt'}
        sortDirection={sorting.desc ? 'desc' : 'asc'}
        onSort={() => setSorting((s: any) => ({ id: 'createdAt', desc: s.id === 'createdAt' ? !s.desc : false }))}
      />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{formatDateTime(row.createdAt)}</div>
    ),
    meta: {
      displayName: "Ngày tạo",
      group: "Audit"
    },
  },

  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: "Ngày cập nhật",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{formatDateTime(row.updatedAt)}</div>
    ),
    meta: {
      displayName: "Ngày cập nhật cuối",
      group: "Audit"
    },
  },

  // Actions column - sticky right
  {
    id: "actions",
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
            <DropdownMenuItem onClick={() => onEdit(row)}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh Sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              window.print();
            }}>
              <Printer className="mr-2 h-4 w-4" />
              In
            </DropdownMenuItem>
            <DropdownMenuItem 
              disabled={!row.publicTrackingCode}
              onClick={() => {
                if (!row.publicTrackingCode) return;
                // CHỈ dùng publicTrackingCode (mã tra cứu chính thức)
                const trackingUrl = `${window.location.origin}/warranty-tracking/${row.publicTrackingCode}`;
                navigator.clipboard.writeText(trackingUrl);
                toast.success(
                  <div className="flex flex-col gap-1">
                    <div className="font-semibold">Đã copy link tracking</div>
                    <div className="text-sm text-muted-foreground">Mã: {row.publicTrackingCode}</div>
                  </div>,
                  { duration: 5000 }
                );
            }}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Get Link Tracking
              {!row.publicTrackingCode && <span className="ml-2 text-[10px] text-orange-600">(Chưa có mã)</span>}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => onDelete(row.systemId)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hủy
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    meta: {
      displayName: "Hành động",
      sticky: "right",
    },
    size: 90,
  },
];
