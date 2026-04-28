'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useFormContext, useWatch, Controller } from 'react-hook-form';
import { PlusCircle, Trash2 } from 'lucide-react';
import { mobileBleedCardClass } from '@/components/layout/page-section';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

import { useOrderFinder } from '@/features/orders/hooks/use-orders';
import { useSalesReturnsByOrder } from '../hooks/use-sales-returns';
import { useAllCashAccounts } from '@/features/cashbook/hooks/use-all-cash-accounts';
import { useAllPaymentMethods } from '@/features/settings/payments/hooks/use-all-payment-methods';

import { formatCurrency, type FormValues } from './types';

export const SalesReturnSummary = React.memo(function SalesReturnSummary() {
  const { control, setValue, getValues } = useFormContext<FormValues>();
  const { systemId } = useParams<{ systemId: string }>();
  
  // Ref for shipping fee input focus
  const shippingFeeInputRef = React.useRef<HTMLInputElement>(null);

  // ✅ Optimized: Watch all form values at once instead of multiple useWatch calls
  const watchedValues = useWatch({ control });
  
  // Destructure watched values with memoization
  const { 
    items: watchedReturnItems = [], 
    exchangeItems: watchedExchangeItems = [],
    payments: watchedPayments = [],
    refunds: watchedRefunds = [],
    orderDiscount: watchedOrderDiscount = 0,
    orderDiscountType: watchedOrderDiscountType = 'fixed',
    shippingFee: watchedShippingFee = 0,
  } = watchedValues;

  // Stores
  const { findById: findOrder } = useOrderFinder();
  const order = findOrder(systemId!);
  const { accounts } = useAllCashAccounts();
  const { data: paymentMethodsData } = useAllPaymentMethods();

  // Calculations
  const totalReturnValue = React.useMemo(
    () =>
      watchedReturnItems.reduce(
        (sum, item) => sum + (item.returnQuantity || 0) * (item.unitPrice || 0),
        0
      ),
    [watchedReturnItems]
  );

  const subtotalExchangeValue = React.useMemo(
    () => (watchedExchangeItems || []).reduce((sum, item) => {
      // ✅ Calculate total inline instead of using item.total (which may not update reactively)
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const discount = Number(item.discount) || 0;
      const discountType = item.discountType || 'fixed';
      
      const lineGross = unitPrice * quantity;
      const discountAmount = discountType === 'percentage' 
        ? (lineGross * discount) / 100 
        : discount;
      const lineTotal = lineGross - discountAmount;
      
      return sum + lineTotal;
    }, 0),
    [watchedExchangeItems]
  );

  const totalExchangeValue = React.useMemo(() => {
    const orderDiscountValue =
      watchedOrderDiscountType === 'percentage'
        ? (subtotalExchangeValue * watchedOrderDiscount) / 100
        : watchedOrderDiscount;

    return subtotalExchangeValue - orderDiscountValue + watchedShippingFee;
  }, [subtotalExchangeValue, watchedOrderDiscount, watchedOrderDiscountType, watchedShippingFee]);

  const finalAmount = totalExchangeValue - totalReturnValue;
  const isRefunding = finalAmount < 0;

  // ✅ Calculate total paid in form (from payments array)
  const totalPaidInForm = React.useMemo(() => {
    return (watchedPayments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [watchedPayments]);

  // ✅ COD = finalAmount - đã thanh toán (số tiền khách còn phải trả khi nhận hàng)
  const codAmount = React.useMemo(() => {
    if (finalAmount <= 0) return 0;
    return Math.max(0, finalAmount - totalPaidInForm);
  }, [finalAmount, totalPaidInForm]);

  // Side effects - update form values when codAmount changes
  const prevCodRef = React.useRef<{ finalAmount: number; codAmount: number }>({ finalAmount, codAmount });
  React.useEffect(() => {
    const prev = prevCodRef.current;
    if (prev.finalAmount !== finalAmount || prev.codAmount !== codAmount) {
      setValue('packageInfo.codAmount' as keyof FormValues, codAmount, {
        shouldDirty: false,
      });
      setValue('grandTotal', finalAmount > 0 ? finalAmount : 0, { shouldDirty: false });
      prevCodRef.current = { finalAmount, codAmount };
    }
  }, [finalAmount, codAmount, setValue]);

  const totalPaidOnOriginalOrder = React.useMemo(() => {
    if (!order) return 0;
    return order.payments.reduce((sum, p) => sum + p.amount, 0);
  }, [order]);

  const { order } = useOrderFinder();
  
  // Fetch sales returns for this order only (server-side filter)
  const { data: salesReturnsForOrder } = useSalesReturnsByOrder(order?.systemId);
  
  const previousReturnsForOrder = React.useMemo(() => {
    if (!order) return [];
    return salesReturnsForOrder.filter((sr) => sr.orderSystemId === order.systemId);
  }, [order, salesReturnsForOrder]);

  const totalReturnedValuePreviously = React.useMemo(() => {
    return previousReturnsForOrder.reduce((sum, sr) => sum + sr.totalReturnValue, 0);
  }, [previousReturnsForOrder]);

  const totalRefundedPreviously = React.useMemo(() => {
    return previousReturnsForOrder.reduce((sum, sr) => sum + (sr.refundAmount || 0), 0);
  }, [previousReturnsForOrder]);

  const maxRefundableAmount = React.useMemo(() => {
    if (!order) return 0;
    const valueOfGoodsKept = order.grandTotal - totalReturnedValuePreviously - totalReturnValue;
    const netPaid = totalPaidOnOriginalOrder - totalRefundedPreviously;
    const potentialRefund = netPaid - valueOfGoodsKept;
    return Math.max(0, potentialRefund);
  }, [
    order,
    totalPaidOnOriginalOrder,
    totalReturnValue,
    totalReturnedValuePreviously,
    totalRefundedPreviously,
  ]);

  const prevRefundStateRef = React.useRef<{
    finalAmount: number;
    isRefunding: boolean;
    maxRefundableAmount: number;
  }>({
    finalAmount,
    isRefunding,
    maxRefundableAmount,
  });

  React.useEffect(() => {
    const prev = prevRefundStateRef.current;
    if (
      prev.finalAmount !== finalAmount ||
      prev.isRefunding !== isRefunding ||
      prev.maxRefundableAmount !== maxRefundableAmount
    ) {
      if (isRefunding) {
        setValue('refundAmount', Math.min(Math.abs(finalAmount), maxRefundableAmount), {
          shouldDirty: false,
        });
      } else {
        setValue('refundAmount', 0, { shouldDirty: false });
      }
      prevRefundStateRef.current = { finalAmount, isRefunding, maxRefundableAmount };
    }
  }, [finalAmount, isRefunding, maxRefundableAmount, setValue]);

  // ============================================================================
  // Render Helpers
  // ============================================================================

  const renderRefundMethodRow = (
    refund: { method?: string; accountSystemId?: string; amount?: number },
    index: number
  ) => {
    const selectedMethod = refund?.method || '';
    const filteredAccounts =
      selectedMethod === 'Tiền mặt'
        ? accounts.filter((acc) => acc.type === 'cash')
        : accounts.filter((acc) => acc.type === 'bank');

    const sortedAccounts = [...filteredAccounts].sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return 0;
    });

    return (
      <div
        key={index}
        className="grid grid-cols-12 gap-2 items-start p-3 border rounded-lg"
      >
        <div className="col-span-4">
          <Label className="text-xs mb-1 block">Phương thức</Label>
          <Controller
            control={control}
            name={`refunds.${index}.method`}
            render={({ field }) => (
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                  const newFilteredAccounts =
                    val === 'Tiền mặt'
                      ? accounts.filter((acc) => acc.type === 'cash')
                      : accounts.filter((acc) => acc.type === 'bank');
                  const defaultAcc =
                    newFilteredAccounts.find((a) => a.isDefault) ||
                    newFilteredAccounts[0];
                  if (defaultAcc) {
                    setValue(`refunds.${index}.accountSystemId`, defaultAcc.systemId);
                  }
                }}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethodsData
                    .filter((pm) => pm.isActive)
                    .map((pm) => (
                      <SelectItem key={pm.systemId} value={pm.name}>
                        {pm.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="col-span-3">
          <Label className="text-xs mb-1 block">Tài khoản</Label>
          <Controller
            control={control}
            name={`refunds.${index}.accountSystemId`}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortedAccounts.map((acc) => (
                    <SelectItem key={acc.systemId} value={acc.systemId}>
                      {acc.name} {acc.isDefault && '(Mặc định)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="col-span-4">
          <Label className="text-xs mb-1 block">Số tiền</Label>
          <Controller
            control={control}
            name={`refunds.${index}.amount`}
            render={({ field }) => (
              <CurrencyInput
                value={field.value as number}
                onChange={field.onChange}
                className="h-9"
              />
            )}
          />
        </div>
        <div className="col-span-1 pt-5">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="w-10"
            onClick={() => {
              const currentRefunds = getValues('refunds') || [];
              setValue(
                'refunds',
                currentRefunds.filter((_, i) => i !== index)
              );
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderPaymentMethodRow = (
    payment: { method?: string; accountSystemId?: string; amount?: number },
    index: number
  ) => {
    const selectedMethod = payment?.method || '';
    const filteredAccounts =
      selectedMethod === 'Tiền mặt'
        ? accounts.filter((acc) => acc.type === 'cash')
        : accounts.filter((acc) => acc.type === 'bank');

    const sortedAccounts = [...filteredAccounts].sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return 0;
    });

    return (
      <div
        key={index}
        className="grid grid-cols-12 gap-2 items-start p-3 border rounded-lg"
      >
        <div className="col-span-4">
          <Label className="text-xs mb-1 block">Phương thức</Label>
          <Controller
            control={control}
            name={`payments.${index}.method`}
            render={({ field }) => (
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                  const newFilteredAccounts =
                    val === 'Tiền mặt'
                      ? accounts.filter((acc) => acc.type === 'cash')
                      : accounts.filter((acc) => acc.type === 'bank');
                  const defaultAcc =
                    newFilteredAccounts.find((a) => a.isDefault) ||
                    newFilteredAccounts[0];
                  if (defaultAcc) {
                    setValue(`payments.${index}.accountSystemId`, defaultAcc.systemId);
                  }
                }}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethodsData
                    .filter((pm) => pm.isActive)
                    .map((pm) => (
                      <SelectItem key={pm.systemId} value={pm.name}>
                        {pm.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="col-span-3">
          <Label className="text-xs mb-1 block">Tài khoản</Label>
          <Controller
            control={control}
            name={`payments.${index}.accountSystemId`}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortedAccounts.map((acc) => (
                    <SelectItem key={acc.systemId} value={acc.systemId}>
                      {acc.name} {acc.isDefault && '(Mặc định)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="col-span-4">
          <Label className="text-xs mb-1 block">Số tiền</Label>
          <Controller
            control={control}
            name={`payments.${index}.amount`}
            render={({ field }) => (
              <CurrencyInput
                value={field.value as number}
                onChange={field.onChange}
                className="h-9"
              />
            )}
          />
        </div>
        <div className="col-span-1 pt-5">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="w-10"
            onClick={() => {
              const currentPayments = getValues('payments') || [];
              setValue(
                'payments',
                currentPayments.filter((_, i) => i !== index)
              );
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <>
      {/* Row 5: Layout 2 cột - Ghi chú/Tags + Thanh toán */}
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Left: Ghi chú và Tags */}
        <div className="grow-6 w-full md:w-0 space-y-4">
          <Card className={mobileBleedCardClass}>
            <CardHeader>
              <CardTitle>Ghi chú đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={control}
                name="exchangeNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ''}
                        placeholder="VD: Hàng tăng góc riêng"
                        rows={3}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className={mobileBleedCardClass}>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={control}
                name="exchangeTags"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ''}
                        placeholder="Nhập tag và nhấn Enter để thêm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right: Thanh toán */}
        <div className="grow-4 w-full md:w-0">
          <Card className={mobileBleedCardClass}>
            <CardHeader>
              <CardTitle>Thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Tổng tiền ({watchedExchangeItems.length} sản phẩm)
                </span>
                <span>{formatCurrency(subtotalExchangeValue)}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Phí giao hàng (F7)</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      // Focus vào input phí giao hàng
                      shippingFeeInputRef.current?.focus();
                      shippingFeeInputRef.current?.select();
                    }}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                <Controller
                  control={control}
                  name="shippingFee"
                  render={({ field }) => (
                    <CurrencyInput
                      ref={shippingFeeInputRef}
                      value={(field.value as number) || 0}
                      onChange={field.onChange}
                      className="h-9 w-40 text-right"
                    />
                  )}
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Chiết khấu toàn đơn</span>
                <div className="flex items-center gap-1">
                  <Controller
                    control={control}
                    name="orderDiscount"
                    render={({ field }) => (
                      <CurrencyInput
                        value={(field.value as number) || 0}
                        onChange={field.onChange}
                        className="h-9 w-32 text-right"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="orderDiscountType"
                    render={({ field }) => (
                      <Select
                        value={field.value || 'fixed'}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-16">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">₫</SelectItem>
                          <SelectItem value="percentage">%</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Khách phải trả</span>
                <span className="text-h3">{formatCurrency(totalExchangeValue)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 6: Thanh toán - LUÔN HIỂN THỊ */}
      <Card className={mobileBleedCardClass}>
        <CardHeader>
          <CardTitle>
            {finalAmount < 0
              ? 'Hoàn tiền'
              : finalAmount > 0
                ? 'Thanh toán'
                : 'Thanh toán'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cần hoàn tiền trả hàng</span>
              <span className="font-medium">{formatCurrency(totalReturnValue)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Khách cần trả đơn đổi</span>
              <span className="font-medium">{formatCurrency(totalExchangeValue)}</span>
            </div>

            <Separator />

            {/* Case 1: Đơn đổi < Đơn trả → Có thể cần hoàn tiền cho khách */}
            {finalAmount < 0 && (
              <>
                <div className="flex justify-between font-semibold text-h4 text-green-600">
                  <span>Tổng tiền cần hoàn trả khách</span>
                  <span>
                    {formatCurrency(
                      Math.min(Math.abs(finalAmount), maxRefundableAmount)
                    )}
                  </span>
                </div>
                {maxRefundableAmount < Math.abs(finalAmount) && (
                  <div className="text-xs text-muted-foreground">
                    (Khách đã thanh toán: {formatCurrency(totalPaidOnOriginalOrder)} -
                    Chỉ hoàn tối đa số tiền đã thu)
                  </div>
                )}
                {maxRefundableAmount === 0 && (
                  <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    ✓ Khách chưa thanh toán đơn hàng gốc, không cần hoàn tiền. Chỉ cần
                    nhận lại hàng.
                  </div>
                )}
              </>
            )}

            {/* Case 2: Đơn đổi > Đơn trả → Khách phải trả thêm */}
            {finalAmount > 0 && (
              <>
                <div className="flex justify-between font-semibold text-h4 text-amber-600">
                  <span>Tổng tiền khách phải trả</span>
                  <span>{formatCurrency(Math.abs(finalAmount))}</span>
                </div>
              </>
            )}

            {/* Case 3: Bằng nhau */}
            {finalAmount === 0 && (
              <div className="flex justify-between font-semibold text-h4 text-muted-foreground">
                <span>Không phát sinh thanh toán</span>
                <span>{formatCurrency(0)}</span>
              </div>
            )}
          </div>

          {/* Form hoàn tiền - CHỈ hiển thị nếu cần hoàn tiền VÀ khách đã thanh toán */}
          {finalAmount < 0 && maxRefundableAmount > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Đã hoàn tiền</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const refunds = getValues('refunds') || [];
                    const defaultMethod =
                      paymentMethodsData.find((pm) => pm.isDefault)?.name || 'Tiền mặt';
                    const defaultAccount = accounts.find((acc) => acc.isDefault);
                    const requiredRefundAmount = Math.min(
                      Math.abs(finalAmount),
                      maxRefundableAmount
                    );
                    setValue('refunds', [
                      ...refunds,
                      {
                        method: defaultMethod,
                        accountSystemId:
                          defaultAccount?.systemId || accounts[0]?.systemId || '',
                        amount: requiredRefundAmount,
                      },
                    ]);
                  }}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Thêm phương thức
                </Button>
              </div>

              {/* Refund List */}
              {watchedRefunds && watchedRefunds.length > 0 ? (
                <div className="space-y-3">
                  {watchedRefunds.map((refund, index) =>
                    renderRefundMethodRow(refund, index)
                  )}
                  <div className="flex justify-between pt-2 border-t text-sm">
                    <span className="font-medium">Tổng đã hoàn:</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        (watchedRefunds || []).reduce(
                          (sum, r) => sum + (r.amount || 0),
                          0
                        )
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Chưa có phương thức hoàn tiền. Nhấn "Thêm phương thức" để bắt đầu.
                </p>
              )}

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Đã hoàn tiền</span>
                <span className="text-h4 font-semibold">
                  {formatCurrency(
                    (watchedRefunds || []).reduce((sum, r) => sum + (r.amount || 0), 0)
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Còn phải hoàn trả khách</span>
                <span className="text-h3 font-bold text-green-600">
                  {formatCurrency(
                    Math.min(Math.abs(finalAmount), maxRefundableAmount) -
                      (watchedRefunds || []).reduce((sum, r) => sum + (r.amount || 0), 0)
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Form thanh toán - CHỈ hiển thị nếu finalAmount > 0 (khách phải trả thêm) */}
          {finalAmount > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Đã thanh toán</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const payments = getValues('payments') || [];
                    const defaultMethod =
                      paymentMethodsData.find((pm) => pm.isDefault)?.name || 'Tiền mặt';
                    const defaultAccount = accounts.find((acc) => acc.isDefault);
                    setValue('payments', [
                      ...payments,
                      {
                        method: defaultMethod,
                        accountSystemId:
                          defaultAccount?.systemId || accounts[0]?.systemId || '',
                        amount: Math.abs(finalAmount),
                      },
                    ]);
                  }}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Thêm phương thức
                </Button>
              </div>

              {/* Payment List */}
              {watchedPayments && watchedPayments.length > 0 ? (
                <div className="space-y-3">
                  {watchedPayments.map((payment, index) =>
                    renderPaymentMethodRow(payment, index)
                  )}
                  <div className="flex justify-between pt-2 border-t text-sm">
                    <span className="font-medium">Tổng đã thanh toán:</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        (watchedPayments || []).reduce(
                          (sum, p) => sum + (p.amount || 0),
                          0
                        )
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Chưa có phương thức thanh toán. Nhấn "Thêm phương thức" để bắt đầu.
                </p>
              )}

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Đã thanh toán</span>
                <span className="text-h4 font-semibold">
                  {formatCurrency(
                    (watchedPayments || []).reduce((sum, p) => sum + (p.amount || 0), 0)
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Khách còn phải trả</span>
                <span className="text-h3 font-bold text-amber-600">
                  {formatCurrency(
                    Math.abs(finalAmount) -
                      (watchedPayments || []).reduce((sum, p) => sum + (p.amount || 0), 0)
                  )}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
});
