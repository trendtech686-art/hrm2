<?php
/*
 * API Tải Lên và Tối Ưu Hóa Hình Ảnh cho n8n
 * Phiên bản: Tinh gọn (Chỉ đổi tên & chuyển đổi WebP)
 */

// Tắt giới hạn thời gian thực thi
set_time_limit(0);

// --- CẤU HÌNH ---
$baseUploadDir = '/home/phukiengiaxuong.com.vn/public_html/cdn/article_thumb/';
$logFile = __DIR__ . '/upload.log';
$SECRET_ACCESS_KEY = 'aG9jb3RlY2g6cGdzME9qUVcxODA1bk9Nd3BhU0FneXMx';
$HEADER_KEY_NAME = 'X-Api-Key';

// --- CÁC HÀM HỖ TRỢ ---
function createSlug($str, $delimiter = '-') {
    $charMap = array( 'à'=>'a', 'á'=>'a', 'ạ'=>'a', 'ả'=>'a', 'ã'=>'a', 'â'=>'a', 'ầ'=>'a', 'ấ'=>'a', 'ậ'=>'a', 'ẩ'=>'a', 'ẫ'=>'a', 'ă'=>'a', 'ằ'=>'a', 'ắ'=>'a', 'ặ'=>'a', 'ẳ'=>'a', 'ẵ'=>'a', 'è'=>'e', 'é'=>'e', 'ẹ'=>'e', 'ẻ'=>'e', 'ẽ'=>'e', 'ê'=>'e', 'ề'=>'e', 'ế'=>'e', 'ệ'=>'e', 'ể'=>'e', 'ễ'=>'e', 'ì'=>'i', 'í'=>'i', 'ị'=>'i', 'ỉ'=>'i', 'ĩ'=>'i', 'ò'=>'o', 'ó'=>'o', 'ọ'=>'o', 'ỏ'=>'o', 'õ'=>'o', 'ô'=>'o', 'ồ'=>'o', 'ố'=>'o', 'ộ'=>'o', 'ổ'=>'o', 'ỗ'=>'o', 'ơ'=>'o', 'ờ'=>'o', 'ớ'=>'o', 'ợ'=>'o', 'ở'=>'o', 'ỡ'=>'o', 'ù'=>'u', 'ú'=>'u', 'ụ'=>'u', 'ủ'=>'u', 'ũ'=>'u', 'ư'=>'u', 'ừ'=>'u', 'ứ'=>'u', 'ự'=>'u', 'ử'=>'u', 'ữ'=>'u', 'ỳ'=>'y', 'ý'=>'y', 'ỵ'=>'y', 'ỷ'=>'y', 'ỹ'=>'y', 'đ'=>'d', 'Đ'=>'D' );
    $str = strtolower(trim($str));
    $str = strtr($str, $charMap);
    $str = preg_replace('/[^a-z0-9' . preg_quote($delimiter) . ']/', '', $str);
    $str = preg_replace('/[' . preg_quote($delimiter) . ']{2,}/', $delimiter, $str);
    return trim($str, $delimiter);
}

function writeLog($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

// --- BẮT ĐẦU XỬ LÝ ---
header('Content-Type: application/json');
writeLog('Request started (Simple Version).');

// 1. Kiểm tra Access Key
$headers = getallheaders();
$accessKey = isset($headers[$HEADER_KEY_NAME]) ? $headers[$HEADER_KEY_NAME] : '';
if (empty($accessKey) || $accessKey !== $SECRET_ACCESS_KEY) {
    writeLog('ERROR: Unauthorized access.');
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Truy cập không được phép.']);
    exit;
}

// 2. Lấy metadata từ $_POST và file từ $_FILES
$metadataJson = isset($_POST['metadata']) ? $_POST['metadata'] : '{}';
$metadataInput = json_decode($metadataJson, true);

if (!isset($_FILES['image_file']) || $_FILES['image_file']['error'] !== UPLOAD_ERR_OK) {
    writeLog('ERROR: No file uploaded or upload error. PHP upload error code: ' . ($_FILES['image_file']['error'] ?? 'N/A'));
    echo json_encode(['success' => false, 'message' => 'Không có file nào được gửi lên hoặc có lỗi upload.']);
    exit;
}
$tempFile = $_FILES['image_file']['tmp_name'];

// 3. Mở ảnh
try {
    $image = new Imagick($tempFile);
} catch (ImagickException $e) {
    writeLog('ERROR: Imagick failed to open file. ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'File không phải hình ảnh hợp lệ.']);
    exit;
}

// 4. Tạo tên file
$baseFileName = isset($metadataInput['filename_slug']) && !empty($metadataInput['filename_slug']) 
                ? $metadataInput['filename_slug'] 
                : (isset($metadataInput['title']) && !empty($metadataInput['title']) ? createSlug($metadataInput['title']) : uniqid('image_', true));

// 5. Chuẩn bị đường dẫn file cuối cùng
$originalExtension = strtolower($image->getImageFormat());
if ($originalExtension === 'jpeg') { $originalExtension = 'jpg'; }
$newWebpFileName = $baseFileName . '.webp';
$newOriginalFileName = $baseFileName . '.' . $originalExtension;
$uploadPathWebp = $baseUploadDir . $newWebpFileName;
$uploadPathOriginal = $baseUploadDir . $newOriginalFileName;

// 6. Lưu file
$success = false;
try {
    // Lưu phiên bản WebP
    $image->setImageFormat('webp');
    $image->setImageCompressionQuality(80);
    $image->writeImage($uploadPathWebp);

    // Di chuyển file gốc
    if (move_uploaded_file($tempFile, $uploadPathOriginal)) {
        $success = true;
    } else {
        writeLog("ERROR: Failed to move uploaded file. Check permissions for target directory: " . $baseUploadDir);
        $success = false;
    }

} catch (Exception $e) {
    writeLog('FATAL ERROR: ' . $e->getMessage());
    $success = false;
}

// 7. Dọn dẹp
if (isset($image)) { $image->destroy(); }
if (file_exists($tempFile)) { @unlink($tempFile); }

// 8. Trả về kết quả
if ($success) {
    echo json_encode([
        'success' => true,
        'message' => 'Tải lên, đổi tên và chuyển đổi WebP thành công.',
        'webp_file_name' => $newWebpFileName,
        'webp_url' => 'https://phukiengiaxuong.com.vn/cdn/article_thumb/' . $newWebpFileName,
        'original_file_name' => $newOriginalFileName,
        'original_url' => 'https://phukiengiaxuong.com.vn/cdn/article_thumb/' . $newOriginalFileName
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Có lỗi xảy ra trong quá trình xử lý file trên server.']);
}

writeLog('Request finished.');

?>