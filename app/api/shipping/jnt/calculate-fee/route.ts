/**
 * J&T Express Calculate Fee (Tariff Check) API
 * POST /api/shipping/jnt/calculate-fee
 * 
 * Proxy to J&T Tariff Checking API
 * Uses data + sign signature
 */

import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const startTime = Date.now();

  try {
    const body = await request.json();
    const { key, tariffUrl, weight, sendSiteCode, destAreaCode, cusName, productType } = body;

    if (!key) {
      return apiError('Key là bắt buộc', 400);
    }

    if (!tariffUrl) {
      return apiError('Tariff URL là bắt buộc', 400);
    }

    // Build tariff data
    const tariffData = JSON.stringify({
      weight: String(weight || 1),
      sendSiteCode: (sendSiteCode || '').toUpperCase(),
      destAreaCode: (destAreaCode || '').toUpperCase(),
      cusName: cusName || '',
      productType: productType || 'EZ',
    });

    // Generate signature: base64(md5(data + key))
    const sign = Buffer.from(
      crypto.createHash('md5').update(tariffData + key).digest('hex')
    ).toString('base64');

    const formData = new URLSearchParams();
    formData.append('data', tariffData);
    formData.append('sign', sign);

    const response = await fetchWithTimeout(tariffUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      logError('[JNT-FEE] JSON parse error', null, {
        responsePreview: responseText.substring(0, 500),
      });
      return apiError('J&T API trả về phản hồi không hợp lệ', 500);
    }

    const duration = Date.now() - startTime;

    if (data.is_success === 'false' || data.is_success === false) {
      return apiError(data.message || 'Không thể tính phí vận chuyển', 400);
    }

    // Parse content (J&T returns stringified JSON array)
    let parsedContent = [];
    try {
      if (typeof data.content === 'string') {
        parsedContent = JSON.parse(data.content);
      }
    } catch {
      // OK, return as-is
    }

    return apiSuccess({
      ...data,
      parsedContent,
      duration,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(`[JNT-FEE] ❌ Calculate fee error (${duration}ms)`, error);
    return apiError(
      error instanceof Error ? error.message : 'Lỗi không xác định',
      500
    );
  }
}
