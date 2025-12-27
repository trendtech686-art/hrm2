# 📦 PKGX Integration Plan - Tích hợp HRM với Website phukiengiaxuong.com.vn

> **Ngày tạo:** 13/12/2024  
> **Cập nhật:** 13/12/2024  
> **Mục tiêu:** Đồng bộ sản phẩm từ HRM sang website PKGX và ngược lại

---

## 📋 Tổng quan

### 1. Hiện trạng

#### 🏢 HRM System (D:\hrm2)
- **Sản phẩm:** Quản lý tại `features/products/`
- **Field liên kết:** `pkgxId` (number) - Đây là `goods_id` trên PKGX
- **Đã có sẵn:**
  - UI nút: "Cập nhật giá PKGX", "Đăng sản phẩm PKGX", "Cập nhật SEO PKGX"
  - Handlers placeholder trong `page.tsx` (đang `TODO`)

#### 🌐 Website PKGX (phukiengiaxuong.com.vn)
- **Platform:** ECShop
- **API Files:** 
  - `docs/file/api_product_pro.php` (Product API)
  - `docs/file/api_img.php` (Image Upload API)
- **API Base URL:** `https://phukiengiaxuong.com.vn/admin/api_product_pro.php`
- **Image API URL:** `https://phukiengiaxuong.com.vn/cdn/article_thumb/api_image.php`
- **CDN URL:** `https://phukiengiaxuong.com.vn/cdn/`
- **Data File:** `docs/file/idpkgx.xlsx` (chứa cat_id, brand_id)

---

## 🔑 API Reference - PKGX

### Authentication
```
Header: X-API-KEY: a91f2c47e5d8b6f03a7c4e9d12f0b8a6
```

### API Base URL
```
https://phukiengiaxuong.com.vn/admin/api_product_pro.php
```

### Endpoints

| Action | Method | URL | Mô tả |
|--------|--------|-----|-------|
| **Lấy danh sách SP** | GET | `?action=get_products&page=1&limit=50` | Phân trang, trả về `goods_id`, `slug` |
| **Tạo SP mới** | POST | `?action=create_product` | Tạo sản phẩm mới trên PKGX |
| **Cập nhật SP** | POST | `?action=update_product&goods_id={id}` | Cập nhật theo `goods_id` |
| **Upload ảnh SP** | POST | `?action=upload_product_image` | Upload ảnh vào thư mục sản phẩm **(MỚI)** |

### Response Format (get_products)
```json
{
  "error": false,
  "message": "Lấy dữ liệu sản phẩm thành công.",
  "pagination": {
    "total_items": 1500,
    "total_pages": 30,
    "current_page": 1,
    "per_page": 50
  },
  "data": [
    {
      "goods_id": 123,
      "goods_name": "Áo sơ mi nam trắng Oxford",
      "goods_sn": "SP001",
      "cat_id": 5,
      "brand_id": 2,
      "shop_price": 150000,
      "market_price": 180000,
      "partner_price": 120000,
      "goods_number": 50,
      "goods_desc": "<p>Mô tả HTML...</p>",
      "keywords": "áo sơ mi, nam, oxford",
      "goods_brief": "Mô tả ngắn",
      "meta_title": "Áo sơ mi nam...",
      "meta_desc": "SEO description",
      "goods_img": "images/goods_img/ao-somi.webp",
      "goods_thumb": "images/thumb_img/ao-somi.webp",
      "original_img": "images/source_img/ao-somi.jpg",
      "is_on_sale": 1,
      "is_best": 1,
      "is_hot": 0,
      "is_new": 1,
      "is_home": 0,
      "slug": "ao-so-mi-nam-trang-oxford"
    }
  ]
}
```

### Create Product Payload
```json
{
  "goods_name": "Tên sản phẩm",
  "goods_sn": "SKU001",
  "cat_id": 5,
  "brand_id": 2,
  "shop_price": 150000,
  "market_price": 180000,
  "partner_price": 120000,
  "ace_price": 100000,
  "deal_price": 90000,
  "goods_number": 50,
  "goods_desc": "<p>Mô tả HTML</p>",
  "keywords": "keyword1, keyword2",
  "goods_brief": "Mô tả ngắn",
  "meta_title": "Tiêu đề SEO",
  "meta_desc": "Mô tả SEO",
  "original_img": "images/source_img/product.jpg",
  "best": false,
  "hot": false,
  "new": true,
  "ishome": false,
  "seller_note": "Ghi chú nội bộ"
}
```

### Update Product Payload
```json
{
  "goods_name": "Tên mới (optional)",
  "shop_price": 160000,
  "market_price": 200000,
  "goods_number": 100,
  "meta_title": "SEO Title mới",
  "meta_desc": "SEO Description mới",
  "keywords": "new, keywords"
}
```

### Upload Product Image (MỚI) ✅

