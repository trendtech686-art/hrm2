"use client"

import { forwardRef, useState, useEffect, useCallback, useRef, type ButtonHTMLAttributes, type MouseEvent } from "react"
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
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /**
   * Debounce interval in ms to prevent double-click. Set to 0 to disable.
   * @default 700
   */
  debounceMs?: number
  /**
   * Text to show when button is in loading state
   */
  loadingText?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild: _asChild = false, debounceMs = 1500, loadingText: _loadingText, onClick, disabled, children, type, ...props }, ref) => {
    const Comp = _asChild ? Slot : "button"
    const lockRef = useRef(false)
    const [isLocked, setIsLocked] = useState(false)
    
    // Auto-unlock after debounce period
    useEffect(() => {
      if (isLocked && debounceMs > 0) {
        const timer = setTimeout(() => {
          lockRef.current = false
          setIsLocked(false)
        }, debounceMs)
        return () => clearTimeout(timer)
      }
    }, [isLocked, debounceMs])
    
    const handleClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
      if (!onClick) return
      // Ref = sync guard — blocks second click instantly in same JS frame
      if (debounceMs > 0 && lockRef.current) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      if (debounceMs > 0) {
        lockRef.current = true
        setIsLocked(true) // triggers re-render with pointer-events-none
      }
      onClick(e)
    }, [onClick, debounceMs])
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          isLocked && "pointer-events-none"
        )}
        ref={ref}
        type={type}
        disabled={disabled}
        aria-disabled={disabled}
        onClick={onClick ? handleClick : undefined}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
