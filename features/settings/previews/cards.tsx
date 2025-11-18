import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { Label } from '../../../components/ui/label.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.tsx';
import { Switch } from '../../../components/ui/switch.tsx';
import { Slider } from '../../../components/ui/slider.tsx';

export function PreviewCards() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Đây là một tiêu đề</CardTitle>
                    <CardDescription>Đây là mô tả cho card.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Nội dung này nằm trong một card để bạn có thể thấy màu nền và màu chữ tương phản.</p>
                </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2">
                <Button>Nút chính</Button>
                <Button variant="secondary">Nút phụ</Button>
                <Button variant="outline">Nút viền</Button>
                <Button variant="destructive">Nút Hủy</Button>
                <Button variant="ghost">Nút Ghost</Button>
            </div>
            
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="preview-input">Nhãn</Label>
                    <Input id="preview-input" placeholder="Đây là một ô nhập liệu" />
                </div>
                 <div className="space-y-2">
                    <Label>Lựa chọn</Label>
                    <Select defaultValue="item1">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="item1">Mục 1</SelectItem>
                            <SelectItem value="item2">Mục 2</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="airplane-mode" />
                    <Label htmlFor="airplane-mode">Chế độ máy bay</Label>
                </div>
                 <div className="space-y-2">
                    <Label>Thanh trượt</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                </div>
            </div>
        </div>
    );
}
