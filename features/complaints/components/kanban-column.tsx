'use client'

import * as React from "react";
import { useVirtualizer } from '@tanstack/react-virtual';
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateForDisplay } from '@/lib/date-utils';

// Types
import type { Complaint, ComplaintStatus } from "../types";
import {
  complaintStatusLabels,
  complaintTypeLabels,
  complaintTypeColors,
} from "../types";
import { checkOverdue } from "../sla-utils";
import { loadCardColorSettings } from "../../settings/complaints/complaints-settings-page";

// UI Components
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SlaTimer } from "@/components/SlaTimer";
import { ComplaintCardContextMenu } from "./complaint-card-context-menu";

interface KanbanColumnProps {
  status: ComplaintStatus;
  complaints: Complaint[];
  onComplaintClick: (complaint: Complaint) => void;
  employees: Array<{ systemId: string; fullName: string }>;
  onEdit: (systemId: string) => void;
  onGetLink: (systemId: string) => void;
  onStartInvestigation: (systemId: string) => void;
  onFinish: (systemId: string) => void;
  onOpen: (systemId: string) => void;
  onCancel: (systemId: string) => void;
  onRemind: (systemId: string) => void;
}

/**
 * Kanban Column Component - Unified neutral header with search
 */
export function KanbanColumn({
  status,
  complaints,
  onComplaintClick,
  employees,
  onEdit,
  onGetLink,
  onStartInvestigation,
  onFinish,
  onOpen,
  onCancel,
  onRemind,
}: KanbanColumnProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // ⚡ VIRTUAL SCROLLING: Ref cho container
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  const statusIcons: Record<ComplaintStatus, React.ElementType> = {
    pending: Clock,
    investigating: AlertCircle,
    resolved: CheckCircle2,
    cancelled: XCircle,
    ended: CheckCircle2,
  };

  const StatusIcon = statusIcons[status];
  
  // Filter complaints based on local search
  const filteredComplaints = React.useMemo(() => {
    if (!searchQuery.trim()) return complaints;
    
    const query = searchQuery.toLowerCase();
    return complaints.filter(c => 
      (c.orderCode || c.orderSystemId).toLowerCase().includes(query) ||
      c.customerName.toLowerCase().includes(query) ||
      c.customerPhone.includes(query) ||
      c.description.toLowerCase().includes(query)
    );
  }, [complaints, searchQuery]);
  
  // ⚡ VIRTUAL SCROLLING: Setup virtualizer
  const virtualizer = useVirtualizer({
    count: filteredComplaints.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated card height in pixels
    overscan: 5, // Render 5 extra items above/below viewport
  });

  return (
    <div className="flex-1 min-w-[300px] flex flex-col max-h-[calc(100vh-320px)]">
      {/* Header - Shadcn style with darker background */}
      <div className="text-body-sm font-semibold px-4 py-3 mb-2 rounded-lg border bg-muted flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusIcon className="h-4 w-4" />
          {complaintStatusLabels[status]}
        </div>
        <span className="text-body-sm font-normal bg-background h-6 w-6 flex items-center justify-center rounded-full">
          {filteredComplaints.length}
        </span>
      </div>
      
      {/* Search Input - h-9 */}
      <div className="mb-2">
        <Input
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
      </div>

      {/* Scrollable Cards Area - Virtual Scrolling */}
      <div 
        ref={parentRef}
        className="flex-1 overflow-y-auto pb-2"
        style={{ 
          height: '100%',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const complaint = filteredComplaints[virtualItem.index];
            const overdueStatus = checkOverdue(complaint);
            const isOverdue = overdueStatus.isOverdueResponse || overdueStatus.isOverdueResolve;
            
            // Load card color settings
            const colorSettings = loadCardColorSettings();
            
            // Determine card color (priority order: overdue > priority > status)
            let cardColorClass = "";
            if (colorSettings.enableOverdueColor && isOverdue) {
              cardColorClass = colorSettings.overdueColor;
            } else if (colorSettings.enablePriorityColors && complaint.priority) {
              const priority = complaint.priority;
              cardColorClass = colorSettings.priorityColors[priority] || "";
            } else if (colorSettings.enableStatusColors) {
              cardColorClass = colorSettings.statusColors[complaint.status] || "";
            }
            
            return (
              <div
                key={complaint.systemId}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div className="pb-3">
                  <ComplaintCardContextMenu
                    complaint={complaint}
                    onEdit={onEdit}
                    onGetLink={onGetLink}
                    onStartInvestigation={onStartInvestigation}
                    onFinish={onFinish}
                    onOpen={onOpen}
                    onReject={onCancel}
                    onRemind={onRemind}
                  >
                    <Card
                      onClick={() => onComplaintClick(complaint)}
                      className={cn(
                        "p-4 cursor-pointer transition-colors hover:bg-accent",
                        cardColorClass
                      )}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-body-sm font-semibold">
                          {complaint.id}
                        </div>
                        <div className="flex items-center gap-1 flex-wrap justify-end">
                          <Badge
                            variant="outline"
                            className={cn("text-body-xs", complaintTypeColors[complaint.type])}
                          >
                            {complaintTypeLabels[complaint.type]}
                          </Badge>
                        </div>
                      </div>

                      {/* Order Info */}
                      <div className="mb-2">
                        <div className="text-body-sm font-medium text-foreground mb-1">
                          Đơn hàng: #{complaint.orderCode || complaint.orderSystemId}
                        </div>
                        <div className="flex items-center justify-between gap-2 text-body-xs text-muted-foreground">
                          <span className="truncate">{complaint.customerName}</span>
                          <span className="flex-shrink-0">{complaint.customerPhone}</span>
                        </div>
                      </div>

                      {/* Description Preview */}
                      <div className="text-body-xs text-muted-foreground mb-2 line-clamp-2">
                        {complaint.description}
                      </div>

                      {/* SLA Timer - Live Countdown */}
                      <SlaTimer
                        startTime={complaint.createdAt}
                        targetMinutes={120} // 2 hours default for complaints
                        isCompleted={complaint.status === 'resolved' || complaint.status === 'cancelled'}
                        completedLabel="Đã giải quyết"
                        className="mb-2"
                      />

                      {/* Footer */}
                      <div className="flex items-center justify-between text-body-xs">
                        <div className="flex items-center gap-2">
                          {complaint.assignedTo && (() => {
                            const assignedEmployee = employees.find(e => e.systemId === complaint.assignedTo);
                            if (!assignedEmployee) return <span className="text-muted-foreground">Chưa giao</span>;
                            
                            // Get initials from full name (e.g. "Nguyễn Văn A" -> "NVA")
                            const initials = assignedEmployee.fullName
                              .split(' ')
                              .map(word => word[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 3);
                            
                            return (
                              <div className="flex items-center gap-1.5">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-semibold">
                                  {initials}
                                </div>
                                <span className="text-muted-foreground max-w-[80px] truncate">
                                  {assignedEmployee.fullName}
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                        <div className="text-muted-foreground">
                          {formatDateForDisplay(complaint.createdAt)}
                        </div>
                      </div>
                    </Card>
                  </ComplaintCardContextMenu>
                </div>
              </div>
            );
          })}
        </div>

        {filteredComplaints.length === 0 && (
          <div className="flex items-center justify-center h-40 text-body-sm text-muted-foreground border-2 border-dashed rounded-lg">
            Không có khiếu nại nào
          </div>
        )}
      </div>
    </div>
  );
}
