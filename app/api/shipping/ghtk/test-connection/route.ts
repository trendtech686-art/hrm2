/**
 * GHTK Test Connection API
 * GET /api/shipping/ghtk/test-connection
 * 
 * Test GHTK API connection with token
 */

import { NextRequest, NextResponse } from 'next/server';

const GHTK_API_BASE = 'https://services.giaohangtietkiem.vn';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 11);

  try {
    const { searchParams } = new URL(request.url);
    const apiToken = searchParams.get('apiToken');
    const partnerCode = searchParams.get('partnerCode');

    console.log(`[GHTK-TEST-${requestId}] 🔍 Testing connection:`, {
      timestamp: new Date().toISOString(),
      hasToken: !!apiToken,
      partnerCode,
      tokenPreview: apiToken ? `${apiToken.substring(0, 8)}...` : 'missing'
    });

    if (!apiToken) {
      console.log(`[GHTK-TEST-${requestId}] ❌ Missing API Token`);
      return NextResponse.json({ error: 'API Token is required' }, { status: 400 });
    }

    console.log(`[GHTK-TEST-${requestId}] 🌐 Making test request to GHTK list_pick_add`);

    // Test với endpoint đơn giản nhất - list pick addresses
    const response = await fetch(`${GHTK_API_BASE}/services/shipment/list_pick_add`, {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
      },
    });

    const data = await response.json();
    const duration = Date.now() - startTime;
    
    console.log(`[GHTK-TEST-${requestId}] 📤 Test connection response (${duration}ms):`, {
      status: response.status,
      success: data.success,
      message: data.message || 'OK',
      dataStructure: typeof data.data,
      dataIsArray: Array.isArray(data.data),
      dataLength: data.data?.length,
    });

    if (response.ok && data.success !== false) {
      // GHTK trả về data là array trực tiếp
      return NextResponse.json({
        success: true,
        message: 'Kết nối GHTK thành công',
        status: response.status,
        data: {
          pickAddresses: data.data || [],
          pickAddressCount: data.data?.length || 0,
          apiBase: GHTK_API_BASE
        }
      });
    } else {
      console.log(`[GHTK-TEST-${requestId}] ❌ Connection failed:`, {
        status: response.status,
        message: data.message,
      });
      return NextResponse.json({
        success: false,
        message: data.message || 'Kết nối thất bại',
        status: response.status,
        error: data
      }, { status: response.status || 400 });
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[GHTK-TEST-${requestId}] ❌ Connection test error (${duration}ms):`, error);
    return NextResponse.json({
      success: false,
      message: 'Lỗi kết nối: ' + (error instanceof Error ? error.message : 'Unknown error'),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
