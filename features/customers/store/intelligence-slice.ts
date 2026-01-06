/**
 * Customers Store - Intelligence Slice
 * RFM scoring, health score, churn risk, and segmentation
 * 
 * @module features/customers/store/intelligence-slice
 */

import type { Customer } from '@/lib/types/prisma-extended';
import { calculateLifecycleStage } from '../lifecycle-utils';
import { 
    calculateRFMScores, 
    getCustomerSegment, 
    calculateHealthScore,
    calculateChurnRisk 
} from '../intelligence-utils';
import { baseStore } from './base-store';

// ============================================
// CUSTOMER INTELLIGENCE
// ============================================

/**
 * Batch update customer intelligence (RFM, health score, churn risk)
 * Should be called periodically or after significant data changes
 */
export const updateCustomerIntelligence = () => {
    const allCustomers = baseStore.getState().getActive();
    
    baseStore.setState(state => ({
        data: state.data.map(customer => {
            if (customer.isDeleted) return customer;
            
            // Calculate RFM
            const rfmScores = calculateRFMScores(customer, allCustomers);
            const segment = getCustomerSegment(rfmScores);
            
            // Calculate health score
            const healthScore = calculateHealthScore(customer);
            
            // Calculate churn risk
            const churnRisk = calculateChurnRisk(customer).risk;
            
            // Calculate lifecycle stage
            const lifecycleStage = calculateLifecycleStage(customer);
            
            return {
                ...customer,
                rfmScores,
                segment,
                healthScore,
                churnRisk,
                lifecycleStage
            };
        })
    }));
};

/**
 * Get customers filtered by segment
 */
export const getCustomersBySegment = (segment: string): Customer[] => {
    return baseStore.getState().getActive().filter(c => c.segment === segment);
};
