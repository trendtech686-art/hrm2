/**
 * Product Print Helper
 * Helpers để chuẩn bị dữ liệu in cho tem sản phẩm
 */

import { 
  ProductLabelForPrint, 
  mapProductLabelToPrintData,
  mapProductToLabelPrintData,
} from '../print-mappers/product-label.mapper';
import { StoreSettings, getStoreLogo, getGeneralSettings } from '../print-service';

// Interface cho product
interface Product {
  systemId: string;
  id: string; // SKU
  name: string;
  barcode?: string;
  price: number;
  salePrice?: number;
  costPrice?: number;
  unit?: string;
  category?: string;
  brand?: string;
  origin?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  description?: string;
  attributes?: Record<string, string>;
}

/**
 * Chuyển đổi Product entity sang ProductLabelForPrint
 */
export function convertProductForLabel(
  product: Product,
  options: {
    quantity?: number;
    showPrice?: boolean;
    showBarcode?: boolean;
    showOrigin?: boolean;
    customFields?: Record<string, string>;
  } = {}
): ProductLabelForPrint {
  const { showPrice = true, showBarcode = true, showOrigin = false } = options;

  return {
    // Thông tin sản phẩm
    sku: product.id,
    name: product.name,
    barcode: showBarcode ? product.barcode : undefined,
    
    // Giá
    price: showPrice ? product.price : undefined,
    
    // Thông tin khác
    unit: product.unit || 'Cái',
    category: product.category,
    brand: product.brand,
    origin: showOrigin ? product.origin : undefined,
    
    // Mô tả
    description: product.description,
  };
}

/**
 * Chuyển đổi danh sách Product sang danh sách ProductLabelForPrint
 */
export function convertProductsForLabels(
  products: Array<{ product: Product; quantity: number }>,
  options: {
    showPrice?: boolean;
    showBarcode?: boolean;
    showOrigin?: boolean;
  } = {}
): ProductLabelForPrint[] {
  return products.map(({ product, quantity }) => 
    convertProductForLabel(product, { ...options, quantity })
  );
}

/**
 * Tạo StoreSettings từ storeInfo
 */
export function createStoreSettings(storeInfo?: {
  companyName?: string;
  brandName?: string;
  hotline?: string;
  email?: string;
  website?: string;
  taxCode?: string;
  headquartersAddress?: string;
  province?: string;
  logo?: string;
}): StoreSettings {
  // Fallback lấy từ general-settings nếu storeInfo trống
  const generalSettings = getGeneralSettings();
  return {
    name: storeInfo?.companyName || storeInfo?.brandName || generalSettings?.companyName || '',
    address: storeInfo?.headquartersAddress || generalSettings?.companyAddress || '',
    phone: storeInfo?.hotline || generalSettings?.phoneNumber || '',
    email: storeInfo?.email || generalSettings?.email || '',
    website: storeInfo?.website,
    taxCode: storeInfo?.taxCode,
    province: storeInfo?.province,
    logo: getStoreLogo(storeInfo?.logo),
  };
}

// Re-export mappers
export {
  mapProductLabelToPrintData,
  mapProductToLabelPrintData,
};
