/**
 * Dual Address Form
 * 
 * Form nhập địa chỉ với 2 chế độ:
 * - 2 cấp: Tỉnh → Phường (không có Quận)
 * - 3 cấp: Tỉnh → Quận → Phường (đầy đủ)
 * 
 * Dùng cho: Khách hàng có thể nhập cả 2 loại địa chỉ
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { VirtualizedCombobox } from '@/components/ui/virtualized-combobox';
import { Badge } from '@/components/ui/badge';
import { useProvinceStore } from '@/features/provinces/store';
import { toast } from 'sonner';
import { MapPin, Info } from 'lucide-react';
import type { EnhancedCustomerAddress, AddressLevel } from '../types/enhanced-address';

type DualAddressFormProps = {
  onSuccess: (address: EnhancedCustomerAddress) => void;
  onCancel: () => void;
  defaultValues?: Partial<EnhancedCustomerAddress>;
};

export function DualAddressForm({
  onSuccess,
  onCancel,
  defaultValues,
}: DualAddressFormProps) {
  const {
    data: provinces,
    districts,
    wards,
    getDistrictsByProvinceId,
    getWardsByProvinceId,
    getWardsByDistrictId,
    getDistrictById,
    getProvinceById,
    getWardById,
  } = useProvinceStore();

  // Form state
  const [addressLevel, setAddressLevel] = useState<AddressLevel>(defaultValues?.inputLevel || '2-level');
  const [label, setLabel] = useState(defaultValues?.label || '');
  const [street, setStreet] = useState(defaultValues?.street || '');
  const [contactName, setContactName] = useState(defaultValues?.contactName || '');
  const [contactPhone, setContactPhone] = useState(defaultValues?.contactPhone || '');
  const [isShipping, setIsShipping] = useState(defaultValues?.isShipping ?? true);
  const [isBilling, setIsBilling] = useState(defaultValues?.isBilling ?? false);
  const [isDefault, setIsDefault] = useState(defaultValues?.isDefault ?? false);

  // Address selection state
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | undefined>(defaultValues?.provinceId);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | undefined>(defaultValues?.districtId);
  const [selectedWardId, setSelectedWardId] = useState<string | undefined>(defaultValues?.wardId);

  // Load defaultValues khi edit
  useEffect(() => {
    if (defaultValues) {
      setSelectedProvinceId(defaultValues.provinceId);
      setSelectedDistrictId(defaultValues.districtId || undefined);
      setSelectedWardId(defaultValues.wardId);
    }
  }, [defaultValues]);

  // Prepare options
  const provinceOptions = provinces.map(p => ({
    value: p.id,
    label: p.name,
  }));

  const districtOptions = selectedProvinceId
    ? getDistrictsByProvinceId(selectedProvinceId).map(d => ({
        value: String(d.id),
        label: d.name,
      }))
    : [];

  // Lọc wards theo level
  const wardOptions =
    addressLevel === '2-level'
      ? selectedProvinceId
        ? getWardsByProvinceId(selectedProvinceId)
            .filter(w => !w.districtId) // Chỉ lấy wards 2 cấp (không có districtId)
            .map(w => ({
              value: w.id,
              label: w.name,
            }))
        : []
      : selectedDistrictId
      ? getWardsByDistrictId(selectedDistrictId)
          .filter(w => w.districtId) // Chỉ lấy wards 3 cấp (có districtId)
          .map(w => ({
            value: w.id,
            label: w.name,
          }))
      : [];

  // Auto-fill logic for 2-level (không cần auto-fill district nữa)
  useEffect(() => {
    if (selectedWardId && addressLevel === '2-level') {
      // Ward 2 cấp không có district, không cần làm gì
    }
  }, [selectedWardId, addressLevel]);

  // Auto-fill logic for 3-level
  useEffect(() => {
    if (selectedDistrictId && addressLevel === '3-level') {
      const district = getDistrictById(selectedDistrictId);
      if (district?.provinceId) {
        const province = getProvinceById(district.provinceId);
        setSelectedProvinceId(province.id);
        toast.success('Đã tự động điền tỉnh/thành phố', {
          description: province.name,
        });
      }
    } else if (addressLevel === '3-level' && !defaultValues) {
      // Chỉ reset ward khi chuyển district VÀ không phải đang edit
      setSelectedWardId(undefined);
    }
  }, [selectedDistrictId, addressLevel, getDistrictById, getProvinceById, defaultValues]);

  // Reset khi đổi chế độ (nhưng không reset khi load lần đầu với defaultValues)
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!isInitialized && defaultValues) {
      // Lần đầu load với defaultValues - không reset
      setIsInitialized(true);
      return;
    }
    
    if (isInitialized) {
      // User chủ động đổi radio - reset các field
      setSelectedDistrictId(undefined);
      setSelectedWardId(undefined);
    }
  }, [addressLevel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!label.trim()) {
      toast.error('Vui lòng nhập tên địa chỉ', {
        description: 'Tên địa chỉ không được để trống'
      });
      return;
    }

    if (!street.trim()) {
      toast.error('Vui lòng nhập địa chỉ chi tiết', {
        description: 'Số nhà, tên đường không được để trống'
      });
      return;
    }

    if (!selectedProvinceId) {
      toast.error('Vui lòng chọn Tỉnh/Thành phố', {
        description: 'Tỉnh/Thành phố là bắt buộc'
      });
      return;
    }

    if (addressLevel === '2-level' && !selectedWardId) {
      toast.error('Vui lòng chọn Phường/Xã', {
        description: 'Phường/Xã (2 cấp) là bắt buộc'
      });
      return;
    }

    if (addressLevel === '3-level' && !selectedDistrictId) {
      toast.error('Vui lòng chọn Quận/Huyện', {
        description: 'Quận/Huyện (3 cấp) là bắt buộc'
      });
      return;
    }

    if (addressLevel === '3-level' && !selectedWardId) {
      toast.error('Vui lòng chọn Phường/Xã', {
        description: 'Phường/Xã (3 cấp) là bắt buộc'
      });
      return;
    }

    // Get selected items
    const province = getProvinceById(selectedProvinceId!);
    const district = selectedDistrictId ? getDistrictById(selectedDistrictId) : null;
    const ward = getWardById(selectedWardId!);

    if (!province || !ward) {
      toast.error('Dữ liệu địa chỉ không hợp lệ');
      return;
    }

    // Create address object
    const newAddress: EnhancedCustomerAddress = {
      id: defaultValues?.id || crypto.randomUUID(),
      label: label.trim(),
      street: street.trim(),
      province: province.name,
      provinceId: province.id,
      district: district?.name || '',
      districtId: district?.id || 0,
      ward: ward.name,
      wardId: ward.id,
      inputLevel: addressLevel,
      autoFilled: !!district, // Có district = đã tự động điền
      contactName: contactName.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
      isDefault: isDefault,
      isShipping: isShipping,
      isBilling: isBilling,
      createdAt: defaultValues?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    toast.success(`Đã ${defaultValues ? 'cập nhật' : 'thêm'} địa chỉ ${addressLevel === '2-level' ? '2 cấp' : '3 cấp'}!`, {
      description: `${label.trim()} - ${isShipping ? '📦 Giao hàng' : ''} ${isBilling ? '📄 Hóa đơn' : ''}`
    });
    onSuccess(newAddress);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Address Level Selection */}
      <div className="space-y-3 p-4 bg-muted rounded-lg">
        <Label className="text-base font-semibold flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Chọn loại địa chỉ
        </Label>
        <RadioGroup value={addressLevel} onValueChange={(v) => setAddressLevel(v as AddressLevel)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2-level" id="2-level" />
            <Label htmlFor="2-level" className="cursor-pointer font-normal">
              <div className="flex items-center gap-2">
                <span>Địa chỉ 2 cấp</span>
                <Badge variant="secondary" className="text-xs">Tỉnh → Phường</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Không có Quận/Huyện. Hệ thống sẽ tự động điền nếu xã có thông tin.
              </p>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3-level" id="3-level" />
            <Label htmlFor="3-level" className="cursor-pointer font-normal">
              <div className="flex items-center gap-2">
                <span>Địa chỉ 3 cấp</span>
                <Badge variant="default" className="text-xs">Tỉnh → Quận → Phường</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Đầy đủ thông tin. Phù hợp để gửi API giao hàng.
              </p>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="label">Tên địa chỉ *</Label>
          <Input
            id="label"
            placeholder="VD: Văn phòng, Nhà kho, Chi nhánh..."
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="street">Địa chỉ chi tiết *</Label>
          <Input
            id="street"
            placeholder="Số nhà, tên đường..."
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </div>
      </div>

      {/* Address Fields - 2 Level */}
      {addressLevel === '2-level' ? (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800">
              <strong>Chế độ 2 cấp:</strong> Chỉ nhập Tỉnh → Phường/Xã (không có Quận/Huyện).
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tỉnh/Thành phố *</Label>
              <VirtualizedCombobox
                options={provinceOptions}
                value={provinceOptions.find(opt => opt.value === selectedProvinceId) || null}
                onChange={(option) => {
                  setSelectedProvinceId(option?.value);
                  setSelectedWardId(undefined);
                  setSelectedDistrictId(undefined);
                }}
                placeholder="Chọn tỉnh/thành phố"
                searchPlaceholder="Tìm tỉnh..."
                emptyPlaceholder="Không tìm thấy"
              />
            </div>

            <div className="space-y-2">
              <Label>Phường/Xã *</Label>
              <VirtualizedCombobox
                options={wardOptions}
                value={wardOptions.find(opt => opt.value === selectedWardId) || null}
                onChange={(option) => setSelectedWardId(option?.value)}
                placeholder={selectedProvinceId ? 'Chọn phường/xã' : 'Chọn tỉnh trước'}
                searchPlaceholder="Tìm phường/xã..."
                emptyPlaceholder="Không tìm thấy"
                disabled={!selectedProvinceId}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Address Fields - 3 Level */
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
            <Info className="h-4 w-4 text-green-600 mt-0.5" />
            <p className="text-sm text-green-800">
              <strong>Chế độ 3 cấp:</strong> Nhập đầy đủ Tỉnh → Quận → Phường theo thứ tự.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Tỉnh/Thành phố *</Label>
            <VirtualizedCombobox
              options={provinceOptions}
              value={provinceOptions.find(opt => opt.value === selectedProvinceId) || null}
              onChange={(option) => {
                setSelectedProvinceId(option?.value);
                setSelectedDistrictId(undefined);
                setSelectedWardId(undefined);
              }}
              placeholder="Chọn tỉnh/thành phố"
              searchPlaceholder="Tìm tỉnh..."
              emptyPlaceholder="Không tìm thấy"
            />
          </div>

          <div className="space-y-2">
            <Label>Quận/Huyện *</Label>
            <VirtualizedCombobox
              options={districtOptions}
              value={districtOptions.find(opt => opt.value === String(selectedDistrictId)) || null}
              onChange={(option) => {
                setSelectedDistrictId(option ? Number(option.value) : undefined);
                setSelectedWardId(undefined);
              }}
              placeholder={selectedProvinceId ? 'Chọn quận/huyện' : 'Chọn tỉnh trước'}
              searchPlaceholder="Tìm quận/huyện..."
              emptyPlaceholder="Không tìm thấy"
              disabled={!selectedProvinceId}
            />
          </div>

          <div className="space-y-2">
            <Label>Phường/Xã *</Label>
            <VirtualizedCombobox
              options={wardOptions}
              value={wardOptions.find(opt => opt.value === selectedWardId) || null}
              onChange={(option) => setSelectedWardId(option?.value)}
              placeholder={selectedDistrictId ? 'Chọn phường/xã' : 'Chọn quận trước'}
              searchPlaceholder="Tìm phường/xã..."
              emptyPlaceholder="Không tìm thấy"
              disabled={!selectedDistrictId}
            />
          </div>
        </div>
      )}

      {/* Contact Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactName">Người liên hệ</Label>
          <Input
            id="contactName"
            placeholder="Tên người nhận hàng..."
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Số điện thoại</Label>
          <Input
            id="contactPhone"
            placeholder="09xx xxx xxx"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </div>
      </div>

      {/* Address Types */}
      <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
        <Label className="text-base font-semibold">Loại địa chỉ</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isShipping"
              checked={isShipping}
              onCheckedChange={(checked) => setIsShipping(checked as boolean)}
            />
            <Label htmlFor="isShipping" className="cursor-pointer font-normal flex items-center gap-2">
              <span className="text-lg">📦</span>
              <span>Địa chỉ giao hàng</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isBilling"
              checked={isBilling}
              onCheckedChange={(checked) => setIsBilling(checked as boolean)}
            />
            <Label htmlFor="isBilling" className="cursor-pointer font-normal flex items-center gap-2">
              <span className="text-lg">📄</span>
              <span>Địa chỉ xuất hóa đơn</span>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={isDefault}
              onCheckedChange={(checked) => setIsDefault(checked as boolean)}
            />
            <Label htmlFor="isDefault" className="cursor-pointer font-normal flex items-center gap-2">
              <span className="text-lg">⭐</span>
              <span>Đặt làm địa chỉ mặc định</span>
            </Label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">
          {defaultValues ? 'Cập nhật' : 'Thêm địa chỉ'}
        </Button>
      </div>
    </form>
  );
}
