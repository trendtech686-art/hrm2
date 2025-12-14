import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, MessageSquare, User, Calendar, AlertCircle, Image as ImageIcon, ExternalLink, Receipt, DollarSign, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { StatusBadge, COMPLAINT_STATUS_MAP } from '../../components/StatusBadge.tsx';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Progress } from '../../components/ui/progress';
import { Skeleton } from '../../components/ui/skeleton';
import { Comments } from '../../components/Comments.tsx';
import { formatDateForDisplay, formatDateTimeForDisplay } from '@/lib/date-utils';

// Lazy load ImagePreviewDialog để giảm bundle size
const ImagePreviewDialog = React.lazy(() => 
  import('../../components/ui/image-preview-dialog').then(module => ({
    default: module.ImagePreviewDialog
  }))
);
import { SlaTimer, COMPLAINT_SLA_CONFIGS } from '../../components/SlaTimer.tsx';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { useComplaintStore } from './store';
import { useBranchStore } from '../settings/branches/store';
import { useEmployeeStore } from '../employees/store';
import { usePaymentStore } from '../payments/store';
import { useReceiptStore } from '../receipts/store';
import { asSystemId } from '@/lib/id-types';
import { formatOrderAddress } from '../orders/address-utils.ts';
import { 
  complaintStatusLabels, 
  complaintStatusColors,
  complaintTypeLabels,
  complaintTypeColors,
  complaintPriorityLabels,
  complaintPriorityColors,
  complaintVerificationLabels,
  complaintVerificationColors,
  type ComplaintAction,
  type ComplaintImage,
  type ComplaintStatus
} from './types';
import type { WarrantyComment } from '../warranty/types';
import { 
  loadTrackingSettings, 
  canCustomerComment, 
  shouldShowEmployeeName,
  shouldShowTimeline
} from './tracking-utils';
import { usePublicComplaintTracking } from './hooks/use-public-tracking';

/**
 * Public Complaint Tracking Page
 * Allows customers to track their complaint progress without login
 */
