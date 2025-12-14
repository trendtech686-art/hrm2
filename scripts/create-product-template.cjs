/**
 * Script tạo file mẫu Excel cho import sản phẩm
 * Chạy: node scripts/create-product-template.cjs
 * 
 * NOTE: Các cột giá theo bảng giá được tạo ĐỘNG dựa trên bảng giá có trong hệ thống
 * User có thể thêm cột với tên = mã bảng giá (VD: PL_10, BANLE, VIP...)
 */

const XLSX = require('xlsx');
const path = require('path');

// Các bảng giá mẫu - trong thực tế user sẽ dùng mã bảng giá của họ
const samplePricingPolicies = [
  'PL_10',   // Bảng giá chung - 10%
  'PL_20',   // Bảng giá chung - 20%
  'BANLE',   // Bán lẻ
  'BANSI',   // Bán sỉ
  'VIP',     // Khách VIP
];

// Headers theo product.config.ts - ĐẦY ĐỦ TẤT CẢ CỘT
const baseHeaders = [
  // Thông tin cơ bản
  'Mã sản phẩm',
  'Tên sản phẩm (*)',
  'SKU',
  'Mã vạch',
  'Loại sản phẩm',
  'Trạng thái',
  'Đơn vị tính',
  'Danh mục',
  'Danh mục phụ',
  'Mô tả',
  'Mô tả ngắn',
  
  // Hình ảnh & Video
  'Ảnh đại diện',
  'Ảnh bộ sưu tập',
  'Video link',
  
  // Giá cơ bản
  'Giá vốn',
  'Giá bán',
  'Giá bán lẻ đề xuất',
  'Giá tối thiểu',
  'Giá nhập gần nhất',
  'Thuế suất (%)',
  // NOTE: Các cột giá theo bảng giá sẽ được thêm ĐỘNG ở đây (PL_10, BANLE, VIP...)
  
  // Tồn kho
  'Tồn kho ban đầu',
  'Theo dõi tồn kho',
  'Mức đặt hàng lại',
  'Tồn kho an toàn',
  'Tồn kho tối đa',
  'Vị trí kho',
  
  // Vật lý
  'Trọng lượng',
  'Đơn vị trọng lượng',
  'Kích thước (DxRxC cm)',
  
  // Bảo hành
  'Bảo hành (tháng)',
  
  // Tem phụ
  'Tên VAT',
  'Xuất xứ',
  'Hướng dẫn sử dụng',
  'Đơn vị nhập khẩu',
  'Địa chỉ nhập khẩu',
  
  // E-commerce (bán hàng website)
  'Slug (URL)',
  'Đăng web',
  'Nổi bật',
  'Mới về',
  'Bán chạy',
  'Đang giảm giá',
  'Thứ tự hiển thị',
  'Ngày đăng web',
  
  // SEO & Phân loại
  'Tiêu đề SEO',
  'Mô tả SEO',
  'Tags',
  'ID PKGX',
  
  // Vòng đời
  'Ngày ra mắt',
  'Ngày ngừng kinh doanh',
];

// Tạo headers với các cột bảng giá động
const headers = [...baseHeaders];
// Chèn các cột bảng giá sau cột "Thuế suất (%)"
const taxRateIndex = headers.indexOf('Thuế suất (%)');
samplePricingPolicies.forEach((policy, i) => {
  headers.splice(taxRateIndex + 1 + i, 0, policy);
});

