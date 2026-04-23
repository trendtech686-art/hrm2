"use client";

import * as React from "react";
import { CloudOff, Cloud, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getOfflineQueue,
  installOfflineQueueRunner,
  processQueue,
  subscribeOfflineQueue,
  type QueuedAction,
} from "@/lib/offline-queue";

/**
 * Floating indicator that surfaces how many actions are waiting to replay.
 * Renders nothing unless the queue is non-empty or the user is offline, so it
 * stays out of the way during normal use.
 */
export function OfflineQueueIndicator() {
  const [queue, setQueue] = React.useState<QueuedAction[]>([]);
  const [online, setOnline] = React.useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [syncing, setSyncing] = React.useState(false);

  React.useEffect(() => {
    const uninstall = installOfflineQueueRunner();
    const unsub = subscribeOfflineQueue(setQueue);
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    void getOfflineQueue().then(setQueue);
    return () => {
      uninstall();
      unsub();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = React.useCallback(async () => {
    setSyncing(true);
    try {
      await processQueue();
    } finally {
      setSyncing(false);
    }
  }, []);

  const count = queue.length;
  if (online && count === 0) return null;

  return (
    <div
      aria-live="polite"
      className={cn(
        "fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-border bg-background shadow-lg",
        "flex items-center gap-2 px-3 py-1.5 text-xs",
      )}
    >
      {online ? (
        <Cloud className="h-3.5 w-3.5 text-amber-500" />
      ) : (
        <CloudOff className="h-3.5 w-3.5 text-destructive" />
      )}
      <span className="text-foreground">
        {online
          ? `${count} thao tác chờ đồng bộ`
          : count > 0
            ? `Ngoại tuyến — ${count} thao tác chờ đồng bộ`
            : "Đang ngoại tuyến"}
      </span>
      {online && count > 0 && (
        <button
          type="button"
          onClick={handleRetry}
          disabled={syncing}
          className="ml-1 inline-flex h-6 items-center gap-1 rounded-full bg-primary px-2 text-[11px] font-medium text-primary-foreground disabled:opacity-50"
        >
          <RefreshCw className={cn("h-3 w-3", syncing && "animate-spin")} />
          Thử lại
        </button>
      )}
    </div>
  );
}
