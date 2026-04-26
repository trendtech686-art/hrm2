"use client";

/**
 * Haptic feedback hook for mobile devices.
 * Provides vibration feedback for touch interactions.
 * Falls back gracefully on desktop or unsupported browsers.
 */

export type HapticType = 
  | "light"    // Light tap feedback
  | "medium"   // Medium impact
  | "heavy"    // Strong impact
  | "success"  // Success notification
  | "warning"  // Warning notification  
  | "error";   // Error notification

const HAPTIC_PATTERNS: Record<HapticType, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 10],
  warning: [10, 30, 10, 30, 10],
  error: [30, 100, 30],
};

function isSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "vibrate" in navigator;
}

function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Hook for triggering haptic feedback on mobile devices.
 * 
 * @example
 * ```tsx
 * const { trigger } = useHaptics();
 * 
 * // On button click
 * <Button onClick={() => trigger('light')}>Tap</Button>
 * 
 * // On success
 * <Button onClick={() => trigger('success')}>Done!</Button>
 * ```
 */
export function useHaptics() {
  const trigger = (type: HapticType = "light") => {
    if (!isSupported() || isReducedMotion()) return;
    
    try {
      const pattern = HAPTIC_PATTERNS[type];
      navigator.vibrate(pattern);
    } catch {
      // Silently fail if vibration API fails
    }
  };

  return { trigger };
}

/**
 * Trigger haptic feedback without using the hook.
 * Useful for one-off calls in callbacks.
 */
export function triggerHaptic(type: HapticType = "light"): void {
  if (!isSupported() || isReducedMotion()) return;
  
  try {
    const pattern = HAPTIC_PATTERNS[type];
    navigator.vibrate(pattern);
  } catch {
    // Silently fail
  }
}
