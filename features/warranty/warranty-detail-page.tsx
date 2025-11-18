import * as React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Edit2, Save, X, MessageSquare, Printer, Link as LinkIcon, XCircle, Bell, Clock, AlertCircle, Copy, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { formatDateTime } from '../../lib/date-utils.ts';
import { cn } from '../../lib/utils.ts';
import { createSystemId } from '../../lib/id-config.ts';
import { useDebounce } from '../../hooks/use-debounce.ts';
import type { WarrantyTicket } from './types.ts';
import { WARRANTY_STATUS_LABELS, WARRANTY_STATUS_COLORS, SETTLEMENT_TYPE_LABELS, SETTLEMENT_STATUS_LABELS, type WarrantyHistory } from './types.ts';
import { useWarrantyStore } from './store.ts';
import { getCurrentDate, toISODateTime } from '../../lib/date-utils.ts';
import { searchOrders, type OrderSearchResult } from '../orders/order-search-api.ts';
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
import type { ComboboxOption } from '../../components/ui/virtualized-combobox.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select.tsx';

// Detail-specific components
import { WarrantyProductsDetailTable } from './components/warranty-products-detail-table.tsx';
import { WarrantySummaryDetail } from './components/warranty-summary-detail.tsx';
import { WarrantyProcessingCard } from './components/warranty-processing-card.tsx';
import { calculateWarrantyProcessingState } from './components/warranty-processing-logic.ts';
import { TicketInfoCard } from './components/detail/ticket-info-card.tsx';
import { CustomerInfoCard } from './components/detail/customer-info-card.tsx';
import { WarrantyWorkflowCard } from './components/detail/workflow-card.tsx';
import { WarrantyImageGalleryCard } from './components/detail/image-gallery-card.tsx';
import { getWorkflowTemplate } from '../settings/templates/workflow-templates-page.tsx';
import {
  CancelWarrantyDialog,
  CreatePaymentVoucherDialog,
  CreateReceiptVoucherDialog,
  ReopenFromCancelledDialog,
  ReopenFromReturnedDialog,
  ReturnMethodDialog,
  WarrantyReminderDialog,
} from './components/dialogs/index.ts';
import { useWarrantyReminders } from './hooks/use-warranty-reminders.ts';
import { useWarrantyTimeTracking } from './hooks/use-warranty-time-tracking.ts';
import { checkWarrantyOverdue, formatTimeLeft } from './warranty-sla-utils.ts';

// Section components
import { WarrantyCommentsSection, WarrantyHistorySection } from './components/sections/index.ts';

