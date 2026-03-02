import * as React from 'react';
import { useAllCustomers } from '../hooks/use-all-customers';
import { useCustomerSlaEngineStore } from './store';
import { useCustomerSlaSettings } from '../../settings/customers/hooks/use-customer-settings';
import { useCustomersWithComputedDebt } from '../hooks/use-computed-debt';

export function useCustomerSlaEvaluation() {
  const { data: customers } = useAllCustomers();
  const { data: slaSettingsData } = useCustomerSlaSettings();
  const slaSettings = React.useMemo(() => slaSettingsData ?? [], [slaSettingsData]);
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
