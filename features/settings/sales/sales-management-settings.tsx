import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Switch } from '../../../components/ui/switch';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Info, Save, Loader2 } from 'lucide-react';
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton';
import { useSalesManagementSettingsData } from './hooks/use-sales-management-settings';
import type { SalesManagementSettingsValues } from './sales-management-service';
import type { RegisterTabActions } from '../use-tab-action-registry';
import { useDirtyState } from '@/hooks/use-dirty-state';
import { toast } from 'sonner';

type SalesManagementSettingsProps = {
    isActive?: boolean;
    onRegisterActions?: RegisterTabActions;
};

export function SalesManagementSettings({ isActive, onRegisterActions }: SalesManagementSettingsProps) {
    const { settings, storedSettings, isLoading, updateSetting, saveSettings, isSaving } = useSalesManagementSettingsData();
    const isDirty = useDirtyState(storedSettings ?? settings, settings);

    // Store the latest callback in a ref to avoid re-registering on every render
    const onRegisterActionsRef = React.useRef(onRegisterActions);
    React.useEffect(() => {
        onRegisterActionsRef.current = onRegisterActions;
    }, [onRegisterActions]);

    const handleSave = React.useCallback(async () => {
        const result = await saveSettings();
        if (result.success) {
            toast.success('Đã lưu cài đặt');
        } else {
            toast.error('Lỗi khi lưu cài đặt', { description: result.error });
        }
    }, [saveSettings]);

    const headerActions = React.useMemo(() => [
        <SettingsActionButton key="save" onClick={handleSave} disabled={!isDirty || isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Lưu cài đặt
        </SettingsActionButton>,
    ], [handleSave, isDirty, isSaving]);

    // Re-register whenever actions change (dirty/isSaving) while tab is active
    React.useEffect(() => {
        if (!isActive || !onRegisterActionsRef.current) return;
        onRegisterActionsRef.current(headerActions);
    }, [isActive, headerActions]);

    const handleCheckedChange = (key: keyof SalesManagementSettingsValues) => (checked: boolean) => {
        updateSetting(key, checked);
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Thiết lập quản lý bán hàng</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Thiết lập quản lý bán hàng</CardTitle>
                <CardDescription>
                    Áp dụng mặc định phương thức thanh toán, phương thức giao hàng, giá bán, giá nhập và cấu hình một số hình thức bán hàng tại quầy
                </CardDescription>
            </CardHeader>
            <CardContent className="max-w-xl">
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="print-copies" className="font-semibold">In nhiều liên hoá đơn</Label>
                        <Select value={settings.printCopies} onValueChange={(value) => updateSetting('printCopies', value as SalesManagementSettingsValues['printCopies'])}>
                            <SelectTrigger id="print-copies" className="mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">In 1 liên</SelectItem>
                                <SelectItem value="2">In 2 liên</SelectItem>
                                <SelectItem value="3">In 3 liên</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="allowCancelAfterExport">Cho phép hủy đơn hàng sau khi xuất kho</Label>
                            <Switch id="allowCancelAfterExport" checked={settings.allowCancelAfterExport} onCheckedChange={handleCheckedChange('allowCancelAfterExport')} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="allowNegativeOrder">Cho phép tạo đơn đặt hàng âm</Label>
                            <Switch id="allowNegativeOrder" checked={settings.allowNegativeOrder} onCheckedChange={handleCheckedChange('allowNegativeOrder')} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="allowNegativeApproval">Cho phép duyệt đơn âm</Label>
                            <Switch id="allowNegativeApproval" checked={settings.allowNegativeApproval} onCheckedChange={handleCheckedChange('allowNegativeApproval')} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="allowNegativePacking" className="flex items-center">Cho phép đóng gói và tạo phiếu giao hàng âm <Info className="ml-1 h-4 w-4 text-muted-foreground" /></Label>
                            <Switch id="allowNegativePacking" checked={settings.allowNegativePacking} onCheckedChange={handleCheckedChange('allowNegativePacking')} />
                        </div>
                         <div className="flex items-center justify-between">
                            <Label htmlFor="allowNegativeStockOut" className="flex items-center">Cho phép xuất kho âm <Info className="ml-1 h-4 w-4 text-muted-foreground" /></Label>
                            <Switch id="allowNegativeStockOut" checked={settings.allowNegativeStockOut} onCheckedChange={handleCheckedChange('allowNegativeStockOut')} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