// Sample data - ĐẦY ĐỦ TẤT CẢ CỘT (dùng tiếng Việt cho loại SP và trạng thái)
// Thứ tự: [info cơ bản...] [Giá cơ bản] [Giá theo bảng giá (PL_10, PL_20, BANLE, BANSI, VIP)] [tồn kho...] [còn lại...]
// NOTE: Danh mục và Danh mục phụ hỗ trợ NHIỀU danh mục, phân cách bằng dấu ;
const sampleData = [
  // SP001 - Hàng hóa thông thường (có 2 danh mục)
  [
    'SP001', 'Áo sơ mi nam trắng Oxford', 'ASM-TRANG-001', '8934567890001', 'Hàng hóa', 'Đang kinh doanh', 'Cái',
    'Thời trang > Áo nam > Áo sơ mi; Sale > Hot deal', 'Slim fit > Form ôm; Cotton > Cao cấp',
    'Áo sơ mi nam chất liệu Oxford cotton 100%, form regular fit, phù hợp đi làm và dự tiệc',
    'Áo sơ mi nam cotton cao cấp',
    '/products/SP001/main.jpg', '/products/SP001/1.jpg; /products/SP001/2.jpg; /products/SP001/3.jpg',
    'https://youtube.com/watch?v=abc123; https://tiktok.com/@fashion/video/123',
    150000, 299000, 350000, 250000, 145000, 10, 
    // Giá theo bảng giá: PL_10, PL_20, BANLE, BANSI, VIP
    269100, 239200, 299000, 250000, 220000,
    50, 'Có', 10, 5, 100, 'A1-01',
    200, 'g', '40x30x2',
    12,
    'Áo sơ mi nam cotton Oxford', 'Việt Nam', 'Giặt máy ở nhiệt độ dưới 40°C. Là ủi ở nhiệt độ trung bình.', 'Công ty TNHH May Mặc ABC', '123 Nguyễn Huệ, Quận 1, TP.HCM',
    // E-commerce: Slug, Đăng web, Nổi bật, Mới về, Bán chạy, Đang giảm giá, Thứ tự, Ngày đăng
    'ao-so-mi-nam-trang-oxford', 'Có', 'Có', '', '', 'Có', 1, '2024-01-15',
    'Áo sơ mi nam Oxford cao cấp - Thời trang công sở', 'Áo sơ mi nam chất liệu Oxford cotton 100%, form regular fit, nhiều màu sắc lựa chọn',
    'nam;công sở;cotton;oxford;áo sơ mi', '',
    '2024-01-15', '',
  ],
  // SP002 - Quần với URL ảnh bên ngoài (có 3 danh mục)
  [
    'SP002', 'Quần jean nam slim fit xanh đậm', 'QJN-SLIM-001', '8934567890002', 'Hàng hóa', 'Đang kinh doanh', 'Cái',
    'Thời trang > Quần nam > Quần jean; Sale > Giảm 20%; Bán chạy', 'Slim fit; Denim > Co giãn',
    'Quần jean nam form slim fit, chất liệu denim co giãn thoải mái, màu xanh đậm classic',
    'Quần jean nam form slim fit',
    'https://cdn.example.com/products/SP002/main.jpg', 'https://cdn.example.com/products/SP002/side.jpg|https://cdn.example.com/products/SP002/back.jpg',
    'https://youtu.be/def456',
    180000, 450000, 500000, 380000, 175000, 10, 
    // Giá theo bảng giá: PL_10, PL_20, BANLE, BANSI, VIP
    405000, 360000, 450000, 380000, '',
    30, 'Có', 5, 3, 50, 'A2-05',
    350, 'g', '100x35x3',
    6,
    'Quần jean nam denim', 'Trung Quốc', 'Giặt riêng lần đầu để tránh phai màu. Không sử dụng chất tẩy.', '', '',
    // E-commerce: Slug, Đăng web, Nổi bật, Mới về, Bán chạy, Đang giảm giá, Thứ tự, Ngày đăng
    'quan-jean-nam-slim-fit', 'Có', '', '', 'Có', 'Có', 2, '2024-02-01',
    'Quần jean nam slim fit - Denim cao cấp', 'Quần jean nam form slim fit, co giãn thoải mái, phù hợp mọi phong cách',
    'nam;jean;slim fit;denim', '',
    '2024-02-01', '',
  ],
  // SP003 - Giày với nhiều ảnh gallery
  [
    'SP003', 'Giày thể thao nam Nike Air Max', 'GTT-NAM-001', '8934567890003', 'Hàng hóa', 'Đang kinh doanh', 'Đôi',
    'Giày dép > Giày nam > Giày thể thao; Thể thao > Running', 'Nike > Air Max',
    'Giày thể thao nam Nike Air Max, đế cao su chống trượt, êm ái khi di chuyển',
    'Giày thể thao nam đế cao su',
    '/products/SP003/thumb.png', '/products/SP003/side.jpg|/products/SP003/top.jpg|/products/SP003/sole.jpg',
    'https://drive.google.com/file/d/xyz789',
    280000, 650000, 750000, 550000, 270000, 10, 
    // Giá theo bảng giá: PL_10, PL_20, BANLE, BANSI, VIP
    585000, 520000, 650000, '', 550000,
    20, 'Có', 8, 4, 40, 'B1-02',
    450, 'g', '30x12x15',
    3,
    'Giày thể thao nam Nike', 'Việt Nam', 'Tránh tiếp xúc trực tiếp với nước. Vệ sinh bằng khăn ẩm.', 'Công ty XYZ', '456 Lê Lợi, Quận 3, TP.HCM',
    // E-commerce: Slug, Đăng web, Nổi bật, Mới về, Bán chạy, Đang giảm giá, Thứ tự, Ngày đăng
    'giay-the-thao-nike-air-max', 'Có', 'Có', 'Có', '', '', 3, '2024-03-10',
    'Giày thể thao Nike Air Max chính hãng', 'Giày thể thao nam Nike Air Max, đế cao su êm ái, thiết kế thời trang',
    'nam;giày;thể thao;nike;air max', 12345,
    '2024-03-10', '',
  ],
  // SP004 - Túi xách với ảnh Google Storage
  [
    'SP004', 'Túi xách nữ da PU cao cấp', 'TXN-PU-001', '8934567890004', 'Hàng hóa', 'Đang kinh doanh', 'Cái',
    'Phụ kiện > Túi xách > Túi xách nữ', 'Túi đeo vai',
    'Túi xách nữ chất liệu da PU cao cấp, thiết kế thanh lịch, nhiều ngăn tiện dụng',
    'Túi xách nữ da PU cao cấp',
    'https://storage.googleapis.com/mybucket/products/SP004.webp', '',
    '',
    120000, 350000, 400000, 280000, 115000, 10, 
    // Giá theo bảng giá: PL_10, PL_20, BANLE, BANSI, VIP
    315000, 280000, 350000, 280000, '',
    15, 'Có', 5, 2, 30, 'C1-10',
    300, 'g', '25x20x10',
    6,
    'Túi xách nữ da PU', 'Hàn Quốc', 'Lau bằng khăn ẩm. Tránh tiếp xúc với hóa chất.', '', '',
    // E-commerce: Slug, Đăng web, Nổi bật, Mới về, Bán chạy, Đang giảm giá, Thứ tự, Ngày đăng
    'tui-xach-nu-da-pu', 'Có', '', '', '', '', 4, '2024-01-20',
    'Túi xách nữ da PU cao cấp Hàn Quốc', 'Túi xách nữ thiết kế thanh lịch, phù hợp đi làm và dạo phố',
    'nữ;túi xách;da PU;Hàn Quốc', '',
    '2024-01-20', '',
  ],
  // SP005 - Phụ kiện đơn giản (không có giá bảng giá)
  [
    'SP005', 'Mũ lưỡi trai unisex', 'MLT-UNI-001', '8934567890005', 'Hàng hóa', 'Đang kinh doanh', 'Cái',
    'Phụ kiện > Mũ nón', '',
    'Mũ lưỡi trai phong cách unisex, chất liệu vải cotton thoáng mát',
    'Mũ lưỡi trai phong cách unisex',
    '/products/SP005/main.jpg', '',
    '',
    35000, 99000, 120000, 79000, 32000, 10, 
    // Giá theo bảng giá: PL_10, PL_20, BANLE, BANSI, VIP - để trống tất cả
    '', '', '', '', '',
    100, 'Có', 20, 10, 200, 'D1-01',
    80, 'g', '28x20x12',
    0,
    'Mũ lưỡi trai cotton', 'Việt Nam', 'Giặt tay nhẹ nhàng. Phơi nơi thoáng mát.', '', '',
    // E-commerce: Slug, Đăng web, Nổi bật, Mới về, Bán chạy, Đang giảm giá, Thứ tự, Ngày đăng
    'mu-luoi-trai-unisex', '', '', '', '', '', '', '',
    '', '',
    'unisex;mũ;phụ kiện;lưỡi trai', '',
    '2024-04-01', '',
  ],
  // SP006 - Sản phẩm mới (không có mã - hệ thống tự tạo)
  [
    '', 'Áo khoác gió nam chống nước', '', '8934567890006', 'Hàng hóa', 'Đang kinh doanh', 'Cái',
    'Thời trang > Áo nam > Áo khoác', 'Áo khoác gió',
    'Áo khoác gió nam chất liệu polyester chống nước, có mũ trùm đầu, thiết kế gọn nhẹ',
    'Áo khoác gió chống nước',
    '/products/new/aokhoac.jpg', '/products/new/aokhoac-side.jpg',
    'https://youtube.com/watch?v=review123',
    200000, 499000, 550000, 420000, 195000, 10, 
    // Giá theo bảng giá: PL_10, PL_20, BANLE, BANSI, VIP
    449100, 399200, 499000, '', '',
    25, 'Có', 5, 3, 50, 'A3-01',
    250, 'g', '70x50x5',
    12,
    'Áo khoác gió nam polyester', 'Đài Loan', 'Không sấy nóng. Giặt máy ở chế độ nhẹ.', 'Công ty DEF', '789 Hai Bà Trưng, Quận 1',
    // E-commerce: Slug, Đăng web, Nổi bật, Mới về, Bán chạy, Đang giảm giá, Thứ tự, Ngày đăng
    'ao-khoac-gio-nam-chong-nuoc', 'Có', '', 'Có', '', '', 6, '2024-12-01',
    'Áo khoác gió nam chống nước nhẹ', 'Áo khoác gió nam polyester, chống nước, gọn nhẹ dễ mang theo',
    'nam;áo khoác;chống nước;gió', '',
    '2024-12-01', '',
  ],
  // SP007 - Dịch vụ (không theo dõi tồn kho)
  [
    'SP007', 'Dịch vụ may đo vest nam', 'DV-MAYDO-001', '', 'Dịch vụ', 'Đang kinh doanh', 'Lần',
    'Dịch vụ > May đo', '',
    'Dịch vụ may đo vest nam theo số đo cá nhân, bao gồm tư vấn chất liệu và thiết kế',
    'Dịch vụ may đo vest theo yêu cầu',
    '', '',
    '',
    0, 2500000, 3000000, 2000000, 0, 10, 
    // Giá theo bảng giá: PL_10, PL_20, BANLE, BANSI, VIP
    '', '', '', '', '',
    '', 'Không', '', '', '', '',
    '', '', '',
    0,
    '', '', '', '', '',
    // E-commerce: Slug, Đăng web, Nổi bật, Mới về, Bán chạy, Đang giảm giá, Thứ tự, Ngày đăng
    'dich-vu-may-do-vest-nam', 'Có', '', '', '', '', 7, '2024-01-01',
    'Dịch vụ may đo vest nam cao cấp', 'May đo vest nam theo số đo, tư vấn chất liệu và thiết kế theo yêu cầu',
    'dịch vụ;may đo;vest;nam', '',
    '2024-01-01', '',
  ],
  // SP008 - Digital product
  [
    'SP008', 'Khóa học thiết kế thời trang online', 'DG-KHOAHOC-001', '', 'Sản phẩm số', 'Đang kinh doanh', 'Khóa',
    'Sản phẩm số > Khóa học', 'Khóa học online',
    'Khóa học thiết kế thời trang online 30 bài giảng, có chứng chỉ hoàn thành',
    'Khóa học thiết kế thời trang',
    '/products/digital/course-fashion.jpg', '',
    'https://vimeo.com/12345; https://facebook.com/video/67890',
    0, 990000, 1200000, 800000, 0, 0, 
    // Giá theo bảng giá: PL_10, PL_20, BANLE, BANSI, VIP
    '', '', '', '', '',
    '', 'Không', '', '', '', '',
    '', '', '',
    0,
    '', '', '', '', '',
    // E-commerce: Slug, Đăng web, Nổi bật, Mới về, Bán chạy, Đang giảm giá, Thứ tự, Ngày đăng
    'khoa-hoc-thiet-ke-thoi-trang', 'Có', '', '', '', '', 8, '2024-06-01',
    'Khóa học thiết kế thời trang online', 'Học thiết kế thời trang từ cơ bản đến nâng cao, 30 bài giảng video HD',
    'digital;khóa học;thiết kế;thời trang', '',
    '2024-06-01', '',
  ],
];

