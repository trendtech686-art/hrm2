<?php
/**
 * FILE API HOÀN CHỈNH - PHIÊN BẢN CUỐI CÙNG
 * API Endpoint ECShop dành cho n8n - Tích hợp đầy đủ tính năng.
 */

// ===================================================================
// SECTION 0: CORS HEADERS - Cho phép gọi từ HRM
// ===================================================================
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-API-KEY, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ===================================================================
// SECTION 1: KHỞI TẠO MÔI TRƯỜNG & HÀM CHUNG
// ===================================================================

// Tắt hiển thị lỗi PHP (quan trọng cho API JSON)
@ini_set('display_errors', 0);
error_reporting(0);
ob_start();

// Error handler để bắt tất cả lỗi
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    // Log error nhưng không output
    error_log("PKGX API Error [$errno]: $errstr in $errfile:$errline");
    return true;
});

// Exception handler
set_exception_handler(function($e) {
    ob_clean();
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'error' => true,
        'message' => 'Server error: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit;
});

if (!defined('IN_ECS')) { define('IN_ECS', true); }
if (!defined('DEBUG_MODE')) { define('DEBUG_MODE', 0); }
if (!defined('ROOT_PATH')) { define('ROOT_PATH', realpath(dirname(__FILE__) . '/../') . '/'); }

require_once(ROOT_PATH . 'includes/config.php');
require_once(ROOT_PATH . 'includes/inc_constant.php');
require_once(ROOT_PATH . 'includes/cls_mysql.php');
require_once(ROOT_PATH . 'includes/cls_ecshop.php');
require_once(ROOT_PATH . 'includes/lib_main.php');
require_once(ROOT_PATH . 'includes/lib_common.php');
require_once(ROOT_PATH . 'includes/lib_time.php');
require_once(ROOT_PATH . 'includes/lib_base.php');
require_once(ROOT_PATH . 'includes/lib_ecshopvietnam.php');
require_once(ROOT_PATH . ADMIN_PATH . '/includes/lib_main.php');
require_once(ROOT_PATH . ADMIN_PATH . '/includes/lib_goods.php');
require_once(ROOT_PATH . 'includes/lib_article.php');
include_once(ROOT_PATH . 'includes/cls_image.php');

$db = new cls_mysql($db_host, $db_user, $db_pass, $db_name);
$ecs = new ECS($db_name, $prefix);
$_CFG = load_config();
date_default_timezone_set('Asia/Ho_Chi_Minh');

function send_json_response($data, $http_code = 200) {
    ob_clean();
    http_response_code($http_code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

/**
 * Hàm xử lý ảnh tùy chỉnh (tạo thumb và ảnh lớn dưới định dạng WebP).
 * LƯU Ý: Hàm này phải được định nghĩa BÊN NGOÀI create_product.
 */
function create_resized_image_webp($source_path, $dest_folder, $new_filename_without_ext, $max_width, $max_height) {
    $source_info = getimagesize($source_path); if (!$source_info) return false;
    $width = $source_info[0]; $height = $source_info[1]; $mime = $source_info['mime'];
    switch ($mime) {
        case 'image/jpeg': $source_image = imagecreatefromjpeg($source_path); break;
        case 'image/gif':  $source_image = imagecreatefromgif($source_path); break;
        case 'image/png':  $source_image = imagecreatefrompng($source_path); break;
        case 'image/webp': $source_image = imagecreatefromwebp($source_path); break;
        default: return false;
    }
    if (!$source_image) return false;
    $ratio = $width / $height;
    if ($max_width / $max_height > $ratio) { $new_width = $max_height * $ratio; $new_height = $max_height; } 
    else { $new_height = $max_width / $ratio; $new_width = $max_width; }
    $dest_image = imagecreatetruecolor($new_width, $new_height);
    imagealphablending($dest_image, false); imagesavealpha($dest_image, true);
    $transparent = imagecolorallocatealpha($dest_image, 255, 255, 255, 127);
    imagefilledrectangle($dest_image, 0, 0, $new_width, $new_height, $transparent);
    imagecopyresampled($dest_image, $source_image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
    $dest_path_with_ext = $dest_folder . $new_filename_without_ext . '.webp';
    imagewebp($dest_image, $dest_path_with_ext, 80);
    imagedestroy($source_image); imagedestroy($dest_image);
    return str_replace(ROOT_PATH, '', $dest_path_with_ext);
}

// ===================================================================
// SECTION 2: ĐIỀU PHỐI (ROUTER) YÊU CẦU API
// ===================================================================

define('API_SECRET_KEY', 'a91f2c47e5d8b6f03a7c4e9d12f0b8a6');
$api_key = isset($_SERVER['HTTP_X_API_KEY']) ? $_SERVER['HTTP_X_API_KEY'] : '';
$action = isset($_GET['action']) ? $_GET['action'] : '';

// ACTION: test - Không cần API key, dùng để kiểm tra server hoạt động
if ($action === 'ping') {
    send_json_response([
        'error' => false,
        'message' => 'pong',
        'server_time' => date('Y-m-d H:i:s'),
        'php_version' => phpversion()
    ]);
}

// ACTION: test - Cần API key, kiểm tra kết nối và xác thực
if ($action === 'test') {
    if ($api_key !== API_SECRET_KEY) {
        send_json_response(['error' => true, 'message' => 'API Key không hợp lệ.'], 401);
    }
    
    // Test database connection
    $db_ok = false;
    $total_products = 0;
    $total_categories = 0;
    $total_brands = 0;
    
    try {
        $result = $db->query("SELECT COUNT(*) as total FROM " . $ecs->table('goods') . " WHERE is_delete = 0");
        if ($result) {
            $row = $db->fetchRow($result);
            $total_products = $row['total'];
            $db_ok = true;
        }
        
        $result = $db->query("SELECT COUNT(*) as total FROM " . $ecs->table('category'));
        if ($result) {
            $row = $db->fetchRow($result);
            $total_categories = $row['total'];
        }
        
        $result = $db->query("SELECT COUNT(*) as total FROM " . $ecs->table('brand'));
        if ($result) {
            $row = $db->fetchRow($result);
            $total_brands = $row['total'];
        }
    } catch (Exception $e) {
        send_json_response([
            'error' => true,
            'message' => 'Lỗi kết nối database: ' . $e->getMessage()
        ], 500);
    }
    
    send_json_response([
        'error' => false,
        'message' => 'Kết nối thành công!',
        'server_time' => date('Y-m-d H:i:s'),
        'database' => $db_ok ? 'connected' : 'error',
        'stats' => [
            'total_products' => (int)$total_products,
            'total_categories' => (int)$total_categories,
            'total_brands' => (int)$total_brands
        ]
    ]);
}

if ($api_key !== API_SECRET_KEY) {
    send_json_response(['error' => true, 'message' => 'Xác thực thất bại. API Key không hợp lệ.'], 401);
}

// Lấy dữ liệu từ body của request
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if (json_last_error() !== JSON_ERROR_NONE && ($action === 'create_product' || $action === 'update_product')) {
    send_json_response(['error' => true, 'message' => 'Định dạng JSON không hợp lệ.'], 400);
}

// Kiểm tra hành động và xử lý
if ($action === 'create_product') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        send_json_response(['error' => true, 'message' => 'Phương thức yêu cầu không hợp lệ. Chỉ hỗ trợ POST.'], 405);
    }
    create_product($data);
} else if ($action === 'update_product') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        send_json_response(['error' => true, 'message' => 'Phương thức yêu cầu không hợp lệ. Chỉ hỗ trợ POST.'], 405);
    }
    // Lấy ID sản phẩm từ query string
    $goods_id = isset($_GET['goods_id']) ? intval($_GET['goods_id']) : 0;
    if ($goods_id === 0) {
        send_json_response(['error' => true, 'message' => "Thiếu ID sản phẩm (goods_id) trong URL."], 400);
    }
    update_product($goods_id, $data);
} else if ($action === 'get_products') {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        send_json_response(['error' => true, 'message' => 'Phương thức yêu cầu không hợp lệ. Chỉ hỗ trợ GET.'], 405);
    }
    get_products_paginated();
} else if ($action === 'upload_product_image') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        send_json_response(['error' => true, 'message' => 'Phương thức yêu cầu không hợp lệ. Chỉ hỗ trợ POST.'], 405);
    }
    upload_product_image();
} else if ($action === 'get_categories') {
    // ACTION: Lấy danh sách danh mục
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        send_json_response(['error' => true, 'message' => 'Phương thức yêu cầu không hợp lệ. Chỉ hỗ trợ GET.'], 405);
    }
    api_get_categories();
} else if ($action === 'update_category') {
    // ACTION: Cập nhật thông tin danh mục
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        send_json_response(['error' => true, 'message' => 'Phương thức yêu cầu không hợp lệ. Chỉ hỗ trợ POST.'], 405);
    }
    $cat_id = isset($_GET['cat_id']) ? intval($_GET['cat_id']) : 0;
    if ($cat_id === 0) {
        send_json_response(['error' => true, 'message' => "Thiếu ID danh mục (cat_id) trong URL."], 400);
    }
    update_category($cat_id, $data);
} else if ($action === 'get_brands') {
    // ACTION: Lấy danh sách thương hiệu
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        send_json_response(['error' => true, 'message' => 'Phương thức yêu cầu không hợp lệ. Chỉ hỗ trợ GET.'], 405);
    }
    api_get_brands();
} else if ($action === 'update_brand') {
    // ACTION: Cập nhật thông tin thương hiệu
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        send_json_response(['error' => true, 'message' => 'Phương thức yêu cầu không hợp lệ. Chỉ hỗ trợ POST.'], 405);
    }
    $brand_id = isset($_GET['brand_id']) ? intval($_GET['brand_id']) : 0;
    if ($brand_id === 0) {
        send_json_response(['error' => true, 'message' => "Thiếu ID thương hiệu (brand_id) trong URL."], 400);
    }
    update_brand($brand_id, $data);
} else {
    // Nếu hành động không hợp lệ
    send_json_response(['error' => true, 'message' => "Hành động không hợp lệ. Các action hỗ trợ: create_product, update_product, get_products, upload_product_image, get_categories, update_category, get_brands, update_brand."], 400);
}

