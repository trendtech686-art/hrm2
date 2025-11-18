import * as React from "react";
import { cn } from "../../lib/utils";
import { useMediaQuery } from "../../lib/use-media-query";

interface MobileGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  minItemWidth?: number;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * MobileGrid - Responsive grid that adapts to screen size
 * Features:
 * - Single column on mobile for better UX
 * - Auto-fit columns on larger screens
 * - Minimum item width for optimal layout
 * - Touch-friendly spacing
 */
export function MobileGrid({
  children,
  minItemWidth = 280,
  gap = "md",
  className,
  ...props
}: MobileGridProps) {
  const isMobile = !useMediaQuery("(min-width: 768px)");

  const gapClasses = {
    sm: "gap-2",
    md: "gap-4", 
    lg: "gap-6"
  };

  return (
    <div
      className={cn(
        "grid w-full",
        gapClasses[gap],
        isMobile 
          ? "grid-cols-1" // Single column on mobile
          : `grid-cols-[repeat(auto-fit,minmax(${minItemWidth}px,1fr))]`, // Auto-fit on desktop
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
