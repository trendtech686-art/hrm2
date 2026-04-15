/**
 * RecipientCombobox - Server-side paginated combobox for selecting payment/receipt recipients
 * 
 * Supports:
 * - Customers, Suppliers, Employees, Shipping Partners with infinite scroll
 * - Server-side search with debounce  
 * - "Add new" option for "Other" type
 * - Loads 30 results at a time
 */

'use client';

import * as React from 'react';
import { UserPlus } from 'lucide-react';
import { useInfiniteCustomers } from '../../customers/hooks/use-customers';
import { useInfiniteSuppliers } from '../../suppliers/hooks/use-suppliers';
import { useInfiniteEmployees } from '../../employees/hooks/use-employees';
import { useAllShippingPartners } from '../../settings/shipping/hooks/use-all-shipping-partners';
import { VirtualizedCombobox, type ComboboxOption } from '../../../components/ui/virtualized-combobox';
import { QuickAddOtherRecipientDialog } from './quick-add-other-recipient-dialog';
import { asSystemId, type SystemId } from '@/lib/id-types';
import type { Customer } from '@/lib/types/prisma-extended';
import type { Supplier } from '@/lib/types/prisma-extended';
import type { Employee } from '@/lib/types/prisma-extended';

export type RecipientType = 'KHACHHANG' | 'NHACUNGCAP' | 'NHANVIEN' | 'DOITACVC' | 'KHAC';

