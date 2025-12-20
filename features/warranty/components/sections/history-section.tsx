import { ActivityHistory } from '../../../../components/ActivityHistory';
import type { WarrantyTicket } from '../../types';
import { useWarrantyHistory } from '../../hooks/use-warranty-history';

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
      filterableActions={filterableActions}
      filterableUsers={filterableUsers}
      groupByDate
    />
  );
}
