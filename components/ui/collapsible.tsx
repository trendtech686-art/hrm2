'use client';

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"

// --- Context ---
type CollapsibleContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CollapsibleContext = React.createContext<CollapsibleContextType | undefined>(undefined);

const useCollapsible = () => {
  const context = React.useContext(CollapsibleContext);
  if (!context) {
    throw new Error("useCollapsible must be used within a Collapsible");
  }
  return context;
};

// --- Components ---
const Collapsible = ({
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
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const _setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;
  
  const handleOpenChange = (newOpen: boolean) => {
    if (setControlledOpen) {
      setControlledOpen(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  }

  return <CollapsibleContext.Provider value={{ open, setOpen: handleOpenChange }}>{children}</CollapsibleContext.Provider>;
};

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ children, asChild: _asChild = false, onClick, ...props }, ref) => {
  const { open, setOpen } = useCollapsible();
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(!open);
    onClick?.(e);
  };

  if (_asChild && React.isValidElement(children)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return React.cloneElement(children as any, {
      ref: ref,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        handleClick(e);
        // FIX: Cast `children.props` to access and call the original `onClick` handler if it exists.
        const childProps = children.props as React.HTMLAttributes<HTMLButtonElement>;
        if (childProps.onClick) {
          childProps.onClick(e);
        }
      },
      "data-state": open ? "open" : "closed",
      ...props,
    });
  }
  
  return (
    <button type="button" ref={ref} onClick={handleClick} data-state={open ? "open" : "closed"} {...props}>
      {children}
    </button>
  );
});
CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open } = useCollapsible();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          ref={ref}
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: "auto" },
            collapsed: { opacity: 0, height: 0 },
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          <div className={cn("pt-0", className)} {...props}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
