import * as React from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useDebounce } from '../../hooks/use-debounce.ts';
import { cn } from '../../lib/utils.ts';
import { Button } from './button.tsx';
import { Command, CommandInput, CommandEmpty } from './command.tsx';
import { Popover, PopoverContent, PopoverTrigger } from './popover.tsx';

export type ComboboxOption = {
  value: string;
  label: string;
  subtitle?: string | undefined; // For additional info like ID, phone
  acText?: string | undefined; // Accent-stripped text for resilient search
  metadata?: any | undefined; // Optional metadata for custom rendering
};

type VirtualizedComboboxProps = {
  value: ComboboxOption | null;
  onChange: (value: ComboboxOption | null) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyPlaceholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onSearchChange?: (search: string) => void; // For server-side filtering
  renderOption?: (option: ComboboxOption, isSelected: boolean) => React.ReactNode;
  renderHeader?: () => React.ReactNode; // ✅ Custom header (e.g., "Add new" button)
  estimatedItemHeight?: number; // Estimated height for better performance
  maxHeight?: number;
  minSearchLength?: number; // Minimum chars before showing results
};

const defaultRenderOption = (option: ComboboxOption, isSelected: boolean) => (
  <div className="flex items-center flex-1 min-w-0">
    <Check
      className={cn(
        'mr-2 h-4 w-4 flex-shrink-0',
        isSelected ? 'opacity-100' : 'opacity-0'
      )}
    />
    <div className="flex flex-col flex-1 min-w-0">
      <span className="font-medium text-sm truncate">{option.label}</span>
      {option.subtitle && (
        <span className="text-xs text-muted-foreground truncate">
          {option.subtitle}
        </span>
      )}
    </div>
  </div>
);

export function VirtualizedCombobox({
  value,
  onChange,
  options,
  placeholder = 'Chọn một tùy chọn',
  searchPlaceholder = 'Tìm kiếm...',
  emptyPlaceholder = 'Không tìm thấy kết quả.',
  disabled = false,
  isLoading = false,
  onSearchChange,
  renderOption = defaultRenderOption,
  renderHeader, // ✅ NEW: Custom header
  estimatedItemHeight = 48,
  maxHeight = 320,
  minSearchLength = 0,
}: VirtualizedComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const parentRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null); // NEW: Ref for input

  // Client-side filtering (if no server-side handler)
  const filteredOptions = React.useMemo(() => {
    if (onSearchChange) return options; // Server handles filtering
    
    // Use immediate search for instant filtering (no debounce lag)
    const query = searchQuery.toLowerCase();
    if (!query) return options;
    
    return options.filter(option => {
      const subtitleMatch = option.subtitle?.toLowerCase().includes(query);
      const acTextMatch = option.acText?.toLowerCase().includes(query);
      return (
        option.label.toLowerCase().includes(query) ||
        option.value.toLowerCase().includes(query) ||
        subtitleMatch ||
        acTextMatch
      );
    });
  }, [options, searchQuery, onSearchChange]);

  // Show results: if minSearchLength > 0, check debounced search
  // if minSearchLength = 0, always show (use current search, not debounced)
  const shouldShowResults = minSearchLength > 0 
    ? debouncedSearchQuery.length >= minSearchLength
    : true;
  
  const displayOptions = shouldShowResults ? filteredOptions : [];

  // Tanstack Virtual for 10K+ items performance
  const virtualizer = useVirtualizer({
    count: displayOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedItemHeight,
    overscan: 5, // Render 5 extra items outside viewport
  });

  // Call server-side search handler
  React.useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, onSearchChange]);

  // Reset scroll and force virtualizer measure when popup opens
  React.useEffect(() => {
    if (open) {
      if (parentRef.current) {
        parentRef.current.scrollTop = 0;
      }
      // Force virtualizer to measure after a tick
      requestAnimationFrame(() => {
        virtualizer.measure();
      });
      // NEW: Auto focus vào input khi mở popup
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [open, virtualizer]);

  const handleSelect = (option: ComboboxOption) => {
    onChange(option.value === value?.value ? null : option);
    setOpen(false);
    setSearchQuery('');
  };

  const handleSearchChange = (newValue: string) => {
    setSearchQuery(newValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal h-9"
          disabled={disabled}
        >
          <span className="truncate">{value ? value.label : placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[--radix-popover-trigger-width] p-0" 
        align="start"
        side="bottom"
        sideOffset={4}
        onOpenAutoFocus={(e) => {
          e.preventDefault(); // Prevent default radix behavior
          // Focus will be handled by useEffect
        }}
      >
        <Command shouldFilter={false}>
          <CommandInput
            ref={inputRef}
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={handleSearchChange}
          />
          
          {/* ✅ Custom header (e.g., "Add new" button) */}
          {renderHeader && renderHeader()}
          
          {isLoading ? (
            <div className="py-6 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">Đang tải...</p>
            </div>
          ) : !shouldShowResults && minSearchLength > 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Nhập ít nhất {minSearchLength} ký tự để tìm kiếm
            </div>
          ) : displayOptions.length === 0 ? (
            <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
          ) : (
            <div 
              ref={parentRef}
              className="overflow-y-auto overflow-x-hidden scrollbar-thin"
              style={{ 
                maxHeight: `${maxHeight}px`,
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch',
              }}
              onWheel={(e) => {
                e.stopPropagation();
              }}
            >
              {/* Total height placeholder for scroll */}
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                  minHeight: displayOptions.length > 0 ? `${estimatedItemHeight}px` : '0px',
                }}
              >
                {/* Only render visible items */}
                {virtualizer.getVirtualItems().length > 0 ? (
                  virtualizer.getVirtualItems().map((virtualItem) => {
                    const option = displayOptions[virtualItem.index];
                    const isSelected = value?.value === option.value;
                    
                    return (
                      <div
                        key={virtualItem.key}
                        data-index={virtualItem.index}
                        ref={virtualizer.measureElement}
                        className={cn(
                          "absolute top-0 left-0 w-full",
                          "flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                          "hover:bg-accent hover:text-accent-foreground",
                          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                          isSelected && "bg-accent"
                        )}
                        style={{
                          transform: `translateY(${virtualItem.start}px)`,
                        }}
                        onClick={() => handleSelect(option)}
                      >
                        {renderOption(option, isSelected)}
                      </div>
                    );
                  })
                ) : (
                  /* Fallback: render first few items without virtualization */
                  displayOptions.slice(0, 10).map((option, index) => {
                    const isSelected = value?.value === option.value;
                    return (
                      <div
                        key={option.value}
                        className={cn(
                          "flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                          "hover:bg-accent hover:text-accent-foreground",
                          isSelected && "bg-accent"
                        )}
                        style={{ height: `${estimatedItemHeight}px` }}
                        onClick={() => handleSelect(option)}
                      >
                        {renderOption(option, isSelected)}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
          
          {/* Show count info */}
          {displayOptions.length > 0 && (
            <div className="border-t px-2 py-1.5 text-xs text-muted-foreground">
              {displayOptions.length === options.length 
                ? `${displayOptions.length} kết quả`
                : `${displayOptions.length} / ${options.length} kết quả`
              }
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
