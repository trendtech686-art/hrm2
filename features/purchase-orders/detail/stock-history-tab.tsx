import { useState, useMemo, Fragment } from 'react';
import Link from 'next/link';
import { formatDateCustom, parseDate, getCurrentDate, getDaysDiff } from '@/lib/date-utils';
import { formatCurrency } from '@/lib/format-utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { MobileCard, MobileCardBody, MobileCardFooter, MobileCardHeader } from '@/components/mobile/mobile-card';
import { ChevronDown, ChevronRight, Printer } from 'lucide-react';
import { InventoryReceiptDetailView } from './inventory-receipt-detail-view';
import { PurchaseReturnDetailView } from './purchase-return-detail-view';
import type { InventoryReceipt } from '../../inventory-receipts/types';
import type { PurchaseReturn } from '../../purchase-returns/types';
import type { Payment } from '../../payments/types';
import type { Receipt } from '../../receipts/types';
import { mobileBleedCardClass } from '@/components/layout/page-section';

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
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const stockMovements = useMemo(() => {
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
    <Card className={mobileBleedCardClass}>
      <CardContent className="p-0">
        <div className="hidden md:block overflow-x-auto">
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
              
              // Tính tổng giá trị - use unitCost (includes fees) for receipts
              const totalValue = isReceipt
                ? (data as InventoryReceipt).items.reduce((sum, i) => {
                    const cost = Number((i as unknown as { unitCost?: number }).unitCost || i.unitPrice || 0);
                    return sum + Number(i.receivedQuantity || 0) * cost;
                  }, 0)
                : (data as PurchaseReturn).items.reduce((sum, i) => sum + Number(i.returnQuantity || 0) * Number(i.unitPrice || 0), 0);

              return (
                <Fragment key={data.systemId}>
                  <TableRow onClick={() => toggleRow(data.systemId)} className="cursor-pointer">
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-11 w-11 text-blue-500" aria-label={expandedRowId === data.systemId ? "Thu gọn" : "Mở rộng"}>
                        {expandedRowId === data.systemId ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={isReceipt ? `/inventory-receipts/${data.systemId}` : `/purchase-returns/${data.systemId}`}
                        className="text-sm font-medium text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {data.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {isReceipt 
                        ? <Badge variant="success" className="bg-success/15 text-success-foreground">Nhập hàng</Badge> 
                        : <Badge variant="destructive" className="bg-destructive/15 text-destructive">Xuất trả NCC</Badge>
                      }
                    </TableCell>
                    {/* FIX: Use createdAt for actual time, fallback to receivedDate/returnDate */}
                    <TableCell>{formatDateCustom(parseDate((data as { createdAt?: string }).createdAt || (isReceipt ? (data as InventoryReceipt).receivedDate : (data as PurchaseReturn).returnDate)) || getCurrentDate(), 'dd/MM/yyyy HH:mm')}</TableCell>
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
                    <TableRow className="bg-muted/40 hover:bg-muted/60">
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
                </Fragment>
              )
            })}
            {stockMovements.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">Chưa có lịch sử xuất nhập kho.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>

        {/* Mobile: card stack */}
        <div className="md:hidden space-y-3 p-3">
          {stockMovements.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              Chưa có lịch sử xuất nhập kho.
            </div>
          ) : (
            stockMovements.map(movement => {
              const isReceipt = movement.type === 'receipt';
              const data = movement.data;
              const totalQty = isReceipt
                ? (data as InventoryReceipt).items.reduce((sum, i) => sum + Number(i.receivedQuantity || 0), 0)
                : (data as PurchaseReturn).items.reduce((sum, i) => sum + Number(i.returnQuantity || 0), 0);
              const totalValue = isReceipt
                ? (data as InventoryReceipt).items.reduce((sum, i) => {
                    const cost = Number((i as unknown as { unitCost?: number }).unitCost || i.unitPrice || 0);
                    return sum + Number(i.receivedQuantity || 0) * cost;
                  }, 0)
                : (data as PurchaseReturn).items.reduce((sum, i) => sum + Number(i.returnQuantity || 0) * Number(i.unitPrice || 0), 0);
              const isExpanded = expandedRowId === data.systemId;
              const createdAt = (data as { createdAt?: string }).createdAt || (isReceipt ? (data as InventoryReceipt).receivedDate : (data as PurchaseReturn).returnDate);

              return (
                <MobileCard
                  key={data.systemId}
                  inert
                  emphasis={isReceipt ? 'success' : 'destructive'}
                >
                  <MobileCardHeader className="items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Mã phiếu</div>
                      <Link
                        href={isReceipt ? `/inventory-receipts/${data.systemId}` : `/purchase-returns/${data.systemId}`}
                        className="mt-0.5 block text-sm font-semibold text-primary hover:underline truncate"
                      >
                        {data.id}
                      </Link>
                      <div className="mt-1">
                        {isReceipt
                          ? <Badge variant="success" className="bg-success/15 text-success-foreground">Nhập hàng</Badge>
                          : <Badge variant="destructive" className="bg-destructive/15 text-destructive">Xuất trả NCC</Badge>
                        }
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-bold leading-none">{formatCurrency(totalValue)}</div>
                      <div className="mt-1 text-xs text-muted-foreground">Tổng giá trị</div>
                    </div>
                  </MobileCardHeader>
                  <MobileCardBody>
                    <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                      <div>
                        <dt className="text-xs text-muted-foreground">Ngày tạo</dt>
                        <dd className="font-medium">
                          {formatDateCustom(parseDate(createdAt) || getCurrentDate(), 'dd/MM/yyyy HH:mm')}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Tổng SL</dt>
                        <dd className="font-medium">{totalQty}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-xs text-muted-foreground">Nhân viên tạo</dt>
                        <dd className="font-medium truncate">
                          {isReceipt ? (data as InventoryReceipt).receiverName : (data as PurchaseReturn).creatorName}
                        </dd>
                      </div>
                    </dl>
                  </MobileCardBody>
                  <MobileCardFooter>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRow(data.systemId)}
                    >
                      {isExpanded ? (<><ChevronDown className="h-4 w-4 mr-1" />Thu gọn</>) : (<><ChevronRight className="h-4 w-4 mr-1" />Chi tiết</>)}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (isReceipt) onPrintReceipt?.(data as InventoryReceipt);
                        else onPrintReturn?.(data as PurchaseReturn);
                      }}
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      In
                    </Button>
                  </MobileCardFooter>
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-border/50 -mx-1">
                      {isReceipt
                        ? <InventoryReceiptDetailView receipt={data as InventoryReceipt} />
                        : <PurchaseReturnDetailView
                            purchaseReturn={data as PurchaseReturn}
                            allTransactions={allTransactions}
                            onPrintReturn={() => onPrintReturn?.(data as PurchaseReturn)}
                          />
                      }
                    </div>
                  )}
                </MobileCard>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
