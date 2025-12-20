/**
 * Report Filters Component
 * 
 * Thanh lọc cho báo cáo: Khoảng thời gian, Loại báo cáo, Nhóm theo
 */

import * as React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subDays, subMonths, subQuarters, subYears, startOfYear, endOfYear, startOfQuarter, endOfQuarter } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Calendar } from '@/components/ui/calendar.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { PageFilters } from '@/components/layout/page-filters.tsx';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import type { ReportDateRange, ReportType, GroupByOption, TimeGrouping } from '../types.ts';

// Predefined date ranges
const DATE_PRESETS = [
  { label: 'Hôm nay', getValue: () => ({ from: new Date(), to: new Date() }) },
  { label: 'Hôm qua', getValue: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }) },
  { label: 'Tuần này', getValue: () => ({ from: startOfWeek(new Date(), { weekStartsOn: 1 }), to: endOfWeek(new Date(), { weekStartsOn: 1 }) }) },
  { label: 'Tuần trước', getValue: () => ({ from: startOfWeek(subDays(new Date(), 7), { weekStartsOn: 1 }), to: endOfWeek(subDays(new Date(), 7), { weekStartsOn: 1 }) }) },
  { label: 'Tháng này', getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: 'Tháng trước', getValue: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }) },
  { label: 'Quý này', getValue: () => ({ from: startOfQuarter(new Date()), to: endOfQuarter(new Date()) }) },
  { label: 'Quý trước', getValue: () => ({ from: startOfQuarter(subQuarters(new Date(), 1)), to: endOfQuarter(subQuarters(new Date(), 1)) }) },
  { label: 'Năm nay', getValue: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) }) },
  { label: '30 ngày qua', getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
  { label: '90 ngày qua', getValue: () => ({ from: subDays(new Date(), 90), to: new Date() }) },
];

// Report type options
const REPORT_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'realtime', label: 'Theo thời gian thực' },
  { value: 'time', label: 'Theo thời gian' },
  { value: 'period', label: 'Theo kỳ' },
];

// Group by options based on report category
const GROUP_BY_OPTIONS: Record<string, { value: GroupByOption; label: string }[]> = {
  sales: [
    { value: 'time', label: 'Thời gian' },
    { value: 'employee', label: 'Nhân viên' },
    { value: 'product', label: 'Sản phẩm' },
    { value: 'order', label: 'Đơn hàng' },
    { value: 'branch', label: 'Chi nhánh' },
    { value: 'source', label: 'Nguồn bán hàng' },
    { value: 'customer', label: 'Khách hàng' },
    { value: 'customer-group', label: 'Nhóm khách hàng' },
  ],
  delivery: [
    { value: 'time', label: 'Thời gian' },
    { value: 'employee', label: 'Nhân viên' },
    { value: 'shipment', label: 'Vận đơn' },
    { value: 'carrier', label: 'Đối tác vận chuyển' },
    { value: 'branch', label: 'Chi nhánh' },
    { value: 'customer', label: 'Khách hàng' },
    { value: 'channel', label: 'Kênh bán hàng' },
    { value: 'source', label: 'Nguồn bán hàng' },
  ],
  returns: [
    { value: 'order', label: 'Đơn hàng' },
    { value: 'product', label: 'Sản phẩm' },
    { value: 'time', label: 'Thời gian' },
    { value: 'customer', label: 'Khách hàng' },
    { value: 'branch', label: 'Chi nhánh' },
  ],
  payments: [
    { value: 'time', label: 'Thời gian' },
    { value: 'employee', label: 'Nhân viên' },
    { value: 'payment-method', label: 'Phương thức thanh toán' },
    { value: 'branch', label: 'Chi nhánh' },
  ],
};

// Time grouping options
const TIME_GROUPING_OPTIONS: { value: TimeGrouping; label: string }[] = [
  { value: 'day', label: 'Ngày' },
  { value: 'week', label: 'Tuần' },
  { value: 'month', label: 'Tháng' },
  { value: 'quarter', label: 'Quý' },
  { value: 'year', label: 'Năm' },
];

