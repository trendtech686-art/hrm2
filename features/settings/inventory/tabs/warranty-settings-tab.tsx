'use client'

import * as React from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { useWarrantySettingsData, useWarrantySettingsMutations, type WarrantySettings } from "../hooks/use-warranty-settings";
import type { RegisterTabActions } from "../../use-tab-action-registry";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsActionButton } from "@/components/settings/SettingsActionButton";

type TabContentProps = { isActive: boolean; onRegisterActions: RegisterTabActions };

export function WarrantySettingsTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const { settings } = useWarrantySettingsData();
  const { update } = useWarrantySettingsMutations({
    onSuccess: () => toast.success('Đã lưu cài đặt bảo hành'),
    onError: () => toast.error('Có lỗi xảy ra khi lưu cài đặt'),
  });
  const [localSettings, setLocalSettings] = React.useState<WarrantySettings>(settings);
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

  const handleChange = <K extends keyof WarrantySettings>(key: K, value: WarrantySettings[K]) => { setLocalSettings(prev => ({ ...prev, [key]: value })); };

  const handleSave = React.useCallback(async () => {
    setIsSaving(true);
    try { 
      await update.mutateAsync(localSettingsRef.current);
    } finally { 
      setIsSaving(false); 
    }
  }, [update]);

  const onRegisterActionsRef = React.useRef(onRegisterActions);
  React.useEffect(() => { onRegisterActionsRef.current = onRegisterActions; }, [onRegisterActions]);

  const actionButton = React.useMemo(() => [
    <SettingsActionButton key="save-warranty" onClick={handleSave} disabled={!hasChanges || isSaving}>
      <Save className="mr-2 h-4 w-4" />{isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
    </SettingsActionButton>
  ], [handleSave, hasChanges, isSaving]);

  const lastActionsSentRef = React.useRef<React.ReactNode[] | null>(null);
  React.useEffect(() => { 
    if (!isActive) return;
    if (lastActionsSentRef.current === actionButton) return;
    lastActionsSentRef.current = actionButton;
    onRegisterActionsRef.current(actionButton);
  }, [isActive, actionButton]);

  return (
    <div className="space-y-6">
      <Card><CardHeader><CardTitle>Cài đặt bảo hành mặc định</CardTitle><CardDescription>Thời hạn bảo hành sẽ được áp dụng khi sản phẩm không có cấu hình riêng</CardDescription></CardHeader><CardContent className="space-y-4"><div className="space-y-2 max-w-xs"><Label htmlFor="defaultWarrantyMonths">Thời hạn bảo hành mặc định (tháng)</Label><Input id="defaultWarrantyMonths" type="number" min={0} max={120} value={localSettings.defaultWarrantyMonths ?? 12} onChange={(e) => handleChange('defaultWarrantyMonths', parseInt(e.target.value) || 0)} /><p className="text-xs text-muted-foreground">Áp dụng cho các sản phẩm không được cài đặt thời hạn bảo hành riêng</p></div></CardContent></Card>
    </div>
  );
}
