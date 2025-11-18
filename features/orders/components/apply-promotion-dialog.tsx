import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tag } from 'lucide-react';

type ApplyPromotionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (code: string) => void;
  disabled?: boolean;
};

const availablePromotions = [
  { code: 'GIAM50K', description: 'Giảm 50.000đ cho đơn từ 500.000đ' },
  { code: 'FREESHIP', description: 'Miễn phí vận chuyển' },
  { code: 'VIP20', description: 'Giảm 100.000đ cho khách VIP' },
];

export function ApplyPromotionDialog({ open, onOpenChange, onApply, disabled = false }: ApplyPromotionDialogProps) {
  const [promoCode, setPromoCode] = useState('');

  const handleApply = () => {
    if (!promoCode.trim()) {
      alert('Vui lòng nhập mã giảm giá');
      return;
    }
    
    onApply(promoCode.trim());
    setPromoCode('');
    onOpenChange(false);
  };

  const handleQuickApply = (code: string) => {
    setPromoCode(code);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Mã giảm giá
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Manual input */}
          <div className="space-y-2">
            <Label htmlFor="promo-code">Nhập mã giảm giá</Label>
            <div className="flex gap-2">
              <Input
                id="promo-code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Nhập mã giảm giá..."
                className="flex-1"
                disabled={disabled}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApply();
                  }
                }}
              />
              <Button onClick={handleApply} disabled={disabled || !promoCode.trim()}>
                Áp dụng
              </Button>
            </div>
          </div>

          {/* Available promotions */}
          <div className="space-y-2">
            <Label>Mã có sẵn:</Label>
            <div className="space-y-2">
              {availablePromotions.map((promo) => (
                <div
                  key={promo.code}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleQuickApply(promo.code)}
                >
                  <div className="flex-1">
                    <div className="font-semibold text-primary">{promo.code}</div>
                    <div className="text-sm text-muted-foreground">{promo.description}</div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPromoCode(promo.code);
                      handleApply();
                    }}
                    disabled={disabled}
                  >
                    Áp dụng
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
