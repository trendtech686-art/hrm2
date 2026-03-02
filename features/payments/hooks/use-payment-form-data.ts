/**
 * usePaymentFormData - Optimized hook for payment form
 * 
 * Thay vì load tất cả data từ đầu, hook này:
 * 1. Load settings data ngay (nhỏ, ít thay đổi)
 * 2. Lazy load recipients (customers/suppliers/employees) dựa trên target group đã chọn
 */

import * as React from 'react';
import { useAllPaymentTypes } from '@/features/settings/payments/types/hooks/use-all-payment-types';
import { useAllPaymentMethods } from '@/features/settings/payments/hooks/use-all-payment-methods';
import { useAllTargetGroups } from '@/features/settings/target-groups/hooks/use-all-target-groups';
import { useAllCashAccounts } from '@/features/cashbook/hooks/use-all-cash-accounts';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import { useAllCustomers } from '@/features/customers/hooks/use-all-customers';
import { useAllSuppliers } from '@/features/suppliers/hooks/use-all-suppliers';
import { useAllEmployees } from '@/features/employees/hooks/use-all-employees';
import { useAllShippingPartners } from '@/features/settings/shipping/hooks/use-all-shipping-partners';
import type { ComboboxOption } from '@/components/ui/virtualized-combobox';

export interface UsePaymentFormDataOptions {
  /**
   * Target group ID hiện tại được chọn (e.g. 'KHACHHANG', 'NHACUNGCAP', 'NHANVIEN')
   * Chỉ load recipients tương ứng với target group này
   */
  selectedTargetGroupId?: string;
}

/**
 * Hook tối ưu cho payment form - chỉ load data cần thiết
 * 
 * @example
 * ```tsx
 * const recipientTypeSystemId = form.watch('recipientTypeSystemId');
 * const selectedTargetGroup = targetGroups.find(t => t.systemId === recipientTypeSystemId);
 * 
 * const { 
 *   recipientOptions, 
 *   paymentTypeOptions,
 *   ...rest 
 * } = usePaymentFormData({ 
 *   selectedTargetGroupId: selectedTargetGroup?.id 
 * });
 * ```
 */
