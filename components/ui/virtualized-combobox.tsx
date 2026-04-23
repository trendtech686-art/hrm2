import * as React from 'react';
import { Check, ChevronsUpDown, Loader2, Search } from 'lucide-react';
import { useDebounce } from '../../hooks/use-debounce';
import { cn } from '../../lib/utils';
import { removeVietnameseAccents } from '../../lib/filename-utils';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export type ComboboxOption = {
  value: string;
  label: string;
  subtitle?: string | undefined;
  acText?: string | undefined;
  metadata?: unknown | undefined;
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
  onSearchChange?: (search: string) => void;
  onOpenChange?: (open: boolean) => void;
  renderOption?: (option: ComboboxOption, isSelected: boolean) => React.ReactNode;
  renderHeader?: () => React.ReactNode;
  estimatedItemHeight?: number;
  maxHeight?: number;
  minSearchLength?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
};

const defaultRenderOption = (option: ComboboxOption, isSelected: boolean) => (
  <div className="flex items-center flex-1 min-w-0">
    <Check
      className={cn(
        'mr-2 h-4 w-4 shrink-0',
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
  onOpenChange,
  renderOption = defaultRenderOption,
  renderHeader,
  estimatedItemHeight: _estimatedItemHeight = 48,
  maxHeight = 320,
  minSearchLength = 0,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}: VirtualizedComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = React.useState(0);

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
    if (!newOpen) setSearchQuery('');
  }, [onOpenChange]);

  React.useEffect(() => {
    if (open && triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  React.useEffect(() => {
    if (open) {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filteredOptions = React.useMemo(() => {
    if (onSearchChange) return options;
    const query = searchQuery.toLowerCase();
    if (!query) return options;
    const queryNoAccent = removeVietnameseAccents(query).toLowerCase();
    return options.filter(option => {
      const labelLower = option.label.toLowerCase();
      const labelNoAccent = removeVietnameseAccents(labelLower);
      const subtitleMatch = option.subtitle?.toLowerCase().includes(query) ||
        (option.subtitle ? removeVietnameseAccents(option.subtitle.toLowerCase()).includes(queryNoAccent) : false);
      const acTextMatch = option.acText?.toLowerCase().includes(query) ||
        option.acText?.toLowerCase().includes(queryNoAccent);
      return (
        labelLower.includes(query) ||
        labelNoAccent.includes(queryNoAccent) ||
        option.value.toLowerCase().includes(query) ||
        subtitleMatch ||
        acTextMatch
      );
    });
  }, [options, searchQuery, onSearchChange]);

  const shouldShowResults = minSearchLength > 0
    ? debouncedSearchQuery.length >= minSearchLength
    : true;
  const displayOptions = shouldShowResults ? filteredOptions : [];

  React.useEffect(() => {
    if (onSearchChange) onSearchChange(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearchChange]);

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 100) {
      if (hasMore && !isLoadingMore && onLoadMore) onLoadMore();
    }
  }, [hasMore, isLoadingMore, onLoadMore]);

  const handleSelect = React.useCallback((option: ComboboxOption) => {
    onChange(option.value === value?.value ? null : option);
    handleOpenChange(false);
  }, [onChange, value?.value, handleOpenChange]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled}
        >
          <span className="truncate">{value ? value.label : placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 max-w-[calc(100vw-1rem)]"
        style={{ width: triggerWidth > 0 ? `${Math.max(triggerWidth, 320)}px` : 320 }}
        align="start"
        side="bottom"
        sideOffset={4}
        collisionPadding={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onFocusOutside={(e) => e.preventDefault()}
      >
        <div className="flex items-center border-b border-border px-3">
          <Search className="h-4 w-4 shrink-0 opacity-50" />
          <input
            ref={inputRef}
            className="flex h-9 w-full bg-transparent py-3 pl-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {renderHeader?.()}

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
          <div className="py-6 text-center text-sm text-muted-foreground">
            {emptyPlaceholder}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="overflow-y-auto overflow-x-hidden scrollbar-thin"
            style={{
              maxHeight: `${maxHeight}px`,
              overscrollBehavior: 'contain',
            }}
            onWheel={(e) => e.stopPropagation()}
            onScroll={handleScroll}
          >
            {displayOptions.map((option) => {
              const isSelected = value?.value === option.value;
              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    'flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                    'hover:bg-accent hover:text-accent-foreground',
                    isSelected && 'bg-accent'
                  )}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelect(option);
                  }}
                >
                  {renderOption(option, isSelected)}
                </div>
              );
            })}
            {isLoadingMore && (
              <div className="py-2 text-center">
                <Loader2 className="h-4 w-4 animate-spin mx-auto text-muted-foreground" />
              </div>
            )}
          </div>
        )}

        {displayOptions.length > 0 && (
          <div className="border-t border-border px-2 py-1.5 text-xs text-muted-foreground flex items-center justify-between">
            <span>
              {displayOptions.length === options.length
                ? `${displayOptions.length} kết quả`
                : `${displayOptions.length} / ${options.length} kết quả`}
            </span>
            {hasMore && <span className="text-primary">Cuộn để tải thêm</span>}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}