import * as React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from './input.tsx';
import { Button } from './button.tsx';
import { cn } from '../../lib/utils.ts';

export interface NumberInputProps extends Omit<React.ComponentProps<"input">, 'onChange' | 'value'> {
  value?: number;
  onChange?: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  format?: boolean;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value, onChange, step = 1, min, max, format = true, ...props }, ref) => {
    
    const formatValue = React.useCallback((num?: number) => {
      if (num === undefined || num === null || isNaN(num)) return '';
      if (!format) return String(num);
      return new Intl.NumberFormat('vi-VN').format(num);
    }, [format]);

    const parseValue = React.useCallback((str: string): number => {
      if (!str) return 0;
      const parsed = parseInt(str.replace(/\./g, ''), 10);
      return isNaN(parsed) ? 0 : parsed;
    }, []);

    const [displayValue, setDisplayValue] = React.useState(formatValue(value));
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    React.useEffect(() => {
      if (document.activeElement !== inputRef.current) {
        setDisplayValue(formatValue(value));
      }
    }, [value, formatValue]);
    
    const handleStep = (direction: 'up' | 'down') => {
      let currentValue = value ?? 0;
      if (min !== undefined && currentValue < min) {
        currentValue = min;
      }
      let newValue = currentValue + (direction === 'up' ? step : -step);

      const stepDecimalPlaces = (String(step).split('.')[1] || '').length;
      newValue = parseFloat(newValue.toFixed(stepDecimalPlaces));

      if (min !== undefined) newValue = Math.max(min, newValue);
      if (max !== undefined) newValue = Math.min(max, newValue);
      
      onChange?.(newValue);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        
        // Không cho phép nhập dấu trừ nếu min >= 0
        if (min !== undefined && min >= 0 && rawValue.includes('-')) {
            return;
        }
        
        const num = parseValue(rawValue);
        
        // Kiểm tra giới hạn max ngay khi nhập
        if (max !== undefined && num > max) {
            return;
        }

        setDisplayValue(rawValue);
        onChange?.(num);
    }
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        let currentNum = value ?? 0;
        if (min !== undefined) currentNum = Math.max(min, currentNum);
        if (max !== undefined) currentNum = Math.min(max, currentNum);
        
        if (currentNum !== value) {
            onChange?.(currentNum);
        }

        setDisplayValue(formatValue(currentNum));
        props.onBlur?.(e);
    }

    const inputType = format ? "text" : "number";

    return (
      <div className={cn("relative", className)}>
        <Input
          type={inputType}
          inputMode={format ? "text" : "numeric"}
          ref={inputRef}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          step={format ? undefined : step}
          min={format ? undefined : min}
          max={format ? undefined : max}
          className={cn(
            "pr-8",
            !format && "[-moz-appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          )}
          {...props}
        />
        <div className="absolute right-0 top-0 h-full flex flex-col items-center justify-center border-l">
          <Button
            type="button"
            variant="ghost"
            className="h-1/2 px-2 py-0 rounded-none rounded-tr-md flex items-center justify-center"
            onClick={() => handleStep('up')}
            disabled={props.disabled || (max !== undefined && value !== undefined && value >= max)}
            tabIndex={-1}
          >
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-1/2 px-2 py-0 rounded-none rounded-br-md flex items-center justify-center"
            onClick={() => handleStep('down')}
            disabled={props.disabled || (min !== undefined && value !== undefined && value <= min)}
            tabIndex={-1}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    );
  }
);
NumberInput.displayName = 'NumberInput';

export { NumberInput };
