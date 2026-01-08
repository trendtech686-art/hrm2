/**
 * GHTK Print Label API
 * GET /api/shipping/ghtk/print-label/[trackingCode]
 * 
 * Proxy to get GHTK shipping label (returns PDF URL or base64)
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
    const { searchParams } = new URL(request.url);
    const apiToken = searchParams.get('apiToken');
    const partnerCode = searchParams.get('partnerCode');

    if (!apiToken) {
      return apiError('API Token is required', 400);
    }


    const response = await fetch(`${GHTK_API_BASE}/services/label/${trackingCode}`, {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
      },
    });

    const data = await response.json();
    

    return apiSuccess(data);
  } catch (error) {
    console.error(`[GHTK-LABEL-${requestId}] Print label error:`, error);
    return apiError(error instanceof Error ? error.message : 'Unknown error', 500);
  }
}
