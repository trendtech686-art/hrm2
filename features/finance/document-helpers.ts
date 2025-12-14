import { toISODateTime } from '@/lib/date-utils';
import { asBusinessId, type BusinessId, type SystemId } from '@/lib/id-types';
import { useReceiptStore, type ReceiptInput } from '@/features/receipts/store';
import type { Receipt } from '@/features/receipts/types';
import { usePaymentStore, type PaymentInput } from '@/features/payments/store';
import type { Payment } from '@/features/payments/types';
import { pickAccount, pickPaymentMethod, pickPaymentType, pickReceiptType, pickTargetGroup } from '@/features/finance/document-lookups';

const asBusinessIdOrUndefined = (value?: string | BusinessId | null) => {
  if (!value) {
    return undefined;
  }
  return typeof value === 'string' ? asBusinessId(value) : value;
};

interface ReceiptDocumentOptions {
  amount: number;
  description: string;
  customerName: string;
  branchSystemId: SystemId;
  branchName: string;
  createdBy: SystemId;
  customerSystemId?: SystemId;
  paymentMethodSystemId?: SystemId;
  paymentMethodName?: string;
  accountSystemId?: SystemId;
  accountPreference?: 'cash' | 'bank';
  receiptTypeSystemId?: SystemId;
  receiptTypeName?: string;
  payerTargetGroupSystemId?: SystemId;
  payerTargetGroupName?: string;
  originalDocumentId?: string | BusinessId;
  linkedOrderSystemId?: SystemId;
  linkedSalesReturnSystemId?: SystemId;
  linkedWarrantySystemId?: SystemId;
  linkedComplaintSystemId?: SystemId;
  category?: Receipt['category'];
  affectsDebt?: boolean;
  status?: Receipt['status'];
  date?: string;
}

interface PaymentDocumentOptions {
  amount: number;
  description: string;
  recipientName: string;
  branchSystemId: SystemId;
  branchName: string;
  createdBy: SystemId;
  recipientSystemId?: SystemId;
  customerSystemId?: SystemId;
  customerName?: string;
  paymentMethodSystemId?: SystemId;
  paymentMethodName?: string;
  accountSystemId?: SystemId;
  accountPreference?: 'cash' | 'bank';
  paymentTypeSystemId?: SystemId;
  paymentTypeName?: string;
  recipientTargetGroupSystemId?: SystemId;
  recipientTargetGroupName?: string;
  originalDocumentId?: string | BusinessId;
  linkedOrderSystemId?: SystemId;
  linkedSalesReturnSystemId?: SystemId;
  linkedWarrantySystemId?: SystemId;
  linkedComplaintSystemId?: SystemId;
  category?: Payment['category'];
  affectsDebt?: boolean;
  status?: Payment['status'];
  date?: string;
}

export interface DocumentCreationResult<T> {
  document: T | null;
  error?: string;
}

export const createReceiptDocument = (options: ReceiptDocumentOptions): DocumentCreationResult<Receipt> => {
  if (!options.branchSystemId) {
    return { document: null, error: 'Thiếu mã chi nhánh khi tạo phiếu thu.' };
  }

  const targetGroup = pickTargetGroup({
    systemId: options.payerTargetGroupSystemId,
    name: options.payerTargetGroupName,
  });
  if (!targetGroup) {
    return { document: null, error: 'Chưa cấu hình nhóm đối tượng (Target Group) cho phiếu thu.' };
  }

  const paymentMethod = pickPaymentMethod({
    systemId: options.paymentMethodSystemId,
    name: options.paymentMethodName,
  });
  if (!paymentMethod) {
    return { document: null, error: 'Chưa cấu hình phương thức thu tiền.' };
  }

  const account = pickAccount({
    accountSystemId: options.accountSystemId,
    preferredType: options.accountPreference,
    branchSystemId: options.branchSystemId,
    paymentMethodName: paymentMethod.name,
  });
  if (!account) {
    return { document: null, error: 'Chưa cấu hình tài khoản quỹ phù hợp để tạo phiếu thu.' };
  }

  const receiptType = pickReceiptType({
    systemId: options.receiptTypeSystemId,
    name: options.receiptTypeName,
  });
  if (!receiptType) {
    return { document: null, error: 'Chưa cấu hình loại phiếu thu.' };
  }

  const timestamp = options.date ?? toISODateTime(new Date());
  const payload: ReceiptInput = {
    date: timestamp,
    amount: options.amount,
    payerTypeSystemId: targetGroup.systemId,
    payerTypeName: targetGroup.name,
    payerName: options.customerName,
    payerSystemId: options.customerSystemId,
    description: options.description,
    paymentMethodSystemId: paymentMethod.systemId,
    paymentMethodName: paymentMethod.name,
    accountSystemId: account.systemId,
    paymentReceiptTypeSystemId: receiptType.systemId,
    paymentReceiptTypeName: receiptType.name,
    branchSystemId: options.branchSystemId,
    branchName: options.branchName,
    createdBy: options.createdBy,
    createdAt: timestamp,
    status: options.status ?? 'completed',
    category: options.category,
    originalDocumentId: asBusinessIdOrUndefined(options.originalDocumentId),
    linkedOrderSystemId: options.linkedOrderSystemId,
    linkedSalesReturnSystemId: options.linkedSalesReturnSystemId,
    linkedWarrantySystemId: options.linkedWarrantySystemId,
    linkedComplaintSystemId: options.linkedComplaintSystemId,
    customerSystemId: options.customerSystemId,
    customerName: options.customerName,
    affectsDebt: options.affectsDebt ?? true,
  };

  const receipt = useReceiptStore.getState().add(payload);
  return { document: receipt };
};

