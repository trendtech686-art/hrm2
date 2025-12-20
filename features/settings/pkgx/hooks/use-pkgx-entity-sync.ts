import * as React from 'react';
import { toast } from 'sonner';
import { RefreshCw, Search, AlignLeft, Globe, FolderEdit, DollarSign, Package, Tag, FileText } from 'lucide-react';
import { updateCategory, updateCategoryBasic, updateBrand, updateProduct as updatePkgxProduct } from '../../../../lib/pkgx/api-service';
import type { LucideIcon } from 'lucide-react';

// ========================================
// Types
// ========================================

export type PkgxEntityType = 'category' | 'brand' | 'product';

export type SyncActionKey = 
  | 'sync_all' 
  | 'sync_basic' 
  | 'sync_seo' 
  | 'sync_description'
  | 'sync_price'
  | 'sync_inventory'
  | 'sync_flags';

export interface SyncAction {
  key: SyncActionKey;
  label: string;
  icon: LucideIcon;
  title: string;
  description: (name: string) => string;
  confirmTitle: string;
  confirmDescription: (name: string) => string;
  /** Which entity types support this action */
  supportedEntities: PkgxEntityType[];
  /** Is this the primary action (shown with separator and bold) */
  isPrimary?: boolean;
}

export interface HrmCategoryData {
  systemId: string;
  name: string;
  isActive?: boolean;
  seoKeywords?: string;
  seoTitle?: string;
  metaDescription?: string;
  shortDescription?: string;
  longDescription?: string;
  websiteSeo?: {
    pkgx?: {
      seoKeywords?: string;
      seoTitle?: string;
      metaDescription?: string;
      shortDescription?: string;
      longDescription?: string;
    };
  };
}

export interface HrmBrandData {
  systemId: string;
  name: string;
  website?: string;
  seoKeywords?: string;
  seoTitle?: string;
  metaDescription?: string;
  shortDescription?: string;
  longDescription?: string;
  websiteSeo?: {
    pkgx?: {
      seoKeywords?: string;
      seoTitle?: string;
      metaDescription?: string;
      shortDescription?: string;
      longDescription?: string;
    };
  };
}

export interface HrmProductData {
  systemId: string;
  name: string;
  sku?: string;
  sellingPrice?: number;
  costPrice?: number;
  dealPrice?: number;
  quantity?: number;
  seoKeywords?: string;
  ktitle?: string;
  seoDescription?: string;
  shortDescription?: string;
  description?: string;
  isBest?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  isHome?: boolean;
  categorySystemId?: string;
  brandSystemId?: string;
}

export interface ConfirmActionState {
  open: boolean;
  title: string;
  description: string;
  action: (() => void) | null;
}

export type PkgxSyncLogAction = 
  | 'test_connection'
  | 'ping'
  | 'sync_all'
  | 'sync_price'
  | 'sync_inventory'
  | 'sync_seo'
  | 'create_product'
  | 'update_product'
  | 'link_product'
  | 'unlink_product'
  | 'unlink_mapping'
  | 'sync_categories'
  | 'sync_brands'
  | 'get_products'
  | 'upload_image'
  | 'save_config'
  | 'save_mapping';

// Helper to map SyncActionKey to PkgxSyncLogAction
const mapActionKeyToLogAction = (actionKey: SyncActionKey): PkgxSyncLogAction => {
  switch (actionKey) {
    case 'sync_all': return 'sync_all';
    case 'sync_seo': return 'sync_seo';
    case 'sync_price': return 'sync_price';
    case 'sync_inventory': return 'sync_inventory';
    case 'sync_basic':
    case 'sync_description':
    case 'sync_flags':
    default:
      return 'update_product'; // Map other actions to generic update
  }
};

export interface UsePkgxEntitySyncOptions {
  entityType: PkgxEntityType;
  onLog?: (log: {
    action: PkgxSyncLogAction;
    status: 'success' | 'error' | 'info';
    message: string;
    details?: Record<string, any>;
  }) => void;
  /** For products - get PKGX category ID from HRM category */
  getPkgxCatIdByHrmCategory?: (hrmCategoryId: string) => number | undefined;
  /** For products - get PKGX brand ID from HRM brand */
  getPkgxBrandIdByHrmBrand?: (hrmBrandId: string) => number | undefined;
}

// ========================================
// Action Definitions
// ========================================