// ===================================================================
// SECTION 3: CÁC HÀM XỬ LÝ
// ===================================================================

/**
 * Lấy danh sách sản phẩm với hỗ trợ phân trang.
 * 
 * Parameters:
 *   - page: Trang hiện tại (mặc định: 1)
 *   - limit: Số sản phẩm mỗi trang (mặc định: 50)
 *   - goods_id: ID sản phẩm cần lấy (optional - nếu có sẽ chỉ trả về 1 sản phẩm)
 */
function get_products_paginated()
{
    global $db, $ecs;

    // Kiểm tra nếu có goods_id - lấy chi tiết 1 sản phẩm
    $goods_id = isset($_GET['goods_id']) ? intval($_GET['goods_id']) : 0;
    
    if ($goods_id > 0) {
        // Lấy chi tiết 1 sản phẩm theo ID
        try {
            $sql = "SELECT * FROM " . $ecs->table('goods') . " WHERE goods_id = '$goods_id'";
            $product = $db->getRow($sql);
            
            if (!$product) {
                send_json_response([
                    'error' => true,
                    'message' => "Không tìm thấy sản phẩm với ID: $goods_id"
                ], 404);
            }
            
            // Lấy slug
            $slug = $db->getOne("SELECT slug FROM " . $ecs->table('slug') . " WHERE id = '$goods_id' AND module = 'goods'");
            $product['slug'] = $slug;
            
            send_json_response([
                'error' => false,
                'message' => 'Lấy chi tiết sản phẩm thành công.',
                'pagination' => [
                    'total_items' => 1,
                    'total_pages' => 1,
                    'current_page' => 1,
                    'per_page' => 1
                ],
                'data' => [$product]
            ], 200);
        } catch (Exception $e) {
            send_json_response(['error' => true, 'message' => $e->getMessage()], 500);
        }
        return;
    }

    // Lấy các tham số phân trang từ URL, gán giá trị mặc định
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? max(1, intval($_GET['limit'])) : 50; // Mặc định 50 sản phẩm/trang

    $offset = ($page - 1) * $limit;

    try {
        // Truy vấn tổng số sản phẩm để tính tổng số trang
        $total_items = $db->getOne("SELECT COUNT(*) FROM " . $ecs->table('goods'));
        $total_pages = ceil($total_items / $limit);

        // Truy vấn dữ liệu sản phẩm cho trang hiện tại
        $sql = "SELECT * FROM " . $ecs->table('goods') . " ORDER BY goods_id DESC LIMIT $limit OFFSET $offset";
        $products = $db->getAll($sql);
        
        // Lấy slug cho mỗi sản phẩm
        foreach ($products as &$product) {
            $slug = $db->getOne("SELECT slug FROM " . $ecs->table('slug') . " WHERE id = '" . $product['goods_id'] . "' AND module = 'goods'");
            $product['slug'] = $slug;
        }

        send_json_response([
            'error' => false,
            'message' => 'Lấy dữ liệu sản phẩm thành công.',
            'pagination' => [
                'total_items' => intval($total_items),
                'total_pages' => intval($total_pages),
                'current_page' => intval($page),
                'per_page' => intval($limit)
            ],
            'data' => $products
        ], 200);

    } catch (Exception $e) {
        send_json_response(['error' => true, 'message' => $e->getMessage()], 500);
    }
}

