/**
 * Barcode & QR Code Image Utilities
 * Generate <img> tags for barcode/QR codes using local API route
 * Replaces external dependencies on barcodeapi.org and quickchart.io
 */

/**
 * Generate barcode <img> HTML using local API
 */
export function generateBarcodeImage(code: string | undefined, height = 50): string {
  if (!code) return '';
  return `<img src="/api/print/barcode?code=${encodeURIComponent(code)}&height=${height}" style="height:${height}px" alt="barcode" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/><span style="display:none;font-family:monospace;font-size:14px;letter-spacing:2px">${code}</span>`;
}

/**
 * Generate QR code <img> HTML using local API
 */
export function generateQRCodeImage(code: string | undefined, size = 100): string {
  if (!code) return '';
  return `<img src="/api/print/barcode?type=qr&text=${encodeURIComponent(code)}&size=${size}" style="width:${size}px;height:${size}px" alt="qrcode" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/><span style="display:none;font-family:monospace;font-size:12px">${code}</span>`;
}
