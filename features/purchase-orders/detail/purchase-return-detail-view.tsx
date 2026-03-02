import * as React from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Printer } from 'lucide-react';
import { formatCurrency } from '../../../lib/print-mappers/types';
import type { PurchaseReturn } from '../../purchase-returns/types';
import type { Payment } from '../../payments/types';
import type { Receipt } from '../../receipts/types';

interface PurchaseReturnDetailViewProps {
  purchaseReturn: PurchaseReturn;
  allTransactions: (Payment | Receipt)[];
  onPrintReturn?: () => void;
}

export function PurchaseReturnDetailView({ purchaseReturn, allTransactions, onPrintReturn }: PurchaseReturnDetailViewProps) {
  const _totalReturnValue = purchaseReturn.items.reduce((sum, item) => sum + (Number(item.returnQuantity || 0) * Number(item.unitPrice || 0)), 0);

  const refundReceipt = React.useMemo(() => {
    if (purchaseReturn.refundAmount <= 0) return null;
    // Find receipt where supplier refunded money to us
    return allTransactions.find((transaction): transaction is Receipt => {
      if (!('payerTypeName' in transaction)) {
        return false;
      }
      const receipt = transaction as Receipt;
      return receipt.payerTypeName === 'Nhà cung cấp' && receipt.payerName === purchaseReturn.supplierName;
    }) ?? null;
  }, [purchaseReturn, allTransactions]);

  return (
    <div className="p-6 bg-slate-100 dark:bg-slate-800/20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 space-y-4 text-body-sm">
          <h3 className="text-h3">Thông tin đơn trả hàng nhà cung cấp</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <div className="text-body-sm font-medium text-muted-foreground">Chi nhánh:</div>
            <div className="text-body-sm font-medium">{purchaseReturn.branchName}</div>
            <div className="text-body-sm font-medium text-muted-foreground">Nhà cung cấp:</div>
            <div className="text-body-sm font-medium">{purchaseReturn.supplierName}</div>
            <div className="text-body-sm font-medium text-muted-foreground">Lý do hoàn trả:</div>
            <div className="text-body-sm font-medium">{purchaseReturn.reason || '-'}</div>
            <div className="text-body-sm font-medium text-muted-foreground">Nhận hoàn tiền:</div>
            <div className="text-body-sm font-medium">
              {purchaseReturn.refundAmount > 0 ? (
                <>
                  <span>{formatCurrency(purchaseReturn.refundAmount)} - {purchaseReturn.refundMethod}</span>
                  {refundReceipt && (
                    <Link href={`/receipts/${refundReceipt.systemId}`} className="ml-2 text-body-sm font-medium text-primary hover:underline">
                      ({refundReceipt.id})
                    </Link>
                  )}
                </>
              ) : 'Không'}
            </div>
          </div>
        </div>
        <div className="flex items-start justify-end">
          <Button variant="outline" onClick={onPrintReturn}>
            <Printer className="mr-2 h-4 w-4" />
            In đơn trả
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-h3">Thông tin sản phẩm trả</h3>
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã SKU</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead className="text-center">SL Trả</TableHead>
                <TableHead className="text-right">Đơn giá trả</TableHead>
                <TableHead className="text-right">Thành tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseReturn.items.map((item, _index) => (
                <TableRow key={item.productSystemId}>
                  <TableCell>
                    <Link href={`/products/${item.productSystemId}`}
                      className="text-body-sm font-medium text-primary hover:underline"
                    >
                      {item.productId}
                    </Link>
                  </TableCell>
                  <TableCell>{item.productName || '-'}</TableCell>
                  <TableCell className="text-center">{item.returnQuantity || 0}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.unitPrice || 0)}</TableCell>
                  <TableCell className="text-body-sm font-semibold text-right">{formatCurrency((item.returnQuantity || 0) * (item.unitPrice || 0))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="text-body-sm font-bold text-right">Tổng giá trị trả</TableCell>
                <TableCell className="text-body-sm font-bold text-right">{formatCurrency(purchaseReturn.totalReturnValue)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
}
