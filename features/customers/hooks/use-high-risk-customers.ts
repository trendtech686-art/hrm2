/**
 * Reactive hooks for High-Risk Customer Queries
 * ═══════════════════════════════════════════════════════════════
 * - useHighRiskCustomers: Get customers with high debt risk
 * - useOverdueDebtCustomers: Get customers with overdue debt
 * - useDueSoonCustomers: Get customers with debt due in 1-3 days
 * - useCustomersBySegment: Get customers by RFM segment
 * - useAtRiskCustomers: Get customers at risk of churning
 * ═══════════════════════════════════════════════════════════════
 */

import { useMemo } from 'react';
import { useCustomerStore } from '../store';
import { calculateChurnRisk, type CustomerSegment } from '../intelligence-utils';
import type { Customer } from '../types';

/**
 * Get customers with high debt risk (danger/exceeded levels)
 */
export function useHighRiskDebtCustomers(): Customer[] {
  const getHighRiskDebtCustomers = useCustomerStore(state => state.getHighRiskDebtCustomers);
  const data = useCustomerStore(state => state.data); // For reactivity
  
  return useMemo(() => {
    return getHighRiskDebtCustomers();
  }, [getHighRiskDebtCustomers, data]);
}

/**
 * Get customers with overdue debt (sorted by priority)
 */
export function useOverdueDebtCustomers(): Customer[] {
  const getOverdueDebtCustomers = useCustomerStore(state => state.getOverdueDebtCustomers);
  const data = useCustomerStore(state => state.data);
  
  return useMemo(() => {
    return getOverdueDebtCustomers();
  }, [getOverdueDebtCustomers, data]);
}

/**
 * Get customers with debt due in 1-3 days
 */
export function useDueSoonCustomers(): Customer[] {
  const getDueSoonCustomers = useCustomerStore(state => state.getDueSoonCustomers);
  const data = useCustomerStore(state => state.data);
  
  return useMemo(() => {
    return getDueSoonCustomers();
  }, [getDueSoonCustomers, data]);
}

/**
 * Get customers by RFM segment
 */
export function useCustomersBySegment(segment: CustomerSegment | string): Customer[] {
  const getCustomersBySegment = useCustomerStore(state => state.getCustomersBySegment);
  const data = useCustomerStore(state => state.data);
  
  return useMemo(() => {
    return getCustomersBySegment(segment);
  }, [getCustomersBySegment, segment, data]);
}

/**
 * Get customers at risk of churning (medium + high risk)
 */
export function useAtRiskCustomers(): {
  highRisk: Customer[];
  mediumRisk: Customer[];
  total: number;
} {
  const activeCustomers = useCustomerStore(state => state.getActive());
  const data = useCustomerStore(state => state.data);
  
  return useMemo(() => {
    const highRisk: Customer[] = [];
    const mediumRisk: Customer[] = [];
    
    activeCustomers.forEach(customer => {
      const { risk } = calculateChurnRisk(customer);
      if (risk === 'high') {
        highRisk.push(customer);
      } else if (risk === 'medium') {
        mediumRisk.push(customer);
      }
    });
    
    return {
      highRisk,
      mediumRisk,
      total: highRisk.length + mediumRisk.length,
    };
  }, [activeCustomers, data]);
}

/**
 * Get customer statistics summary
 */
export function useCustomerStats(): {
  total: number;
  active: number;
  deleted: number;
  byLifecycleStage: Record<string, number>;
  bySegment: Record<string, number>;
  withDebt: number;
  withOverdueDebt: number;
} {
  const data = useCustomerStore(state => state.data);
  const getActive = useCustomerStore(state => state.getActive);
  const getOverdueDebtCustomers = useCustomerStore(state => state.getOverdueDebtCustomers);
  
  return useMemo(() => {
    const activeCustomers = getActive();
    const byLifecycleStage: Record<string, number> = {};
    const bySegment: Record<string, number> = {};
    let withDebt = 0;
    
    activeCustomers.forEach(customer => {
      // Count by lifecycle stage
      const stage = customer.lifecycleStage || 'Chưa phân loại';
      byLifecycleStage[stage] = (byLifecycleStage[stage] || 0) + 1;
      
      // Count by segment
      const segment = customer.segment || 'Chưa phân loại';
      bySegment[segment] = (bySegment[segment] || 0) + 1;
      
      // Count with debt
      if ((customer.currentDebt || 0) > 0) {
        withDebt++;
      }
    });
    
    const overdueCustomers = getOverdueDebtCustomers();
    
    return {
      total: data.length,
      active: activeCustomers.length,
      deleted: data.filter(c => c.isDeleted).length,
      byLifecycleStage,
      bySegment,
      withDebt,
      withOverdueDebt: overdueCustomers.length,
    };
  }, [data, getActive, getOverdueDebtCustomers]);
}
