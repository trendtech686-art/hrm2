/**
 * GHTK Webhook API
 * POST /api/shipping/ghtk/webhook
 * 
 * Receive status updates from GHTK → update packaging + order in DB.
 * Must return HTTP 200 for GHTK to mark as successful delivery.
 * 
 * Security: HMAC-SHA256 signature, IP whitelist (optional), rate limiting.
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { logError } from '@/lib/logger'
import { 
  findPackagingByTrackingCode, 
  updatePackagingFromGHTK,
} from '@/lib/ghtk-sync';
import { getGHTKStatusInfo } from '@/lib/ghtk-constants';
import { createActivityLog } from '@/lib/services/activity-log-service';

// Rate limiting for webhook endpoint
const rateLimiter = (() => {
  const requests = new Map<string, number[]>();
  const MAX_REQUESTS_PER_MINUTE = 10;
  const CLEANUP_INTERVAL = 60000; // 1 minute
  
  return {
    isAllowed(trackingCode: string): boolean {
      const now = Date.now();
      const timestamps = requests.get(trackingCode) || [];
      const recentRequests = timestamps.filter(t => now - t < CLEANUP_INTERVAL);
      
      if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
        return false;
      }
      
      recentRequests.push(now);
      requests.set(trackingCode, recentRequests);
      return true;
    },
    cleanup() {
      const now = Date.now();
      for (const [key, timestamps] of requests.entries()) {
        const recent = timestamps.filter(t => now - t < CLEANUP_INTERVAL);
        if (recent.length === 0) {
          requests.delete(key);
        } else {
          requests.set(key, recent);
        }
      }
    }
  };
})();

/**
 * Verify GHTK Webhook Signature
 */
function verifyWebhookSignature(body: unknown, signature: string | null): boolean {
  const WEBHOOK_SECRET = process.env.GHTK_WEBHOOK_SECRET;
  
  // If no secret is configured, skip verification (development mode)
  if (!WEBHOOK_SECRET) {
    return true;
  }
  
  if (!signature) {
    logError('[GHTK Webhook Security] No signature header found', null);
    return false;
  }
  
  // Compute HMAC-SHA256 of request body
  const payload = JSON.stringify(body);
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  hmac.update(payload);
  const expectedSignature = 'sha256=' + hmac.digest('hex');
  
  try {
    // Compare signatures (constant-time comparison to prevent timing attacks)
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
    
    if (!isValid) {
      logError('[GHTK Webhook Security] Invalid signature', null);
    }
    // Valid signature - no logging needed
    
    return isValid;
  } catch {
    return false;
  }
}

/**
 * Check if request is from GHTK IP whitelist
 */
function isGHTKIP(clientIP: string): boolean {
  const GHTK_IPS = process.env.GHTK_WHITELIST_IPS?.split(',') || [];
  
  // If no whitelist configured, allow all (development mode)
  if (GHTK_IPS.length === 0) {
    return true;
  }
  
  const isAllowed = GHTK_IPS.includes(clientIP);
  
  if (!isAllowed) {
    // IP not in whitelist - silently reject
  }
  
  return isAllowed;
}

export async function POST(request: NextRequest) {
  try {
    // GHTK may send JSON or application/x-www-form-urlencoded (per their docs)
    let body: Record<string, unknown>;
    const rawText = await request.text();
    try {
      body = JSON.parse(rawText);
    } catch {
      // Fallback: parse as form-encoded (GHTK docs show this format)
      const params = new URLSearchParams(rawText);
      body = Object.fromEntries(params.entries());
    }
    
    const {
      label_id,          // GHTK tracking code
      partner_id,        // Our order ID
      status_id,         // Status code (1-21, etc.)
      action_time,       // ISO timestamp
      reason_code,       // Reason code (100-144)
      reason,            // Reason text
      weight,            // Actual weight (kg)
      fee,               // Actual shipping fee
      pick_money,        // COD amount
      return_part_package // 0 or 1
    } = body as Record<string, string | undefined>;
    
    // ============================================
    // SECURITY LAYER 1: Validate Required Fields
    // ============================================
    if (!label_id || status_id === undefined) {
      logError('[GHTK Webhook] Missing required fields', null, { label_id, status_id });
      // Still return 200 to prevent GHTK from retrying
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields' 
      }, { status: 200 });
    }
    
    // ============================================
    // SECURITY LAYER 2: Rate Limiting
    // ============================================
    if (!rateLimiter.isAllowed(label_id)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Too many requests' 
      }, { status: 429 });
    }
    
    // ============================================
    // SECURITY LAYER 3: IP Whitelist (Optional)
    // ============================================
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    if (!isGHTKIP(clientIP)) {
      logError('[GHTK Webhook] Request from non-whitelisted IP', null);
      return NextResponse.json({ 
        success: false, 
        message: 'Forbidden' 
      }, { status: 403 });
    }
    
    // ============================================
    // SECURITY LAYER 4: Webhook Signature Verification
    // ============================================
    const ENABLE_SIGNATURE_CHECK = !!process.env.GHTK_WEBHOOK_SECRET;
    
    if (ENABLE_SIGNATURE_CHECK) {
      const signature = request.headers.get('x-ghtk-signature') || 
                        request.headers.get('x-hub-signature-256') ||
                        request.headers.get('x-webhook-signature');
      if (!verifyWebhookSignature(body, signature)) {
        logError('[GHTK Webhook] Invalid signature', null);
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid signature' 
        }, { status: 401 });
      }
    }
    
    // ============================================
    // PROCESS WEBHOOK - UPDATE DATABASE
    // ============================================
    
    const parsedStatusId = parseInt(status_id);
    
    // Find packaging by tracking code
    const packaging = await findPackagingByTrackingCode(label_id);
    
    if (packaging) {
      // ✅ Update packaging in database
      const _updateResult = await updatePackagingFromGHTK(
        packaging.systemId,
        parsedStatusId,
        {
          reasonCode: reason_code,
          reasonText: reason,
          fee: fee ? parseInt(fee) : undefined,
          pickMoney: pick_money ? parseInt(pick_money) : undefined,
          actionTime: action_time || undefined,
        }
      );

      // Log activity with "GHTK" as actor
      const statusInfo = getGHTKStatusInfo(parsedStatusId);
      const statusText = statusInfo?.statusText || `Trạng thái ${parsedStatusId}`;
      if (packaging.orderId) {
        await createActivityLog({
          entityType: 'order',
          entityId: packaging.orderId,
          action: `Webhook GHTK - ${statusText}`,
          actionType: 'status',
          metadata: { userName: 'GHTK' },
        }).catch(e => logError('[GHTK Webhook] activity log failed', e));
      }
      
    } else {
      logError(`[GHTK Webhook] Packaging not found for tracking code: ${label_id}`, null);
    }
    
    // Must return HTTP 200 for GHTK to mark as delivered
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully' 
    }, { status: 200 });
    
  } catch (error) {
    logError('[GHTK Webhook] Error processing webhook', error);
    
    // Still return 200 to prevent infinite retries from GHTK
    return NextResponse.json({ 
      success: false, 
      message: 'Error processing webhook',
    }, { status: 200 });
  }
}
