/**
 * GHTK Track Order API
 * GET /api/shipping/ghtk/track/[trackingCode]
 * 
 * Simplified tracking endpoint (uses default GHTK credentials from env)
 * Used by auto-sync service
 */

import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';

const GHTK_API_BASE = 'https://services.giaohangtietkiem.vn';

type Props = {
  params: Promise<{ trackingCode: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: Props
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const requestId = Math.random().toString(36).substring(2, 11);
  const { trackingCode } = await params;

  try {
    // Use default GHTK credentials from environment
    const apiToken = process.env.GHTK_API_TOKEN;
    const partnerCode = process.env.GHTK_PARTNER_CODE;

    if (!apiToken) {
      return apiError('GHTK API Token not configured in server environment', 500);
    }


    const response = await fetch(`${GHTK_API_BASE}/services/shipment/v2/${trackingCode}`, {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
      },
    });

    const data = await response.json();
    

    return apiSuccess(data);
  } catch (error) {
    console.error(`[GHTK-TRACK-${requestId}] Error:`, error);
    return apiError(error instanceof Error ? error.message : 'Unknown error', 500);
  }
}
