/**
 * Address Bidirectional Converter
 * 
 * Chuyển đổi 2 chiều:
 * - 2 cấp → 3 cấp: Tạo địa chỉ mới với district (dùng AddressConversionDialog)
 * - 3 cấp → 2 cấp: Tạo địa chỉ mới bỏ district
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { AddressConversionDialog } from './address-conversion-dialog';
import { findAllNewWards } from '@/features/settings/provinces/ward-old-to-new-mapping';
import { useProvinceStore } from '@/features/settings/provinces/store';
import { asBusinessId } from '@/lib/id-types';
import type { EnhancedCustomerAddress } from '../types/enhanced-address';
import type { WardMapping } from '@/features/settings/provinces/ward-old-to-new-mapping';

type AddressBidirectionalConverterProps = {
  address: EnhancedCustomerAddress;
  onSuccess: (newAddress: EnhancedCustomerAddress) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function AddressBidirectionalConverter({
  address,
  onSuccess,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AddressBidirectionalConverterProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedWardMapping, setSelectedWardMapping] = useState<WardMapping | null>(null);
  const { getWards2LevelByProvinceId } = useProvinceStore();

  // Use controlled or uncontrolled mode
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = controlledOnOpenChange || setInternalOpen;

  // Auto-select nếu chỉ có 1 kết quả
  useEffect(() => {
    if (isOpen && address.inputLevel === '3-level') {
      console.log('🔍 Finding NEW wards (2-level) for OLD ward:', {
        oldWardName: address.ward,
        provinceName: address.province
      });
      
      // 3-level (cũ) → 2-level (mới): Tìm NEW ward từ OLD ward
      const allNewWardMappings = findAllNewWards(address.ward, address.province);
      
      console.log('✅ Found NEW ward mappings:', allNewWardMappings);
      
      if (allNewWardMappings.length === 1) {
        setSelectedWardMapping(allNewWardMappings[0]);
        console.log('✓ Auto-selected:', allNewWardMappings[0]);
      } else if (allNewWardMappings.length === 0) {
        setSelectedWardMapping(null);
        console.log('❌ No mapping found - ward không có trong FILE3 hoặc không được sáp nhập');
      } else {
        setSelectedWardMapping(null);
        console.log('⚠️ Multiple results, user must select');
      }
    }
  }, [isOpen, address.ward, address.inputLevel, address.province]);

  // Case 1: Địa chỉ 2 cấp → 3 cấp (cần chọn district)
  if (address.inputLevel === '2-level') {
    return (
      <AddressConversionDialog
        address={address}
        onSuccess={onSuccess}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    );
  }

  // Case 2: Địa chỉ 3 cấp (cũ) → 2 cấp (mới) - tìm ward 2 cấp tương ứng
  const handleConvert3To2 = () => {
    if (!selectedWardMapping) {
      toast.error('Vui lòng chọn Phường/Xã 2 cấp');
      return;
    }
    
    // newWardName là ward 2 cấp (sau sáp nhập - không có district)
    const newWard = selectedWardMapping.newWardName;
    
    // Tìm wardId từ store (ward 2 cấp không có districtId)
    const wards2Level = getWards2LevelByProvinceId(asBusinessId(address.provinceId));
    console.log('🔍 Looking for 2-level ward:', {
      wardName: newWard,
      provinceId: address.provinceId,
      available2LevelWards: wards2Level.length,
      sample: wards2Level.slice(0, 3),
    });
    
    const foundWard = wards2Level.find(w => w.name === newWard);
    
    if (!foundWard) {
      console.error('❌ Ward not found:', {
        wardName: newWard,
        available2LevelWards: wards2Level.map(w => w.name),
      });
      toast.error('Không tìm thấy ward trong database', {
        description: 'Vui lòng thử lại hoặc chọn ward khác',
      });
      return;
    }
    
    console.log('✅ Found ward:', foundWard);
    
    if (!foundWard) {
      toast.error('Không tìm thấy ward trong database', {
        description: 'Vui lòng thử lại hoặc chọn ward khác',
      });
      return;
    }
    
    // Tạo địa chỉ mới 2 cấp với ward đã chọn
    const newAddress: EnhancedCustomerAddress = {
      ...address,
      id: crypto.randomUUID(),
      label: `${address.label} (2 cấp)`,
      inputLevel: '2-level',
      district: '',
      districtId: 0,
      ward: newWard,
      wardId: foundWard.id,
      autoFilled: false,
      convertedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    toast.success('Đã tạo địa chỉ 2 cấp mới!', {
      description: `Ward 2 cấp: ${newWard}`,
    });
    
    onSuccess(newAddress);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-full sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Chuyển đổi sang địa chỉ 2 cấp</DialogTitle>
          <DialogDescription className="text-sm">
            Tạo địa chỉ mới 2 cấp (bỏ Quận/Huyện) - Hệ thống tự động tìm Phường/Xã tương ứng
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Comparison: 3 cấp vs 2 cấp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {/* Current Address (3 cấp) */}
            <div className="space-y-2">
              <div className="font-medium text-sm flex items-center gap-2">
                <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">Hiện tại</span>
                <span className="text-xs sm:text-sm">Địa chỉ 3 cấp</span>
              </div>
              <div className="bg-muted p-3 sm:p-4 rounded-lg text-sm space-y-1.5">
                <div className="font-medium">{address.label}</div>
                <div className="text-muted-foreground text-xs sm:text-sm">{address.street}</div>
                <div className="text-xs sm:text-sm">{address.ward}</div>
                <div className="text-xs sm:text-sm">{address.district}</div>
                <div className="font-medium text-xs sm:text-sm">{address.province}</div>
              </div>
            </div>

            {/* Preview Address (2 cấp) */}
            {(() => {
              const allNewWardMappings = findAllNewWards(address.ward, address.province);
              const hasMapping = allNewWardMappings.length > 0;
              
              return (
                <div className="space-y-2">
                  <div className="font-medium text-sm flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Mới</span>
                    <span className="text-xs sm:text-sm">Địa chỉ 2 cấp</span>
                  </div>
                  <div className={`p-3 sm:p-4 rounded-lg text-sm space-y-1.5 ${hasMapping ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
                    <div className="font-medium">{address.label} (2 cấp)</div>
                    <div className="text-muted-foreground text-xs sm:text-sm">{address.street}</div>
                    {hasMapping ? (
                      <>
                        <div className="text-green-700 font-medium text-xs sm:text-sm">
                          ✓ Tìm thấy {allNewWardMappings.length} phường/xã
                        </div>
                        <div className="max-h-20 overflow-y-auto space-y-0.5">
                          {allNewWardMappings.map((m, i) => (
                            <div key={i} className="text-xs sm:text-sm text-green-600">• {m.newWardName}</div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-orange-600 text-xs sm:text-sm">⚠️ Không tìm thấy</div>
                    )}
                    <div className="text-muted-foreground italic text-xs">(Bỏ Quận/Huyện)</div>
                    <div className="font-medium text-xs sm:text-sm">{address.province}</div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Ward Selection */}
          {(() => {
            const allNewWardMappings = findAllNewWards(address.ward, address.province);
            
            if (allNewWardMappings.length > 0) {
              return (
                <div className="space-y-3">
                  <div className="text-sm font-medium bg-blue-50 border border-blue-200 p-2.5 sm:p-3 rounded-lg flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Chọn Phường/Xã 2 cấp phù hợp ({allNewWardMappings.length} kết quả) *</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto border rounded-lg p-2 sm:p-3">
                    {allNewWardMappings.map((mapping, idx) => (
                      <label
                        key={idx}
                        className={`flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedWardMapping?.newWardName === mapping.newWardName && selectedWardMapping?.oldWardName === mapping.oldWardName
                            ? 'bg-blue-50 border-blue-400 shadow-sm'
                            : 'hover:bg-muted/50 border-border'
                        }`}
                      >
                        <input
                          type="radio"
                          name="ward-selection"
                          checked={selectedWardMapping?.newWardName === mapping.newWardName && selectedWardMapping?.oldWardName === mapping.oldWardName}
                          onChange={() => setSelectedWardMapping(mapping)}
                          className="mt-0.5 sm:mt-1 h-4 w-4 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="font-semibold text-green-700 flex-1 text-xs sm:text-sm">
                              {mapping.newWardName}
                            </div>
                            <div className="text-xs bg-green-100 text-green-700 px-1.5 sm:px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0">
                              {mapping.provinceName}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Địa chỉ đầy đủ:</span> {address.street}, {mapping.newWardName}, {mapping.provinceName}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 pt-1 border-t">
                            <span className="font-medium">Nguồn gốc từ ward 3 cấp:</span> {mapping.oldWardName}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            }
            
            return (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs sm:text-sm">
                  <strong>Không tìm thấy Phường/Xã 2 cấp tương ứng.</strong><br/>
                  Sau khi tạo, vui lòng chọn lại Phường/Xã 2 cấp thủ công.
                </AlertDescription>
              </Alert>
            );
          })()}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-auto order-2 sm:order-1">
            Hủy
          </Button>
          <Button 
            onClick={handleConvert3To2}
            disabled={!selectedWardMapping}
            className="w-full sm:w-auto sm:min-w-[180px] order-1 sm:order-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tạo địa chỉ mới
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
