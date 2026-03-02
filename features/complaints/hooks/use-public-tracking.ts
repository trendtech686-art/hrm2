/**
 * Hook cho public complaint tracking page
 * Fetches data from public API (no authentication required)
 */

import { useQuery } from '@tanstack/react-query';

export interface PublicTrackingSettings {
  enabled: boolean;
  showEmployeeName: boolean;
  showTimeline: boolean;
  allowCustomerComments: boolean;
  showOrderInfo: boolean;
  showProducts: boolean;
  showImages: boolean;
  showResolution: boolean;
}

export interface PublicTrackingComment {
  systemId: string;
  content: string;
  contentText: string;
  createdBy: string;
  createdBySystemId: string;
  createdAt: string;
  attachments: string[];
  mentions: string[];
  isEdited: boolean;
  parentId: string | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PublicComplaintData = Record<string, any>;

export interface PublicTimelineAction {
  id: string;
  actionType: string;
  performedBy?: string;
  performedByName?: string;
  performedAt: string;
  note?: string;
  images?: string[];
  metadata?: Record<string, unknown>;
}

export interface PublicRelatedOrder {
  systemId?: string;
  id?: string;
  packagings?: Array<{ trackingCode?: string; requestDate?: string | Date }>;
  shippingAddress?: string;
  salesperson?: string;
  orderDate?: string | Date;
  grandTotal?: number;
  expectedDeliveryDate?: string | Date;
  [key: string]: unknown;
}

export interface PublicCompensationItem {
  amount: number;
  description?: string;
  createdAt: string | Date;
}

interface PublicTrackingResponse {
  complaint: PublicComplaintData;
  relatedOrder: PublicRelatedOrder | null;
  comments: PublicTrackingComment[];
  timelineActions: PublicTimelineAction[];
  settings: PublicTrackingSettings;
  hotline: string;
  companyName: string;
}

async function fetchPublicComplaintTracking(code: string): Promise<PublicTrackingResponse> {
  const res = await fetch(`/api/public/complaint-tracking?code=${encodeURIComponent(code)}`);
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Lỗi kết nối' }));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export function usePublicComplaintTracking(complaintId: string | undefined) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['public-complaint-tracking', complaintId],
    queryFn: () => fetchPublicComplaintTracking(complaintId!),
    enabled: !!complaintId,
    staleTime: 30_000, // 30s
    retry: 1,
  });

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    complaint: (data?.complaint as any) ?? null,
    relatedOrder: data?.relatedOrder ?? null,
    comments: data?.comments ?? [],
    timelineActions: data?.timelineActions ?? [],
    settings: data?.settings ?? {
      enabled: false,
      showEmployeeName: true,
      showTimeline: true,
      allowCustomerComments: false,
      showOrderInfo: true,
      showProducts: true,
      showImages: true,
      showResolution: true,
    },
    hotline: data?.hotline ?? '1900-xxxx',
    companyName: data?.companyName ?? 'Công ty',
    isLoading,
    isError,
    error,
  };
}

/**
 * Add customer comment via public API
 */
export async function addPublicComment(trackingCode: string, comment: string): Promise<void> {
  const res = await fetch('/api/public/complaint-tracking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trackingCode, comment }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Lỗi kết nối' }));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
}
