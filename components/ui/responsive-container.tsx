import * as React from "react"
import { cn } from "../../lib/utils"

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full" | "fullDesktop"
  mobilePadding?: boolean
  children: React.ReactNode
}

const containerSizes = {
  sm: "max-w-screen-sm",      // 640px
  md: "max-w-screen-md",      // 768px  
  lg: "max-w-screen-lg",      // 1024px
  xl: "max-w-screen-xl",      // 1280px
  full: "max-w-full",
  fullDesktop: "max-w-full lg:max-w-none"  // Full width on desktop, container on mobile
}

/**
 * ResponsiveContainer - Mobile-first responsive container with safe areas and proper padding
 * Automatically handles mobile, tablet, and desktop layouts
 */
export function ResponsiveContainer({
  size = "xl",
  mobilePadding = true,
  className,
  children,
  ...props
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        containerSizes[size],
        // Mobile-first padding
        mobilePadding && [
          "px-4 mobile:px-4",    // Mobile: 16px sides
          "sm:px-6",             // Small tablet: 24px sides  
          "lg:px-8",             // Desktop: 32px sides
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * ResponsiveSection - Section wrapper with proper mobile spacing
 */
export function ResponsiveSection({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn(
        "py-6 mobile:py-4",    // Mobile: 16px top/bottom
        "sm:py-8",             // Tablet: 32px top/bottom  
        "lg:py-12",            // Desktop: 48px top/bottom
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

/**
 * ResponsiveGrid - Mobile-first responsive grid
 */
interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: {
    mobile?: number
    tablet?: number  
    desktop?: number
  }
  gap?: "sm" | "md" | "lg"
  children: React.ReactNode
}

const gridGaps = {
  sm: "gap-2 mobile:gap-3 sm:gap-4",
  md: "gap-3 mobile:gap-4 sm:gap-6", 
  lg: "gap-4 mobile:gap-6 sm:gap-8"
}

export function ResponsiveGrid({
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "md",
  className,
  children,
  ...props
}: ResponsiveGridProps) {
  const gridCols = cn(
    "grid",
    cols.mobile && `grid-cols-${cols.mobile}`,
    cols.tablet && `sm:grid-cols-${cols.tablet}`,
    cols.desktop && `lg:grid-cols-${cols.desktop}`,
    gridGaps[gap]
  )

  return (
    <div
      className={cn(gridCols, className)}
      {...props}
    >
      {children}
    </div>
  )
}
