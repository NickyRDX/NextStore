"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { es } from "react-day-picker/locale"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout,
  ...props
}: CalendarProps) {
  const isDropdown = !!captionLayout?.startsWith("dropdown")

  return (
    <DayPicker
      locale={es}
      captionLayout={captionLayout}
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col gap-4",
        month: "flex flex-col gap-3 w-full",
        month_caption: "flex justify-center pt-1 relative items-center w-full min-h-8",
        caption_label: isDropdown ? "hidden" : "text-sm font-semibold capitalize",
        nav: isDropdown ? "hidden" : "flex items-center gap-1",
        button_previous: isDropdown
          ? "hidden"
          : "absolute left-1 h-7 w-7 p-0 flex items-center justify-center rounded-md text-muted-foreground opacity-50 hover:opacity-100 hover:bg-accent transition-opacity cursor-pointer",
        button_next: isDropdown
          ? "hidden"
          : "absolute right-1 h-7 w-7 p-0 flex items-center justify-center rounded-md text-muted-foreground opacity-50 hover:opacity-100 hover:bg-accent transition-opacity cursor-pointer",
        dropdowns: "flex items-center justify-center gap-2",
        dropdown_root: "relative flex items-center gap-0.5",
        dropdown:
          "text-sm font-semibold cursor-pointer border-none bg-transparent focus:outline-none appearance-none pr-1",
        month_grid: "w-full border-collapse mt-1",
        weekdays: "flex w-full",
        weekday:
          "flex-1 text-muted-foreground font-medium text-[0.7rem] uppercase tracking-wide text-center pb-2",
        week: "flex w-full mt-0.5",
        day: "flex-1 relative p-0 flex items-center justify-center",
        day_button:
          "h-9 w-9 p-0 font-normal rounded-full flex items-center justify-center text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-150 cursor-pointer aria-selected:opacity-100",
        selected:
          "bg-primary text-primary-foreground rounded-full hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-medium",
        today:
          "bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 hover:text-white",
        outside: "text-muted-foreground opacity-35",
        disabled:
          "text-muted-foreground opacity-25 cursor-not-allowed pointer-events-none",
        hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
