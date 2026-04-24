import { 
  getPrintTemplateConfigSync, 
  resolveTemplate, 
  getDefaultSizeForType 
} from '@/features/settings/printer/print-template-config';
import { TemplateType, PaperSize } from '@/lib/types/prisma-extended';
import { parseLabelSize, type PrintMargins, DEFAULT_MARGINS } from '@/features/settings/printer/types';
import { formatDateForDisplay, formatTimeForDisplay, formatDateTimeForDisplay } from '@/lib/date-utils';
import { getGeneralSettingsSync } from '@/lib/settings-cache';

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Lấy logo từ general-settings (fallback khi storeInfo không có logo)
 * Đảm bảo logo URL là absolute để hoạt động trong print context
 */
export function getStoreLogo(storeInfoLogo?: string): string | undefined {
  if (storeInfoLogo) return storeInfoLogo;
  try {
    const settings = getGeneralSettingsSync();
    const logoUrl = settings.logoUrl;
    if (!logoUrl) return undefined;
    
    // Make URL absolute if it's relative (starts with /)
    if (logoUrl.startsWith('/')) {
      if (typeof window !== 'undefined') {
        return window.location.origin + logoUrl;
      }
      // Server-side: use environment variable or fallback
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
      return baseUrl.replace(/\/$/, '') + logoUrl;
    }
    return logoUrl;
  } catch (_e) { /* ignore */ }
  return undefined;
}

/**
 * Format số tiền theo định dạng VN
 */
export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return '0';
  return new Intl.NumberFormat('vi-VN').format(amount);
}

/**
 * Chuyển số sang chữ tiếng Việt
 */
export function numberToWords(amount: number | undefined | null): string {
  if (!amount || amount === 0) return 'Không đồng';
  
  const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const positions = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
  
  const readThreeDigits = (num: number): string => {
    const hundred = Math.floor(num / 100);
    const ten = Math.floor((num % 100) / 10);
    const unit = num % 10;
    
    let result = '';
    
    if (hundred > 0) {
      result += units[hundred] + ' trăm ';
    }
    
    if (ten > 1) {
      result += units[ten] + ' mươi ';
      if (unit === 1) {
        result += 'mốt ';
      } else if (unit === 5) {
        result += 'lăm ';
      } else if (unit > 0) {
        result += units[unit] + ' ';
      }
    } else if (ten === 1) {
      result += 'mười ';
      if (unit === 5) {
        result += 'lăm ';
      } else if (unit > 0) {
        result += units[unit] + ' ';
      }
    } else if (ten === 0 && hundred > 0 && unit > 0) {
      result += 'lẻ ' + units[unit] + ' ';
    } else if (unit > 0) {
      result += units[unit] + ' ';
    }
    
    return result.trim();
  };
  
  let result = '';
  let num = Math.abs(Math.round(amount));
  let posIndex = 0;
  
  while (num > 0) {
    const threeDigits = num % 1000;
    if (threeDigits > 0) {
      const words = readThreeDigits(threeDigits);
      result = words + ' ' + positions[posIndex] + ' ' + result;
    }
    num = Math.floor(num / 1000);
    posIndex++;
  }
  
  result = result.trim();
  // Capitalize first letter
  result = result.charAt(0).toUpperCase() + result.slice(1) + ' đồng';
  
  if (amount < 0) {
    result = 'Âm ' + result;
  }
  
  return result;
}

/**
 * Ẩn số giữa của số điện thoại
 * Ví dụ: 0901234567 -> 090****567
 */
export function hidePhoneMiddle(phone: string | undefined | null): string {
  if (!phone) return '';
  if (phone.length < 6) return phone;
  const start = phone.slice(0, 3);
  const end = phone.slice(-3);
  return `${start}****${end}`;
}

/**
 * Format ngày theo định dạng dd/MM/yyyy
 * Uses centralized date-utils for consistent formatting
 */
export function formatDate(date: string | Date | undefined | null): string {
  return formatDateForDisplay(date);
}

/**
 * Format giờ theo định dạng HH:mm
 * Uses centralized date-utils for consistent formatting
 */
export function formatTime(date: string | Date | undefined | null): string {
  return formatTimeForDisplay(date);
}

/**
 * Format ngày giờ đầy đủ
 * Uses centralized date-utils for consistent formatting
 */
export function formatDateTime(date: string | Date | undefined | null): string {
  return formatDateTimeForDisplay(date);
}

// ============================================
// PRINT SERVICE
// ============================================

/**
 * CSS styles cho in ấn
 */
