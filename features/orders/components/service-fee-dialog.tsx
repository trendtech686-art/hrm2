import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';

type ServiceFeeDialogProps = {
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function ServiceFeeDialog({ disabled = false, open: externalOpen, onOpenChange }: ServiceFeeDialogProps) {
  const { control } = useFormContext();
  const { append } = useFieldArray({
    control,
    name: 'serviceFees',
  });

  const [internalOpen, setInternalOpen] = useState(false);
  const [feeName, setFeeName] = useState('');
  const [feeAmount, setFeeAmount] = useState<number>(0);

  // Use external open state if provided, otherwise use internal
  const dialogOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setDialogOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalOpen(open);
    }
  };

  const handleAddFee = () => {
    if (!feeName.trim()) {
      alert('Vui lòng nhập tên phí dịch vụ');
      return;
    }
    if (feeAmount <= 0) {
      alert('Số tiền phải lớn hơn 0');
      return;
    }

    append({
      id: `fee_${Date.now()}`,
      name: feeName,
      amount: feeAmount,
    });

    setFeeName('');
    setFeeAmount(0);
    setDialogOpen(false);
  };

  const commonFees = [
    { name: 'Phí lắp đặt', amount: 50000 },
    { name: 'Phí vận chuyển đặc biệt', amount: 100000 },
    { name: 'Phí bảo hành mở rộng', amount: 200000 },
    { name: 'Phí đóng gói', amount: 20000 },
  ];

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-9 flex-shrink-0"
        onClick={() => setDialogOpen(true)}
        disabled={disabled}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Phí dịch vụ
      </Button>

      {/* Dialog thêm phí */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm phí dịch vụ</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Gợi ý phí thường dùng */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Phí thường dùng:</Label>
              <div className="grid grid-cols-2 gap-2">
                {commonFees.map((fee) => (
                  <Button
                    key={fee.name}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFeeName(fee.name);
                      setFeeAmount(fee.amount);
                    }}
                    className="justify-start text-xs"
                  >
                    {fee.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tên phí dịch vụ</Label>
              <Input
                value={feeName}
                onChange={(e) => setFeeName(e.target.value)}
                placeholder="VD: Phí lắp đặt, Phí bảo hành..."
              />
            </div>

            <div className="space-y-2">
              <Label>Số tiền</Label>
              <CurrencyInput
                value={feeAmount}
                onChange={setFeeAmount}
                placeholder="Nhập số tiền"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button type="button" onClick={handleAddFee}>
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
