'use client';

import * as React from 'react';
import { AlertTriangle, User, Phone, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StatusBadge, COMPLAINT_STATUS_MAP } from '@/components/StatusBadge';
import { MobileCard, MobileCardFooter } from '@/components/mobile/mobile-card';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/date-utils';
import { Complaint, complaintTypeLabels, complaintTypeColors } from '../types';
import { checkOverdue } from '../sla-utils';

interface ComplaintCardProps {
  complaint: Complaint;
  onClick: () => void;
  employees: Array<{ systemId: string; fullName: string }>;
}

// Mobile-optimized complaint card với touch targets ≥40px
export function ComplaintCard({ complaint, onClick, employees }: ComplaintCardProps) {
  const overdueStatus = checkOverdue(complaint);
  const isOverdue = overdueStatus.isOverdueResponse || overdueStatus.isOverdueResolve;

  const priorityConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    LOW: { label: 'Thấp', color: 'text-muted-foreground', bgColor: 'bg-muted' },
    MEDIUM: { label: 'TB', color: 'text-warning', bgColor: 'bg-warning/15' },
    HIGH: { label: 'Cao', color: 'text-warning', bgColor: 'bg-warning/25' },
    CRITICAL: { label: 'Khẩn', color: 'text-destructive', bgColor: 'bg-destructive/15' },
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
        !isOverdue && complaint.priority === 'LOW' && "border-l-border"
      )}
    >
      {/* Header: ID + Status + Badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-xs text-muted-foreground shrink-0">KN</span>
          <span className="font-semibold text-primary text-sm font-mono truncate">
            {complaint.id}
          </span>
          <Badge
            variant="outline"
            className={cn("text-xs shrink-0", complaintTypeColors[complaint.type])}
          >
            {complaintTypeLabels[complaint.type]}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <StatusBadge status={complaint.status} statusMap={COMPLAINT_STATUS_MAP} />
          {isOverdue && (
            <Badge className="bg-destructive/15 text-destructive text-xs">
              <AlertTriangle className="h-3 w-3 mr-0.5" />
              Hết hạn
            </Badge>
          )}
        </div>
      </div>

      {/* Customer Info - Stacked on mobile */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium truncate">{complaint.customerName}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          {complaint.customerPhone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span className="font-medium">{complaint.customerPhone}</span>
            </div>
          )}
          {complaint.orderCode && (
            <div className="flex items-center gap-1">
              <Truck className="h-3 w-3" />
              <span className="font-mono">{complaint.orderCode}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Priority + Date + Assignee */}
      <MobileCardFooter className="gap-2">
        <div className="flex items-center gap-1.5">
          <span className={cn("text-xs px-1.5 py-0.5 rounded shrink-0", priority.bgColor, priority.color)}>
            {priority.label}
          </span>
        </div>
        <div className="flex-1 min-w-0 text-right">
          <span className="text-xs text-muted-foreground truncate block">
            {assignedEmployee ? assignedEmployee.fullName : 'Chưa phân công'}
          </span>
        </div>
        <div className="shrink-0">
          <span className="text-xs text-muted-foreground">
            {formatDateTime(complaint.createdAt)}
          </span>
        </div>
      </MobileCardFooter>

      {/* Description Preview */}
      {complaint.description && (
        <div className="mt-2 pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground line-clamp-2">
            {complaint.description}
          </p>
        </div>
      )}
    </MobileCard>
  );
}
