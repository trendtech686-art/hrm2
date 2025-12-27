# Hướng dẫn cập nhật API PHP để hỗ trợ SEO cho Brand và Category

## Bước 1: Cập nhật hàm `update_category`

Tìm hàm `update_category` trong file `api_product_hrm.php` và **thay thế toàn bộ** bằng code sau:

```php
/**
 * Cập nhật thông tin danh mục (SEO, mô tả)
 * URL: POST ?action=update_category&cat_id=123
 * Body JSON: { cat_name, cat_desc, keywords, cat_alias, meta_title, meta_desc, short_desc, style, sort_order }
 * 
 * FIELDS MỚI:
 * - meta_title: Tiêu đề SEO
 * - meta_desc: Mô tả SEO  
 * - short_desc: Mô tả ngắn
 */
function update_category($cat_id, $data)
{
    global $db, $ecs;
    
    $cat_id = intval($cat_id);
    if ($cat_id <= 0) {
        send_json_response(['error' => true, 'message' => "ID danh mục không hợp lệ."], 400);
        return;
    }
    
    // Kiểm tra danh mục tồn tại
    $category = $db->getRow("SELECT cat_id FROM " . $ecs->table('category') . " WHERE cat_id = '$cat_id'");
    if (!$category) {
        send_json_response(['error' => true, 'message' => "Danh mục với ID '$cat_id' không tồn tại."], 404);
        return;
    }
    
    if (empty($data)) {
        send_json_response(['error' => false, 'message' => 'Không có dữ liệu nào được gửi để cập nhật.', 'cat_id' => $cat_id], 200);
        return;
    }
    
    try {
        $update_fields = [];
        
        // Các trường có thể cập nhật
        if (isset($data['cat_name']) && !empty($data['cat_name'])) {
            $update_fields[] = "cat_name = '" . addslashes(trim($data['cat_name'])) . "'";
        }
        if (isset($data['cat_desc'])) {
            $update_fields[] = "cat_desc = '" . addslashes(trim($data['cat_desc'])) . "'";
        }
        if (isset($data['keywords'])) {
            $update_fields[] = "keywords = '" . addslashes(trim($data['keywords'])) . "'";
        }
        if (isset($data['cat_alias'])) {
            $update_fields[] = "cat_alias = '" . addslashes(trim($data['cat_alias'])) . "'";
        }
        if (isset($data['style'])) {
            $update_fields[] = "style = '" . addslashes(trim($data['style'])) . "'";
        }
        if (isset($data['sort_order'])) {
            $update_fields[] = "sort_order = '" . intval($data['sort_order']) . "'";
        }
        
        // === SEO FIELDS MỚI ===
        if (isset($data['meta_title'])) {
            $update_fields[] = "meta_title = '" . addslashes(trim($data['meta_title'])) . "'";
        }
        if (isset($data['meta_desc'])) {
            $update_fields[] = "meta_desc = '" . addslashes(trim($data['meta_desc'])) . "'";
        }
        if (isset($data['short_desc'])) {
            $update_fields[] = "short_desc = '" . addslashes(trim($data['short_desc'])) . "'";
        }
        
        if (!empty($update_fields)) {
            $sql = "UPDATE " . $ecs->table('category') . " SET " . implode(', ', $update_fields) . " WHERE cat_id = '$cat_id'";
            $db->query($sql);
        }
        
        clear_cache_files();
        
        send_json_response([
            'error' => false,
            'message' => 'Cập nhật danh mục thành công.',
            'cat_id' => $cat_id
        ], 200);
        
    } catch (Exception $e) {
        send_json_response(['error' => true, 'message' => $e->getMessage()], 500);
    }
}
```

## Bước 2: Cập nhật hàm `update_brand`

Tìm hàm `update_brand` trong file `api_product_hrm.php` và **thay thế toàn bộ** bằng code sau:

