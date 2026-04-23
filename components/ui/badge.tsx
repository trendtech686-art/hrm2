import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive/15 text-destructive hover:bg-destructive/20",
        outline: "text-foreground",
        success:
          "border-transparent bg-success/15 text-success-foreground hover:bg-success/25",
        warning:
          "border-transparent bg-warning/15 text-warning-foreground hover:bg-warning/25",
        info:
          "border-transparent bg-info/15 text-info-foreground hover:bg-info/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <div 
      ref={ref}
      className={cn(badgeVariants({ variant }), className)} 
      {...props} 
    />
  )
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
