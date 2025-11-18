import * as React from 'react';
import { cn } from '../../lib/utils.ts';

export interface TimePickerProps {
  value?: string; // "HH:mm"
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  ({ className, value, onChange, disabled }, ref) => {
    const [hourStr, minuteStr] = React.useMemo(() => {
      const parts = (value || '').split(':');
      return [parts[0] || '', parts[1] || ''];
    }, [value]);

    const handleTimeChange = (part: 'hour' | 'minute', newValue: string) => {
      if (disabled) return;
      let newHour = hourStr;
      let newMinute = minuteStr;

      if (part === 'hour') {
        newHour = newValue.replace(/[^0-9]/g, '').slice(0, 2);
      } else {
        newMinute = newValue.replace(/[^0-9]/g, '').slice(0, 2);
      }
      onChange?.(`${newHour}:${newMinute}`);
    };

    const formatTimePart = (part: string, max: number) => {
      let num = parseInt(part, 10);
      if (isNaN(num)) return '00';
      if (num > max) num = max;
      if (num < 0) num = 0;
      return num.toString().padStart(2, '0');
    };

    const handleBlur = () => {
        if (disabled) return;
        const formattedHour = formatTimePart(hourStr, 23);
        const formattedMinute = formatTimePart(minuteStr, 59);
        if(formattedHour !== hourStr || formattedMinute !== minuteStr) {
            onChange?.(`${formattedHour}:${formattedMinute}`);
        }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
          className
        )}
        data-disabled={disabled}
        onBlur={handleBlur} // Attach blur to parent to catch when focus leaves the component
      >
        <input
          value={hourStr}
          onChange={(e) => handleTimeChange('hour', e.target.value)}
          className="w-8 border-none bg-transparent p-0 text-center shadow-none focus:ring-0 focus:outline-none disabled:cursor-not-allowed"
          placeholder="00"
          disabled={disabled}
          maxLength={2}
        />
        <span className="text-muted-foreground">:</span>
        <input
          value={minuteStr}
          onChange={(e) => handleTimeChange('minute', e.target.value)}
          className="w-8 border-none bg-transparent p-0 text-center shadow-none focus:ring-0 focus:outline-none disabled:cursor-not-allowed"
          placeholder="00"
          disabled={disabled}
          maxLength={2}
        />
      </div>
    );
  }
);
TimePicker.displayName = 'TimePicker';

export { TimePicker };
