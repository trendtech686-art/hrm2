/**
 * Report Filters Component
 * 
 * Thanh lọc cho báo cáo: Khoảng thời gian, Loại báo cáo, Nhóm theo
 */

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PageFilters } from '@/components/layout/page-filters';
import { CalendarIcon } from 'lucide-react';
import type { ReportDateRange, GroupByOption, TimeGrouping } from '../types';
import { useDatePresets } from '../hooks/use-report-hooks';

const fmtDisplay = (d: Date) => format(d, 'dd/MM/yyyy');

// Re-export for backward compatibility - but prefer using the hook directly
export { useDatePresets } from '../hooks/use-report-hooks';

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
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customFrom, setCustomFrom] = useState(dateRange.from);
  const [customTo, setCustomTo] = useState(dateRange.to);
  const presets = useDatePresets();
  
  // Determine active preset label
  const activeLabel = useMemo(() => {
    const match = presets.find((p: { from: string; to: string }) => p.from === dateRange.from && p.to === dateRange.to);
    return match?.label;
  }, [presets, dateRange]);
  
  const handlePresetSelect = (preset: { from: string; to: string; label: string }) => {
    onDateRangeChange({ from: preset.from, to: preset.to });
    setShowCustom(false);
    setOpen(false);
  };
  
  const handleCustomApply = () => {
    if (customFrom && customTo && customFrom <= customTo) {
      onDateRangeChange({ from: customFrom, to: customTo });
      setOpen(false);
    }
  };
  
  const displayLabel = activeLabel 
    || `${fmtDisplay(new Date(dateRange.from))} - ${fmtDisplay(new Date(dateRange.to))}`;
  
  const groupByOptions = GROUP_BY_OPTIONS[reportCategory] || GROUP_BY_OPTIONS.sales;
  
  return (
    <PageFilters>
      {/* Date Range Picker — Preset grid style */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 text-sm font-normal min-w-45">
            <CalendarIcon className="h-4 w-4" />
            {displayLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-70 p-3" align="start">
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant={activeLabel === preset.label ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => handlePresetSelect(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <div className="mt-2 border-t pt-2">
            <Button
              variant={showCustom ? 'default' : 'outline'}
              size="sm"
              className="w-full h-8 text-xs"
              onClick={() => {
                setShowCustom(!showCustom);
                setCustomFrom(dateRange.from);
                setCustomTo(dateRange.to);
              }}
            >
              Tùy chọn
            </Button>
            {showCustom && (
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="rf-from" className="text-xs text-muted-foreground">Từ ngày</label>
                    <Input
                      id="rf-from"
                      type="date"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="rf-to" className="text-xs text-muted-foreground">Đến ngày</label>
                    <Input
                      id="rf-to"
                      type="date"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                <Button
                  size="sm"
                  className="w-full h-8 text-xs"
                  onClick={handleCustomApply}
                  disabled={!customFrom || !customTo || customFrom > customTo}
                >
                  Lọc
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Report Type */}
      {showReportType && onReportTypeChange && (
        <Select value={reportType} onValueChange={onReportTypeChange}>
          <SelectTrigger className="w-40">
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
            <SelectTrigger className="w-35">
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
      
      {/* Time Grouping (show when explicitly enabled or when groupBy === 'time') */}
      {showTimeGrouping !== false && (groupBy === 'time' || (showTimeGrouping === true && !groupBy)) && onTimeGroupingChange && (
        <Select value={timeGrouping} onValueChange={(v) => onTimeGroupingChange(v as TimeGrouping)}>
          <SelectTrigger className="w-25">
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
