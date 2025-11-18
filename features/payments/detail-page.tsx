import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePaymentStore } from './store.ts';
import { ROUTES, generatePath } from '../../lib/router.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { ArrowLeft, Edit, FileText, User, Calendar, DollarSign, Building2, CreditCard } from 'lucide-react';
import { formatDateCustom } from '../../lib/date-utils.ts';

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'Chờ xử lý', variant: 'secondary' },
    pending_approval: { label: 'Chờ duyệt', variant: 'outline' },
    approved: { label: 'Đã duyệt', variant: 'default' },
    completed: { label: 'Hoàn thành', variant: 'default' },
    cancelled: { label: 'Đã hủy', variant: 'destructive' },
  };
  const config = variants[status] || { label: status, variant: 'secondary' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export function PaymentDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const { findById } = usePaymentStore();
  
  const payment = React.useMemo(() => 
    systemId ? findById(systemId) : null, 
    [systemId, findById]
  );
  
  const headerActions = React.useMemo(() => [
    <Button 
      key="back" 
      variant="outline" 
      size="sm"
      className="h-9"
      onClick={() => navigate(ROUTES.FINANCE.PAYMENTS)}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Quay lại
    </Button>,
    payment && payment.status !== 'cancelled' && (
      <Button 
        key="edit" 
        size="sm"
        className="h-9"
        onClick={() => navigate(generatePath(ROUTES.FINANCE.PAYMENT_EDIT, { systemId: payment.systemId }))}
      >
        <Edit className="mr-2 h-4 w-4" />
        Chỉnh sửa
      </Button>
    ),
    payment && payment.status !== 'cancelled' && (
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
    )
  ].filter(Boolean), [navigate, systemId, payment]);
  
  usePageHeader({ 
    title: payment ? `Chi tiết Phiếu Chi ${payment.id}` : 'Chi tiết Phiếu Chi',
    badge: payment ? getStatusBadge(payment.status) : undefined,
    breadcrumb: payment ? [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Phiếu chi', href: '/payments', isCurrent: false },
      { label: payment.id, href: `/payments/${payment.systemId}`, isCurrent: true }
    ] : [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Phiếu chi', href: '/payments', isCurrent: true }
    ],
    actions: headerActions 
  });
  
  if (!payment) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Không tìm thấy phiếu chi
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Thông tin phiếu chi */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Thông tin phiếu chi</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Số tiền */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Số tiền</p>
            <p className="text-xl font-semibold text-red-600">{formatCurrency(payment.amount)} ₫</p>
          </div>
          
          {/* Ngày chi */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ngày chi</p>
            <p className="font-medium">{formatDateCustom(new Date(payment.date), 'dd/MM/yyyy')}</p>
          </div>
          
          {/* Người nhận */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Người nhận</p>
            <p className="font-medium">{payment.recipientName}</p>
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
              <p className="font-medium font-mono">{payment.originalDocumentId}</p>
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
          <p>Người tạo: {payment.createdBy}</p>
          <p>Ngày tạo: {formatDateCustom(new Date(payment.createdAt), 'dd/MM/yyyy HH:mm')}</p>
          {payment.approvedByName && (
            <p>Người duyệt: {payment.approvedByName} - {payment.approvedAt && formatDateCustom(new Date(payment.approvedAt), 'dd/MM/yyyy HH:mm')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentDetailPage;
