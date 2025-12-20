import * as React from "react";
import { Input } from "./input";
import { cn } from "../../lib/utils";

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number | undefined;
  onChange?: (value: number) => void;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState("");

    // Format number with thousand separators
    const formatNumber = (num: number): string => {
      return new Intl.NumberFormat('vi-VN').format(num);
    };

    // Parse formatted string back to number
    const parseNumber = (str: string): number => {
      const cleaned = str.replace(/\./g, '').replace(/,/g, '');
      const num = parseInt(cleaned, 10);
      return isNaN(num) ? 0 : Math.max(0, num); // Không cho phép số âm
    };

    // Sync external value to display
    React.useEffect(() => {
      if (value !== undefined) {
        setDisplayValue(value === 0 ? "" : formatNumber(value));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Cho phép rỗng
      if (inputValue === "") {
        setDisplayValue("");
        onChange?.(0);
        return;
      }

      // Chỉ cho phép số và dấu chấm, không cho phép dấu trừ
      const cleaned = inputValue.replace(/[^\d.]/g, '');
      
      // Không xử lý nếu có ký tự không hợp lệ (bao gồm dấu trừ)
      if (inputValue.length > 0 && cleaned === "" && inputValue !== "") {
        return;
      }
      
      const num = parseNumber(cleaned);
      
      // Cập nhật display và gọi onChange
      setDisplayValue(formatNumber(num));
      onChange?.(num);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Format lại khi blur
      if (value !== undefined && value > 0) {
        setDisplayValue(formatNumber(value));
      }
      props.onBlur?.(e);
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn("text-right pr-14 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none", className)}
          {...props}
        />
        <span className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none",
          props.disabled && "opacity-50"
        )}>
          VND
        </span>
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
