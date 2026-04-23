import * as React from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '../ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { 
  Filter, 
  X, 
  Save, 
  Calendar as CalendarIcon,
  Star,
  Search,
  ChevronsUpDown,
} from 'lucide-react';
import {
  startOfDay,
  endOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { VirtualizedCombobox, type ComboboxOption } from '../ui/virtualized-combobox';

/**
 * Filter types
 */
export type FilterType = 
  | 'text'           // Text input
  | 'select'         // Single select dropdown
  | 'multi-select'   // Multiple select with checkboxes
  | 'combobox'       // Virtualized combobox with search (for large datasets)
  | 'date'           // Single date picker
  | 'date-range'     // Date range picker
  | 'number-range'   // Min/max number inputs
  | 'boolean'        // Checkbox
  | 'tags';          // Tag chips

export interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: FilterType;
  placeholder?: string;
  options?: FilterOption[]; // For select/multi-select/tags
  comboboxOptions?: ComboboxOption[]; // For combobox type (VirtualizedCombobox)
  comboboxOnSearchChange?: (search: string) => void;
  comboboxOnLoadMore?: () => void;
  comboboxHasMore?: boolean;
  comboboxIsLoadingMore?: boolean;
  comboboxIsLoading?: boolean;
  defaultValue?: unknown;
  description?: string;
  group?: string; // Optional group header (e.g. "Thông tin đơn hàng", "Thời gian")
}

export interface FilterPreset {
  id: string;
  name: string;
  icon?: React.ReactNode;
  filters: Record<string, unknown>;
  isStarred?: boolean;
}

export interface AdvancedFilterPanelProps {
  /** Filter configurations */
  filters: FilterConfig[];
  
  /** Current filter values */
  values: Record<string, unknown>;
  
  /** Callback when filters change (optional — panel uses internal draft) */
  onChange?: (values: Record<string, unknown>) => void;
  
  /** Callback when filters are applied */
  onApply?: (values: Record<string, unknown>) => void;
  
  /** Callback when filters are reset */
  onReset?: () => void;
  
  /** Saved filter presets */
  presets?: FilterPreset[];
  
  /** Callback when preset is saved */
  onSavePreset?: (preset: Omit<FilterPreset, 'id'>) => void;
  
  /** Callback when preset is deleted */
  onDeletePreset?: (presetId: string) => void;
  
  /** Callback when existing preset is updated */
  onUpdatePreset?: (presetId: string, filters: Record<string, unknown>) => void;
  
  /** Callback when preset is loaded */
  onLoadPreset?: (preset: FilterPreset) => void;
  
  /** Trigger button label */
  triggerLabel?: string;
  
  /** Show active filter count on trigger */
  showActiveCount?: boolean;
  
  /** Open by default */
  defaultOpen?: boolean;
  
  /** Callback when panel open state changes */
  onOpenChange?: (open: boolean) => void;
}

/**
 * AdvancedFilterPanel - Generic advanced filtering component
 * 
 * @example
 * ```tsx
 * const filterConfigs: FilterConfig[] = [
 *   {
 *     id: 'status',
 *     label: 'Trạng thái',
 *     type: 'multi-select',
 *     options: [
 *       { value: 'pending', label: 'Chờ xử lý' },
 *       { value: 'done', label: 'Hoàn thành' },
 *     ],
 *   },
 *   {
 *     id: 'dateRange',
 *     label: 'Khoảng thời gian',
 *     type: 'date-range',
 *   },
 *   {
 *     id: 'priority',
 *     label: 'Độ ưu tiên',
 *     type: 'select',
 *     options: [
 *       { value: 'high', label: 'Cao' },
 *       { value: 'medium', label: 'Trung bình' },
 *       { value: 'low', label: 'Thấp' },
 *     ],
 *   },
 * ];
 * 
 * <AdvancedFilterPanel
 *   filters={filterConfigs}
 *   values={filterValues}
 *   onChange={setFilterValues}
 *   onApply={handleApplyFilters}
 *   presets={savedPresets}
 *   onSavePreset={handleSavePreset}
 * />
 * ```
 */
