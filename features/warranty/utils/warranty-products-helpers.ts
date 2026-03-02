/**
 * Helper functions for warranty products section
 */
import { checkWarrantyStatus, type WarrantyCheckResult } from './warranty-checker';
import type { Order } from '@/features/orders/types';
import { generateSubEntityId } from '@/lib/id-utils';

// ✅ Extended file type compatible with StagingFile for ExistingDocumentsViewer
export interface SimpleImageFile {
  id: string;
  url: string;
  name?: string;
  originalName?: string;
  filename?: string;
  size?: number;
  type?: string;
  status?: 'staging' | 'permanent';
  sessionId?: string;
  slug?: string;
  uploadedAt?: string;
  metadata?: string | Record<string, unknown>;
}

export interface WarrantyProductField {
  systemId: string;
  sku?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  issueDescription: string;
  resolution: 'return' | 'replace' | 'out_of_stock';
  deductionAmount: number;
  productImages: string[];
  thumbnailImage?: string; // ✅ Ảnh đại diện sản phẩm
  productSystemId?: string; // ✅ SystemId của sản phẩm gốc để load ảnh
}

export interface ProductForSelection {
  systemId: string;
  id: string;
  name: string;
  costPrice?: number;
  warrantyPeriodMonths?: number;
  thumbnailImage?: string; // ✅ Thêm ảnh đại diện
}

/**
 * Tạo permanent files từ product images URLs
 * ✅ Now creates full StagingFile-compatible objects for ExistingDocumentsViewer
 */
export function createPermanentFilesFromProduct(
  productSystemId: string,
  productImages: string[]
): SimpleImageFile[] {
  return productImages
    .filter((url: string) => url && typeof url === 'string')
    .map((url: string, idx: number) => {
      // Extract filename from URL
      const urlParts = url.split('/');
      const filename = urlParts[urlParts.length - 1] || `image-${idx}`;
      const name = filename.split('.')[0] || `image-${idx}`;
      
      return {
        id: `product-${productSystemId}-${idx}`,
        url,
        // ✅ Add required fields for ExistingDocumentsViewer
        name: name,
        originalName: filename,
        filename: filename,
        size: 0, // Unknown for existing URLs
        type: 'image/jpeg', // Default type
        status: 'permanent' as const,
        sessionId: '',
        slug: name,
        uploadedAt: new Date().toISOString(),
        metadata: {},
      };
    });
}

/**
 * Khởi tạo state permanent files từ danh sách products
 */
export function initializePermanentFiles(
  products: WarrantyProductField[]
): Record<string, SimpleImageFile[]> {
  const result: Record<string, SimpleImageFile[]> = {};
  
  products.forEach((product) => {
    if (!product.systemId) return;
    
    const images = product.productImages || [];
    const permanentImages = createPermanentFilesFromProduct(product.systemId, images);
    
    if (permanentImages.length > 0) {
      result[product.systemId] = permanentImages;
    }
  });
  
  return result;
}

/**
 * Kiểm tra bảo hành cho một sản phẩm
 */
export function checkProductWarranty(
  customerName: string,
  product: ProductForSelection,
  quantity: number,
  allOrders: Order[]
): WarrantyCheckResult {
  return checkWarrantyStatus(
    customerName,
    product.name,
    quantity,
    allOrders,
    product.warrantyPeriodMonths || 12
  );
}

/**
 * Kiểm tra bảo hành cho nhiều sản phẩm
 */
export function checkMultipleProductsWarranty(
  customerName: string,
  products: ProductForSelection[],
  allOrders: Order[]
): { results: Record<string, WarrantyCheckResult>; warnings: string[] } {
  const results: Record<string, WarrantyCheckResult> = {};
  const warnings: string[] = [];
  
  products.forEach(product => {
    const checkResult = checkProductWarranty(customerName, product, 1, allOrders);
    results[product.name] = checkResult;
    
    if (checkResult.warnings.length > 0) {
      warnings.push(`${product.name}: ${checkResult.warnings[0]}`);
    }
  });
  
  return { results, warnings };
}

/**
 * Tạo warranty product mới từ product được chọn
 */
export function createWarrantyProductFromSelection(
  product: ProductForSelection
): WarrantyProductField {
  return {
    systemId: generateSubEntityId('WP'),
    productSystemId: product.systemId, // ✅ Lưu systemId gốc để load ảnh
    sku: product.id, // Product.id là mã SKU user-facing
    productName: product.name,
    quantity: 1,
    unitPrice: product.costPrice || 0,
    issueDescription: '',
    resolution: 'return',
    deductionAmount: 0,
    productImages: [],
    thumbnailImage: product.thumbnailImage, // ✅ Lưu ảnh đại diện
  };
}

/**
 * Lọc bỏ các images đã đánh dấu xóa khỏi product
 */
export function filterDeletedImagesFromProducts(
  products: WarrantyProductField[],
  productFilesToDelete: Record<string, string[]>
): { updatedProducts: WarrantyProductField[]; hasChanges: boolean } {
  let hasChanges = false;
  
  const updatedProducts = products.map((product) => {
    if (!product.systemId) return product;
    
    const markedFiles = productFilesToDelete[product.systemId] || [];
    if (markedFiles.length === 0) return product;
    
    const images = product.productImages || [];
    const permanentFiles = createPermanentFilesFromProduct(product.systemId, images);
    
    const cleanedImages = images.filter((url: string) => {
      if (!url || typeof url !== 'string') return false;
      const fileId = permanentFiles.find(f => f.url === url)?.id;
      return !fileId || !markedFiles.includes(fileId);
    });
    
    if (cleanedImages.length !== images.length) {
      hasChanges = true;
      return { ...product, productImages: cleanedImages };
    }
    return product;
  });
  
  return { updatedProducts, hasChanges };
}

