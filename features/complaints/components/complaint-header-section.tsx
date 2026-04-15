import React from 'react';
import { usePageHeader } from "../../../contexts/page-header-context";
import type { Complaint } from '../types';
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
  leftActions?: React.ReactNode[];
}

export const ComplaintHeaderSection: React.FC<Props> = React.memo(({ complaint, timeTracking, headerActions, leftActions }) => {
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
  const leftActionsRef = React.useRef(leftActions);
  const detailBreadcrumbRef = React.useRef(detailBreadcrumb);
  
  // Update refs on each render
  timeTrackingRef.current = timeTracking;
  headerActionsRef.current = headerActions;
  leftActionsRef.current = leftActions;
  detailBreadcrumbRef.current = detailBreadcrumb;

  React.useEffect(() => {
    if (!complaint || !headerFingerprint) return;
    
    // Skip if we've already set header for this fingerprint
    if (hasSetHeaderRef.current === headerFingerprint) return;
    hasSetHeaderRef.current = headerFingerprint;
    
    const currentTimeTracking = timeTrackingRef.current;
    const currentBreadcrumb = detailBreadcrumbRef.current;
    const currentActions = headerActionsRef.current;
    const currentLeftActions = leftActionsRef.current;

    setPageHeader({
      title: `Khiếu nại ${complaint.id}`,
      showBackButton: true,
      backPath: ROUTES.INTERNAL.COMPLAINTS,
      breadcrumb: currentBreadcrumb,
      actions: currentActions,
      badge: currentLeftActions && currentLeftActions.length > 0 ? (
        <div className="flex items-center gap-2">
          {currentLeftActions.map((action, index) => (
            <React.Fragment key={index}>{action}</React.Fragment>
          ))}
        </div>
      ) : undefined,
    });

  }, [complaint, headerFingerprint, setPageHeader]);

  return null;
});
