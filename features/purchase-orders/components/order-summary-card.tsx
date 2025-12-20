import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { CurrencyInput } from "../../../components/ui/currency-input";
import { Separator } from "../../../components/ui/separator";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Plus, X } from "lucide-react";
import { usePaymentMethodStore } from "../../settings/payments/methods/store";

export type DiscountType = "percentage" | "fixed";

export interface Fee {
  id: string;
  name: string;
  amount: number;
}

export interface PaymentRecord {
  id: string;
  paymentMethodSystemId: string; // Link to PaymentMethod.systemId from settings
  paymentMethodName: string;
  amount: number;
  note?: string;
}

interface OrderSummaryCardProps {
  subtotal: number;
  tax?: number; // Add tax prop
  discount?: number;
  discountType?: DiscountType;
  shippingFees?: Fee[];
  otherFees?: Fee[];
  totalQuantity: number;
  payments?: PaymentRecord[];
  onDiscountChange?: (discount: number) => void;
  onDiscountTypeChange?: (type: DiscountType) => void;
  onShippingFeesChange?: (fees: Fee[]) => void;
  onOtherFeesChange?: (fees: Fee[]) => void;
  onPaymentsChange?: (payments: PaymentRecord[]) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export function OrderSummaryCard({
  subtotal,
  tax = 0, // Default tax to 0
  discount = 0,
  discountType = "fixed",
  shippingFees = [],
  otherFees = [],
  totalQuantity,
  payments = [],
  onDiscountChange,
  onDiscountTypeChange,
  onShippingFeesChange,
  onOtherFeesChange,
  onPaymentsChange,
}: OrderSummaryCardProps) {
  const { data: paymentMethods } = usePaymentMethodStore();
  
  // Calculate actual discount amount
  const discountAmount =
    discountType === "percentage" ? (subtotal * discount) / 100 : discount;

  const totalShippingFees = shippingFees.reduce((sum, fee) => sum + fee.amount, 0);
  const totalOtherFees = otherFees.reduce((sum, fee) => sum + fee.amount, 0);
  
  // Logic mới: Phí vận chuyển và phí khác trả cho bên thứ 3, KHÔNG cộng vào công nợ NCC
  // Tiền cần trả NCC = Tiền hàng + Thuế - Chiết khấu
  const grandTotal = subtotal + tax - discountAmount;
  
  // Tổng chi phí nhập hàng (để hiển thị tham khảo)
  const totalCost = grandTotal + totalShippingFees + totalOtherFees;
  
  // Calculate payment totals
  const getTotalPaid = () => {
    return payments.reduce((sum, p) => sum + p.amount, 0);
  };

  const getRemainingAmount = () => {
    return grandTotal - getTotalPaid();
  };

  const handleAddShippingFee = () => {
    const newFee: Fee = {
      id: `ship-${Date.now()}`,
      name: "Phí vận chuyển",
      amount: 0,
    };
    onShippingFeesChange?.([...shippingFees, newFee]);
  };

  const handleRemoveShippingFee = (id: string) => {
    onShippingFeesChange?.(shippingFees.filter((fee) => fee.id !== id));
  };

  const handleUpdateShippingFee = (id: string, field: keyof Fee, value: any) => {
    onShippingFeesChange?.(
      shippingFees.map((fee) =>
        fee.id === id ? { ...fee, [field]: value } : fee
      )
    );
  };

  const handleAddOtherFee = () => {
    const newFee: Fee = {
      id: `other-${Date.now()}`,
      name: "Chi phí khác",
      amount: 0,
    };
    onOtherFeesChange?.([...otherFees, newFee]);
  };

  const handleRemoveOtherFee = (id: string) => {
    onOtherFeesChange?.(otherFees.filter((fee) => fee.id !== id));
  };

  const handleUpdateOtherFee = (id: string, field: keyof Fee, value: any) => {
    onOtherFeesChange?.(
      otherFees.map((fee) =>
        fee.id === id ? { ...fee, [field]: value } : fee
      )
    );
  };

  // Payment handlers
  const handleAddPayment = () => {
    const defaultMethod = paymentMethods.find((m) => m.isDefault) || paymentMethods[0];
    if (!defaultMethod) return;

    const remainingAmount = getRemainingAmount();
    
    const newPayment: PaymentRecord = {
      id: `payment_${Date.now()}`,
      paymentMethodSystemId: defaultMethod.systemId,
      paymentMethodName: defaultMethod.name,
      amount: remainingAmount > 0 ? remainingAmount : 0,
      note: '',
    };

    onPaymentsChange?.([...payments, newPayment]);
  };

  const handleRemovePayment = (id: string) => {
    onPaymentsChange?.(payments.filter((p) => p.id !== id));
  };

  const handlePaymentMethodChange = (id: string, methodId: string) => {
    const method = paymentMethods.find((m) => m.systemId === methodId);
    if (!method) return;

    onPaymentsChange?.(
      payments.map((p) =>
        p.id === id
          ? { ...p, paymentMethodSystemId: methodId, paymentMethodName: method.name }
          : p
      )
    );
  };

  const handlePaymentAmountChange = (id: string, amount: number) => {
    onPaymentsChange?.(
      payments.map((p) => (p.id === id ? { ...p, amount } : p))
    );
  };

  const handlePaymentNoteChange = (id: string, note: string) => {
    onPaymentsChange?.(
      payments.map((p) => (p.id === id ? { ...p, note } : p))
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Chi phí nhập hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary rows */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-body-sm text-muted-foreground">Số lượng</span>
            <span className="text-body-sm font-medium">{totalQuantity}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-body-sm text-muted-foreground">Tổng tiền hàng</span>
            <span className="text-body-sm font-medium">{formatCurrency(subtotal)}</span>
          </div>

          {tax > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-muted-foreground">Thuế VAT</span>
              <span className="text-body-sm font-medium">{formatCurrency(tax)}</span>
            </div>
          )}

          <Separator />

          {/* Discount with type toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="discount" className="text-body-sm text-muted-foreground">
                Chiết khấu
              </Label>
              <Select
                value={discountType}
                onValueChange={(value) =>
                  onDiscountTypeChange?.(value as DiscountType)
                }
              >
                <SelectTrigger className="w-[80px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">₫</SelectItem>
                  <SelectItem value="percentage">%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {discountType === "percentage" ? (
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                step="1"
                value={discount}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value > 100) {
                    onDiscountChange?.(100);
                  } else if (value < 0) {
                    onDiscountChange?.(0);
                  } else {
                    onDiscountChange?.(value);
                  }
                }}
                placeholder="0"
                className="w-full h-9"
              />
            ) : (
              <CurrencyInput
                id="discount"
                value={discount}
                onChange={(value) => {
                  if (value < 0) {
                    onDiscountChange?.(0);
                  } else {
                    onDiscountChange?.(value);
                  }
                }}
                placeholder="0"
                className="w-full h-9"
              />
            )}
            {discountType === "percentage" && discount > 0 && (
              <p className="text-body-xs text-muted-foreground">
                = {formatCurrency(discountAmount)}
              </p>
            )}
            {discountType === "percentage" && discount > 100 && (
              <p className="text-body-xs text-red-500">
                Chiết khấu không thể vượt quá 100%
              </p>
            )}
          </div>

          {/* Shipping Fees */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-body-sm text-muted-foreground">
                Chi phí vận chuyển (Trả bên thứ 3)
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddShippingFee}
                className="h-6 px-2"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            {shippingFees.map((fee) => (
              <div key={fee.id} className="flex gap-2">
                <Input
                  placeholder="Tên phí"
                  value={fee.name}
                  onChange={(e) =>
                    handleUpdateShippingFee(fee.id, "name", e.target.value)
                  }
                  className="w-full text-body-sm"
                />
                <CurrencyInput
                  value={fee.amount}
                  onChange={(value) => {
                    if (value < 0) return;
                    handleUpdateShippingFee(fee.id, "amount", value);
                  }}
                  placeholder="0"
                  className="flex-1 text-body-sm"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveShippingFee(fee.id)}
                  className="h-9 w-9 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {shippingFees.length === 0 && (
              <p className="text-body-xs text-muted-foreground italic">
                Chưa có phí vận chuyển
              </p>
            )}
          </div>

          {/* Other Fees */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-body-sm text-muted-foreground">Chi phí khác (Trả bên thứ 3)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddOtherFee}
                className="h-6 px-2"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            {otherFees.map((fee) => (
              <div key={fee.id} className="flex gap-2">
                <Input
                  placeholder="Tên phí"
                  value={fee.name}
                  onChange={(e) =>
                    handleUpdateOtherFee(fee.id, "name", e.target.value)
                  }
                  className="w-full text-body-sm"
                />
                <CurrencyInput
                  value={fee.amount}
                  onChange={(value) => {
                    if (value < 0) return;
                    handleUpdateOtherFee(fee.id, "amount", value);
                  }}
                  placeholder="0"
                  className="flex-1 text-body-sm"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveOtherFee(fee.id)}
                  className="h-9 w-9 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {otherFees.length === 0 && (
              <p className="text-body-xs text-muted-foreground italic">
                Chưa có chi phí khác
              </p>
            )}
          </div>

          <Separator />

          {/* Tổng chi phí (tham khảo) */}
          {(totalShippingFees > 0 || totalOtherFees > 0) && (
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-body-sm">Tổng chi phí nhập hàng</span>
              <span className="text-body-sm font-medium">
                {formatCurrency(totalCost)}
              </span>
            </div>
          )}

          {/* Tiền cần trả NCC */}
          <div className="flex items-center justify-between">
            <span className="text-body-sm text-muted-foreground">Tiền cần trả NCC</span>
            <span className="text-h3 font-bold">
              {formatCurrency(grandTotal)}
            </span>
          </div>
          
          <Separator />

          {/* Payment Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-h3 font-semibold">Thanh toán</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddPayment}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                Thêm thanh toán
              </Button>
            </div>

            {payments.length === 0 ? (
              <p className="text-body-xs text-muted-foreground italic text-center py-4">
                Chưa có thanh toán nào
              </p>
            ) : (
              <div className="space-y-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px] text-body-xs">STT</TableHead>
                      <TableHead className="text-body-xs">Hình thức</TableHead>
                      <TableHead className="text-body-xs">Số tiền</TableHead>
                      <TableHead className="w-[40px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment, index) => (
                      <TableRow key={payment.id}>
                        <TableCell className="text-body-xs">{index + 1}</TableCell>
                        <TableCell>
                          <Select
                            value={payment.paymentMethodSystemId}
                            onValueChange={(value) =>
                              handlePaymentMethodChange(payment.id, value)
                            }
                          >
                            <SelectTrigger className="h-9 text-body-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {paymentMethods
                                .filter((m) => m.isActive)
                                .map((method) => (
                                  <SelectItem
                                    key={method.systemId}
                                    value={method.systemId}
                                  >
                                    {method.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <CurrencyInput
                            value={payment.amount}
                            onChange={(value) =>
                              handlePaymentAmountChange(payment.id, value)
                            }
                            className="h-9 text-body-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemovePayment(payment.id)}
                            className="h-8 w-8"
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

            {/* Payment Summary */}
            {payments.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-body-sm">
                  <span className="text-muted-foreground">Tổng đơn hàng:</span>
                  <span className="font-medium">{formatCurrency(grandTotal)}</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-muted-foreground">Đã thanh toán:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(getTotalPaid())}
                  </span>
                </div>
                <div className="flex justify-between text-h3 font-semibold pt-2 border-t">
                  <span>Còn phải trả:</span>
                  <span
                    className={
                      getRemainingAmount() > 0
                        ? 'text-red-600'
                        : getRemainingAmount() < 0
                        ? 'text-amber-600'
                        : 'text-green-600'
                    }
                  >
                    {formatCurrency(getRemainingAmount())}
                  </span>
                </div>
                {getRemainingAmount() < 0 && (
                  <p className="text-body-xs text-amber-600 italic">
                    * Số tiền thanh toán vượt quá tổng đơn hàng
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
