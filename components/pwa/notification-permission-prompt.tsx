"use client";

import * as React from "react";
import { Bell, BellOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const DISMISS_KEY = "pwa-notif-prompt-dismissed-at";
const DISMISS_TTL_DAYS = 14;

/** Converts a URL-safe base64 VAPID public key into the Uint8Array format
 *  expected by PushManager.subscribe. */
function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const base64Std = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64Std);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) out[i] = raw.charCodeAt(i);
  return out;
}

type Stage =
  | "idle"
  | "unsupported"
  | "denied"
  | "granted"
  | "subscribed"
  | "registering";

/**
 * Subtle banner that walks the user through enabling web push notifications.
 * Designed to be rendered once near the root of the authenticated shell.
 * Noop when push is not supported (iOS PWA not installed, older browsers, …).
 */
export function NotificationPermissionPrompt() {
  const [stage, setStage] = React.useState<Stage>("idle");
  const [visible, setVisible] = React.useState(false);

  // Decide whether to show ourselves based on permission state + dismiss TTL.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setStage("unsupported");
      return;
    }
    const permission = Notification.permission;
    if (permission === "granted") {
      setStage("granted");
      return;
    }
    if (permission === "denied") {
      setStage("denied");
      return;
    }
    try {
      const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) ?? "0");
      const ttlMs = DISMISS_TTL_DAYS * 24 * 60 * 60 * 1000;
      if (dismissedAt && Date.now() - dismissedAt < ttlMs) return;
    } catch {
      // localStorage unavailable (Safari private mode) — still OK to show prompt.
    }
    // Small delay so we don't compete with app-launch chrome.
    const t = window.setTimeout(() => setVisible(true), 4000);
    return () => window.clearTimeout(t);
  }, []);

  const handleDismiss = React.useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  }, []);

  const handleEnable = React.useCallback(async () => {
    setStage("registering");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStage(permission === "denied" ? "denied" : "idle");
        if (permission === "denied") {
          toast.info("Thông báo đã bị chặn. Mở cài đặt trình duyệt để bật lại.");
        }
        handleDismiss();
        return;
      }

      const keyRes = await fetch("/api/push/vapid-public-key");
      if (!keyRes.ok) throw new Error("Push chưa được cấu hình trên server");
      const { data } = (await keyRes.json()) as { data: { publicKey: string } };
      const vapidKey = data?.publicKey;
      if (!vapidKey) throw new Error("Thiếu VAPID public key");

      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      const subscription =
        existing ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        }));

      const json = subscription.toJSON();
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: json.keys,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        }),
      });

      setStage("subscribed");
      setVisible(false);
      toast.success("Đã bật thông báo đẩy");
    } catch (err) {
      setStage("idle");
      toast.error(err instanceof Error ? err.message : "Không bật được thông báo");
    }
  }, [handleDismiss]);

  if (!visible || stage === "unsupported" || stage === "granted" || stage === "subscribed") {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      className={cn(
        "fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-lg border border-border bg-background shadow-lg",
        "md:left-auto md:right-4",
      )}
    >
      <div className="flex items-start gap-3 p-3">
        <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
          {stage === "denied" ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {stage === "denied" ? "Thông báo đang bị chặn" : "Bật thông báo đẩy"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {stage === "denied"
              ? "Vào cài đặt trình duyệt để cấp lại quyền thông báo cho ERP."
              : "Nhận cập nhật đơn hàng, công việc và nhắc lịch ngay cả khi bạn đóng tab."}
          </p>
          {stage !== "denied" && (
            <div className="mt-2 flex gap-2">
              <Button size="sm" className="h-7 px-3" onClick={handleEnable} disabled={stage === "registering"}>
                {stage === "registering" ? "Đang bật…" : "Bật thông báo"}
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-3" onClick={handleDismiss}>
                Để sau
              </Button>
            </div>
          )}
        </div>
        <button
          type="button"
          aria-label="Đóng"
          onClick={handleDismiss}
          className="shrink-0 rounded p-1 text-muted-foreground hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
