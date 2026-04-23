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
    pending: { icon: Clock, color: 'text-warning' },
    investigating: { icon: AlertCircle, color: 'text-info' },
    resolved: { icon: CheckCircle2, color: 'text-success' },
    rejected: { icon: XCircle, color: 'text-muted-foreground' },
    cancelled: { icon: XCircle, color: 'text-destructive' },
    ended: { icon: CheckCircle2, color: 'text-purple-600' },
  };
  
  const _StatusIcon = (statusConfig[complaint.status] ?? statusConfig.pending).icon;
  
  const priorityConfig: Record<string, { label: string; color: string }> = {
    low: { label: 'Thấp', color: 'bg-muted text-foreground' },
    medium: { label: 'Trung bình', color: 'bg-warning/15 text-warning-foreground' },
    high: { label: 'Cao', color: 'bg-warning/25 text-warning-foreground' },
    urgent: { label: 'Khẩn cấp', color: 'bg-destructive/15 text-destructive' },
    LOW: { label: 'Thấp', color: 'bg-muted text-foreground' },
    MEDIUM: { label: 'Trung bình', color: 'bg-warning/15 text-warning-foreground' },
    HIGH: { label: 'Cao', color: 'bg-warning/25 text-warning-foreground' },
    CRITICAL: { label: 'Khẩn cấp', color: 'bg-destructive/15 text-destructive' },
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
        isOverdue && "border-l-destructive bg-destructive/10",
        !isOverdue && complaint.priority === 'CRITICAL' && "border-l-destructive bg-destructive/10",
        !isOverdue && complaint.priority === 'HIGH' && "border-l-warning bg-warning/10",
        !isOverdue && complaint.priority === 'MEDIUM' && "border-l-warning bg-warning/10",
        !isOverdue && complaint.priority === 'LOW' && "border-l-border bg-muted/50"
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
            <Badge variant="outline" className="text-xs bg-destructive/15 text-destructive whitespace-nowrap">
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
