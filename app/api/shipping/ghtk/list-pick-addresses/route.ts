/**
 * GHTK List Pick Addresses API
 * GET /api/shipping/ghtk/list-pick-addresses
 * 
 * Proxy to get list of registered pickup addresses from GHTK
 */

import { NextRequest, NextResponse } from 'next/server';

const GHTK_API_BASE = 'https://services.giaohangtietkiem.vn';

export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(2, 11);

  try {
    const { searchParams } = new URL(request.url);
    const apiToken = searchParams.get('apiToken');
    const partnerCode = searchParams.get('partnerCode');

    console.log(`[GHTK-PICK-${requestId}] 📥 Get pick addresses list request:`, {
      hasToken: !!apiToken,
      tokenPreview: apiToken ? `${apiToken.substring(0, 10)}...` : 'MISSING',
      partnerCode: partnerCode || 'NONE'
    });

    if (!apiToken) {
      console.log(`[GHTK-PICK-${requestId}] ❌ Missing API Token`);
      return NextResponse.json({ 
        success: false,
        error: 'API Token is required' 
      }, { status: 400 });
    }

    const url = `${GHTK_API_BASE}/services/shipment/list_pick_add`;
    console.log(`[GHTK-PICK-${requestId}] 🌐 Calling GHTK:`, url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
        'Content-Type': 'application/json'
      },
    });

    console.log(`[GHTK-PICK-${requestId}] 📡 GHTK response status:`, response.status);

    const data = await response.json();
    
    console.log(`[GHTK-PICK-${requestId}] 📦 GHTK response data:`, {
      success: data.success,
      message: data.message || 'No message',
      dataExists: !!data.data,
      isArray: Array.isArray(data.data),
      count: data.data?.length || 0,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[GHTK-PICK-${requestId}] ❌ Get pick addresses error:`, error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
