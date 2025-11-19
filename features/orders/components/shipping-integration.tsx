import * as React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { DeliveryMethodCard } from './shipping/delivery-method-card';
import { DeliveryAddressCard } from './shipping/delivery-address-card';
import { PackageInfoCard } from './shipping/package-info-card';
import { useDebounce } from '../hooks/use-debounce';
import { GHTKService, type GHTKCreateOrderParams } from '../../settings/shipping/integrations/ghtk-service';
import { useShippingPartnerStore } from '../../settings/shipping/store';
import { loadShippingConfig } from '../../../lib/utils/shipping-config-migration';
import { getGHTKCredentials } from '../../../lib/utils/get-shipping-credentials'; // ✅ Import helper
import { toast } from 'sonner';
import type { 
  DeliveryMethod, 
  ShippingCalculationRequest, 
  ShippingService,
  SelectedShippingConfig,
  ShippingAddress,
  PackageInfo
} from './shipping/types';
import type { OrderFormValues } from '../order-form-page';
import { useShippingSettingsStore } from '../../settings/shipping/shipping-settings-store';
import { useProductStore } from '../../products/store';
import { useProvinceStore } from '../../settings/provinces/store';
import { useBranchStore } from '../../settings/branches/store';
import { useOrderStore } from '../store'; // ✅ Import order store
import { asSystemId } from '@/lib/id-types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Loader2, PackageCheck } from 'lucide-react';

/**
 * Generate unique order ID for shipping partner
 * Format: DH + YYMMDD + random 5 digits
 * Example: DH2511021A3F7
 */
function generateShippingOrderId(): string {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2); // Last 2 digits
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // Generate random 5-character alphanumeric string (uppercase)
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomStr = '';
  for (let i = 0; i < 5; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `DH${year}${month}${day}${randomStr}`;
}

/**
 * ✅ Helper: Calculate and distribute product weights
 * Handles 3 cases:
 * 1. User entered weight = 0 & products have no weight → Use default 500g per item
 * 2. User entered weight > 0 → Distribute proportionally to products
 * 3. Products have weight → Use product weights
 */
function calculateProductWeights(
  lineItems: any[],
  findProductById: (id: string) => any,
  userEnteredWeight: number
): Array<{ name: string; weight: number; quantity: number; price: number; productCode: string }> {
  // Build initial products list with weights from database
  const products = lineItems.map(item => {
    const product = findProductById(item.productSystemId);
    const weightInGram = (product?.weight || 0) * item.quantity;
    return {
      name: item.productName,
      weight: weightInGram,
      quantity: item.quantity,
      price: item.unitPrice,
      productCode: item.productId,
    };
  });

  // Case 1: No user weight & no product weights → Default 500g per item
  if (userEnteredWeight === 0) {
    const totalProductWeight = products.reduce((sum, p) => sum + p.weight, 0);
    
    if (totalProductWeight === 0) {
      const defaultWeightPerItem = 500; // 500g default
      products.forEach(p => {
        p.weight = defaultWeightPerItem * p.quantity;
      });
    }
    // else: Use product weights as-is
  } 
  // Case 2: User entered weight → Distribute proportionally
  else {
    const totalProductWeight = products.reduce((sum, p) => sum + p.weight, 0);
    
    if (totalProductWeight > 0) {
      // Distribute proportionally based on product weights
      products.forEach(p => {
        p.weight = Math.round((p.weight / totalProductWeight) * userEnteredWeight);
      });
    } else {
      // No product weights, distribute evenly
      const weightPerProduct = Math.round(userEnteredWeight / products.length);
      products.forEach(p => {
        p.weight = weightPerProduct * p.quantity;
      });
    }
  }

  return products;
}

/**
 * ✅ Helper: Build pickup address params based on pickAddressId
 * 
 * GHTK REAL API Behavior (tested):
 * - pick_address_id = ID kho GHTK
 * - EVEN WITH pick_address_id, GHTK STILL REQUIRES:
 *   ✅ pick_name (sender name) - MANDATORY!
 *   ✅ pick_tel (sender phone) - MANDATORY!
 * - Do NOT send pick_province/pick_district/pick_ward when using pick_address_id
 */
function buildPickupParams(
  hasPickAddressId: boolean,
  pickAddressId: string | undefined,
  currentBranch: any,
  pickupAddress: any
) {
  // ⚠️ Removed excessive console.log to prevent infinite loop in useMemo
  // Only log once when actually submitting order (see ghtk-service.ts for detailed logs)
  
  if (hasPickAddressId && pickAddressId) {
    // ⚠️ GHTK requires BOTH pick_address_id AND detailed address fields
    // Even with warehouse ID, we still need to send full address
    return {
      pickAddressId,
      pickName: currentBranch.name || pickupAddress.name,
      pickAddress: pickupAddress.address || currentBranch.address || '', // ✅ REQUIRED!
      pickProvince: pickupAddress.province || '', // ✅ REQUIRED!
      pickDistrict: pickupAddress.district || '', // ✅ REQUIRED!
      pickWard: pickupAddress.ward || '',
      pickTel: currentBranch.phone || pickupAddress.phone || '',
    };
  } else {
    // ✅ Send full manual pickup address
    return {
      pickName: currentBranch.name,
      pickAddress: pickupAddress.address,
      pickProvince: pickupAddress.province,
      pickDistrict: pickupAddress.district || '',
      pickWard: pickupAddress.ward || '',
      pickTel: currentBranch.phone || '',
    };
  }
}