const PRINT_STYLES = `
  * { box-sizing: border-box; }
  body { 
    font-family: 'Times New Roman', Times, serif;
    font-size: 13px;
    line-height: 1.5;
    margin: 0;
    padding: 20px;
    color: #000;
  }
  h1, h2, h3, h4 { margin: 0.5em 0; }
  h2 { font-size: 18px; font-weight: bold; }
  p { margin: 0.3em 0; }
  table { 
    width: 100%; 
    border-collapse: collapse; 
    margin: 10px 0;
  }
  th, td { 
    border: 1px solid #333; 
    padding: 6px 8px; 
    text-align: left;
    vertical-align: top;
  }
  th { 
    background: #f0f0f0; 
    font-weight: bold;
  }
  strong { font-weight: bold; }
  em { font-style: italic; }
  hr { border: none; border-top: 1px solid #333; margin: 10px 0; }
  ul { margin: 0.5em 0; padding-left: 25px; list-style-type: disc; }
  ol { margin: 0.5em 0; padding-left: 25px; list-style-type: decimal; }
  li { margin: 0.2em 0; display: list-item; }
  img { max-width: 100%; height: auto; }
  @media print { 
    body { padding: 0; } 
    @page { margin: 15mm; }
  }
`;

/**
 * Generate paper-size-aware print CSS
 */
function getPrintStylesForSize(size: PaperSize, margins?: PrintMargins): string {
  const labelDims = parseLabelSize(size);
  if (labelDims) {
    const m = margins || DEFAULT_MARGINS.label;
    const contentWidth = labelDims.width - m.left - m.right;
    const contentHeight = labelDims.height - m.top - m.bottom;
    return `
      @page { size: ${labelDims.width}mm ${labelDims.height}mm; margin: ${m.top}mm ${m.right}mm ${m.bottom}mm ${m.left}mm; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: ${labelDims.width <= 50 ? '5.5pt' : '7pt'}; line-height: 1.3; margin: 0; padding: 0; }
      img { max-width: 100%; height: auto; }
      .print-page {
        width: ${contentWidth}mm; height: ${contentHeight}mm;
        overflow: hidden;
        page-break-after: always !important;
        break-after: page !important;
      }
      .print-page-last {
        width: ${contentWidth}mm; height: ${contentHeight}mm;
        overflow: hidden;
        page-break-after: auto;
      }
      @media print {
        .print-page {
          page-break-after: always !important;
          break-after: page !important;
        }
      }
    `;
  }
  if (size === 'K57') {
    const m = margins || { top: 2, right: 2, bottom: 2, left: 2 };
    return PRINT_STYLES.replace('@page { margin: 15mm; }', `@page { size: 57mm auto; margin: ${m.top}mm ${m.right}mm ${m.bottom}mm ${m.left}mm; }`);
  }
  if (size === 'K80') {
    const m = margins || { top: 2, right: 2, bottom: 2, left: 2 };
    return PRINT_STYLES.replace('@page { margin: 15mm; }', `@page { size: 80mm auto; margin: ${m.top}mm ${m.right}mm ${m.bottom}mm ${m.left}mm; }`);
  }
  if (margins) {
    return PRINT_STYLES.replace('@page { margin: 15mm; }', `@page { margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm; }`);
  }
  return PRINT_STYLES;
}

/**
 * Interface cho dữ liệu in
 */
export interface PrintData {
  [key: string]: string | number | boolean | undefined | null | PrintLineItem[];
}

export interface PrintLineItem {
  [key: string]: string | number | boolean | undefined | null;
}

/**
 * Replace tất cả variables trong template với data
 */
export function replaceVariables(template: string, data: PrintData): string {
  let result = template;
  
  // Replace các biến đơn lẻ
  Object.entries(data).forEach(([key, value]) => {
    // Nếu không phải array (line items), replace trực tiếp
    if (!Array.isArray(value)) {
      const placeholder = key.startsWith('{') ? key : `{${key}}`;
      const stringValue = value?.toString() || '';
      result = result.split(placeholder).join(stringValue);
    }
  });
  
  return result;
}

/**
 * Tạo HTML rows cho line items (sản phẩm trong đơn hàng)
 * Template row sẽ được nhân bản cho mỗi item
 */
