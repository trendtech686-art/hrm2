import * as React from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../../components/ui/table';
import { formatCurrency } from '../../../lib/print-mappers/types';
import type { InventoryReceipt } from '../../inventory-receipts/types';

interface InventoryReceiptDetailViewProps {
  receipt: InventoryReceipt;
}

export function InventoryReceiptDetailView({ receipt }: InventoryReceiptDetailViewProps) {
  const totalQuantity = receipt.items.reduce((sum, item) => sum + Number(item.receivedQuantity), 0);
  const totalValue = receipt.items.reduce((sum, item) => sum + (Number(item.receivedQuantity) * Number(item.unitPrice)), 0);

  return (
    <div className="p-6 bg-slate-100 dark:bg-slate-800/20">
      <div className="space-y-1 text-body-sm mb-6">
        <h3 className="text-h3">Thông tin phiếu nhập kho</h3>
        <p className="text-muted-foreground">Người nhập: {receipt.receiverName}</p>
        <p className="text-muted-foreground">Ghi chú: {receipt.notes || '-'}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-h3">Sản phẩm đã nhập</h3>
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã SP</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead className="text-center">SL đặt</TableHead>
                <TableHead className="text-center">SL thực nhập</TableHead>
                <TableHead className="text-right">Đơn giá</TableHead>
                <TableHead className="text-right">Thành tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipt.items.map(item => (
                <TableRow key={item.productSystemId}>
                  <TableCell>
                    <Link href={`/products/${item.productSystemId}`}
                      className="text-body-sm font-medium text-primary hover:underline"
                    >
                      {item.productId}
                    </Link>
                  </TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell className="text-center">{item.orderedQuantity}</TableCell>
                  <TableCell className="text-body-sm font-semibold text-center">{item.receivedQuantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell className="text-body-sm font-semibold text-right">{formatCurrency(item.receivedQuantity * item.unitPrice)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="text-body-sm font-bold text-right">Tổng cộng</TableCell>
                <TableCell className="text-body-sm font-bold text-center">{totalQuantity}</TableCell>
                <TableCell />
                <TableCell className="text-body-sm font-bold text-right">{formatCurrency(totalValue)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
}
