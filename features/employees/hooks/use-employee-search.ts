/**
 * useEmployeeSearch — Lightweight hooks for lazy-loaded employee data.
 * 
 * Instead of loading ALL employees (100-500+) on mount, these hooks
 * fetch only when the user interacts:
 * - useEmployeeComboboxSearch: Async paginated search for Combobox (30 per page, infinite scroll)
 * - useEmployeeFetchMentions: Async search for @mention in Comments (10 results)
 * - useEmployeeSearch: Simple search hook for dropdown lists (50 records per page)
 */

import * as React from 'react';
import type { ComboboxOption } from '@/components/ui/combobox';

const COMBOBOX_PAGE_SIZE = 30;

/**
 * Simple employee search hook for dropdown lists.
 * Fetches first page of employees with optional search.
 * 
 * @example
 * const { data } = useEmployeeSearch({ enabled: true, limit: 50 });
 */
export function useEmployeeSearch({ enabled = true, limit = 50, search = '' }: { enabled?: boolean; limit?: number; search?: string } = {}) {
  const [employees, setEmployees] = React.useState<Array<{ systemId: string; fullName: string }>>([]);

  React.useEffect(() => {
    if (!enabled) {
      setEmployees([]);
      return;
    }

    const params = new URLSearchParams({
      select: 'combobox',
      limit: String(limit),
    });
    if (search) params.set('search', search);

    fetch(`/api/employees?${params}`)
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (json?.data?.items) {
          // API returns { data: { items: [{ value, label }] } }
          // Convert to { systemId, fullName } format
          setEmployees(json.data.items.map((item: { value: string; label: string }) => ({
            systemId: item.value,
            fullName: item.label,
          })));
        } else if (json?.items) {
          // Direct items array
          setEmployees(json.items.map((item: { value: string; label: string }) => ({
            systemId: item.value,
            fullName: item.label,
          })));
        }
      })
      .catch(() => {});
  }, [enabled, limit, search]);

  return { data: employees };
}

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