/**
 * Hàm tạo sản phẩm chính
 */
function create_product($data)
{
    global $db, $ecs, $_CFG;

    // --- Kiểm tra dữ liệu đầu vào ---
    if (empty($data['cat_id']) && empty($data['category'])) {
        send_json_response(['error' => true, 'message' => "Thiếu trường bắt buộc: 'cat_id' hoặc 'category'"], 400);
    }
    $required_fields = ['goods_name', 'shop_price', 'goods_number'];
    foreach ($required_fields as $field) {
        if (empty($data[$field])) { send_json_response(['error' => true, 'message' => "Thiếu trường bắt buộc: '$field'"], 400); }
    }

    try {
        // --- Gán dữ liệu từ JSON vào các biến ---
        $goods_name = isset($data['goods_name']) ? trim($data['goods_name']) : '';
        $cat_id = isset($data['cat_id']) ? intval($data['cat_id']) : (isset($data['category']) ? intval($data['category']) : 0);
        $brand_id = isset($data['brand_id']) ? intval($data['brand_id']) : 0;
        $seller_note = isset($data['seller_note']) ? trim($data['seller_note']) : '';
        $is_best = !empty($data['best']) ? 1 : 0;
        $is_hot = !empty($data['hot']) ? 1 : 0;
        $is_new = !empty($data['new']) ? 1 : 0;
        $is_home = !empty($data['ishome']) ? 1 : 0;
        
        // Xử lý tất cả các trường giá
        $shop_price = isset($data['shop_price']) ? floatval($data['shop_price']) : 0;
        $market_price = isset($data['market_price']) ? floatval($data['market_price']) : $shop_price * 1.2;
        $partner_price = isset($data['partner_price']) ? floatval($data['partner_price']) : 0;
        $ace_price = isset($data['ace_price']) ? floatval($data['ace_price']) : 0;
        $deal_price = isset($data['deal_price']) ? floatval($data['deal_price']) : 0;
        
        $goods_number = intval($data['goods_number']);
        $goods_desc = isset($data['goods_desc']) ? trim($data['goods_desc']) : '';
        $keywords = isset($data['keywords']) ? trim($data['keywords']) : '';
        $goods_brief = isset($data['goods_brief']) ? trim($data['goods_brief']) : '';
        $meta_title = isset($data['meta_title']) ? trim($data['meta_title']) : $goods_name;
        $meta_desc = isset($data['meta_desc']) ? trim($data['meta_desc']) : '';
        $goods_sn = isset($data['goods_sn']) ? trim($data['goods_sn']) : '';
        $original_img_path = isset($data['original_img']) ? trim($data['original_img']) : '';

        // --- Chèn sản phẩm vào CSDL ---
        if (empty($goods_sn)) { $max_id = $db->getOne("SELECT MAX(goods_id) + 1 FROM " . $ecs->table('goods')); $goods_sn = generate_goods_sn($max_id); } 
        else { if (check_goods_sn_exist($goods_sn)) { throw new Exception("Mã sản phẩm '$goods_sn' đã tồn tại."); }}
        $add_time = gmtime(); $last_update = gmtime();
        
        // ===================================================================
        // SỬA ĐỔI DUY NHẤT TẠI ĐÂY: is_shipping được đổi từ '1' thành '0'
        // ===================================================================
        $sql_pre_insert = "INSERT INTO " . $ecs->table('goods') . 
            " (goods_name, cat_id, brand_id, shop_price, market_price, partner_price, ace_price, deal_price, goods_number, goods_desc, keywords, goods_brief, meta_title, meta_desc, goods_sn, is_on_sale, add_time, last_update, is_alone_sale, goods_type, is_shipping, seller_note, is_best, is_hot, is_new, is_home)" .
            " VALUES ('" . addslashes($goods_name) . "', '" . $cat_id . "', '" . $brand_id . "', '" . $shop_price . "', '" . $market_price . "', '" . $partner_price . "', '" . $ace_price . "', '" . $deal_price . "', '" . $goods_number . "', '" . addslashes($goods_desc) . "', '" . addslashes($keywords) . "', '" . addslashes($goods_brief) . "', '" . addslashes($meta_title) . "', '" . addslashes($meta_desc) . "', '" . addslashes($goods_sn) . "', '0', '" . $add_time . "', '" . $last_update . "', '1', '0', '0', '" . addslashes($seller_note) . "', '" . $is_best . "', '" . $is_hot . "', '" . $is_new . "', '" . $is_home . "')";
        
        $db->query($sql_pre_insert);
        $goods_id = $db->insert_id();
        if ($goods_id <= 0) { throw new Exception('Không thể thêm sản phẩm vào CSDL: ' . $db->errorMsg()); }

        // --- Tạo slug ---
        $slug = build_slug($goods_name);
        $check_slug = $db->getOne("SELECT COUNT(id) FROM " . $ecs->table('slug') . " WHERE slug='$slug'");
        if ($check_slug > 0) { $slug = $slug . '-' . $goods_id; }
        $db->autoExecute($ecs->table('slug'), ['id' => $goods_id, 'module' => 'goods', 'slug' => $slug], 'INSERT');
        
        // --- Xử lý ảnh ---
        $goods_img_final = ''; $goods_thumb_final = ''; $original_img_final = '';
        if (!empty($original_img_path) && file_exists(ROOT_PATH . $original_img_path)) {
            $original_img_final = $original_img_path;
            $source_full_path = ROOT_PATH . $original_img_path;
            $original_basename = pathinfo($original_img_path, PATHINFO_FILENAME);
            $source_dir = dirname($original_img_path);
            $parent_dir = dirname($source_dir);
            $goods_dir = ROOT_PATH . $parent_dir . '/goods_img/';
            $thumb_dir = ROOT_PATH . $parent_dir . '/thumb_img/';
            if (!is_dir($goods_dir)) { mkdir($goods_dir, 0755, true); }
            if (!is_dir($thumb_dir)) { mkdir($thumb_dir, 0755, true); }
            if (is_writable($goods_dir) && is_writable($thumb_dir)) {
                $goods_thumb_final = create_resized_image_webp($source_full_path, $thumb_dir, $original_basename, $_CFG['thumb_width'], $_CFG['thumb_height']);
                $goods_img_final = create_resized_image_webp($source_full_path, $goods_dir, $original_basename, $_CFG['image_width'], $_CFG['image_height']);
            }
        }
        
        if (substr($goods_img_final, 0, 4) === 'cdn/') { $goods_img_final = substr($goods_img_final, 4); }
        if (substr($goods_thumb_final, 0, 4) === 'cdn/') { $goods_thumb_final = substr($goods_thumb_final, 4); }
        if (substr($original_img_final, 0, 4) === 'cdn/') { $original_img_final = substr($original_img_final, 4); }
        $sql_update_img = "UPDATE " . $ecs->table('goods') . " SET goods_img = '" . addslashes($goods_img_final) . "', goods_thumb = '" . addslashes($goods_thumb_final) . "', original_img = '" . addslashes($original_img_final) . "' WHERE goods_id = '$goods_id'";
        $db->query($sql_update_img);

        // --- Hoàn tất ---
        clear_cache_files();
        send_json_response(['error' => false, 'message' => 'Sản phẩm đã được tạo thành công.', 'goods_id' => $goods_id, 'created_slug' => $slug], 201);

    } catch (Exception $e) {
        if (isset($goods_id) && $goods_id > 0) {
            $db->query("DELETE FROM " . $ecs->table('goods') . " WHERE goods_id = '$goods_id'");
            $db->query("DELETE FROM " . $ecs->table('slug') . " WHERE id = '$goods_id' AND module = 'goods'");
        }
        send_json_response(['error' => true, 'message' => $e->getMessage()], 500);
    }
}
/**
 * Cập nhật thông tin sản phẩm dựa trên goods_id.
 *
 * @param int   $goods_id  ID của sản phẩm cần cập nhật.
 * @param array $data      Mảng chứa dữ liệu mới của sản phẩm.
 */
