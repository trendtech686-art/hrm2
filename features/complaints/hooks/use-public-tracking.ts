/**
 * Hook cho public complaint tracking page
 * Fetches data from public API (no authentication required)
 */

import { useQuery } from '@tanstack/react-query';
import type {
  PublicComplaintData,
  PublicTrackingResponse,
} from '@/lib/types/public-complaint';

export type {
  PublicAffectedProduct,
  PublicTrackingSettings,
  PublicTrackingComment,
  PublicComplaintData,
  PublicTimelineAction,
  PublicRelatedOrder,
  PublicCompensationItem,
  PublicTrackingResponse,
} from '@/lib/types/public-complaint';

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
    complaint: (data?.complaint as PublicComplaintData | undefined) ?? null,
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
    hotline: data?.hotline ?? '',
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
