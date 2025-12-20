/**
 * GHTK Order Status API
 * GET /api/shipping/ghtk/order-status/[trackingCode]
 * 
 * Proxy to get GHTK order status
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

    console.log(`[GHTK-STATUS-${requestId}] Get order status:`, trackingCode);

    const response = await fetch(`${GHTK_API_BASE}/services/shipment/v2/${trackingCode}`, {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
      },
    });

    const data = await response.json();
    
    console.log(`[GHTK-STATUS-${requestId}] Order status response:`, {
      status: response.status,
      success: data.success,
      orderStatus: data.order?.status
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[GHTK-STATUS-${requestId}] Get order status error:`, error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