export function generateLineItemsHtml(
  templateRow: string, 
  items: PrintLineItem[],
  startIndex: number = 1
): string {
  return items.map((item, index) => {
    let row = templateRow;
    
    // Replace {line_stt} với số thứ tự
    row = row.replace(/{line_stt}/g, (startIndex + index).toString());
    
    // Replace các biến line_* khác
    Object.entries(item).forEach(([key, value]) => {
      const placeholder = key.startsWith('{') ? key : `{${key}}`;
      const stringValue = value?.toString() || '';
      row = row.split(placeholder).join(stringValue);
    });
    
    return row;
  }).join('\n');
}

/**
 * Tạo nội dung HTML để in từ template và data
 */
export function generatePrintHtml(
  templateType: TemplateType,
  data: PrintData,
  branchId?: string
): string {
  const store = getPrintTemplateConfigSync();
  const defaultSize = store.getDefaultSize(templateType);
  const template = store.getTemplate(templateType, defaultSize, branchId);
  
  let html = template.content;
  
  // Replace variables
  html = replaceVariables(html, data);
  
  return html;
}

/**
 * In document với template
 */
export function printDocument(
  templateType: TemplateType,
  data: PrintData,
  options?: {
    branchId?: string;
    paperSize?: PaperSize;
    title?: string;
  }
): void {
  const store = getPrintTemplateConfigSync();
  const paperSize = options?.paperSize || store.getDefaultSize(templateType);
  const template = store.getTemplate(templateType, paperSize, options?.branchId);
  
  // Generate HTML content
  const html = replaceVariables(template.content, data);
  
  // Tạo iframe ẩn để in
  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'absolute';
  printFrame.style.top = '-10000px';
  printFrame.style.left = '-10000px';
  document.body.appendChild(printFrame);
  
  const printDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
  if (printDoc) {
    const title = options?.title || `In ${templateType}`;
    const styles = getPrintStylesForSize(paperSize);
    
    printDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>${styles}</style>
      </head>
      <body>${html}</body>
      </html>
    `);
    printDoc.close();
    
    // Đợi load xong rồi in
    setTimeout(() => {
      printFrame.contentWindow?.print();
      // Xóa iframe sau khi in
      setTimeout(() => {
        if (document.body.contains(printFrame)) {
          document.body.removeChild(printFrame);
        }
      }, 1000);
    }, 100);
  }
}

/**
 * Preview document (trả về HTML string)
 */
export function getPreviewHtml(
  templateType: TemplateType,
  data: PrintData,
  options?: {
    branchId?: string;
    paperSize?: PaperSize;
  }
): string {
  const store = getPrintTemplateConfigSync();
  const paperSize = options?.paperSize || store.getDefaultSize(templateType);
  const template = store.getTemplate(templateType, paperSize, options?.branchId);
  
  return replaceVariables(template.content, data);
}

// ============================================
// DATA MAPPERS - Chuyển đổi data từ entity sang print data
// ============================================

/**
 * Base interface cho store settings (cần import từ settings store)
 */
export interface StoreSettings {
  name?: string;
  address?: string;
  phone?: string;
  hotline?: string;
  email?: string;
  logo?: string;
  fax?: string;
  province?: string;
  website?: string;
  taxCode?: string;
  registrationNumber?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
}

/**
 * Tạo data cho thông tin cửa hàng
 */
export function getStoreData(settings: StoreSettings): PrintData {
  const now = new Date();
  const logo = getStoreLogo(settings.logo);
  return {
    '{store_logo}': logo 
      ? `<img src="${logo}" alt="Logo" style="max-height:60px"/>` 
      : '',
    '{store_name}': settings.name || '',
    '{store_address}': settings.address || '',
    '{store_phone_number}': settings.phone || '',
    '{hotline}': settings.hotline || settings.phone || '',
    '{store_hotline}': settings.hotline || settings.phone || '',
    '{store_email}': settings.email || '',
    '{store_fax}': settings.fax || '',
    '{store_website}': settings.website || '',
    '{store_tax_code}': settings.taxCode || '',
    '{store_registration_number}': settings.registrationNumber || '',
    '{store_bank_account_name}': settings.bankAccountName || '',
    '{store_bank_account_number}': settings.bankAccountNumber || '',
    '{store_bank_name}': settings.bankName || '',
    // Print timestamp - always inject current time
    '{print_date}': formatDate(now),
    '{print_time}': formatTime(now),
  };
}

/**
 * Export default cho tiện import
 */
export const PrintService = {
  formatCurrency,
  numberToWords,
  formatDate,
  formatTime,
  formatDateTime,
  replaceVariables,
  generateLineItemsHtml,
  generatePrintHtml,
  printDocument,
  getPreviewHtml,
  getStoreData,
  getStoreLogo,
};

export default PrintService;
