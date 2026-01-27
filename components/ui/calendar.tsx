"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "../../lib/utils"
import { buttonVariants } from "./button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "flex flex-col gap-4",
        month_caption: "flex items-center justify-center h-7",
        caption_label: "hidden",
        dropdowns: "flex items-center justify-center gap-2",
        dropdown_root: "relative",
        months_dropdown:
          "appearance-none border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground font-medium text-sm rounded-md px-2 py-1.5 [&>option]:bg-background cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring",
        years_dropdown:
          "appearance-none border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground font-medium text-sm rounded-md px-2 py-1.5 [&>option]:bg-background cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring",
        nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between h-7",
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "size-7 bg-transparent p-0 opacity-80 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "size-7 bg-transparent p-0 opacity-80 hover:opacity-100"
        ),
        month_grid: "mx-auto",
        weekdays: "flex",
        weekday: "text-muted-foreground w-9 font-normal text-[0.8rem] text-center",
        week: "flex w-full mt-2",
        day: "relative p-0 text-center text-sm",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 p-0 font-normal hover:bg-accent hover:text-accent-foreground aria-selected:opacity-100"
        ),
        range_start: "day-range-start rounded-l-md",
        range_end: "day-range-end rounded-r-md",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
        today: "bg-accent text-accent-foreground rounded-md",
        outside: "day-outside text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight
          return <Icon className="size-4" />
        },
      }}
      {...props}
    />
  )
}

export { Calendar }
