
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
    options: { value: string; label: React.ReactNode; searchLabel: string; keywords?: string[] }[];
    allOptions?: { value: string; label: React.ReactNode; searchLabel: string; keywords?: string[] }[]; // Optional full list for searching
    value: string;
    onSelect: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
}

export function Combobox({ 
    options, 
    allOptions,
    value, 
    onSelect, 
    placeholder = "Select an option...", 
    searchPlaceholder = "Search...", 
    emptyText = "No results found." 
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('');

  const selectedOption = options.find((option) => option.value === value) || allOptions?.find((option) => option.value === value);
  const searchList = allOptions || options;

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
             {selectedOption ? selectedOption.searchLabel : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={searchPlaceholder} 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {(search.length > 0 ? searchList : options).map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.keywords ? option.keywords.join(' ') : option.value}
                  onSelect={(currentValue) => {
                    const selectedValue = searchList.find(o => o.keywords?.join(' ') === currentValue)?.value || option.value;
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
