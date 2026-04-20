/**
 * Hook để sử dụng Print Service trong các component
 */

import * as React from 'react';
import type { TemplateType, PaperSize } from '@/lib/types/prisma-extended';
import { parseLabelSize, type PrintMargins, DEFAULT_MARGINS, TEMPLATE_TYPES } from '@/features/settings/printer/types';
import { 
  PrintData, 
  PrintLineItem,
  replaceVariables,
} from './print-service';
import { usePrintTemplateConfig } from '../features/settings/printer/hooks/use-print-template-config';
import { logError } from '@/lib/logger'

/**
 * Đợi tất cả <img> trong document load xong (hoặc lỗi) trước khi tiếp tục.
 * Timeout tối đa 3s để tránh treo nếu image chết.
 */
function waitForImages(doc: Document): Promise<void> {
  return new Promise((resolve) => {
    const images = doc.querySelectorAll('img');
    if (images.length === 0) { resolve(); return; }

    let loaded = 0;
    const total = images.length;
    const done = () => { if (++loaded >= total) resolve(); };
    const timeout = setTimeout(resolve, 3000); // max wait 3s

    images.forEach((img) => {
      if (img.complete) { done(); return; }
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });

    // If all already complete, resolve immediately and clear timeout
    if (loaded >= total) { clearTimeout(timeout); resolve(); }
  });
}

/** Map template type to Vietnamese label */
const templateTypeLabels: Record<string, string> = Object.fromEntries(
  TEMPLATE_TYPES.map(t => [t.value, t.label])
);

/**
 * Log print activity to activity logs API
 */
