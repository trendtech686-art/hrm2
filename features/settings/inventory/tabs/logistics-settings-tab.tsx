'use client'

import * as React from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { useLogisticsSettingsData, useLogisticsSettingsMutations } from "../hooks/use-logistics-settings";
import type { ProductLogisticsSettings } from "../types";
import type { RegisterTabActions } from "../../use-tab-action-registry";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettingsActionButton } from "@/components/settings/SettingsActionButton";
import { Button } from "@/components/ui/button";

type TabContentProps = { isActive: boolean; onRegisterActions: RegisterTabActions };

export function LogisticsSettingsTabContent({ isActive }: TabContentProps) {
  const { settings } = useLogisticsSettingsData();
  const { save } = useLogisticsSettingsMutations({
    onSuccess: () => toast.success('Đã lưu cài đặt khối lượng & kích thước'),
    onError: () => toast.error('Không thể lưu cài đặt khối lượng'),
  });
  const [localSettings, setLocalSettings] = React.useState<ProductLogisticsSettings>(settings);
  const [isSaving, setIsSaving] = React.useState(false);

  const localSettingsRef = React.useRef(localSettings);
  React.useEffect(() => { localSettingsRef.current = localSettings; }, [localSettings]);
  React.useEffect(() => {
    const current = localSettingsRef.current;
    if (JSON.stringify(current) !== JSON.stringify(settings)) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const hasChanges = React.useMemo(() => JSON.stringify(localSettings) !== JSON.stringify(settings), [localSettings, settings]);

  const updatePreset = (presetKey: keyof ProductLogisticsSettings, field: 'weight' | 'weightUnit' | 'length' | 'width' | 'height', value: number | string | undefined) => {
    setLocalSettings(prev => ({ ...prev, [presetKey]: { ...prev[presetKey], [field]: value } }));
  };

  const handleSave = React.useCallback(async () => {
    setIsSaving(true);
    try { 
      await save.mutateAsync(localSettingsRef.current);
    } finally { 
      setIsSaving(false); 
    }
  }, [save]);

  const renderPreset = (title: string, presetKey: keyof ProductLogisticsSettings, description: string) => (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Khối lượng mặc định</Label><Input type="number" value={localSettings[presetKey]?.weight ?? ''} onChange={(e) => updatePreset(presetKey, 'weight', e.target.value === '' ? undefined : Number(e.target.value))} placeholder="0" /><p className="text-xs text-muted-foreground">Áp dụng khi tạo sản phẩm mới</p></div>
          <div className="space-y-2"><Label>Đơn vị khối lượng</Label><Select value={localSettings[presetKey]?.weightUnit ?? 'g'} onValueChange={(v) => updatePreset(presetKey, 'weightUnit', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="g">g (gram)</SelectItem><SelectItem value="kg">kg (kilogram)</SelectItem></SelectContent></Select></div>
        </div>
        <div className="space-y-2"><Label>Kích thước (cm)</Label><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="space-y-1"><Input type="number" value={localSettings[presetKey]?.length ?? ''} onChange={(e) => updatePreset(presetKey, 'length', e.target.value === '' ? undefined : Number(e.target.value))} placeholder="Dài" /></div><div className="space-y-1"><Input type="number" value={localSettings[presetKey]?.width ?? ''} onChange={(e) => updatePreset(presetKey, 'width', e.target.value === '' ? undefined : Number(e.target.value))} placeholder="Rộng" /></div><div className="space-y-1"><Input type="number" value={localSettings[presetKey]?.height ?? ''} onChange={(e) => updatePreset(presetKey, 'height', e.target.value === '' ? undefined : Number(e.target.value))} placeholder="Cao" /></div></div><p className="text-xs text-muted-foreground">Dùng để ước tính phí vận chuyển</p></div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!hasChanges || isSaving} variant="default">
          <Save className="mr-2 h-4 w-4" />{isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
        </Button>
      </div>
      {renderPreset('Sản phẩm thông thường', 'physicalDefaults', 'Áp dụng cho hàng hóa vật lý, dịch vụ đóng gói sẵn')}
      {renderPreset('Combo sản phẩm', 'comboDefaults', 'Áp dụng khi tạo sản phẩm combo mới')}
    </div>
  );
}
