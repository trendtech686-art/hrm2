'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useReceiptStore } from './store';
import { ROUTES, generatePath } from '@/lib/router';
import { usePageHeader } from '@/contexts/page-header-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Printer } from 'lucide-react';
import { formatDateCustom } from '@/lib/date-utils';
import { asSystemId } from '@/lib/id-types';
import { ActivityHistory } from '../../components/ActivityHistory';
import { Comments, type Comment as CommentType } from '../../components/Comments';
import { useEmployeeStore } from '../employees/store';
import { usePrint } from '../../lib/use-print';
import { useStoreInfoStore } from '../settings/store-info/store-info-store';
import { 
  convertReceiptForPrint,
  mapReceiptToPrintData, 
  createStoreSettings 
} from '../../lib/print/receipt-print-helper';

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

export function ReceiptDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { findById } = useReceiptStore();
  const { findById: findEmployeeById } = useEmployeeStore();
  const { print } = usePrint();
  const { info: storeInfo } = useStoreInfoStore();
  
  const receiptSystemId = React.useMemo(() => (systemId ? asSystemId(systemId) : undefined), [systemId]);
  const receipt = React.useMemo(
    () => (receiptSystemId ? findById(receiptSystemId) : null),
    [receiptSystemId, findById]
  );

  const handlePrint = () => {
    if (!receipt) return;
    
    const storeSettings = createStoreSettings(storeInfo);
    const forPrint = convertReceiptForPrint(receipt);
    
    print('receipt', { data: mapReceiptToPrintData(forPrint, storeSettings) });
  };

  // Get current employee for comments
  const currentEmployee = React.useMemo(() => {
    if (!receipt?.createdBy) return null;
    return findEmployeeById(receipt.createdBy);
  }, [receipt?.createdBy, findEmployeeById]);

  // Comments state with localStorage persistence
  type ReceiptComment = CommentType<string>;
  const [comments, setComments] = React.useState<ReceiptComment[]>(() => {
    const saved = localStorage.getItem(`receipt-comments-${systemId}`);
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    if (systemId) {
      localStorage.setItem(`receipt-comments-${systemId}`, JSON.stringify(comments));
    }
  }, [comments, systemId]);

  const handleAddComment = (content: string, attachments?: string[], parentId?: string) => {
    const newComment: ReceiptComment = {
      id: `comment-${Date.now()}`,
      content,
      author: {
        systemId: currentEmployee?.systemId || 'system',
        name: currentEmployee?.fullName || 'Hệ thống',
        avatar: currentEmployee?.avatar,
      },
      createdAt: new Date().toISOString(),
      attachments,
      parentId: parentId || undefined,
    };
    setComments(prev => [...prev, newComment]);
  };

  const handleUpdateComment = (commentId: string, content: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, content, updatedAt: new Date().toISOString() } : c
    ));
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const commentCurrentUser = React.useMemo(() => ({
    systemId: currentEmployee?.systemId || 'system',
    name: currentEmployee?.fullName || 'Hệ thống',
    avatar: currentEmployee?.avatar,
  }), [currentEmployee]);

  const createdByName = React.useMemo(() => {
    if (!receipt) return 'Hệ thống';
    const employee = receipt.createdBy ? findEmployeeById(receipt.createdBy) : null;
    return employee?.fullName || receipt.createdBy || 'Hệ thống';
  }, [receipt, findEmployeeById]);

  const payerLink = React.useMemo(() => {
    if (!receipt) return null;
    const targetSystemId = receipt.customerSystemId || receipt.payerSystemId;
    if (!targetSystemId) return null;

    const mapping: Record<string, string> = {
      'Khách hàng': ROUTES.SALES.CUSTOMER_VIEW,
      'Nhà cung cấp': ROUTES.PROCUREMENT.SUPPLIER_VIEW,
      'Nhân viên': ROUTES.HRM.EMPLOYEE_VIEW,
    };
    const route = mapping[receipt.payerTypeName];
    if (!route) return null;
    return generatePath(route, { systemId: targetSystemId });
  }, [receipt]);

  const originalDocumentLink = React.useMemo(() => {
    if (!receipt?.originalDocumentId) return null;
    if (receipt.linkedOrderSystemId) {
      return generatePath(ROUTES.SALES.ORDER_VIEW, { systemId: receipt.linkedOrderSystemId });
    }
    if (receipt.linkedSalesReturnSystemId) {
      return generatePath(ROUTES.SALES.RETURN_VIEW, { systemId: receipt.linkedSalesReturnSystemId });
    }
    if (receipt.purchaseOrderSystemId) {
      return generatePath(ROUTES.PROCUREMENT.PURCHASE_ORDER_VIEW, { systemId: receipt.purchaseOrderSystemId });
    }
    if (receipt.linkedWarrantySystemId) {
      return generatePath(ROUTES.INTERNAL.WARRANTY_VIEW, { systemId: receipt.linkedWarrantySystemId });
    }
    if (receipt.linkedComplaintSystemId) {
      return generatePath(ROUTES.INTERNAL.COMPLAINT_VIEW, { systemId: receipt.linkedComplaintSystemId });
    }
    return null;
  }, [receipt]);

  const headerActions = React.useMemo(() => {
    const actions = [
      <Button
        key="back"
        variant="outline"
        size="sm"
        className="h-9"
        onClick={() => router.push(ROUTES.FINANCE.RECEIPTS)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Danh sách phiếu thu
      </Button>
    ];

    if (receipt) {
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
    }

    if (receipt && receipt.status !== 'cancelled') {
      actions.push(
        <Button
          key="edit"
          size="sm"
          className="h-9"
          onClick={() => router.push(generatePath(ROUTES.FINANCE.RECEIPT_EDIT, { systemId: receipt.systemId }))}
        >
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </Button>
      );
    }

    return actions;
  }, [router, receipt]);
  
  usePageHeader({ 
    title: receipt ? `Phiếu thu ${receipt.id}` : 'Chi tiết phiếu thu',
    badge: receipt ? getStatusBadge(receipt.status) : undefined,
    breadcrumb: receipt ? [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Phiếu thu', href: ROUTES.FINANCE.RECEIPTS, isCurrent: false },
      { label: receipt.id, href: generatePath(ROUTES.FINANCE.RECEIPT_VIEW, { systemId: receipt.systemId }), isCurrent: true }
    ] : [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Phiếu thu', href: ROUTES.FINANCE.RECEIPTS, isCurrent: true }
    ],
    actions: headerActions,
    showBackButton: true,
    backPath: ROUTES.FINANCE.RECEIPTS
  });
  
  if (!receipt) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Không tìm thấy phiếu thu
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Thông tin phiếu thu */}
      <Card>
        <CardHeader>
          <CardTitle className="text-h6 font-semibold">Thông tin phiếu thu</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Số tiền */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Số tiền</p>
            <p className="text-xl font-semibold text-emerald-600">{formatCurrency(receipt.amount)} ₫</p>
          </div>
          
          {/* Ngày thu */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ngày thu</p>
            <p className="font-medium">{formatDateCustom(new Date(receipt.date), 'dd/MM/yyyy')}</p>
          </div>
          
          {/* Người nộp */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Người nộp</p>
            {payerLink ? (
              <Link href={payerLink} className="font-medium text-primary hover:underline">
                {receipt.payerName}
              </Link>
            ) : (
              <p className="font-medium">{receipt.payerName}</p>
            )}
          </div>
          
          {/* Loại người nộp */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Loại người nộp</p>
            <p className="font-medium">{receipt.payerTypeName}</p>
          </div>
          
          {/* Hình thức thanh toán */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Hình thức thanh toán</p>
            <p className="font-medium">{receipt.paymentMethodName}</p>
          </div>
          
          {/* Loại phiếu thu */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Loại phiếu thu</p>
            <p className="font-medium">{receipt.paymentReceiptTypeName}</p>
          </div>
          
          {/* Chi nhánh */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Chi nhánh</p>
            <p className="font-medium">{receipt.branchName}</p>
          </div>
          
          {/* Chứng từ gốc */}
          {receipt.originalDocumentId && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Chứng từ gốc</p>
              {originalDocumentLink ? (
                <Link href={originalDocumentLink} className="font-medium font-mono text-primary hover:underline">
                  {receipt.originalDocumentId}
                </Link>
              ) : (
                <p className="font-medium font-mono">{receipt.originalDocumentId}</p>
              )}
            </div>
          )}
          
          {/* Diễn giải - Full width */}
          {receipt.description && (
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground mb-1">Diễn giải</p>
              <p className="font-medium">{receipt.description}</p>
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
          <p>Ngày tạo: {formatDateCustom(new Date(receipt.createdAt), 'dd/MM/yyyy HH:mm')}</p>
        </CardContent>
      </Card>
      
      {/* Comments */}
      <Comments
        entityType="receipt"
        entityId={receipt.systemId}
        comments={comments}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        currentUser={commentCurrentUser}
        title="Bình luận"
        placeholder="Thêm bình luận về phiếu thu..."
      />
      
      {/* Activity History */}
      <ActivityHistory
        history={receipt.activityHistory || []}
        title="Lịch sử thao tác"
        emptyMessage="Chưa có lịch sử thao tác"
        showFilters={false}
        groupByDate
        maxHeight="400px"
      />
    </div>
  );
}
