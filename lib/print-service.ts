import { usePrintTemplateStore } from '@/features/settings/printer/store';
import { TemplateType, PaperSize } from '@/lib/types/prisma-extended';
import { formatDateForDisplay, formatTimeForDisplay, formatDateTimeForDisplay } from '@/lib/date-utils';
import { getGeneralSettingsSync } from '@/lib/settings-cache';

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Lấy general-settings từ cache (loaded from database)
 */
export function getGeneralSettings(): {
  companyName?: string;
  companyAddress?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  taxCode?: string;
  logoUrl?: string;
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
} | null {
  try {
    const settings = getGeneralSettingsSync();
    return {
      companyName: settings.storeName,
      companyAddress: settings.storeAddress,
      phoneNumber: settings.storePhone,
      storeName: settings.storeName,
      storeAddress: settings.storeAddress,
      storePhone: settings.storePhone,
      logoUrl: settings.logoUrl,
    };
  } catch (e) { /* ignore */ }
  return null;
}

/**
 * Lấy logo từ general-settings (fallback khi storeInfo không có logo)
 */
export function getStoreLogo(storeInfoLogo?: string): string | undefined {
  if (storeInfoLogo) return storeInfoLogo;
  try {
    const settings = getGeneralSettingsSync();
    return settings.logoUrl || undefined;
  } catch (e) { /* ignore */ }
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
  const store = usePrintTemplateStore.getState();
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
  const store = usePrintTemplateStore.getState();
  const paperSize = options?.paperSize || store.getDefaultSize(templateType);
  const template = store.getTemplate(templateType, paperSize, options?.branchId);
  
  // Generate HTML content
  let html = replaceVariables(template.content, data);
  
  // Tạo iframe ẩn để in
  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'absolute';
  printFrame.style.top = '-10000px';
  printFrame.style.left = '-10000px';
  document.body.appendChild(printFrame);
  
  const printDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
  if (printDoc) {
    const title = options?.title || `In ${templateType}`;
    
    printDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>${PRINT_STYLES}</style>
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
  const store = usePrintTemplateStore.getState();
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
