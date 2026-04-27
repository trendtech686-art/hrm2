'use client'

import { useState, useMemo, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePayment } from './hooks/use-payments';
import { ROUTES, generatePath } from '../../lib/router';
import { usePageHeader } from '../../contexts/page-header-context';
import { useBreakpoint } from '../../contexts/breakpoint-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { ArrowLeft, Edit, Printer, Loader2, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { formatDateCustom } from '../../lib/date-utils';
import { EntityActivityTable } from '@/components/shared/entity-activity-table';
import { DetailPageShell, mobileBleedCardClass } from '@/components/layout/page-section';
import { Comments } from '../../components/Comments';
import { useComments } from '@/hooks/use-comments';
import { useAuth } from '../../contexts/auth-context';
import { usePrint } from '../../lib/use-print';
import { fetchPrintData } from '@/lib/lazy-print-data';
import { 
  convertPaymentForPrint,
  mapPaymentToPrintData, 
  createStoreSettings 
} from '../../lib/print/payment-print-helper';
import type { Payment } from '@/lib/types/prisma-extended';
import { usePaymentMutations } from './hooks/use-payments';

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};

const getStatusBadge = (status?: string) => {
  const normalized = status === 'cancelled' ? 'cancelled' : 'completed';
  const variants: Record<'completed' | 'cancelled', { label: string; variant: 'default' | 'destructive' }> = {
    completed: { label: 'Hoàn thành', variant: 'default' },
    cancelled: { label: 'Đã hủy', variant: 'destructive' },
  };
  const config = variants[normalized];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

interface PaymentDetailPageProps {
  systemId: string;
}

export function PaymentDetailPage({ systemId }: PaymentDetailPageProps) {
  const router = useRouter();
  const { data: paymentData, isLoading } = usePayment(systemId);
  const { employee: authEmployee, can, isAdmin } = useAuth();
  const { isMobile } = useBreakpoint();
  const { print } = usePrint();
  const { cancel } = usePaymentMutations({
    onCancelSuccess: () => toast.success("Đã hủy phiếu chi"),
    onError: (error) => toast.error("Có lỗi khi hủy phiếu chi: " + error.message),
  });
  
  // Cancel confirmation dialog state
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  
  // Extract payment from API response (handles both wrapped and unwrapped)
  const payment = useMemo(() => {
    if (!paymentData) return null;
    // Handle wrapped response { data: payment } or direct payment
    type WrappedPayment = { data: Payment };
    const raw = (paymentData as unknown as WrappedPayment).data || paymentData;
    return raw as Payment & { auditLogs?: Array<{ id?: number; entityId?: string; action: string; timestamp: string; userId?: string; changes?: Record<string, unknown> }> };
  }, [paymentData]);

  // ⚡ OPTIMIZED: Lazy load print data only when print is clicked
  const handlePrint = useCallback(async () => {
    if (!payment) return;
    
    const { storeInfo } = await fetchPrintData();
    const storeSettings = createStoreSettings(storeInfo);
    const forPrint = convertPaymentForPrint(payment);
    
    print('payment', { 
      data: mapPaymentToPrintData(forPrint, storeSettings),
      entityType: 'payment',
      entityId: payment.systemId,
    });
  }, [payment, print]);

  const commentCurrentUser = useMemo(() => ({
    systemId: authEmployee?.systemId || 'system',
    name: authEmployee?.fullName || 'Hệ thống',
  }), [authEmployee]);

  const createdByName = useMemo(() => {
    if (!payment) return 'Hệ thống';
    return (payment as Record<string, unknown>).createdByName as string || payment.createdBy || 'Hệ thống';
  }, [payment]);

  // Comments from database
  const { 
    comments: dbComments, 
    addComment: dbAddComment, 
    deleteComment: dbDeleteComment 
  } = useComments('payment', systemId || '');

  const comments = useMemo(() => 
    dbComments.map(c => ({
      id: c.systemId,
      content: c.content,
      author: {
        systemId: c.createdBy || 'system',
        name: c.createdByName || 'Hệ thống',
        avatar: undefined,
      },
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      attachments: c.attachments,
    })), 
    [dbComments]
  );

  const handleAddComment = (content: string, attachments?: string[], _parentId?: string) => {
    dbAddComment(content, attachments || []);
  };

  const handleUpdateComment = (_commentId: string, _content: string) => {
  };

  const handleDeleteComment = (commentId: string) => {
    dbDeleteComment(commentId);
  };

  const recipientLink = useMemo(() => {
    if (!payment) return null;
    const targetSystemId = payment.customerSystemId || payment.recipientSystemId;
    if (!targetSystemId) return null;

    const mapping: Record<string, string> = {
      'Khách hàng': ROUTES.SALES.CUSTOMER_VIEW,
      'Nhà cung cấp': ROUTES.PROCUREMENT.SUPPLIER_VIEW,
      'Nhân viên': ROUTES.HRM.EMPLOYEE_VIEW,
    };
    const route = mapping[payment.recipientTypeName];
    if (!route) return null;
    return generatePath(route, { systemId: targetSystemId });
  }, [payment]);

  const originalDocumentLink = useMemo(() => {
    if (!payment?.originalDocumentId) return null;
    if (payment.linkedOrderSystemId) {
      return generatePath(ROUTES.SALES.ORDER_VIEW, { systemId: payment.linkedOrderSystemId });
    }
    if (payment.linkedSalesReturnSystemId) {
      return generatePath(ROUTES.SALES.RETURN_VIEW, { systemId: payment.linkedSalesReturnSystemId });
    }
    if (payment.purchaseOrderSystemId) {
      return generatePath(ROUTES.PROCUREMENT.PURCHASE_ORDER_VIEW, { systemId: payment.purchaseOrderSystemId });
    }
    if (payment.linkedWarrantySystemId) {
      return generatePath(ROUTES.INTERNAL.WARRANTY_VIEW, { systemId: payment.linkedWarrantySystemId });
    }
    if (payment.linkedComplaintSystemId) {
      return generatePath(ROUTES.INTERNAL.COMPLAINT_VIEW, { systemId: payment.linkedComplaintSystemId });
    }
    return null;
  }, [payment]);
  
  const headerActions = useMemo(() => {
    if (!payment) return null;
    const actions: React.ReactNode[] = [];

    actions.push(
      <Button
        key="print"
        variant="outline"
        size="sm"
        onClick={handlePrint}
      >
        <Printer className="mr-2 h-4 w-4" />
        In phiếu
      </Button>
    );

    if (payment.status !== 'cancelled' && (isAdmin || can('edit_payments'))) {
      actions.push(
        <Button
          key="edit"
          size="sm"
          onClick={() => router.push(generatePath(ROUTES.FINANCE.PAYMENT_EDIT, { systemId: payment.systemId }))}
        >
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </Button>
      );
      actions.push(
        <Button
          key="cancel"
          variant="destructive"
          size="sm"
          onClick={() => setIsCancelDialogOpen(true)}
        >
          Hủy phiếu chi
        </Button>
      );
    }

    return actions;
  }, [router, payment, handlePrint, isAdmin, can]);

  const mobileHeaderActions = useMemo(() => {
    if (!payment || !isMobile) return [];
    const items: ReactNode[] = [
      <DropdownMenuItem key="print" onClick={handlePrint}>
        <Printer className="mr-2 h-4 w-4" />
        In phiếu
      </DropdownMenuItem>,
    ];
    if (payment.status !== 'cancelled' && (isAdmin || can('edit_payments'))) {
      items.push(
        <DropdownMenuItem key="edit" onClick={() => router.push(generatePath(ROUTES.FINANCE.PAYMENT_EDIT, { systemId: payment.systemId }))}>
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </DropdownMenuItem>,
        <DropdownMenuItem key="cancel" className="text-destructive focus:text-destructive" onClick={() => setIsCancelDialogOpen(true)}>
          Hủy phiếu chi
        </DropdownMenuItem>,
      );
    }
    return [
      <DropdownMenu key="mobile-actions">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">{items}</DropdownMenuContent>
      </DropdownMenu>,
    ];
  }, [payment, isMobile, router, handlePrint, isAdmin, can, setIsCancelDialogOpen]);

  const detailSubtitle = useMemo(() => {
    if (!payment) return 'Đang tải thông tin phiếu chi';
    const parts = [payment.recipientName, payment.branchName].filter(Boolean);
    return parts.join(' • ') || 'Phiếu chi nội bộ';
  }, [payment]);
  
  usePageHeader({ 
    title: payment ? `Phiếu chi ${payment.id}` : 'Phiếu chi',
    subtitle: detailSubtitle,
    badge: payment ? getStatusBadge(payment.status) : undefined,
    breadcrumb: payment ? [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Phiếu chi', href: '/payments', isCurrent: false },
      { label: payment.id, href: `/payments/${payment.systemId}`, isCurrent: true }
    ] : [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Phiếu chi', href: '/payments', isCurrent: true }
    ],
    showBackButton: true,
    backPath: ROUTES.FINANCE.PAYMENTS,
    actions: isMobile ? mobileHeaderActions : headerActions 
  });

  // Loading state
  if (isLoading) {
    return (
      <Card className={mobileBleedCardClass}>
        <CardContent className="p-8 text-center text-muted-foreground space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p>Đang tải thông tin phiếu chi...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!payment) {
    return (
      <Card className={mobileBleedCardClass}>
        <CardContent className="p-8 text-center text-muted-foreground space-y-3">
          <p>Không tìm thấy phiếu chi</p>
          <Button onClick={() => router.push(ROUTES.FINANCE.PAYMENTS)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay về danh sách
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <DetailPageShell gap="lg">
      {/* Thông tin phiếu chi */}
      <Card className={mobileBleedCardClass}>
        <CardHeader>
          <CardTitle>Thông tin phiếu chi</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Số tiền */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Số tiền</p>
            <p className="text-xl font-semibold text-destructive">{formatCurrency(payment.amount)} đ</p>
          </div>
          
          {/* Ngày chi */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ngày chi</p>
            <p className="font-medium">{formatDateCustom(new Date(payment.date), 'dd/MM/yyyy')}</p>
          </div>
          
          {/* Người nhận */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Người nhận</p>
            {recipientLink ? (
              <Link href={recipientLink} className="font-medium text-primary hover:underline">
                {payment.recipientName}
              </Link>
            ) : (
              <p className="font-medium">{payment.recipientName}</p>
            )}
          </div>
          
          {/* Loại người nhận */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Loại người nhận</p>
            <p className="font-medium">{payment.recipientTypeName}</p>
          </div>
          
          {/* Hình thức thanh toán */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Hình thức thanh toán</p>
            <p className="font-medium">{payment.paymentMethodName}</p>
          </div>
          
          {/* Loại phiếu chi */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Loại phiếu chi</p>
            <p className="font-medium">{payment.paymentReceiptTypeName}</p>
          </div>
          
          {/* Chi nhánh */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Chi nhánh</p>
            <p className="font-medium">{payment.branchName}</p>
          </div>
          
          {/* Chứng từ gốc */}
          {payment.originalDocumentId && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Chứng từ gốc</p>
              {originalDocumentLink ? (
                <Link href={originalDocumentLink} className="font-medium font-mono text-primary hover:underline">
                  {payment.originalDocumentId}
                </Link>
              ) : (
                <p className="font-medium font-mono">{payment.originalDocumentId}</p>
              )}
            </div>
          )}
          
          {/* Diễn giải - Full width */}
          {payment.description && (
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground mb-1">Diễn giải</p>
              <p className="font-medium">{payment.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* System Info */}
      <Card className={mobileBleedCardClass}>
        <CardContent className="pt-6 space-y-2 text-sm text-muted-foreground">
          <p>
            Người tạo:{' '}
            <span className="text-foreground font-medium">{createdByName}</span>
          </p>
          <p>Ngày tạo: {formatDateCustom(new Date(payment.createdAt), 'dd/MM/yyyy HH:mm')}</p>
        </CardContent>
      </Card>
      
      {/* Comments */}
      <Comments
        entityType="payment"
        entityId={payment.systemId}
        comments={comments}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        currentUser={commentCurrentUser}
        title="Bình luận"
        placeholder="Thêm bình luận về phiếu chi..."
      />
      
      {/* Activity History */}
      <EntityActivityTable entityType="payment" entityId={systemId} />

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy phiếu chi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy phiếu chi này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsCancelDialogOpen(false)}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (payment) {
                  cancel.mutate({ systemId: payment.systemId }, {
                    onSuccess: () => {
                      setIsCancelDialogOpen(false);
                      router.refresh();
                    },
                  });
                }
              }}
            >
              Xác nhận hủy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DetailPageShell>
  );
}

export default PaymentDetailPage;
