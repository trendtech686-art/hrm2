import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { PlusCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';

type ServiceFee = {
  id: string;
  name: string;
  amount: number;
};

type ServiceFeesProps = {
  disabled?: boolean;
};

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

export function ServiceFees({ disabled = false }: ServiceFeesProps) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'serviceFees',
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [feeName, setFeeName] = useState('');
  const [feeAmount, setFeeAmount] = useState<number>(0);

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

  const totalFees = (fields as ServiceFee[]).reduce((sum, fee) => sum + (fee.amount || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Phí dịch vụ khác</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {fields.length > 0 ? (
          <div className="space-y-2">
            {fields.map((field, index) => {
              const fee = field as ServiceFee;
              return (
                <div key={field.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{fee.name}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(fee.amount)}đ</p>
                  </div>
                  {!disabled && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              );
            })}
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm font-medium">Tổng phí:</span>
              <span className="text-base font-bold">{formatCurrency(totalFees)}đ</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Chưa có phí dịch vụ nào
          </p>
        )}

        {!disabled && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setDialogOpen(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Thêm phí dịch vụ
          </Button>
        )}

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
      </CardContent>
    </Card>
  );
}