function update_product($goods_id, $data)
{
    global $db, $ecs, $_CFG;

    // --- Kiểm tra dữ liệu đầu vào ---
    $goods_id = intval($goods_id);
    if ($goods_id <= 0) {
        send_json_response(['error' => true, 'message' => "ID sản phẩm không hợp lệ."], 400);
        return;
    }

    $product_info = $db->getRow("SELECT goods_id, original_img FROM " . $ecs->table('goods') . " WHERE goods_id = '$goods_id'");
    if (!$product_info) {
        send_json_response(['error' => true, 'message' => "Sản phẩm với ID '$goods_id' không tồn tại."], 404);
        return;
    }
    
    if (empty($data)) {
        send_json_response(['error' => false, 'message' => 'Không có dữ liệu nào được gửi để cập nhật.', 'goods_id' => $goods_id], 200);
        return;
    }

    // Lọc dữ liệu đầu vào để tránh ghi đè bằng giá trị rỗng
    $filtered_data = [];
    foreach ($data as $key => $value) {
        // Boolean keys - luôn chấp nhận (true/false)
        $boolean_keys = ['best', 'hot', 'new', 'ishome', 'is_on_sale', 'on_sale'];
        // Text keys - cho phép gửi giá trị rỗng để xóa nội dung
        $text_keys = ['meta_desc', 'goods_desc', 'goods_brief', 'keywords', 'meta_title', 'seller_note'];
        
        if (in_array($key, $boolean_keys)) {
            $filtered_data[$key] = $value;
        } else if (in_array($key, $text_keys)) {
            // Text fields: luôn chấp nhận, kể cả rỗng
            $filtered_data[$key] = $value;
        } else if ($value !== '') {
            $filtered_data[$key] = $value;
        }
    }

    if (empty($filtered_data)) {
        send_json_response(['error' => false, 'message' => 'Không có dữ liệu hợp lệ nào được gửi để cập nhật.', 'goods_id' => $goods_id], 200);
        return;
    }

    try {
        $update_fields = [];
        $new_goods_name = null;

        // Xây dựng danh sách các trường cần cập nhật từ dữ liệu đã lọc
        if (isset($filtered_data['goods_name'])) {
            $new_goods_name = trim($filtered_data['goods_name']);
            $update_fields[] = "goods_name = '" . addslashes($new_goods_name) . "'";
        }
        if (isset($filtered_data['cat_id'])) {
            $update_fields[] = "cat_id = '" . intval($filtered_data['cat_id']) . "'";
        }
        if (isset($filtered_data['category'])) {
            $update_fields[] = "cat_id = '" . intval($filtered_data['category']) . "'";
        }
        if (isset($filtered_data['brand_id'])) {
            $update_fields[] = "brand_id = '" . intval($filtered_data['brand_id']) . "'";
        }
        if (isset($filtered_data['seller_note'])) {
            $update_fields[] = "seller_note = '" . addslashes(trim($filtered_data['seller_note'])) . "'";
        }
        if (isset($filtered_data['best'])) {
            $update_fields[] = "is_best = '" . (!empty($filtered_data['best']) ? 1 : 0) . "'";
        }
        if (isset($filtered_data['hot'])) {
            $update_fields[] = "is_hot = '" . (!empty($filtered_data['hot']) ? 1 : 0) . "'";
        }
        if (isset($filtered_data['new'])) {
            $update_fields[] = "is_new = '" . (!empty($filtered_data['new']) ? 1 : 0) . "'";
        }
        if (isset($filtered_data['ishome'])) {
            $update_fields[] = "is_home = '" . (!empty($filtered_data['ishome']) ? 1 : 0) . "'";
        }
        // is_on_sale = Hiển thị đăng web (on/off trên website)
        if (isset($filtered_data['is_on_sale']) || isset($filtered_data['on_sale'])) {
            $is_on_sale_value = isset($filtered_data['is_on_sale']) ? $filtered_data['is_on_sale'] : $filtered_data['on_sale'];
            $update_fields[] = "is_on_sale = '" . (!empty($is_on_sale_value) ? 1 : 0) . "'";
        }
        if (isset($filtered_data['shop_price'])) {
            $update_fields[] = "shop_price = '" . floatval($filtered_data['shop_price']) . "'";
        }
        if (isset($filtered_data['market_price'])) {
            $update_fields[] = "market_price = '" . floatval($filtered_data['market_price']) . "'";
        }
        if (isset($filtered_data['partner_price'])) {
            $update_fields[] = "partner_price = '" . floatval($filtered_data['partner_price']) . "'";
        }
        if (isset($filtered_data['ace_price'])) {
            $update_fields[] = "ace_price = '" . floatval($filtered_data['ace_price']) . "'";
        }
        if (isset($filtered_data['deal_price'])) {
            $update_fields[] = "deal_price = '" . floatval($filtered_data['deal_price']) . "'";
        }
        if (isset($filtered_data['goods_number'])) {
            $update_fields[] = "goods_number = '" . intval($filtered_data['goods_number']) . "'";
        }
        if (isset($filtered_data['goods_desc'])) {
            $update_fields[] = "goods_desc = '" . addslashes(trim($filtered_data['goods_desc'])) . "'";
        }
        if (isset($filtered_data['keywords'])) {
            $update_fields[] = "keywords = '" . addslashes(trim($filtered_data['keywords'])) . "'";
        }
        if (isset($filtered_data['goods_brief'])) {
            $update_fields[] = "goods_brief = '" . addslashes(trim($filtered_data['goods_brief'])) . "'";
        }
        if (isset($filtered_data['meta_title'])) {
            $update_fields[] = "meta_title = '" . addslashes(trim($filtered_data['meta_title'])) . "'";
        }
        if (isset($filtered_data['meta_desc'])) {
            $update_fields[] = "meta_desc = '" . addslashes(trim($filtered_data['meta_desc'])) . "'";
        }
        if (isset($filtered_data['goods_sn'])) {
            $goods_sn = trim($filtered_data['goods_sn']);
            if (check_goods_sn_exist($goods_sn, $goods_id)) {
                throw new Exception("Mã sản phẩm '$goods_sn' đã tồn tại cho một sản phẩm khác.");
            }
            $update_fields[] = "goods_sn = '" . addslashes($goods_sn) . "'";
        }

        // --- XỬ LÝ ẢNH MỚI ---
        if (isset($filtered_data['original_img']) && !empty($filtered_data['original_img'])) {
            $original_img_path_raw = trim($filtered_data['original_img']);
            
            // Bước 1: Chuẩn hóa đường dẫn bằng cách loại bỏ các tiền tố trùng lặp
            $cleaned_path = preg_replace('/^(cdn\/)+/', '', $original_img_path_raw);
            $cleaned_path = preg_replace('/(images\/)+/', 'images/', $cleaned_path);
            $cleaned_path = preg_replace('/(source_img\/)+/', 'source_img/', $cleaned_path);

            // Bước 2: Xây dựng đường dẫn file tuyệt đối
            $source_full_path = ROOT_PATH . 'cdn/' . $cleaned_path;

            if (file_exists($source_full_path)) {
                $original_basename = pathinfo($source_full_path, PATHINFO_FILENAME);
                $base_dir = dirname($cleaned_path);
                
                // Bước 3: Đảm bảo thư mục lưu ảnh tồn tại
                $goods_dir = ROOT_PATH . 'cdn/images/' . $base_dir . '/goods_img/';
                $thumb_dir = ROOT_PATH . 'cdn/images/' . $base_dir . '/thumb_img/';

                if (!is_dir($goods_dir)) { 
                    mkdir($goods_dir, 0755, true); 
                }
                if (!is_dir($thumb_dir)) { 
                    mkdir($thumb_dir, 0755, true); 
                }

                if (is_writable($goods_dir) && is_writable($thumb_dir)) {
                    // Tạo ảnh và lấy đường dẫn tương đối để lưu vào DB (không có 'cdn')
                    $goods_img_final = create_resized_image_webp($source_full_path, $goods_dir, $original_basename, $_CFG['image_width'], $_CFG['image_height']);
                    $goods_thumb_final = create_resized_image_webp($source_full_path, $thumb_dir, $original_basename, $_CFG['thumb_width'], $_CFG['thumb_height']);
                    
                    // SỬA LỖI TẠI ĐÂY: Loại bỏ tiền tố 'cdn/' nếu có
                    if (substr($goods_img_final, 0, 4) === 'cdn/') { 
                        $goods_img_final = substr($goods_img_final, 4); 
                    }
                    if (substr($goods_thumb_final, 0, 4) === 'cdn/') { 
                        $goods_thumb_final = substr($goods_thumb_final, 4); 
                    }

                    $update_fields[] = "goods_img = '" . addslashes($goods_img_final) . "'";
                    $update_fields[] = "goods_thumb = '" . addslashes($goods_thumb_final) . "'";
                    $update_fields[] = "original_img = '" . addslashes($cleaned_path) . "'";
                } else {
                     throw new Exception("Không thể ghi vào thư mục ảnh. Vui lòng kiểm tra quyền truy cập (755).");
                }
            } else {
                 throw new Exception("Lỗi: Không tìm thấy tệp ảnh gốc tại đường dẫn: " . $source_full_path);
            }
        }
        
        // Thực thi cập nhật CSDL
        if (!empty($update_fields)) {
            $update_fields[] = "last_update = '" . gmtime() . "'";
            $sql_update = "UPDATE " . $ecs->table('goods') . " SET " . implode(', ', $update_fields) . " WHERE goods_id = '$goods_id'";
            $db->query($sql_update);
        }

        // Cập nhật slug nếu tên sản phẩm thay đổi
        $updated_slug = null;
        if (isset($new_goods_name)) {
            $slug = build_slug($new_goods_name);
            $check_slug = $db->getOne("SELECT COUNT(id) FROM " . $ecs->table('slug') . " WHERE slug='$slug' AND id <> '$goods_id'");
            if ($check_slug > 0) {
                $slug = $slug . '-' . $goods_id;
            }
            $db->autoExecute($ecs->table('slug'), ['slug' => $slug], 'UPDATE', "id = '$goods_id' AND module = 'goods'");
            $updated_slug = $slug;
        }

        // Hoàn tất và trả về JSON
        clear_cache_files();
        $response_data = [
            'error' => false,
            'message' => 'Sản phẩm đã được cập nhật thành công.',
            'goods_id' => $goods_id,
            'data' => [
                'original_img_path_raw' => isset($original_img_path_raw) ? $original_img_path_raw : 'Không có ảnh được gửi',
                'cleaned_path' => isset($cleaned_path) ? $cleaned_path : 'Không có ảnh được gửi',
                'source_full_path' => isset($source_full_path) ? $source_full_path : 'Không có ảnh được gửi',
                'db_paths' => [
                    'original_img' => isset($cleaned_path) ? $cleaned_path : 'Không thay đổi',
                    'goods_img' => isset($goods_img_final) ? $goods_img_final : 'Không thay đổi',
                    'goods_thumb' => isset($goods_thumb_final) ? $goods_thumb_final : 'Không thay đổi'
                ]
            ]
        ];
        if ($updated_slug) {
            $response_data['updated_slug'] = $updated_slug;
        }
        send_json_response($response_data, 200);

    } catch (Exception $e) {
        send_json_response(['error' => true, 'message' => $e->getMessage()], 500);
    }
}

