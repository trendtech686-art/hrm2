import { useState, useEffect, useCallback, forwardRef, type ElementRef, type ComponentPropsWithoutRef, type ButtonHTMLAttributes } from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { useModal } from "../../contexts/modal-context"

// Format date as dd/MM/yyyy HH:mm (GMT+7)
const formatDateTime = (date: Date): string => {
  const utcTime = date.getTime();
  const gmt7Time = new Date(utcTime + (7 * 60 * 60 * 1000));
  
  const day = gmt7Time.getUTCDate().toString().padStart(2, '0');
  const month = (gmt7Time.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = gmt7Time.getUTCFullYear();
  const hours = gmt7Time.getUTCHours().toString().padStart(2, '0');
  const minutes = gmt7Time.getUTCMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

type DateTimePickerProps = {
    id?: string;
    value?: Date | null;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
};

const DateTimePickerPopover = PopoverPrimitive.Root;
const DateTimePickerPopoverTrigger = PopoverPrimitive.Trigger;

const DateTimePickerPopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & { id?: string }
>(({ className, align = "center", sideOffset = 4, id = "date-time-picker", style: propStyle, ...props }, ref) => {
  const { zIndex } = useModal(id, true, 'popover');
  
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "w-auto rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
        style={{ ...propStyle, zIndex }}
      />
    </PopoverPrimitive.Portal>
  );
});
DateTimePickerPopoverContent.displayName = "DateTimePickerPopoverContent";

export function DateTimePicker({ id, value, onChange, placeholder, className, disabled }: DateTimePickerProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('00:00');
  const [open, setOpen] = useState(false);

  // Hydration-safe: set initial value only on client
  useEffect(() => {
    if (value) {
      const newDate = new Date(value);
      setDate(newDate);
      const utcTime = newDate.getTime();
      const gmt7Time = new Date(utcTime + (7 * 60 * 60 * 1000));
      setTime(`${gmt7Time.getUTCHours().toString().padStart(2, '0')}:${gmt7Time.getUTCMinutes().toString().padStart(2, '0')}`);
    } else {
      setDate(undefined);
      setTime('00:00');
    }
  }, [value]);

  // Memoized handlers
  const handleDateSelect = useCallback((selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, []);

  const handleHourChange = useCallback((hour: string) => {
    setTime(prev => {
      const minute = prev.split(':')[1] || '00';
      return `${hour}:${minute}`;
    });
  }, []);

  const handleMinuteChange = useCallback((minute: string) => {
    setTime(prev => {
      const hour = prev.split(':')[0] || '00';
      return `${hour}:${minute}`;
    });
  }, []);

  const handleApply = useCallback(() => {
    if (date && time) {
      const [hours, minutes] = time.split(':').map(Number);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const utcDate = new Date(Date.UTC(year, month, day, hours - 7, minutes, 0, 0));
      setDate(utcDate);
      if (onChange) {
        onChange(utcDate);
      }
      setOpen(false);
    }
  }, [date, time, onChange]);

  const handleClear = useCallback(() => {
    setDate(undefined);
    setTime('00:00');
    if (onChange) {
      onChange(undefined);
    }
    setOpen(false);
  }, [onChange]);

  const handleToday = useCallback(() => {
    const now = new Date();
    setDate(now);
    const utcTime = now.getTime();
    const gmt7Time = new Date(utcTime + (7 * 60 * 60 * 1000));
    setTime(`${gmt7Time.getUTCHours().toString().padStart(2, '0')}:${gmt7Time.getUTCMinutes().toString().padStart(2, '0')}`);
  }, []);

  const TriggerButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => (
      <Button
          id={id}
          ref={ref}
          variant={"outline"}
          type="button"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDateTime(date) : <span>{placeholder || "Chọn ngày và giờ"}</span>}
        </Button>
  ));
  TriggerButton.displayName = "DateTimePickerTrigger";

  const Content = useCallback(() => {
      return (
        <>
            <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
            />
            <div className="p-3 border-t border-border">
                <div className="mb-3">
                <label htmlFor="time-hour" className="text-sm font-medium mb-2 block">Giờ (GMT+7)</label>
                <div className="flex items-center gap-2">
                  <input
                    id="time-hour"
                    type="number"
                    min={0}
                    max={23}
                    value={parseInt(time.split(':')[0]) || 0}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleHourChange(val.padStart(2, '0'));
                    }}
                    className="flex h-9 w-20 rounded-md border border-input bg-background px-3 py-2 text-base text-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <span className="text-lg font-semibold">:</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={parseInt(time.split(':')[1]) || 0}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleMinuteChange(val.padStart(2, '0'));
                    }}
                    className="flex h-9 w-20 rounded-md border border-input bg-background px-3 py-2 text-base text-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Giờ: 00-23, Phút: 00-59
                </p>
              </div>
              <div className="flex justify-between gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={handleClear}>Xóa</Button>
                <Button type="button" variant="ghost" size="sm" onClick={handleToday}>Bây giờ</Button>
                <Button type="button" variant="default" size="sm" onClick={handleApply} disabled={!date}>Áp dụng</Button>
              </div>
            </div>
        </>
      );
  }, [date, time, handleDateSelect, handleHourChange, handleMinuteChange, handleClear, handleToday, handleApply]);

  return (
    <DateTimePickerPopover open={open} onOpenChange={setOpen}>
      <DateTimePickerPopoverTrigger asChild>
        <TriggerButton />
      </DateTimePickerPopoverTrigger>
      <DateTimePickerPopoverContent
        id={`date-time-picker-${id}`}
        className="w-auto p-0"
      >
        <Content />
      </DateTimePickerPopoverContent>
    </DateTimePickerPopover>
  )
}
