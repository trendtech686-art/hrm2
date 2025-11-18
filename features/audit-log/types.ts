export type LogChange = {
  field: string;
  oldValue: any;
  newValue: any;
  description?: string;
};

export type LogEntry = {
  systemId: string;
  id: string;
  timestamp: string; // ISO 8601 format
  entityType: 'PurchaseOrder' | 'Warranty' | 'Order' | 'Voucher'; // ✨ Extended
  entityId: string; // The systemId of the entity
  userId: string;
  userName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'CANCEL'; // ✨ Extended
  changes: LogChange[];
};
