import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "../../lib/utils.ts"
import { Button } from "./button.tsx"
import { Calendar } from "./calendar.tsx"
import { useModal } from "../../contexts/modal-context"

// Format date as dd/MM/yyyy
const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

type DatePickerProps = {
    id?: string;
    value?: Date | null;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
};

// Tạo một Popover tùy chỉnh không có overlay tối
const DatePickerPopover = PopoverPrimitive.Root;
const DatePickerPopoverTrigger = PopoverPrimitive.Trigger;

const DatePickerPopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & { id?: string }
>(({ className, align = "center", sideOffset = 4, id = "date-picker", ...props }, ref) => {
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
DatePickerPopoverContent.displayName = "DatePickerPopoverContent";

export function DatePicker({ id, value, onChange, placeholder, className, disabled }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value ? new Date(value) : undefined);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
      setDate(value ? new Date(value) : undefined);
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
          {date ? formatDate(date) : <span>{placeholder || "Chọn ngày"}</span>}
        </Button>
  ));
  TriggerButton.displayName = "DatePickerTrigger";

  const Content = () => {
      const handleSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
          setDate(selectedDate);
          if (onChange) {
              onChange(selectedDate);
          }
          setOpen(false);
        }
      }

      const handleClear = () => {
        setDate(undefined);
        if (onChange) {
            onChange(undefined);
        }
        setOpen(false);
      }

      const handleToday = () => {
        const today = new Date();
        setDate(today);
        if (onChange) {
            onChange(today);
        }
        setOpen(false);
      }

      return (
        <>
            <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelect}
            />
            <div className="p-3 pt-0 flex justify-between">
                <Button type="button" variant="ghost" size="sm" onClick={handleClear}>Xóa</Button>
                <Button type="button" variant="ghost" size="sm" onClick={handleToday}>Hôm nay</Button>
            </div>
        </>
      )
  }

  return (
    <DatePickerPopover open={open} onOpenChange={setOpen}>
      <DatePickerPopoverTrigger asChild>
        <TriggerButton />
      </DatePickerPopoverTrigger>
      <DatePickerPopoverContent 
        id={`date-picker-${id}`}
        className="w-auto p-0"
      >
        <Content />
      </DatePickerPopoverContent>
    </DatePickerPopover>
  )
}
