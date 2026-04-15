import * as React from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../../components/ui/table';
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
        <div className="border rounded-md bg-card overflow-x-auto">
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
