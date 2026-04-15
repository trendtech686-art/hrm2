/**
 * Combined Payment Form Options - Server-side data fetcher
 * Reduces N+1 API calls to a single fetch for payment/receipt forms
 */

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';

export interface PaymentFormOptions {
  paymentTypes: Array<{
    systemId: string;
    id: string;
    name: string;
    isActive: boolean;
  }>;
  paymentMethods: Array<{
    systemId: string;
    id: string;
    name: string;
    type: string | null;  // 'cash' | 'bank' | 'wallet' | 'card' | 'cod' | 'other'
    isActive: boolean;
    isDefault: boolean;
  }>;
  targetGroups: Array<{
    systemId: string;
    id: string;
    name: string;
    isActive: boolean;
  }>;
  cashAccounts: Array<{
    systemId: string;
    name: string;
    type: string;  // 'cash' | 'bank'
    accountType: string | null;
    isActive: boolean;
    isDefault: boolean;
  }>;
  branches: Array<{
    systemId: string;
    name: string;
    isDefault: boolean;
  }>;
  shippingPartners: Array<{
    systemId: string;
    name: string;
    isActive: boolean;
  }>;
}

async function fetchPaymentFormOptions(): Promise<PaymentFormOptions> {
  const [
    paymentTypesRaw,
    paymentMethodsRaw,
    targetGroupsRaw,
    cashAccounts,
    branches,
    shippingPartners,
  ] = await Promise.all([
    // Payment types stored in settingsData
    prisma.settingsData.findMany({
      where: { type: 'payment-type', isActive: true, isDeleted: false },
      select: { systemId: true, id: true, name: true, isActive: true },
      orderBy: { name: 'asc' },
    }),
    // Payment methods - actual model (include type for account filtering)
    prisma.paymentMethod.findMany({
      where: { isActive: true },
      select: { systemId: true, id: true, name: true, type: true, isActive: true, isDefault: true },
      orderBy: { name: 'asc' },
    }),
    // Target groups stored in settingsData
    prisma.settingsData.findMany({
      where: { type: 'target-group', isActive: true, isDeleted: false },
      select: { systemId: true, id: true, name: true, isActive: true },
      orderBy: { name: 'asc' },
    }),
    prisma.cashAccount.findMany({
      where: { isActive: true },
      select: { systemId: true, name: true, type: true, accountType: true, isActive: true, isDefault: true },
      orderBy: { name: 'asc' },
    }),
    prisma.branch.findMany({
      where: { isDeleted: false },
      select: { systemId: true, name: true, isDefault: true },
      orderBy: { name: 'asc' },
    }),
    prisma.shippingPartner.findMany({
      where: { isActive: true },
      select: { systemId: true, name: true, isActive: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  return {
    paymentTypes: paymentTypesRaw,
    paymentMethods: paymentMethodsRaw,
    targetGroups: targetGroupsRaw,
    // Transform type to lowercase for frontend consistency
    cashAccounts: cashAccounts.map(acc => ({ ...acc, type: acc.type.toLowerCase() as 'cash' | 'bank' })),
    branches,
    shippingPartners,
  };
}

export const getPaymentFormOptions = cache(async (): Promise<PaymentFormOptions> => {
  return unstable_cache(
    fetchPaymentFormOptions,
    ['payment-form-options'],
    { 
      revalidate: CACHE_TTL.MEDIUM, 
      tags: [CACHE_TAGS.SETTINGS] 
    }
  )();
});

// Receipt form uses same options but different payment types
export interface ReceiptFormOptions extends Omit<PaymentFormOptions, 'paymentTypes'> {
  receiptTypes: PaymentFormOptions['paymentTypes'];
}

async function fetchReceiptFormOptions(): Promise<ReceiptFormOptions> {
  const [
    receiptTypesRaw,
    paymentMethodsRaw,
    targetGroupsRaw,
    cashAccounts,
    branches,
    shippingPartners,
  ] = await Promise.all([
    // Receipt types stored in settingsData
    prisma.settingsData.findMany({
      where: { type: 'receipt-type', isActive: true, isDeleted: false },
      select: { systemId: true, id: true, name: true, isActive: true },
      orderBy: { name: 'asc' },
    }),
    // Payment methods - actual model (include type for account filtering)
    prisma.paymentMethod.findMany({
      where: { isActive: true },
      select: { systemId: true, id: true, name: true, type: true, isActive: true, isDefault: true },
      orderBy: { name: 'asc' },
    }),
    // Target groups stored in settingsData
    prisma.settingsData.findMany({
      where: { type: 'target-group', isActive: true, isDeleted: false },
      select: { systemId: true, id: true, name: true, isActive: true },
      orderBy: { name: 'asc' },
    }),
    prisma.cashAccount.findMany({
      where: { isActive: true },
      select: { systemId: true, name: true, type: true, accountType: true, isActive: true, isDefault: true },
      orderBy: { name: 'asc' },
    }),
    prisma.branch.findMany({
      where: { isDeleted: false },
      select: { systemId: true, name: true, isDefault: true },
      orderBy: { name: 'asc' },
    }),
    prisma.shippingPartner.findMany({
      where: { isActive: true },
      select: { systemId: true, name: true, isActive: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  return {
    receiptTypes: receiptTypesRaw,
    paymentMethods: paymentMethodsRaw,
    targetGroups: targetGroupsRaw,
    // Transform type to lowercase for frontend consistency
    cashAccounts: cashAccounts.map(acc => ({ ...acc, type: acc.type.toLowerCase() as 'cash' | 'bank' })),
    branches,
    shippingPartners,
  };
}

export const getReceiptFormOptions = cache(async (): Promise<ReceiptFormOptions> => {
  return unstable_cache(
    fetchReceiptFormOptions,
    ['receipt-form-options'],
    { 
      revalidate: CACHE_TTL.MEDIUM, 
      tags: [CACHE_TAGS.SETTINGS] 
    }
  )();
});
