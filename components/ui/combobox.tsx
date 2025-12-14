import * as React from 'react';
import { Check, ChevronsUpDown, User, Edit } from 'lucide-react';
import { useDebounce } from '../../hooks/use-debounce.ts';

import { cn } from '../../lib/utils.ts';
import { Button } from './button.tsx';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command.tsx';
import { Popover, PopoverContent, PopoverTrigger } from './popover.tsx';
import { Spinner } from './spinner.tsx';

export type ComboboxOption = {
  value: string;
  label: string;
  subtitle?: string | undefined;
  acText?: string | undefined;
  metadata?: Record<string, unknown> | undefined;
};

type ComboboxProps = {
  value: ComboboxOption | null;
  onChange: (value: ComboboxOption | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyPlaceholder?: string;
  disabled?: boolean | undefined;
  renderHeader?: () => React.ReactNode;
  renderOption?: (option: ComboboxOption, isSelected: boolean) => React.ReactNode;
} & ({
  options: ComboboxOption[];
  onSearch?: never;
} | {
  options?: never;
  onSearch: (query: string, page: number) => Promise<{ items: ComboboxOption[], hasNextPage: boolean }>;
});

const defaultRenderOption = (option: ComboboxOption, isSelected: boolean) => (
  <>
    <Check
      className={cn(
        'mr-2 h-4 w-4',
        isSelected ? 'opacity-100' : 'opacity-0'
      )}
    />
    {option.label}
  </>
);


export function Combobox({
  value,
  onChange,
  options,
  onSearch,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  emptyPlaceholder = 'No options found.',
  disabled = false,
  renderHeader,
  renderOption = defaultRenderOption,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const isAsync = !!onSearch;

  // --- State for async search ---
  const [searchQuery, setSearchQuery] = React.useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [asyncItems, setAsyncItems] = React.useState<ComboboxOption[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [hasNextPage, setHasNextPage] = React.useState(true);

  // --- Intersection Observer for infinite scroll ---
  const observer = React.useRef<IntersectionObserver | null>(null);
  const lastItemRef = React.useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage]
  );

  // Effect to reset for new search term
  React.useEffect(() => {
    if (!isAsync || !open) return;
    setPage(1);
    setHasNextPage(true);
  }, [debouncedSearchQuery, isAsync, open]);

  // Effect to fetch data
  React.useEffect(() => {
    if (!isAsync || !open) return;
    if (!hasNextPage && page > 1) return;

    let isCancelled = false;
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const result = await onSearch(debouncedSearchQuery, page);
        if (!isCancelled) {
          setAsyncItems((prev) => (page === 1 ? result.items : [...prev, ...result.items]));
          setHasNextPage(result.hasNextPage);
        }
      } catch (error) {
        console.error("Failed to fetch combobox options:", error);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchItems();
    return () => { isCancelled = true; };
  }, [isAsync, open, onSearch, debouncedSearchQuery, page, hasNextPage]);
  
  const displayOptions = isAsync ? asyncItems : options || [];

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
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={!isAsync}>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={isAsync ? setSearchQuery : () => {}}
            value={isAsync ? searchQuery : ""}
          />
          {renderHeader && renderHeader()}
          <div className="relative">
             {isAsync && isLoading && page === 1 && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <Spinner />
              </div>
            )}
            <CommandList>
              <CommandEmpty>{!isLoading && emptyPlaceholder}</CommandEmpty>
              <CommandGroup>
                {displayOptions.map((option, index) => (
                  <CommandItem
                    ref={isAsync && index === displayOptions.length - 1 ? lastItemRef : null}
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onChange(option.value === value?.value ? null : option);
                      setOpen(false);
                    }}
                  >
                    {renderOption(option, value?.value === option.value)}
                  </CommandItem>
                ))}
                {isAsync && isLoading && page > 1 && (
                  <div className="flex items-center justify-center p-2 text-sm text-muted-foreground">
                    <Spinner className="mr-2 h-4 w-4"/>
                    Đang tải thêm...
                  </div>
                )}
              </CommandGroup>
            </CommandList>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
