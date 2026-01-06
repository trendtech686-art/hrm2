/**
 * GHTK Get Specific Addresses API
 * GET /api/shipping/ghtk/get-specific-addresses
 * 
 * Get specific addresses (street level) from GHTK
 * Query params: province, district, ward_street, apiToken
 */

import { NextRequest, NextResponse } from 'next/server';

const GHTK_API_BASE = 'https://services.giaohangtietkiem.vn';

export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(2, 11);

  try {
    const { searchParams } = new URL(request.url);
    const province = searchParams.get('province');
    const district = searchParams.get('district');
    const ward_street = searchParams.get('ward_street');
    const apiToken = searchParams.get('apiToken');


    if (!province || !district || !ward_street) {
      return NextResponse.json({ 
        success: false,
        error: 'Province, district, and ward_street are required' 
      }, { status: 400 });
    }

    if (!apiToken) {
      return NextResponse.json({ 
        success: false,
        error: 'API Token is required' 
      }, { status: 400 });
    }

    const url = `${GHTK_API_BASE}/services/address/getAddressLevel4?province=${encodeURIComponent(province)}&district=${encodeURIComponent(district)}&ward_street=${encodeURIComponent(ward_street)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'Content-Type': 'application/json'
      },
    });


    const data = await response.json();
    

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[GHTK-ADDR-${requestId}] ❌ Get specific addresses error:`, error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