/**
 * Upload ảnh sản phẩm lên server PKGX
 * 
 * Request: POST multipart/form-data
 * Headers: X-API-KEY: {api_key}
 * 
 * Form fields:
 *   - image_file: File ảnh (required) - JPEG, PNG, GIF, WebP
 *   - filename_slug: Tên file không dấu (optional) - VD: "tai-nghe-hoco-y30"
 *   - goods_id: ID sản phẩm nếu muốn cập nhật luôn (optional)
 */
function upload_product_image()
{
    global $db, $ecs, $_CFG;
    
    // --- 1. Kiểm tra file upload ---
    if (!isset($_FILES['image_file']) || $_FILES['image_file']['error'] !== UPLOAD_ERR_OK) {
        $error_code = isset($_FILES['image_file']['error']) ? $_FILES['image_file']['error'] : 'N/A';
        send_json_response([
            'error' => true, 
            'message' => 'Không có file nào được gửi lên hoặc có lỗi upload. Error code: ' . $error_code
        ], 400);
    }
    
    $temp_file = $_FILES['image_file']['tmp_name'];
    $original_name = $_FILES['image_file']['name'];
    $file_size = $_FILES['image_file']['size'];
    
    // --- 2. Validate file ---
    // Kiểm tra kích thước (max 10MB)
    $max_size = 10 * 1024 * 1024;
    if ($file_size > $max_size) {
        send_json_response([
            'error' => true, 
            'message' => 'File quá lớn. Kích thước tối đa cho phép là 10MB.'
        ], 400);
    }
    
    // Kiểm tra định dạng ảnh
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $temp_file);
    finfo_close($finfo);
    
    if (!in_array($mime_type, $allowed_types)) {
        send_json_response([
            'error' => true, 
            'message' => 'Định dạng file không hợp lệ. Chỉ hỗ trợ: JPEG, PNG, GIF, WebP.'
        ], 400);
    }
    
    // --- 3. Tạo tên file và thư mục ---
    $filename_slug = isset($_POST['filename_slug']) && !empty($_POST['filename_slug']) 
        ? trim($_POST['filename_slug']) 
        : pathinfo($original_name, PATHINFO_FILENAME);
    
    $filename_slug = create_safe_filename($filename_slug);
    
    $month_folder = date('Ym');
    
    $extension_map = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/gif' => 'gif',
        'image/webp' => 'webp'
    ];
    $original_ext = $extension_map[$mime_type];
    
    $base_path = ROOT_PATH . 'cdn/images/' . $month_folder;
    $source_dir = $base_path . '/source_img/';
    $goods_dir = $base_path . '/goods_img/';
    $thumb_dir = $base_path . '/thumb_img/';
    
    if (!is_dir($source_dir)) { mkdir($source_dir, 0755, true); }
    if (!is_dir($goods_dir)) { mkdir($goods_dir, 0755, true); }
    if (!is_dir($thumb_dir)) { mkdir($thumb_dir, 0755, true); }
    
    if (!is_writable($source_dir) || !is_writable($goods_dir) || !is_writable($thumb_dir)) {
        send_json_response([
            'error' => true, 
            'message' => 'Không có quyền ghi vào thư mục. Vui lòng kiểm tra permission (755).'
        ], 500);
    }
    
    // --- 4. Lưu file gốc ---
    $source_filename = $filename_slug . '.' . $original_ext;
    $source_full_path = $source_dir . $source_filename;
    
    $counter = 1;
    while (file_exists($source_full_path)) {
        $source_filename = $filename_slug . '-' . $counter . '.' . $original_ext;
        $source_full_path = $source_dir . $source_filename;
        $counter++;
    }
    
    $final_filename = pathinfo($source_filename, PATHINFO_FILENAME);
    
    if (!move_uploaded_file($temp_file, $source_full_path)) {
        send_json_response([
            'error' => true, 
            'message' => 'Không thể lưu file lên server.'
        ], 500);
    }
    
    // --- 5. Tạo ảnh resize ---
    $image_width = isset($_CFG['image_width']) ? intval($_CFG['image_width']) : 800;
    $image_height = isset($_CFG['image_height']) ? intval($_CFG['image_height']) : 800;
    $thumb_width = isset($_CFG['thumb_width']) ? intval($_CFG['thumb_width']) : 400;
    $thumb_height = isset($_CFG['thumb_height']) ? intval($_CFG['thumb_height']) : 400;
    
    $goods_img_path = create_resized_image_webp($source_full_path, $goods_dir, $final_filename, $image_width, $image_height);
    $thumb_img_path = create_resized_image_webp($source_full_path, $thumb_dir, $final_filename, $thumb_width, $thumb_height);
    
    if (!$goods_img_path || !$thumb_img_path) {
        @unlink($source_full_path);
        send_json_response([
            'error' => true, 
            'message' => 'Không thể xử lý ảnh. Vui lòng thử lại với file khác.'
        ], 500);
    }
    
    // --- 6. Chuẩn hóa đường dẫn ---
    $original_img_db = 'images/' . $month_folder . '/source_img/' . $source_filename;
    $goods_img_db = str_replace(ROOT_PATH . 'cdn/', '', $goods_img_path);
    $thumb_img_db = str_replace(ROOT_PATH . 'cdn/', '', $thumb_img_path);
    
    if (substr($goods_img_db, 0, 4) === 'cdn/') { $goods_img_db = substr($goods_img_db, 4); }
    if (substr($thumb_img_db, 0, 4) === 'cdn/') { $thumb_img_db = substr($thumb_img_db, 4); }
    
    // --- 7. Cập nhật vào sản phẩm nếu có goods_id ---
    $goods_id = isset($_POST['goods_id']) ? intval($_POST['goods_id']) : 0;
    $product_updated = false;
    
    if ($goods_id > 0) {
        $product_exists = $db->getOne("SELECT goods_id FROM " . $ecs->table('goods') . " WHERE goods_id = '$goods_id'");
        
        if ($product_exists) {
            $sql = "UPDATE " . $ecs->table('goods') . " SET 
                original_img = '" . addslashes($original_img_db) . "',
                goods_img = '" . addslashes($goods_img_db) . "',
                goods_thumb = '" . addslashes($thumb_img_db) . "',
                last_update = '" . gmtime() . "'
                WHERE goods_id = '$goods_id'";
            
            if ($db->query($sql)) {
                $product_updated = true;
                clear_cache_files();
            }
        }
    }
    
    // --- 8. Trả về response ---
    $cdn_base_url = 'https://phukiengiaxuong.com.vn/cdn/';
    
    $response = [
        'error' => false,
        'message' => $product_updated ? 'Upload ảnh và cập nhật sản phẩm thành công.' : 'Upload ảnh thành công.',
        'data' => [
            'original_img' => $original_img_db,
            'goods_img' => $goods_img_db,
            'goods_thumb' => $thumb_img_db,
            'full_urls' => [
                'original' => $cdn_base_url . $original_img_db,
                'goods' => $cdn_base_url . $goods_img_db,
                'thumb' => $cdn_base_url . $thumb_img_db
            ]
        ]
    ];
    
    if ($goods_id > 0) {
        $response['goods_id'] = $goods_id;
        $response['product_updated'] = $product_updated;
    }
    
    send_json_response($response, 201);
}

