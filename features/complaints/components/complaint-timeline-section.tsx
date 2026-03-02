import React from 'react';
import { ActivityHistory, type HistoryEntry } from '../../../components/ActivityHistory';
import type { Complaint } from '../types';

interface Props {
  complaint: Complaint;
  employees: Array<{ systemId: string; fullName: string }>;
}

export const ComplaintTimelineSection: React.FC<Props> = React.memo(({ complaint, employees }) => {
  // ✅ Add null check for timeline
  if (!complaint.timeline || complaint.timeline.length === 0) {
    return null;
  }
  
  return (
    <ActivityHistory
      history={complaint.timeline.map((action): HistoryEntry => {
        const employee = employees.find(e => e.systemId === action.performedBy);
        return {
          id: action.id,
          action: action.actionType as HistoryEntry['action'],
          timestamp: new Date(action.performedAt),
          user: {
            systemId: action.performedBy,
            name: employee?.fullName || action.performedBy,
          },
          description: action.note || '',
          metadata: action.metadata,
        };
      })}
      showFilters
      groupByDate
    />
  );
});
