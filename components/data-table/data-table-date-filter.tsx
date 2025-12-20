import * as React from "react"
import { Calendar as CalendarIcon, X } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Calendar } from "../ui/calendar"
import { Input } from "../ui/input"
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, isDateSame, isDateBetween, isDateAfter, isDateBefore, getDaysDiff, getMonthsDiff, addDays, addMonths, subtractDays, subtractMonths, getStartOfDay, getEndOfDay, getStartOfMonth, getEndOfMonth, getStartOfWeek, getEndOfWeek, toISODate, toISODateTime, isValidDate } from '../../lib/date-utils';
const presets = [
    { key: 'today', label: 'Hôm nay', getRange: () => [getStartOfDay(getCurrentDate()), getEndOfDay(getCurrentDate())] },
    { key: 'yesterday', label: 'Hôm qua', getRange: () => [getStartOfDay(subtractDays(getCurrentDate(), 1)), getEndOfDay(subtractDays(getCurrentDate(), 1))] },
    { key: 'this_week', label: 'Tuần này', getRange: () => [getStartOfWeek(getCurrentDate()), getEndOfWeek(getCurrentDate())] },
    { key: 'last_week', label: 'Tuần trước', getRange: () => [getStartOfWeek(subtractDays(getCurrentDate(), 7)), getEndOfWeek(subtractDays(getCurrentDate(), 7))] },
    { key: 'this_month', label: 'Tháng này', getRange: () => [getStartOfMonth(getCurrentDate()), getEndOfMonth(getCurrentDate())] },
    { key: 'last_month', label: 'Tháng trước', getRange: () => [getStartOfMonth(subtractMonths(getCurrentDate(), 1)), getEndOfMonth(subtractMonths(getCurrentDate(), 1))] },
]

function DateFilterContent({ value, onChange }: { value?: [string | undefined, string | undefined] | undefined; onChange: (value: [string | undefined, string | undefined] | undefined) => void }) {
    // const { setOpen } = React.useContext(DropdownMenuContext);
    const [initialFrom, initialTo] = value ?? [undefined, undefined];
    
    const [from, setFrom] = React.useState<Date | undefined>(initialFrom ? new Date(initialFrom) : undefined);
    const [to, setTo] = React.useState<Date | undefined>(initialTo ? new Date(initialTo) : undefined);
    
    const [fromInput, setFromInput] = React.useState<string>(initialFrom ? formatDate(initialFrom) : '');
    const [toInput, setToInput] = React.useState<string>(initialTo ? formatDate(initialTo) : '');
    
    const [calendarMonth, setCalendarMonth] = React.useState<Date>(
      from ?? to ?? new Date()
    );

    React.useEffect(() => {
        if (from && to && isDateAfter(new Date(from), new Date(to))) {
            const tempFrom = from;
            setFrom(to);
            setTo(tempFrom);
        }
    }, [from, to]);


    React.useEffect(() => {
        setFromInput(from ? formatDate(from) : '');
    }, [from]);

    React.useEffect(() => {
        setToInput(to ? formatDate(to) : '');
    }, [to]);

    const calculateActivePreset = (fromVal: Date | undefined, toVal: Date | undefined) => {
        if (!fromVal || !toVal) return null;
        for (const preset of presets) {
            const [start, end] = preset.getRange();
            if (fromVal && isDateSame(fromVal, start) && toVal && isDateSame(toVal, end)) {
                return preset.key;
            }
        }
        return null;
    }

    const [activePreset, setActivePreset] = React.useState<string | null>(() => calculateActivePreset(from, to));

    const [showCustom, setShowCustom] = React.useState(() => {
        return (!!initialFrom || !!initialTo) && activePreset === null;
    });

    const handlePresetClick = (preset: typeof presets[0]) => {
        const [newFrom, newTo] = preset.getRange();
        setFrom(newFrom ?? undefined);
        setTo(newTo ?? undefined);
        setActivePreset(preset.key);
        setShowCustom(false);
        if (newFrom) setCalendarMonth(newFrom);
    };

    const handleCustomClick = () => {
        setShowCustom(prev => !prev);
        setActivePreset(null);
    }

    const handleDateSelect = (range: { from?: Date | undefined; to?: Date | undefined } | undefined) => {
        setActivePreset(null);
        if (!range) {
            setFrom(undefined);
            setTo(undefined);
            return;
        }
        setFrom(range.from);
        setTo(range.to);
    }
    
    const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => {
        const setInput = type === 'from' ? setFromInput : setToInput;
        const setDate = type === 'from' ? setFrom : setTo;
    
        const value = e.target.value;
        const digits = value.replace(/\D/g, '');
    
        if (digits.length > 8) {
            return;
        }
    
        let dayStr = digits.slice(0, 2);
        let monthStr = digits.slice(2, 4);
        let yearStr = digits.slice(4, 8);
    
        if (dayStr.length === 2) {
            let day = parseInt(dayStr, 10);
            if (day > 31) dayStr = '31';
            if (day === 0) dayStr = '01';
        }
        
        if (monthStr.length === 2) {
            let month = parseInt(monthStr, 10);
            if (month > 12) monthStr = '12';
            if (month === 0) monthStr = '01';
        }
    
        if (dayStr.length === 2 && monthStr.length === 2) {
            const month = parseInt(monthStr, 10);
            const year = yearStr.length === 4 ? parseInt(yearStr, 10) : getCurrentDate().getFullYear();
            
            if (month >= 1 && month <= 12) {
                const tempDate = new Date(year, month - 1);
                if (tempDate && isValidDate(tempDate)) {
                    const daysInMonth = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate();
                    let day = parseInt(dayStr, 10);
                    if (day > daysInMonth) {
                        dayStr = String(daysInMonth);
                    }
                }
            }
        }
        
        const newDigits = dayStr + monthStr + yearStr;
        let formattedValue = dayStr;
        if (newDigits.length > 2) {
            formattedValue += '/' + monthStr;
        }
        if (newDigits.length > 4) {
            formattedValue += '/' + yearStr;
        }
        
        setInput(formattedValue);
    
        const finalDateStr = `${dayStr}/${monthStr}/${yearStr}`;
        const parsedDate = finalDateStr.match(/^\d{2}\/\d{2}\/\d{4}$/) ? new Date(finalDateStr.split('/').reverse().join('-')) : null;
    
        if (parsedDate && isValidDate(parsedDate)) {
            setDate(parsedDate);
            setCalendarMonth(parsedDate);
            setActivePreset(null);
        } else {
            setDate(undefined);
        }
    };


    const handleApply = () => {
        if (from || to) {
            onChange([
                from ? toISODate(from) : undefined, 
                to ? toISODate(to) : undefined
            ]);
        } else {
            onChange(undefined);
        }
        // setOpen(false);
    };
    
    const isCustomActive = showCustom || (activePreset === null && (!!from || !!to));

    return (
        <div className="p-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
                {presets.map(preset => (
                    <Button
                        key={preset.key}
                        variant={activePreset === preset.key ? "secondary" : "outline"}
                        size="sm"
                        className="h-8 justify-center"
                        onClick={() => handlePresetClick(preset)}
                    >
                        {preset.label}
                    </Button>
                ))}
            </div>
            
            <Button
                variant={isCustomActive ? "secondary" : "outline"}
                size="sm"
                className="h-9 w-full justify-center"
                onClick={handleCustomClick}
            >
                Tùy chọn
            </Button>
            
            {showCustom && (
                <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                         <div className="relative">
                            <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="dd/mm/yyyy"
                                value={fromInput}
                                onChange={(e) => handleDateInputChange(e, 'from')}
                                className="pl-8 h-9 text-sm"
                            />
                        </div>
                        <span className="text-muted-foreground">-</span>
                        <div className="relative">
                            <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="dd/mm/yyyy"
                                value={toInput}
                                onChange={(e) => handleDateInputChange(e, 'to')}
                                className="pl-8 h-9 text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <Calendar
                            mode="range"
                            selected={{ from: from, to: to }}
                            onSelect={handleDateSelect}
                            month={calendarMonth}
                            onMonthChange={setCalendarMonth}
                        />
                    </div>
                </div>
            )}
            
            <Button size="sm" onClick={handleApply} className="w-full h-9">Lọc</Button>
        </div>
    );
}