/**
 * Hàm tạo filename an toàn (không dấu, không ký tự đặc biệt)
 */
function create_safe_filename($str) {
    $char_map = array(
        'à'=>'a', 'á'=>'a', 'ạ'=>'a', 'ả'=>'a', 'ã'=>'a',
        'â'=>'a', 'ầ'=>'a', 'ấ'=>'a', 'ậ'=>'a', 'ẩ'=>'a', 'ẫ'=>'a',
        'ă'=>'a', 'ằ'=>'a', 'ắ'=>'a', 'ặ'=>'a', 'ẳ'=>'a', 'ẵ'=>'a',
        'è'=>'e', 'é'=>'e', 'ẹ'=>'e', 'ẻ'=>'e', 'ẽ'=>'e',
        'ê'=>'e', 'ề'=>'e', 'ế'=>'e', 'ệ'=>'e', 'ể'=>'e', 'ễ'=>'e',
        'ì'=>'i', 'í'=>'i', 'ị'=>'i', 'ỉ'=>'i', 'ĩ'=>'i',
        'ò'=>'o', 'ó'=>'o', 'ọ'=>'o', 'ỏ'=>'o', 'õ'=>'o',
        'ô'=>'o', 'ồ'=>'o', 'ố'=>'o', 'ộ'=>'o', 'ổ'=>'o', 'ỗ'=>'o',
        'ơ'=>'o', 'ờ'=>'o', 'ớ'=>'o', 'ợ'=>'o', 'ở'=>'o', 'ỡ'=>'o',
        'ù'=>'u', 'ú'=>'u', 'ụ'=>'u', 'ủ'=>'u', 'ũ'=>'u',
        'ư'=>'u', 'ừ'=>'u', 'ứ'=>'u', 'ự'=>'u', 'ử'=>'u', 'ữ'=>'u',
        'ỳ'=>'y', 'ý'=>'y', 'ỵ'=>'y', 'ỷ'=>'y', 'ỹ'=>'y',
        'đ'=>'d', 'Đ'=>'D',
        'À'=>'A', 'Á'=>'A', 'Ạ'=>'A', 'Ả'=>'A', 'Ã'=>'A',
        'Â'=>'A', 'Ầ'=>'A', 'Ấ'=>'A', 'Ậ'=>'A', 'Ẩ'=>'A', 'Ẫ'=>'A',
        'Ă'=>'A', 'Ằ'=>'A', 'Ắ'=>'A', 'Ặ'=>'A', 'Ẳ'=>'A', 'Ẵ'=>'A',
        'È'=>'E', 'É'=>'E', 'Ẹ'=>'E', 'Ẻ'=>'E', 'Ẽ'=>'E',
        'Ê'=>'E', 'Ề'=>'E', 'Ế'=>'E', 'Ệ'=>'E', 'Ể'=>'E', 'Ễ'=>'E',
        'Ì'=>'I', 'Í'=>'I', 'Ị'=>'I', 'Ỉ'=>'I', 'Ĩ'=>'I',
        'Ò'=>'O', 'Ó'=>'O', 'Ọ'=>'O', 'Ỏ'=>'O', 'Õ'=>'O',
        'Ô'=>'O', 'Ồ'=>'O', 'Ố'=>'O', 'Ộ'=>'O', 'Ổ'=>'O', 'Ỗ'=>'O',
        'Ơ'=>'O', 'Ờ'=>'O', 'Ớ'=>'O', 'Ợ'=>'O', 'Ở'=>'O', 'Ỡ'=>'O',
        'Ù'=>'U', 'Ú'=>'U', 'Ụ'=>'U', 'Ủ'=>'U', 'Ũ'=>'U',
        'Ư'=>'U', 'Ừ'=>'U', 'Ứ'=>'U', 'Ự'=>'U', 'Ử'=>'U', 'Ữ'=>'U',
        'Ỳ'=>'Y', 'Ý'=>'Y', 'Ỵ'=>'Y', 'Ỷ'=>'Y', 'Ỹ'=>'Y'
    );
    
    $str = trim($str);
    $str = strtr($str, $char_map);
    $str = strtolower($str);
    $str = preg_replace('/[^a-z0-9\-_]/', '-', $str);
    $str = preg_replace('/-+/', '-', $str);
    $str = trim($str, '-');
    
    if (strlen($str) > 100) { $str = substr($str, 0, 100); }
    if (empty($str)) { $str = 'product-' . uniqid(); }
    
    return $str;
}

