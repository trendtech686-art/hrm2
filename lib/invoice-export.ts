/**
 * Invoice Excel Export Utility
 * 
 * Generates styled Excel invoice files from order data using ExcelJS.
 * Two modes:
 * - "no-vat": Export prices as-is from the order
 * - "full-vat": Prices include VAT, system splits into base price + VAT
 */

import type { Order, LineItem } from '@/lib/types/prisma-extended';
import type { StoreGeneralInfo } from '@/features/settings/store-info/types';

export type InvoiceExportMode = 'no-vat' | 'full-vat';

interface InvoiceExportOptions {
  order: Order;
  storeInfo: StoreGeneralInfo | null;
  mode: InvoiceExportMode;
  vatRate: number; // e.g. 10 for 10%
}

/**
 * Calculate line item total (before order-level discount)
 */
function calcLineTotal(item: LineItem): number {
  const gross = item.unitPrice * item.quantity;
  if (!item.discount || item.discount === 0) return gross;
  if (item.discountType === 'percentage') {
    return gross - gross * (item.discount / 100);
  }
  return gross - item.discount;
}

function fmtNum(n: number): number {
  return Math.round(n);
}

// Shared styles
const FONT_NAME = 'Times New Roman';
const HEADER_BG = 'FF4472C4'; // Blue header
const HEADER_FONT_COLOR = 'FFFFFFFF';
const TOTAL_BG = 'FFD9E2F3'; // Light blue for totals
const BORDER_THIN = { style: 'thin' as const, color: { argb: 'FF000000' } };
const ALL_BORDERS = { top: BORDER_THIN, bottom: BORDER_THIN, left: BORDER_THIN, right: BORDER_THIN };

/**
 * Export order as styled invoice Excel file
 */
