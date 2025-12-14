import { usePkgxSettingsStore } from '../../features/settings/pkgx/store';
import type {
  PkgxProduct,
  PkgxProductsResponse,
  PkgxProductPayload,
  PkgxImageUploadResponse,
  PkgxCategoriesResponse,
  PkgxBrandsResponse,
} from '../../features/settings/pkgx/types';
import { PKGX_API_CONFIG } from '../../features/settings/pkgx/constants';

// ========================================
// Types
// ========================================

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

type CreateProductResponse = {
  error: boolean;
  message: string;
  goods_id: number;
  created_slug: string;
};

type UpdateProductResponse = {
  error: boolean;
  message: string;
  goods_id: number;
  updated_slug?: string;
};

// ========================================
// Helper Functions
// ========================================

function getApiConfig() {
  const { settings } = usePkgxSettingsStore.getState();
  return {
    apiUrl: settings.apiUrl || PKGX_API_CONFIG.baseUrl,
    apiKey: settings.apiKey,
    enabled: settings.enabled,
  };
}

async function fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const { apiKey, enabled } = getApiConfig();

  if (!enabled) {
    return { success: false, error: 'Tích hợp PKGX chưa được bật' };
  }

  if (!apiKey) {
    return { success: false, error: 'Chưa cấu hình API Key' };
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-API-KEY': apiKey,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (data.error) {
      return { success: false, error: data.message || 'Lỗi từ server PKGX' };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể kết nối đến server PKGX',
    };
  }
}

// ========================================
// API Functions
// ========================================

/**
 * Lấy danh sách danh mục từ PKGX
 */
export async function getCategories(): Promise<ApiResponse<PkgxCategoriesResponse>> {
  const { apiUrl } = getApiConfig();
  const url = `${apiUrl}?action=get_categories`;
  return fetchWithAuth<PkgxCategoriesResponse>(url, { method: 'GET' });
}

/**
 * Lấy danh sách thương hiệu từ PKGX
 */
export async function getBrands(): Promise<ApiResponse<PkgxBrandsResponse>> {
  const { apiUrl } = getApiConfig();
  const url = `${apiUrl}?action=get_brands`;
  return fetchWithAuth<PkgxBrandsResponse>(url, { method: 'GET' });
}

/**
 * Lấy danh sách sản phẩm từ PKGX (có phân trang)
 */
export async function getProducts(
  page: number = 1,
  limit: number = 50
): Promise<ApiResponse<PkgxProductsResponse>> {
  const { apiUrl } = getApiConfig();
  const url = `${apiUrl}?action=get_products&page=${page}&limit=${limit}`;
  return fetchWithAuth<PkgxProductsResponse>(url, { method: 'GET' });
}

/**
 * Lấy tất cả sản phẩm từ PKGX (tự động phân trang)
 */
export async function getAllProducts(): Promise<ApiResponse<PkgxProduct[]>> {
  const allProducts: PkgxProduct[] = [];
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const response = await getProducts(currentPage, 100);

    if (!response.success || !response.data) {
      return { success: false, error: response.error };
    }

    allProducts.push(...response.data.data);
    totalPages = response.data.pagination.total_pages;
    currentPage++;
  }

  return { success: true, data: allProducts };
}

/**
 * Lấy sản phẩm theo goods_id (sử dụng API get_products với filter)
 */
export async function getProductById(goodsId: number): Promise<ApiResponse<PkgxProduct | null>> {
  const { apiUrl } = getApiConfig();
  // API không có action=get_product, dùng get_products với goods_id filter
  const url = `${apiUrl}?action=get_products&goods_id=${goodsId}`;
  
  const response = await fetchWithAuth<PkgxProductsResponse>(url, { method: 'GET' });
  
  if (!response.success || !response.data) {
    return { success: false, error: response.error };
  }
  
  // Trả về sản phẩm đầu tiên nếu có
  const product = response.data.data?.[0] || null;
  return { success: true, data: product };
}

/**
 * Tạo sản phẩm mới trên PKGX
 */
