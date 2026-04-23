import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tag, Loader2 } from 'lucide-react';
import { useActivePromotions } from '@/features/promotions/hooks/use-promotions';

type ApplyPromotionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (code: string) => void;
  disabled?: boolean;
};

export function ApplyPromotionDialog({ open, onOpenChange, onApply, disabled = false }: ApplyPromotionDialogProps) {
  const [promoCode, setPromoCode] = useState('');
  const { data: promotionsData, isLoading } = useActivePromotions();
  const availablePromotions = (promotionsData?.data || []) as Array<{ code: string; description: string | null; discountType: string; discountValue: number }>;

  const handleApply = () => {
    if (!promoCode.trim()) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }
    
    onApply(promoCode.trim().toUpperCase());
    setPromoCode('');
    onOpenChange(false);
  };

  const handleQuickApply = (code: string) => {
    setPromoCode(code);
  };

  const formatDiscount = (promo: { discountType: string; discountValue: number }) => {
    if (promo.discountType === 'PERCENTAGE') return `Giảm ${promo.discountValue}%`;
    return `Giảm ${new Intl.NumberFormat('vi-VN').format(promo.discountValue)}đ`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent mobileFullScreen className="sm:max-w-md">
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

          {/* Available promotions from DB */}
          <div className="space-y-2">
            <Label>Mã có sẵn:</Label>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Đang tải...</span>
              </div>
            ) : availablePromotions.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                Chưa có mã giảm giá nào
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availablePromotions.map((promo) => (
                  <div
                    key={promo.code}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleQuickApply(promo.code)}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-primary">{promo.code}</div>
                      <div className="text-sm text-muted-foreground">
                        {promo.description || formatDiscount(promo)}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onApply(promo.code);
                        setPromoCode('');
                        onOpenChange(false);
                      }}
                      disabled={disabled}
                    >
                      Áp dụng
                    </Button>
                  </div>
                ))}
              </div>
            )}
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
