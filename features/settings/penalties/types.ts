export type PenaltyStatus = 'Chưa thanh toán' | 'Đã thanh toán' | 'Đã hủy';

export type Penalty = {
  // FIX: Added missing systemId
  systemId: string;
  id: string; // PP001
  employeeSystemId: string;
  employeeName: string;
  reason: string;
  amount: number;
  issueDate: string; // YYYY-MM-DD
  status: PenaltyStatus;
  issuerName: string; // Employee Name of the issuer
};
