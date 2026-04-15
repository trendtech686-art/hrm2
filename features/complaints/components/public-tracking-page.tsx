'use client'

import * as React from 'react';
import Image from 'next/image';
import { Package, Clock, CheckCircle, XCircle, MessageSquare, User, AlertCircle, Image as ImageIcon, ExternalLink, Receipt, DollarSign, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge, COMPLAINT_STATUS_MAP } from '@/components/StatusBadge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Comments } from '@/components/Comments';
import { formatDateForDisplay, formatDateTimeForDisplay } from '@/lib/date-utils';

// Lazy load ImagePreviewDialog để giảm bundle size
const ImagePreviewDialog = React.lazy(() => 
  import('@/components/ui/image-preview-dialog').then(module => ({
    default: module.ImagePreviewDialog
  }))
);
import { SlaTimer } from '@/components/SlaTimer';
import { defaultSLA } from '@/features/settings/complaints/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { asSystemId } from '@/lib/id-types';
import { formatOrderAddress } from '@/features/orders/address-utils';
import { 
  complaintStatusLabels, 
  complaintStatusColors,
  complaintTypeLabels,
  complaintVerificationLabels,
  complaintResolutionLabels,
  type ComplaintImage,
  type ComplaintStatus,
  type ComplaintResolution,
} from '../types';
import { usePublicComplaintTracking, addPublicComment, type PublicCompensationItem } from '../hooks/use-public-tracking';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Public Complaint Tracking Page
 * Allows customers to track their complaint progress without login
 */
