import type { PkgxCategory, PkgxBrand } from './types';

/**
 * Danh sách danh mục PKGX (cat_id từ ECShop)
 * Nguồn: idpkgx.xlsx
 */
export const PKGX_CATEGORIES: PkgxCategory[] = [
  // === Danh mục chính - Hàng theo loại ===
  { id: 382, name: 'Sản phẩm mới' },
  { id: 302, name: 'Hàng Theo Loại Bán' },
  { id: 413, name: 'Hàng Hot Trend' },
  { id: 390, name: 'Hàng Bán Chạy' },
  { id: 389, name: 'Hàng Thanh Lý' },
  { id: 387, name: 'Hàng Độc Quyền' },
  { id: 391, name: 'Hàng bán Sàn TMĐT' },
  { id: 388, name: 'Hàng Tặng Kèm' },
  { id: 386, name: 'Hàng Chợ' },
  
  // === Tai nghe ===
  { id: 37, name: 'Sỉ tai nghe' },
  { id: 315, name: 'Tai nghe Bluetooth TWS' },
  { id: 314, name: 'Tai nghe có dây' },
  { id: 316, name: 'Tai nghe chụp tai bluetooth' },
  { id: 375, name: 'Tai nghe bluetooth 1 bên' },
  { id: 376, name: 'Tai nghe bluetooth thể thao' },
  { id: 377, name: 'Tai nghe chụp tai Gaming' },
  { id: 384, name: 'Case Tai Nghe Bluetooth' },
  
  // === Cáp sạc ===
  { id: 38, name: 'Sỉ cáp sạc' },
  { id: 317, name: 'Cáp sạc Type-C' },
  { id: 318, name: 'Cáp sạc Lightning' },
  { id: 319, name: 'Cáp sạc Micro USB' },
  { id: 320, name: 'Cáp sạc đa năng' },
  { id: 378, name: 'Cáp sạc nhanh' },
  
  // === Củ sạc ===
  { id: 39, name: 'Sỉ củ sạc' },
  { id: 321, name: 'Củ sạc nhanh' },
  { id: 322, name: 'Củ sạc thường' },
  { id: 323, name: 'Củ sạc không dây' },
  { id: 379, name: 'Củ sạc Magsafe' },
  
  // === Sạc dự phòng ===
  { id: 40, name: 'Sỉ sạc dự phòng' },
  { id: 324, name: 'Sạc dự phòng 10000mAh' },
  { id: 325, name: 'Sạc dự phòng 20000mAh' },
  { id: 326, name: 'Sạc dự phòng 30000mAh+' },
  { id: 380, name: 'Sạc dự phòng mini' },
  
  // === Loa ===
  { id: 41, name: 'Sỉ loa bluetooth' },
  { id: 327, name: 'Loa bluetooth mini' },
  { id: 328, name: 'Loa bluetooth karaoke' },
  { id: 329, name: 'Loa bluetooth chống nước' },
  { id: 381, name: 'Loa kéo' },
  
  // === Phụ kiện điện thoại ===
  { id: 42, name: 'Phụ kiện điện thoại' },
  { id: 330, name: 'Ốp lưng điện thoại' },
  { id: 331, name: 'Kính cường lực' },
  { id: 332, name: 'Giá đỡ điện thoại' },
  { id: 333, name: 'Gậy selfie/tripod' },
  { id: 383, name: 'Ring holder' },
  
  // === Phụ kiện máy tính ===
  { id: 43, name: 'Phụ kiện máy tính' },
  { id: 334, name: 'Chuột máy tính' },
  { id: 335, name: 'Bàn phím' },
  { id: 336, name: 'Hub USB' },
  { id: 337, name: 'Webcam' },
  
  // === Đồng hồ thông minh ===
  { id: 44, name: 'Sỉ đồng hồ thông minh' },
  { id: 338, name: 'Smartwatch' },
  { id: 339, name: 'Smartband' },
  { id: 340, name: 'Dây đeo smartwatch' },
  
  // === Gaming ===
  { id: 45, name: 'Phụ kiện gaming' },
  { id: 341, name: 'Tay cầm chơi game' },
  { id: 342, name: 'Quạt tản nhiệt điện thoại' },
  { id: 343, name: 'Nút bấm chơi game' },
  
  // === Ô tô ===
  { id: 46, name: 'Phụ kiện ô tô' },
  { id: 344, name: 'Sạc xe hơi' },
  { id: 345, name: 'Giá đỡ điện thoại xe hơi' },
  { id: 346, name: 'Camera hành trình' },
  
  // === Gia dụng ===
  { id: 47, name: 'Đồ gia dụng' },
  { id: 347, name: 'Đèn LED' },
  { id: 348, name: 'Quạt mini' },
  { id: 349, name: 'Cân điện tử' },
];

