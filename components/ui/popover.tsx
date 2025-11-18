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
>(({ className, align = "center", sideOffset = 4, id: propId, ...props }, ref) => {
  // Use either the prop id or the id from context
  const contextId = React.useContext(PopoverContext);
  const id = propId || contextId || `popover-${React.useId()}`;
  
  // Get open state from props
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (props["data-state"] === "open") {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [props["data-state"]]);
  
  // Register with our modal context
  const { zIndex } = useModal(id, open, 'popover');
  
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none transition-opacity duration-200 opacity-0 data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
          className
        )}
        style={{ zIndex }}
        {...props}
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