export async function createProduct(
  payload: PkgxProductPayload
): Promise<ApiResponse<CreateProductResponse>> {
  const { apiUrl } = getApiConfig();
  const url = `${apiUrl}?action=create_product`;

  return fetchWithAuth<CreateProductResponse>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/**
 * Cập nhật sản phẩm trên PKGX
 */
export async function updateProduct(
  goodsId: number,
  payload: Partial<PkgxProductPayload>
): Promise<ApiResponse<UpdateProductResponse>> {
  const { apiUrl } = getApiConfig();
  const url = `${apiUrl}?action=update_product&goods_id=${goodsId}`;

  return fetchWithAuth<UpdateProductResponse>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/**
 * Cập nhật giá sản phẩm
 */
export async function updateProductPrice(
  goodsId: number,
  prices: {
    shop_price?: number;
    market_price?: number;
    partner_price?: number;
    ace_price?: number;
    deal_price?: number;
  }
): Promise<ApiResponse<UpdateProductResponse>> {
  return updateProduct(goodsId, prices);
}

/**
 * Cập nhật SEO sản phẩm
 */
export async function updateProductSeo(
  goodsId: number,
  seo: {
    meta_title?: string;
    meta_desc?: string;
    keywords?: string;
  }
): Promise<ApiResponse<UpdateProductResponse>> {
  return updateProduct(goodsId, seo);
}

/**
 * Cập nhật tồn kho sản phẩm
 */
export async function updateProductStock(
  goodsId: number,
  goodsNumber: number
): Promise<ApiResponse<UpdateProductResponse>> {
  return updateProduct(goodsId, { goods_number: goodsNumber });
}

/**
 * Upload ảnh sản phẩm lên PKGX
 */
export async function uploadProductImage(
  imageFile: File,
  options?: {
    filenameSlug?: string;
    goodsId?: number;
  }
): Promise<ApiResponse<PkgxImageUploadResponse>> {
  const { apiUrl, apiKey, enabled } = getApiConfig();

  if (!enabled) {
    return { success: false, error: 'Tích hợp PKGX chưa được bật' };
  }

  if (!apiKey) {
    return { success: false, error: 'Chưa cấu hình API Key' };
  }

  const url = `${apiUrl}?action=upload_product_image`;
  const formData = new FormData();
  formData.append('image_file', imageFile);

  if (options?.filenameSlug) {
    formData.append('filename_slug', options.filenameSlug);
  }

  if (options?.goodsId) {
    formData.append('goods_id', options.goodsId.toString());
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey },
      body: formData,
    });

    const data = await response.json();

    if (data.error) {
      return { success: false, error: data.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể upload ảnh',
    };
  }
}

/**
 * Lấy chi tiết danh mục theo cat_id (bao gồm SEO fields)
 */
export async function getCategoryById(catId: number): Promise<ApiResponse<PkgxCategoriesResponse>> {
  const { apiUrl } = getApiConfig();
  const url = `${apiUrl}?action=get_categories&cat_id=${catId}`;
  return fetchWithAuth<PkgxCategoriesResponse>(url, { method: 'GET' });
}

/**
 * Cập nhật thông tin danh mục (SEO, mô tả)
 */
export async function updateCategory(
  catId: number,
  payload: {
    cat_name?: string;
    cat_desc?: string;
    keywords?: string;
    cat_alias?: string;
  }
): Promise<ApiResponse<{ error: boolean; message: string; cat_id: number }>> {
  const { apiUrl } = getApiConfig();
  const url = `${apiUrl}?action=update_category&cat_id=${catId}`;

  return fetchWithAuth(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/**
 * Lấy chi tiết thương hiệu theo brand_id (bao gồm SEO fields)
 */
export async function getBrandById(brandId: number): Promise<ApiResponse<PkgxBrandsResponse>> {
  const { apiUrl } = getApiConfig();
  const url = `${apiUrl}?action=get_brands&brand_id=${brandId}`;
  return fetchWithAuth<PkgxBrandsResponse>(url, { method: 'GET' });
}

/**
 * Cập nhật thông tin thương hiệu (SEO, mô tả)
 */
export async function updateBrand(
  brandId: number,
  payload: {
    brand_name?: string;
    brand_desc?: string;
    site_url?: string;
  }
): Promise<ApiResponse<{ error: boolean; message: string; brand_id: number }>> {
  const { apiUrl } = getApiConfig();
  const url = `${apiUrl}?action=update_brand&brand_id=${brandId}`;

  return fetchWithAuth(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/**
 * Test kết nối API
 */
export async function testConnection(): Promise<ApiResponse<{ productCount: number }>> {
  const response = await getProducts(1, 1);

  if (!response.success) {
    return { success: false, error: response.error };
  }

  return {
    success: true,
    data: { productCount: response.data?.pagination.total_items || 0 },
  };
}
