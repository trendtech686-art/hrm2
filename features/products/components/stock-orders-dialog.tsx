'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateForDisplay } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

export type StockOrderType = 'committed' | 'in-transit' | 'in-delivery' | 'sold';

export interface StockOrderItem {
  id: string;
  systemId: string;
  type: 'order' | 'warranty' | 'transfer';
  date?: string;
  dispatchDate?: string;
  customerName?: string;
  supplierName?: string;
  fromBranch?: string;
  toBranch?: string;
  shippingCarrier?: string;
  trackingCode?: string;
  quantity: number;
  status: string;
  statusVariant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface StockOrdersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: StockOrderType;
  productName: string;
  branchName: string;
  items: StockOrderItem[];
  isLoading?: boolean;
  // ⚡ Server-side pagination props
  totalQuantity?: number;
  orderQuantity?: number;
  warrantyQuantity?: number;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
}

const TYPE_CONFIG: Record<StockOrderType, {
  title: string;
  totalLabel: string;
  dateLabel: string;
  showShipping: boolean;
  showFromTo: boolean;
}> = {
  'committed': {
    title: 'Chờ xuất kho',
    totalLabel: 'Tổng chờ xuất kho',
    dateLabel: 'Ngày tạo',
    showShipping: false,
    showFromTo: false,
  },
  'in-transit': {
    title: 'Đang về kho',
    totalLabel: 'Tổng đang về',
    dateLabel: 'Ngày tạo',
    showShipping: false,
    showFromTo: true,
  },
  'in-delivery': {
    title: 'Đang giao hàng',
    totalLabel: 'Tổng đang giao',
    dateLabel: 'Ngày xuất kho',
    showShipping: true,
    showFromTo: false,
  },
  'sold': {
    title: 'Đã bán',
    totalLabel: 'Tổng đã bán',
    dateLabel: 'Ngày bán',
    showShipping: false,
    showFromTo: false,
  },
};

const TYPE_LABELS: Record<string, string> = {
  'order': 'Đơn hàng',
  'warranty': 'Bảo hành',
  'transfer': 'Chuyển kho',
};

function getStatusBadgeVariant(variant?: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (variant) {
    case 'success': return 'default';
    case 'warning': return 'secondary';
    case 'destructive': return 'destructive';
    default: return 'outline';
  }
}

export function StockOrdersDialog({
  open,
  onOpenChange,
  type,
  productName,
  branchName,
  items,
  isLoading = false,
  totalQuantity: propsTotalQuantity,
  orderQuantity = 0,
  warrantyQuantity = 0,
  pagination,
  onPageChange,
}: StockOrdersDialogProps) {
  const router = useRouter();
  const config = TYPE_CONFIG[type];
  
  // Use server-side totalQuantity if provided, otherwise calculate from items
  const totalQuantity = propsTotalQuantity ?? items.reduce((sum, item) => sum + item.quantity, 0);
  
  // ⚡ Server-side pagination from props (if available)
  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const totalItems = pagination?.total ?? items.length;
  const pageSize = pagination?.limit ?? 10;

  const handleRowClick = (item: StockOrderItem) => {
    const path = item.type === 'order' ? `/orders/${item.systemId}` 
      : item.type === 'warranty' ? `/warranty/${item.systemId}`
      : `/stock-transfers/${item.systemId}`;
    router.push(path);
    onOpenChange(false);
  };

  // Build quantity display: show breakdown when there are warranty items
  const quantityDisplay = warrantyQuantity > 0
    ? `${orderQuantity} đơn hàng + ${warrantyQuantity} bảo hành = ${totalQuantity}`
    : String(totalQuantity);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="truncate">{config.title}: {productName}</DialogTitle>
          <DialogDescription>
            Chi nhánh: {branchName} • {config.totalLabel}:{' '}
            <span className="text-primary font-semibold">{quantityDisplay}</span> sản phẩm
            {totalItems > 0 && (
              <> • <span className="font-medium">{totalItems}</span> phiếu</>  
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <svg
                className="h-12 w-12 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p>Không có phiếu nào</p>
            </div>
          ) : (
            <div className="min-w-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 whitespace-nowrap">Loại</TableHead>
                  <TableHead className="whitespace-nowrap">Mã phiếu</TableHead>
                  <TableHead className="whitespace-nowrap">{config.dateLabel}</TableHead>
                  {config.showFromTo ? (
                    <>
                      <TableHead>Từ</TableHead>
                      <TableHead>Đến</TableHead>
                    </>
                  ) : (
                    <TableHead>Khách hàng</TableHead>
                  )}
                  {config.showShipping && <TableHead>Đơn vị vận chuyển</TableHead>}
                  <TableHead className="text-right whitespace-nowrap">Số lượng</TableHead>
                  <TableHead className="whitespace-nowrap">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow
                    key={item.systemId}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleRowClick(item)}
                  >
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {TYPE_LABELS[item.type] || item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {/* For in-delivery, use dispatchDate with fallback to order date */}
                      {type === 'in-delivery' 
                        ? (item.dispatchDate 
                            ? formatDateForDisplay(item.dispatchDate) 
                            : (item.date ? formatDateForDisplay(item.date) : '-'))
                        : (item.date ? formatDateForDisplay(item.date) : '-')
                      }
                    </TableCell>
                    {config.showFromTo ? (
                      <>
                        <TableCell>{item.fromBranch || item.supplierName || '-'}</TableCell>
                        <TableCell>{item.toBranch || '-'}</TableCell>
                      </>
                    ) : (
                      <TableCell>{item.customerName || '-'}</TableCell>
                    )}
                    {config.showShipping && (
                      <TableCell>{item.shippingCarrier || '-'}</TableCell>
                    )}
                    <TableCell className="text-right">
                      <span className="text-primary font-semibold">{item.quantity}</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusBadgeVariant(item.statusVariant)}
                        className={cn(
                          item.statusVariant === 'warning' && 'bg-orange-100 text-orange-700 border-orange-200',
                          item.statusVariant === 'success' && 'bg-green-100 text-green-700 border-green-200',
                        )}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </div>

        {/* Pagination - show whenever there are items */}
        {!isLoading && totalItems > 0 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Hiển thị {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)} / {totalItems} phiếu
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Trước
              </Button>
              <span className="text-sm px-2">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Sau
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
