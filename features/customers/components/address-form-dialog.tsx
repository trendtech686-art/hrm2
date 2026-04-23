/**
 * AddressFormDialog
 * Shared dialog component for adding/editing customer addresses
 * Used in: CustomerAddresses, CustomerAddressSelector, OrderFormPage
 */

import * as React from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Switch } from '../../../components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { VirtualizedCombobox } from '../../../components/ui/virtualized-combobox';
import { toast } from 'sonner';
import { useProvinces, useDistricts, useWards2Level, useWards3Level } from '../../settings/provinces/hooks/use-administrative-units';
import { autoFillDistrict } from '../../settings/provinces/ward-district-mapping';
import { removeVietnameseAccents } from '../../../lib/filename-utils';
import { asBusinessId } from '../../../lib/id-types';
import type { CustomerAddress } from '../types';

interface AddressFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (address: Omit<CustomerAddress, 'id'>) => void;
  editingAddress?: CustomerAddress | null;
  hideDefaultSwitches?: boolean; // ✅ Option to hide default shipping/billing switches
  hideContactFields?: boolean; // Hide contact name, phone, notes fields (for employee addresses)
  title?: string; // ✅ Custom title
  description?: string; // ✅ Custom description
  forcedAddressLevel?: '2-level' | '3-level'; // Force a specific address level, hides selector
}