interface DataTableDateFilterProps {
    value?: [string | undefined, string | undefined] | undefined;
    onChange: (value: [string | undefined, string | undefined] | undefined) => void;
    title?: string | undefined;
}

export function DataTableDateFilter({
  value,
  onChange,
  title = "Ngày",
}: DataTableDateFilterProps) {
    const [from, to] = value ?? ["", ""];
    const isFiltered = !!(from || to);

    let buttonText = title;
    if (isFiltered) {
        let presetLabel = '';
        for (const preset of presets) {
            const [start, end] = preset.getRange();
            if (isDateSame(from, start) && isDateSame(to, end)) {
                presetLabel = preset.label;
                break;
            }
        }

        if (presetLabel) {
            buttonText = presetLabel;
        } else {
            const fromFormatted = from ? formatDate(from) : '...';
            const toFormatted = to ? formatDate(to) : '...';
            if (from && to) {
                 buttonText = `${fromFormatted} - ${toFormatted}`;
            } else if (from) {
                buttonText = `Từ ${fromFormatted}`;
            } else if (to) {
                buttonText = `Đến ${toFormatted}`;
            }
        }
    }
    
    // Use state to track if the dropdown is open
    const [isOpen, setIsOpen] = React.useState(false);
  
    return (
    <div className="relative inline-flex w-full sm:w-auto h-9">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
                "h-9 w-full sm:w-[180px] lg:w-[220px] justify-start text-left font-normal flex items-center",
                !isFiltered && "text-muted-foreground",
                isFiltered && "pr-8"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate flex-1">{buttonText}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px] p-0" align="start" id="date-range-filter">
          {/* Bỏ overlay tối ở đây */}
          <DateFilterContent value={value} onChange={(val) => {
            onChange(val);
            setIsOpen(false);
          }} />
        </DropdownMenuContent>
      </DropdownMenu>
      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onChange(undefined);
          }}
          className="absolute right-0 top-0 h-9 w-8 p-0 hover:bg-transparent opacity-50 hover:opacity-100"
          aria-label="Xóa bộ lọc"
        >
          <X className="h-4 w-4"/>
        </Button>
      )}
    </div>
  );
}
