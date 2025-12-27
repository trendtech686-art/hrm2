import type { PackagingStatus, OrderPrintStatus } from '../orders/types';

export type PackagingSlip = {
  // From Packaging object
  systemId: string; // The unique systemId of the packaging entry itself
  id: string; // The user-facing ID of the packaging slip (e.g., "FUN12345")
  
  requestDate: string;
  confirmDate?: string;
  cancelDate?: string;

  requestingEmployeeName: string;
  confirmingEmployeeName?: string;
  cancelingEmployeeName?: string;
  assignedEmployeeName?: string;
  
  status: PackagingStatus;
  printStatus: OrderPrintStatus;
  
  cancelReason?: string;
  
  // From parent Order object
  orderId: string; // User-facing order ID (e.g., "DH00001")
  orderSystemId: string; // System ID of the order for actions
  customerName: string;
  branchName: string;
};
