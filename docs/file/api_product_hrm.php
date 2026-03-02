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
 * 
 * Cải tiến:
 * - Validate kỹ hơn file ảnh đầu vào
 * - Kiểm tra file có phải ảnh thực sự không (không phải HTML/redirect)
 * - Fallback về copy nguyên file nếu không convert được WebP
 */
function create_resized_image_webp($source_path, $dest_folder, $new_filename_without_ext, $max_width, $max_height) {
    // Kiểm tra file tồn tại
    if (!file_exists($source_path)) {
        error_log("PKGX API: File không tồn tại: $source_path");
        return false;
    }
    
    // Kiểm tra kích thước file (tối thiểu 1KB để loại bỏ file rỗng/lỗi)
    $filesize = filesize($source_path);
    if ($filesize < 1024) {
        error_log("PKGX API: File quá nhỏ (có thể bị lỗi): $source_path - Size: $filesize bytes");
        return false;
    }
    
    // Kiểm tra xem có phải file HTML (redirect/error page) không
    $first_bytes = file_get_contents($source_path, false, null, 0, 100);
    if (stripos($first_bytes, '<!DOCTYPE') !== false || stripos($first_bytes, '<html') !== false) {
        error_log("PKGX API: File là HTML, không phải ảnh: $source_path");
        return false;
    }
    
    // Lấy thông tin ảnh
    $source_info = @getimagesize($source_path);
    if (!$source_info) {
        error_log("PKGX API: Không thể đọc thông tin ảnh: $source_path");
        return false;
    }
    
    $width = $source_info[0];
    $height = $source_info[1];
    $mime = $source_info['mime'];
    
    // Validate dimensions
    if ($width < 1 || $height < 1) {
        error_log("PKGX API: Kích thước ảnh không hợp lệ: {$width}x{$height}");
        return false;
    }
    
    // Tạo source image từ file
    $source_image = null;
    switch ($mime) {
        case 'image/jpeg':
            $source_image = @imagecreatefromjpeg($source_path);
            break;
        case 'image/gif':
            $source_image = @imagecreatefromgif($source_path);
            break;
        case 'image/png':
            $source_image = @imagecreatefrompng($source_path);
            break;
        case 'image/webp':
            $source_image = @imagecreatefromwebp($source_path);
            break;
        default:
            error_log("PKGX API: MIME type không hỗ trợ: $mime");
            return false;
    }
    
    if (!$source_image) {
        error_log("PKGX API: Không thể tạo image resource từ file: $source_path");
        return false;
    }
    
    // Tính toán kích thước mới giữ tỉ lệ
    $ratio = $width / $height;
    if ($max_width / $max_height > $ratio) {
        $new_width = (int)($max_height * $ratio);
        $new_height = $max_height;
    } else {
        $new_height = (int)($max_width / $ratio);
        $new_width = $max_width;
    }
    
    // Đảm bảo kích thước tối thiểu
    $new_width = max(1, $new_width);
    $new_height = max(1, $new_height);
    
    // Tạo ảnh mới
    $dest_image = imagecreatetruecolor($new_width, $new_height);
    if (!$dest_image) {
        error_log("PKGX API: Không thể tạo destination image");
        imagedestroy($source_image);
        return false;
    }
    
    // Xử lý transparency
    imagealphablending($dest_image, false);
    imagesavealpha($dest_image, true);
    $transparent = imagecolorallocatealpha($dest_image, 255, 255, 255, 127);
    imagefilledrectangle($dest_image, 0, 0, $new_width, $new_height, $transparent);
    
    // Resize ảnh
    imagecopyresampled($dest_image, $source_image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
    
    // Lưu file WebP
    $dest_path_with_ext = $dest_folder . $new_filename_without_ext . '.webp';
    $result = @imagewebp($dest_image, $dest_path_with_ext, 80);
    
    // Giải phóng bộ nhớ
    imagedestroy($source_image);
    imagedestroy($dest_image);
    
    if (!$result || !file_exists($dest_path_with_ext)) {
        error_log("PKGX API: Không thể lưu file WebP: $dest_path_with_ext");
        return false;
    }
    
    // Kiểm tra file output có hợp lệ không
    $output_size = filesize($dest_path_with_ext);
    if ($output_size < 100) {
        error_log("PKGX API: File WebP output quá nhỏ: $output_size bytes");
        @unlink($dest_path_with_ext);
        return false;
    }
    
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
} else if ($action === 'update_member_price') {
    // ACTION: Cập nhật giá thành viên theo user_rank
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        send_json_response(['error' => true, 'message' => 'Phương thức yêu cầu không hợp lệ. Chỉ hỗ trợ POST.'], 405);
    }
    $goods_id = isset($_GET['goods_id']) ? intval($_GET['goods_id']) : 0;
    if ($goods_id === 0) {
        send_json_response(['error' => true, 'message' => "Thiếu ID sản phẩm (goods_id) trong URL."], 400);
    }
    update_member_price($goods_id, $data);
} else if ($action === 'get_member_ranks') {
    // ACTION: Lấy danh sách hạng thành viên
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        send_json_response(['error' => true, 'message' => 'Phương thức yêu cầu không hợp lệ. Chỉ hỗ trợ GET.'], 405);
    }
    get_member_ranks();
} else if ($action === 'upload_image_from_url') {
    // ACTION: Upload ảnh từ URL (server-to-server, tránh CORS)
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        send_json_response(['error' => true, 'message' => 'Phương thức yêu cầu không hợp lệ. Chỉ hỗ trợ POST.'], 405);
    }
    upload_image_from_url($data);
} else if ($action === 'get_gallery') {
    // ACTION: Lấy gallery ảnh sản phẩm
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        send_json_response(['error' => true, 'message' => 'Phương thức yêu cầu không hợp lệ. Chỉ hỗ trợ GET.'], 405);
    }
    $goods_id = isset($_GET['goods_id']) ? intval($_GET['goods_id']) : 0;
    if ($goods_id === 0) {
        send_json_response(['error' => true, 'message' => "Thiếu ID sản phẩm (goods_id) trong URL."], 400);
    }
    get_product_gallery($goods_id);
} else if ($action === 'update_category_basic') {
    // ACTION: Cập nhật thông tin cơ bản danh mục (tên, parent, hiển thị)
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        send_json_response(['error' => true, 'message' => 'Phương thức yêu cầu không hợp lệ. Chỉ hỗ trợ POST.'], 405);
    }
    $cat_id = isset($_GET['cat_id']) ? intval($_GET['cat_id']) : 0;
    if ($cat_id === 0) {
        send_json_response(['error' => true, 'message' => "Thiếu ID danh mục (cat_id) trong URL."], 400);
    }
    update_category_basic($cat_id, $data);
} else {
    // Nếu hành động không hợp lệ
    send_json_response(['error' => true, 'message' => "Hành động không hợp lệ. Các action hỗ trợ: create_product, update_product, get_products, upload_product_image, upload_image_from_url, get_categories, update_category, update_category_basic, get_brands, update_brand, update_member_price, get_member_ranks, get_gallery."], 400);
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
            
            // Lấy giá ACE từ member_price (user_rank = 8)
            $ace_price = $db->getOne("SELECT user_price FROM " . $ecs->table('member_price') . " WHERE goods_id = '$goods_id' AND user_rank = 8");
            $product['ace_price'] = $ace_price ? floatval($ace_price) : 0;
            
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
        
        // Lấy slug và giá ACE cho mỗi sản phẩm
        foreach ($products as &$product) {
            $slug = $db->getOne("SELECT slug FROM " . $ecs->table('slug') . " WHERE id = '" . $product['goods_id'] . "' AND module = 'goods'");
            $product['slug'] = $slug;
            
            // Lấy giá ACE từ member_price (user_rank = 8)
            $ace_price = $db->getOne("SELECT user_price FROM " . $ecs->table('member_price') . " WHERE goods_id = '" . $product['goods_id'] . "' AND user_rank = 8");
            $product['ace_price'] = $ace_price ? floatval($ace_price) : 0;
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

    // DEBUG: Log dữ liệu nhận được để kiểm tra
    error_log("PKGX CREATE_PRODUCT - Raw data received: " . json_encode($data, JSON_UNESCAPED_UNICODE));

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
        $is_on_sale = !empty($data['is_on_sale']) ? 1 : 0; // Hiển thị trên website

        // --- Chèn sản phẩm vào CSDL ---
        if (empty($goods_sn)) { $max_id = $db->getOne("SELECT MAX(goods_id) + 1 FROM " . $ecs->table('goods')); $goods_sn = generate_goods_sn($max_id); } 
        else { if (check_goods_sn_exist($goods_sn)) { throw new Exception("Mã sản phẩm '$goods_sn' đã tồn tại."); }}
        $add_time = gmtime(); $last_update = gmtime();
        
        // Insert product với đầy đủ fields
        $sql_pre_insert = "INSERT INTO " . $ecs->table('goods') . 
            " (goods_name, cat_id, brand_id, shop_price, market_price, partner_price, ace_price, deal_price, goods_number, goods_desc, keywords, goods_brief, meta_title, meta_desc, goods_sn, is_on_sale, add_time, last_update, is_alone_sale, goods_type, is_shipping, seller_note, is_best, is_hot, is_new, is_home)" .
            " VALUES ('" . addslashes($goods_name) . "', '" . $cat_id . "', '" . $brand_id . "', '" . $shop_price . "', '" . $market_price . "', '" . $partner_price . "', '" . $ace_price . "', '" . $deal_price . "', '" . $goods_number . "', '" . addslashes($goods_desc) . "', '" . addslashes($keywords) . "', '" . addslashes($goods_brief) . "', '" . addslashes($meta_title) . "', '" . addslashes($meta_desc) . "', '" . addslashes($goods_sn) . "', '" . $is_on_sale . "', '" . $add_time . "', '" . $last_update . "', '1', '0', '0', '" . addslashes($seller_note) . "', '" . $is_best . "', '" . $is_hot . "', '" . $is_new . "', '" . $is_home . "')";
        
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

        // --- Thêm giá ACE vào member_price nếu có ---
        // ACE = user_rank 8 trong bảng ecs_member_price
        if ($ace_price > 0) {
            $db->query("DELETE FROM " . $ecs->table('member_price') . " WHERE goods_id = '$goods_id' AND user_rank = 8");
            $db->autoExecute($ecs->table('member_price'), [
                'goods_id' => $goods_id,
                'user_rank' => 8,
                'user_price' => $ace_price
            ], 'INSERT');
        }

        // --- XỬ LÝ GALLERY IMAGES (album ảnh) ---
        $gallery_synced = 0;
        if (isset($data['gallery_images']) && is_array($data['gallery_images']) && count($data['gallery_images']) > 0) {
            $gallery_images = $data['gallery_images'];
            
            $sort_order = 0;
            foreach ($gallery_images as $img_url) {
                $img_url = trim($img_url);
                if (empty($img_url)) continue;
                
                // Bỏ qua URL external (http/https) - chỉ xử lý file local
                if (preg_match('/^https?:\/\//i', $img_url)) {
                    error_log("PKGX API Create: Bỏ qua URL external cho gallery image: " . $img_url);
                    $sort_order++;
                    continue;
                }
                
                // Chuẩn hóa path (loại bỏ cdn/ prefix nếu có)
                $gallery_cleaned_path = preg_replace('/^(cdn\/)+/', '', $img_url);
                $gallery_cleaned_path = preg_replace('/(images\/)+/', 'images/', $gallery_cleaned_path);
                $gallery_cleaned_path = preg_replace('/(source_img\/)+/', 'source_img/', $gallery_cleaned_path);
                
                $gallery_source_path = ROOT_PATH . 'cdn/' . $gallery_cleaned_path;
                
                if (file_exists($gallery_source_path)) {
                    $gallery_base_dir = dirname($gallery_cleaned_path);
                    $gallery_basename = pathinfo($gallery_source_path, PATHINFO_FILENAME);
                    
                    $gallery_goods_dir = ROOT_PATH . 'cdn/images/' . $gallery_base_dir . '/goods_img/';
                    $gallery_thumb_dir = ROOT_PATH . 'cdn/images/' . $gallery_base_dir . '/thumb_img/';
                    
                    if (!is_dir($gallery_goods_dir)) mkdir($gallery_goods_dir, 0755, true);
                    if (!is_dir($gallery_thumb_dir)) mkdir($gallery_thumb_dir, 0755, true);
                    
                    if (is_writable($gallery_goods_dir) && is_writable($gallery_thumb_dir)) {
                        // Tạo ảnh resize với suffix để tránh trùng
                        $gallery_img = create_resized_image_webp($gallery_source_path, $gallery_goods_dir, $gallery_basename . '_g' . $sort_order, $_CFG['image_width'], $_CFG['image_height']);
                        $gallery_thumb = create_resized_image_webp($gallery_source_path, $gallery_thumb_dir, $gallery_basename . '_t' . $sort_order, $_CFG['thumb_width'], $_CFG['thumb_height']);
                        
                        // Loại bỏ cdn/ prefix
                        if (substr($gallery_img, 0, 4) === 'cdn/') $gallery_img = substr($gallery_img, 4);
                        if (substr($gallery_thumb, 0, 4) === 'cdn/') $gallery_thumb = substr($gallery_thumb, 4);
                        
                        // Insert vào goods_gallery
                        $insert_gallery = [
                            'goods_id' => $goods_id,
                            'img_url' => $gallery_img,
                            'img_desc' => '',
                            'thumb_url' => $gallery_thumb,
                            'img_original' => $gallery_cleaned_path,
                            'img_sort' => $sort_order
                        ];
                        $db->autoExecute($ecs->table('goods_gallery'), $insert_gallery, 'INSERT');
                        $gallery_synced++;
                    }
                }
                $sort_order++;
            }
        }

        // --- Hoàn tất ---
        clear_cache_files();
        send_json_response([
            'error' => false, 
            'message' => 'Sản phẩm đã được tạo thành công.', 
            'goods_id' => $goods_id, 
            'created_slug' => $slug, 
            'ace_price_synced' => ($ace_price > 0),
            'gallery_synced' => $gallery_synced
        ], 201);

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
        // Array keys - chấp nhận mảng (gallery images)
        $array_keys = ['gallery_images'];
        
        if (in_array($key, $boolean_keys)) {
            $filtered_data[$key] = $value;
        } else if (in_array($key, $text_keys)) {
            // Text fields: luôn chấp nhận, kể cả rỗng
            $filtered_data[$key] = $value;
        } else if (in_array($key, $array_keys) && is_array($value)) {
            // Array fields: chấp nhận nếu là mảng
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
            
            // Kiểm tra nếu là URL external (http/https) - bỏ qua vì không thể xử lý file từ xa
            if (preg_match('/^https?:\/\//i', $original_img_path_raw)) {
                // External URL - không xử lý, ghi log warning
                error_log("PKGX API Warning: Bỏ qua URL external cho original_img: " . $original_img_path_raw);
                // Không throw exception, tiếp tục xử lý các field khác
            } else {
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
        }

        // --- XỬ LÝ GALLERY IMAGES (album ảnh) ---
        $gallery_synced = 0;
        if (isset($filtered_data['gallery_images']) && is_array($filtered_data['gallery_images']) && count($filtered_data['gallery_images']) > 0) {
            $gallery_images = $filtered_data['gallery_images'];
            
            // Xóa gallery cũ trước khi thêm mới
            $db->query("DELETE FROM " . $ecs->table('goods_gallery') . " WHERE goods_id = '$goods_id'");
            
            $sort_order = 0;
            foreach ($gallery_images as $img_url) {
                $img_url = trim($img_url);
                if (empty($img_url)) continue;
                
                // Bỏ qua URL external (http/https) - chỉ xử lý file local
                if (preg_match('/^https?:\/\//i', $img_url)) {
                    error_log("PKGX API Warning: Bỏ qua URL external cho gallery image: " . $img_url);
                    $sort_order++;
                    continue;
                }
                
                // Chuẩn hóa path (loại bỏ cdn/ prefix nếu có)
                $gallery_cleaned_path = preg_replace('/^(cdn\/)+/', '', $img_url);
                $gallery_cleaned_path = preg_replace('/(images\/)+/', 'images/', $gallery_cleaned_path);
                $gallery_cleaned_path = preg_replace('/(source_img\/)+/', 'source_img/', $gallery_cleaned_path);
                
                $gallery_source_path = ROOT_PATH . 'cdn/' . $gallery_cleaned_path;
                
                if (file_exists($gallery_source_path)) {
                    $gallery_base_dir = dirname($gallery_cleaned_path);
                    $gallery_basename = pathinfo($gallery_source_path, PATHINFO_FILENAME);
                    
                    $gallery_goods_dir = ROOT_PATH . 'cdn/images/' . $gallery_base_dir . '/goods_img/';
                    $gallery_thumb_dir = ROOT_PATH . 'cdn/images/' . $gallery_base_dir . '/thumb_img/';
                    
                    if (!is_dir($gallery_goods_dir)) mkdir($gallery_goods_dir, 0755, true);
                    if (!is_dir($gallery_thumb_dir)) mkdir($gallery_thumb_dir, 0755, true);
                    
                    if (is_writable($gallery_goods_dir) && is_writable($gallery_thumb_dir)) {
                        // Tạo ảnh resize với suffix để tránh trùng
                        $gallery_img = create_resized_image_webp($gallery_source_path, $gallery_goods_dir, $gallery_basename . '_g' . $sort_order, $_CFG['image_width'], $_CFG['image_height']);
                        $gallery_thumb = create_resized_image_webp($gallery_source_path, $gallery_thumb_dir, $gallery_basename . '_t' . $sort_order, $_CFG['thumb_width'], $_CFG['thumb_height']);
                        
                        // Loại bỏ cdn/ prefix
                        if (substr($gallery_img, 0, 4) === 'cdn/') $gallery_img = substr($gallery_img, 4);
                        if (substr($gallery_thumb, 0, 4) === 'cdn/') $gallery_thumb = substr($gallery_thumb, 4);
                        
                        // Insert vào goods_gallery
                        $insert_gallery = [
                            'goods_id' => $goods_id,
                            'img_url' => $gallery_img,
                            'img_desc' => '',
                            'thumb_url' => $gallery_thumb,
                            'img_original' => $gallery_cleaned_path,
                            'img_sort' => $sort_order
                        ];
                        $db->autoExecute($ecs->table('goods_gallery'), $insert_gallery, 'INSERT');
                        $gallery_synced++;
                    }
                }
                $sort_order++;
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
                ],
                'gallery_synced' => isset($gallery_synced) ? $gallery_synced : 0
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
 * Upload ảnh từ URL (server-to-server, tránh CORS)
 * Server PKGX sẽ tự download ảnh từ URL rồi xử lý như upload thông thường
 * 
 * Parameters (JSON body):
 *   - image_url: URL của ảnh cần upload (bắt buộc)
 *   - filename_slug: Tên file (không có extension, optional)
 *   - goods_id: ID sản phẩm để gán ảnh (optional)
 */
function upload_image_from_url($data)
{
    global $db, $ecs, $_CFG;
    
    // --- 1. Lấy và validate URL ---
    $image_url = isset($data['image_url']) ? trim($data['image_url']) : '';
    
    if (empty($image_url)) {
        send_json_response([
            'error' => true, 
            'message' => 'Thiếu image_url trong request body.'
        ], 400);
    }
    
    // Validate URL format
    if (!filter_var($image_url, FILTER_VALIDATE_URL)) {
        send_json_response([
            'error' => true, 
            'message' => 'URL không hợp lệ: ' . $image_url
        ], 400);
    }
    
    // --- 2. Download ảnh từ URL ---
    $ch = curl_init($image_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_MAXREDIRS, 5);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    
    $image_data = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $content_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    $curl_error = curl_error($ch);
    curl_close($ch);
    
    if ($http_code !== 200 || !$image_data) {
        send_json_response([
            'error' => true, 
            'message' => 'Không thể tải ảnh từ URL. HTTP: ' . $http_code . ($curl_error ? ', Error: ' . $curl_error : '')
        ], 400);
    }
    
    // --- 3. Validate content type ---
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $is_valid_type = false;
    foreach ($allowed_types as $allowed) {
        if (strpos($content_type, $allowed) !== false) {
            $is_valid_type = true;
            break;
        }
    }
    
    // Nếu content-type không rõ, kiểm tra bằng magic bytes
    if (!$is_valid_type) {
        $magic_bytes = substr($image_data, 0, 16);
        if (substr($magic_bytes, 0, 3) === "\xff\xd8\xff") {
            $content_type = 'image/jpeg';
            $is_valid_type = true;
        } elseif (substr($magic_bytes, 0, 8) === "\x89PNG\r\n\x1a\n") {
            $content_type = 'image/png';
            $is_valid_type = true;
        } elseif (substr($magic_bytes, 0, 4) === "RIFF" && substr($magic_bytes, 8, 4) === "WEBP") {
            $content_type = 'image/webp';
            $is_valid_type = true;
        } elseif (substr($magic_bytes, 0, 6) === "GIF87a" || substr($magic_bytes, 0, 6) === "GIF89a") {
            $content_type = 'image/gif';
            $is_valid_type = true;
        }
    }
    
    if (!$is_valid_type) {
        // Kiểm tra xem có phải HTML không (redirect page)
        if (stripos($image_data, '<!DOCTYPE') !== false || stripos($image_data, '<html') !== false) {
            send_json_response([
                'error' => true, 
                'message' => 'URL trả về HTML thay vì ảnh. Có thể bị redirect hoặc cần authentication.'
            ], 400);
        }
        
        send_json_response([
            'error' => true, 
            'message' => 'Định dạng file không hợp lệ. Content-Type: ' . $content_type . '. Chỉ hỗ trợ: JPEG, PNG, GIF, WebP.'
        ], 400);
    }
    
    // --- 4. Kiểm tra kích thước ---
    $file_size = strlen($image_data);
    $max_size = 10 * 1024 * 1024; // 10MB
    
    if ($file_size > $max_size) {
        send_json_response([
            'error' => true, 
            'message' => 'Ảnh quá lớn (' . round($file_size / 1024 / 1024, 2) . 'MB). Kích thước tối đa: 10MB.'
        ], 400);
    }
    
    if ($file_size < 1024) {
        send_json_response([
            'error' => true, 
            'message' => 'Ảnh quá nhỏ hoặc bị lỗi (' . $file_size . ' bytes).'
        ], 400);
    }
    
    // --- 5. Tạo tên file và thư mục ---
    $filename_slug = isset($data['filename_slug']) && !empty($data['filename_slug']) 
        ? trim($data['filename_slug']) 
        : 'img-' . date('YmdHis');
    
    $filename_slug = create_safe_filename($filename_slug);
    
    $month_folder = date('Ym');
    
    // Xác định extension từ content-type
    $ext = 'jpg';
    if (strpos($content_type, 'png') !== false) $ext = 'png';
    elseif (strpos($content_type, 'webp') !== false) $ext = 'webp';
    elseif (strpos($content_type, 'gif') !== false) $ext = 'gif';
    
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
    
    // --- 6. Lưu file gốc ---
    $source_filename = $filename_slug . '.' . $ext;
    $source_full_path = $source_dir . $source_filename;
    
    $counter = 1;
    while (file_exists($source_full_path)) {
        $source_filename = $filename_slug . '-' . $counter . '.' . $ext;
        $source_full_path = $source_dir . $source_filename;
        $counter++;
    }
    
    $final_filename = pathinfo($source_filename, PATHINFO_FILENAME);
    
    if (file_put_contents($source_full_path, $image_data) === false) {
        send_json_response([
            'error' => true, 
            'message' => 'Không thể lưu file lên server.'
        ], 500);
    }
    
    // --- 7. Tạo ảnh resize ---
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
            'message' => 'Không thể xử lý ảnh. File có thể bị hỏng.'
        ], 500);
    }
    
    // --- 8. Chuẩn hóa đường dẫn ---
    $original_img_db = 'images/' . $month_folder . '/source_img/' . $source_filename;
    $goods_img_db = str_replace(ROOT_PATH . 'cdn/', '', $goods_img_path);
    $thumb_img_db = str_replace(ROOT_PATH . 'cdn/', '', $thumb_img_path);
    
    if (substr($goods_img_db, 0, 4) === 'cdn/') { $goods_img_db = substr($goods_img_db, 4); }
    if (substr($thumb_img_db, 0, 4) === 'cdn/') { $thumb_img_db = substr($thumb_img_db, 4); }
    
    // --- 9. Cập nhật vào sản phẩm nếu có goods_id ---
    $goods_id = isset($data['goods_id']) ? intval($data['goods_id']) : 0;
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
    
    // --- 10. Trả về response ---
    $cdn_base_url = 'https://phukiengiaxuong.com.vn/cdn/';
    
    $response = [
        'error' => false,
        'message' => $product_updated ? 'Upload ảnh từ URL và cập nhật sản phẩm thành công.' : 'Upload ảnh từ URL thành công.',
        'data' => [
            'original_img' => $original_img_db,
            'goods_img' => $goods_img_db,
            'goods_thumb' => $thumb_img_db,
            'source_url' => $image_url,
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
                        long_desc,
                        keywords,
                        meta_title,
                        meta_desc,
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
                    'long_desc' => $category['long_desc'] ?? '',
                    'keywords' => $category['keywords'],
                    'meta_title' => $category['meta_title'] ?? '',
                    'meta_desc' => $category['meta_desc'] ?? '',
                    'cat_alias' => $category['cat_alias'],
                    'style' => $category['style'],
                    'grade' => intval($category['grade']),
                    'filter_attr' => $category['filter_attr'],
                ]
            ], 200);
            return;
        }
        
        // Lấy danh sách tất cả danh mục (có SEO fields)
        // Bỏ filter is_show để lấy tất cả categories (kể cả đang ẩn)
        $sql = "SELECT * FROM " . $ecs->table('category') . "
                ORDER BY parent_id ASC, sort_order ASC, cat_id ASC";
        
        $result = $db->getAll($sql);
        
        if ($result === false || $result === null) {
            // Log lỗi để debug
            error_log("PKGX API get_categories error - SQL: $sql");
            throw new Exception("Lỗi truy vấn database");
        }
        
        // Nếu không có kết quả, trả về mảng rỗng
        if (empty($result)) {
            send_json_response([
                'error' => false,
                'message' => 'Không có danh mục nào.',
                'total' => 0,
                'data' => []
            ], 200);
            return;
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
                'long_desc' => $row['long_desc'] ?? '',
                'keywords' => $row['keywords'],
                'meta_title' => $row['meta_title'] ?? '',
                'meta_desc' => $row['meta_desc'] ?? '',
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
                        brand_cat_desc,
                        brand_long_desc,
                        brand_keyword,
                        brand_meta_title,
                        site_url,
                        sort_order,
                        is_show
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
                    'short_desc' => $brand['brand_cat_desc'] ?? '',
                    'long_desc' => $brand['brand_long_desc'] ?? '',
                    'keywords' => $brand['brand_keyword'] ?? '',
                    'meta_title' => $brand['brand_meta_title'] ?? '',
                    'meta_desc' => $brand['brand_desc'] ?? '',
                    'site_url' => $brand['site_url'],
                    'sort_order' => intval($brand['sort_order']),
                ]
            ], 200);
            return;
        }
        
        // Lấy danh sách tất cả thương hiệu (bao gồm cả đang ẩn)
        $sql = "SELECT 
                    brand_id,
                    brand_name,
                    brand_logo,
                    brand_desc,
                    brand_cat_desc,
                    brand_long_desc,
                    brand_keyword,
                    brand_meta_title,
                    site_url,
                    sort_order,
                    is_show
                FROM " . $ecs->table('brand') . "
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
                'short_desc' => $row['brand_cat_desc'] ?? '',
                'long_desc' => $row['brand_long_desc'] ?? '',
                'keywords' => $row['brand_keyword'] ?? '',
                'meta_title' => $row['brand_meta_title'] ?? '',
                'meta_desc' => $row['brand_desc'] ?? '',
                'site_url' => $row['site_url'],
                'sort_order' => intval($row['sort_order']),
                'is_show' => intval($row['is_show']),
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
 * Body JSON: { cat_desc, keywords, cat_alias, meta_title, meta_desc, short_desc }
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
        // NOTE: cat_alias column does NOT exist in category table - removed
        // SEO fields
        if (isset($data['meta_title'])) {
            $update_fields[] = "meta_title = '" . addslashes(trim($data['meta_title'])) . "'";
        }
        if (isset($data['meta_desc'])) {
            $update_fields[] = "meta_desc = '" . addslashes(trim($data['meta_desc'])) . "'";
        }
        // Mô tả dài -> long_desc
        if (isset($data['long_desc'])) {
            $update_fields[] = "long_desc = '" . addslashes(trim($data['long_desc'])) . "'";
        }
        if (isset($data['style'])) {
            $update_fields[] = "style = '" . addslashes(trim($data['style'])) . "'";
        }
        if (isset($data['sort_order'])) {
            $update_fields[] = "sort_order = '" . intval($data['sort_order']) . "'";
        }
        
        // DEBUG: Log what we're doing
        $debug_info = [
            'data_received' => $data,
            'data_type' => gettype($data),
            'data_keys' => is_array($data) ? array_keys($data) : 'not_array',
            'update_fields_count' => count($update_fields),
            'update_fields' => $update_fields
        ];
        
        $sql_executed = null;
        $query_result = null;
        $db_error = null;
        if (!empty($update_fields)) {
            $sql = "UPDATE " . $ecs->table('category') . " SET " . implode(', ', $update_fields) . " WHERE cat_id = '$cat_id'";
            $sql_executed = $sql;
            $query_result = $db->query($sql);
            $db_error = $db->error();
        }
        
        clear_cache_files();
        
        send_json_response([
            'error' => false,
            'message' => 'Cập nhật danh mục thành công.',
            'cat_id' => $cat_id,
            'debug' => $debug_info,
            'sql_executed' => $sql_executed,
            'query_result' => $query_result,
            'db_error' => $db_error,
            'file_version' => 'v4_20251218_155600'
        ], 200);
        
    } catch (Exception $e) {
        send_json_response(['error' => true, 'message' => $e->getMessage()], 500);
    }
}

