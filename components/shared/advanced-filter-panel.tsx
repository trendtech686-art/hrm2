import * as React from 'react';
import { Button } from '../ui/button.tsx';
import { Label } from '../ui/label.tsx';
import { Input } from '../ui/input.tsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '../ui/sheet.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover.tsx';
import { Calendar } from '../ui/calendar.tsx';
import { Checkbox } from '../ui/checkbox.tsx';
import { Badge } from '../ui/badge.tsx';
import { ScrollArea } from '../ui/scroll-area.tsx';
import { Separator } from '../ui/separator.tsx';
import { 
  Filter, 
  X, 
  Save, 
  Calendar as CalendarIcon,
  ChevronDown,
  Star,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '../../lib/utils.ts';
import { toast } from 'sonner';

/**
 * Filter types
 */
export type FilterType = 
  | 'text'           // Text input
  | 'select'         // Single select dropdown
  | 'multi-select'   // Multiple select with checkboxes
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
  defaultValue?: any;
  description?: string;
}

export interface FilterPreset {
  id: string;
  name: string;
  icon?: React.ReactNode;
  filters: Record<string, any>;
  isStarred?: boolean;
}

export interface AdvancedFilterPanelProps {
  /** Filter configurations */
  filters: FilterConfig[];
  
  /** Current filter values */
  values: Record<string, any>;
  
  /** Callback when filters change */
  onChange: (values: Record<string, any>) => void;
  
  /** Callback when filters are applied */
  onApply?: (values: Record<string, any>) => void;
  
  /** Callback when filters are reset */
  onReset?: () => void;
  
  /** Saved filter presets */
  presets?: FilterPreset[];
  
  /** Callback when preset is saved */
  onSavePreset?: (preset: Omit<FilterPreset, 'id'>) => void;
  
  /** Callback when preset is deleted */
  onDeletePreset?: (presetId: string) => void;
  
  /** Callback when preset is loaded */
  onLoadPreset?: (preset: FilterPreset) => void;
  
  /** Trigger button label */
  triggerLabel?: string;
  
  /** Show active filter count on trigger */
  showActiveCount?: boolean;
  
  /** Open by default */
  defaultOpen?: boolean;
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
  onLoadPreset,
  triggerLabel = 'Bộ lọc',
  showActiveCount = true,
  defaultOpen = false,
}: AdvancedFilterPanelProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [presetName, setPresetName] = React.useState('');
  const [showSavePreset, setShowSavePreset] = React.useState(false);

  // Count active filters
  const activeFilterCount = React.useMemo(() => {
    return Object.entries(values).filter(([key, value]) => {
      if (value === null || value === undefined || value === '') return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value.from === undefined && value.to === undefined) return false;
      return true;
    }).length;
  }, [values]);

  const handleFilterChange = (filterId: string, value: any) => {
    onChange({ ...values, [filterId]: value });
  };

  const handleReset = () => {
    const resetValues: Record<string, any> = {};
    filters.forEach((filter) => {
      resetValues[filter.id] = filter.defaultValue ?? null;
    });
    onChange(resetValues);
    onReset?.();
    toast.success('Đã xóa tất cả bộ lọc');
  };

  const handleApply = () => {
    onApply?.(values);
    setOpen(false);
    toast.success(`Đã áp dụng ${activeFilterCount} bộ lọc`);
  };

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      toast.error('Vui lòng nhập tên bộ lọc');
      return;
    }

    onSavePreset?.({
      name: presetName,
      filters: values,
      icon: <Star className="h-4 w-4" />,
    });

    setPresetName('');
    setShowSavePreset(false);
    toast.success(`Đã lưu bộ lọc "${presetName}"`);
  };

  const handleLoadPreset = (preset: FilterPreset) => {
    onChange(preset.filters);
    onLoadPreset?.(preset);
    toast.success(`Đã tải bộ lọc "${preset.name}"`);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
                        className="h-5 w-5 absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
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

          {/* Filter Fields */}
          <div className="space-y-6">
            {filters.map((filter) => (
              <div key={filter.id} className="space-y-2">
                <Label htmlFor={filter.id} className="text-sm font-medium">
                  {filter.label}
                </Label>
                {filter.description && (
                  <p className="text-xs text-muted-foreground">{filter.description}</p>
                )}

                {/* Render filter input based on type */}
                <FilterInput
                  filter={filter}
                  value={values[filter.id]}
                  onChange={(value) => handleFilterChange(filter.id, value)}
                />
              </div>
            ))}
          </div>

          {/* Save Preset Section */}
          {onSavePreset && (
            <div className="mt-6 pt-6 border-t">
              {showSavePreset ? (
                <div className="space-y-2">
                  <Label htmlFor="preset-name">Lưu bộ lọc hiện tại</Label>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setShowSavePreset(false);
                        setPresetName('');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setShowSavePreset(true)} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Lưu bộ lọc
                </Button>
              )}
            </div>
          )}
        </ScrollArea>

        <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
          <div className="flex gap-2 w-full">
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
 * Filter input renderer based on filter type
 */
