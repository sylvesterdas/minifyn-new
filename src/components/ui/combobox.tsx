
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

export function Combobox({ 
    options, 
    value, 
    onSelect, 
    placeholder = "Select an option...", 
    searchPlaceholder = "Search...", 
    emptyText = "No results found." 
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = options.find((option) => option.value === value);

  // For display purposes, we need a string version of the label.
  const getDisplayLabel = (option: { value: string; label: React.ReactNode } | undefined): string => {
      if (!option) return placeholder;
      if (typeof option.label === 'string') return option.label;
      // Heuristic to get a string from a JSX label for display in the button.
      const richOption = options.find(o => o.value === option.value) as any;
      return richOption?.searchLabel || placeholder;
  }

  // Show top 5 recent links + "All Links" by default, or all if searching
  const [searchValue, setSearchValue] = React.useState("");
  const visibleOptions = searchValue ? options : options.slice(0, 6); // "All Links" + 5 recent links

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10"
        >
          <span className="truncate">
             {getDisplayLabel(selectedOption)}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command onValueChange={setSearchValue}>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {visibleOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.keywords ? option.keywords.join(' ') : option.value}
                  onSelect={(currentValue) => {
                    const selectedValue = options.find(o => o.keywords?.includes(currentValue) || o.value === currentValue)?.value || '';
                    onSelect(selectedValue === value ? "" : selectedValue)
                    setOpen(false)
                  }}
                  className="h-auto min-h-10"
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
