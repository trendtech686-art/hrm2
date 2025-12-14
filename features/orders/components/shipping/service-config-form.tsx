/**
 * ServiceConfigForm
 * Inline form hiển thị config cho service đã chọn (GHTK, GHN, VTP...)
 * Render trực tiếp bên phải - KHÔNG DÙNG DIALOG
 */

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Checkbox } from '@/components/ui/checkbox'; // ✅ Keep for GHN form
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar as CalendarIcon, Loader2, Check, ChevronsUpDown, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBaseUrl } from '@/lib/api-config';
import { loadShippingConfig } from '@/lib/utils/shipping-config-migration'; // ✅ Use shared utility
import { useGlobalShippingConfig, getGHTKTagsFromRequirement } from '@/features/orders/hooks/use-global-shipping-config'; // ✅ Use global config
import { toast } from 'sonner'; // ✅ Import toast
import { AddressFormDialog } from '@/features/customers/components/address-form-dialog'; // ✅ Reuse existing component
import type { ShippingService, SelectedShippingConfig, ShippingAddress } from './types';
import type { CustomerAddress } from '@/features/customers/types';

interface ServiceConfigFormProps {
  service: ShippingService;
  config?: Partial<SelectedShippingConfig['options']> | undefined;
  onConfigChange: (config: Partial<SelectedShippingConfig['options']>) => void;
  grandTotal?: number | undefined; // ✅ Add grandTotal prop
  customerAddress?: ShippingAddress | null | undefined; // ✅ Add customer address for specific addresses API
}

// GHTK Pick Address type
interface GHTKPickAddress {
  id: string;
  name: string;
  address: string;
  province: string;
  district: string;
  ward?: string;
  tel: string;
}

// GHTK Specific Address type (street level)
interface GHTKSpecificAddress {
  id: string;
  name: string; // Full address string
}

// ✅ Cache for specific addresses (5 minutes)
const SPECIFIC_ADDRESS_CACHE_DURATION = 5 * 60 * 1000;
const specificAddressCache = new Map<string, { 
  data: GHTKSpecificAddress[]; 
  timestamp: number;
}>();

function getSpecificAddressCacheKey(province: string, district: string, ward: string): string {
  return `${province}|${district}|${ward}`.toLowerCase();
}

type ShippingOptions = NonNullable<SelectedShippingConfig['options']>;

