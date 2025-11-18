import { useState, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CurrencyInput } from '@/components/ui/currency-input';
import { NumberInput } from '@/components/ui/number-input';
import { Badge } from '@/components/ui/badge';
import { Clock, Tag } from 'lucide-react';

type DiscountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Lý do chiết khấu thường dùng
const COMMON_REASONS = [
  'Khách hàng VIP',
  'Khuyến mãi tháng này',
  'Mua số lượng lớn',
  'Khách hàng thân thiết',
  'Đơn hàng đầu tiên',
  'Bù đắp sai sót',
  'Chính sách công ty',
];

const RECENT_REASONS_KEY = 'order_discount_recent_reasons';
const MAX_RECENT_REASONS = 5;

// Helpers cho localStorage
const getRecentReasons = (): string[] => {
  try {
    const stored = localStorage.getItem(RECENT_REASONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveRecentReason = (reason: string) => {
  if (!reason.trim()) return;
  
  try {
    let recent = getRecentReasons();
    // Xóa nếu đã tồn tại
    recent = recent.filter(r => r !== reason);
    // Thêm vào đầu
    recent.unshift(reason);
    // Giữ tối đa MAX_RECENT_REASONS
    recent = recent.slice(0, MAX_RECENT_REASONS);
    localStorage.setItem(RECENT_REASONS_KEY, JSON.stringify(recent));
  } catch {
    // Silent fail
  }
};

export function DiscountDialog({ open, onOpenChange }: DiscountDialogProps) {
  const { control, setValue } = useFormContext();
  
  // ✅ PHASE 2: Convert watch to useWatch
  const orderDiscountType = useWatch({ control, name: 'orderDiscountType' }) || 'fixed';
  const orderDiscount = useWatch({ control, name: 'orderDiscount' }) || 0;
  const orderDiscountReason = useWatch({ control, name: 'orderDiscountReason' }) || '';
  const subtotal = useWatch({ control, name: 'subtotal' }) || 0;
  const shippingFee = useWatch({ control, name: 'shippingFee' }) || 0;
  
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(orderDiscountType);
  const [discountValue, setDiscountValue] = useState<number>(orderDiscount);
  const [reason, setReason] = useState<string>(orderDiscountReason);
  const [recentReasons, setRecentReasons] = useState<string[]>([]);

  // Load recent reasons when dialog opens
  useEffect(() => {
    if (open) {
      setRecentReasons(getRecentReasons());
    }
  }, [open]);

  const totalBeforeDiscount = subtotal + shippingFee;

  // Tính số tiền giảm thực tế
  const calculateDiscountAmount = () => {
    if (discountType === 'percentage') {
      return Math.round((totalBeforeDiscount * discountValue) / 100);
    }
    return discountValue;
  };

  const discountAmount = calculateDiscountAmount();
  const totalAfterDiscount = Math.max(0, totalBeforeDiscount - discountAmount);

  const handleApply = () => {
    setValue('orderDiscount', discountValue);
    setValue('orderDiscountType', discountType);
    setValue('orderDiscountReason', reason);
    
    // Lưu lý do vào recent reasons
    if (reason.trim()) {
      saveRecentReason(reason.trim());
    }
    
    onOpenChange(false);
  };

  const handleRemove = () => {
    setValue('orderDiscount', 0);
    setValue('orderDiscountType', 'fixed');
    setValue('orderDiscountReason', '');
    setDiscountValue(0);
    setReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chiết khấu toàn đơn (F6)</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Loại chiết khấu */}
          <div className="space-y-2">
            <Label>Loại chiết khấu</Label>
            <RadioGroup 
              value={discountType} 
              onValueChange={(v) => setDiscountType(v as 'percentage' | 'fixed')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed" className="font-normal cursor-pointer">
                  Tiền mặt (VNĐ)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage" className="font-normal cursor-pointer">
                  Phần trăm (%)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Giá trị chiết khấu */}
          <div className="space-y-2">
            <Label>Giá trị chiết khấu</Label>
            {discountType === 'fixed' ? (
              <CurrencyInput
                value={discountValue}
                onChange={setDiscountValue}
                placeholder="Nhập số tiền chiết khấu"
              />
            ) : (
              <NumberInput
                value={discountValue}
                onChange={setDiscountValue}
                min={0}
                max={100}
                placeholder="Nhập % chiết khấu (0-100)"
              />
            )}
          </div>

          {/* Lý do */}
          <div className="space-y-2">
            <Label>Lý do chiết khấu (không bắt buộc)</Label>
            
            {/* Quick selection - Recent reasons */}
            {recentReasons.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Gần đây:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentReasons.map((r, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() => setReason(r)}
                    >
                      {r}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quick selection - Common reasons */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Tag className="h-3 w-3" />
                <span>Lý do thường dùng:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {COMMON_REASONS.map((r, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => setReason(r)}
                  >
                    {r}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Hoặc nhập lý do tùy chỉnh..."
              rows={3}
            />
          </div>

          {/* Tổng kết */}
          <div className="bg-muted/50 p-4 rounded-md space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tạm tính:</span>
              <span className="font-medium">
                {new Intl.NumberFormat('vi-VN').format(totalBeforeDiscount)} đ
              </span>
            </div>
            <div className="flex justify-between text-destructive">
              <span>Chiết khấu:</span>
              <span className="font-medium">
                - {new Intl.NumberFormat('vi-VN').format(discountAmount)} đ
              </span>
            </div>
            <div className="flex justify-between text-base font-bold border-t pt-2">
              <span>Tổng sau CK:</span>
              <span className="text-primary">
                {new Intl.NumberFormat('vi-VN').format(totalAfterDiscount)} đ
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleRemove}
            disabled={!orderDiscount}
          >
            Xóa chiết khấu
          </Button>
          <Button type="button" onClick={handleApply}>
            Áp dụng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
