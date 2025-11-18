/**
 * Public Tracking Utilities for Complaints
 * Handles tracking URL generation and settings
 */

// Storage key
const STORAGE_KEY = 'complaints-public-tracking-settings';

// Default tracking settings
const defaultSettings = {
  enabled: false,
  allowCustomerComments: false,
  showEmployeeName: true,
  showTimeline: true,
};

interface PublicTrackingSettings {
  enabled: boolean;
  allowCustomerComments: boolean;
  showEmployeeName: boolean;
  showTimeline: boolean;
}

/**
 * Load public tracking settings from localStorage
 */
export function loadTrackingSettings(): PublicTrackingSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

/**
 * Check if tracking is enabled
 */
export function isTrackingEnabled(): boolean {
  const settings = loadTrackingSettings();
  return settings.enabled;
}

/**
 * Generate tracking URL for a complaint
 * Format: /complaint-tracking/{publicTrackingCode}
 * @param complaint - Complaint object with publicTrackingCode
 */
export function generateTrackingUrl(complaint: { publicTrackingCode?: string; systemId: string; id: string }): string {
  const baseUrl = window.location.origin;
  const trackingCode = complaint.publicTrackingCode || complaint.systemId; // Fallback to systemId if no tracking code
  return `${baseUrl}/complaint-tracking/${trackingCode}`;
}

/**
 * Get tracking code (short ID for customer)
 * Format: First 8 chars of complaintId or custom format
 */
export function getTrackingCode(complaintId: string | undefined): string {
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
export function formatTrackingInfo(complaint: { publicTrackingCode?: string; systemId: string; id: string }): {
  code: string;
  url: string;
  enabled: boolean;
} {
  return {
    code: getTrackingCode(complaint.systemId),
    url: generateTrackingUrl(complaint),
    enabled: isTrackingEnabled(),
  };
}
