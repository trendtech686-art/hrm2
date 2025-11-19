import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import type { PurchaseOrder, PurchaseOrderStatus } from './types.ts'
import type { Branch } from '../settings/branches/types.ts';
import { Checkbox } from "../../components/ui/checkbox.tsx"
import { Badge } from "../../components/ui/badge.tsx"
import type { ColumnDef } from '../../components/data-table/types.ts';
import { Button } from "../../components/ui/button.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../../components/ui/dropdown-menu.tsx";
import { MoreHorizontal, Printer, CreditCard, PackageCheck, XCircle } from "lucide-react";
const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};



const statusVariants: Record<PurchaseOrderStatus, "success" | "default" | "secondary" | "warning" | "destructive"> = {
    "Đặt hàng": "secondary",
    "Đang giao dịch": "warning",
    "Hoàn thành": "success",
    "Đã hủy": "destructive",
    "Kết thúc": "default",
    "Đã trả hàng": "destructive",
};

export const getColumns = (
  onCancel: (purchaseOrder: PurchaseOrder) => void,
  onPrint: (purchaseOrder: PurchaseOrder) => void,
  onPayment: (purchaseOrder: PurchaseOrder) => void,
  onReceiveGoods: (purchaseOrder: PurchaseOrder) => void,
  branches: Branch[]
): ColumnDef<PurchaseOrder>[] => [
  {
    id: "select",
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
       <div className="flex items-center justify-center">
        <Checkbox
          checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
          onCheckedChange={(value) => onToggleAll(!!value)}
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
    meta: {
      displayName: "Select",
      sticky: "left",
    },
  },
  {
    id: "id",
    accessorKey: "id",
    header: "Mã đơn nhập hàng",
    cell: ({ row }) => <div className="font-medium text-primary hover:underline"><Link to={`/purchase-orders/${row.systemId}`}>{row.id}</Link></div>,
    meta: { displayName: "Mã đơn nhập hàng" },
    size: 150,
  },
  {
    id: "supplierName",
    accessorKey: "supplierName",
    header: "Tên Nhà cung cấp",
    cell: ({ row }) => row.supplierName,
    meta: { displayName: "Tên Nhà cung cấp" },
  },
  {
    id: "branchName",
    accessorKey: "branchName",
    header: "Chi nhánh",
    cell: ({ row }) => row.branchName,
    meta: { displayName: "Chi nhánh" },
  },
  {
    id: "buyer",
    accessorKey: "buyer",
    header: "Nhân viên",
    cell: ({ row }) => row.buyer,
    meta: { displayName: "Nhân viên" },
  },
  {
    id: "orderDate",
    accessorKey: "orderDate",
    header: "Ngày đặt hàng",
    cell: ({ row }) => formatDate(row.orderDate),
    meta: { displayName: "Ngày đặt hàng" },
  },
  {
    id: "deliveryDate",
    accessorKey: "deliveryDate",
    header: "Ngày giao",
    cell: ({ row }) => formatDateCustom(parseDate(row.deliveryDate), 'dd/MM/yyyy'),
    meta: { displayName: "Ngày giao" },
  },
  {
    id: "shippingFee",
    accessorKey: "shippingFee",
    header: "Phí vận chuyển",
    cell: ({ row }) => formatCurrency(row.shippingFee || 0),
    meta: { displayName: "Phí vận chuyển" },
  },
  {
    id: "tax",
    accessorKey: "tax",
    header: "Thuế",
    cell: ({ row }) => formatCurrency(row.tax || 0),
    meta: { displayName: "Thuế" },
  },
  {
    id: "discount",
    accessorKey: "discount",
    header: "Giảm giá",
    cell: ({ row }) => formatCurrency(row.discount || 0),
    meta: { displayName: "Giảm giá" },
  },
  {
    id: "notes",
    accessorKey: "notes",
    header: "Ghi chú",
    cell: ({ row }) => row.notes || '-',
    meta: { displayName: "Ghi chú" },
  },
  {
    id: "creatorName",
    accessorKey: "creatorName",
    header: "Người tạo",
    cell: ({ row }) => row.creatorName || '-',
    meta: { displayName: "Người tạo" },
  },
  {
    id: "grandTotal",
    accessorKey: "grandTotal",
    header: "Tổng tiền",
    cell: ({ row }) => {
      // Tính lại từ lineItems nếu grandTotal = 0
      let total = row.grandTotal;
      if (total === 0 && row.lineItems && row.lineItems.length > 0) {
        const itemsTotal = row.lineItems.reduce((sum, item) => {
          const lineGross = item.quantity * item.unitPrice;
          const discountAmount = item.discountType === 'percentage'
            ? lineGross * (item.discount / 100)
            : item.discount;
          return sum + (lineGross - discountAmount);
        }, 0);
        total = itemsTotal + (row.shippingFee || 0) + (row.tax || 0);
      }
      return <span className="font-semibold">{formatCurrency(total)}</span>;
    },
    meta: { displayName: "Tổng tiền" },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Trạng thái ĐH",
    cell: ({ row }) => <Badge variant={statusVariants[row.status] as any}>{row.status}</Badge>,
    meta: { displayName: "Trạng thái ĐH" },
  },
  {
    id: "deliveryStatus",
    accessorKey: "deliveryStatus",
    header: "Trạng thái Nhận hàng",
    cell: ({ row }) => <Badge variant="outline">{row.deliveryStatus}</Badge>,
    meta: { displayName: "Trạng thái Nhận hàng" },
  },
   {
    id: "paymentStatus",
    accessorKey: "paymentStatus",
    header: "Trạng thái Thanh toán",
    cell: ({ row }) => <Badge variant={row.paymentStatus === 'Đã thanh toán' ? 'success' : 'warning' as any}>{row.paymentStatus}</Badge>,
    meta: { displayName: "Trạng thái Thanh toán" },
  },
  {
    id: "returnStatus",
    accessorKey: "returnStatus",
    header: "Trạng thái Trả hàng",
    cell: ({ row }) => <Badge variant="outline">{row.returnStatus || 'Chưa hoàn trả'}</Badge>,
    meta: { displayName: "Trạng thái Trả hàng" },
  },
  {
    id: "refundStatus",
    accessorKey: "refundStatus",
    header: "Trạng thái Hoàn tiền",
    cell: ({ row }) => <Badge variant="outline">{row.refundStatus || 'Chưa hoàn tiền'}</Badge>,
    meta: { displayName: "Trạng thái Hoàn tiền" },
  },
   {
    id: "actions",
    header: () => <div className="text-center">Hành động</div>,
    cell: ({ row }) => {
       const isActionable = row.status !== 'Hoàn thành' && row.status !== 'Đã hủy' && row.status !== 'Kết thúc';
       return (
       <div className="flex items-center justify-center">
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="h-8 w-8 p-0">
               <span className="sr-only">Mở menu</span>
               <MoreHorizontal className="h-4 w-4" />
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end">
             <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onPrint(row); }}>
               <Printer className="mr-2 h-4 w-4" />
               In đơn nhập hàng
             </DropdownMenuItem>
             <DropdownMenuItem 
               onClick={(e) => { e.stopPropagation(); onPayment(row); }}
               disabled={row.paymentStatus === 'Đã thanh toán'}
             >
               <CreditCard className="mr-2 h-4 w-4" />
               Thanh toán
             </DropdownMenuItem>
             <DropdownMenuItem 
               onClick={(e) => { e.stopPropagation(); onReceiveGoods(row); }}
               disabled={row.deliveryStatus === 'Đã nhập'}
             >
               <PackageCheck className="mr-2 h-4 w-4" />
               Nhập hàng
             </DropdownMenuItem>
             <DropdownMenuSeparator />
             <DropdownMenuItem 
               onClick={(e) => { e.stopPropagation(); onCancel(row); }} 
               disabled={!isActionable}
               className="text-destructive"
             >
               <XCircle className="mr-2 h-4 w-4" />
               Hủy đơn
             </DropdownMenuItem>
           </DropdownMenuContent>
         </DropdownMenu>
       </div>
    )},
    meta: {
      displayName: "Hành động",
      sticky: "right",
    },
    size: 90,
  },
];
