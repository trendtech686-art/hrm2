// Common CSS styles for print templates
// Cập nhật: 2025-12-08 - Responsive cho mọi khổ in

/**
 * ==========================================
 * PRINT TEMPLATE STANDARDS
 * ==========================================
 * 
 * 1. HEADER: Logo bên trái, thông tin cửa hàng bên phải
 * 2. TITLE: Tiêu đề + mã phiếu + ngày tháng căn giữa
 * 3. INFO: Bảng thông tin với label nền xám
 * 4. TABLE: Bảng sản phẩm responsive
 * 5. SUMMARY: Tổng tiền căn phải
 * 6. SIGNATURE: Các cột chữ ký
 * 7. FOOTER: Thông tin hotline/thời gian in
 */

// ==========================================
// INLINE STYLES CHUẨN - Dùng trong template HTML
// ==========================================
export const PRINT_STYLES = {
  // Container chính
  container: 'font-family: Arial, sans-serif; font-size: 13px; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 10px;',
  
  // Header - Logo + Store info
  headerTable: 'width: 100%; margin-bottom: 15px; border-collapse: collapse;',
  headerLogo: 'width: 70px; vertical-align: top; padding-right: 10px;',
  headerInfo: 'vertical-align: top;',
  storeName: 'font-size: 15px; font-weight: bold; margin-bottom: 3px;',
  storeAddress: 'font-size: 12px; color: #333;',
  storeContact: 'font-size: 12px; color: #333;',
  
  // Title section
  title: 'text-align: center; margin: 15px 0 5px 0; font-size: 17px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 8px;',
  subtitle: 'text-align: center; margin-bottom: 12px; font-size: 12px;',
  
  // Info table - Thông tin chung
  infoTable: 'width: 100%; border-collapse: collapse; margin-bottom: 12px;',
  infoLabel: 'padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 12px;',
  infoValue: 'padding: 4px 6px; border: 1px solid #333; font-size: 12px;',
  
  // Product table - Bảng sản phẩm (responsive)
  productTable: 'width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 11px;',
  productTh: 'padding: 5px 3px; border: 1px solid #333; background: #f5f5f5; text-align: center; font-weight: bold; font-size: 11px;',
  productTd: 'padding: 4px 3px; border: 1px solid #333; font-size: 11px;',
  productTdCenter: 'padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 11px;',
  productTdRight: 'padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 11px;',
  
  // Summary table - Tổng tiền
  summaryTable: 'width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 12px;',
  summaryLabel: 'padding: 4px 6px; border: 1px solid #333; font-size: 12px;',
  summaryValue: 'padding: 4px 6px; border: 1px solid #333; text-align: right; width: 90px; font-size: 12px;',
  summaryTotal: 'padding: 5px 6px; border: 1px solid #333; background: #f5f5f5; font-weight: bold; font-size: 12px;',
  
  // Note section
  noteBox: 'margin: 8px 0; padding: 8px; background: #f5f5f5; border: 1px solid #333; font-size: 12px;',
  
  // Signature table
  signatureTable: 'width: 100%; margin-top: 25px;',
  signatureCol: 'width: 33%; text-align: center; padding: 8px; vertical-align: top;',
  signatureTitle: 'font-weight: bold; margin-bottom: 3px; font-size: 12px;',
  signatureNote: 'color: #888; font-size: 10px; font-style: italic;',
  signatureSpace: 'height: 50px;',
  
  // Footer
  footer: 'text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;',
};

// ==========================================
// CSS cho các khổ giấy
// ==========================================

