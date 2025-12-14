<?php
/**
 * API Endpoint chuyên biệt để tạo bài viết trong Ecshop.
 * API này nhận dữ liệu JSON của bài viết và tạo một bản ghi mới.
 */

ob_start();
@ini_set('display_errors', 1);
error_reporting(E_ALL);
ini_set('memory_limit', '256M'); // Tăng giới hạn bộ nhớ
set_time_limit(300); // Tăng giới hạn thời gian thực thi

if (!defined('IN_ECS')) { define('IN_ECS', true); }
if (!defined('DEBUG_MODE')) { define('DEBUG_MODE', 0); }
if (!defined('ROOT_PATH')) { define('ROOT_PATH', realpath(dirname(__FILE__) . '/../') . '/'); }

// Nạp các file cần thiết theo đúng thứ tự
require_once(ROOT_PATH . 'includes/config.php');
require_once(ROOT_PATH . 'includes/cls_mysql.php');
require_once(ROOT_PATH . 'includes/cls_ecshop.php');
require_once(ROOT_PATH . 'includes/lib_common.php');
require_once(ROOT_PATH . 'includes/lib_base.php');
require_once(ROOT_PATH . 'includes/lib_article.php');

// Khởi tạo các đối tượng trước khi gọi các hàm sử dụng chúng
$db = new cls_mysql($db_host, $db_user, $db_pass, $db_name);
$ecs = new ECS($db_name, $prefix);
$_CFG = load_config();
date_default_timezone_set('Asia/Ho_Chi_Minh');

define('API_SECRET_KEY', 'a91f2c47e5d8b6f03a7c4e9d12f0b8a6');
define('LOG_FILE', ROOT_PATH . 'api_logs/article_api_' . date('Y-m') . '.log');
define('CDN_URL_PREFIX', 'https://phukiengiaxuong.com.vn/cdn/');
define('SITE_URL', 'https://phukiengiaxuong.com.vn/');

// Hàm ghi log tùy chỉnh để theo dõi hoạt động của API
function write_log($message) {
    if (!is_dir(dirname(LOG_FILE))) {
        mkdir(dirname(LOG_FILE), 0777, true);
    }
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "[$timestamp] $message" . PHP_EOL;
    file_put_contents(LOG_FILE, $log_entry, FILE_APPEND);
}

