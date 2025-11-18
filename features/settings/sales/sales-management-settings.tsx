import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card.tsx';
import { Checkbox } from '../../../components/ui/checkbox.tsx';
import { Label } from '../../../components/ui/label.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.tsx';
import { Info } from 'lucide-react';

export function SalesManagementSettings() {
    const [settings, setSettings] = React.useState({
        allowCancelAfterExport: true,
        allowNegativeOrder: true,
        allowNegativeApproval: true,
        allowNegativePacking: true,
        allowNegativeStockOut: true,
        printCopies: '1',
    });

    const handleCheckedChange = (key: keyof typeof settings) => (checked: boolean) => {
        setSettings(prev => ({ ...prev, [key]: checked }));
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
                        <Select value={settings.printCopies} onValueChange={(value) => setSettings(prev => ({ ...prev, printCopies: value }))}>
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
        </Card>
    );
}