export const CSS_A4_A5 = `
<style>
  @media print {
    @page { margin: 10mm; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
  
  body { 
    font-family: Arial, sans-serif; 
    font-size: 13px; 
    line-height: 1.4; 
    color: #000; 
    margin: 0; 
    padding: 15px; 
  }
  
  /* Container responsive */
  .print-container {
    max-width: 100%;
    margin: 0 auto;
  }
  
  /* Header chuẩn */
  .print-header {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    margin-bottom: 15px;
  }
  .print-header-logo {
    width: 70px;
    flex-shrink: 0;
  }
  .print-header-logo img {
    max-width: 100%;
    height: auto;
  }
  .print-header-info {
    flex: 1;
  }
  .store-name { 
    font-size: 15px; 
    font-weight: bold; 
  }
  .store-detail { 
    font-size: 12px; 
    color: #333; 
    margin-top: 2px; 
  }
  
  /* Title chuẩn */
  .print-title {
    text-align: center;
    font-size: 17px;
    font-weight: bold;
    margin: 15px 0 8px 0;
    padding-bottom: 8px;
    border-bottom: 2px solid #333;
  }
  .print-subtitle {
    text-align: center;
    margin-bottom: 12px;
    font-size: 12px;
  }
  
  /* Tables */
  .info-table { 
    width: 100%; 
    margin-bottom: 12px; 
    border-collapse: collapse; 
  }
  .info-table td { 
    padding: 4px 6px; 
    vertical-align: top; 
    border: 1px solid #333;
    font-size: 12px;
  }
  .info-table .label {
    background-color: #f5f5f5;
    width: 22%;
    font-weight: normal;
  }
  
  /* Product table - RESPONSIVE */
  .items-table { 
    width: 100%; 
    border-collapse: collapse; 
    margin-bottom: 12px; 
    table-layout: fixed;
  }
  .items-table th { 
    background-color: #f5f5f5; 
    text-align: center; 
    font-weight: bold;
    padding: 5px 3px;
    border: 1px solid #333;
    font-size: 11px;
    word-wrap: break-word;
  }
  .items-table td { 
    border: 1px solid #333; 
    padding: 4px 3px; 
    text-align: left;
    font-size: 11px;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  .items-table .col-stt { width: 25px; text-align: center; }
  .items-table .col-code { width: 70px; text-align: center; font-family: monospace; font-size: 10px; }
  .items-table .col-name { width: auto; }
  .items-table .col-unit { width: 35px; text-align: center; }
  .items-table .col-qty { width: 35px; text-align: center; font-weight: bold; }
  .items-table .col-price { width: 70px; text-align: right; }
  .items-table .col-amount { width: 80px; text-align: right; }
  .items-table .col-discount { width: 50px; text-align: right; }
  .items-table .col-vat { width: 45px; text-align: right; }
  
  /* Summary */
  .summary-table {
    width: 250px;
    margin-left: auto;
    border-collapse: collapse;
    margin-bottom: 12px;
  }
  .summary-table td {
    padding: 4px 6px;
    border: 1px solid #333;
    font-size: 12px;
  }
  .summary-table .total {
    background: #f5f5f5;
    font-weight: bold;
  }
  
  /* Note */
  .note-box {
    margin: 8px 0;
    padding: 8px;
    background: #f5f5f5;
    border: 1px solid #333;
    font-size: 12px;
  }
  
  /* Signature */
  .signature-table {
    width: 100%;
    margin-top: 25px;
  }
  .signature-table td {
    width: 33%;
    text-align: center;
    padding: 8px;
    vertical-align: top;
  }
  .signature-title {
    font-weight: bold;
    font-size: 12px;
  }
  .signature-note {
    color: #888;
    font-size: 10px;
    font-style: italic;
  }
  
  /* Footer chuẩn */
  .print-footer {
    text-align: center;
    margin-top: 15px;
    padding-top: 8px;
    border-top: 1px dashed #333;
    font-size: 10px;
    color: #666;
  }
  
  /* Utilities */
  .text-right { text-align: right; }
  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .font-bold { font-weight: bold; }
  .text-small { font-size: 10px; }
  .text-muted { color: #666; }
  .divider { border-top: 1px dashed #333; margin: 12px 0; }
</style>
`;

export const CSS_K80 = `
<style>
  body { font-family: 'Courier New', Courier, monospace; font-size: 12px; line-height: 1.3; width: 72mm; margin: 0 auto; padding: 5px; }
  .header { text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
  .company-name { font-size: 14px; font-weight: bold; text-transform: uppercase; }
  .title { font-size: 16px; font-weight: bold; text-transform: uppercase; margin: 10px 0; text-align: center; }
  .info-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
  .items-table { width: 100%; margin: 10px 0; border-collapse: collapse; }
  .items-table th { text-align: left; border-bottom: 1px dashed #000; padding: 3px 0; }
  .items-table td { padding: 3px 0; }
  .text-right { text-align: right; }
  .text-center { text-align: center; }
  .totals { margin-top: 10px; border-top: 1px dashed #000; padding-top: 10px; }
  .footer { text-align: center; margin-top: 20px; font-style: italic; border-top: 1px dashed #000; padding-top: 10px; }
  .divider { border-top: 1px dashed #000; margin: 10px 0; }
</style>
`;

export const CSS_K57 = `
<style>
  body { font-family: 'Courier New', Courier, monospace; font-size: 10px; line-height: 1.2; width: 48mm; margin: 0 auto; padding: 3px; }
  .header { text-align: center; margin-bottom: 8px; border-bottom: 1px dashed #000; padding-bottom: 8px; }
  .company-name { font-size: 12px; font-weight: bold; text-transform: uppercase; }
  .title { font-size: 13px; font-weight: bold; text-transform: uppercase; margin: 8px 0; text-align: center; }
  .info-row { margin-bottom: 2px; font-size: 9px; }
  .items-table { width: 100%; margin: 8px 0; border-collapse: collapse; font-size: 9px; }
  .items-table th { text-align: left; border-bottom: 1px dashed #000; padding: 2px 0; }
  .items-table td { padding: 2px 0; }
  .text-right { text-align: right; }
  .text-center { text-align: center; }
  .totals { margin-top: 8px; border-top: 1px dashed #000; padding-top: 8px; }
  .footer { text-align: center; margin-top: 15px; font-style: italic; font-size: 9px; }
  .divider { border-top: 1px dashed #000; margin: 8px 0; }
</style>
`;

export const CSS_LABEL = `
<style>
  body { font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 10px; }
  .label { border: 2px solid #000; padding: 10px; }
  .store-name { font-size: 14px; font-weight: bold; text-transform: uppercase; }
  .section { margin: 8px 0; padding: 5px 0; border-bottom: 1px dashed #ccc; }
  .section:last-child { border-bottom: none; }
  .label-title { font-weight: bold; text-transform: uppercase; font-size: 10px; color: #666; }
  .label-value { font-size: 13px; font-weight: bold; margin-top: 3px; }
  .barcode { text-align: center; margin: 10px 0; }
  .cod { background-color: #ffeb3b; padding: 8px; text-align: center; font-weight: bold; font-size: 14px; margin: 10px 0; }
</style>
`;
