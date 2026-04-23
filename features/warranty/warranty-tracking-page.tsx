/**
 * Public Warranty Tracking Page
 * Allow customers to track their warranty ticket status without login
 * 
 * Mobile-first, shadcn/ui components
 * Horizontal status timeline at top
 * Card visibility controlled by admin settings
 */

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Clock, CheckCircle, XCircle, AlertCircle, Package, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Textarea } from '../../components/ui/textarea';
import { formatDateTime } from '../../lib/date-utils';
import { cn } from '../../lib/utils';
import { OptimizedImage } from '../../components/ui/optimized-image';
import { WARRANTY_STATUS_LABELS, WARRANTY_STATUS_COLORS, RESOLUTION_LABELS } from './types';
import type { WarrantyStatus } from './types';
import type { PublicWarrantyTicket, PublicWarrantyProduct, PublicWarrantyPayment, PublicWarrantyReceipt, PublicWarrantyOrder, PublicWarrantyComment } from './public-warranty-api';
import {
  loadTrackingSettings,
} from './tracking-utils';
import { usePublicTracking } from './hooks/use-public-tracking';

import { mobileBleedCardClass } from '@/components/layout/page-section';
// Lazy load ImagePreviewDialog
const ImagePreviewDialog = React.lazy(() =>
  import('../../components/ui/image-preview-dialog').then(module => ({
    default: module.ImagePreviewDialog
  }))
);

// ============================================
// Settings type with card visibility
// ============================================
interface TrackingSettings {
  enabled: boolean;
  showEmployeeName: boolean;
  showTimeline: boolean;
  allowCustomerComments: boolean;
  showProductList: boolean;
  showSummary: boolean;
  showPayment: boolean;
  showReceivedImages: boolean;
  showProcessedImages: boolean;
  showHistory: boolean;
}

const defaultSettings: TrackingSettings = {
  enabled: true,
  showEmployeeName: true,
  showTimeline: true,
  allowCustomerComments: false,
  showProductList: true,
  showSummary: true,
  showPayment: true,
  showReceivedImages: true,
  showProcessedImages: true,
  showHistory: true,
};