function FilterInput({
  filter,
  value,
  onChange,
}: {
  filter: FilterConfig;
  value: any;
  onChange: (value: any) => void;
}) {
  switch (filter.type) {
    case 'text':
      return (
        <Input
          id={filter.id}
          placeholder={filter.placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="h-9"
        />
      );

    case 'select':
      return (
        <Select value={value || ''} onValueChange={onChange}>
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

    case 'multi-select':
      const selectedValues = Array.isArray(value) ? value : [];
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
                    onChange(selectedValues.filter((v: string) => v !== option.value));
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
              {value ? format(new Date(value), 'dd/MM/yyyy', { locale: vi }) : filter.placeholder || 'Chọn ngày'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={(date) => onChange(date?.toISOString())}
              locale={vi}
            />
          </PopoverContent>
        </Popover>
      );

    case 'date-range':
      const dateRange = value || { from: undefined, to: undefined };
      return (
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 h-9 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? format(new Date(dateRange.from), 'dd/MM/yyyy') : 'Từ ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange.from ? new Date(dateRange.from) : undefined}
                onSelect={(date) => onChange({ ...dateRange, from: date?.toISOString() })}
                locale={vi}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 h-9 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.to ? format(new Date(dateRange.to), 'dd/MM/yyyy') : 'Đến ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange.to ? new Date(dateRange.to) : undefined}
                onSelect={(date) => onChange({ ...dateRange, to: date?.toISOString() })}
                locale={vi}
              />
            </PopoverContent>
          </Popover>
        </div>
      );

    case 'number-range':
      const numRange = value || { min: '', max: '' };
      return (
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Từ"
            value={numRange.min}
            onChange={(e) => onChange({ ...numRange, min: e.target.value })}
            className="h-9"
          />
          <Input
            type="number"
            placeholder="Đến"
            value={numRange.max}
            onChange={(e) => onChange({ ...numRange, max: e.target.value })}
            className="h-9"
          />
        </div>
      );

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

    case 'tags':
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

    default:
      return null;
  }
}

/**
 * Hook for managing filter state
 */
export function useAdvancedFilters(initialValues: Record<string, any> = {}) {
  const [filterValues, setFilterValues] = React.useState(initialValues);
  const [presets, setPresets] = React.useState<FilterPreset[]>([]);

  const handleSavePreset = React.useCallback((preset: Omit<FilterPreset, 'id'>) => {
    const newPreset: FilterPreset = {
      ...preset,
      id: `preset-${Date.now()}`,
    };
    setPresets((prev) => [...prev, newPreset]);
  }, []);

  const handleDeletePreset = React.useCallback((presetId: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== presetId));
  }, []);

  const handleLoadPreset = React.useCallback((preset: FilterPreset) => {
    setFilterValues(preset.filters);
  }, []);

  const resetFilters = React.useCallback(() => {
    setFilterValues(initialValues);
  }, [initialValues]);

  return {
    filterValues,
    setFilterValues,
    presets,
    handleSavePreset,
    handleDeletePreset,
    handleLoadPreset,
    resetFilters,
  };
}
