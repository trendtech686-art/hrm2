'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { usePaymentStore } from './store';
import { ROUTES, generatePath } from '../../lib/router';
import { usePageHeader } from '../../contexts/page-header-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Edit, Printer } from 'lucide-react';
import { formatDateCustom } from '../../lib/date-utils';
import { asSystemId } from '../../lib/id-types';
import { ActivityHistory } from '../../components/ActivityHistory';
import { Comments } from '../../components/Comments';
import { useComments } from '@/hooks/use-comments';
import { useEmployeeFinder } from '../employees/hooks/use-all-employees';
import { usePrint } from '../../lib/use-print';
import { useStoreInfoStore } from '../settings/store-info/store-info-store';
import { 
  convertPaymentForPrint,
  mapPaymentToPrintData, 
  createStoreSettings 
} from '../../lib/print/payment-print-helper';

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

export function PaymentDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { findById } = usePaymentStore();
  const { findById: findEmployeeById } = useEmployeeFinder();
  const { print } = usePrint();
  const { info: storeInfo } = useStoreInfoStore();
  
  const payment = React.useMemo(() => 
    systemId ? findById(asSystemId(systemId)) : null, 
    [systemId, findById]
  );

  const handlePrint = React.useCallback(() => {
    if (!payment) return;
    
    const storeSettings = createStoreSettings(storeInfo);
    const forPrint = convertPaymentForPrint(payment);
    
    print('payment', { data: mapPaymentToPrintData(forPrint, storeSettings) });
  }, [payment, storeInfo, print]);

  // Get current employee for comments
  const currentEmployee = React.useMemo(() => {
    if (!payment?.createdBy) return null;
    return findEmployeeById(payment.createdBy);
  }, [payment?.createdBy, findEmployeeById]);

  // Comments from database
  const { 
    comments: dbComments, 
    addComment: dbAddComment, 
    deleteComment: dbDeleteComment 
  } = useComments('payment', systemId || '');

  const comments = React.useMemo(() => 
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
    console.warn('Update comment not yet implemented in database');
  };

  const handleDeleteComment = (commentId: string) => {
    dbDeleteComment(commentId);
  };

  const commentCurrentUser = React.useMemo(() => ({
    systemId: currentEmployee?.systemId || 'system',
    name: currentEmployee?.fullName || 'Hệ thống',
    avatar: currentEmployee?.avatar,
  }), [currentEmployee]);

  const createdByName = React.useMemo(() => {
    if (!payment) return 'Hệ thống';
    const employee = payment.createdBy ? findEmployeeById(payment.createdBy) : null;
    return employee?.fullName || payment.createdBy || 'Hệ thống';
  }, [payment, findEmployeeById]);

  const recipientLink = React.useMemo(() => {
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

  const originalDocumentLink = React.useMemo(() => {
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
  
  const headerActions = React.useMemo(() => {
    if (!payment) return [];
    const actions: React.ReactNode[] = [];

    actions.push(
      <Button
        key="print"
        variant="outline"
        size="sm"
        className="h-9"
        onClick={handlePrint}
      >
        <Printer className="mr-2 h-4 w-4" />
        In phiếu
      </Button>
    );

    if (payment.status !== 'cancelled') {
      actions.push(
        <Button
          key="edit"
          size="sm"
          className="h-9"
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
          className="h-9"
          onClick={() => {
            // TODO: Implement cancel confirmation
            console.log('Cancel payment:', payment.systemId);
          }}
        >
          Hủy phiếu chi
        </Button>
      );
    }

    return actions;
  }, [router, payment, handlePrint]);

  const detailSubtitle = React.useMemo(() => {
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
    actions: headerActions 
  });
  
  if (!payment) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground space-y-3">
          <p>Không tìm thấy phiếu chi</p>
          <Button className="h-9" onClick={() => router.push(ROUTES.FINANCE.PAYMENTS)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay về danh sách
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Thông tin phiếu chi */}
      <Card>
        <CardHeader>
          <CardTitle className="text-h6 font-semibold">Thông tin phiếu chi</CardTitle>
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
      <Card>
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
      <ActivityHistory
        history={payment.activityHistory || []}
        title="Lịch sử thao tác"
        emptyMessage="Chưa có lịch sử thao tác"
        showFilters={false}
        groupByDate
        maxHeight="400px"
      />
    </div>
  );
}

export default PaymentDetailPage;