/**
 * Danh sách thương hiệu PKGX (brand_id từ ECShop)
 * Nguồn: idpkgx.xlsx
 */
export const PKGX_BRANDS: PkgxBrand[] = [
  // === Thương hiệu chính ===
  { id: 15, name: 'Hoco' },
  { id: 141, name: 'Borofone' },
  { id: 138, name: 'Baseus' },
  { id: 12, name: 'Wekome' },
  { id: 157, name: 'Maxitech' },
  
  // === Thương hiệu phụ ===
  { id: 10, name: 'Anker' },
  { id: 11, name: 'Xiaomi' },
  { id: 13, name: 'Samsung' },
  { id: 14, name: 'Apple' },
  { id: 16, name: 'Remax' },
  { id: 17, name: 'Ugreen' },
  { id: 18, name: 'Vivan' },
  { id: 19, name: 'Energizer' },
  { id: 20, name: 'Sony' },
  { id: 21, name: 'JBL' },
  { id: 22, name: 'Logitech' },
  { id: 23, name: 'Rapoo' },
  { id: 24, name: 'Orico' },
  { id: 25, name: 'Havit' },
  { id: 26, name: 'Edifier' },
  { id: 27, name: 'Aukey' },
  { id: 28, name: 'Belkin' },
  { id: 29, name: 'Mophie' },
  { id: 30, name: 'Spigen' },
  { id: 31, name: 'Nillkin' },
  { id: 32, name: 'ESR' },
  { id: 33, name: 'Mazer' },
  { id: 34, name: 'Hyphen' },
  { id: 35, name: 'WiWU' },
  { id: 36, name: 'Pisen' },
  { id: 37, name: 'Yoobao' },
  { id: 38, name: 'iWalk' },
  { id: 39, name: 'Romoss' },
  { id: 40, name: 'Tronsmart' },
  { id: 41, name: 'QCY' },
  { id: 42, name: 'Lenovo' },
  { id: 43, name: 'Huawei' },
  { id: 44, name: 'Oppo' },
  { id: 45, name: 'Vivo' },
  { id: 46, name: 'Realme' },
  { id: 47, name: 'Nothing' },
  { id: 100, name: 'Không thương hiệu' },
  { id: 101, name: 'OEM' },
  { id: 102, name: 'Noname' },
];

/**
 * API Configuration
 */
export const PKGX_API_CONFIG = {
  baseUrl: 'https://phukiengiaxuong.com.vn/admin/api_product_hrm.php',
  cdnUrl: 'https://phukiengiaxuong.com.vn/cdn/',
  defaultApiKey: 'a91f2c47e5d8b6f03a7c4e9d12f0b8a6',
  
  // Rate limiting
  maxRequestsPerMinute: 60,
  requestTimeout: 30000, // 30 seconds
  
  // Pagination
  defaultPageSize: 50,
  maxPageSize: 100,
};

/**
 * Field mapping reference
 */
export const FIELD_MAPPING_REFERENCE = {
  // HRM Field → PKGX Field
  'pkgxId': 'goods_id',
  'id': 'goods_sn',
  'name': 'goods_name',
  'categorySystemId': 'cat_id',
  'brandSystemId': 'brand_id',
  'description': 'goods_desc',
  'shortDescription': 'goods_brief',
  'ktitle': 'meta_title',
  'seoDescription': 'meta_desc',
  'tags': 'keywords',
  'thumbnailImage': 'original_img',
  'isFeatured': 'is_best',
  'isNewArrival': 'is_new',
  'isPublished': 'is_on_sale',
  'slug': 'slug',
} as const;

/**
 * PKGX Price field descriptions
 */
export const PKGX_PRICE_FIELDS = [
  { key: 'shopPrice', field: 'shop_price', label: 'Giá bán (shop_price)', description: 'Giá bán chính trên website' },
  { key: 'marketPrice', field: 'market_price', label: 'Giá thị trường (market_price)', description: 'Giá niêm yết / giá gốc' },
  { key: 'partnerPrice', field: 'partner_price', label: 'Giá đối tác (partner_price)', description: 'Giá dành cho đối tác' },
  { key: 'acePrice', field: 'ace_price', label: 'Giá ACE (ace_price)', description: 'Giá đặc biệt ACE' },
  { key: 'dealPrice', field: 'deal_price', label: 'Giá deal (deal_price)', description: 'Giá khuyến mãi' },
] as const;
