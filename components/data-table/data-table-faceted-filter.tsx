import * as React from "react"
import { Check, PlusCircle } from "lucide-react"

import { cn } from "../../lib/utils"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import { Separator } from "../ui/separator"
import { useModal } from "../../contexts/modal-context"

interface DataTableFacetedFilterProps {
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
  selectedValues: Set<string>
  onSelectedValuesChange: (values: Set<string>) => void
}

export function DataTableFacetedFilter({
  title,
  options,
  selectedValues,
  onSelectedValuesChange
}: DataTableFacetedFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const modalId = React.useId();
  useModal(modalId, isOpen);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-dashed flex items-center px-3 text-sm w-full sm:w-auto justify-start"
        >
          <PlusCircle className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{title}</span>
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-1.5 h-3.5" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal text-xs sm:hidden ml-auto"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 sm:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal text-xs"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal text-xs"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      {/* FIX: Removed unsupported `align` prop. */}
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      const newSelectedValues = new Set(selectedValues)
                      if (isSelected) {
                        newSelectedValues.delete(option.value)
                      } else {
                        newSelectedValues.add(option.value)
                      }
                      onSelectedValuesChange(newSelectedValues)
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onSelectedValuesChange(new Set())}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
