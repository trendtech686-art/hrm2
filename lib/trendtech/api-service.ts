/**
 * Trendtech API Service
 * 
 * Gọi API từ Next.js website Trendtech
 * API endpoints: /api/hrm/*
 */

import { useTrendtechSettingsStore } from '../../features/settings/trendtech/store';
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
} from './types';

// ========================================
// Types
// ========================================

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// ========================================
// Helper Functions
// ========================================

function getApiConfig() {
  const { settings } = useTrendtechSettingsStore.getState();
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
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const { apiUrl, apiKey, enabled } = getApiConfig();

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
export async function ping(): Promise<ApiResponse<{ message: string }>> {
  const { apiUrl } = getApiConfig();
  
  if (!apiUrl) {
    return { success: false, error: 'Chưa cấu hình API URL' };
  }

  try {
    const response = await fetch(`${apiUrl}/ping`, { method: 'GET' });
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
export async function testConnection(): Promise<ApiResponse<{
  message: string;
  stats?: {
    totalProducts: number;
    totalCategories: number;
    totalBrands: number;
  };
}>> {
  return fetchWithAuth('/test', { method: 'GET' });
}

// ========================================
// Category APIs
// ========================================

/**
 * Lấy danh sách danh mục
 */
export async function getCategories(): Promise<ApiResponse<TrendtechCategoriesResponse>> {
  return fetchWithAuth('/categories', { method: 'GET' });
}

// ========================================
// Brand APIs
// ========================================

/**
 * Lấy danh sách thương hiệu
 */
export async function getBrands(): Promise<ApiResponse<TrendtechBrandsResponse>> {
  return fetchWithAuth('/brands', { method: 'GET' });
}

// ========================================
// Product APIs
// ========================================

/**
 * Lấy danh sách sản phẩm (có phân trang)
 */
export async function getProducts(
  page: number = 1,
  limit: number = 50
): Promise<ApiResponse<TrendtechProductsResponse>> {
  return fetchWithAuth(`/products?page=${page}&limit=${limit}`, { method: 'GET' });
}

/**
 * Lấy tất cả sản phẩm (tự động phân trang)
 */
export async function getAllProducts(): Promise<ApiResponse<TrendtechProduct[]>> {
  const allProducts: TrendtechProduct[] = [];
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const response = await getProducts(currentPage, 100);

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
export async function getProductById(id: number): Promise<ApiResponse<TrendtechProduct>> {
  return fetchWithAuth(`/products/${id}`, { method: 'GET' });
}

/**
 * Tạo sản phẩm mới
 */
export async function createProduct(
  payload: TrendtechProductPayload
): Promise<ApiResponse<TrendtechCreateProductResponse>> {
  return fetchWithAuth('/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Cập nhật sản phẩm
 */
export async function updateProduct(
  id: number,
  payload: Partial<TrendtechProductPayload>
): Promise<ApiResponse<TrendtechUpdateProductResponse>> {
  return fetchWithAuth(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/**
 * Xóa sản phẩm
 */
export async function deleteProduct(id: number): Promise<ApiResponse<{ message: string }>> {
  return fetchWithAuth(`/products/${id}`, { method: 'DELETE' });
}

// ========================================
// Sync APIs (Batch operations)
// ========================================

/**
 * Đồng bộ giá hàng loạt
 */
export async function syncPrices(
  items: Array<{
    id: number;
    price: number;
    compareAtPrice?: number;
  }>
): Promise<ApiResponse<{ updated: number; failed: number }>> {
  return fetchWithAuth('/sync/price', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}

/**
 * Đồng bộ tồn kho hàng loạt
 */
export async function syncStock(
  items: Array<{
    id: number;
    quantity: number;
    inStock?: boolean;
  }>
): Promise<ApiResponse<{ updated: number; failed: number }>> {
  return fetchWithAuth('/sync/stock', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}

/**
 * Đồng bộ SEO hàng loạt
 */
export async function syncSeo(
  items: Array<{
    id: number;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  }>
): Promise<ApiResponse<{ updated: number; failed: number }>> {
  return fetchWithAuth('/sync/seo', {
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
  id: number,
  prices: {
    price?: number;
    compareAtPrice?: number;
  }
): Promise<ApiResponse<TrendtechUpdateProductResponse>> {
  return updateProduct(id, prices);
}

/**
 * Cập nhật tồn kho sản phẩm đơn lẻ
 */
export async function updateProductStock(
  id: number,
  quantity: number
): Promise<ApiResponse<TrendtechUpdateProductResponse>> {
  return updateProduct(id, { quantity });
}

/**
 * Cập nhật SEO sản phẩm đơn lẻ
 */
export async function updateProductSeo(
  id: number,
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  }
): Promise<ApiResponse<TrendtechUpdateProductResponse>> {
  return updateProduct(id, seo);
}

// ========================================
// Image Upload API
// ========================================

/**
 * Upload ảnh sản phẩm
 */
export async function uploadProductImage(
  imageFile: File,
  options?: {
    productId?: number;
    type?: 'thumbnail' | 'gallery';
  }
): Promise<ApiResponse<TrendtechImageUploadResponse>> {
  const { apiUrl, apiKey, enabled } = getApiConfig();

  if (!enabled) {
    return { success: false, error: 'Tích hợp Trendtech chưa được bật' };
  }

  if (!apiKey || !apiUrl) {
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
    const response = await fetch(`${apiUrl}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-API-KEY': apiKey,
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
