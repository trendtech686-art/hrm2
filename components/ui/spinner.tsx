import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "../../lib/utils.ts"

const Spinner = React.forwardRef<
  SVGSVGElement,
  React.SVGAttributes<SVGSVGElement>
>(({ className, ...props }, ref) => {
  return (
    <Loader2
      ref={ref}
      className={cn("animate-spin", className)}
      {...props}
    />
  );
});
Spinner.displayName = "Spinner";

export { Spinner };