export async function exportInvoiceExcel(options: InvoiceExportOptions) {
  const { order, storeInfo, mode, vatRate } = options;

  const ExcelJS = await import('exceljs');
  const wb = new ExcelJS.Workbook();
  wb.creator = storeInfo?.companyName || 'ERP';
  wb.created = new Date();

  const sheetName = mode === 'full-vat' ? 'Hóa đơn VAT' : 'Hóa đơn';
  const ws = wb.addWorksheet(sheetName, {
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
    properties: { defaultRowHeight: 18 },
  });

  // Column config — thêm cột "Tên VAT" sau "Tên hàng hóa" (col 4)
  // Số thứ tự (stt) = 1, Mã SP = 2, Tên hàng hóa = 3, Tên VAT = 4, SL = 5, phần giá = 6..numCols
  const numCols = mode === 'full-vat' ? 9 : 8;
  if (mode === 'full-vat') {
    ws.columns = [
      { key: 'stt', width: 5 },
      { key: 'sku', width: 18 },
      { key: 'name', width: 36 },
      { key: 'nameVat', width: 36 },
      { key: 'qty', width: 7 },
      { key: 'priceNoVat', width: 18 },
      { key: 'vat', width: 15 },
      { key: 'priceVat', width: 18 },
      { key: 'total', width: 18 },
    ];
  } else {
    ws.columns = [
      { key: 'stt', width: 5 },
      { key: 'sku', width: 18 },
      { key: 'name', width: 36 },
      { key: 'nameVat', width: 36 },
      { key: 'qty', width: 7 },
      { key: 'price', width: 18 },
      { key: 'discount', width: 15 },
      { key: 'total', width: 18 },
    ];
  }

  let row = 0;
  const addRow = (values?: (string | number | null | undefined)[]): typeof ws.lastRow => {
    row++;
    if (!values) return ws.addRow([]);
    return ws.addRow(values);
  };

  const mergeAndStyle = (r: number, colEnd: number, text: string, style: Partial<{
    bold: boolean; size: number; color: string; alignment: 'left' | 'center' | 'right';
    fill: string; italic: boolean;
  }> = {}) => {
    ws.mergeCells(r, 1, r, colEnd);
    const cell = ws.getCell(r, 1);
    cell.value = text;
    cell.font = {
      name: FONT_NAME,
      bold: style.bold ?? false,
      size: style.size ?? 11,
      italic: style.italic ?? false,
      color: style.color ? { argb: style.color } : undefined,
    };
    cell.alignment = { horizontal: style.alignment ?? 'left', vertical: 'middle', wrapText: true };
    if (style.fill) {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: style.fill } };
    }
  };

  // ══════════════════════════════════════════════
  // COMPANY HEADER
  // ══════════════════════════════════════════════
  if (storeInfo) {
    if (storeInfo.companyName) {
      addRow();
      mergeAndStyle(row, numCols, storeInfo.companyName, { bold: true, size: 13, color: 'FF1F4E79' });
    }
    if (storeInfo.headquartersAddress) {
      addRow();
      mergeAndStyle(row, numCols, `Địa chỉ: ${storeInfo.headquartersAddress}`, { size: 10, italic: true });
    }
    if (storeInfo.taxCode) {
      addRow();
      mergeAndStyle(row, numCols, `MST: ${storeInfo.taxCode}`, { size: 10 });
    }
    if (storeInfo.hotline) {
      addRow();
      mergeAndStyle(row, numCols, `ĐT: ${storeInfo.hotline}`, { size: 10 });
    }
  }

  // Blank separator
  addRow();

  // ══════════════════════════════════════════════
  // INVOICE TITLE
  // ══════════════════════════════════════════════
  addRow();
  mergeAndStyle(row, numCols, mode === 'full-vat' ? 'HÓA ĐƠN BÁN HÀNG (CÓ VAT)' : 'HÓA ĐƠN BÁN HÀNG', {
    bold: true, size: 16, alignment: 'center', color: 'FF1F4E79',
  });
  ws.getRow(row).height = 28;

  addRow();
  mergeAndStyle(row, numCols, `Số: ${order.id}`, { bold: true, size: 11, alignment: 'center' });

  addRow();
  mergeAndStyle(row, numCols, `Ngày: ${new Date(order.orderDate).toLocaleDateString('vi-VN')}`, { size: 11, alignment: 'center' });

  // Blank separator
  addRow();

  // ══════════════════════════════════════════════
  // CUSTOMER INFO SECTION
  // ══════════════════════════════════════════════
  addRow();
  mergeAndStyle(row, numCols, `Khách hàng: ${order.customerName || ''}`, { bold: true, size: 11 });

  // Address
  if (order.shippingAddress && typeof order.shippingAddress === 'object') {
    const addr = order.shippingAddress as Record<string, unknown>;
    const parts = [addr.street, addr.ward, addr.district, addr.province].filter(Boolean);
    if (parts.length > 0) {
      addRow();
      mergeAndStyle(row, numCols, `Địa chỉ: ${parts.join(', ')}`, { size: 10 });
    }
  } else if (typeof order.shippingAddress === 'string' && order.shippingAddress) {
    addRow();
    mergeAndStyle(row, numCols, `Địa chỉ: ${order.shippingAddress}`, { size: 10 });
  }

  // Business / Invoice info
  const inv = order.invoiceInfo as { company?: string; taxCode?: string; representative?: string; position?: string; address?: string; email?: string; bankName?: string; bankAccount?: string } | undefined;
  if (inv?.company) {
    addRow();
    mergeAndStyle(row, numCols, `Đơn vị: ${inv.company}`, { bold: true, size: 11 });
    if (inv.taxCode) {
      addRow();
      mergeAndStyle(row, numCols, `MST: ${inv.taxCode}`, { size: 10 });
    }
    if (inv.representative) {
      const rep = inv.representative + (inv.position ? ` - ${inv.position}` : '');
      addRow();
      mergeAndStyle(row, numCols, `Người đại diện: ${rep}`, { size: 10 });
    }
    if (inv.address) {
      addRow();
      mergeAndStyle(row, numCols, `Địa chỉ nhận hóa đơn: ${inv.address}`, { size: 10 });
    }
    if (inv.bankName || inv.bankAccount) {
      addRow();
      mergeAndStyle(row, numCols, `Ngân hàng: ${[inv.bankName, inv.bankAccount].filter(Boolean).join(' - ')}`, { size: 10 });
    }
  }

  // Blank separator
  addRow();

  // ══════════════════════════════════════════════
  // LINE ITEMS TABLE
  // ══════════════════════════════════════════════
  const lineItems = order.lineItems || [];

  if (mode === 'full-vat') {
    // ─── FULL VAT MODE ───
    const vatMultiplier = 1 + vatRate / 100;

    const headerRow = addRow(['STT', 'Mã SP', 'Tên hàng hóa', 'Tên VAT', 'SL', 'Đơn giá (chưa VAT)', `Thuế VAT ${vatRate}%`, 'Đơn giá (gồm VAT)', 'Thành tiền']);
    if (headerRow) headerRow.height = 22;
    headerRow?.eachCell((cell, colNumber) => {
      if (colNumber > numCols) return;
      cell.font = { name: FONT_NAME, bold: true, size: 10, color: { argb: HEADER_FONT_COLOR } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_BG } };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = ALL_BORDERS;
    });

    let subtotalBeforeVat = 0;
    let totalVat = 0;
    let grandLineTotal = 0;

    lineItems.forEach((item, idx) => {
      const lineTotal = calcLineTotal(item);
      const lineTotalBeforeVat = lineTotal / vatMultiplier;
      const lineVat = lineTotal - lineTotalBeforeVat;
      const unitPriceBeforeVat = item.unitPrice / vatMultiplier;
      const unitVat = item.unitPrice - unitPriceBeforeVat;

      subtotalBeforeVat += fmtNum(lineTotalBeforeVat);
      totalVat += fmtNum(lineVat);
      grandLineTotal += fmtNum(lineTotal);

      const dataRow = addRow([
        idx + 1,
        item.productId || '',
        item.productName || '',
        item.product?.nameVat || '',
        item.quantity,
        fmtNum(unitPriceBeforeVat),
        fmtNum(unitVat),
        fmtNum(item.unitPrice),
        fmtNum(lineTotal),
      ]);

      const isOdd = idx % 2 === 0;
      dataRow?.eachCell((cell, colNumber) => {
        if (colNumber > numCols) return;
        cell.font = { name: FONT_NAME, size: 10 };
        cell.border = ALL_BORDERS;
        if (isOdd) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F7FB' } };
        }
        // STT (1) & SL (5) center; cột Tên/Tên VAT (3,4) + SKU (2) left; giá (>=6) right.
        if (colNumber === 1 || colNumber === 5) {
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        } else if (colNumber >= 6) {
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          cell.numFmt = '#,##0';
        } else {
          cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
        }
      });
    });

    // Blank row
    addRow();

    // ─── TOTALS ───
    const addTotalRow = (label: string, value: number, isBold = false) => {
      const r = addRow();
      // Merge label từ cột giá đầu tiên (col 6) tới cột ngay trước cột Thành tiền.
      ws.mergeCells(row, 6, row, numCols - 1);
      const labelCell = ws.getCell(row, 6);
      labelCell.value = label;
      labelCell.font = { name: FONT_NAME, bold: isBold, size: 10 };
      labelCell.alignment = { horizontal: 'right', vertical: 'middle' };
      labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TOTAL_BG } };
      labelCell.border = ALL_BORDERS;

      const valCell = ws.getCell(row, numCols);
      valCell.value = value;
      valCell.numFmt = '#,##0';
      valCell.font = { name: FONT_NAME, bold: isBold, size: isBold ? 11 : 10 };
      valCell.alignment = { horizontal: 'right', vertical: 'middle' };
      valCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TOTAL_BG } };
      valCell.border = ALL_BORDERS;
      return r;
    };

    addTotalRow('Cộng tiền hàng (chưa VAT):', subtotalBeforeVat);
    addTotalRow(`Thuế VAT ${vatRate}%:`, totalVat);
    addTotalRow('Tổng cộng:', grandLineTotal, true);

    if (order.shippingFee && order.shippingFee > 0) {
      addTotalRow('Phí vận chuyển:', fmtNum(order.shippingFee));
    }
    if (order.orderDiscount && order.orderDiscount > 0) {
      const discountLabel = order.orderDiscountType === 'percentage'
        ? `Giảm giá (${order.orderDiscount}%):`
        : 'Giảm giá:';
      const discountAmount = order.orderDiscountType === 'percentage'
        ? grandLineTotal * order.orderDiscount / 100
        : order.orderDiscount;
      addTotalRow(discountLabel, -fmtNum(discountAmount));
    }
    addTotalRow('Tổng thanh toán:', fmtNum(order.grandTotal), true);

  } else {
    // ─── NO VAT MODE ───
    const headerRow = addRow(['STT', 'Mã SP', 'Tên hàng hóa', 'Tên VAT', 'SL', 'Đơn giá', 'Giảm giá', 'Thành tiền']);
    if (headerRow) headerRow.height = 22;
    headerRow?.eachCell((cell, colNumber) => {
      if (colNumber > numCols) return;
      cell.font = { name: FONT_NAME, bold: true, size: 10, color: { argb: HEADER_FONT_COLOR } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_BG } };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = ALL_BORDERS;
    });

    let subtotal = 0;

    lineItems.forEach((item, idx) => {
      const lineTotal = calcLineTotal(item);
      subtotal += fmtNum(lineTotal);

      const discountDisplay = !item.discount || item.discount === 0
        ? ''
        : item.discountType === 'percentage'
          ? `${item.discount}%`
          : fmtNum(item.discount);

      const dataRow = addRow([
        idx + 1,
        item.productId || '',
        item.productName || '',
        item.product?.nameVat || '',
        item.quantity,
        fmtNum(item.unitPrice),
        discountDisplay,
        fmtNum(lineTotal),
      ]);

      const isOdd = idx % 2 === 0;
      dataRow?.eachCell((cell, colNumber) => {
        if (colNumber > numCols) return;
        cell.font = { name: FONT_NAME, size: 10 };
        cell.border = ALL_BORDERS;
        if (isOdd) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F7FB' } };
        }
        if (colNumber === 1 || colNumber === 5) {
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        } else if (colNumber >= 6 && typeof cell.value === 'number') {
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          cell.numFmt = '#,##0';
        } else {
          cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
        }
      });
    });

    addRow();

    const addTotalRow = (label: string, value: number, isBold = false) => {
      addRow();
      // Merge label từ cột giá đầu tiên (col 6) tới cột ngay trước cột Thành tiền.
      ws.mergeCells(row, 6, row, numCols - 1);
      const labelCell = ws.getCell(row, 6);
      labelCell.value = label;
      labelCell.font = { name: FONT_NAME, bold: isBold, size: 10 };
      labelCell.alignment = { horizontal: 'right', vertical: 'middle' };
      labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TOTAL_BG } };
      labelCell.border = ALL_BORDERS;

      const valCell = ws.getCell(row, numCols);
      valCell.value = value;
      valCell.numFmt = '#,##0';
      valCell.font = { name: FONT_NAME, bold: isBold, size: isBold ? 11 : 10 };
      valCell.alignment = { horizontal: 'right', vertical: 'middle' };
      valCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TOTAL_BG } };
      valCell.border = ALL_BORDERS;
    };

    addTotalRow('Cộng tiền hàng:', subtotal);
    if (order.shippingFee && order.shippingFee > 0) {
      addTotalRow('Phí vận chuyển:', fmtNum(order.shippingFee));
    }
    if (order.orderDiscount && order.orderDiscount > 0) {
      const discountLabel = order.orderDiscountType === 'percentage'
        ? `Giảm giá (${order.orderDiscount}%):`
        : 'Giảm giá:';
      const discountAmount = order.orderDiscountType === 'percentage'
        ? subtotal * order.orderDiscount / 100
        : order.orderDiscount;
      addTotalRow(discountLabel, -fmtNum(discountAmount));
    }
    addTotalRow('Tổng thanh toán:', fmtNum(order.grandTotal), true);
  }

  // ══════════════════════════════════════════════
  // FOOTER
  // ══════════════════════════════════════════════
  addRow();
  addRow();
  mergeAndStyle(row, numCols, `Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`, { size: 10, italic: true, alignment: 'right' });

  // ══════════════════════════════════════════════
  // DOWNLOAD
  // ══════════════════════════════════════════════
  const vatSuffix = mode === 'full-vat' ? '_VAT' : '';
  // Filename: MST of customer (from invoiceInfo) + order code
  const customerTaxCode = (order.invoiceInfo as { taxCode?: string } | undefined)?.taxCode;
  const filePrefix = customerTaxCode ? `${customerTaxCode}_${order.id}` : order.id;
  const fileName = `${filePrefix}${vatSuffix}.xlsx`;

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return { fileName, fileSize: blob.size };
}
