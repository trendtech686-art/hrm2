import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Switch } from '../../../components/ui/switch';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Info, Save } from 'lucide-react';
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton';
import { useSalesManagementSettingsStore, type SalesManagementSettingsValues } from './sales-management-store';
import { useShallow } from 'zustand/react/shallow';
import type { ReactNode } from 'react';
import type { RegisterTabActions } from '../use-tab-action-registry';
import { toast } from 'sonner';

type SalesManagementSettingsProps = {
    isActive?: boolean;
    onRegisterActions?: RegisterTabActions;
};

export function SalesManagementSettings({ isActive, onRegisterActions }: SalesManagementSettingsProps) {
    const settings = useSalesManagementSettingsStore(useShallow((state) => ({
        allowCancelAfterExport: state.allowCancelAfterExport,
        allowNegativeOrder: state.allowNegativeOrder,
        allowNegativeApproval: state.allowNegativeApproval,
        allowNegativePacking: state.allowNegativePacking,
        allowNegativeStockOut: state.allowNegativeStockOut,
        printCopies: state.printCopies,
    })));
    const updateSetting = useSalesManagementSettingsStore((state) => state.updateSetting);

    const handleSaveSettings = React.useCallback(() => {
        toast.success('Đã lưu cài đặt thành công');
    }, []);

    const headerActions = React.useMemo(() => [
        <SettingsActionButton key="save" onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Lưu cài đặt
        </SettingsActionButton>,
    ], [handleSaveSettings]);

    React.useEffect(() => {
        if (!isActive || !onRegisterActions) return;
        onRegisterActions(headerActions);
    }, [headerActions, isActive, onRegisterActions]);

    const handleCheckedChange = (key: keyof SalesManagementSettingsValues) => (checked: boolean) => {
        updateSetting(key, checked);
    };

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
                            <SelectTrigger id="print-copies" className="mt-2 h-9">
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
