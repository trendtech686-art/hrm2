/**
 * GHTK Shipping Fee Calculator API
 * POST /api/shipping/ghtk/calculate-fee
 * 
 * Proxy to calculate GHTK shipping fee
 */

import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils';
import { calculateFeeSchema } from './validation';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import { GHTK_API_BASE } from '@/lib/ghtk-sync'

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const validation = await validateBody(request, calculateFeeSchema);
  if (!validation.success) {
    return apiError(validation.error, 400);
  }

  const startTime = Date.now();
  const requestId = randomUUID();

  try {
    const { apiToken, partnerCode, tags, subTags, ...params } = validation.data;


    if (!apiToken) {
      return apiError('API Token is required', 400);
    }

    // ✅ Weight is in GRAMS from frontend - let GHTK API validate limits
    // BBS supports heavy items, no client-side limit needed

    // ❌ IMPORTANT: Remove 'tags' parameter - GHTK calculate fee API does NOT support it
    // Tags are only for order creation, not fee calculation
    if (tags || subTags) {
      // Silently ignore tags for fee calculation
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


    const response = await fetchWithTimeout(url.toString(), {
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
      logError(`[GHTK-${requestId}] GHTK returned HTML error`, null, {
        status: response.status,
        statusText: response.statusText,
        htmlPreview: responseText.substring(0, 500)
      });
      
      return apiError('GHTK API error - returned HTML instead of JSON', 500);
    }
    
    const _duration = Date.now() - startTime;

    // ✅ Log response GHTK
    if (data.success && data.fee) {
      // Success - no-op (console removed)
      // ⚠️ Warning if no delivery_type
      if (!data.fee.delivery_type) {
        // Warning suppressed (console removed)
      }
    } else if (!data.success) {
      logError(`[GHTK-${requestId}] Tính phí thất bại`, null, {
        message: data.message,
        errorCode: data.error_code,
      });
    }

    return apiSuccess(data);
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(`[GHTK-${requestId}] ❌ Calculate fee error (${duration}ms)`, error);
    return apiError(error instanceof Error ? error.message : 'Unknown error', 500);
  }
}
