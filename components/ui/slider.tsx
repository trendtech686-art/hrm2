import * as React from "react"

import { cn } from "../../lib/utils.ts"

// FIX: Omitted `defaultValue` from HTML attributes to resolve a props type conflict, as it clashed with the component's custom `defaultValue` prop.
type SliderProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'onValueChange' | 'value' | 'defaultValue'> & {
  value?: readonly number[];
  defaultValue?: readonly number[];
  onValueChange?: (value: readonly number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
};

const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(
  ({ className, value, defaultValue, onValueChange, min = 0, max = 100, step = 1, disabled = false, ...props }, ref) => {
    
    const [internalValue, setInternalValue] = React.useState<readonly number[]>(defaultValue || [min]);
    const isControlled = value !== undefined;
    const currentValues = isControlled ? value : internalValue;
    const range = max - min;

    const sliderRef = React.useRef<HTMLSpanElement>(null);

    const handleValueChange = (newValues: readonly number[]) => {
      if (!isControlled) {
        setInternalValue(newValues);
      }
      onValueChange?.(newValues);
    };

    const getValueFromPosition = (pos: number) => {
      const rect = sliderRef.current!.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (pos - rect.left) / rect.width));
      const rawValue = min + percentage * range;
      
      // Snap to step
      const numSteps = Math.round((rawValue - min) / step);
      const snappedValue = min + numSteps * step;
      
      // Use toFixed to handle floating point inaccuracies with steps
      return Math.max(min, Math.min(max, parseFloat(snappedValue.toFixed(5))));
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLSpanElement>) => {
      if (disabled || !sliderRef.current) return;
      event.preventDefault(); // Prevent text selection
      
      const target = event.target as HTMLElement;
      target.focus();

      // Set value on click
      const newValueOnClick = getValueFromPosition(event.clientX);
      handleValueChange([newValueOnClick]);

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const newValue = getValueFromPosition(moveEvent.clientX);
        handleValueChange([newValue]);
      };

      const handlePointerUp = () => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
      };

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    };
    
    const percentage = ((currentValues[0] - min) / range) * 100;

    return (
      <span
        ref={sliderRef}
        onPointerDown={handlePointerDown}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          className
        )}
        {...props}
      >
        <span className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <span className="absolute h-full bg-primary" style={{ width: `${percentage}%` }} />
        </span>
        <span
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValues[0]}
          tabIndex={disabled ? -1 : 0}
          className="absolute block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          style={{ left: `calc(${percentage}% - 0.625rem)` }} // 10px is half of thumb width (h-5/w-5 is 20px)
        />
      </span>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
