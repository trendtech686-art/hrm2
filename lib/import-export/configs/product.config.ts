import type { Product } from '@/features/products/types';
import type { ImportExportConfig, FieldConfig } from '../types';
import { usePricingPolicyStore } from '@/features/settings/pricing/store';

/**
 * Product Import/Export Configuration
 * Theo chuẩn ImportExportConfig để dùng với GenericImportDialogV2 và GenericExportDialogV2
 */

// Helper: Get all pricing policies
const getAllPricingPolicies = () => {
  return usePricingPolicyStore.getState().data;
};

// Helper: Get pricing policy systemId from code (id)
const getPricingPolicySystemId = (code: string): string | null => {
  const policies = getAllPricingPolicies();
  const policy = policies.find(p => p.id.toUpperCase() === code.toUpperCase());
  return policy?.systemId || null;
};

// Helper: Get pricing policy code (id) from systemId  
const getPricingPolicyCode = (systemId: string): string => {
  const policies = getAllPricingPolicies();
  const policy = policies.find(p => p.systemId === systemId);
  return policy?.id || systemId;
};

// Helper: Check if a column name matches a pricing policy code
const isPricingPolicyColumn = (columnName: string): boolean => {
  const policies = getAllPricingPolicies();
  return policies.some(p => p.id.toUpperCase() === columnName.toUpperCase());
};