**Endpoint:** `POST ?action=upload_product_image`  
**Content-Type:** `multipart/form-data`  
**File:** `docs/file/api_product_image_upload.php`

**Form Fields:**
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `image_file` | File | ✅ | File ảnh (JPEG, PNG, GIF, WebP, max 10MB) |
| `filename_slug` | String | ❌ | Tên file không dấu (VD: "tai-nghe-hoco-y30") |
| `goods_id` | Number | ❌ | ID sản phẩm nếu muốn cập nhật luôn |

**Response:**
```json
{
  "error": false,
  "message": "Upload ảnh thành công.",
  "data": {
    "original_img": "images/202412/source_img/tai-nghe-hoco-y30.jpg",
    "goods_img": "images/202412/goods_img/tai-nghe-hoco-y30.webp",
    "goods_thumb": "images/202412/thumb_img/tai-nghe-hoco-y30.webp",
    "full_urls": {
      "original": "https://phukiengiaxuong.com.vn/cdn/images/202412/source_img/tai-nghe-hoco-y30.jpg",
      "goods": "https://phukiengiaxuong.com.vn/cdn/images/202412/goods_img/tai-nghe-hoco-y30.webp",
      "thumb": "https://phukiengiaxuong.com.vn/cdn/images/202412/thumb_img/tai-nghe-hoco-y30.webp"
    }
  },
  "goods_id": 123,
  "product_updated": true
}
```

**Flow sử dụng:**
```
1. Upload ảnh trước (không cần goods_id)
   → Nhận được original_img path
   
2. Tạo sản phẩm với ảnh đã upload
   POST ?action=create_product
   { "original_img": "images/202412/source_img/tai-nghe.jpg", ... }

HOẶC:

1. Upload ảnh + cập nhật sản phẩm cùng lúc
   POST ?action=upload_product_image
   form-data: { image_file, goods_id: 123 }
```

---

## 🗺️ Field Mapping (HRM ↔ PKGX)

> ⚠️ **Lưu ý:** Các mapping này sẽ được cấu hình động trong Settings

| HRM Field | PKGX Field | Ghi chú |
|-----------|------------|---------|
| `pkgxId` | `goods_id` | **Primary Key** - Liên kết chính |
| `id` (SKU) | `goods_sn` | Mã sản phẩm |
| `name` | `goods_name` | Tên sản phẩm |
| `categorySystemId` | `cat_id` | **Cần mapping trong Settings** |
| `brandSystemId` | `brand_id` | **Cần mapping trong Settings** |
| `costPrice` | - | Không đẩy lên web |
| `prices[X]` | `shop_price` | **Chọn bảng giá trong Settings** |
| `prices[Y]` | `market_price` | **Chọn bảng giá trong Settings** |
| `prices[Z]` | `partner_price` | **Chọn bảng giá trong Settings** |
| `Σ inventoryByBranch` | `goods_number` | **Tổng tồn kho tất cả chi nhánh** |
| `description` | `goods_desc` | Mô tả HTML |
| `shortDescription` | `goods_brief` | Mô tả ngắn |
| `ktitle` | `meta_title` | SEO Title |
| `seoDescription` | `meta_desc` | SEO Description |
| `tags` | `keywords` | Keywords (join by ", ") |
| `thumbnailImage` | `original_img` | Ảnh gốc |
| `isFeatured` | `is_best` | Sản phẩm nổi bật |
| `isNewArrival` | `is_new` | Hàng mới về |
| `isPublished` | `is_on_sale` | Đang bán |
| `slug` | `slug` | URL slug |

---

## ⚙️ PKGX Settings Module (MỚI)

### Vị trí trong App - Thêm Card vào Settings Page

**File:** `features/settings/page.tsx`

**Thêm section mới: "Tích hợp bên ngoài"**
```tsx
const integrationSettings: SettingsItem[] = [
  { 
    icon: Globe, // hoặc ExternalLink
    title: 'Website phukiengiaxuong.com.vn', 
    description: 'Đồng bộ sản phẩm, danh mục, thương hiệu với website PKGX', 
    href: '/settings/pkgx',
    badge: 'new' as const,
    iconColor: 'text-rose-600'
  },
];
```

**Vị trí hiển thị:** Sau "Cài đặt vận hành", trước "Cài đặt hệ thống"

### Cấu trúc trang PKGX Settings

**Route:** `/settings/pkgx`

**Tabs:**
| Tab | Nội dung |
|-----|----------|
| **1. Cấu hình chung** | API URL, API Key, Test Connection, Bật/Tắt |
| **2. Danh mục PKGX** | Quản lý danh sách cat_id từ PKGX |
| **3. Thương hiệu PKGX** | Quản lý danh sách brand_id từ PKGX |
| **4. Mapping Danh mục** | HRM Category ↔ PKGX cat_id |
| **5. Mapping Thương hiệu** | HRM Brand ↔ PKGX brand_id |
| **6. Mapping Bảng giá** | HRM Pricing Policy ↔ PKGX price fields |
| **7. Mapping Sản phẩm** | Danh sách SP đã link (có pkgxId) |
| **8. Auto Sync** | Cài đặt đồng bộ tự động |

