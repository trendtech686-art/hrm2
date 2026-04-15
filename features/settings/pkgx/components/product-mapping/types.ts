import type { PkgxProduct } from '../../types';
import type { SystemId } from '../../../../../lib/id-types';

/**
 * Cấu trúc ID:
 * - goods_id (PKGX): PRIMARY KEY - Dùng cho TẤT CẢ API calls (update, delete, link)
 * - goods_sn (PKGX) = sku (HRM): Mã SKU sản phẩm, có thể sync 2 chiều
 * - pkgxId (HRM Product): Lưu trữ goods_id để link sản phẩm
 */

// ========================================
// Push Sync Fields Configuration
// ========================================

/**
 * Sync fields configuration - HRM to PKGX (push only)
 * Giá sử dụng cấu hình từ tab "Mapping giá" (không chọn từng trường)
 */
export const PUSH_SYNC_FIELDS = [
  // Thông tin cơ bản
  { key: 'goods_name', label: 'Tên sản phẩm', hrmField: 'name', group: 'basic' },
  { key: 'goods_sn', label: 'Mã SKU', hrmField: 'sku', group: 'basic' },
  { key: 'goods_brief', label: 'Mô tả ngắn', hrmField: 'shortDescription', group: 'basic' },
  { key: 'goods_desc', label: 'Mô tả chi tiết', hrmField: 'description', group: 'basic' },
  
  // Giá cả - Một toggle cho tất cả, sử dụng mapping từ tab Mapping giá
  { key: 'sync_prices', label: 'Đồng bộ giá (theo cấu hình Mapping giá)', hrmField: 'prices', group: 'price', isSpecial: true },
  
  // Tồn kho
  { key: 'goods_number', label: 'Số lượng tồn', hrmField: 'quantity', group: 'inventory' },
  
  // Phân loại
  { key: 'cat_id', label: 'Danh mục', hrmField: 'categoryId', group: 'classification' },
  { key: 'brand_id', label: 'Thương hiệu', hrmField: 'brandId', group: 'classification' },
  
  // SEO
  { key: 'keywords', label: 'Từ khóa SEO', hrmField: 'seoKeywords', group: 'seo' },
  { key: 'meta_title', label: 'Tiêu đề SEO', hrmField: 'ktitle', group: 'seo' },
  { key: 'meta_desc', label: 'Mô tả SEO', hrmField: 'seoDescription', group: 'seo' },
  
  // Trạng thái hiển thị
  { key: 'best', label: 'SP tốt nhất', hrmField: 'isBest', group: 'display' },
  { key: 'hot', label: 'SP hot', hrmField: 'isHot', group: 'display' },
  { key: 'new', label: 'SP mới', hrmField: 'isNew', group: 'display' },
  { key: 'ishome', label: 'Hiển thị trang chủ', hrmField: 'isHome', group: 'display' },
  
  // Ghi chú
  { key: 'seller_note', label: 'Ghi chú người bán', hrmField: 'sellerNote', group: 'other' },
] as const;

export type PushSyncFieldKey = typeof PUSH_SYNC_FIELDS[number]['key'];

// ========================================
// PkgxProductRow Interface
// ========================================

/**
 * Extended PKGX Product with HRM linking information
 */
export interface PkgxProductRow extends PkgxProduct {
  systemId: string;
  synced_at?: number; // Unix timestamp - thời gian sync/cập nhật trên HRM
  linkedHrmProduct?: {
    systemId: SystemId;
    name: string;
    id: string | number;
    sku?: string;
    // Giá cả
    sellingPrice?: number;
    costPrice?: number;
    partnerPrice?: number;
    acePrice?: number;
    dealPrice?: number;
    // Tồn kho
    quantity?: number;
    // Nội dung
    description?: string;
    shortDescription?: string;
    // SEO
    seoDescription?: string;
    seoKeywords?: string;
    ktitle?: string;
    // Phân loại
    categorySystemId?: SystemId;
    brandSystemId?: SystemId;
    // Trạng thái
    isBest?: boolean;
    isHot?: boolean;
    isNew?: boolean;
    isHome?: boolean;
    // Khác
    sellerNote?: string;
  };
}

// ========================================
// Dialog Props Interfaces
// ========================================

export interface ProductDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: PkgxProductRow | null;
  galleryImages: import('../../types').PkgxGalleryImage[];
  isLoadingGallery: boolean;
  onViewOnPkgx: (goodsId: number) => void;
  onOpenUnlinkDialog: (product: PkgxProduct) => void;
  buildPkgxImageUrl: (imagePath: string | undefined | null) => string;
}

export interface PushSyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: PkgxProductRow | null;
  selectedFields: PushSyncFieldKey[];
  isPushing: boolean;
  onToggleField: (field: PushSyncFieldKey) => void;
  onSelectAll: () => void;
  onPush: () => void;
}

export interface UnlinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productToUnlink: {
    pkgxProduct: PkgxProduct;
    hrmProduct: { systemId: string; name: string };
  } | null;
  onConfirmUnlink: () => void;
}

export interface BulkUnlinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  onConfirmBulkUnlink: () => void;
}
