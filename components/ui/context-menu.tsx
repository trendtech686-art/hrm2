'use client';

import { forwardRef, useState, useContext, useEffect, useImperativeHandle, createContext, isValidElement, type ReactNode, type Dispatch, type SetStateAction, type MouseEvent as ReactMouseEvent, type HTMLAttributes, type ReactElement } from "react"
import { createPortal } from "react-dom"
import { cn } from "../../lib/utils"

// CONTEXT
type ContextMenuContextType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  position: { x: number; y: number };
  setPosition: Dispatch<SetStateAction<{ x: number; y: number }>>;
};

export const ContextMenuContext = createContext<ContextMenuContextType>({
  open: false,
  setOpen: () => {},
  position: { x: 0, y: 0 },
  setPosition: () => {},
});

// ROOT COMPONENT
const ContextMenu = ({ children }: { children?: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  return (
    <ContextMenuContext.Provider value={{ open, setOpen, position, setPosition }}>
      {children}
    </ContextMenuContext.Provider>
  );
};

// TRIGGER
const ContextMenuTrigger = ({ children, asChild }: { children?: ReactNode, asChild?: boolean }) => {
  const { setOpen, setPosition } = useContext(ContextMenuContext);

  const handleContextMenu = (e: ReactMouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setOpen(true);
  };

  if (asChild && children && isValidElement<ReactElement>(children)) {
    return (
      <div onContextMenu={handleContextMenu} onKeyDown={(e) => e.stopPropagation()} role="presentation">
        {children}
      </div>
    );
  }

  return (
    <div onContextMenu={handleContextMenu} onKeyDown={(e) => e.stopPropagation()} role="presentation">
      {children}
    </div>
  );
};

// CONTENT & PORTAL
const ContextMenuContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, forwardedRef) => {
  const { open, setOpen, position } = useContext(ContextMenuContext);
  const contentRef = { current: null as HTMLDivElement | null };
  const [style, setStyle] = useState({ position: 'fixed' as const, top: '-9999px', left: '-9999px' });

  useImperativeHandle(forwardedRef, () => contentRef.current!);

  useEffect(() => {
    if (open && contentRef.current) {
      const contentEl = contentRef.current;
      if (contentEl.offsetHeight === 0) return;

      const contentHeight = contentEl.offsetHeight;
      const contentWidth = contentEl.offsetWidth;
      const viewHeight = window.innerHeight;
      const viewWidth = window.innerWidth;
      
      let top = position.y;
      if (top + contentHeight > viewHeight - 8) {
        top = viewHeight - contentHeight - 8;
      }
      if (top < 8) {
          top = 8;
      }

      let left = position.x;
      if (left + contentWidth > viewWidth - 8) {
        left = viewWidth - contentWidth - 8;
      }
      if (left < 8) {
          left = 8;
      }

      setStyle({
          position: 'fixed',
          top: `${top}px`,
          left: `${left}px`,
      });
    }
  }, [open, position]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
    }
    const handleClickOutside = (event: Event) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleScrollAndResize = () => {
        setOpen(false);
    };
    if (open) {
        const timerId = setTimeout(() => {
            document.addEventListener("click", handleClickOutside);
            document.addEventListener("contextmenu", handleClickOutside);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- contentRef is a stable ref
  }, [open, setOpen]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true) }, []);

  if (!mounted) return null;

  return createPortal(
    open ? (
      <div 
        ref={(el) => { contentRef.current = el; }}
        style={style}
        className={cn("z-50 min-w-32 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95", className)}
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
const ContextMenuItem = ({ children, className, onSelect }: { children?: ReactNode, className?: string, onSelect?: () => void }) => {
    const { setOpen } = useContext(ContextMenuContext);
    const handleSelect = () => {
        onSelect?.();
        setOpen(false);
    }
    return (
        <div onClick={handleSelect} onKeyDown={(e) => e.key === 'Enter' && handleSelect()} className={cn("relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)} role="menuitem" tabIndex={0}>
            {children}
        </div>
    )
}

const ContextMenuCheckboxItem = ({ checked, onCheckedChange, children, className }: { checked: boolean, onCheckedChange: (checked: boolean) => void, children?: ReactNode, className?: string }) => {
    return (
        <div onClick={() => onCheckedChange(!checked)} onKeyDown={(e) => e.key === 'Enter' && onCheckedChange(!checked)} className={cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)} role="menuitemcheckbox" tabIndex={0}>
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {checked && <div className="h-2 w-2 rounded-full bg-primary" />}
            </span>
            {children}
        </div>
    )
}

const ContextMenuLabel = ({ children, className }: { children?: ReactNode, className?: string }) => (
    <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>{children}</div>
)

const ContextMenuSeparator = ({ className } : { className?: string}) => (
    <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
)


export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuLabel, ContextMenuSeparator };
