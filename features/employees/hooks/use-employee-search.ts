/**
 * useEmployeeSearch — Lightweight hooks for lazy-loaded employee data.
 * 
 * Instead of loading ALL employees (100-500+) on mount, these hooks
 * fetch only when the user interacts:
 * - useEmployeeComboboxSearch: Async paginated search for Combobox (30 per page, infinite scroll)
 * - useEmployeeFetchMentions: Async search for @mention in Comments (10 results)
 */

import * as React from 'react';
import type { ComboboxOption } from '@/components/ui/combobox';

const COMBOBOX_PAGE_SIZE = 30;

/**
 * Returns an `onSearch` callback for async Combobox.
 * Fetches 30 employees per page, supports infinite scroll and search.
 * 
 * @example
 * const { onSearch, resolveValue } = useEmployeeComboboxSearch();
 * <Combobox
 *   onSearch={onSearch}
 *   value={resolveValue(field.value, employeeName)}
 *   onChange={option => field.onChange(option?.value)}
 * />
 */
export function useEmployeeComboboxSearch() {
  const onSearch = React.useCallback(
    async (query: string, page: number): Promise<{ items: ComboboxOption[]; hasNextPage: boolean }> => {
      try {
        const params = new URLSearchParams({
          select: 'combobox',
          search: query,
          page: String(page),
          limit: String(COMBOBOX_PAGE_SIZE),
        });
        const res = await fetch(`/api/employees?${params}`);
        if (!res.ok) {
          return { items: [], hasNextPage: false };
        }
        const json = await res.json();
        // API returns { items, hasNextPage } directly (apiSuccess doesn't wrap in data)
        const result = json.items ? json : { items: [], hasNextPage: false };
        // Ensure items is always an array
        if (!Array.isArray(result.items)) {
          return { items: [], hasNextPage: false };
        }
        return result;
      } catch {
        return { items: [], hasNextPage: false };
      }
    },
    []
  );

  /** Build a ComboboxOption from the current form value + known label */
  const resolveValue = React.useCallback(
    (systemId: string | undefined | null, label: string | undefined | null): ComboboxOption | null => {
      if (!systemId) return null;
      return { value: systemId, label: label || systemId };
    },
    []
  );

  return { onSearch, resolveValue };
}

/**
 * Returns a `fetchMentions` callback for Comments @mention.
 * Fetches max 10 employees matching the query.
 * 
 * @example
 * const fetchMentions = useEmployeeFetchMentions();
 * <Comments fetchMentions={fetchMentions} />
 */
export function useEmployeeFetchMentions() {
  return React.useCallback(async (query: string) => {
    const res = await fetch(`/api/employees?select=mentions&search=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  }, []);
}
