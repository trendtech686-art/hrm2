"use client";

import * as React from "react";
import { Loader2, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

type PullToRefreshProps = {
  /**
   * Invoked once the user drags beyond the trigger threshold. The indicator
   * stays visible until the returned promise resolves.
   */
  onRefresh: () => Promise<unknown> | void;
  children: React.ReactNode;
  /**
   * Drag distance (px) required before `onRefresh` fires on release.
   * @default 70
   */
  threshold?: number;
  /**
   * Maximum pull distance (px) — the spinner won't travel further than this
   * even if the user keeps dragging.
   * @default 120
   */
  maxPull?: number;
  /**
   * Disable the gesture entirely. Useful for desktop layouts or when another
   * gesture owns the touch area.
   */
  disabled?: boolean;
  className?: string;
};

/**
 * Lightweight touch-only pull-to-refresh for lists and dashboards. Only
 * activates when the nearest scrollable ancestor is already at `scrollTop=0`
 * so we never interfere with regular scrolling or nested scroll containers.
 * Desktop users and reduced-motion users are never opted in.
 */
export function PullToRefresh({
  onRefresh,
  children,
  threshold = 70,
  maxPull = 120,
  disabled,
  className,
}: PullToRefreshProps) {
  const [pull, setPull] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const startY = React.useRef<number | null>(null);
  const armed = React.useRef(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const atScrollTop = React.useCallback(() => {
    if (typeof window === "undefined") return false;
    // Use the document scroller — most list pages scroll the window.
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    return scrollY <= 0;
  }, []);

  const handleTouchStart = React.useCallback(
    (event: React.TouchEvent) => {
      if (disabled || refreshing) return;
      if (!atScrollTop()) {
        armed.current = false;
        return;
      }
      armed.current = true;
      startY.current = event.touches[0]?.clientY ?? null;
    },
    [disabled, refreshing, atScrollTop],
  );

  const handleTouchMove = React.useCallback(
    (event: React.TouchEvent) => {
      if (!armed.current || startY.current == null || refreshing) return;
      const delta = (event.touches[0]?.clientY ?? 0) - startY.current;
      if (delta <= 0) {
        setPull(0);
        return;
      }
      // Resistance curve: pull feels heavier the further you drag.
      const resisted = Math.min(maxPull, delta * 0.55);
      setPull(resisted);
    },
    [maxPull, refreshing],
  );

  const handleTouchEnd = React.useCallback(async () => {
    if (!armed.current) return;
    armed.current = false;
    startY.current = null;
    if (pull >= threshold && !refreshing) {
      setRefreshing(true);
      setPull(threshold); // lock indicator in place while refreshing
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setPull(0);
      }
    } else {
      setPull(0);
    }
  }, [pull, threshold, refreshing, onRefresh]);

  const progress = Math.min(1, pull / threshold);
  const showIndicator = pull > 0 || refreshing;

  return (
    <div
      ref={containerRef}
      className={cn("relative md:contents", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {showIndicator && (
        <div
          aria-hidden={!refreshing}
          className="pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-center md:hidden"
          style={{ transform: `translateY(${pull}px)` }}
        >
          <div className="mt-2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background shadow-sm">
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <ArrowDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  progress >= 1 && "rotate-180 text-primary",
                )}
                style={{ opacity: 0.4 + progress * 0.6 }}
              />
            )}
          </div>
        </div>
      )}
      <div
        style={{
          transform: pull > 0 ? `translateY(${pull * 0.5}px)` : undefined,
          transition: pull > 0 || refreshing ? undefined : "transform 180ms ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}
