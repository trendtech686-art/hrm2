/**
 * GHTK Solutions List API
 * GET /api/shipping/ghtk/solutions
 * 
 * Get GAM solutions list (try multiple GHTK API endpoints)
 */

import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { apiHandler } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'

const GHTK_URLS = [
  'https://services.giaohangtietkiem.vn/open/api/v1/shop/solution/list',
  'https://khachhang.giaohangtietkiem.vn/open/api/v1/shop/solution/list',
  'https://api.ghtk.vn/open/api/v1/shop/solution/list'
];

export const GET = apiHandler(async (req) => {
  const requestId = randomUUID();

  try {
    const { searchParams } = new URL(req.url);
    const apiToken = searchParams.get('apiToken');
    const partnerCode = searchParams.get('partnerCode');


    if (!apiToken) {
      return apiError('API Token is required', 400);
    }

    let _lastError: { error: string; url: string; details?: string; status?: number } | null = null;
    
    for (const url of GHTK_URLS) {
      try {
        
        const response = await fetchWithTimeout(url, {
          method: 'GET',
          headers: {
            'Token': apiToken,
            'X-Client-Source': partnerCode || 'GHTK',
            'Content-Type': 'application/json',
          },
        });

        // Get response text first to check if it's JSON
        const responseText = await response.text();

        // If 404, try next URL
        if (response.status === 404) {
          continue;
        }

        // Try to parse as JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch {
          logError(`[GHTK-SOL-${requestId}] JSON parse error`, null);
          _lastError = {
            error: 'Invalid response from GHTK API',
            details: responseText.substring(0, 500),
            status: response.status,
            url
          };
          continue;
        }
        

        return apiSuccess(data);
        
      } catch (error) {
        logError(`[GHTK-SOL-${requestId}] Error with ${url}`, error);
        _lastError = { error: error instanceof Error ? error.message : 'Unknown error', url };
      }
    }
    
    // If we get here, all URLs failed
    return apiError('All GHTK API endpoints failed', 500);
  } catch (error) {
    logError(`[GHTK-SOL-${requestId}] Get solutions error`, error);
    return apiError(error instanceof Error ? error.message : 'Unknown error', 500);
  }
}, {
  rateLimit: { max: 10, windowMs: 60_000 }
});