### 1. Cấu hình chung

| Setting | Type | Mô tả |
|---------|------|-------|
| `pkgxApiUrl` | string | URL API PKGX |
| `pkgxApiKey` | password | API Key (ẩn) |
| `pkgxEnabled` | boolean | Bật/tắt tích hợp |
| `pkgxAutoSync` | boolean | Bật/tắt auto sync |
| `pkgxSyncInterval` | number | Tần suất sync (phút) |
| `pkgxLastSyncAt` | datetime | Thời gian sync cuối |

### 2. Mapping Bảng giá (Pricing Policy → PKGX Price)

```typescript
type PkgxPriceMapping = {
  shopPrice: SystemId | null;      // Bảng giá nào → shop_price
  marketPrice: SystemId | null;    // Bảng giá nào → market_price  
  partnerPrice: SystemId | null;   // Bảng giá nào → partner_price
  acePrice: SystemId | null;       // Bảng giá nào → ace_price
  dealPrice: SystemId | null;      // Bảng giá nào → deal_price
};
```

**UI:** Dropdown chọn từ danh sách PricingPolicy

### 3. Mapping Danh mục (HRM Category → PKGX cat_id)

```typescript
type PkgxCategoryMapping = {
  id: string;
  hrmCategorySystemId: SystemId;   // Category trong HRM
  hrmCategoryName: string;         // Tên hiển thị
  pkgxCatId: number;               // cat_id trên PKGX
  pkgxCatName: string;             // Tên danh mục PKGX
};
```

**Danh sách PKGX Categories (từ idpkgx.xlsx):**
| cat_id | Tên danh mục |
|--------|--------------|
| 382 | Sản phẩm mới |
| 302 | Hàng Theo Loại Bán |
| 413 | Hàng Hot Trend |
| 390 | Hàng Bán Chạy |
| 389 | Hàng Thanh Lý |
| 387 | Hàng Độc Quyền |
| 391 | Hàng bán Sàn TMĐT |
| 388 | Hàng Tặng Kèm |
| 386 | Hàng Chợ |
| 37 | Sỉ tai nghe |
| 315 | Tai nghe Bluetooth TWS |
| 314 | Tai nghe có dây |
| 316 | Tai nghe chụp tai bluetooth |
| 375 | Tai nghe bluetooth 1 bên |
| 376 | Tai nghe bluetooth thể thao |
| 377 | Tai nghe chụp tai Gaming |
| 384 | Case Tai Nghe Bluetooth |

### 4. Mapping Thương hiệu (HRM Brand → PKGX brand_id)

```typescript
type PkgxBrandMapping = {
  id: string;
  hrmBrandSystemId: SystemId;      // Brand trong HRM
  hrmBrandName: string;            // Tên hiển thị
  pkgxBrandId: number;             // brand_id trên PKGX
  pkgxBrandName: string;           // Tên thương hiệu PKGX
};
```

**Danh sách PKGX Brands (từ idpkgx.xlsx):**
| brand_id | Tên thương hiệu |
|----------|-----------------|
| 15 | Hoco |
| 141 | Borofone |
| 138 | Baseus |
| 12 | Wekome |
| 157 | Maxitech |

### 5. Cài đặt Auto Sync

```typescript
type PkgxSyncSettings = {
  enabled: boolean;                 // Bật/tắt auto sync
  intervalMinutes: number;          // 15, 30, 60, 120, 240
  syncInventory: boolean;           // Đồng bộ tồn kho
  syncPrice: boolean;               // Đồng bộ giá
  syncSeo: boolean;                 // Đồng bộ SEO
  syncOnProductUpdate: boolean;     // Sync ngay khi update SP
  notifyOnError: boolean;           // Thông báo khi lỗi
};
```

---

## 🛠️ Implementation Plan (Cập nhật)

### Phase 1: Settings Module (Tuần 1) ⭐ PRIORITY

#### 1.1 Tạo PKGX Settings Store
```
📁 features/settings/pkgx/store.ts
📁 features/settings/pkgx/types.ts
```

#### 1.2 Tạo UI Settings Page
```
📁 features/settings/pkgx/pkgx-settings-page.tsx
📁 features/settings/pkgx/components/
    ├── general-config.tsx        # API URL, Key, Enable/Disable
    ├── price-mapping.tsx         # Map bảng giá
    ├── category-mapping.tsx      # Map danh mục
    ├── brand-mapping.tsx         # Map thương hiệu
    └── sync-settings.tsx         # Cài đặt auto sync
```

