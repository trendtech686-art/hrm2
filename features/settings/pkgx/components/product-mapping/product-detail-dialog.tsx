'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../../../components/ui/button';
import { Badge } from '../../../../../components/ui/badge';
import { Label } from '../../../../../components/ui/label';
import { ScrollArea } from '../../../../../components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../../../components/ui/dialog';
import { Tabs, TabsContent } from '../../../../../components/ui/tabs';
import { MobileTabsList, MobileTabsTrigger } from '../../../../../components/layout/page-section';
import { OptimizedImage } from '../../../../../components/ui/optimized-image';
import { 
  Package, 
  DollarSign, 
  FileText, 
  ImageIcon, 
  CheckCircle2, 
  Circle, 
  Star, 
  Flame, 
  Sparkles, 
  Home, 
  XCircle, 
  ArrowRight, 
  ExternalLink, 
  Unlink,
  Loader2
} from 'lucide-react';
import type { PkgxProduct, PkgxGalleryImage } from '../../types';
import type { PkgxProductRow } from './types';
import { sanitizeHtml } from '@/lib/sanitize';

// ========================================
// Product Detail Dialog Component
// ========================================

export interface ProductDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: PkgxProductRow | null;
  galleryImages: PkgxGalleryImage[];
  isLoadingGallery: boolean;
  onViewOnPkgx: (goodsId: number) => void;
  onOpenUnlinkDialog: (product: PkgxProduct) => void;
  buildPkgxImageUrl: (imagePath: string | undefined | null) => string;
}

