'use client'

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Edit2, MessageSquare, Printer, XCircle, Bell, Clock, AlertCircle, Copy } from 'lucide-react';
// formatDate import removed - not used
import { cn } from '../../lib/utils';
import type { WarrantyTicket, WarrantyHistory } from './types';
import { WARRANTY_STATUS_LABELS, WARRANTY_STATUS_COLORS } from './types';
import { useWarrantyMutations } from './hooks/use-warranties';
import { useWarranty } from './hooks/use-warranties';
import { useAuth } from '../../contexts/auth-context';

// UI Components
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { usePageHeader } from '../../contexts/page-header-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { ImagePreviewDialog } from '../../components/ui/image-preview-dialog';

// Detail-specific components
import { WarrantyProductsDetailTable } from './components/warranty-products-detail-table';
import { WarrantyProcessingCard } from './components/cards/warranty-processing-card';
import { WarrantySummaryCard } from './components/cards/warranty-summary-card';
import { TicketInfoCard } from './components/detail/ticket-info-card';
import { CustomerInfoCard } from './components/detail/customer-info-card';
import { WarrantyWorkflowCard } from './components/detail/workflow-card';
import { WarrantyImageGalleryCard } from './components/detail/image-gallery-card';
import { WarrantyCancelDialog } from './components/dialogs/warranty-cancel-dialog';
import { WarrantyReopenFromCancelledDialog } from './components/dialogs/warranty-reopen-from-cancelled-dialog';
import { WarrantyReopenFromReturnedDialog } from './components/dialogs/warranty-reopen-from-returned-dialog';
import { WarrantyReturnMethodDialog } from './components/dialogs/warranty-return-method-dialog';
import { WarrantyReminderDialog } from './components/dialogs/warranty-reminder-dialog';
import { useWarrantyReminders } from './hooks/use-warranty-reminders';
import { useWarrantyTimeTracking } from './hooks/use-warranty-time-tracking';
import { useWarrantySettlement } from './hooks/use-warranty-settlement';
import { useReturnMethodDialog } from './hooks/use-return-method-dialog';
import { useWarrantyActions } from './hooks/use-warranty-actions';
import { checkWarrantyOverdue } from './warranty-sla-utils';
import { ROUTES, generatePath } from '../../lib/router';

// Section components
import { WarrantyCommentsSection } from './components/sections/comments-section';
import { WarrantyHistorySection } from './components/sections/history-section';

