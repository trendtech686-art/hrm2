/**
 * Enhanced Address Form Component
 * 
 * Smart Auto-Fill:
 * - Chỉ cần chọn 1 field cuối (Ward hoặc District)
 * - Hệ thống tự động điền Province + District/Ward còn lại
 */

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { VirtualizedCombobox, type ComboboxOption } from '@/components/ui/virtualized-combobox';
import { useProvinceStore } from '@/features/settings/provinces/store';
import { asBusinessId } from '@/lib/id-types';
import { createAddress2Level, createAddress3Level } from '../utils/enhanced-address-helper';
import type { AddressLevel } from '../types/enhanced-address';
import { AlertCircle, MapPin, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

type EnhancedAddressFormProps = {
  onSuccess: (address: any) => void;
  onCancel?: () => void;
  defaultValues?: {
    label?: string;
    street?: string;
    provinceId?: string;
    districtId?: number;
    wardId?: string;
  };
};

export function EnhancedAddressForm({ onSuccess, onCancel, defaultValues }: EnhancedAddressFormProps) {
  const { 
    data: provinces, 
    districts,
    getDistrictsByProvinceId, 
    getWardsByDistrictId, 
    getDistrictById,
    getProvinceById,
    getWardById, // NEW: Get ward by ID
    // NEW: 2-level và 3-level riêng biệt
    getWards2LevelByProvinceId,
    getWards3LevelByProvinceId,
  } = useProvinceStore();
  
  // Form state
  const [addressLevel, setAddressLevel] = useState<AddressLevel>('2-level');
  const [label, setLabel] = useState(defaultValues?.label || 'Địa chỉ chính');
  const [street, setStreet] = useState(defaultValues?.street || '');
  const [selectedProvinceId, setSelectedProvinceId] = useState(defaultValues?.provinceId || '');
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | undefined>(defaultValues?.districtId);
  const [selectedWardId, setSelectedWardId] = useState(defaultValues?.wardId || '');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  
  const selectedProvinceBusinessId = selectedProvinceId ? asBusinessId(selectedProvinceId) : undefined;
  const selectedProvince = selectedProvinceBusinessId
    ? getProvinceById(selectedProvinceBusinessId)
    : undefined;

  // UI state
  const [error, setError] = useState('');
  const [autoFillMessage, setAutoFillMessage] = useState('');

  // Smart Auto-fill: When user selects Ward (2-level)
  useEffect(() => {
    if (selectedWardId && addressLevel === '2-level') {
      const ward = getWardById(selectedWardId);
      if (ward?.provinceId) {
        const province = getProvinceById(ward.provinceId);
        
        if (province) {
          // Always auto-fill Province
          setSelectedProvinceId(String(province.id));
          
          // Check if ward has districtId (from 3-level data)
          if (ward.districtId) {
            const district = getDistrictById(ward.districtId);
            if (district) {
              setSelectedDistrictId(district.id);
              toast.success('Đã tự động điền địa chỉ', {
                description: `${province.name} → ${district.name}`,
              });
              setAutoFillMessage(`✨ ${province.name} → ${district.name}`);
            }
          } else {
            // Ward from 2-level data (no district)
            setSelectedDistrictId(undefined);
            toast.success('Đã tự động điền tỉnh/thành phố', {
              description: province.name,
            });
            setAutoFillMessage(`✨ ${province.name} (Địa chỉ 2 cấp - không có quận/huyện)`);
          }
        }
      }
    } else {
      setAutoFillMessage('');
    }
  }, [selectedWardId, addressLevel, getWardById, getDistrictById, getProvinceById]);

  // Smart Auto-fill: When user selects District (3-level)
  useEffect(() => {
    if (selectedDistrictId && addressLevel === '3-level') {
      const district = getDistrictById(selectedDistrictId);
      if (district?.provinceId) {
        const province = getProvinceById(district.provinceId);
        if (province) {
          // Auto-fill Province
          setSelectedProvinceId(String(province.id));
          
          // Toast notification
          toast.success('Đã tự động điền tỉnh/thành phố', {
            description: province.name,
          });
          
          setAutoFillMessage(`✨ ${province.name}`);
        }
      }
    } else if (addressLevel === '3-level') {
      setAutoFillMessage('');
    }
  }, [selectedDistrictId, addressLevel, getDistrictById, getProvinceById]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate
    if (!label || !street) {
      setError('Vui lòng điền Nhãn và Địa chỉ đường phố');
      return;
    }

    // For 2-level: Only ward is required
    if (addressLevel === '2-level' && !selectedWardId) {
      setError('Vui lòng chọn Phường/Xã');
      return;
    }

    // For 3-level: District or Ward is required
    if (addressLevel === '3-level' && !selectedDistrictId && !selectedWardId) {
      setError('Vui lòng chọn Quận/Huyện hoặc Phường/Xã');
      return;
    }

    // Get final data
    const province = selectedProvinceBusinessId
      ? getProvinceById(selectedProvinceBusinessId)
      : undefined;
    const district = selectedDistrictId ? getDistrictById(selectedDistrictId) : null;
    const ward = selectedWardId ? getWardById(selectedWardId) : null;

    if (!province) {
      setError('Tỉnh/Thành phố không hợp lệ');
      return;
    }

    let result;

    if (addressLevel === '2-level') {
      if (!ward) {
        setError('Vui lòng chọn Phường/Xã');
        return;
      }

      // Check if ward has districtId (from 3-level data)
      if (district) {
        // Ward with district → Use createAddress2Level (will auto-fill district)
        result = createAddress2Level({
          label,
          street,
          province: province.name,
          provinceId: province.id,
          ward: ward.name,
          wardId: ward.id,
          contactName: contactName || undefined,
          contactPhone: contactPhone || undefined,
          isDefault: true,
          isShipping: true,
        });
      } else {
        // Pure 2-level ward (no district) → Create address without district
        result = {
          success: true,
          address: {
            id: `ADDR_${Date.now()}`,
            label,
            street,
            province: province.name,
            provinceId: province.id,
            district: '', // Empty for pure 2-level
            districtId: 0, // 0 for pure 2-level
            ward: ward.name,
            wardId: ward.id,
            inputLevel: '2-level' as AddressLevel,
            autoFilled: false, // No district to auto-fill
            contactName: contactName || undefined,
            contactPhone: contactPhone || undefined,
            isDefault: true,
            isShipping: true,
            isBilling: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
      }
    } else {
      // 3-level: Need both district and ward
      if (!district || !ward) {
        setError('Vui lòng chọn đầy đủ Quận/Huyện và Phường/Xã');
        return;
      }

      result = createAddress3Level({
        label,
        street,
        province: province.name,
        provinceId: province.id,
        district: district.name,
        districtId: district.id,
        ward: ward.name,
        wardId: ward.id,
        contactName: contactName || undefined,
        contactPhone: contactPhone || undefined,
        isDefault: true,
        isShipping: true,
      });
    }

    if (!result.success) {
      setError(result.error || 'Có lỗi xảy ra');
      return;
    }

    toast.success('Địa chỉ đã được lưu thành công!');
    onSuccess(result.address);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Address Level Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Chọn loại địa chỉ
        </Label>
        <RadioGroup value={addressLevel} onValueChange={(v) => setAddressLevel(v as AddressLevel)}>
          <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
            <RadioGroupItem value="2-level" id="2-level" />
            <Label htmlFor="2-level" className="cursor-pointer flex-1">
              <div className="font-medium">Địa chỉ 2 cấp</div>
              <div className="text-sm text-muted-foreground">
                Tỉnh/TP + Phường/Xã (Có thể chuyển đổi sang 3 cấp sau)
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
            <RadioGroupItem value="3-level" id="3-level" />
            <Label htmlFor="3-level" className="cursor-pointer flex-1">
              <div className="font-medium">Địa chỉ 3 cấp (Đề xuất)</div>
              <div className="text-sm text-muted-foreground">
                Tỉnh/TP + Quận/Huyện + Phường/Xã (Tự động tạo version 2 cấp)
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Label */}
      <div className="space-y-2">
        <Label htmlFor="label">Nhãn địa chỉ *</Label>
        <Input
          id="label"
          placeholder="Nhà riêng, Văn phòng, Kho hàng..."
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />
      </div>

      {/* Street */}
      <div className="space-y-2">
        <Label htmlFor="street">Địa chỉ đường phố *</Label>
        <Input
          id="street"
          placeholder="Số nhà, tên đường..."
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          required
        />
      </div>

      {/* Smart Fields based on Address Level */}
      {addressLevel === '2-level' ? (
        <>
          {/* 2-LEVEL: Province + Ward ONLY (no District) */}
          <div className="space-y-2">
            <Label htmlFor="province">Tỉnh/Thành phố *</Label>
            <VirtualizedCombobox
              value={selectedProvinceId ? { 
                value: selectedProvinceId, 
                label: selectedProvince?.name || '' 
              } : null}
              onChange={(option) => {
                setSelectedProvinceId(option?.value || '');
                setSelectedWardId(''); // Reset ward khi đổi province
              }}
              options={provinces.map(p => ({ value: String(p.id), label: p.name }))}
              placeholder="Chọn tỉnh/thành phố..."
              searchPlaceholder="Gõ để tìm tỉnh/thành phố"
              emptyPlaceholder="Không tìm thấy"
            />
          </div>

          {/* Ward selector - Tất cả wards trong province */}
          {selectedProvinceId && (
            <div className="space-y-2">
              <Label htmlFor="ward">Phường/Xã *</Label>
              <VirtualizedCombobox
                value={selectedWardId ? { 
                  value: selectedWardId, 
                  label: selectedProvinceBusinessId
                    ? getWards2LevelByProvinceId(selectedProvinceBusinessId).find(w => w.id === selectedWardId)?.name || ''
                    : ''
                } : null}
                onChange={(option) => setSelectedWardId(option?.value || '')}
                options={(() => {
                  const wards = selectedProvinceBusinessId
                    ? getWards2LevelByProvinceId(selectedProvinceBusinessId)
                    : [];
                  console.log('[FORM 2-LEVEL] Getting wards for province:', {
                    selectedProvinceId,
                    province: selectedProvince,
                    wardsCount: wards.length,
                    sample: wards.slice(0, 3).map(w => ({ id: w.id, name: w.name, provinceId: w.provinceId }))
                  });
                  return wards
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(w => ({ 
                      value: w.id, 
                      label: w.name
                    }));
                })()}
                placeholder="Tìm và chọn phường/xã..."
                searchPlaceholder="Gõ để tìm phường/xã (2 cấp - Luật 2025)"
                emptyPlaceholder="Không tìm thấy phường/xã"
              />
            </div>
          )}
        </>
      ) : (
        <>
          {/* 3-LEVEL: Province + District + Ward (full structure) */}
          <div className="space-y-2">
            <Label htmlFor="province">Tỉnh/Thành phố *</Label>
            <VirtualizedCombobox
              value={selectedProvinceId ? { 
                value: selectedProvinceId, 
                label: selectedProvince?.name || '' 
              } : null}
              onChange={(option) => {
                setSelectedProvinceId(option?.value || '');
                setSelectedDistrictId(undefined); // Reset district
                setSelectedWardId(''); // Reset ward
              }}
              options={provinces.map(p => ({ value: String(p.id), label: p.name }))}
              placeholder="Chọn tỉnh/thành phố..."
              searchPlaceholder="Gõ để tìm tỉnh/thành phố"
              emptyPlaceholder="Không tìm thấy"
            />
          </div>

          {/* District selector */}
          {selectedProvinceId && (
            <div className="space-y-2">
              <Label htmlFor="district">Quận/Huyện *</Label>
              <VirtualizedCombobox
                value={selectedDistrictId ? { 
                  value: selectedDistrictId.toString(), 
                  label: getDistrictById(selectedDistrictId)?.name || '' 
                } : null}
                onChange={(option) => {
                  setSelectedDistrictId(option ? parseInt(option.value, 10) : undefined);
                  setSelectedWardId(''); // Reset ward khi đổi district
                }}
                options={(selectedProvinceBusinessId
                  ? getDistrictsByProvinceId(selectedProvinceBusinessId)
                  : []
                ).map(d => ({
                  value: d.id.toString(),
                  label: d.name,
                }))}
                placeholder="Tìm và chọn quận/huyện..."
                searchPlaceholder="Gõ để tìm quận/huyện"
                emptyPlaceholder="Không tìm thấy quận/huyện"
              />
            </div>
          )}

          {/* Ward selector - Theo district đã chọn */}
          {selectedDistrictId && (
            <div className="space-y-2">
              <Label htmlFor="ward">Phường/Xã *</Label>
              <VirtualizedCombobox
                value={selectedWardId ? { 
                  value: selectedWardId, 
                  label: getWardsByDistrictId(selectedDistrictId).find(w => w.id === selectedWardId)?.name || '' 
                } : null}
                onChange={(option) => setSelectedWardId(option?.value || '')}
                options={getWardsByDistrictId(selectedDistrictId)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(w => ({ 
                    value: w.id, 
                    label: w.name
                  }))}
                placeholder="Tìm và chọn phường/xã..."
                searchPlaceholder="Gõ để tìm phường/xã (3 cấp - Legacy)"
                emptyPlaceholder="Không tìm thấy phường/xã"
              />
            </div>
          )}
        </>
      )}

      {/* Auto-fill Success Message */}
      {autoFillMessage && (
        <Alert className="border-green-200 bg-green-50">
          <Sparkles className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700 text-sm">
            {autoFillMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Contact Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactName">Người liên hệ</Label>
          <Input
            id="contactName"
            placeholder="Tên người nhận"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Số điện thoại</Label>
          <Input
            id="contactPhone"
            placeholder="0123456789"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        )}
        <Button type="submit">
          Lưu địa chỉ
        </Button>
      </div>
    </form>
  );
}
