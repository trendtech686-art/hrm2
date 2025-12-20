

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "../../lib/utils"

// CONTEXT
type ContextMenuContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  position: { x: number; y: number };
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
};

export const ContextMenuContext = React.createContext<ContextMenuContextType>({
  open: false,
  setOpen: () => {},
  position: { x: 0, y: 0 },
  setPosition: () => {},
});

// ROOT COMPONENT
const ContextMenu = ({ children }: { children?: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  return (
    <ContextMenuContext.Provider value={{ open, setOpen, position, setPosition }}>
      {children}
    </ContextMenuContext.Provider>
  );
};

// TRIGGER
const ContextMenuTrigger = ({ children, asChild }: { children?: React.ReactNode, asChild?: boolean }) => {
  const { setOpen, setPosition } = React.useContext(ContextMenuContext);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setOpen(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onContextMenu: (e: React.MouseEvent) => {
        handleContextMenu(e);
        if ((children.props as any).onContextMenu) {
          (children.props as any).onContextMenu(e);
        }
      },
    });
  }

  return (
    <div onContextMenu={handleContextMenu}>
      {children}
    </div>
  );
};

// CONTENT & PORTAL
const ContextMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, forwardedRef) => {
  const { open, setOpen, position } = React.useContext(ContextMenuContext);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({ position: 'fixed', top: '-9999px', left: '-9999px' });

  React.useImperativeHandle(forwardedRef, () => contentRef.current!);

  React.useLayoutEffect(() => {
    if (open && contentRef.current) {
      const contentEl = contentRef.current;
      // If the content isn't rendered with dimensions yet, wait.
      if (contentEl.offsetHeight === 0) return;

      const contentHeight = contentEl.offsetHeight;
      const contentWidth = contentEl.offsetWidth;
      const viewHeight = window.innerHeight;
      const viewWidth = window.innerWidth;
      
      let top = position.y;
      // Adjust if it overflows the bottom
      if (top + contentHeight > viewHeight - 8) {
        top = viewHeight - contentHeight - 8;
      }
      // Adjust if it overflows the top
      if (top < 8) {
          top = 8;
      }

      let left = position.x;
      // Adjust if it overflows the right
      if (left + contentWidth > viewWidth - 8) {
        left = viewWidth - contentWidth - 8;
      }
      // Adjust if it overflows the left
      if (left < 8) {
          left = 8;
      }

      setStyle({
          position: 'fixed',
          top: `${top}px`,
          left: `${left}px`,
      });
    }
  }, [open, position, contentRef.current?.offsetHeight]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleScrollAndResize = () => {
        setOpen(false);
    };
    if (open) {
        // Defer attachment to prevent the context menu event from closing itself
        const timerId = setTimeout(() => {
            document.addEventListener("click", handleClickOutside);
            document.addEventListener("contextmenu", handleClickOutside); // also close on another right click
            window.addEventListener("scroll", handleScrollAndResize, true);
            window.addEventListener("resize", handleScrollAndResize);
        }, 0);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            clearTimeout(timerId);
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("contextmenu", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("scroll", handleScrollAndResize, true);
            window.removeEventListener("resize", handleScrollAndResize);
        }
    }
  }, [open, setOpen]);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true) }, []);

  if (!mounted) return null;

  return createPortal(
    open ? (
      <div 
        ref={contentRef} 
        style={style}
        className={cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95", className)}
        {...props}
      >
        {children}
      </div>
    ) : null,
    document.body
  );
});
ContextMenuContent.displayName = "ContextMenuContent";


// OTHER COMPONENTS
const ContextMenuItem = ({ children, className, onSelect }: { children?: React.ReactNode, className?: string, onSelect?: () => void }) => {
    const { setOpen } = React.useContext(ContextMenuContext);
    const handleSelect = () => {
        onSelect?.();
        setOpen(false);
    }
    return (
        <div onClick={handleSelect} className={cn("relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)}>
            {children}
        </div>
    )
}

const ContextMenuCheckboxItem = ({ checked, onCheckedChange, children, className }: { checked: boolean, onCheckedChange: (checked: boolean) => void, children?: React.ReactNode, className?: string }) => {
    return (
        <div onClick={() => onCheckedChange(!checked)} className={cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)}>
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {checked && <div className="h-2 w-2 rounded-full bg-primary" />}
            </span>
            {children}
        </div>
    )
}

const ContextMenuLabel = ({ children, className }: { children?: React.ReactNode, className?: string }) => (
    <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>{children}</div>
)

const ContextMenuSeparator = ({ className } : { className?: string}) => (
    <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
)


export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuLabel, ContextMenuSeparator };
