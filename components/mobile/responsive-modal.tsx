import * as React from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useMediaQuery } from "../../lib/use-media-query";
import { cn } from "../../lib/utils";

interface ResponsiveModalProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * ResponsiveModal - Automatically switches between Dialog (desktop) and Sheet (mobile)
 * Mobile-first approach: Sheet for mobile, Dialog for desktop
 */
export function ResponsiveModal({ 
  children, 
  trigger, 
  title, 
  description, 
  className,
  open,
  onOpenChange 
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog {...(open !== undefined ? { open } : {})} {...(onOpenChange !== undefined ? { onOpenChange } : {})}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className={cn("sm:max-w-[425px]", className)}>
          {(title || description) && (
            <DialogHeader>
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
          )}
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet {...(open !== undefined ? { open } : {})} {...(onOpenChange !== undefined ? { onOpenChange } : {})}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent 
        side="bottom" 
        className={cn(
          "h-[80vh] rounded-t-xl border-t",
          "data-[state=open]:slide-in-from-bottom-full",
          "data-[state=closed]:slide-out-to-bottom-full",
          className
        )}
      >
        {(title || description) && (
          <SheetHeader>
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}
        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