import { useOrderStore } from '../orders/store.ts';
import { usePaymentStore } from '../payments/store.ts';
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

  const currentUser = React.useMemo(() => ({
    name: employee?.fullName || user?.name || 'Hệ thống',
    systemId: employee?.systemId || user?.employeeId || 'SYSTEM',
  }), [employee?.fullName, employee?.systemId, user?.name, user?.employeeId]);

  const tickets = useWarrantyStore((state) => state.data);
  const update = useWarrantyStore((state) => state.update);
  const updateStatus = useWarrantyStore((state) => state.updateStatus);
  const addHistory = useWarrantyStore((state) => state.addHistory);

  const ticket = React.useMemo<WarrantyTicket | null>(() => {
    return tickets.find((item) => item.systemId === systemId) || null;
  }, [tickets, systemId]);

  const { data: orders } = useOrderStore();

  const [showReturnDialog, setShowReturnDialog] = React.useState(false);
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const [showReopenDialog, setShowReopenDialog] = React.useState(false);
  const [showReopenReturnedDialog, setShowReopenReturnedDialog] = React.useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = React.useState(false);
  const [isCompletingTicket, setIsCompletingTicket] = React.useState(false);
  const [returnMethod, setReturnMethod] = React.useState<'direct' | 'order' | null>(null);
  const [selectedOrderId, setSelectedOrderId] = React.useState('');
  const [orderSearchQuery, setOrderSearchQuery] = React.useState('');
  const [orderSearchResults, setOrderSearchResults] = React.useState<OrderSearchResult[]>([]);
  const [isSearchingOrders, setIsSearchingOrders] = React.useState(false);
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  const [showImagePreview, setShowImagePreview] = React.useState(false);

  const debouncedOrderQuery = useDebounce(orderSearchQuery, 400);

  const linkedOrder = React.useMemo(() => {
    if (!ticket?.linkedOrderSystemId) return undefined;
    return orders.find((order) => order.systemId === ticket.linkedOrderSystemId);
  }, [orders, ticket?.linkedOrderSystemId]);

  const publicTrackingUrl = React.useMemo(() => {
    if (!ticket) return '';
    const code = ticket.publicTrackingCode || ticket.systemId || ticket.id;
    return `${window.location.origin}/warranty/tracking/${code}`;
  }, [ticket?.publicTrackingCode, ticket?.systemId, ticket?.id]);

  const selectedOrderValue = React.useMemo<ComboboxOption | null>(() => {
    if (!selectedOrderId) return null;
    const option = orderSearchResults.find((item) => item.value === selectedOrderId);
    if (option) return option;
    if (linkedOrder && linkedOrder.systemId === selectedOrderId) {
      return {
        value: linkedOrder.systemId,
        label: `${linkedOrder.id} - ${linkedOrder.customerName}`,
        subtitle: `${(linkedOrder.grandTotal || 0).toLocaleString('vi-VN')} đ`,
      };
    }
    return null;
  }, [linkedOrder, orderSearchResults, selectedOrderId]);

  const totalOrderCount = orders.length;

  const currentReturnMethodLabel = React.useMemo(() => {
    if (!ticket) return null;
    if (ticket.linkedOrderSystemId) {
      return `Giao qua đơn hàng (${linkedOrder?.id || 'N/A'})`;
    }
    if (ticket.status === 'returned') {
      return 'Khách lấy trực tiếp tại cửa hàng';
    }
    return null;
  }, [linkedOrder?.id, ticket]);

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

  const handleReturnDialogReset = React.useCallback(() => {
    setSelectedOrderId('');
    setOrderSearchQuery('');
    setReturnMethod(null);
  }, []);

  const openReturnDialog = React.useCallback(() => {
    if (ticket?.linkedOrderSystemId) {
      setReturnMethod('order');
      setSelectedOrderId(ticket.linkedOrderSystemId);
    } else {
      setReturnMethod('direct');
      setSelectedOrderId('');
    }
    setOrderSearchQuery('');
    setShowReturnDialog(true);
  }, [ticket?.linkedOrderSystemId]);

  React.useEffect(() => {
    let isCancelled = false;

    async function fetchOrders() {
      setIsSearchingOrders(true);
      try {
        const results = await searchOrders(
          { query: debouncedOrderQuery || '', limit: 50, branchSystemId: ticket?.branchSystemId },
          orders
        );
        if (!isCancelled) {
          setOrderSearchResults(results);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Failed to search orders', error);
          toast.error('Không thể tìm đơn hàng, vui lòng thử lại');
        }
      } finally {
        if (!isCancelled) {
          setIsSearchingOrders(false);
        }
      }
    }

    fetchOrders();
    return () => {
      isCancelled = true;
    };
  }, [debouncedOrderQuery, orders, ticket?.branchSystemId]);

  const responseTemplates = React.useMemo(() => RESPONSE_TEMPLATES, []);
  const isReturned = ticket?.status === 'returned';

  const handleReturnDirect = React.useCallback(() => {
    if (!ticket) return;

    try {
      // If already returned, just update the method (remove order link)
      if (ticket.status === 'returned') {
        update(ticket.systemId, {
          linkedOrderSystemId: undefined, // Remove order link
        });
        
        addHistory(ticket.systemId, 'Đổi phương thức trả hàng: Giao qua đơn hàng → Khách lấy trực tiếp', currentUser.name);

        toast.success('Đã cập nhật phương thức trả hàng', {
          description: 'Đổi sang: Khách lấy trực tiếp tại cửa hàng.',
          duration: 5000,
        });
      } else {
        // First time marking as returned
        updateStatus(ticket.systemId, 'returned', 'Khách lấy trực tiếp tại cửa hàng');
        
        update(ticket.systemId, {
          returnedAt: toISODateTime(getCurrentDate()),
        });

        toast.success('Đã trả hàng cho khách', {
          description: 'Khách đã lấy hàng trực tiếp tại cửa hàng.',
          duration: 5000,
        });
      }
      
      handleReturnDialogReset();
      setShowReturnDialog(false);
    } catch (error) {
      console.error('Failed to mark as returned:', error);
      toast.error('Không thể cập nhật');
    }
  }, [ticket, update, updateStatus, addHistory, currentUser.name, handleReturnDialogReset]);

  const handleReturnWithOrder = React.useCallback(async () => {
    if (!ticket || !selectedOrderId) {
      toast.error('Vui lòng chọn đơn hàng');
      return;
    }

    // Get selected order
    const selectedOrder = orders.find(o => o.systemId === selectedOrderId);
    
    if (!selectedOrder) {
      toast.error('Không tìm thấy đơn hàng');
      return;
    }

    // Check if order is already linked to another warranty (dùng systemId)
    if ((selectedOrder as any).linkedWarrantySystemId && (selectedOrder as any).linkedWarrantySystemId !== ticket.systemId) {
      toast.error('Đơn hàng này đã được liên kết với phiếu bảo hành khác', {
        description: 'Vui lòng chọn đơn hàng khác',
        duration: 5000,
      });
      return;
    }

    try {
      // If already returned, just update the order link
      if (ticket.status === 'returned') {
        update(ticket.systemId, {
          linkedOrderSystemId: selectedOrder.systemId,
        });
        
        const oldMethod = ticket.linkedOrderSystemId 
          ? `đơn hàng ${linkedOrder?.id || 'N/A'}`
          : 'Khách lấy trực tiếp';
        
        addHistory(ticket.systemId, `Đổi phương thức trả hàng: ${oldMethod} → Giao qua đơn hàng ${selectedOrder.id}`, currentUser.name);

        toast.success('Đã cập nhật phương thức trả hàng', {
          description: `Đổi sang: Giao qua đơn hàng ${selectedOrder.id}.`,
          duration: 5000,
        });
      } else {
        // First time marking as returned with order link
        updateStatus(ticket.systemId, 'returned', `Liên kết với đơn hàng ${selectedOrder.id}`);
        
        update(ticket.systemId, {
          linkedOrderSystemId: selectedOrder.systemId,
          returnedAt: toISODateTime(getCurrentDate()),
        });

        toast.success('Đã trả hàng cho khách', {
          description: `Đã liên kết với đơn hàng ${selectedOrder.id}.`,
          duration: 5000,
        });
      }
      
      // Close dialog after successful link
      handleReturnDialogReset();
      setShowReturnDialog(false);
    } catch (error) {
      console.error('Failed to link order:', error);
      toast.error('Không thể cập nhật');
    }
  }, [ticket, selectedOrderId, update, updateStatus, orders, addHistory, currentUser.name, handleReturnDialogReset]);

  const handleStatusChange = React.useCallback(async (newStatus: WarrantyTicket['status']) => {
    if (!ticket) return;

    if (newStatus === 'processed') {
      if (!ticket.processedImages || ticket.processedImages.length === 0) {
        toast.error('Chưa đầy đủ thông tin', {
          description: 'Vui lòng upload hình ảnh đã xử lý trước khi đánh dấu "Đã xử lý"',
          duration: 5000,
        });
        return;
      }

      if (!ticket.products || ticket.products.length === 0) {
        toast.error('Chưa đầy đủ thông tin', {
          description: 'Vui lòng thêm sản phẩm vào danh sách bảo hành trước khi đánh dấu "Đã xử lý"',
          duration: 5000,
        });
        return;
      }

      const incompleteProducts = ticket.products.filter((product) =>
        !product.productName || !product.issueDescription || !product.resolution
      );

      if (incompleteProducts.length > 0) {
        toast.error('Chưa đầy đủ thông tin sản phẩm', {
          description: `Có ${incompleteProducts.length} sản phẩm chưa đầy đủ thông tin (tên, tình trạng, cách xử lý)`,
          duration: 5000,
        });
        return;
      }
    }

    try {
      updateStatus(ticket.systemId, newStatus, '');

      const now = toISODateTime(getCurrentDate());
      const updates: Partial<WarrantyTicket> = {};

      if (newStatus === 'pending' && !ticket.processingStartedAt) {
        updates.processingStartedAt = now;
      } else if (newStatus === 'processed' && !ticket.processedAt) {
        updates.processedAt = now;
      } else if (newStatus === 'returned' && !ticket.returnedAt) {
        updates.returnedAt = now;
      }

      if (newStatus === 'incomplete') {
        updates.processingStartedAt = undefined;
        updates.processedAt = undefined;
        updates.returnedAt = undefined;
      } else if (newStatus === 'pending') {
        updates.processedAt = undefined;
        updates.returnedAt = undefined;
      } else if (newStatus === 'processed') {
        updates.returnedAt = undefined;
      }

      if (Object.keys(updates).length > 0) {
        update(ticket.systemId, updates);
      }

      toast.success('Đã cập nhật trạng thái');
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  }, [ticket, update, updateStatus]);

  // Removed handleCancelTicket, handleReopenTicket - now in dialog components

  const handleCompleteTicket = React.useCallback(() => {
    // Prevent double submission
    if (isCompletingTicket) {
      console.log('⚠️ [COMPLETE TICKET] Already processing, ignoring duplicate call');
      return;
    }
    
    console.log('🔥 [COMPLETE TICKET] Called');
    
    if (!ticket) return;

    // Validation 1: Only allow completion if status is 'returned'
    if (ticket.status !== 'returned') {
      console.log('❌ [COMPLETE TICKET] Not returned status');
      toast.error('Chỉ có thể kết thúc phiếu đã trả hàng');
      return;
    }

    // Validation 2: Check payment completion using calculateWarrantyProcessingState
    // Tính totalPayment từ ticket
    const totalPayment = ticket.products.reduce((sum, p) => {
      if (p.resolution === 'out_of_stock') {
        return sum + ((p.quantity || 0) * (p.unitPrice || 0));
      }
      return sum;
    }, 0) + (ticket.shippingFee || 0);

    // Nếu có tiền phải trả (totalPayment > 0), kiểm tra đã thanh toán hết chưa
    if (totalPayment > 0) {
      // ⚠️ Lấy dữ liệu mới nhất trực tiếp từ store để tránh tình trạng phải F5
      const latestPayments = usePaymentStore.getState().data;
      const latestReceipts = useReceiptStore.getState().data;
      const state = calculateWarrantyProcessingState(ticket, latestPayments, latestReceipts, totalPayment);
      
      console.log('💰 [COMPLETE TICKET] Payment check:', {
        totalPayment,
        remainingAmount: state.remainingAmount,
        paymentsCount: state.warrantyPayments.length,
        receiptsCount: state.warrantyReceipts.length
      });
      
      if (state.remainingAmount > 0) {
        console.log('❌ [COMPLETE TICKET] Payment incomplete, showing toast');
        toast.error(`Chưa thanh toán đủ cho khách. Còn thiếu: ${state.remainingAmount.toLocaleString('vi-VN')} đ`, {
          duration: 5000,
        });
        return;
      }
    }

    try {
      setIsCompletingTicket(true);
      console.log('[COMPLETE TICKET] Completing ticket');
      updateStatus(ticket.systemId, 'completed', 'Kết thúc phiếu bảo hành');
      toast.success('Đã kết thúc phiếu bảo hành', {
        description: 'Phiếu đã được hoàn tất và lưu trữ',
      });
    } catch (error) {
      console.error('Failed to complete ticket:', error);
      toast.error('Không thể kết thúc phiếu');
    } finally {
      // Reset flag after a short delay to allow for UI update
      setTimeout(() => setIsCompletingTicket(false), 1000);
    }
  }, [ticket, updateStatus, isCompletingTicket]);

  // Removed handleReopenFromReturned - now in dialog component

  const handleImagePreview = React.useCallback((images: string[], index: number) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setShowImagePreview(true);
  }, []);

  const handleCopyTrackingLink = React.useCallback(() => {
    if (!ticket || !ticket.publicTrackingCode || !publicTrackingUrl) {
      toast.error('Chưa có mã tra cứu');
      return;
    }

    navigator.clipboard.writeText(publicTrackingUrl);
    toast.success(
      <div className="flex flex-col gap-1">
        <div className="font-semibold">Đã copy link tracking</div>
        <div className="text-sm text-muted-foreground">Mã: {ticket.publicTrackingCode}</div>
      </div>,
      { duration: 5000 }
    );

    addHistory(
      ticket.systemId,
      'Copy link tracking công khai',
      currentUser.name,
      `Mã: ${ticket.publicTrackingCode}`
    );
  }, [ticket, publicTrackingUrl, addHistory, currentUser.name]);

  const handleGenerateTrackingCode = React.useCallback(() => {
    if (!ticket) return;

    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 10; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    update(ticket.systemId, { publicTrackingCode: code });
    addHistory(ticket.systemId, '🔗 Tạo mã tra cứu công khai', currentUser.name, `Mã: ${code}`);
    toast.success('Đã tạo mã tra cứu', {
      description: `Mã: ${code}`,
      duration: 3000,
    });
  }, [ticket, update, addHistory, currentUser.name]);

  const handleNavigateEmployee = React.useCallback(() => {
    if (!ticket?.employeeSystemId) return;
    navigate(`/employees/${ticket.employeeSystemId}`);
  }, [navigate, ticket?.employeeSystemId]);

  const handleNavigateOrder = React.useCallback(() => {
    if (!linkedOrder) return;
    navigate(`/orders/${linkedOrder.systemId}`);
  }, [linkedOrder, navigate]);

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
                <WarrantySummaryDetail 
                  products={ticket.products} 
                  shippingFee={ticket.shippingFee || 0}
                  ticketStatus={ticket.status}
                  warrantyId={ticket.id}
                  warrantySystemId={ticket.systemId}
                  customer={{
                    name: ticket.customerName,
                    phone: ticket.customerPhone,
                  }}
                />

                {/* Xử lý bảo hành - Nút tạo phiếu chi/thu */}
                <WarrantyProcessingCard
                  warrantyId={ticket.id}
                  warrantySystemId={ticket.systemId}
                  ticketStatus={ticket.status}
                  customer={{
                    name: ticket.customerName,
                    phone: ticket.customerPhone,
                  }}
                  totalPayment={(() => {
                    // Tính toán totalPayment giống WarrantySummaryDetail
                    const outOfStockValue = ticket.products.reduce((sum, p) => {
                      if (p.resolution === 'out_of_stock') {
                        return sum + ((p.quantity || 0) * (p.unitPrice || 0));
                      }
                      return sum;
                    }, 0);
                    return outOfStockValue + (ticket.shippingFee || 0);
                  })()}
                  linkedOrderSystemId={ticket.linkedOrderSystemId}
                  branchSystemId={ticket.branchSystemId}
                  branchName={ticket.branchName}
                  ticket={ticket}
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

        <ReturnMethodDialog
          open={showReturnDialog}
          ticket={ticket}
          currentMethodLabel={currentReturnMethodLabel}
          returnMethod={returnMethod}
          onReturnMethodChange={setReturnMethod}
          selectedOrderValue={selectedOrderValue}
          onOrderSelect={(option) => setSelectedOrderId(option?.value || '')}
          orderSearchResults={orderSearchResults}
          orderSearchQuery={orderSearchQuery}
          onOrderSearchChange={setOrderSearchQuery}
          isSearchingOrders={isSearchingOrders}
          totalOrderCount={totalOrderCount}
          onConfirmDirect={handleReturnDirect}
          onConfirmWithOrder={handleReturnWithOrder}
          onOpenChange={setShowReturnDialog}
          onReset={handleReturnDialogReset}
        />

      {/* Cancel Dialog */}
      <CancelWarrantyDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        ticket={ticket}
      />

      {/* Reopen Dialog (from cancelled) */}
      <ReopenFromCancelledDialog
        open={showReopenDialog}
        onOpenChange={setShowReopenDialog}
        ticket={ticket}
      />

      {/* Reopen Dialog (from returned/completed) */}
      <ReopenFromReturnedDialog
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