```php
/**
 * Cập nhật thông tin thương hiệu (SEO, mô tả)
 * URL: POST ?action=update_brand&brand_id=123
 * Body JSON: { brand_name, brand_desc, site_url, keywords, meta_title, meta_desc, short_desc, sort_order }
 * 
 * FIELDS MỚI:
 * - keywords: Từ khóa SEO
 * - meta_title: Tiêu đề SEO
 * - meta_desc: Mô tả SEO
 * - short_desc: Mô tả ngắn
 */
function update_brand($brand_id, $data)
{
    global $db, $ecs;
    
    $brand_id = intval($brand_id);
    if ($brand_id <= 0) {
        send_json_response(['error' => true, 'message' => "ID thương hiệu không hợp lệ."], 400);
        return;
    }
    
    // Kiểm tra thương hiệu tồn tại
    $brand = $db->getRow("SELECT brand_id FROM " . $ecs->table('brand') . " WHERE brand_id = '$brand_id'");
    if (!$brand) {
        send_json_response(['error' => true, 'message' => "Thương hiệu với ID '$brand_id' không tồn tại."], 404);
        return;
    }
    
    if (empty($data)) {
        send_json_response(['error' => false, 'message' => 'Không có dữ liệu nào được gửi để cập nhật.', 'brand_id' => $brand_id], 200);
        return;
    }
    
    try {
        $update_fields = [];
        
        // Các trường có thể cập nhật - HIỆN TẠI
        if (isset($data['brand_name']) && !empty($data['brand_name'])) {
            $update_fields[] = "brand_name = '" . addslashes(trim($data['brand_name'])) . "'";
        }
        if (isset($data['brand_desc'])) {
            $update_fields[] = "brand_desc = '" . addslashes(trim($data['brand_desc'])) . "'";
        }
        if (isset($data['site_url'])) {
            $update_fields[] = "site_url = '" . addslashes(trim($data['site_url'])) . "'";
        }
        if (isset($data['sort_order'])) {
            $update_fields[] = "sort_order = '" . intval($data['sort_order']) . "'";
        }
        
        // === SEO FIELDS MỚI ===
        if (isset($data['keywords'])) {
            $update_fields[] = "brand_keyword = '" . addslashes(trim($data['keywords'])) . "'";
        }
        if (isset($data['meta_title'])) {
            $update_fields[] = "meta_title = '" . addslashes(trim($data['meta_title'])) . "'";
        }
        if (isset($data['meta_desc'])) {
            $update_fields[] = "meta_desc = '" . addslashes(trim($data['meta_desc'])) . "'";
        }
        if (isset($data['short_desc'])) {
            $update_fields[] = "short_desc = '" . addslashes(trim($data['short_desc'])) . "'";
        }
        
        if (!empty($update_fields)) {
            $sql = "UPDATE " . $ecs->table('brand') . " SET " . implode(', ', $update_fields) . " WHERE brand_id = '$brand_id'";
            $db->query($sql);
        }
        
        clear_cache_files();
        
        send_json_response([
            'error' => false,
            'message' => 'Cập nhật thương hiệu thành công.',
            'brand_id' => $brand_id
        ], 200);
        
    } catch (Exception $e) {
        send_json_response(['error' => true, 'message' => $e->getMessage()], 500);
    }
}
```

## Bước 3: Kiểm tra cột trong database

Trước khi sử dụng, hãy kiểm tra xem database đã có các cột SEO chưa. Nếu chưa, chạy các SQL sau:

### Thêm cột cho bảng `ecs_category`:
```sql
-- Kiểm tra và thêm cột meta_title nếu chưa có
ALTER TABLE ecs_category ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255) DEFAULT '' AFTER keywords;

-- Kiểm tra và thêm cột meta_desc nếu chưa có
ALTER TABLE ecs_category ADD COLUMN IF NOT EXISTS meta_desc TEXT AFTER meta_title;

-- Kiểm tra và thêm cột short_desc nếu chưa có
ALTER TABLE ecs_category ADD COLUMN IF NOT EXISTS short_desc TEXT AFTER meta_desc;
```

### Thêm cột cho bảng `ecs_brand`:
```sql
-- Kiểm tra và thêm cột brand_keyword nếu chưa có
ALTER TABLE ecs_brand ADD COLUMN IF NOT EXISTS brand_keyword VARCHAR(255) DEFAULT '' AFTER brand_desc;

-- Kiểm tra và thêm cột meta_title nếu chưa có
ALTER TABLE ecs_brand ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255) DEFAULT '' AFTER brand_keyword;

-- Kiểm tra và thêm cột meta_desc nếu chưa có
ALTER TABLE ecs_brand ADD COLUMN IF NOT EXISTS meta_desc TEXT AFTER meta_title;

-- Kiểm tra và thêm cột short_desc nếu chưa có
ALTER TABLE ecs_brand ADD COLUMN IF NOT EXISTS short_desc TEXT AFTER meta_desc;
```

## Bước 4: Test API

### Test update_category:
```bash
curl -X POST "https://phukiengiaxuong.com.vn/admin/api_product_hrm.php?action=update_category&cat_id=123" \
  -H "X-API-KEY: a91f2c47e5d8b6f03a7c4e9d12f0b8a6" \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": "từ khóa seo danh mục",
    "meta_title": "Tiêu đề SEO danh mục",
    "meta_desc": "Mô tả SEO danh mục",
    "short_desc": "Mô tả ngắn danh mục"
  }'
```

### Test update_brand:
```bash
curl -X POST "https://phukiengiaxuong.com.vn/admin/api_product_hrm.php?action=update_brand&brand_id=123" \
  -H "X-API-KEY: a91f2c47e5d8b6f03a7c4e9d12f0b8a6" \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": "từ khóa seo thương hiệu",
    "meta_title": "Tiêu đề SEO thương hiệu",
    "meta_desc": "Mô tả SEO thương hiệu",
    "short_desc": "Mô tả ngắn thương hiệu"
  }'
```

## Lưu ý quan trọng

1. **Brand keyword**: ECShop dùng field `brand_keyword` thay vì `keywords` cho thương hiệu
2. **Category keywords**: ECShop đã có sẵn field `keywords` trong bảng category
3. **Backup trước khi thay đổi**: Luôn backup database và file PHP trước khi thay đổi
4. **Clear cache**: Hàm `clear_cache_files()` được gọi sau mỗi update để xóa cache
