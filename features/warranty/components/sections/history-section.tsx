import { EntityActivityTable } from '@/components/shared/entity-activity-table';

interface WarrantyHistorySectionProps {
  ticketId: string;
}

export function WarrantyHistorySection({ ticketId }: WarrantyHistorySectionProps) {
  return (
    <EntityActivityTable entityType="warranty" entityId={ticketId} />
  );
}
