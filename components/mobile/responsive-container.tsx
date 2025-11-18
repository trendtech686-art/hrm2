import * as React from "react";
import { cn } from "../../lib/utils";

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

/**
 * ResponsiveContainer - Mobile-first container with responsive padding and max-width
 * Handles safe areas for mobile devices with notches
 */
export function ResponsiveContainer({ 
  children, 
  className,
  maxWidth = "full",
  padding = "md",
  ...props 
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full"
  };

  const paddingClasses = {
    none: "",
    sm: "px-2 sm:px-4",
    md: "px-4 sm:px-6 lg:px-8",
    lg: "px-6 sm:px-8 lg:px-12"
  };

  return (
    <div 
      className={cn(
        "w-full mx-auto",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        // Safe area handling for mobile devices
        "pl-safe-left pr-safe-right",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * MobileSafeArea - Wrapper for full-screen mobile layouts
 * Handles safe areas including status bar and home indicator
 */
export function MobileSafeArea({ 
  children, 
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "min-h-screen",
        "pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
