import * as React from 'react';
import { Phone, Package, Calendar, User, Clock, AlertCircle, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { StatusBadge, COMPLAINT_STATUS_MAP } from '../../components/StatusBadge';
import { Card } from '../../components/ui/card';
import { cn } from '../../lib/utils';
import { formatDate } from '../../lib/date-utils';
import { Complaint, complaintStatusLabels, complaintStatusColors, complaintTypeLabels, complaintTypeColors } from './types';
import { checkOverdue } from './sla-utils';

interface ComplaintCardProps {
  complaint: Complaint;
  onClick: () => void;
  employees: Array<{ systemId: string; fullName: string }>;
}

export function ComplaintCard({ complaint, onClick, employees }: ComplaintCardProps) {
  const overdueStatus = checkOverdue(complaint);
  const isOverdue = overdueStatus.isOverdueResponse || overdueStatus.isOverdueResolve;
  
  const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-600' },
    investigating: { icon: AlertCircle, color: 'text-blue-600' },
    resolved: { icon: CheckCircle2, color: 'text-green-600' },
    rejected: { icon: XCircle, color: 'text-gray-600' },
  };
  
  const StatusIcon = statusConfig[complaint.status].icon;
  
  const priorityConfig = {
    low: { label: 'Thấp', color: 'bg-slate-100 text-slate-800' },
    medium: { label: 'Trung bình', color: 'bg-amber-100 text-amber-800' },
    high: { label: 'Cao', color: 'bg-orange-100 text-orange-800' },
    urgent: { label: 'Khẩn cấp', color: 'bg-red-100 text-red-800' },
  };
  
  const assignedEmployee = complaint.assignedTo 
    ? employees.find(e => e.systemId === complaint.assignedTo)
    : null;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-4 cursor-pointer transition-all hover:shadow-md",
        "border-l-4",
        isOverdue && "border-l-red-500 bg-red-50",
        !isOverdue && complaint.priority === 'urgent' && "border-l-red-400 bg-red-50",
        !isOverdue && complaint.priority === 'high' && "border-l-orange-400 bg-orange-50",
        !isOverdue && complaint.priority === 'medium' && "border-l-amber-400 bg-amber-50",
        !isOverdue && complaint.priority === 'low' && "border-l-slate-400 bg-slate-50"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-body-sm text-primary">{complaint.id}</span>
            <Badge variant="outline" className={cn("text-body-xs", complaintTypeColors[complaint.type])}>
              {complaintTypeLabels[complaint.type]}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-body-xs text-muted-foreground">
            <Package className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{complaint.orderCode}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={complaint.status} statusMap={COMPLAINT_STATUS_MAP} />
          
          {isOverdue && (
            <Badge variant="outline" className="text-body-xs bg-red-100 text-red-800 whitespace-nowrap">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Quá hạn
            </Badge>
          )}
          
          <Badge 
            variant="outline" 
            className={cn("text-body-xs", priorityConfig[complaint.priority].color, "whitespace-nowrap")}
          >
            {priorityConfig[complaint.priority].label}
          </Badge>
        </div>
      </div>

      {/* Customer Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-body-sm">
          <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="font-medium truncate">{complaint.customerName}</span>
        </div>
        <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
          <Phone className="h-3.5 w-3.5 shrink-0" />
          <span>{complaint.customerPhone}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-body-sm text-muted-foreground line-clamp-2 mb-3">
        {complaint.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-body-xs text-muted-foreground pt-3 border-t">
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(complaint.createdAt)}</span>
        </div>
        
        {assignedEmployee ? (
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            <span className="truncate max-w-[120px]">{assignedEmployee.fullName}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">Chưa phân công</span>
        )}
      </div>
    </Card>
  );
}