export const SYNC_ACTIONS: SyncAction[] = [
  {
    key: 'sync_all',
    label: 'Đồng bộ tất cả',
    icon: RefreshCw,
    title: 'Đồng bộ tất cả',
    description: (name) => `Đồng bộ TẤT CẢ thông tin của "${name}" lên PKGX`,
    confirmTitle: 'Đồng bộ tất cả',
    confirmDescription: (name) => `Bạn có chắc muốn đồng bộ TẤT CẢ thông tin "${name}" lên PKGX?`,
    supportedEntities: ['category', 'brand', 'product'],
    isPrimary: true,
  },
  {
    key: 'sync_basic',
    label: 'Thông tin cơ bản',
    icon: FolderEdit,
    title: 'Đồng bộ thông tin cơ bản',
    description: (name) => `Đồng bộ thông tin cơ bản của "${name}"`,
    confirmTitle: 'Đồng bộ thông tin cơ bản',
    confirmDescription: (name) => `Đồng bộ thông tin cơ bản của "${name}" lên PKGX?`,
    supportedEntities: ['category', 'brand', 'product'],
  },
  {
    key: 'sync_seo',
    label: 'SEO',
    icon: Search,
    title: 'Đồng bộ SEO',
    description: (name) => `Đồng bộ SEO (keywords, meta title, meta description) của "${name}"`,
    confirmTitle: 'Đồng bộ SEO',
    confirmDescription: (name) => `Đồng bộ SEO của "${name}" lên PKGX?`,
    supportedEntities: ['category', 'brand', 'product'],
  },
  {
    key: 'sync_description',
    label: 'Mô tả',
    icon: AlignLeft,
    title: 'Đồng bộ mô tả',
    description: (name) => `Đồng bộ mô tả (short desc, long desc) của "${name}"`,
    confirmTitle: 'Đồng bộ mô tả',
    confirmDescription: (name) => `Đồng bộ mô tả của "${name}" lên PKGX?`,
    supportedEntities: ['category', 'brand', 'product'],
  },
  {
    key: 'sync_price',
    label: 'Giá',
    icon: DollarSign,
    title: 'Đồng bộ giá',
    description: (name) => `Đồng bộ giá bán, giá thị trường, giá khuyến mãi của "${name}"`,
    confirmTitle: 'Đồng bộ giá',
    confirmDescription: (name) => `Đồng bộ giá sản phẩm "${name}" lên PKGX?`,
    supportedEntities: ['product'],
  },
  {
    key: 'sync_inventory',
    label: 'Tồn kho',
    icon: Package,
    title: 'Đồng bộ tồn kho',
    description: (name) => `Đồng bộ tổng số lượng tồn kho của "${name}"`,
    confirmTitle: 'Đồng bộ tồn kho',
    confirmDescription: (name) => `Đồng bộ tồn kho sản phẩm "${name}" lên PKGX?`,
    supportedEntities: ['product'],
  },
  {
    key: 'sync_flags',
    label: 'Flags',
    icon: Tag,
    title: 'Đồng bộ flags',
    description: (name) => `Đồng bộ flags (nổi bật, mới, hot, trang chủ) của "${name}"`,
    confirmTitle: 'Đồng bộ flags',
    confirmDescription: (name) => `Đồng bộ flags của "${name}" lên PKGX?`,
    supportedEntities: ['product'],
  },
];

// ========================================
// Hook
// ========================================

