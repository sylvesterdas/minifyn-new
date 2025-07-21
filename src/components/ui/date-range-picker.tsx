
"use client"

import * as React from "react"
import { format, addDays, differenceInDays } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined
  onDateChange: (date: DateRange | undefined) => void
  numberOfDays?: number;
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
  numberOfDays = 30
}: DateRangePickerProps) {

  const handleSelect = (selectedDate: DateRange | undefined) => {
    if (!selectedDate?.from) {
      onDateChange(selectedDate);
      return;
    }
    if (!selectedDate.to) {
      onDateChange(selectedDate);
      return;
    }
    if (differenceInDays(selectedDate.to, selectedDate.from) < numberOfDays) {
      onDateChange(selectedDate);
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={
              (d) => (date?.from && !date.to) 
              ? (differenceInDays(d, date.from) >= numberOfDays || differenceInDays(d, date.from) < 0)
              : false
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
