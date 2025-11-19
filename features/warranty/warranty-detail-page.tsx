import * as React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Edit2, Save, X, MessageSquare, Printer, Link as LinkIcon, XCircle, Bell, Clock, AlertCircle, Copy, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { formatDateTime } from '../../lib/date-utils.ts';
import { cn } from '../../lib/utils.ts';
import type { WarrantyTicket } from './types.ts';
import { WARRANTY_STATUS_LABELS, WARRANTY_STATUS_COLORS, SETTLEMENT_TYPE_LABELS, SETTLEMENT_STATUS_LABELS, type WarrantyHistory } from './types.ts';
import { useWarrantyStore } from './store.ts';
import { getCurrentDate, toISODateTime } from '../../lib/date-utils.ts';
import { useAuth } from '../../contexts/auth-context.tsx';

// UI Components
import { Button } from '../../components/ui/button.tsx';
import { ScrollArea } from '../../components/ui/scroll-area.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { Separator } from '../../components/ui/separator.tsx';
import { Textarea } from '../../components/ui/textarea.tsx';
import { Input } from '../../components/ui/input.tsx';
import { ProgressiveImage } from '../../components/ui/progressive-image.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog.tsx';
import { ImagePreviewDialog } from '../../components/ui/image-preview-dialog.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select.tsx';

// Detail-specific components
import { WarrantyProductsDetailTable } from './components/warranty-products-detail-table.tsx';
import { WarrantyProcessingCard, WarrantySummaryCard } from './components/index.ts';
import { calculateWarrantyProcessingState } from './components/logic/processing.ts';
import { TicketInfoCard } from './components/detail/ticket-info-card.tsx';
import { CustomerInfoCard } from './components/detail/customer-info-card.tsx';
import { WarrantyWorkflowCard } from './components/detail/workflow-card.tsx';
import { WarrantyImageGalleryCard } from './components/detail/image-gallery-card.tsx';
import { getWorkflowTemplate } from '../settings/templates/workflow-templates-page.tsx';
import {
  WarrantyCancelDialog,
  WarrantyReopenFromCancelledDialog,
  WarrantyReopenFromReturnedDialog,
  WarrantyReturnMethodDialog,
  WarrantyReminderDialog,
} from './components/dialogs/index.ts';
import { useWarrantyReminders } from './hooks/use-warranty-reminders.ts';
import { useWarrantyTimeTracking } from './hooks/use-warranty-time-tracking.ts';
import { useWarrantySettlement } from './hooks/use-warranty-settlement.ts';
import { useReturnMethodDialog } from './hooks/use-return-method-dialog.ts';
import { useWarrantyActions } from './hooks/use-warranty-actions.ts';
import { checkWarrantyOverdue, formatTimeLeft } from './warranty-sla-utils.ts';
import { ROUTES, generatePath } from '../../lib/router.ts';

// Section components
import { WarrantyCommentsSection, WarrantyHistorySection } from './components/sections/index.ts';

import { useOrderStore } from '../orders/store.ts';
import { usePaymentStore } from '../payments/store.ts';
import { asSystemId } from '@/lib/id-types.ts';
import { useReceiptStore } from '../receipts/store.ts';

const RESPONSE_TEMPLATES = [
  {
    id: 'processing-update',
    name: 'Đang xử lý',
    content: 'Chào {customerName}, phiếu bảo hành {ticketId} đang được kỹ thuật viên xử lý. Chúng tôi sẽ cập nhật ngay khi hoàn tất.',
  },
  {
    id: 'ready-for-pickup',
    name: 'Sẵn sàng trả hàng',
    content: 'Phiếu bảo hành {ticketId} đã hoàn tất. Anh/chị {customerName} vui lòng đến cửa hàng để nhận lại sản phẩm hoặc phản hồi cho chúng tôi phương thức giao hàng.',
  },
  {
    id: 'awaiting-response',
    name: 'Nhắc khách phản hồi',
    content: 'Chúng tôi đang chờ thông tin bổ sung cho phiếu {ticketId}. Vui lòng liên hệ hotline nếu cần hỗ trợ thêm.',
  },
];
 
