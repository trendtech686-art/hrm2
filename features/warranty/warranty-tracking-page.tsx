/**
 * Public Warranty Tracking Page
 * Allow customers to track their warranty ticket status without login
 * Pattern copied from Complaints tracking system
 */

import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, AlertCircle, Phone, MapPin, Link as LinkIcon, Calendar, User, Image as ImageIcon, ExternalLink, Truck, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Button } from '../../components/ui/button';
import { formatDateTime } from '../../lib/date-utils';
import { cn } from '../../lib/utils';
import { WARRANTY_STATUS_LABELS, WARRANTY_STATUS_COLORS, SETTLEMENT_TYPE_LABELS, SETTLEMENT_STATUS_LABELS } from './types';
import type { WarrantyTicket, WarrantyStatus } from './types';
import { 
  loadTrackingSettings, 
  shouldShowEmployeeName,
  shouldShowTimeline,
} from './tracking-utils';
import { WarrantyProductsDetailTable } from './components/warranty-products-detail-table.tsx';
import { usePublicTracking } from './hooks/use-public-tracking';

// Lazy load ImagePreviewDialog để giảm bundle size ban đầu
const ImagePreviewDialog = React.lazy(() => 
  import('../../components/ui/image-preview-dialog').then(module => ({
    default: module.ImagePreviewDialog
  }))
);

/**
 * Get status icon
 */
function getStatusIcon(status: WarrantyStatus) {
  const icons: Record<WarrantyStatus, any> = {
    incomplete: AlertCircle,
    pending: Clock,
    processed: CheckCircle,
    returned: Package,
    completed: CheckCircle,
  };
  return icons[status] || AlertCircle; // Fallback to AlertCircle if status not found
}

/**
 * Status timeline component
 */
