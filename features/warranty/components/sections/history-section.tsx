import * as React from 'react';
import { ActivityHistory } from '../../../../components/ActivityHistory.tsx';
import type { WarrantyTicket } from '../../types.ts';

interface WarrantyHistorySectionProps {
  ticket: WarrantyTicket;
}

export function WarrantyHistorySection({ ticket }: WarrantyHistorySectionProps) {
  const historyEntries = React.useMemo(() => (
    (ticket.history || []).map((entry) => ({
      id: entry.systemId,
      action: entry.action as any,
      timestamp: new Date(entry.performedAt),
      user: {
        systemId: 'SYSTEM',
        name: entry.performedBy,
      },
      description: entry.actionLabel || entry.action,
      metadata: entry.note ? { note: entry.note } : undefined,
    }))
  ), [ticket.history]);

  return (
    <ActivityHistory
      history={historyEntries}
      title="Lịch sử thao tác"
      showFilters
      groupByDate
    />
  );
}