/**
 * Lấy danh sách danh mục từ database (bao gồm SEO fields)
 * URL: ?action=get_categories
 * Optional: ?action=get_categories&cat_id=123 (lấy chi tiết 1 danh mục)
 * NOTE: Renamed to api_get_categories to avoid conflict with ECShop lib_common.php
 */
function api_get_categories()
{
    global $db, $ecs;
    
    // Kiểm tra nếu cần lấy chi tiết 1 danh mục
    $cat_id = isset($_GET['cat_id']) ? intval($_GET['cat_id']) : 0;
    
    try {
        if ($cat_id > 0) {
            // Lấy chi tiết 1 danh mục
            $sql = "SELECT 
                        cat_id,
                        cat_name,
                        parent_id,
                        sort_order,
                        is_show,
                        cat_desc,
                        keywords,
                        cat_alias,
                        style,
                        grade,
                        filter_attr
                    FROM " . $ecs->table('category') . "
                    WHERE cat_id = '$cat_id'";
            
            $category = $db->getRow($sql);
            
            if (!$category) {
                send_json_response([
                    'error' => true,
                    'message' => "Không tìm thấy danh mục với ID: $cat_id"
                ], 404);
            }
            
            send_json_response([
                'error' => false,
                'message' => 'Lấy chi tiết danh mục thành công.',
                'data' => [
                    'cat_id' => intval($category['cat_id']),
                    'cat_name' => $category['cat_name'],
                    'parent_id' => intval($category['parent_id']),
                    'sort_order' => intval($category['sort_order']),
                    'cat_desc' => $category['cat_desc'],
                    'keywords' => $category['keywords'],
                    'cat_alias' => $category['cat_alias'],
                    'style' => $category['style'],
                    'grade' => intval($category['grade']),
                    'filter_attr' => $category['filter_attr'],
                ]
            ], 200);
            return;
        }
        
        // Lấy danh sách tất cả danh mục (có SEO fields)
        $sql = "SELECT 
                    cat_id,
                    cat_name,
                    parent_id,
                    sort_order,
                    is_show,
                    cat_desc,
                    keywords,
                    cat_alias
                FROM " . $ecs->table('category') . "
                WHERE is_show = 1
                ORDER BY parent_id ASC, sort_order ASC, cat_id ASC";
        
        $result = $db->getAll($sql);
        
        if ($result === false) {
            throw new Exception("Lỗi truy vấn database");
        }
        
        // Build response data
        $categories = [];
        foreach ($result as $row) {
            $categories[] = [
                'cat_id' => intval($row['cat_id']),
                'cat_name' => $row['cat_name'],
                'parent_id' => intval($row['parent_id']),
                'sort_order' => intval($row['sort_order']),
                'cat_desc' => $row['cat_desc'],
                'keywords' => $row['keywords'],
                'cat_alias' => $row['cat_alias'],
            ];
        }
        
        send_json_response([
            'error' => false,
            'message' => 'Lấy danh sách danh mục thành công.',
            'total' => count($categories),
            'data' => $categories
        ], 200);
        
    } catch (Exception $e) {
        send_json_response([
            'error' => true,
            'message' => 'Lỗi server: ' . $e->getMessage()
        ], 500);
    }
}

