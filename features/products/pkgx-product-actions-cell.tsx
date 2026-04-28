/**
 * PkgxProductActionsCell - Optimized dropdown component for PKGX product sync actions
 * 
 * ✅ Best practices:
 * - Nhận tất cả handlers từ props (không tạo hook riêng trong cell)
 * - Dùng React.memo để tránh re-render không cần thiết
 * - Lightweight - không có heavy hooks bên trong
 */

import * as React from 'react';
import { MoreHorizontal, RefreshCw, FileText, DollarSign, Package, Search, AlignLeft, Tag, ImageIcon, ExternalLink, Upload, Link2, Unlink } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import type { Product } from '@/lib/types/prisma-extended';
import { PkgxSyncConfirmDialog } from '../settings/pkgx/components/pkgx-sync-confirm-dialog';
import type { ConfirmActionState } from '../settings/pkgx/hooks/use-pkgx-entity-sync';

export interface PkgxProductActionsCellProps {
  product: Product;
  // Handlers from usePkgxSync - passed from parent (page.tsx)
  onPkgxPublish?: (product: Product) => Promise<void> | void;
  onPkgxLink?: (product: Product) => void;
  onPkgxUnlink?: (product: Product) => Promise<void> | void;
  onPkgxSyncImages?: (product: Product) => Promise<void> | void;
  onPkgxSyncAll?: (product: Product) => Promise<void> | void;
  onPkgxSyncBasicInfo?: (product: Product) => Promise<void> | void;
  onPkgxUpdatePrice?: (product: Product) => Promise<void> | void;
  onPkgxSyncInventory?: (product: Product) => Promise<void> | void;
  onPkgxUpdateSeo?: (product: Product) => Promise<void> | void;
  onPkgxSyncDescription?: (product: Product) => Promise<void> | void;
  onPkgxSyncFlags?: (product: Product) => Promise<void> | void;
}