export function WarrantyDetailPage() {
  const navigate = useNavigate();
  const { systemId = '' } = useParams<{ systemId: string }>();
  const { user, employee } = useAuth();

  const currentUserSystemId = React.useMemo(() => {
    if (employee?.systemId) {
      return employee.systemId;
    }
    if (user?.employeeId) {
      return asSystemId(user.employeeId);
    }
    return asSystemId('SYSTEM');
  }, [employee?.systemId, user?.employeeId]);

  const currentUser = React.useMemo(() => ({
    name: employee?.fullName || user?.name || 'Hệ thống',
    systemId: currentUserSystemId,
  }), [employee?.fullName, user?.name, currentUserSystemId]);

  const tickets = useWarrantyStore((state) => state.data);
  const update = useWarrantyStore((state) => state.update);
  const updateStatus = useWarrantyStore((state) => state.updateStatus);
  const addHistory = useWarrantyStore((state) => state.addHistory);

  const ticket = React.useMemo<WarrantyTicket | null>(() => {
    return tickets.find((item) => item.systemId === systemId) || null;
  }, [tickets, systemId]);

  const settlement = useWarrantySettlement(systemId, { ticket });
  const totalSettlementAmount = settlement.totalPayment;
  const settlementState = settlement.processingState;

  const { data: orders } = useOrderStore();

  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const [showReopenDialog, setShowReopenDialog] = React.useState(false);
  const [showReopenReturnedDialog, setShowReopenReturnedDialog] = React.useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = React.useState(false);
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  const [showImagePreview, setShowImagePreview] = React.useState(false);

  const linkedOrder = React.useMemo(() => {
    if (!ticket?.linkedOrderSystemId) return undefined;
    return orders.find((order) => order.systemId === ticket.linkedOrderSystemId);
  }, [orders, ticket?.linkedOrderSystemId]);

  const {
    isOpen: isReturnDialogOpen,
    openDialog: openReturnDialog,
    handleOpenChange: handleReturnDialogOpenChange,
    handleReturnMethodChange,
    handleOrderSelect,
    handleOrderSearchChange,
    handleConfirmDirect,
    handleConfirmWithOrder,
    resetDialog: resetReturnDialog,
    returnMethod,
    selectedOrderValue,
    orderSearchResults,
    orderSearchQuery,
    isSearchingOrders,
    totalOrderCount,
    currentMethodLabel: currentReturnMethodLabel,
  } = useReturnMethodDialog({
    ticket,
    linkedOrder,
    orders,
    currentUserName: currentUser.name,
  });

  const publicTrackingUrl = React.useMemo(() => {
    if (!ticket) return '';
    const code = ticket.publicTrackingCode || ticket.systemId || ticket.id;
    if (!code) return '';
    const trackingPath = generatePath(ROUTES.INTERNAL.WARRANTY_TRACKING, { trackingCode: code });
    return `${window.location.origin}${trackingPath}`;
  }, [ticket?.publicTrackingCode, ticket?.systemId, ticket?.id]);

  const {
    handleStatusChange,
    handleCompleteTicket,
    handleCopyTrackingLink,
    handleGenerateTrackingCode,
    handleNavigateEmployee,
    handleNavigateOrder,
    isCompletingTicket,
  } = useWarrantyActions({
    ticket,
    currentUser,
    linkedOrder,
    publicTrackingUrl,
    totalSettlementAmount,
    remainingSettlementAmount: settlementState.remainingAmount,
    update,
    updateStatus,
    addHistory,
    navigate,
  });


  const timeMetrics = useWarrantyTimeTracking(ticket);

  const slaStatus = React.useMemo(() => {
    if (!ticket) return null;
    const status = checkWarrantyOverdue(ticket);
    if (status.isOverdueReturn || status.isOverdueProcessing || status.isOverdueResponse) {
      return { label: 'Quá hạn', color: 'text-destructive' };
    }
    const minutesLeft = Math.min(status.responseTimeLeft, status.processingTimeLeft, status.returnTimeLeft);
    if (minutesLeft < 60) {
      return { label: 'Sắp hết hạn', color: 'text-orange-500' };
    }
    return { label: 'Đúng hạn', color: 'text-green-600' };
  }, [ticket]);

  const {
    isReminderModalOpen,
    openReminderModal,
    closeReminderModal,
    selectedTicket,
    templates,
    sendReminder,
  } = useWarrantyReminders();

  const responseTemplates = React.useMemo(() => RESPONSE_TEMPLATES, []);
  const isReturned = ticket?.status === 'returned';

  const handleImagePreview = React.useCallback((images: string[], index: number) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setShowImagePreview(true);
  }, []);

  // Page header actions - Calculate directly for reactivity
  const actions = React.useMemo(() => {
    const actionButtons = [];

    // Print button (LEFT SIDE)
    actionButtons.push(
      <Button
        key="print"
        type="button"
        size="sm"
        variant="outline"
        className="h-9"
        onClick={() => window.print()}
      >
        <Printer className="h-4 w-4 mr-2" />
        In
      </Button>
    );

    // Remind button (LEFT SIDE) - available for non-returned and non-cancelled tickets
    if (ticket && !isReturned && !ticket.cancelledAt) {
      actionButtons.push(
        <Button
          key="remind"
          type="button"
          size="sm"
          variant="outline"
          className="h-9"
          onClick={() => openReminderModal(ticket)}
        >
          <Bell className="h-4 w-4 mr-2" />
          Nhắc nhở
        </Button>
      );
    }

    // Template button (LEFT SIDE) - available when ticket exists and not cancelled
    if (ticket && !ticket.cancelledAt) {
      actionButtons.push(
        <Button
          key="templates"
          type="button"
          size="sm"
          variant="outline"
          className="h-9"
          onClick={() => setTemplateDialogOpen(true)}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Mẫu phản hồi
        </Button>
      );
    }

    // Status change buttons (RIGHT SIDE)
    // Show different buttons based on ticket status and cancelledAt flag
    
    if (ticket?.cancelledAt) {
      // If cancelled, only show "Mở lại" button
      actionButtons.push(
        <Button 
          key="reopen" 
          size="sm" 
          variant="outline"
          className="h-9 text-green-600 hover:text-green-700"
          onClick={() => setShowReopenDialog(true)}
        >
          Mở lại
        </Button>
      );
    } else {
      // Normal status flow buttons
      if (ticket?.status === 'incomplete') {
        // Show primary "Cập nhật thông tin" button for incomplete status
        actionButtons.push(
          <Button 
            key="complete-info"
            size="sm"
            variant="default"
            className="h-9"
            onClick={() => {
              if (ticket) {
                addHistory(ticket.systemId, 'Cập nhật thông tin sản phẩm bảo hành', currentUser.name);
              }
              navigate(`/warranty/${systemId}/update`);
            }}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Cập nhật thông tin
          </Button>
        );
      }
      if (ticket?.status === 'pending') {
        actionButtons.push(
          <Button key="to-processed" size="sm" variant="outline" className="h-9" onClick={() => handleStatusChange('processed')}>
            Đánh dấu Đã xử lý
          </Button>
        );
      }
      if (ticket?.status === 'processed' || ticket?.status === 'returned') {
        actionButtons.push(
          <Button 
            key="to-returned" 
            size="sm" 
            variant="outline" 
            className="h-9"
            onClick={openReturnDialog}
          >
            {ticket?.status === 'returned' ? 'Cập nhật trả hàng' : 'Đã trả hàng cho khách'}
          </Button>
        );
      }
      if (ticket?.status === 'returned') {
        // Show "Kết thúc" button - no validation, just allow completion
        actionButtons.push(
          <Button 
            key="complete" 
            size="sm" 
            variant="default"
            className="h-9 bg-blue-600 hover:bg-blue-700"
            onClick={handleCompleteTicket}
            disabled={isCompletingTicket}
          >
            Kết thúc
          </Button>
        );
      }
      
      if (ticket?.status === 'completed') {
        // If completed, show "Mở lại" to go back to returned
        actionButtons.push(
          <Button 
            key="reopen-from-completed" 
            size="sm" 
            variant="outline"
            className="h-9 text-blue-600 hover:text-blue-700"
            onClick={() => setShowReopenReturnedDialog(true)}
          >
            Mở lại
          </Button>
        );
      }
    }

    // Edit button - only show if not returned and not cancelled (RIGHT SIDE)
    if (!isReturned && !ticket?.cancelledAt) {
      actionButtons.push(
        <Button
          key="edit"
          type="button"
          size="sm"
          variant="outline"
          className="h-9"
          onClick={() => {
            if (ticket) {
              addHistory(ticket.systemId, 'Mở chế độ chỉnh sửa', currentUser.name);
            }
            navigate(`/warranty/${systemId}/edit`);
          }}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </Button>
      );
    }

    // Cancel button - only show if not already cancelled or completed (RIGHT SIDE)
    // Allow cancelling at any status except completed
    if (!ticket?.cancelledAt && ticket?.status !== 'completed') {
      actionButtons.push(
        <Button
          key="cancel"
          type="button"
          size="sm"
          variant="outline"
          className="h-9 text-destructive hover:text-destructive"
          onClick={() => setShowCancelDialog(true)}
        >
          <XCircle className="h-4 w-4 mr-2" />
          Hủy
        </Button>
      );
    }

    return actionButtons;
  }, [ticket, systemId, isReturned, currentUser.name, navigate, addHistory, handleStatusChange, handleCompleteTicket, openReminderModal, isCompletingTicket]);

  // Page header - title auto-generated from breadcrumb, Badge below title
  const statusBadge = ticket ? (
    <Badge className={WARRANTY_STATUS_COLORS[ticket.status]}>
      {WARRANTY_STATUS_LABELS[ticket.status]}
    </Badge>
  ) : undefined;
  
  // SLA Timer & Time Tracking Metrics component
  const slaMetrics = ticket && !isReturned && timeMetrics && slaStatus ? (
    <div className="flex items-center gap-4 text-sm mt-2">
      {/* SLA Status */}
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-muted-foreground">SLA:</span>
        <span className={cn("font-medium", slaStatus.color)}>{slaStatus.label}</span>
      </div>
      {/* Time Tracking Metrics */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Phản hồi:</span>
          <span className={cn(
            "font-medium",
            timeMetrics.responseStatus === 'overdue' ? 'text-red-600' :
            timeMetrics.responseStatus === 'warning' ? 'text-yellow-600' : 'text-green-600'
          )}>{timeMetrics.responseTimeFormatted}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Xử lý:</span>
          <span className={cn(
            "font-medium",
            timeMetrics.processingStatus === 'overdue' ? 'text-red-600' :
            timeMetrics.processingStatus === 'warning' ? 'text-yellow-600' : 'text-green-600'
          )}>{timeMetrics.processingTimeFormatted}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Tổng:</span>
          <span className="font-semibold text-primary">{timeMetrics.currentDurationFormatted || timeMetrics.totalDurationFormatted}</span>
        </div>
      </div>
    </div>
  ) : null;
  
  // Add Print button to actions array
  const allActions = React.useMemo(() => [
    <Button
      key="print"
      type="button"
      size="sm"
      variant="outline"
      onClick={() => {
        if (ticket) {
          addHistory(ticket.systemId, 'In phiếu bảo hành', currentUser.name);
        }
        window.print();
      }}
      className="h-9"
    >
      <Printer className="h-4 w-4 mr-2" />
      In
    </Button>,
    ...actions.filter(a => a.key !== 'print' && a.key !== 'get-link'),
  ], [actions, ticket, addHistory, currentUser.name]);
  
  usePageHeader({
    // Title auto-generated from breadcrumb-system.ts
    badge: statusBadge,
    actions: allActions,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Quản lý bảo hành', href: '/warranty', isCurrent: false },
      { label: ticket?.id || 'Chi tiết', href: '', isCurrent: true },
    ],
  });

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Không tìm thấy phiếu bảo hành</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
        <ScrollArea className="flex-grow">
          <div className="pr-4 space-y-4">
            {/* Warning Banner for Incomplete Status */}
            {ticket?.status === 'incomplete' && (
              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                      Phiếu chưa đầy đủ thông tin
                    </h3>
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      Vui lòng cập nhật <strong>Danh sách sản phẩm bảo hành</strong> để chuyển sang trạng thái "Chưa xử lý" và tiếp tục xử lý phiếu.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* ===== ROW 1: Left Column 70% (Customer + Ticket Info) + Right Column 30% (Workflow) ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-4">
              {/* Left Column: Customer Info + Ticket Info */}
              <div className="space-y-4">
                <TicketInfoCard
                  ticket={ticket}
                  linkedOrderLabel={linkedOrder?.id}
                  publicTrackingUrl={publicTrackingUrl}
                  onCopyPublicLink={handleCopyTrackingLink}
                  onGenerateTrackingCode={handleGenerateTrackingCode}
                  onNavigateEmployee={handleNavigateEmployee}
                  onNavigateOrder={linkedOrder ? handleNavigateOrder : undefined}
                />

                {/* Summary Card - Thanh toán */}
                <WarrantySummaryCard 
                  products={ticket.products} 
                  shippingFee={ticket.shippingFee || 0}
                  settlement={settlement}
                />

                {/* Xử lý bảo hành - Nút tạo phiếu chi/thu */}
                <WarrantyProcessingCard
                  warrantyId={ticket.id}
                  warrantySystemId={ticket.systemId}
                  customer={{
                    name: ticket.customerName,
                    phone: ticket.customerPhone,
                  }}
                  linkedOrderSystemId={ticket.linkedOrderSystemId}
                  branchSystemId={ticket.branchSystemId}
                  branchName={ticket.branchName}
                  ticket={ticket}
                  settlement={settlement}
                  orders={orders}
                />

                <CustomerInfoCard ticket={ticket} />
              </div>

              <WarrantyWorkflowCard
                ticket={ticket}
                currentUserName={currentUser.name}
                onUpdateTicket={update}
                onUpdateStatus={updateStatus}
                onAddHistory={addHistory}
              />
            </div>

            {/* ===== ROW 2: Images - 2 columns side by side (50-50) ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WarrantyImageGalleryCard
                title="Hình ảnh lúc nhận"
                images={ticket.receivedImages}
                emptyMessage="Chưa có hình ảnh"
                footnote="Chụp khi nhận hàng"
                onPreview={handleImagePreview}
              />
              <WarrantyImageGalleryCard
                title="Hình ảnh đã xử lý"
                images={ticket.processedImages}
                emptyMessage="Chưa có hình ảnh"
                footnote="Chụp sau xử lý"
                onPreview={handleImagePreview}
              />
            </div>

            {/* ===== ROW 3: Products Table (with integrated summary) ===== */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Danh sách sản phẩm bảo hành</CardTitle>
              </CardHeader>
              <CardContent>
                <WarrantyProductsDetailTable products={ticket.products} ticket={ticket} />
              </CardContent>
            </Card>

            {/* ===== ROW 4: Notes ===== */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Ghi chú</CardTitle>
              </CardHeader>
              <CardContent>
                {ticket.notes ? (
                  <p className="text-sm whitespace-pre-wrap">{ticket.notes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Không có ghi chú</p>
                )}
              </CardContent>
            </Card>

            <WarrantyCommentsSection
              ticket={ticket}
              currentUser={currentUser}
              onUpdateTicket={update}
              onAddHistory={addHistory}
            />

            <WarrantyHistorySection ticket={ticket} />
          </div>
        </ScrollArea>

        <WarrantyReturnMethodDialog
          open={isReturnDialogOpen}
          ticket={ticket}
          currentMethodLabel={currentReturnMethodLabel}
          returnMethod={returnMethod}
          onReturnMethodChange={handleReturnMethodChange}
          selectedOrderValue={selectedOrderValue}
          onOrderSelect={handleOrderSelect}
          orderSearchResults={orderSearchResults}
          orderSearchQuery={orderSearchQuery}
          onOrderSearchChange={handleOrderSearchChange}
          isSearchingOrders={isSearchingOrders}
          totalOrderCount={totalOrderCount}
          onConfirmDirect={handleConfirmDirect}
          onConfirmWithOrder={handleConfirmWithOrder}
          onOpenChange={handleReturnDialogOpenChange}
          onReset={resetReturnDialog}
        />

      {/* Cancel Dialog */}
      <WarrantyCancelDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        ticket={ticket}
      />

      {/* Reopen Dialog (from cancelled) */}
      <WarrantyReopenFromCancelledDialog
        open={showReopenDialog}
        onOpenChange={setShowReopenDialog}
        ticket={ticket}
      />

      {/* Reopen Dialog (from returned/completed) */}
      <WarrantyReopenFromReturnedDialog
        open={showReopenReturnedDialog}
        onOpenChange={setShowReopenReturnedDialog}
        ticket={ticket}
      />

      {/* Reminder Modal */}
      <WarrantyReminderDialog
        open={isReminderModalOpen}
        onOpenChange={closeReminderModal}
        ticket={selectedTicket}
        templates={templates}
        onSendReminder={sendReminder}
      />

      {/* XÓA: Không cần Remaining Amount Dialog nữa - xử lý qua phiếu thu/chi */}

      {/* Template Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mẫu phản hồi bảo hành</DialogTitle>
            <DialogDescription>
              Chọn mẫu phản hồi để copy nội dung. Sử dụng {'{ticketId}'} để thay mã phiếu tự động.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {responseTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Replace placeholders
                        let content = template.content;
                        if (ticket) {
                          content = content.replace(/{ticketId}/g, ticket.id);
                          content = content.replace(/{customerName}/g, ticket.customerName);
                          content = content.replace(/{trackingCode}/g, ticket.trackingCode);
                        }
                        navigator.clipboard.writeText(content);
                        toast.success('Đã copy nội dung');
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                    {template.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <ImagePreviewDialog
        images={previewImages}
        initialIndex={previewIndex}
        open={showImagePreview}
        onOpenChange={setShowImagePreview}
        title="Hình ảnh bảo hành"
      />

      {/* Order Selection Dialog - TODO: Implement WarrantyOrderSelectionDialog component */}
    </div>
  );
}