function StatusTimeline({ ticket }: { ticket: WarrantyTicket }) {
  const statuses: WarrantyStatus[] = ['incomplete', 'pending', 'processed', 'returned', 'completed'];
  const currentIndex = statuses.indexOf(ticket.status);

  return (
    <div className="space-y-4">
      {statuses.map((status, index) => {
        const Icon = getStatusIcon(status);
        const isPast = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const timestamp = getStatusTimestamp(ticket, status);

        return (
          <div key={status} className="flex gap-4">
            {/* Icon & Line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'rounded-full p-2 border-2',
                  isPast
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-muted border-muted-foreground/20 text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              {index < statuses.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 h-12 my-1',
                    isPast ? 'bg-primary' : 'bg-muted-foreground/20'
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn('font-medium', isCurrent && 'text-primary')}>
                  {WARRANTY_STATUS_LABELS[status]}
                </span>
                {isCurrent && (
                  <Badge variant="default" className="h-5">
                    Hiện tại
                  </Badge>
                )}
              </div>
              {timestamp && (
                <div className="text-sm text-muted-foreground">
                  {formatDateTime(timestamp)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Get timestamp for a specific status from history
 */
function getStatusTimestamp(ticket: WarrantyTicket, status: WarrantyStatus): string | null {
  if (status === 'incomplete') {
    return ticket.createdAt;
  }

  if (status === 'returned' && ticket.returnedAt) {
    return ticket.returnedAt;
  }

  // Find status change in history
  const historyEntry = ticket.history.find((h) =>
    h.action.includes(WARRANTY_STATUS_LABELS[status])
  );

  return historyEntry?.performedAt || null;
}

/**
 * Public Tracking Page Component
 */
export function WarrantyTrackingPage() {
  const { trackingCode } = useParams<{ trackingCode: string }>();
  
  // Use optimized hook to fetch only necessary data
  const { ticket, receipts, payments, orders, hotline } = usePublicTracking(trackingCode);
  
  // Load tracking settings (recalculate on every render to catch changes)
  const settings = React.useMemo(() => {
    const loaded = loadTrackingSettings();
    console.log('[Tracking Page] Settings loaded:', loaded);
    return loaded;
  }, []);
  
  console.log('[Tracking Page] Current settings.enabled:', settings.enabled);
  
  // Image preview state
  const [showImagePreview, setShowImagePreview] = React.useState(false);
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  
  // Handle image preview - memoized
  const handleImageClick = React.useCallback((images: string[], index: number) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setShowImagePreview(true);
  }, []);

  // Memoize linked order
  const linkedOrder = React.useMemo(() => {
    if (!ticket?.linkedOrderSystemId) return null;
    return orders.find(o => o.systemId === ticket.linkedOrderSystemId);
  }, [ticket?.linkedOrderSystemId, orders]);

  // Check if tracking is enabled
  if (!settings.enabled) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-5 w-5" />
              Tính năng tạm thời không khả dụng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Tính năng theo dõi công khai hiện đang tắt. Vui lòng liên hệ bộ phận hỗ trợ để được hỗ trợ.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Không tìm thấy phiếu bảo hành
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Phiếu bảo hành không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại mã phiếu.
            </p>
            <p className="text-sm text-muted-foreground">
              Mã phiếu: <span className="font-mono font-semibold">{trackingCode}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container max-w-5xl mx-auto px-3 py-3 sm:px-4 sm:py-4 md:py-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-start justify-between gap-2 sm:gap-3">
              <div className="space-y-1 min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">Phiếu bảo hành {ticket.id}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Nhân viên phụ trách: {shouldShowEmployeeName() ? ticket.employeeName : 'Đang xử lý'}
                </p>
              </div>
              <Badge className={cn("shrink-0 text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1", WARRANTY_STATUS_COLORS[ticket.status])}>
                {WARRANTY_STATUS_LABELS[ticket.status]}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto px-3 py-3 sm:px-4 sm:py-4 md:py-6">
        <div className="grid gap-3 sm:gap-4 md:gap-6">
        
        {/* Card 1: Thông tin phiếu bảo hành */}
        <Card>
          <CardHeader className="pb-3 px-3 pt-3 sm:px-4 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              Thông tin phiếu bảo hành
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:gap-4 md:gap-6 px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
            <div className="grid gap-2.5 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
              <div>
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">Ngày tạo</div>
                <div className="font-medium flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs sm:text-sm">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                  <span className="break-all">{formatDateTime(ticket.createdAt)}</span>
                </div>
              </div>
              {ticket.returnedAt && (
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">Ngày trả hàng</div>
                  <div className="font-medium flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs sm:text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="break-all">{formatDateTime(ticket.returnedAt)}</span>
                  </div>
                </div>
              )}
              {ticket.linkedOrderSystemId && (
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">Đơn bảo hành được trả vào </div>
                  <div className="font-mono font-medium text-blue-600 break-all text-xs sm:text-sm">
                    {linkedOrder?.id || ticket.linkedOrderSystemId}
                  </div>
                </div>
              )}
              {ticket.trackingCode && (
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">Mã vận đơn</div>
                  <div className="font-mono font-medium flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs sm:text-sm">
                    <Truck className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="break-all">{ticket.trackingCode}</span>
                  </div>
                </div>
              )}
              {ticket.status === 'returned' && (
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">Phương thức trả hàng</div>
                  <div className="font-medium text-xs sm:text-sm">
                    {ticket.linkedOrderSystemId 
                      ? `Giao qua đơn hàng (${linkedOrder?.id || ticket.linkedOrderSystemId})`
                      : 'Khách lấy trực tiếp tại cửa hàng'
                    }
                  </div>
                </div>
              )}
              {ticket.shippingFee > 0 && (
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">Phí ship gửi về( shop ko chịu phí cước này sẽ thu thêm )</div>
                  <div className="font-medium text-orange-600 text-base sm:text-lg">
                    {ticket.shippingFee.toLocaleString('vi-VN')} đ
                  </div>
                </div>
              )}
            </div>

            {/* Customer Info */}
            <div className="grid gap-3 sm:gap-4">
              <div className="text-xs sm:text-sm font-semibold">Thông tin khách hàng</div>
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="flex gap-2 sm:gap-3">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="grid gap-0.5 sm:gap-1">
                    <div className="text-xs sm:text-sm text-muted-foreground">Tên khách hàng</div>
                    <div className="font-medium text-xs sm:text-sm">{ticket.customerName}</div>
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="grid gap-0.5 sm:gap-1">
                    <div className="text-xs sm:text-sm text-muted-foreground">Số điện thoại</div>
                    <div className="font-medium text-xs sm:text-sm">{ticket.customerPhone}</div>
                  </div>
                </div>
                {ticket.customerAddress && (
                  <div className="flex gap-2 sm:gap-3 col-span-1 sm:col-span-2">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="grid gap-0.5 sm:gap-1">
                      <div className="text-xs sm:text-sm text-muted-foreground">Địa chỉ</div>
                      <div className="text-xs sm:text-sm">{ticket.customerAddress}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {ticket.notes && (
              <div className="grid gap-1.5 sm:gap-2">
                <div className="text-xs sm:text-sm font-semibold">Ghi chú</div>
                <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{ticket.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 2: Danh sách sản phẩm bảo hành */}
        <Card>
          <CardHeader className="pb-3 px-3 pt-3 sm:px-4 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              Danh sách sản phẩm bảo hành
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-full px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6">
                <WarrantyProductsDetailTable products={ticket.products} ticket={ticket} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Tổng kết bảo hành */}
        {ticket.products.length > 0 && (
          <Card>
            <CardHeader className="pb-3 px-3 pt-3 sm:px-4 sm:pt-4 md:px-6 md:pt-6">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                Tổng kết bảo hành
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-2.5 md:space-y-3 px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
              {/* Tổng giá trị bảo hành */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs sm:text-sm text-muted-foreground">Tổng giá trị bảo hành</span>
                <span className="font-semibold text-xs sm:text-sm">
                  {new Intl.NumberFormat('vi-VN').format(
                    ticket.products.reduce((sum, p) => sum + ((p.quantity || 1) * (p.unitPrice || 0)), 0)
                  )} đ
                </span>
              </div>

              <Separator />

              {/* Tổng giá trị trả lại */}
              {(() => {
                const returnedValue = ticket.products
                  .filter(p => p.resolution === 'return')
                  .reduce((sum, p) => sum + ((p.quantity || 1) * (p.unitPrice || 0)), 0);
                const returnedQty = ticket.products
                  .filter(p => p.resolution === 'return')
                  .reduce((sum, p) => sum + (p.quantity || 1), 0);
                if (returnedQty > 0) {
                  return (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs sm:text-sm text-muted-foreground">Tổng giá trị trả lại</span>
                        <span className="font-medium text-xs sm:text-sm">
                          {new Intl.NumberFormat('vi-VN').format(returnedValue)} đ
                        </span>
                      </div>
                      <Separator />
                    </>
                  );
                }
                return null;
              })()}

              {/* Tổng giá trị đổi mới */}
              {(() => {
                const replacedValue = ticket.products
                  .filter(p => p.resolution === 'replace')
                  .reduce((sum, p) => sum + ((p.quantity || 1) * (p.unitPrice || 0)), 0);
                const replacedQty = ticket.products
                  .filter(p => p.resolution === 'replace')
                  .reduce((sum, p) => sum + (p.quantity || 1), 0);
                if (replacedQty > 0) {
                  return (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs sm:text-sm text-muted-foreground">Tổng giá trị đổi mới</span>
                        <span className="font-medium text-xs sm:text-sm">
                          {new Intl.NumberFormat('vi-VN').format(replacedValue)} đ
                        </span>
                      </div>
                      <Separator />
                    </>
                  );
                }
                return null;
              })()}

              {/* Tổng hàng trừ */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs sm:text-sm text-muted-foreground">Tổng hàng trừ</span>
                <span className="font-medium text-xs sm:text-sm">
                  {new Intl.NumberFormat('vi-VN').format(
                    ticket.products
                      .filter(p => p.resolution === 'out_of_stock')
                      .reduce((sum, p) => sum + ((p.quantity || 1) * (p.unitPrice || 0)), 0)
                  )} đ
                </span>
              </div>

              <Separator />

              {/* Phí ship gửi về */}
              {ticket.shippingFee > 0 && (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs sm:text-sm text-muted-foreground">Phí ship gửi về (shop ko chịu phí cước này sẽ thu thêm)</span>
                    <span className="font-medium text-xs sm:text-sm">
                      {new Intl.NumberFormat('vi-VN').format(ticket.shippingFee)} đ
                    </span>
                  </div>
                  <Separator />
                </>
              )}

              {/* Tổng cộng */}
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-sm sm:text-base">Tổng cộng</span>
                <span className="text-base sm:text-lg font-bold text-destructive">
                  {new Intl.NumberFormat('vi-VN').format(
                    ticket.products
                      .filter(p => p.resolution === 'out_of_stock')
                      .reduce((sum, p) => sum + ((p.quantity || 1) * (p.unitPrice || 0)), 0) + (ticket.shippingFee || 0)
                  )} đ
                </span>
              </div>

              <Separator />

              {/* Tổng số lượng */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs sm:text-sm text-muted-foreground">Tổng số lượng</span>
                <span className="font-medium text-xs sm:text-sm">
                  {ticket.products.reduce((sum, p) => sum + (p.quantity || 1), 0)}
                </span>
              </div>

              {/* Số lượng đổi mới */}
              <div className="flex items-center justify-between gap-3 pl-3 sm:pl-4">
                <span className="text-xs text-muted-foreground">↳ Đổi mới</span>
                <span className="text-xs font-medium">
                  {ticket.products
                    .filter(p => p.resolution === 'replace')
                    .reduce((sum, p) => sum + (p.quantity || 1), 0)}
                </span>
              </div>

              {/* Số lượng trả lại */}
              <div className="flex items-center justify-between gap-3 pl-3 sm:pl-4">
                <span className="text-xs text-muted-foreground">↳ Trả lại</span>
                <span className="text-xs font-medium">
                  {ticket.products
                    .filter(p => p.resolution === 'return')
                    .reduce((sum, p) => sum + (p.quantity || 1), 0)}
                </span>
              </div>

              {/* Số lượng hết hàng */}
              <div className="flex items-center justify-between gap-3 pl-3 sm:pl-4">
                <span className="text-xs text-muted-foreground">↳ Hết hàng</span>
                <span className="text-xs font-medium">
                  {ticket.products
                    .filter(p => p.resolution === 'out_of_stock')
                    .reduce((sum, p) => sum + (p.quantity || 1), 0)}
                </span>
              </div>

            </CardContent>
          </Card>
        )}

        {/* Card: Thông tin thanh toán */}
        {(() => {
          // Calculate payment details
          const outOfStockValue = ticket.products
            .filter(p => p.resolution === 'out_of_stock')
            .reduce((sum, p) => sum + ((p.quantity || 1) * (p.unitPrice || 0)), 0);
          const shippingFee = ticket.shippingFee || 0;
          const netAmount = outOfStockValue + shippingFee;

          // Get related payments and receipts
          const relatedPayments = payments.filter(p => 
            p.originalDocumentId === ticket.id && p.status !== 'cancelled'
          );
          const relatedReceipts = receipts.filter(r => 
            r.originalDocumentId === ticket.id && r.status !== 'cancelled'
          );

          // Calculate totalPaid (payments are positive, receipts are negative)
          const totalPaid = relatedPayments.reduce((sum, p) => sum + p.amount, 0) 
                          + relatedReceipts.reduce((sum, r) => sum - r.amount, 0);
          
          // Only show if there's something to display
          if (netAmount === 0 && relatedPayments.length === 0 && relatedReceipts.length === 0) {
            return null;
          }

          const remaining = netAmount - totalPaid;
          const isPaid = remaining <= 0 && totalPaid > 0;

          return (
            <Card>
              <CardHeader className="pb-3 px-3 pt-3 sm:px-4 sm:pt-4 md:px-6 md:pt-6">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                  Thông tin thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 md:space-y-6 px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
                {/* Payment transactions list */}
                {(relatedPayments.length > 0 || relatedReceipts.length > 0) && (
                  <>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center gap-3">
                        <span className="text-xs sm:text-sm text-muted-foreground">Đã thanh toán:</span>
                        <span className="font-semibold text-emerald-600 text-xs sm:text-sm">
                          {totalPaid.toLocaleString('vi-VN')} đ
                        </span>
                      </div>

                      {/* List all payment transactions */}
                      <div className="space-y-3 pl-3 sm:pl-4 border-l-2 border-border">
                        {relatedPayments.map(payment => {
                          const linkedOrder = payment.linkedOrderSystemId
                            ? orders.find(o => o.systemId === payment.linkedOrderSystemId)
                            : null;
                          
                          return (
                            <div key={payment.systemId} className="space-y-1">
                              <div className="flex justify-between items-start gap-2 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-xs sm:text-sm">
                                    {linkedOrder 
                                      ? `Trừ vào đơn hàng ${linkedOrder.id}` 
                                      : payment.paymentMethodName || 'Phương thức khác'
                                    }
                                  </div>
                                  <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                                    {formatDateTime(payment.createdAt)}
                                  </div>
                                </div>
                                <span className="font-semibold text-emerald-600 whitespace-nowrap text-xs sm:text-sm">
                                  {payment.amount.toLocaleString('vi-VN')} đ
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {relatedReceipts.map(receipt => (
                          <div key={receipt.systemId} className="space-y-1">
                            <div className="flex justify-between items-start gap-2 sm:gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-xs sm:text-sm">
                                  {receipt.paymentMethodName || 'Thu tiền'}
                                </div>
                                <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                                  {formatDateTime(receipt.createdAt)}
                                </div>
                              </div>
                              <span className="font-semibold text-destructive whitespace-nowrap text-xs sm:text-sm">
                                -{receipt.amount.toLocaleString('vi-VN')} đ
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Remaining amount or completion status */}
                {remaining > 0 && (
                  <>
                    <Separator />
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-xs sm:text-sm text-muted-foreground">Còn lại:</span>
                      <span className="font-semibold text-orange-600 text-xs sm:text-sm">
                        {remaining.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </>
                )}

                {isPaid && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-center gap-2 py-2 text-green-600">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="font-semibold text-xs sm:text-sm">Đã thanh toán đủ</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })()}

        {/* Images - Received */}
        {ticket.receivedImages && ticket.receivedImages.length > 0 && (
          <Card>
            <CardHeader className="pb-3 px-3 pt-3 sm:px-4 sm:pt-4 md:px-6 md:pt-6">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                Hình ảnh lúc nhận ({ticket.receivedImages.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                {ticket.receivedImages.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleImageClick(ticket.receivedImages, idx)}
                    className="group relative aspect-square rounded-lg overflow-hidden border transition-colors hover:border-primary"
                  >
                    <img
                      src={url}
                      alt={`Hình nhận ${idx + 1}`}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20 flex items-center justify-center">
                      <ExternalLink className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Images - Processed */}
        {ticket.processedImages && ticket.processedImages.length > 0 && (
          <Card>
            <CardHeader className="pb-3 px-3 pt-3 sm:px-4 sm:pt-4 md:px-6 md:pt-6">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                Hình ảnh đã xử lý ({ticket.processedImages.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                {ticket.processedImages.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleImageClick(ticket.processedImages || [], idx)}
                    className="group relative aspect-square rounded-lg overflow-hidden border hover:border-primary transition-colors cursor-pointer"
                  >
                    <img
                      src={url}
                      alt={`Hình xử lý ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ExternalLink className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Timeline Card */}
        {shouldShowTimeline() && (
          <Card className="bg-white">
            <CardHeader className="px-3 pt-3 pb-3 sm:px-4 sm:pt-4 md:px-6 md:pt-6">
              <CardTitle className="text-sm sm:text-base md:text-lg font-semibold">Tiến trình xử lý</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
              <StatusTimeline ticket={ticket} />
            </CardContent>
          </Card>
        )}

        {/* History Card */}
        {shouldShowTimeline() && (
          <Card className="bg-white">
            <CardHeader className="px-3 pt-3 pb-3 sm:px-4 sm:pt-4 md:px-6 md:pt-6">
              <CardTitle className="text-sm sm:text-base md:text-lg font-semibold">Lịch sử thao tác</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {ticket.history.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có lịch sử nào
                    </div>
                  ) : (
                    ticket.history
                      .slice()
                      .reverse()
                      .map((entry, index) => (
                        <div key={index} className="flex gap-2 sm:gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-xs sm:text-sm">{entry.actionLabel || entry.action}</div>
                            <div className="text-[10px] sm:text-xs text-muted-foreground">
                              {formatDateTime(entry.performedAt)} • {entry.performedBy}
                            </div>
                            {entry.note && (
                              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                                {entry.note}
                              </div>
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

        {/* Footer */}
        <div className="text-center text-muted-foreground py-6 sm:py-8 border-t">
          <p className="text-xs sm:text-sm md:text-base px-4">
            Có thắc mắc? Liên hệ hotline: <span className="font-semibold text-primary text-sm sm:text-base md:text-lg">{hotline}</span>
          </p>
        </div>
        </div>
      </div>

      {/* Image Preview Dialog - Lazy loaded */}
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
