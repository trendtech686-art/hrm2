import React from 'react';
import { EntityActivityTable } from '@/components/shared/entity-activity-table';

interface Props {
  complaintId: string;
}

export const ComplaintTimelineSection: React.FC<Props> = React.memo(({ complaintId }) => {
  return (
    <EntityActivityTable entityType="complaint" entityId={complaintId} />
  );
});
