"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "../../lib/utils"
import { useModal } from "../../contexts/modal-context"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

// Context to pass popover ID through the component tree
const PopoverContext = React.createContext<string>("");

// Provider component that accepts an ID
const PopoverProvider = ({ id, children }: { id: string; children: React.ReactNode }) => {
  return <PopoverContext.Provider value={id}>{children}</PopoverContext.Provider>;
};

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    id?: string;
  }
>(({ className, align = "center", sideOffset = 4, id: propId, style: propStyle, ...props }, ref) => {
  const generatedId = React.useId();
  const contextId = React.useContext(PopoverContext);
  const id = propId || contextId || `popover-${generatedId}`;
  
  // Radix only mounts PopoverContent when open (via Presence),
  // so always register as open. Cleanup runs on unmount (close).
  const { zIndex } = useModal(id, true, 'popover');
  
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "w-72 max-md:w-[calc(100vw-2rem)] rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none transition-opacity duration-200 opacity-0 data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
          className
        )}
        {...props}
        style={{ ...propStyle, zIndex }}
      >
        <PopoverProvider id={id}>
          {props.children}
        </PopoverProvider>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
})
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverProvider }
