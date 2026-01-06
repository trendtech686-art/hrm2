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


    if (!apiToken) {
      return NextResponse.json({ 
        success: false,
        error: 'API Token is required' 
      }, { status: 400 });
    }

    const url = `${GHTK_API_BASE}/services/shipment/list_pick_add`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
        'Content-Type': 'application/json'
      },
    });


    const data = await response.json();
    

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[GHTK-PICK-${requestId}] ❌ Get pick addresses error:`, error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
