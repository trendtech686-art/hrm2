import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import { usePenaltyStore } from './store.ts';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { ArrowLeft, Edit } from 'lucide-react';
import { DetailField } from '../../../components/ui/detail-field.tsx';
import { Badge } from '../../../components/ui/badge.tsx';
import type { PenaltyStatus } from './types.ts';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
const statusVariants: Record<PenaltyStatus, "warning" | "success" | "secondary"> = {
    "Chưa thanh toán": "warning", "Đã thanh toán": "success", "Đã hủy": "secondary",
};

export function PenaltyDetailPage() {
  const { systemId } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const { findById } = usePenaltyStore();
  const penalty = React.useMemo(() => (systemId ? findById(systemId as any) : null), [systemId, findById]);

  // Header actions
  const headerActions = React.useMemo(() => [
    <Button 
      key="back" 
      variant="outline" 
      size="sm"
      className="h-9"
      onClick={() => navigate('/penalties')}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Quay lại
    </Button>,
    <Button 
      key="edit" 
      size="sm"
      className="h-9"
      onClick={() => navigate(`/penalties/${systemId}/edit`)}
    >
      <Edit className="mr-2 h-4 w-4" />
      Chỉnh sửa
    </Button>
  ], [navigate, systemId]);

  // Page header with auto-generated title from breadcrumb-system.ts
  usePageHeader({
    badge: penalty ? <Badge variant={statusVariants[penalty.status]}>{penalty.status}</Badge> : undefined,
    actions: headerActions,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Phiếu phạt', href: '/penalties', isCurrent: false },
      { label: penalty?.id || 'Chi tiết', href: '', isCurrent: true }
    ]
  });

  if (!penalty) {
    return (
        <div className="text-center p-8">
            <h2 className="text-2xl font-bold">Không tìm thấy phiếu phạt</h2>
            <Button onClick={() => navigate('/penalties')} className="mt-4"><ArrowLeft className="mr-2 h-4 w-4" />Quay về danh sách</Button>
        </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Thông tin phiếu phạt</CardTitle>
        <CardDescription className="mt-1">
          Lập ngày: {formatDate(penalty.issueDate)}
        </CardDescription>
      </CardHeader>
      <CardContent>
          <dl>
            <DetailField label="Nhân viên" value={penalty.employeeName} />
            <DetailField label="Người lập phiếu" value={penalty.issuerName} />
            <DetailField label="Số tiền phạt" value={<span className="font-semibold text-destructive">{formatCurrency(penalty.amount)}</span>} />
            <DetailField label="Trạng thái"><Badge variant={statusVariants[penalty.status]}>{penalty.status}</Badge></DetailField>
            <DetailField label="Lý do" value={penalty.reason} />
          </dl>
      </CardContent>
    </Card>
  );
}
