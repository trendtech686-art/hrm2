"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /**
   * Prevent double-click by disabling button after first click
   * Useful for form submissions and async actions
   * @default false
   */
  preventDoubleClick?: boolean
  /**
   * Text to show when button is in loading state (after click when preventDoubleClick is true)
   */
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild: _asChild = false, preventDoubleClick, loadingText, onClick, disabled, children, type, ...props }, ref) => {
    const Comp = _asChild ? Slot : "button"
    const [isClicked, setIsClicked] = React.useState(false)
    const isClickedRef = React.useRef(false)
    
    // Auto-enable double click prevention for submit buttons or buttons with onClick
    // Can be explicitly disabled with preventDoubleClick={false}
    const shouldPreventDoubleClick = preventDoubleClick ?? (type === 'submit' || !!onClick)
    
    // Reset click state when disabled prop changes (e.g., after async operation completes)
    React.useEffect(() => {
      if (!disabled && isClicked) {
        setIsClicked(false)
        isClickedRef.current = false
      }
    }, [disabled, isClicked])
    
    // Auto-reset after 5 seconds as failsafe (in case disabled never changes)
    React.useEffect(() => {
      if (isClicked) {
        const timer = setTimeout(() => {
          setIsClicked(false)
          isClickedRef.current = false
        }, 5000)
        return () => clearTimeout(timer)
      }
    }, [isClicked])
    
    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (shouldPreventDoubleClick) {
        // Use ref for immediate sync check
        if (isClickedRef.current) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
        isClickedRef.current = true
        setIsClicked(true)
      }
      onClick?.(e)
    }, [shouldPreventDoubleClick, onClick])
    
    const isDisabled = disabled || (shouldPreventDoubleClick && isClicked)
    const displayChildren = shouldPreventDoubleClick && isClicked && loadingText ? loadingText : children
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          shouldPreventDoubleClick && isClicked && "pointer-events-none"
        )}
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        onClick={handleClick}
        {...props}
      >
        {displayChildren}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