// Hàm gửi phản hồi JSON và kết thúc script
function send_json_response($data, $http_code = 200) {
    ob_clean();
    http_response_code($http_code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    write_log("Response ($http_code): " . json_encode($data, JSON_UNESCAPED_UNICODE));
    exit;
}

// Ghi log đầu vào request để gỡ lỗi
write_log("Request received from IP: " . $_SERVER['REMOTE_ADDR'] . " with API Key: " . (isset($_SERVER['HTTP_X_API_KEY']) ? $_SERVER['HTTP_X_API_KEY'] : 'N/A'));
write_log("Request Method: " . $_SERVER['REQUEST_METHOD']);

// Xác thực API Key
$api_key = isset($_SERVER['HTTP_X_API_KEY']) ? $_SERVER['HTTP_X_API_KEY'] : '';
if ($api_key !== API_SECRET_KEY) {
    write_log("Authentication failed: Invalid API Key.");
    send_json_response(['error' => true, 'message' => 'Xác thực thất bại. API Key không hợp lệ.'], 401);
}

// Kiểm tra phương thức HTTP và lấy dữ liệu JSON
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    write_log("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
    send_json_response(['error' => true, 'message' => 'Phương thức yêu cầu không hợp lệ. Chỉ hỗ trợ POST.'], 405);
}

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

write_log("Request Body (JSON): " . $json_data);

if (json_last_error() !== JSON_ERROR_NONE) {
    write_log("JSON decoding failed: " . json_last_error_msg());
    send_json_response(['error' => true, 'message' => 'Định dạng JSON không hợp lệ.'], 400);
}

/**
 * Function để tạo một bài viết mới (article) dựa trên dữ liệu đầu vào.
 * @param array $data Mảng chứa dữ liệu của bài viết.
 * @return array Mảng kết quả bao gồm trạng thái thành công và thông tin chi tiết.
 */
/**
 * Resize một ảnh, lưu lại và trả về đường dẫn tương đối mới.
 * @param string $source_image_url URL đầy đủ của ảnh gốc.
 * @param int    $target_width   Chiều rộng mong muốn.
 * @param int    $target_height  Chiều cao mong muốn.
 * @return string|false Đường dẫn tương đối của ảnh đã resize hoặc false nếu thất bại.
 */
/**
 * Resize một ảnh, lưu lại và trả về đường dẫn tương đối mới.
 * Hỗ trợ các định dạng: JPEG, PNG, GIF, và WEBP.
 * @param string $source_image_url URL đầy đủ của ảnh gốc.
 * @param int    $target_width   Chiều rộng mong muốn.
 * @param int    $target_height  Chiều cao mong muốn.
 * @return string|false Đường dẫn tương đối của ảnh đã resize hoặc false nếu thất bại.
 */
function resize_and_save_image($source_image_url, $target_width = 250, $target_height = 140)
{
    // Lấy đường dẫn tương đối của ảnh gốc
    $original_relative_path = str_replace(CDN_URL_PREFIX, '', $source_image_url);
    $source_full_path = ROOT_PATH . 'cdn/' . $original_relative_path;

    write_log("Attempting to resize image. Source: " . $source_full_path);

    // Kiểm tra xem file gốc có tồn tại không
    if (!file_exists($source_full_path) || !is_file($source_full_path)) {
        write_log("Resize Error: Source file not found at '$source_full_path'.");
        return false; // Trả về false nếu không tìm thấy file
    }

    // Tạo thư mục lưu ảnh đã resize nếu chưa có
    $filename = basename($source_full_path);
    $destination_dir = ROOT_PATH . 'cdn/images/articles/resized/';
    if (!is_dir($destination_dir)) {
        if (!mkdir($destination_dir, 0777, true)) {
            write_log("Resize Error: Failed to create destination directory '$destination_dir'.");
            return false;
        }
    }

    $destination_full_path = $destination_dir . $filename;
    
    // Lấy thông tin ảnh
    $image_info = getimagesize($source_full_path);
    if (!$image_info) {
        write_log("Resize Error: Could not get image size. Invalid image file at '$source_full_path'.");
        return false;
    }
    list($width_orig, $height_orig, $image_type) = $image_info;

    // Tạo ảnh mới từ file gốc dựa trên loại ảnh
    $source_image = null;
    switch ($image_type) {
        case IMAGETYPE_JPEG:
            $source_image = imagecreatefromjpeg($source_full_path);
            break;
        case IMAGETYPE_PNG:
            $source_image = imagecreatefrompng($source_full_path);
            break;
        case IMAGETYPE_GIF:
            $source_image = imagecreatefromgif($source_full_path);
            break;
        case IMAGETYPE_WEBP: // THÊM VÀO: Hỗ trợ đọc file WebP
            $source_image = imagecreatefromwebp($source_full_path);
            break;
        default:
            write_log("Resize Error: Unsupported image type for file '$source_full_path'.");
            return false;
    }

    if (!$source_image) {
        write_log("Resize Error: Failed to create image resource from '$source_full_path'.");
        return false;
    }

    // Tạo ảnh thumbnail mới
$destination_image = imagecreatetruecolor($target_width, $target_height);

    // Xử lý độ trong suốt cho ảnh PNG
    if ($image_type == IMAGETYPE_PNG) {
        imagealphablending($destination_image, false);
        imagesavealpha($destination_image, true);
        $transparent = imagecolorallocatealpha($destination_image, 255, 255, 255, 127);
        imagefilledrectangle($destination_image, 0, 0, $target_width, $target_height, $transparent);
    }
    
    // Resize ảnh
    imagecopyresampled($destination_image, $source_image, 0, 0, 0, 0, $target_width, $target_height, $width_orig, $height_orig);

    // Lưu ảnh mới vào file, giữ nguyên định dạng gốc
    $success = false;
    switch ($image_type) {
        case IMAGETYPE_JPEG:
            $success = imagejpeg($destination_image, $destination_full_path, 85); // Chất lượng 85%
            break;
        case IMAGETYPE_PNG:
            $success = imagepng($destination_image, $destination_full_path, 9); // Nén tối đa
            break;
        case IMAGETYPE_GIF:
            $success = imagegif($destination_image, $destination_full_path);
            break;
        case IMAGETYPE_WEBP: // THÊM VÀO: Hỗ trợ lưu file WebP
            $success = imagewebp($destination_image, $destination_full_path, 80); // Chất lượng 80%
            break;
    }

    // Giải phóng bộ nhớ
    imagedestroy($source_image);
    imagedestroy($destination_image);

    if ($success) {
        // Trả về đường dẫn tương đối mới để lưu vào CSDL
        $new_relative_path = 'images/articles/resized/' . $filename;
        write_log("Image resized successfully. New path: '$new_relative_path'.");
        return $new_relative_path;
    } else {
        write_log("Resize Error: Failed to save resized image to '$destination_full_path'.");
        return false;
    }
}

function create_article($data)
{
    global $db, $ecs;
    
    // --- Kiểm tra và xử lý dữ liệu đầu vào ---
    $required_fields = ['title', 'content', 'article_cat'];
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            write_log("Validation Error: Missing required field '$field'");
            send_json_response(['error' => true, 'message' => "Thiếu trường bắt buộc: '$field'"], 400);
        }
    }
    
