/**
 * UnifiedCustomerSearch - Component tìm kiếm khách hàng dùng chung
 * ═══════════════════════════════════════════════════════════════
 * Features:
 * - Tìm kiếm nhanh với Meilisearch
 * - Hiển thị thông tin: Tên, SĐT, Email, Địa chỉ
 * - Infinite scroll để load thêm kết quả
 * - Debounced search 150ms
 * ═══════════════════════════════════════════════════════════════
 */

import {
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { User, Phone, Mail, MapPin } from 'lucide-react';
import { useInfiniteMeiliCustomerSearch } from '@/hooks/use-meilisearch';
import { useCustomer } from '@/hooks/api/use-customers';
import { VirtualizedCombobox, type ComboboxOption } from '../ui/virtualized-combobox';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface UnifiedCustomerSearchProps {
  /** Callback khi chọn khách hàng */
  onSelectCustomer: (customer: {
    systemId: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    city?: string | null;
    district?: string | null;
  }) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Giới hạn số lượng kết quả */
  limit?: number;
  /** Filter theo city */
  city?: string;
  /** Filter theo district */
  district?: string;
}

// ═══════════════════════════════════════════════════════════════
// CUSTOMER OPTION COMPONENT
// ═══════════════════════════════════════════════════════════════

const CustomerOptionContent = memo(({
  option,
}: {
  option: ComboboxOption;
}) => {
  const meta = option.metadata as {
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    totalOrders?: number;
    totalSpent?: number;
  } | undefined;

  return (
    <div className="flex items-start gap-2.5 w-full py-1.5">
      <div className="w-9 h-9 shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
        <User className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate text-sm">{option.label}</p>
        {meta?.phone && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
            <Phone className="h-3 w-3 shrink-0" />
            {meta.phone}
          </p>
        )}
        {meta?.email && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
            <Mail className="h-3 w-3 shrink-0" />
            {meta.email}
          </p>
        )}
        {meta?.address && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3 shrink-0" />
            {meta.address}
          </p>
        )}
      </div>
    </div>
  );
});

CustomerOptionContent.displayName = 'CustomerOptionContent';

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export function UnifiedCustomerSearch({
  onSelectCustomer,
  placeholder = 'Tìm kiếm khách hàng...',
  searchPlaceholder = 'Nhập tên, SĐT, email...',
  disabled = false,
  limit = 20,
  city,
  district,
}: UnifiedCustomerSearchProps) {
  const [selectedValue, setSelectedValue] = useState<ComboboxOption | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingCustomerId, setPendingCustomerId] = useState<string | null>(null);
  // Track if user has interacted with combobox
  const [hasInteracted, setHasInteracted] = useState(false);

  // Use Meilisearch for fast customer search with infinite scroll
  const {
    data: searchResult,
    isLoading: isLoadingSearch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMeiliCustomerSearch({
    query: searchQuery,
    debounceMs: 150,
    enabled: hasInteracted,
    filters: {
      city,
      district,
    },
  });

  // Fetch full customer data when selected from Meilisearch
  const { data: selectedCustomer, isLoading: isLoadingCustomer } = useCustomer(pendingCustomerId ?? undefined);

  // When full customer is loaded, call onSelectCustomer
  useEffect(() => {
    if (selectedCustomer && pendingCustomerId) {
      // Guard against stale/cached data from a previous query
      if (selectedCustomer.systemId !== pendingCustomerId) return;
      onSelectCustomer({
        systemId: selectedCustomer.systemId,
        name: selectedCustomer.name,
        phone: selectedCustomer.phone,
        email: selectedCustomer.email,
        address: selectedCustomer.address,
        city: (selectedCustomer as any).city || selectedCustomer.province,
        district: (selectedCustomer as any).district || selectedCustomer.district,
      });
      setPendingCustomerId(null);
    }
  }, [selectedCustomer, pendingCustomerId, onSelectCustomer]);

  // Flatten all pages from infinite query
  const searchCustomers = useMemo(() => {
    return searchResult?.pages.flatMap(page => page.data) || [];
  }, [searchResult]);

  // Convert Meilisearch results to ComboboxOption format
  const options: ComboboxOption[] = useMemo(() => {
    return searchCustomers.map((c) => ({
      value: c.systemId,
      label: c.name,
      subtitle: c.phone || undefined,
      metadata: {
        phone: c.phone,
        email: c.email,
        address: c.address,
        city: c.city,
        district: c.district,
        totalOrders: c.totalOrders,
        totalSpent: c.totalSpent,
      },
    } as ComboboxOption));
  }, [searchCustomers]);

  const handleChange = useCallback((option: ComboboxOption | null) => {
    if (option) {
      // Set pending customer ID to trigger full customer fetch
      setPendingCustomerId(option.value);
    }
    setSelectedValue(null);
  }, []);

  // Render option with customer info
  const renderOption = useCallback((option: ComboboxOption) => {
    return <CustomerOptionContent option={option} />;
  }, []);

  // Memoize onLoadMore to prevent re-renders
  const handleLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const isLoading = isLoadingSearch || !!pendingCustomerId;

  return (
    <VirtualizedCombobox
      options={options}
      value={selectedValue}
      onChange={handleChange}
      onSearchChange={setSearchQuery}
      onOpenChange={(open) => { if (open) setHasInteracted(true); }}
      isLoading={isLoading}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyPlaceholder={hasInteracted ? "Không tìm thấy khách hàng" : "Nhập để tìm kiếm..."}
      disabled={disabled}
      onLoadMore={handleLoadMore}
      hasMore={hasNextPage}
      isLoadingMore={isFetchingNextPage}
      renderOption={renderOption}
    />
  );
}