function PkgxProductActionsCellInner({
  product,
  onPkgxPublish,
  onPkgxLink,
  onPkgxUnlink,
  onPkgxSyncImages,
  onPkgxSyncAll,
  onPkgxSyncBasicInfo,
  onPkgxUpdatePrice,
  onPkgxSyncInventory,
  onPkgxUpdateSeo,
  onPkgxSyncDescription,
  onPkgxSyncFlags,
}: PkgxProductActionsCellProps) {
  // State for confirmation dialog
  const [confirmAction, setConfirmAction] = React.useState<ConfirmActionState>({
    open: false,
    title: '',
    description: '',
    action: null,
  });
  const [isSyncing, setIsSyncing] = React.useState(false);
  
  // Don't show for deleted items
  if (product.deletedAt) return null;
  
  const hasPkgxId = !!product.pkgxId;
  
  // Helper to handle confirm dialog
  const handleConfirm = (title: string, description: string, action: () => void | Promise<void>) => {
    setConfirmAction({
      open: true,
      title,
      description,
      action: async () => {
        setIsSyncing(true);
        try {
          await action();
        } finally {
          setIsSyncing(false);
          setConfirmAction({ open: false, title: '', description: '', action: null });
        }
      },
    });
  };
  
  // Helper to trigger sync with confirmation
  const triggerSync = (actionType: string) => {
    if (!product.pkgxId) return;
    
    const actionMap: Record<string, { title: string; handler?: () => Promise<void> | void }> = {
      sync_all: {
        title: 'Đồng bộ tất cả',
        handler: onPkgxSyncAll ? () => onPkgxSyncAll(product) : undefined,
      },
      sync_basic: {
        title: 'Đồng bộ thông tin cơ bản',
        handler: onPkgxSyncBasicInfo ? () => onPkgxSyncBasicInfo(product) : undefined,
      },
      sync_price: {
        title: 'Đồng bộ giá',
        handler: onPkgxUpdatePrice ? () => onPkgxUpdatePrice(product) : undefined,
      },
      sync_inventory: {
        title: 'Đồng bộ tồn kho',
        handler: onPkgxSyncInventory ? () => onPkgxSyncInventory(product) : undefined,
      },
      sync_seo: {
        title: 'Đồng bộ SEO',
        handler: onPkgxUpdateSeo ? () => onPkgxUpdateSeo(product) : undefined,
      },
      sync_description: {
        title: 'Đồng bộ mô tả',
        handler: onPkgxSyncDescription ? () => onPkgxSyncDescription(product) : undefined,
      },
      sync_flags: {
        title: 'Đồng bộ flags',
        handler: onPkgxSyncFlags ? () => onPkgxSyncFlags(product) : undefined,
      },
    };
    
    const action = actionMap[actionType];
    if (action?.handler) {
      handleConfirm(
        action.title,
        `Bạn có chắc muốn ${action.title.toLowerCase()} cho "${product.name}" lên PKGX?`,
        action.handler
      );
    }
  };
  
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- dropdown trigger wrapper */}
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
                {onPkgxSyncAll && (
                  <DropdownMenuItem 
                    onSelect={() => triggerSync('sync_all')}
                    className="font-medium"
                    title="Đồng bộ tên, SKU, giá, tồn kho, SEO, mô tả, flags"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Đồng bộ tất cả
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                
                {/* Individual sync actions */}
                {onPkgxSyncBasicInfo && (
                  <DropdownMenuItem 
                    onSelect={() => triggerSync('sync_basic')}
                    title="Tên sản phẩm, mã SKU, danh mục, thương hiệu"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Thông tin cơ bản
                  </DropdownMenuItem>
                )}
                {onPkgxUpdatePrice && (
                  <DropdownMenuItem 
                    onSelect={() => triggerSync('sync_price')}
                    title="Giá bán, giá thị trường, giá khuyến mãi"
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Giá
                  </DropdownMenuItem>
                )}
                {onPkgxSyncInventory && (
                  <DropdownMenuItem 
                    onSelect={() => triggerSync('sync_inventory')}
                    title="Tổng số lượng tồn kho từ tất cả chi nhánh"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Tồn kho
                  </DropdownMenuItem>
                )}
                {onPkgxUpdateSeo && (
                  <DropdownMenuItem 
                    onSelect={() => triggerSync('sync_seo')}
                    title="Keywords, Meta Title, Meta Description"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    SEO
                  </DropdownMenuItem>
                )}
                {onPkgxSyncDescription && (
                  <DropdownMenuItem 
                    onSelect={() => triggerSync('sync_description')}
                    title="Mô tả ngắn (goods_brief), mô tả chi tiết (goods_desc)"
                  >
                    <AlignLeft className="mr-2 h-4 w-4" />
                    Mô tả
                  </DropdownMenuItem>
                )}
                {onPkgxSyncFlags && (
                  <DropdownMenuItem 
                    onSelect={() => triggerSync('sync_flags')}
                    title="Nổi bật (best), Hot, Mới (new), Trang chủ, Đang bán"
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    Flags
                  </DropdownMenuItem>
                )}
                
                {/* Images - special handler */}
                {onPkgxSyncImages && (
                  <DropdownMenuItem 
                    onSelect={() => handleConfirm(
                      'Đồng bộ hình ảnh',
                      `Đồng bộ hình ảnh đại diện và album ảnh của "${product.name}" lên PKGX?`,
                      () => onPkgxSyncImages(product)
                    )}
                    title="Hình ảnh đại diện (original_img) + Album ảnh (goods_gallery)"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
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
                      onSelect={() => handleConfirm(
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
                    onSelect={() => handleConfirm(
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
      
      {/* Confirmation Dialog */}
      <PkgxSyncConfirmDialog
        confirmAction={confirmAction}
        isSyncing={isSyncing}
        onConfirm={() => confirmAction.action?.()}
        onCancel={() => setConfirmAction({ open: false, title: '', description: '', action: null })}
      />
    </>
  );
}

// ✅ React.memo để tránh re-render không cần thiết
// So sánh pkgxId để biết khi nào cần re-render
export const PkgxProductActionsCell = React.memo(PkgxProductActionsCellInner, (prev, next) => {
  // Re-render nếu pkgxId thay đổi hoặc systemId khác
  return prev.product.systemId === next.product.systemId && 
         prev.product.pkgxId === next.product.pkgxId &&
         prev.product.deletedAt === next.product.deletedAt;
});

PkgxProductActionsCell.displayName = 'PkgxProductActionsCell';