export function AddressFormDialog({
  isOpen,
  onOpenChange,
  onSave,
  editingAddress,
  hideDefaultSwitches = false, // ✅ Default to false (show switches)
  hideContactFields = false,
  title,
  description,
  forcedAddressLevel,
}: AddressFormDialogProps) {
  // Load province data via React Query - only when dialog is open
  const { data: allProvinces = [], isLoading: isLoadingProvinces } = useProvinces({ enabled: isOpen, level: 'all' });
  const { data: allDistricts = [] } = useDistricts(undefined, { enabled: isOpen });
  const isProvincesReady = allProvinces.length > 0 && allDistricts.length > 0;

  // Province subsets by level
  const provinces2Level = React.useMemo(() => allProvinces.filter(p => p.level === '2-level'), [allProvinces]);
  const provinces3Level = React.useMemo(() => allProvinces.filter(p => p.level === '3-level'), [allProvinces]);

  const [addressLevel, setAddressLevel] = React.useState<'2-level' | '3-level'>(forcedAddressLevel || '2-level');
  const [formData, setFormData] = React.useState({
    label: '',
    street: '',
    province: '',
    provinceId: '',
    district: '',
    districtId: 0,
    ward: '',
    wardId: '',
    wardCode: '',
    contactName: '',
    contactPhone: '',
    notes: '',
    isDefaultShipping: false,
    isDefaultBilling: false,
    inputLevel: '2-level' as '2-level' | '3-level',
  });

  // Debug: Log component state on every render

  // Track if we've already initialized the form for this editingAddress
  const [hasInitialized, setHasInitialized] = React.useState(false);
  // Track if we still need to resolve wardId after wards load
  const [wardInitPending, setWardInitPending] = React.useState(false);

  // Reset hasInitialized when editingAddress changes
  React.useEffect(() => {
    setHasInitialized(false);
  }, [editingAddress?.id]);

  // Initialize form when dialog opens and provinces are ready
  React.useEffect(() => {
    
    // Skip if not open or already initialized
    if (!isOpen) return;
    if (hasInitialized) return;
    
    // Wait for provinces to load before doing lookup
    if (!isProvincesReady) {
      return;
    }
    
    setHasInitialized(true);
    
    if (editingAddress) {
      const level = forcedAddressLevel || editingAddress.inputLevel || '3-level';
      setAddressLevel(level);
      
      // Helper: normalize text for matching
      const normalize = (text: string) =>
        text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
      
      // Get IDs from names if not provided (for imported data)
      let provinceId = editingAddress.provinceId || '';
      let districtId = editingAddress.districtId || 0;
      const wardId = editingAddress.wardId || '';
        
        // Auto-lookup provinceId from province name if not provided
        if (!provinceId && editingAddress.province) {
          const levelProvinces = level === '2-level' ? provinces2Level : provinces3Level;
          const normalizedInput = normalize(editingAddress.province);
          const foundProvince = levelProvinces.find((p) => {
            const normalizedName = normalize(p.name);
            return normalizedName === normalizedInput || 
                   normalizedName.includes(normalizedInput) || 
                   normalizedInput.includes(normalizedName);
          });
          if (foundProvince) {
            provinceId = foundProvince.id;
          }
        }
        
        // If we still don't have provinceId but have district name, try to find province from district
        if (!provinceId && editingAddress.district && level === '3-level') {
          const allDistricts3Level = allDistricts.filter(d => d.level === '3-level');
          
          const normalizedDistrictInput = normalize(editingAddress.district);
          
          const foundDistrict = allDistricts3Level.find((d) => {
            const normalizedName = normalize(d.name);
            return normalizedName === normalizedDistrictInput || 
                   normalizedName.includes(normalizedDistrictInput) || 
                   normalizedDistrictInput.includes(normalizedName);
          });
          if (foundDistrict) {
            provinceId = foundDistrict.provinceId;
            districtId = foundDistrict.id;
          } else {
            // District not found - proceed without districtId
          }
        }
        
        // Auto-lookup districtId from district name if not provided (but we have provinceId)
        if (!districtId && editingAddress.district && provinceId) {
          const provinceDistricts = allDistricts.filter(d => d.provinceId === asBusinessId(provinceId));
          const normalizedInput = normalize(editingAddress.district);
          const foundDistrict = provinceDistricts.find((d) => {
            const normalizedName = normalize(d.name);
            return normalizedName === normalizedInput || 
                   normalizedName.includes(normalizedInput) || 
                   normalizedInput.includes(normalizedName);
          });
          if (foundDistrict) {
            districtId = foundDistrict.id;
          }
        }
        
        // Ward lookup will be deferred to phase 2 effect (after wards load via React Query)
        // Mark ward init pending if we don't have wardId yet
        if (!wardId && editingAddress.ward) {
          setWardInitPending(true);
        }
        
        // ALWAYS get province name from loaded data when we have provinceId
        // This ensures the name matches exactly with dropdown options
        let provinceName = editingAddress.province || '';
        let districtName = editingAddress.district || '';
        if (provinceId) {
          const levelProvinces = level === '2-level' ? provinces2Level : provinces3Level;
          const foundProvince = levelProvinces.find(p => p.id === provinceId);
          if (foundProvince) {
            provinceName = foundProvince.name;
          }
          
          // Also get district name to ensure match
          if (districtId) {
            const foundDistrict = allDistricts.find(d => d.id === districtId);
            if (foundDistrict) {
              districtName = foundDistrict.name;
            }
          }
        }
        
        
        const newFormData = {
          label: editingAddress.label || '',
          street: editingAddress.street || '',
          province: provinceName,
          provinceId,
          district: districtName,
          districtId,
          ward: editingAddress.ward || '',
          wardId,
          wardCode: '', // wardCode not in EnhancedCustomerAddress type
          contactName: editingAddress.contactName || '',
          contactPhone: editingAddress.contactPhone || '',
          notes: editingAddress.notes || '',
          isDefaultShipping: editingAddress.isDefaultShipping || false,
          isDefaultBilling: editingAddress.isDefaultBilling || false,
          inputLevel: level,
        };
        setFormData(newFormData);
      } else {
        setAddressLevel('2-level');
        setFormData({
          label: '',
          street: '',
          province: '',
          provinceId: '',
          district: '',
          districtId: 0,
          ward: '',
          wardId: '',
          wardCode: '',
          contactName: '',
          contactPhone: '',
          notes: '',
          isDefaultShipping: false,
          isDefaultBilling: false,
          inputLevel: '2-level',
        });
      }
  }, [isOpen, editingAddress, isProvincesReady, hasInitialized, isLoadingProvinces, provinces2Level, provinces3Level, allDistricts]);

  // Ward query hooks (enabled after province/district selection is set)
  const { data: wards2Level = [] } = useWards2Level(
    addressLevel === '2-level' && formData.provinceId ? formData.provinceId : undefined
  );
  const { data: wards3Level = [] } = useWards3Level(
    addressLevel === '3-level' && formData.districtId ? formData.districtId : undefined
  );

  // Phase 2: Resolve wardId once wards are loaded (deferred from init)
  React.useEffect(() => {
    if (!wardInitPending || !editingAddress?.ward) return;
    
    const wardsToSearch = addressLevel === '2-level' ? wards2Level : wards3Level;
    if (wardsToSearch.length === 0) return;
    
    const normalize = (text: string) =>
      text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    const normalizedInput = normalize(editingAddress.ward);
    const foundWard = wardsToSearch.find((w) => {
      const normalizedName = normalize(w.name);
      return normalizedName === normalizedInput || 
             normalizedName.includes(normalizedInput) || 
             normalizedInput.includes(normalizedName);
    });
    if (foundWard) {
      setFormData(prev => ({ ...prev, wardId: foundWard.id }));
    }
    setWardInitPending(false);
  }, [wardInitPending, editingAddress?.ward, addressLevel, wards2Level, wards3Level]);

  // Get provinces based on address level (MUST be before selectedProvince)
  const activeProvinces = React.useMemo(() => {
    return addressLevel === '2-level' ? provinces2Level : provinces3Level;
  }, [addressLevel, provinces2Level, provinces3Level]);

  // Get available districts and wards based on selection
  // IMPORTANT: Lookup province by BOTH name and provinceId for compatibility
  const selectedProvince = React.useMemo(() => {
    
    // First try by name
    let found = activeProvinces.find((p) => p.name === formData.province);
    if (found) {
      return found;
    }
    
    // Then try by provinceId
    if (formData.provinceId) {
      found = activeProvinces.find((p) => p.id === formData.provinceId);
      if (found) {
        return found;
      }
    }
    
    // Try normalized name match
    const normalizedInput = formData.province?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    if (normalizedInput) {
      found = activeProvinces.find((p) => {
        const normalizedName = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
        return normalizedName === normalizedInput || 
               normalizedName.includes(normalizedInput) || 
               normalizedInput.includes(normalizedName);
      });
      if (found) {
        return found;
      }
    }
    
    return null;
  }, [activeProvinces, formData.province, formData.provinceId]);

  const availableDistricts = React.useMemo(() => {
    if (!selectedProvince) return [];
    
    // Use 3-level districts for 3-level address
    const districtsFromProvince = addressLevel === '3-level' 
      ? allDistricts.filter(d => d.provinceId === selectedProvince.id)
      : []; // 2-level doesn't have districts
    
    // If we have a districtId but it's not in the available list,
    // the district might belong to a different province mapping (e.g. 3-level data)
    // In this case, add it manually to the options
    if (formData.districtId && formData.district) {
      const hasDistrict = districtsFromProvince.some(d => d.id === formData.districtId);
      if (!hasDistrict) {
        // Get district by ID directly from all districts
        const districtById = allDistricts.find(d => d.id === formData.districtId);
        if (districtById) {
          return [districtById, ...districtsFromProvince];
        }
        // If still not found, create a virtual entry for display
        return [{
          systemId: `D${formData.districtId}` as `D${number}`,
          id: formData.districtId,
          name: formData.district,
          provinceId: selectedProvince.id,
        }, ...districtsFromProvince];
      }
    }
    
    return districtsFromProvince;
  }, [selectedProvince, addressLevel, allDistricts, formData.districtId, formData.district]);

  // For 3-level: If we have districtId but it's not in availableDistricts,
  // it might be from wards-3level-data with different provinceId mapping
  // In this case, try to get district directly by ID
  const selectedDistrict = React.useMemo(() => {
    if (!formData.districtId || formData.districtId === 0) return null;
    
    // First try from available districts
    const fromAvailable = availableDistricts.find(d => d.id === formData.districtId);
    if (fromAvailable) return fromAvailable;
    
    // Try direct lookup by ID from all districts (for cross-province cases)
    return allDistricts.find(d => d.id === formData.districtId) || null;
  }, [formData.districtId, availableDistricts, allDistricts]);

  const availableWards = React.useMemo(() => {
    if (addressLevel === '2-level') {
      return wards2Level;
    }
    return wards3Level;
  }, [addressLevel, wards2Level, wards3Level]);

  // Prepare options for comboboxes - use activeProvinces based on level
  const provinceOptions = React.useMemo(
    () =>
      activeProvinces.map((p) => ({
        label: p.name,
        value: p.name,
        acText: removeVietnameseAccents(p.name).toLowerCase(), // For accent-insensitive search
      })),
    [activeProvinces]
  );

  const districtOptions = React.useMemo(() => {
    const options = availableDistricts.map((d) => ({
      label: d.name,
      value: d.name,
      acText: removeVietnameseAccents(d.name).toLowerCase(), // For accent-insensitive search
    }));
    
    // If we have a selected district that's not in available list, add it
    if (selectedDistrict && !availableDistricts.find(d => d.id === selectedDistrict.id)) {
      options.unshift({
        label: selectedDistrict.name,
        value: selectedDistrict.name,
        acText: removeVietnameseAccents(selectedDistrict.name).toLowerCase(),
      });
    }
    
    // If formData has district name but not in options, add it for display
    if (formData.district && !options.some(o => o.value === formData.district)) {
      options.unshift({
        label: formData.district,
        value: formData.district,
        acText: removeVietnameseAccents(formData.district).toLowerCase(),
      });
    }
    
    return options;
  }, [availableDistricts, selectedDistrict, formData.district]);

  // Selected ward for display
  const selectedWard = React.useMemo(() => {
    if (!formData.wardId) return null;
    
    // Look up from available wards (already loaded via React Query)
    return availableWards.find(w => w.id === formData.wardId) || null;
  }, [formData.wardId, availableWards]);

  const wardOptions = React.useMemo(() => {
    const options = availableWards.map((w) => ({
      label: w.name,
      value: w.name,
      acText: removeVietnameseAccents(w.name).toLowerCase(), // For accent-insensitive search
    }));
    
    // If we have a selected ward that's not in available list, add it
    if (selectedWard && !availableWards.find(w => w.id === selectedWard.id)) {
      options.unshift({
        label: selectedWard.name,
        value: selectedWard.name,
        acText: removeVietnameseAccents(selectedWard.name).toLowerCase(),
      });
    }
    
    return options;
  }, [availableWards, selectedWard]);

  const showValidationError = (message: string) => {
    toast.error('Thiếu thông tin', { description: message });
  };

  const handleSave = () => {
    const street = formData.street.trim();

    if (!street) {
      showValidationError('Vui lòng nhập địa chỉ chi tiết.');
      return;
    }

    if (!formData.province || !formData.provinceId) {
      showValidationError('Vui lòng chọn tỉnh/thành phố.');
      return;
    }

    if (addressLevel === '3-level') {
      if (!formData.district || !formData.districtId) {
        showValidationError('Vui lòng chọn quận/huyện trước khi lưu địa chỉ 3 cấp.');
        return;
      }
      if (!formData.ward || !formData.wardId) {
        showValidationError('Vui lòng chọn phường/xã cho địa chỉ 3 cấp.');
        return;
      }
    } else {
      if (!formData.ward || !formData.wardId) {
        showValidationError('Vui lòng chọn phường/xã cho địa chỉ 2 cấp.');
        return;
      }
    }

    let districtName = formData.district;
    let districtId = formData.districtId;
    let autoFilled = false;

    if (addressLevel === '2-level') {
      try {
        const mapping = autoFillDistrict({
          provinceId: formData.provinceId,
          provinceName: formData.province,
          wardId: formData.wardId,
          wardName: formData.ward,
        });
        districtName = mapping.districtName;
        districtId = mapping.districtId;
        autoFilled = true;
      } catch (_error) {
        // Cho phép lưu địa chỉ 2 cấp mà không cần district (các tỉnh/TP đặc biệt như Huế)
        // District sẽ được để trống hoặc tự suy từ ward name
        console.warn(`[AddressFormDialog] Không tìm được district cho ward "${formData.ward}" - cho phép lưu với district trống`);
        districtName = '';
        districtId = 0;
        autoFilled = false;
      }
    }

    const addressData: Omit<CustomerAddress, 'id'> = {
      label: street,
      street,
      province: formData.province,
      provinceId: formData.provinceId,
      district: districtName,
      districtId,
      ward: formData.ward,
      wardId: formData.wardId,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      notes: formData.notes,
      isDefaultShipping: formData.isDefaultShipping,
      isDefaultBilling: formData.isDefaultBilling,
      inputLevel: formData.inputLevel,
      autoFilled,
    };

    onSave(addressData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent mobileFullScreen className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {title || (editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới')}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {description || 'Nhập thông tin địa chỉ của khách hàng'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-3">
          {/* Address Level Selection - Compact */}
          {!forcedAddressLevel && (
          <div className="grid gap-2">
            <Label className="text-sm font-medium">Loại địa chỉ *</Label>
            <RadioGroup
              value={addressLevel}
              onValueChange={(value) => {
                setAddressLevel(value as '2-level' | '3-level');
                setFormData((prev) => ({
                  ...prev,
                  inputLevel: value as '2-level' | '3-level',
                  ward: '',
                  wardId: '',
                  district: value === '2-level' ? '' : prev.district,
                  districtId: value === '2-level' ? 0 : prev.districtId,
                }));
              }}
              className="flex gap-2"
            >
              <div className="flex items-center space-x-2 border rounded-md px-3 py-2 flex-1 cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value="2-level" id="level-2" />
                <Label htmlFor="level-2" className="cursor-pointer text-sm flex-1">
                  <span className="font-medium">2 cấp</span>
                  <span className="text-xs text-muted-foreground block">Tỉnh → Phường/Xã</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md px-3 py-2 flex-1 cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value="3-level" id="level-3" />
                <Label htmlFor="level-3" className="cursor-pointer text-sm flex-1">
                  <span className="font-medium">3 cấp</span>
                  <span className="text-xs text-muted-foreground block">Tỉnh → Quận → Phường</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          )}

          {/* Địa chỉ */}
          <div className="grid gap-2">
            <Label htmlFor="street" className="text-sm">
              Địa chỉ *
            </Label>
            <Input
              className="h-9"
              id="street"
              placeholder="Số nhà, tên đường..."
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            />
          </div>

          {/* Compact address fields - 1 row for 3 fields */}
          <div className="grid gap-2">
            <div className={addressLevel === '3-level' ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-2 gap-2'}>
              <div className="grid gap-1.5">
                <Label htmlFor="province" className="text-xs">
                  Tỉnh/TP *
                </Label>
                <VirtualizedCombobox
                  options={provinceOptions}
                  value={provinceOptions.find((opt) => opt.value === formData.province) || null}
                  onChange={(option) => {
                    const selectedProv = activeProvinces.find((p) => p.name === option?.value);
                    setFormData((prev) => ({
                      ...prev,
                      province: option ? option.value : '',
                      provinceId: selectedProv?.id || '',
                      district: '',
                      districtId: 0,
                      ward: '',
                      wardId: '',
                    }));
                  }}
                  placeholder={isLoadingProvinces ? "Đang tải..." : "Chọn tỉnh/TP"}
                  searchPlaceholder="Tìm tỉnh..."
                  emptyPlaceholder={isLoadingProvinces ? "Đang tải dữ liệu..." : "Không tìm thấy."}
                  estimatedItemHeight={36}
                />
              </div>

              {/* Show district field only for 3-level addresses */}
              {addressLevel === '3-level' && (
                <div className="grid gap-1.5">
                  <Label htmlFor="district" className="text-xs">
                    Quận/Huyện *
                  </Label>
                  <VirtualizedCombobox
                    options={districtOptions}
                    value={districtOptions.find((opt) => opt.value === formData.district) || null}
                    onChange={(option) => {
                      const selectedDist = availableDistricts.find((d) => d.name === option?.value);
                      setFormData((prev) => ({
                        ...prev,
                        district: option ? option.value : '',
                        districtId: selectedDist?.id || 0,
                        ward: '',
                        wardId: '',
                      }));
                    }}
                    placeholder={selectedProvince ? 'Chọn quận/huyện' : 'Chọn tỉnh trước'}
                    searchPlaceholder="Tìm quận/huyện..."
                    emptyPlaceholder="Không tìm thấy."
                    disabled={!selectedProvince}
                    estimatedItemHeight={36}
                  />
                </div>
              )}

              <div className="grid gap-1.5">
                <Label htmlFor="ward" className="text-xs">
                  Phường/Xã
                </Label>
                <VirtualizedCombobox
                  options={wardOptions}
                  value={wardOptions.find((opt) => opt.value === formData.ward) || null}
                  onChange={(option) => {
                    const selectedWard = availableWards.find((w) => w.name === option?.value);
                    setFormData((prev) => ({
                      ...prev,
                      ward: option ? option.value : '',
                      wardId: selectedWard?.id || '',
                      districtId:
                        addressLevel === '3-level'
                          ? selectedWard?.districtId || prev.districtId || 0
                          : prev.districtId,
                    }));
                  }}
                  placeholder={
                    addressLevel === '3-level' && !formData.districtId
                      ? 'Chọn quận/huyện trước'
                      : selectedProvince
                      ? 'Chọn phường/xã'
                      : 'Chọn tỉnh trước'
                  }
                  searchPlaceholder="Tìm phường/xã..."
                  emptyPlaceholder="Không tìm thấy."
                  disabled={!selectedProvince || (addressLevel === '3-level' && !formData.districtId)}
                  estimatedItemHeight={36}
                />
              </div>
            </div>
          </div>

          {!hideContactFields && (
          <>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-1.5">
              <Label htmlFor="contactName" className="text-xs">
                Người liên hệ
              </Label>
              <Input
                className="h-9"
                id="contactName"
                placeholder="Tên người liên hệ"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="contactPhone" className="text-xs">
                Số điện thoại
              </Label>
              <Input
                className="h-9"
                id="contactPhone"
                placeholder="Số điện thoại liên hệ"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="notes" className="text-xs">
              Ghi chú
            </Label>
            <Input
              className="h-9"
              id="notes"
              placeholder="Ghi chú thêm về địa chỉ này..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          </>
          )}

          {/* ✅ Hide default switches when hideDefaultSwitches=true */}
          {!hideDefaultSwitches && (
            <div className="space-y-3 border-t pt-3">
              <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                <Label htmlFor="isDefaultShipping" className="font-normal text-sm flex-1 cursor-pointer">
                  Đặt làm mặc định giao hàng
                </Label>
                <Switch
                  id="isDefaultShipping"
                  checked={formData.isDefaultShipping}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefaultShipping: checked })}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Hủy
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            {editingAddress ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
