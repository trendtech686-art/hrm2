import * as React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card.tsx';
import { Checkbox } from '../../../components/ui/checkbox.tsx';
import { Label } from '../../../components/ui/label.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.tsx';
import { Info } from 'lucide-react';
import { Button } from '../../../components/ui/button.tsx';
import { useSalesManagementSettingsStore, type SalesManagementSettingsValues } from './sales-management-store.ts';

export function SalesManagementSettings() {
    const settings = useSalesManagementSettingsStore((state) => ({
        allowCancelAfterExport: state.allowCancelAfterExport,
        allowNegativeOrder: state.allowNegativeOrder,
        allowNegativeApproval: state.allowNegativeApproval,
        allowNegativePacking: state.allowNegativePacking,
        allowNegativeStockOut: state.allowNegativeStockOut,
        printCopies: state.printCopies,
    }));
    const updateSetting = useSalesManagementSettingsStore((state) => state.updateSetting);
    const resetSettings = useSalesManagementSettingsStore((state) => state.reset);

    const handleCheckedChange = (key: keyof SalesManagementSettingsValues) => (checked: boolean | 'indeterminate') => {
        updateSetting(key, checked === true);
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
                        <div className="flex items-center space-x-2">
                            <Checkbox id="allowCancelAfterExport" checked={settings.allowCancelAfterExport} onCheckedChange={handleCheckedChange('allowCancelAfterExport')} />
                            <Label htmlFor="allowCancelAfterExport">Cho phép hủy đơn hàng sau khi xuất kho</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="allowNegativeOrder" checked={settings.allowNegativeOrder} onCheckedChange={handleCheckedChange('allowNegativeOrder')} />
                            <Label htmlFor="allowNegativeOrder">Cho phép tạo đơn đặt hàng âm</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="allowNegativeApproval" checked={settings.allowNegativeApproval} onCheckedChange={handleCheckedChange('allowNegativeApproval')} />
                            <Label htmlFor="allowNegativeApproval">Cho phép duyệt đơn âm</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="allowNegativePacking" checked={settings.allowNegativePacking} onCheckedChange={handleCheckedChange('allowNegativePacking')} />
                            <Label htmlFor="allowNegativePacking" className="flex items-center">Cho phép đóng gói và tạo phiếu giao hàng âm <Info className="ml-1 h-4 w-4 text-muted-foreground" /></Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="allowNegativeStockOut" checked={settings.allowNegativeStockOut} onCheckedChange={handleCheckedChange('allowNegativeStockOut')} />
                            <Label htmlFor="allowNegativeStockOut" className="flex items-center">Cho phép xuất kho âm <Info className="ml-1 h-4 w-4 text-muted-foreground" /></Label>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button variant="outline" onClick={resetSettings} className="h-9">Khôi phục mặc định</Button>
            </CardFooter>
        </Card>
    );
}
