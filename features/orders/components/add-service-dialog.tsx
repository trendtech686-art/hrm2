import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { NumberInput } from '@/components/ui/number-input';

type AddServiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  onAppend: (item: any) => void; // Function from parent's useFieldArray
};

export function AddServiceDialog({ open, onOpenChange, disabled = false, onAppend }: AddServiceDialogProps) {
  const { control } = useFormContext();

  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState<number>(0);
  const [serviceQuantity, setServiceQuantity] = useState<number>(1);

  const handleAddService = () => {
    if (!serviceName.trim()) {
      alert('Vui lòng nhập tên dịch vụ');
      return;
    }
    if (servicePrice <= 0) {
      alert('Giá dịch vụ phải lớn hơn 0');
      return;
    }
    if (serviceQuantity <= 0) {
      alert('Số lượng phải lớn hơn 0');
      return;
    }

    // Add as a line item (virtual product)
    const newItem = {
      id: `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      systemId: '',
      productSystemId: `virtual_service_${Date.now()}`,
      productId: 'DỊCH-VỤ',
      productName: serviceName,
      quantity: serviceQuantity,
      unitPrice: servicePrice,
      discount: 0,
      discountType: 'fixed',
      total: servicePrice * serviceQuantity,
    };
    
    onAppend(newItem as any);

    // Reset form
    setServiceName('');
    setServicePrice(0);
    setServiceQuantity(1);
    onOpenChange(false);
  };

  const commonServices = [
    { name: 'Phí lắp đặt', price: 50000 },
    { name: 'Phí vận chuyển đặc biệt', price: 100000 },
    { name: 'Phí bảo hành mở rộng', price: 200000 },
    { name: 'Phí đóng gói', price: 20000 },
    { name: 'Phí tư vấn kỹ thuật', price: 150000 },
    { name: 'Phí kiểm tra và bảo trì', price: 80000 },
  ];

  const handleQuickAdd = (service: { name: string; price: number }) => {
    setServiceName(service.name);
    setServicePrice(service.price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thêm dịch vụ khác</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Quick add common services */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Dịch vụ thường dùng</Label>
            <div className="grid grid-cols-2 gap-2">
              {commonServices.map((service, idx) => (
                <Button
                  key={idx}
                  type="button"
                  variant="outline"
                  className="justify-start h-auto py-2 px-3"
                  onClick={() => handleQuickAdd(service)}
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">{service.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Intl.NumberFormat('vi-VN').format(service.price)}đ
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service-name">Tên dịch vụ *</Label>
              <Input
                id="service-name"
                placeholder="Nhập tên dịch vụ"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                disabled={disabled}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service-price">Giá dịch vụ *</Label>
                <CurrencyInput
                  id="service-price"
                  value={servicePrice}
                  onChange={setServicePrice}
                  disabled={disabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-quantity">Số lượng</Label>
                <NumberInput
                  id="service-quantity"
                  value={serviceQuantity}
                  onChange={setServiceQuantity}
                  min={1}
                  disabled={disabled}
                  format={false}
                />
              </div>
            </div>

            <div className="bg-muted/50 p-3 rounded-md">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Thành tiền:</span>
                <span className="font-semibold text-lg">
                  {new Intl.NumberFormat('vi-VN').format(servicePrice * serviceQuantity)}đ
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="button" onClick={handleAddService} disabled={disabled}>
            Thêm dịch vụ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
