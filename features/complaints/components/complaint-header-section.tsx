import React from 'react';
import { usePageHeader } from "../../../contexts/page-header-context";
import { StatusBadge, COMPLAINT_STATUS_MAP } from "../../../components/StatusBadge";
import { Badge } from "../../../components/ui/badge";
import { cn } from "../../../lib/utils";
import type { Complaint } from '../types';
import {
  complaintPriorityColors,
  complaintPriorityLabels,
  complaintVerificationColors,
  complaintVerificationLabels,
  complaintTypeColors,
  complaintTypeLabels,
} from '../types';
import { getSLAStatusLabel } from '../hooks/use-complaint-time-tracking';
import { ROUTES, generatePath } from "../../../lib/router";

interface Props {
  complaint: Complaint;
  timeTracking: { 
    currentProcessingTimeFormatted?: string;
    resolutionStatus?: 'on-time' | 'warning' | 'overdue' | 'pending';
    responseStatus?: 'on-time' | 'warning' | 'overdue' | 'pending';
    responseTimeFormatted?: string;
    resolutionTimeFormatted?: string;
  } | null;
  headerActions: React.ReactNode[];
}

export const ComplaintHeaderSection: React.FC<Props> = React.memo(({ complaint, timeTracking, headerActions }) => {
  const { setPageHeader } = usePageHeader();
  
  // Track if we've already set header for this complaint to prevent infinite loops
  const hasSetHeaderRef = React.useRef<string | null>(null);

  const detailBreadcrumb = React.useMemo(() => ([
    { label: "Trang chủ", href: ROUTES.ROOT },
    { label: "Quản lý Khiếu nại", href: ROUTES.INTERNAL.COMPLAINTS },
    {
      label: complaint?.id || 'Chi tiết',
      href: complaint
        ? generatePath(ROUTES.INTERNAL.COMPLAINT_VIEW, { systemId: complaint.systemId as unknown as string })
        : ROUTES.INTERNAL.COMPLAINTS,
    },
  ]), [complaint]);

  // Create a stable fingerprint to detect meaningful changes
  // Only update when complaint data or SLA status actually changes
  const headerFingerprint = React.useMemo(() => {
    if (!complaint) return null;
    return JSON.stringify({
      id: complaint.id,
      status: complaint.status,
      priority: complaint.priority,
      verification: complaint.verification,
      type: complaint.type,
      // Only include SLA status, not formatted time strings (which change every render)
      resolutionStatus: timeTracking?.resolutionStatus,
      responseStatus: timeTracking?.responseStatus,
    });
  }, [complaint, timeTracking?.resolutionStatus, timeTracking?.responseStatus]);

  // Store current values in refs to use in effect without causing re-runs
  const timeTrackingRef = React.useRef(timeTracking);
  const headerActionsRef = React.useRef(headerActions);
  const detailBreadcrumbRef = React.useRef(detailBreadcrumb);
  
  // Update refs on each render
  timeTrackingRef.current = timeTracking;
  headerActionsRef.current = headerActions;
  detailBreadcrumbRef.current = detailBreadcrumb;

  React.useEffect(() => {
    if (!complaint || !headerFingerprint) return;
    
    // Skip if we've already set header for this fingerprint
    if (hasSetHeaderRef.current === headerFingerprint) return;
    hasSetHeaderRef.current = headerFingerprint;
    
    const currentTimeTracking = timeTrackingRef.current;
    const currentBreadcrumb = detailBreadcrumbRef.current;
    const currentActions = headerActionsRef.current;

    setPageHeader({
      title: (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span>Khiếu nại {complaint.id}</span>
            <StatusBadge status={complaint.status} statusMap={COMPLAINT_STATUS_MAP} />
            <Badge variant="outline" className={cn("border", complaintPriorityColors[complaint.priority])}>
              {complaintPriorityLabels[complaint.priority]}
            </Badge>
            {/* Only show verification and type badges when not cancelled */}
            {complaint.status !== 'cancelled' && (
              <>
                <Badge className={complaintVerificationColors[complaint.verification]}>
                  {complaintVerificationLabels[complaint.verification]}
                </Badge>
                <Badge variant="outline" className={complaintTypeColors[complaint.type]}>
                  {complaintTypeLabels[complaint.type]}
                </Badge>
              </>
            )}
          </div>
          {/* SLA Timer & Time Tracking Metrics */}
          {currentTimeTracking && complaint.status !== 'resolved' && complaint.status !== 'ended' && complaint.status !== 'cancelled' && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">SLA:</span>
                <span className={cn(
                  "font-medium",
                  currentTimeTracking.resolutionStatus === 'overdue' ? 'text-red-600' :
                  currentTimeTracking.resolutionStatus === 'warning' ? 'text-yellow-600' : 'text-green-600'
                )}>
                  {getSLAStatusLabel(currentTimeTracking.resolutionStatus ?? 'pending')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Phản hồi:</span>
                  <span className={cn(
                    "font-medium",
                    currentTimeTracking.responseStatus === 'overdue' ? 'text-red-600' :
                    currentTimeTracking.responseStatus === 'warning' ? 'text-yellow-600' : 'text-green-600'
                  )}>{currentTimeTracking.responseTimeFormatted}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Giải quyết:</span>
                  <span className={cn(
                    "font-medium",
                    currentTimeTracking.resolutionStatus === 'overdue' ? 'text-red-600' :
                    currentTimeTracking.resolutionStatus === 'warning' ? 'text-yellow-600' : 'text-green-600'
                  )}>{currentTimeTracking.resolutionTimeFormatted === '-' ? 'Đang xử lý' : currentTimeTracking.resolutionTimeFormatted}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Tổng:</span>
                  <span className="font-semibold text-primary">{currentTimeTracking.currentProcessingTimeFormatted}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
      showBackButton: true,
      backPath: ROUTES.INTERNAL.COMPLAINTS,
      breadcrumb: currentBreadcrumb,
      actions: currentActions,
    });

  }, [complaint, headerFingerprint, setPageHeader]);

  return null;
});
