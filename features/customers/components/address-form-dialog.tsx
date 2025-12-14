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
import { useProvinceStore } from '../../settings/provinces/store';
import { autoFillDistrict } from '../../settings/provinces/ward-district-mapping.ts';
import type { CustomerAddress } from '../types';

interface AddressFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (address: Omit<CustomerAddress, 'id'>) => void;
  editingAddress?: CustomerAddress | null;
  hideDefaultSwitches?: boolean; // ✅ Option to hide default shipping/billing switches
  title?: string; // ✅ Custom title
  description?: string; // ✅ Custom description
}

export function AddressFormDialog({
  isOpen,
  onOpenChange,
  onSave,
  editingAddress,
  hideDefaultSwitches = false, // ✅ Default to false (show switches)
  title,
  description,
}: AddressFormDialogProps) {
  const {
    data: provinces,
    getDistrictsByProvinceId,
    getWards2LevelByProvinceId,
    getWards3LevelByDistrictId,
  } = useProvinceStore();

  const [addressLevel, setAddressLevel] = React.useState<'2-level' | '3-level'>('2-level');
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

  // Reset form when dialog opens/closes or editingAddress changes
  React.useEffect(() => {
    if (isOpen) {
      console.log('[AddressFormDialog] Opening with editingAddress:', editingAddress);
      if (editingAddress) {
        const level = editingAddress.inputLevel || '2-level';
        setAddressLevel(level);
        const newFormData = {
          label: editingAddress.label || '',
          street: editingAddress.street || '',
          province: editingAddress.province || '',
          provinceId: editingAddress.provinceId || '',
          district: editingAddress.district || '',
          districtId: editingAddress.districtId || 0,
          ward: editingAddress.ward || '',
          wardId: editingAddress.wardId || '',
          wardCode: '', // wardCode not in EnhancedCustomerAddress type
          contactName: editingAddress.contactName || '',
          contactPhone: editingAddress.contactPhone || '',
          notes: editingAddress.notes || '',
          isDefaultShipping: editingAddress.isDefaultShipping || false,
          isDefaultBilling: editingAddress.isDefaultBilling || false,
          inputLevel: level,
        };
        console.log('[AddressFormDialog] Setting formData:', newFormData);
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
    }
  }, [isOpen, editingAddress]);

  // Get available districts and wards based on selection
  // IMPORTANT: Lookup province by BOTH name and provinceId for compatibility
  const selectedProvince = React.useMemo(() => {
    console.log('[AddressFormDialog] Looking for province:', { 
      provinceName: formData.province, 
      provinceId: formData.provinceId,
      availableProvinces: provinces.slice(0, 5).map(p => ({ id: p.id, name: p.name }))
    });
    
    // First try by name
    let found = provinces.find((p) => p.name === formData.province);
    if (found) {
      console.log('[AddressFormDialog] Found province by name:', found);
      return found;
    }
    
    // Then try by provinceId
    if (formData.provinceId) {
      found = provinces.find((p) => p.id === formData.provinceId);
      if (found) {
        console.log('[AddressFormDialog] Found province by id:', found);
        return found;
      }
    }
    
    // Try normalized name match
    const normalizedInput = formData.province?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    if (normalizedInput) {
      found = provinces.find((p) => {
        const normalizedName = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
        return normalizedName === normalizedInput || 
               normalizedName.includes(normalizedInput) || 
               normalizedInput.includes(normalizedName);
      });
      if (found) {
        console.log('[AddressFormDialog] Found province by normalized match:', found);
        return found;
      }
    }
    
    console.log('[AddressFormDialog] Province NOT FOUND');
    return null;
  }, [provinces, formData.province, formData.provinceId]);

  const availableDistricts = React.useMemo(() => {
    if (!selectedProvince) return [];
    const districtsFromProvince = getDistrictsByProvinceId(selectedProvince.id);
    
    // If we have a districtId but it's not in the available list,
    // the district might belong to a different province mapping (e.g. 3-level data)
    // In this case, add it manually to the options
    if (formData.districtId && formData.district) {
      const hasDistrict = districtsFromProvince.some(d => d.id === formData.districtId);
      if (!hasDistrict) {
        // Get district by ID directly
        const store = useProvinceStore.getState();
        const districtById = store.getDistrictById(formData.districtId);
        if (districtById) {
          return [districtById, ...districtsFromProvince];
        }
        // If still not found, create a virtual entry for display
        return [{
          systemId: `D${formData.districtId}` as any,
          id: formData.districtId,
          name: formData.district,
          provinceId: selectedProvince.id as any,
        }, ...districtsFromProvince];
      }
    }
    
    return districtsFromProvince;
  }, [selectedProvince, getDistrictsByProvinceId, formData.districtId, formData.district]);

  // For 3-level: If we have districtId but it's not in availableDistricts,
  // it might be from wards-3level-data with different provinceId mapping
  // In this case, try to get district directly by ID
  const selectedDistrict = React.useMemo(() => {
    if (!formData.districtId || formData.districtId === 0) return null;
    
    // First try from available districts
    const fromAvailable = availableDistricts.find(d => d.id === formData.districtId);
    if (fromAvailable) return fromAvailable;
    
    // Try direct lookup by ID (for cross-province cases)
    const store = useProvinceStore.getState();
    return store.getDistrictById(formData.districtId) || null;
  }, [formData.districtId, availableDistricts]);

  const availableWards = React.useMemo(() => {
    if (addressLevel === '2-level') {
      if (!selectedProvince) return [];
      return getWards2LevelByProvinceId(selectedProvince.id);
    }
    
    // For 3-level, use districtId directly (not requiring selectedProvince)
    if (!formData.districtId) return [];
    return getWards3LevelByDistrictId(formData.districtId);
  }, [selectedProvince, formData.districtId, addressLevel, getWards2LevelByProvinceId, getWards3LevelByDistrictId]);

  // Prepare options for comboboxes
  const provinceOptions = React.useMemo(
    () =>
      provinces.map((p) => ({
        label: p.name,
        value: p.name,
      })),
    [provinces]
  );

  const districtOptions = React.useMemo(() => {
    const options = availableDistricts.map((d) => ({
      label: d.name,
      value: d.name,
    }));
    
    // If we have a selected district that's not in available list, add it
    if (selectedDistrict && !availableDistricts.find(d => d.id === selectedDistrict.id)) {
      options.unshift({
        label: selectedDistrict.name,
        value: selectedDistrict.name,
      });
    }
    
    // If formData has district name but not in options, add it for display
    if (formData.district && !options.some(o => o.value === formData.district)) {
      options.unshift({
        label: formData.district,
        value: formData.district,
      });
    }
    
    return options;
  }, [availableDistricts, selectedDistrict, formData.district]);

  // Selected ward for display
  const selectedWard = React.useMemo(() => {
    if (!formData.wardId) return null;
    
    // First try from available wards
    const fromAvailable = availableWards.find(w => w.id === formData.wardId);
    if (fromAvailable) return fromAvailable;
    
    // Try direct lookup by ID
    const store = useProvinceStore.getState();
    return store.getWardById(formData.wardId) || null;
  }, [formData.wardId, availableWards]);

  const wardOptions = React.useMemo(() => {
    const options = availableWards.map((w) => ({
      label: w.name,
      value: w.name,
    }));
    
    // If we have a selected ward that's not in available list, add it
    if (selectedWard && !availableWards.find(w => w.id === selectedWard.id)) {
      options.unshift({
        label: selectedWard.name,
        value: selectedWard.name,
      });
    }
    
    return options;
  }, [availableWards, selectedWard]);

  const showValidationError = (message: string) => {
    toast.error('Thiếu thông tin', { description: message });
  };

  const handleSave = () => {
    const label = formData.label.trim();
    const street = formData.street.trim();

    if (!label) {
      showValidationError('Vui lòng nhập tên địa chỉ.');
      return;
    }

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
      } catch (error) {
        showValidationError('Không tìm thấy quận/huyện tương ứng với phường/xã đã chọn.');
        return;
      }
    }

    const addressData: Omit<CustomerAddress, 'id'> = {
      label,
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
          <div className="grid gap-2">
            <Label className="text-sm font-medium">Loại địa chỉ *</Label>
            <RadioGroup
              value={addressLevel}
              onValueChange={(value: '2-level' | '3-level') => {
                setAddressLevel(value);
                setFormData((prev) => ({
                  ...prev,
                  inputLevel: value,
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

          {/* Tên địa chỉ và Địa chỉ cùng 1 hàng */}
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label htmlFor="label" className="text-sm">
                Tên địa chỉ *
              </Label>
              <Input
                className="h-9"
                id="label"
                placeholder="VD: Văn phòng chính, Nhà máy..."
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              />
            </div>

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
                    const selectedProv = provinces.find((p) => p.name === option?.value);
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
                  placeholder="Chọn tỉnh/TP"
                  searchPlaceholder="Tìm tỉnh..."
                  emptyPlaceholder="Không tìm thấy."
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

              <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                <Label htmlFor="isDefaultBilling" className="font-normal text-sm flex-1 cursor-pointer">
                  Đặt làm mặc định hóa đơn
                </Label>
                <Switch
                  id="isDefaultBilling"
                  checked={formData.isDefaultBilling}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefaultBilling: checked })}
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
