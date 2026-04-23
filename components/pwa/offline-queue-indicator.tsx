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
 *
 * Detection strategy:
 *  - Trust `navigator.onLine === false` immediately (browser is confident).
 *  - When `navigator.onLine === true`, verify reachability by pinging the
 *    health endpoint periodically (and on tab focus/visibility change).
 *    Only mark offline after two consecutive ping failures so transient
 *    network blips don't flip the UI.
 */

const HEALTH_URL = "/api/health";
const PING_INTERVAL_MS = 30_000;
const PING_TIMEOUT_MS = 5_000;
const OFFLINE_CONFIRM_FAILURES = 2;
const OFFLINE_DEBOUNCE_MS = 1_500;

async function pingHealth(signal: AbortSignal): Promise<boolean> {
  try {
    const res = await fetch(HEALTH_URL, {
      method: "GET",
      cache: "no-store",
      signal,
      credentials: "same-origin",
      headers: { accept: "application/json" },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function OfflineQueueIndicator() {
  const [queue, setQueue] = React.useState<QueuedAction[]>([]);
  const [online, setOnline] = React.useState<boolean>(true);
  const [syncing, setSyncing] = React.useState(false);

  const offlineTimerRef = React.useRef<number | null>(null);
  const failureCountRef = React.useRef(0);
  const mountedRef = React.useRef(false);

  // Debounced setOnline(false) to avoid flickering on transient network blips.
  const scheduleOffline = React.useCallback(() => {
    if (offlineTimerRef.current !== null) return;
    offlineTimerRef.current = window.setTimeout(() => {
      offlineTimerRef.current = null;
      if (mountedRef.current) setOnline(false);
    }, OFFLINE_DEBOUNCE_MS);
  }, []);

  const cancelOffline = React.useCallback(() => {
    if (offlineTimerRef.current !== null) {
      window.clearTimeout(offlineTimerRef.current);
      offlineTimerRef.current = null;
    }
  }, []);

  const markOnline = React.useCallback(() => {
    cancelOffline();
    failureCountRef.current = 0;
    if (mountedRef.current) setOnline(true);
  }, [cancelOffline]);

  const verifyReachability = React.useCallback(async () => {
    if (typeof navigator === "undefined") return;
    if (!navigator.onLine) {
      failureCountRef.current = OFFLINE_CONFIRM_FAILURES;
      scheduleOffline();
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(
      () => controller.abort(),
      PING_TIMEOUT_MS,
    );
    const ok = await pingHealth(controller.signal);
    window.clearTimeout(timeout);

    if (!mountedRef.current) return;

    if (ok) {
      markOnline();
    } else {
      failureCountRef.current += 1;
      if (failureCountRef.current >= OFFLINE_CONFIRM_FAILURES) {
        scheduleOffline();
      }
    }
  }, [markOnline, scheduleOffline]);

  React.useEffect(() => {
    mountedRef.current = true;
    const uninstall = installOfflineQueueRunner();
    const unsub = subscribeOfflineQueue(setQueue);

    // Sync with current browser state immediately after hydration.
    if (typeof navigator !== "undefined") {
      setOnline(navigator.onLine);
    }

    const handleOnline = () => {
      // Browser thinks we're online — verify before trusting.
      void verifyReachability();
    };
    const handleOffline = () => {
      failureCountRef.current = OFFLINE_CONFIRM_FAILURES;
      scheduleOffline();
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void verifyReachability();
      }
    };
    const handleFocus = () => {
      void verifyReachability();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);

    void getOfflineQueue().then(setQueue);

    // Initial verify + periodic re-check.
    void verifyReachability();
    const intervalId = window.setInterval(verifyReachability, PING_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      uninstall();
      unsub();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
      window.clearInterval(intervalId);
      cancelOffline();
    };
  }, [verifyReachability, scheduleOffline, cancelOffline]);

  const handleRetry = React.useCallback(async () => {
    setSyncing(true);
    try {
      await processQueue();
      await verifyReachability();
    } finally {
      setSyncing(false);
    }
  }, [verifyReachability]);

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
