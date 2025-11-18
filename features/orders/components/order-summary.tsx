import * as React from 'react';
import { useFormContext, useWatch, useFieldArray, Controller } from 'react-hook-form';
import { PlusCircle, X, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { FormField, FormItem, FormLabel, FormControl } from '../../../components/ui/form.tsx';
import { NumberInput } from '../../../components/ui/number-input.tsx';
import { CurrencyInput } from '../../../components/ui/currency-input.tsx';
import { Separator } from '../../../components/ui/separator.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select.tsx';
import { usePaymentMethodStore } from '../../settings/payments/methods/store.ts';
import { useShippingPartnerStore } from '../../settings/shipping/store.ts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table.tsx';
import { useDebounce } from '../../../hooks/use-debounce.ts';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

export function OrderSummary({ disabled }: { disabled: boolean }) {
    const { control, setValue } = useFormContext();
    const { subtotal, shippingFee, grandTotal, payments = [], orderDiscount, orderDiscountType, voucherAmount, deliveryMethod, shippingPartnerId, customer, weight, serviceFees = [] } = useWatch({ control });

    const { fields, append, remove } = useFieldArray({ control, name: 'payments' });
    const { data: paymentMethodsData } = usePaymentMethodStore();
    const { data: partners } = useShippingPartnerStore();
    const defaultPaymentMethod = React.useMemo(() => paymentMethodsData.find(pm => pm.isDefault)?.name || 'Tiền mặt', [paymentMethodsData]);
    
    // ✅ PHASE 2: Use useWatch for lineItems count instead of calling it in render
    const lineItems = useWatch({ control, name: 'lineItems' });
    
    // ✅ PHASE 3: Local state + debounce cho shipping fee và discount
    const [localShippingFee, setLocalShippingFee] = React.useState<number>(shippingFee || 0);
    const [localOrderDiscount, setLocalOrderDiscount] = React.useState<number>(orderDiscount || 0);
    
    // Sync local state khi form value thay đổi từ bên ngoài
    React.useEffect(() => {
        setLocalShippingFee(shippingFee || 0);
    }, [shippingFee]);
    
    React.useEffect(() => {
        setLocalOrderDiscount(orderDiscount || 0);
    }, [orderDiscount]);
    
    // Debounce để auto-save
    const debouncedShippingFee = useDebounce(localShippingFee, 300);
    const debouncedOrderDiscount = useDebounce(localOrderDiscount, 300);
    
    React.useEffect(() => {
        if (debouncedShippingFee !== shippingFee) {
            setValue('shippingFee', debouncedShippingFee);
        }
    }, [debouncedShippingFee, shippingFee, setValue]);
    
    React.useEffect(() => {
        if (debouncedOrderDiscount !== orderDiscount) {
            setValue('orderDiscount', debouncedOrderDiscount);
        }
    }, [debouncedOrderDiscount, orderDiscount, setValue]);

    // Tính chiết khấu toàn đơn
    let orderDiscountAmount = 0;
    if (orderDiscount) {
        const totalBeforeDiscount = subtotal + shippingFee;
        if (orderDiscountType === 'percentage') {
            orderDiscountAmount = Math.round((totalBeforeDiscount * orderDiscount) / 100);
        } else {
            orderDiscountAmount = orderDiscount;
        }
    }
    
    const voucherDiscount = Number(voucherAmount) || 0;

    const totalPaid = payments.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);
    const amountRemaining = grandTotal - totalPaid;
    
    // Mock function to get suggested shipping fee
    const handleGetSuggestedFee = React.useCallback(() => {
        if (deliveryMethod !== 'shipping-partner') {
            alert('Vui lòng chọn phương thức "Đẩy qua hãng vận chuyển"');
            return;
        }
        
        if (!customer?.shippingAddress_province || !weight) {
            alert('Vui lòng điền đầy đủ thông tin: địa chỉ giao hàng và cân nặng');
            return;
        }
        
        // Mock calculation based on weight and partner
        const partner = partners.find(p => p.systemId === shippingPartnerId);
        const baseFee = 20000; // Base fee 20k
        const weightFee = Math.ceil(weight / 100) * 2000; // 2k per 100g
        const suggestedFee = baseFee + weightFee;
        
        setValue('shippingFee', suggestedFee);
        alert(`Phí gợi ý từ ${partner?.name || 'hãng vận chuyển'}: ${formatCurrency(suggestedFee)}đ`);
    }, [deliveryMethod, customer, weight, shippingPartnerId, partners, setValue]);
    
    const paymentMethods = [
        { value: 'Tiền mặt', label: 'Tiền mặt' },
        { value: 'Chuyển khoản', label: 'Chuyển khoản' },
        { value: 'Quẹt thẻ', label: 'Quẹt thẻ' },
    ];
    
    return (
      <Card>
        <CardHeader><CardTitle className="text-base font-semibold">Thanh toán</CardTitle></CardHeader>
        <CardContent className="p-4 space-y-2 text-sm">
          <div className="flex items-center justify-between py-1"><span className="text-muted-foreground">Tổng tiền ({lineItems.length} sản phẩm)</span><span className="font-medium text-foreground">{formatCurrency(subtotal)}</span></div>
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-primary hover:underline cursor-pointer">Phí giao hàng (F7)</span>
            <div className="w-full max-w-[280px]">
              <CurrencyInput 
                value={localShippingFee} 
                onChange={(value) => setLocalShippingFee(value as number)} 
                onBlur={() => {
                  if (localShippingFee !== shippingFee) {
                    setValue('shippingFee', localShippingFee);
                  }
                }}
                className="h-9" 
                disabled={disabled} 
              />
            </div>
          </div>
          {/* Chiết khấu toàn đơn - Simple input like product table */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Chiết khấu toàn đơn</span>
              <Controller 
                control={control} 
                name="orderDiscountType" 
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
                    <SelectTrigger className="h-8 w-[60px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">đ</SelectItem>
                      <SelectItem value="percentage">%</SelectItem>
                    </SelectContent>
                  </Select>
                )} 
              />
            </div>
            <div className="w-full max-w-[280px]">
              {orderDiscountType === 'percentage' ? (
                <div className="relative">
                  <NumberInput 
                    value={localOrderDiscount} 
                    onChange={(value) => setLocalOrderDiscount(value as number)}
                    onBlur={() => {
                      if (localOrderDiscount !== orderDiscount) {
                        setValue('orderDiscount', localOrderDiscount);
                      }
                    }}
                    min={0}
                    max={100}
                    className="h-9" 
                    disabled={disabled}
                    format={false}
                  />
                  <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none z-10">%</span>
                </div>
              ) : (
                <CurrencyInput 
                  value={localOrderDiscount} 
                  onChange={(value) => setLocalOrderDiscount(value as number)}
                  onBlur={() => {
                    if (localOrderDiscount !== orderDiscount) {
                      setValue('orderDiscount', localOrderDiscount);
                    }
                  }}
                  className="h-9" 
                  disabled={disabled}
                />
              )}
            </div>
          </div>
          
          {/* Hiển thị số tiền chiết khấu nếu có */}
          {orderDiscountAmount > 0 && (
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-muted-foreground">Số tiền chiết khấu</span>
              <span className="text-sm font-medium text-destructive">
                -{formatCurrency(orderDiscountAmount)}
              </span>
            </div>
          )}
          
          {/* Voucher */}
          {voucherDiscount > 0 && (
            <div className="flex items-center justify-between py-1 text-destructive">
              <span className="text-sm">Mã giảm giá</span>
              <span className="font-medium">-{formatCurrency(voucherDiscount)}</span>
            </div>
          )}
          
          {/* Phí dịch vụ khác */}
          {serviceFees && serviceFees.length > 0 && (
            <>
              {serviceFees.map((fee: any, index: number) => (
                <div key={index} className="flex items-center justify-between py-1 text-orange-600">
                  <span className="text-sm">{fee.name}</span>
                  <span className="font-medium">+{formatCurrency(fee.amount)}</span>
                </div>
              ))}
            </>
          )}
           
          <Separator className="!my-2" />
          <div className="flex items-center justify-between text-base font-semibold py-1"><span className="text-foreground">Khách phải trả</span><span>{formatCurrency(grandTotal)}</span></div>
          <Separator className="!my-2" />
          
          {/* Payment Section with Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Thanh toán</span>
              {!disabled && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ method: defaultPaymentMethod, amount: amountRemaining > 0 ? amountRemaining : 0 })}
                  className="h-8"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Thêm thanh toán
                </Button>
              )}
            </div>

            {fields.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-4">
                Chưa có thanh toán nào
              </p>
            ) : (
              <div className="space-y-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px] text-xs">STT</TableHead>
                      <TableHead className="text-xs">Hình thức</TableHead>
                      <TableHead className="text-xs">Số tiền</TableHead>
                      <TableHead className="w-[40px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell className="text-xs">{index + 1}</TableCell>
                        <TableCell>
                          <Controller 
                            control={control} 
                            name={`payments.${index}.method`} 
                            render={({ field }) => ( 
                              <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
                                <SelectTrigger className="h-9 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {paymentMethods.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                                </SelectContent>
                              </Select> 
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller 
                            control={control} 
                            name={`payments.${index}.amount`} 
                            render={({ field }) => ( 
                              <CurrencyInput value={field.value as number} onChange={field.onChange} className="h-9" disabled={disabled} /> 
                            )} 
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => remove(index)} 
                            disabled={disabled}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          
          <Separator className="!my-2" />
          
          {/* Tóm tắt thanh toán */}
          {fields.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-muted-foreground">Tổng đơn hàng:</span>
                <span className="font-medium">{formatCurrency(grandTotal)}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-muted-foreground">Đã thanh toán:</span>
                <span className="font-medium text-green-600">{formatCurrency(totalPaid)}</span>
              </div>
              <Separator className="!my-1" />
              <div className="flex items-center justify-between py-1 bg-muted/50 px-2 rounded">
                <span className="text-base font-bold">Còn phải trả:</span>
                <span className={`text-lg font-bold ${amountRemaining > 0 ? 'text-destructive' : amountRemaining < 0 ? 'text-amber-600' : 'text-green-600'}`}>
                  {formatCurrency(amountRemaining)}
                </span>
              </div>
              {amountRemaining < 0 && (
                <p className="text-xs text-amber-600 italic">
                  * Số tiền thanh toán vượt quá tổng đơn hàng
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
}
