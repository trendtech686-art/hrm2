"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Input } from "./input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

// Format date as dd/MM/yyyy for display
function formatDate(date: Date | undefined): string {
  if (!date) {
    return ""
  }
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// Parse date from dd/MM/yyyy format
function parseDate(value: string): Date | undefined {
  if (!value) return undefined
  
  // Try dd/MM/yyyy format
  const parts = value.split('/')
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const year = parseInt(parts[2], 10)
    const date = new Date(year, month, day)
    if (isValidDate(date)) {
      return date
    }
  }
  
  // Try native Date parsing as fallback
  const date = new Date(value)
  if (isValidDate(date)) {
    return date
  }
  
  return undefined
}

function isValidDate(date: Date | undefined): boolean {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

type DatePickerProps = {
  id?: string;
  value?: Date | null;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  fromDate?: Date;
  toDate?: Date;
};

export function DatePicker({ id, value, onChange, placeholder = "dd/mm/yyyy", className, disabled, fromDate, toDate }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(value ? new Date(value) : undefined)
  const [month, setMonth] = React.useState<Date | undefined>(date)
  const [inputValue, setInputValue] = React.useState(formatDate(date))

  React.useEffect(() => {
    const newDate = value ? new Date(value) : undefined
    setDate(newDate)
    setMonth(newDate)
    setInputValue(formatDate(newDate))
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    
    const parsedDate = parseDate(newValue)
    if (parsedDate) {
      setDate(parsedDate)
      setMonth(parsedDate)
      if (onChange) {
        onChange(parsedDate)
      }
    }
  }

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setInputValue(formatDate(selectedDate))
    if (onChange) {
      onChange(selectedDate)
    }
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setOpen(true)
    }
  }

  return (
    <div className={cn("relative flex gap-2", className)}>
      <Input
        id={id}
        value={inputValue}
        placeholder={placeholder}
        className="bg-background pr-10 h-9"
        disabled={disabled}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={`${id}-picker`}
            variant="ghost"
            type="button"
            disabled={disabled}
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2 p-0"
          >
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Chọn ngày</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={handleSelect}
            disabled={fromDate || toDate ? (d) => {
              if (fromDate && d < fromDate) return true;
              if (toDate && d > toDate) return true;
              return false;
            } : undefined}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
