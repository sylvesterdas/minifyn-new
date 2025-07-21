
"use client"

import * as React from "react"
import { format, addDays, differenceInDays, subDays, startOfDay, endOfDay } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "./separator"

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

  const setPresetRange = (days: number) => {
    const from = startOfDay(subDays(new Date(), days - 1));
    const to = endOfDay(new Date());
    onDateChange({ from, to });
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
             {date && (
                <X className="ml-auto h-4 w-4 text-muted-foreground hover:text-foreground" onClick={(e) => {
                  e.stopPropagation();
                  onDateChange(undefined);
                }} />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex" align="start">
            <div className="flex flex-col space-y-2 border-r p-4">
                <Button variant="ghost" className="justify-start" onClick={() => setPresetRange(7)}>Last 7 Days</Button>
                <Button variant="ghost" className="justify-start" onClick={() => setPresetRange(30)}>Last 30 Days</Button>
                <Separator />
                <Button variant="ghost" className="justify-start text-destructive hover:text-destructive" onClick={() => onDateChange(undefined)}>Reset</Button>
            </div>
            <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleSelect}
                numberOfMonths={1}
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