export const createPaymentDocument = (options: PaymentDocumentOptions): DocumentCreationResult<Payment> => {
  if (!options.branchSystemId) {
    return { document: null, error: 'Thiếu mã chi nhánh khi tạo phiếu chi.' };
  }

  const targetGroup = pickTargetGroup({
    systemId: options.recipientTargetGroupSystemId,
    name: options.recipientTargetGroupName,
  });
  if (!targetGroup) {
    return { document: null, error: 'Chưa cấu hình nhóm đối tượng (Target Group) cho phiếu chi.' };
  }

  const paymentMethod = pickPaymentMethod({
    systemId: options.paymentMethodSystemId,
    name: options.paymentMethodName,
  });
  if (!paymentMethod) {
    return { document: null, error: 'Chưa cấu hình phương thức chi tiền.' };
  }

  const account = pickAccount({
    accountSystemId: options.accountSystemId,
    preferredType: options.accountPreference,
    branchSystemId: options.branchSystemId,
    paymentMethodName: paymentMethod.name,
  });
  if (!account) {
    return { document: null, error: 'Chưa cấu hình tài khoản quỹ phù hợp để tạo phiếu chi.' };
  }

  const paymentType = pickPaymentType({
    systemId: options.paymentTypeSystemId,
    name: options.paymentTypeName,
  });
  if (!paymentType) {
    return { document: null, error: 'Chưa cấu hình loại phiếu chi.' };
  }

  const timestamp = options.date ?? toISODateTime(new Date());
  const payload: PaymentInput = {
    date: timestamp,
    amount: options.amount,
    recipientTypeSystemId: targetGroup.systemId,
    recipientTypeName: targetGroup.name,
    recipientName: options.recipientName,
    recipientSystemId: options.recipientSystemId,
    description: options.description,
    paymentMethodSystemId: paymentMethod.systemId,
    paymentMethodName: paymentMethod.name,
    accountSystemId: account.systemId,
    paymentReceiptTypeSystemId: paymentType.systemId,
    paymentReceiptTypeName: paymentType.name,
    branchSystemId: options.branchSystemId,
    branchName: options.branchName,
    createdBy: options.createdBy,
    createdAt: timestamp,
    status: options.status ?? 'completed',
    category: options.category,
    originalDocumentId: asBusinessIdOrUndefined(options.originalDocumentId),
    linkedOrderSystemId: options.linkedOrderSystemId,
    linkedSalesReturnSystemId: options.linkedSalesReturnSystemId,
    linkedWarrantySystemId: options.linkedWarrantySystemId,
    linkedComplaintSystemId: options.linkedComplaintSystemId,
    customerSystemId: options.customerSystemId,
    customerName: options.customerName ?? options.recipientName,
    affectsDebt: options.affectsDebt ?? true,
  };

  const payment = usePaymentStore.getState().add(payload);
  return { document: payment };
};