// Create workbook
const wb = XLSX.utils.book_new();

// Create main data sheet
const wsData = [headers, ...sampleData];
const ws = XLSX.utils.aoa_to_sheet(wsData);

// Set column widths - base columns
const baseColWidths = [
  { wch: 12 },  // Mã sản phẩm
  { wch: 35 },  // Tên sản phẩm
  { wch: 18 },  // SKU
  { wch: 15 },  // Mã vạch
  { wch: 12 },  // Loại sản phẩm
  { wch: 12 },  // Trạng thái
  { wch: 10 },  // Đơn vị tính
  { wch: 30 },  // Danh mục
  { wch: 20 },  // Danh mục phụ
  { wch: 50 },  // Mô tả
  { wch: 35 },  // Mô tả ngắn
  { wch: 40 },  // Ảnh đại diện
  { wch: 60 },  // Ảnh bộ sưu tập
  { wch: 60 },  // Video link
  { wch: 12 },  // Giá vốn
  { wch: 12 },  // Giá bán
  { wch: 15 },  // Giá bán lẻ đề xuất
  { wch: 12 },  // Giá tối thiểu
  { wch: 15 },  // Giá nhập gần nhất
  { wch: 12 },  // Thuế suất
];

// Add column widths for pricing policies
const pricingColWidths = samplePricingPolicies.map(() => ({ wch: 12 }));

