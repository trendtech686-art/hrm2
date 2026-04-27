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
  needsCashSupplement?: boolean;
  autoOrderAmount?: number;
  autoCashAmount?: number;
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
  actualRemainingAmount: _actualRemainingAmount,
  maxAmount,
  needsCashSupplement = false,
  autoOrderAmount = 0,
  autoCashAmount = 0,
  selectedOrder,
}: PaymentVoucherFormFieldsProps) {
  return (
    <>
      {/* Settlement Type - 2 options only */}
      <div className="space-y-2">
        <Label htmlFor="settlementType">Phương thức *</Label>
        <Controller
          name="settlementType"
          control={control}
          render={({ field }) => (
            <Select value={field.value === 'mixed' ? 'order_deduction' : field.value} onValueChange={field.onChange}>
              <SelectTrigger id="settlementType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct_payment">Trả tiền trực tiếp</SelectItem>
                <SelectItem value="order_deduction">Trừ vào đơn hàng</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Payment Method & Account - Show for: direct_payment OR order_deduction when order doesn't have enough */}
      {(settlementType === 'direct_payment' || needsCashSupplement) && (
        <>
          <div className="space-y-2">
            <Label htmlFor="paymentMethodSystemId">Hình thức thanh toán *</Label>
            <Controller
              name="paymentMethodSystemId"
              control={control}
              rules={{ required: settlementType === 'direct_payment' || needsCashSupplement }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="paymentMethodSystemId">
                    <SelectValue placeholder="-- Chọn hình thức --" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.filter(m => m.isActive).map((method) => (
                      <SelectItem key={method.systemId} value={method.systemId}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {needsCashSupplement && (
              <p className="text-xs text-muted-foreground">
                Chọn hình thức thanh toán cho phần chi trực tiếp
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountSystemId">Tài khoản chi *</Label>
            <Controller
              name="accountSystemId"
              control={control}
              rules={{ required: settlementType === 'direct_payment' || needsCashSupplement }}
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
                          {account.name}
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

      {/* Order Selection - Show for order_deduction */}
      {settlementType === 'order_deduction' && (
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
            maxHeight={280}
          />
          <p className="text-xs text-muted-foreground">
            Chỉ hiển thị đơn hàng <strong>chưa thanh toán</strong> và <strong>còn số dư có thể trừ</strong>.
          </p>
        </div>
      )}

      {/* Insufficient order balance — auto mixed breakdown */}
      {needsCashSupplement && selectedOrder && (
        <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-amber-900">
            Đơn {selectedOrder.id} không đủ số dư — hệ thống tự phân bổ
          </div>
          <div className="grid gap-2 md:grid-cols-2 text-sm">
            <div className="rounded-md border border-border bg-card px-3 py-2">
              <div className="text-xs text-muted-foreground">Trừ vào đơn {selectedOrder.id}</div>
              <div className="font-semibold">{autoOrderAmount.toLocaleString('vi-VN')} đ</div>
            </div>
            <div className="rounded-md border border-border bg-card px-3 py-2">
              <div className="text-xs text-muted-foreground">Chi trực tiếp cho khách</div>
              <div className="font-semibold text-red-600">{autoCashAmount.toLocaleString('vi-VN')} đ</div>
            </div>
          </div>
        </div>
      )}

      {/* Amount Input */}
      <div className="space-y-2">
        <Label htmlFor="amount">
          {needsCashSupplement ? 'Số tiền chi trực tiếp *' : 'Số tiền *'}
        </Label>
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
                disabled={needsCashSupplement}
                placeholder="0"
              />
              {fieldState.error && (
                <p className="text-xs text-destructive">{fieldState.error.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Số tiền tối đa: {maxAmount.toLocaleString('vi-VN')} đ
              </p>
            </div>
          )}
        />
      </div>
    </>
  );
}
