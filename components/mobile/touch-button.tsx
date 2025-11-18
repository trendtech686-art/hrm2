import * as React from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const touchButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-4 py-2 min-w-touch", // Mobile-first: 48px height
        sm: "h-9 rounded-md px-3 min-w-touch",
        lg: "h-14 rounded-md px-8 min-w-touch-lg", // 56px height for large touch
        xl: "h-16 rounded-md px-10 min-w-touch-lg", // 64px height for extra large
        icon: "h-12 w-12", // Square touch target
        "icon-sm": "h-9 w-10",
        "icon-lg": "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface TouchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof touchButtonVariants> {
  asChild?: boolean;
}

/**
 * TouchButton - Mobile-optimized button with minimum 44px touch targets
 * Follows Apple HIG and Material Design guidelines for touch interfaces
 */
const TouchButton = React.forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <Button
        className={cn(touchButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
TouchButton.displayName = "TouchButton";

export { TouchButton, touchButtonVariants };
