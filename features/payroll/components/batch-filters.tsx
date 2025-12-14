import * as React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { PAYROLL_BATCH_STATUSES, type PayrollBatchStatus } from '../../../lib/payroll-types.ts';
import { Button } from '../../../components/ui/button.tsx';
import { Input } from '../../../components/ui/input.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select.tsx';
import { Label } from '../../../components/ui/label.tsx';

export type PayrollBatchFiltersValue = {
  status: PayrollBatchStatus | 'all';
  monthKey?: string | undefined;
  keyword: string;
};

type PayrollBatchFiltersProps = {
  value: PayrollBatchFiltersValue;
  onChange: (value: PayrollBatchFiltersValue) => void;
  onClear?: () => void;
};

const statusOptions: Array<{ value: PayrollBatchFiltersValue['status']; label: string }> = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'draft', label: 'Nháp' },
  { value: 'reviewed', label: 'Đang duyệt' },
  { value: 'locked', label: 'Đã khóa' },
];

export function PayrollBatchFilters({ value, onChange, onClear }: PayrollBatchFiltersProps) {
  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, keyword: event.target.value });
  };

  const handleStatusChange = (status: PayrollBatchFiltersValue['status']) => {
    onChange({ ...value, status });
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, monthKey: event.target.value || undefined });
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-body-sm font-medium text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4" />
        Bộ lọc
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="payroll-search">Từ khóa</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="payroll-search"
              className="h-9 pl-9"
              placeholder="Tìm theo mã hoặc tiêu đề"
              value={value.keyword}
              onChange={handleKeywordChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Trạng thái</Label>
          <Select value={value.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="payroll-month">Tháng tham chiếu</Label>
          <Input
            id="payroll-month"
            type="month"
            className="h-9"
            value={value.monthKey ?? ''}
            onChange={handleMonthChange}
          />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button variant="ghost" className="h-9" onClick={handleClear}>
          <X className="mr-2 h-4 w-4" />
          Xóa lọc
        </Button>
      </div>
    </div>
  );
}