#### 1.3 Import PKGX Data
- Import danh sách cat_id, brand_id từ `idpkgx.xlsx`
- Hardcode hoặc cho phép import từ API

### Phase 2: Service Layer (Tuần 2)

#### 2.1 Tạo PKGX API Service
```
📁 lib/pkgx/api-service.ts
```

**Chức năng:**
- `getProducts(page, limit)` - Lấy danh sách SP từ PKGX
- `getProductById(goodsId)` - Lấy chi tiết 1 SP
- `createProduct(data)` - Tạo SP mới
- `updateProduct(goodsId, data)` - Cập nhật SP
- `updatePrice(goodsId, prices)` - Cập nhật giá
- `updateSeo(goodsId, seoData)` - Cập nhật SEO

#### 2.2 Tạo Mapping Service (đọc từ Settings)
```
📁 lib/pkgx/mapping-service.ts
```

**Chức năng:**
- `mapHrmToPkgx(product)` - Chuyển đổi HRM → PKGX format
- `mapPkgxToHrm(pkgxProduct)` - Chuyển đổi PKGX → HRM format
- `getCategoryMapping(hrmCategoryId)` - Lấy cat_id từ mapping
- `getBrandMapping(hrmBrandId)` - Lấy brand_id từ mapping
- `getPriceByMapping(product, priceType)` - Lấy giá theo mapping

### Phase 3: UI Actions (Tuần 3)

#### 3.1 Cập nhật giá PKGX
Khi click "Cập nhật giá PKGX":
1. Check `pkgxId` có tồn tại không
2. Đọc price mapping từ Settings
3. Gọi `updateProduct(pkgxId, { shop_price, market_price, ... })`
4. Cập nhật `pkgxSyncedAt` trong product

#### 3.2 Đăng sản phẩm PKGX
Khi click "Đăng sản phẩm PKGX":
1. Check `pkgxId` đã có chưa
2. Đọc tất cả mapping từ Settings
3. Nếu chưa → `createProduct(mappedData)` → Lưu `goods_id` vào `pkgxId`
4. Nếu có → `updateProduct(pkgxId, mappedData)`

#### 3.3 Cập nhật SEO PKGX
Khi click "Cập nhật SEO PKGX":
1. Check `pkgxId`
2. Gọi `updateProduct(pkgxId, { meta_title, meta_desc, keywords })`

### Phase 4: Auto Sync Service (Tuần 4)

#### 4.1 Sync Service
```
📁 lib/pkgx/sync-service.ts
```

**Tính năng:**
- Chạy theo interval từ Settings
- Sync tồn kho (tổng tất cả chi nhánh)
- Sync giá (theo mapping)
- Sync SEO (nếu bật)
- Logging & Error handling
- Bật/tắt từ Settings

#### 4.2 Sync Dashboard
- Hiển thị trạng thái sync
- Lịch sử sync
- Thống kê lỗi
- Manual trigger sync

### Phase 5: Bulk Operations (Tuần 5)

#### 5.1 Bulk Actions từ Product List
- Checkbox chọn nhiều sản phẩm
- "Đăng hàng loạt lên PKGX"
- "Cập nhật giá hàng loạt"
- "Cập nhật tồn kho hàng loạt"

#### 5.2 Import/Export
- Import products từ PKGX về HRM
- Báo cáo sản phẩm chưa được link

---

## 📝 Database Changes

### Product Schema Update
```typescript
// Thêm vào Product type (đã có sẵn)
pkgxId?: number | undefined; // ✅ Đã có

// Cân nhắc thêm:
pkgxSlug?: string | undefined; // Slug trên PKGX
pkgxSyncedAt?: string | undefined; // Lần sync cuối
pkgxSyncStatus?: 'synced' | 'pending' | 'error' | undefined;
pkgxSyncError?: string | undefined; // Lỗi sync gần nhất
```

### PKGX Settings Schema (MỚI)
```typescript
type PkgxSettings = {
  // General
  apiUrl: string;
  apiKey: string;
  enabled: boolean;
  
  // Price Mapping
  priceMapping: {
    shopPrice: SystemId | null;
    marketPrice: SystemId | null;
    partnerPrice: SystemId | null;
    acePrice: SystemId | null;
    dealPrice: SystemId | null;
  };
  
  // Category Mapping
  categoryMappings: Array<{
    id: string;
    hrmCategorySystemId: SystemId;
    pkgxCatId: number;
    pkgxCatName: string;
  }>;
  
  // Brand Mapping
  brandMappings: Array<{
    id: string;
    hrmBrandSystemId: SystemId;
    pkgxBrandId: number;
    pkgxBrandName: string;
  }>;
  
  // Sync Settings
  syncSettings: {
    enabled: boolean;
    intervalMinutes: number;
    syncInventory: boolean;
    syncPrice: boolean;
    syncSeo: boolean;
    syncOnProductUpdate: boolean;
    notifyOnError: boolean;
  };
  
  // Status
  lastSyncAt?: string;
  lastSyncResult?: 'success' | 'partial' | 'error';
  lastSyncStats?: {
    total: number;
    success: number;
    failed: number;
  };
};
```