/**
 * Cập nhật thông tin cơ bản danh mục (tên, parent, hiển thị trang chủ)
 * URL: POST ?action=update_category_basic&cat_id=123
 * Body JSON: { cat_name, parent_id, is_show }
 * 
 * Các trường:
 * - cat_name: Tên danh mục
 * - parent_id: ID danh mục cha (0 = gốc)
 * - is_show: 1 = Hiển thị, 0 = Ẩn (Display in Category Home)
 */
function update_category_basic($cat_id, $data)
{
    global $db, $ecs;
    
    $cat_id = intval($cat_id);
    if ($cat_id <= 0) {
        send_json_response(['error' => true, 'message' => "ID danh mục không hợp lệ."], 400);
        return;
    }
    
    // Kiểm tra danh mục tồn tại
    $category = $db->getRow("SELECT cat_id, cat_name, parent_id, is_show FROM " . $ecs->table('category') . " WHERE cat_id = '$cat_id'");
    if (!$category) {
        send_json_response(['error' => true, 'message' => "Danh mục với ID '$cat_id' không tồn tại."], 404);
        return;
    }
    
    if (empty($data)) {
        send_json_response(['error' => false, 'message' => 'Không có dữ liệu nào được gửi để cập nhật.', 'cat_id' => $cat_id, 'current_data' => $category], 200);
        return;
    }
    
    try {
        $update_fields = [];
        $changes = [];
        
        // Cập nhật tên danh mục
        if (isset($data['cat_name']) && !empty(trim($data['cat_name']))) {
            $new_cat_name = addslashes(trim($data['cat_name']));
            $update_fields[] = "cat_name = '" . $new_cat_name . "'";
            $changes['cat_name'] = ['old' => $category['cat_name'], 'new' => trim($data['cat_name'])];
        }
        
        // Cập nhật parent_id
        if (isset($data['parent_id'])) {
            $new_parent_id = intval($data['parent_id']);
            
            // Validate: không cho phép chọn chính nó làm parent
            if ($new_parent_id === $cat_id) {
                send_json_response(['error' => true, 'message' => 'Không thể chọn chính danh mục làm danh mục cha.'], 400);
                return;
            }
            
            // Validate: parent_id phải tồn tại (trừ khi = 0)
            if ($new_parent_id > 0) {
                $parent_exists = $db->getOne("SELECT cat_id FROM " . $ecs->table('category') . " WHERE cat_id = '$new_parent_id'");
                if (!$parent_exists) {
                    send_json_response(['error' => true, 'message' => "Danh mục cha với ID '$new_parent_id' không tồn tại."], 400);
                    return;
                }
                
                // Validate: không cho phép chọn con cháu làm parent (tránh circular)
                $all_children = get_category_children_ids($cat_id);
                if (in_array($new_parent_id, $all_children)) {
                    send_json_response(['error' => true, 'message' => 'Không thể chọn danh mục con làm danh mục cha (tránh vòng lặp).'], 400);
                    return;
                }
            }
            
            $update_fields[] = "parent_id = '" . $new_parent_id . "'";
            $changes['parent_id'] = ['old' => intval($category['parent_id']), 'new' => $new_parent_id];
        }
        
        // Cập nhật is_show (Display in Category Home)
        if (isset($data['is_show'])) {
            $new_is_show = intval($data['is_show']) > 0 ? 1 : 0;
            $update_fields[] = "is_show = '" . $new_is_show . "'";
            $changes['is_show'] = ['old' => intval($category['is_show']), 'new' => $new_is_show];
        }
        
        if (empty($update_fields)) {
            send_json_response([
                'error' => false, 
                'message' => 'Không có trường nào được cập nhật.', 
                'cat_id' => $cat_id,
                'current_data' => $category
            ], 200);
            return;
        }
        
        $sql = "UPDATE " . $ecs->table('category') . " SET " . implode(', ', $update_fields) . " WHERE cat_id = '$cat_id'";
        $query_result = $db->query($sql);
        $db_error = $db->error();
        
        // Lấy lại data sau khi update
        $updated_category = $db->getRow("SELECT cat_id, cat_name, parent_id, is_show, sort_order FROM " . $ecs->table('category') . " WHERE cat_id = '$cat_id'");
        
        // Lấy tên parent nếu có
        $parent_name = null;
        if ($updated_category['parent_id'] > 0) {
            $parent_name = $db->getOne("SELECT cat_name FROM " . $ecs->table('category') . " WHERE cat_id = '" . $updated_category['parent_id'] . "'");
        }
        
        clear_cache_files();
        
        send_json_response([
            'error' => false,
            'message' => 'Cập nhật thông tin cơ bản danh mục thành công.',
            'cat_id' => $cat_id,
            'changes' => $changes,
            'data' => [
                'cat_id' => intval($updated_category['cat_id']),
                'cat_name' => $updated_category['cat_name'],
                'parent_id' => intval($updated_category['parent_id']),
                'parent_name' => $parent_name,
                'is_show' => intval($updated_category['is_show']),
                'sort_order' => intval($updated_category['sort_order'])
            ]
        ], 200);
        
    } catch (Exception $e) {
        send_json_response(['error' => true, 'message' => $e->getMessage()], 500);
    }
}