export function usePaymentFormData(options: UsePaymentFormDataOptions = {}) {
  const { selectedTargetGroupId } = options;

  // === Settings data (nhỏ, luôn load) ===
  const { data: paymentTypes } = useAllPaymentTypes();
  const { data: paymentMethods } = useAllPaymentMethods();
  const { data: targetGroups } = useAllTargetGroups();
  const { accounts } = useAllCashAccounts();
  const { data: branches } = useAllBranches();
  const { data: shippingPartners } = useAllShippingPartners();

  // === Lazy load recipients dựa trên target group ===
  const shouldLoadCustomers = selectedTargetGroupId === 'KHACHHANG';
  const shouldLoadSuppliers = selectedTargetGroupId === 'NHACUNGCAP';
  const shouldLoadEmployees = selectedTargetGroupId === 'NHANVIEN';
  const shouldLoadShippingPartners = selectedTargetGroupId === 'DOITACVC';

  const { data: customers } = useAllCustomers({ enabled: shouldLoadCustomers });
  const { data: suppliers } = useAllSuppliers({ enabled: shouldLoadSuppliers });
  const { data: employees } = useAllEmployees({ enabled: shouldLoadEmployees });
  // Shipping partners đã load ở trên vì data nhỏ

  // === Filter active items ===
  const activePaymentTypes = React.useMemo(
    () => paymentTypes.filter(pt => pt.isActive),
    [paymentTypes]
  );
  
  const activePaymentMethods = React.useMemo(
    () => paymentMethods.filter(pm => pm.isActive),
    [paymentMethods]
  );
  
  const activeTargetGroups = React.useMemo(
    () => targetGroups.filter(tg => tg.isActive),
    [targetGroups]
  );
  
  const activeAccounts = React.useMemo(
    () => accounts.filter(acc => acc.isActive),
    [accounts]
  );

  // === Generate recipient options based on selected target group ===
  const recipientOptions = React.useMemo((): ComboboxOption[] => {
    if (shouldLoadCustomers) {
      return customers.map(c => ({
        value: c.systemId,
        label: c.name,
        subtitle: c.phone,
      }));
    }
    if (shouldLoadSuppliers) {
      return suppliers.map(s => ({
        value: s.systemId,
        label: s.name,
        subtitle: s.phone,
      }));
    }
    if (shouldLoadEmployees) {
      return employees.map(e => ({
        value: e.systemId,
        label: e.fullName,
        subtitle: e.phone,
      }));
    }
    if (shouldLoadShippingPartners) {
      return shippingPartners.map(sp => ({
        value: sp.systemId,
        label: sp.name,
        subtitle: sp.id,
      }));
    }
    return [];
  }, [
    shouldLoadCustomers, customers,
    shouldLoadSuppliers, suppliers,
    shouldLoadEmployees, employees,
    shouldLoadShippingPartners, shippingPartners
  ]);

  // === Convert to ComboboxOption format ===
  const paymentTypeOptions = React.useMemo((): ComboboxOption[] => {
    return activePaymentTypes.map(pt => ({
      value: pt.systemId,
      label: pt.name,
    }));
  }, [activePaymentTypes]);

  const paymentMethodOptions = React.useMemo((): ComboboxOption[] => {
    return activePaymentMethods.map(pm => ({
      value: pm.systemId,
      label: pm.name,
    }));
  }, [activePaymentMethods]);

  const targetGroupOptions = React.useMemo((): ComboboxOption[] => {
    return activeTargetGroups.map(tg => ({
      value: tg.systemId,
      label: tg.name,
    }));
  }, [activeTargetGroups]);

  const branchOptions = React.useMemo((): ComboboxOption[] => {
    return branches.map(b => ({
      value: b.systemId,
      label: b.name,
    }));
  }, [branches]);

  const accountOptions = React.useMemo((): ComboboxOption[] => {
    return activeAccounts.map(acc => ({
      value: acc.systemId,
      label: acc.name,
      subtitle: acc.type === 'cash' ? 'Tiền mặt' : 'Ngân hàng',
    }));
  }, [activeAccounts]);

  // === Check missing configs ===
  const missingConfigs = React.useMemo(() => {
    const items: string[] = [];
    if (activePaymentTypes.length === 0) items.push('Loại phiếu chi');
    if (activePaymentMethods.length === 0) items.push('Hình thức thanh toán');
    if (activeAccounts.length === 0) items.push('Tài khoản quỹ');
    if (activeTargetGroups.length === 0) items.push('Nhóm đối tượng');
    if (branches.length === 0) items.push('Chi nhánh');
    return items;
  }, [activePaymentTypes.length, activePaymentMethods.length, activeAccounts.length, activeTargetGroups.length, branches.length]);

  // === Default values ===
  const preferredRecipientGroup = activeTargetGroups.find(tg => tg.id === 'NHACUNGCAP');
  const defaults = React.useMemo(() => ({
    recipientGroup: preferredRecipientGroup ?? activeTargetGroups[0],
    paymentMethod: activePaymentMethods[0],
    paymentType: activePaymentTypes[0],
    cashAccount: activeAccounts[0],
    branch: branches[0],
  }), [preferredRecipientGroup, activeTargetGroups, activePaymentMethods, activePaymentTypes, activeAccounts, branches]);

  return {
    // Raw data
    paymentTypes,
    paymentMethods,
    targetGroups,
    accounts,
    branches,
    customers,
    suppliers,
    employees,
    shippingPartners,

    // Filtered active data
    activePaymentTypes,
    activePaymentMethods,
    activeTargetGroups,
    activeAccounts,

    // ComboboxOption arrays
    paymentTypeOptions,
    paymentMethodOptions,
    targetGroupOptions,
    branchOptions,
    accountOptions,
    recipientOptions,

    // Helpers
    missingConfigs,
    defaults,
  };
}
