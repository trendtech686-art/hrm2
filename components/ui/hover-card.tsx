import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "../../lib/utils"

// CONTEXT
type HoverCardContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLElement | null>;
  openTimeoutRef: React.MutableRefObject<number | undefined>;
  closeTimeoutRef: React.MutableRefObject<number | undefined>;
};
export const HoverCardContext = React.createContext<HoverCardContextType | undefined>(undefined);

const useHoverCard = () => {
  const context = React.useContext(HoverCardContext);
  if (!context) throw new Error("useHoverCard must be used within a HoverCard");
  return context;
};

// ROOT COMPONENT
const HoverCard = ({ children }: { children?: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  // FIX: Explicitly initialize useRef with `undefined` to resolve "Expected 1 arguments, but got 0" error.
  // This ensures compatibility across different TypeScript/React type versions.
  const openTimeoutRef = React.useRef<number | undefined>(undefined);
  const closeTimeoutRef = React.useRef<number | undefined>(undefined);

  return (
    <HoverCardContext.Provider value={{ open, setOpen, triggerRef, openTimeoutRef, closeTimeoutRef }}>
      {children}
    </HoverCardContext.Provider>
  );
};


// TRIGGER
const HoverCardTrigger = ({ children, asChild }: { children?: React.ReactNode, asChild?: boolean }) => {
  const { setOpen, triggerRef, openTimeoutRef, closeTimeoutRef } = useHoverCard();
  
  const handleOpen = () => {
    clearTimeout(closeTimeoutRef.current);
    openTimeoutRef.current = window.setTimeout(() => setOpen(true), 100);
  };

  const handleClose = () => {
      clearTimeout(openTimeoutRef.current);
      closeTimeoutRef.current = window.setTimeout(() => setOpen(false), 200);
  };

  const handleRef = (node: HTMLElement) => {
    (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
    if (asChild && React.isValidElement(children) && (children as any).ref) {
      const childRef = (children as any).ref;
      if (typeof childRef === 'function') childRef(node);
      else if (childRef) childRef.current = node;
    }
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
        onMouseEnter: (e: React.MouseEvent) => {
          handleOpen();
          (children.props as any).onMouseEnter?.(e);
        },
        onMouseLeave: (e: React.MouseEvent) => {
            handleClose();
            (children.props as any).onMouseLeave?.(e);
        },
        ref: handleRef,
    });
  }
  return <div ref={handleRef as React.Ref<HTMLDivElement>} onMouseEnter={handleOpen} onMouseLeave={handleClose}>{children}</div>;
};

// CONTENT & PORTAL
const HoverCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { align?: 'start' | 'center' | 'end' }
>(({ children, className, align = 'center', ...props }, forwardedRef) => {
  const { open, setOpen, triggerRef, openTimeoutRef, closeTimeoutRef } = useHoverCard();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({ position: 'fixed', top: '-9999px', left: '-9999px' });

  React.useImperativeHandle(forwardedRef, () => contentRef.current!);

    const positioner = React.useCallback(() => {
        if (triggerRef.current && contentRef.current) {
            const contentEl = contentRef.current;
            if (contentEl.offsetHeight === 0) return;

            const triggerRect = triggerRef.current.getBoundingClientRect();
            const contentHeight = contentEl.offsetHeight;
            const contentWidth = contentEl.offsetWidth;
            const viewHeight = window.innerHeight;
            const viewWidth = window.innerWidth;
            
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
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 200);
  };
  
    React.useLayoutEffect(() => {
        if (open) {
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
      <div 
        ref={contentRef} 
        style={style}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn("z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95", className)}
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
