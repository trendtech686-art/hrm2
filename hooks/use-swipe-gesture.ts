"use client";

/**
 * Swipe gesture hook for mobile devices.
 * Supports swipe left/right to reveal actions (like delete, edit).
 */

import * as React from "react";

export type SwipeDirection = "left" | "right" | "up" | "down" | "none";

export type SwipeState = {
  direction: SwipeDirection;
  deltaX: number;
  deltaY: number;
  isSwiping: boolean;
};

export type SwipeHandlers = {
  onSwipeLeft?: (distance: number) => void;
  onSwipeRight?: (distance: number) => void;
  onSwipeUp?: (distance: number) => void;
  onSwipeDown?: (distance: number) => void;
};

type UseSwipeGestureOptions = {
  /** Minimum distance (px) to trigger swipe */
  threshold?: number;
  /** Maximum distance (px) to track */
  maxDistance?: number;
  /** Direction to track */
  direction?: "horizontal" | "vertical" | "both";
  /** handlers */
  handlers?: SwipeHandlers;
  /** Disable on desktop */
  disabledOnDesktop?: boolean;
};

const DEFAULT_THRESHOLD = 50;
const DEFAULT_MAX_DISTANCE = 150;

/**
 * Hook for detecting swipe gestures on touch devices.
 * 
 * @example
 * ```tsx
 * const { ref, isSwiping, direction } = useSwipeGesture({
 *   handlers: {
 *     onSwipeLeft: () => handleDelete(),
 *   },
 * });
 * 
 * return (
 *   <div ref={ref}>
 *     <div className="action-layer">Delete</div>
 *     Content here
 *   </div>
 * );
 * ```
 */
export function useSwipeGesture(options: UseSwipeGestureOptions = {}) {
  const {
    threshold = DEFAULT_THRESHOLD,
    maxDistance = DEFAULT_MAX_DISTANCE,
    direction = "horizontal",
    handlers = {},
    disabledOnDesktop = true,
  } = options;

  const ref = React.useRef<HTMLElement | null>(null);
  const [state, setState] = React.useState<SwipeState>({
    direction: "none",
    deltaX: 0,
    deltaY: 0,
    isSwiping: false,
  });

  const startX = React.useRef(0);
  const startY = React.useRef(0);
  const currentX = React.useRef(0);
  const currentY = React.useRef(0);
  const isTracking = React.useRef(false);
  const startTime = React.useRef(0);

  const isDesktop = React.useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
    if (disabledOnDesktop && isDesktop()) return;
    
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    currentX.current = touch.clientX;
    currentY.current = touch.clientY;
    startTime.current = Date.now();
    isTracking.current = true;

    setState({
      direction: "none",
      deltaX: 0,
      deltaY: 0,
      isSwiping: false,
    });
  }, [disabledOnDesktop, isDesktop]);

  const handleTouchMove = React.useCallback((e: TouchEvent) => {
    if (!isTracking.current) return;

    const touch = e.touches[0];
    currentX.current = touch.clientX;
    currentY.current = touch.clientY;

    const deltaX = currentX.current - startX.current;
    const deltaY = currentY.current - startY.current;

    // Determine dominant direction
    let swipeDir: SwipeDirection = "none";
    
    if (direction === "horizontal" || direction === "both") {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        swipeDir = deltaX > 0 ? "right" : "left";
      }
    }
    
    if (direction === "vertical" || direction === "both") {
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
        swipeDir = deltaY > 0 ? "down" : "up";
      }
    }

    // Clamp distance
    const clampedX = Math.max(-maxDistance, Math.min(maxDistance, deltaX));
    const clampedY = Math.max(-maxDistance, Math.min(maxDistance, deltaY));

    setState({
      direction: swipeDir,
      deltaX: clampedX,
      deltaY: clampedY,
      isSwiping: true,
    });
  }, [direction, maxDistance]);

  const handleTouchEnd = React.useCallback(() => {
    if (!isTracking.current) return;
    
    isTracking.current = false;

    const deltaX = currentX.current - startX.current;
    const deltaY = currentY.current - startY.current;
    const duration = Date.now() - startTime.current;

    // Calculate velocity
    const velocityX = Math.abs(deltaX) / duration;
    const velocityY = Math.abs(deltaY) / duration;

    // Trigger if distance or velocity is sufficient
    const triggerLeft = Math.abs(deltaX) > threshold || velocityX > 0.5;
    const triggerUp = Math.abs(deltaY) > threshold || velocityY > 0.5;

    if (direction !== "vertical" && triggerLeft) {
      if (deltaX < 0 && handlers.onSwipeLeft) {
        handlers.onSwipeLeft(Math.abs(deltaX));
      } else if (deltaX > 0 && handlers.onSwipeRight) {
        handlers.onSwipeRight(deltaX);
      }
    }

    if (direction !== "horizontal" && triggerUp) {
      if (deltaY < 0 && handlers.onSwipeUp) {
        handlers.onSwipeUp(Math.abs(deltaY));
      } else if (deltaY > 0 && handlers.onSwipeDown) {
        handlers.onSwipeDown(deltaY);
      }
    }

    // Reset state
    setState({
      direction: "none",
      deltaX: 0,
      deltaY: 0,
      isSwiping: false,
    });
  }, [direction, threshold, handlers]);

  // Attach event listeners
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const onTouchMove = (e: TouchEvent) => handleTouchMove(e);
    const onTouchEnd = () => handleTouchEnd();
    const onTouchCancel = () => handleTouchEnd();

    element.addEventListener("touchmove", onTouchMove, { passive: true });
    element.addEventListener("touchend", onTouchEnd, { passive: true });
    element.addEventListener("touchcancel", onTouchCancel, { passive: true });

    return () => {
      element.removeEventListener("touchmove", onTouchMove);
      element.removeEventListener("touchend", onTouchEnd);
      element.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [handleTouchMove, handleTouchEnd]);

  const bind = React.useCallback(
    (node: HTMLElement | null) => {
      if (node) {
        ref.current = node;
        node.addEventListener("touchstart", handleTouchStart as unknown as EventListener, { passive: true });
      }
    },
    [handleTouchStart]
  );

  return {
    ref: bind,
    ...state,
    isThresholdMet: Math.abs(state.deltaX) > threshold || Math.abs(state.deltaY) > threshold,
  };
}