/**
 * Lấy danh sách thương hiệu từ database
 * URL: ?action=get_brands
 * Optional: ?action=get_brands&brand_id=123 (lấy chi tiết 1 thương hiệu)
 * NOTE: Renamed to api_get_brands to avoid conflict with ECShop lib_common.php
 */
function api_get_brands()
{
    global $db, $ecs;
    
    // Kiểm tra nếu cần lấy chi tiết 1 thương hiệu
    $brand_id = isset($_GET['brand_id']) ? intval($_GET['brand_id']) : 0;
    
    try {
        if ($brand_id > 0) {
            // Lấy chi tiết 1 thương hiệu
            $sql = "SELECT 
                        brand_id,
                        brand_name,
                        brand_logo,
                        brand_desc,
                        site_url,
                        sort_order,
                        is_show,
                        brand_cat_desc,
                        brand_long_desc,
                        brand_keyword,
                        brand_meta_title,
                        brand_meta_desc
                    FROM " . $ecs->table('brand') . "
                    WHERE brand_id = '$brand_id'";
            
            $brand = $db->getRow($sql);
            
            if (!$brand) {
                send_json_response([
                    'error' => true,
                    'message' => "Không tìm thấy thương hiệu với ID: $brand_id"
                ], 404);
            }
            
            send_json_response([
                'error' => false,
                'message' => 'Lấy chi tiết thương hiệu thành công.',
                'data' => [
                    'brand_id' => intval($brand['brand_id']),
                    'brand_name' => $brand['brand_name'],
                    'brand_logo' => $brand['brand_logo'],
                    'brand_desc' => $brand['brand_desc'],
                    'site_url' => $brand['site_url'],
                    'sort_order' => intval($brand['sort_order']),
                    'short_desc' => $brand['brand_cat_desc'],
                    'long_desc' => $brand['brand_long_desc'],
                    'keywords' => $brand['brand_keyword'],
                    'meta_title' => $brand['brand_meta_title'],
                    'meta_desc' => $brand['brand_meta_desc'],
                ]
            ], 200);
            return;
        }
        
        // Lấy danh sách tất cả thương hiệu
        $sql = "SELECT 
                    brand_id,
                    brand_name,
                    brand_logo,
                    brand_desc,
                    site_url,
                    sort_order,
                    is_show,
                    brand_cat_desc,
                    brand_long_desc,
                    brand_keyword,
                    brand_meta_title,
                    brand_meta_desc
                FROM " . $ecs->table('brand') . "
                WHERE is_show = 1
                ORDER BY sort_order ASC, brand_id ASC";
        
        $result = $db->getAll($sql);
        
        if ($result === false) {
            throw new Exception("Lỗi truy vấn database");
        }
        
        // Build response data
        $brands = [];
        foreach ($result as $row) {
            $brands[] = [
                'brand_id' => intval($row['brand_id']),
                'brand_name' => $row['brand_name'],
                'brand_logo' => $row['brand_logo'],
                'brand_desc' => $row['brand_desc'],
                'site_url' => $row['site_url'],
                'sort_order' => intval($row['sort_order']),
                'short_desc' => $row['brand_cat_desc'],
                'long_desc' => $row['brand_long_desc'],
                'keywords' => $row['brand_keyword'],
                'meta_title' => $row['brand_meta_title'],
                'meta_desc' => $row['brand_meta_desc'],
            ];
        }
        
        send_json_response([
            'error' => false,
            'message' => 'Lấy danh sách thương hiệu thành công.',
            'total' => count($brands),
            'data' => $brands
        ], 200);
        
    } catch (Exception $e) {
        send_json_response([
            'error' => true,
            'message' => 'Lỗi server: ' . $e->getMessage()
        ], 500);
    }
}

/**
 * Cập nhật thông tin danh mục (SEO, mô tả)
 * URL: POST ?action=update_category&cat_id=123
 * Body JSON: { cat_desc, keywords, cat_alias }
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

/**
 * Cập nhật thông tin thương hiệu (SEO, mô tả)
 * URL: POST ?action=update_brand&brand_id=123
 * Body JSON: { brand_name, brand_desc, site_url }
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
        
        // Các trường có thể cập nhật
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
        // SEO fields
        if (isset($data['short_desc'])) {
            $update_fields[] = "brand_cat_desc = '" . addslashes(trim($data['short_desc'])) . "'";
        }
        if (isset($data['long_desc'])) {
            $update_fields[] = "brand_long_desc = '" . addslashes(trim($data['long_desc'])) . "'";
        }
        if (isset($data['keywords'])) {
            $update_fields[] = "brand_keyword = '" . addslashes(trim($data['keywords'])) . "'";
        }
        if (isset($data['meta_title'])) {
            $update_fields[] = "brand_meta_title = '" . addslashes(trim($data['meta_title'])) . "'";
        }
        if (isset($data['meta_desc'])) {
            $update_fields[] = "brand_meta_desc = '" . addslashes(trim($data['meta_desc'])) . "'";
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
?>