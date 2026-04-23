'use client';

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "../../lib/utils"
import { useModal } from "../../contexts/modal-context"

// Use the original Dialog component
const Dialog = DialogPrimitive.Root

// Create a Context to pass ID through the Dialog component tree
const DialogContext = React.createContext<string>("");

// Provider component that accepts an ID
const DialogProvider = ({ id, children }: { id: string; children: React.ReactNode }) => {
  return <DialogContext.Provider value={id}>{children}</DialogContext.Provider>;
};

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    id?: string;
    open?: boolean;
    /**
     * When true, dialog occupies the full viewport on mobile (<md) — ideal for
     * content-heavy dialogs like product / customer pickers, big forms, etc.
     * Desktop layout is unaffected.
     * @default false (mobile shows 85vh bottom sheet)
     */
    mobileFullScreen?: boolean;
  }
>(({ className, children, id: propId, open: _open, style: propStyle, mobileFullScreen = false, ...props }, ref) => {
  const generatedId = React.useId();
  const contextId = React.useContext(DialogContext);
  const id = propId || contextId || `dialog-${generatedId}`;
  
  // Radix only mounts DialogContent when open (via Presence),
  // so always register as open. Cleanup runs on unmount (close).
  const { zIndex } = useModal(id, true, 'dialog');
  
  return (
    <DialogPortal>
      {/* Sử dụng overlay chỉ dành cho Dialog */}
      <DialogOverlay style={{ zIndex: zIndex - 1 }} />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          // Base styles (max-w-lg, p-6, rounded-lg are overridable via className + tailwind-merge)
          "dialog-content fixed z-50 grid w-full max-w-lg gap-4 border border-border bg-background p-6 rounded-lg shadow-lg duration-200",
          // Mobile: bottom sheet style (85vh) OR full-screen sheet
          mobileFullScreen
            ? [
                "max-md:max-w-none max-md:inset-0 max-md:translate-x-0 max-md:translate-y-0 max-md:rounded-none max-md:border-0 max-md:w-screen max-md:h-dvh max-md:max-h-dvh max-md:p-4 max-md:overflow-y-auto max-md:[scrollbar-width:thin]",
                "max-md:data-[state=open]:animate-in max-md:data-[state=open]:slide-in-from-bottom max-md:data-[state=open]:fade-in-0",
                "max-md:data-[state=closed]:animate-out max-md:data-[state=closed]:slide-out-to-bottom max-md:data-[state=closed]:fade-out-0",
              ]
            : [
                "max-md:max-w-none max-md:bottom-0 max-md:left-0 max-md:top-auto max-md:translate-x-0 max-md:translate-y-0 max-md:rounded-t-2xl max-md:rounded-b-none max-md:max-h-[85vh] max-md:overflow-y-auto max-md:p-4 max-md:pb-8",
                "max-md:data-[state=open]:animate-in max-md:data-[state=open]:slide-in-from-bottom max-md:data-[state=open]:fade-in-0",
                "max-md:data-[state=closed]:animate-out max-md:data-[state=closed]:slide-out-to-bottom max-md:data-[state=closed]:fade-out-0",
              ],
          // Desktop: centered modal + animations
          "md:left-[50%] md:top-[50%] md:translate-x-[-50%] md:translate-y-[-50%]",
          "md:data-[state=open]:animate-in md:data-[state=open]:fade-in-0 md:data-[state=open]:zoom-in-95",
          "md:data-[state=closed]:animate-out md:data-[state=closed]:fade-out-0 md:data-[state=closed]:zoom-out-95",
          className
        )}
        {...props}
        style={{ ...propStyle, zIndex }}
      >
        {/* Mobile drag handle indicator (only on bottom-sheet mode, not full-screen) */}
        {!mobileFullScreen && (
          <div className="mx-auto w-10 h-1 rounded-full bg-muted-foreground/20 shrink-0 md:hidden" />
        )}
        <DialogProvider id={id}>
          {children}
          <DialogPrimitive.Close
            aria-label="Đóng"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Đóng</span>
          </DialogPrimitive.Close>
        </DialogProvider>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogProvider,
}