interface RecipientComboboxProps {
  /** Type of recipient to load */
  recipientType: RecipientType;
  /** Selected recipient systemId */
  value?: SystemId | null;
  /** Callback when recipient is selected */
  onValueChange: (systemId: SystemId | null, name: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the combobox is disabled */
  disabled?: boolean;
  /** Initial display label for the selected value (shown before options load) */
  initialLabel?: string;
}

const ADD_NEW_VALUE = '__ADD_NEW__';

export function RecipientCombobox({
  recipientType,
  value,
  onValueChange,
  placeholder = 'Chọn đối tượng...',
  disabled = false,
  initialLabel,
}: RecipientComboboxProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [hasOpened, setHasOpened] = React.useState(false);
  // ✅ Track the last selected option to persist display when options change
  const [cachedSelectedOption, setCachedSelectedOption] = React.useState<ComboboxOption | null>(
    value && initialLabel ? { value: value as string, label: initialLabel } : null
  );
  
  // Only fetch when opened or has value
  const shouldLoad = hasOpened || !!value;

  // Customers - infinite pagination
  const customersQuery = useInfiniteCustomers({ 
    search: searchQuery, 
    limit: 30, 
    enabled: shouldLoad && recipientType === 'KHACHHANG' 
  });
  
  // Suppliers - infinite pagination
  const suppliersQuery = useInfiniteSuppliers({ 
    search: searchQuery, 
    limit: 30, 
    enabled: shouldLoad && recipientType === 'NHACUNGCAP' 
  });
  
  // Employees - infinite pagination
  const employeesQuery = useInfiniteEmployees({ 
    search: searchQuery, 
    limit: 30, 
    enabled: shouldLoad && recipientType === 'NHANVIEN' 
  });

  // Shipping partners - small list, no pagination needed
  const { data: shippingPartners = [], isLoading: isLoadingSP } = useAllShippingPartners({ 
    enabled: shouldLoad && recipientType === 'DOITACVC' 
  });

  // Convert data to options based on recipient type
  const { options, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = React.useMemo(() => {
    const items: ComboboxOption[] = [];

    // Add "Add new" option for KHAC type
    if (recipientType === 'KHAC') {
      items.push({
        value: ADD_NEW_VALUE,
        label: 'Thêm đối tượng mới',
        subtitle: 'Tạo mục nhập tùy chỉnh',
      });
      return {
        options: items,
        isLoading: false,
        fetchNextPage: () => {},
        hasNextPage: false,
        isFetchingNextPage: false,
      };
    }

    switch (recipientType) {
      case 'KHACHHANG': {
        const customers = customersQuery.data?.pages.flatMap(p => p.data) || [];
        items.push(...customers.map((c: Customer) => ({
          value: c.systemId,
          label: c.name,
          subtitle: c.phone || undefined,
        })));
        return {
          options: items,
          isLoading: customersQuery.isLoading,
          fetchNextPage: customersQuery.fetchNextPage,
          hasNextPage: customersQuery.hasNextPage || false,
          isFetchingNextPage: customersQuery.isFetchingNextPage,
        };
      }
      case 'NHACUNGCAP': {
        const suppliers = suppliersQuery.data?.pages.flatMap(p => p.data) || [];
        items.push(...suppliers.map((s: Supplier) => ({
          value: s.systemId,
          label: s.name,
          subtitle: s.phone || undefined,
        })));
        return {
          options: items,
          isLoading: suppliersQuery.isLoading,
          fetchNextPage: suppliersQuery.fetchNextPage,
          hasNextPage: suppliersQuery.hasNextPage || false,
          isFetchingNextPage: suppliersQuery.isFetchingNextPage,
        };
      }
      case 'NHANVIEN': {
        const employees = employeesQuery.data?.pages.flatMap(p => p.data) || [];
        items.push(...employees.map((e: Employee) => ({
          value: e.systemId,
          label: e.fullName,
          subtitle: e.phone || undefined,
        })));
        return {
          options: items,
          isLoading: employeesQuery.isLoading,
          fetchNextPage: employeesQuery.fetchNextPage,
          hasNextPage: employeesQuery.hasNextPage || false,
          isFetchingNextPage: employeesQuery.isFetchingNextPage,
        };
      }
      case 'DOITACVC': {
        items.push(...shippingPartners.map((sp) => ({
          value: sp.systemId,
          label: sp.name,
          subtitle: sp.id || undefined,
        })));
        return {
          options: items,
          isLoading: isLoadingSP,
          fetchNextPage: () => {},
          hasNextPage: false,
          isFetchingNextPage: false,
        };
      }
      default:
        return {
          options: items,
          isLoading: false,
          fetchNextPage: () => {},
          hasNextPage: false,
          isFetchingNextPage: false,
        };
    }
  }, [recipientType, customersQuery, suppliersQuery, employeesQuery, shippingPartners, isLoadingSP]);

  // Find selected value - use cached option if not found in current options
  const selectedValue = React.useMemo((): ComboboxOption | null => {
    if (!value) return null;
    // First try to find in current options
    const foundOption = options.find(opt => opt.value === value);
    if (foundOption) return foundOption;
    // Fall back to cached option if value matches
    if (cachedSelectedOption && cachedSelectedOption.value === value) {
      return cachedSelectedOption;
    }
    return null;
  }, [value, options, cachedSelectedOption]);

  // ✅ Initialize cached option from initialLabel when value is set but options haven't loaded
  React.useEffect(() => {
    if (value && initialLabel && !cachedSelectedOption) {
      setCachedSelectedOption({ value: value as string, label: initialLabel });
    }
  }, [value, initialLabel, cachedSelectedOption]);

  // ✅ Sync cached option when options load and include the current value
  React.useEffect(() => {
    if (value && !cachedSelectedOption) {
      const foundOption = options.find(opt => opt.value === value);
      if (foundOption) {
        setCachedSelectedOption(foundOption);
      }
    }
  }, [value, options, cachedSelectedOption]);

  // ✅ Clear cache when recipient type changes
  React.useEffect(() => {
    setCachedSelectedOption(null);
  }, [recipientType]);

  const handleChange = React.useCallback((option: ComboboxOption | null) => {
    if (option?.value === ADD_NEW_VALUE) {
      setShowAddDialog(true);
      return;
    }
    
    // ✅ Cache the selected option for persistent display
    if (option) {
      setCachedSelectedOption(option);
    } else {
      setCachedSelectedOption(null);
    }
    
    onValueChange(
      option ? asSystemId(option.value) : null,
      option?.label || ''
    );
  }, [onValueChange]);

  const handleAddSuccess = React.useCallback((name: string) => {
    // For KHAC type, we don't have a systemId, just set the name
    onValueChange(null, name);
    setShowAddDialog(false);
  }, [onValueChange]);

  const handleOpenChange = React.useCallback((open: boolean) => {
    if (open && !hasOpened) {
      setHasOpened(true);
    }
  }, [hasOpened]);

  const handleSearchChange = React.useCallback((search: string) => {
    setSearchQuery(search);
  }, []);

  // Get placeholder based on recipient type
  const getPlaceholder = () => {
    switch (recipientType) {
      case 'KHACHHANG':
        return 'Chọn Khách hàng';
      case 'NHACUNGCAP':
        return 'Chọn Nhà cung cấp';
      case 'NHANVIEN':
        return 'Chọn Nhân viên';
      case 'DOITACVC':
        return 'Chọn Đối tác vận chuyển';
      case 'KHAC':
        return 'Chọn Đối tượng khác';
      default:
        return placeholder;
    }
  };

  const renderOption = React.useCallback((option: ComboboxOption, isSelected: boolean) => {
    // Special render for "Add new" option
    if (option.value === ADD_NEW_VALUE) {
      return (
        <div className="flex items-center gap-2 text-primary">
          <UserPlus className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="font-medium">{option.label}</span>
            <span className="text-xs text-muted-foreground">{option.subtitle}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {isSelected && (
          <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
        {!isSelected && <div className="w-4" />}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-medium text-sm truncate">{option.label}</span>
          {option.subtitle && (
            <span className="text-xs text-muted-foreground truncate">{option.subtitle}</span>
          )}
        </div>
      </div>
    );
  }, []);

  return (
    <>
      <VirtualizedCombobox
        value={selectedValue}
        onChange={handleChange}
        options={options}
        placeholder={getPlaceholder()}
        searchPlaceholder="Tìm kiếm..."
        emptyPlaceholder={recipientType === 'KHAC' ? 'Nhấn để thêm mới' : 'Không tìm thấy kết quả'}
        disabled={disabled}
        isLoading={isLoading}
        onSearchChange={handleSearchChange}
        onOpenChange={handleOpenChange}
        onLoadMore={fetchNextPage}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
        renderOption={renderOption}
        estimatedItemHeight={48}
      />

      {recipientType === 'KHAC' && showAddDialog && (
        <QuickAddOtherRecipientDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSuccess={handleAddSuccess}
        />
      )}
    </>
  );
}
