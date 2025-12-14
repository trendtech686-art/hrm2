import * as React from 'react';
import { Badge } from '../../../components/ui/badge';
import type { CustomerSlaAlert } from '../sla/types';
import { SLA_TYPE_BADGES } from '../sla/constants';

type Props = {
  alerts?: CustomerSlaAlert[];
  className?: string;
  maxVisible?: number;
};

export function CustomerSlaBadges({ alerts, className, maxVisible = 2 }: Props) {
  if (!alerts || !alerts.length) {
    return <Badge variant="outline" className="text-xs text-muted-foreground">Ổn định</Badge>;
  }

  const visible = alerts.slice(0, maxVisible);
  const remaining = alerts.length - visible.length;

  return (
    <div className={className || 'flex flex-col gap-1'}>
      {visible.map(alert => {
        const badgeMeta = SLA_TYPE_BADGES[alert.slaType];
        const colorClass = badgeMeta?.color || 'text-slate-600 bg-slate-100';
        return (
          <div key={`${alert.slaType}-${alert.targetDate}`} className="flex items-center gap-2">
            <Badge variant="outline" className={`${colorClass} text-[11px]`}>{badgeMeta?.label || alert.slaName}</Badge>
          </div>
        );
      })}
      {remaining > 0 && (
        <span className="text-[11px] text-muted-foreground">+{remaining} cảnh báo khác</span>
      )}
    </div>
  );
}
