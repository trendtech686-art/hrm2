import * as React from "react"
import { cn } from "../../lib/utils"

// --- Context ---
type RadioGroupContextType = {
  value: string | number | undefined;
  onValueChange: (value: string | number) => void;
  name?: string | undefined;
};

const RadioGroupContext = React.createContext<RadioGroupContextType | undefined>(undefined);

const useRadioGroup = () => {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error("useRadioGroup must be used within a RadioGroup");
  }
  return context;
};

// --- RadioGroup ---
const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string | number | undefined;
    defaultValue?: string | number | undefined;
    onValueChange?: ((value: string | number) => void) | undefined;
    name?: string | undefined;
  }
>(({ className, children, value, defaultValue, onValueChange, name, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleValueChange = (newValue: string | number) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <RadioGroupContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, name }}>
      <div ref={ref} role="radiogroup" className={cn("grid gap-2", className)} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
});
RadioGroup.displayName = "RadioGroup";

// --- RadioGroupItem ---
const RadioGroupItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string | number }
>(({ className, value, children, ...props }, ref) => {
  const { value: selectedValue, onValueChange, name } = useRadioGroup();
  const isChecked = selectedValue === value;
  const id = React.useId();

  return (
    <button
      ref={ref}
      id={id}
      type="button"
      role="radio"
      aria-checked={isChecked}
      data-state={isChecked ? "checked" : "unchecked"}
      onClick={() => onValueChange(value)}
      name={name}
      value={value}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {isChecked && (
        <div className="flex items-center justify-center">
          <div className="h-2.5 w-2.5 rounded-full bg-current text-current" />
        </div>
      )}
    </button>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";


export { RadioGroup, RadioGroupItem };
