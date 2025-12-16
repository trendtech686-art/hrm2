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
 * Upload ảnh từ URL (server-to-server, tránh CORS)
 * Server PKGX sẽ tự download ảnh từ URL rồi xử lý
 */
export async function uploadImageFromUrl(
  imageUrl: string,
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

  const url = `${apiUrl}?action=upload_image_from_url`;
  
  const payload: Record<string, unknown> = {
    image_url: imageUrl,
  };

  if (options?.filenameSlug) {
    payload.filename_slug = options.filenameSlug;
  }

  if (options?.goodsId) {
    payload.goods_id = options.goodsId;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.error) {
      return { success: false, error: data.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể upload ảnh từ URL',
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

// ========================================
// Member Price API (Giá thành viên)
// ========================================

type MemberRank = {
  rank_id: number;
  rank_name: string;
  min_points: number;
  max_points: number;
  discount: number;
  special_rank: number;
};

type MemberRanksResponse = {
  error: boolean;
  message: string;
  total: number;
  data: MemberRank[];
};

type MemberPriceResult = {
  user_rank: number;
  rank_name?: string;
  user_price?: number;
  status: 'updated' | 'deleted' | 'skipped';
  reason?: string;
};

type CurrentMemberPrice = {
  user_rank: string;
  user_price: string;
  rank_name: string;
};

type UpdateMemberPriceResponse = {
  error: boolean;
  message: string;
  goods_id: number;
  goods_name: string;
  results: MemberPriceResult[];
  current_member_prices: CurrentMemberPrice[];
};

/**
 * Lấy danh sách hạng thành viên từ PKGX
 */
export async function getMemberRanks(): Promise<ApiResponse<MemberRanksResponse>> {
  const { apiUrl } = getApiConfig();
  const url = `${apiUrl}?action=get_member_ranks`;
  return fetchWithAuth<MemberRanksResponse>(url, { method: 'GET' });
}

/**
 * Cập nhật giá thành viên cho sản phẩm
 * 
 * @param goodsId - ID sản phẩm trên PKGX
 * @param memberPrices - Mảng giá thành viên theo user_rank
 * 
 * Ví dụ:
 * - Cập nhật 1 giá: updateMemberPrice(8014, [{ user_rank: 8, user_price: 2200000 }])
 * - Cập nhật nhiều: updateMemberPrice(8014, [{ user_rank: 8, user_price: 2200000 }, { user_rank: 9, user_price: 1800000 }])
 * - Xóa giá (set = 0): updateMemberPrice(8014, [{ user_rank: 8, user_price: 0 }])
 */
export async function updateMemberPrice(
  goodsId: number,
  memberPrices: Array<{ user_rank: number; user_price: number }>
): Promise<ApiResponse<UpdateMemberPriceResponse>> {
  const { apiUrl } = getApiConfig();
  const url = `${apiUrl}?action=update_member_price&goods_id=${goodsId}`;

  return fetchWithAuth<UpdateMemberPriceResponse>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ member_prices: memberPrices }),
  });
}

/**
 * Cập nhật giá thành viên theo rank_id đơn lẻ
 */
export async function updateMemberPriceSingle(
  goodsId: number,
  userRank: number,
  userPrice: number
): Promise<ApiResponse<UpdateMemberPriceResponse>> {
  return updateMemberPrice(goodsId, [{ user_rank: userRank, user_price: userPrice }]);
}

// ========================================
// HTML Image Processing
// ========================================

/**
 * Kiểm tra URL có phải là URL công khai không (không phải localhost/internal)
 */
function isPublicUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    
    // Loại bỏ các URL nội bộ
    if (hostname === 'localhost' || 
        hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.endsWith('.local')) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Kiểm tra xem URL có phải là ảnh base64 không
 */
function isBase64Image(url: string): boolean {
  return url.startsWith('data:image/');
}

/**
 * Kiểm tra xem URL đã là URL của PKGX CDN chưa
 */
function isPkgxCdnUrl(url: string): boolean {
  return url.includes('phukiengiaxuong.com.vn/cdn/');
}

/**
 * Xử lý HTML để upload tất cả ảnh lên PKGX và thay thế URL
 * 
 * Hàm này sẽ:
 * 1. Tìm tất cả <img> tags trong HTML
 * 2. Với mỗi ảnh có src là URL công khai (không phải localhost):
 *    - Upload lên PKGX qua upload_image_from_url
 *    - Thay thế src bằng URL mới trên PKGX CDN
 * 3. Với ảnh base64: bỏ qua (quá nặng, không sync)
 * 4. Với ảnh đã trên PKGX CDN: giữ nguyên
 * 
 * @param html - HTML content cần xử lý
 * @param filenamePrefix - Prefix cho tên file (optional)
 * @returns HTML đã được xử lý với URLs mới
 */
export async function processHtmlImagesForPkgx(
  html: string,
  filenamePrefix?: string
): Promise<{ processedHtml: string; uploadedCount: number; skippedCount: number; errors: string[] }> {
  if (!html) {
    return { processedHtml: html, uploadedCount: 0, skippedCount: 0, errors: [] };
  }

  // Regex để tìm tất cả <img> tags
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  
  let processedHtml = html;
  let uploadedCount = 0;
  let skippedCount = 0;
  const errors: string[] = [];
  
  // Tìm tất cả các ảnh
  const matches: Array<{ fullMatch: string; src: string }> = [];
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    matches.push({ fullMatch: match[0], src: match[1] });
  }

  // Xử lý từng ảnh
  for (let i = 0; i < matches.length; i++) {
    const { fullMatch, src } = matches[i];
    
    // Skip base64 images
    if (isBase64Image(src)) {
      skippedCount++;
      errors.push(`Bỏ qua ảnh base64 (không hỗ trợ upload base64)`);
      continue;
    }
    
    // Skip if already on PKGX CDN
    if (isPkgxCdnUrl(src)) {
      skippedCount++;
      continue;
    }
    
    // Skip localhost/internal URLs
    if (!isPublicUrl(src)) {
      skippedCount++;
      errors.push(`Bỏ qua URL nội bộ: ${src.substring(0, 50)}...`);
      continue;
    }
    
    // Upload to PKGX
    try {
      const slug = filenamePrefix 
        ? `${filenamePrefix}-desc-img-${i + 1}` 
        : `desc-img-${Date.now()}-${i + 1}`;
      
      const uploadResult = await uploadImageFromUrl(src, { filenameSlug: slug });
      
      if (uploadResult.success && uploadResult.data?.data?.full_urls?.original) {
        // Replace src in HTML
        const newSrc = uploadResult.data.data.full_urls.original;
        const newImgTag = fullMatch.replace(src, newSrc);
        processedHtml = processedHtml.replace(fullMatch, newImgTag);
        uploadedCount++;
      } else {
        errors.push(`Lỗi upload ảnh: ${uploadResult.error || 'Unknown error'}`);
        skippedCount++;
      }
    } catch (error) {
      errors.push(`Exception upload ảnh: ${error instanceof Error ? error.message : String(error)}`);
      skippedCount++;
    }
  }

  return { processedHtml, uploadedCount, skippedCount, errors };
}