### PKGX Reference Data (Hardcoded hoặc API)
```typescript
// Danh sách danh mục PKGX
const PKGX_CATEGORIES = [
  { id: 382, name: "Sản phẩm mới" },
  { id: 302, name: "Hàng Theo Loại Bán" },
  { id: 413, name: "Hàng Hot Trend" },
  { id: 390, name: "Hàng Bán Chạy" },
  { id: 389, name: "Hàng Thanh Lý" },
  { id: 387, name: "Hàng Độc Quyền" },
  { id: 391, name: "Hàng bán Sàn TMĐT" },
  { id: 388, name: "Hàng Tặng Kèm" },
  { id: 386, name: "Hàng Chợ" },
  { id: 37, name: "Sỉ tai nghe" },
  { id: 315, name: "Tai nghe Bluetooth TWS" },
  { id: 314, name: "Tai nghe có dây" },
  { id: 316, name: "Tai nghe chụp tai bluetooth" },
  { id: 375, name: "Tai nghe bluetooth 1 bên" },
  { id: 376, name: "Tai nghe bluetooth thể thao" },
  { id: 377, name: "Tai nghe chụp tai Gaming" },
  { id: 384, name: "Case Tai Nghe Bluetooth" },
  // ... thêm từ file idpkgx.xlsx
];

// Danh sách thương hiệu PKGX
const PKGX_BRANDS = [
  { id: 15, name: "Hoco" },
  { id: 141, name: "Borofone" },
  { id: 138, name: "Baseus" },
  { id: 12, name: "Wekome" },
  { id: 157, name: "Maxitech" },
  // ... thêm từ file idpkgx.xlsx
];
```

---

## 🔒 Security Considerations

1. **API Key:** Lưu trong `.env`, không commit vào git
2. **CORS:** API PKGX cần whitelist IP của HRM server
3. **Rate Limiting:** Max 60 requests/minute
4. **Error Handling:** Retry logic với exponential backoff

---

## 📊 Success Metrics

| KPI | Target |
|-----|--------|
| Sync success rate | > 99% |
| Sync latency | < 5s per product |
| API error rate | < 1% |
| Data consistency | 100% |

---

## 🎨 UI Mockup - PKGX Settings Page

