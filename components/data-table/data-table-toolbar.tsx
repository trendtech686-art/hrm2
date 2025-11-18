import * as React from "react";
import { Search } from "lucide-react"
import { Input } from "../ui/input.tsx"
import { DataTableFacetedFilter } from './data-table-faceted-filter.tsx';
import { DataTableDateFilter } from './data-table-date-filter.tsx';
import type { ColumnDef } from './types.ts'

export interface DataTableToolbarProps<TData> {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  dateFilter?: [string | undefined, string | undefined];
  onDateFilterChange?: (value: [string | undefined, string | undefined] | undefined) => void;
  dateFilterTitle?: string;
  numResults?: number;
  children?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  search,
  onSearchChange,
  searchPlaceholder,
  dateFilter,
  onDateFilterChange,
  dateFilterTitle,
  numResults = 0,
  children,
}: DataTableToolbarProps<TData>) {
  const isFiltered = search.length > 0;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full sm:w-[200px] lg:w-[280px] pl-8"
          />
           {isFiltered && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {numResults} kết quả
            </div>
          )}
        </div>
        {onDateFilterChange && (
          <DataTableDateFilter value={dateFilter} onChange={onDateFilterChange} title={dateFilterTitle} />
        )}
      </div>
      <div className="flex items-center gap-2 sm:ml-auto">
        {children}
      </div>
    </div>
  )
}