/**
 * Sync permanent/staging files to product images trong form
 */
export function syncFilesToProductImages(
  products: WarrantyProductField[],
  productPermanentFiles: Record<string, SimpleImageFile[]>,
  productStagingFiles: Record<string, SimpleImageFile[]>
): WarrantyProductField[] {
  return products.map((product) => {
    if (!product.systemId) return product;
    
    const permanent = productPermanentFiles[product.systemId] || [];
    const staging = productStagingFiles[product.systemId] || [];
    
    const allImageUrls = [
      ...permanent.map(f => f.url),
      ...staging.map(f => f.url),
    ];
    
    return {
      ...product,
      productImages: allImageUrls,
    };
  });
}

/**
 * CSS Styles cho product images grid (tái sử dụng)
 */
export const PRODUCT_IMAGES_GRID_STYLES = `
  .product-images-grid .grid {
    display: grid !important;
    grid-template-columns: repeat(5, 80px) !important;
    gap: 8px !important;
  }
  .product-images-grid .grid > div {
    border: 1px solid #e5e7eb !important;
    background: white !important;
    box-shadow: none !important;
    padding: 0 !important;
    width: 80px !important;
    height: 80px !important;
    border-radius: 6px !important;
    overflow: hidden !important;
  }
  .product-images-grid .grid > div > div {
    height: 80px !important;
    width: 80px !important;
    padding: 0 !important;
    gap: 0 !important;
    display: block !important;
  }
  .product-images-grid .grid > div > div > div {
    height: 80px !important;
    width: 80px !important;
    aspect-ratio: unset !important;
    border-radius: 0 !important;
  }
  .product-images-grid img {
    height: 80px !important;
    width: 80px !important;
    object-fit: cover !important;
    display: block !important;
  }
  .product-images-grid button {
    position: absolute !important;
    top: 4px !important;
    right: 4px !important;
    height: 24px !important;
    width: 24px !important;
    opacity: 0 !important;
    transition: opacity 0.2s !important;
    z-index: 10 !important;
    background: rgba(255, 255, 255, 0.95) !important;
    border-radius: 4px !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
  }
  .product-images-grid .grid > div:hover button {
    opacity: 1 !important;
  }
  .product-images-grid button:hover {
    background: white !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
  }
  .product-images-grid button svg {
    height: 12px !important;
    width: 12px !important;
    color: #dc2626 !important;
  }
  .product-images-grid p,
  .product-images-grid span:not(.sr-only),
  .product-images-grid [class*="space-y-"] {
    display: none !important;
  }
`;

export const COMPACT_UPLOAD_STYLES = `
  .compact-upload > div > .space-y-4 {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
  }
  .compact-upload [role="presentation"] {
    min-height: 36px !important;
    padding: 8px !important;
    width: 256px !important;
    max-width: 256px !important;
  }
  .compact-upload [role="presentation"],
  .compact-upload [role="presentation"] > div,
  .compact-upload [role="presentation"] > div > div {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
    flex-wrap: nowrap !important;
  }
  .compact-upload [role="presentation"] *,
  .compact-upload [role="presentation"] > div *,
  .compact-upload [role="presentation"] > div > div * {
    margin: 0 !important;
  }
  .compact-upload [role="presentation"] svg {
    width: 16px !important;
    height: 16px !important;
    flex-shrink: 0 !important;
  }
  .compact-upload [role="presentation"] p {
    display: none !important;
  }
  .compact-upload [role="presentation"] span:not(.sr-only) {
    display: inline !important;
    font-size: 11px !important;
    white-space: nowrap !important;
  }
  .compact-upload [role="alert"],
  .compact-upload .bg-red-50,
  .compact-upload .border-red-200,
  .compact-upload .text-destructive {
    display: none !important;
  }
  /* Grid for uploaded images - ensure visibility */
  .compact-upload .grid {
    display: grid !important;
    grid-template-columns: repeat(3, 80px) !important;
    gap: 8px !important;
    margin-top: 8px !important;
    width: fit-content !important;
  }
  .compact-upload .grid > div {
    border: 1px solid #e5e7eb !important;
    background: white !important;
    padding: 0 !important;
    box-shadow: none !important;
    width: 80px !important;
    height: 80px !important;
    border-radius: 6px !important;
    overflow: hidden !important;
  }
  .compact-upload .grid > div > div {
    padding: 0 !important;
    gap: 0 !important;
    display: block !important;
  }
  .compact-upload .grid > div > div > div {
    height: 80px !important;
    width: 80px !important;
    aspect-ratio: unset !important;
    border-radius: 0 !important;
  }
  .compact-upload .grid img {
    height: 80px !important;
    width: 80px !important;
    object-fit: cover !important;
    display: block !important;
  }
  .compact-upload .grid > div p,
  .compact-upload .grid > div span:not(.sr-only),
  .compact-upload .grid > div [class*="space-y-"] {
    display: none !important;
  }
  .compact-upload .grid > div button {
    position: absolute !important;
    top: 4px !important;
    right: 4px !important;
    height: 24px !important;
    width: 24px !important;
    opacity: 0 !important;
    transition: opacity 0.2s !important;
    z-index: 10 !important;
    background: rgba(255, 255, 255, 0.95) !important;
    border-radius: 4px !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
  }
  .compact-upload .grid > div:hover button {
    opacity: 1 !important;
  }
  .compact-upload .grid > div button:hover {
    background: white !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
  }
  .compact-upload .grid > div button svg {
    height: 12px !important;
    width: 12px !important;
    color: #dc2626 !important;
  }
`;