export function PublicComplaintTrackingPage() {
  const { complaintId } = useParams<{ complaintId: string }>();
  const { updateComplaint } = useComplaintStore();
  
  // Use optimized hook to fetch only necessary data
  const { 
    complaint, 
    hotline, 
    companyName,
    compensationPayment,
    compensationReceipt,
    comments,
    timelineActions,
    relatedOrder,
  } = usePublicComplaintTracking(complaintId);
  
  const [settings] = React.useState(() => loadTrackingSettings());
  
  // Image preview state
  const [showImagePreview, setShowImagePreview] = React.useState(false);
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  const [imageLoadingStates, setImageLoadingStates] = React.useState<Record<string, boolean>>({});

  // Current user (customer in tracking page)
  const currentUser = { systemId: 'CUSTOMER', name: 'Khách hàng' };
  
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
  }, [complaint?.status]);
  
  // Memoize compensation data for easier access
  const compensationData = React.useMemo(() => ({
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
    toast.error('Không thể tải hình ảnh');
  }, []);

  // Comment handlers
  const handleAddComment = React.useCallback((content: string, contentText: string, attachments: string[], mentions: string[]) => {
    if (!complaint) return;
    
    const newAction: ComplaintAction = {
      id: asSystemId(`action_${Date.now()}`),
      actionType: 'commented',
      performedBy: asSystemId(currentUser.systemId),
      performedAt: new Date(),
      note: contentText,
      images: attachments,
      metadata: mentions.length > 0 ? { mentions } : {},
    };
    
    updateComplaint(complaint.systemId, {
      timeline: [...complaint.timeline, newAction],
    } as any);
  }, [complaint, updateComplaint]);

  const handleEditComment = React.useCallback((commentId: string, content: string, contentText: string) => {
    // Not supported in public tracking
    console.log('Edit not supported');
  }, []);

  const handleDeleteComment = React.useCallback((commentId: string) => {
    // Not supported in public tracking
    console.log('Delete not supported');
  }, []);

  const handleReplyComment = React.useCallback((parentId: string, content: string, contentText: string, attachments: string[], mentions: string[]) => {
    // Not supported in public tracking
    console.log('Reply not supported');
  }, []);

  const handleCommentImageUpload = React.useCallback(async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const serverUrl = (import.meta as any).env.VITE_SERVER_URL || 'http://localhost:3001';
      const response = await fetch(`${serverUrl}/api/comments/upload-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }, []);

  // Check if tracking is enabled
  if (!settings.enabled) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-5 w-5" />
              Tính năng tạm thời không khả dụng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tính năng theo dõi công khai hiện đang tắt. Vui lòng liên hệ bộ phận hỗ trợ để được hỗ trợ.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not found
  if (!complaint) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
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

  // Handle image preview
  const handleImageClick = React.useCallback((images: string[], index: number) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setShowImagePreview(true);
  }, []);
  
  const StatusIcon = complaint ? getStatusIcon(complaint.status) : AlertCircle;

  return (
    <div className="min-h-screen bg-background">
      {/* Header với branding */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="flex flex-1 items-center justify-between">
            {/* Logo + Company Name */}
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-none">{companyName}</p>
                <p className="text-xs text-muted-foreground">Hệ thống theo dõi khiếu nại</p>
              </div>
            </div>
            
            {/* Tracking Code */}
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Mã tra cứu</p>
              <p className="font-mono text-sm font-semibold">{complaint.publicTrackingCode || complaint.id}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-screen-2xl py-6 lg:py-8">
        <div className="space-y-6">
        
        {/* Status Card với progress */}
        <Card className="border-l-4" style={{ borderLeftColor: complaintStatusColors[complaint.status] }}>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Status Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusIcon className="h-5 w-5 shrink-0" style={{ color: complaintStatusColors[complaint.status] }} />
                    <h2 className="text-2xl font-bold tracking-tight">{complaintStatusLabels[complaint.status]}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
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
                <div className="flex items-center justify-between gap-4 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/20">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Dự kiến hoàn tất trong</p>
                    <p className="text-xs text-muted-foreground">Cam kết xử lý trong 24 giờ</p>
                  </div>
                  <SlaTimer
                    startTime={complaint.createdAt}
                    targetMinutes={COMPLAINT_SLA_CONFIGS.resolution.targetMinutes}
                    isCompleted={false}
                    thresholds={COMPLAINT_SLA_CONFIGS.resolution.thresholds}
                  />
                </div>
              )}
              
              {/* Badges Row - Removed: Trung bình, Xác nhận đúng, Thiếu hàng, Đã bù trừ badges */}
            </div>
          </CardContent>
        </Card>
        
        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Thông tin đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loại khiếu nại:</span>
                <span className="font-medium">{complaintTypeLabels[complaint.type]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trạng thái xác minh:</span>
                <span className="font-medium">{complaintVerificationLabels[complaint.verification]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày tạo:</span>
                <span className="font-medium">
                  {new Date(complaint.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              {complaint.endedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày kết thúc:</span>
                  <span className="font-medium">
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã đơn hàng:</span>
                <span className="font-medium">{complaint.orderCode || complaint.orderSystemId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã vận đơn:</span>
                <span className="font-medium">
                  {relatedOrder?.packagings?.[0]?.trackingCode || 'Chưa có'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Khách hàng:</span>
                <span className="font-medium">{complaint.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số điện thoại:</span>
                <span className="font-medium">{complaint.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Địa chỉ giao hàng:</span>
                <span className="font-medium text-right">{formatOrderAddress(relatedOrder?.shippingAddress) || 'Chưa có'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Người tạo đơn:</span>
                <span className="font-medium">{relatedOrder?.salesperson || 'Chưa có'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày bán:</span>
                <span className="font-medium">
                  {relatedOrder ? formatDateForDisplay(relatedOrder.orderDate) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Giá trị đơn:</span>
                <span className="font-medium">
                  {complaint.orderValue ? complaint.orderValue.toLocaleString('vi-VN') : (relatedOrder?.grandTotal || 0).toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thời gian giao hàng:</span>
                <span className="font-medium">
                  {relatedOrder?.expectedDeliveryDate ? formatDateForDisplay(relatedOrder.expectedDeliveryDate) : 'Chưa có'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thời gian xuất kho:</span>
                <span className="font-medium">
                  {relatedOrder?.packagings?.[0]?.requestDate ? formatDateForDisplay(relatedOrder.packagings[0].requestDate) : 'Chưa xuất'}
                </span>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground">Mô tả khiếu nại</p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
              {complaint.resolutionNote && (<p className="text-sm leading-relaxed whitespace-pre-wrap">{complaint.resolutionNote}</p> )}
    
            </div>
          </CardContent>
        </Card>
        
        {/* Timeline - Lịch sử xử lý */}
        {shouldShowTimeline() && timelineActions.length > 0 && (
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
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">{getActionLabel(action.actionType)}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTimeForDisplay(action.performedAt)}
                            {shouldShowEmployeeName() && action.performedBy && ` • ${action.performedBy}`}
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
                                <img
                                  src={url}
                                  alt={`Ảnh ${i + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  loading="lazy"
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
        {complaint.affectedProducts && complaint.affectedProducts.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
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
                        <div className="font-medium text-sm">{item.productName}</div>
                        <div className="text-xs text-muted-foreground">{item.productId}</div>
                        
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
                        <th className="text-left p-2 font-medium min-w-[180px]">Sản phẩm</th>
                        <th className="text-right p-2 font-medium w-24">Đơn giá</th>
                        <th className="text-center p-2 font-medium w-20">SL đặt</th>
                        <th className="text-left p-2 font-medium w-28">Loại</th>
                        <th className="text-center p-2 font-medium w-24">Thực tế</th>
                        <th className="text-center p-2 font-medium w-20">Thừa</th>
                        <th className="text-center p-2 font-medium w-20">Thiếu</th>
                        <th className="text-center p-2 font-medium w-20">Hỏng</th>
                        <th className="text-right p-2 font-medium w-28">Tổng tiền</th>
                        <th className="text-left p-2 font-medium min-w-[150px]">Ghi chú</th>
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
                              <div className="font-medium text-sm">{item.productName}</div>
                              <div className="text-xs text-muted-foreground">{item.productId}</div>
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
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
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
                      <div className="space-y-2 p-4 rounded-lg border bg-muted/50">
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
                      <div className="space-y-2 p-4 rounded-lg border bg-muted/50">
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
                      <div className="space-y-2 p-4 rounded-lg border bg-muted/50">
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
                      <div className="space-y-2 p-4 rounded-lg border bg-muted/50">
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
              <CardTitle className="text-sm sm:text-base md:text-lg font-semibold flex items-center gap-2">
                <Receipt className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                Thông tin bù trừ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
              {compensationData.payment && (
                <div className="p-3 sm:p-4 rounded-lg border bg-muted/50">
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
                  <div className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2">
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
                <div className="p-4 rounded-lg border bg-muted/50">
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
        {complaint.images && complaint.images.filter(img => img.type === 'initial').length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
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
                        <img
                          src={image.url}
                          alt="Ảnh từ khách hàng"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
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
        {(complaint as any).employeeImages && (complaint as any).employeeImages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Hình ảnh kiểm tra từ nhân viên ({(complaint as any).employeeImages.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {(complaint as any).employeeImages.map((image: any, idx: number) => {
                  const allEmployeeImages = (complaint as any).employeeImages.map((img: any) => img.url);
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
                      <img
                        src={image.url}
                        alt="Ảnh kiểm tra từ nhân viên"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
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
        {(complaint as any).videoLinks && (complaint as any).videoLinks.trim().length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Video bằng chứng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(complaint as any).videoLinks.split('\n').filter((link: string) => link.trim()).map((link: string, idx: number) => {
                  const trimmedLink = link.trim();
                  const isGoogleDrive = trimmedLink.includes('drive.google.com');
                  const isYouTube = trimmedLink.includes('youtube.com') || trimmedLink.includes('youtu.be');
                  
                  // Extract Google Drive file ID
                  let embedUrl = trimmedLink;
                  if (isGoogleDrive) {
                    const match = trimmedLink.match(/\/d\/([^\/]+)/);
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
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors group"
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
        {canCustomerComment() && (
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
        <footer className="space-y-3 py-8 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Package className="h-4 w-4" />
            <p className="text-sm">{companyName}</p>
          </div>
          <p className="text-sm text-muted-foreground">
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
