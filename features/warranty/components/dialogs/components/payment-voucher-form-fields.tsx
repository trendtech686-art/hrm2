'use client'

import * as React from 'react';
import { Controller, type Control } from 'react-hook-form';
import { Label } from '../../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/select';
import { CurrencyInput } from '../../../../../components/ui/currency-input';
import { VirtualizedCombobox } from '../../../../../components/ui/virtualized-combobox';
import type { PaymentVoucherFormValues } from '../helpers/payment-voucher-helpers';
import type { OrderSearchResult } from '../../../../orders/order-search-api';
import type { PaymentMethod } from '../../../../settings/payments/methods/types';
import type { CashAccount } from '../../../../cashbook/types';

interface PaymentVoucherFormFieldsProps {
  control: Control<PaymentVoucherFormValues>;
  settlementType: string;
  paymentMethods: PaymentMethod[];
  filteredAccounts: CashAccount[];
  selectedPaymentMethod?: PaymentMethod | null;
  orderSearchResults: OrderSearchResult[];
  selectedOrderValue: { value: string; label: string; subtitle: string } | null;
  isSearchingOrders: boolean;
  onOrderSearchChange: (query: string) => void;
  onOrderSelect: (value: string) => void;
  actualRemainingAmount: number;
  maxAmount: number;
  orderRemainingAmount: number;
  mixedOrderAmount?: number;
  mixedCashAmount?: number;
  selectedOrder?: { id: string; grandTotal: number; paidAmount?: number } | null;
}

/**
 * Component chứa các form fields cho Payment Voucher Dialog
 */
