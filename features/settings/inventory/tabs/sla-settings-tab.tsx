'use client'

import * as React from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useSlaSettingsData, useSlaSettingsMutations } from "../hooks/use-sla-settings";
import type { ProductSlaSettings } from "../types";
import type { RegisterTabActions } from "../../use-tab-action-registry";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsActionButton } from "@/components/settings/SettingsActionButton";

type TabContentProps = { isActive: boolean; onRegisterActions: RegisterTabActions };

export function SlaSettingsTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const { settings } = useSlaSettingsData();
  const { update } = useSlaSettingsMutations({
    onSuccess: () => toast.success('Đã lưu cài đặt cảnh báo tồn kho'),
    onError: () => toast.error('Có lỗi xảy ra khi lưu cài đặt'),
  });
  const updateAsyncRef = React.useRef(update.mutateAsync);
  React.useEffect(() => { updateAsyncRef.current = update.mutateAsync; }, [update.mutateAsync]);
  const [localSettings, setLocalSettings] = React.useState<ProductSlaSettings>(settings);
  const [isSaving, setIsSaving] = React.useState(false);

  const localSettingsRef = React.useRef(localSettings);
  React.useEffect(() => { localSettingsRef.current = localSettings; }, [localSettings]);

  const hasChanges = React.useMemo(() => JSON.stringify(localSettings) !== JSON.stringify(settings), [localSettings, settings]);
  React.useEffect(() => {
    const current = localSettingsRef.current;
    if (JSON.stringify(current) !== JSON.stringify(settings)) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleChange = <K extends keyof ProductSlaSettings>(key: K, value: ProductSlaSettings[K]) => { setLocalSettings(prev => ({ ...prev, [key]: value })); };

  const handleSave = React.useCallback(async () => {
    setIsSaving(true);
    try { 
      await updateAsyncRef.current(localSettingsRef.current);
    } finally { 
      setIsSaving(false); 
    }
  }, []);

  const onRegisterActionsRef = React.useRef(onRegisterActions);
  React.useEffect(() => { onRegisterActionsRef.current = onRegisterActions; }, [onRegisterActions]);

  const actionButton = React.useMemo(() => [
    <SettingsActionButton key="save-sla" onClick={handleSave} disabled={!hasChanges || isSaving}>
      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}{isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
    </SettingsActionButton>
  ], [handleSave, hasChanges, isSaving]);

  React.useEffect(() => { 
    if (!isActive) return;
    onRegisterActionsRef.current(actionButton);
  }, [actionButton, isActive]);

  return (
    <div className="space-y-6">
      <Card><CardHeader><CardTitle>Ngưỡng cảnh báo mặc định</CardTitle><CardDescription>Áp dụng cho các sản phẩm không có cấu hình riêng</CardDescription></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-3 gap-4"><div className="space-y-2"><Label htmlFor="defaultReorderLevel">Mức đặt hàng lại</Label><Input id="defaultReorderLevel" type="number" min={0} value={localSettings.defaultReorderLevel ?? 10} onChange={(e) => handleChange('defaultReorderLevel', parseInt(e.target.value) || 0)} /><p className="text-xs text-muted-foreground">Cảnh báo khi tồn kho ≤ giá trị này</p></div><div className="space-y-2"><Label htmlFor="defaultSafetyStock">Tồn kho an toàn</Label><Input id="defaultSafetyStock" type="number" min={0} value={localSettings.defaultSafetyStock ?? 5} onChange={(e) => handleChange('defaultSafetyStock', parseInt(e.target.value) || 0)} /><p className="text-xs text-muted-foreground">Mức tối thiểu để tránh hết hàng</p></div><div className="space-y-2"><Label htmlFor="defaultMaxStock">Tồn kho tối đa</Label><Input id="defaultMaxStock" type="number" min={0} value={localSettings.defaultMaxStock ?? 100} onChange={(e) => handleChange('defaultMaxStock', parseInt(e.target.value) || 0)} /><p className="text-xs text-muted-foreground">Cảnh báo tồn kho vượt quá</p></div></div></CardContent></Card>

      <Card><CardHeader><CardTitle>Cảnh báo hàng tồn kho lâu</CardTitle><CardDescription>Phát hiện hàng chậm bán hoặc hàng chết — <span className="text-orange-500 font-medium">Sắp ra mắt</span></CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Tính năng này đang được phát triển và sẽ sớm ra mắt.</p></CardContent></Card>

      <Card><CardHeader><CardTitle>Thông báo email</CardTitle><CardDescription>Gửi cảnh báo tự động qua email — <span className="text-orange-500 font-medium">Sắp ra mắt</span></CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Tính năng này đang được phát triển và sẽ sớm ra mắt.</p></CardContent></Card>

      <Card><CardHeader><CardTitle>Hiển thị Dashboard</CardTitle><CardDescription>Cấu hình widget cảnh báo tồn kho trên Dashboard — <span className="text-orange-500 font-medium">Sắp ra mắt</span></CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Tính năng này đang được phát triển và sẽ sớm ra mắt.</p></CardContent></Card>
    </div>
  );
}
