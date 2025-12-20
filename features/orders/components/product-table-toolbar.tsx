import * as React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';

export interface ProductTableSettings {
    comboDisplayType: 'value' | 'percent';
    discountDefaultType: 'value' | 'percent';
    productInsertPosition: 'top' | 'bottom';
}

interface ProductTableToolbarProps {
    disabled?: boolean;
    enableSplitLine?: boolean;
    onSplitLineChange?: (enabled: boolean) => void;
    settings?: ProductTableSettings;
    onSettingsChange?: (settings: ProductTableSettings) => void;
}

const DEFAULT_SETTINGS: ProductTableSettings = {
    comboDisplayType: 'value',
    discountDefaultType: 'value',
    productInsertPosition: 'top',
};

export function ProductTableToolbar({ 
    disabled, 
    enableSplitLine = false, 
    onSplitLineChange,
    settings = DEFAULT_SETTINGS,
    onSettingsChange,
}: ProductTableToolbarProps) {
    const [showColumnDialog, setShowColumnDialog] = React.useState(false);
    const [localSettings, setLocalSettings] = React.useState<ProductTableSettings>(settings);

    // Update local settings when props change
    React.useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleSave = () => {
        onSettingsChange?.(localSettings);
        setShowColumnDialog(false);
    };

    const handleCancel = () => {
        setLocalSettings(settings); // Reset to original settings
        setShowColumnDialog(false);
    };

    return (
        <>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                    <Switch 
                        id="split-line" 
                        checked={enableSplitLine}
                        onCheckedChange={(checked) => onSplitLineChange?.(checked)}
                        disabled={disabled}
                    />
                    <Label htmlFor="split-line" className="text-sm font-normal cursor-pointer">
                        Tách dòng
                    </Label>
                </div>
                
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowColumnDialog(true)}
                    disabled={disabled}
                    title="Tùy chỉnh hiển thị"
                >
                    <Settings className="h-4 w-4" />
                </Button>
            </div>

            {/* Column Settings Dialog */}
            <Dialog open={showColumnDialog} onOpenChange={setShowColumnDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tùy chỉnh hiển thị</DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-4">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Hiển thị thành phần combo:</Label>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-muted-foreground">Không</span>
                                    <Switch
                                        id="combo-display"
                                        checked={localSettings.comboDisplayType === 'percent'}
                                        onCheckedChange={(checked) => 
                                            setLocalSettings({ ...localSettings, comboDisplayType: checked ? 'percent' : 'value' })
                                        }
                                    />
                                    <span className="text-sm text-muted-foreground">Có</span>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Chiết khấu mặc định theo:</Label>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-muted-foreground">Giá trị</span>
                                    <Switch
                                        id="discount-default"
                                        checked={localSettings.discountDefaultType === 'percent'}
                                        onCheckedChange={(checked) => 
                                            setLocalSettings({ ...localSettings, discountDefaultType: checked ? 'percent' : 'value' })
                                        }
                                    />
                                    <span className="text-sm text-muted-foreground">%</span>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Thứ tự hiển thị hàng hóa:</Label>
                                <RadioGroup 
                                    value={localSettings.productInsertPosition}
                                    onValueChange={(value: 'top' | 'bottom') => 
                                        setLocalSettings({ ...localSettings, productInsertPosition: value })
                                    }
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="top" id="position-top" />
                                        <Label htmlFor="position-top" className="text-sm font-normal cursor-pointer">
                                            Thêm sau lên trên
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="bottom" id="position-bottom" />
                                        <Label htmlFor="position-bottom" className="text-sm font-normal cursor-pointer">
                                            Thêm sau xuống dưới
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Đóng
                        </Button>
                        <Button type="button" onClick={handleSave}>
                            Lưu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
