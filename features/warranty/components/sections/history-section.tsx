import { ActivityHistory } from '../../../../components/ActivityHistory.tsx';
import type { WarrantyTicket } from '../../types.ts';
import { useWarrantyHistory } from '../../hooks/use-warranty-history.ts';

interface WarrantyHistorySectionProps {
  ticket: WarrantyTicket;
}

export function WarrantyHistorySection({ ticket }: WarrantyHistorySectionProps) {
  const {
    historyEntries,
    filterableActions,
    filterableUsers,
  } = useWarrantyHistory({ ticket });

  return (
    <ActivityHistory
      history={historyEntries}
      title="Lịch sử thao tác"
      showFilters
      filterableActions={filterableActions}
      filterableUsers={filterableUsers}
      groupByDate
    />
  );
}