interface ReportFiltersProps {
  // Date range
  dateRange: ReportDateRange;
  onDateRangeChange: (range: ReportDateRange) => void;
  
  // Report type (optional)
  reportType?: string;
  onReportTypeChange?: (type: string) => void;
  showReportType?: boolean;
  
  // Group by (optional - not needed for specific report pages)
  groupBy?: GroupByOption;
  onGroupByChange?: (groupBy: GroupByOption) => void;
  showGroupBy?: boolean;
  reportCategory?: 'sales' | 'delivery' | 'returns' | 'payments';
  
  // Time grouping (when groupBy === 'time')
  timeGrouping?: TimeGrouping;
  onTimeGroupingChange?: (grouping: TimeGrouping) => void;
  showTimeGrouping?: boolean;
  
  // Additional filters slot
  additionalFilters?: React.ReactNode;
}

export function ReportFilters({
  dateRange,
  onDateRangeChange,
  reportType = 'time',
  onReportTypeChange,
  showReportType = true,
  groupBy,
  onGroupByChange,
  showGroupBy = true,
  reportCategory = 'sales',
  timeGrouping = 'day',
  onTimeGroupingChange,
  showTimeGrouping = true,
  additionalFilters,
}: ReportFiltersProps) {
  const [date, setDate] = React.useState<{ from: Date | undefined; to: Date | undefined }>({
    from: dateRange.from ? new Date(dateRange.from) : undefined,
    to: dateRange.to ? new Date(dateRange.to) : undefined,
  });
  
  const handleDateChange = (newDate: { from: Date | undefined; to: Date | undefined }) => {
    setDate(newDate);
    if (newDate.from && newDate.to) {
      onDateRangeChange({
        from: format(newDate.from, 'yyyy-MM-dd'),
        to: format(newDate.to, 'yyyy-MM-dd'),
      });
    }
  };
  
  const handlePresetSelect = (preset: typeof DATE_PRESETS[0]) => {
    const { from, to } = preset.getValue();
    handleDateChange({ from, to });
  };
  
  const groupByOptions = GROUP_BY_OPTIONS[reportCategory] || GROUP_BY_OPTIONS.sales;
  
  return (
    <PageFilters>
      {/* Date Range Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal min-w-[260px]",
              !date.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy", { locale: vi })} -{" "}
                  {format(date.to, "dd/MM/yyyy", { locale: vi })}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy", { locale: vi })
              )
            ) : (
              <span>Chọn khoảng thời gian</span>
            )}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Presets */}
            <div className="border-r p-2 space-y-1">
              {DATE_PRESETS.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-normal"
                  onClick={() => handlePresetSelect(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            
            {/* Calendar */}
            <div className="p-2">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date.from}
                selected={{ from: date.from, to: date.to }}
                onSelect={(range) => handleDateChange({ from: range?.from, to: range?.to })}
                numberOfMonths={2}
                locale={vi}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Report Type */}
      {showReportType && onReportTypeChange && (
        <Select value={reportType} onValueChange={onReportTypeChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Loại báo cáo" />
          </SelectTrigger>
          <SelectContent>
            {REPORT_TYPE_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {/* Group By */}
      {showGroupBy !== false && groupBy && onGroupByChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Nhóm theo</span>
          <Select value={groupBy} onValueChange={(v) => onGroupByChange(v as GroupByOption)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {groupByOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Time Grouping (when groupBy === 'time') */}
      {showTimeGrouping !== false && groupBy === 'time' && onTimeGroupingChange && (
        <Select value={timeGrouping} onValueChange={(v) => onTimeGroupingChange(v as TimeGrouping)}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIME_GROUPING_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {/* Additional filters */}
      {additionalFilters}
    </PageFilters>
  );
}

export default ReportFilters;
