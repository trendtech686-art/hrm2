import * as React from 'react';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '../../lib/date-utils';
import { cn } from '../../lib/utils';
const Timeline = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col border rounded-md", className)} {...props}>
    <div className="flex items-center px-4 py-2 border-b bg-muted/50 text-sm font-semibold text-muted-foreground">
      <div className="flex-grow pl-11">Nội dung thay đổi</div>
      <div className="w-40 text-right">Thời gian</div>
    </div>
    {children}
  </div>
));
Timeline.displayName = 'Timeline';

const TimelineItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { icon?: React.ReactNode; time: string; }
>(({ className, icon, time, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-start space-x-4 px-4 py-3 border-b last:border-b-0", className)} {...props}>
    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-muted border mt-0.5">
      {icon || <div className="h-2 w-2 rounded-full bg-primary" />}
    </div>
    <div className="flex-grow text-sm flex items-baseline justify-between gap-4">
        <div>{children}</div>
        <time className="text-sm text-foreground flex-shrink-0 w-40 text-right" title={formatDateCustom(parseDate(time), 'HH:mm:ss dd/MM/yyyy')}>
            {formatDateTime(time)}
        </time>
    </div>
  </div>
));
TimelineItem.displayName = 'TimelineItem';

// These components are not used in the new structure but exported for compatibility.
const TimelineHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(() => null);
TimelineHeader.displayName = 'TimelineHeader';
const TimelineContent = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(() => null);
TimelineContent.displayName = 'TimelineContent';

export { Timeline, TimelineItem, TimelineHeader, TimelineContent };
