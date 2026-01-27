/**
 * Trendtech API Service
 * 
 * Gọi API từ Next.js website Trendtech
 * API endpoints: /api/hrm/*
 */

import type {
  TrendtechProduct,
  TrendtechProductsResponse,
  TrendtechProductPayload,
  TrendtechCategoriesResponse,
  TrendtechBrandsResponse,
  TrendtechCreateProductResponse,
  TrendtechUpdateProductResponse,
  TrendtechImageUploadResponse,
  TrendtechApiResponse,
  TrendtechSettings,
} from './types';

// ========================================
// Types
// ========================================

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

type ApiConfig = {
  apiUrl: string;
  apiKey: string;
  enabled: boolean;
};

// ========================================
// Helper Functions
// ========================================

function getApiConfig(settings: TrendtechSettings): ApiConfig {
  return {
    apiUrl: settings.apiUrl,
    apiKey: settings.apiKey,
    enabled: settings.enabled,
  };
}

/**
 * Base fetch function với authentication
 */
async function fetchWithAuth<T>(
  config: ApiConfig,
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const { apiUrl, apiKey, enabled } = config;

  if (!enabled) {
    return { success: false, error: 'Tích hợp Trendtech chưa được bật' };
  }

  if (!apiKey) {
    return { success: false, error: 'Chưa cấu hình API Key' };
  }

  if (!apiUrl) {
    return { success: false, error: 'Chưa cấu hình API URL' };
  }

  const url = `${apiUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-API-KEY': apiKey,
        ...options.headers,
      },
    });

    const data: TrendtechApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      return { 
        success: false, 
        error: data.error || data.message || `HTTP ${response.status}` 
      };
    }

    return { success: true, data: data.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể kết nối đến server Trendtech',
    };
  }
}

// ========================================
// Connection Test APIs
// ========================================

/**
 * Ping server để kiểm tra hoạt động (không cần auth)
 */
export async function ping(settings: TrendtechSettings): Promise<ApiResponse<{ message: string }>> {
  const config = getApiConfig(settings);
  
  if (!config.apiUrl) {
    return { success: false, error: 'Chưa cấu hình API URL' };
  }

  try {
    const response = await fetch(`${config.apiUrl}/ping`, { method: 'GET' });
    const data = await response.json();
    
    if (data.success) {
      return { success: true, data: { message: data.message || 'Server hoạt động' } };
    }
    return { success: false, error: data.error || 'Server không phản hồi' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể kết nối',
    };
  }
}

/**
 * Test kết nối với API Key
 */
export async function testConnection(settings: TrendtechSettings): Promise<ApiResponse<{
  message: string;
  stats?: {
    totalProducts: number;
    totalCategories: number;
    totalBrands: number;
  };
}>> {
  return fetchWithAuth(getApiConfig(settings), '/test', { method: 'GET' });
}

// ========================================
// Category APIs
// ========================================

/**
 * Lấy danh sách danh mục
 */
export async function getCategories(settings: TrendtechSettings): Promise<ApiResponse<TrendtechCategoriesResponse>> {
  return fetchWithAuth(getApiConfig(settings), '/categories', { method: 'GET' });
}

// ========================================
// Brand APIs
// ========================================

/**
 * Lấy danh sách thương hiệu
 */
export async function getBrands(settings: TrendtechSettings): Promise<ApiResponse<TrendtechBrandsResponse>> {
  return fetchWithAuth(getApiConfig(settings), '/brands', { method: 'GET' });
}

// ========================================
// Product APIs
// ========================================

/**
 * Lấy danh sách sản phẩm (có phân trang)
 */
export async function getProducts(
  settings: TrendtechSettings,
  page: number = 1,
  limit: number = 50
): Promise<ApiResponse<TrendtechProductsResponse>> {
  return fetchWithAuth(getApiConfig(settings), `/products?page=${page}&limit=${limit}`, { method: 'GET' });
}

/**
 * Lấy tất cả sản phẩm (tự động phân trang)
 */
export async function getAllProducts(settings: TrendtechSettings): Promise<ApiResponse<TrendtechProduct[]>> {
  const allProducts: TrendtechProduct[] = [];
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const response = await getProducts(settings, currentPage, 100);

    if (!response.success || !response.data) {
      return { success: false, error: response.error };
    }

    allProducts.push(...response.data.products);
    totalPages = response.data.pagination.totalPages;
    currentPage++;
  }

  return { success: true, data: allProducts };
}

/**
 * Lấy sản phẩm theo ID
 */
export async function getProductById(settings: TrendtechSettings, id: number): Promise<ApiResponse<TrendtechProduct>> {
  return fetchWithAuth(getApiConfig(settings), `/products/${id}`, { method: 'GET' });
}

/**
 * Tạo sản phẩm mới
 */
export async function createProduct(
  settings: TrendtechSettings,
  payload: TrendtechProductPayload
): Promise<ApiResponse<TrendtechCreateProductResponse>> {
  return fetchWithAuth(getApiConfig(settings), '/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Cập nhật sản phẩm
 */
export async function updateProduct(
  settings: TrendtechSettings,
  id: number,
  payload: Partial<TrendtechProductPayload>
): Promise<ApiResponse<TrendtechUpdateProductResponse>> {
  return fetchWithAuth(getApiConfig(settings), `/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/**
 * Xóa sản phẩm
 */
export async function deleteProduct(settings: TrendtechSettings, id: number): Promise<ApiResponse<{ message: string }>> {
  return fetchWithAuth(getApiConfig(settings), `/products/${id}`, { method: 'DELETE' });
}

// ========================================
// Sync APIs (Batch operations)
// ========================================

/**
 * Đồng bộ giá hàng loạt
 */
export async function syncPrices(
  settings: TrendtechSettings,
  items: Array<{
    id: number;
    price: number;
    compareAtPrice?: number;
  }>
): Promise<ApiResponse<{ updated: number; failed: number }>> {
  return fetchWithAuth(getApiConfig(settings), '/sync/price', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}

/**
 * Đồng bộ tồn kho hàng loạt
 */
export async function syncStock(
  settings: TrendtechSettings,
  items: Array<{
    id: number;
    quantity: number;
    inStock?: boolean;
  }>
): Promise<ApiResponse<{ updated: number; failed: number }>> {
  return fetchWithAuth(getApiConfig(settings), '/sync/stock', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}

/**
 * Đồng bộ SEO hàng loạt
 */
export async function syncSeo(
  settings: TrendtechSettings,
  items: Array<{
    id: number;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  }>
): Promise<ApiResponse<{ updated: number; failed: number }>> {
  return fetchWithAuth(getApiConfig(settings), '/sync/seo', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}

// ========================================
// Single Product Sync APIs
// ========================================

/**
 * Cập nhật giá sản phẩm đơn lẻ
 */
export async function updateProductPrice(
  settings: TrendtechSettings,
  id: number,
  prices: {
    price?: number;
    compareAtPrice?: number;
  }
): Promise<ApiResponse<TrendtechUpdateProductResponse>> {
  return updateProduct(settings, id, prices);
}

/**
 * Cập nhật tồn kho sản phẩm đơn lẻ
 */
export async function updateProductStock(
  settings: TrendtechSettings,
  id: number,
  quantity: number
): Promise<ApiResponse<TrendtechUpdateProductResponse>> {
  return updateProduct(settings, id, { quantity });
}

/**
 * Cập nhật SEO sản phẩm đơn lẻ
 */
export async function updateProductSeo(
  settings: TrendtechSettings,
  id: number,
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  }
): Promise<ApiResponse<TrendtechUpdateProductResponse>> {
  return updateProduct(settings, id, seo);
}

// ========================================
// Image Upload API
// ========================================

/**
 * Upload ảnh sản phẩm
 */
export async function uploadProductImage(
  settings: TrendtechSettings,
  imageFile: File,
  options?: {
    productId?: number;
    type?: 'thumbnail' | 'gallery';
  }
): Promise<ApiResponse<TrendtechImageUploadResponse>> {
  const config = getApiConfig(settings);

  if (!config.enabled) {
    return { success: false, error: 'Tích hợp Trendtech chưa được bật' };
  }

  if (!config.apiKey || !config.apiUrl) {
    return { success: false, error: 'Chưa cấu hình API' };
  }

  const formData = new FormData();
  formData.append('image', imageFile);
  
  if (options?.productId) {
    formData.append('productId', options.productId.toString());
  }
  if (options?.type) {
    formData.append('type', options.type);
  }

  try {
    const response = await fetch(`${config.apiUrl}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'X-API-KEY': config.apiKey,
      },
      body: formData,
    });

    const data: TrendtechApiResponse<TrendtechImageUploadResponse> = await response.json();

    if (!response.ok || !data.success) {
      return { success: false, error: data.error || 'Upload thất bại' };
    }

    return { success: true, data: data.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi upload ảnh',
    };
  }
}
