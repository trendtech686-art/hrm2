/**
 * Complaints Store - Helpers
 * Utility functions for complaint operations
 * 
 * @module features/complaints/store/helpers
 */

import { ENTITY_PREFIXES } from '@/lib/smart-prefix';
import { asSystemId, asBusinessId, type SystemId, type BusinessId } from '@/lib/id-types';
import type { Complaint, ComplaintAction } from '../types';

// ============================================
// ID GENERATION
// ============================================

/**
 * Generate random public tracking code (10 chars: a-z, 0-9)
 * Example: rb5n8xzhrm
 */
export function generatePublicTrackingCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Generate new systemId for complaint
 */
export function generateComplaintSystemId(complaints: Complaint[]): SystemId {
    const SYSTEM_PREFIX = 'COMPLAINT';
    const maxSystemIdNumber = complaints.length > 0
        ? Math.max(...complaints.map(c => {
            const match = c.systemId.match(/COMPLAINT(\d{6})/);
            return match ? parseInt(match[1]) : 0;
        }))
        : 0;
    return asSystemId(`${SYSTEM_PREFIX}${String(maxSystemIdNumber + 1).padStart(6, '0')}`);
}

/**
 * Generate new businessId for complaint
 */
export function generateComplaintBusinessId(complaints: Complaint[], providedId?: BusinessId | null): BusinessId {
    const BUSINESS_PREFIX = ENTITY_PREFIXES['complaints']; // 'PKN'
    
    if (providedId) {
        // Validate unique ID (case-insensitive)
        const existingIds = complaints.map(c => c.id?.toLowerCase());
        if (existingIds.includes(String(providedId).toLowerCase())) {
            throw new Error(`Mã "${providedId}" đã tồn tại! Vui lòng sử dụng mã khác.`);
        }
        // Sanitize ID: uppercase + remove spaces
        return asBusinessId(String(providedId).toUpperCase().trim().replace(/\s+/g, ''));
    }
    
    const maxBusinessIdNumber = complaints.length > 0
        ? Math.max(...complaints.map(c => {
            const match = c.id?.match(/PKN(\d{6})/);
            return match ? parseInt(match[1]) : 0;
        }))
        : 0;
    return asBusinessId(`${BUSINESS_PREFIX}${String(maxBusinessIdNumber + 1).padStart(6, '0')}`);
}

// ============================================
// ACTION HELPERS
// ============================================

/**
 * Create a new complaint action for timeline
 */
export function createComplaintAction(
    actionType: ComplaintAction['actionType'],
    performedBy: SystemId,
    note: string,
    images?: string[]
): ComplaintAction {
    return {
        id: asSystemId(`action_${Date.now()}`),
        actionType,
        performedBy,
        performedAt: new Date(),
        note,
        images,
    };
}