// ============================================
// Horizontal Status Timeline
// ============================================
function StatusTimeline({ ticket }: { ticket: PublicWarrantyTicket }) {
  const baseStatuses: WarrantyStatus[] = ['RECEIVED', 'PROCESSING', 'RETURNED', 'COMPLETED'];
  const statuses: WarrantyStatus[] =
    ticket.status === 'CANCELLED' ? [...baseStatuses, 'CANCELLED'] : baseStatuses;
  const currentIndex = statuses.indexOf(ticket.status);

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-start min-w-120">
        {statuses.map((status, index) => {
          const isPast = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const isCancelled = status === 'CANCELLED';
          const timestamp = getStatusTimestamp(ticket, status);

          return (
            <div key={status} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {index > 0 && (
                <div
                  className={cn(
                    'absolute top-4 right-1/2 w-full h-0.5 z-0',
                    isPast ? (isCancelled ? 'bg-destructive/40' : 'bg-primary') : 'bg-muted-foreground/20'
                  )}
                />
              )}

              {/* Status dot */}
              <div
                className={cn(
                  'relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all',
                  isCurrent && !isCancelled && 'bg-primary border-primary text-primary-foreground ring-4 ring-primary/20',
                  isCurrent && isCancelled && 'bg-destructive border-destructive text-destructive-foreground ring-4 ring-destructive/20',
                  isPast && !isCurrent && 'bg-primary border-primary text-primary-foreground',
                  !isPast && 'bg-background border-muted-foreground/30 text-muted-foreground',
                )}
              >
                {isPast && !isCancelled && <CheckCircle className="h-4 w-4" />}
                {isCancelled && isPast && <XCircle className="h-4 w-4" />}
                {!isPast && <span className="text-xs font-medium">{index + 1}</span>}
              </div>

              {/* Label */}
              <div className="mt-2 text-center px-1">
                <p className={cn(
                  'text-xs font-medium leading-tight',
                  isCurrent && 'text-primary',
                  !isPast && !isCurrent && 'text-muted-foreground',
                )}>
                  {WARRANTY_STATUS_LABELS[status]}
                </p>
                {isCurrent && (
                  <Badge variant="default" className="mt-1 h-4 text-xs px-1.5">
                    Hiện tại
                  </Badge>
                )}
                {timestamp && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDateTime(timestamp)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// Get timestamp for status from history
// ============================================
function getStatusTimestamp(ticket: PublicWarrantyTicket, status: WarrantyStatus): string | null {
  const directTimestampByStatus: Partial<Record<WarrantyStatus, string | undefined>> = {
    RECEIVED: ticket.createdAt,
    PROCESSING: ticket.processingStartedAt,
    WAITING_PARTS: undefined,
    RETURNED: ticket.returnedAt,
    COMPLETED: ticket.completedAt,
    CANCELLED: ticket.cancelledAt,
  };

  const directTimestamp = directTimestampByStatus[status];
  if (directTimestamp) return directTimestamp;

  // Fallback: search history for status change entries
  const statusLabel = (WARRANTY_STATUS_LABELS[status] || '').toLowerCase();

  const historyEntry = ticket.history.find((entry) => {
    const action = (entry.action || '').toLowerCase();
    const actionLabel = (entry.actionLabel || '').toLowerCase();

    if (action.includes(`status_change_${status.toLowerCase()}`)) return true;
    if (action.includes(`-> ${status.toLowerCase()}`) || action.includes(`: ${status.toLowerCase()}`)) return true;
    if (statusLabel && actionLabel.includes(statusLabel)) return true;

    return false;
  });

  if (historyEntry?.performedAt) return historyEntry.performedAt;

  // Final fallback: for PROCESSING, try completedAt if we passed through it
  if (status === 'PROCESSING' && (ticket.processedAt || ticket.returnedAt || ticket.completedAt)) {
    // We must have been in PROCESSING at some point — use the earliest available downstream timestamp
    return ticket.processedAt || ticket.returnedAt || ticket.completedAt || null;
  }

  return null;
}

// ============================================
// Products Table (Public - no auth needed)
// ============================================
function PublicProductsTable({ products, onImageClick }: {
  products: PublicWarrantyProduct[];
  onImageClick: (images: string[], index: number) => void;
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Chưa có sản phẩm nào
      </div>
    );
  }

  const getResolutionBadge = (resolution: string) => {
    const variants: Record<string, string> = {
      return: 'bg-green-100 text-green-800',
      replace: 'bg-blue-100 text-blue-800',
      deduct: 'bg-orange-100 text-orange-800',
      out_of_stock: 'bg-red-100 text-red-800',
    };
    return variants[resolution] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      {/* Mobile: Card layout */}
      <div className="block lg:hidden space-y-3">
        {products.map((product, index) => {
          const warrantyImages = (product.productImages || []).filter(Boolean);
          return (
            <Card key={product.systemId} className="overflow-hidden">
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-3">
                  {/* Header: Image + Name + Badge */}
                  <div className="flex gap-3">
                    {product.catalogImage ? (
                      <div className="shrink-0 w-14 h-14 rounded-md overflow-hidden border border-muted">
                        <OptimizedImage src={product.catalogImage} alt={product.productName} width={56} height={56} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="shrink-0 w-14 h-14 rounded-md bg-muted flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm leading-snug">{product.productName}</p>
                      {product.sku && (
                        <p className="text-xs text-muted-foreground mt-0.5">{product.sku}</p>
                      )}
                    </div>
                    <Badge className={cn(getResolutionBadge(product.resolution), "text-xs px-2 py-0.5 h-fit")}>
                      {RESOLUTION_LABELS[product.resolution] || product.resolution}
                    </Badge>
                  </div>

                  <Separator />

                  {/* Quantity & Price */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Số lượng</p>
                      <p className="font-semibold text-sm">{product.quantity || 1}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Đơn giá</p>
                      <p className="font-semibold text-sm">
                        {new Intl.NumberFormat('vi-VN').format(product.unitPrice || 0)} đ
                      </p>
                    </div>
                  </div>

                  {/* Warranty images */}
                  {warrantyImages.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1.5">Hình ảnh bảo hành</p>
                        <div className="flex gap-1.5 flex-wrap">
                          {warrantyImages.slice(0, 3).map((url, imgIdx) => (
                            <button
                              key={imgIdx}
                              onClick={() => onImageClick(warrantyImages, imgIdx)}
                              className="relative w-14 h-14 shrink-0 rounded border overflow-hidden hover:ring-2 ring-primary transition-all"
                            >
                              <OptimizedImage src={url} alt={`SP ${index + 1}`} width={56} height={56} className="w-full h-full object-cover" />
                            </button>
                          ))}
                          {warrantyImages.length > 3 && (
                            <div className="w-14 h-14 rounded border bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                              +{warrantyImages.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Notes */}
                  {(product.issueDescription || product.notes) && (
                    <>
                      <Separator />
                      <div className="space-y-1">
                        {product.issueDescription && (
                          <p className="text-xs text-orange-600 font-medium">
                            <span className="text-muted-foreground">Vấn đề: </span>{product.issueDescription}
                          </p>
                        )}
                        {product.notes && (
                          <p className="text-xs text-muted-foreground">{product.notes}</p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Total */}
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Thành tiền:</span>
                    <span className="font-bold text-sm">
                      {new Intl.NumberFormat('vi-VN').format((product.quantity || 1) * (product.unitPrice || 0))} đ
                    </span>
                  </div>

                  {/* Compensation */}
                  {product.resolution === 'out_of_stock' && (
                    <div className="flex justify-between items-center bg-red-50 -mx-3 -mb-3 px-3 py-2 sm:-mx-4 sm:-mb-4 sm:px-4">
                      <span className="text-xs font-medium text-red-700">Bù trừ:</span>
                      <span className="font-bold text-sm text-red-600">
                        {new Intl.NumberFormat('vi-VN').format((product.quantity || 1) * (product.unitPrice || 0))} đ
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Desktop: Table layout */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-center py-3 px-2 w-12 font-medium text-muted-foreground">STT</th>
              <th className="text-left py-3 px-2 min-w-64 font-medium text-muted-foreground">Tên sản phẩm</th>
              <th className="text-center py-3 px-2 w-12 font-medium text-muted-foreground">SL</th>
              <th className="text-right py-3 px-2 w-28 font-medium text-muted-foreground">Đơn giá</th>
              <th className="text-left py-3 px-2 w-24 font-medium text-muted-foreground">Hình ảnh</th>
              <th className="text-left py-3 px-2 w-24 font-medium text-muted-foreground">Kết quả</th>
              <th className="text-left py-3 px-2 min-w-24 font-medium text-muted-foreground">Ghi chú</th>
              <th className="text-right py-3 px-2 w-28 font-medium text-muted-foreground">Thành tiền</th>
              <th className="text-right py-3 px-2 w-28 font-medium text-muted-foreground">Bù trừ</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const warrantyImages = (product.productImages || []).filter(Boolean);
              return (
                <tr key={product.systemId} className="border-b last:border-0">
                  <td className="text-center py-3 px-2 font-medium">{index + 1}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-start gap-2">
                      {product.catalogImage ? (
                        <div className="shrink-0 w-10 h-10 rounded-md overflow-hidden border border-muted">
                          <OptimizedImage src={product.catalogImage} alt={product.productName} width={40} height={40} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="shrink-0 w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-sm leading-snug">{product.productName}</p>
                        {product.sku && (
                          <p className="text-xs text-muted-foreground mt-0.5">{product.sku}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-3 px-2 font-medium">{product.quantity || 1}</td>
                  <td className="text-right py-3 px-2">
                    {new Intl.NumberFormat('vi-VN').format(product.unitPrice || 0)} đ
                  </td>
                  <td className="py-3 px-2">
                    {warrantyImages.length > 0 ? (
                      <div className="flex gap-1 items-center">
                        {warrantyImages.slice(0, 2).map((url, imgIdx) => (
                          <button
                            key={imgIdx}
                            onClick={() => onImageClick(warrantyImages, imgIdx)}
                            className="relative w-9 h-9 shrink-0 rounded border overflow-hidden hover:ring-2 ring-primary transition-all"
                          >
                            <OptimizedImage src={url} alt={`SP ${index + 1}`} width={36} height={36} className="w-full h-full object-cover" />
                          </button>
                        ))}
                        {warrantyImages.length > 2 && (
                          <div className="w-9 h-9 rounded border bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                            +{warrantyImages.length - 2}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <Badge className={cn(getResolutionBadge(product.resolution), "text-xs px-2 py-0.5")}>
                      {RESOLUTION_LABELS[product.resolution] || product.resolution}
                    </Badge>
                  </td>
                  <td className="py-3 px-2">
                    <div className="space-y-0.5">
                      {product.issueDescription && (
                        <p className="text-xs text-orange-600 font-medium">Vấn đề: {product.issueDescription}</p>
                      )}
                      {product.notes && (
                        <p className="text-xs text-muted-foreground">{product.notes}</p>
                      )}
                      {!product.issueDescription && !product.notes && (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </td>
                  <td className="text-right py-3 px-2 font-medium">
                    {new Intl.NumberFormat('vi-VN').format((product.quantity || 1) * (product.unitPrice || 0))} đ
                  </td>
                  <td className="text-right py-3 px-2 font-medium">
                    {product.resolution === 'out_of_stock' ? (
                      <span className="text-red-600">
                        {new Intl.NumberFormat('vi-VN').format((product.quantity || 1) * (product.unitPrice || 0))} đ
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ============================================
// Image Gallery Card
// ============================================
function ImageGalleryCard({ title, images, onImageClick }: {
  title: string;
  images: string[];
  onImageClick: (images: string[], index: number) => void;
}) {
  if (!images || images.length === 0) return null;

  return (
    <Card className={mobileBleedCardClass}>
      <CardHeader className="pb-3 px-4 pt-4 md:px-6 md:pt-6">
        <CardTitle className="text-base sm:text-lg">
          {title} ({images.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
          {images.map((url, idx) => (
            <button
              key={idx}
              onClick={() => onImageClick(images, idx)}
              className="group relative aspect-square rounded-lg overflow-hidden border transition-colors hover:border-primary"
            >
              <OptimizedImage
                src={url}
                alt={`${title} ${idx + 1}`}
                fill
                containerClassName="w-full h-full"
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Payment Details Card
// ============================================
function PaymentDetailsCard({ ticket, payments, receipts, orders }: {
  ticket: PublicWarrantyTicket;
  payments: PublicWarrantyPayment[];
  receipts: PublicWarrantyReceipt[];
  orders: PublicWarrantyOrder[];
}) {
  const products = ticket.products || [];
  const totalValue = products.reduce((sum, p) => sum + ((p.quantity || 1) * (p.unitPrice || 0)), 0);
  const outOfStockValue = products
    .filter(p => p.resolution === 'out_of_stock')
    .reduce((sum, p) => sum + ((p.quantity || 1) * (p.unitPrice || 0)), 0);
  const replacedValue = products
    .filter(p => p.resolution === 'replace')
    .reduce((sum, p) => sum + ((p.quantity || 1) * (p.unitPrice || 0)), 0);
  const shippingFee = ticket.shippingFee || 0;
  const netAmount = Math.max(0, outOfStockValue - shippingFee);
  const totalQty = products.reduce((sum, p) => sum + (p.quantity || 1), 0);
  const replaceQty = products.filter(p => p.resolution === 'replace').reduce((sum, p) => sum + (p.quantity || 1), 0);
  const outOfStockQty = products.filter(p => p.resolution === 'out_of_stock').reduce((sum, p) => sum + (p.quantity || 1), 0);

  const relatedPayments = payments.filter(p => p.status !== 'cancelled');
  const relatedReceipts = receipts.filter(r => r.status !== 'cancelled');

  const totalPaid = relatedPayments.reduce((sum, p) => sum + p.amount, 0)
    + relatedReceipts.reduce((sum, r) => sum - r.amount, 0);

  if (products.length === 0 && relatedPayments.length === 0 && relatedReceipts.length === 0) {
    return null;
  }

  const remaining = netAmount - totalPaid;
  const isPaid = remaining <= 0 && totalPaid > 0;

  const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n);

  return (
    <Card className={mobileBleedCardClass}>
      <CardHeader className="pb-3 px-4 pt-4 md:px-6 md:pt-6">
        <CardTitle className="text-base sm:text-lg">Tổng kết bảo hành & Thanh toán</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4 md:px-6 md:pb-6">
        {/* Summary section */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center gap-3">
            <span className="text-sm text-muted-foreground">Tổng giá trị bảo hành</span>
            <span className="font-semibold text-sm">{fmt(totalValue)} đ</span>
          </div>

          {replacedValue > 0 && (
            <div className="flex justify-between items-center gap-3">
              <span className="text-sm text-muted-foreground">Tổng giá trị đổi mới</span>
              <span className="font-medium text-sm">{fmt(replacedValue)} đ</span>
            </div>
          )}

          {outOfStockValue > 0 && (
            <div className="flex justify-between items-center gap-3">
              <span className="text-sm text-muted-foreground">Tổng hàng bù trừ (hết hàng)</span>
              <span className="font-medium text-sm">{fmt(outOfStockValue)} đ</span>
            </div>
          )}

          {shippingFee > 0 && (
            <div className="flex justify-between items-center gap-3">
              <span className="text-sm text-muted-foreground">Phí ship gửi về</span>
              <span className="font-medium text-sm text-orange-600">-{fmt(shippingFee)} đ</span>
            </div>
          )}

          <Separator />
          <div className="flex justify-between items-center gap-3">
            <span className="font-semibold text-sm">Cần chi cho khách</span>
            <span className="font-bold text-base text-destructive">{fmt(netAmount)} đ</span>
          </div>

          {/* Quantity summary */}
          <Separator />
          <div className="flex justify-between items-center gap-3">
            <span className="text-sm text-muted-foreground">Tổng số lượng</span>
            <span className="font-medium text-sm">{totalQty}</span>
          </div>
          {replaceQty > 0 && (
            <div className="flex justify-between items-center gap-3 pl-4">
              <span className="text-xs text-muted-foreground">↳ Đổi mới</span>
              <span className="text-xs font-medium">{replaceQty}</span>
            </div>
          )}
          {outOfStockQty > 0 && (
            <div className="flex justify-between items-center gap-3 pl-4">
              <span className="text-xs text-muted-foreground">↳ Hết hàng</span>
              <span className="text-xs font-medium">{outOfStockQty}</span>
            </div>
          )}
        </div>

        {/* Payment transactions */}
        {(relatedPayments.length > 0 || relatedReceipts.length > 0) && (
          <>
            <Separator />
            <div className="space-y-3">
              <p className="text-sm font-semibold">Chi tiết thanh toán</p>
              <div className="space-y-2.5 pl-3 border-l-2 border-muted">
                {relatedPayments.map(payment => {
                  const linkedOrder = payment.linkedOrderSystemId
                    ? orders.find(o => o.systemId === payment.linkedOrderSystemId)
                    : null;
                  return (
                    <div key={payment.systemId} className="space-y-0.5">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">
                            {linkedOrder
                              ? `Trừ vào đơn hàng ${linkedOrder.id}`
                              : payment.paymentMethodName || 'Phương thức khác'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDateTime(payment.createdAt)}
                          </p>
                        </div>
                        <span className="font-semibold text-emerald-600 whitespace-nowrap text-sm">
                          +{fmt(payment.amount)} đ
                        </span>
                      </div>
                    </div>
                  );
                })}
                {relatedReceipts.map(receipt => (
                  <div key={receipt.systemId} className="space-y-0.5">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{receipt.paymentMethodName || 'Thu tiền'}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDateTime(receipt.createdAt)}
                        </p>
                      </div>
                      <span className="font-semibold text-destructive whitespace-nowrap text-sm">
                        -{fmt(receipt.amount)} đ
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="flex justify-between items-center gap-3 pt-1">
                <span className="text-sm text-muted-foreground">Đã thanh toán</span>
                <span className="font-semibold text-emerald-600 text-sm">{fmt(totalPaid)} đ</span>
              </div>
            </div>
          </>
        )}

        {/* Remaining */}
        {remaining > 0 && (
          <>
            <Separator />
            <div className="flex justify-between items-center gap-3 bg-orange-50 -mx-4 px-4 py-2.5 md:-mx-6 md:px-6 rounded-b-lg">
              <span className="text-sm font-semibold text-orange-800">Còn lại</span>
              <span className="font-bold text-orange-600 text-base">{fmt(remaining)} đ</span>
            </div>
          </>
        )}

        {isPaid && (
          <>
            <Separator />
            <div className="flex items-center justify-center gap-2 py-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold text-sm">Đã thanh toán đủ</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// Public Comments Section
// ============================================
interface PublicCommentsSectionProps {
  comments: PublicWarrantyComment[];
  allowCustomerComments: boolean;
  trackingCode: string;
  onCommentAdded?: () => void;
}

function PublicCommentsSection({
  comments,
  allowCustomerComments,
  trackingCode,
}: PublicCommentsSectionProps) {
  const [newComment, setNewComment] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [localComments, setLocalComments] = React.useState<PublicWarrantyComment[]>(comments);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Sync with prop changes
  React.useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const handleSubmitComment = React.useCallback(async () => {
    const trimmed = newComment.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/public/warranty-tracking/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingCode, content: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Không thể gửi bình luận');
      }

      const data = await res.json();
      setLocalComments(prev => [...prev, data.comment]);
      setNewComment('');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Lỗi khi gửi bình luận');
    } finally {
      setSubmitting(false);
    }
  }, [newComment, submitting, trackingCode]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  }, [handleSubmitComment]);

  if (localComments.length === 0 && !allowCustomerComments) {
    return null;
  }

  return (
    <Card className={mobileBleedCardClass}>
      <CardHeader className="px-4 pt-4 pb-3 md:px-6 md:pt-6">
        <CardTitle className="text-base sm:text-lg">Bình luận</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
        {/* Comment list */}
        {localComments.length > 0 ? (
          <ScrollArea className={localComments.length > 5 ? 'h-80' : undefined}>
            <div className="space-y-3">
              {localComments.map((comment, index) => {
                const isCustomer = comment.createdByName === 'Khách hàng';
                return (
                  <div
                    key={comment.systemId || index}
                    className={cn(
                      'rounded-lg p-3 text-sm',
                      isCustomer
                        ? 'bg-blue-50 border border-blue-100 ml-4 sm:ml-8'
                        : 'bg-muted mr-4 sm:mr-8'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-xs sm:text-sm">
                        {comment.createdByName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-4 text-muted-foreground text-sm">
            Chưa có bình luận nào
          </div>
        )}

        {/* Comment input */}
        {allowCustomerComments && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <Textarea
                placeholder="Nhập bình luận của bạn..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                className="resize-none text-sm"
                disabled={submitting}
              />
              {submitError && (
                <p className="text-xs text-destructive">{submitError}</p>
              )}
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || submitting}
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// Main Page Component
// ============================================
export function WarrantyTrackingPage() {
  const { trackingCode } = useParams<{ trackingCode: string }>();

  const { ticket, comments, receipts, payments, orders, hotline, settings: apiSettings, loading, error } = usePublicTracking(trackingCode);

  // Merge API settings with defaults
  const settings = React.useMemo<TrackingSettings>(() => {
    if (apiSettings) {
      return { ...defaultSettings, ...apiSettings };
    }
    const loaded = loadTrackingSettings();
    return { ...defaultSettings, ...loaded };
  }, [apiSettings]);

  // Image preview state
  const [showImagePreview, setShowImagePreview] = React.useState(false);
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = React.useState(0);

  const handleImageClick = React.useCallback((images: string[], index: number) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setShowImagePreview(true);
  }, []);

  // Linked order
  const linkedOrder = React.useMemo(() => {
    if (!ticket?.linkedOrderSystemId) return null;
    return orders.find(o => o.systemId === ticket.linkedOrderSystemId);
  }, [ticket?.linkedOrderSystemId, orders]);

  // ============================================
  // Error / Loading states
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary animate-spin" />
              Đang tải dữ liệu bảo hành...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Vui lòng chờ trong giây lát.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!settings.enabled && !loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-5 w-5" />
              Tính năng tạm thời không khả dụng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Tính năng theo dõi công khai hiện đang tắt. Vui lòng liên hệ bộ phận hỗ trợ.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error === 'UNKNOWN') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Không thể tải dữ liệu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Đã xảy ra lỗi khi tải thông tin phiếu bảo hành. Vui lòng thử lại sau.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!ticket) {
    const isMissingCode = error === 'MISSING_TRACKING_CODE';
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              {isMissingCode ? 'Thiếu mã tra cứu' : 'Không tìm thấy phiếu bảo hành'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              {isMissingCode
                ? 'Vui lòng kiểm tra lại đường dẫn tra cứu bảo hành.'
                : 'Phiếu bảo hành không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại mã phiếu.'}
            </p>
            {!isMissingCode && trackingCode && (
              <p className="text-xs text-muted-foreground mt-4">
                Mã phiếu: <span className="font-semibold">{trackingCode}</span>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================
  // Main render
  // ============================================
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">
                  Phiếu bảo hành {ticket.id}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Nhân viên phụ trách: {settings.showEmployeeName ? ticket.employeeName : 'Đang xử lý'}
                </p>
              </div>
              <Badge className={cn("shrink-0 text-xs px-2 py-0.5 sm:px-2.5 sm:py-1", WARRANTY_STATUS_COLORS[ticket.status])}>
                {WARRANTY_STATUS_LABELS[ticket.status]}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Timeline - at top before all cards */}
      {settings.showTimeline && (
        <div className="border-b bg-white">
          <div className="container max-w-7xl mx-auto px-4 py-4 md:py-6">
            <StatusTimeline ticket={ticket} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className="grid gap-4 md:gap-6">

          {/* Card: Thông tin phiếu bảo hành */}
          <Card className={mobileBleedCardClass}>
            <CardHeader className="pb-3 px-4 pt-4 md:px-6 md:pt-6">
              <CardTitle className="text-base sm:text-lg">
                Thông tin phiếu bảo hành
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 pb-4 md:px-6 md:pb-6">
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {/* Row 1: Mã phiếu | Chi nhánh | Nhân viên */}
                <div>
                  <p className="text-xs text-muted-foreground">Mã phiếu</p>
                  <p className="font-bold text-primary">{ticket.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Chi nhánh</p>
                  <p className="font-medium text-sm">{ticket.branchName || '—'}</p>
                </div>
                {settings.showEmployeeName && (
                  <div>
                    <p className="text-xs text-muted-foreground">Nhân viên</p>
                    <p className="font-medium text-sm text-blue-600">{ticket.employeeName || '—'}</p>
                  </div>
                )}

                {/* Row 2: Mã vận đơn | Phí ship gửi về | Trả bảo hành vào đơn hàng */}
                {ticket.trackingCode && (
                  <div>
                    <p className="text-xs text-muted-foreground">Mã vận đơn</p>
                    <p className="font-medium text-sm">{ticket.trackingCode}</p>
                  </div>
                )}
                {ticket.shippingFee !== undefined && ticket.shippingFee > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground">Phí ship gửi về</p>
                    <p className="font-medium text-sm">{ticket.shippingFee.toLocaleString('vi-VN')} đ</p>
                  </div>
                )}
                {ticket.linkedOrderSystemId && (
                  <div>
                    <p className="text-xs text-muted-foreground">Trả bảo hành vào đơn hàng</p>
                    <p className="font-medium text-sm text-blue-600">
                      {linkedOrder?.id || ticket.linkedOrderSystemId}
                    </p>
                  </div>
                )}

                {/* Row 3: Ngày tạo | Đã trả hàng | Kết thúc phiếu */}
                <div>
                  <p className="text-xs text-muted-foreground">Ngày tạo</p>
                  <p className="text-sm">{formatDateTime(ticket.createdAt)}</p>
                </div>
                {ticket.returnedAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">Đã trả hàng</p>
                    <p className="text-sm">{formatDateTime(ticket.returnedAt)}</p>
                    {(() => {
                      const performer = ticket.history.find(h => 
                        h.action?.toLowerCase().includes('status_change_returned')
                      )?.performedBy;
                      return performer ? <p className="text-xs text-muted-foreground mt-0.5">bởi {performer}</p> : null;
                    })()}
                  </div>
                )}
                {ticket.completedAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">Kết thúc phiếu</p>
                    <p className="text-sm text-blue-600">{formatDateTime(ticket.completedAt)}</p>
                  </div>
                )}
                {ticket.cancelledAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">Đã hủy</p>
                    <p className="text-sm text-red-600">{formatDateTime(ticket.cancelledAt)}</p>
                    {ticket.cancelReason && (
                      <p className="text-xs text-muted-foreground mt-0.5">Lý do: {ticket.cancelReason}</p>
                    )}
                  </div>
                )}

                {/* Row 4: Cập nhật | Người tạo */}
                {ticket.updatedAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">Cập nhật</p>
                    <p className="text-sm">{formatDateTime(ticket.updatedAt)}</p>
                    {ticket.updatedBy && (
                      <p className="text-xs text-muted-foreground mt-0.5">bởi {ticket.updatedBy}</p>
                    )}
                  </div>
                )}
                {ticket.createdBy && (
                  <div>
                    <p className="text-xs text-muted-foreground">Người tạo</p>
                    <p className="font-medium text-sm">{ticket.createdBy}</p>
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <Separator />
              <div className="space-y-3">
                <p className="text-sm font-semibold">Thông tin khách hàng</p>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Tên khách hàng</p>
                    <p className="font-medium text-sm">{ticket.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Số điện thoại</p>
                    <p className="font-medium text-sm">{ticket.customerPhone}</p>
                  </div>
                  {ticket.customerAddress && (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                      <p className="text-xs text-muted-foreground">Địa chỉ</p>
                      <p className="text-sm">{ticket.customerAddress}</p>
                    </div>
                  )}
                </div>
              </div>

              {ticket.notes && (
                <>
                  <Separator />
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold">Ghi chú</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{ticket.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Card: Danh sách sản phẩm bảo hành */}
          {settings.showProductList && (
            <Card className={mobileBleedCardClass}>
              <CardHeader className="pb-3 px-4 pt-4 md:px-6 md:pt-6">
                <CardTitle className="text-base sm:text-lg">
                  Danh sách sản phẩm bảo hành
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                <PublicProductsTable
                  products={ticket.products || []}
                  onImageClick={handleImageClick}
                />
              </CardContent>
            </Card>
          )}

          {/* Card: Tổng kết bảo hành & Thanh toán (merged) */}
          {(settings.showSummary || settings.showPayment) && (
            <PaymentDetailsCard
              ticket={ticket}
              payments={payments}
              receipts={receipts}
              orders={orders}
            />
          )}

          {/* Card: Hình ảnh lúc nhận */}
          {settings.showReceivedImages && (
            <ImageGalleryCard
              title="Hình ảnh lúc nhận"
              images={ticket.receivedImages || []}
              onImageClick={handleImageClick}
            />
          )}

          {/* Card: Hình ảnh đã xử lý */}
          {settings.showProcessedImages && (
            <ImageGalleryCard
              title="Hình ảnh đã xử lý"
              images={ticket.processedImages || []}
              onImageClick={handleImageClick}
            />
          )}

          {/* Card: Lịch sử thao tác */}
          {settings.showHistory && settings.showTimeline && (
            <Card className={mobileBleedCardClass}>
              <CardHeader className="px-4 pt-4 pb-3 md:px-6 md:pt-6">
                <CardTitle className="text-base sm:text-lg">Lịch sử thao tác</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                <ScrollArea className="h-75">
                  <div className="space-y-4">
                    {ticket.history.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        Chưa có lịch sử nào
                      </div>
                    ) : (
                      ticket.history
                        .slice()
                        .reverse()
                        .map((entry, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="shrink-0 mt-1.5">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{entry.actionLabel || entry.action}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDateTime(entry.performedAt)} • {entry.performedBy}
                              </p>
                              {entry.note && (
                                <p className="text-sm text-muted-foreground mt-1">{entry.note}</p>
                              )}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Card: Bình luận */}
          {settings.allowCustomerComments && (
            <PublicCommentsSection
              comments={comments}
              allowCustomerComments={settings.allowCustomerComments}
              trackingCode={trackingCode || ''}
            />
          )}

          {/* Footer */}
          <div className="text-center text-muted-foreground py-6 sm:py-8 border-t">
            <p className="text-sm md:text-base px-4">
              Có thắc mắc? Liên hệ hotline:{' '}
              <span className="font-semibold text-primary text-base md:text-lg">{hotline}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Image Preview Dialog */}
      {showImagePreview && (
        <React.Suspense fallback={null}>
          <ImagePreviewDialog
            images={previewImages}
            initialIndex={previewIndex}
            open={showImagePreview}
            onOpenChange={setShowImagePreview}
            title="Hình ảnh bảo hành"
          />
        </React.Suspense>
      )}
    </div>
  );
}
