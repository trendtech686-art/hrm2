/**
 * Order Print Dialog
 * Dialog để in đơn hàng với nhiều loại mẫu in
 */

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Input } from '../../../components/ui/input';
import { Printer, FileText, Package, Truck, Tag } from 'lucide-react';
import { usePrint } from '../../../lib/use-print';
import type { TemplateType, PaperSize, PrintOrientation } from '../../settings/printer/types';
import { LABEL_SIZES } from '../../settings/printer/types';
import type { Order, Packaging } from '../types';
import type { Customer } from '../../customers/types';
import type { Branch } from '../../settings/branches/types';
import { 
  convertOrderForPrint,
  convertPackagingToDeliveryForPrint,
  convertToShippingLabelForPrint,
  convertToPackingForPrint,
  mapOrderToPrintData,
  mapOrderLineItems,
  mapDeliveryToPrintData,
  mapDeliveryLineItems,
  mapShippingLabelToPrintData,
  mapPackingToPrintData,
  mapPackingLineItems,
  createStoreSettings,
} from '../../../lib/print/order-print-helper';

interface PrintOption {
  type: TemplateType;
  label: string;
  icon: React.ReactNode;
  description: string;
  requiresPackaging?: boolean;
}

const PRINT_OPTIONS: PrintOption[] = [
  {
    type: 'order',
    label: 'Đơn hàng',
    icon: <FileText className="h-4 w-4" />,
    description: 'In đơn hàng đầy đủ thông tin',
  },
  {
    type: 'packing',
    label: 'Phiếu đóng gói',
    icon: <Package className="h-4 w-4" />,
    description: 'In phiếu đóng gói cho kho',
    requiresPackaging: true,
  },
  {
    type: 'delivery',
    label: 'Phiếu giao hàng',
    icon: <Truck className="h-4 w-4" />,
    description: 'In phiếu giao cho shipper',
    requiresPackaging: true,
  },
  {
    type: 'shipping-label',
    label: 'Nhãn giao hàng',
    icon: <Tag className="h-4 w-4" />,
    description: 'In nhãn dán lên kiện hàng',
    requiresPackaging: true,
  },
];

const PAPER_SIZES: { value: PaperSize; label: string }[] = [
  { value: 'K57', label: 'K57 (57mm)' },
  { value: 'K80', label: 'K80 (80mm)' },
  { value: 'A5', label: 'A5' },
  { value: 'A4', label: 'A4' },
  { value: 'A6', label: 'A6' },
];

interface OrderPrintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
  customer?: Customer | null;
  branch?: Branch | null;
  /** Packaging hiện tại nếu có */
  activePackaging?: Packaging | null;
}

