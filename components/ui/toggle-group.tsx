'use client';

import * as React from "react"
import { type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { Toggle, toggleVariants } from "./toggle"

type ToggleGroupContextType = VariantProps<typeof toggleVariants> & {
    value: string | string[];
    onValueChange: (value: string) => void;
};

const ToggleGroupContext = React.createContext<ToggleGroupContextType | null>(null);

const useToggleGroup = () => {
    const context = React.useContext(ToggleGroupContext);
    if (!context) {
        throw new Error("useToggleGroup must be used within a ToggleGroup");
    }
    return context;
};

// Use discriminated union for props
type ToggleGroupSingleProps = {
  type: "single"
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

type ToggleGroupMultipleProps = {
  type: "multiple"
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

type ToggleGroupProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof toggleVariants> &
  (ToggleGroupSingleProps | ToggleGroupMultipleProps)

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
    ({ className, variant, size, children, type, value, defaultValue, onValueChange, ...divProps }, ref) => {
        const [internalValue, setInternalValue] = React.useState(defaultValue)
        const isControlled = value !== undefined
        const currentValue = isControlled ? value : internalValue

        const handleValueChange = (itemValue: string) => {
            if (type === "single") {
                const newValue = currentValue === itemValue ? "" : itemValue
                if (!isControlled) {
                    setInternalValue(newValue)
                }
                ;(onValueChange as (value: string) => void)?.(newValue)
            } else { // multiple
                const currentValues = (currentValue as string[] | undefined) || []
                const newValue = currentValues.includes(itemValue)
                  ? currentValues.filter((v) => v !== itemValue)
                  : [...currentValues, itemValue]
                if (!isControlled) {
                    setInternalValue(newValue)
                }
                ;(onValueChange as (value: string[]) => void)?.(newValue)
            }
        }

        return (
            <ToggleGroupContext.Provider value={{ variant, size, value: currentValue || (type === "multiple" ? [] : ""), onValueChange: handleValueChange }}>
                <div ref={ref} role="group" className={cn("flex items-center justify-center gap-1", className)} {...divProps}>
                    {children}
                </div>
            </ToggleGroupContext.Provider>
        )
    }
)
ToggleGroup.displayName = "ToggleGroup"

const ToggleGroupItem = React.forwardRef<
    HTMLButtonElement,
    Omit<React.ComponentPropsWithoutRef<typeof Toggle>, "value" | "onPressedChange" | "pressed" | "defaultPressed"> & { value: string }
>(({ className, children, value, ...props }, ref) => {
    const context = useToggleGroup()
    const isSelected = Array.isArray(context.value) ? context.value.includes(value) : context.value === value

    return (
        <Toggle
            ref={ref}
            pressed={isSelected}
            onPressedChange={() => context.onValueChange(value)}
            variant={context.variant}
            size={context.size}
            className={cn(className)}
            {...props}
        >
            {children}
        </Toggle>
    )
})
ToggleGroupItem.displayName = "ToggleGroupItem"

export { ToggleGroup, ToggleGroupItem }
