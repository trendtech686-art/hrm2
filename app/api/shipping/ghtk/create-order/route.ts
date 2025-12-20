/**
 * GHTK Create Order API
 * POST /api/shipping/ghtk/create-order
 * 
 * Proxy to create GHTK shipment order
 */

import { NextRequest, NextResponse } from 'next/server';

const GHTK_API_BASE = 'https://services.giaohangtietkiem.vn';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 11);

  try {
    const body = await request.json();
    const { apiToken, partnerCode, ...orderData } = body;

    if (!apiToken) {
      return NextResponse.json({ error: 'API Token is required' }, { status: 400 });
    }

    console.log(`[GHTK-ORDER-${requestId}] 📥 Create order request:`, {
      hasToken: !!apiToken,
      partnerCode,
      pickAddress: orderData.pick_address?.address,
    });

    const response = await fetch(`${GHTK_API_BASE}/services/shipment/order/?ver=1.5`, {
      method: 'POST',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    const duration = Date.now() - startTime;
    
    console.log(`[GHTK-ORDER-${requestId}] 📤 Create order response (${duration}ms):`, {
      status: response.status,
      success: data.success,
      order: data.order?.label
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[GHTK-ORDER-${requestId}] ❌ Create order error:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
