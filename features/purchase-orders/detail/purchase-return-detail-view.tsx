import * as React from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../../components/ui/table';
import { MobileCard, MobileCardBody, MobileCardHeader } from '@/components/mobile/mobile-card';
import { Package, Eye } from 'lucide-react';
import { OptimizedImage } from '../../../components/ui/optimized-image';
import { ImagePreviewDialog } from '../../../components/ui/image-preview-dialog';
import { formatCurrency } from '../../../lib/print-mappers/types';
import { useProductsByIds } from '../../products/hooks/use-products';
import type { PurchaseReturn } from '../../purchase-returns/types';
import type { Payment } from '../../payments/types';
import type { Receipt } from '../../receipts/types';

interface PurchaseReturnDetailViewProps {
  purchaseReturn: PurchaseReturn;
  allTransactions: (Payment | Receipt)[];
  onPrintReturn?: () => void;
}

export function PurchaseReturnDetailView({ purchaseReturn, allTransactions, onPrintReturn: _onPrintReturn }: PurchaseReturnDetailViewProps) {
  const [previewImage, setPreviewImage] = React.useState<{ url: string; title: string } | null>(null);
  const _totalReturnValue = purchaseReturn.items.reduce((sum, item) => sum + (Number(item.returnQuantity || 0) * Number(item.unitPrice || 0)), 0);
  
  // ✅ FIX: Lookup products by both productSystemId and productId (SKU) to handle legacy data
  const productIdentifiers = React.useMemo(() => {
    const ids = new Set<string>();
    for (const item of purchaseReturn.items) {
      if (item.productSystemId) ids.add(item.productSystemId);
      if (item.productId) ids.add(item.productId);
    }
    return Array.from(ids);
  }, [purchaseReturn.items]);
  
  const { productsMap } = useProductsByIds(productIdentifiers);

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
        <div className="md:col-span-2 space-y-4 text-sm">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider md:text-h3 md:text-foreground md:normal-case md:tracking-normal">Thông tin đơn trả hàng nhà cung cấp</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <div className="text-sm font-medium text-muted-foreground">Chi nhánh:</div>
            <div className="text-sm font-medium">{purchaseReturn.branchName}</div>
            <div className="text-sm font-medium text-muted-foreground">Nhà cung cấp:</div>
            <div className="text-sm font-medium">{purchaseReturn.supplierName}</div>
            <div className="text-sm font-medium text-muted-foreground">Lý do hoàn trả:</div>
            <div className="text-sm font-medium">{purchaseReturn.reason || '-'}</div>
            <div className="text-sm font-medium text-muted-foreground">Nhận hoàn tiền:</div>
            <div className="text-sm font-medium">
              {purchaseReturn.refundAmount > 0 ? (
                <>
                  <span>{formatCurrency(purchaseReturn.refundAmount)} - {purchaseReturn.refundMethod}</span>
                  {refundReceipt && (
                    <Link href={`/receipts/${refundReceipt.systemId}`} className="ml-2 text-sm font-medium text-primary hover:underline">
                      ({refundReceipt.id})
                    </Link>
                  )}
                </>
              ) : 'Không'}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider md:text-h3 md:text-foreground md:normal-case md:tracking-normal">Thông tin sản phẩm trả</h3>
        <div className="hidden md:block border rounded-md bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">STT</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead className="text-center">SL Trả</TableHead>
                <TableHead className="text-right">Đơn giá trả</TableHead>
                <TableHead className="text-right">Thành tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseReturn.items.map((item, index) => {
                // ✅ FIX: Lookup product from cache to get correct display values
                // Try by productSystemId first, then by productId (SKU) for legacy data
                const product = productsMap.get(item.productSystemId) 
                  || productsMap.get(item.productId || '');
                
                // Use product lookup values with fallback to item values
                const displayProductSystemId = product?.systemId || item.productSystemId;
                const displayProductId = product?.id || item.productId || item.productSystemId;
                const displayProductName = product?.name || item.productName || item.productId || 'Sản phẩm';
                const displayImageUrl = product?.thumbnailImage || (product as unknown as { imageUrl?: string })?.imageUrl || item.imageUrl;
                
                return (
                <TableRow key={`${item.productSystemId}-${index}`}>
                  <TableCell className="text-center text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* Product thumbnail with Eye icon on hover */}
                      {displayImageUrl ? (
                        <button
                          type="button"
                          className="group/imagePreview relative w-10 h-10 rounded border overflow-hidden bg-muted cursor-pointer shrink-0"
                          onClick={() => setPreviewImage({ url: displayImageUrl, title: displayProductName })}
                        >
                          <OptimizedImage
                            src={displayImageUrl}
                            alt={displayProductName}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover transition-all group-hover/imagePreview:brightness-75"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/imagePreview:opacity-100 transition-opacity">
                            <Eye className="w-4 h-4 text-white drop-shadow-md" />
                          </div>
                        </button>
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center bg-muted rounded border shrink-0">
                          <Package className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      {/* Product info */}
                      <div>
                        <span className="font-medium">{displayProductName}</span>
                        <div className="text-xs text-muted-foreground">
                          Hàng hóa - <Link href={`/products/${displayProductSystemId}`} className="text-primary hover:underline">{displayProductId}</Link>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{item.returnQuantity || 0}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.unitPrice || 0)}</TableCell>
                  <TableCell className="text-sm font-semibold text-right">{formatCurrency(Number(item.returnQuantity || 0) * Number(item.unitPrice || 0))}</TableCell>
                </TableRow>
              );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="text-sm font-bold text-right">Tổng giá trị trả</TableCell>
                <TableCell className="text-sm font-bold text-right">{formatCurrency(purchaseReturn.totalReturnValue)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        {/* Mobile: card stack */}
        <div className="md:hidden space-y-3">
          {purchaseReturn.items.map((item, index) => {
            const product = productsMap.get(item.productSystemId)
              || productsMap.get(item.productId || '');
            const displayProductSystemId = product?.systemId || item.productSystemId;
            const displayProductId = product?.id || item.productId || item.productSystemId;
            const displayProductName = product?.name || item.productName || item.productId || 'Sản phẩm';
            const displayImageUrl = product?.thumbnailImage || (product as unknown as { imageUrl?: string })?.imageUrl || item.imageUrl;
            const lineTotal = Number(item.returnQuantity || 0) * Number(item.unitPrice || 0);

            return (
              <MobileCard key={`m-${item.productSystemId}-${index}`} inert>
                <MobileCardHeader className="items-start justify-between">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    {displayImageUrl ? (
                      <button
                        type="button"
                        className="group/imagePreview relative w-12 h-12 rounded border overflow-hidden bg-muted cursor-pointer shrink-0"
                        onClick={() => setPreviewImage({ url: displayImageUrl, title: displayProductName })}
                      >
                        <OptimizedImage
                          src={displayImageUrl}
                          alt={displayProductName}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover transition-all group-hover/imagePreview:brightness-75"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/imagePreview:opacity-100 transition-opacity">
                          <Eye className="w-4 h-4 text-white drop-shadow-md" />
                        </div>
                      </button>
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center bg-muted rounded border shrink-0">
                        <Package className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">
                        #{index + 1}
                      </div>
                      <div className="mt-0.5 text-sm font-semibold line-clamp-2">
                        {displayProductName}
                      </div>
                      <Link href={`/products/${displayProductSystemId}`} className="text-xs text-primary hover:underline truncate block">
                        {displayProductId}
                      </Link>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-base font-bold leading-none">{formatCurrency(lineTotal)}</div>
                    <div className="mt-1 text-xs text-muted-foreground">Thành tiền</div>
                  </div>
                </MobileCardHeader>
                <MobileCardBody>
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                    <div>
                      <dt className="text-xs text-muted-foreground">SL trả</dt>
                      <dd className="font-medium">{item.returnQuantity || 0}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Đơn giá trả</dt>
                      <dd className="font-medium">{formatCurrency(item.unitPrice || 0)}</dd>
                    </div>
                  </dl>
                </MobileCardBody>
              </MobileCard>
            );
          })}
          <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
            <span className="font-bold">Tổng giá trị trả</span>
            <span className="font-bold">{formatCurrency(purchaseReturn.totalReturnValue)}</span>
          </div>
        </div>
      </div>

      {/* Image Preview Dialog */}
      <ImagePreviewDialog
        open={!!previewImage}
        onOpenChange={(open) => !open && setPreviewImage(null)}
        images={previewImage ? [previewImage.url] : []}
        title={previewImage?.title || 'Xem ảnh'}
      />
    </div>
  );
}