### Layout chính
```
┌─────────────────────────────────────────────────────────────────┐
│ 🌐 Website phukiengiaxuong.com.vn                               │
├─────────────────────────────────────────────────────────────────┤
│ [Cấu hình] [Danh mục] [Thương hiệu] [Mapping DM] [Mapping TH]   │
│ [Mapping Giá] [Mapping SP] [Auto Sync]                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  (Nội dung tab được chọn)                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Tab 1: Cấu hình chung
```
┌─────────────────────────────────────────────────────────┐
│ ⚙️ Cấu hình kết nối API                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🔗 Thông tin API                                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ API URL:  [https://phukiengiaxuong.com.vn/admin/... ]│
│ │ API Key:  [••••••••••••••••••••••] 👁️               │
│ │ [✓] Bật tích hợp PKGX                               │
│ │                                                      │
│ │ Trạng thái: 🟢 Đã kết nối                           │
│ │ [🔄 Test Connection]                                 │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ 📊 Thống kê                                             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Sản phẩm đã link:     150 / 500 (30%)               │ │
│ │ Danh mục đã mapping:  12 / 15                       │ │
│ │ Thương hiệu đã mapping: 5 / 5                       │ │
│ │ Lần sync cuối: 13/12/2024 15:30:45                  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│                              [Lưu cấu hình]             │
└─────────────────────────────────────────────────────────┘
```

### Tab 2: Danh mục PKGX (CRUD)
```
┌─────────────────────────────────────────────────────────┐
│ 📁 Danh sách danh mục PKGX                              │
├─────────────────────────────────────────────────────────┤
│ [+ Thêm danh mục] [📥 Import Excel]   🔍 Tìm kiếm...   │
│                                                         │
│  ID    │  Tên danh mục              │  Hành động       │
│ ───────┼────────────────────────────┼───────────────── │
│  382   │  Sản phẩm mới              │  ✏️ 🗑️          │
│  302   │  Hàng Theo Loại Bán        │  ✏️ 🗑️          │
│  413   │  Hàng Hot Trend            │  ✏️ 🗑️          │
│  390   │  Hàng Bán Chạy             │  ✏️ 🗑️          │
│  315   │  Tai nghe Bluetooth TWS    │  ✏️ 🗑️          │
│  ...   │  ...                       │  ...             │
│                                                         │
│ 💡 Import từ file idpkgx.xlsx hoặc thêm thủ công       │
└─────────────────────────────────────────────────────────┘
```

### Tab 3: Thương hiệu PKGX (CRUD)
```
┌─────────────────────────────────────────────────────────┐
│ 🏷️ Danh sách thương hiệu PKGX                           │
├─────────────────────────────────────────────────────────┤
│ [+ Thêm thương hiệu] [📥 Import Excel]  🔍 Tìm kiếm... │
│                                                         │
│  ID    │  Tên thương hiệu           │  Hành động       │
│ ───────┼────────────────────────────┼───────────────── │
│  15    │  Hoco                      │  ✏️ 🗑️          │
│  141   │  Borofone                  │  ✏️ 🗑️          │
│  138   │  Baseus                    │  ✏️ 🗑️          │
│  12    │  Wekome                    │  ✏️ 🗑️          │
│  157   │  Maxitech                  │  ✏️ 🗑️          │
│                                                         │
│ 💡 Import từ file idpkgx.xlsx hoặc thêm thủ công       │
└─────────────────────────────────────────────────────────┘
```

### Tab 4: Mapping Danh mục
```
┌─────────────────────────────────────────────────────────┐
│ 🔗 Mapping Danh mục HRM → PKGX                          │
├─────────────────────────────────────────────────────────┤
│ [+ Thêm mapping]                     🔍 Tìm kiếm...     │
│                                                         │
│  Danh mục HRM          │  Danh mục PKGX        │ 🗑️    │
│ ───────────────────────┼───────────────────────┼─────── │
│  [Tai nghe TWS ▼]      │  [315 - Tai nghe BT ▼]│  🗑️   │
│  [Tai nghe có dây ▼]   │  [314 - Tai nghe dây ▼]│ 🗑️   │
│  [+ Thêm dòng mới]                                      │
│                                                         │
│ ⚠️ 3 danh mục HRM chưa được mapping                     │
│                              [Lưu mapping]              │
└─────────────────────────────────────────────────────────┘
```

### Tab 5: Mapping Thương hiệu
```
┌─────────────────────────────────────────────────────────┐
│ 🔗 Mapping Thương hiệu HRM → PKGX                       │
├─────────────────────────────────────────────────────────┤
│ [+ Thêm mapping]                     🔍 Tìm kiếm...     │
│                                                         │
│  Thương hiệu HRM       │  Thương hiệu PKGX     │ 🗑️    │
│ ───────────────────────┼───────────────────────┼─────── │
│  [Hoco ▼]              │  [15 - Hoco ▼]        │  🗑️   │
│  [Borofone ▼]          │  [141 - Borofone ▼]   │  🗑️   │
│  [+ Thêm dòng mới]                                      │
│                                                         │
│ ✅ Tất cả thương hiệu đã được mapping                   │
│                              [Lưu mapping]              │
└─────────────────────────────────────────────────────────┘
```

### Tab 6: Mapping Bảng giá
```
┌─────────────────────────────────────────────────────────┐
│ 💰 Mapping Bảng giá HRM → PKGX                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Loại giá PKGX     │  Bảng giá HRM                      │
│ ───────────────────┼───────────────────────────────────── │
│  shop_price        │  [Giá bán lẻ ▼]                    │
│  market_price      │  [Giá niêm yết ▼]                  │
│  partner_price     │  [Giá đối tác ▼]                   │
│  ace_price         │  [Giá ACE ▼]                       │
│  deal_price        │  [-- Không áp dụng -- ▼]           │
│                                                         │
│ 💡 Chọn bảng giá tương ứng cho mỗi loại giá PKGX       │
│                              [Lưu mapping]              │
└─────────────────────────────────────────────────────────┘
```

### Tab 7: Mapping Sản phẩm
```
┌─────────────────────────────────────────────────────────┐
│ 📦 Danh sách sản phẩm đã link với PKGX                  │
├─────────────────────────────────────────────────────────┤
│ [🔄 Sync từ PKGX]                    🔍 Tìm kiếm...     │
│ [Lọc: Tất cả ▼] [Đã link ▼] [Chưa link ▼]              │
│                                                         │
│  SKU     │  Tên SP HRM      │ PKGX ID │ Slug   │ Sync  │
│ ─────────┼──────────────────┼─────────┼────────┼────── │
│  SP001   │  Tai nghe Hoco   │  1234   │ tai-ng │ ✅    │
│  SP002   │  Cáp sạc Type-C  │  1235   │ cap-sa │ ✅    │
│  SP003   │  Ốp lưng iPhone  │  -      │ -      │ ⚠️    │
│                                                         │
│ 📊 150/500 sản phẩm đã được link (30%)                 │
│ [Link hàng loạt] [Unlink đã chọn]                       │
└─────────────────────────────────────────────────────────┘
```

### Tab 8: Auto Sync
```
┌─────────────────────────────────────────────────────────┐
│ 🔄 Cài đặt đồng bộ tự động                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ⏰ Lịch đồng bộ                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [✓] Bật Auto Sync                                   │ │
│ │ Tần suất: [30 phút ▼]  (15, 30, 60, 120, 240)       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ 📋 Loại dữ liệu đồng bộ                                 │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [✓] Đồng bộ tồn kho                                 │ │
│ │ [✓] Đồng bộ giá                                     │ │
│ │ [ ] Đồng bộ SEO (meta_title, meta_desc, keywords)   │ │
│ │ [✓] Sync ngay khi cập nhật sản phẩm trong HRM      │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ 🔔 Thông báo                                            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [✓] Thông báo khi có lỗi sync                       │ │
│ │ [ ] Thông báo khi sync thành công                   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ 📊 Trạng thái                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Lần sync cuối: 13/12/2024 15:30:45                  │ │
│ │ Kết quả: ✅ Thành công (150/150 sản phẩm)           │ │
│ │ Tiếp theo: 13/12/2024 16:00:00                      │ │
│ │                                                      │
│ │ [▶️ Sync ngay] [📜 Xem log] [⏸️ Tạm dừng]           │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│                              [Lưu cài đặt]              │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Next Steps (Ưu tiên)

### Tuần 1: Settings Module (FIRST PRIORITY)
1. [x] Xác nhận API URL: `https://phukiengiaxuong.com.vn/admin/api_product_pro.php`
2. [x] Lấy danh sách cat_id, brand_id từ `idpkgx.xlsx`
3. [x] Xác nhận: Đẩy tổng tồn kho (không theo chi nhánh)
4. [x] Xác nhận: Cần setting bật/tắt auto sync
5. [ ] Tạo `features/settings/pkgx/types.ts`
6. [ ] Tạo `features/settings/pkgx/store.ts`
7. [ ] Tạo `features/settings/pkgx/constants.ts` (PKGX_CATEGORIES, PKGX_BRANDS)
8. [ ] Tạo UI Settings Page với 4 tabs

### Tuần 2: API & Mapping Service
9. [ ] Tạo `lib/pkgx/types.ts`
10. [ ] Tạo `lib/pkgx/api-service.ts`
11. [ ] Tạo `lib/pkgx/mapping-service.ts`
12. [ ] Test API với Postman/Insomnia

### Tuần 3: UI Actions
13. [ ] Implement `handlePkgxUpdatePrice`
14. [ ] Implement `handlePkgxPublish`
15. [ ] Implement `handlePkgxUpdateSeo`
16. [ ] Thêm field `pkgxSyncedAt`, `pkgxSyncStatus` vào Product

### Tuần 4: Auto Sync
17. [ ] Tạo `lib/pkgx/sync-service.ts`
18. [ ] Integrate với Settings để bật/tắt
19. [ ] Tạo Sync Dashboard

### Tuần 5: Bulk Operations
20. [ ] Bulk publish to PKGX
21. [ ] Bulk update price
22. [ ] Bulk update inventory

---

## 📞 Câu hỏi bổ sung (Đã trả lời ✅)

| # | Câu hỏi | Trả lời |
|---|---------|---------|
| 1 | API URL? | ✅ `https://phukiengiaxuong.com.vn/admin/api_product_pro.php` |
| 2 | Có danh sách cat_id, brand_id? | ✅ Có, tại `docs/file/idpkgx.xlsx` |
| 3 | Mapping giá thế nào? | ✅ Tạo setting để anh tự chủ động mapping |
| 4 | Tồn kho đẩy gì? | ✅ Tổng tồn kho tất cả chi nhánh |
| 5 | Auto sync? | ✅ Có, với setting bật/tắt |

---

## 💡 Tư vấn thêm cho anh

### 1. Về việc quản lý ảnh sản phẩm ❌ KHÔNG HỖ TRỢ UPLOAD QUA API

**Phân tích API hiện tại:**
```php
$original_img_path = isset($data['original_img']) ? trim($data['original_img']) : '';
// ...
if (!empty($original_img_path) && file_exists(ROOT_PATH . $original_img_path)) {
    // API yêu cầu ảnh đã có sẵn trên server
}
```

**Kết luận:** API hiện tại **KHÔNG** hỗ trợ upload ảnh trực tiếp. Ảnh phải có sẵn trên server PKGX.

**Giải pháp đề xuất:**
| Option | Mô tả | Độ phức tạp |
|--------|-------|-------------|
| **A. Tạo API upload riêng** | Thêm endpoint `?action=upload_image` vào `api_product_pro.php` | Cao |
| **B. FTP/SFTP Upload** | Upload ảnh qua FTP trước khi gọi API | Trung bình |
| **C. Dùng ảnh URL ngoài** | Sửa API để nhận URL và download về | Trung bình |
| **D. Không sync ảnh** | Chỉ sync text data, ảnh tự upload trên PKGX | Thấp |

**Đề xuất:** Option A hoặc B - Em có thể giúp anh viết thêm API upload ảnh nếu cần.

### 2. Về Slug sản phẩm ✅ CÓ THỂ LƯU

**API Response khi tạo/cập nhật:**
```json
{
  "error": false,
  "message": "Sản phẩm đã được tạo thành công.",
  "goods_id": 123,
  "created_slug": "ao-so-mi-nam-trang-oxford"  // ← Trả về slug
}
```

**Mapping:**
- Khi `create_product` → Lưu `created_slug` vào `product.pkgxSlug`
- Khi `update_product` (nếu đổi tên) → Lưu `updated_slug` vào `product.pkgxSlug`
- URL format: `https://phukiengiaxuong.com.vn/{slug}-{goods_id}.html`

### 3. Về Master data ✅ OK
- **HRM làm master** → Mọi thay đổi từ HRM đẩy sang PKGX
- Không sync ngược từ PKGX về HRM (trừ khi import thủ công)

### 4. Về error handling ✅ OK
- Retry 3 lần với exponential backoff (1s, 2s, 4s)
- Log errors vào localStorage/IndexedDB
- Toast notification khi lỗi
- Optional: Email notification cho admin

### 5. Về performance ✅ OK
- Batch API: Gọi tuần tự với delay 200ms giữa các request
- Rate limiting: Max 60 requests/minute (1 request/giây)
- Queue system cho bulk operations

### 6. Về bảo mật ✅ OK
- API Key lưu trong Settings store (Zustand persist)
- Masked display trong UI (••••••••)
- HTTPS only (đã có trên domain PKGX)

---

**Anh xác nhận để em bắt đầu code Phase 1 (Settings Module) nhé!** 🚀

---

## 📁 File Structure (Final)

```
features/settings/pkgx/
├── types.ts                        # PKGX Settings types
├── store.ts                        # Zustand store (pkgxSettings)
├── constants.ts                    # Default PKGX_CATEGORIES, PKGX_BRANDS
├── pkgx-settings-page.tsx          # Main page với 8 tabs
└── components/
    ├── tabs/
    │   ├── general-config-tab.tsx      # Tab 1: API config
    │   ├── pkgx-categories-tab.tsx     # Tab 2: CRUD danh mục PKGX
    │   ├── pkgx-brands-tab.tsx         # Tab 3: CRUD thương hiệu PKGX
    │   ├── category-mapping-tab.tsx    # Tab 4: Mapping danh mục
    │   ├── brand-mapping-tab.tsx       # Tab 5: Mapping thương hiệu
    │   ├── price-mapping-tab.tsx       # Tab 6: Mapping bảng giá
    │   ├── product-mapping-tab.tsx     # Tab 7: Danh sách SP linked
    │   └── auto-sync-tab.tsx           # Tab 8: Cài đặt auto sync
    ├── pkgx-category-form.tsx          # Form thêm/sửa danh mục
    ├── pkgx-brand-form.tsx             # Form thêm/sửa thương hiệu
    ├── mapping-row.tsx                 # Row component cho mapping
    └── sync-status-card.tsx            # Card hiển thị trạng thái sync

lib/pkgx/
├── types.ts                        # PKGX API types
├── api-service.ts                  # API calls to PKGX
├── mapping-service.ts              # Data transformation (reads from Settings)
└── sync-service.ts                 # Auto sync service

features/products/
├── hooks/
│   └── use-pkgx-actions.ts         # Custom hook for PKGX actions
└── components/
    ├── pkgx-publish-dialog.tsx     # Dialog khi đăng SP
    └── pkgx-sync-status.tsx        # Hiển thị trạng thái sync
```

---

## 🔄 Cập nhật Settings Page

**File:** `features/settings/page.tsx`

**Thêm import:**
```tsx
import { Globe } from 'lucide-react';
```

**Thêm section mới:**
```tsx
const integrationSettings: SettingsItem[] = [
  { 
    icon: Globe, 
    title: 'Website phukiengiaxuong.com.vn', 
    description: 'Đồng bộ sản phẩm, danh mục, thương hiệu với website PKGX', 
    href: '/settings/pkgx',
    badge: 'new' as const,
    iconColor: 'text-rose-600'
  },
];

// Thêm vào settingsSections
{
  id: 'integration',
  label: 'Tích hợp bên ngoài',
  description: 'Kết nối với các hệ thống và website bên ngoài',
  accentClass: 'bg-rose-600',
  items: integrationSettings,
},
```
