"use client";

/**
 * Swipeable row component for mobile swipe-to-reveal actions.
 * Supports left swipe (reveal actions on right) and right swipe (reveal actions on left).
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSwipeGesture, type SwipeDirection } from "@/hooks/use-swipe-gesture";
import { triggerHaptic, type HapticType } from "@/hooks/use-haptics";

export type SwipeAction = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
  hapticType?: HapticType;
};

type SwipeableRowProps = {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  threshold?: number;
  disabled?: boolean;
  className?: string;
};

const ACTION_WIDTH = 80;

export function SwipeableRow({
  children,
  leftActions = [],
  rightActions = [],
  threshold = 50,
  disabled = false,
  className,
}: SwipeableRowProps) {
  const { ref, deltaX, isSwiping, direction } = useSwipeGesture({
    threshold,
    direction: "horizontal",
    disabledOnDesktop: true,
  });

  // Determine which actions to show based on swipe direction
  const showLeftActions = direction === "left" && leftActions.length > 0;
  const showRightActions = direction === "right" && rightActions.length > 0;

  // Calculate translateX for the content
  const maxLeftTranslate = leftActions.length * ACTION_WIDTH;
  const maxRightTranslate = rightActions.length * ACTION_WIDTH;

  let translateX = deltaX;
  if (direction === "left") {
    translateX = Math.max(-maxLeftTranslate, deltaX);
  } else if (direction === "right") {
    translateX = Math.min(maxRightTranslate, deltaX);
  }

  const handleActionClick = (action: SwipeAction) => {
    if (action.hapticType) {
      triggerHaptic(action.hapticType);
    }
    action.onClick();
  };

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {/* Left actions (revealed on swipe left) */}
      {leftActions.length > 0 && (
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 flex items-center transition-opacity",
            isSwiping && direction === "left" ? "opacity-100" : "pointer-events-none"
          )}
          style={{ width: Math.abs(deltaX) }}
        >
          {leftActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className={cn(
                "flex h-full flex-col items-center justify-center px-3 text-white",
                action.className
              )}
              style={{ width: ACTION_WIDTH, backgroundColor: action.className?.includes("bg-") ? undefined : "var(--primary)" }}
            >
              {action.icon && <span className="mb-1">{action.icon}</span>}
              <span className="text-xs">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      <div
        className={cn(
          "relative bg-background transition-transform duration-200 ease-out",
          isSwiping ? "transition-none" : ""
        )}
        style={{ transform: `translateX(${translateX}px)` }}
      >
        {children}
      </div>

      {/* Right actions (revealed on swipe right) */}
      {rightActions.length > 0 && (
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 flex items-center transition-opacity",
            isSwiping && direction === "right" ? "opacity-100" : "pointer-events-none"
          )}
          style={{ width: Math.abs(deltaX) }}
        >
          {rightActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className={cn(
                "flex h-full flex-col items-center justify-center px-3 text-white",
                action.className
              )}
              style={{ width: ACTION_WIDTH, backgroundColor: action.className?.includes("bg-") ? undefined : "var(--destructive)" }}
            >
              {action.icon && <span className="mb-1">{action.icon}</span>}
              <span className="text-xs">{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
