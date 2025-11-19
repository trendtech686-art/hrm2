import type { Complaint } from './types';

// Storage key
const STORAGE_KEY = 'complaints-sla-settings';

// Default SLA settings
export const defaultSLA = {
  low: { responseTime: 240, resolveTime: 48 },
  medium: { responseTime: 120, resolveTime: 24 },
  high: { responseTime: 60, resolveTime: 12 },
  urgent: { responseTime: 30, resolveTime: 4 },
};

export interface OverdueStatus {
  isOverdueResponse: boolean;
  isOverdueResolve: boolean;
  responseTimeLeft: number;
  resolveTimeLeft: number;
}

/**
 * Load SLA settings from localStorage, fallback to default
 */
function loadSLASettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultSLA;
  } catch {
    return defaultSLA;
  }
}

export function checkOverdue(complaint: Complaint): OverdueStatus {
  const now = new Date();
  const createdAt = new Date(complaint.createdAt);
  const priority = (complaint as any).priority || 'medium';
  
  // Load SLA from localStorage
  const slaSettings = loadSLASettings();
  const sla = slaSettings[priority as keyof typeof defaultSLA] || slaSettings.medium;

  const minutesElapsed = (now.getTime() - createdAt.getTime()) / (1000 * 60);
  const hoursElapsed = minutesElapsed / 60;

  const hasResponse = complaint.timeline?.some(
    (action) => action.actionType === 'commented' || action.actionType === 'investigated'
  ) || false;

  const responseTimeLeft = sla.responseTime - minutesElapsed;
  const isOverdueResponse = !hasResponse && responseTimeLeft < 0;

  const isResolved = complaint.status === 'resolved' || complaint.status === 'ended';
  const resolveTimeLeft = sla.resolveTime - hoursElapsed;
  const isOverdueResolve = !isResolved && resolveTimeLeft < 0;

  return {
    isOverdueResponse,
    isOverdueResolve,
    responseTimeLeft,
    resolveTimeLeft,
  };
}

export function formatTimeLeft(minutes: number): string {
  const abs = Math.abs(minutes);
  if (abs < 60) return `${Math.floor(abs)} phút`;
  if (abs < 1440) return `${Math.floor(abs / 60)} giờ`;
  return `${Math.floor(abs / 1440)} ngày`;
}