import { useOrder } from '../orders/hooks/use-orders';
import { asSystemId } from '@/lib/id-types';
import { usePrint } from '../../lib/use-print';
import { 
  convertWarrantyForPrint,
  mapWarrantyToPrintData, 
  mapWarrantyLineItems, 
  createStoreSettings 
} from '../../lib/print/warranty-print-helper';
import { useBranchFinder } from '../settings/branches/hooks/use-all-branches';
import { useStoreInfoData } from '../settings/store-info/hooks/use-store-info';

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
  const router = useRouter();
  const { systemId = '' } = useParams<{ systemId: string }>();
  const { user, employee } = useAuth();

  // ✅ React Query for single ticket
  const { data: ticketFromQuery, isLoading } = useWarranty(systemId);

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

  const { update: updateMutation } = useWarrantyMutations({
    onUpdateSuccess: () => {
      toast.success('Đã cập nhật phiếu bảo hành');
    },
    onError: (error) => {
      toast.error('Lỗi', { description: error.message });
    }
  });
  
  // Wrapper functions for legacy hooks that expect sync functions
  const update = React.useCallback((systemId: string, data: Partial<WarrantyTicket>) => {
    updateMutation.mutate({ systemId, data });
  }, [updateMutation]);
  
  const updateStatus = React.useCallback((systemId: string, status: WarrantyTicket['status'], reason?: string) => {
    updateMutation.mutate({ systemId, data: { status, ...(reason && { statusReason: reason }) } });
  }, [updateMutation]);
  
  // ✅ Ưu tiên React Query, fallback to findById if needed
  const ticket = React.useMemo<WarrantyTicket | null>(() => {
    if (systemId && ticketFromQuery) {
      return ticketFromQuery as WarrantyTicket;
    }
    return null;
  }, [systemId, ticketFromQuery]);
  
  const addHistory = React.useCallback((systemId: string, entry: unknown) => {
    // This would need the current ticket's history array
    if (!ticket?.history) return;
    const newHistory = [...ticket.history, entry as WarrantyHistory];
    updateMutation.mutate({ systemId, data: { history: newHistory } });
  }, [ticket?.history, updateMutation]);

  const settlement = useWarrantySettlement(systemId, { ticket });
  const totalSettlementAmount = settlement.totalPayment;
  const settlementState = settlement.processingState;

  // ⚡ OPTIMIZED: Fetch only the linked order instead of all orders
  const { data: linkedOrder } = useOrder(ticket?.linkedOrderSystemId);

  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const [showReopenDialog, setShowReopenDialog] = React.useState(false);
  const [showReopenReturnedDialog, setShowReopenReturnedDialog] = React.useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = React.useState(false);
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  const [showImagePreview, setShowImagePreview] = React.useState(false);

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
    currentUserName: currentUser.name,
  });

  const publicTrackingUrl = React.useMemo(() => {
    if (!ticket) return '';
    const code = ticket.publicTrackingCode || ticket.systemId || ticket.id;
    if (!code) return '';
    const trackingPath = generatePath(ROUTES.INTERNAL.WARRANTY_TRACKING, { trackingCode: code });
    return `${window.location.origin}${trackingPath}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- specific fields are sufficient for URL generation
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
    navigate: ((path: string) => router.push(path)) as unknown as typeof router,
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
  const isReturned = ticket?.status === 'RETURNED';

  const { findById: findBranchById } = useBranchFinder();
  const { info: storeInfo } = useStoreInfoData();
  const { print } = usePrint(ticket?.branchSystemId);

  const handlePrint = React.useCallback(() => {
    if (!ticket) return;

    const branch = ticket.branchSystemId ? findBranchById(ticket.branchSystemId) : undefined;
    const storeSettings = createStoreSettings(storeInfo);
    
    const warrantyForPrint = convertWarrantyForPrint(ticket, {
      branch,
      linkedOrderId: linkedOrder?.id,
    });

    print('warranty', {
      data: mapWarrantyToPrintData(warrantyForPrint, storeSettings),
      lineItems: mapWarrantyLineItems(warrantyForPrint.items),
    });
  }, [ticket, linkedOrder, storeInfo, print, findBranchById]);

  const handleImagePreview = React.useCallback((images: string[], index: number) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setShowImagePreview(true);
  }, []);

  // Page header actions - Calculate directly for reactivity
  const actions = React.useMemo(() => {
    const actionButtons: React.ReactElement[] = [];

    // Print button (LEFT SIDE)
    actionButtons.push(
      <Button
        key="print"
        type="button"
        size="sm"
        variant="outline"
        className="h-9"
        onClick={handlePrint}
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
      if (ticket?.status === 'RECEIVED') {
        // Show primary "Bắt đầu xử lý" button for RECEIVED status
        actionButtons.push(
          <Button 
            key="complete-info"
            size="sm"
            variant="default"
            className="h-9"
            onClick={() => {
              // Navigate to update page (history will be logged on actual save)
              router.push(`/warranty/${systemId}/update`);
            }}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Cập nhật thông tin
          </Button>
        );
      }
      if (ticket?.status === 'PROCESSING') {
        actionButtons.push(
          <Button key="to-completed" size="sm" variant="outline" className="h-9" onClick={() => handleStatusChange('COMPLETED')}>
            Đánh dấu Hoàn tất
          </Button>
        );
      }
      if (ticket?.status === 'COMPLETED' || ticket?.status === 'RETURNED') {
        actionButtons.push(
          <Button 
            key="to-returned" 
            size="sm" 
            variant="outline" 
            className="h-9"
            onClick={openReturnDialog}
          >
            {ticket?.status === 'RETURNED' ? 'Cập nhật trả hàng' : 'Đã trả hàng cho khách'}
          </Button>
        );
      }
      if (ticket?.status === 'RETURNED') {
        // Show "Kết thúc" button - ticket already returned to customer
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
      
      if (ticket?.status === 'CANCELLED') {
        // If cancelled via completion, show "Mở lại"
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
            // Navigate directly to edit page without logging history
            // (history logging will happen when user saves changes)
            router.push(`/warranty/${systemId}/edit`);
          }}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </Button>
      );
    }

    // Cancel button - only show if not already cancelled (RIGHT SIDE)
    if (!ticket?.cancelledAt && ticket?.status !== 'CANCELLED') {
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
  }, [ticket, systemId, isReturned, router, handleStatusChange, handleCompleteTicket, openReminderModal, isCompletingTicket, handlePrint, openReturnDialog]);

  // Page header - title auto-generated from breadcrumb, Badge below title
  const statusBadge = ticket ? (
    <Badge className={WARRANTY_STATUS_COLORS[ticket.status]}>
      {WARRANTY_STATUS_LABELS[ticket.status]}
    </Badge>
  ) : undefined;
  
  // SLA Timer & Time Tracking Metrics component
  const _slaMetrics = ticket && !isReturned && timeMetrics && slaStatus ? (
    <div className="flex items-center gap-4 text-body-sm mt-2">
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
        // Just print without logging history (print action doesn't need tracking)
        window.print();
      }}
      className="h-9"
    >
      <Printer className="h-4 w-4 mr-2" />
      In
    </Button>,
    ...actions.filter(a => a.key !== 'print' && a.key !== 'get-link'),
  ], [actions]);
  
  const headerTitle = ticket ? `Phiếu bảo hành ${ticket.id}` : 'Chi tiết phiếu bảo hành';

  usePageHeader({
    title: headerTitle,
    badge: statusBadge,
    backPath: '/warranty',
    actions: allActions,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Quản lý bảo hành', href: '/warranty', isCurrent: false },
      { label: ticket?.id || 'Chi tiết', href: '', isCurrent: true },
    ],
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Không tìm thấy phiếu bảo hành</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
        <ScrollArea className="grow">
          <div className="pr-4 space-y-4">
            {/* Warning Banner - Show only when RECEIVED status AND no products */}
            {ticket?.status === 'RECEIVED' && (!ticket.products || (ticket.products as unknown[]).length === 0) && (
              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                      Phiếu chưa đầy đủ thông tin
                    </h3>
                    <p className="text-body-sm text-orange-800 dark:text-orange-200">
                      Vui lòng cập nhật <strong>Danh sách sản phẩm bảo hành</strong> để chuyển sang trạng thái "Đang xử lý" và tiếp tục xử lý phiếu.
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
                <CardTitle>Danh sách sản phẩm bảo hành</CardTitle>
              </CardHeader>
              <CardContent>
                <WarrantyProductsDetailTable products={ticket.products || []} ticket={ticket} />
              </CardContent>
            </Card>

            {/* ===== ROW 4: Notes ===== */}
            <Card>
              <CardHeader>
                <CardTitle>Ghi chú</CardTitle>
              </CardHeader>
              <CardContent>
                {ticket.notes ? (
                  <p className="text-body-sm whitespace-pre-wrap">{ticket.notes}</p>
                ) : (
                  <p className="text-body-sm text-muted-foreground">Không có ghi chú</p>
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
                    <CardTitle>{template.name}</CardTitle>
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
                  <div className="text-body-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
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