async function logPrintActivity(params: {
  entityType: string;
  entityId: string;
  templateType: TemplateType;
  paperSize?: PaperSize;
  createdBy?: string;
}): Promise<void> {
  try {
    const label = templateTypeLabels[params.templateType] || params.templateType;
    const sizeLabel = params.paperSize ? ` (${params.paperSize})` : '';
    
    await fetch('/api/activity-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entityType: params.entityType,
        entityId: params.entityId,
        action: `In ${label}${sizeLabel}`,
        actionType: 'system',
        metadata: {
          templateType: params.templateType,
          paperSize: params.paperSize,
          printedAt: new Date().toISOString(),
        },
        note: `Đã in ${label}${sizeLabel}`,
        createdBy: params.createdBy,
      }),
    });

    // Notify listeners (e.g., activity timeline) that a new log was created
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('activity-log-updated', {
        detail: { entityType: params.entityType, entityId: params.entityId },
      }));
    }

    // Update printStatus on the entity (e.g., order, packaging)
    if (params.entityType === 'order' && params.entityId) {
      fetch(`/api/orders/${params.entityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ printStatus: 'PRINTED' }),
      }).catch(() => { /* silently fail */ });
    }
  } catch (error) {
    // Silently fail - don't block printing
    logError('[logPrintActivity] Failed to log print activity', error);
  }
}

interface PrintOptions {
  /** Dữ liệu để thay thế biến trong template */
  data: PrintData;
  /** Line items (sản phẩm, hàng hóa) */
  lineItems?: PrintLineItem[];
  /** Secondary line items (e.g., return items in exchange templates using {return_line_xxx}) */
  secondaryLineItems?: PrintLineItem[];
  /** Khổ giấy cụ thể (nếu muốn override default) */
  paperSize?: PaperSize;
  /** Lề in (mm) - override default margins */
  margins?: PrintMargins;
  /** Branch ID cụ thể (nếu muốn override current branch) */
  branchId?: string;
  /** Entity type for activity logging (e.g., 'order', 'packaging', 'receipt') */
  entityType?: string;
  /** Entity ID for activity logging */
  entityId?: string;
  /** User ID who triggered the print */
  createdBy?: string;
}

interface UsePrintResult {
  /** Hàm in tài liệu */
  print: (type: TemplateType, options: PrintOptions) => void;
  /** Hàm in nhiều tài liệu cùng lúc (gộp thành 1 document) */
  printMultiple: (type: TemplateType, optionsList: PrintOptions[]) => void;
  /** Hàm in nhiều loại tài liệu khác nhau cùng lúc (gộp thành 1 popup) */
  printMixedDocuments: (documents: Array<{ type: TemplateType; options: PrintOptions }>) => void;
  /** Hàm lấy HTML preview */
  getPreview: (type: TemplateType, options: PrintOptions) => string;
  /** Kiểm tra template có tồn tại không */
  hasTemplate: (type: TemplateType, paperSize?: PaperSize) => boolean;
  /** Lấy danh sách khổ giấy có template */
  getAvailableSizes: (type: TemplateType) => PaperSize[];
  /** Lấy khổ giấy mặc định cho loại template */
  getDefaultSize: (type: TemplateType) => PaperSize;
  /** Đang loading template store */
  isLoading: boolean;
}

/**
 * Kiểm tra giá trị có "empty" không (null, undefined, '', '0', 0)
 */
function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null || value === '') return true;
  // Coi '0' và các biến thể như empty
  const strValue = String(value).trim();
  if (strValue === '0' || strValue === '0đ' || strValue === '0 đ') return true;
  return false;
}

/**
 * Xử lý các điều kiện trong template
 * Hỗ trợ:
 * - {{#if has_tax}}...{{/if}} - Điều kiện boolean
 * - {{#if_empty {field}}}...{{/if_empty}} - Nếu field rỗng
 * - {{#if_not_empty {field}}}...{{/if_not_empty}} - Nếu field không rỗng
 * - {{#if_gt {field} value}}...{{/if_gt}} - Nếu field > value (greater than)
 */
function processConditionals(html: string, data: PrintData, _lineItems?: PrintLineItem[]): string {
  let result = html;

  // 1. Xử lý {{#if_not_empty {field}}}...{{/if_not_empty}}
  const ifNotEmptyPattern = /\{\{#if_not_empty\s+\{([^}]+)\}\}\}([\s\S]*?)\{\{\/if_not_empty\}\}/gi;
  result = result.replace(ifNotEmptyPattern, (match, field, content) => {
    const key = `{${field}}`;
    const value = data[key];
    if (!isEmptyValue(value)) {
      return content;
    }
    return '';
  });

  // 2. Xử lý {{#if_empty {field}}}...{{/if_empty}}
  const ifEmptyPattern = /\{\{#if_empty\s+\{([^}]+)\}\}\}([\s\S]*?)\{\{\/if_empty\}\}/gi;
  result = result.replace(ifEmptyPattern, (match, field, content) => {
    const key = `{${field}}`;
    const value = data[key];
    if (isEmptyValue(value)) {
      return content;
    }
    return '';
  });

  // 3. Xử lý {{#if_gt {field} value}}...{{/if_gt}} (greater than 0)
  const ifGtPattern = /\{\{#if_gt\s+\{([^}]+)\}\s+(\d+)\}\}([\s\S]*?)\{\{\/if_gt\}\}/gi;
  result = result.replace(ifGtPattern, (match, field, compareValue, content) => {
    const key = `{${field}}`;
    const value = data[key];
    // Parse số từ giá trị (loại bỏ dấu chấm, đ, etc.)
    const numValue = parseFloat((value || '0').toString().replace(/[^\d.-]/g, ''));
    const numCompare = parseFloat(compareValue);
    if (numValue > numCompare) {
      return content;
    }
    return '';
  });

  // 4. Xử lý {{#if has_tax}}...{{/if}} - Boolean conditions
  // has_tax = true nếu total_tax > 0
  const hasTax = !isEmptyValue(data['{total_tax}']);
  const hasDiscount = !isEmptyValue(data['{total_discount}']);
  const hasDeliveryFee = !isEmptyValue(data['{delivery_fee}']);
  const hasNote = !isEmptyValue(data['{order_note}']);

  const booleanConditions: Record<string, boolean> = {
    'has_tax': hasTax,
    'has_discount': hasDiscount,
    'has_delivery_fee': hasDeliveryFee,
    'has_note': hasNote,
    'has_shipping_address': !isEmptyValue(data['{shipping_address}']),
    'has_customer_email': !isEmptyValue(data['{customer_email}']),
    'has_customer_phone': !isEmptyValue(data['{customer_phone_number}']),
  };

  // Xử lý {{#if condition}}...{{/if}}
  const ifPattern = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/gi;
  result = result.replace(ifPattern, (match, condition, content) => {
    if (booleanConditions[condition]) {
      return content;
    }
    return '';
  });

  // 5. Xử lý {{#unless condition}}...{{/unless}} (ngược lại với if)
  const unlessPattern = /\{\{#unless\s+(\w+)\}\}([\s\S]*?)\{\{\/unless\}\}/gi;
  result = result.replace(unlessPattern, (match, condition, content) => {
    if (!booleanConditions[condition]) {
      return content;
    }
    return '';
  });

  return result;
}

/**
 * Xử lý điều kiện cho line items
 * Ví dụ: {{#line_if_not_empty {line_tax_amount}}}...{{/line_if_not_empty}}
 */
/**
 * Generate @page CSS based on paper size
 */
function getPageSizeCSS(size: PaperSize, margins?: PrintMargins): string {
  // Dynamic label size (WxH format, e.g. '50x30', '100x75')
  const labelDims = parseLabelSize(size);
  if (labelDims) {
    const m = margins || DEFAULT_MARGINS.label;
    return `@page { size: ${labelDims.width}mm ${labelDims.height}mm; margin: ${m.top}mm ${m.right}mm ${m.bottom}mm ${m.left}mm; }`;
  }

  switch (size) {
    case 'K57': {
      const m = margins || { top: 2, right: 2, bottom: 2, left: 2 };
      return `@page { size: 57mm auto; margin: ${m.top}mm ${m.right}mm ${m.bottom}mm ${m.left}mm; }`;
    }
    case 'K80': {
      const m = margins || { top: 2, right: 2, bottom: 2, left: 2 };
      return `@page { size: 80mm auto; margin: ${m.top}mm ${m.right}mm ${m.bottom}mm ${m.left}mm; }`;
    }
    case 'A5': {
      const m = margins || { top: 10, right: 10, bottom: 10, left: 10 };
      return `@page { size: A5; margin: ${m.top}mm ${m.right}mm ${m.bottom}mm ${m.left}mm; }`;
    }
    case 'A6': {
      const m = margins || { top: 5, right: 5, bottom: 5, left: 5 };
      return `@page { size: A6; margin: ${m.top}mm ${m.right}mm ${m.bottom}mm ${m.left}mm; }`;
    }
    case 'A4':
    default: {
      const m = margins || DEFAULT_MARGINS.document;
      return `@page { size: A4; margin: ${m.top}mm ${m.right}mm ${m.bottom}mm ${m.left}mm; }`;
    }
  }
}

/**
 * Generate base print CSS, adjusted for paper size
 */
function getBasePrintCSS(size: PaperSize, margins?: PrintMargins): string {
  const pageSizeCSS = getPageSizeCSS(size, margins);
  const labelDims = parseLabelSize(size);

  if (labelDims) {
    const m = margins || DEFAULT_MARGINS.label;
    const contentWidth = labelDims.width - m.left - m.right;
    const contentHeight = labelDims.height - m.top - m.bottom;
    return `
      ${pageSizeCSS}
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

  // Standard document CSS
  return `
    ${pageSizeCSS}
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; margin: 0; padding: 0; }
    table { width: 100%; border-collapse: collapse; margin: 8px 0; }
    th, td { border: 1px solid #333; padding: 6px 8px; }
    th { background-color: #f5f5f5; font-weight: bold; }
    .text-center, [style*="text-align: center"] { text-align: center; }
    .text-right, [style*="text-align: right"] { text-align: right; }
    img { max-width: 100%; height: auto; }
    h1, h2, h3 { margin: 8px 0; }
    p { margin: 4px 0; }
    .print-page { 
      page-break-after: always !important; 
      break-after: page !important;
      page-break-inside: avoid;
    }
    .print-page-last { 
      page-break-after: auto; 
    }
    @media print {
      .print-page { 
        page-break-after: always !important; 
        break-after: page !important;
      }
      .print-page-last { 
        page-break-after: auto; 
      }
    }
  `;
}

function processLineItemConditionals(rowHtml: string, item: PrintLineItem): string {
  let result = rowHtml;

  // Xử lý {{#line_if_not_empty {field}}}...{{/line_if_not_empty}}
  const lineIfNotEmptyPattern = /\{\{#line_if_not_empty\s+\{([^}]+)\}\}\}([\s\S]*?)\{\{\/line_if_not_empty\}\}/gi;
  result = result.replace(lineIfNotEmptyPattern, (match, field, content) => {
    const key = `{${field}}`;
    const value = item[key];
    if (!isEmptyValue(value)) {
      return content;
    }
    return '';
  });

  // Xử lý {{#line_if_empty {field}}}...{{/line_if_empty}}
  const lineIfEmptyPattern = /\{\{#line_if_empty\s+\{([^}]+)\}\}\}([\s\S]*?)\{\{\/line_if_empty\}\}/gi;
  result = result.replace(lineIfEmptyPattern, (match, field, content) => {
    const key = `{${field}}`;
    const value = item[key];
    if (isEmptyValue(value)) {
      return content;
    }
    return '';
  });

  return result;
}

/**
 * Hook để sử dụng chức năng in trong các trang
 * @param currentBranchId - ID của branch hiện tại (optional)
 * @example
 * const { print, getPreview } = usePrint(currentBranch?.systemId);
 * 
 * // In đơn hàng
 * print('order', {
 *   data: mapOrderToPrintData(order, storeSettings),
 *   lineItems: mapOrderLineItems(order.items),
 * });
 */
interface UsePrintOptions {
  currentBranchId?: string;
  /** Set to false to skip fetching print templates until needed */
  enabled?: boolean;
}

export function usePrint(options?: UsePrintOptions | string): UsePrintResult {
  // Support legacy signature: usePrint(branchId?: string)
  const normalizedOptions: UsePrintOptions = typeof options === 'string' 
    ? { currentBranchId: options } 
    : options || {};
  const { currentBranchId, enabled = true } = normalizedOptions;
  
  const { getTemplate: storeGetTemplate, getDefaultSize: storeGetDefaultSize } = usePrintTemplateConfig({ enabled });
  const [isLoading] = React.useState(false);

  const getTemplateContent = React.useCallback((
    type: TemplateType, 
    paperSize?: PaperSize, 
    branchId?: string
  ): string | null => {
    // Xác định paperSize sử dụng
    const size = paperSize || storeGetDefaultSize(type);
    const branch = branchId || currentBranchId;

    // Lấy template
    const template = storeGetTemplate(type, size, branch);
    if (template?.content) {
      return template.content;
    }

    // Fallback: thử lấy template không có branch
    const defaultTemplate = storeGetTemplate(type, size);
    return defaultTemplate?.content || null;
  }, [storeGetTemplate, storeGetDefaultSize, currentBranchId]);

  const processTemplate = React.useCallback((
    templateContent: string,
    data: PrintData,
    lineItems?: PrintLineItem[],
    secondaryLineItems?: PrintLineItem[]
  ): string => {
    // Bước 1: Xử lý line items nếu có
    let html = templateContent;
    
    
    if (lineItems && lineItems.length > 0) {
      // === XỬ LÝ CÚ PHÁP {{#line_items}}...{{/line_items}} ===
      // Dành cho template lặp toàn bộ section (mỗi employee 1 page)
      const lineItemsBlockPattern = /\{\{#line_items\}\}([\s\S]*?)\{\{\/line_items\}\}/gi;
      const lineItemsBlockMatch = html.match(lineItemsBlockPattern);
      
      
      if (lineItemsBlockMatch && lineItemsBlockMatch.length > 0) {
        // Có block {{#line_items}} - lặp cả block cho mỗi item
        html = html.replace(lineItemsBlockPattern, (match, blockContent) => {
          return lineItems.map((item, index) => {
            let itemHtml = blockContent;
            
            // Thêm {line_index}
            itemHtml = itemHtml.replace(/\{line_index\}/g, String(index + 1));
            
            // Replace các biến từ item (line item data)
            Object.entries(item).forEach(([key, value]) => {
              const placeholder = key.startsWith('{') ? key : `{${key}}`;
              const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
              itemHtml = itemHtml.replace(regex, value?.toString() || '');
            });
            
            // Replace các biến global (data) cho mỗi item page
            Object.entries(data).forEach(([key, value]) => {
              const placeholder = key.startsWith('{') ? key : `{${key}}`;
              const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
              itemHtml = itemHtml.replace(regex, value?.toString() || '');
            });
            
            return itemHtml;
          }).join('\n');
        });
        
        // Đã xử lý xong line items theo block mode, skip table mode
      } else {
        // === XỬ LÝ TABLE MODE (cũ) ===
        // Tìm tất cả các table trong template
        const tablePattern = /<table[^>]*>[\s\S]*?<\/table>/gi;
        const tables = html.match(tablePattern);
      
        if (tables) {
          // Tìm table chứa {line_stt} - đây là bảng line items
          const lineItemsTable = tables.find(table => table.includes('{line_stt}'));
        
          if (lineItemsTable) {
            // Tìm tbody trong table này
            const tbodyMatch = lineItemsTable.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
          
            // Nếu không có tbody, có thể table chỉ có tr trực tiếp
            // (một số template không dùng thead/tbody)
            if (!tbodyMatch) {
              // Tìm tất cả tr trong table (trừ tr trong thead)
              const theadMatch = lineItemsTable.match(/<thead[^>]*>[\s\S]*?<\/thead>/i);
              let tableWithoutThead = lineItemsTable;
              if (theadMatch) {
                tableWithoutThead = lineItemsTable.replace(theadMatch[0], '');
              }
            
              // Tìm tr chứa {line_stt}
              const rowPattern = /<tr[^>]*>[\s\S]*?\{line_stt\}[\s\S]*?<\/tr>/i;
              const rowMatch = tableWithoutThead.match(rowPattern);
            
              if (rowMatch) {
                const templateRow = rowMatch[0];
              
                // Tạo các row mới từ template
                const rowsHtml = lineItems.map((item) => {
                  let row = templateRow;
                
                  // Xử lý điều kiện cho line item trước
                  row = processLineItemConditionals(row, item);
                
                  Object.entries(item).forEach(([key, value]) => {
                    const placeholder = key.startsWith('{') ? key : `{${key}}`;
                    const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
                    row = row.replace(regex, value?.toString() || '');
                  });
                  return row;
                }).join('\n    ');
              
                // Thay thế row mẫu bằng các rows mới
                const newTable = lineItemsTable.replace(templateRow, rowsHtml);
                html = html.replace(lineItemsTable, newTable);
              }
            } else {
              // Có tbody - xử lý như cũ
              const tbodyContent = tbodyMatch[1];
            
              // Tìm TẤT CẢ các row trong tbody
              const allRowsPattern = /<tr[^>]*>[\s\S]*?<\/tr>/gi;
              const allRows = tbodyContent.match(allRowsPattern);
            
              if (allRows && allRows.length > 0) {
                // Tìm row chứa {line_stt} - đây là row mẫu
                const templateRow = allRows.find(row => row.includes('{line_stt}')) || allRows[0];
              
                // Tạo các row mới từ template
                const rowsHtml = lineItems.map((item) => {
                  let row = templateRow;
                
                  // Xử lý điều kiện cho line item trước
                  row = processLineItemConditionals(row, item);
                
                  // Replace từng biến trong item
                  Object.entries(item).forEach(([key, value]) => {
                    const placeholder = key.startsWith('{') ? key : `{${key}}`;
                    const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
                    row = row.replace(regex, value?.toString() || '');
                  });
                
                  return row;
                }).join('\n    ');
              
                // Tạo tbody mới
                const newTbody = `<tbody>\n    ${rowsHtml}\n  </tbody>`;
              
                // Thay thế tbody cũ trong table
                const newTable = lineItemsTable.replace(tbodyMatch[0], newTbody);
              
                // Thay thế table cũ bằng table mới trong html
                html = html.replace(lineItemsTable, newTable);
              }
            }
          }
        }
      } // End of else (TABLE MODE)
    }

    // Bước 1.5: Xử lý secondary line items (e.g., return items with {return_line_stt})
    if (secondaryLineItems && secondaryLineItems.length > 0) {
      const tablePattern = /<table[^>]*>[\s\S]*?<\/table>/gi;
      const tables = html.match(tablePattern);
      if (tables) {
        const secondaryTable = tables.find(table => table.includes('{return_line_stt}'));
        if (secondaryTable) {
          const tbodyMatch = secondaryTable.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
          if (tbodyMatch) {
            const allRows = tbodyMatch[1].match(/<tr[^>]*>[\s\S]*?<\/tr>/gi);
            if (allRows && allRows.length > 0) {
              const templateRow = allRows.find(row => row.includes('{return_line_stt}')) || allRows[0];
              const rowsHtml = secondaryLineItems.map((item) => {
                let row = templateRow;
                row = processLineItemConditionals(row, item);
                Object.entries(item).forEach(([key, value]) => {
                  const placeholder = key.startsWith('{') ? key : `{${key}}`;
                  const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
                  row = row.replace(regex, value?.toString() || '');
                });
                return row;
              }).join('\n    ');
              const newTbody = `<tbody>\n    ${rowsHtml}\n  </tbody>`;
              const newTable = secondaryTable.replace(tbodyMatch[0], newTbody);
              html = html.replace(secondaryTable, newTable);
            }
          }
        }
      }
    }

    // Bước 2: Xử lý các điều kiện (conditionals)
    html = processConditionals(html, data, lineItems);

    // Bước 3: Thay thế các biến còn lại
    html = replaceVariables(html, data);

    return html;
  }, []);

  const print = React.useCallback((type: TemplateType, options: PrintOptions) => {
    const { data, lineItems, secondaryLineItems, paperSize, margins, branchId, entityType, entityId, createdBy } = options;


    // Lấy template content
    const size = paperSize || storeGetDefaultSize(type);
    const template = storeGetTemplate(type, size, branchId);
    const templateContent = template?.content;
    
    if (!templateContent) {
      logError(`[usePrint] No template found for type: ${type}`, null);
      return;
    }

    // Margins: options > template config > default
    const printMargins = margins || template?.margins;


    // Xử lý template
    let html: string;
    try {
      html = processTemplate(templateContent, data, lineItems, secondaryLineItems);
    } catch (err) {
      logError('[usePrint] Error processing template', err);
      return;
    }

    // ✅ Log print activity to activity logs
    if (entityType && entityId) {
      logPrintActivity({
        entityType,
        entityId,
        templateType: type,
        paperSize: size,
        createdBy,
      });
    }

    // Tạo iframe ẩn để in
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-10000px';
    printFrame.style.left = '-10000px';
    document.body.appendChild(printFrame);
    
    const printDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (printDoc) {
      const printCSS = getBasePrintCSS(size, printMargins);
      
      printDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>In ${type}</title>
          <style>${printCSS}</style>
        </head>
        <body>${html}</body>
        </html>
      `);
      printDoc.close();
      
      // Đợi tất cả images load xong rồi in
      waitForImages(printDoc).then(() => {
        printFrame.contentWindow?.print();
        // Xóa iframe sau khi in
        setTimeout(() => {
          if (document.body.contains(printFrame)) {
            document.body.removeChild(printFrame);
          }
        }, 1000);
      });
    }
  }, [storeGetDefaultSize, storeGetTemplate, getTemplateContent, processTemplate]);

  /**
   * In nhiều tài liệu cùng lúc - gộp thành 1 document với page break giữa các tài liệu
   */
  const printMultiple = React.useCallback((type: TemplateType, optionsList: PrintOptions[]) => {
    if (optionsList.length === 0) return;

    // Log activity for the first option that has entityType/entityId
    const logTarget = optionsList.find(o => o.entityType && o.entityId);
    if (logTarget) {
      const logSize = logTarget.paperSize || storeGetDefaultSize(type);
      logPrintActivity({
        entityType: logTarget.entityType!,
        entityId: logTarget.entityId!,
        templateType: type,
        paperSize: logSize,
        createdBy: logTarget.createdBy,
      });
    }

    // Lấy template content (dùng paperSize của item đầu tiên hoặc default)
    const firstOptions = optionsList[0];
    const size = firstOptions.paperSize || storeGetDefaultSize(type);
    const templateContent = getTemplateContent(type, size, firstOptions.branchId);
    
    if (!templateContent) {
      logError(`[usePrint] No template found for type: ${type}`, null);
      return;
    }

    // Xử lý từng document và gộp lại với page break
    const allHtmlParts = optionsList.map((options, index) => {
      const html = processTemplate(templateContent, options.data, options.lineItems);
      // Thêm page break sau mỗi document (trừ document cuối)
      if (index < optionsList.length - 1) {
        return `<div class="print-page" style="page-break-after: always; break-after: page;">${html}</div>`;
      }
      return `<div class="print-page-last">${html}</div>`;
    });

    const combinedHtml = allHtmlParts.join('\n');

    // Tạo iframe ẩn để in
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-10000px';
    printFrame.style.left = '-10000px';
    document.body.appendChild(printFrame);
    
    const printDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (printDoc) {
      const printMargins = firstOptions.margins || storeGetTemplate(type, size, firstOptions.branchId)?.margins;
      const printCSS = getBasePrintCSS(size, printMargins);
      
      printDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>In ${optionsList.length} ${type}</title>
          <style>${printCSS}</style>
        </head>
        <body>${combinedHtml}</body>
        </html>
      `);
      printDoc.close();
      
      // Đợi tất cả images load xong rồi in
      waitForImages(printDoc).then(() => {
        printFrame.contentWindow?.print();
        // Xóa iframe sau khi in
        setTimeout(() => {
          if (document.body.contains(printFrame)) {
            document.body.removeChild(printFrame);
          }
        }, 1000);
      });
    }
  }, [storeGetDefaultSize, storeGetTemplate, getTemplateContent, processTemplate]);

  /**
   * In nhiều loại tài liệu khác nhau cùng lúc - gộp thành 1 popup duy nhất
   * Ví dụ: In đơn hàng + phiếu giao hàng + phiếu đóng gói trong 1 lần
   */
  const printMixedDocuments = React.useCallback((documents: Array<{ type: TemplateType; options: PrintOptions }>) => {
    if (documents.length === 0) return;

    // Log activity for the first document that has entityType/entityId
    const logTarget = documents.find(d => d.options.entityType && d.options.entityId);
    if (logTarget) {
      const logSize = logTarget.options.paperSize || storeGetDefaultSize(logTarget.type);
      logPrintActivity({
        entityType: logTarget.options.entityType!,
        entityId: logTarget.options.entityId!,
        templateType: logTarget.type,
        paperSize: logSize,
        createdBy: logTarget.options.createdBy,
      });
    }

    // Xử lý từng document và gộp lại với page break
    const allHtmlParts: string[] = [];
    
    documents.forEach((doc, docIndex) => {
      const { type, options } = doc;
      const { data, lineItems, paperSize, branchId } = options;
      
      // Lấy template content cho loại này
      const size = paperSize || storeGetDefaultSize(type);
      const templateContent = getTemplateContent(type, size, branchId);
      
      if (!templateContent) {
        return;
      }
      
      const html = processTemplate(templateContent, data, lineItems);
      
      // Thêm page break sau mỗi document (trừ document cuối)
      if (docIndex < documents.length - 1) {
        allHtmlParts.push(`<div class="print-page" style="page-break-after: always; break-after: page;">${html}</div>`);
      } else {
        allHtmlParts.push(`<div class="print-page-last">${html}</div>`);
      }
    });

    if (allHtmlParts.length === 0) {
      logError('[printMixedDocuments] No documents to print', null);
      return;
    }

    const combinedHtml = allHtmlParts.join('\n');

    // Tạo iframe ẩn để in
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-10000px';
    printFrame.style.left = '-10000px';
    document.body.appendChild(printFrame);
    
    const printDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (printDoc) {
      // Determine predominant paper size for mixed documents
      const firstDoc = documents[0];
      const mixedSize = firstDoc.options.paperSize || storeGetDefaultSize(firstDoc.type);
      const mixedMargins = firstDoc.options.margins || storeGetTemplate(firstDoc.type, mixedSize, firstDoc.options.branchId)?.margins;
      const printCSS = getBasePrintCSS(mixedSize, mixedMargins);
      
      printDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>In ${documents.length} tài liệu</title>
          <style>${printCSS}</style>
        </head>
        <body>${combinedHtml}</body>
        </html>
      `);
      printDoc.close();
      
      // Đợi tất cả images load xong rồi in
      waitForImages(printDoc).then(() => {
        printFrame.contentWindow?.print();
        // Xóa iframe sau khi in
        setTimeout(() => {
          if (document.body.contains(printFrame)) {
            document.body.removeChild(printFrame);
          }
        }, 1000);
      });
    }
  }, [storeGetDefaultSize, getTemplateContent, processTemplate]);

  const getPreview = React.useCallback((type: TemplateType, options: PrintOptions): string => {
    const { data, lineItems, paperSize, branchId } = options;

    // Lấy template content
    const templateContent = getTemplateContent(type, paperSize, branchId);
    if (!templateContent) {
      return '<p style="color: red;">Không tìm thấy mẫu in</p>';
    }

    // Xử lý template
    return processTemplate(templateContent, data, lineItems);
  }, [getTemplateContent, processTemplate]);

  const hasTemplate = React.useCallback((type: TemplateType, paperSize?: PaperSize): boolean => {
    const size = paperSize || storeGetDefaultSize(type);
    const template = storeGetTemplate(type, size, currentBranchId);
    return !!template?.content;
  }, [storeGetDefaultSize, storeGetTemplate, currentBranchId]);

  const getAvailableSizes = React.useCallback((type: TemplateType): PaperSize[] => {
    const sizes: PaperSize[] = ['50x30', 'K57', 'K80', 'A4', 'A5'];
    return sizes.filter(size => {
      const template = storeGetTemplate(type, size, currentBranchId);
      return !!template?.content;
    });
  }, [storeGetTemplate, currentBranchId]);

  const getDefaultSize = React.useCallback((type: TemplateType): PaperSize => {
    return storeGetDefaultSize(type);
  }, [storeGetDefaultSize]);

  return {
    print,
    printMultiple,
    printMixedDocuments,
    getPreview,
    hasTemplate,
    getAvailableSizes,
    getDefaultSize,
    isLoading,
  };
}

export type { PrintOptions, UsePrintResult };
