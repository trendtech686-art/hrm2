'use client';

import React, { forwardRef, useState, useImperativeHandle, type ReactNode, type CSSProperties, type MutableRefObject, isValidElement, type ReactElement } from "react"
import { createPortal } from "react-dom"
import { cn } from "../../lib/utils"

type HoverCardContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: MutableRefObject<HTMLElement | null>;
  openTimeoutRef: MutableRefObject<ReturnType<typeof setTimeout> | undefined>;
  closeTimeoutRef: MutableRefObject<ReturnType<typeof setTimeout> | undefined>;
};
export const HoverCardContext = React.createContext<HoverCardContextType | undefined>(undefined);

const useHoverCard = () => {
  const context = React.useContext(HoverCardContext);
  if (!context) throw new Error("useHoverCard must be used within a HoverCard");
  return context;
};

const HoverCard = ({ children }: { children?: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const openTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  return (
    <HoverCardContext.Provider value={{ open, setOpen, triggerRef, openTimeoutRef, closeTimeoutRef }}>
      {children}
    </HoverCardContext.Provider>
  );
};


const HoverCardTrigger = ({ children, asChild }: { children?: ReactNode, asChild?: boolean }) => {
  const { setOpen, triggerRef, openTimeoutRef, closeTimeoutRef } = useHoverCard();
  
  const handleOpen = () => {
    clearTimeout(closeTimeoutRef.current);
    openTimeoutRef.current = setTimeout(() => setOpen(true), 100);
  };

  const handleClose = () => {
      clearTimeout(openTimeoutRef.current);
      closeTimeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  const handleRef = (node: HTMLElement | null) => {
    triggerRef.current = node;
  }

  if (asChild && children && isValidElement<ReactElement>(children)) {
    return (
      <div
        ref={handleRef}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        {children}
      </div>
    );
  }
  return <div ref={handleRef} onMouseEnter={handleOpen} onMouseLeave={handleClose} onKeyDown={(e) => e.stopPropagation()} role="presentation">{children}</div>;
};

const HoverCardContent = forwardRef<
  HTMLDivElement,
  { children?: ReactNode; className?: string; align?: 'start' | 'center' | 'end' }
>(({ children, className, align = 'center', ...props }, forwardedRef) => {
  const { open, setOpen, triggerRef, openTimeoutRef: _openTimeoutRef, closeTimeoutRef } = useHoverCard();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<CSSProperties>({ position: 'fixed', top: '-9999px', left: '-9999px' });

  useImperativeHandle(forwardedRef, () => contentRef.current!);

  const positioner = React.useCallback(() => {
      if (triggerRef.current && contentRef.current) {
          const contentEl = contentRef.current;
          if (contentEl.offsetHeight === 0) return;

          const triggerRect = triggerRef.current.getBoundingClientRect();
          const contentHeight = contentEl.offsetHeight;
          const contentWidth = contentEl.offsetWidth;
          const viewHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
          const viewWidth = typeof window !== 'undefined' ? window.innerWidth : 600;
          
          let top = triggerRect.bottom + 8;
          if (viewHeight - triggerRect.bottom < contentHeight + 8 && triggerRect.top > contentHeight + 8) {
              top = triggerRect.top - contentHeight - 8;
          }
          if (top < 8) top = 8;
          if (top + contentHeight > viewHeight - 8) top = viewHeight - contentHeight - 8;

          let left;
          if (align === 'start') left = triggerRect.left;
          else if (align === 'center') left = triggerRect.left + triggerRect.width / 2 - contentWidth / 2;
          else left = triggerRect.right - contentWidth;

          if (left < 8) left = 8;
          if (left + contentWidth > viewWidth - 8) left = viewWidth - contentWidth - 8;

          setStyle({ position: 'fixed', top: `${top}px`, left: `${left}px` });
      }
  }, [align, triggerRef]);

  const handleMouseEnter = () => clearTimeout(closeTimeoutRef.current);
  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  };
  
  React.useLayoutEffect(() => {
      if (open && typeof window !== 'undefined') {
          positioner();
          window.addEventListener('resize', positioner);
          window.addEventListener('scroll', positioner, true);
          const observer = new ResizeObserver(positioner);
          if (contentRef.current) {
              observer.observe(contentRef.current);
          }
          return () => {
              window.removeEventListener('resize', positioner);
              window.removeEventListener('scroll', positioner, true);
              observer.disconnect();
          };
      }
  }, [open, positioner]);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true) }, []);
  if (!mounted) return null;

  return createPortal(
    open ? (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        ref={contentRef}
        style={style}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn("z-50 w-64 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95", className)}
        {...props}
      >
        {children}
      </div>
    ) : null,
    document.body
  );
});
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardTrigger, HoverCardContent };
