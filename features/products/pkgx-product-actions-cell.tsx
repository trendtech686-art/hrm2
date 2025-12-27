/**
 * PkgxProductActionsCell - Shared dropdown component for PKGX product sync actions
 * 
 * Uses usePkgxEntitySync hook for consistent sync behavior
 */

import * as React from 'react';
import { MoreHorizontal, RefreshCw, FileText, DollarSign, Package, Search, AlignLeft, Tag, Image, ExternalLink, Upload, Link2, Unlink } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import type { Product } from '@/lib/types/prisma-extended';
import { usePkgxEntitySync } from '../settings/pkgx/hooks';
import type { HrmProductData } from '../settings/pkgx/hooks';
import { PkgxSyncConfirmDialog } from '../settings/pkgx/components/pkgx-sync-confirm-dialog';
import { usePkgxSettingsStore } from '../settings/pkgx/store';

interface PkgxProductActionsCellProps {
  product: Product;
  onPkgxPublish?: (product: Product) => void;
  onPkgxLink?: (product: Product) => void;
  onPkgxUnlink?: (product: Product) => void;
  onPkgxSyncImages?: (product: Product) => void;
}

export function PkgxProductActionsCell({
  product,
  onPkgxPublish,
  onPkgxLink,
  onPkgxUnlink,
  onPkgxSyncImages,
}: PkgxProductActionsCellProps) {
  const { addLog } = usePkgxSettingsStore();
  
  // Use shared entity sync hook
  const entitySync = usePkgxEntitySync({
    entityType: 'product',
    onLog: addLog,
  });
  
  // Don't show for deleted items
  if (product.deletedAt) return null;
  
  const hasPkgxId = !!product.pkgxId;
  
  // Build HRM product data for sync
  const buildHrmData = (): HrmProductData => {
    // Calculate total inventory across all branches
    const totalInventory = Object.values(product.inventoryByBranch || {}).reduce((sum, qty) => sum + qty, 0);
    
    return {
      systemId: product.systemId,
      name: product.name,
      sku: product.id,
      sellingPrice: product.sellingPrice,
      costPrice: product.costPrice,
      dealPrice: undefined, // Not in Product type
      quantity: totalInventory,
      seoKeywords: product.seoPkgx?.seoKeywords || product.seoKeywords,
      ktitle: product.seoPkgx?.seoTitle || product.ktitle,
      seoDescription: product.seoPkgx?.metaDescription || product.seoDescription,
      shortDescription: product.seoPkgx?.shortDescription || product.shortDescription,
      description: product.seoPkgx?.longDescription || product.description,
      isBest: product.isFeatured,
      isNew: product.isNewArrival,
      isHot: product.isBestSeller,
      isHome: product.isPublished,
      categorySystemId: product.categorySystemId,
      brandSystemId: product.brandSystemId,
    };
  };
  
  // Helper to trigger sync
  const triggerSync = (actionKey: 'sync_all' | 'sync_basic' | 'sync_seo' | 'sync_description' | 'sync_price' | 'sync_inventory' | 'sync_flags') => {
    if (!product.pkgxId) return;
    const hrmData = buildHrmData();
    entitySync.triggerSyncAction(actionKey, product.pkgxId, hrmData, product.name);
  };
  
  return (
    <>
      <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="ghost" 
              className={`h-8 w-8 p-0 ${hasPkgxId ? "text-primary" : "text-muted-foreground"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="sr-only">PKGX menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            {hasPkgxId ? (
              <>
                {/* Sync All - Most important action */}
                <DropdownMenuItem 
                  onSelect={() => triggerSync('sync_all')}
                  className="font-medium"
                  title="Đồng bộ tên, SKU, giá, tồn kho, SEO, mô tả, flags"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Đồng bộ tất cả
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                {/* Individual sync actions */}
                <DropdownMenuItem 
                  onSelect={() => triggerSync('sync_basic')}
                  title="Tên sản phẩm, mã SKU, danh mục, thương hiệu"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Thông tin cơ bản
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => triggerSync('sync_price')}
                  title="Giá bán, giá thị trường, giá khuyến mãi"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Giá
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => triggerSync('sync_inventory')}
                  title="Tổng số lượng tồn kho từ tất cả chi nhánh"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Tồn kho
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => triggerSync('sync_seo')}
                  title="Keywords, Meta Title, Meta Description"
                >
                  <Search className="mr-2 h-4 w-4" />
                  SEO
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => triggerSync('sync_description')}
                  title="Mô tả ngắn (goods_brief), mô tả chi tiết (goods_desc)"
                >
                  <AlignLeft className="mr-2 h-4 w-4" />
                  Mô tả
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => triggerSync('sync_flags')}
                  title="Nổi bật (best), Hot, Mới (new), Trang chủ, Đang bán"
                >
                  <Tag className="mr-2 h-4 w-4" />
                  Flags
                </DropdownMenuItem>
                
                {/* Images - special handler */}
                {onPkgxSyncImages && (
                  <DropdownMenuItem 
                    onSelect={() => entitySync.handleConfirm(
                      'Đồng bộ hình ảnh',
                      `Đồng bộ hình ảnh đại diện và album ảnh của "${product.name}" lên PKGX?`,
                      () => onPkgxSyncImages(product)
                    )}
                    title="Hình ảnh đại diện (original_img) + Album ảnh (goods_gallery)"
                  >
                    <Image className="mr-2 h-4 w-4" />
                    Hình ảnh
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onSelect={() => window.open(`https://phukiengiaxuong.com.vn/admin/goods.php?act=edit&goods_id=${product.pkgxId}`, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Xem trên PKGX
                </DropdownMenuItem>
                
                {/* Hủy liên kết PKGX */}
                {onPkgxUnlink && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onSelect={() => entitySync.handleConfirm(
                        'Hủy liên kết PKGX',
                        `Bạn có chắc muốn hủy liên kết sản phẩm "${product.name}" với PKGX? (Sản phẩm vẫn tồn tại trên PKGX)`,
                        () => onPkgxUnlink(product)
                      )}
                      className="text-destructive"
                    >
                      <Unlink className="mr-2 h-4 w-4" />
                      Hủy liên kết
                    </DropdownMenuItem>
                  </>
                )}
              </>
            ) : (
              /* Actions for products WITHOUT pkgxId */
              <>
                {/* Publish to PKGX - Tạo mới sản phẩm trên PKGX */}
                {onPkgxPublish && (
                  <DropdownMenuItem 
                    onSelect={() => entitySync.handleConfirm(
                      'Đăng lên PKGX',
                      `Bạn có chắc muốn đăng sản phẩm "${product.name}" lên PKGX?`,
                      () => onPkgxPublish(product)
                    )}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Đăng lên PKGX
                  </DropdownMenuItem>
                )}
                
                {/* Link to existing PKGX product */}
                {onPkgxLink && (
                  <DropdownMenuItem onSelect={() => onPkgxLink(product)}>
                    <Link2 className="mr-2 h-4 w-4" />
                    Liên kết với PKGX
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Confirmation Dialog - using shared component */}
      <PkgxSyncConfirmDialog
        confirmAction={entitySync.confirmAction}
        isSyncing={entitySync.isSyncing}
        onConfirm={entitySync.executeAction}
        onCancel={entitySync.cancelConfirm}
      />
    </>
  );
}
