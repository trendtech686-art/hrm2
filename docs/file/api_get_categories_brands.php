/**
 * =====================================================
 * THÊM VÀO FILE: api_product_pro.php
 * Vị trí: Trong switch($action), thêm 2 case sau:
 * =====================================================
 */

// ==========================================
// ACTION: get_categories - Lấy danh sách danh mục
// URL: ?action=get_categories
// ==========================================
case 'get_categories':
    try {
        $sql = "SELECT 
                    cat_id,
                    cat_name,
                    parent_id,
                    sort_order,
                    is_show
                FROM " . $ecs->table('category') . "
                WHERE is_show = 1
                ORDER BY parent_id ASC, sort_order ASC, cat_id ASC";
        
        $result = $db->getAll($sql);
        
        if ($result === false) {
            throw new Exception("Lỗi truy vấn database");
        }
        
        // Build hierarchy
        $categories = [];
        foreach ($result as $row) {
            $categories[] = [
                'cat_id' => (int)$row['cat_id'],
                'cat_name' => $row['cat_name'],
                'parent_id' => (int)$row['parent_id'],
                'sort_order' => (int)$row['sort_order'],
            ];
        }
        
        echo json_encode([
            'error' => false,
            'message' => 'Lấy danh sách danh mục thành công.',
            'total' => count($categories),
            'data' => $categories
        ], JSON_UNESCAPED_UNICODE);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => true,
            'message' => 'Lỗi server: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
    break;

// ==========================================
// ACTION: get_brands - Lấy danh sách thương hiệu
// URL: ?action=get_brands
// ==========================================
case 'get_brands':
    try {
        $sql = "SELECT 
                    brand_id,
                    brand_name,
                    brand_logo,
                    brand_desc,
                    sort_order,
                    is_show
                FROM " . $ecs->table('brand') . "
                WHERE is_show = 1
                ORDER BY sort_order ASC, brand_id ASC";
        
        $result = $db->getAll($sql);
        
        if ($result === false) {
            throw new Exception("Lỗi truy vấn database");
        }
        
        $brands = [];
        foreach ($result as $row) {
            $brands[] = [
                'brand_id' => (int)$row['brand_id'],
                'brand_name' => $row['brand_name'],
                'brand_logo' => $row['brand_logo'],
                'sort_order' => (int)$row['sort_order'],
            ];
        }
        
        echo json_encode([
            'error' => false,
            'message' => 'Lấy danh sách thương hiệu thành công.',
            'total' => count($brands),
            'data' => $brands
        ], JSON_UNESCAPED_UNICODE);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => true,
            'message' => 'Lỗi server: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
    break;


/**
 * =====================================================
 * RESPONSE FORMAT
 * =====================================================
 * 
 * GET ?action=get_categories
 * Response:
 * {
 *   "error": false,
 *   "message": "Lấy danh sách danh mục thành công.",
 *   "total": 65,
 *   "data": [
 *     { "cat_id": 382, "cat_name": "Sản phẩm mới", "parent_id": 0, "sort_order": 1 },
 *     { "cat_id": 315, "cat_name": "Tai nghe Bluetooth TWS", "parent_id": 37, "sort_order": 1 },
 *     ...
 *   ]
 * }
 * 
 * GET ?action=get_brands
 * Response:
 * {
 *   "error": false,
 *   "message": "Lấy danh sách thương hiệu thành công.",
 *   "total": 40,
 *   "data": [
 *     { "brand_id": 15, "brand_name": "Hoco", "brand_logo": "...", "sort_order": 1 },
 *     { "brand_id": 141, "brand_name": "Borofone", "brand_logo": "...", "sort_order": 2 },
 *     ...
 *   ]
 * }
 */