/**
 * Hàm lấy tất cả ID con cháu của một danh mục (recursive)
 * Dùng để validate tránh circular reference khi đổi parent
 */
function get_category_children_ids($cat_id)
{
    global $db, $ecs;
    
    $children = [];
    $cat_id = intval($cat_id);
    
    // Lấy con trực tiếp
    $direct_children = $db->getAll("SELECT cat_id FROM " . $ecs->table('category') . " WHERE parent_id = '$cat_id'");
    
    if ($direct_children) {
        foreach ($direct_children as $child) {
            $child_id = intval($child['cat_id']);
            $children[] = $child_id;
            // Recursive: lấy con của con
            $grandchildren = get_category_children_ids($child_id);
            $children = array_merge($children, $grandchildren);
        }
    }
    
    return $children;
}

/**
 * Cập nhật thông tin thương hiệu (SEO, mô tả)
 * URL: POST ?action=update_brand&brand_id=123
 * Body JSON: { brand_name, brand_desc, site_url, keywords, meta_title, meta_desc, short_desc, long_desc }
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
        // SEO fields - brand_keyword là cột keyword trong DB
        if (isset($data['keywords'])) {
            $update_fields[] = "brand_keyword = '" . addslashes(trim($data['keywords'])) . "'";
        }
        if (isset($data['meta_title'])) {
            $update_fields[] = "brand_meta_title = '" . addslashes(trim($data['meta_title'])) . "'";
        }
        if (isset($data['meta_desc'])) {
            $update_fields[] = "brand_desc = '" . addslashes(trim($data['meta_desc'])) . "'";
        }
        // Mô tả ngắn -> brand_cat_desc
        if (isset($data['short_desc'])) {
            $update_fields[] = "brand_cat_desc = '" . addslashes(trim($data['short_desc'])) . "'";
        }
        // Mô tả dài -> brand_long_desc
        if (isset($data['long_desc'])) {
            $update_fields[] = "brand_long_desc = '" . addslashes(trim($data['long_desc'])) . "'";
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

/**
 * Lấy danh sách hạng thành viên (user_rank)
 * URL: GET ?action=get_member_ranks
 * Response: Danh sách các hạng thành viên với rank_id và rank_name
 */
