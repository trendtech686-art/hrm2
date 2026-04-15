import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "../../lib/utils"

type BaseCheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>

type CheckboxProps = Omit<BaseCheckboxProps, "checked" | "defaultChecked"> & {
  checked?: CheckboxPrimitive.CheckedState | undefined
  defaultChecked?: CheckboxPrimitive.CheckedState | undefined
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, checked, defaultChecked, onCheckedChange, ...props }, ref) => {
  const isControlled = checked !== undefined

  // Ref guard: Radix useControllableState in React 19 can fire onCheckedChange
  // during render phase with the current value → causes infinite re-render loop.
  // Track last known value and only forward genuinely new values to parent.
  const lastValueRef = React.useRef<CheckboxPrimitive.CheckedState>(
    checked ?? defaultChecked ?? false
  )

  if (isControlled) {
    lastValueRef.current = checked
  }

  const handleCheckedChange = React.useCallback(
    (value: CheckboxPrimitive.CheckedState) => {
      if (value === lastValueRef.current) return
      lastValueRef.current = value
      onCheckedChange?.(value)
    },
    [onCheckedChange]
  )

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      {...props}
      {...(isControlled ? { checked } : {})}
      {...(defaultChecked !== undefined ? { defaultChecked } : {})}
      onCheckedChange={handleCheckedChange}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