export function usePkgxEntitySync(options: UsePkgxEntitySyncOptions) {
  const { entityType, onLog, getPkgxCatIdByHrmCategory, getPkgxBrandIdByHrmBrand } = options;
  
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState<ConfirmActionState>({
    open: false,
    title: '',
    description: '',
    action: null,
  });
  
  // Get available actions for this entity type
  const availableActions = React.useMemo(() => 
    SYNC_ACTIONS.filter(action => action.supportedEntities.includes(entityType)),
  [entityType]);
  
  // Primary action (sync all)
  const primaryAction = React.useMemo(() => 
    availableActions.find(a => a.isPrimary),
  [availableActions]);
  
  // Secondary actions (non-primary)
  const secondaryActions = React.useMemo(() => 
    availableActions.filter(a => !a.isPrimary),
  [availableActions]);
  
  // Confirm handler
  const handleConfirm = React.useCallback((title: string, description: string, action: () => void) => {
    setConfirmAction({ open: true, title, description, action });
  }, []);
  
  // Execute confirmed action
  const executeAction = React.useCallback(() => {
    if (confirmAction.action) {
      confirmAction.action();
    }
    setConfirmAction({ open: false, title: '', description: '', action: null });
  }, [confirmAction.action]);
  
  // Cancel confirm dialog
  const cancelConfirm = React.useCallback(() => {
    setConfirmAction({ open: false, title: '', description: '', action: null });
  }, []);
  
  // ========================================
  // Category Sync Handlers
  // ========================================
  
  const syncCategory = React.useCallback(async (
    pkgxCatId: number,
    hrmCategory: HrmCategoryData,
    actionKey: SyncActionKey
  ) => {
    setIsSyncing(true);
    try {
      const pkgxSeo = hrmCategory.websiteSeo?.pkgx;
      let payload: Record<string, any> = {};
      let successMessage = '';
      
      switch (actionKey) {
        case 'sync_all':
          payload = {
            cat_name: hrmCategory.name,
            keywords: pkgxSeo?.seoKeywords || hrmCategory.seoKeywords || hrmCategory.name,
            meta_title: pkgxSeo?.seoTitle || hrmCategory.seoTitle || hrmCategory.name,
            meta_desc: pkgxSeo?.metaDescription || hrmCategory.metaDescription || '',
            cat_desc: pkgxSeo?.shortDescription || hrmCategory.shortDescription || '',
            long_desc: pkgxSeo?.longDescription || hrmCategory.longDescription || '',
          };
          successMessage = `Đã đồng bộ tất cả cho danh mục: ${hrmCategory.name}`;
          break;
          
        case 'sync_basic':
          payload = {
            cat_name: hrmCategory.name,
            is_show: hrmCategory.isActive !== false ? 1 : 0,
          };
          successMessage = `Đã đồng bộ thông tin cơ bản cho danh mục: ${hrmCategory.name}`;
          // Use updateCategoryBasic for basic info
          const basicResponse = await updateCategoryBasic(pkgxCatId, payload);
          if (basicResponse.success) {
            toast.success(successMessage);
            onLog?.({
              action: 'update_product', // Map to valid log action
              status: 'success',
              message: successMessage,
              details: { categoryId: pkgxCatId },
            });
          } else {
            toast.error(basicResponse.error || 'Không thể đồng bộ');
          }
          setIsSyncing(false);
          return basicResponse.success;
          
        case 'sync_seo':
          payload = {
            keywords: pkgxSeo?.seoKeywords || hrmCategory.seoKeywords || hrmCategory.name,
            meta_title: pkgxSeo?.seoTitle || hrmCategory.seoTitle || hrmCategory.name,
            meta_desc: pkgxSeo?.metaDescription || hrmCategory.metaDescription || '',
          };
          successMessage = `Đã đồng bộ SEO cho danh mục: ${hrmCategory.name}`;
          break;
          
        case 'sync_description':
          payload = {
            cat_desc: pkgxSeo?.shortDescription || hrmCategory.shortDescription || '',
            long_desc: pkgxSeo?.longDescription || hrmCategory.longDescription || '',
          };
          successMessage = `Đã đồng bộ mô tả cho danh mục: ${hrmCategory.name}`;
          break;
          
        default:
          setIsSyncing(false);
          return false;
      }
      
      const response = await updateCategory(pkgxCatId, payload);
      if (response.success) {
        toast.success(successMessage);
        onLog?.({
          action: mapActionKeyToLogAction(actionKey),
          status: 'success',
          message: successMessage,
          details: { categoryId: pkgxCatId },
        });
      } else {
        toast.error(response.error || 'Không thể đồng bộ');
      }
      
      return response.success;
    } catch (error) {
      toast.error('Lỗi khi đồng bộ danh mục');
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [onLog]);
  
  // ========================================
  // Brand Sync Handlers
  // ========================================
  
  const syncBrand = React.useCallback(async (
    pkgxBrandId: number,
    hrmBrand: HrmBrandData,
    actionKey: SyncActionKey
  ) => {
    setIsSyncing(true);
    try {
      const pkgxSeo = hrmBrand.websiteSeo?.pkgx;
      let payload: Record<string, any> = {};
      let successMessage = '';
      
      switch (actionKey) {
        case 'sync_all':
          payload = {
            brand_name: hrmBrand.name,
            site_url: hrmBrand.website || '',
            keywords: pkgxSeo?.seoKeywords || hrmBrand.seoKeywords || hrmBrand.name,
            meta_title: pkgxSeo?.seoTitle || hrmBrand.seoTitle || hrmBrand.name,
            meta_desc: pkgxSeo?.metaDescription || hrmBrand.metaDescription || '',
            short_desc: pkgxSeo?.shortDescription || hrmBrand.shortDescription || '',
            long_desc: pkgxSeo?.longDescription || hrmBrand.longDescription || '',
          };
          successMessage = `Đã đồng bộ tất cả cho thương hiệu: ${hrmBrand.name}`;
          break;
          
        case 'sync_basic':
          payload = {
            brand_name: hrmBrand.name,
            site_url: hrmBrand.website || '',
          };
          successMessage = `Đã đồng bộ thông tin cơ bản cho thương hiệu: ${hrmBrand.name}`;
          break;
          
        case 'sync_seo':
          payload = {
            keywords: pkgxSeo?.seoKeywords || hrmBrand.seoKeywords || hrmBrand.name,
            meta_title: pkgxSeo?.seoTitle || hrmBrand.seoTitle || hrmBrand.name,
            meta_desc: pkgxSeo?.metaDescription || hrmBrand.metaDescription || '',
          };
          successMessage = `Đã đồng bộ SEO cho thương hiệu: ${hrmBrand.name}`;
          break;
          
        case 'sync_description':
          payload = {
            short_desc: pkgxSeo?.shortDescription || hrmBrand.shortDescription || '',
            long_desc: pkgxSeo?.longDescription || hrmBrand.longDescription || '',
          };
          successMessage = `Đã đồng bộ mô tả cho thương hiệu: ${hrmBrand.name}`;
          break;
          
        default:
          setIsSyncing(false);
          return false;
      }
      
      const response = await updateBrand(pkgxBrandId, payload);
      if (response.success) {
        toast.success(successMessage);
        onLog?.({
          action: mapActionKeyToLogAction(actionKey),
          status: 'success',
          message: successMessage,
          details: { brandId: pkgxBrandId },
        });
      } else {
        toast.error(response.error || 'Không thể đồng bộ');
      }
      
      return response.success;
    } catch (error) {
      toast.error('Lỗi khi đồng bộ thương hiệu');
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [onLog]);
  
  // ========================================
  // Product Sync Handlers
  // ========================================
  
  const syncProduct = React.useCallback(async (
    pkgxProductId: number,
    hrmProduct: HrmProductData,
    actionKey: SyncActionKey
  ) => {
    setIsSyncing(true);
    try {
      let payload: Record<string, any> = {};
      let successMessage = '';
      
      switch (actionKey) {
        case 'sync_all':
          payload = {
            goods_name: hrmProduct.name,
            goods_sn: hrmProduct.sku || '',
            shop_price: hrmProduct.sellingPrice || 0,
            market_price: hrmProduct.costPrice || hrmProduct.sellingPrice || 0,
            promote_price: hrmProduct.dealPrice || 0,
            goods_number: hrmProduct.quantity || 0,
            keywords: hrmProduct.seoKeywords || hrmProduct.name,
            meta_title: hrmProduct.ktitle || hrmProduct.name,
            meta_desc: hrmProduct.seoDescription || '',
            goods_brief: hrmProduct.shortDescription || '',
            goods_desc: hrmProduct.description || '',
            is_best: hrmProduct.isBest ? 1 : 0,
            is_new: hrmProduct.isNew ? 1 : 0,
            is_hot: hrmProduct.isHot ? 1 : 0,
            is_home: hrmProduct.isHome ? 1 : 0,
          };
          // Add category/brand if mapped
          if (hrmProduct.categorySystemId && getPkgxCatIdByHrmCategory) {
            const catId = getPkgxCatIdByHrmCategory(hrmProduct.categorySystemId);
            if (catId) payload.cat_id = catId;
          }
          if (hrmProduct.brandSystemId && getPkgxBrandIdByHrmBrand) {
            const brandId = getPkgxBrandIdByHrmBrand(hrmProduct.brandSystemId);
            if (brandId) payload.brand_id = brandId;
          }
          successMessage = `Đã đồng bộ tất cả cho sản phẩm: ${hrmProduct.name}`;
          break;
          
        case 'sync_basic':
          payload = {
            goods_name: hrmProduct.name,
            goods_sn: hrmProduct.sku || '',
          };
          // Add category/brand if mapped
          if (hrmProduct.categorySystemId && getPkgxCatIdByHrmCategory) {
            const catId = getPkgxCatIdByHrmCategory(hrmProduct.categorySystemId);
            if (catId) payload.cat_id = catId;
          }
          if (hrmProduct.brandSystemId && getPkgxBrandIdByHrmBrand) {
            const brandId = getPkgxBrandIdByHrmBrand(hrmProduct.brandSystemId);
            if (brandId) payload.brand_id = brandId;
          }
          successMessage = `Đã đồng bộ thông tin cơ bản cho sản phẩm: ${hrmProduct.name}`;
          break;
          
        case 'sync_seo':
          payload = {
            keywords: hrmProduct.seoKeywords || hrmProduct.name,
            meta_title: hrmProduct.ktitle || hrmProduct.name,
            meta_desc: hrmProduct.seoDescription || '',
          };
          successMessage = `Đã đồng bộ SEO cho sản phẩm: ${hrmProduct.name}`;
          break;
          
        case 'sync_description':
          payload = {
            goods_brief: hrmProduct.shortDescription || '',
            goods_desc: hrmProduct.description || '',
          };
          successMessage = `Đã đồng bộ mô tả cho sản phẩm: ${hrmProduct.name}`;
          break;
          
        case 'sync_price':
          payload = {
            shop_price: hrmProduct.sellingPrice || 0,
            market_price: hrmProduct.costPrice || hrmProduct.sellingPrice || 0,
            promote_price: hrmProduct.dealPrice || 0,
          };
          successMessage = `Đã đồng bộ giá cho sản phẩm: ${hrmProduct.name}`;
          break;
          
        case 'sync_inventory':
          payload = {
            goods_number: hrmProduct.quantity || 0,
          };
          successMessage = `Đã đồng bộ tồn kho cho sản phẩm: ${hrmProduct.name}`;
          break;
          
        case 'sync_flags':
          payload = {
            is_best: hrmProduct.isBest ? 1 : 0,
            is_new: hrmProduct.isNew ? 1 : 0,
            is_hot: hrmProduct.isHot ? 1 : 0,
            is_home: hrmProduct.isHome ? 1 : 0,
          };
          successMessage = `Đã đồng bộ flags cho sản phẩm: ${hrmProduct.name}`;
          break;
          
        default:
          setIsSyncing(false);
          return false;
      }
      
      const response = await updatePkgxProduct(pkgxProductId, payload);
      if (response.success) {
        toast.success(successMessage);
        onLog?.({
          action: mapActionKeyToLogAction(actionKey),
          status: 'success',
          message: successMessage,
          details: { pkgxId: pkgxProductId },
        });
      } else {
        toast.error(response.error || 'Không thể đồng bộ');
      }
      
      return response.success;
    } catch (error) {
      toast.error('Lỗi khi đồng bộ sản phẩm');
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [onLog, getPkgxCatIdByHrmCategory, getPkgxBrandIdByHrmBrand]);
  
  // ========================================
  // Generic sync handler based on entity type
  // ========================================
  
  const sync = React.useCallback(async (
    pkgxId: number,
    hrmData: HrmCategoryData | HrmBrandData | HrmProductData,
    actionKey: SyncActionKey
  ) => {
    switch (entityType) {
      case 'category':
        return syncCategory(pkgxId, hrmData as HrmCategoryData, actionKey);
      case 'brand':
        return syncBrand(pkgxId, hrmData as HrmBrandData, actionKey);
      case 'product':
        return syncProduct(pkgxId, hrmData as HrmProductData, actionKey);
      default:
        return false;
    }
  }, [entityType, syncCategory, syncBrand, syncProduct]);
  
  // ========================================
  // Action trigger with confirmation
  // ========================================
  
  const triggerSyncAction = React.useCallback((
    actionKey: SyncActionKey,
    pkgxId: number,
    hrmData: HrmCategoryData | HrmBrandData | HrmProductData,
    entityName: string
  ) => {
    const action = SYNC_ACTIONS.find(a => a.key === actionKey);
    if (!action) return;
    
    handleConfirm(
      action.confirmTitle,
      action.confirmDescription(entityName),
      () => sync(pkgxId, hrmData, actionKey)
    );
  }, [handleConfirm, sync]);
  
  return {
    // State
    isSyncing,
    confirmAction,
    
    // Actions config
    availableActions,
    primaryAction,
    secondaryActions,
    
    // Handlers
    handleConfirm,
    executeAction,
    cancelConfirm,
    
    // Sync methods
    sync,
    syncCategory,
    syncBrand,
    syncProduct,
    triggerSyncAction,
  };
}

export type UsePkgxEntitySyncReturn = ReturnType<typeof usePkgxEntitySync>;