// Continue with remaining columns
const remainingColWidths = [
  { wch: 15 },  // Tồn kho ban đầu
  { wch: 15 },  // Theo dõi tồn kho
  { wch: 15 },  // Mức đặt hàng lại
  { wch: 15 },  // Tồn kho an toàn
  { wch: 12 },  // Tồn kho tối đa
  { wch: 10 },  // Vị trí kho
  { wch: 12 },  // Trọng lượng
  { wch: 15 },  // Đơn vị trọng lượng
  { wch: 18 },  // Kích thước
  { wch: 12 },  // Bảo hành
  { wch: 30 },  // Tên VAT
  { wch: 15 },  // Xuất xứ
  { wch: 50 },  // Hướng dẫn sử dụng
  { wch: 25 },  // Đơn vị nhập khẩu
  { wch: 35 },  // Địa chỉ nhập khẩu
  // E-commerce columns
  { wch: 30 },  // Slug (URL)
  { wch: 10 },  // Đăng web
  { wch: 10 },  // Nổi bật
  { wch: 10 },  // Mới về
  { wch: 10 },  // Bán chạy
  { wch: 12 },  // Đang giảm giá
  { wch: 12 },  // Thứ tự hiển thị
  { wch: 12 },  // Ngày đăng web
  // SEO & Tags
  { wch: 40 },  // Tiêu đề SEO
  { wch: 60 },  // Mô tả SEO
  { wch: 30 },  // Tags
  { wch: 10 },  // ID PKGX
  { wch: 12 },  // Ngày ra mắt
  { wch: 18 },  // Ngày ngừng kinh doanh
];