function get_member_ranks()
{
    global $db, $ecs;
    
    try {
        $sql = "SELECT rank_id, rank_name, min_points, max_points, discount, special_rank 
                FROM " . $ecs->table('user_rank') . " 
                ORDER BY min_points ASC";
        
        $result = $db->getAll($sql);
        
        if ($result === false) {
            throw new Exception("Lỗi truy vấn database");
        }
        
        $ranks = [];
        foreach ($result as $row) {
            $ranks[] = [
                'rank_id' => intval($row['rank_id']),
                'rank_name' => $row['rank_name'],
                'min_points' => intval($row['min_points']),
                'max_points' => intval($row['max_points']),
                'discount' => floatval($row['discount']),
                'special_rank' => intval($row['special_rank'])
            ];
        }
        
        send_json_response([
            'error' => false,
            'message' => 'Lấy danh sách hạng thành viên thành công.',
            'total' => count($ranks),
            'data' => $ranks
        ], 200);
        
    } catch (Exception $e) {
        send_json_response([
            'error' => true,
            'message' => 'Lỗi server: ' . $e->getMessage()
        ], 500);
    }
}

/**
 * Cập nhật giá thành viên theo user_rank
 * URL: POST ?action=update_member_price&goods_id=123
 * 
 * Body JSON có thể theo các format:
 * 
 * Format 1 - Cập nhật 1 giá:
 * { "user_rank": 1, "user_price": 50000 }
 * 
 * Format 2 - Cập nhật nhiều giá:
 * { "member_prices": [{"user_rank": 1, "user_price": 50000}, {"user_rank": 2, "user_price": 45000}] }
 * 
 * Format 3 - Dạng string như goods_batch.php:
 * { "member_price": "1:50000" } hoặc { "member_price": "1:50000,2:45000" }
 * 
 * Lưu ý: user_price = -1 sẽ sử dụng giá mặc định (theo discount của rank)
 *        user_price = 0 sẽ xóa giá riêng của rank đó
 */