export function ServiceConfigForm({ service, config = {}, onConfigChange, grandTotal = 0, customerAddress }: ServiceConfigFormProps) {
  // ✅ Get global shipping config
  const { globalConfig, getDefaultShippingOptions, getDimensions, deliveryRequirement, defaultNote } = useGlobalShippingConfig();
  
  // ✅ Initialize options with global config defaults
  const [options, setOptions] = React.useState<Partial<ShippingOptions>>(() => {
    const defaultOptions = getDefaultShippingOptions();
    const ghtkTags = service.partnerCode === 'GHTK' ? getGHTKTagsFromRequirement(deliveryRequirement) : [];
    
    return {
      transport: config?.transport || 'road',
      payer: config?.payer || 'CUSTOMER',
      pickOption: config?.pickOption || 'cod',
      note: config?.note || defaultNote, // ✅ Use global default note
      requirement: config?.requirement || deliveryRequirement, // ✅ Use global delivery requirement
      tags: config?.tags || ghtkTags, // ✅ Apply GHTK tags based on global requirement
      ...config, // Override with any explicitly provided config
    };
  });
  
  const [pickAddresses, setPickAddresses] = React.useState<GHTKPickAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = React.useState(false);
  const [addressError, setAddressError] = React.useState<string>(''); // ✅ Add error state
  
  // ✅ Add state for specific addresses (street level)
  const [specificAddresses, setSpecificAddresses] = React.useState<GHTKSpecificAddress[]>([]);
  const [loadingSpecificAddresses, setLoadingSpecificAddresses] = React.useState(false);
  const [specificAddressError, setSpecificAddressError] = React.useState<string>('');
  
  const [pickDate, setPickDate] = React.useState<Date>(new Date()); // ✅ Default to today
  const [deliverDate, setDeliverDate] = React.useState<Date>();
  const [openPickAddress, setOpenPickAddress] = React.useState(false);
  const [openSpecificAddress, setOpenSpecificAddress] = React.useState(false);
  const [openPickDate, setOpenPickDate] = React.useState(false);
  const [openDeliverDate, setOpenDeliverDate] = React.useState(false);
  
  // ✅ Dialog state for return address (reuse AddressFormDialog)
  const [openReturnAddressDialog, setOpenReturnAddressDialog] = React.useState(false);
  const [openReturnAddressPicker, setOpenReturnAddressPicker] = React.useState(false); // ✅ Popover for choosing return address type
  const [returnAddressData, setReturnAddressData] = React.useState<CustomerAddress | null>(null);

  // ✅ Auto-set pickDate to today's date in options on mount
  React.useEffect(() => {
    if (!options.pickDate) {
      const today = format(new Date(), 'yyyy-MM-dd');
      handleInputChange('pickDate', today);
    }
  }, []); // Run only on mount

  // ✅ Auto-fill orderValue = 3 triệu as default
  React.useEffect(() => {
    if (!options.orderValue) {
      // Default to 3 million VND
      handleInputChange('orderValue', 3000000);
    }
  }, []); // Run only on mount

  // Load pick addresses for GHTK with caching
  React.useEffect(() => {
    if (service.partnerCode === 'GHTK') {
      loadGHTKPickAddresses(); // ✅ Parallel load: Start immediately
    }
  }, [service.partnerCode]);

  const loadGHTKPickAddresses = async () => {
    // ✅ CACHE LAYER: Check localStorage first (1 hour expiry)
    const CACHE_KEY = 'ghtk_warehouses_cache_v1';
    const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
    
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp, apiToken } = JSON.parse(cached);
        
        // Verify cache is still valid
        const config = loadShippingConfig();
        const ghtkData = config.partners.GHTK;
        const defaultAccount = ghtkData?.accounts?.find(a => a.isDefault && a.active)
          || ghtkData?.accounts?.find(a => a.active);
        const currentToken = defaultAccount?.credentials?.apiToken;
        
        if (
          Date.now() - timestamp < CACHE_DURATION &&
          apiToken === currentToken &&
          Array.isArray(data) &&
          data.length > 0
        ) {
          setPickAddresses(data);
          
          // Auto-select first if none selected
          if (!options.pickAddressId && data[0]) {
            handleInputChange('pickAddressId', data[0].id);
          }
          return; // Skip API call ⚡
        }
      } catch (e) {
        localStorage.removeItem(CACHE_KEY);
      }
    }
    
    // ✅ No valid cache → Fetch from API
    setLoadingAddresses(true);
    setAddressError(''); // Clear previous error
    
    try {
      // ✅ V2: Get default GHTK account
      const config = loadShippingConfig();
      const ghtkData = config.partners.GHTK;
      
      if (!ghtkData || !ghtkData.accounts || ghtkData.accounts.length === 0) {
        throw new Error('GHTK chưa được cấu hình. Vui lòng vào Cài đặt > Vận chuyển để kết nối GHTK.');
      }
      
      const defaultAccount = ghtkData.accounts.find(a => a.isDefault && a.active)
        || ghtkData.accounts.find(a => a.active)
        || ghtkData.accounts[0];

      if (!defaultAccount || !defaultAccount.active) {
        throw new Error('Không có tài khoản GHTK nào hoạt động. Vui lòng kích hoạt tài khoản.');
      }

      if (!defaultAccount.credentials.apiToken) {
        throw new Error('Tài khoản GHTK chưa có API token. Vui lòng cấu hình lại.');
      }

      const apiToken = defaultAccount.credentials.apiToken;
      const partnerCode = (defaultAccount.credentials as any).partnerCode || 'GHTK';

      // ✅ Check if server is running first
      const baseUrl = getBaseUrl();
      const url = new URL(`${baseUrl}/api/shipping/ghtk/list-pick-addresses`);
      url.searchParams.append('apiToken', apiToken);
      url.searchParams.append('partnerCode', partnerCode);

      // ✅ Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      try {
        const response = await fetch(url.toString(), { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.success && data.data && Array.isArray(data.data)) {
          if (data.data.length === 0) {
            throw new Error('Tài khoản GHTK chưa có địa chỉ kho nào. Vui lòng thêm địa chỉ lấy hàng trên trang khachhang.giaohangtietkiem.vn');
          }
          
          // Parse GHTK response format - just store raw data
          const addresses: GHTKPickAddress[] = data.data.map((item: any) => {
            return {
              id: item.pick_address_id || item.id,
              name: item.pick_name || item.name || 'Kho hàng',
              address: item.address || '',
              province: '', // Will be parsed when loading specific addresses
              district: '', // Will be parsed when loading specific addresses
              ward: '',
              tel: item.pick_tel || item.tel || ''
            };
          });

          setPickAddresses(addresses);
          
          // ✅ SAVE TO CACHE for next time
          const CACHE_KEY = 'ghtk_warehouses_cache_v1';
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
              data: addresses,
              timestamp: Date.now(),
              apiToken: apiToken
            }));
          } catch (cacheError) {
            // Silently fail - not critical
          }
          
          // ✅ Auto-select first address if none selected
          if (addresses.length > 0 && !options.pickAddressId) {
            const firstAddress = addresses[0];
            handleInputChange('pickAddressId', firstAddress.id);
          }
        } else {
          // Check specific error messages from GHTK
          if (data.message) {
            throw new Error(`GHTK API: ${data.message}`);
          } else {
            throw new Error('Không thể lấy danh sách kho từ GHTK. Vui lòng kiểm tra lại API Token.');
          }
        }
      } catch (fetchError) {
        // Handle fetch timeout or network error
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('Server không phản hồi (timeout). Vui lòng kiểm tra server đã chạy chưa.');
        }
        throw new Error('Không thể kết nối server API. Vui lòng chạy: cd server && npm run dev');
      }
    } catch (error) {
      console.error('❌ [ServiceConfigForm] Error loading pick addresses:', error);
      
      // ✅ Set error message for display
      setAddressError(error instanceof Error ? error.message : 'Không thể tải danh sách kho');
      setPickAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // ✅ Load specific addresses when pickAddressId changes
  // ✅ Normalize address for GHTK API - ONLY lowercase, keep prefix!
  const normalizeGHTKAddress = React.useCallback((text: string): string => {
    if (!text) return '';
    
    // ✅ GHTK API expects lowercase with spaces, but KEEP all prefixes!
    // Test results show "tp hcm", "thành phố thủ dầu một", "phường hiệp thành" works better
    return text.trim().toLowerCase();
  }, []);

  const loadSpecificAddresses = React.useCallback(async (pickAddressId: string) => {
    // ✅ No longer need pickAddressId - just use it as trigger ID for logging
    
    // ✅ FIXED: Support 2-level address - only province required, district optional
    if (!customerAddress || !customerAddress.province) {
      console.warn('⚠️ [ServiceConfigForm] No customer address available for specific addresses (missing province)');
      setSpecificAddresses([]);
      return;
    }

    // ✅ Check cache first
    const province = customerAddress.province;
    const district = customerAddress.district || '';
    const ward = customerAddress.ward || '';
    const cacheKey = getSpecificAddressCacheKey(province, district, ward);
    const cached = specificAddressCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < SPECIFIC_ADDRESS_CACHE_DURATION) {
      setSpecificAddresses(cached.data);
      return;
    }

    setLoadingSpecificAddresses(true);
    setSpecificAddressError('');
    
    try {
      const config = loadShippingConfig();
      const ghtkData = config.partners.GHTK;
      const defaultAccount = ghtkData?.accounts?.find(a => a.isDefault && a.active) 
        || ghtkData?.accounts?.find(a => a.active)
        || ghtkData?.accounts?.[0];

      if (!defaultAccount?.credentials.apiToken) {
        throw new Error('Không tìm thấy API token');
      }

      // ✅ Use CUSTOMER address, NOT pick address (support 2-level: district can be empty)
      const province = customerAddress.province;
      const district = customerAddress.district || ''; // ✅ Empty for 2-level address
      const ward = customerAddress.ward || '';

      // Normalize for GHTK API
      const normalizedProvince = normalizeGHTKAddress(province);
      const normalizedDistrict = district ? normalizeGHTKAddress(district) : ''; // ✅ Keep empty if 2-level
      const normalizedWard = normalizeGHTKAddress(ward);

      if (!normalizedProvince) {
        throw new Error(`Thiếu thông tin tỉnh/thành phố`);
      }

      const apiToken = defaultAccount.credentials.apiToken;
      const baseUrl = getBaseUrl();
      const url = new URL(`${baseUrl}/api/shipping/ghtk/get-specific-addresses`);
      url.searchParams.append('province', normalizedProvince);
      
      // For 2-level address, try using ward as district
      if (normalizedDistrict) {
        url.searchParams.append('district', normalizedDistrict);
      } else if (normalizedWard) {
        url.searchParams.append('district', normalizedWard);
      }
      
      url.searchParams.append('ward_street', normalizedWard);
      url.searchParams.append('apiToken', apiToken);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(url.toString(), { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data && Array.isArray(data.data)) {
          // ✅ GHTK returns array of strings (address names)
          // Use index to ensure unique IDs even if names are duplicated
          let addresses = data.data.map((name: string, index: number) => ({
            id: `${name}-${index}`, // ✅ Combine name + index for unique ID
            name: name
          }));
          
          // Move "Khác" to the top if it exists
          const khacIndex = addresses.findIndex((addr: GHTKSpecificAddress) => addr.name === 'Khác');
          if (khacIndex > 0) {
            const khac = addresses[khacIndex];
            addresses = [khac, ...addresses.slice(0, khacIndex), ...addresses.slice(khacIndex + 1)];
          }
          
          // ✅ Save to cache
          const cacheKey = getSpecificAddressCacheKey(province, district, ward);
          specificAddressCache.set(cacheKey, {
            data: addresses,
            timestamp: Date.now()
          });
          
          setSpecificAddresses(addresses);
          
          // ✅ Auto-select "Khác" if it exists and no address selected yet
          if (addresses.length > 0 && !options.specificAddress) {
            const khac = addresses.find((addr: GHTKSpecificAddress) => addr.name === 'Khác');
            if (khac) {
              handleInputChange('specificAddress', khac.name); // ✅ Use NAME for GHTK API
            }
          }
        } else {
          throw new Error(data.message || 'Không thể lấy danh sách địa chỉ chi tiết');
        }
      } catch (fetchError) {
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('Server không phản hồi (timeout)');
        }
        throw new Error('Không thể kết nối server API');
      }
    } catch (error) {
      console.error('❌ [ServiceConfigForm] Error loading specific addresses:', error);
      setSpecificAddressError(error instanceof Error ? error.message : 'Không thể tải địa chỉ');
      setSpecificAddresses([]);
    } finally {
      setLoadingSpecificAddresses(false);
    }
  }, [customerAddress, normalizeGHTKAddress]);

  // ✅ Store latest onConfigChange callback in ref to avoid infinite loop
  const onConfigChangeRef = React.useRef(onConfigChange);
  React.useEffect(() => {
    onConfigChangeRef.current = onConfigChange;
  }, [onConfigChange]);

  // ✅ FIX: Notify parent only when specific option values change, not object reference
  // Create stable key based on actual primitive values (no array/object references)
  const optionsKey = React.useMemo(() => {
    return JSON.stringify({
      pickAddressId: options.pickAddressId,
      useReturnAddress: options.useReturnAddress,
      deliverWorkShift: options.deliverWorkShift,
      transport: options.transport,
      pickDate: options.pickDate,
      deliverDate: options.deliverDate,
      orderValue: options.orderValue,
      pickWorkShift: options.pickWorkShift,
      payer: options.payer,
      specificAddress: options.specificAddress, // ✅ Track specific address (hamlet)
      ghtkTags: options.ghtkTags, // ✅ Track tags changes
      failedDeliveryFee: options.failedDeliveryFee // ✅ Track failed delivery fee (tag 19)
    });
  }, [
    options.pickAddressId,
    options.useReturnAddress,
    options.deliverWorkShift,
    options.transport,
    options.pickDate,
    options.deliverDate,
    options.orderValue,
    options.pickWorkShift,
    options.payer,
    options.specificAddress, // ✅ Track specific address
    options.ghtkTags, // ✅ Track tags changes
    options.failedDeliveryFee // ✅ Track failed delivery fee
  ]);

  // Only notify parent when optionsKey changes (i.e., when actual values change)
  React.useEffect(() => {
    // ✅ Use queueMicrotask to ensure this runs AFTER render phase completes
    // Use ref to avoid adding onConfigChange to dependencies (would cause infinite loop)
    queueMicrotask(() => {
      onConfigChangeRef.current(options);
    });
  }, [optionsKey, options]);

  // ✅ Load specific addresses when customerAddress is available (NOT dependent on pickAddressId)
  React.useEffect(() => {
    if (service.partnerCode === 'GHTK' && customerAddress?.province && customerAddress?.district) {
      loadSpecificAddresses('customer-address');
    } else if (service.partnerCode === 'GHTK' && customerAddress?.province && !customerAddress?.district) {
      loadSpecificAddresses('customer-address');
    } else {
      setSpecificAddresses([]);
    }
  }, [service.partnerCode, customerAddress, loadSpecificAddresses]);

  const handleInputChange = (key: string, value: any) => {
    setOptions(prev => {
      const newOptions = { ...prev, [key]: value };
      // ⚠️ Don't call onConfigChange here - let useEffect handle it to avoid double updates
      return newOptions;
    });
  };

  // ✅ Handler for saving return address from AddressFormDialog
  const handleSaveReturnAddress = (address: Omit<CustomerAddress, 'id'>) => {
    
    // Map CustomerAddress to return address fields - batch update
    const returnAddressFields = {
      returnName: address.contactName,
      returnTel: address.contactPhone,
      returnProvince: address.province,
      returnProvinceId: Number(address.provinceId),
      returnDistrict: address.district,
      returnDistrictId: address.districtId,
      returnWard: address.ward,
      returnWardId: address.wardId,
      returnAddress: address.street,
      returnStreet: address.street, // Same as returnAddress
      returnEmail: '', // AddressFormDialog doesn't have email field
    };
    
    // ✅ Batch update all fields at once
    setOptions(prev => {
      const newOptions = { ...prev, ...returnAddressFields };
      // ⚠️ Don't call onConfigChange here - let useEffect handle it
      return newOptions;
    });
    
    toast.success('✅ Đã lưu địa chỉ trả hàng');
    setOpenReturnAddressDialog(false);
  };

  // Render GHTK form
  if (service.partnerCode === 'GHTK') {
    return (
      <React.Fragment>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Cấu hình vận chuyển</h3>

        {/* Row 1: 2 columns */}
        <div className="grid grid-cols-2 gap-4">
          {/* Gói dịch vụ - Dropdown list */}
          <div className="space-y-2">
            <Label>Gói dịch vụ</Label>
            <Select
              value={service.serviceId}
              onValueChange={(value) => {
                // Allow changing service package if needed
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={service.serviceName} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={service.serviceId}>{service.serviceName}</SelectItem>
                {/* Add more service options if available */}
              </SelectContent>
            </Select>
          </div>

          {/* Kho lấy hàng - Combobox searchable */}
          <div className="space-y-2">
            <Label>
              Kho lấy hàng {loadingAddresses && <Loader2 className="inline h-3 w-3 ml-2 animate-spin" />}
            </Label>
            
            {/* Show error if any */}
            {addressError && (
              <div className="text-xs text-red-600 mb-1">
                ⚠️ {addressError}
              </div>
            )}
            
            <Popover open={openPickAddress} onOpenChange={setOpenPickAddress}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openPickAddress}
                  className="w-full justify-between"
                  disabled={loadingAddresses || pickAddresses.length === 0}
                >
                  {loadingAddresses ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang tải...
                    </>
                  ) : pickAddresses.length === 0 ? (
                    addressError ? "Lỗi tải kho" : "Chưa có kho hàng"
                  ) : options.pickAddressId ? (
                    pickAddresses.find((addr) => addr.id === options.pickAddressId)?.name
                  ) : (
                    "Chọn kho lấy hàng"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Tìm kho..." />
                  <CommandEmpty>
                    {pickAddresses.length === 0 
                      ? "Chưa có kho hàng nào. Vui lòng thêm địa chỉ lấy hàng trong cấu hình GHTK."
                      : "Không tìm thấy kho nào."
                    }
                  </CommandEmpty>
                  <CommandGroup>
                    {pickAddresses.map((addr) => (
                      <CommandItem
                        key={addr.id}
                        value={addr.id}
                        onSelect={(currentValue) => {
                          handleInputChange('pickAddressId', currentValue);
                          setOpenPickAddress(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            options.pickAddressId === addr.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{addr.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {addr.tel} {addr.tel && addr.address ? '- ' : ''}{addr.address}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Row 2: 2 columns - Địa chỉ trả hàng + Địa chỉ chi tiết */}
        <div className="grid grid-cols-2 gap-4">
          {/* Địa chỉ trả hàng (left) - Click to edit */}
          <div className="space-y-2">
            <Label>Địa chỉ trả hàng</Label>
            <Popover open={openReturnAddressPicker} onOpenChange={setOpenReturnAddressPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between font-normal"
                >
                  {options.useReturnAddress === 1 && options.returnName ? (
                    <span className="truncate">
                      {options.returnName} - {options.returnTel}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Địa chỉ lấy hàng</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandGroup>
                    <CommandItem
                      value="same"
                      onSelect={() => {
                        handleInputChange('useReturnAddress', 0);
                        // Clear return address data
                        handleInputChange('returnName', '');
                        handleInputChange('returnTel', '');
                        handleInputChange('returnProvince', '');
                        handleInputChange('returnProvinceId', undefined);
                        handleInputChange('returnDistrict', '');
                        handleInputChange('returnDistrictId', undefined);
                        handleInputChange('returnWard', '');
                        handleInputChange('returnWardId', '');
                        handleInputChange('returnAddress', '');
                        setOpenReturnAddressPicker(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          options.useReturnAddress === 0 ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Địa chỉ lấy hàng
                    </CommandItem>
                    
                    <CommandItem
                      value="different"
                      onSelect={() => {
                        setOpenReturnAddressPicker(false);
                        // Prepare data for editing (if exists)
                        if (options.returnName) {
                          const editData: CustomerAddress = {
                            id: 'temp-return-address',
                            label: 'Địa chỉ trả hàng',
                            street: options.returnAddress || '',
                            province: options.returnProvince || '',
                            provinceId: String(options.returnProvinceId || 0),
                            district: options.returnDistrict || '',
                            districtId: options.returnDistrictId || 0,
                            ward: options.returnWard || '',
                            wardId: options.returnWardId || '',
                            contactName: options.returnName || '',
                            contactPhone: options.returnTel || '',
                            notes: '',
                            isDefaultShipping: false,
                            isDefaultBilling: false,
                            inputLevel: options.returnWardId ? '3-level' : '2-level',
                            autoFilled: false,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                          };
                          setReturnAddressData(editData);
                        } else {
                          setReturnAddressData(null);
                          handleInputChange('useReturnAddress', 1);
                        }
                        setOpenReturnAddressDialog(true);
                      }}
                    >
                      {options.returnName ? (
                        <>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 shrink-0",
                              options.useReturnAddress === 1 ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex items-center justify-between flex-1 gap-2">
                            <span className="text-sm flex-1">
                              {options.returnAddress}, {options.returnWard && `${options.returnWard}, `}{options.returnDistrict}, {options.returnProvince}
                            </span>
                            <Pencil className="h-4 w-4 shrink-0 text-muted-foreground" />
                          </div>
                        </>
                      ) : (
                        <>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              options.useReturnAddress === 1 ? "opacity-100" : "opacity-0"
                            )}
                          />
                          Địa chỉ khác
                        </>
                      )}
                    </CommandItem>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Địa chỉ chi tiết - Combobox searchable (right) */}
          <div className="space-y-2">
            <Label>
              Địa chỉ chi tiết {loadingSpecificAddresses && <Loader2 className="inline h-3 w-3 ml-2 animate-spin" />}
            </Label>
              
              {/* Show error if any */}
              {specificAddressError && (
                <div className="text-xs text-red-600 mb-1">
                  ⚠️ {specificAddressError}
                </div>
              )}
              
              <Popover open={openSpecificAddress} onOpenChange={setOpenSpecificAddress}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openSpecificAddress}
                    className="w-full justify-between"
                    disabled={loadingSpecificAddresses || !customerAddress || specificAddresses.length === 0}
                  >
                    {loadingSpecificAddresses ? (
                      <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang tải...
                    </>
                  ) : !customerAddress ? (
                    "Chọn địa chỉ khách trước"
                  ) : specificAddresses.length === 0 ? (
                    specificAddressError ? "Lỗi tải địa chỉ" : "Chưa có địa chỉ"
                  ) : options.specificAddress ? (
                    specificAddresses.find((addr) => addr.id === options.specificAddress)?.name || "Chọn địa chỉ"
                  ) : (
                    "Chọn địa chỉ chi tiết"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Tìm địa chỉ..." />
                  <CommandEmpty>
                    {specificAddresses.length === 0 
                      ? "Chưa có địa chỉ nào."
                      : "Không tìm thấy địa chỉ nào."
                    }
                  </CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-auto">
                    {specificAddresses.map((addr) => (
                      <CommandItem
                        key={addr.id}
                        value={addr.name}
                        onSelect={(currentValue) => {
                          // ✅ Save ONLY the name to options, not the ID
                          handleInputChange('specificAddress', currentValue);
                          setOpenSpecificAddress(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            options.specificAddress === addr.name ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="text-sm">{addr.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div> {/* ✅ Close grid-cols-2 row */}

        {/* Row 3: 2 dates - Click once to select */}
        <div className="grid grid-cols-2 gap-4">
          {/* Hẹn ngày lấy hàng */}
          <div className="space-y-2">
            <Label>Hẹn ngày lấy hàng</Label>
            <Popover open={openPickDate} onOpenChange={setOpenPickDate}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !pickDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {pickDate ? format(pickDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={pickDate}
                  onSelect={(date) => {
                    if (date) {
                      setPickDate(date);
                      handleInputChange('pickDate', format(date, 'yyyy-MM-dd'));
                      setOpenPickDate(false);
                    }
                  }}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
            {pickDate && pickDate < new Date(new Date().setHours(0, 0, 0, 0)) && (
              <p className="text-xs text-red-600">⚠️ Ngày lấy hàng phải từ hôm nay trở đi</p>
            )}
          </div>

          {/* Hẹn ngày giao hàng */}
          <div className="space-y-2">
            <Label>Hẹn ngày giao hàng</Label>
            <Popover open={openDeliverDate} onOpenChange={setOpenDeliverDate}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deliverDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deliverDate ? format(deliverDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deliverDate}
                  onSelect={(date) => {
                    setDeliverDate(date);
                    if (date) {
                      handleInputChange('deliverDate', format(date, 'yyyy-MM-dd'));
                      setOpenDeliverDate(false);
                    }
                  }}
                  disabled={(date) => {
                    const today = new Date(new Date().setHours(0, 0, 0, 0));
                    if (date < today) return true;
                    if (pickDate && date < pickDate) return true;
                    return false;
                  }}
                />
              </PopoverContent>
            </Popover>
            {deliverDate && pickDate && deliverDate < pickDate && (
              <p className="text-xs text-red-600">⚠️ Ngày giao hàng phải sau hoặc bằng ngày lấy hàng</p>
            )}
          </div>
        </div>

        {/* Row 7: 2 columns - Hẹn ca lấy hàng + Hẹn ca giao hàng */}
        <div className="grid grid-cols-2 gap-4">
          {/* Hẹn ca lấy hàng */}
          <div className="space-y-2">
            <Label>Hẹn ca lấy hàng</Label>
            <Select
              value={options.pickWorkShift?.toString() || 'none'}
              onValueChange={(value) => handleInputChange('pickWorkShift', value === 'none' ? undefined : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn ca lấy hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tự động</SelectItem>
                <SelectItem value="1">Buổi sáng (8h-12h)</SelectItem>
                <SelectItem value="2">Buổi chiều (14h-18h)</SelectItem>
              </SelectContent>
            </Select>
            {options.pickWorkShift && options.pickWorkShift !== 1 && options.pickWorkShift !== 2 && (
              <p className="text-xs text-red-600">⚠️ Ca lấy hàng phải là 1 (sáng) hoặc 2 (chiều)</p>
            )}
          </div>

          {/* Hẹn ca giao hàng */}
          <div className="space-y-2">
            <Label>Hẹn ca giao hàng</Label>
            <Select
              value={options.deliverWorkShift?.toString() || 'none'}
              onValueChange={(value) => handleInputChange('deliverWorkShift', value === 'none' ? undefined : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn ca giao hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tự động</SelectItem>
                <SelectItem value="1">Buổi sáng (8h-12h)</SelectItem>
                <SelectItem value="2">Buổi chiều (14h-18h)</SelectItem>
              </SelectContent>
            </Select>
            {options.deliverWorkShift && options.deliverWorkShift !== 1 && options.deliverWorkShift !== 2 && (
              <p className="text-xs text-red-600">⚠️ Ca giao hàng phải là 1 (sáng) hoặc 2 (chiều)</p>
            )}
          </div>
        </div>

        {/* Row 8: Người trả phí + Lấy hàng tại */}
        <div className="grid grid-cols-2 gap-4">
          {/* Người trả phí (left) */}
          <div className="space-y-2">
            <Label>Người trả phí</Label>
            <RadioGroup
              value={options.payer || 'CUSTOMER'}
              onValueChange={(value) => handleInputChange('payer', value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="SHOP" id="payer-shop" />
                <Label htmlFor="payer-shop" className="font-normal cursor-pointer">Shop trả</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CUSTOMER" id="payer-customer" />
                <Label htmlFor="payer-customer" className="font-normal cursor-pointer">Khách trả</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Lấy hàng tại (right) */}
          <div className="space-y-2">
            <Label>Lấy hàng tại</Label>
            <RadioGroup
              value={options.pickOption || 'cod'}
              onValueChange={(value) => handleInputChange('pickOption', value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cod" id="pick-cod" />
                <Label htmlFor="pick-cod" className="font-normal cursor-pointer">COD đến lấy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="post" id="pick-post" />
                <Label htmlFor="pick-post" className="font-normal cursor-pointer">Gửi bưu cục</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Row 9: Vận chuyển đường + Giá trị hàng hoá */}
        <div className="grid grid-cols-2 gap-4">
          {/* Vận chuyển đường (left) */}
          <div className="space-y-2">
            <Label>Vận chuyển</Label>
            <RadioGroup
              value={options.transport || 'fly'}
              onValueChange={(value) => handleInputChange('transport', value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="road" id="road" />
                <Label htmlFor="road" className="font-normal cursor-pointer">Đường bộ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fly" id="fly" />
                <Label htmlFor="fly" className="font-normal cursor-pointer">Đường bay</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Giá trị hàng hoá (right) */}
          <div className="space-y-2">
            <Label>Giá trị hàng hoá</Label>
            <CurrencyInput 
              value={options.orderValue || 0} 
              onChange={(value) => {
                if (value > 20000000) {
                  toast.warning('⚠️ GHTK Express giới hạn 20 triệu', {
                    description: 'Giá trị hàng hoá tối đa 20.000.000đ cho gói Express'
                  });
                }
                handleInputChange('orderValue', value);
              }}
              placeholder="Tổng giá trị đơn hàng"
            />
            {options.orderValue && options.orderValue > 20000000 && (
              <p className="text-xs text-red-600">
                ❌ GHTK Express chỉ hỗ trợ giá trị hàng hoá tối đa 20.000.000đ
              </p>
            )}
            {options.orderValue && options.orderValue < 1 && (
              <p className="text-xs text-red-600">
                ❌ Giá trị hàng hoá phải lớn hơn 0đ
              </p>
            )}
          </div>
        </div>

        {/* ✅ GHTK Tags - Dịch vụ cộng thêm (chỉ dùng khi tạo đơn, không ảnh hưởng tính phí) */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Dịch vụ cộng thêm</Label>
          <div className="grid grid-cols-2 gap-3">
            {/* Tag 1: Hàng dễ vỡ - DISABLED: Not supported in GHTK Express */}
            {/* <div className="flex items-center space-x-2">
              <Checkbox 
                id="tag-1"
                checked={options.ghtkTags?.includes(1)}
                onCheckedChange={(checked) => {
                  const currentTags = options.ghtkTags || [];
                  const newTags = checked 
                    ? [...currentTags, 1]
                    : currentTags.filter(t => t !== 1);
                  handleInputChange('ghtkTags', newTags);
                }}
              />
              <Label htmlFor="tag-1" className="text-sm font-normal cursor-pointer">
                Hàng dễ vỡ
              </Label>
            </div> */}

            {/* Tag 6: Nông sản/thực phẩm khô - DISABLED: Not supported in GHTK Express */}
            {/* <div className="flex items-center space-x-2">
              <Checkbox 
                id="tag-6"
                checked={options.ghtkTags?.includes(6)}
                onCheckedChange={(checked) => {
                  const currentTags = options.ghtkTags || [];
                  const newTags = checked 
                    ? [...currentTags, 6]
                    : currentTags.filter(t => t !== 6);
                  handleInputChange('ghtkTags', newTags);
                }}
              />
              <Label htmlFor="tag-6" className="text-sm font-normal cursor-pointer">
                Nông sản/thực phẩm khô
              </Label>
            </div> */}

            {/* Tag 7: Đóng kiểm - DISABLED: Causes "Thực phẩm" error in Express */}
            {/* <div className="flex items-center space-x-2">
              <Checkbox 
                id="tag-7"
                checked={options.ghtkTags?.includes(7)}
                onCheckedChange={(checked) => {
                  const currentTags = options.ghtkTags || [];
                  const newTags = checked 
                    ? [...currentTags, 7]
                    : currentTags.filter(t => t !== 7);
                  handleInputChange('ghtkTags', newTags);
                }}
              />
              <Label htmlFor="tag-7" className="text-sm font-normal cursor-pointer">
                Đóng kiểm
              </Label>
            </div> */}

            {/* Tag 8: Hàng không xếp chồng - DISABLED: May cause "Thực phẩm" error */}
            {/* <div className="flex items-center space-x-2">
              <Checkbox 
                id="tag-8"
                checked={options.ghtkTags?.includes(8)}
                onCheckedChange={(checked) => {
                  const currentTags = options.ghtkTags || [];
                  const newTags = checked 
                    ? [...currentTags, 8]
                    : currentTags.filter(t => t !== 8);
                  handleInputChange('ghtkTags', newTags);
                }}
              />
              <Label htmlFor="tag-8" className="text-sm font-normal cursor-pointer">
                Hàng không xếp chồng
              </Label>
            </div> */}

            {/* Tag 10: Cho xem hàng */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="tag-10"
                checked={options.ghtkTags?.includes(10)}
                onCheckedChange={(checked) => {
                  const currentTags = options.ghtkTags || [];
                  const newTags = checked 
                    ? [...currentTags, 10]
                    : currentTags.filter(t => t !== 10);
                  handleInputChange('ghtkTags', newTags);
                }}
              />
              <Label htmlFor="tag-10" className="text-sm font-normal cursor-pointer">
                Cho xem hàng
              </Label>
            </div>

            {/* Tag 13: Gọi shop khi gặp vấn đề - DISABLED: Not supported in GHTK Express */}
            {/* <div className="flex items-center space-x-2">
              <Checkbox 
                id="tag-13"
                checked={options.ghtkTags?.includes(13)}
                onCheckedChange={(checked) => {
                  const currentTags = options.ghtkTags || [];
                  const newTags = checked 
                    ? [...currentTags, 13]
                    : currentTags.filter(t => t !== 13);
                  handleInputChange('ghtkTags', newTags);
                }}
              />
              <Label htmlFor="tag-13" className="text-sm font-normal cursor-pointer">
                Gọi shop khi gặp vấn đề
              </Label>
            </div> */}

            {/* Tag 17: Giao 1 phần chọn sản phẩm */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="tag-17"
                checked={options.ghtkTags?.includes(17)}
                onCheckedChange={(checked) => {
                  const currentTags = options.ghtkTags || [];
                  const newTags = checked 
                    ? [...currentTags, 17]
                    : currentTags.filter(t => t !== 17);
                  handleInputChange('ghtkTags', newTags);
                }}
              />
              <Label htmlFor="tag-17" className="text-sm font-normal cursor-pointer">
                Giao 1 phần chọn sản phẩm
              </Label>
            </div>

            {/* Tag 18: Giao 1 phần đổi trả hàng */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="tag-18"
                checked={options.ghtkTags?.includes(18)}
                onCheckedChange={(checked) => {
                  const currentTags = options.ghtkTags || [];
                  const newTags = checked 
                    ? [...currentTags, 18]
                    : currentTags.filter(t => t !== 18);
                  handleInputChange('ghtkTags', newTags);
                }}
              />
              <Label htmlFor="tag-18" className="text-sm font-normal cursor-pointer">
                Giao 1 phần đổi trả hàng
              </Label>
            </div>

            {/* Tag 19: Không giao được thu phí */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="tag-19"
                checked={options.ghtkTags?.includes(19)}
                onCheckedChange={(checked) => {
                  const currentTags = options.ghtkTags || [];
                  const newTags = checked 
                    ? [...currentTags, 19]
                    : currentTags.filter(t => t !== 19);
                  handleInputChange('ghtkTags', newTags);
                  
                  // ✅ Auto-fill failedDeliveryFee when checking tag 19
                  if (checked) {
                    // Default = Phí ship + 50% (theo GHTK docs: phí ship + 50% phí ship cho hàng trả)
                    const shippingFee = service.fee || 0;
                    const defaultFee = Math.round(shippingFee * 1.5); // Phí ship + 50%
                    
                    // Clamp to GHTK limits: 10k - 20tr
                    const clampedFee = Math.max(10000, Math.min(20000000, defaultFee));
                    
                    console.log('💰 [Tag 19] Auto-fill failed delivery fee:', {
                      shippingFee,
                      defaultFee,
                      clampedFee,
                      meetsGHTKRequirement: clampedFee >= 10000 && clampedFee <= 20000000
                    });
                    
                    // ⚠️ Warn if fee is at minimum
                    if (clampedFee === 10000 && defaultFee < 10000) {
                      console.warn('⚠️ Phí ship quá thấp, đã tự động tăng lên 10.000đ (tối thiểu GHTK)');
                    }
                    
                    handleInputChange('failedDeliveryFee', clampedFee);
                  } else {
                    // Reset when unchecking
                    handleInputChange('failedDeliveryFee', undefined);
                  }
                }}
              />
              <Label htmlFor="tag-19" className="text-sm font-normal cursor-pointer">
                Thu tiền khi không giao được
              </Label>
            </div>

            {/* Tag 62: Thu hồi chứng từ - DISABLED: Not supported in GHTK Express */}
            {/* <div className="flex items-center space-x-2">
              <Checkbox 
                id="tag-62"
                checked={options.ghtkTags?.includes(62)}
                onCheckedChange={(checked) => {
                  const currentTags = options.ghtkTags || [];
                  const newTags = checked 
                    ? [...currentTags, 62]
                    : currentTags.filter(t => t !== 62);
                  handleInputChange('ghtkTags', newTags);
                }}
              />
              <Label htmlFor="tag-62" className="text-sm font-normal cursor-pointer">
                Thu hồi chứng từ
              </Label>
            </div> */}
          </div>
        </div>

        {/* ✅ Input số tiền thu khi không giao được (hiện khi tick tag 19) */}
        {options.ghtkTags?.includes(19) && (
          <div className="space-y-2 p-4 border border-amber-200 bg-amber-50 rounded-md">
            <Label htmlFor="failedDeliveryFee" className="text-sm font-semibold text-amber-900">
              Số tiền thu khi không giao được
            </Label>
            <p className="text-xs text-amber-700 mb-2">
              💡 Mặc định = Phí ship + 50% ({((service.fee || 0) * 1.5).toLocaleString('vi-VN')}đ)<br/>
              ⚠️ GHTK giới hạn: Tối thiểu 10.000đ, tối đa 20.000.000đ<br/>
              📌 Lưu ý: Tài khoản GHTK phải được cấu hình "Chính sách giao hàng" để dùng tính năng này
            </p>
            <CurrencyInput 
              id="failedDeliveryFee"
              value={options.failedDeliveryFee || 0} 
              onChange={(value) => {
                // Validate giới hạn GHTK
                if (value < 10000 || value > 20000000) {
                  console.warn('⚠️ Số tiền phải từ 10.000đ đến 20.000.000đ');
                }
                handleInputChange('failedDeliveryFee', value);
              }}
              placeholder="Nhập số tiền..."
            />
            {options.failedDeliveryFee && (options.failedDeliveryFee < 10000 || options.failedDeliveryFee > 20000000) && (
              <p className="text-xs text-red-600">
                ❌ Số tiền phải từ 10.000đ đến 20.000.000đ
              </p>
            )}
          </div>
        )}

        {/* Phí trả đối tác vận chuyển */}
        <div className="pt-3 border-t">
          <div className="flex justify-between items-center">
            <Label>Phí trả đối tác vận chuyển</Label>
            <span className="font-semibold text-lg">{service.fee?.toLocaleString('vi-VN') || 0}đ</span>
          </div>
        </div>
        </div>

        {/* ✅ Reuse AddressFormDialog for return address - Hide default switches */}
        <AddressFormDialog
          isOpen={openReturnAddressDialog}
          onOpenChange={(open) => {
            setOpenReturnAddressDialog(open);
            if (!open) setReturnAddressData(null); // Clear data on close
          }}
          onSave={handleSaveReturnAddress}
          editingAddress={returnAddressData}
          hideDefaultSwitches={true} // ✅ Hide "Đặt làm mặc định" switches
          title="📦 Địa chỉ trả hàng" // ✅ Custom title
          description="Khi khách không nhận hàng, sẽ trả về địa chỉ này" // ✅ Custom description
        />
      </React.Fragment>
    );
  }

  // Render GHN form
  if (service.partnerCode === 'GHN') {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2">Cấu hình vận chuyển</h3>
        
        <div className="space-y-2">
          <Label>Gói dịch vụ</Label>
          <Input value={service.serviceName} disabled className="bg-muted" />
        </div>

        {/* GHN specific fields */}
        <div className="space-y-2">
          <Label>Kho lấy hàng</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Chọn kho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kho1">Kho 1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Hình thức lấy hàng</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Lấy hàng tại kho hàng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="warehouse">Lấy hàng tại kho hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Người trả phí */}
        <div className="space-y-2">
          <Label>Người trả phí</Label>
          <RadioGroup
            value={options.payer || 'SHOP'}
            onValueChange={(value) => handleInputChange('payer', value)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="SHOP" id="ghn-shop" />
              <Label htmlFor="ghn-shop" className="font-normal cursor-pointer">Shop trả</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="CUSTOMER" id="ghn-customer" />
              <Label htmlFor="ghn-customer" className="font-normal cursor-pointer">Khách trả</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="ghn-insurance" />
              <Label htmlFor="ghn-insurance" className="text-sm font-normal cursor-pointer">
                Giao thất bại - thu tiền
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="ghn-partial" />
              <Label htmlFor="ghn-partial" className="text-sm font-normal cursor-pointer">
                Giao hàng 1 phần
              </Label>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <Label>Phí trả đối tác vận chuyển</Label>
            <span className="font-semibold text-lg">{service.fee?.toLocaleString('vi-VN') || 0}đ</span>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Cấu hình vận chuyển</h3>
      <p className="text-sm text-muted-foreground">Cấu hình cho {service.partnerName}</p>
    </div>
  );
}
