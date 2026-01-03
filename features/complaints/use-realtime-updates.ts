import * as React from 'react';
import { toast } from 'sonner';

/**
 * Hook for realtime updates with polling
 * Shows notification when data changes
 * Auto-refresh or manual refresh via notification
 */
export function useRealtimeUpdates(
  dataVersion: number, // Pass a version number that changes when data updates
  onRefresh: () => void,
  interval: number = 30000 // 30 seconds default
) {
  const [hasUpdates, setHasUpdates] = React.useState(false);
  const [lastVersion, setLastVersion] = React.useState(dataVersion);
  const [isPolling, setIsPolling] = React.useState(true);

  const checkForUpdates = React.useCallback((): boolean => {
    // In real app, this would check localStorage or make API call
    if (typeof window === 'undefined') return false;
    try {
      const storedVersion = localStorage.getItem('complaints-version');
      if (storedVersion && parseInt(storedVersion) > lastVersion) {
        return true;
      }
    } catch (error) {
      console.error('Error checking updates:', error);
    }
    return false;
  }, [lastVersion]);

  const handleRefresh = React.useCallback(() => {
    setLastVersion(dataVersion);
    setHasUpdates(false);
    onRefresh();
    toast.success('Đã làm mới dữ liệu');
  }, [dataVersion, onRefresh]);

  const showUpdateNotification = React.useCallback(() => {
    toast.info('Có cập nhật mới từ hệ thống', {
      duration: 10000,
      position: 'top-right',
      action: {
        label: 'Làm mới',
        onClick: () => {
          handleRefresh();
        },
      },
    });
  }, [handleRefresh]);

  // Check for updates periodically
  React.useEffect(() => {
    if (!isPolling) return;

    const timer = setInterval(() => {
      // Simulate checking for updates
      // In real app, this would be a fetch to server
      const hasNewData = checkForUpdates();
      
      if (hasNewData && dataVersion !== lastVersion) {
        setHasUpdates(true);
        showUpdateNotification();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isPolling, interval, dataVersion, lastVersion, checkForUpdates, showUpdateNotification]);

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
 * Manual trigger for simulating data updates
 * Call this when data changes (e.g., after create/update/delete)
 */
export function triggerDataUpdate() {
  if (typeof window === 'undefined') return;
  try {
    const currentVersion = parseInt(localStorage.getItem('complaints-version') || '0');
    localStorage.setItem('complaints-version', String(currentVersion + 1));
  } catch (error) {
    console.error('Error triggering update:', error);
  }
}

/**
 * Get current data version
 */
export function getDataVersion(): number {
  if (typeof window === 'undefined') return 0;
  try {
    return parseInt(localStorage.getItem('complaints-version') || '0');
  } catch {
    return 0;
  }
}
