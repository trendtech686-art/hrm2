/**
 * Bảng sản phẩm cho trang chi tiết
 * 
 * Hiển thị đầy đủ:
 * STT | Tên SP | Loại SP | Số lượng | Đơn giá | Hình ảnh | Kết quả | Ghi chú | Thành tiền
 * 
 * Mobile-first: Hiển thị dạng card trên mobile, table trên desktop
 */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { ImagePreviewDialog } from '../../../components/ui/image-preview-dialog';
import { Separator } from '../../../components/ui/separator';
import { Card, CardContent } from '../../../components/ui/card';
import { cn } from '../../../lib/utils';
import { RESOLUTION_LABELS, SETTLEMENT_TYPE_LABELS } from '../types';
import type { WarrantyProduct, WarrantyTicket } from '../types';
import { useProductStore } from '../../products/store';
import { useProductTypeStore } from '../../settings/inventory/product-type-store';
import type { SystemId } from '../../../lib/id-types';

interface WarrantyProductsDetailTableProps {
  products: WarrantyProduct[];
  ticket?: Pick<WarrantyTicket, 'shippingFee'>; // Optional: chỉ cần phí ship để tính bù trừ
}

export function WarrantyProductsDetailTable({ products, ticket }: WarrantyProductsDetailTableProps) {
  const router = useRouter();
  const { data: allProducts } = useProductStore();
  const { findById: findProductTypeById } = useProductTypeStore();
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  const [showPreview, setShowPreview] = React.useState(false);

  // Memoize product lookup map for better performance
  const productMap = React.useMemo(() => {
    const map = new Map<string, any>();
    allProducts.forEach(p => map.set(p.id, p));
    return map;
  }, [allProducts]);

  const getProductTypeName = React.useCallback((productTypeSystemId: SystemId) => {
    const productType = findProductTypeById(productTypeSystemId);
    return productType?.name || 'Hàng hóa';
  }, [findProductTypeById]);

  // Calculate refund info for out-of-stock items
  const refundInfo = React.useMemo(() => {
    if (!ticket) return null;

    const outOfStockValue = products
      .filter(p => p.resolution === 'out_of_stock')
      .reduce((sum, p) => sum + ((p.quantity || 1) * (p.unitPrice || 0)), 0);
    
    const shippingFee = ticket.shippingFee || 0;
    const netRefund = outOfStockValue - shippingFee; // Trừ phí ship từ tiền hoàn
    const shouldShowRefund = outOfStockValue > 0;

    return {
      outOfStockValue,      // Tổng tiền hàng hết
      shippingFee,          // Phí ship (khách quên trả)
      netRefund,            // Tiền thực tế khách nhận
      shouldShowRefund,     // Có hiển thị section không
    };
  }, [products, ticket]);

  const getResolutionBadge = React.useCallback((resolution: string) => {
    const variants: Record<string, string> = {
      return: 'bg-green-100 text-green-800',
      replace: 'bg-blue-100 text-blue-800',
      deduct: 'bg-orange-100 text-orange-800',
      out_of_stock: 'bg-red-100 text-red-800',
    };
    return variants[resolution] || 'bg-gray-100 text-gray-800';
  }, []);

  // Mobile Card View Component
  const MobileProductCard = ({ product, index }: { product: WarrantyProduct; index: number }) => {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-3">
            {/* Header: STT + Tên sản phẩm */}
            <div className="flex gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-body-xs font-semibold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-body-sm leading-snug">{product.productName}</p>
                {product.sku ? (
                  <button
                    onClick={() => {
                      const productDetail = productMap.get(product.sku!);
                      if (productDetail) {
                        router.push(`/products/${productDetail.systemId}`);
                      }
                    }}
                    className="text-body-xs font-mono text-primary hover:underline hover:text-primary/80 transition-colors block mt-0.5"
                  >
                    {product.sku}
                  </button>
                ) : null}
              </div>
              <Badge className={cn(getResolutionBadge(product.resolution), "text-body-xs px-2 py-0.5 h-fit")}>
                {RESOLUTION_LABELS[product.resolution]}
              </Badge>
            </div>

            <Separator />

            {/* Số lượng và Đơn giá */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-body-xs text-muted-foreground mb-0.5">Số lượng</p>
                <p className="font-semibold text-body-sm">{product.quantity || 1}</p>
              </div>
              <div>
                <p className="text-body-xs text-muted-foreground mb-0.5">Đơn giá</p>
                <p className="font-semibold text-body-sm font-mono">
                  {new Intl.NumberFormat('vi-VN').format(product.unitPrice || 0)} đ
                </p>
              </div>
            </div>

            {/* Hình ảnh */}
            {product.productImages && product.productImages.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-body-xs text-muted-foreground mb-1.5">Hình ảnh</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {product.productImages.filter((url): url is string => !!url && typeof url === 'string').slice(0, 3).map((url, imgIdx) => (
                      <div 
                        key={imgIdx} 
                        className="relative group/image w-14 h-14 flex-shrink-0"
                      >
                        <img
                          src={url}
                          alt={`SP ${index + 1} - ${imgIdx + 1}`}
                          className="w-full h-full object-cover rounded border cursor-pointer transition-all"
                          loading="lazy"
                          onClick={() => {
                            setPreviewImages((product.productImages || []).filter((url): url is string => !!url && typeof url === 'string'));
                            setPreviewIndex(imgIdx);
                            setShowPreview(true);
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/50 transition-all rounded flex items-center justify-center opacity-0 group-hover/image:opacity-100 pointer-events-none">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>
                    ))}
                    {product.productImages.filter((url): url is string => !!url && typeof url === 'string').length > 3 && (
                      <div className="w-14 h-14 rounded border bg-muted flex items-center justify-center text-body-xs font-medium text-muted-foreground flex-shrink-0">
                        +{product.productImages.filter((url): url is string => !!url && typeof url === 'string').length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Ghi chú */}
            {((product.issueDescription && String(product.issueDescription).trim()) || 
              (product.notes && String(product.notes).trim())) && (
              <>
                <Separator />
                <div className="space-y-1">
                  {product.issueDescription && String(product.issueDescription).trim() && (
                    <p className="text-body-xs text-orange-600 font-medium leading-snug">
                      <span className="text-muted-foreground">Vấn đề:</span> {product.issueDescription}
                    </p>
                  )}
                  {product.notes && String(product.notes).trim() && (
                    <p className="text-body-xs text-muted-foreground leading-snug">
                      {product.notes}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Tổng tiền */}
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-body-xs text-muted-foreground">Thành tiền:</span>
              <span className="font-bold text-body-sm">
                {new Intl.NumberFormat('vi-VN').format((product.quantity || 1) * (product.unitPrice || 0))} đ
              </span>
            </div>

            {/* Bù trừ */}
            {product.resolution === 'out_of_stock' && (
              <div className="flex justify-between items-center bg-red-50 -mx-3 -mb-3 px-3 py-2 sm:-mx-4 sm:-mb-4 sm:px-4">
                <span className="text-body-xs font-medium text-red-700">Bù trừ:</span>
                <span className="font-bold text-body-sm text-red-600">
                  {new Intl.NumberFormat('vi-VN').format((product.quantity || 1) * (product.unitPrice || 0))} đ
                </span>
              </div>
            )}

            {product.resolution === 'deduct' && product.deductionAmount && (
              <div className="flex justify-between items-center bg-orange-50 -mx-3 -mb-3 px-3 py-2 sm:-mx-4 sm:-mb-4 sm:px-4">
                <span className="text-body-xs font-medium text-orange-700">Trừ tiền:</span>
                <span className="font-bold text-body-sm text-orange-600">
                  {new Intl.NumberFormat('vi-VN').format(product.deductionAmount)} đ
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {/* Mobile View - Card Layout */}
      <div className="block lg:hidden space-y-3">
        {products.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-body-sm">
            Chưa có sản phẩm nào
          </div>
        ) : (
          products.map((product, index) => (
            <MobileProductCard key={product.systemId} product={product} index={index} />
          ))
        )}
      </div>

      {/* Desktop View - Table Layout */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center text-body-sm">STT</TableHead>
              <TableHead className="min-w-[200px] text-body-sm">Tên sản phẩm</TableHead>
              <TableHead className="w-20 text-center text-body-sm">SL</TableHead>
              <TableHead className="w-32 text-right text-body-sm">Đơn giá</TableHead>
              <TableHead className="w-32 text-body-sm">Hình ảnh</TableHead>
              <TableHead className="w-32 text-body-sm">Kết quả</TableHead>
              <TableHead className="min-w-[150px] text-body-sm">Ghi chú</TableHead>
              <TableHead className="w-32 text-right text-body-sm">Thành tiền</TableHead>
              <TableHead className="w-32 text-right text-body-sm">Bù trừ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground py-6 sm:py-8 text-body-xs sm:text-body-sm">
                Chưa có sản phẩm nào
              </TableCell>
            </TableRow>
          ) : (
            products.map((product, index) => {
              const productDetail = allProducts.find(p => p.id === product.sku);
              const productTypeName = productDetail?.productTypeSystemId 
                ? getProductTypeName(productDetail.productTypeSystemId)
                : 'Hàng hóa';
              
              return (
              <TableRow key={product.systemId}>
                {/* STT */}
                <TableCell className="text-center font-medium text-body-xs sm:text-body-sm">{index + 1}</TableCell>

                {/* Tên sản phẩm + Loại SP + Mã SKU */}
                <TableCell>
                  <div className="space-y-0.5 sm:space-y-1">
                    <p className="font-medium text-body-xs sm:text-body-sm leading-snug">{product.productName}</p>
                    <div className="flex items-center gap-1 text-[10px] sm:text-body-xs text-muted-foreground">
                      <span>{productTypeName}</span>
                      <span>-</span>
                      {product.sku ? (
                        <button
                          onClick={() => {
                            const productDetail = allProducts.find(p => p.id === product.sku);
                            if (productDetail) {
                              router.push(`/products/${productDetail.systemId}`);
                            }
                          }}
                          className="font-mono text-primary hover:underline hover:text-primary/80 transition-colors"
                        >
                          {product.sku}
                        </button>
                      ) : (
                        <span>—</span>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Số lượng */}
                <TableCell className="text-center text-body-xs sm:text-body-sm font-medium">
                  {product.quantity || 1}
                </TableCell>

                {/* Đơn giá */}
                <TableCell className="text-right font-mono text-body-xs sm:text-body-sm">
                  {new Intl.NumberFormat('vi-VN').format(product.unitPrice || 0)} đ
                </TableCell>

                {/* Hình ảnh */}
                <TableCell>
                  {product.productImages && product.productImages.length > 0 ? (
                    <div className="flex gap-1 sm:gap-1.5 items-center">
                      {product.productImages.filter((url): url is string => !!url && typeof url === 'string').slice(0, 2).map((url, imgIdx) => (
                        <div 
                          key={imgIdx} 
                          className="relative group/image w-8 h-8 sm:w-10 sm:h-9 flex-shrink-0"
                        >
                          <img
                            src={url}
                            alt={`SP ${index + 1} - ${imgIdx + 1}`}
                            className="w-full h-full object-cover rounded border cursor-pointer transition-all"
                            loading="lazy"
                            onClick={() => {
                              setPreviewImages((product.productImages || []).filter((url): url is string => !!url && typeof url === 'string'));
                              setPreviewIndex(imgIdx);
                              setShowPreview(true);
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/50 transition-all rounded flex items-center justify-center opacity-0 group-hover/image:opacity-100 pointer-events-none">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </div>
                        </div>
                      ))}
                      {product.productImages.filter((url): url is string => !!url && typeof url === 'string').length > 2 && (
                        <div className="w-8 h-8 sm:w-10 sm:h-9 rounded border bg-muted flex items-center justify-center text-[9px] sm:text-[10px] font-medium text-muted-foreground flex-shrink-0">
                          +{product.productImages.filter((url): url is string => !!url && typeof url === 'string').length - 2}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] sm:text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>

                {/* Kết quả */}
                <TableCell>
                  <Badge className={cn(getResolutionBadge(product.resolution), "text-[10px] sm:text-body-xs px-1.5 sm:px-2 py-0.5")}>
                    {RESOLUTION_LABELS[product.resolution]}
                  </Badge>
                  {product.resolution === 'deduct' && product.deductionAmount && (
                    <p className="text-[10px] sm:text-body-xs text-red-600 mt-1 font-medium">
                      Trừ: {new Intl.NumberFormat('vi-VN').format(product.deductionAmount)} đ
                    </p>
                  )}
                </TableCell>

                {/* Ghi chú */}
                <TableCell>
                  <div className="space-y-0.5 sm:space-y-1">
                    {/* Vấn đề */}
                    {product.issueDescription && String(product.issueDescription).trim() && (
                      <p className="text-[10px] sm:text-body-xs text-orange-600 font-medium leading-snug">
                        Vấn đề: {product.issueDescription}
                      </p>
                    )}
                    {/* Ghi chú xử lý */}
                    {product.notes && String(product.notes).trim() && (
                      <p className="text-[10px] sm:text-body-xs text-muted-foreground leading-snug">
                        {product.notes}
                      </p>
                    )}
                    {/* Empty state */}
                    {(!product.issueDescription || !String(product.issueDescription).trim()) && 
                     (!product.notes || !String(product.notes).trim()) && (
                      <span className="text-[10px] sm:text-body-xs text-muted-foreground">—</span>
                    )}
                  </div>
                </TableCell>

                {/* Thành tiền */}
                <TableCell className="text-right font-mono text-body-xs sm:text-body-sm font-medium">
                  {new Intl.NumberFormat('vi-VN').format((product.quantity || 1) * (product.unitPrice || 0))} đ
                </TableCell>

                {/* Bù trừ - Only show for out_of_stock */}
                <TableCell className="text-right font-mono text-body-xs sm:text-body-sm font-medium">
                  {product.resolution === 'out_of_stock' ? (
                    <span className="text-red-600">
                      {new Intl.NumberFormat('vi-VN').format((product.quantity || 1) * (product.unitPrice || 0))} đ
                    </span>
                  ) : (
                    <span className="text-[10px] sm:text-body-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            )})
          )}
        </TableBody>
      </Table>
      </div>

      {/* Image Preview Dialog with Gallery */}
      <ImagePreviewDialog
        images={previewImages}
        initialIndex={previewIndex}
        open={showPreview}
        onOpenChange={setShowPreview}
        title="Hình ảnh sản phẩm"
      />
    </>
  );
}
