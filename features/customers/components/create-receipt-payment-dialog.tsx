'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAllReceiptTypes } from '@/features/settings/receipt-types/hooks/use-all-receipt-types';
import { useAllPaymentTypes } from '@/features/settings/payments/types/hooks/use-all-payment-types';
import { useAllPaymentMethods } from '@/features/settings/payments/hooks/use-all-payment-methods';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import { useReceiptMutations } from '@/features/receipts/hooks/use-receipts';
import { usePaymentMutations } from '@/features/payments/hooks/use-payments';
import type { Customer } from '@/lib/types/prisma-extended';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { asSystemId } from '@/lib/id-types';
import { useAuth } from '@/contexts/auth-context';
import { useCustomerOrders } from '@/features/orders/hooks/use-customer-orders';
import { formatCurrency } from '@/lib/format-utils';

type DialogType = 'receipt' | 'payment';

interface CreateReceiptPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: DialogType;
  customer: Customer;
  currentDebt?: number;
}

interface FormValues {
  branchSystemId: string;
  amount: number;
  paymentMethodSystemId: string;
  receiptTypeSystemId: string;
  linkedOrderSystemId: string;
  customId: string;
  description: string;
  affectsDebt: boolean;
}

export function CreateReceiptPaymentDialog({
  open,
  onOpenChange,
  type,
  customer,
  currentDebt: propCurrentDebt,
}: CreateReceiptPaymentDialogProps) {
  const { data: receiptTypes, isLoading: isLoadingReceiptTypes } = useAllReceiptTypes();
  const { data: paymentTypes, isLoading: isLoadingPaymentTypes } = useAllPaymentTypes();
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = useAllPaymentMethods();
  const { data: branches, isLoading: isLoadingBranches } = useAllBranches();
  const { employee: authEmployee } = useAuth();
  
  // Fetch customer orders for "Thanh toán cho đơn hàng" receipt type
  const { data: customerOrdersData } = useCustomerOrders({
    customerSystemId: customer?.systemId,
    enabled: open && type === 'receipt',
  });
  
  const { create: createReceipt } = useReceiptMutations();
  const { create: createPayment } = usePaymentMutations();

  const isDataLoading = isLoadingReceiptTypes || isLoadingPaymentTypes || isLoadingPaymentMethods || isLoadingBranches;

  const currentUserId = authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('SYSTEM');

  // Get unpaid orders (orders with remaining balance)
  const unpaidOrders = React.useMemo(() => {
    const orders = customerOrdersData || [];
    return orders.filter(order => {
      const grandTotal = Number(order.grandTotal) || 0;
      const paidAmount = Number(order.paidAmount) || 0;
      const remaining = grandTotal - paidAmount;
      return remaining > 0 && order.status !== 'Đã hủy';
    });
  }, [customerOrdersData]);

  // Get default branch - prefer employee's branch, then first active branch
  const defaultBranch = React.useMemo(() => {
    if (authEmployee?.branchSystemId) {
      const empBranch = branches.find(b => b.systemId === authEmployee.branchSystemId);
      if (empBranch) return empBranch;
    }
    return branches[0];
  }, [branches, authEmployee?.branchSystemId]);

  // Get customer's current debt for auto-fill (use absolute value since debt is negative)
  const customerDebt = React.useMemo(() => {
    const debt = propCurrentDebt ?? Number(customer?.currentDebt ?? 0);
    // Debt is typically negative (customer owes us), so use absolute value
    return Math.abs(debt);
  }, [propCurrentDebt, customer?.currentDebt]);

  const activeReceiptTypes = React.useMemo(
    () => (type === 'receipt' ? receiptTypes : paymentTypes).filter((rt) => rt.isActive),
    [type, receiptTypes, paymentTypes]
  );
  const activePaymentMethods = React.useMemo(
    () => paymentMethods.filter((pm) => pm.isActive),
    [paymentMethods]
  );

  const form = useForm<FormValues>({
    defaultValues: {
      branchSystemId: defaultBranch?.systemId || '',
      amount: type === 'receipt' ? customerDebt : 0,
      paymentMethodSystemId: activePaymentMethods[0]?.systemId || '',
      receiptTypeSystemId: activeReceiptTypes[0]?.systemId || '',
      customId: '',
      description: '',
      affectsDebt: true,
    },
  });

  // Reset form when dialog opens and data is ready
  React.useEffect(() => {
    if (open && !isDataLoading && defaultBranch) {
      form.reset({
        branchSystemId: defaultBranch?.systemId || '',
        amount: type === 'receipt' ? customerDebt : 0,
        paymentMethodSystemId: activePaymentMethods[0]?.systemId || '',
        receiptTypeSystemId: activeReceiptTypes[0]?.systemId || '',
        customId: '',
        description: '',
        affectsDebt: true,
        linkedOrderSystemId: '',
      });
    }
  }, [open, isDataLoading, defaultBranch, activePaymentMethods, activeReceiptTypes, form, type, customerDebt]);

  // Watch for receipt type changes to show order selector
  const selectedReceiptTypeSystemId = form.watch('receiptTypeSystemId');
  const selectedReceiptType = activeReceiptTypes.find(rt => rt.systemId === selectedReceiptTypeSystemId);
  const isOrderPaymentType = selectedReceiptType?.name?.toLowerCase().includes('đơn hàng');

  // Watch for order selection to auto-fill amount
  const selectedOrderSystemId = form.watch('linkedOrderSystemId');
  const selectedOrder = unpaidOrders.find(o => o.systemId === selectedOrderSystemId);
  
  // Auto-fill amount when order is selected
  React.useEffect(() => {
    if (selectedOrder && isOrderPaymentType) {
      const grandTotal = Number(selectedOrder.grandTotal) || 0;
      const paidAmount = Number(selectedOrder.paidAmount) || 0;
      const remainingAmount = grandTotal - paidAmount;
      form.setValue('amount', remainingAmount);
    }
  }, [selectedOrderSystemId, selectedOrder, isOrderPaymentType, form]);

  const isLoading = createReceipt.isPending || createPayment.isPending || isDataLoading;

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      // Validate required fields
      if (!data.branchSystemId) {
        toast.error('Vui lòng chọn chi nhánh');
        return;
      }
      if (!data.paymentMethodSystemId) {
        toast.error('Vui lòng chọn hình thức thanh toán');
        return;
      }
      if (!data.receiptTypeSystemId) {
        toast.error(`Vui lòng chọn loại ${type === 'receipt' ? 'phiếu thu' : 'phiếu chi'}`);
        return;
      }
      if (!data.amount || data.amount <= 0) {
        toast.error('Vui lòng nhập giá trị');
        return;
      }

      const branch = branches.find((b) => b.systemId === data.branchSystemId);
      const paymentMethod = paymentMethods.find((pm) => pm.systemId === data.paymentMethodSystemId);
      const receiptType = activeReceiptTypes.find((rt) => rt.systemId === data.receiptTypeSystemId);
      const now = new Date();

      if (type === 'receipt') {
        // Find the linked order if selected
        const linkedOrder = unpaidOrders.find(o => o.systemId === data.linkedOrderSystemId);
        
        await createReceipt.mutateAsync({
          date: now.toISOString().split('T')[0],
          amount: data.amount,
          payerTypeSystemId: asSystemId('TARGET-KHACHHANG'),
          payerTypeName: 'Khách hàng',
          payerSystemId: customer.systemId,
          payerName: customer.name,
          paymentMethodSystemId: asSystemId(data.paymentMethodSystemId),
          paymentMethodName: paymentMethod?.name || '',
          accountSystemId: asSystemId(''), // Will be set by API based on payment method
          paymentReceiptTypeSystemId: asSystemId(data.receiptTypeSystemId),
          paymentReceiptTypeName: receiptType?.name || '',
          branchSystemId: asSystemId(data.branchSystemId),
          branchName: branch?.name || '',
          description: data.description,
          affectsDebt: data.affectsDebt,
          status: 'completed' as const,
          createdBy: currentUserId,
          category: 'customer_payment',
          customerSystemId: customer.systemId,
          customerName: customer.name,
          // Link to order if selected
          ...(linkedOrder && {
            orderSystemId: asSystemId(linkedOrder.systemId),
            orderCustomId: linkedOrder.id || linkedOrder.systemId,
          }),
        });
        toast.success('Tạo phiếu thu thành công');
      } else {
        await createPayment.mutateAsync({
          date: now.toISOString().split('T')[0],
          amount: data.amount,
          recipientTypeSystemId: asSystemId('TARGET-KHACHHANG'),
          recipientTypeName: 'Khách hàng',
          recipientName: customer.name,
          recipientSystemId: customer.systemId,
          paymentMethodSystemId: asSystemId(data.paymentMethodSystemId),
          paymentMethodName: paymentMethod?.name || '',
          accountSystemId: asSystemId(''),
          paymentReceiptTypeSystemId: asSystemId(data.receiptTypeSystemId),
          paymentReceiptTypeName: receiptType?.name || '',
          branchSystemId: asSystemId(data.branchSystemId),
          branchName: branch?.name || '',
          description: data.description,
          affectsDebt: data.affectsDebt,
          status: 'completed' as const,
          createdBy: currentUserId,
          customerSystemId: customer.systemId,
          customerName: customer.name,
        });
        toast.success('Tạo phiếu chi thành công');
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Error creating receipt/payment:', error);
      toast.error(type === 'receipt' ? 'Lỗi tạo phiếu thu' : 'Lỗi tạo phiếu chi');
    }
  });

  const dialogTitle = type === 'receipt' 
    ? `Tạo phiếu thu ${customer.name}` 
    : `Tạo phiếu chi ${customer.name}`;

  const receiptTypeLabel = type === 'receipt' ? 'Loại phiếu thu' : 'Loại phiếu chi';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Chi nhánh */}
          <div className="space-y-2">
            <Label htmlFor="branch">
              Chi nhánh <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.watch('branchSystemId')}
              onValueChange={(value) => form.setValue('branchSystemId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn chi nhánh" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.systemId} value={branch.systemId}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Giá trị và Hình thức thanh toán */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Giá trị <span className="text-destructive">*</span>
              </Label>
              <CurrencyInput
                value={form.watch('amount')}
                onChange={(value) => form.setValue('amount', value || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">
                Hình thức thanh toán <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.watch('paymentMethodSystemId')}
                onValueChange={(value) => form.setValue('paymentMethodSystemId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn hình thức" />
                </SelectTrigger>
                <SelectContent>
                  {activePaymentMethods.map((method) => (
                    <SelectItem key={method.systemId} value={method.systemId}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loại phiếu và Mã phiếu */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="receiptType">
                {receiptTypeLabel} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.watch('receiptTypeSystemId')}
                onValueChange={(value) => {
                  form.setValue('receiptTypeSystemId', value);
                  // Reset order selection when changing receipt type
                  form.setValue('linkedOrderSystemId', '');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Chọn ${receiptTypeLabel.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {activeReceiptTypes.map((rt) => (
                    <SelectItem key={rt.systemId} value={rt.systemId}>
                      {rt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customId">Mã phiếu</Label>
              <Input
                id="customId"
                placeholder="Nhập mã phiếu"
                {...form.register('customId')}
              />
            </div>
          </div>

          {/* Order selection - only show when receipt type is for order payment */}
          {type === 'receipt' && isOrderPaymentType && (
            <div className="space-y-2">
              <Label htmlFor="linkedOrder">
                Điều kiện thanh toán
              </Label>
              <Select
                value={form.watch('linkedOrderSystemId')}
                onValueChange={(value) => form.setValue('linkedOrderSystemId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn đơn hàng để thanh toán" />
                </SelectTrigger>
                <SelectContent>
                  {unpaidOrders.length === 0 ? (
                    <SelectItem value="none" disabled>
                      Không có đơn hàng chưa thanh toán
                    </SelectItem>
                  ) : (
                    unpaidOrders.map((order) => {
                      const grandTotal = Number(order.grandTotal) || 0;
                      const paidAmount = Number(order.paidAmount) || 0;
                      const remaining = grandTotal - paidAmount;
                      return (
                        <SelectItem key={order.systemId} value={order.systemId}>
                          {order.id || order.systemId} - Còn lại: {formatCurrency(remaining)}
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
              {selectedOrder && (
                <p className="text-xs text-muted-foreground">
                  Tổng tiền: {formatCurrency(Number(selectedOrder.grandTotal))} | 
                  Đã thanh toán: {formatCurrency(Number(selectedOrder.paidAmount))} | 
                  Còn lại: {formatCurrency(Number(selectedOrder.grandTotal) - Number(selectedOrder.paidAmount))}
                </p>
              )}
            </div>
          )}

          {/* Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              placeholder="Nhập mô tả"
              rows={3}
              {...form.register('description')}
            />
          </div>

          {/* Hạch toán kết quả kinh doanh */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="affectsDebt"
              checked={form.watch('affectsDebt')}
              onCheckedChange={(checked) => form.setValue('affectsDebt', !!checked)}
            />
            <Label htmlFor="affectsDebt" className="text-sm font-normal cursor-pointer">
              Hạch toán kết quả kinh doanh
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Hạch toán kết quả kinh doanh đang được thiết lập theo loại phiếu thu. Bạn có thể thay đổi hoặc sửa thiết
            lập mặc định{' '}
            <Link href="/settings/receipt-types" className="text-primary hover:underline">
              tại đây
            </Link>
          </p>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Thoát
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Thêm'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
