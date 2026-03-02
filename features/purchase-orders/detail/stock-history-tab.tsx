import * as React from 'react';
import Link from 'next/link';
import { formatDateCustom, parseDate, getCurrentDate, getDaysDiff } from '@/lib/date-utils';
import { formatCurrency } from '@/lib/format-utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { ChevronDown, ChevronRight, Printer } from 'lucide-react';
import { InventoryReceiptDetailView } from './inventory-receipt-detail-view';
import { PurchaseReturnDetailView } from './purchase-return-detail-view';
import type { InventoryReceipt } from '../../inventory-receipts/types';
import type { PurchaseReturn } from '../../purchase-returns/types';
import type { Payment } from '../../payments/types';
import type { Receipt } from '../../receipts/types';

interface StockHistoryTabProps {
  poReceipts: InventoryReceipt[];
  purchaseReturns: PurchaseReturn[];
  allTransactions: (Payment | Receipt)[];
  onPrintReceipt?: (receipt: InventoryReceipt) => void;
  onPrintReturn?: (purchaseReturn: PurchaseReturn) => void;
}

export function StockHistoryTab({ 
  poReceipts, 
  purchaseReturns, 
  allTransactions,
  onPrintReceipt,
  onPrintReturn,
}: StockHistoryTabProps) {
  const [expandedRowId, setExpandedRowId] = React.useState<string | null>(null);

  const stockMovements = React.useMemo(() => {
    const receipts = poReceipts.map(r => ({
      type: 'receipt' as const,
      data: r,
      sortDate: r.receivedDate,
    }));
    const returns = purchaseReturns.map(pr => ({
      type: 'return' as const,
      data: pr,
      sortDate: pr.returnDate,
    }));
    return [...receipts, ...returns].sort((a, b) => getDaysDiff(parseDate(b.sortDate) || getCurrentDate(), parseDate(a.sortDate) || getCurrentDate()))
  }, [poReceipts, purchaseReturns]);

  const toggleRow = (systemId: string) => {
    setExpandedRowId(currentId => (currentId === systemId ? null : systemId));
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Mã phiếu</TableHead>
              <TableHead>Loại phiếu</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Nhân viên tạo</TableHead>
              <TableHead className="text-center">Tổng SL</TableHead>
              <TableHead className="text-right">Tổng giá trị</TableHead>
              <TableHead className="w-25 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockMovements.map(movement => {
              const isReceipt = movement.type === 'receipt';
              const data = movement.data;
              const totalQty = isReceipt 
                ? (data as InventoryReceipt).items.reduce((sum, i) => sum + Number(i.receivedQuantity || 0), 0)
                : (data as PurchaseReturn).items.reduce((sum, i) => sum + Number(i.returnQuantity || 0), 0);
              
              // Tính tổng giá trị
              const totalValue = isReceipt
                ? (data as InventoryReceipt).items.reduce((sum, i) => sum + Number(i.receivedQuantity || 0) * Number(i.unitPrice || 0), 0)
                : (data as PurchaseReturn).items.reduce((sum, i) => sum + Number(i.returnQuantity || 0) * Number(i.unitPrice || 0), 0);

              return (
                <React.Fragment key={data.systemId}>
                  <TableRow onClick={() => toggleRow(data.systemId)} className="cursor-pointer">
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
                        {expandedRowId === data.systemId ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={isReceipt ? `/inventory-receipts/${data.systemId}` : `/purchase-returns/${data.systemId}`}
                        className="text-body-sm font-medium text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {data.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {isReceipt 
                        ? <Badge variant="success" className="bg-green-100 text-green-700">Nhập hàng</Badge> 
                        : <Badge variant="destructive" className="bg-red-100 text-red-700">Xuất trả NCC</Badge>
                      }
                    </TableCell>
                    {/* FIX: Use type guard `isReceipt` to access correct properties */}
                    <TableCell>{formatDateCustom(parseDate(isReceipt ? (data as InventoryReceipt).receivedDate : (data as PurchaseReturn).returnDate) || getCurrentDate(), 'dd/MM/yyyy HH:mm')}</TableCell>
                    <TableCell>{isReceipt ? (data as InventoryReceipt).receiverName : (data as PurchaseReturn).creatorName}</TableCell>
                    <TableCell className="text-center">{totalQty}</TableCell>
                    <TableCell className="text-right">{formatCurrency(totalValue)}</TableCell>
                    <TableCell className="text-right">
                      {isReceipt ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPrintReceipt?.(data as InventoryReceipt);
                          }}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPrintReturn?.(data as PurchaseReturn);
                          }}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedRowId === data.systemId && (
                    <TableRow className="bg-slate-50 dark:bg-slate-900/20 hover:bg-slate-50 dark:hover:bg-slate-900/20">
                      <TableCell colSpan={8} className="p-0">
                        {isReceipt 
                          ? <InventoryReceiptDetailView 
                              receipt={data as InventoryReceipt} 
                            />
                          : <PurchaseReturnDetailView 
                              purchaseReturn={data as PurchaseReturn} 
                              allTransactions={allTransactions} 
                              onPrintReturn={() => onPrintReturn?.(data as PurchaseReturn)}
                            />
                        }
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              )
            })}
            {stockMovements.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">Chưa có lịch sử xuất nhập kho.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
