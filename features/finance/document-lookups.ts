import { useTargetGroupStore } from '@/features/settings/target-groups/store';
import { usePaymentMethodStore } from '@/features/settings/payments/methods/store';
import { useCashbookStore } from '@/features/cashbook/store';
import { useReceiptTypeStore } from '@/features/settings/receipt-types/store';
import { usePaymentTypeStore } from '@/features/settings/payments/types/store';
import type { TargetGroup } from '@/features/settings/target-groups/types';
import type { PaymentMethod } from '@/features/settings/payments/methods/types';
import type { CashAccount } from '@/features/cashbook/types';
import type { ReceiptType } from '@/features/settings/receipt-types/types';
import type { PaymentType } from '@/features/settings/payments/types/types';
import type { SystemId } from '@/lib/id-types';

const normalizeName = (value?: string | null) => (value ?? '').trim().toLowerCase();

export const DEFAULT_CUSTOMER_GROUP = 'khách hàng';

export const pickTargetGroup = (options?: {
  systemId?: SystemId | undefined;
  name?: string | undefined;
  fallbackName?: string | undefined;
}): TargetGroup | null => {
  const groups = useTargetGroupStore.getState().data ?? [];
  if (groups.length === 0) {
    return null;
  }

  if (options?.systemId) {
    const match = groups.find(group => group.systemId === options.systemId);
    if (match) {
      return match;
    }
  }

  const lookupNames = [options?.name, options?.fallbackName, DEFAULT_CUSTOMER_GROUP].filter(Boolean) as string[];
  for (const candidate of lookupNames) {
    const normalized = normalizeName(candidate);
    const match = groups.find(group => normalizeName(group.name) === normalized);
    if (match) {
      return match;
    }
  }

  return groups[0] ?? null;
};

export const pickPaymentMethod = (options?: {
  systemId?: SystemId | undefined;
  name?: string | undefined;
}): PaymentMethod | null => {
  const methods = usePaymentMethodStore.getState().data ?? [];
  if (methods.length === 0) {
    return null;
  }

  if (options?.systemId) {
    const match = methods.find(method => method.systemId === options.systemId);
    if (match) {
      return match;
    }
  }

  if (options?.name) {
    const normalized = normalizeName(options.name);
    const match = methods.find(method => normalizeName(method.name) === normalized);
    if (match) {
      return match;
    }
  }

  return methods.find(method => method.isDefault) ?? methods[0] ?? null;
};

export const pickAccount = (options: {
  accountSystemId?: SystemId | undefined;
  preferredType?: 'cash' | 'bank' | undefined;
  branchSystemId?: SystemId | undefined;
  paymentMethodName?: string | undefined;
}): CashAccount | null => {
  const { accounts } = useCashbookStore.getState();
  if (!accounts || accounts.length === 0) {
    return null;
  }

  if (options.accountSystemId) {
    const match = accounts.find(account => account.systemId === options.accountSystemId);
    if (match) {
      return match;
    }
  }

  let preferredType = options.preferredType;
  if (!preferredType && options.paymentMethodName) {
    const normalizedMethod = normalizeName(options.paymentMethodName);
    preferredType = normalizedMethod === 'tiền mặt' ? 'cash' : normalizedMethod === 'chuyển khoản' ? 'bank' : undefined;
  }

  const candidates = preferredType ? accounts.filter(account => account.type === preferredType) : accounts;

  if (candidates.length === 0) {
    return accounts[0];
  }

  return (
    candidates.find(account => account.branchSystemId && options.branchSystemId && account.branchSystemId === options.branchSystemId) ??
    candidates.find(account => account.isDefault) ??
    candidates[0]
  );
};

export const pickReceiptType = (options?: {
  systemId?: SystemId | undefined;
  name?: string | undefined;
}): ReceiptType | null => {
  const types = useReceiptTypeStore.getState().data ?? [];
  if (types.length === 0) {
    return null;
  }

  if (options?.systemId) {
    const match = types.find(type => type.systemId === options.systemId);
    if (match) {
      return match;
    }
  }

  if (options?.name) {
    const normalized = normalizeName(options.name);
    const match = types.find(type => normalizeName(type.name) === normalized);
    if (match) {
      return match;
    }
  }

  return types[0] ?? null;
};

export const pickPaymentType = (options?: {
  systemId?: SystemId | undefined;
  name?: string | undefined;
}): PaymentType | null => {
  const types = usePaymentTypeStore.getState().data ?? [];
  if (types.length === 0) {
    return null;
  }

  if (options?.systemId) {
    const match = types.find(type => type.systemId === options.systemId);
    if (match) {
      return match;
    }
  }

  if (options?.name) {
    const normalized = normalizeName(options.name);
    const match = types.find(type => normalizeName(type.name) === normalized);
    if (match) {
      return match;
    }
  }

  return types[0] ?? null;
};
