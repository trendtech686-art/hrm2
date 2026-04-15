/**
 * GHTK Print Label API
 * GET /api/shipping/ghtk/print-label/[trackingCode]
 * 
 * Proxy to get GHTK shipping label (returns PDF binary)
 * Query params:
 *   - original: portrait | landscape (default: portrait)
 *   - page_size: A5 | A6 (default: A6)
 * 
 * Note: Credentials are loaded from database (Setting table)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, apiError } from '@/lib/api-utils';
import { loadGHTKConfig, GHTK_API_BASE } from '@/lib/ghtk-sync';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'

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
    const original = searchParams.get('original') || 'portrait'; // portrait | landscape
    const pageSize = searchParams.get('page_size') || 'A6'; // A5 | A6

    // ✅ Load credentials from database instead of client
    const ghtkConfig = await loadGHTKConfig();
    if (!ghtkConfig) {
      return apiError('Chưa cấu hình GHTK. Vui lòng vào Cài đặt → Đối tác vận chuyển.', 400);
    }

    const { apiToken, partnerCode } = ghtkConfig;

    // Build GHTK label URL with params
    const ghtkUrl = new URL(`${GHTK_API_BASE}/services/label/${trackingCode}`);
    ghtkUrl.searchParams.set('original', original);
    ghtkUrl.searchParams.set('page_size', pageSize);


    const response = await fetchWithTimeout(ghtkUrl.toString(), {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
      },
    });

    // Check content type - GHTK returns PDF on success, JSON on error
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/pdf')) {
      // ✅ Success - return PDF binary
      const pdfBuffer = await response.arrayBuffer();
      
      
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="label-${trackingCode}.pdf"`,
          'Content-Length': pdfBuffer.byteLength.toString(),
        },
      });
    } else {
      // ❌ Error - GHTK returns JSON error
      const errorData = await response.json();
      logError(`[GHTK-LABEL-${requestId}] ❌ Error from GHTK`, errorData);
      
      return apiError(errorData.message || 'Failed to get label from GHTK', response.status);
    }
  } catch (error) {
    logError(`[GHTK-LABEL-${requestId}] Print label error`, error);
    return apiError(error instanceof Error ? error.message : 'Unknown error', 500);
  }
}
