import * as React from 'react';
import { useCustomerStore } from '../store';
import { useCustomerSlaEngineStore } from './store';
import { useCustomerSlaStore as useCustomerSlaSettingStore } from '../../settings/customers/sla-settings-store';
import { useCustomersWithComputedDebt } from '../hooks/use-computed-debt';

export function useCustomerSlaEvaluation() {
  const customers = useCustomerStore((state) => state.data);
  const slaSettings = useCustomerSlaSettingStore((state) => state.data);
  const evaluate = useCustomerSlaEngineStore((state) => state.evaluate);
  const storeState = useCustomerSlaEngineStore();

  // Use computed debt from orders/receipts instead of static currentDebt field
  const customersWithDebt = useCustomersWithComputedDebt(customers);

  React.useEffect(() => {
    if (!customersWithDebt.length || !slaSettings.length) return;
    evaluate(customersWithDebt, slaSettings);
  }, [customersWithDebt, slaSettings, evaluate]);

  return storeState;
}
