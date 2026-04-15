'use client';

/**
 * Status Timeline component for warranty tracking page
 */
import * as React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/date-utils';
import { WARRANTY_STATUS_LABELS } from '../types';
import type { WarrantyStatus } from '../types';
import type { PublicWarrantyTicket } from '../public-warranty-api';
import { getStatusTimestamp } from '../utils/warranty-tracking-helpers';

/**
 * Get status icon
 */
function getStatusIcon(status: WarrantyStatus) {
  const icons: Record<WarrantyStatus, React.ElementType> = {
    RECEIVED: AlertCircle,
    PROCESSING: Clock,
    WAITING_PARTS: Clock,
    COMPLETED: CheckCircle,
    RETURNED: Package,
    CANCELLED: XCircle,
  };
  return icons[status] || AlertCircle;
}

interface StatusTimelineProps {
  ticket: PublicWarrantyTicket;
}

/**
 * Status timeline component showing warranty progress
 */
export function StatusTimeline({ ticket }: StatusTimelineProps) {
  const baseStatuses: WarrantyStatus[] = ['RECEIVED', 'PROCESSING', 'COMPLETED', 'RETURNED'];
  const statuses: WarrantyStatus[] =
    ticket.status === 'CANCELLED' ? [...baseStatuses, 'CANCELLED'] : baseStatuses;
  const currentIndex = statuses.indexOf(ticket.status);

  return (
    <div className="space-y-4">
      {statuses.map((status, index) => {
        const Icon = getStatusIcon(status);
        const isPast = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const timestamp = getStatusTimestamp(ticket, status);

        return (
          <div key={status} className="flex gap-4">
            {/* Icon & Line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'rounded-full p-2 border-2',
                  isPast
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-muted border-muted-foreground/20 text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              {index < statuses.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 h-12 my-1',
                    isPast ? 'bg-primary' : 'bg-muted-foreground/20'
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn('font-medium', isCurrent && 'text-primary')}>
                  {WARRANTY_STATUS_LABELS[status]}
                </span>
                {isCurrent && (
                  <Badge variant="default" className="h-5">
                    Hiện tại
                  </Badge>
                )}
              </div>
              {timestamp && (
                <div className="text-sm text-muted-foreground">
                  {formatDateTime(timestamp)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
