import * as React from 'react';
import { Clock, AlertCircle, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StatusBadge, COMPLAINT_STATUS_MAP } from '@/components/StatusBadge';
import { MobileCard, MobileCardBody, MobileCardHeader } from '@/components/mobile/mobile-card';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/date-utils';
import { Complaint, complaintStatusLabels as _complaintStatusLabels, complaintTypeLabels, complaintTypeColors } from '../types';
import { checkOverdue } from '../sla-utils';

interface ComplaintCardProps {
  complaint: Complaint;
  onClick: () => void;
  employees: Array<{ systemId: string; fullName: string }>;
}

export function ComplaintCard({ complaint, onClick, employees }: ComplaintCardProps) {
  const overdueStatus = checkOverdue(complaint);
  const isOverdue = overdueStatus.isOverdueResponse || overdueStatus.isOverdueResolve;
  
  const statusConfig: Record<string, { icon: typeof Clock; color: string }> = {
    pending: { icon: Clock, color: 'text-yellow-600' },
    investigating: { icon: AlertCircle, color: 'text-blue-600' },
    resolved: { icon: CheckCircle2, color: 'text-green-600' },
    rejected: { icon: XCircle, color: 'text-gray-600' },
    cancelled: { icon: XCircle, color: 'text-red-600' },
    ended: { icon: CheckCircle2, color: 'text-purple-600' },
  };
  
  const _StatusIcon = (statusConfig[complaint.status] ?? statusConfig.pending).icon;
  
  const priorityConfig: Record<string, { label: string; color: string }> = {
    low: { label: 'Thấp', color: 'bg-slate-100 text-slate-800' },
    medium: { label: 'Trung bình', color: 'bg-amber-100 text-amber-800' },
    high: { label: 'Cao', color: 'bg-orange-100 text-orange-800' },
    urgent: { label: 'Khẩn cấp', color: 'bg-red-100 text-red-800' },
    LOW: { label: 'Thấp', color: 'bg-slate-100 text-slate-800' },
    MEDIUM: { label: 'Trung bình', color: 'bg-amber-100 text-amber-800' },
    HIGH: { label: 'Cao', color: 'bg-orange-100 text-orange-800' },
    CRITICAL: { label: 'Khẩn cấp', color: 'bg-red-100 text-red-800' },
  };
  
  const assignedEmployee = complaint.assignedTo 
    ? employees.find(e => e.systemId === complaint.assignedTo)
    : null;

  const priority = priorityConfig[complaint.priority] ?? priorityConfig.LOW;
  return (
    <MobileCard
      onClick={onClick}
      className={cn(
        "border-l-4",
        isOverdue && "border-l-red-500 bg-red-50",
        !isOverdue && complaint.priority === 'CRITICAL' && "border-l-red-400 bg-red-50",
        !isOverdue && complaint.priority === 'HIGH' && "border-l-orange-400 bg-orange-50",
        !isOverdue && complaint.priority === 'MEDIUM' && "border-l-amber-400 bg-amber-50",
        !isOverdue && complaint.priority === 'LOW' && "border-l-slate-400 bg-slate-50"
      )}
    >
      <MobileCardHeader className="items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Khiếu nại</div>
          <div className="mt-0.5 flex items-center gap-2 flex-wrap">
            <div className="text-sm font-semibold text-foreground truncate font-mono">{complaint.id}</div>
            <Badge variant="outline" className={cn("text-xs", complaintTypeColors[complaint.type])}>
              {complaintTypeLabels[complaint.type]}
            </Badge>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StatusBadge status={complaint.status} statusMap={COMPLAINT_STATUS_MAP} />
          {isOverdue && (
            <Badge variant="outline" className="text-xs bg-red-100 text-red-800 whitespace-nowrap">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Quá hạn
            </Badge>
          )}
          <Badge
            variant="outline"
            className={cn("text-xs whitespace-nowrap", priority.color)}
          >
            {priority.label}
          </Badge>
        </div>
      </MobileCardHeader>

      <MobileCardBody>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm">
          <div className="col-span-2">
            <dt className="text-xs text-muted-foreground">Khách hàng</dt>
            <dd className="font-medium truncate">{complaint.customerName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Số điện thoại</dt>
            <dd className="font-medium">{complaint.customerPhone}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Đơn hàng</dt>
            <dd className="font-medium truncate font-mono">{complaint.orderCode}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Ngày tạo</dt>
            <dd className="font-medium">{formatDate(complaint.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Phụ trách</dt>
            <dd className="font-medium truncate">
              {assignedEmployee ? assignedEmployee.fullName : 'Chưa phân công'}
            </dd>
          </div>
          {complaint.description && (
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground">Nội dung</dt>
              <dd className="font-medium line-clamp-2">{complaint.description}</dd>
            </div>
          )}
        </dl>
      </MobileCardBody>
    </MobileCard>
  );
}
