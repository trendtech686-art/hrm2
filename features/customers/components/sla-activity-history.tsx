import * as React from 'react';
import { ActivityHistory, type HistoryEntry } from '../../../components/ActivityHistory';
import { getActivityLogs } from '../sla/ack-storage';
import { SLA_TYPE_LABELS } from '../../settings/customers/sla-settings-data';
import { useCustomerSlaEngineStore } from '../sla/store';
import type { SystemId } from '@/lib/id-types';

interface Props {
  customerId: SystemId;
  customerName?: string;
}

const ACTION_TYPE_LABELS: Record<string, string> = {
  acknowledged: 'Đã xử lý',
  snoozed: 'Tạm ẩn',
  resolved: 'Đã giải quyết',
  escalated: 'Đã chuyển cấp',
};

/**
 * SLA Activity History Component
 * 
 * Hiển thị lịch sử các thao tác SLA của khách hàng:
 * - Đã xử lý (acknowledged)
 * - Tạm ẩn (snoozed)
 * - Giải quyết (resolved)
 * - Chuyển cấp (escalated)
 */
export function SlaActivityHistory({ customerId, customerName }: Props) {
  const [history, setHistory] = React.useState<HistoryEntry[]>([]);
  
  // Subscribe to summary changes to trigger re-render when acknowledge happens
  const summary = useCustomerSlaEngineStore((state) => state.summary);
  
  // Also track a refresh key for manual refresh
  const [refreshKey, setRefreshKey] = React.useState(0);
  
  React.useEffect(() => {
    // Load activity logs for this customer
    const logs = getActivityLogs(customerId, 100);
    
    // Convert to HistoryEntry format
    const entries: HistoryEntry[] = logs.map(log => ({
      id: log.id,
      action: log.actionType === 'acknowledged' ? 'status_changed' 
        : log.actionType === 'snoozed' ? 'updated'
        : log.actionType === 'resolved' ? 'resolved'
        : log.actionType === 'escalated' ? 'assigned'
        : 'custom',
      timestamp: new Date(log.performedAt),
      user: {
        systemId: log.performedBy || 'system',
        name: log.performedBy || 'Hệ thống',
      },
      description: `${ACTION_TYPE_LABELS[log.actionType] || log.actionType} - ${SLA_TYPE_LABELS[log.slaType] || log.slaType}`,
      metadata: log.notes ? { note: log.notes } : undefined,
    }));
    
    setHistory(entries);
  }, [customerId, summary, refreshKey]); // Re-run when summary changes or manual refresh
  
  return (
    <ActivityHistory
      history={history}
      title="Lịch sử xử lý SLA"
      emptyMessage="Chưa có lịch sử xử lý SLA nào"
      showFilters={false}
      showUser={true}
      showTimestamp={true}
      showMetadata={true}
      groupByDate={true}
      maxHeight="400px"
    />
  );
}
