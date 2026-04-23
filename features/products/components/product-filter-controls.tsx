'use client'

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { VirtualizedCombobox, type ComboboxOption } from "../../../components/ui/virtualized-combobox";
import { DataTableDateFilter } from "../../../components/data-table/data-table-date-filter";
import type { ProductQueryParams } from "../product-service";

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface StockLevelCounts {
  outOfStock: number;
  lowStock: number;
  belowSafety: number;
  highStock: number;
}

interface ProductFilterControlsProps {
  tableState: ProductQueryParams;
  categoryOptions: ComboboxOption[];
  stockLevelCounts: StockLevelCounts;
  onStatusFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onComboFilterChange: (value: string) => void;
  onStockLevelFilterChange: (value: string) => void;
  onPkgxFilterChange: (value: string) => void;
  onDateRangeChange: (value: [string | undefined, string | undefined] | undefined) => void;
}

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════

export function ProductFilterControls({
  tableState,
  categoryOptions,
  stockLevelCounts,
  onStatusFilterChange,
  onTypeFilterChange,
  onCategoryFilterChange,
  onComboFilterChange,
  onStockLevelFilterChange,
  onPkgxFilterChange,
  onDateRangeChange,
}: ProductFilterControlsProps) {
  return (
    <>
      <DataTableDateFilter
        value={tableState.dateRange}
        onChange={onDateRangeChange}
        title="Ngày tạo"
      />

      <Select value={tableState.statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-45">
          <SelectValue placeholder="Tất cả trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="active">Hoạt động</SelectItem>
          <SelectItem value="inactive">Tạm ngừng</SelectItem>
          <SelectItem value="discontinued">Ngừng kinh doanh</SelectItem>
        </SelectContent>
      </Select>

      <Select value={tableState.typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-full sm:w-45">
          <SelectValue placeholder="Loại sản phẩm" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả loại</SelectItem>
          <SelectItem value="physical">Hàng hóa</SelectItem>
          <SelectItem value="service">Dịch vụ</SelectItem>
          <SelectItem value="digital">Sản phẩm số</SelectItem>
        </SelectContent>
      </Select>

      <div className="w-full sm:w-55">
        <VirtualizedCombobox
          value={tableState.categoryFilter !== 'all' 
            ? categoryOptions.find(c => c.value === tableState.categoryFilter) ?? null
            : null}
          onChange={(option) => onCategoryFilterChange(option ? option.value : 'all')}
          options={categoryOptions}
          placeholder="Tất cả danh mục"
          searchPlaceholder="Tìm danh mục..."
          emptyPlaceholder="Không tìm thấy danh mục."
          maxHeight={360}
        />
      </div>

      <Select value={tableState.comboFilter} onValueChange={onComboFilterChange}>
        <SelectTrigger className="w-full sm:w-45">
          <SelectValue placeholder="Sản phẩm combo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả sản phẩm</SelectItem>
          <SelectItem value="combo">Chỉ Combo</SelectItem>
          <SelectItem value="non-combo">Không phải Combo</SelectItem>
        </SelectContent>
      </Select>

      <Select value={tableState.stockLevelFilter} onValueChange={onStockLevelFilterChange}>
        <SelectTrigger className="w-full sm:w-45">
          <SelectValue placeholder="Mức tồn kho" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả mức tồn</SelectItem>
          <SelectItem value="out-of-stock">Hết hàng ({stockLevelCounts.outOfStock})</SelectItem>
          <SelectItem value="low-stock">Sắp hết ({stockLevelCounts.lowStock})</SelectItem>
          <SelectItem value="below-safety">Dưới an toàn ({stockLevelCounts.belowSafety})</SelectItem>
          <SelectItem value="high-stock">Tồn cao ({stockLevelCounts.highStock})</SelectItem>
        </SelectContent>
      </Select>

      <Select value={tableState.pkgxFilter} onValueChange={onPkgxFilterChange}>
        <SelectTrigger className="w-full sm:w-45">
          <SelectValue placeholder="Trạng thái PKGX" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả PKGX</SelectItem>
          <SelectItem value="linked">Đã liên kết PKGX</SelectItem>
          <SelectItem value="not-linked">Chưa liên kết PKGX</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
