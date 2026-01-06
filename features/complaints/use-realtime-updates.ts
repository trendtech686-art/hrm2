import * as React from 'react';
import { toast } from 'sonner';

/**
 * In-memory version counter (NO localStorage)
 * Gets reset on page refresh - which is fine since data comes from server anyway
 */
let complaintsVersion = 0;

/**
 * Hook for realtime updates with polling
 * Shows notification when data changes
 * Auto-refresh or manual refresh via notification
 * 
 * NOTE: This is kept for backward compatibility.
 * For new features, use React Query with refetchInterval instead.
 */
export function useRealtimeUpdates(
  dataVersion: number,
  onRefresh: () => void,
  _interval: number = 30000
) {
  const [hasUpdates, setHasUpdates] = React.useState(false);
  const [lastVersion, setLastVersion] = React.useState(dataVersion);
  const [isPolling, setIsPolling] = React.useState(true);

  const handleRefresh = React.useCallback(() => {
    setLastVersion(dataVersion);
    setHasUpdates(false);
    onRefresh();
    toast.success('Đã làm mới dữ liệu');
  }, [dataVersion, onRefresh]);

  // Check if data version changed
  React.useEffect(() => {
    if (dataVersion !== lastVersion) {
      setHasUpdates(true);
    }
  }, [dataVersion, lastVersion]);

  const togglePolling = () => {
    setIsPolling(prev => !prev);
  };

  return {
    hasUpdates,
    isPolling,
    refresh: handleRefresh,
    togglePolling,
  };
}

/**
 * Trigger data update notification (in-memory, no localStorage)
 * @deprecated Use React Query invalidateQueries instead
 */
export function triggerDataUpdate() {
  complaintsVersion++;
}

/**
 * Get current data version (in-memory)
 * @deprecated Use React Query for data fetching
 */
export function getDataVersion(): number {
  return complaintsVersion;
}
