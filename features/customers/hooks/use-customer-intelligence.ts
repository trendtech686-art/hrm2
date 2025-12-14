/**
 * Reactive hooks for Customer Intelligence
 * ═══════════════════════════════════════════════════════════════
 * - useCustomerIntelligence: Get all intelligence for a customer
 * - useCustomerRFM: Get RFM scores and segment
 * - useCustomerHealthScore: Get health score with level
 * - useCustomerChurnRisk: Get churn risk prediction
 * ═══════════════════════════════════════════════════════════════
 */

import { useMemo } from 'react';
import { useCustomerStore } from '../store';
import { 
  calculateRFMScores, 
  getCustomerSegment, 
  calculateHealthScore, 
  getHealthScoreLevel,
  calculateChurnRisk,
  getSegmentBadgeVariant,
  getSegmentLabel,
  type RFMScore,
  type CustomerSegment
} from '../intelligence-utils';
import { calculateLifecycleStage } from '../lifecycle-utils';
import type { Customer, CustomerLifecycleStage } from '../types';

export type CustomerIntelligence = {
  rfmScores: RFMScore;
  segment: CustomerSegment;
  segmentLabel: string;
  segmentVariant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive';
  healthScore: number;
  healthLevel: {
    level: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    label: string;
    variant: 'success' | 'default' | 'warning' | 'destructive';
  };
  churnRisk: {
    risk: 'low' | 'medium' | 'high';
    label: string;
    variant: 'success' | 'warning' | 'destructive';
    reason: string;
  };
  lifecycleStage: CustomerLifecycleStage;
};

/**
 * Get all intelligence data for a customer (reactive)
 * Auto-recalculates when customer data or all customers change
 */
export function useCustomerIntelligence(customer: Customer | null | undefined): CustomerIntelligence | null {
  const allCustomers = useCustomerStore(state => state.getActive());
  
  return useMemo(() => {
    if (!customer) return null;
    
    // Calculate RFM
    const rfmScores = customer.rfmScores || calculateRFMScores(customer, allCustomers);
    const segment = customer.segment as CustomerSegment || getCustomerSegment(rfmScores);
    
    // Calculate health score
    const healthScore = customer.healthScore ?? calculateHealthScore(customer);
    const healthLevel = getHealthScoreLevel(healthScore);
    
    // Calculate churn risk
    const churnRisk = calculateChurnRisk(customer);
    
    // Calculate lifecycle stage
    const lifecycleStage = customer.lifecycleStage || calculateLifecycleStage(customer);
    
    return {
      rfmScores,
      segment,
      segmentLabel: getSegmentLabel(segment),
      segmentVariant: getSegmentBadgeVariant(segment),
      healthScore,
      healthLevel,
      churnRisk,
      lifecycleStage,
    };
  }, [customer, allCustomers]);
}

/**
 * Get RFM scores and segment for a customer
 */
export function useCustomerRFM(customer: Customer | null | undefined): {
  scores: RFMScore;
  segment: CustomerSegment;
  segmentLabel: string;
  segmentVariant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive';
} | null {
  const allCustomers = useCustomerStore(state => state.getActive());
  
  return useMemo(() => {
    if (!customer) return null;
    
    const scores = customer.rfmScores || calculateRFMScores(customer, allCustomers);
    const segment = customer.segment as CustomerSegment || getCustomerSegment(scores);
    
    return {
      scores,
      segment,
      segmentLabel: getSegmentLabel(segment),
      segmentVariant: getSegmentBadgeVariant(segment),
    };
  }, [customer, allCustomers]);
}

/**
 * Get health score with level info for a customer
 */
export function useCustomerHealthScore(customer: Customer | null | undefined): {
  score: number;
  level: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  label: string;
  variant: 'success' | 'default' | 'warning' | 'destructive';
} | null {
  return useMemo(() => {
    if (!customer) return null;
    
    const score = customer.healthScore ?? calculateHealthScore(customer);
    const { level, label, variant } = getHealthScoreLevel(score);
    
    return { score, level, label, variant };
  }, [customer]);
}

/**
 * Get churn risk prediction for a customer
 */
export function useCustomerChurnRisk(customer: Customer | null | undefined): {
  risk: 'low' | 'medium' | 'high';
  label: string;
  variant: 'success' | 'warning' | 'destructive';
  reason: string;
} | null {
  return useMemo(() => {
    if (!customer) return null;
    return calculateChurnRisk(customer);
  }, [customer]);
}

/**
 * Get lifecycle stage for a customer (reactive)
 */
export function useCustomerLifecycleStage(customer: Customer | null | undefined): CustomerLifecycleStage | null {
  return useMemo(() => {
    if (!customer) return null;
    return customer.lifecycleStage || calculateLifecycleStage(customer);
  }, [customer]);
}
