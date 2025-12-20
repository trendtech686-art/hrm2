import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Input } from "./input"
import { useModal } from "../../contexts/modal-context"

// Format date as dd/MM/yyyy HH:mm (GMT+7)
const formatDateTime = (date: Date): string => {
  // Convert to GMT+7 (Vietnam timezone)
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

// Tạo một Popover tùy chỉnh không có overlay tối
const DateTimePickerPopover = PopoverPrimitive.Root;
const DateTimePickerPopoverTrigger = PopoverPrimitive.Trigger;

const DateTimePickerPopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & { id?: string }
>(({ className, align = "center", sideOffset = 4, id = "date-time-picker", ...props }, ref) => {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (props["data-state"] === "open") {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [props["data-state"]]);
  
  // Sử dụng modal context để quản lý z-index mà không có overlay
  const { zIndex } = useModal(id, open, 'popover');
  
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
        style={{ zIndex }}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});
DateTimePickerPopoverContent.displayName = "DateTimePickerPopoverContent";

export function DateTimePicker({ id, value, onChange, placeholder, className, disabled }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value ? new Date(value) : undefined);
  const [time, setTime] = React.useState<string>(() => {
    if (!value) return '00:00';
    const d = new Date(value);
    const utcTime = d.getTime();
    const gmt7Time = new Date(utcTime + (7 * 60 * 60 * 1000));
    return `${gmt7Time.getUTCHours().toString().padStart(2, '0')}:${gmt7Time.getUTCMinutes().toString().padStart(2, '0')}`;
  });
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
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

  const TriggerButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => (
      <Button
          id={id}
          ref={ref}
          variant={"outline"}
          type="button"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            "h-9",
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

  const Content = () => {
      const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
          setDate(selectedDate);
        }
      }

      const handleHourChange = (hour: string) => {
        const minute = time.split(':')[1] || '00';
        setTime(`${hour}:${minute}`);
      }

      const handleMinuteChange = (minute: string) => {
        const hour = time.split(':')[0] || '00';
        setTime(`${hour}:${minute}`);
      }

      const handleApply = () => {
        if (date && time) {
          const [hours, minutes] = time.split(':').map(Number);
          
          // Create date in GMT+7
          const year = date.getFullYear();
          const month = date.getMonth();
          const day = date.getDate();
          
          // Create UTC date by subtracting 7 hours from GMT+7 time
          const utcDate = new Date(Date.UTC(year, month, day, hours - 7, minutes, 0, 0));
          
          setDate(utcDate);
          if (onChange) {
            onChange(utcDate);
          }
          setOpen(false);
        }
      }

      const handleClear = () => {
        setDate(undefined);
        setTime('00:00');
        if (onChange) {
            onChange(undefined);
        }
        setOpen(false);
      }

      const handleToday = () => {
        const now = new Date();
        setDate(now);
        const utcTime = now.getTime();
        const gmt7Time = new Date(utcTime + (7 * 60 * 60 * 1000));
        setTime(`${gmt7Time.getUTCHours().toString().padStart(2, '0')}:${gmt7Time.getUTCMinutes().toString().padStart(2, '0')}`);
      }

      return (
        <>
            <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
            />
            <div className="p-3 border-t">
              <div className="mb-3">
                <label className="text-sm font-medium mb-2 block">Giờ (GMT+7)</label>
                <div className="flex items-center gap-2">
                  <input
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
      )
  }

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