function update_member_price($goods_id, $data)
{
    global $db, $ecs;
    
    $goods_id = intval($goods_id);
    if ($goods_id <= 0) {
        send_json_response(['error' => true, 'message' => "ID sản phẩm không hợp lệ."], 400);
        return;
    }
    
    // Kiểm tra sản phẩm tồn tại
    $product = $db->getRow("SELECT goods_id, goods_name FROM " . $ecs->table('goods') . " WHERE goods_id = '$goods_id'");
    if (!$product) {
        send_json_response(['error' => true, 'message' => "Sản phẩm với ID '$goods_id' không tồn tại."], 404);
        return;
    }
    
    if (empty($data)) {
        send_json_response(['error' => false, 'message' => 'Không có dữ liệu nào được gửi để cập nhật.', 'goods_id' => $goods_id], 200);
        return;
    }
    
    try {
        $prices_to_update = [];
        
        // Format 1: Single price { "user_rank": 1, "user_price": 50000 }
        if (isset($data['user_rank']) && isset($data['user_price'])) {
            $prices_to_update[] = [
                'user_rank' => intval($data['user_rank']),
                'user_price' => floatval($data['user_price'])
            ];
        }
        
        // Format 2: Multiple prices { "member_prices": [{...}, {...}] }
        if (isset($data['member_prices']) && is_array($data['member_prices'])) {
            foreach ($data['member_prices'] as $mp) {
                if (isset($mp['user_rank']) && isset($mp['user_price'])) {
                    $prices_to_update[] = [
                        'user_rank' => intval($mp['user_rank']),
                        'user_price' => floatval($mp['user_price'])
                    ];
                }
            }
        }
        
        // Format 3: String format "1:50000" or "1:50000,2:45000"
        if (isset($data['member_price']) && !empty($data['member_price'])) {
            $member_price_str = trim($data['member_price']);
            $price_pairs = explode(',', $member_price_str);
            
            foreach ($price_pairs as $pair) {
                $pair = trim($pair);
                if (strpos($pair, ':') !== false) {
                    list($user_rank, $user_price) = explode(':', $pair);
                    $prices_to_update[] = [
                        'user_rank' => intval(trim($user_rank)),
                        'user_price' => floatval(trim($user_price))
                    ];
                }
            }
        }
        
        if (empty($prices_to_update)) {
            send_json_response([
                'error' => true, 
                'message' => 'Không tìm thấy dữ liệu giá hợp lệ. Vui lòng gửi theo format: {"user_rank": 1, "user_price": 50000} hoặc {"member_price": "1:50000"}'
            ], 400);
            return;
        }
        
        $updated_count = 0;
        $deleted_count = 0;
        $results = [];
        
        foreach ($prices_to_update as $price_data) {
            $user_rank = $price_data['user_rank'];
            $user_price = $price_data['user_price'];
            
            // Validate user_rank exists
            $rank_info = $db->getRow("SELECT rank_id, rank_name FROM " . $ecs->table('user_rank') . " WHERE rank_id = '$user_rank'");
            if (!$rank_info) {
                $results[] = [
                    'user_rank' => $user_rank,
                    'status' => 'skipped',
                    'reason' => "Hạng thành viên (rank_id: $user_rank) không tồn tại"
                ];
                continue;
            }
            
            // Check if member_price record exists
            $existing = $db->getOne("SELECT user_price FROM " . $ecs->table('member_price') . " WHERE goods_id = '$goods_id' AND user_rank = '$user_rank'");
            
            if ($user_price == 0) {
                // Delete the member price record
                if ($existing !== false && $existing !== null) {
                    $db->query("DELETE FROM " . $ecs->table('member_price') . " WHERE goods_id = '$goods_id' AND user_rank = '$user_rank'");
                    $deleted_count++;
                    $results[] = [
                        'user_rank' => $user_rank,
                        'rank_name' => $rank_info['rank_name'],
                        'status' => 'deleted'
                    ];
                } else {
                    $results[] = [
                        'user_rank' => $user_rank,
                        'rank_name' => $rank_info['rank_name'],
                        'status' => 'skipped',
                        'reason' => 'Không có giá để xóa'
                    ];
                }
            } else {
                // Insert or Update
                if ($existing !== false && $existing !== null) {
                    // Update existing
                    $db->query("UPDATE " . $ecs->table('member_price') . " SET user_price = '$user_price' WHERE goods_id = '$goods_id' AND user_rank = '$user_rank'");
                } else {
                    // Insert new
                    $db->query("INSERT INTO " . $ecs->table('member_price') . " (goods_id, user_rank, user_price) VALUES ('$goods_id', '$user_rank', '$user_price')");
                }
                $updated_count++;
                $results[] = [
                    'user_rank' => $user_rank,
                    'rank_name' => $rank_info['rank_name'],
                    'user_price' => $user_price,
                    'status' => 'updated'
                ];
            }
        }
        
        // Get current member prices for this product
        $current_prices = $db->getAll("SELECT mp.user_rank, mp.user_price, ur.rank_name 
                                        FROM " . $ecs->table('member_price') . " mp
                                        LEFT JOIN " . $ecs->table('user_rank') . " ur ON mp.user_rank = ur.rank_id
                                        WHERE mp.goods_id = '$goods_id'
                                        ORDER BY ur.min_points ASC");
        
        clear_cache_files();
        
        send_json_response([
            'error' => false,
            'message' => "Cập nhật giá thành viên thành công. Updated: $updated_count, Deleted: $deleted_count",
            'goods_id' => $goods_id,
            'goods_name' => $product['goods_name'],
            'results' => $results,
            'current_member_prices' => $current_prices
        ], 200);
        
    } catch (Exception $e) {
        send_json_response(['error' => true, 'message' => $e->getMessage()], 500);
    }
}

/**
 * Lấy gallery ảnh của sản phẩm
 * URL: GET ?action=get_gallery&goods_id=123
 * 
 * Response:
 * {
 *   "error": false,
 *   "message": "Lấy gallery thành công",
 *   "goods_id": 123,
 *   "total": 5,
 *   "data": [
 *     {
 *       "img_id": 1,
 *       "goods_id": 123,
 *       "img_url": "images/202509/goods_img/product-1.webp",
 *       "thumb_url": "images/202509/thumb_img/product-1.webp",
 *       "img_desc": "Ảnh sản phẩm 1",
 *       "img_original": "images/202509/source_img/product-1.jpg"
 *     }
 *   ]
 * }
 */
function get_product_gallery($goods_id)
{
    global $db, $ecs;
    
    $goods_id = intval($goods_id);
    if ($goods_id <= 0) {
        send_json_response(['error' => true, 'message' => 'ID sản phẩm không hợp lệ.'], 400);
    }
    
    // Kiểm tra sản phẩm tồn tại
    $product = $db->getRow("SELECT goods_id, goods_name FROM " . $ecs->table('goods') . " WHERE goods_id = '$goods_id'");
    if (!$product) {
        send_json_response(['error' => true, 'message' => "Sản phẩm với ID $goods_id không tồn tại."], 404);
    }
    
    try {
        // Lấy gallery từ bảng ecs_goods_gallery
        $sql = "SELECT 
                    img_id,
                    goods_id,
                    img_url,
                    thumb_url,
                    img_desc,
                    img_original
                FROM " . $ecs->table('goods_gallery') . " 
                WHERE goods_id = '$goods_id'
                ORDER BY img_id ASC";
        
        $gallery = $db->getAll($sql);
        
        if (!$gallery) {
            $gallery = [];
        }
        
        send_json_response([
            'error' => false,
            'message' => 'Lấy gallery thành công',
            'goods_id' => $goods_id,
            'goods_name' => $product['goods_name'],
            'total' => count($gallery),
            'data' => $gallery
        ], 200);
        
    } catch (Exception $e) {
        send_json_response([
            'error' => true,
            'message' => 'Lỗi khi lấy gallery: ' . $e->getMessage()
        ], 500);
    }
}
?>