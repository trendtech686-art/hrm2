import * as React from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../../components/ui/table';
import { MobileCard, MobileCardBody, MobileCardHeader } from '@/components/mobile/mobile-card';
import { formatCurrency } from '../../../lib/print-mappers/types';
import type { InventoryReceipt } from '../../inventory-receipts/types';
import { Package, Eye } from 'lucide-react';
import { OptimizedImage } from '../../../components/ui/optimized-image';
import { ImagePreviewDialog } from '../../../components/ui/image-preview-dialog';

interface InventoryReceiptDetailViewProps {
  receipt: InventoryReceipt;
}

export function InventoryReceiptDetailView({ receipt }: InventoryReceiptDetailViewProps) {
  const [previewImage, setPreviewImage] = React.useState<{ url: string; title: string } | null>(null);
  const totalQuantity = receipt.items.reduce((sum, item) => sum + Number(item.receivedQuantity), 0);
  // totalValue uses unitCost (includes allocated fees) not unitPrice
  const totalValue = receipt.items.reduce((sum, item) => {
    const cost = Number((item as unknown as { unitCost?: number }).unitCost || item.unitPrice || 0);
    return sum + (Number(item.receivedQuantity) * cost);
  }, 0);

  return (
    <div className="p-6 bg-muted/50">
      <div className="space-y-1 text-sm mb-6">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider md:text-h3 md:text-foreground md:normal-case md:tracking-normal">Thông tin phiếu nhập kho</h3>
        <p className="text-muted-foreground">Người nhập: {receipt.receiverName}</p>
        <p className="text-muted-foreground">Ghi chú: {receipt.notes || '-'}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider md:text-h3 md:text-foreground md:normal-case md:tracking-normal">Sản phẩm đã nhập</h3>
        <div className="hidden md:block border rounded-md bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">STT</TableHead>
                <TableHead className="w-14">Ảnh</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead className="text-center">SL đặt</TableHead>
                <TableHead className="text-center">SL thực nhập</TableHead>
                <TableHead className="text-right">Đơn giá</TableHead>
                <TableHead className="text-right">Giá vốn</TableHead>
                <TableHead className="text-right">Thành tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipt.items.map((item, index) => {
                const unitCost = Number((item as unknown as { unitCost?: number }).unitCost || item.unitPrice || 0);
                const imageUrl = (item as unknown as { imageUrl?: string }).imageUrl;
                return (
                <TableRow key={`${item.productSystemId}-${index}`}>
                  <TableCell className="text-center text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    {imageUrl ? (
                      <button 
                        type="button"
                        className="group/imagePreview relative w-10 h-10 rounded border overflow-hidden bg-muted cursor-pointer"
                        onClick={() => setPreviewImage({ url: imageUrl, title: item.productName })}
                      >
                        <OptimizedImage 
                          src={imageUrl} 
                          alt={item.productName}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover transition-all group-hover/imagePreview:brightness-75"
                        />
                        <div className="absolute inset-0 flex items-center justify-center md:opacity-0 md:group-hover/imagePreview:opacity-100 transition-opacity">
                          <Eye className="w-4 h-4 text-white drop-shadow-md" />
                        </div>
                      </button>
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                        <Package className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">{item.productName}</span>
                      <Link href={`/products/${item.productSystemId}`}
                        className="text-xs text-primary hover:underline"
                      >
                        {item.productId}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{item.orderedQuantity}</TableCell>
                  <TableCell className="text-sm font-semibold text-center">{item.receivedQuantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell className="text-right text-primary font-medium">{formatCurrency(unitCost)}</TableCell>
                  <TableCell className="text-sm font-semibold text-right">{formatCurrency(Number(item.receivedQuantity) * unitCost)}</TableCell>
                </TableRow>
              );})}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="text-sm font-bold text-right">Tổng cộng</TableCell>
                <TableCell className="text-sm font-bold text-center">{totalQuantity}</TableCell>
                <TableCell />
                <TableCell />
                <TableCell className="text-sm font-bold text-right">{formatCurrency(totalValue)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        {/* Mobile: card stack */}
        <div className="md:hidden space-y-3">
          {receipt.items.map((item, index) => {
            const unitCost = Number((item as unknown as { unitCost?: number }).unitCost || item.unitPrice || 0);
            const imageUrl = (item as unknown as { imageUrl?: string }).imageUrl;
            const lineTotal = Number(item.receivedQuantity) * unitCost;

            return (
              <MobileCard key={`m-${item.productSystemId}-${index}`} inert>
                <MobileCardHeader className="items-start justify-between">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    {imageUrl ? (
                      <button
                        type="button"
                        className="group/imagePreview relative w-12 h-12 rounded border overflow-hidden bg-muted cursor-pointer shrink-0"
                        onClick={() => setPreviewImage({ url: imageUrl, title: item.productName })}
                      >
                        <OptimizedImage
                          src={imageUrl}
                          alt={item.productName}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover transition-all group-hover/imagePreview:brightness-75"
                        />
                        <div className="absolute inset-0 flex items-center justify-center md:opacity-0 md:group-hover/imagePreview:opacity-100 transition-opacity">
                          <Eye className="w-4 h-4 text-white drop-shadow-md" />
                        </div>
                      </button>
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">
                        #{index + 1}
                      </div>
                      <div className="mt-0.5 text-sm font-semibold line-clamp-2">
                        {item.productName}
                      </div>
                      <Link href={`/products/${item.productSystemId}`} className="text-xs text-primary hover:underline truncate block">
                        {item.productId}
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
                      <dt className="text-xs text-muted-foreground">SL đặt</dt>
                      <dd className="font-medium">{item.orderedQuantity}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">SL thực nhập</dt>
                      <dd className="font-semibold">{item.receivedQuantity}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Đơn giá</dt>
                      <dd className="font-medium">{formatCurrency(item.unitPrice)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Giá vốn</dt>
                      <dd className="font-medium text-primary">{formatCurrency(unitCost)}</dd>
                    </div>
                  </dl>
                </MobileCardBody>
              </MobileCard>
            );
          })}
          <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
            <span className="font-bold">Tổng cộng ({totalQuantity})</span>
            <span className="font-bold">{formatCurrency(totalValue)}</span>
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
