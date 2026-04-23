/**
 * Bảng sản phẩm cho trang chi tiết
 * 
 * Hiển thị đầy đủ:
 * STT | Tên SP | Loại SP | Số lượng | Đơn giá | Hình ảnh | Kết quả | Ghi chú | Thành tiền
 * 
 * Mobile-first: Hiển thị dạng card trên mobile, table trên desktop
 */

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { ImagePreviewDialog } from '../../../components/ui/image-preview-dialog';
import { Separator } from '../../../components/ui/separator';
import { Card, CardContent } from '../../../components/ui/card';
import { LazyImage } from '../../../components/ui/lazy-image';
import { cn } from '../../../lib/utils';
import { RESOLUTION_LABELS } from '../types';
import type { WarrantyProduct } from '../types';
import { useProductsByIds } from '../../products/hooks/use-products';
import { useProductTypeFinder } from '../../settings/inventory/hooks/use-all-product-types';
import type { SystemId } from '../../../lib/id-types';
import type { Product } from '../../products/types';

interface WarrantyProductsDetailTableProps {
  products: WarrantyProduct[];
}

export function WarrantyProductsDetailTable({ products: rawProducts }: WarrantyProductsDetailTableProps) {
  // ⚡ OPTIMIZED: Only fetch the specific products in this warranty ticket (1-5) instead of ALL products (1000+)
  const products = React.useMemo(() => rawProducts || [], [rawProducts]);
  const productSystemIds = React.useMemo(
    () => products.map(p => p.productSystemId).filter(Boolean) as string[],
    [products]
  );
  const { productsMap: productsByIdMap } = useProductsByIds(productSystemIds);
  const { findById: findProductTypeById } = useProductTypeFinder();
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  const [showPreview, setShowPreview] = React.useState(false);

  // Memoize product lookup map by business ID (SKU) for backward compat
  const productMap = React.useMemo(() => {
    const map = new Map<string, Product>();
    productsByIdMap.forEach((p, _systemId) => {
      if (p.id) map.set(p.id, p);
    });
    return map;
  }, [productsByIdMap]);

  const getProductTypeName = React.useCallback((productTypeSystemId: SystemId) => {
    const productType = findProductTypeById(productTypeSystemId);
    return productType?.name || 'Hàng hóa';
  }, [findProductTypeById]);

  const getResolutionBadge = React.useCallback((resolution: string) => {
    const variants: Record<string, string> = {
      return: 'bg-green-100 text-green-800',
      replace: 'bg-blue-100 text-blue-800',
      deduct: 'bg-orange-100 text-orange-800',
      out_of_stock: 'bg-red-100 text-red-800',
    };
    return variants[resolution] || 'bg-gray-100 text-gray-800';
  }, []);

  // ✅ Helper: Lấy hình ảnh sản phẩm gốc từ catalog
  const getOriginalProductImage = React.useCallback((product: WarrantyProduct) => {
    // Tìm sản phẩm gốc trong catalog theo productSystemId hoặc SKU
    const catalogProduct = product.productSystemId
      ? productsByIdMap.get(product.productSystemId) as Product | undefined
      : product.sku
        ? productMap.get(product.sku) as Product | undefined
        : undefined;
    
    if (!catalogProduct) return null;
    
    // Trả về ảnh theo thứ tự ưu tiên: thumbnailImage > imageUrl > galleryImages[0] > images[0]
    const productWithImageUrl = catalogProduct as Product & { imageUrl?: string };
    return catalogProduct.thumbnailImage 
      || productWithImageUrl.imageUrl 
      || catalogProduct.galleryImages?.[0] 
      || catalogProduct.images?.[0] 
      || null;
  }, [productsByIdMap, productMap]);

  // Mobile Card View Component
  const MobileProductCard = ({ product, index }: { product: WarrantyProduct; index: number }) => {
    // ✅ Get original product thumbnail
    const originalProductImage = getOriginalProductImage(product);
    const warrantyImages = (product.productImages || []).filter((url): url is string => !!url && typeof url === 'string');
    const hasWarrantyImages = warrantyImages.length > 0;
    
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-3">
            {/* Header: Ảnh SP + Tên sản phẩm + Badge */}
            <div className="flex gap-3">
              {/* Hình ảnh sản phẩm gốc */}
              {originalProductImage ? (
                <div className="shrink-0 w-14 h-14 rounded-md overflow-hidden border border-muted">
                  <LazyImage
                    src={originalProductImage}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="shrink-0 w-14 h-14 rounded-md bg-muted flex items-center justify-center">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-snug">{product.productName}</p>
                {product.sku ? (
                  (() => {
                    const pd = productMap.get(product.sku!);
                    return pd ? (
                      <Link
                        href={`/products/${(pd as Product).systemId}`}
                        className="text-xs text-primary hover:underline hover:text-primary/80 transition-colors block mt-0.5"
                      >
                        {product.sku}
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground block mt-0.5">{product.sku}</span>
                    );
                  })()
                ) : null}
              </div>
              <Badge className={cn(getResolutionBadge(product.resolution), "text-xs px-2 py-0.5 h-fit")}>
                {RESOLUTION_LABELS[product.resolution]}
              </Badge>
            </div>

            <Separator />

            {/* Số lượng và Đơn giá */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Số lượng</p>
                <p className="font-semibold text-sm">{product.quantity || 1}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Đơn giá</p>
                <p className="font-semibold text-sm">
                  {new Intl.NumberFormat('vi-VN').format(product.unitPrice || 0)} đ
                </p>
              </div>
            </div>

            {/* Hình ảnh bảo hành (nếu có) */}
            {hasWarrantyImages && (
              <>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Hình ảnh bảo hành</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {warrantyImages.slice(0, 3).map((url, imgIdx) => (
                      <div 
                        key={imgIdx} 
                        className="relative group/image w-14 h-14 shrink-0"
                      >
                        <Image
                          src={url}
                          alt={`SP ${index + 1} - ${imgIdx + 1}`}
                          fill
                          sizes="56px"
                          unoptimized
                          className="object-cover rounded cursor-pointer transition-all"
                          onClick={() => {
                            setPreviewImages(warrantyImages);
                            setPreviewIndex(imgIdx);
                            setShowPreview(true);
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/50 transition-all rounded flex items-center justify-center md:opacity-0 md:group-hover/image:opacity-100 pointer-events-none">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>
                    ))}
                    {warrantyImages.length > 3 && (
                      <div className="w-14 h-14 rounded border bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                        +{warrantyImages.length - 3}
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
                    <p className="text-xs text-orange-600 font-medium leading-snug">
                      <span className="text-muted-foreground">Vấn đề:</span> {product.issueDescription}
                    </p>
                  )}
                  {product.notes && String(product.notes).trim() && (
                    <p className="text-xs text-muted-foreground leading-snug">
                      {product.notes}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Tổng tiền */}
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Thành tiền:</span>
              <span className="font-bold text-sm">
                {new Intl.NumberFormat('vi-VN').format((product.quantity || 1) * (product.unitPrice || 0))} đ
              </span>
            </div>

            {/* Bù trừ */}
            {product.resolution === 'out_of_stock' && (
              <div className="flex justify-between items-center bg-red-50 -mx-3 -mb-3 px-3 py-2 sm:-mx-4 sm:-mb-4 sm:px-4">
                <span className="text-xs font-medium text-red-700">Bù trừ:</span>
                <span className="font-bold text-sm text-red-600">
                  {new Intl.NumberFormat('vi-VN').format((product.quantity || 1) * (product.unitPrice || 0))} đ
                </span>
              </div>
            )}

            {product.resolution === 'deduct' && product.deductionAmount && (
              <div className="flex justify-between items-center bg-orange-50 -mx-3 -mb-3 px-3 py-2 sm:-mx-4 sm:-mb-4 sm:px-4">
                <span className="text-xs font-medium text-orange-700">Trừ tiền:</span>
                <span className="font-bold text-sm text-orange-600">
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
          <div className="text-center text-muted-foreground py-8 text-sm">
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
              <TableHead className="w-12 text-center">STT</TableHead>
              <TableHead className="min-w-50">Tên sản phẩm</TableHead>
              <TableHead className="w-20 text-center">SL</TableHead>
              <TableHead className="w-32 text-right">Đơn giá</TableHead>
              <TableHead className="w-32">Hình ảnh</TableHead>
              <TableHead className="w-32">Kết quả</TableHead>
              <TableHead className="min-w-38">Ghi chú</TableHead>
              <TableHead className="w-32 text-right">Thành tiền</TableHead>
              <TableHead className="w-32 text-right">Bù trừ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground py-6 sm:py-8">
                Chưa có sản phẩm nào
              </TableCell>
            </TableRow>
          ) : (
            products.map((product, index) => {
              const productDetail = (product.productSystemId ? productsByIdMap.get(product.productSystemId) : undefined) 
                ?? (product.sku ? productMap.get(product.sku) : undefined);
              const productTypeName = productDetail?.productTypeSystemId 
                ? getProductTypeName(productDetail.productTypeSystemId)
                : 'Hàng hóa';
              
              // ✅ Get original product thumbnail
              const originalProductImage = getOriginalProductImage(product);
              const warrantyImages = (product.productImages || []).filter((url): url is string => !!url && typeof url === 'string');
              
              return (
              <TableRow key={product.systemId}>
                {/* STT */}
                <TableCell className="text-center">{index + 1}</TableCell>

                {/* Tên sản phẩm + Ảnh gốc + Loại SP + Mã SKU */}
                <TableCell>
                  <div className="flex items-start gap-2">
                    {/* Hình ảnh sản phẩm gốc */}
                    {originalProductImage ? (
                      <div className="shrink-0 w-10 h-10 rounded-md overflow-hidden border border-muted">
                        <LazyImage
                          src={originalProductImage}
                          alt={product.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="shrink-0 w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="space-y-0.5 sm:space-y-1 min-w-0">
                      <p className="font-medium leading-snug">{product.productName}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{productTypeName}</span>
                        <span>-</span>
                        {product.sku ? (
                          productDetail ? (
                            <Link
                              href={`/products/${productDetail.systemId}`}
                              className="text-primary hover:underline hover:text-primary/80 transition-colors"
                            >
                              {product.sku}
                            </Link>
                          ) : (
                            <span>{product.sku}</span>
                          )
                        ) : (
                          <span>—</span>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Số lượng */}
                <TableCell className="text-center">
                  {product.quantity || 1}
                </TableCell>

                {/* Đơn giá */}
                <TableCell className="text-right">
                  {new Intl.NumberFormat('vi-VN').format(product.unitPrice || 0)}
                </TableCell>

                {/* Hình ảnh bảo hành */}
                <TableCell>
                  {warrantyImages.length > 0 ? (
                    <div className="flex gap-1 sm:gap-1.5 items-center">
                      {warrantyImages.slice(0, 2).map((url, imgIdx) => (
                        <div 
                          key={imgIdx} 
                          className="relative group/image w-8 h-8 sm:w-10 sm:h-9 shrink-0"
                        >
                          <Image
                            src={url}
                            alt={`SP ${index + 1} - ${imgIdx + 1}`}
                            fill
                            sizes="40px"
                            unoptimized
                            className="object-cover rounded cursor-pointer transition-all"
                            onClick={() => {
                              setPreviewImages(warrantyImages);
                              setPreviewIndex(imgIdx);
                              setShowPreview(true);
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/50 transition-all rounded flex items-center justify-center md:opacity-0 md:group-hover/image:opacity-100 pointer-events-none">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </div>
                        </div>
                      ))}
                      {warrantyImages.length > 2 && (
                        <div className="w-8 h-8 sm:w-10 sm:h-9 rounded border bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                          +{warrantyImages.length - 2}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>

                {/* Kết quả */}
                <TableCell>
                  <Badge className={cn(getResolutionBadge(product.resolution), "text-xs px-2 py-0.5")}>
                    {RESOLUTION_LABELS[product.resolution]}
                  </Badge>
                  {product.resolution === 'deduct' && product.deductionAmount && (
                    <p className="text-xs text-red-600 mt-1 font-medium">
                      Trừ: {new Intl.NumberFormat('vi-VN').format(product.deductionAmount)} đ
                    </p>
                  )}
                </TableCell>

                {/* Ghi chú */}
                <TableCell>
                  <div className="space-y-0.5 sm:space-y-1">
                    {/* Vấn đề */}
                    {product.issueDescription && String(product.issueDescription).trim() && (
                      <p className="text-xs text-orange-600 font-medium leading-snug">
                        Vấn đề: {product.issueDescription}
                      </p>
                    )}
                    {/* Ghi chú xử lý */}
                    {product.notes && String(product.notes).trim() && (
                      <p className="text-xs text-muted-foreground leading-snug">
                        {product.notes}
                      </p>
                    )}
                    {/* Empty state */}
                    {(!product.issueDescription || !String(product.issueDescription).trim()) && 
                     (!product.notes || !String(product.notes).trim()) && (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                </TableCell>

                {/* Thành tiền */}
                <TableCell className="text-right font-medium">
                  {new Intl.NumberFormat('vi-VN').format((product.quantity || 1) * (product.unitPrice || 0))}
                </TableCell>

                {/* Bù trừ - Only show for out_of_stock */}
                <TableCell className="text-right font-medium">
                  {product.resolution === 'out_of_stock' ? (
                    <span className="text-red-600">
                      {new Intl.NumberFormat('vi-VN').format((product.quantity || 1) * (product.unitPrice || 0))}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
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
