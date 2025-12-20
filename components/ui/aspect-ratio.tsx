import * as React from "react"
import { cn } from "../../lib/utils"

/**
 * A container that maintains a specific aspect ratio.
 * The height of this component is determined by its width and the provided ratio.
 * Children are absolutely positioned to fill the container.
 */
const AspectRatio = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { ratio?: number }
>(({ className, children, ratio = 1, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative w-full", className)}
      {...props}
    >
      {/* This invisible div creates the space, forcing the container's height based on its width. */}
      <div style={{ paddingBottom: `${100 / ratio}%` }} />
      {/* The actual content is placed inside this absolutely positioned div. */}
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
});
AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
