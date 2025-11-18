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
  const [isPolling, setIsPolling] = React.useState(false); // Default OFF for warranty

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
  }, [isPolling, interval, dataVersion, lastVersion]);

  // Check if data version changed
  React.useEffect(() => {
    if (dataVersion !== lastVersion) {
      setHasUpdates(true);
    }
  }, [dataVersion, lastVersion]);

  const checkForUpdates = (): boolean => {
    // In real app, this would check localStorage or make API call
    // For now, check localStorage version
    try {
      const storedVersion = localStorage.getItem('warranty-version');
      if (storedVersion && parseInt(storedVersion) > lastVersion) {
        return true;
      }
    } catch (error) {
      console.error('Error checking updates:', error);
    }
    return false;
  };

  const showUpdateNotification = () => {
    toast.info('Có cập nhật mới cho bảo hành', {
      duration: 10000,
      position: 'top-right',
      action: {
        label: 'Làm mới',
        onClick: () => {
          handleRefresh();
        },
      },
    });
  };

  const handleRefresh = React.useCallback(() => {
    setLastVersion(dataVersion);
    setHasUpdates(false);
    onRefresh();
    toast.success('Đã làm mới dữ liệu bảo hành');
  }, [dataVersion, onRefresh]);

  const togglePolling = () => {
    setIsPolling(prev => !prev);
    if (!isPolling) {
      toast.info('Đã bật chế độ cập nhật tự động (30s)', { duration: 3000 });
    } else {
      toast.info('Đã tắt chế độ cập nhật tự động', { duration: 3000 });
    }
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
export function triggerWarrantyDataUpdate() {
  try {
    const currentVersion = parseInt(localStorage.getItem('warranty-version') || '0');
    localStorage.setItem('warranty-version', String(currentVersion + 1));
  } catch (error) {
    console.error('Error triggering warranty update:', error);
  }
}

/**
 * Get current data version
 */
export function getWarrantyDataVersion(): number {
  try {
    return parseInt(localStorage.getItem('warranty-version') || '0');
  } catch {
    return 0;
  }
}
