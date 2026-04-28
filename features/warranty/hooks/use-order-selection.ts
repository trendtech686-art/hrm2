/**
 * useOrderSelection
 *
 * Shared hook for order search and selection in warranty context.
 * Used by both:
 * - WarrantyReturnMethodDialog (Trả hàng cho khách)
 * - WarrantyOrderSelectionDialog (Liên kết đơn hàng)
 */

import * as React from 'react';
import { searchOrdersPaginated, type OrderSearchResult } from '../../orders/order-search-api';
import { logError } from '@/lib/logger';
import { toast } from 'sonner';
import type { ComboboxOption } from '../../../components/ui/virtualized-combobox';

const ORDER_PAGE_SIZE = 30;
const SEARCH_DEBOUNCE_MS = 300;

export interface UseOrderSelectionOptions {
  branchSystemId?: string | null;
  customerSystemId?: string | null;
  /** Override the initial selected order (e.g., from linkedOrder) */
  initialSelectedOrderId?: string | null;
  /** Whether to auto-search on mount (default: true) */
  autoSearch?: boolean;
}

export interface UseOrderSelectionReturn {
  // State
  selectedOrder: ComboboxOption | null;
  searchQuery: string;
  searchResults: OrderSearchResult[];
  isSearching: boolean;
  totalCount: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  currentPage: number;

  // Actions
  setSelectedOrder: (option: ComboboxOption | null) => void;
  setSearchQuery: (query: string) => void;
  loadMore: () => void;
  reset: () => void;
  /** Trigger immediate search without debounce (for dialog open) */
  triggerSearch: () => void;

  // Get selected order ID (systemId)
  getSelectedOrderId: () => string | null;
}

/**
 * Shared hook for order selection in warranty dialogs.
 * Unifies the order search/selection logic across all warranty order-linking flows.
 */
export function useOrderSelection(
  options: UseOrderSelectionOptions
): UseOrderSelectionReturn {
  const {
    branchSystemId,
    customerSystemId,
    initialSelectedOrderId,
    autoSearch = true,
  } = options;

  // State
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(
    initialSelectedOrderId ?? null
  );
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<OrderSearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  // Keep track of initial value for reset
  const initialOrderIdRef = React.useRef(initialSelectedOrderId ?? null);

  // Sync initial value when it changes externally
  React.useEffect(() => {
    if (initialSelectedOrderId !== undefined && initialSelectedOrderId !== initialOrderIdRef.current) {
      setSelectedOrderId(initialSelectedOrderId);
      initialOrderIdRef.current = initialSelectedOrderId;
    }
  }, [initialSelectedOrderId]);

  // Build resolved customerSystemId (may come as customerSystemId or customerId)
  const resolvedCustomerSystemId = customerSystemId || undefined;

  // Search function with debouncing
  const searchOrders = React.useCallback(
    async (query: string, page: number) => {
      if (page === 1) {
        setIsSearching(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const { results, total, hasMore: more } = await searchOrdersPaginated({
          query,
          limit: ORDER_PAGE_SIZE,
          page,
          branchSystemId: branchSystemId || undefined,
          customerSystemId: resolvedCustomerSystemId,
          // Chỉ hiện đơn hàng chưa xuất kho và không bị hủy/completed (cho trả lại bảo hành)
          stockOutStatus: 'NOT_STOCKED_OUT',
          statusNotIn: 'COMPLETED,CANCELLED',
        });

        setSearchResults((prev) => (page === 1 ? results : [...prev, ...results]));
        setTotalCount(total);
        setHasMore(more);
      } catch (error) {
        logError('Failed to search orders', error);
        toast.error('Không thể tìm đơn hàng, vui lòng thử lại');
      } finally {
        setIsSearching(false);
        setIsLoadingMore(false);
      }
    },
    [branchSystemId, resolvedCustomerSystemId]
  );

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Initial search on mount
  React.useEffect(() => {
    if (autoSearch) {
      searchOrders('', 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search query change with debounce
  // Track if we're resetting to avoid triggering search
  const isResettingRef = React.useRef(false);

  const handleSearchChange = React.useCallback(
    (query: string) => {
      setSearchQuery(query);

      // Cancel previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        // Skip search if we're resetting
        if (isResettingRef.current) {
          isResettingRef.current = false;
          return;
        }
        // Only search if query is different from last debounced query
        if (query !== debouncedQueryRef.current) {
          setDebouncedQuery(query);
          debouncedQueryRef.current = query;
          setCurrentPage(1);
          searchOrders(query, 1);
        }
      }, SEARCH_DEBOUNCE_MS);
    },
    [searchOrders]
  );

  // Track debounced query to avoid duplicate searches
  const debouncedQueryRef = React.useRef('');

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Load more results
  const loadMore = React.useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    searchOrders(searchQuery, nextPage);
  }, [isLoadingMore, hasMore, currentPage, searchQuery, searchOrders]);

  // Reset state
  const reset = React.useCallback(() => {
    // Set flag to skip debounced search
    isResettingRef.current = true;
    setSelectedOrderId(initialOrderIdRef.current);
    setSearchQuery('');
    setCurrentPage(1);
    setSearchResults([]);
    setTotalCount(0);
    setHasMore(false);
    debouncedQueryRef.current = '';
  }, []);

  // Build selected order option (find in results or use linked order)
  const selectedOrder = React.useMemo<ComboboxOption | null>(() => {
    if (!selectedOrderId) return null;
    const found = searchResults.find((r) => r.value === selectedOrderId);
    if (found) {
      return { value: found.value, label: found.label };
    }
    // If not in results, return a basic option (for pre-selected linked order)
    return { value: selectedOrderId, label: selectedOrderId };
  }, [selectedOrderId, searchResults]);

  // Trigger immediate search (for dialog open)
  const triggerSearch = React.useCallback(() => {
    isResettingRef.current = false;
    setCurrentPage(1);
    searchOrders('', 1);
  }, [searchOrders]);

  return {
    selectedOrder,
    searchQuery,
    searchResults,
    isSearching,
    totalCount,
    hasMore,
    isLoadingMore,
    currentPage,
    setSelectedOrder: (option) => setSelectedOrderId(option?.value ?? null),
    setSearchQuery: handleSearchChange,
    loadMore,
    reset,
    triggerSearch,
    getSelectedOrderId: () => selectedOrderId,
  };
}

/**
 * Filter options for warranty order search
 */
export const WARRANTY_ORDER_FILTER = {
  stockOutStatus: 'NOT_STOCKED_OUT' as const,
  excludeStatuses: ['COMPLETED', 'CANCELLED'] as const,
} as const;
