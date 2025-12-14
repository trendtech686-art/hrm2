import React from 'react';
import { usePageHeader } from "../../../contexts/page-header-context.tsx";
import { StatusBadge, COMPLAINT_STATUS_MAP } from "../../../components/StatusBadge.tsx";
import { Badge } from "../../../components/ui/badge.tsx";
import { cn } from "../../../lib/utils.ts";
import type { Complaint } from '../types.ts';
import {
  complaintPriorityColors,
  complaintPriorityLabels,
  complaintVerificationColors,
  complaintVerificationLabels,
  complaintTypeColors,
  complaintTypeLabels,
} from '../types.ts';
import { getSLAStatusLabel } from '../hooks/use-complaint-time-tracking.ts';
import { ROUTES, generatePath } from "../../../lib/router.ts";

interface Props {
  complaint: Complaint;
  timeTracking: any;
  headerActions: React.ReactNode[];
}

export const ComplaintHeaderSection: React.FC<Props> = React.memo(({ complaint, timeTracking, headerActions }) => {
  const { setPageHeader } = usePageHeader();

  const headerSubtitle = React.useMemo(() => {
    if (!complaint) return undefined;
    const parts = [
      complaint.customerName && `Khách ${complaint.customerName}`,
      complaint.orderCode && `Đơn ${complaint.orderCode}`,
      complaint.branchName && `Chi nhánh ${complaint.branchName}`,
      timeTracking?.currentProcessingTimeFormatted && `Xử lý ${timeTracking.currentProcessingTimeFormatted}`,
    ].filter(Boolean) as string[];
    return parts.length ? parts.join(' • ') : undefined;
  }, [complaint, timeTracking]);

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

  React.useEffect(() => {
    if (!complaint) return;

    setPageHeader({
      title: complaint ? (
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
          {timeTracking && complaint.status !== 'resolved' && complaint.status !== 'ended' && complaint.status !== 'cancelled' && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">SLA:</span>
                <span className={cn(
                  "font-medium",
                  timeTracking.resolutionStatus === 'overdue' ? 'text-red-600' :
                  timeTracking.resolutionStatus === 'warning' ? 'text-yellow-600' : 'text-green-600'
                )}>
                  {getSLAStatusLabel(timeTracking.resolutionStatus)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Phản hồi:</span>
                  <span className={cn(
                    "font-medium",
                    timeTracking.responseStatus === 'overdue' ? 'text-red-600' :
                    timeTracking.responseStatus === 'warning' ? 'text-yellow-600' : 'text-green-600'
                  )}>{timeTracking.responseTimeFormatted}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Giải quyết:</span>
                  <span className={cn(
                    "font-medium",
                    timeTracking.resolutionStatus === 'overdue' ? 'text-red-600' :
                    timeTracking.resolutionStatus === 'warning' ? 'text-yellow-600' : 'text-green-600'
                  )}>{timeTracking.resolutionTimeFormatted}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Tổng:</span>
                  <span className="font-semibold text-primary">{timeTracking.currentProcessingTimeFormatted}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : 'Chi tiết khiếu nại',
      showBackButton: true,
      backPath: ROUTES.INTERNAL.COMPLAINTS,
      breadcrumb: detailBreadcrumb,
      actions: headerActions,
    });

  }, [complaint, detailBreadcrumb, headerActions, headerSubtitle, setPageHeader, timeTracking]);

  return null;
});
