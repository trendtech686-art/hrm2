/**
 * GHTK Shipping Fee Calculator API
 * POST /api/shipping/ghtk/calculate-fee
 * 
 * Proxy to calculate GHTK shipping fee
 */

import { NextRequest, NextResponse } from 'next/server';

const GHTK_API_BASE = 'https://services.giaohangtietkiem.vn';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 11);

  try {
    const body = await request.json();
    const { apiToken, partnerCode, tags, subTags, ...params } = body;

    console.log(`[GHTK-${requestId}] 📥 Calculate fee request started:`, {
      timestamp: new Date().toISOString(),
      hasToken: !!apiToken,
      partnerCode,
      params: {
        ...params,
        apiToken: apiToken ? `${apiToken.substring(0, 8)}...` : 'missing'
      }
    });

    if (!apiToken) {
      console.log(`[GHTK-${requestId}] ❌ Missing API Token`);
      return NextResponse.json({ error: 'API Token is required' }, { status: 400 });
    }

    // ✅ Weight should already be in GRAMS from frontend
    // Validate weight (GHTK max is around 30kg = 30000g)
    if (params.weight !== undefined) {
      console.log(`[GHTK-${requestId}] 📦 Weight: ${params.weight} grams`);
      
      if (params.weight > 30000) {
        console.log(`[GHTK-${requestId}] ❌ Weight too large: ${params.weight}g (max 30000g)`);
        return NextResponse.json({ 
          error: 'Weight exceeds maximum limit',
          maxWeight: '30kg (30000 grams)',
          receivedWeight: `${params.weight}g`
        }, { status: 400 });
      }
    }

    // ❌ IMPORTANT: Remove 'tags' parameter - GHTK calculate fee API does NOT support it
    // Tags are only for order creation, not fee calculation
    if (tags || subTags) {
      console.log(`[GHTK-${requestId}] ⚠️  Removed unsupported params:`, { 
        tags, 
        subTags,
        note: 'Tags only work in order creation API, not fee calculation'
      });
    }

    // Build query string
    const url = new URL(`${GHTK_API_BASE}/services/shipment/fee`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // ✅ Special handling for arrays - append each item separately
        if (Array.isArray(value)) {
          value.forEach((item: unknown) => {
            url.searchParams.append(key, String(item));
          });
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });

    console.log(`[GHTK-${requestId}] 🌐 Making API request to:`, {
      url: url.toString(),
      headers: {
        Token: apiToken ? `${apiToken.substring(0, 8)}...` : 'missing',
        'X-Client-Source': partnerCode || ''
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
        'Content-Type': 'application/json',
      },
    });

    // Get response as text first to handle HTML errors
    const responseText = await response.text();
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      // GHTK returned HTML error page
      console.error(`[GHTK-${requestId}] ❌ GHTK returned HTML error:`, {
        status: response.status,
        statusText: response.statusText,
        htmlPreview: responseText.substring(0, 500)
      });
      
      return NextResponse.json({ 
        error: 'GHTK API error',
        status: response.status,
        message: 'GHTK returned HTML error page instead of JSON',
        htmlPreview: responseText.substring(0, 500),
        requestUrl: url.toString()
      }, { status: 500 });
    }
    
    const duration = Date.now() - startTime;
    
    console.log(`[GHTK-${requestId}] 📤 Calculate fee response (${duration}ms):`, {
      status: response.status,
      success: data.success,
      hasData: !!data.data,
      errorMessage: data.message,
      requestWeight: params.weight,
      responseFee: data.fee?.fee,
    });

    // ✅ Log response GHTK
    if (data.success && data.fee) {
      console.log(`[GHTK-${requestId}] 📊 GHTK Fee Response:`, data.fee);
      
      // ⚠️ Warning if no delivery_type
      if (!data.fee.delivery_type) {
        console.warn(`[GHTK-${requestId}] ⚠️  WARNING: Response không có delivery_type!`);
      }
    } else if (!data.success) {
      console.error(`[GHTK-${requestId}] ❌ Tính phí thất bại:`, {
        message: data.message,
        errorCode: data.error_code,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[GHTK-${requestId}] ❌ Calculate fee error (${duration}ms):`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
