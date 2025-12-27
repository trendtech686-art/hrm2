# Multi-Website SEO Architecture

## Tổng quan

Hệ thống HRM hỗ trợ tích hợp với nhiều website khác nhau (PKGX, Trendtech, ...). Mỗi entity (Product, Category, Brand) có thể có SEO data riêng cho từng website.

## Cấu trúc dữ liệu

### 1. WebsiteSeoData (SEO cho 1 website)

```typescript
interface WebsiteSeoData {
  seoTitle?: string;          // Title tag cho SEO
  metaDescription?: string;   // Meta description
  seoKeywords?: string;       // Keywords (comma separated)
  shortDescription?: string;  // Mô tả ngắn (1-2 câu)
  longDescription?: string;   // Mô tả chi tiết (HTML)
  slug?: string;              // URL slug cho website này
}
```

### 2. MultiWebsiteSeo (SEO cho nhiều website)

```typescript
// Key là website code: 'pkgx' | 'trendtech' | ...
type MultiWebsiteSeo = Record<string, WebsiteSeoData>;
```

## Website Definitions

### Danh sách website được định nghĩa

| Code | Name | Platform | Status |
|------|------|----------|--------|
| `pkgx` | Phụ kiện giá xưởng | ECShop | ✅ Active |
| `trendtech` | Trendtech | Custom | ✅ Active (Coming soon) |

### File: `features/settings/websites/types.ts`

## UI đã triển khai

### 1. Brand Form (`features/settings/inventory/brand-form-dialog.tsx`)
- **Tab "Thông tin chung"**: Mã, tên, website, mô tả, trạng thái
- **Tab "SEO PKGX"**: seoTitle, metaDescription, seoKeywords, shortDescription, longDescription
- **Tab "SEO Trendtech"**: seoTitle, metaDescription, seoKeywords, shortDescription, longDescription

### 2. Category Form (`features/settings/inventory/category-manager.tsx`)
- **Tab "Thông tin"**: Tên, slug, danh mục cha, thứ tự, ảnh đại diện
- **Tab "SEO chung"**: Tiêu đề SEO, meta description, mô tả ngắn, mô tả dài
- **Tab "PKGX"**: SEO riêng cho phukiengiaxuong.com.vn
- **Tab "Trendtech"**: SEO riêng cho Trendtech

### 3. Product Form (`features/products/product-form-complete.tsx`)
- **Tab "SEO chung"**: Tiêu đề SEO, mô tả ngắn, mô tả chi tiết (default)
- **Tab "PKGX"**: SEO riêng cho phukiengiaxuong.com.vn
- **Tab "Trendtech"**: SEO riêng cho Trendtech

## Workflow đồng bộ SEO

### Push SEO từ HRM → Website

1. **Ưu tiên 1**: Lấy từ `websiteSeo[websiteCode]` nếu có
2. **Ưu tiên 2**: Fallback về SEO mặc định (ktitle, seoDescription, ...)

```typescript
function getSeoForWebsite(product: Product, websiteCode: string): WebsiteSeoData {
  // Ưu tiên SEO riêng của website
  if (product.websiteSeo?.[websiteCode]) {
    return product.websiteSeo[websiteCode];
  }
  
  // Fallback về SEO mặc định
  return {
    seoTitle: product.ktitle,
    metaDescription: product.seoDescription,
    seoKeywords: product.seoKeywords,
    shortDescription: product.shortDescription,
    longDescription: product.description,
  };
}
```

## Checklist hoàn thành

- [x] Tạo types cho WebsiteSeoData, MultiWebsiteSeo
- [x] Cập nhật Product types với websiteSeo
- [x] Cập nhật ProductCategory types với websiteSeo  
- [x] Cập nhật Brand types với SEO fields + websiteSeo
- [x] Tạo WebsiteDefinition types (PKGX, Trendtech)
- [x] UI: Brand form với tabs SEO theo website
- [x] UI: Category form với tabs SEO theo website
- [x] UI: Product form với tabs SEO theo website
- [ ] API: Cập nhật logic push/pull SEO cho PKGX
- [ ] Trendtech integration (khi có API)