// ===== FIELD DEFINITIONS =====
export const productFields: FieldConfig<Product>[] = [
  // ===== THÔNG TIN CƠ BẢN =====
  {
    key: 'id',
    label: 'Mã sản phẩm',
    required: false, // Tự generate nếu để trống
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'SP000001',
  },
  {
    key: 'name',
    label: 'Tên sản phẩm (*)',
    required: true,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'Áo sơ mi nam',
  },
  {
    key: 'sku',
    label: 'SKU',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'ASM-001',
  },
  {
    key: 'barcode',
    label: 'Mã vạch',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: '8934567890123',
  },
  {
    key: 'type',
    label: 'Loại sản phẩm',
    required: false,
    type: 'enum',
    enumValues: ['physical', 'service', 'digital'], // Không cho phép import combo
    enumLabels: {
      'physical': 'Hàng hóa',
      'service': 'Dịch vụ',
      'digital': 'Sản phẩm số',
    },
    exportGroup: 'Thông tin cơ bản',
    example: 'Hàng hóa',
    defaultValue: 'physical',
    importTransform: (value: unknown) => {
      if (!value) return 'physical';
      const str = String(value).toLowerCase().trim();
      // Map tiếng Việt sang English
      if (str === 'hàng hóa' || str === 'hang hoa' || str === 'physical') return 'physical';
      if (str === 'dịch vụ' || str === 'dich vu' || str === 'service') return 'service';
      if (str === 'sản phẩm số' || str === 'san pham so' || str === 'kỹ thuật số' || str === 'digital') return 'digital';
      return 'physical';
    },
    validator: (value: unknown) => {
      if (value === 'combo') {
        return 'Không hỗ trợ import sản phẩm Combo. Vui lòng tạo Combo trực tiếp trong hệ thống.';
      }
      return null;
    },
  },
  {
    key: 'status',
    label: 'Trạng thái',
    required: false,
    type: 'enum',
    enumValues: ['active', 'inactive', 'discontinued'],
    enumLabels: {
      'active': 'Đang kinh doanh',
      'inactive': 'Ngừng kinh doanh',
      'discontinued': 'Ngừng nhập',
    },
    exportGroup: 'Thông tin cơ bản',
    example: 'Đang kinh doanh',
    defaultValue: 'active',
    importTransform: (value: unknown) => {
      if (!value) return 'active';
      const str = String(value).toLowerCase().trim();
      // Map tiếng Việt sang English
      if (str === 'đang kinh doanh' || str === 'dang kinh doanh' || str === 'active') return 'active';
      if (str === 'ngừng kinh doanh' || str === 'ngung kinh doanh' || str === 'inactive') return 'inactive';
      if (str === 'ngừng nhập' || str === 'ngung nhap' || str === 'discontinued') return 'discontinued';
      return 'active';
    },
  },
  {
    key: 'unit',
    label: 'Đơn vị tính',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'Cái',
    defaultValue: 'Cái',
  },
  {
    key: 'categories',
    label: 'Danh mục',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'Thời trang > Áo nam; Sale > Hot deal', // Nhiều danh mục phân cách bằng ;
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const str = String(value).trim();
      if (!str) return undefined;
      // Split by semicolon to get multiple categories, each category can have multi-level with >
      return str.split(';').map(s => s.trim()).filter(Boolean);
    },
    exportTransform: (value: unknown) => {
      const categories = value as string[] | undefined;
      return categories?.join('; ') || '';
    },
  },
  // Legacy single category field (backward compatibility)
  {
    key: 'category',
    label: 'Danh mục (cũ)',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    hidden: true, // Ẩn trong import, chỉ dùng cho backward compatibility
    example: 'Thời trang > Áo nam > Áo sơ mi',
  },
  {
    key: 'description',
    label: 'Mô tả',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'Áo sơ mi nam cao cấp',
  },
  {
    key: 'shortDescription',
    label: 'Mô tả ngắn',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'Áo sơ mi nam',
  },

  // ===== HÌNH ẢNH =====
  // NOTE: Hình ảnh được upload lên server trước, sau đó import đường dẫn
  // Format: /products/{ma_sp}/{ten_file}.jpg hoặc URL đầy đủ
  {
    key: 'thumbnailImage',
    label: 'Ảnh đại diện',
    required: false,
    type: 'string',
    exportGroup: 'Hình ảnh',
    example: '/products/SP001/main.jpg',
    validator: (value: unknown) => {
      if (!value) return null; // Optional
      const str = String(value).trim();
      // Cho phép: /path/to/file.ext hoặc http(s)://...
      if (!str.startsWith('/') && !str.startsWith('http')) {
        return 'Đường dẫn ảnh phải bắt đầu bằng / hoặc http(s)://';
      }
      // Check extension
      const validExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const hasValidExt = validExts.some(ext => str.toLowerCase().endsWith(ext));
      if (!hasValidExt && !str.includes('?')) { // Ignore if has query params
        return 'Định dạng ảnh không hợp lệ (jpg, png, gif, webp, svg)';
      }
      return null;
    },
  },
  {
    key: 'galleryImages',
    label: 'Ảnh bộ sưu tập',
    required: false,
    type: 'string',
    exportGroup: 'Hình ảnh',
    example: '/products/SP001/1.jpg, /products/SP001/2.jpg',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const str = String(value).trim();
      if (!str) return undefined;
      return str.split(/[,;|]/).map(s => s.trim()).filter(Boolean);
    },
    exportTransform: (value: unknown) => {
      const images = value as string[] | undefined;
      return images?.join(', ') || '';
    },
    validator: (value: unknown) => {
      if (!value) return null;
      const str = String(value).trim();
      if (!str) return null;
      const paths = str.split(/[,;|]/).map(s => s.trim()).filter(Boolean);
      const validExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      for (const path of paths) {
        if (!path.startsWith('/') && !path.startsWith('http')) {
          return `Đường dẫn "${path}" phải bắt đầu bằng / hoặc http(s)://`;
        }
        const hasValidExt = validExts.some(ext => path.toLowerCase().endsWith(ext));
        if (!hasValidExt && !path.includes('?')) {
          return `Đường dẫn "${path}" có định dạng ảnh không hợp lệ`;
        }
      }
      return null;
    },
  },

  // ===== VIDEO LINKS =====
  {
    key: 'videoLinks',
    label: 'Video link',
    required: false,
    type: 'string',
    exportGroup: 'Media',
    example: 'https://youtube.com/watch?v=xxx; https://drive.google.com/file/xxx',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const str = String(value).trim();
      if (!str) return undefined;
      return str.split(/[,;|]/).map(s => s.trim()).filter(Boolean);
    },
    exportTransform: (value: unknown) => {
      const links = value as string[] | undefined;
      return links?.join('; ') || '';
    },
    validator: (value: unknown) => {
      if (!value) return null;
      const str = String(value).trim();
      if (!str) return null;
      const links = str.split(/[,;|]/).map(s => s.trim()).filter(Boolean);
      for (const link of links) {
        if (!link.startsWith('http')) {
          return `Link "${link}" phải bắt đầu bằng http:// hoặc https://`;
        }
        // Kiểm tra domain hợp lệ (YouTube, TikTok, Drive, Vimeo, etc.)
        const validDomains = ['youtube.com', 'youtu.be', 'tiktok.com', 'drive.google.com', 'vimeo.com', 'facebook.com', 'fb.watch'];
        const isValidDomain = validDomains.some(domain => link.includes(domain));
        if (!isValidDomain) {
          // Cho phép các domain khác nhưng cảnh báo
          console.warn(`Link "${link}" không thuộc các nền tảng video phổ biến`);
        }
      }
      return null;
    },
  },

  // ===== GIÁ =====
  {
    key: 'costPrice',
    label: 'Giá vốn',
    required: false,
    type: 'number',
    exportGroup: 'Giá',
    example: '150000',
    importTransform: (value: unknown) => {
      if (!value) return 0;
      const num = Number(String(value).replace(/[,.\s]/g, ''));
      return isNaN(num) ? 0 : num;
    },
  },
  {
    key: 'sellingPrice',
    label: 'Giá bán',
    required: false,
    type: 'number',
    exportGroup: 'Giá',
    example: '250000',
    importTransform: (value: unknown) => {
      if (!value) return 0;
      const num = Number(String(value).replace(/[,.\s]/g, ''));
      return isNaN(num) ? 0 : num;
    },
  },
  {
    key: 'minPrice',
    label: 'Giá tối thiểu',
    required: false,
    type: 'number',
    exportGroup: 'Giá',
    example: '200000',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const num = Number(String(value).replace(/[,.\s]/g, ''));
      return isNaN(num) ? undefined : num;
    },
  },
  {
    key: 'taxRate',
    label: 'Thuế suất (%)',
    required: false,
    type: 'number',
    exportGroup: 'Giá',
    example: '10',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const num = Number(String(value).replace(/[%\s]/g, ''));
      return isNaN(num) ? undefined : num;
    },
  },
  // NOTE: Giá theo bảng giá (prices) được xử lý động trong preTransformRawRow
  // User tạo cột với tên = mã bảng giá (VD: PL_10, BANLE, VIP...)
  // Hệ thống tự detect và gom vào field prices

  // ===== TỒN KHO =====
  // NOTE: initialStock chỉ áp dụng khi TẠO MỚI sản phẩm (mode insert-only)
  // Tồn kho sau đó được quản lý qua phiếu nhập/xuất/kiểm kê
  {
    key: 'initialStock',
    label: 'Tồn kho ban đầu',
    required: false,
    type: 'number',
    exportGroup: 'Tồn kho',
    example: '100',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const num = Number(String(value).replace(/[,.\s]/g, ''));
      return isNaN(num) || num < 0 ? undefined : num;
    },
    // NOTE: Field này chỉ dùng khi import tạo mới
    // Không export vì tồn kho thực tế nằm trong inventoryByBranch
  },
  {
    key: 'isStockTracked',
    label: 'Theo dõi tồn kho',
    required: false,
    type: 'boolean',
    exportGroup: 'Tồn kho',
    example: 'Có',
    defaultValue: true,
    importTransform: (value: unknown) => {
      if (!value) return true;
      const str = String(value).toLowerCase();
      return str === 'có' || str === 'yes' || str === 'true' || str === '1';
    },
  },
  {
    key: 'reorderLevel',
    label: 'Mức đặt hàng lại',
    required: false,
    type: 'number',
    exportGroup: 'Tồn kho',
    example: '10',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const num = Number(String(value).replace(/[,.\s]/g, ''));
      return isNaN(num) ? undefined : num;
    },
  },
  {
    key: 'safetyStock',
    label: 'Tồn kho an toàn',
    required: false,
    type: 'number',
    exportGroup: 'Tồn kho',
    example: '5',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const num = Number(String(value).replace(/[,.\s]/g, ''));
      return isNaN(num) ? undefined : num;
    },
  },
  {
    key: 'maxStock',
    label: 'Tồn kho tối đa',
    required: false,
    type: 'number',
    exportGroup: 'Tồn kho',
    example: '100',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const num = Number(String(value).replace(/[,.\s]/g, ''));
      return isNaN(num) ? undefined : num;
    },
  },

  // ===== VẬT LÝ =====
  {
    key: 'weight',
    label: 'Trọng lượng',
    required: false,
    type: 'number',
    exportGroup: 'Vật lý',
    example: '200',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const num = Number(String(value).replace(/[,.\s]/g, ''));
      return isNaN(num) ? undefined : num;
    },
  },
  {
    key: 'weightUnit',
    label: 'Đơn vị trọng lượng',
    required: false,
    type: 'enum',
    enumValues: ['g', 'kg'],
    exportGroup: 'Vật lý',
    example: 'g',
    defaultValue: 'g',
  },

  // ===== BẢO HÀNH =====
  {
    key: 'warrantyPeriodMonths',
    label: 'Bảo hành (tháng)',
    required: false,
    type: 'number',
    exportGroup: 'Bảo hành',
    example: '12',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const num = Number(String(value).replace(/[,.\s]/g, ''));
      return isNaN(num) ? undefined : num;
    },
  },

  // ===== KÍCH THƯỚC =====
  {
    key: 'dimensions',
    label: 'Kích thước (DxRxC cm)',
    required: false,
    type: 'string',
    exportGroup: 'Vật lý',
    example: '30x20x10',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const str = String(value).trim();
      const match = str.match(/^(\d+(?:\.\d+)?)\s*[xX×]\s*(\d+(?:\.\d+)?)\s*[xX×]\s*(\d+(?:\.\d+)?)$/);
      if (match) {
        return {
          length: parseFloat(match[1]),
          width: parseFloat(match[2]),
          height: parseFloat(match[3]),
        };
      }
      return undefined;
    },
    exportTransform: (value: unknown) => {
      const dims = value as { length?: number; width?: number; height?: number } | undefined;
      if (dims && typeof dims === 'object' && 'length' in dims) {
        return `${dims.length || 0}x${dims.width || 0}x${dims.height || 0}`;
      }
      return '';
    },
  },

  // ===== THÔNG TIN MỞ RỘNG =====
  {
    key: 'ktitle',
    label: 'Tiêu đề SEO',
    required: false,
    type: 'string',
    exportGroup: 'Mô tả',
    example: 'Áo sơ mi nam cao cấp | Thời trang ABC',
  },
  {
    key: 'seoDescription',
    label: 'Mô tả SEO',
    required: false,
    type: 'string',
    exportGroup: 'Mô tả',
    example: 'Áo sơ mi nam chất liệu cotton cao cấp...',
  },
  {
    key: 'subCategories',
    label: 'Danh mục phụ',
    required: false,
    type: 'string',
    exportGroup: 'Phân loại',
    example: 'Slim fit > Form ôm; Cotton > Cao cấp', // Nhiều danh mục phụ phân cách bằng ;
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const str = String(value).trim();
      if (!str) return undefined;
      // Split by semicolon to get multiple sub-categories
      return str.split(';').map(s => s.trim()).filter(Boolean);
    },
    exportTransform: (value: unknown) => {
      const subCategories = value as string[] | undefined;
      return subCategories?.join('; ') || '';
    },
  },
  // Legacy single subCategory field (backward compatibility)
  {
    key: 'subCategory',
    label: 'Danh mục phụ (cũ)',
    required: false,
    type: 'string',
    exportGroup: 'Phân loại',
    hidden: true,
    example: 'Áo sơ mi > Dài tay > Slim fit',
  },
  {
    key: 'tags',
    label: 'Tags',
    required: false,
    type: 'string',
    exportGroup: 'Phân loại',
    example: 'nam,công sở,cotton',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const str = String(value).trim();
      return str.split(/[,;]/).map(s => s.trim()).filter(Boolean);
    },
    exportTransform: (value: unknown) => {
      const tags = value as string[] | undefined;
      return tags?.join(', ') || '';
    },
  },
  {
    key: 'pkgxId',
    label: 'ID PKGX',
    required: false,
    type: 'number',
    exportGroup: 'Thông tin cơ bản',
    example: '12345',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const num = Number(String(value).replace(/[,.\s]/g, ''));
      return isNaN(num) || num <= 0 ? undefined : num;
    },
  },
  {
    key: 'warehouseLocation',
    label: 'Vị trí kho',
    required: false,
    type: 'string',
    exportGroup: 'Tồn kho',
    example: 'A1-01',
  },

  // ===== GIÁ BỔ SUNG =====
  {
    key: 'lastPurchasePrice',
    label: 'Giá nhập gần nhất',
    required: false,
    type: 'number',
    exportGroup: 'Giá',
    example: '140000',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const num = Number(String(value).replace(/[,.\s]/g, ''));
      return isNaN(num) ? undefined : num;
    },
  },

  // ===== THÔNG TIN TEM =====
  {
    key: 'nameVat',
    label: 'Tên VAT',
    required: false,
    type: 'string',
    exportGroup: 'Tem phụ',
    example: 'Áo sơ mi nam cotton',
  },
  {
    key: 'origin',
    label: 'Xuất xứ',
    required: false,
    type: 'string',
    exportGroup: 'Tem phụ',
    example: 'Việt Nam',
  },
  {
    key: 'usageGuide',
    label: 'Hướng dẫn sử dụng',
    required: false,
    type: 'string',
    exportGroup: 'Tem phụ',
    example: 'Giặt máy ở nhiệt độ thấp',
  },
  {
    key: 'importerName',
    label: 'Đơn vị nhập khẩu',
    required: false,
    type: 'string',
    exportGroup: 'Tem phụ',
    example: 'Công ty TNHH ABC',
  },
  {
    key: 'importerAddress',
    label: 'Địa chỉ nhập khẩu',
    required: false,
    type: 'string',
    exportGroup: 'Tem phụ',
    example: '123 Nguyễn Văn A, Q.1, TP.HCM',
  },

  // ===== E-COMMERCE (bán hàng website) =====
  {
    key: 'slug',
    label: 'Slug (URL)',
    required: false,
    type: 'string',
    exportGroup: 'E-commerce',
    example: 'ao-so-mi-nam-trang-oxford',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      // Convert to URL-friendly slug
      return String(value).trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    },
  },
  {
    key: 'isPublished',
    label: 'Đăng web',
    required: false,
    type: 'boolean',
    exportGroup: 'E-commerce',
    example: 'Có',
    defaultValue: false,
    importTransform: (value: unknown) => {
      if (value === undefined || value === null || value === '') return false;
      const str = String(value).toLowerCase().trim();
      return str === 'có' || str === 'yes' || str === '1' || str === 'true' || str === 'x';
    },
    exportTransform: (value: unknown) => (value ? 'Có' : 'Không'),
  },
  {
    key: 'isFeatured',
    label: 'Nổi bật',
    required: false,
    type: 'boolean',
    exportGroup: 'E-commerce',
    example: 'Có',
    defaultValue: false,
    importTransform: (value: unknown) => {
      if (value === undefined || value === null || value === '') return false;
      const str = String(value).toLowerCase().trim();
      return str === 'có' || str === 'yes' || str === '1' || str === 'true' || str === 'x';
    },
    exportTransform: (value: unknown) => (value ? 'Có' : 'Không'),
  },
  {
    key: 'isNewArrival',
    label: 'Mới về',
    required: false,
    type: 'boolean',
    exportGroup: 'E-commerce',
    example: 'Có',
    defaultValue: false,
    importTransform: (value: unknown) => {
      if (value === undefined || value === null || value === '') return false;
      const str = String(value).toLowerCase().trim();
      return str === 'có' || str === 'yes' || str === '1' || str === 'true' || str === 'x';
    },
    exportTransform: (value: unknown) => (value ? 'Có' : 'Không'),
  },
  {
    key: 'isBestSeller',
    label: 'Bán chạy',
    required: false,
    type: 'boolean',
    exportGroup: 'E-commerce',
    example: 'Có',
    defaultValue: false,
    importTransform: (value: unknown) => {
      if (value === undefined || value === null || value === '') return false;
      const str = String(value).toLowerCase().trim();
      return str === 'có' || str === 'yes' || str === '1' || str === 'true' || str === 'x';
    },
    exportTransform: (value: unknown) => (value ? 'Có' : 'Không'),
  },
  {
    key: 'isOnSale',
    label: 'Đang giảm giá',
    required: false,
    type: 'boolean',
    exportGroup: 'E-commerce',
    example: 'Có',
    defaultValue: false,
    importTransform: (value: unknown) => {
      if (value === undefined || value === null || value === '') return false;
      const str = String(value).toLowerCase().trim();
      return str === 'có' || str === 'yes' || str === '1' || str === 'true' || str === 'x';
    },
    exportTransform: (value: unknown) => (value ? 'Có' : 'Không'),
  },
  {
    key: 'sortOrder',
    label: 'Thứ tự hiển thị',
    required: false,
    type: 'number',
    exportGroup: 'E-commerce',
    example: '1',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const num = Number(String(value).replace(/[,.\s]/g, ''));
      return isNaN(num) ? undefined : num;
    },
  },
  {
    key: 'publishedAt',
    label: 'Ngày đăng web',
    required: false,
    type: 'date',
    exportGroup: 'E-commerce',
    example: '2024-01-15',
  },

  // ===== PHÂN TÍCH BÁN HÀNG =====
  {
    key: 'totalSold',
    label: 'Tổng đã bán',
    required: false,
    type: 'number',
    exportGroup: 'Phân tích',
    hidden: true, // Chỉ export, không import
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const num = Number(String(value).replace(/[,.\s]/g, ''));
      return isNaN(num) ? undefined : num;
    },
  },
  {
    key: 'totalRevenue',
    label: 'Tổng doanh thu',
    required: false,
    type: 'number',
    exportGroup: 'Phân tích',
    hidden: true, // Chỉ export, không import
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const num = Number(String(value).replace(/[,.\s]/g, ''));
      return isNaN(num) ? undefined : num;
    },
  },
  {
    key: 'lastSoldDate',
    label: 'Ngày bán gần nhất',
    required: false,
    type: 'date',
    exportGroup: 'Phân tích',
    hidden: true,
  },
  {
    key: 'viewCount',
    label: 'Lượt xem',
    required: false,
    type: 'number',
    exportGroup: 'Phân tích',
    hidden: true,
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const num = Number(String(value).replace(/[,.\s]/g, ''));
      return isNaN(num) ? undefined : num;
    },
  },

  // ===== VÒNG ĐỜI SẢN PHẨM =====
  {
    key: 'launchedDate',
    label: 'Ngày ra mắt',
    required: false,
    type: 'date',
    exportGroup: 'Vòng đời',
    example: '2024-01-15',
  },
  {
    key: 'lastPurchaseDate',
    label: 'Ngày nhập gần nhất',
    required: false,
    type: 'date',
    exportGroup: 'Vòng đời',
    hidden: true,
  },
  {
    key: 'discontinuedDate',
    label: 'Ngày ngừng kinh doanh',
    required: false,
    type: 'date',
    exportGroup: 'Vòng đời',
    example: '2025-12-31',
  },

  // ===== HỆ THỐNG (hidden) =====
  {
    key: 'systemId',
    label: 'System ID',
    required: false,
    type: 'string',
    exportGroup: 'Hệ thống',
    hidden: true,
  },
  {
    key: 'createdAt',
    label: 'Ngày tạo',
    required: false,
    type: 'date',
    exportGroup: 'Hệ thống',
    hidden: true,
  },
  {
    key: 'updatedAt',
    label: 'Ngày cập nhật',
    required: false,
    type: 'date',
    exportGroup: 'Hệ thống',
    hidden: true,
  },
];

