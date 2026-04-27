"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Non-standard Chromium event fired before the native install prompt. Typed
// locally to avoid depending on DOM lib types that aren't always present.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISS_KEY = "pwa:install-prompt:dismissed-at";
// Hide the prompt for 14 days after the user dismisses it.
const DISMISS_TTL_MS = 14 * 24 * 60 * 60 * 1000;

// ── DB-based dismiss state (replaces localStorage) ──────────────────────────

async function fetchDismissedAt(): Promise<number | null> {
  try {
    const res = await fetch(`/api/pwa/preferences?key=${encodeURIComponent(DISMISS_KEY)}`)
    if (!res.ok) return null
    const json = await res.json()
    return json.data?.dismissedAt ?? null
  } catch {
    return null
  }
}

async function saveDismissedAt(ts: number): Promise<void> {
  await fetch("/api/pwa/preferences", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: DISMISS_KEY, dismissedAt: ts }),
  })
}

/**
 * Shows a subtle bottom banner inviting the user to install the PWA. The
 * browser-native install flow fires `beforeinstallprompt` on Chromium; on iOS
 * Safari we show a fallback hint with the "Share → Add to Home Screen" steps.
 * The banner self-hides once the app is installed or running in standalone
 * mode, and stays dismissed for two weeks after the user closes it.
 */
export function PWAInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already installed / running standalone
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS-only Safari property
      window.navigator.standalone === true;
    if (standalone) return;

    // Check dismiss state from DB (cross-device)
    void fetchDismissedAt().then((ts) => {
      if (ts) {
        const ttlMs = DISMISS_TTL_MS
        if (Date.now() - ts < ttlMs) return
      }

      const handleBeforeInstall = (event: Event) => {
        event.preventDefault();
        setDeferred(event as BeforeInstallPromptEvent);
        setVisible(true);
      };
      const handleInstalled = () => {
        setVisible(false);
        setDeferred(null);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstall);
      window.addEventListener("appinstalled", handleInstalled);

      // iOS Safari never fires `beforeinstallprompt` — show a one-time hint
      // after a small delay so it doesn't fight the initial page load.
      const ua = window.navigator.userAgent;
      const isIOS = /iphone|ipad|ipod/i.test(ua);
      const isSafari = /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua);
      let iosTimer: ReturnType<typeof setTimeout> | undefined;
      if (isIOS && isSafari) {
        iosTimer = setTimeout(() => {
          setShowIOSHint(true);
          setVisible(true);
        }, 6000);
      }

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
        window.removeEventListener("appinstalled", handleInstalled);
        if (iosTimer) clearTimeout(iosTimer);
      };
    });
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferred) return;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        setVisible(false);
      }
    } finally {
      setDeferred(null);
    }
  }, [deferred]);

  const handleDismiss = useCallback(async () => {
    setVisible(false);
    const now = Date.now();
    await saveDismissedAt(now);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cài đặt ứng dụng ERP"
      className={cn(
        "fixed inset-x-3 bottom-3 z-50 md:inset-x-auto md:right-6 md:bottom-6 md:max-w-sm",
        "rounded-2xl border border-border bg-background text-foreground shadow-lg",
        "pb-[env(safe-area-inset-bottom)]",
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Download className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">
            Cài ERP như ứng dụng
          </p>
          <p className="mt-1 text-xs text-muted-foreground leading-snug">
            {showIOSHint
              ? 'Nhấn nút "Chia sẻ" trên Safari rồi chọn "Thêm vào Màn hình chính".'
              : "Dùng nhanh hơn — truy cập không cần mở trình duyệt, hỗ trợ offline."}
          </p>
          {!showIOSHint && (
            <div className="mt-3 flex gap-2">
              <Button
                type="button"
                size="sm"
                className="h-8"
                onClick={handleInstall}
                disabled={!deferred}
              >
                Cài ngay
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8"
                onClick={handleDismiss}
              >
                Để sau
              </Button>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
