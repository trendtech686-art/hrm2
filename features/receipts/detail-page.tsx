import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReceiptStore } from './store.ts';
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

export function ReceiptDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const { findById } = useReceiptStore();
  
  const receipt = React.useMemo(() => 
    systemId ? findById(systemId) : null, 
    [systemId, findById]
  );
  
  const headerActions = React.useMemo(() => [
    <Button 
      key="back" 
      variant="outline" 
      size="sm"
      className="h-9"
      onClick={() => navigate(ROUTES.FINANCE.RECEIPTS)}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Quay lại
    </Button>,
    receipt && receipt.status !== 'cancelled' && (
      <Button 
        key="edit" 
        size="sm"
        className="h-9"
        onClick={() => navigate(generatePath(ROUTES.FINANCE.RECEIPT_EDIT, { systemId: receipt.systemId }))}
      >
        <Edit className="mr-2 h-4 w-4" />
        Chỉnh sửa
      </Button>
    ),
    receipt && receipt.status !== 'cancelled' && (
      <Button 
        key="cancel" 
        variant="destructive"
        size="sm"
        className="h-9"
        onClick={() => {
          // TODO: Implement cancel confirmation
          console.log('Cancel receipt:', receipt.systemId);
        }}
      >
        Hủy phiếu thu
      </Button>
    )
  ].filter(Boolean), [navigate, systemId, receipt]);
  
  usePageHeader({ 
    title: receipt ? `Chi tiết Phiếu thu ${receipt.id}` : 'Chi tiết Phiếu thu',
    badge: receipt ? getStatusBadge(receipt.status) : undefined,
    breadcrumb: receipt ? [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Phiếu thu', href: '/receipts', isCurrent: false },
      { label: receipt.id, href: `/receipts/${receipt.systemId}`, isCurrent: true }
    ] : [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Phiếu thu', href: '/receipts', isCurrent: true }
    ],
    actions: headerActions 
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
          <CardTitle className="text-lg font-semibold">Thông tin phiếu thu</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Số tiền */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Số tiền</p>
            <p className="text-xl font-semibold text-green-600">{formatCurrency(receipt.amount)} ₫</p>
          </div>
          
          {/* Ngày thu */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ngày thu</p>
            <p className="font-medium">{formatDateCustom(new Date(receipt.date), 'dd/MM/yyyy')}</p>
          </div>
          
          {/* Người nộp */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Người nộp</p>
            <p className="font-medium">{receipt.payerName}</p>
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
              <p className="font-medium font-mono">{receipt.originalDocumentId}</p>
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
          <p>Người tạo: {receipt.createdBy}</p>
          <p>Ngày tạo: {formatDateCustom(new Date(receipt.createdAt), 'dd/MM/yyyy HH:mm')}</p>
          {receipt.approvedByName && (
            <p>Người duyệt: {receipt.approvedByName} - {receipt.approvedAt && formatDateCustom(new Date(receipt.approvedAt), 'dd/MM/yyyy HH:mm')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