// --- Xử lý và Resize ảnh thumbnail ---
    $article_thumb_url = isset($data['article_thumb_url']) ? $data['article_thumb_url'] : '';
    $article_thumb = ''; // Đường dẫn cuối cùng để lưu vào DB

    if (!empty($article_thumb_url)) {
        // Cố gắng resize ảnh
        $resized_path = resize_and_save_image($article_thumb_url, 250, 140);

        if ($resized_path) {
            // Nếu resize thành công, sử dụng đường dẫn mới
            $article_thumb = $resized_path;
        } else {
            // Nếu resize thất bại (file không tồn tại, lỗi...), sử dụng ảnh gốc làm phương án dự phòng
            write_log("Fallback: Using original image path because resize failed.");
            $article_thumb = str_replace(CDN_URL_PREFIX, '', $article_thumb_url);
        }
    } else {
        write_log("No article_thumb_url provided. Thumbnail will be empty.");
    }
    
    write_log("Final article_thumb path for database: " . $article_thumb);

    
    // Khởi tạo các biến với giá trị mặc định và làm sạch dữ liệu
    $title = isset($data['title']) ? $data['title'] : '';
    $article_cat = isset($data['article_cat']) ? intval($data['article_cat']) : 0;
    $article_type = isset($data['article_type']) ? intval($data['article_type']) : 0;
    $author = isset($data['author']) ? $data['author'] : '';
    $author_email = isset($data['author_email']) ? $data['author_email'] : '';
    $keywords = isset($data['keywords']) ? $data['keywords'] : '';
    $description = isset($data['description']) ? $data['description'] : '';
    $link_url = isset($data['link_url']) ? $data['link_url'] : '';
    $is_open = isset($data['is_open']) ? intval($data['is_open']) : 0;
    $add_time = time();
    $custom_title = isset($data['custom_title']) ? $data['custom_title'] : '';
    $meta_title = isset($data['meta_title']) ? $data['meta_title'] : '';
    $meta_desc = isset($data['meta_desc']) ? $data['meta_desc'] : '';
    $meta_robots = isset($data['meta_robots']) ? $data['meta_robots'] : 'INDEX,FOLLOW';
    $content = isset($data['content']) ? $data['content'] : '';
    $template_file = isset($data['template_file']) ? $data['template_file'] : '';
    
    // --- Kiểm tra và điều chỉnh tiêu đề nếu bị trùng lặp ---
    $new_title = $title;
    $count = 1;
    do {
        $escaped_title = mysqli_real_escape_string($db->link_id, $new_title);
        $sql = "SELECT article_id FROM " . $ecs->table('article') . " WHERE title = '" . $escaped_title . "' AND cat_id = " . $article_cat;
        $existing_article = $db->getOne($sql);
        if ($existing_article) {
            $count++;
            $new_title = $title . ' ' . $count;
        }
    } while ($existing_article);

    $final_title = $new_title;
    $escaped_final_title = mysqli_real_escape_string($db->link_id, $final_title);
    $escaped_article_thumb = mysqli_real_escape_string($db->link_id, $article_thumb);
    $escaped_content = mysqli_real_escape_string($db->link_id, $content);

    // Làm sạch dữ liệu các trường khác
    $escaped_custom_title = mysqli_real_escape_string($db->link_id, $custom_title);
    $escaped_template_file = mysqli_real_escape_string($db->link_id, $template_file);
    $escaped_meta_robots = mysqli_real_escape_string($db->link_id, $meta_robots);
    $escaped_meta_title = mysqli_real_escape_string($db->link_id, $meta_title);
    $escaped_meta_desc = mysqli_real_escape_string($db->link_id, $meta_desc);
    $escaped_author = mysqli_real_escape_string($db->link_id, $author);
    $escaped_author_email = mysqli_real_escape_string($db->link_id, $author_email);
    $escaped_keywords = mysqli_real_escape_string($db->link_id, $keywords);
    $escaped_link_url = mysqli_real_escape_string($db->link_id, $link_url);
    $escaped_description = mysqli_real_escape_string($db->link_id, $description);

    // --- Tạo câu lệnh SQL INSERT và thực thi ---
    $sql = "INSERT INTO " . $ecs->table('article') . "(title, custom_title, template_file, meta_robots, meta_title, meta_desc, article_thumb, cat_id, article_type, is_open, author, ".
            "author_email, keywords, content, add_time, link, description) ".
            "VALUES ('$escaped_final_title', '$escaped_custom_title', '$escaped_template_file', '$escaped_meta_robots', '$escaped_meta_title', '$escaped_meta_desc', '$escaped_article_thumb', '$article_cat', '$article_type', '$is_open','$escaped_author', '$escaped_author_email', '$escaped_keywords', '$escaped_content', '$add_time', '$escaped_link_url', '$escaped_description')";

    write_log("Attempting to insert new article with SQL: " . $sql);
    if ($db->query($sql)) {
        $article_id = $db->insert_id();
        write_log("Article inserted successfully with ID: " . $article_id);

        // Tạo và chèn slug cho bài viết mới
        if ($article_id) {
            write_log("Creating and inserting slug into ecs_slug table for article ID: " . $article_id);
            $slug_value = gen_slug($final_title);
            $insert_slug_sql = "INSERT INTO " . $ecs->table('slug') . " (`slug`, `module`, `id`) VALUES ('". mysqli_real_escape_string($db->link_id, $slug_value) ."', 'article', '$article_id')";
            $db->query($insert_slug_sql);
            write_log("Slug '$slug_value' inserted successfully for article ID: " . $article_id);

            $base_url = rtrim(SITE_URL, '/');
            
            // Tạo URL theo định dạng mới: /tin-tuc/{slug}-{id}.html
            $article_url = $base_url . '/tin-tuc/' . $slug_value . '-' . $article_id . '.html';
            write_log("Generated friendly URL: " . $article_url);
            
            return ['error' => false, 'message' => "Bài viết '$final_title' đã được thêm thành công.", 'article_id' => $article_id, 'article_url' => $article_url];
        }

    } else {
        write_log("Database Error: " . $db->error());
        return ['error' => true, 'message' => "Lỗi khi thêm bài viết: " . $db->error()];
    }
}

// Hàm tùy chỉnh gen_slug() để tạo slug
function gen_slug($string) {
    $string = trim($string);
    $string = mb_strtolower($string, 'UTF-8');
    $string = preg_replace('/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/', 'a', $string);
    $string = preg_replace('/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/', 'e', $string);
    $string = preg_replace('/(ì|í|ị|ỉ|ĩ)/', 'i', $string);
    $string = preg_replace('/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/', 'o', $string);
    $string = preg_replace('/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/', 'u', $string);
    $string = preg_replace('/(ỳ|ý|ỵ|ỷ|ỹ)/', 'y', $string);
    $string = preg_replace('/(đ)/', 'd', $string);
    $string = preg_replace('/[^a-z0-9\s-]/', '', $string);
    $string = preg_replace('/(^-|-$)/', '', $string);
    $string = preg_replace('/(\s)/', '-', $string);
    $string = preg_replace('/(-+)/', '-', $string);
    return $string;
}

// Chạy hàm tạo bài viết với dữ liệu JSON từ body request
$response = create_article($data);
send_json_response($response, $response['error'] ? 500 : 201);
?>