export function ProductDetailDialog({
  open,
  onOpenChange,
  product,
  galleryImages,
  isLoadingGallery,
  onViewOnPkgx,
  onOpenUnlinkDialog,
  buildPkgxImageUrl,
}: ProductDetailDialogProps) {
  const router = useRouter();

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent mobileFullScreen className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {product.goods_thumb && (
              <OptimizedImage 
                src={buildPkgxImageUrl(product.goods_thumb)}
                alt=""
                width={48}
                height={48}
                className="w-12 h-12 object-contain rounded border"
                unoptimized
              />
            )}
            <div>
              <span className="line-clamp-1">{product.goods_name}</span>
              <DialogDescription className="font-normal">
                ID: {product.goods_id} | SKU: {product.goods_sn || '-'} | Slug: {product.slug || '-'}
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="flex-1 flex flex-col overflow-hidden">
          <MobileTabsList>
            <MobileTabsTrigger value="basic">
              <Package className="h-3 w-3 mr-1" />
              Cơ bản
            </MobileTabsTrigger>
            <MobileTabsTrigger value="price">
              <DollarSign className="h-3 w-3 mr-1" />
              Giá & Kho
            </MobileTabsTrigger>
            <MobileTabsTrigger value="seo">
              <FileText className="h-3 w-3 mr-1" />
              Nội dung & SEO
            </MobileTabsTrigger>
            <MobileTabsTrigger value="images">
              <ImageIcon className="h-3 w-3 mr-1" />
              Hình ảnh
            </MobileTabsTrigger>
          </MobileTabsList>
          
          {/* Tab: Thông tin cơ bản */}
          <TabsContent value="basic" className="flex-1 overflow-auto mt-4">
            <ScrollArea className="h-87 pr-4">
              <BasicInfoTab 
                product={product} 
                router={router}
                onCloseDialog={() => onOpenChange(false)}
              />
            </ScrollArea>
          </TabsContent>
          
          {/* Tab: Giá & Tồn kho */}
          <TabsContent value="price" className="flex-1 overflow-auto mt-4">
            <ScrollArea className="h-87 pr-4">
              <PriceInventoryTab product={product} />
            </ScrollArea>
          </TabsContent>
          
          {/* Tab: Nội dung & SEO */}
          <TabsContent value="seo" className="flex-1 overflow-auto mt-4">
            <ScrollArea className="h-87 pr-4">
              <SeoContentTab product={product} />
            </ScrollArea>
          </TabsContent>
          
          {/* Tab: Hình ảnh */}
          <TabsContent value="images" className="flex-1 overflow-auto mt-4">
            <ScrollArea className="h-87 pr-4">
              <ImagesTab 
                product={product} 
                galleryImages={galleryImages}
                isLoadingGallery={isLoadingGallery}
                buildPkgxImageUrl={buildPkgxImageUrl}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4 flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onViewOnPkgx(product.goods_id)}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Xem trên PKGX
          </Button>
          {product.linkedHrmProduct && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive hover:text-destructive"
              onClick={() => {
                onOpenChange(false);
                onOpenUnlinkDialog(product);
              }}
            >
              <Unlink className="h-4 w-4 mr-2" />
              Hủy liên kết
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ========================================
// Sub-components for each tab
// ========================================

interface BasicInfoTabProps {
  product: PkgxProductRow;
  router: ReturnType<typeof useRouter>;
  onCloseDialog: () => void;
}

function BasicInfoTab({ product, router, onCloseDialog }: BasicInfoTabProps) {
  return (
    <div className="space-y-4">
      {/* Status flags + HRM Link - Cùng hàng */}
      <div className="grid grid-cols-2 gap-4">
        {/* Trạng thái hiển thị */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Trạng thái hiển thị</Label>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant={product.is_on_sale == 1 ? 'default' : 'secondary'} className="gap-1">
              {product.is_on_sale == 1 ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
              Đăng bán
            </Badge>
            <Badge variant={product.is_best == 1 ? 'default' : 'secondary'} className="gap-1">
              {product.is_best == 1 ? <Star className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
              Best
            </Badge>
            <Badge variant={product.is_hot == 1 ? 'destructive' : 'secondary'} className="gap-1">
              {product.is_hot == 1 ? <Flame className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
              Hot
            </Badge>
            <Badge variant={product.is_new == 1 ? 'default' : 'secondary'} className={`gap-1 ${product.is_new == 1 ? 'bg-info/15 text-info-foreground hover:bg-info/25 border-info/30' : ''}`}>
              {product.is_new == 1 ? <Sparkles className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
              New
            </Badge>
            <Badge variant={product.is_home == 1 ? 'outline' : 'secondary'} className={`gap-1 ${product.is_home == 1 ? 'border-warning/30 bg-warning/15 text-warning-foreground' : ''}`}>
              {product.is_home == 1 ? <Home className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
              Home
            </Badge>
          </div>
        </div>
        
        {/* Liên kết HRM */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Liên kết HRM</Label>
          {product.linkedHrmProduct ? (
            <button
              onClick={() => {
                onCloseDialog();
                router.push(`/products?id=${product.linkedHrmProduct!.id}`);
              }}
              className="w-full p-2 border rounded bg-green-50 border-green-200 hover:bg-green-100 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                <span className="font-medium text-green-700 truncate text-sm">{product.linkedHrmProduct.name}</span>
                <ArrowRight className="h-3 w-3 text-green-600 shrink-0 ml-auto" />
              </div>
              <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                <span>SKU PKGX: {product.goods_sn || '-'}</span>
                <span>Tồn PKGX: {product.goods_number || 0}</span>
                <span>SKU HRM: {product.linkedHrmProduct.sku || '-'}</span>
              </div>
            </button>
          ) : (
            <div className="p-2 border rounded text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <XCircle className="h-4 w-4" />
              Chưa liên kết
            </div>
          )}
        </div>
      </div>
      
      {/* Classification */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Danh mục</Label>
          <div className="p-2 border rounded text-sm">
            ID: {product.cat_id || '-'}
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Thương hiệu</Label>
          <div className="p-2 border rounded text-sm">
            ID: {product.brand_id || '-'}
          </div>
        </div>
      </div>
      
      {/* Timestamps */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Ngày tạo</Label>
          <div className="p-2 border rounded">
            {product.add_time 
              ? new Date(product.add_time * 1000).toLocaleString('vi-VN')
              : '-'}
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Cập nhật</Label>
          <div className="p-2 border rounded">
            {product.last_update 
              ? new Date(product.last_update * 1000).toLocaleString('vi-VN')
              : '-'}
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Tên hàng hóa VAT</Label>
        <div className="p-2 border rounded text-sm">{product.vat || '-'}</div>
      </div>
      
      {/* Seller note */}
      {product.seller_note && (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Ghi chú người bán</Label>
          <div className="p-2 border rounded text-sm">{product.seller_note}</div>
        </div>
      )}
    </div>
  );
}

interface PriceInventoryTabProps {
  product: PkgxProductRow;
}

function PriceInventoryTab({ product }: PriceInventoryTabProps) {
  return (
    <div className="space-y-4">
      {/* Prices */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Giá bán PKGX</Label>
        <div className="grid grid-cols-5 gap-2 text-sm">
          <div className="p-3 border rounded text-center">
            <div className="text-xs text-muted-foreground">Shop</div>
            <div className="font-bold text-green-600">{Number(product.shop_price || 0).toLocaleString('vi-VN')}đ</div>
          </div>
          <div className="p-3 border rounded text-center">
            <div className="text-xs text-muted-foreground">Đối tác</div>
            <div>{Number(product.partner_price || 0).toLocaleString('vi-VN')}đ</div>
          </div>
          <div className="p-3 border rounded text-center">
            <div className="text-xs text-muted-foreground">5% VAT</div>
            <div>{Number(product.price_5vat || 0).toLocaleString('vi-VN')}đ</div>
          </div>
          <div className="p-3 border rounded text-center">
            <div className="text-xs text-muted-foreground">12% Ko VAT</div>
            <div>{Number(product.price_12novat || 0).toLocaleString('vi-VN')}đ</div>
          </div>
          <div className="p-3 border rounded text-center">
            <div className="text-xs text-muted-foreground">5% Ko VAT</div>
            <div>{Number(product.price_5novat || 0).toLocaleString('vi-VN')}đ</div>
          </div>
        </div>
      </div>
      
      {/* Inventory */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tồn kho</Label>
        <div className="p-4 border rounded">
          <div className="text-3xl font-bold">{product.goods_number || 0}</div>
          <div className="text-xs text-muted-foreground">sản phẩm trong kho PKGX</div>
        </div>
      </div>
    </div>
  );
}

interface SeoContentTabProps {
  product: PkgxProductRow;
}

function SeoContentTab({ product }: SeoContentTabProps) {
  const hrmSeoTitle = product.linkedHrmProduct?.ktitle;
  const hrmSeoKeywords = product.linkedHrmProduct?.seoKeywords;
  const hrmSeoDescription = product.linkedHrmProduct?.seoDescription;
  const hrmShortDescription = product.linkedHrmProduct?.shortDescription;

  const normalized = (value?: string | null) => {
    if (!value) return undefined;
    const trimmed = value.trim();
    return trimmed && trimmed !== '-' ? trimmed : undefined;
  };

  const metaTitle = normalized(product.meta_title) || normalized(product.ktitle) || normalized(hrmSeoTitle) || '-';
  const keywords = normalized(product.keywords) || normalized(hrmSeoKeywords) || '-';
  const metaDescription = normalized(product.meta_desc) || normalized(product.goods_brief) || normalized(hrmSeoDescription) || '-';
  const shortDescription = normalized(product.goods_brief) || normalized(hrmShortDescription) || '-';

  return (
    <div className="space-y-4">
      {/* SEO Fields */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Thông tin SEO</Label>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Meta Title</Label>
            <div className="p-2 border rounded text-sm">{metaTitle}</div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Keywords</Label>
            <div className="p-2 border rounded text-sm">{keywords}</div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Meta Description</Label>
            <div className="p-2 border rounded text-sm max-h-20 overflow-y-auto">{metaDescription}</div>
          </div>
        </div>
      </div>
      
      {/* Short description */}
      <div className="space-y-1">
        <Label className="text-sm font-medium">Mô tả ngắn</Label>
        <div className="p-2 border rounded text-sm max-h-24 overflow-y-auto">
          {shortDescription}
        </div>
      </div>
      
      {/* Long description */}
      <div className="space-y-1">
        <Label className="text-sm font-medium">Mô tả chi tiết</Label>
        <div 
          className="p-3 border rounded text-sm max-h-60 overflow-y-auto bg-muted/30"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.goods_desc || '<span class="text-muted-foreground">Không có mô tả</span>') }}
        />
      </div>
    </div>
  );
}

interface ImagesTabProps {
  product: PkgxProductRow;
  galleryImages: PkgxGalleryImage[];
  isLoadingGallery: boolean;
  buildPkgxImageUrl: (imagePath: string | undefined | null) => string;
}

function ImagesTab({ product, galleryImages, isLoadingGallery, buildPkgxImageUrl }: ImagesTabProps) {
  return (
    <div className="space-y-4">
      {/* Ảnh đại diện - dùng iframe để bypass CORS */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Ảnh sản phẩm</Label>
        <div className="grid grid-cols-3 gap-3">
          {product.original_img && (
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Ảnh gốc</Label>
              <a 
                href={buildPkgxImageUrl(product.original_img)}
                target="_blank" rel="noopener noreferrer"
                className="block border rounded p-2 hover:border-primary transition-colors bg-card"
              >
                <div className="w-full h-28 flex items-center justify-center overflow-hidden">
                  <OptimizedImage 
                    src={buildPkgxImageUrl(product.original_img)}
                    alt="Original"
                    width={200}
                    height={112}
                    className="max-w-full max-h-full object-contain"
                    unoptimized
                  />
                </div>
                <div className="text-xs text-center text-primary mt-1">Xem ảnh gốc</div>
              </a>
            </div>
          )}
          {product.goods_img && (
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Ảnh SP</Label>
              <a 
                href={buildPkgxImageUrl(product.goods_img)}
                target="_blank" rel="noopener noreferrer"
                className="block border rounded p-2 hover:border-primary transition-colors bg-card"
              >
                <div className="w-full h-28 flex items-center justify-center overflow-hidden">
                  <OptimizedImage 
                    src={buildPkgxImageUrl(product.goods_img)}
                    alt="Goods"
                    width={200}
                    height={112}
                    className="max-w-full max-h-full object-contain"
                    unoptimized
                  />
                </div>
                <div className="text-xs text-center text-primary mt-1">Xem ảnh SP</div>
              </a>
            </div>
          )}
          {product.goods_thumb && (
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Thumbnail</Label>
              <a 
                href={buildPkgxImageUrl(product.goods_thumb)}
                target="_blank" rel="noopener noreferrer"
                className="block border rounded p-2 hover:border-primary transition-colors bg-card"
              >
                <div className="w-full h-28 flex items-center justify-center overflow-hidden">
                  <OptimizedImage 
                    src={buildPkgxImageUrl(product.goods_thumb)}
                    alt="Thumbnail"
                    width={200}
                    height={112}
                    className="max-w-full max-h-full object-contain"
                    unoptimized
                  />
                </div>
                <div className="text-xs text-center text-primary mt-1">Xem thumbnail</div>
              </a>
            </div>
          )}
        </div>
        {!product.original_img && !product.goods_img && !product.goods_thumb && (
          <div className="text-sm text-muted-foreground p-4 border rounded text-center">
            Chưa có ảnh sản phẩm
          </div>
        )}
      </div>
      
      {/* Đường dẫn ảnh - có thể copy */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Đường dẫn ảnh (click để mở)</Label>
        <div className="space-y-2 text-xs">
          {product.original_img && (
            <a 
              href={buildPkgxImageUrl(product.original_img)}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 border rounded bg-muted/30 hover:bg-muted transition-colors break-all"
            >
              <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">Original:</span>
              <span className="text-primary underline">{product.original_img}</span>
            </a>
          )}
          {product.goods_img && (
            <a 
              href={buildPkgxImageUrl(product.goods_img)}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 border rounded bg-muted/30 hover:bg-muted transition-colors break-all"
            >
              <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">Goods:</span>
              <span className="text-primary underline">{product.goods_img}</span>
            </a>
          )}
          {product.goods_thumb && (
            <a 
              href={buildPkgxImageUrl(product.goods_thumb)}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 border rounded bg-muted/30 hover:bg-muted transition-colors break-all"
            >
              <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">Thumb:</span>
              <span className="text-primary underline">{product.goods_thumb}</span>
            </a>
          )}
        </div>
      </div>
      
      {/* Album ảnh */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Album ảnh {galleryImages.length > 0 && `(${galleryImages.length})`}
        </Label>
        {isLoadingGallery ? (
          <div className="flex items-center justify-center p-4 border rounded">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Đang tải gallery...</span>
          </div>
        ) : galleryImages.length > 0 ? (
          <div className="grid grid-cols-4 gap-2">
            {galleryImages.map((img, index) => (
              <a
                key={img.img_id || index}
                href={buildPkgxImageUrl(img.img_url || img.img_original)}
                target="_blank" rel="noopener noreferrer"
                className="block border rounded p-1 hover:border-primary transition-colors bg-card"
              >
                <div className="w-full h-20 flex items-center justify-center overflow-hidden">
                  <OptimizedImage
                    src={buildPkgxImageUrl(img.thumb_url || img.img_url)}
                    alt={img.img_desc || `Gallery ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
                    width={200}
                    height={80}
                    fallback={<div className="text-xs text-muted-foreground text-center py-4">Lỗi</div>}
                  />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground p-4 border rounded text-center">
            <p>Chưa có ảnh trong album</p>
            <p className="text-xs mt-1 opacity-70">
              Sản phẩm này chưa có ảnh gallery hoặc gallery trống
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
