/**
 * GHTK Print Label API
 * GET /api/shipping/ghtk/print-label/[trackingCode]
 * 
 * Proxy to get GHTK shipping label (returns PDF URL or base64)
 */

import { NextRequest, NextResponse } from 'next/server';

const GHTK_API_BASE = 'https://services.giaohangtietkiem.vn';

type Props = {
  params: Promise<{ trackingCode: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: Props
) {
  const requestId = Math.random().toString(36).substring(2, 11);
  const { trackingCode } = await params;

  try {
    const { searchParams } = new URL(request.url);
    const apiToken = searchParams.get('apiToken');
    const partnerCode = searchParams.get('partnerCode');

    if (!apiToken) {
      return NextResponse.json({ error: 'API Token is required' }, { status: 400 });
    }

    console.log(`[GHTK-LABEL-${requestId}] Print label:`, trackingCode);

    const response = await fetch(`${GHTK_API_BASE}/services/label/${trackingCode}`, {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
      },
    });

    const data = await response.json();
    
    console.log(`[GHTK-LABEL-${requestId}] Print label response:`, {
      status: response.status,
      success: data.success,
      hasLabel: !!data.label
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[GHTK-LABEL-${requestId}] Print label error:`, error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
