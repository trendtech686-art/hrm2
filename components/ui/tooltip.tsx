import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "../../lib/utils.ts"

// --- Provider for global settings ---
type TooltipProviderProps = {
  // FIX: Made children optional to resolve a TypeScript error where the compiler failed to infer the children prop from JSX.
  children?: React.ReactNode;
  delayDuration?: number;
};

const TooltipProviderContext = React.createContext<{ delayDuration: number }>({
  delayDuration: 300,
});

const TooltipProvider = ({ children, delayDuration = 300 }: TooltipProviderProps) => {
  return (
    <TooltipProviderContext.Provider value={{ delayDuration }}>
      {children}
    </TooltipProviderContext.Provider>
  );
};

// --- Individual Tooltip Context ---
type TooltipContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
};

const TooltipContext = React.createContext<TooltipContextType | undefined>(undefined);

const useTooltip = () => {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error("useTooltip must be used within a Tooltip");
  }
  return context;
};

// --- Components ---
const Tooltip = ({
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  defaultOpen = false,
}: {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const triggerRef = React.useRef<HTMLElement>(null);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

  return (
    <TooltipContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </TooltipContext.Provider>
  );
};

const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { asChild?: boolean }
>(({ children, asChild = false, ...props }, ref) => {
  const { setOpen, triggerRef } = useTooltip();
  const { delayDuration } = React.useContext(TooltipProviderContext);
  // FIX: Initialize useRef with `undefined` to resolve "Expected 1 arguments, but got 0" error
  // and to correctly type the ref, which can hold either a number (timeout ID) or undefined.
  const openTimeoutRef = React.useRef<number | undefined>(undefined);

  const handleRef = (node: HTMLElement | null) => {
    (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
     if (typeof ref === 'function') ref(node);
     else if (ref) ref.current = node;
  };

  const handleOpen = () => {
    clearTimeout(openTimeoutRef.current);
    openTimeoutRef.current = window.setTimeout(() => setOpen(true), delayDuration);
  };

  const handleClose = () => {
    clearTimeout(openTimeoutRef.current);
    setOpen(false);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ref: handleRef,
      onMouseEnter: (e: React.MouseEvent) => {
        handleOpen();
        (children.props as any).onMouseEnter?.(e);
      },
      onMouseLeave: (e: React.MouseEvent) => {
        handleClose();
        (children.props as any).onMouseLeave?.(e);
      },
      onFocus: (e: React.FocusEvent) => {
        handleOpen();
        (children.props as any).onFocus?.(e);
      },
      onBlur: (e: React.FocusEvent) => {
        handleClose();
        (children.props as any).onBlur?.(e);
      },
      ...props,
    });
  }

  return React.createElement(
    'div',
    {
      ...props,
      ref: handleRef,
      onMouseEnter: handleOpen,
      onMouseLeave: handleClose,
      onFocus: handleOpen,
      onBlur: handleClose,
    },
    children
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

// FIX: Changed props to extend from `motion.div` props to resolve type conflict when spreading `...props`.
// `React.HTMLAttributes` is not fully compatible with framer-motion's custom props.
const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof motion.div> & { side?: 'top' | 'right' | 'bottom' | 'left'; sideOffset?: number }
>(({ className, side = 'top', sideOffset = 4, children, ...props }, forwardedRef) => {
  const { open, triggerRef } = useTooltip();
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

            let top = 0;
            let left = 0;

            switch (side) {
                case 'top':
                    top = triggerRect.top - contentHeight - sideOffset;
                    left = triggerRect.left + (triggerRect.width / 2) - (contentWidth / 2);
                    break;
                case 'bottom':
                    top = triggerRect.bottom + sideOffset;
                    left = triggerRect.left + (triggerRect.width / 2) - (contentWidth / 2);
                    break;
                case 'left':
                    top = triggerRect.top + (triggerRect.height / 2) - (contentHeight / 2);
                    left = triggerRect.left - contentWidth - sideOffset;
                    break;
                case 'right':
                    top = triggerRect.top + (triggerRect.height / 2) - (contentHeight / 2);
                    left = triggerRect.right + sideOffset;
                    break;
            }

            setStyle({ position: 'fixed', top: `${top}px`, left: `${left}px` });
        }
    }, [side, sideOffset, triggerRef]);


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
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          style={style as any}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          className={cn(
            "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
            className
          )}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
