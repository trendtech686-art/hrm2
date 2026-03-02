'use client'

import * as React from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { useSlaSettingsData, useSlaSettingsMutations } from "../hooks/use-sla-settings";
import type { ProductSlaSettings } from "../types";
import type { RegisterTabActions } from "../../use-tab-action-registry";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
      <Save className="mr-2 h-4 w-4" />{isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
    </SettingsActionButton>
  ], [handleSave, hasChanges, isSaving]);

  React.useEffect(() => { 
    if (!isActive) return;
    onRegisterActionsRef.current(actionButton);
  }, [actionButton, isActive]);

  const alertTypeOptions = [{ value: 'out_of_stock', label: 'Hết hàng' }, { value: 'low_stock', label: 'Sắp hết hàng' }, { value: 'below_safety', label: 'Dưới tồn kho an toàn' }, { value: 'over_stock', label: 'Vượt tồn kho tối đa' }, { value: 'dead_stock', label: 'Hàng tồn lâu' }];

  return (
    <div className="space-y-6">
      <Card><CardHeader><CardTitle>Ngưỡng cảnh báo mặc định</CardTitle><CardDescription>Áp dụng cho các sản phẩm không có cấu hình riêng</CardDescription></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-3 gap-4"><div className="space-y-2"><Label htmlFor="defaultReorderLevel">Mức đặt hàng lại</Label><Input id="defaultReorderLevel" type="number" min={0} value={localSettings.defaultReorderLevel ?? 10} onChange={(e) => handleChange('defaultReorderLevel', parseInt(e.target.value) || 0)} /><p className="text-xs text-muted-foreground">Cảnh báo khi tồn kho ≤ giá trị này</p></div><div className="space-y-2"><Label htmlFor="defaultSafetyStock">Tồn kho an toàn</Label><Input id="defaultSafetyStock" type="number" min={0} value={localSettings.defaultSafetyStock ?? 5} onChange={(e) => handleChange('defaultSafetyStock', parseInt(e.target.value) || 0)} /><p className="text-xs text-muted-foreground">Mức tối thiểu để tránh hết hàng</p></div><div className="space-y-2"><Label htmlFor="defaultMaxStock">Tồn kho tối đa</Label><Input id="defaultMaxStock" type="number" min={0} value={localSettings.defaultMaxStock ?? 100} onChange={(e) => handleChange('defaultMaxStock', parseInt(e.target.value) || 0)} /><p className="text-xs text-muted-foreground">Cảnh báo tồn kho vượt quá</p></div></div></CardContent></Card>

      <Card><CardHeader><CardTitle>Cảnh báo hàng tồn kho lâu</CardTitle><CardDescription>Phát hiện hàng chậm bán hoặc hàng chết</CardDescription></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="slowMovingDays">Hàng chậm bán (ngày)</Label><Input id="slowMovingDays" type="number" min={1} value={localSettings.slowMovingDays ?? 30} onChange={(e) => handleChange('slowMovingDays', parseInt(e.target.value) || 30)} /><p className="text-xs text-muted-foreground">Không bán trong X ngày → Hàng chậm</p></div><div className="space-y-2"><Label htmlFor="deadStockDays">Hàng chết (ngày)</Label><Input id="deadStockDays" type="number" min={1} value={localSettings.deadStockDays ?? 90} onChange={(e) => handleChange('deadStockDays', parseInt(e.target.value) || 90)} /><p className="text-xs text-muted-foreground">Không bán trong X ngày → Hàng chết</p></div></div></CardContent></Card>

      <Card><CardHeader><CardTitle>Thông báo email</CardTitle><CardDescription>Gửi cảnh báo tự động qua email</CardDescription></CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between"><div><Label>Bật thông báo email</Label><p className="text-xs text-muted-foreground">Gửi email khi có cảnh báo tồn kho</p></div><Switch checked={localSettings.enableEmailAlerts ?? false} onCheckedChange={(c) => handleChange('enableEmailAlerts', c)} /></div>{localSettings.enableEmailAlerts && (<><div className="space-y-2"><Label>Tần suất gửi</Label><Select value={localSettings.alertFrequency ?? 'daily'} onValueChange={(v) => handleChange('alertFrequency', v as ProductSlaSettings['alertFrequency'])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="realtime">Thời gian thực</SelectItem><SelectItem value="daily">Hàng ngày</SelectItem><SelectItem value="weekly">Hàng tuần</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label>Email nhận thông báo</Label><Input placeholder="email1@example.com, email2@example.com" value={(localSettings.alertEmailRecipients ?? []).join(', ')} onChange={(e) => handleChange('alertEmailRecipients', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} /><p className="text-xs text-muted-foreground">Phân cách nhiều email bằng dấu phẩy</p></div></>)}</CardContent></Card>

      <Card><CardHeader><CardTitle>Hiển thị Dashboard</CardTitle><CardDescription>Cấu hình widget cảnh báo tồn kho trên Dashboard</CardDescription></CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between"><div><Label>Hiện trên Dashboard</Label><p className="text-xs text-muted-foreground">Hiển thị widget cảnh báo trên trang chủ</p></div><Switch checked={localSettings.showOnDashboard ?? true} onCheckedChange={(c) => handleChange('showOnDashboard', c)} /></div>{localSettings.showOnDashboard && (<div className="space-y-2"><Label>Loại cảnh báo hiển thị</Label><div className="flex flex-wrap gap-2 mt-2">{alertTypeOptions.map((opt) => { const sel = (localSettings.dashboardAlertTypes ?? []).includes(opt.value as typeof localSettings.dashboardAlertTypes extends (infer U)[] | undefined ? U : never); return (<Button key={opt.value} type="button" variant={sel ? 'default' : 'outline'} size="sm" onClick={() => { const cur = localSettings.dashboardAlertTypes ?? []; const nv = sel ? cur.filter(t => t !== opt.value) : [...cur, opt.value as typeof cur[number]]; handleChange('dashboardAlertTypes', nv); }}>{opt.label}</Button>); })}</div></div>)}</CardContent></Card>
    </div>
  );
}
