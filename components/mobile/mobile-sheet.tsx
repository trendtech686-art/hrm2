import * as React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { TouchButton } from "./touch-button";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface MobileSheetProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

/**
 * MobileSheet - Mobile-optimized sheet/drawer component
 * Features:
 * - Full-height on mobile for better UX
 * - Touch-friendly close button
 * - Gesture support via Radix Sheet
 * - Proper keyboard navigation
 */
export function MobileSheet({
  children,
  trigger,
  title,
  description,
  footer,
  open,
  onOpenChange,
  side = "bottom",
  className,
}: MobileSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      
      <SheetContent
        side={side}
        className={cn(
          // Mobile optimizations
          "flex flex-col max-h-[95vh] w-full",
          "sm:max-w-md", // Limit width on larger screens
          className
        )}
      >
        {/* Header with close button */}
        {(title || description) && (
          <SheetHeader className="flex-shrink-0 space-y-2 pb-4 text-left">
            <div className="flex items-center justify-between">
              {title && (
                <SheetTitle className="text-lg font-semibold">
                  {title}
                </SheetTitle>
              )}
              <SheetClose asChild>
                <TouchButton
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-2 h-8 w-8"
                  aria-label="Đóng"
                >
                  <X className="h-4 w-4" />
                </TouchButton>
              </SheetClose>
            </div>
            {description && (
              <SheetDescription className="text-sm text-muted-foreground">
                {description}
              </SheetDescription>
            )}
          </SheetHeader>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto py-2">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <SheetFooter className="flex-shrink-0 pt-4 border-t">
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
