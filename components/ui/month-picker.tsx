import * as React from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { useModal } from "../../contexts/modal-context"

const MONTHS = [
  'Thg1', 'Thg2', 'Thg3', 'Thg4',
  'Thg5', 'Thg6', 'Thg7', 'Thg8',
  'Thg9', 'Thg10', 'Thg11', 'Thg12'
];

const MONTH_NAMES = [
  'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư',
  'Tháng Năm', 'Tháng Sáu', 'Tháng Bảy', 'Tháng Tám',
  'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'
];

// Format monthKey as "Tháng X YYYY"
const formatMonthKey = (monthKey: string): string => {
  const [year, month] = monthKey.split('-').map(Number);
  if (!year || !month) return monthKey;
  return `${MONTH_NAMES[month - 1]} ${year}`;
};

type MonthPickerProps = {
  id?: string;
  value?: string; // Format: "YYYY-MM"
  onChange?: (monthKey: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minYear?: number;
  maxYear?: number;
};

// Tạo Popover tùy chỉnh
const MonthPickerPopover = PopoverPrimitive.Root;
const MonthPickerPopoverTrigger = PopoverPrimitive.Trigger;

const MonthPickerPopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & { id?: string }
>(({ className, align = "start", sideOffset = 4, id = "month-picker", ...props }, ref) => {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (props["data-state"] === "open") {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [props["data-state"]]);
  
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
MonthPickerPopoverContent.displayName = "MonthPickerPopoverContent";

export function MonthPicker({ 
  id, 
  value, 
  onChange, 
  placeholder, 
  className, 
  disabled,
  minYear = 2020,
  maxYear = 2030 
}: MonthPickerProps) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Parse value to get selected year/month
  const [selectedYear, selectedMonth] = React.useMemo(() => {
    if (!value) return [currentYear, currentMonth];
    const [y, m] = value.split('-').map(Number);
    return [y || currentYear, m || currentMonth];
  }, [value, currentYear, currentMonth]);

  const [viewYear, setViewYear] = React.useState(selectedYear);
  const [open, setOpen] = React.useState(false);

  // Update viewYear when value changes
  React.useEffect(() => {
    if (value) {
      const [y] = value.split('-').map(Number);
      if (y) setViewYear(y);
    }
  }, [value]);

  const handleMonthSelect = (month: number) => {
    const monthKey = `${viewYear}-${String(month).padStart(2, '0')}`;
    onChange?.(monthKey);
    setOpen(false);
  };

  const handlePrevYear = () => {
    if (viewYear > minYear) {
      setViewYear(viewYear - 1);
    }
  };

  const handleNextYear = () => {
    if (viewYear < maxYear) {
      setViewYear(viewYear + 1);
    }
  };

  const handleClear = () => {
    onChange?.('');
    setOpen(false);
  };

  const handleThisMonth = () => {
    const monthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    setViewYear(currentYear);
    onChange?.(monthKey);
    setOpen(false);
  };

  return (
    <MonthPickerPopover open={open} onOpenChange={setOpen}>
      <MonthPickerPopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          type="button"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            "h-9",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? formatMonthKey(value) : <span>{placeholder || "Chọn tháng"}</span>}
        </Button>
      </MonthPickerPopoverTrigger>
      <MonthPickerPopoverContent 
        id={`month-picker-${id}`}
        className="w-[280px] p-3"
      >
        {/* Year navigation */}
        <div className="flex items-center justify-between mb-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handlePrevYear}
            disabled={viewYear <= minYear}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-sm">{viewYear}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleNextYear}
            disabled={viewYear >= maxYear}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Month grid */}
        <div className="grid grid-cols-4 gap-2">
          {MONTHS.map((monthLabel, index) => {
            const month = index + 1;
            const isSelected = selectedYear === viewYear && selectedMonth === month;
            const isCurrent = currentYear === viewYear && currentMonth === month;
            
            return (
              <Button
                key={month}
                type="button"
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-9 text-sm",
                  isCurrent && !isSelected && "border border-primary text-primary"
                )}
                onClick={() => handleMonthSelect(month)}
              >
                {monthLabel}
              </Button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-3 pt-3 border-t">
          <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
            Xóa
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleThisMonth}>
            Tháng này
          </Button>
        </div>
      </MonthPickerPopoverContent>
    </MonthPickerPopover>
  );
}
