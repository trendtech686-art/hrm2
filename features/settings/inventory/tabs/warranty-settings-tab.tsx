'use client'

import * as React from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { useWarrantySettingsStore, type WarrantySettings } from "../warranty-settings-store";
import type { RegisterTabActions } from "../../use-tab-action-registry";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsActionButton } from "@/components/settings/SettingsActionButton";

type TabContentProps = { isActive: boolean; onRegisterActions: RegisterTabActions };

export function WarrantySettingsTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const { settings, update } = useWarrantySettingsStore();
  const [localSettings, setLocalSettings] = React.useState<WarrantySettings>(settings);
  const [isSaving, setIsSaving] = React.useState(false);

  const localSettingsRef = React.useRef(localSettings);
  React.useEffect(() => { localSettingsRef.current = localSettings; }, [localSettings]);

  const hasChanges = React.useMemo(() => JSON.stringify(localSettings) !== JSON.stringify(settings), [localSettings, settings]);
  React.useEffect(() => { setLocalSettings(settings); }, [settings]);

  const handleChange = <K extends keyof WarrantySettings>(key: K, value: WarrantySettings[K]) => { setLocalSettings(prev => ({ ...prev, [key]: value })); };

  const handleSave = React.useCallback(() => {
    setIsSaving(true);
    try { update(localSettingsRef.current); toast.success('Đã lưu cài đặt bảo hành'); }
    catch (_error) { toast.error('Có lỗi xảy ra khi lưu cài đặt'); }
    finally { setIsSaving(false); }
  }, [update]);

  React.useEffect(() => { if (!isActive) return; onRegisterActions([<SettingsActionButton key="save-warranty" onClick={handleSave} disabled={!hasChanges || isSaving}><Save className="mr-2 h-4 w-4" />{isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}</SettingsActionButton>]); }, [isActive, hasChanges, isSaving, handleSave, onRegisterActions]);

  return (
    <div className="space-y-6">
      <Card><CardHeader><CardTitle>Cài đặt bảo hành mặc định</CardTitle><CardDescription>Thời hạn bảo hành sẽ được áp dụng khi sản phẩm không có cấu hình riêng</CardDescription></CardHeader><CardContent className="space-y-4"><div className="space-y-2 max-w-xs"><Label htmlFor="defaultWarrantyMonths">Thời hạn bảo hành mặc định (tháng)</Label><Input id="defaultWarrantyMonths" type="number" min={0} max={120} value={localSettings.defaultWarrantyMonths ?? 12} onChange={(e) => handleChange('defaultWarrantyMonths', parseInt(e.target.value) || 0)} /><p className="text-xs text-muted-foreground">Áp dụng cho các sản phẩm không được cài đặt thời hạn bảo hành riêng</p></div></CardContent></Card>
    </div>
  );
}