export function PaymentVoucherFormFields({
  control,
  settlementType,
  paymentMethods,
  filteredAccounts,
  selectedPaymentMethod,
  orderSearchResults,
  selectedOrderValue,
  isSearchingOrders,
  onOrderSearchChange,
  onOrderSelect,
  actualRemainingAmount,
  maxAmount,
  orderRemainingAmount,
  mixedOrderAmount,
  mixedCashAmount,
  selectedOrder,
}: PaymentVoucherFormFieldsProps) {
  return (
    <>
      {/* Settlement Type */}
      <div className="space-y-2">
        <Label htmlFor="settlementType">Phương thức *</Label>
        <Controller
          name="settlementType"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="settlementType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct_payment">Trả tiền trực tiếp</SelectItem>
                <SelectItem value="order_deduction">Trừ vào đơn hàng</SelectItem>
                <SelectItem value="mixed">Bù trừ đơn + Chi tiền</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Payment Method & Account - Show for direct payment and mixed */}
      {(settlementType === 'direct_payment' || settlementType === 'mixed') && (
        <>
          <div className="space-y-2">
            <Label htmlFor="paymentMethodSystemId">Hình thức thanh toán *</Label>
            <Controller
              name="paymentMethodSystemId"
              control={control}
              rules={{ required: settlementType === 'direct_payment' || settlementType === 'mixed' }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="paymentMethodSystemId">
                    <SelectValue placeholder="-- Chọn hình thức --" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.filter(m => m.isActive).map((method) => (
                      <SelectItem key={method.systemId} value={method.systemId}>
                        <div className="flex items-center gap-2">
                          <span>{method.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-xs text-muted-foreground">
              Chọn hình thức thanh toán phù hợp từ cài đặt hệ thống
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountSystemId">Tài khoản chi *</Label>
            <Controller
              name="accountSystemId"
              control={control}
              rules={{ required: settlementType === 'direct_payment' || settlementType === 'mixed' }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="accountSystemId">
                    <SelectValue placeholder="-- Chọn tài khoản --" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAccounts.length === 0 ? (
                      <div className="p-4 text-sm text-muted-foreground text-center">
                        Không có tài khoản khả dụng
                      </div>
                    ) : (
                      filteredAccounts.map((account) => (
                        <SelectItem key={account.systemId} value={account.systemId}>
                          <div className="flex items-center gap-2">
                            <span>{account.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-xs text-muted-foreground">
              {selectedPaymentMethod?.name === 'Tiền mặt' 
                ? 'Hiển thị tài khoản quỹ tiền mặt' 
                : 'Hiển thị tài khoản ngân hàng'}
            </p>
          </div>
        </>
      )}

      {/* Order Selection - Show for order deduction and mixed */}
      {(settlementType === 'order_deduction' || settlementType === 'mixed') && (
        <div className="space-y-2">
          <Label htmlFor="selectedOrderId">Chọn đơn hàng *</Label>
          <div className="text-xs text-muted-foreground mb-2">
            Nhập mã đơn hàng hoặc tên khách để tìm nhanh.
          </div>
          <VirtualizedCombobox
            options={orderSearchResults}
            value={selectedOrderValue}
            onChange={(option) => onOrderSelect(option?.value || '')}
            onSearchChange={onOrderSearchChange}
            placeholder="Tìm kiếm đơn hàng..."
            searchPlaceholder="Nhập mã đơn hoặc tên khách hàng..."
            emptyPlaceholder="Không tìm thấy đơn hàng phù hợp"
            isLoading={isSearchingOrders}
            minSearchLength={0}
            estimatedItemHeight={56}
            maxHeight={400}
          />
          <p className="text-xs text-muted-foreground">
            Chỉ hiển thị đơn hàng <strong>chưa xuất kho</strong> và <strong>còn số dư có thể trừ</strong>.
          </p>
        </div>
      )}

      {/* Amount Input */}
      <div className="space-y-2">
        <Label htmlFor="amount">Số tiền *</Label>
        <Controller
          name="amount"
          control={control}
          rules={{ 
            required: 'Vui lòng nhập số tiền',
            min: { value: 1, message: 'Số tiền phải lớn hơn 0' },
            max: { 
              value: maxAmount, 
              message: `Số tiền không được vượt quá ${maxAmount.toLocaleString('vi-VN')} đ`
            }
          }}
          render={({ field, fieldState }) => (
            <div className="space-y-1">
              <CurrencyInput
                value={field.value}
                onChange={field.onChange}
                disabled={settlementType === 'mixed'}
                placeholder="0"
              />
              {fieldState.error && (
                <p className="text-xs text-destructive">{fieldState.error.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {settlementType === 'order_deduction' && selectedOrder ? (
                  <>
                    Số tiền tối đa: {maxAmount.toLocaleString('vi-VN')} đ
                    {(selectedOrder.paidAmount || 0) > 0 && (
                      <span className="text-blue-600 font-medium">
                        {' '}(Đã trừ: {(selectedOrder.paidAmount || 0).toLocaleString('vi-VN')} đ / {selectedOrder.grandTotal.toLocaleString('vi-VN')} đ)
                      </span>
                    )}
                  </>
                ) : settlementType === 'mixed' ? (
                  `Tiền mặt cần chi: ${(mixedCashAmount || 0).toLocaleString('vi-VN')} đ (tự động từ phần bù trừ)`
                ) : (
                  `Số tiền tối đa: ${actualRemainingAmount.toLocaleString('vi-VN')} đ`
                )}
              </p>
            </div>
          )}
        />
      </div>

      {/* Mixed Settlement Allocation */}
      {settlementType === 'mixed' && (
        <MixedSettlementFields
          control={control}
          actualRemainingAmount={actualRemainingAmount}
          orderRemainingAmount={orderRemainingAmount}
          mixedOrderAmount={mixedOrderAmount}
          mixedCashAmount={mixedCashAmount}
        />
      )}
    </>
  );
}

interface MixedSettlementFieldsProps {
  control: Control<PaymentVoucherFormValues>;
  actualRemainingAmount: number;
  orderRemainingAmount: number;
  mixedOrderAmount?: number;
  mixedCashAmount?: number;
}

function MixedSettlementFields({
  control,
  actualRemainingAmount,
  orderRemainingAmount,
  mixedCashAmount,
}: MixedSettlementFieldsProps) {
  return (
    <div className="space-y-3 rounded-lg border p-3 bg-muted/40">
      <div className="text-sm font-medium">Phân bổ bù trừ</div>
      <div className="text-xs text-muted-foreground">
        Tổng cần hoàn: <strong>{actualRemainingAmount.toLocaleString('vi-VN')} đ</strong>. 
        Điều chỉnh số tiền trừ vào đơn, phần còn lại sẽ chi trực tiếp.
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <Label>Trừ vào đơn</Label>
          <Controller
            name="mixedOrderAmount"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                value={field.value || 0}
                onChange={field.onChange}
                max={orderRemainingAmount}
                min={0}
              />
            )}
          />
          <p className="text-xs text-muted-foreground">
            Tối đa: {orderRemainingAmount.toLocaleString('vi-VN')} đ
          </p>
        </div>
        <div className="space-y-1">
          <Label>Chi trực tiếp</Label>
          <div className="rounded-md border bg-background px-3 py-2 text-right font-semibold">
            {(mixedCashAmount || 0).toLocaleString('vi-VN')} đ
          </div>
          <p className="text-xs text-muted-foreground">Tự động tính = Tổng cần hoàn - Trừ vào đơn</p>
        </div>
      </div>
    </div>
  );
}
