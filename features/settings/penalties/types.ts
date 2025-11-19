import type { BusinessId, SystemId } from '@/lib/id-types';

export type PenaltyStatus = 'Chưa thanh toán' | 'Đã thanh toán' | 'Đã hủy';

export type Penalty = {
  systemId: SystemId;
  id: BusinessId;
  employeeSystemId: SystemId;
  employeeName: string;
  reason: string;
  amount: number;
  issueDate: string; // YYYY-MM-DD
  status: PenaltyStatus;
  issuerName: string; // Employee Name of the issuer
};
