import * as React from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "../../lib/utils"

// --- Context ---
type DrawerContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DrawerContext = React.createContext<DrawerContextType | undefined>(undefined);

const useDrawer = () => {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a Drawer");
  }
  return context;
};

// --- Components ---
const Drawer = ({
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
  const setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;
  return <DrawerContext.Provider value={{ open, setOpen }}>{children}</DrawerContext.Provider>;
};

const DrawerTrigger = ({ children, asChild = false }: { children?: React.ReactNode, asChild?: boolean }) => {
  const { setOpen } = useDrawer();
  const handleClick = () => setOpen(true);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        handleClick();
        if ((children.props as any).onClick) {
          (children.props as any).onClick(e);
        }
      },
    });
  }
  return <div onClick={handleClick}>{children}</div>;
};

const DrawerClose = ({ children, asChild = false }: { children?: React.ReactNode, asChild?: boolean }) => {
  const { setOpen } = useDrawer();
  const handleClick = () => setOpen(false);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
       onClick: (e: React.MouseEvent) => {
        handleClick();
        if ((children.props as any).onClick) {
          (children.props as any).onClick(e);
        }
      },
    });
  }
  return <div onClick={handleClick}>{children}</div>;
}


const DrawerPortal = ({ children }: { children?: React.ReactNode }) => {
  const { open } = useDrawer();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  return mounted ? createPortal(
    <AnimatePresence>{open ? children : null}</AnimatePresence>,
    document.body
  ) : null;
};

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof motion.div>,
  React.ComponentPropsWithoutRef<typeof motion.div>
>(({ className, ...props }, ref) => {
    const { setOpen } = useDrawer();
    return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className={cn(
            "fixed inset-0 z-50 bg-black/80",
            className
          )}
          {...props}
        />
    )
});
DrawerOverlay.displayName = "DrawerOverlay";

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof motion.div>,
  React.ComponentPropsWithoutRef<typeof motion.div>
>(({ className, children, ...props }, ref) => {
  const { setOpen } = useDrawer();
  
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setOpen]);
  
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <motion.div
        ref={ref}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
          className
        )}
        {...props}
      >
        {/* FIX: Wrap children in a fragment to resolve type mismatch on motion.div's children prop. */}
        <>
          <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
          {children}
        </>
      </motion.div>
    </DrawerPortal>
  );
});
DrawerContent.displayName = "DrawerContent";


const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
