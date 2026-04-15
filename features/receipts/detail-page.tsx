'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useReceipt } from './hooks/use-receipts';
import { ROUTES, generatePath } from '@/lib/router';
import { usePageHeader } from '@/contexts/page-header-context';
import { useBreakpoint } from '@/contexts/breakpoint-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Printer, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDateCustom } from '@/lib/date-utils';
import { EntityActivityTable } from '@/components/shared/entity-activity-table';
import { Comments, type Comment } from '../../components/Comments';
import { useAuth } from '../../contexts/auth-context';
import { usePrint } from '../../lib/use-print';
import { fetchPrintData } from '@/lib/lazy-print-data';
import { 
  convertReceiptForPrint,
  mapReceiptToPrintData, 
  createStoreSettings 
} from '../../lib/print/receipt-print-helper';
import { useComments } from '../../hooks/use-comments';

const formatCurrency = (value?: number | string | null) => {
  const num = Number(value);
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('vi-VN').format(num);
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

interface ReceiptDetailPageProps {
  systemId: string;
}

export function ReceiptDetailPage({ systemId }: ReceiptDetailPageProps) {
  const router = useRouter();
  const { data: receipt, isLoading } = useReceipt(systemId);
  const { employee: authEmployee, can, isAdmin } = useAuth();
  const { isMobile } = useBreakpoint();
  const { print } = usePrint();

  // ⚡ OPTIMIZED: Lazy load print data only when print is clicked
  const handlePrint = React.useCallback(async () => {
    if (!receipt) return;
    
    const { storeInfo } = await fetchPrintData();
    const storeSettings = createStoreSettings(storeInfo);
    const forPrint = convertReceiptForPrint(receipt);
    
    print('receipt', { 
      data: mapReceiptToPrintData(forPrint, storeSettings),
      entityType: 'receipt',
      entityId: receipt.systemId,
    });
  }, [receipt, print]);

  const commentCurrentUser = React.useMemo(() => ({
    systemId: authEmployee?.systemId || 'system',
    name: authEmployee?.fullName || 'Hệ thống',
  }), [authEmployee]);

  const createdByName = React.useMemo(() => {
    if (!receipt) return 'Hệ thống';
    return (receipt as Record<string, unknown>).createdByName as string || receipt.createdBy || 'Hệ thống';
  }, [receipt]);

  // ✅ Sử dụng useComments hook thay vì localStorage trực tiếp
  const { 
    comments: dbComments, 
    addComment: dbAddComment, 
    deleteComment: dbDeleteComment 
  } = useComments('receipt', systemId || '');
  
  type ReceiptComment = Comment<string>;
  const comments = React.useMemo<ReceiptComment[]>(() => 
    dbComments.map(c => ({
      id: c.systemId,
      content: c.content,
      author: {
        systemId: c.createdBy || 'system',
        name: c.createdByName || 'Hệ thống',
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

    if (receipt && receipt.status !== 'cancelled' && (isAdmin || can('edit_receipts'))) {
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
  }, [router, receipt, handlePrint]);

  const mobileHeaderActions = React.useMemo(() => {
    if (!isMobile || !receipt) return [];
    const items: React.ReactNode[] = [
      <DropdownMenuItem key="print" onClick={handlePrint}>
        <Printer className="mr-2 h-4 w-4" />
        In phiếu
      </DropdownMenuItem>,
    ];
    if (receipt.status !== 'cancelled' && (isAdmin || can('edit_receipts'))) {
      items.push(
        <DropdownMenuItem key="edit" onClick={() => router.push(generatePath(ROUTES.FINANCE.RECEIPT_EDIT, { systemId: receipt.systemId }))}>
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </DropdownMenuItem>,
      );
    }
    return [
      <DropdownMenu key="mobile-actions">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">{items}</DropdownMenuContent>
      </DropdownMenu>,
    ];
  }, [isMobile, receipt, router, handlePrint, isAdmin, can]);
  
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
    actions: isMobile ? mobileHeaderActions : headerActions,
    showBackButton: true,
    backPath: ROUTES.FINANCE.RECEIPTS
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Đang tải thông tin phiếu thu...
        </CardContent>
      </Card>
    );
  }
  
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
          <CardTitle>Thông tin phiếu thu</CardTitle>
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
      <EntityActivityTable entityType="receipt" entityId={systemId} />
    </div>
  );
}
