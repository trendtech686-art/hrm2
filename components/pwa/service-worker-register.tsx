"use client";

import { useEffect } from "react";

/**
 * Registers the PWA service worker after the page has finished loading. Runs
 * only in the browser, only in production, and only when the browser supports
 * Service Workers. Failures are swallowed — we never want registration errors
 * to crash the app shell.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {
          // Offline-first is best-effort; silently ignore registration errors.
        });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }
  }, []);

  return null;
}
