import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { CurrencyInput } from '../../../components/ui/currency-input.tsx';
import { Plus, X, Trash2 } from 'lucide-react';
import { usePaymentMethodStore } from '../../settings/payments/methods/store.ts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select.tsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table.tsx';

export interface PaymentRecord {
  id: string;
  paymentMethodSystemId: string; // Link to PaymentMethod.systemId from settings
  paymentMethodName: string;
  amount: number;
  note?: string;
}

interface OrderPaymentCardProps {
  payments: PaymentRecord[];
  onPaymentsChange: (payments: PaymentRecord[]) => void;
  totalAmount: number; // Tổng tiền đơn hàng
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

export function OrderPaymentCard({
  payments,
  onPaymentsChange,
  totalAmount,
}: OrderPaymentCardProps) {
  const { data: paymentMethods } = usePaymentMethodStore();

  // Add new payment
  const handleAddPayment = () => {
    const defaultMethod = paymentMethods.find((m) => m.isDefault) || paymentMethods[0];
    if (!defaultMethod) return;

    const remainingAmount = totalAmount - getTotalPaid();
    
    const newPayment: PaymentRecord = {
      id: `payment_${Date.now()}`,
      paymentMethodSystemId: defaultMethod.systemId,
      paymentMethodName: defaultMethod.name,
      amount: remainingAmount > 0 ? remainingAmount : 0,
      note: '',
    };

    onPaymentsChange([...payments, newPayment]);
  };

  // Remove payment
  const handleRemovePayment = (id: string) => {
    onPaymentsChange(payments.filter((p) => p.id !== id));
  };

  // Update payment method
  const handlePaymentMethodChange = (id: string, methodId: string) => {
    const method = paymentMethods.find((m) => m.systemId === methodId);
    if (!method) return;

    onPaymentsChange(
      payments.map((p) =>
        p.id === id
          ? { ...p, paymentMethodSystemId: methodId, paymentMethodName: method.name }
          : p
      )
    );
  };

  // Update payment amount
  const handleAmountChange = (id: string, amount: number) => {
    onPaymentsChange(
      payments.map((p) => (p.id === id ? { ...p, amount } : p))
    );
  };

  // Update payment note
  const handleNoteChange = (id: string, note: string) => {
    onPaymentsChange(
      payments.map((p) => (p.id === id ? { ...p, note } : p))
    );
  };

  // Calculate totals
  const getTotalPaid = () => {
    return payments.reduce((sum, p) => sum + p.amount, 0);
  };

  const getRemainingAmount = () => {
    return totalAmount - getTotalPaid();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Thanh toán</CardTitle>
          <Button variant="outline" size="sm" onClick={handleAddPayment}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm thanh toán
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Chưa có phương thức thanh toán nào</p>
            <Button
              variant="link"
              size="sm"
              onClick={handleAddPayment}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm thanh toán
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Payment List */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">STT</TableHead>
                  <TableHead className="min-w-[200px]">Hình thức</TableHead>
                  <TableHead className="min-w-[180px]">Số tiền</TableHead>
                  <TableHead className="min-w-[200px]">Ghi chú</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment, index) => (
                  <TableRow key={payment.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Select
                        value={payment.paymentMethodSystemId}
                        onValueChange={(value) =>
                          handlePaymentMethodChange(payment.id, value)
                        }
                      >
                        <SelectTrigger className="h-9">
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
                        onChange={(value) => handleAmountChange(payment.id, value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={payment.note || ''}
                        onChange={(e) => handleNoteChange(payment.id, e.target.value)}
                        placeholder="Ghi chú..."
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePayment(payment.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Payment Summary */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tổng đơn hàng:</span>
                <span className="font-medium">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Đã thanh toán:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(getTotalPaid())}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t">
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
                <p className="text-xs text-amber-600 italic">
                  * Số tiền thanh toán vượt quá tổng đơn hàng
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
