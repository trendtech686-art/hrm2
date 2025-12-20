import * as React from "react"
import { cn } from "../../lib/utils"
import { Input, type InputProps } from "./input"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

// FIX: Rename `onSelect` to `onOptionSelect` to avoid conflict with native React `onSelect` event handler.
export interface AutocompleteProps extends Omit<InputProps, 'onChange'> {
  options: string[];
  value?: string;
  onChange: (value: string) => void;
  onOptionSelect?: (value: string) => void;
}

const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  ({ className, options, value, onChange, onOptionSelect, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value || '');

    React.useEffect(() => {
        setInputValue(value || '');
    }, [value]);
    
    const filteredOptions = React.useMemo(() => {
        if (!inputValue) return [];
        return options.filter(option =>
            option.toLowerCase().includes(inputValue.toLowerCase())
        );
    }, [options, inputValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);
        if (newValue) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    const handleSelectOption = (option: string) => {
        setInputValue(option);
        onChange(option);
        onOptionSelect?.(option);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="relative">
                    <Input
                        ref={ref}
                        value={inputValue}
                        onChange={handleInputChange}
                        className={className}
                        autoComplete="off"
                        {...props}
                    />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                {filteredOptions.length > 0 ? (
                    <ul className="max-h-60 overflow-y-auto">
                        {filteredOptions.map((option, index) => (
                            <li
                                key={index}
                                className="cursor-pointer p-2 hover:bg-accent"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelectOption(option);
                                }}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                ) : (
                    inputValue && <p className="p-2 text-sm text-muted-foreground">No results found.</p>
                )}
            </PopoverContent>
        </Popover>
    );
  }
);
Autocomplete.displayName = "Autocomplete"

export { Autocomplete }
