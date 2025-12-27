/**
 * Hook để sử dụng Print Service trong các component
 */

import * as React from 'react';
import type { TemplateType, PaperSize } from '@/lib/types/prisma-extended';
import { 
  PrintData, 
  PrintLineItem,
  replaceVariables,
} from './print-service';
import { usePrintTemplateStore } from '../features/settings/printer/store';

interface PrintOptions {
  /** Dữ liệu để thay thế biến trong template */
  data: PrintData;
  /** Line items (sản phẩm, hàng hóa) */
  lineItems?: PrintLineItem[];
  /** Khổ giấy cụ thể (nếu muốn override default) */
  paperSize?: PaperSize;
  /** Branch ID cụ thể (nếu muốn override current branch) */
  branchId?: string;
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
function processConditionals(html: string, data: PrintData, lineItems?: PrintLineItem[]): string {
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
export function usePrint(currentBranchId?: string): UsePrintResult {
  const templateStore = usePrintTemplateStore();
  const [isLoading] = React.useState(false);

  const getTemplateContent = React.useCallback((
    type: TemplateType, 
    paperSize?: PaperSize, 
    branchId?: string
  ): string | null => {
    // Xác định paperSize sử dụng
    const size = paperSize || templateStore.getDefaultSize(type);
    const branch = branchId || currentBranchId;

    // Lấy template
    const template = templateStore.getTemplate(type, size, branch);
    if (template?.content) {
      return template.content;
    }

    // Fallback: thử lấy template không có branch
    const defaultTemplate = templateStore.getTemplate(type, size);
    return defaultTemplate?.content || null;
  }, [templateStore, currentBranchId]);

  const processTemplate = React.useCallback((
    templateContent: string,
    data: PrintData,
    lineItems?: PrintLineItem[]
  ): string => {
    // Bước 1: Xử lý line items nếu có
    let html = templateContent;
    
    console.log('[processTemplate] Starting, lineItems count:', lineItems?.length);
    
    if (lineItems && lineItems.length > 0) {
      // === XỬ LÝ CÚ PHÁP {{#line_items}}...{{/line_items}} ===
      // Dành cho template lặp toàn bộ section (mỗi employee 1 page)
      const lineItemsBlockPattern = /\{\{#line_items\}\}([\s\S]*?)\{\{\/line_items\}\}/gi;
      const lineItemsBlockMatch = html.match(lineItemsBlockPattern);
      
      console.log('[processTemplate] Block match found:', !!lineItemsBlockMatch, lineItemsBlockMatch?.length);
      
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
            let tbodyMatch = lineItemsTable.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
          
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

    // Bước 2: Xử lý các điều kiện (conditionals)
    html = processConditionals(html, data, lineItems);

    // Bước 3: Thay thế các biến còn lại
    html = replaceVariables(html, data);

    return html;
  }, []);

  const print = React.useCallback((type: TemplateType, options: PrintOptions) => {
    const { data, lineItems, paperSize, branchId } = options;

    console.log('[usePrint] Starting print for type:', type);
    console.log('[usePrint] Data keys:', Object.keys(data));
    console.log('[usePrint] LineItems count:', lineItems?.length || 0);

    // Lấy template content
    const size = paperSize || templateStore.getDefaultSize(type);
    const templateContent = getTemplateContent(type, size, branchId);
    
    if (!templateContent) {
      console.error(`[usePrint] No template found for type: ${type}`);
      return;
    }

    console.log('[usePrint] Template found, length:', templateContent.length);

    // Xử lý template
    let html: string;
    try {
      html = processTemplate(templateContent, data, lineItems);
      console.log('[usePrint] Template processed, html length:', html.length);
    } catch (err) {
      console.error('[usePrint] Error processing template:', err);
      return;
    }

    // Tạo iframe ẩn để in
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-10000px';
    printFrame.style.left = '-10000px';
    document.body.appendChild(printFrame);
    
    const printDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (printDoc) {
      // CSS cơ bản cho print - giống với Settings preview
      const printCSS = `
        body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; }
        table { width: 100%; border-collapse: collapse; margin: 8px 0; }
        th, td { border: 1px solid #333; padding: 6px 8px; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .text-center, [style*="text-align: center"] { text-align: center; }
        .text-right, [style*="text-align: right"] { text-align: right; }
        img { max-width: 100%; height: auto; }
        h1, h2, h3 { margin: 8px 0; }
        p { margin: 4px 0; }
      `;
      
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
  }, [getTemplateContent, processTemplate]);

  /**
   * In nhiều tài liệu cùng lúc - gộp thành 1 document với page break giữa các tài liệu
   */
  const printMultiple = React.useCallback((type: TemplateType, optionsList: PrintOptions[]) => {
    if (optionsList.length === 0) return;

    // Lấy template content (dùng paperSize của item đầu tiên hoặc default)
    const firstOptions = optionsList[0];
    const size = firstOptions.paperSize || templateStore.getDefaultSize(type);
    const templateContent = getTemplateContent(type, size, firstOptions.branchId);
    
    if (!templateContent) {
      console.error(`[usePrint] No template found for type: ${type}`);
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
      // CSS cơ bản cho print với page break
      const printCSS = `
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
  }, [templateStore, getTemplateContent, processTemplate]);

  /**
   * In nhiều loại tài liệu khác nhau cùng lúc - gộp thành 1 popup duy nhất
   * Ví dụ: In đơn hàng + phiếu giao hàng + phiếu đóng gói trong 1 lần
   */
  const printMixedDocuments = React.useCallback((documents: Array<{ type: TemplateType; options: PrintOptions }>) => {
    if (documents.length === 0) return;

    // Xử lý từng document và gộp lại với page break
    const allHtmlParts: string[] = [];
    
    documents.forEach((doc, docIndex) => {
      const { type, options } = doc;
      const { data, lineItems, paperSize, branchId } = options;
      
      // Lấy template content cho loại này
      const size = paperSize || templateStore.getDefaultSize(type);
      const templateContent = getTemplateContent(type, size, branchId);
      
      if (!templateContent) {
        console.warn(`[printMixedDocuments] No template found for type: ${type}, skipping`);
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
      console.error('[printMixedDocuments] No documents to print');
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
      // CSS cơ bản cho print với page break
      const printCSS = `
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
  }, [templateStore, getTemplateContent, processTemplate]);

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
    const size = paperSize || templateStore.getDefaultSize(type);
    const template = templateStore.getTemplate(type, size, currentBranchId);
    return !!template?.content;
  }, [templateStore, currentBranchId]);

  const getAvailableSizes = React.useCallback((type: TemplateType): PaperSize[] => {
    const sizes: PaperSize[] = ['K57', 'K80', 'A4', 'A5'];
    return sizes.filter(size => {
      const template = templateStore.getTemplate(type, size, currentBranchId);
      return !!template?.content;
    });
  }, [templateStore, currentBranchId]);

  const getDefaultSize = React.useCallback((type: TemplateType): PaperSize => {
    return templateStore.getDefaultSize(type);
  }, [templateStore]);

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