export function PublicComplaintTrackingPage({ complaintId }: { complaintId: string }) {
  const queryClient = useQueryClient();
  
  // Use public API hook (no authentication required)
  const { 
    complaint, 
    hotline, 
    companyName,
    comments,
    timelineActions,
    relatedOrder,
    settings,
    isLoading,
    isError,
    error,
  } = usePublicComplaintTracking(complaintId);
  
  // Image preview state
  const [showImagePreview, setShowImagePreview] = React.useState(false);
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  const [imageLoadingStates, setImageLoadingStates] = React.useState<Record<string, boolean>>({});

  // Compensation data (no longer in public API, set to null)
  const compensationPayment: PublicCompensationItem | null = null;
  const compensationReceipt: PublicCompensationItem | null = null;
  
  // Calculate status progress (0-100)
  const statusProgress = React.useMemo(() => {
    if (!complaint) return 0;
    const progressMap: Record<ComplaintStatus, number> = {
      pending: 0,
      investigating: 50,
      resolved: 100,
      ended: 100,
      cancelled: 0,
    };
    return progressMap[complaint.status] || 0;
  }, [complaint]);
  
  // Memoize compensation data for easier access
  const compensationData = React.useMemo<{ payment: PublicCompensationItem | null; receipt: PublicCompensationItem | null }>(() => ({
    payment: compensationPayment,
    receipt: compensationReceipt,
  }), [compensationPayment, compensationReceipt]);
  
  // Get status icon
  const getStatusIcon = React.useCallback((status: ComplaintStatus) => {
    const iconMap: Record<ComplaintStatus, React.ElementType> = {
      pending: Clock,
      investigating: AlertCircle,
      resolved: CheckCircle,
      ended: CheckCircle,
      cancelled: XCircle,
    };
    return iconMap[status] || AlertCircle;
  }, []);
  
  // Get action icon for timeline
  const getActionIcon = React.useCallback((actionType: string): React.ElementType => {
    const iconMap: Record<string, React.ElementType> = {
      created: AlertCircle,
      assigned: User,
      investigated: AlertCircle,
      verified: CheckCircle,
      'verified-correct': CheckCircle,
      'verified-incorrect': XCircle,
      resolved: CheckCircle,
      rejected: XCircle,
      cancelled: XCircle,
      ended: CheckCircle,
      reopened: AlertCircle,
      'status-changed': ArrowRight,
      commented: MessageSquare,
    };
    return iconMap[actionType] || AlertCircle;
  }, []);
  
  // Handle image loading
  const handleImageLoad = React.useCallback((imageId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [imageId]: false }));
  }, []);
  
  const handleImageError = React.useCallback((imageId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [imageId]: false }));
  }, []);

  // Comment handlers - use public API
  const handleAddComment = React.useCallback(async (content: string, _contentText: string, _attachments: string[], _mentions: string[]) => {
    if (!complaintId) return;
    try {
      await addPublicComment(complaintId, content);
      toast.success('Đã gửi bình luận');
      // Refetch tracking data
      queryClient.invalidateQueries({ queryKey: ['public-complaint-tracking', complaintId] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi gửi bình luận');
    }
  }, [complaintId, queryClient]);

  const handleEditComment = React.useCallback((_commentId: string, _content: string, _contentText: string) => {
    // Not supported in public tracking
  }, []);

  const handleDeleteComment = React.useCallback((_commentId: string) => {
    // Not supported in public tracking
  }, []);

  // Handle image preview - must be called before any early returns (React hooks rules)
  const handleImageClick = React.useCallback((images: string[], index: number) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setShowImagePreview(true);
  }, []);
  
  const StatusIcon = complaint ? getStatusIcon(complaint.status) : AlertCircle;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="space-y-4 w-full max-w-2xl">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    );
  }

  // Error or tracking disabled
  if (isError || !settings.enabled) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-5 w-5" />
              {isError ? 'Lỗi tải dữ liệu' : 'Tính năng tạm thời không khả dụng'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {isError 
                ? (error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải thông tin khiếu nại')
                : 'Tính năng theo dõi công khai hiện đang tắt. Vui lòng liên hệ bộ phận hỗ trợ để được hỗ trợ.'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not found
  if (!complaint) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Không tìm thấy khiếu nại
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Mã khiếu nại không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại mã khiếu nại.
            </p>
            <p className="text-sm text-muted-foreground">
              Mã khiếu nại: <span className="font-mono font-semibold">{complaintId || 'N/A'}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header với branding */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center px-4 sm:px-6">
          <div className="flex flex-1 items-center justify-between gap-2">
            {/* Logo + Company Name */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md bg-primary/10">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium leading-none">{companyName}</p>
                <p className="text-xs text-muted-foreground hidden xs:block">Hệ thống theo dõi khiếu nại</p>
              </div>
            </div>
            
            {/* Tracking Code */}
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Mã tra cứu</p>
              <p className="font-mono text-xs sm:text-sm font-semibold">{complaint.publicTrackingCode || complaint.id}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6">
        
        {/* Complaint Title */}
        {complaint.title && (
          <div>
            <h1 className="text-lg sm:text-xl font-semibold">{complaint.title}</h1>
          </div>
        )}
        
        {/* Status Card với progress */}
        <Card className="border-l-4" style={{ borderLeftColor: complaintStatusColors[complaint.status] || '#6b7280' }}>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusIcon className="h-5 w-5 shrink-0" style={{ color: complaintStatusColors[complaint.status] || '#6b7280' }} />
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{complaintStatusLabels[complaint.status] || complaint.status}</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Khiếu nại #{complaint.id} • Tạo lúc {formatDateTimeForDisplay(complaint.createdAt)}
                  </p>
                </div>
                <StatusBadge status={complaint.status} statusMap={COMPLAINT_STATUS_MAP} />
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Tiến độ xử lý</span>
                  <span className="font-medium">{statusProgress}%</span>
                </div>
                <Progress value={statusProgress} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Tạo mới</span>
                  <span>Đang xử lý</span>
                  <span>Hoàn tất</span>
                </div>
              </div>
              
              {/* SLA Timer - Chỉ hiển thị khi đang investigating */}
              {complaint.status === 'investigating' && (
                <div className="flex items-center justify-between gap-4 rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/20">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Dự kiến hoàn tất trong</p>
                    <p className="text-xs text-muted-foreground">Cam kết xử lý trong 24 giờ</p>
                  </div>
                  <SlaTimer
                    startTime={complaint.createdAt}
                    targetMinutes={defaultSLA.MEDIUM.resolveTime * 60}
                    isCompleted={false}
                  />
                </div>
              )}
              
              {/* Badges Row - Removed: Trung bình, Xác nhận đúng, Thiếu hàng, Đã bù trừ badges */}
            </div>
          </CardContent>
        </Card>
        
        {/* Order Information */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Thông tin khiếu nại
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Loại khiếu nại:</span>
                <span className="font-medium text-right">{complaintTypeLabels[complaint.type] || complaint.type}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Trạng thái xác minh:</span>
                <span className="font-medium text-right">{complaintVerificationLabels[complaint.verification] || complaint.verification}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Ngày tạo:</span>
                <span className="font-medium text-right">
                  {new Date(complaint.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              {complaint.resolvedAt && (
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">Ngày giải quyết:</span>
                  <span className="font-medium text-right">
                    {new Date(complaint.resolvedAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
              {complaint.endedAt && (
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">Ngày kết thúc:</span>
                  <span className="font-medium text-right">
                    {new Date(complaint.endedAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Khách hàng:</span>
                <span className="font-medium text-right">{complaint.customerName || 'Không rõ'}</span>
              </div>
              {complaint.customerPhone && (
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">Số điện thoại:</span>
                  <span className="font-medium text-right">{complaint.customerPhone}</span>
                </div>
              )}
              {complaint.customerEmail && (
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">Email:</span>
                  <span className="font-medium text-right">{complaint.customerEmail}</span>
                </div>
              )}
              {(complaint.orderCode || complaint.orderSystemId) && (
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">Mã đơn hàng:</span>
                  <span className="font-medium text-right">{complaint.orderCode || complaint.orderSystemId}</span>
                </div>
              )}
              {complaint.orderValue != null && complaint.orderValue > 0 && (
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">Giá trị đơn:</span>
                  <span className="font-medium text-right">
                    {complaint.orderValue.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              )}
              {complaint.branchName && (
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">Chi nhánh:</span>
                  <span className="font-medium text-right">{complaint.branchName}</span>
                </div>
              )}
              {settings.showEmployeeName && complaint.assigneeName && (
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">Người xử lý:</span>
                  <span className="font-medium text-right">{complaint.assigneeName}</span>
                </div>
              )}
            </div>

            {/* Related Order Details - only show when linked order exists and setting enabled */}
            {settings.showOrderInfo && relatedOrder && (
              <div className="space-y-3 border-t pt-4">
                <p className="text-sm font-medium">Chi tiết đơn hàng liên quan</p>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  {relatedOrder?.packagings?.[0]?.trackingCode && (
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground shrink-0">Mã vận đơn:</span>
                      <span className="font-medium text-right">{relatedOrder.packagings[0].trackingCode}</span>
                    </div>
                  )}
                  {relatedOrder?.shippingAddress && (
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground shrink-0">Địa chỉ giao hàng:</span>
                      <span className="font-medium text-right">{formatOrderAddress(relatedOrder.shippingAddress)}</span>
                    </div>
                  )}
                  {relatedOrder?.salesperson && (
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground shrink-0">Người tạo đơn:</span>
                      <span className="font-medium text-right">{relatedOrder.salesperson}</span>
                    </div>
                  )}
                  {relatedOrder?.orderDate && (
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground shrink-0">Ngày bán:</span>
                      <span className="font-medium text-right">{formatDateForDisplay(relatedOrder.orderDate)}</span>
                    </div>
                  )}
                  {relatedOrder?.grandTotal != null && relatedOrder.grandTotal > 0 && (
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground shrink-0">Giá trị đơn hàng:</span>
                      <span className="font-medium text-right">
                        {relatedOrder.grandTotal.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  )}
                  {relatedOrder?.expectedDeliveryDate && (
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground shrink-0">Dự kiến giao:</span>
                      <span className="font-medium text-right">{formatDateForDisplay(relatedOrder.expectedDeliveryDate)}</span>
                    </div>
                  )}
                  {relatedOrder?.packagings?.[0]?.requestDate && (
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground shrink-0">Ngày xuất kho:</span>
                      <span className="font-medium text-right">{formatDateForDisplay(relatedOrder.packagings[0].requestDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3 border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground">Mô tả khiếu nại</p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
            </div>

            {/* Kết quả xử lý */}
            {settings.showResolution && (complaint.resolution || complaint.resolutionNote || complaint.investigationNote || complaint.proposedSolution) && (
              <div className="space-y-3 border-t pt-4">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Kết quả xử lý
                </p>
                
                {complaint.resolution && (
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground shrink-0 text-sm">Phương án:</span>
                    <span className="font-medium text-sm text-right">{complaintResolutionLabels[complaint.resolution as ComplaintResolution] || complaint.resolution}</span>
                  </div>
                )}

                {complaint.compensationAmount != null && complaint.compensationAmount > 0 && (
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground shrink-0 text-sm">Số tiền bồi thường:</span>
                    <span className="font-semibold text-sm text-right text-red-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(complaint.compensationAmount)}
                    </span>
                  </div>
                )}

                {complaint.compensationDescription && (
                  <div className="space-y-1.5">
                    <p className="text-sm text-muted-foreground">Nội dung bồi thường</p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap rounded-md bg-red-50 dark:bg-red-950/20 p-3 border border-red-200 dark:border-red-900">{complaint.compensationDescription}</p>
                  </div>
                )}

                {complaint.resolutionNote && (
                  <div className="space-y-1.5">
                    <p className="text-sm text-muted-foreground">Ghi chú giải quyết</p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap rounded-md bg-green-50 dark:bg-green-950/20 p-3 border border-green-200 dark:border-green-900">{complaint.resolutionNote}</p>
                  </div>
                )}

                {complaint.investigationNote && (
                  <div className="space-y-1.5">
                    <p className="text-sm text-muted-foreground">Ghi chú kiểm tra</p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap rounded-md bg-blue-50 dark:bg-blue-950/20 p-3 border border-blue-200 dark:border-blue-900">{complaint.investigationNote}</p>
                  </div>
                )}

                {complaint.proposedSolution && (
                  <div className="space-y-1.5">
                    <p className="text-sm text-muted-foreground">Đề xuất giải pháp</p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap rounded-md bg-amber-50 dark:bg-amber-950/20 p-3 border border-amber-200 dark:border-amber-900">{complaint.proposedSolution}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Timeline - Lịch sử xử lý */}
        {settings.showTimeline && timelineActions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Lịch sử xử lý
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6 pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
                {timelineActions.map((action, idx) => {
                  const ActionIcon = getActionIcon(action.actionType);
                  const isLast = idx === timelineActions.length - 1;
                  
                  return (
                    <div key={action.id} className="relative">
                      {/* Dot indicator */}
                      <div className={cn(
                        "absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-background",
                        isLast ? "border-primary" : "border-muted"
                      )}>
                        <ActionIcon className={cn("h-3 w-3", isLast ? "text-primary" : "text-muted-foreground")} />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                          <p className="text-sm font-medium">{getActionLabel(action.actionType)}</p>
                          <p className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDateTimeForDisplay(action.performedAt)}
                            {settings.showEmployeeName && (action.performedByName || action.performedBy) && ` • ${action.performedByName || action.performedBy}`}
                          </p>
                        </div>
                        {action.note && (
                          <p className="text-sm text-muted-foreground leading-relaxed">{action.note}</p>
                        )}
                        {action.images && action.images.length > 0 && (
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {action.images.map((url, i) => (
                              <button
                                key={i}
                                onClick={() => handleImageClick(action.images!, i)}
                                className="relative group h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden border hover:border-primary transition-colors"
                              >
                                {imageLoadingStates[`${action.id}-${i}`] !== false && (
                                  <Skeleton className="absolute inset-0" />
                                )}
                                <Image
                                  src={url}
                                  alt={`Ảnh ${i + 1}`}
                                  fill
                                  sizes="80px"
                                  unoptimized
                                  className="object-cover group-hover:scale-105 transition-transform"
                                  onLoad={() => handleImageLoad(`${action.id}-${i}`)}
                                  onError={() => handleImageError(`${action.id}-${i}`)}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                  <ExternalLink className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Affected Products - Bê nguyên component từ detail page */}
        {settings.showProducts && complaint.affectedProducts && complaint.affectedProducts.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle size="lg" className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Sản phẩm bị ảnh hưởng
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 md:p-6">
                {/* Mobile view - Card list */}
                <div className="md:hidden space-y-3 p-4">
                  {complaint.affectedProducts.map((item, idx) => {
                    const totalAmount = (
                      (item.quantityMissing || 0) + 
                      (item.quantityDefective || 0) + 
                      (item.quantityExcess || 0)
                    ) * (item.unitPrice || 0);
                    
                    const issueTypeLabel = {
                      excess: 'Thừa',
                      missing: 'Thiếu',
                      defective: 'Hỏng',
                      other: 'Khác'
                    }[item.issueType] || item.issueType;
                    
                    // Calculate actual received quantity
                    const orderedQty = item.quantityOrdered || 0;
                    let actualQty = orderedQty;
                    
                    if (item.issueType === 'excess') {
                      actualQty = orderedQty + (item.quantityExcess || 0);
                    } else if (item.issueType === 'missing') {
                      actualQty = orderedQty - (item.quantityMissing || 0);
                    } else if (item.issueType === 'defective') {
                      actualQty = orderedQty;
                    }
                    
                    const diff = actualQty - orderedQty;
                    
                    return (
                      <div key={idx} className="border rounded-lg p-3 space-y-2 bg-card">
                        <div className="flex items-start gap-3">
                          {item.productImage && (
                            <div className="relative h-12 w-12 shrink-0 rounded-md overflow-hidden border bg-muted">
                              <Image
                                src={item.productImage}
                                alt={item.productName}
                                fill
                                sizes="48px"
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{item.productName}</div>
                            <div className="text-xs text-muted-foreground">{item.productBusinessId || item.productId}</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t">
                          <div>
                            <span className="text-muted-foreground">Đơn giá:</span>
                            <span className="ml-1 font-medium">{(item.unitPrice || 0).toLocaleString('vi-VN')}đ</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">SL đặt:</span>
                            <span className="ml-1 font-medium">{orderedQty}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Loại:</span>
                            <span className="ml-1">
                              <span className="text-xs px-2 py-0.5 rounded bg-muted">{issueTypeLabel}</span>
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Thực tế:</span>
                            <span className="ml-1">
                              <span className={cn(
                                "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
                                diff === 0 
                                  ? "bg-muted text-foreground"
                                  : diff > 0
                                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                              )}>
                                {actualQty}
                                {diff !== 0 && ` (${diff > 0 ? '+' : ''}${diff})`}
                              </span>
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Thừa:</span>
                            <span className="ml-1 font-medium">{item.quantityExcess || 0}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Thiếu:</span>
                            <span className="ml-1 font-medium">{item.quantityMissing || 0}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Hỏng:</span>
                            <span className="ml-1 font-medium">{item.quantityDefective || 0}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-xs text-muted-foreground">Tổng tiền:</span>
                          <span className={`font-semibold text-sm ${totalAmount > 0 ? 'text-red-600' : ''}`}>
                            {totalAmount.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                        
                        {item.note && (
                          <div className="text-xs text-muted-foreground pt-2 border-t">
                            <span className="font-medium">Ghi chú:</span> {item.note}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Desktop view - Table */}
                <div className="hidden md:block border rounded-lg overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="text-left p-2 font-medium min-w-45">Sản phẩm</th>
                        <th className="text-right p-2 font-medium w-24">Đơn giá</th>
                        <th className="text-center p-2 font-medium w-20">SL đặt</th>
                        <th className="text-left p-2 font-medium w-28">Loại</th>
                        <th className="text-center p-2 font-medium w-24">Thực tế</th>
                        <th className="text-center p-2 font-medium w-20">Thừa</th>
                        <th className="text-center p-2 font-medium w-20">Thiếu</th>
                        <th className="text-center p-2 font-medium w-20">Hỏng</th>
                        <th className="text-right p-2 font-medium w-28">Tổng tiền</th>
                        <th className="text-left p-2 font-medium min-w-37">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaint.affectedProducts.map((item, idx) => {
                        const totalAmount = (
                          (item.quantityMissing || 0) + 
                          (item.quantityDefective || 0) + 
                          (item.quantityExcess || 0)
                        ) * (item.unitPrice || 0);
                        
                        const issueTypeLabel = {
                          excess: 'Thừa',
                          missing: 'Thiếu',
                          defective: 'Hỏng',
                          other: 'Khác'
                        }[item.issueType] || item.issueType;
                        
                        // Calculate actual received quantity based on issue type
                        const orderedQty = item.quantityOrdered || 0;
                        let actualQty = orderedQty;
                        
                        if (item.issueType === 'excess') {
                          actualQty = orderedQty + (item.quantityExcess || 0);
                        } else if (item.issueType === 'missing') {
                          actualQty = orderedQty - (item.quantityMissing || 0);
                        } else if (item.issueType === 'defective') {
                          actualQty = orderedQty; // Same as ordered, but defective
                        }
                        
                        const diff = actualQty - orderedQty;
                        
                        return (
                          <tr key={idx} className="border-b last:border-0">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                {item.productImage && (
                                  <div className="relative h-10 w-10 shrink-0 rounded-md overflow-hidden border bg-muted">
                                    <Image
                                      src={item.productImage}
                                      alt={item.productName}
                                      fill
                                      sizes="40px"
                                      unoptimized
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className="font-medium text-sm truncate">{item.productName}</div>
                                  <div className="text-xs text-muted-foreground">{item.productBusinessId || item.productId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-2 text-right text-sm">
                              {(item.unitPrice || 0).toLocaleString('vi-VN')}đ
                            </td>
                            <td className="p-2 text-center">{orderedQty}</td>
                            <td className="p-2">
                              <span className="text-xs px-2 py-1 rounded bg-muted">
                                {issueTypeLabel}
                              </span>
                            </td>
                            <td className="p-2 text-center">
                              <div className="flex flex-col items-center gap-0.5">
                                <span className={cn(
                                  "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold",
                                  diff === 0 
                                    ? "bg-muted text-foreground"
                                    : diff > 0
                                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                )}>
                                  {actualQty}
                                  {diff !== 0 && (
                                    <span className="ml-1">
                                      ({diff > 0 ? '+' : ''}{diff})
                                    </span>
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="p-2 text-center">{item.quantityExcess || 0}</td>
                            <td className="p-2 text-center">{item.quantityMissing || 0}</td>
                            <td className="p-2 text-center">{item.quantityDefective || 0}</td>
                            <td className="p-2 text-right">
                              <span className={`font-semibold text-sm ${totalAmount > 0 ? 'text-red-600' : ''}`}>
                                {totalAmount.toLocaleString('vi-VN')}đ
                              </span>
                            </td>
                            <td className="p-2 text-xs text-muted-foreground">{item.note || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Tổng kết sản phẩm bị ảnh hưởng */}
            <Card>
              <CardHeader>
                <CardTitle size="lg" className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Tổng kết sản phẩm bị ảnh hưởng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                  {/* Thừa */}
                  {(() => {
                    const excessItems = complaint.affectedProducts.filter(p => p.issueType === 'excess' && (p.quantityExcess || 0) > 0);
                    const totalExcessQty = excessItems.reduce((sum, p) => sum + (p.quantityExcess || 0), 0);
                    const totalExcessAmount = excessItems.reduce((sum, p) => {
                      const qty = p.quantityExcess || 0;
                      const price = p.unitPrice || 0;
                      return sum + (qty * price);
                    }, 0);
                    
                    if (totalExcessQty === 0) return null;
                    
                    return (
                      <div className="space-y-2 p-4 rounded-xl border border-border/50 bg-muted/50">
                        <p className="text-xs font-medium text-muted-foreground uppercase">Thừa</p>
                        <p className="text-2xl font-bold">{totalExcessQty}</p>
                        <p className="text-sm font-medium text-muted-foreground">
                          {totalExcessAmount.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    );
                  })()}
                  
                  {/* Thiếu */}
                  {(() => {
                    const missingItems = complaint.affectedProducts.filter(p => p.issueType === 'missing' && (p.quantityMissing || 0) > 0);
                    const totalMissingQty = missingItems.reduce((sum, p) => sum + (p.quantityMissing || 0), 0);
                    const totalMissingAmount = missingItems.reduce((sum, p) => {
                      const qty = p.quantityMissing || 0;
                      const price = p.unitPrice || 0;
                      return sum + (qty * price);
                    }, 0);
                    
                    if (totalMissingQty === 0) return null;
                    
                    return (
                      <div className="space-y-2 p-4 rounded-xl border border-border/50 bg-muted/50">
                        <p className="text-xs font-medium text-muted-foreground uppercase">Thiếu</p>
                        <p className="text-2xl font-bold">{totalMissingQty}</p>
                        <p className="text-sm font-medium text-muted-foreground">
                          {totalMissingAmount.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    );
                  })()}
                  
                  {/* Hỏng */}
                  {(() => {
                    const defectiveItems = complaint.affectedProducts.filter(p => p.issueType === 'defective' && (p.quantityDefective || 0) > 0);
                    const totalDefectiveQty = defectiveItems.reduce((sum, p) => sum + (p.quantityDefective || 0), 0);
                    const totalDefectiveAmount = defectiveItems.reduce((sum, p) => {
                      const qty = p.quantityDefective || 0;
                      const price = p.unitPrice || 0;
                      return sum + (qty * price);
                    }, 0);
                    
                    if (totalDefectiveQty === 0) return null;
                    
                    return (
                      <div className="space-y-2 p-4 rounded-xl border border-border/50 bg-muted/50">
                        <p className="text-xs font-medium text-muted-foreground uppercase">Hỏng</p>
                        <p className="text-2xl font-bold">{totalDefectiveQty}</p>
                        <p className="text-sm font-medium text-muted-foreground">
                          {totalDefectiveAmount.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    );
                  })()}
                  
                  {/* Khác */}
                  {(() => {
                    const otherItems = complaint.affectedProducts.filter(p => p.issueType === 'other');
                    
                    if (otherItems.length === 0) return null;
                    
                    return (
                      <div className="space-y-2 p-4 rounded-xl border border-border/50 bg-muted/50">
                        <p className="text-xs font-medium text-muted-foreground uppercase">Khác</p>
                        <p className="text-2xl font-bold">{otherItems.length}</p>
                        <p className="text-sm font-medium text-muted-foreground">
                          Xem ghi chú
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Compensation Payment/Receipt */}
        {compensationData && (compensationData.payment || compensationData.receipt) && (
          <Card>
            <CardHeader className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                Thông tin bù trừ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
              {compensationData.payment && (
                <div className="p-3 sm:p-4 rounded-xl border border-border/50 bg-muted/50">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div>
                      <div className="font-medium text-sm sm:text-base flex items-center gap-1.5 sm:gap-2">
                        <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                        Hoàn tiền cho khách hàng
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <div className="text-lg sm:text-xl md:text-2xl font-bold">
                        {compensationData.payment.amount.toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                  </div>
                  {compensationData.payment.description && (
                    <div className="text-xs sm:text-sm text-muted-foreground pt-2 sm:pt-3 border-t">
                      {compensationData.payment.description}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1.5 sm:mt-2">
                    Ngày tạo: {new Date(compensationData.payment.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              )}

              {compensationData.receipt && (
                <div className="p-4 rounded-xl border border-border/50 bg-muted/50">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <Receipt className="h-4 w-4" />
                        Chi phí phát sinh
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <div className="text-xl md:text-2xl font-bold">
                        {compensationData.receipt.amount.toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                  </div>
                  {compensationData.receipt.description && (
                    <div className="text-sm text-muted-foreground pt-3 border-t">
                      {compensationData.receipt.description}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    Ngày tạo: {new Date(compensationData.receipt.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Customer Images */}
        {settings.showImages && complaint.images && complaint.images.filter(img => img.type === 'initial').length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Hình ảnh từ khách hàng ({complaint.images.filter(img => img.type === 'initial').length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {complaint.images
                  .filter(img => img.type === 'initial')
                  .map((image: ComplaintImage, idx: number) => {
                    const allCustomerImages = complaint.images.filter(img => img.type === 'initial').map(img => img.url);
                    const imageId = `customer-${image.id}`;
                    
                    return (
                      <button
                        key={image.id}
                        onClick={() => handleImageClick(allCustomerImages, idx)}
                        className="group relative aspect-square rounded-lg overflow-hidden border hover:border-primary transition-colors cursor-pointer"
                      >
                        {imageLoadingStates[imageId] !== false && (
                          <Skeleton className="absolute inset-0" />
                        )}
                        <Image
                          src={image.url}
                          alt="Ảnh từ khách hàng"
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform"
                          onLoad={() => handleImageLoad(imageId)}
                          onError={() => handleImageError(imageId)}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <ExternalLink className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Employee Images */}
        {settings.showImages && complaint.employeeImages && complaint.employeeImages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Hình ảnh kiểm tra từ nhân viên ({complaint.employeeImages.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {complaint.employeeImages.map((image, idx: number) => {
                  const allEmployeeImages = complaint.employeeImages!.map((img) => img.url);
                  const imageId = `employee-${image.id || idx}`;
                  
                  return (
                    <button
                      key={image.id || idx}
                      onClick={() => handleImageClick(allEmployeeImages, idx)}
                      className="group relative aspect-square rounded-lg overflow-hidden border hover:border-primary transition-colors cursor-pointer"
                    >
                      {imageLoadingStates[imageId] !== false && (
                        <Skeleton className="absolute inset-0" />
                      )}
                      <Image
                        src={image.url}
                        alt="Ảnh kiểm tra từ nhân viên"
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform"
                        onLoad={() => handleImageLoad(imageId)}
                        onError={() => handleImageError(imageId)}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <ExternalLink className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Video Links */}
        {complaint.videoLinks && (complaint.videoLinks?.trim().length ?? 0) > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Video bằng chứng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(complaint.videoLinks || '').split('\n').filter((link: string) => link.trim()).map((link: string, idx: number) => {
                  const trimmedLink = link.trim();
                  const isGoogleDrive = trimmedLink.includes('drive.google.com');
                  const isYouTube = trimmedLink.includes('youtube.com') || trimmedLink.includes('youtu.be');
                  
                  // Extract Google Drive file ID
                  let embedUrl = trimmedLink;
                  if (isGoogleDrive) {
                    const match = trimmedLink.match(/\/d\/([^/]+)/);
                    if (match) {
                      embedUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
                    }
                  } else if (isYouTube) {
                    // Extract YouTube video ID
                    let videoId = '';
                    if (trimmedLink.includes('youtu.be/')) {
                      videoId = trimmedLink.split('youtu.be/')[1].split('?')[0];
                    } else if (trimmedLink.includes('watch?v=')) {
                      videoId = trimmedLink.split('watch?v=')[1].split('&')[0];
                    }
                    if (videoId) {
                      embedUrl = `https://www.youtube.com/embed/${videoId}`;
                    }
                  }

                  return (
                    <div key={idx} className="space-y-2">
                      {(isGoogleDrive || isYouTube) ? (
                        <div className="aspect-video w-full rounded-lg overflow-hidden border bg-muted">
                          <iframe
                            src={embedUrl}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                            title={`Video ${idx + 1}`}
                          />
                        </div>
                      ) : (
                        <a
                          href={trimmedLink}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 rounded-xl border border-border/50 hover:bg-muted transition-colors group"
                        >
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-sm font-mono truncate flex-1">{trimmedLink}</span>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customer Comments */}
        {settings.allowCustomerComments && (
          <Comments
            entityType="complaint"
            entityId={complaint.systemId}
            comments={comments.map(c => ({
              id: c.systemId,
              content: c.contentText || c.content,
              author: {
                systemId: c.createdBySystemId,
                name: c.createdBy || 'Khách hàng',
              },
              createdAt: new Date(c.createdAt),
              attachments: (c.attachments || []).map((url, idx) => ({
                id: `${c.systemId}-${idx}`,
                url,
                type: 'image' as const,
                name: `Attachment ${idx + 1}`,
              })),
            }))}
            onAddComment={(content) => {
              handleAddComment(content, content, [], []);
            }}
            onUpdateComment={(commentId, content) => {
              handleEditComment(commentId, content, content);
            }}
            onDeleteComment={(commentId) => {
              handleDeleteComment(commentId);
            }}
            currentUser={{
              systemId: asSystemId('CUSTOMER'),
              name: 'Khách hàng',
            }}
            readOnly={false}
          />
        )}

        {/* Footer */}
        <footer className="space-y-2 sm:space-y-3 py-6 sm:py-8 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Package className="h-4 w-4" />
            <p className="text-xs sm:text-sm">{companyName}</p>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Có thắc mắc? Liên hệ hotline: <a href={`tel:${hotline}`} className="font-semibold transition-colors hover:text-primary">{hotline}</a>
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {companyName}. Mã khiếu nại: <span className="font-mono">{complaint.id}</span>
          </p>
        </footer>
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
            title="Hình ảnh khiếu nại"
          />
        </React.Suspense>
      )}
    </div>
  );
}

// Helper function to get action labels
function getActionLabel(actionType: string): string {
  const labels: Record<string, string> = {
    created: 'Khiếu nại được tạo',
    assigned: 'Đã giao cho nhân viên xử lý',
    investigated: 'Đang kiểm tra',
    verified: 'Đã xác minh',
    'verified-correct': 'Xác nhận khiếu nại đúng',
    'verified-incorrect': 'Xác nhận khiếu nại sai',
    resolved: 'Đã giải quyết',
    rejected: 'Từ chối khiếu nại',
    cancelled: 'Đã hủy',
    ended: 'Đã kết thúc',
    reopened: 'Đã mở lại',
    'status-changed': 'Thay đổi trạng thái',
    commented: 'Đã bình luận',
  };
  return labels[actionType] || actionType;
}