/**
 * ✅ Helper: Build customer address params
 */
function buildCustomerParams(
  customerAddress: any,
  specificAddress?: string
) {
  return {
    customerName: customerAddress.name,
    customerAddress: customerAddress.address || '',
    customerProvince: customerAddress.province,
    customerDistrict: customerAddress.district || '',
    customerWard: customerAddress.ward,
    customerTel: customerAddress.phone,
    customerHamlet: specificAddress || 'Khác',
  };
}

/**
 * ✅ Helper: Build return address params (conditional)
 */
function buildReturnAddressParams(
  useReturnAddress: number | undefined,
  returnConfig: any
) {
  if (useReturnAddress === 1 && returnConfig?.returnName) {
    return {
      useReturnAddress: 1,
      returnName: returnConfig.returnName,
      returnAddress: returnConfig.returnAddress,
      returnProvince: returnConfig.returnProvince,
      returnDistrict: returnConfig.returnDistrict,
      returnWard: returnConfig.returnWard,
      returnStreet: returnConfig.returnStreet,
      returnTel: returnConfig.returnTel,
      returnEmail: returnConfig.returnEmail,
    };
  } else {
    return { useReturnAddress: 0 };
  }
}

interface ShippingIntegrationProps {
  disabled?: boolean;
  onChangeDeliveryAddress?: () => void; // ✅ Add callback for opening edit address dialog
  hideTabs?: boolean; // ✅ Hide tabs and only show shipping-partner content
  customer?: any; // ✅ Optional customer prop (if not provided, will watch from form)
}

/**
 * Main shipping integration component
 * Replaces the old PackagingAndDelivery component
 */
