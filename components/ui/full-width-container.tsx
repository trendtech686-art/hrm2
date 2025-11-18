import * as React from "react"
import { cn } from "../../lib/utils"
import { useMediaQuery } from "../../lib/use-media-query"

interface FullWidthContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  mobileContainer?: boolean
}

/**
 * FullWidthContainer - Full width on desktop, responsive container on mobile
 * Use this for data tables and other content that should expand on desktop
 */
export function FullWidthContainer({
  children,
  className,
  mobileContainer = true,
  ...props
}: FullWidthContainerProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  if (isDesktop) {
    // Desktop: full width
    return (
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    )
  }

  // Mobile: responsive container if enabled
  if (mobileContainer) {
    return (
      <div 
        className={cn(
          "mx-auto w-full max-w-screen-xl px-4 sm:px-6", 
          className
        )} 
        {...props}
      >
        {children}
      </div>
    )
  }

  // Mobile: no container wrapping
  return (
    <div className={cn("w-full", className)} {...props}>
      {children}
    </div>
  )
}