// ===== MAIN CONFIG =====
export const productImportExportConfig: ImportExportConfig<Product> = {
  entityType: 'products',
  entityDisplayName: 'Sản phẩm',
  fields: productFields,
  upsertKey: 'id', // Dùng mã sản phẩm để đối chiếu khi UPDATE
  templateFileName: 'mau-import-san-pham.xlsx',
  requireBranch: true, // Bắt buộc chi nhánh để xử lý tồn kho ban đầu
  
  // Pre-transform raw row (normalize column names + detect pricing columns)
  preTransformRawRow: (rawRow: Record<string, unknown>) => {
    const normalized: Record<string, unknown> = {};
    const prices: Record<string, number> = {};
    
    // Map từ label tiếng Việt sang key
    const labelToKey: Record<string, string> = {};
    productFields.forEach(field => {
      labelToKey[field.label.toLowerCase()] = field.key as string;
      // Also map without (*) marker
      const labelWithoutStar = field.label.replace(/\s*\(\*\)\s*$/, '').toLowerCase();
      labelToKey[labelWithoutStar] = field.key as string;
    });
    
    Object.entries(rawRow).forEach(([key, value]) => {
      // Normalize Excel header: strip (*) marker and lowercase
      const normalizedExcelHeader = key.replace(/\s*\(\*\)\s*$/, '').toLowerCase();
      
      // Check if this column is a pricing policy code (e.g., PL_10, BANLE, VIP)
      const policySystemId = getPricingPolicySystemId(key);
      if (policySystemId && value !== undefined && value !== null && value !== '') {
        // This is a pricing column - parse price value
        const priceValue = Number(String(value).replace(/[,.\s]/g, ''));
        if (!isNaN(priceValue) && priceValue > 0) {
          prices[policySystemId] = priceValue;
        }
      } else {
        // Normal field - map to key
        const normalizedKey = labelToKey[normalizedExcelHeader] || labelToKey[key.toLowerCase()] || key;
        normalized[normalizedKey] = value;
      }
    });
    
    // Add prices if any pricing columns were found
    if (Object.keys(prices).length > 0) {
      normalized.prices = prices;
    }
    
    return normalized;
  },
  
  // Post-transform row (set defaults, enrich data)
  // NOTE: branchSystemId được truyền từ import dialog để xử lý tồn kho ban đầu
  postTransformRow: (row: Partial<Product & { initialStock?: number }>, _index?: number, branchSystemId?: string) => {
    // Xử lý tồn kho ban đầu - chỉ áp dụng khi có initialStock và branchSystemId
    let inventoryByBranch = row.inventoryByBranch || {};
    const initialStock = (row as { initialStock?: number }).initialStock;
    
    if (initialStock !== undefined && initialStock > 0 && branchSystemId) {
      inventoryByBranch = {
        ...inventoryByBranch,
        [branchSystemId]: initialStock,
      };
    }
    
    // Remove initialStock from final data (không lưu vào Product)
    const { initialStock: _removed, ...cleanRow } = row as Partial<Product> & { initialStock?: number };
    
    return {
      ...cleanRow,
      type: cleanRow.type || 'physical',
      status: cleanRow.status || 'active',
      unit: cleanRow.unit || 'Cái',
      costPrice: cleanRow.costPrice ?? 0,
      sellingPrice: cleanRow.sellingPrice ?? 0,
      isStockTracked: cleanRow.isStockTracked ?? true,
      prices: cleanRow.prices || {},
      inventoryByBranch,
      committedByBranch: cleanRow.committedByBranch || {},
      inTransitByBranch: cleanRow.inTransitByBranch || {},
    };
  },
  
  // Validate row level (check duplicate SKU/barcode + warnings)
  validateRow: (row, _index, existingData, mode) => {
    const errors: Array<{ field?: string; message: string; type?: 'error' | 'warning' }> = [];
    const rowWithInitialStock = row as Partial<Product> & { initialStock?: number };
    
    // Check unique SKU - only in insert-only mode
    if (row.sku && mode === 'insert-only') {
      const duplicate = existingData.find(
        p => p.sku === row.sku && p.id !== row.id
      );
      if (duplicate) {
        errors.push({
          field: 'sku',
          message: `SKU đã được sử dụng bởi ${duplicate.name} (${duplicate.id})`,
        });
      }
    }
    
    // Check unique barcode - only in insert-only mode
    if (row.barcode && mode === 'insert-only') {
      const duplicate = existingData.find(
        p => p.barcode === row.barcode && p.id !== row.id
      );
      if (duplicate) {
        errors.push({
          field: 'barcode',
          message: `Mã vạch đã được sử dụng bởi ${duplicate.name} (${duplicate.id})`,
        });
      }
    }
    
    // Cảnh báo: initialStock chỉ có tác dụng khi tạo mới
    if (rowWithInitialStock.initialStock !== undefined && rowWithInitialStock.initialStock > 0) {
      if (mode === 'update-only') {
        errors.push({
          field: 'initialStock',
          message: 'Tồn kho ban đầu sẽ bị BỎ QUA vì đang ở chế độ Cập nhật',
          type: 'warning',
        });
      } else if (mode === 'upsert') {
        // Check if product exists
        const exists = existingData.find(p => p.id === row.id);
        if (exists) {
          errors.push({
            field: 'initialStock',
            message: `SP đã tồn tại - tồn kho ban đầu sẽ BỎ QUA (giữ nguyên tồn kho hiện tại)`,
            type: 'warning',
          });
        }
      }
    }
    
    // Cảnh báo giá bán < giá vốn
    if (row.costPrice && row.sellingPrice && row.costPrice > row.sellingPrice) {
      errors.push({
        field: 'sellingPrice',
        message: `Giá bán (${row.sellingPrice?.toLocaleString()}) thấp hơn giá vốn (${row.costPrice?.toLocaleString()})`,
        type: 'warning',
      });
    }
    
    return errors;
  },
};

// Re-export cho backward compatibility
export default productImportExportConfig;
