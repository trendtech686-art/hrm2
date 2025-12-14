/**
 * Return Order Print Helper
 * Helpers để chuẩn bị dữ liệu in cho đơn đổi trả hàng
 * 
 * Note: Đây là alias cho sales-return-print-helper vì dùng chung mapper
 */

// Re-export tất cả từ sales-return-print-helper
export * from './sales-return-print-helper';

// Alias functions để rõ ràng hơn
export { convertSalesReturnForPrint as convertReturnOrderForPrint } from './sales-return-print-helper';