export function OrderPrintDialog({
  open,
  onOpenChange,
  order,
  customer,
  branch,
  activePackaging,
}: OrderPrintDialogProps) {
  const { print, getDefaultSize } = usePrint(branch?.systemId);
  
  const [selectedType, setSelectedType] = React.useState<TemplateType>('order');
  const [selectedSize, setSelectedSize] = React.useState<PaperSize>('K80');
  const [orientation, setOrientation] = React.useState<PrintOrientation>('portrait');
  const [customWidth, setCustomWidth] = React.useState('');
  const [customHeight, setCustomHeight] = React.useState('');
  const [isCustom, setIsCustom] = React.useState(false);

  const supportsOrientation = ['A4', 'A5', 'A6'].includes(selectedSize) && !isCustom;

  // Reset size khi đổi loại template
  React.useEffect(() => {
    if (open) {
      const defaultSize = getDefaultSize(selectedType);
      setSelectedSize(defaultSize);
      setIsCustom(false);
    }
  }, [selectedType, getDefaultSize, open]);

  // Reset về order khi mở dialog
  React.useEffect(() => {
    if (open) {
      setSelectedType('order');
      setOrientation('portrait');
      setIsCustom(false);
    }
  }, [open]);

  const handlePrint = React.useCallback(() => {
    const storeSettings = createStoreSettings(branch);
    let finalSize = selectedSize;
    if (isCustom && customWidth && customHeight) {
      const w = parseInt(customWidth);
      const h = parseInt(customHeight);
      if (w > 0 && h > 0) finalSize = `${w}x${h}`;
    }

    switch (selectedType) {
      case 'order': {
        const orderData = convertOrderForPrint(order, { customer });
        print('order', {
          data: mapOrderToPrintData(orderData, storeSettings),
          lineItems: mapOrderLineItems(orderData.items),
          paperSize: finalSize,
        });
        break;
      }

      case 'packing': {
        if (!activePackaging) return;
        const packingData = convertToPackingForPrint(order, activePackaging, { customer });
        print('packing', {
          data: mapPackingToPrintData(packingData, storeSettings),
          lineItems: mapPackingLineItems(packingData.items),
          paperSize: finalSize,
        });
        break;
      }

      case 'delivery': {
        if (!activePackaging) return;
        const deliveryData = convertPackagingToDeliveryForPrint(order, activePackaging, { customer });
        print('delivery', {
          data: mapDeliveryToPrintData(deliveryData, storeSettings),
          lineItems: mapDeliveryLineItems(deliveryData.items),
          paperSize: finalSize,
        });
        break;
      }

      case 'shipping-label': {
        if (!activePackaging) return;
        const labelData = convertToShippingLabelForPrint(order, activePackaging, { customer });
        print('shipping-label', {
          data: mapShippingLabelToPrintData(labelData, storeSettings),
          paperSize: finalSize,
        });
        break;
      }
    }

    onOpenChange(false);
  }, [selectedType, selectedSize, isCustom, customWidth, customHeight, order, customer, branch, activePackaging, print, onOpenChange]);

  const filteredOptions = React.useMemo(() => {
    return PRINT_OPTIONS.filter(opt => {
      // Nếu cần packaging nhưng không có thì ẩn
      if (opt.requiresPackaging && !activePackaging) return false;
      return true;
    });
  }, [activePackaging]);

  const selectedOption = PRINT_OPTIONS.find(opt => opt.type === selectedType);
  const canPrint = selectedOption && (!selectedOption.requiresPackaging || activePackaging);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            In đơn hàng {order.id}
          </DialogTitle>
          <DialogDescription>
            Chọn loại phiếu in và khổ giấy
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Loại phiếu in */}
          <div className="space-y-2">
            <Label>Loại phiếu in</Label>
            <RadioGroup 
              value={selectedType} 
              onValueChange={(v) => setSelectedType(v as TemplateType)}
              className="grid grid-cols-2 gap-2"
            >
              {filteredOptions.map((option) => (
                <div key={option.type} className="relative">
                  <RadioGroupItem 
                    value={option.type} 
                    id={option.type}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={option.type}
                    className="flex flex-col items-center gap-2 rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-colors"
                  >
                    {option.icon}
                    <span className="text-sm font-medium">{option.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {selectedOption && (
              <p className="text-xs text-muted-foreground">{selectedOption.description}</p>
            )}
          </div>

          {/* Khổ giấy */}
          <div className="space-y-2">
            <Label htmlFor="paper-size">Khổ giấy</Label>
            <Select value={!isCustom ? selectedSize : ''} onValueChange={(v) => { setSelectedSize(v as PaperSize); setIsCustom(false); }}>
              <SelectTrigger id="paper-size">
                <SelectValue placeholder="Chọn khổ giấy" />
              </SelectTrigger>
              <SelectContent>
                {PAPER_SIZES.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
                {/* Label sizes */}
                {LABEL_SIZES.map(group => (
                  <SelectGroup key={group.label}>
                    <SelectLabel>Tem {group.label}</SelectLabel>
                    {group.sizes.map(s => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}mm
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hướng in - chỉ cho A4/A5/A6 */}
          {supportsOrientation && (
            <div className="flex items-center gap-3">
              <Label className="text-sm">Hướng in</Label>
              <Button
                type="button"
                variant={orientation === 'portrait' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setOrientation('portrait')}
              >
                Dọc
              </Button>
              <Button
                type="button"
                variant={orientation === 'landscape' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setOrientation('landscape')}
              >
                Ngang
              </Button>
            </div>
          )}

          {/* Custom size */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={isCustom ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsCustom(!isCustom)}
              >
                Kích thước tùy chỉnh
              </Button>
            </div>
            {isCustom && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={10}
                  max={300}
                  placeholder="Rộng"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                  className="w-24"
                />
                <span className="text-muted-foreground">×</span>
                <Input
                  type="number"
                  min={10}
                  max={300}
                  placeholder="Cao"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(e.target.value)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">mm</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handlePrint} disabled={!canPrint}>
            <Printer className="mr-2 h-4 w-4" />
            In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
