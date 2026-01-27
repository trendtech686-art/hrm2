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
import { useActiveCustomers, useAllCustomers } from './use-all-customers';
import { calculateChurnRisk, type CustomerSegment } from '../intelligence-utils';
import type { Customer } from '../types';

/**
 * Get customers with high debt risk (danger/exceeded levels)
 */
export function useHighRiskDebtCustomers(): Customer[] {
  const { data: activeCustomers } = useActiveCustomers();
  
  return useMemo(() => {
    const now = new Date();
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    
    return activeCustomers.filter(customer => {
      const debt = customer.currentDebt || 0;
      if (debt <= 0) return false;
      
      const dueDate = (customer as any).debtDueDate ? new Date((customer as any).debtDueDate) : null;
      if (!dueDate) return false;
      
      const daysUntilDue = Math.floor((dueDate.getTime() - now.getTime()) / MS_PER_DAY);
      
      // High risk: overdue or danger level
      return daysUntilDue < 0 || (debt > 0 && daysUntilDue <= 3);
    }).sort((a, b) => {
      const aDebt = a.currentDebt || 0;
      const bDebt = b.currentDebt || 0;
      return bDebt - aDebt;
    });
  }, [activeCustomers]);
}

/**
 * Get customers with overdue debt (sorted by priority)
 */
export function useOverdueDebtCustomers(): Customer[] {
  const { data: activeCustomers } = useActiveCustomers();
  
  return useMemo(() => {
    const now = new Date();
    
    return activeCustomers.filter(customer => {
      const debt = customer.currentDebt || 0;
      if (debt <= 0) return false;
      
      const dueDate = (customer as any).debtDueDate ? new Date((customer as any).debtDueDate) : null;
      if (!dueDate) return false;
      
      return dueDate < now;
    }).sort((a, b) => {
      // Sort by: overdue days DESC, debt amount DESC
      const aDueDate = (a as any).debtDueDate ? new Date((a as any).debtDueDate).getTime() : 0;
      const bDueDate = (b as any).debtDueDate ? new Date((b as any).debtDueDate).getTime() : 0;
      
      if (aDueDate !== bDueDate) {
        return aDueDate - bDueDate; // Earlier date first (more overdue)
      }
      
      const aDebt = a.currentDebt || 0;
      const bDebt = b.currentDebt || 0;
      return bDebt - aDebt;
    });
  }, [activeCustomers]);
}

/**
 * Get customers with debt due in 1-3 days
 */
export function useDueSoonCustomers(): Customer[] {
  const { data: activeCustomers } = useActiveCustomers();
  
  return useMemo(() => {
    const now = new Date();
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    
    return activeCustomers.filter(customer => {
      const debt = customer.currentDebt || 0;
      if (debt <= 0) return false;
      
      const dueDate = (customer as any).debtDueDate ? new Date((customer as any).debtDueDate) : null;
      if (!dueDate) return false;
      
      const daysUntilDue = Math.floor((dueDate.getTime() - now.getTime()) / MS_PER_DAY);
      
      return daysUntilDue >= 1 && daysUntilDue <= 3;
    }).sort((a, b) => {
      const aDueDate = (a as any).debtDueDate ? new Date((a as any).debtDueDate).getTime() : Infinity;
      const bDueDate = (b as any).debtDueDate ? new Date((b as any).debtDueDate).getTime() : Infinity;
      return aDueDate - bDueDate;
    });
  }, [activeCustomers]);
}

/**
 * Get customers by RFM segment
 */
export function useCustomersBySegment(segment: CustomerSegment | string): Customer[] {
  const { data: activeCustomers } = useActiveCustomers();
  
  return useMemo(() => {
    return activeCustomers.filter(customer => customer.segment === segment);
  }, [activeCustomers, segment]);
}

/**
 * Get customers at risk of churning (medium + high risk)
 */
export function useAtRiskCustomers(): {
  highRisk: Customer[];
  mediumRisk: Customer[];
  total: number;
} {
  const { data: activeCustomers } = useActiveCustomers();
  
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
  }, [activeCustomers]);
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
  const { data: allCustomers } = useAllCustomers();
  const overdueCustomers = useOverdueDebtCustomers();
  
  return useMemo(() => {
    const byLifecycleStage: Record<string, number> = {};
    const bySegment: Record<string, number> = {};
    let withDebt = 0;
    let totalCount = 0;
    let activeCount = 0;
    let deletedCount = 0;
    
    allCustomers.forEach(customer => {
      totalCount++;
      
      if (customer.isDeleted) {
        deletedCount++;
      } else if (customer.status !== 'inactive') {
        activeCount++;
        
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
      }
    });
    
    return {
      total: totalCount,
      active: activeCount,
      deleted: deletedCount,
      byLifecycleStage,
      bySegment,
      withDebt,
      withOverdueDebt: overdueCustomers.length,
    };
  }, [allCustomers, overdueCustomers]);
}