ws['!cols'] = [...baseColWidths, ...pricingColWidths, ...remainingColWidths];

XLSX.utils.book_append_sheet(wb, ws, 'Sản phẩm');

// Create instructions sheet
const instructionsData = [
  ['═══════════════════════════════════════════════════════════════════════════════'],
  ['                    HƯỚNG DẪN IMPORT SẢN PHẨM'],
  ['═══════════════════════════════════════════════════════════════════════════════'],
  [''],
  ['1. CỘT BẮT BUỘC:'],
  ['   - Tên sản phẩm (*): Tên hiển thị của sản phẩm'],
  [''],
  ['───────────────────────────────────────────────────────────────────────────────'],
  ['2. MÃ SẢN PHẨM:'],
  ['   - Để trống: Hệ thống tự tạo mã mới (SP000001, SP000002,...)'],
  ['   - Nhập mã có sẵn: Sẽ cập nhật sản phẩm (tùy chế độ import)'],
  [''],
  ['───────────────────────────────────────────────────────────────────────────────'],
  ['3. LOẠI SẢN PHẨM:'],
  ['   - Hàng hóa   : Sản phẩm vật lý (mặc định)'],
  ['   - Dịch vụ    : Dịch vụ'],
  ['   - Sản phẩm số: Sản phẩm kỹ thuật số'],
  ['   ⚠️ LƯU Ý: KHÔNG hỗ trợ import "Combo" - tạo Combo trực tiếp trong hệ thống'],
  [''],
  ['───────────────────────────────────────────────────────────────────────────────'],
  ['4. TRẠNG THÁI:'],
  ['   - Đang kinh doanh : Sản phẩm đang bán (mặc định)'],
  ['   - Ngừng kinh doanh: Tạm ngừng bán'],
  ['   - Ngừng nhập      : Không nhập hàng nữa'],
  [''],
  ['───────────────────────────────────────────────────────────────────────────────'],
  ['5. DANH MỤC & DANH MỤC PHỤ (HỖ TRỢ NHIỀU DANH MỤC):'],
  [''],
  ['   ⭐ MỖI SẢN PHẨM CÓ THỂ THUỘC NHIỀU DANH MỤC'],
  [''],
  ['   Dùng dấu ";" để phân cách nhiều danh mục:'],
  ['   Dùng dấu ">" để phân cách các cấp trong 1 danh mục:'],
  [''],
  ['   VÍ DỤ 1 DANH MỤC (đơn):'],
  ['   ▸ Thời trang > Áo nam > Áo sơ mi'],
  [''],
  ['   VÍ DỤ NHIỀU DANH MỤC (phân cách bằng dấu ;):'],
  ['   ▸ Thời trang > Áo nam; Sale > Hot deal; Bán chạy'],
  ['   ▸ Giày dép > Giày nam; Thể thao > Running; Mới về'],
  [''],
  ['   VÍ DỤ THỰC TẾ TRONG EXCEL:'],
  ['   ┌─────────────────────────────────────────────────────────────────────────┐'],
  ['   │ Danh mục                                      │ Danh mục phụ            │'],
  ['   ├─────────────────────────────────────────────────────────────────────────┤'],
  ['   │ Thời trang > Áo nam; Sale > Hot              │ Slim fit; Cotton        │'],
  ['   │ Quần nam > Jean; Bán chạy; Mới về            │ Slim fit > Form ôm      │'],
  ['   │ Giày dép > Giày nam; Thể thao > Running      │ Nike > Air Max          │'],
  ['   │ Phụ kiện > Túi xách; Quà tặng > Nữ           │ Da PU > Cao cấp         │'],
  ['   └─────────────────────────────────────────────────────────────────────────┘'],
  [''],
  ['   💡 LƯU Ý:'],
  ['   - Nhiều danh mục PHÂN CÁCH bằng dấu chấm phẩy (;)'],
  ['   - Cấp bậc trong 1 danh mục dùng dấu lớn hơn (>)'],
  ['   - Có thể để 1 danh mục hoặc nhiều danh mục tùy ý'],
  [''],
  ['───────────────────────────────────────────────────────────────────────────────'],
  ['6. HÌNH ẢNH:'],
  [''],
  ['   Hỗ trợ 2 loại đường dẫn:'],
  ['   ▸ Ảnh từ server   : /products/SP001/main.jpg'],
  ['   ▸ Ảnh từ URL ngoài: https://cdn.example.com/image.jpg'],
  [''],
  ['   Nhiều ảnh: Dùng dấu ";" hoặc "|" để phân cách'],
  ['   VD: /products/SP001/1.jpg; /products/SP001/2.jpg; /products/SP001/3.jpg'],
  [''],
  ['   Định dạng hỗ trợ: .jpg, .jpeg, .png, .gif, .webp, .svg'],
  [''],
  ['───────────────────────────────────────────────────────────────────────────────'],
  ['7. TỒN KHO BAN ĐẦU:'],
  [''],
  ['   ⚠️ QUAN TRỌNG:'],
  ['   - CHỈ áp dụng khi TẠO MỚI sản phẩm'],
  ['   - Nếu sản phẩm đã tồn tại → tồn kho ban đầu sẽ bị BỎ QUA'],
  ['   - Tồn kho được gán vào chi nhánh đã chọn trong dialog import'],
  ['   - Sau khi import, tồn kho quản lý qua phiếu nhập/xuất/kiểm kê'],
  [''],
  ['───────────────────────────────────────────────────────────────────────────────'],
  ['8. THEO DÕI TỒN KHO:'],
  [''],
  ['   ▸ "Có" / "Yes" / "1" : Có theo dõi'],
  ['   ▸ "Không" / "No" / "0": Không theo dõi'],
  [''],
  ['   Dịch vụ (service), Sản phẩm số (digital) thường KHÔNG cần theo dõi tồn kho'],
  [''],
  ['───────────────────────────────────────────────────────────────────────────────'],
  ['9. GIÁ:'],
  [''],
  ['   - Nhập số nguyên, KHÔNG có dấu phân cách hàng nghìn'],
  ['   - VD: 150000 (đúng), 150.000 (sai)'],
  ['   - Hệ thống sẽ CẢNH BÁO nếu Giá bán < Giá vốn'],
  [''],
  ['───────────────────────────────────────────────────────────────────────────────'],
  ['10. GIÁ THEO BẢNG GIÁ (DYNAMIC COLUMNS):'],
  [''],
  ['   ⭐ CÁCH MỚI: Mỗi bảng giá là 1 CỘT RIÊNG trong Excel'],
  [''],
  ['   Tên cột = Mã bảng giá trong hệ thống (VD: PL_10, BANLE, VIP...)'],
  ['   Giá trị cột = Số tiền giá bán cho bảng giá đó'],
  [''],
  ['   VÍ DỤ FILE EXCEL:'],
  ['   ┌─────────────┬─────────┬─────────┬─────────┬─────────┬─────────┐'],
  ['   │ Tên SP (*)  │ Giá bán │ PL_10   │ BANLE   │ BANSI   │ VIP     │'],
  ['   ├─────────────┼─────────┼─────────┼─────────┼─────────┼─────────┤'],
  ['   │ Áo sơ mi    │ 299000  │ 269100  │ 299000  │ 250000  │ 220000  │'],
  ['   │ Quần jean   │ 450000  │ 405000  │ 450000  │ 380000  │         │'],
  ['   │ Giày Nike   │ 650000  │         │ 650000  │         │ 550000  │'],
  ['   └─────────────┴─────────┴─────────┴─────────┴─────────┴─────────┘'],
  [''],
  ['   💡 LƯU Ý:'],
  ['   - Chỉ cần thêm CỘT cho bảng giá bạn muốn set giá'],
  ['   - Bỏ trống cột nếu SP không có giá riêng cho bảng giá đó'],
  ['   - Mã bảng giá phải KHỚP với mã trong hệ thống (phân biệt hoa/thường)'],
  ['   - Có thể thêm/xóa cột bảng giá tùy ý - hệ thống tự nhận diện'],
  [''],
  ['   VÍ DỤ CÁC MÃ BẢNG GIÁ THƯỜNG DÙNG:'],
  ['   ┌─────────────────────────────────────────────────────────────┐'],
  ['   │ PL_10   - Giảm 10% so với giá bán                          │'],
  ['   │ PL_20   - Giảm 20% so với giá bán                          │'],
  ['   │ BANLE   - Giá bán lẻ                                       │'],
  ['   │ BANSI   - Giá bán sỉ                                       │'],
  ['   │ VIP     - Giá cho khách VIP                                │'],
  ['   │ DAI_LY  - Giá đại lý                                       │'],
  ['   └─────────────────────────────────────────────────────────────┘'],
  [''],
  ['───────────────────────────────────────────────────────────────────────────────'],
  ['11. E-COMMERCE (BÁN HÀNG WEBSITE):'],
  [''],
  ['   Các cột cho bán hàng trên website:'],
  [''],
  ['   ┌────────────────────┬────────────────────────────────────────────────────┐'],
  ['   │ Cột                │ Mô tả                                              │'],
  ['   ├────────────────────┼────────────────────────────────────────────────────┤'],
  ['   │ Slug (URL)         │ Đường dẫn thân thiện: ao-so-mi-nam-trang           │'],
  ['   │ Đăng web           │ Có/Không - Hiển thị trên website                   │'],
  ['   │ Nổi bật            │ Có/Không - Hiện ở mục Sản phẩm nổi bật             │'],
  ['   │ Mới về             │ Có/Không - Hiện ở mục Sản phẩm mới                 │'],
  ['   │ Bán chạy           │ Có/Không - Hiện ở mục Bán chạy                     │'],
  ['   │ Đang giảm giá      │ Có/Không - Hiện ở mục Sale                         │'],
  ['   │ Thứ tự hiển thị    │ Số (1,2,3...) - Số nhỏ hiện trước                  │'],
  ['   │ Ngày đăng web      │ YYYY-MM-DD - Ngày bắt đầu hiện trên web            │'],
  ['   └────────────────────┴────────────────────────────────────────────────────┘'],
  [''],
  ['   💡 LƯU Ý:'],
  ['   - Slug tự động tạo từ tên SP nếu để trống'],
  ['   - "Đăng web" = Không thì SP chỉ dùng cho HRM, không hiện trên website'],
  ['   - Có thể đánh dấu 1 SP vào nhiều mục (Nổi bật + Mới về + Bán chạy)'],
  [''],
  ['───────────────────────────────────────────────────────────────────────────────'],
  ['12. KÍCH THƯỚC:'],
  [''],
  ['   Format: Dài x Rộng x Cao (đơn vị cm)'],
  ['   VD: 40x30x2'],
  [''],
  ['───────────────────────────────────────────────────────────────────────────────'],
  ['13. TAGS:'],
  [''],
  ['   Dùng dấu ";" hoặc "," để phân cách nhiều tags'],
  ['   VD: nam;công sở;cotton;oxford'],
  [''],
  ['───────────────────────────────────────────────────────────────────────────────'],
  ['14. NGÀY THÁNG:'],
  [''],
  ['   Format: YYYY-MM-DD'],
  ['   VD: 2024-01-15'],
  [''],
  ['═══════════════════════════════════════════════════════════════════════════════'],
];

