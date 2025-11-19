import type { SystemId } from '../../../lib/id-types.ts';
import type { WarrantyTicket, WarrantyProduct } from '../types.ts';

export interface WarrantyStore {
  data: WarrantyTicket[];
  add: (item: Omit<WarrantyTicket, 'systemId'>) => WarrantyTicket;
  addMultiple: (items: Omit<WarrantyTicket, 'systemId'>[]) => void;
  update: (systemId: SystemId, item: any) => void;
  remove: (systemId: SystemId) => void;
  hardDelete: (systemId: SystemId) => void;
  restore: (systemId: SystemId) => void;
  findById: (systemId: SystemId) => WarrantyTicket | undefined;
  getActive: () => WarrantyTicket[];
  getDeleted: () => WarrantyTicket[];
  addProduct: (ticketSystemId: SystemId, product: Omit<WarrantyProduct, 'systemId'>) => void;
  updateProduct: (ticketSystemId: SystemId, productSystemId: SystemId, updates: Partial<WarrantyProduct>) => void;
  removeProduct: (ticketSystemId: SystemId, productSystemId: SystemId) => void;
  updateStatus: (ticketSystemId: SystemId, newStatus: WarrantyTicket['status'], note?: string) => void;
  addHistory: (
    ticketSystemId: SystemId,
    action: string,
    performedBy: string,
    note?: string,
    metadata?: Record<string, any>,
  ) => void;
  recalculateSummary: (ticketSystemId: SystemId) => void;
  calculateSummary: (products: WarrantyProduct[]) => any;
  calculateSettlementStatus: (
    totalSettlement: number,
    totalPaid: number,
    shippingFee?: number,
  ) => 'pending' | 'partial' | 'completed';
  addComment?: () => void;
  updateComment?: () => void;
  deleteComment?: () => void;
  replyComment?: () => void;
  generateNextSystemId?: () => SystemId;
  _migrate?: () => void;
}