export function ShippingIntegration({ disabled, onChangeDeliveryAddress, hideTabs, customer: customerProp }: ShippingIntegrationProps) {
  const { control, setValue, getValues } = useFormContext<OrderFormValues>();
  const { settings: shippingSettings } = useShippingSettingsStore();
  const { findById: findProductByIdBase } = useProductStore();
  const { data: provinces, getWardsByProvinceId } = useProvinceStore();
  const { findById: findBranchByIdBase } = useBranchStore();
  const { data: partners } = useShippingPartnerStore();
  const { data: allOrders } = useOrderStore(); // ✅ Get all orders for ID generation

  const findProductById = React.useCallback(
    (id?: string | null) => {
      if (!id || id.trim().length === 0) return undefined;
      return findProductByIdBase(asSystemId(id));
    },
    [findProductByIdBase]
  );

  const findBranchById = React.useCallback(
    (id?: string | null) => {
      if (!id || id.trim().length === 0) return undefined;
      return findBranchByIdBase(asSystemId(id));
    },
    [findBranchByIdBase]
  );

  // ✅ PHASE 2: Convert watch to useWatch for better performance
  // Use customer from props if provided, otherwise watch from form
  const customerFromForm = useWatch({ control, name: 'customer' });
  const customer = customerProp !== undefined ? customerProp : customerFromForm;
  const watchedBranchSystemId = useWatch({ control, name: 'branchSystemId' }) as string | undefined;
  const branchSystemId = React.useMemo(() => {
    if (!watchedBranchSystemId || watchedBranchSystemId.trim().length === 0) return undefined;
    return asSystemId(watchedBranchSystemId);
  }, [watchedBranchSystemId]);
  const lineItems = useWatch({ control, name: 'lineItems' });
  const grandTotal = useWatch({ control, name: 'grandTotal' });
  const payments = useWatch({ control, name: 'payments' }) || [];
  const deliveryMethod = useWatch({ control, name: 'deliveryMethod' }) as DeliveryMethod || 'deliver-later';
  const trackingCode = useWatch({ control, name: 'trackingCode' });
  const configuration = useWatch({ control, name: 'configuration' }); // ✅ Watch configuration for tags, transport, dates
  const shippingNote = useWatch({ control, name: 'shippingNote' }); // ✅ Watch shipping note
  const formWeight = useWatch({ control, name: 'weight' }); // ✅ Watch weight from form
  const formShippingAddress = useWatch({ control, name: 'shippingAddress' }); // ✅ Watch selected shipping address
  
  // Watch customer address fields specifically to trigger recalculation
  const customerProvince = customer?.shippingAddress_province;
  const customerDistrict = customer?.shippingAddress_ward;
  const customerStreet = customer?.shippingAddress_street;

  // State for shipping
  const [selectedService, setSelectedService] = React.useState<ShippingService | null>(null);
  const [shippingConfig, setShippingConfig] = React.useState<SelectedShippingConfig | null>(null);
  const [editingPackage, setEditingPackage] = React.useState(false);
  const [creatingShipment, setCreatingShipment] = React.useState(false);
  const [serviceOptions, setServiceOptions] = React.useState<Partial<SelectedShippingConfig['options']>>({}); // ✅ Track service options for recalculation
  const [lastApiParams, setLastApiParams] = React.useState<any>(null); // ✅ Store last API params for preview
  
  // State for editable package info
  const [customWeight, setCustomWeight] = React.useState<number | null>(null);
  const [customLength, setCustomLength] = React.useState<number | null>(null);
  const [customWidth, setCustomWidth] = React.useState<number | null>(null);
  const [customHeight, setCustomHeight] = React.useState<number | null>(null);
  const [customCodAmount, setCustomCodAmount] = React.useState<number | null>(null);

  // Calculate total paid
  const totalPaid = React.useMemo(() => 
    payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    [payments]
  );

  // Calculate COD amount
  const codAmount = React.useMemo(() => 
    Math.max(0, grandTotal - totalPaid),
    [grandTotal, totalPaid]
  );

  // Calculate total weight from line items
  const totalWeight = React.useMemo(() => {
    if (shippingSettings.weightSource === 'product' && lineItems) {
      // ⚠️ Removed console.log to prevent infinite loop spam
      
      let hasProductWithoutWeight = false;
      const total = lineItems.reduce((sum, item) => {
        const product = findProductById(item.productSystemId);
        
        if (!product || !product.weight) {
          hasProductWithoutWeight = true;
          return sum;
        }
        const weightInGrams = product.weightUnit === 'kg' ? product.weight * 1000 : product.weight;
        return sum + (weightInGrams * item.quantity);
      }, 0);
      
      return total;
    }
    // Return custom weight (no conversion, use as-is with unit from shippingSettings)
    return shippingSettings.customWeight || 0;
  }, [shippingSettings.weightSource, shippingSettings.customWeight, lineItems, findProductById]);

  // Debounce weight to avoid excessive recalculations
  const debouncedWeight = useDebounce(totalWeight, 300);

  // ✅ PHASE 3: Auto-fill weight into form field when delivery method is shipping-partner
  React.useEffect(() => {
    if (deliveryMethod === 'shipping-partner') {
      // Only auto-fill if:
      // 1. totalWeight changed (from products)
      // 2. User hasn't manually entered a weight (customWeight is null)
      // 3. totalWeight is valid (> 0)
      if (!customWeight && totalWeight > 0) {
        const roundedWeight = Math.round(totalWeight);
        setValue('weight', roundedWeight);
        // ⚠️ Removed console.log
      }
    }
  }, [deliveryMethod, totalWeight, customWeight, formWeight, setValue]);

  // Get customer shipping address
  const customerAddress: ShippingAddress | null = React.useMemo(() => {
    // Removed console.log with potential circular references
    
    if (!customer) {
      console.warn('⚠️ [Customer Address] No customer');
      return null;
    }

    // ✅ PRIORITY 1: Get from form's selected shippingAddress field (user can change this)
    if (formShippingAddress) {
      const shippingAddr = formShippingAddress;
      // console.log('🔍 [Customer Address] Checking formShippingAddress:', shippingAddr); // Removed
      
      if (shippingAddr.province) {
        const province = provinces.find(p => p.name === shippingAddr.province);
        if (province) {
          const result = {
            name: customer.name,
            phone: customer.phone,
            address: shippingAddr.street || '',
            province: shippingAddr.province,
            provinceId: parseInt(province.id),
            district: shippingAddr.district || '',
            districtId: shippingAddr.districtId || 0,
            ward: shippingAddr.ward || '',
            wardCode: shippingAddr.wardCode
          };
          // console.log('✅ [Customer Address] From form shippingAddress field:', result); // Removed
          return result;
        } else {
          console.warn('⚠️ [Customer Address] Province not found in provinces list:', shippingAddr.province);
        }
      } else {
        console.warn('⚠️ [Customer Address] formShippingAddress has no province field');
      }
    }

    // ✅ PRIORITY 2: Try to get from addresses array (default shipping address)
    if (customer.addresses && customer.addresses.length > 0) {
      // Find default shipping address or first address
      const shippingAddr = customer.addresses.find(addr => addr.isDefaultShipping) || customer.addresses[0];
      
      if (shippingAddr.province) {
        const province = provinces.find(p => p.name === shippingAddr.province);
        if (province) {
          const result = {
            name: customer.name,
            phone: customer.phone,
            address: shippingAddr.street || '',
            province: shippingAddr.province,
            provinceId: parseInt(province.id),
            district: shippingAddr.district || '',
            districtId: shippingAddr.districtId || 0,
            ward: shippingAddr.ward || '',
            wardCode: shippingAddr.wardCode
          };
          // ⚠️ Removed console.log
          return result;
        }
      }
    }

    // PRIORITY 3: Fallback to legacy fields
    if (!customer.shippingAddress_province) {
      return null;
    }

    // Find province and district
    const province = provinces.find(p => p.name === customer.shippingAddress_province);
    if (!province) {
      return null;
    }

    const wards = getWardsByProvinceId(province.id);
    const ward = wards.find(w => w.name === customer.shippingAddress_ward);

    const result = {
      name: customer.name,
      phone: customer.phone,
      address: customer.shippingAddress_street || '',
      province: province.name,
      provinceId: parseInt(province.id),
      district: customer.shippingAddress_ward || '', // FIXME: Need district separate field
      districtId: 0, // FIXME: Need district ID mapping
      ward: customer.shippingAddress_ward,
      wardCode: ward?.id
    };
    // ⚠️ Removed console.log
    return result;
  }, [
    customer, 
    formShippingAddress,
    // ✅ CRITICAL: Add specific fields to trigger recalculation when address changes
    formShippingAddress?.province,
    formShippingAddress?.district,
    formShippingAddress?.ward,
    formShippingAddress?.street,
    formShippingAddress?.id,
    formShippingAddress?.provinceId,
    formShippingAddress?.districtId,
    formShippingAddress?.wardId,
    formShippingAddress?.wardCode,
    // ✅ SUPER CRITICAL: Stringify entire object to catch ALL changes
    JSON.stringify(formShippingAddress),
    provinces, 
    getWardsByProvinceId, 
    customerProvince, 
    customerDistrict, 
    customerStreet
  ]);

  // ✅ Auto-set default shipping address to form when customer changes
  React.useEffect(() => {
    if (customer && customer.addresses && customer.addresses.length > 0 && !formShippingAddress) {
      const defaultShipping = customer.addresses.find(addr => addr.isDefaultShipping) || customer.addresses[0];
      if (defaultShipping) {
        // console.log('🔄 [Auto-set] Setting default shipping address to form:', defaultShipping); // Removed
        setValue('shippingAddress', defaultShipping);
      }
    }
  }, [customer, formShippingAddress, setValue]);

  // Get branch pickup address
  const pickupAddress: ShippingAddress | null = React.useMemo(() => {
    if (!branchSystemId) {
      return null;
    }

    // ✅ V2: Load shipping config (multi-account structure)
    const shippingConfig = loadShippingConfig();

    // ✅ V2: Get default GHTK account
    const ghtkData = shippingConfig.partners.GHTK;
    if (!ghtkData || !ghtkData.accounts || ghtkData.accounts.length === 0) {
      return null;
    }

    const defaultAccount = ghtkData.accounts.find(a => a.isDefault && a.active)
      || ghtkData.accounts.find(a => a.active)
      || ghtkData.accounts[0];

    if (!defaultAccount || !defaultAccount.active) {
      return null;
    }

    
    // ✅ Store default settings for fee calculation
    if (defaultAccount.defaultSettings) {
      (window as any).__ghtkDefaultSettings = defaultAccount.defaultSettings;
    }

    // ✅ V2: Find pickup address for this branch
    const pickupAddr = defaultAccount.pickupAddresses?.find(p => p.sapoBranchId === branchSystemId);
    
    if (pickupAddr) {
      const result = {
        name: pickupAddr.partnerWarehouseName,
        phone: pickupAddr.partnerWarehouseTel || '',
        address: pickupAddr.partnerWarehouseAddress,
        province: pickupAddr.partnerWarehouseProvince,
        provinceId: 1, // Placeholder
        district: pickupAddr.partnerWarehouseDistrict,
        districtId: 1, // Placeholder
        ward: pickupAddr.partnerWarehouseWard || '',
        wardCode: pickupAddr.partnerWarehouseId || '', // GHTK warehouse ID
      };
      return result;
    }

    // ⚠️ No pickup address mapped - Show warning and return null to disable shipping
    const branch = findBranchById(branchSystemId);
    if (!branch) {
      return null;
    }

    console.warn('[ShippingIntegration] No pickup address mapped for branch:', branch.name);
    toast.warning('Chưa cấu hình địa chỉ lấy hàng', {
      description: `Chi nhánh "${branch.name}" chưa được ánh xạ với kho GHTK. Vui lòng cấu hình trong Cài đặt → Đối tác vận chuyển.`,
      duration: 6000,
    });
    
    return null; // Disable shipping partner selection
  }, [branchSystemId, findBranchById]);

  // ✅ TASK 5: Preload address details when switching to shipping tab
  React.useEffect(() => {
    if (deliveryMethod === 'shipping-partner') {
      // Removed console.log with potential circular references
      
      // The actual address loading is handled by useMemo (customerAddress, pickupAddress)
      // This useEffect just logs that we're switching and the address is being computed
      // If customer or branch changes while on shipping tab, the useMemo will auto-recompute
      
      if (!customer) {
        toast.warning('Chưa có thông tin khách hàng', {
          description: 'Vui lòng nhập thông tin khách hàng trước khi chọn vận chuyển',
          duration: 4000
        });
      } else if (!branchSystemId) {
        toast.warning('Chưa chọn chi nhánh', {
          description: 'Vui lòng chọn chi nhánh lấy hàng',
          duration: 4000
        });
      } else {
        console.log('✅ [Address Preload] Customer address and branch loaded successfully');
        // Show success toast when address is fully loaded
        if (customerProvince && customerDistrict && pickupAddress) {
          toast.success('Đã tải thông tin địa chỉ', {
            description: `Khách: ${customerProvince}, ${customerDistrict} | Lấy hàng: ${pickupAddress.province}`,
            duration: 3000
          });
        }
      }
    }
  }, [deliveryMethod, customer, branchSystemId, customerProvince, customerDistrict, customerStreet, pickupAddress]);

  // Package info (use debounced weight for stability, allow manual override)
  const packageInfo: PackageInfo = React.useMemo(() => {
    // ✅ Use weight from form field (already auto-filled by useEffect)
    // This avoids timing issues with debounced totalWeight
    const finalWeight = formWeight ?? customWeight ?? Math.round(totalWeight);
    
    // ⚠️ Removed console.log to prevent spam
    
    const result = {
      weight: finalWeight,
      weightUnit: shippingSettings.weightUnit || 'gram',
      length: customLength ?? (shippingSettings.length || 10),
      width: customWidth ?? (shippingSettings.width || 10),
      height: customHeight ?? (shippingSettings.height || 10),
      codAmount: customCodAmount ?? codAmount,
      insuranceValue: grandTotal
    };
    
    return result;
  }, [formWeight, totalWeight, codAmount, grandTotal, shippingSettings.weightUnit, shippingSettings.length, shippingSettings.width, shippingSettings.height, customWeight, customLength, customWidth, customHeight, customCodAmount]);

  // ✅ Build shipping calculation request with auto-recalculation
  const shippingRequest: ShippingCalculationRequest | null = React.useMemo(() => {
    // Removed console.log with potential circular references
    
    if (!pickupAddress || !customerAddress) {
      console.warn('⚠️ [Shipping Request] Missing address:', {
        pickupAddress: !!pickupAddress,
        customerAddress: !!customerAddress
      });
      return null;
    }
    
    if (packageInfo.weight <= 0) {
      console.warn('⚠️ [Shipping Request] Invalid weight:', packageInfo.weight);
      return null;
    }
    
    const ghtkDefaults = (window as any).__ghtkDefaultSettings || {};

    const result = {
      fromProvinceId: pickupAddress.provinceId,
      fromDistrictId: pickupAddress.districtId,
      fromWardCode: pickupAddress.wardCode,
      fromAddress: pickupAddress.address,
      fromProvince: pickupAddress.province,
      fromDistrict: pickupAddress.district,
      toProvinceId: customerAddress.provinceId,
      toDistrictId: customerAddress.districtId,
      toWardCode: customerAddress.wardCode,
      toWard: customerAddress.ward, // ✅ Ward name for 2-level address
      toAddress: customerAddress.address,
      toProvince: customerAddress.province,
      toDistrict: customerAddress.district,
      weight: packageInfo.weight,
      length: packageInfo.length,
      width: packageInfo.width,
      height: packageInfo.height,
      codAmount: packageInfo.codAmount,
      insuranceValue: packageInfo.insuranceValue,
      options: {
        transport: serviceOptions.transport || ghtkDefaults.transport || 'road',
        tags: serviceOptions.tags || ghtkDefaults.tags || [],
        deliverWorkShift: serviceOptions.deliverWorkShift || ghtkDefaults.deliverWorkShift || 1,
        pickWorkShift: serviceOptions.pickWorkShift || ghtkDefaults.pickWorkShift || 1,
        orderValue: serviceOptions.orderValue || grandTotal || 0,
        pickAddressId: serviceOptions.pickAddressId,
      }
    };
    
    // Removed console.log - only log essential info
    console.log('✅ [Shipping Request] Built request with weight:', result.weight, 'g');
    
    return result;
  }, [
    pickupAddress, 
    customerAddress, 
    // ✅ CRITICAL: Add specific address fields to trigger recalculation when address changes
    customerAddress?.province,
    customerAddress?.district,
    customerAddress?.provinceId,
    customerAddress?.districtId,
    customerAddress?.wardCode,
    packageInfo.weight,
    packageInfo.codAmount,
    packageInfo.length,
    packageInfo.width,
    packageInfo.height,
    packageInfo.insuranceValue,
    grandTotal,
    serviceOptions.transport,
    JSON.stringify(serviceOptions.tags || []),
    serviceOptions.deliverWorkShift,
    serviceOptions.pickWorkShift,
    serviceOptions.orderValue,
    serviceOptions.pickAddressId,
  ]);

  // ✅ REMOVED: Don't reset service when address changes
  // Instead, let the shipping calculator hook automatically recalculate fees
  // and update the selected service's fee in place

  // Handle delivery method change - memoized with useCallback
  const handleMethodChange = React.useCallback((method: DeliveryMethod) => {
    setValue('deliveryMethod', method);
    
    // Reset shipping data when changing method
    if (method !== 'shipping-partner') {
      setSelectedService(null);
      setShippingConfig(null);
      setValue('shippingFee', 0);
      setValue('shippingPartnerId', '');
      setValue('shippingServiceId', '');
      setValue('trackingCode', ''); // ✅ Clear tracking code khi không dùng đối tác vận chuyển
    }
  }, [setValue]);

  // Handle service selection - memoized with useCallback
  const handleServiceSelect = React.useCallback((service: ShippingService) => {
    
    setSelectedService(service);
    
    // ✅ FIX: CHỈ lưu thông tin service, KHÔNG tự động set shippingFee
    // User phải click "Áp dụng" trong ServiceConfigForm mới set fee
    setValue('shippingPartnerId', service.partnerId);
    setValue('shippingServiceId', service.serviceId);
    
  }, [setValue]);

  // Handle config save - memoized with useCallback
  const handleConfigSave = React.useCallback((options: Partial<SelectedShippingConfig['options']>) => {
    if (!selectedService) return;


    const config: SelectedShippingConfig = {
      service: selectedService,
      weight: packageInfo.weight,
      dimensions: {
        length: packageInfo.length,
        width: packageInfo.width,
        height: packageInfo.height
      },
      pickupAddressId: branchSystemId,
      deliveryAddress: customerAddress!,
      options: options
    };

    setShippingConfig(config);
    
    // ✅ NOW set the shipping fee (when user confirms config)
    setValue('shippingFee', selectedService.fee);
    
    // Save to form
    setValue('codAmount', packageInfo.codAmount);
    setValue('weight', packageInfo.weight);
    setValue('length', packageInfo.length);
    setValue('width', packageInfo.width);
    setValue('height', packageInfo.height);
    setValue('payer', options.payer === 'CUSTOMER' ? 'Người nhận' : 'Người gửi');
    setValue('shippingNote', options.note || '');
    setValue('configuration', options);
    
  }, [selectedService, packageInfo, branchSystemId, customerAddress, setValue]);

  // Handle package info change - memoized with useCallback
  const handlePackageChange = React.useCallback((info: PackageInfo) => {
    setValue('weight', info.weight);
    setValue('length', info.length);
    setValue('width', info.width);
    setValue('height', info.height);
    setValue('codAmount', info.codAmount);
  }, [setValue]);

  // Handle package info change from DeliveryMethodCard
  const handlePackageInfoChange = React.useCallback((info: Partial<PackageInfo>) => {
    
    if (info.weight !== undefined) {
      setCustomWeight(info.weight);
      setValue('weight', info.weight); // ✅ Update form value so API params use updated weight
    }
    if (info.length !== undefined) {
      setCustomLength(info.length);
    }
    if (info.width !== undefined) {
      setCustomWidth(info.width);
    }
    if (info.height !== undefined) {
      setCustomHeight(info.height);
    }
    if (info.codAmount !== undefined) {
      setCustomCodAmount(info.codAmount);
    }
    
  }, [setValue]);

  // ✅ Update form value when user manually edits codAmount
  React.useEffect(() => {
    if (customCodAmount !== null) {
      console.log('💰 [ShippingIntegration] User edited COD amount:', {
        customCodAmount,
        autoCodAmount: codAmount,
        grandTotal,
        totalPaid
      });
      setValue('codAmount', customCodAmount);
    }
  }, [customCodAmount, setValue, codAmount, grandTotal, totalPaid]);

  // Handle service config change
  const handleServiceConfigChange = React.useCallback((config: Partial<SelectedShippingConfig['options']>) => {
    
    // Save config to form values
    const currentConfig = getValues('configuration');
    setValue('configuration', { 
      ...currentConfig, 
      ...config
      // Note: _ghtkPreviewParams will be added by useEffect below
    });
    
    // ✅ Update state to trigger recalculation
    setServiceOptions(prev => {
      const newOptions = { ...prev, ...config };
      return newOptions;
    });
  }, [setValue, getValues]);

  // Auto-update package info when values change
  React.useEffect(() => {
    if (deliveryMethod === 'shipping-partner') {
      // ✅ FIX: Only auto-update codAmount if user hasn't manually edited it
      // If customCodAmount is set, it means user manually edited the field
      if (customCodAmount === null) {
        console.log('💰 [ShippingIntegration] Auto-updating COD amount:', {
          autoCodAmount: codAmount,
          grandTotal,
          totalPaid
        });
        setValue('codAmount', codAmount);
      } else {
        console.log('💰 [ShippingIntegration] Skipping auto-update (user edited):', {
          customCodAmount,
          autoCodAmount: codAmount
        });
      }
      // ✅ Remove duplicate weight setValue - already handled above
      setValue('length', shippingSettings.length);
      setValue('width', shippingSettings.width);
      setValue('height', shippingSettings.height);
    }
  }, [deliveryMethod, codAmount, shippingSettings.length, shippingSettings.width, shippingSettings.height, setValue, customCodAmount, grandTotal, totalPaid]);

  // ⚠️ DEPRECATED - Đã thay thế bằng previewData (unified params)
  // Giữ lại để tương thích ngược, nhưng ưu tiên dùng previewData
  const previewParams = React.useMemo(() => {
    if (!selectedService || !customerAddress || !lineItems || lineItems.length === 0) {
      return null;
    }

    const formValues = getValues();
    const orderId = formValues.externalReference || 'DH' + Date.now().toString().slice(-8);
    const currentBranch = findBranchById(branchSystemId);
    
    if (!currentBranch || !pickupAddress) return null;

    // ✅ Use helper function to calculate product weights (DRY - Don't Repeat Yourself)
    const userEnteredWeight = packageInfo.weight || 0;
    const products = calculateProductWeights(lineItems, findProductById, userEnteredWeight);

    const params: any = {
      orderId: String(orderId),
      
      // ✅ Use helper functions to build params (DRY)
      ...buildPickupParams(
        !!formValues.configuration?.pickAddressId,
        formValues.configuration?.pickAddressId,
        currentBranch,
        pickupAddress
      ),
      
      ...buildCustomerParams(customerAddress, formValues.configuration?.specificAddress),
      
      ...buildReturnAddressParams(
        formValues.configuration?.useReturnAddress,
        formValues.configuration
      ),
      
      // Products
      products: products,
      
      // Payment
      pickMoney: packageInfo.codAmount || 0,
      value: formValues.configuration?.orderValue || 0,
      isFreeship: formValues.configuration?.payer === 'SHOP' ? 1 : 0, // ✅ Convert to 0/1
      failedDeliveryFee: formValues.configuration?.failedDeliveryFee, // ✅ Thêm field này
      
      // Package info
      weightOption: shippingSettings.weightUnit,
      totalWeight: products.reduce((sum, p) => sum + p.weight, 0), // ✅ Recalculate
      totalBox: lineItems.reduce((sum, item) => sum + item.quantity, 0), // ✅ Thêm totalBox
      
      // Dates & configuration
      pickDate: formValues.configuration?.pickDate,
      deliverDate: formValues.configuration?.deliverDate,
      pickWorkShift: formValues.configuration?.pickWorkShift,
      deliverWorkShift: formValues.configuration?.deliverWorkShift,
      transport: (formValues.configuration?.transport as 'road' | 'fly') || 'road',
      tags: (formValues.configuration?.ghtkTags as number[]) || [], // ✅ Tags cho GHTK
      note: shippingConfig?.options?.note, // ✅ Shipping note
    };

    return params;
  }, [
    selectedService,
    customerAddress,
    lineItems,
    packageInfo,
    branchSystemId,
    shippingConfig,
    configuration,
    shippingSettings.weightUnit,
    pickupAddress,
    findBranchById,
    findProductById,
    getValues
  ]);

  // Handle create shipment order
  const handleCreateShipment = React.useCallback(async () => {
    if (!selectedService || !shippingConfig || !customerAddress || !pickupAddress) {
      toast.error('Thiếu thông tin', { description: 'Vui lòng chọn dịch vụ vận chuyển và cấu hình đầy đủ' });
      return;
    }

    const formValues = getValues();
    
    // ✅ Comprehensive GHTK validation based on API documentation
    const validationErrors: string[] = [];
    
    // Required pickup fields
    if (!formValues.configuration?.pickAddressId) {
      if (!pickupAddress.name) validationErrors.push('Thiếu tên người liên hệ lấy hàng');
      if (!pickupAddress.address) validationErrors.push('Thiếu địa chỉ lấy hàng');
      if (!pickupAddress.province) validationErrors.push('Thiếu tỉnh/thành lấy hàng');
      // ✅ District is optional for 2-level address
      // if (!pickupAddress.district) validationErrors.push('Thiếu quận/huyện lấy hàng');
      if (!pickupAddress.phone) validationErrors.push('Thiếu số điện thoại lấy hàng');
    }
    
    // Required customer fields
    if (!customerAddress.name) validationErrors.push('Thiếu tên người nhận hàng');
    if (!customerAddress.address) validationErrors.push('Thiếu địa chỉ người nhận');
    if (!customerAddress.province) validationErrors.push('Thiếu tỉnh/thành người nhận');
    // ✅ District is optional for 2-level address (province + ward only)
    // if (!customerAddress.district) validationErrors.push('Thiếu quận/huyện người nhận');
    if (!customerAddress.ward) validationErrors.push('Thiếu phường/xã người nhận');
    if (!customerAddress.phone) validationErrors.push('Thiếu số điện thoại người nhận');
    
    // ✅ Validate return address if "Địa chỉ khác" selected
    if (formValues.configuration?.useReturnAddress === 1) {
      if (!formValues.configuration.returnName) validationErrors.push('Thiếu tên người nhận hàng trả');
      if (!formValues.configuration.returnAddress) validationErrors.push('Thiếu địa chỉ trả hàng');
      if (!formValues.configuration.returnProvince) validationErrors.push('Thiếu tỉnh/thành trả hàng');
      // ✅ District is optional for 2-level address
      // if (!formValues.configuration.returnDistrict) validationErrors.push('Thiếu quận/huyện trả hàng');
      if (!formValues.configuration.returnTel) validationErrors.push('Thiếu số điện thoại trả hàng');
    }
    
    // Required: hamlet OR street (GHTK API rule)
    const hasHamlet = customerAddress.address && customerAddress.address.toLowerCase().includes('thôn');
    const hasStreet = customerAddress.address && customerAddress.address.length > 0;
    if (!hasHamlet && !hasStreet) {
      validationErrors.push('Địa chỉ người nhận phải có đường/phố hoặc thôn/ấp/xóm');
    }
    
    // Required: weight > 0
    if (!packageInfo.weight || packageInfo.weight <= 0) {
      validationErrors.push('Khối lượng phải lớn hơn 0');
    }
    
    // Required: value > 0 (insurance value)
    const orderValue = formValues.configuration?.orderValue || grandTotal;
    if (!orderValue || orderValue <= 0) {
      validationErrors.push('Giá trị hàng hoá phải lớn hơn 0');
    }
    
    // Required: products array not empty
    if (!lineItems || lineItems.length === 0) {
      validationErrors.push('Đơn hàng phải có ít nhất 1 sản phẩm');
    }
    
    // Validate work shifts (must be 1 or 2, or undefined)
    if (formValues.configuration?.pickWorkShift && ![1, 2].includes(formValues.configuration.pickWorkShift)) {
      validationErrors.push('Ca lấy hàng phải là 1 (sáng) hoặc 2 (chiều)');
    }
    if (formValues.configuration?.deliverWorkShift && ![1, 2].includes(formValues.configuration.deliverWorkShift)) {
      validationErrors.push('Ca giao hàng phải là 1 (sáng) hoặc 2 (chiều)');
    }
    
    // Show all validation errors
    if (validationErrors.length > 0) {
      console.log('🚨 Validation Errors:', validationErrors);
      // console.log('📍 Customer Address:', customerAddress); // Removed
      // console.log('📦 Pickup Address:', pickupAddress); // Removed
      toast.error('Dữ liệu không hợp lệ', {
        description: validationErrors.join(', '),
        duration: 8000,
      });
      return;
    }
    // ✅ Generate unique order ID for GHTK (DH + YYMMDD + 5 random chars)
    const orderId = formValues.externalReference || generateShippingOrderId();
    const currentBranch = findBranchById(branchSystemId);
    
    if (!currentBranch) {
      toast.error('Không tìm thấy chi nhánh');
      return;
    }

    setCreatingShipment(true);

    try {
      // Currently only support GHTK
      if (selectedService.partnerId === 'GHTK') {
        // ✅ Use centralized helper function instead of store
        const { apiToken, partnerCode } = getGHTKCredentials();
        
        const ghtkService = new GHTKService(apiToken, partnerCode);

        // ✅✅✅ TÁI SỬ DỤNG previewParams - Đảm bảo 100% giống với preview
        const params = {
          ...previewParams,
          orderId: String(orderId), // Override với orderId đã generate
        };

        console.log('📤 [Create Shipment] Params gửi lên GHTK (100% GIỐNG preview):', params); // ✅ Log để verify
        
        const result = await ghtkService.createOrder(params);

        if (result.success && result.order) {
          const trackingCode = result.order.label;
          
          // Check for duplicate tracking code
          const existingOrder = getValues().trackingCode;
          if (existingOrder && existingOrder === trackingCode) {
            console.warn('[ShippingIntegration] Duplicate tracking code detected:', trackingCode);
          }
          
          setValue('trackingCode', trackingCode);
          setValue('configuration', { 
            ...formValues.configuration,
            ghtkLabel: trackingCode,
            ghtkTrackingId: result.order.tracking_id,
            ghtkEstimatedPickTime: result.order.estimated_pick_time,
            ghtkEstimatedDeliverTime: result.order.estimated_deliver_time,
          });
          
          toast.success('Tạo đơn vận chuyển thành công!', { 
            description: `Mã vận đơn: ${trackingCode}` 
          });
        } else {
          throw new Error(result.message || 'Không thể tạo đơn vận chuyển');
        }
      } else {
        toast.error('Chưa hỗ trợ', { description: `Chưa hỗ trợ tạo đơn cho ${selectedService.partnerName}` });
      }
    } catch (error) {
      console.error('[ShippingIntegration] Create shipment error:', error);
      
      // Parse error message for better user feedback
      let errorMessage = 'Vui lòng thử lại';
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Specific error messages
        if (error.message.includes('timeout') || error.message.includes('network')) {
          errorMessage = 'Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.';
        } else if (error.message.includes('token') || error.message.includes('authentication')) {
          errorMessage = 'API Token không hợp lệ. Vui lòng kiểm tra cấu hình.';
        } else if (error.message.includes('address') || error.message.includes('địa chỉ')) {
          errorMessage = 'Địa chỉ không hợp lệ. Vui lòng kiểm tra lại thông tin.';
        }
      }
      
      toast.error('Lỗi tạo đơn vận chuyển', { 
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setCreatingShipment(false);
    }
  }, [selectedService, shippingConfig, customerAddress, pickupAddress, branchSystemId, lineItems, packageInfo, grandTotal, shippingSettings.weightUnit, getValues, setValue, findBranchById, findProductById, partners]);

  // ⚠️ REMOVED: previewData - Đã merge vào previewParams để tránh duplicate logic
  // previewData đã bị xóa vì nó duplicate logic với previewParams
  // Giờ chỉ dùng DUY NHẤT 1 source of truth: previewParams

  // ✅ Store previewParams globally for order-form-page to access (avoid infinite loop from setValue)
  React.useEffect(() => {
    if (previewParams && deliveryMethod === 'shipping-partner') {
      (window as any).__ghtkPreviewParams = previewParams;
    }
  }, [previewParams, deliveryMethod]);

  return (
    <div className="space-y-4">
      {/* Main Delivery Method Selector */}
      {hideTabs ? (
        // ✅ When hideTabs is true (in dialog), don't wrap in Card
        <DeliveryMethodCard
          selectedMethod={deliveryMethod}
          onMethodChange={handleMethodChange}
          shippingRequest={shippingRequest}
          customerAddress={customerAddress}
          packageInfo={packageInfo}
          selectedService={selectedService}
          onServiceSelect={handleServiceSelect}
          onPackageInfoChange={handlePackageInfoChange}
          onServiceConfigChange={handleServiceConfigChange}
          onNoteChange={(note) => setValue('shippingNote', note)}
          grandTotal={grandTotal}
          previewData={previewParams} // ✅ Use auto-generated preview params
          onChangeDeliveryAddress={onChangeDeliveryAddress || (() => {
            toast.info('Cập nhật địa chỉ', { 
              description: 'Vui lòng cập nhật địa chỉ khách hàng ở mục "Thông tin khách hàng" bên trên' 
            });
          })}
          hideTabs={hideTabs}
          disabled={disabled}
        />
      ) : (
        // ✅ When hideTabs is false (in order form page), wrap in Card
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Giao hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <DeliveryMethodCard
              selectedMethod={deliveryMethod}
              onMethodChange={handleMethodChange}
              shippingRequest={shippingRequest}
              customerAddress={customerAddress}
              packageInfo={packageInfo}
              selectedService={selectedService}
              onServiceSelect={handleServiceSelect}
              onPackageInfoChange={handlePackageInfoChange}
              onServiceConfigChange={handleServiceConfigChange}
              onNoteChange={(note) => setValue('shippingNote', note)}
              grandTotal={grandTotal}
              previewData={previewParams} // ✅ Use auto-generated preview params
              onChangeDeliveryAddress={onChangeDeliveryAddress || (() => {
                toast.info('Cập nhật địa chỉ', { 
                  description: 'Vui lòng cập nhật địa chỉ khách hàng ở mục "Thông tin khách hàng" bên trên' 
                });
              })}
              hideTabs={hideTabs}
              disabled={disabled}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Export the create shipment function to be used in order-form-page
export { GHTKService, type GHTKCreateOrderParams };
