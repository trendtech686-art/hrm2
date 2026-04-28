/**
 * J&T Express Tracking API
 * POST /api/shipping/jnt/tracking
 * 
 * Proxy to J&T Tracking API
 * J&T Tracking uses Basic Authorization (separate from Order API)
 */

import { NextRequest } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'

export const POST = apiHandler(async (req) => {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { awb, eccompanyid, trackingUrl, trackingPassword } = body;

    if (!awb) {
      return apiError('Mã vận đơn (AWB) là bắt buộc', 400);
    }

    if (!trackingUrl) {
      return apiError('Tracking URL là bắt buộc', 400);
    }

    // J&T Tracking uses Basic Auth
    const trackingData = JSON.stringify({
      awb,
      eccompanyid: eccompanyid || '',
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add Basic Auth if password provided
    if (trackingPassword) {
      headers['Authorization'] = 'Basic ' + Buffer.from(
        `${eccompanyid || ''}:${trackingPassword}`
      ).toString('base64');
    }

    const response = await fetchWithTimeout(trackingUrl, {
      method: 'POST',
      headers,
      body: trackingData,
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      logError('[JNT-TRACK] JSON parse error', null, {
        responsePreview: responseText.substring(0, 500),
      });
      return apiError('J&T Tracking API trả về phản hồi không hợp lệ', 500);
    }

    const duration = Date.now() - startTime;

    // Check for error
    if (data.error_id) {
      logError(`[JNT-TRACK] Tracking error (${duration}ms)`, null, {
        error_id: data.error_id,
        error_message: data.error_message,
      });
      return apiError(data.error_message || 'Không tìm thấy đơn hàng', 404);
    }

    return apiSuccess(data);
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(`[JNT-TRACK] ❌ Tracking error (${duration}ms)`, error);
    return apiError(
      error instanceof Error ? error.message : 'Lỗi không xác định',
      500
    );
  }
}, {
  rateLimit: { max: 30, windowMs: 60_000 }
});
