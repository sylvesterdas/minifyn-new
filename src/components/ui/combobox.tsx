"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
    options: { value: string; label: React.ReactNode; keywords?: string[] }[];
    value: string;
    onSelect: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
}

export function Combobox({ options, value, onSelect, placeholder = "Select an option...", searchPlaceholder = "Search...", emptyText = "No results found." }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">
             {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command
           filter={(itemValue, search) => {
                const option = options.find(opt => opt.value === itemValue);
                if (!option) return 0;

                const searchLower = search.toLowerCase();
                // Check if label (as string) contains search term
                if (typeof option.label === 'string' && option.label.toLowerCase().includes(searchLower)) {
                    return 1;
                }
                // Check if any keyword contains search term
                if (option.keywords?.some(kw => kw.toLowerCase().includes(searchLower))) {
                    return 1;
                }
                return 0;
            }}
        >
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onSelect(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
