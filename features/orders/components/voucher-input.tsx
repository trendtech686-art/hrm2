import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Tag, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type VoucherInputProps = {
  disabled?: boolean;
};

// Mock voucher database - trong thực tế sẽ call API
const MOCK_VOUCHERS = [
  { code: 'GIAM50K', amount: 50000, description: 'Giảm 50.000đ cho đơn từ 500.000đ' },
  { code: 'FREESHIP', amount: 30000, description: 'Miễn phí vận chuyển' },
  { code: 'VIP20', amount: 100000, description: 'Giảm 100.000đ cho khách VIP' },
];

export function VoucherInput({ disabled = false }: VoucherInputProps) {
  const { setValue, watch } = useFormContext();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  
  const voucherCode = watch('voucherCode') || '';
  const voucherAmount = watch('voucherAmount') || 0;
  const grandTotal = watch('grandTotal') || 0;

  const handleApply = () => {
    const code = inputValue.trim().toUpperCase();
    if (!code) {
      setError('Vui lòng nhập mã giảm giá');
      return;
    }

    // Validate voucher code
    const voucher = MOCK_VOUCHERS.find(v => v.code === code);
    
    if (!voucher) {
      setError('Mã giảm giá không hợp lệ');
      return;
    }

    // Additional validation: minimum order value
    if (code === 'GIAM50K' && grandTotal < 500000) {
      setError('Đơn hàng tối thiểu 500.000đ để áp dụng mã này');
      return;
    }

    // Apply voucher
    setValue('voucherCode', voucher.code);
    setValue('voucherAmount', voucher.amount);
    setError('');
    setInputValue('');
  };

  const handleRemove = () => {
    setValue('voucherCode', '');
    setValue('voucherAmount', 0);
    setInputValue('');
    setError('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Mã giảm giá
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {voucherCode ? (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 font-mono">
                {voucherCode}
              </Badge>
              <span className="text-sm text-green-700">
                Giảm {new Intl.NumberFormat('vi-VN').format(voucherAmount)}đ
              </span>
            </div>
            {!disabled && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="h-8 text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value.toUpperCase());
                  setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApply();
                  }
                }}
                placeholder="Nhập mã giảm giá"
                disabled={disabled}
                className={error ? 'border-destructive' : ''}
              />
              <Button
                type="button"
                onClick={handleApply}
                disabled={disabled || !inputValue.trim()}
              >
                Áp dụng
              </Button>
            </div>
            
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            
            {/* Gợi ý voucher */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium">Mã có sẵn:</p>
              {MOCK_VOUCHERS.map((voucher) => (
                <button
                  key={voucher.code}
                  type="button"
                  onClick={() => {
                    setInputValue(voucher.code);
                    setError('');
                  }}
                  disabled={disabled}
                  className="block text-left hover:text-primary hover:underline"
                >
                  • <span className="font-mono font-medium">{voucher.code}</span> - {voucher.description}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
