import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import { useLeaveStore } from './store.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { asSystemId } from '@/lib/id-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { ArrowLeft, Edit } from 'lucide-react';
import { DetailField } from '../../components/ui/detail-field.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import type { LeaveStatus } from './types.ts';

const statusVariants: Record<LeaveStatus, "success" | "warning" | "destructive"> = {
    "Chờ duyệt": "warning",
    "Đã duyệt": "success",
    "Đã từ chối": "destructive",
};

export function LeaveDetailPage() {
  const { systemId } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const { findById } = useLeaveStore();
  const request = React.useMemo(() => (systemId ? findById(asSystemId(systemId)) : null), [systemId, findById]);

  usePageHeader();

  if (!request) {
    return (
        <div className="text-center p-8">
            <h2 className="text-2xl font-bold">Không tìm thấy đơn nghỉ phép</h2>
            <Button onClick={() => navigate('/leaves')} className="mt-4"><ArrowLeft className="mr-2 h-4 w-4" />Quay về danh sách</Button>
        </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">Đơn nghỉ phép #{request.id}</CardTitle>
            <CardDescription className="mt-1">
              Nhân viên: {request.employeeName} ({request.employeeId})
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/leaves')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
            </Button>
            <Button onClick={() => navigate('/leaves')}>
              <Edit className="mr-2 h-4 w-4" /> Sửa
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
          <dl>
            <DetailField label="Ngày tạo đơn" value={formatDate(request.requestDate)} />
            <DetailField label="Loại phép" value={request.leaveTypeName} />
            <DetailField label="Thời gian nghỉ" value={`${formatDate(request.startDate)} - ${formatDate(request.endDate)}`} />
            <DetailField label="Số ngày nghỉ" value={`${request.numberOfDays} ngày`} />
            <DetailField label="Lý do" value={request.reason} />
            <DetailField label="Trạng thái">
                <Badge variant={statusVariants[request.status]}>{request.status}</Badge>
            </DetailField>
          </dl>
      </CardContent>
    </Card>
  );
}
