/**
 * GHTK Solutions List API
 * GET /api/shipping/ghtk/solutions
 * 
 * Get GAM solutions list (try multiple GHTK API endpoints)
 */

import { NextRequest, NextResponse } from 'next/server';

const GHTK_URLS = [
  'https://services.giaohangtietkiem.vn/open/api/v1/shop/solution/list',
  'https://khachhang.giaohangtietkiem.vn/open/api/v1/shop/solution/list',
  'https://api.ghtk.vn/open/api/v1/shop/solution/list'
];

export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(2, 11);

  try {
    const { searchParams } = new URL(request.url);
    const apiToken = searchParams.get('apiToken');
    const partnerCode = searchParams.get('partnerCode');

    console.log(`[GHTK-SOL-${requestId}] Get solutions request:`, {
      hasToken: !!apiToken,
      partnerCode
    });

    if (!apiToken) {
      return NextResponse.json({ error: 'API Token is required' }, { status: 400 });
    }

    let lastError = null;
    
    for (const url of GHTK_URLS) {
      try {
        console.log(`[GHTK-SOL-${requestId}] Trying URL: ${url}`);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Token': apiToken,
            'X-Client-Source': partnerCode || 'GHTK',
            'Content-Type': 'application/json',
          },
        });

        // Get response text first to check if it's JSON
        const responseText = await response.text();
        console.log(`[GHTK-SOL-${requestId}] Raw response:`, {
          url,
          status: response.status,
          statusText: response.statusText,
          bodyPreview: responseText.substring(0, 200)
        });

        // If 404, try next URL
        if (response.status === 404) {
          console.log(`[GHTK-SOL-${requestId}] 404 - trying next URL...`);
          continue;
        }

        // Try to parse as JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch {
          console.error(`[GHTK-SOL-${requestId}] JSON parse error`);
          lastError = {
            error: 'Invalid response from GHTK API',
            details: responseText.substring(0, 500),
            status: response.status,
            url
          };
          continue;
        }
        
        console.log(`[GHTK-SOL-${requestId}] Get solutions SUCCESS:`, {
          url,
          success: data.success,
          solutionsCount: data.data?.length || 0
        });

        return NextResponse.json(data);
        
      } catch (error) {
        console.error(`[GHTK-SOL-${requestId}] Error with ${url}:`, error);
        lastError = { error: error instanceof Error ? error.message : 'Unknown error', url };
      }
    }
    
    // If we get here, all URLs failed
    return NextResponse.json({
      error: 'All GHTK API endpoints failed',
      lastError,
      triedUrls: GHTK_URLS
    }, { status: 500 });
  } catch (error) {
    console.error(`[GHTK-SOL-${requestId}] Get solutions error:`, error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
