export type StockHistoryEntry = {
  systemId: string;
  productId: string; // ✅ Product.systemId (internal key for querying)
  date: string; // ISO String with time
  employeeName: string;
  action: string; // e.g., "Nhập hàng từ NCC", "Xuất bán", "Kiểm kho"
  quantityChange: number; // can be positive or negative
  newStockLevel: number;
  documentId: string; // ID of the source document (e.g., PNK001, DH001)
  branchSystemId: string; // ✅ Branch systemId
  branch: string;
};
