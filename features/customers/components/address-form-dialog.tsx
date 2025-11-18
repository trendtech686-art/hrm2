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
import { useProvinceStore } from '../../settings/provinces/store';
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
  const { data: provinces, getDistrictsByProvinceId, getWardsByProvinceId } = useProvinceStore();

  const [addressLevel, setAddressLevel] = React.useState<'2-level' | '3-level'>('3-level');
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
    inputLevel: '3-level' as '2-level' | '3-level',
  });

  // Reset form when dialog opens/closes or editingAddress changes
  React.useEffect(() => {
    if (isOpen) {
      if (editingAddress) {
        const level = editingAddress.inputLevel || '3-level';
        setAddressLevel(level);
        setFormData({
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
        });
      } else {
        setAddressLevel('3-level');
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
          inputLevel: '3-level',
        });
      }
    }
  }, [isOpen, editingAddress]);

  // Get available districts and wards based on selection
  const selectedProvince = React.useMemo(
    () => provinces.find((p) => p.name === formData.province),
    [provinces, formData.province]
  );

  const availableDistricts = React.useMemo(() => {
    if (!selectedProvince) return [];
    return getDistrictsByProvinceId(selectedProvince.id);
  }, [selectedProvince, getDistrictsByProvinceId]);

  const availableWards = React.useMemo(() => {
    if (!selectedProvince) return [];
    
    if (addressLevel === '2-level') {
      // For 2-level: Get all wards in province
      return getWardsByProvinceId(selectedProvince.id);
    } else {
      // For 3-level: Get wards in selected district
      if (!formData.districtId) return [];
      const wards = getWardsByProvinceId(selectedProvince.id);
      return wards.filter((w) => w.districtId === formData.districtId);
    }
  }, [selectedProvince, formData.districtId, addressLevel, getWardsByProvinceId]);

  // Prepare options for comboboxes
  const provinceOptions = React.useMemo(
    () =>
      provinces.map((p) => ({
        label: p.name,
        value: p.name,
      })),
    [provinces]
  );

  const districtOptions = React.useMemo(
    () =>
      availableDistricts.map((d) => ({
        label: d.name,
        value: d.name,
      })),
    [availableDistricts]
  );

  const wardOptions = React.useMemo(
    () =>
      availableWards.map((w) => ({
        label: w.name,
        value: w.name,
      })),
    [availableWards]
  );

  const handleSave = () => {
    if (!formData.label || !formData.street || !formData.province) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const addressData: Omit<CustomerAddress, 'id'> = {
      label: formData.label,
      street: formData.street,
      province: formData.province,
      provinceId: formData.provinceId,
      district: formData.district,
      districtId: formData.districtId,
      ward: formData.ward,
      wardId: formData.wardId,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      notes: formData.notes,
      isDefaultShipping: formData.isDefaultShipping,
      isDefaultBilling: formData.isDefaultBilling,
      inputLevel: formData.inputLevel,
      autoFilled: false,
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
                setFormData({
                  ...formData,
                  inputLevel: value,
                  ward: '', // Reset ward when changing level
                  district: value === '2-level' ? '' : formData.district, // Clear district for 2-level
                });
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
                    setFormData({
                      ...formData,
                      province: option ? option.value : '',
                      provinceId: selectedProv?.id || '',
                      ward: '', // Reset ward when province changes
                      wardId: '',
                      district: '',
                    });
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
                      setFormData({
                        ...formData,
                        district: option ? option.value : '',
                        districtId: selectedDist?.id || 0,
                        ward: '', // Reset ward when district changes
                        wardId: '',
                      });
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
                    setFormData({
                      ...formData,
                      ward: option ? option.value : '',
                      wardId: selectedWard?.id || '',
                      districtId: selectedWard?.districtId || formData.districtId || 0,
                    });
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
              id="notes"
              placeholder="Ghi chú thêm về địa chỉ này..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* ✅ Hide default switches when hideDefaultSwitches=true */}
          {!hideDefaultSwitches && (
            <div className="space-y-3 border-t pt-3">
              <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg border-blue-500 bg-blue-50/30">
                <Label htmlFor="isDefaultShipping" className="font-normal text-sm flex-1 cursor-pointer text-blue-700">
                  Đặt làm mặc định giao hàng
                </Label>
                <Switch
                  id="isDefaultShipping"
                  checked={formData.isDefaultShipping}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefaultShipping: checked })}
                />
              </div>

              <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg border-green-500 bg-green-50/30">
                <Label htmlFor="isDefaultBilling" className="font-normal text-sm flex-1 cursor-pointer text-green-700">
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
