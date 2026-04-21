'use client';

/**
 * Global Shipping Config Tab - V2
 * Global settings for all shipping partners
 */

import { useCallback, useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Save, Loader2 } from 'lucide-react';
import type { GlobalShippingConfig, WeightMode, DeliveryRequirement } from '@/lib/types/shipping-config';
import { loadShippingConfigAsync } from '@/lib/utils/shipping-config-migration';
import { toast } from 'sonner';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { SettingsActionButton } from '@/components/settings/SettingsActionButton';
import type { RegisterTabActions } from '../../use-tab-action-registry';
import { logError } from '@/lib/logger'

type GlobalShippingConfigTabProps = {
  isActive: boolean;
  onRegisterActions: RegisterTabActions;
};

export function GlobalShippingConfigTab({ isActive, onRegisterActions }: GlobalShippingConfigTabProps) {
  const queryClient = useQueryClient();
  const [config, setConfig] = useState<GlobalShippingConfig>({
    weight: { mode: 'FROM_PRODUCTS', customValue: 500 },
    dimensions: { length: 30, width: 20, height: 10 },
    requirement: 'ALLOW_CHECK_NOT_TRY',
    note: '',
    autoSyncCancelStatus: false,
    autoSyncCODCollection: false,
    autoCreateReconciliationSheet: false,
    latePickupWarningDays: 2,
    lateDeliveryWarningDays: 7,
    productSendMode: 'all',
  });

  // ✅ Use ref so handleSave always reads the latest config without being recreated
  // This avoids stale closure because page-header fingerprint uses onClick.toString()
  // which doesn't detect closure variable changes
  const configRef = useRef(config);
  configRef.current = config;

  // ✅ Load from DB on mount to ensure fresh data (no sync fallback)
  useEffect(() => {
    loadShippingConfigAsync(true).then(fullConfig => {
      setConfig(fullConfig.global);
    });
  }, []);

  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = <K extends keyof GlobalShippingConfig>(
    section: K,
    field: string,
    value: unknown
  ) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, unknown>),
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (currentConfig: GlobalShippingConfig) => {
      // Always fetch fresh config from DB to avoid overwriting partner data with defaults
      const fullConfig = await loadShippingConfigAsync(true);
      fullConfig.global = { ...fullConfig.global, ...currentConfig };
      fullConfig.lastUpdated = new Date().toISOString();

      const response = await fetch('/api/shipping-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullConfig),
      });
      if (!response.ok) throw new Error('Lưu cấu hình thất bại');
      return fullConfig;
    },
    onSuccess: async () => {
      await loadShippingConfigAsync(true);
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
      setHasChanges(false);
      toast.success('Lưu cấu hình thành công');
    },
    onError: (error) => {
      logError('Failed to save config', error);
      toast.error('Lỗi', { description: 'Không thể lưu cấu hình. Vui lòng thử lại.' });
    },
  });

  const handleSave = useCallback(() => {
    saveMutation.mutate(configRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ Empty deps — handleSave is stable, reads config from ref

  const onRegisterActionsRef = useRef(onRegisterActions);
  useEffect(() => { onRegisterActionsRef.current = onRegisterActions; }, [onRegisterActions]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    onRegisterActionsRef.current([
      <SettingsActionButton key="save" onClick={handleSave} disabled={!hasChanges || saveMutation.isPending}>
        {saveMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} {saveMutation.isPending ? 'Đang lưu...' : 'Lưu cấu hình'}
      </SettingsActionButton>,
    ]);
  }, [handleSave, isActive, hasChanges, saveMutation.isPending]);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Cấu hình chung</CardTitle>
          <CardDescription>
            Cài đặt mặc định cho tất cả đối tác vận chuyển
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Weight Settings */}
        <Card>
        <CardHeader>
          <CardTitle>Cân nặng</CardTitle>
          <CardDescription>Cấu hình cách tính cân nặng đơn hàng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nguồn cân nặng</Label>
            <Select
              value={config.weight.mode}
              onValueChange={(value: WeightMode) => handleChange('weight', 'mode', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FROM_PRODUCTS">Từ sản phẩm</SelectItem>
                <SelectItem value="CUSTOM">Tùy chỉnh</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {config.weight.mode === 'FROM_PRODUCTS' 
                ? 'Tính tổng cân nặng từ các sản phẩm trong đơn'
                : 'Sử dụng giá trị cố định cho mọi đơn hàng'}
            </p>
          </div>

          {config.weight.mode === 'CUSTOM' && (
            <div className="space-y-2">
              <Label>Cân nặng mặc định (gram)</Label>
              <Input
                type="number"
                value={config.weight.customValue}
                onChange={(e) => handleChange('weight', 'customValue', parseInt(e.target.value) || 0)}
                min={0}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dimensions */}
      <Card>
        <CardHeader>
          <CardTitle>Kích thước</CardTitle>
          <CardDescription>Kích thước gói hàng mặc định (cm)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Dài (cm)</Label>
              <Input
                type="number"
                value={config.dimensions.length}
                onChange={(e) => handleChange('dimensions', 'length', parseInt(e.target.value) || 0)}
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label>Rộng (cm)</Label>
              <Input
                type="number"
                value={config.dimensions.width}
                onChange={(e) => handleChange('dimensions', 'width', parseInt(e.target.value) || 0)}
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label>Cao (cm)</Label>
              <Input
                type="number"
                value={config.dimensions.height}
                onChange={(e) => handleChange('dimensions', 'height', parseInt(e.target.value) || 0)}
                min={0}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu giao hàng</CardTitle>
          <CardDescription>Quy định về việc kiểm tra hàng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Cho phép kiểm tra hàng</Label>
            <Select
              value={config.requirement}
              onValueChange={(value: DeliveryRequirement) => setConfig(prev => ({ ...prev, requirement: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALLOW_CHECK_NOT_TRY">Cho xem hàng, không cho thử</SelectItem>
                <SelectItem value="ALLOW_TRY">Cho thử hàng</SelectItem>
                <SelectItem value="NOT_ALLOW_CHECK">Không cho xem hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Ghi chú giao hàng</Label>
            <Textarea
              value={config.note}
              onChange={(e) => setConfig(prev => ({ ...prev, note: e.target.value }))}
              placeholder="Ví dụ: Gọi trước khi giao, giao giờ hành chính..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Auto Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Đồng bộ tự động</CardTitle>
          <CardDescription>Tự động cập nhật trạng thái từ đối tác vận chuyển</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tự động cập nhật trạng thái hủy đơn</Label>
              <p className="text-xs text-muted-foreground">
                Khi đơn hàng bị hủy ở đối tác vận chuyển, tự động cập nhật trong hệ thống
              </p>
            </div>
            <Switch
              checked={config.autoSyncCancelStatus}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoSyncCancelStatus: checked }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tự động cập nhật thu hộ COD</Label>
              <p className="text-xs text-muted-foreground">
                Khi đối tác xác nhận đã thu tiền COD, tự động cập nhật vào hệ thống
              </p>
            </div>
            <Switch
              checked={config.autoSyncCODCollection}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoSyncCODCollection: checked }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tự động tạo phiếu đối soát</Label>
              <p className="text-xs text-muted-foreground">
                Khi đối tác xác nhận đã đối soát COD (status 6), tự động tạo phiếu đối soát trong hệ thống
              </p>
            </div>
            <Switch
              checked={config.autoCreateReconciliationSheet}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoCreateReconciliationSheet: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Product Send Mode */}
      <Card>
        <CardHeader>
          <CardTitle>Gửi sản phẩm qua API</CardTitle>
          <CardDescription>Cấu hình cách gửi danh sách sản phẩm khi tạo đơn vận chuyển</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Gộp thành 1 sản phẩm &quot;Phụ Kiện&quot;</Label>
              <p className="text-xs text-muted-foreground">
                Bật: Gửi 1 sản phẩm duy nhất tên &quot;Phụ Kiện&quot; (số lượng 1) — phù hợp đơn BBS/hàng cồng kềnh.
                <br />
                Tắt: Gửi toàn bộ danh sách sản phẩm chi tiết trong đơn hàng.
              </p>
            </div>
            <Switch
              checked={config.productSendMode === 'single'}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, productSendMode: checked ? 'single' : 'all' }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Warning Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Cảnh báo</CardTitle>
          <CardDescription>Cấu hình thời gian cảnh báo đơn hàng chậm</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Cảnh báo chậm lấy hàng (ngày)</Label>
            <Input
              type="number"
              value={config.latePickupWarningDays}
              onChange={(e) => setConfig(prev => ({ ...prev, latePickupWarningDays: parseInt(e.target.value) || 0 }))}
              min={0}
            />
            <p className="text-xs text-muted-foreground">
              Cảnh báo khi đơn hàng chưa được lấy sau X ngày
            </p>
          </div>

          <div className="space-y-2">
            <Label>Cảnh báo chậm giao hàng (ngày)</Label>
            <Input
              type="number"
              value={config.lateDeliveryWarningDays}
              onChange={(e) => setConfig(prev => ({ ...prev, lateDeliveryWarningDays: parseInt(e.target.value) || 0 }))}
              min={0}
            />
            <p className="text-xs text-muted-foreground">
              Cảnh báo khi đơn hàng chưa được giao sau X ngày kể từ khi lấy hàng
            </p>
          </div>
        </CardContent>
      </Card>
      </CardContent>
    </Card>
  );
}
