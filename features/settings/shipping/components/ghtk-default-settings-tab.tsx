/**
 * GHTK Default Settings Tab
 * Cài đặt mặc định cho tài khoản GHTK - Theo API GHTK v1.5
 * https://api.ghtk.vn/docs/submit-order/submit-order-express
 */

import { useState, useImperativeHandle, forwardRef } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { GHTKDefaultSettings } from '@/lib/types/shipping-config';

interface GHTKDefaultSettingsTabProps {
  initialSettings?: GHTKDefaultSettings;
}

export interface GHTKDefaultSettingsTabRef {
  getSettings: () => GHTKDefaultSettings;
}

export const GHTKDefaultSettingsTab = forwardRef<GHTKDefaultSettingsTabRef, GHTKDefaultSettingsTabProps>(
  ({ initialSettings }, ref) => {
    const [transport, setTransport] = useState<'road' | 'fly'>(
      initialSettings?.transport || 'fly'
    );

    const [useReturnAddress, setUseReturnAddress] = useState<0 | 1>(
      initialSettings?.useReturnAddress || 0
    );

    const [deliverWorkShift, setDeliverWorkShift] = useState<'none' | '1' | '2'>(
      initialSettings?.deliverWorkShift ? String(initialSettings.deliverWorkShift) as '1' | '2' : 'none'
    );

    const [pickWorkShift, setPickWorkShift] = useState<'none' | '1' | '2'>(
      initialSettings?.pickWorkShift ? String(initialSettings.pickWorkShift) as '1' | '2' : 'none'
    );

    const [isFreeship, setIsFreeship] = useState<0 | 1>(
      initialSettings?.isFreeship || 0
    );

    const [pickOption, setPickOption] = useState<'cod' | 'post'>(
      initialSettings?.pickOption || 'cod'
    );

    // ❌ Removed: tags and plantSubTags state
    // Tags không được hỗ trợ bởi GHTK API khi tính phí vận chuyển
    // Chỉ dùng khi tạo đơn hàng thật (create order API)

    useImperativeHandle(ref, () => ({
      getSettings: (): GHTKDefaultSettings => ({
        transport,
        useReturnAddress,
        deliverWorkShift: deliverWorkShift === 'none' ? undefined : Number(deliverWorkShift) as 1 | 2,
        pickWorkShift: pickWorkShift === 'none' ? undefined : Number(pickWorkShift) as 1 | 2,
        isFreeship,
        pickOption,
        // ❌ Removed tags and plantSubTags
      }),
    }));

    return (
      <div className="space-y-5 py-4 pr-2">
        <Alert className="py-2">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Cài đặt mặc định sẽ tự động áp dụng khi tạo đơn hàng.
          </AlertDescription>
        </Alert>

        {/* Row 1: Transport + Return Address */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Vận chuyển</Label>
            <RadioGroup value={transport} onValueChange={(v) => setTransport(v as 'road' | 'fly')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fly" id="transport-fly" />
                <Label htmlFor="transport-fly" className="font-normal cursor-pointer text-sm">
                  Đường bay
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="road" id="transport-road" />
                <Label htmlFor="transport-road" className="font-normal cursor-pointer text-sm">
                  Đường bộ
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Địa chỉ trả hàng</Label>
            <Select value={String(useReturnAddress)} onValueChange={(v) => setUseReturnAddress(Number(v) as 0 | 1)}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Địa chỉ lấy hàng</SelectItem>
                <SelectItem value="1">Địa chỉ khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 2: Work Shifts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Ca lấy hàng</Label>
            <Select value={pickWorkShift} onValueChange={(v) => setPickWorkShift(v as 'none' | '1' | '2')}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tự động</SelectItem>
                <SelectItem value="1">Sáng</SelectItem>
                <SelectItem value="2">Chiều</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Ca giao hàng</Label>
            <Select value={deliverWorkShift} onValueChange={(v) => setDeliverWorkShift(v as 'none' | '1' | '2')}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tự động</SelectItem>
                <SelectItem value="1">Sáng</SelectItem>
                <SelectItem value="2">Chiều</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 3: Payment + Pick Option */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Người trả phí</Label>
            <RadioGroup value={String(isFreeship)} onValueChange={(v) => setIsFreeship(Number(v) as 0 | 1)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="payment-customer" />
                <Label htmlFor="payment-customer" className="font-normal cursor-pointer text-sm">
                  Khách trả
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="payment-shop" />
                <Label htmlFor="payment-shop" className="font-normal cursor-pointer text-sm">
                  Shop trả (Freeship)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Lấy hàng tại</Label>
            <RadioGroup value={pickOption} onValueChange={(v) => setPickOption(v as 'cod' | 'post')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cod" id="pick-cod" />
                <Label htmlFor="pick-cod" className="font-normal cursor-pointer text-sm">
                  COD đến lấy
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="post" id="pick-post" />
                <Label htmlFor="pick-post" className="font-normal cursor-pointer text-sm">
                  Gửi bưu cục
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* ❌ TAGS REMOVED - GHTK API không hỗ trợ tags khi tính phí vận chuyển
             Tags chỉ dùng khi tạo đơn hàng thật (create order API), không dùng khi tính phí
             Đã xóa tất cả checkbox tags để tránh nhầm lẫn */}

        <Alert className="py-2">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            GHTK tự động chọn gói: <strong>Tiết kiệm</strong> (&lt;20kg) | <strong>Hàng nặng BBS</strong> (≥20kg)
          </AlertDescription>
        </Alert>
      </div>
    );
  }
);

GHTKDefaultSettingsTab.displayName = 'GHTKDefaultSettingsTab';
