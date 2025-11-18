import * as React from "react";
import { ChevronLeft, MoreVertical } from "lucide-react";
import { cn } from "../../lib/utils";
import { TouchButton } from "./touch-button";
import { useMediaQuery } from "../../lib/use-media-query";

interface MobileNavbarProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * MobileNavbar - Mobile-optimized navigation bar
 * Features:
 * - Touch-friendly back button (44px+)
 * - Safe area handling for notches
 * - Responsive typography
 * - Gesture support
 */
export function MobileNavbar({
  title,
  subtitle,
  onBack,
  showBackButton = true,
  actions,
  className,
}: MobileNavbarProps) {
  const isMobile = !useMediaQuery("(min-width: 768px)");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        // Safe area for mobile notches
        "safe-area-inset-top",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left Section - Back Button */}
        <div className="flex items-center space-x-2">
          {showBackButton && onBack && (
            <TouchButton
              variant="ghost"
              size={isMobile ? "sm" : "default"}
              onClick={onBack}
              aria-label="Quay lại"
              className="rounded-full p-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </TouchButton>
          )}
        </div>

        {/* Center Section - Title */}
        <div className="flex-1 mx-4 text-center">
          <h1 className={cn(
            "font-semibold truncate",
            isMobile ? "text-lg" : "text-xl"
          )}>
            {title}
          </h1>
          {subtitle && (
            <p className={cn(
              "text-muted-foreground truncate",
              isMobile ? "text-xs" : "text-sm"
            )}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          {actions || (
            <TouchButton
              variant="ghost"
              size={isMobile ? "sm" : "default"}
              aria-label="Tùy chọn"
              className="rounded-full p-2"
            >
              <MoreVertical className="h-5 w-5" />
            </TouchButton>
          )}
        </div>
      </div>
    </header>
  );
}