export function AdvancedFilterPanel({
  filters,
  values,
  onChange,
  onApply,
  onReset,
  presets = [],
  onSavePreset,
  onDeletePreset,
  onUpdatePreset,
  onLoadPreset,
  triggerLabel = 'Bộ lọc',
  showActiveCount = true,
  defaultOpen = false,
  onOpenChange,
}: AdvancedFilterPanelProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }, [onOpenChange]);
  const [presetName, setPresetName] = React.useState('');
  const [showSavePreset, setShowSavePreset] = React.useState(false);
  const [saveMode, setSaveMode] = React.useState<'new' | 'existing'>('new');
  const [filterSearch, setFilterSearch] = React.useState('');

  // Internal draft state — syncs from props when panel opens
  const [draft, setDraft] = React.useState<Record<string, unknown>>(values);
  React.useEffect(() => {
    if (open) setDraft({ ...values });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Count active filters (based on draft while editing)
  const activeFilterCount = React.useMemo(() => {
    return Object.entries(draft).filter(([_key, value]) => {
      if (value === null || value === undefined || value === '') return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && (value as { from?: unknown; to?: unknown }).from === undefined && (value as { from?: unknown; to?: unknown }).to === undefined) return false;
      return true;
    }).length;
  }, [draft]);

  const handleFilterChange = React.useCallback((filterId: string, value: unknown) => {
    setDraft(prev => {
      const next = { ...prev, [filterId]: value };
      onChange?.(next);
      return next;
    });
  }, [onChange]);

  const handleReset = React.useCallback(() => {
    const resetValues: Record<string, unknown> = {};
    filters.forEach((filter) => {
      resetValues[filter.id] = filter.defaultValue ?? null;
    });
    setDraft(resetValues);
    onChange?.(resetValues);
    onApply?.(resetValues);
    onReset?.();
    handleOpenChange(false);
    toast.success('Đã xóa tất cả bộ lọc');
  }, [filters, onChange, onApply, onReset, handleOpenChange]);

  const handleApply = React.useCallback(() => {
    onApply?.(draft);
    handleOpenChange(false);
  }, [draft, onApply, handleOpenChange]);

  const handleSavePreset = React.useCallback(() => {
    if (!presetName.trim()) {
      toast.error('Vui lòng nhập tên bộ lọc');
      return;
    }

    onSavePreset?.({
      name: presetName,
      filters: draft,
      icon: <Star className="h-4 w-4" />,
    });

    setPresetName('');
    setShowSavePreset(false);
    toast.success(`Đã lưu bộ lọc "${presetName}"`);
  }, [presetName, draft, onSavePreset]);

  const handleLoadPreset = React.useCallback((preset: FilterPreset) => {
    setDraft(preset.filters);
    onApply?.(preset.filters);
    onChange?.(preset.filters);
    onLoadPreset?.(preset);
    handleOpenChange(false);
    toast.success(`Đã tải bộ lọc "${preset.name}"`);
  }, [onApply, onChange, onLoadPreset, handleOpenChange]);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 relative">
          <Filter className="h-4 w-4" />
          <span className="ml-2">{triggerLabel}</span>
          {showActiveCount && activeFilterCount > 0 && (
            <Badge
              variant="default"
              className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Bộ lọc nâng cao</SheetTitle>
          <SheetDescription>
            Lọc dữ liệu theo các tiêu chí chi tiết
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] mt-6 pr-4">
          {/* Saved Presets */}
          {presets.length > 0 && (
            <div className="mb-6">
              <Label className="text-sm font-semibold mb-2 block">Bộ lọc đã lưu</Label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <div key={preset.id} className="group relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadPreset(preset)}
                      className="h-8"
                    >
                      {preset.icon}
                      <span className="ml-1">{preset.name}</span>
                    </Button>
                    {onDeletePreset && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-5 w-5 absolute -top-2 -right-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePreset(preset.id);
                          toast.success(`Đã xóa bộ lọc "${preset.name}"`);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Separator className="mt-4" />
            </div>
          )}

          {/* Search Filters (E6 — only show when ≥5 filters) */}
          {filters.length >= 5 && (
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bộ lọc..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="h-9 pl-9"
              />
            </div>
          )}

          {/* Filter Fields — grouped render (E5) */}
          <FilterFieldsGrouped
            filters={filters}
            draft={draft}
            filterSearch={filterSearch}
            onFilterChange={handleFilterChange}
          />
        </ScrollArea>

        {/* Save Preset Dialog — nằm giữa scroll và footer */}
        {onSavePreset && showSavePreset && (
          <div className="border-t bg-background px-6 py-4">
            <div className="space-y-3">
              {/* Mode toggle: new vs existing */}
              {onUpdatePreset && presets.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    variant={saveMode === 'new' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => setSaveMode('new')}
                  >
                    Lưu mới
                  </Button>
                  <Button
                    variant={saveMode === 'existing' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => setSaveMode('existing')}
                  >
                    Lưu vào đã có
                  </Button>
                </div>
              )}

              {saveMode === 'new' ? (
                <div className="space-y-2">
                  <Label htmlFor="preset-name">Tên bộ lọc mới</Label>
                  <div className="flex gap-2">
                    <Input
                      id="preset-name"
                      placeholder="Tên bộ lọc..."
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSavePreset();
                      }}
                    />
                    <Button onClick={handleSavePreset} size="icon">
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Chọn bộ lọc cần ghi đè</Label>
                  <div className="space-y-1.5">
                    {presets.map((preset) => (
                      <Button
                        key={preset.id}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start h-8 text-xs"
                        onClick={() => {
                          onUpdatePreset?.(preset.id, draft);
                          setShowSavePreset(false);
                          setSaveMode('new');
                          toast.success(`Đã cập nhật bộ lọc "${preset.name}"`);
                        }}
                      >
                        <Save className="h-3 w-3 mr-2" />
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8"
                onClick={() => {
                  setShowSavePreset(false);
                  setPresetName('');
                  setSaveMode('new');
                }}
              >
                Hủy
              </Button>
            </div>
          </div>
        )}

        <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
          <div className="flex gap-2 w-full">
            {onSavePreset && !showSavePreset && (
              <Button variant="ghost" size="sm" onClick={() => setShowSavePreset(true)} className="mr-auto">
                <Save className="h-4 w-4 mr-2" />
                Lưu bộ lọc
              </Button>
            )}
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Xóa tất cả
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Áp dụng ({activeFilterCount})
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Grouped filter fields renderer (E5 + E6)
 */
function FilterFieldsGrouped({
  filters,
  draft,
  filterSearch,
  onFilterChange,
}: {
  filters: FilterConfig[];
  draft: Record<string, unknown>;
  filterSearch: string;
  onFilterChange: (filterId: string, value: unknown) => void;
}) {
  const searchLower = filterSearch.toLowerCase();
  const visible = filterSearch
    ? filters.filter((f) => f.label.toLowerCase().includes(searchLower))
    : filters;

  const hasGroups = visible.some((f) => f.group);

  if (!hasGroups) {
    return (
      <div className="space-y-6">
        {visible.map((filter) => (
          <FilterField
            key={filter.id}
            filter={filter}
            value={draft[filter.id]}
            onChange={(value) => onFilterChange(filter.id, value)}
          />
        ))}
      </div>
    );
  }

  // Group filters
  const grouped = new Map<string, FilterConfig[]>();
  for (const f of visible) {
    const group = f.group || 'Khác';
    if (!grouped.has(group)) grouped.set(group, []);
    grouped.get(group)!.push(f);
  }

  return (
    <div className="space-y-6">
      {Array.from(grouped.entries()).map(([group, groupFilters]) => (
        <div key={group}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            {group}
          </p>
          <div className="space-y-4">
            {groupFilters.map((filter) => (
              <FilterField
                key={filter.id}
                filter={filter}
                value={draft[filter.id]}
                onChange={(value) => onFilterChange(filter.id, value)}
              />
            ))}
          </div>
          <Separator className="mt-4" />
        </div>
      ))}
    </div>
  );
}

/**
 * Single filter field renderer
 */
function FilterField({
  filter,
  value,
  onChange,
}: {
  filter: FilterConfig;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={filter.id} className="text-sm font-medium">
        {filter.label}
      </Label>
      {filter.description && (
        <p className="text-xs text-muted-foreground">{filter.description}</p>
      )}
      <FilterInput filter={filter} value={value} onChange={onChange} />
    </div>
  );
}

/**
 * Quick date range presets (Sapo-style)
 */
// Module-level cache — chỉ tính lại khi ngày thay đổi (avoid 6 Date objects mỗi render)
let _quickRangesCache: { key: string; ranges: Array<{ label: string; from: Date; to: Date }> } | null = null;
function getQuickDateRanges() {
  const today = format(new Date(), 'yyyy-MM-dd');
  if (_quickRangesCache?.key === today) return _quickRangesCache.ranges;
  const now = new Date();
  const ranges = [
    { label: 'Hôm nay', from: startOfDay(now), to: endOfDay(now) },
    { label: 'Hôm qua', from: startOfDay(subDays(now, 1)), to: endOfDay(subDays(now, 1)) },
    { label: 'Tuần trước', from: startOfWeek(subDays(now, 7), { weekStartsOn: 1 }), to: endOfWeek(subDays(now, 7), { weekStartsOn: 1 }) },
    { label: 'Tuần này', from: startOfWeek(now, { weekStartsOn: 1 }), to: endOfWeek(now, { weekStartsOn: 1 }) },
    { label: 'Tháng trước', from: startOfMonth(subMonths(now, 1)), to: endOfMonth(subMonths(now, 1)) },
    { label: 'Tháng này', from: startOfMonth(now), to: endOfMonth(now) },
  ];
  _quickRangesCache = { key: today, ranges };
  return ranges;
}

/**
 * Filter input renderer based on filter type
 */
function FilterInput({
  filter,
  value,
  onChange,
}: {
  filter: FilterConfig;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  switch (filter.type) {
    case 'text':
      return (
        <Input
          id={filter.id}
          placeholder={filter.placeholder}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          className="h-9"
        />
      );

    case 'select':
      return (
        <Select value={(value as string) || ''} onValueChange={onChange}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder={filter.placeholder || 'Chọn...'} />
          </SelectTrigger>
          <SelectContent>
            {filter.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'multi-select': {
      const selectedValues = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="space-y-2 border rounded-md p-3">
          {filter.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${filter.id}-${option.value}`}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onChange([...selectedValues, option.value]);
                  } else {
                    onChange(selectedValues.filter((v) => v !== option.value));
                  }
                }}
              />
              <label
                htmlFor={`${filter.id}-${option.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
              >
                {option.icon}
                {option.label}
              </label>
            </div>
          ))}
        </div>
      );
    }

    case 'combobox': {
      const comboVal = value as ComboboxOption | null;
      return (
        <VirtualizedCombobox
          value={comboVal}
          onChange={(opt) => onChange(opt)}
          options={filter.comboboxOptions ?? []}
          placeholder={filter.placeholder || 'Chọn...'}
          searchPlaceholder="Tìm kiếm..."
          onSearchChange={filter.comboboxOnSearchChange}
          onLoadMore={filter.comboboxOnLoadMore}
          hasMore={filter.comboboxHasMore}
          isLoadingMore={filter.comboboxIsLoadingMore}
          isLoading={filter.comboboxIsLoading}
        />
      );
    }

    case 'date':
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full h-9 justify-start text-left font-normal',
                !value && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(new Date(value as string | number | Date), 'dd/MM/yyyy', { locale: vi }) : filter.placeholder || 'Chọn ngày'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={value ? new Date(value as string | number | Date) : undefined}
              onSelect={(date) => onChange(date?.toISOString())}
              locale={vi}
            />
          </PopoverContent>
        </Popover>
      );

    case 'date-range': {
      return <DateRangeFilter value={value} onChange={onChange} />;
    }

    case 'number-range': {
      const numRange = (value as { min?: string; max?: string }) || { min: '', max: '' };
      return (
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Từ"
            value={numRange.min || ''}
            onChange={(e) => onChange({ ...numRange, min: e.target.value })}
            className="h-9"
          />
          <Input
            type="number"
            placeholder="Đến"
            value={numRange.max || ''}
            onChange={(e) => onChange({ ...numRange, max: e.target.value })}
            className="h-9"
          />
        </div>
      );
    }

    case 'boolean':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={filter.id}
            checked={value === true}
            onCheckedChange={onChange}
          />
          <label htmlFor={filter.id} className="text-sm cursor-pointer">
            {filter.placeholder || 'Bật'}
          </label>
        </div>
      );

    case 'tags': {
      const selectedTags = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {filter.options?.map((option) => {
              const isSelected = selectedTags.includes(option.value);
              return (
                <Badge
                  key={option.value}
                  variant={isSelected ? 'default' : 'outline'}
                  className="cursor-pointer"
                  style={isSelected ? { backgroundColor: option.color } : {}}
                  onClick={() => {
                    if (isSelected) {
                      onChange(selectedTags.filter((v: string) => v !== option.value));
                    } else {
                      onChange([...selectedTags, option.value]);
                    }
                  }}
                >
                  {option.icon}
                  <span className="ml-1">{option.label}</span>
                  {isSelected && <X className="ml-1 h-3 w-3" />}
                </Badge>
              );
            })}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

/**
 * ActiveFilterTags — Displays active filters as removable tags (Sapo-style E2)
 */
export interface ActiveFilterTagsProps {
  filters: FilterConfig[];
  values: Record<string, unknown>;
  onRemove: (filterId: string) => void;
  onClearAll?: () => void;
}

export function ActiveFilterTags({ filters, values, onRemove, onClearAll }: ActiveFilterTagsProps) {
  const activeTags = React.useMemo(() => {
    return filters
      .filter((f) => {
        const v = values[f.id];
        if (v === null || v === undefined || v === '') return false;
        if (Array.isArray(v)) return v.length > 0;
        if (typeof v === 'object') {
          const obj = v as Record<string, unknown>;
          return obj.from !== undefined || obj.to !== undefined || obj.min !== undefined || obj.max !== undefined;
        }
        return true;
      })
      .map((f) => ({
        filter: f,
        displayValue: formatFilterValue(f, values[f.id]),
      }));
  }, [filters, values]);

  if (activeTags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeTags.map(({ filter, displayValue }) => (
        <Badge
          key={filter.id}
          variant="outline"
          className="h-7 gap-1.5 pl-2.5 pr-1 text-xs font-normal bg-muted/50"
        >
          <span className="text-muted-foreground">{filter.label}:</span>
          <span className="font-medium max-w-55 truncate">{displayValue}</span>
          <button
            type="button"
            className="ml-0.5 rounded-full p-0.5 hover:bg-destructive/10 hover:text-destructive transition-colors"
            onClick={() => onRemove(filter.id)}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {activeTags.length >= 2 && onClearAll && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
          onClick={onClearAll}
        >
          <X className="h-3 w-3 mr-1" />
          Xóa tất cả
        </Button>
      )}
    </div>
  );
}

/**
 * DateRangeFilter — Select dropdown with quick presets + custom date pickers (Sapo-style)
 */
const DateRangeFilter = React.memo(function DateRangeFilter({ value, onChange }: { value: unknown; onChange: (value: unknown) => void }) {
  const dateRange = (value as { from?: string; to?: string }) || { from: undefined, to: undefined };
  const quickRanges = getQuickDateRanges();
  const activeQuick = quickRanges.find(
    (r) => r.from.toISOString() === dateRange.from && r.to.toISOString() === dateRange.to
  );
  const [showCustom, setShowCustom] = React.useState(!activeQuick && (!!dateRange.from || !!dateRange.to));
  const [isOpen, setIsOpen] = React.useState(false);

  const handleQuickSelect = React.useCallback((rangeLabel: string) => {
    if (rangeLabel === '__custom__') {
      setShowCustom(true);
      setIsOpen(false);
      return;
    }
    const range = getQuickDateRanges().find(r => r.label === rangeLabel);
    if (range) {
      setShowCustom(false);
      onChange({ from: range.from.toISOString(), to: range.to.toISOString() });
    }
    setIsOpen(false);
  }, [onChange]);

  const displayLabel = activeQuick
    ? activeQuick.label
    : (dateRange.from || dateRange.to)
      ? showCustom ? 'Tùy chọn' : 'Tùy chọn'
      : undefined;

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full h-9 justify-between text-left font-normal',
              !displayLabel && 'text-muted-foreground'
            )}
          >
            <span>{displayLabel || 'Chọn...'}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-70 p-3" align="start">
          <div className="grid grid-cols-2 gap-2">
            {quickRanges.map((range) => (
              <Button
                key={range.label}
                variant={activeQuick?.label === range.label ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => handleQuickSelect(range.label)}
              >
                {range.label}
              </Button>
            ))}
            <Button
              variant={showCustom && !activeQuick ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs col-span-2"
              onClick={() => handleQuickSelect('__custom__')}
            >
              Tùy chọn
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {showCustom && (
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 h-9 justify-start text-left font-normal text-xs">
                <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                {dateRange.from ? format(new Date(dateRange.from), 'dd/MM/yyyy') : 'Từ ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange.from ? new Date(dateRange.from) : undefined}
                onSelect={(date) => onChange({ ...dateRange, from: date ? startOfDay(date).toISOString() : undefined })}
                locale={vi}
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 h-9 justify-start text-left font-normal text-xs">
                <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                {dateRange.to ? format(new Date(dateRange.to), 'dd/MM/yyyy') : 'Đến ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange.to ? new Date(dateRange.to) : undefined}
                onSelect={(date) => onChange({ ...dateRange, to: date ? endOfDay(date).toISOString() : undefined })}
                locale={vi}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
});

function formatFilterValue(filter: FilterConfig, value: unknown): string {
  if (Array.isArray(value)) {
    const labels = value.map((v) => {
      const opt = filter.options?.find((o) => o.value === v);
      return opt?.label || v;
    });
    return labels.length <= 2 ? labels.join(', ') : `${labels.length} đã chọn`;
  }

  if (filter.type === 'date-range') {
    const dr = value as { from?: string; to?: string };
    const from = dr?.from ? format(new Date(dr.from), 'dd/MM/yy') : '';
    const to = dr?.to ? format(new Date(dr.to), 'dd/MM/yy') : '';
    // Check if matches quick range
    const quickRanges = getQuickDateRanges();
    const match = quickRanges.find(
      (r) => r.from.toISOString() === dr?.from && r.to.toISOString() === dr?.to
    );
    if (match) return match.label;
    if (from && to) return `${from} – ${to}`;
    if (from) return `Từ ${from}`;
    return `Đến ${to}`;
  }

  if (filter.type === 'number-range') {
    const nr = value as { min?: string; max?: string };
    if (nr?.min && nr?.max) return `${nr.min} – ${nr.max}`;
    if (nr?.min) return `Từ ${nr.min}`;
    return `Đến ${nr?.max}`;
  }

  if (filter.type === 'date' && value) {
    return format(new Date(value as string), 'dd/MM/yyyy');
  }

  if (filter.type === 'select' || filter.type === 'tags') {
    const opt = filter.options?.find((o) => o.value === value);
    return opt?.label || String(value);
  }

  if (filter.type === 'combobox') {
    const comboVal = value as ComboboxOption | null;
    return comboVal?.label || '';
  }

  if (filter.type === 'boolean') {
    return value ? 'Có' : 'Không';
  }

  return String(value);
}

/**
 * PresetTabs — Displays saved presets as clickable tabs above the list (Sapo-style E3)
 */
export interface PresetTabsProps {
  presets: Array<{ id: string; name: string; filters: Record<string, unknown> }>;
  activePresetId?: string | null;
  onSelect: (preset: { id: string; name: string; filters: Record<string, unknown> }) => void;
  onDelete?: (presetId: string) => void;
}

export function PresetTabs({ presets, activePresetId, onSelect, onDelete }: PresetTabsProps) {
  if (presets.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {presets.map((preset) => (
        <div key={preset.id} className="group relative">
          <Button
            variant={activePresetId === preset.id ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs px-3"
            onClick={() => onSelect(preset)}
          >
            {preset.name}
          </Button>
          {onDelete && (
            <button
              type="button"
              className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(preset.id);
              }}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * FilterExtras — Combines PresetTabs + ActiveFilterTags in a single element.
 * Place between PageFilters and Table for Sapo-style UX.
 */
export interface FilterExtrasProps {
  presets: Array<{ id: string; name: string; filters: Record<string, unknown> }>;
  filterConfigs: FilterConfig[];
  values: Record<string, unknown>;
  onApply: (v: Record<string, unknown>) => void;
  onDeletePreset: (id: string) => void;
}

export function FilterExtras({ presets, filterConfigs, values, onApply, onDeletePreset }: FilterExtrasProps) {
  const handleRemove = React.useCallback((filterId: string) => {
    onApply({ ...values, [filterId]: null });
  }, [values, onApply]);

  const handleClearAll = React.useCallback(() => {
    const cleared: Record<string, unknown> = {};
    filterConfigs.forEach(f => { cleared[f.id] = null; });
    onApply(cleared);
  }, [filterConfigs, onApply]);

  const hasActiveFilters = filterConfigs.some((f) => {
    const v = values[f.id];
    if (v === null || v === undefined || v === '') return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'object') {
      const obj = v as Record<string, unknown>;
      return obj.from !== undefined || obj.to !== undefined || obj.min !== undefined || obj.max !== undefined;
    }
    return true;
  });

  if (presets.length === 0 && !hasActiveFilters) return null;

  return (
    <div className="flex flex-col gap-2 py-2">
      {presets.length > 0 && (
        <PresetTabs presets={presets} onSelect={(p) => onApply(p.filters)} onDelete={onDeletePreset} />
      )}
      {hasActiveFilters && (
        <ActiveFilterTags filters={filterConfigs} values={values} onRemove={handleRemove} onClearAll={handleClearAll} />
      )}
    </div>
  );
}


