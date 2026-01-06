'use client';

/**
 * Settings dialog for warranty products section
 */
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export interface ProductsSectionSettings {
  discountDefaultType: 'value' | 'percent';
  productInsertPosition: 'top' | 'bottom';
}

interface WarrantyProductsSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: ProductsSectionSettings;
  onSettingsChange: (settings: ProductsSectionSettings) => void;
}

export function WarrantyProductsSettingsDialog({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}: WarrantyProductsSettingsDialogProps) {
  const [localSettings, setLocalSettings] = React.useState<ProductsSectionSettings>(settings);

  // Sync local state when dialog opens
  React.useEffect(() => {
    if (open) {
      setLocalSettings(settings);
    }
  }, [open, settings]);

  const handleSave = () => {
    onSettingsChange(localSettings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tùy chỉnh hiển thị</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-body-sm font-medium">Chiết khấu mặc định theo:</Label>
              <div className="flex items-center gap-3">
                <span className="text-body-sm text-muted-foreground">Giá trị</span>
                <Switch
                  id="discount-type"
                  checked={localSettings.discountDefaultType === 'percent'}
                  onCheckedChange={(checked) => 
                    setLocalSettings(prev => ({
                      ...prev,
                      discountDefaultType: checked ? 'percent' : 'value',
                    }))
                  }
                />
                <span className="text-body-sm text-muted-foreground">%</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-body-sm font-medium">Thứ tự hiển thị hàng hóa:</Label>
              <RadioGroup
                value={localSettings.productInsertPosition}
                onValueChange={(value: 'top' | 'bottom') => 
                  setLocalSettings(prev => ({
                    ...prev,
                    productInsertPosition: value,
                  }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="top" id="top" />
                  <Label htmlFor="top" className="font-normal cursor-pointer">
                    Thêm sau lên trên
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bottom" id="bottom" />
                  <Label htmlFor="bottom" className="font-normal cursor-pointer">
                    Thêm sau xuống dưới
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button type="button" onClick={handleSave}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
