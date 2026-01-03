'use client'

import * as React from "react"
import type { ProductQueryParams } from "../product-service";

// ═══════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════

export const TABLE_STATE_STORAGE_KEY = 'products-table-state';
export const MOBILE_ROW_HEIGHT = 190;
export const MOBILE_LIST_HEIGHT = 520;

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

export interface UseTableStateHandlersParams {
  updateTableState: (updater: (prev: ProductQueryParams) => ProductQueryParams) => void;
}

export interface TableStateHandlers {
  handleSearchChange: (value: string) => void;
  handleStatusFilterChange: (value: string) => void;
  handleTypeFilterChange: (value: string) => void;
  handleCategoryFilterChange: (value: string) => void;
  handleComboFilterChange: (value: string) => void;
  handleStockLevelFilterChange: (value: string) => void;
  handlePkgxFilterChange: (value: string) => void;
  handleDateRangeChange: (value: [string | undefined, string | undefined] | undefined) => void;
  handlePaginationChange: (action: React.SetStateAction<{ pageIndex: number; pageSize: number }>) => void;
  handleSortingChange: (action: React.SetStateAction<{ id: string; desc: boolean }>) => void;
}

// ═══════════════════════════════════════════════════════════════
// Helper functions
// ═══════════════════════════════════════════════════════════════

function resolveStateAction<T>(current: T, action: React.SetStateAction<T>): T {
  return typeof action === 'function' ? (action as (prev: T) => T)(current) : action;
}

// ═══════════════════════════════════════════════════════════════
// Hook
// ═══════════════════════════════════════════════════════════════

export function useTableStateHandlers({ updateTableState }: UseTableStateHandlersParams): TableStateHandlers {
  const handleSearchChange = React.useCallback(
    (value: string) => {
      updateTableState((prev) => ({
        ...prev,
        search: value,
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handleStatusFilterChange = React.useCallback(
    (value: string) => {
      updateTableState((prev) => ({
        ...prev,
        statusFilter: value as ProductQueryParams['statusFilter'],
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handleTypeFilterChange = React.useCallback(
    (value: string) => {
      updateTableState((prev) => ({
        ...prev,
        typeFilter: value as ProductQueryParams['typeFilter'],
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handleCategoryFilterChange = React.useCallback(
    (value: string) => {
      updateTableState((prev) => ({
        ...prev,
        categoryFilter: value,
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handleComboFilterChange = React.useCallback(
    (value: string) => {
      updateTableState((prev) => ({
        ...prev,
        comboFilter: value as ProductQueryParams['comboFilter'],
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handleStockLevelFilterChange = React.useCallback(
    (value: string) => {
      updateTableState((prev) => ({
        ...prev,
        stockLevelFilter: value as ProductQueryParams['stockLevelFilter'],
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handlePkgxFilterChange = React.useCallback(
    (value: string) => {
      updateTableState((prev) => ({
        ...prev,
        pkgxFilter: value as ProductQueryParams['pkgxFilter'],
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handleDateRangeChange = React.useCallback(
    (value: [string | undefined, string | undefined] | undefined) => {
      updateTableState((prev) => ({
        ...prev,
        dateRange: value,
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handlePaginationChange = React.useCallback(
    (action: React.SetStateAction<{ pageIndex: number; pageSize: number }>) => {
      updateTableState((prev) => ({
        ...prev,
        pagination: resolveStateAction(prev.pagination, action),
      }));
    },
    [updateTableState]
  );

  const handleSortingChange = React.useCallback(
    (action: React.SetStateAction<{ id: string; desc: boolean }>) => {
      updateTableState((prev) => {
        const nextSortingSource = resolveStateAction(prev.sorting, action);
        return {
          ...prev,
          sorting: {
            id: (nextSortingSource.id as ProductQueryParams['sorting']['id']) ?? prev.sorting.id,
            desc: nextSortingSource.desc,
          },
        };
      });
    },
    [updateTableState]
  );

  return {
    handleSearchChange,
    handleStatusFilterChange,
    handleTypeFilterChange,
    handleCategoryFilterChange,
    handleComboFilterChange,
    handleStockLevelFilterChange,
    handlePkgxFilterChange,
    handleDateRangeChange,
    handlePaginationChange,
    handleSortingChange,
  };
}
