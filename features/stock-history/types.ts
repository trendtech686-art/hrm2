import type { SystemId, BusinessId } from '../../lib/id-types.ts';

export type StockHistoryAction = 
  | 'Nhập hàng từ NCC' 
  | 'Xuất bán' 
  | 'Kiểm kho'
  | 'Nhập kho (Kiểm hàng)'
  | 'Xuất kho (Kiểm hàng)'
  | 'Trả hàng'
  | 'Khác';

export type StockHistoryEntry = {
  systemId: SystemId;
  productId: SystemId; // ✅ Product.systemId (internal key for querying)
  date: string; // ISO String with time
  employeeName: string;
  action: StockHistoryAction | string; // Union type for common actions + allow custom
  quantityChange: number; // can be positive or negative
  newStockLevel: number;
  documentId: BusinessId; // ID of the source document (e.g., PNK001, DH001)
  branchSystemId: SystemId; // ✅ Branch systemId
  branch: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};