const wsInstructions = XLSX.utils.aoa_to_sheet(instructionsData);
wsInstructions['!cols'] = [{ wch: 85 }];
XLSX.utils.book_append_sheet(wb, wsInstructions, 'Hướng dẫn');

// Write file
const outputPath = path.join(__dirname, '../public/templates/mau-import-san-pham.xlsx');
XLSX.writeFile(wb, outputPath);

console.log('✅ Đã tạo file mẫu:', outputPath);
console.log('   - Sheet "Sản phẩm": Dữ liệu mẫu với 8 sản phẩm đầy đủ cột');
console.log('   - Sheet "Hướng dẫn": Hướng dẫn chi tiết các cột');
console.log('');
console.log('📋 Các cột trong file:');
console.log('   - Thông tin cơ bản: 11 cột');
console.log('   - Hình ảnh: 2 cột');
console.log('   - Giá cơ bản: 6 cột');
console.log(`   - Giá theo bảng giá (động): ${samplePricingPolicies.length} cột mẫu (${samplePricingPolicies.join(', ')})`);
console.log('   - Tồn kho: 6 cột');
console.log('   - Vật lý: 3 cột');
console.log('   - Bảo hành: 1 cột');
console.log('   - Tem phụ: 5 cột');
console.log('   - E-commerce: 8 cột (Slug, Đăng web, Nổi bật, Mới về, Bán chạy, Giảm giá, Thứ tự, Ngày đăng)');
console.log('   - SEO & Phân loại: 4 cột');
console.log('   - Vòng đời: 2 cột');
console.log('   ─────────────────────');
console.log(`   TỔNG: ${headers.length} cột`);
console.log('');
console.log('💡 TIP: User có thể thêm/xóa cột bảng giá bằng cách dùng mã bảng giá làm tên cột');
