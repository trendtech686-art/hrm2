/**
 * Public Tracking Utilities for Complaints
 * Handles tracking URL generation and settings
 * 
 * @migrated localStorage → /api/user-preferences
 * @see docs/LOCALSTORAGE-TO-DATABASE-MIGRATION.md
 */

import type { SystemId, BusinessId } from "@/lib/id-types";
import { 
  getComplaintsTrackingSettingsSync,
  DEFAULT_TRACKING_SETTINGS as _DEFAULT_TRACKING_SETTINGS,
  type PublicTrackingSettings 
} from '@/hooks/use-public-tracking-settings';

export type { PublicTrackingSettings };

/**
 * Load public tracking settings
 * @deprecated Use useComplaintsTrackingSettings() hook for React components
 */
export function loadTrackingSettings(): PublicTrackingSettings {
  return getComplaintsTrackingSettingsSync();
}

/**
 * Check if tracking is enabled
 */
export function isTrackingEnabled(): boolean {
  const settings = loadTrackingSettings();
  return settings.enabled;
}

/**
 * Generate tracking URL cho khiếu nại
 * Format: /complaint-tracking/{publicTrackingCode}
 */
export function generateTrackingUrl(complaint: { publicTrackingCode?: string; systemId: SystemId; id: BusinessId }): string {
  const baseUrl = window.location.origin;
  const trackingCode = complaint.publicTrackingCode || complaint.systemId; // Fallback SystemId nếu chưa có code riêng
  return `${baseUrl}/complaint-tracking/${trackingCode}`;
}

/**
 * Get tracking code (short ID for customer)
 * Format: First 8 chars of complaintId or custom format
 */
export function getTrackingCode(complaintId: BusinessId | undefined): string {
  // Handle undefined/null
  if (!complaintId) {
    return 'N/A';
  }
  
  // If ID format is COM00000003, extract the number part
  const match = complaintId.match(/COM(\d+)/);
  if (match) {
    return `KN-${match[1]}`;
  }
  // Fallback: use first 8 chars
  return complaintId.substring(0, 8).toUpperCase();
}

/**
 * Check if customer comments are allowed
 */
export function canCustomerComment(): boolean {
  const settings = loadTrackingSettings();
  return settings.enabled && settings.allowCustomerComments;
}

/**
 * Check if employee names should be shown
 */
export function shouldShowEmployeeName(): boolean {
  const settings = loadTrackingSettings();
  return settings.showEmployeeName;
}

/**
 * Check if timeline should be shown
 */
export function shouldShowTimeline(): boolean {
  const settings = loadTrackingSettings();
  return settings.showTimeline;
}

/**
 * Format tracking info for display
 */
export function formatTrackingInfo(complaint: { publicTrackingCode?: string; systemId: SystemId; id: BusinessId }): {
  code: string;
  url: string;
  enabled: boolean;
} {
  return {
    code: getTrackingCode(complaint.id),
    url: generateTrackingUrl(complaint),
    enabled: isTrackingEnabled(),
  };
}
