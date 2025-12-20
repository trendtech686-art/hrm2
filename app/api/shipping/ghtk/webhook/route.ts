/**
 * GHTK Webhook API
 * POST /api/shipping/ghtk/webhook
 * 
 * Receive status updates from GHTK
 * Must return HTTP 200 for GHTK to mark as successful delivery
 * 
 * Security features:
 * - Webhook signature verification (HMAC-SHA256)
 * - IP whitelist validation (optional)
 * - Rate limiting (10 requests/min per tracking code)
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory queue for webhooks (will be replaced by database in production)
const webhookQueue: WebhookPayload[] = [];

interface WebhookPayload {
  label_id: string;
  partner_id: string;
  status_id: number;
  action_time: string;
  reason_code?: string;
  reason?: string;
  weight?: number;
  fee?: number;
  pick_money?: number;
  return_part_package?: number;
  receivedAt: string;
}

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
        console.warn('[GHTK Webhook Security] ⚠️ Rate limit exceeded for:', trackingCode);
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
    console.warn('[GHTK Webhook Security] ⚠️ No GHTK_WEBHOOK_SECRET configured - skipping signature verification');
    return true;
  }
  
  if (!signature) {
    console.error('[GHTK Webhook Security] ❌ No signature header found');
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
      console.error('[GHTK Webhook Security] ❌ Invalid signature');
    } else {
      console.log('[GHTK Webhook Security] ✅ Signature verified');
    }
    
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
    console.warn('[GHTK Webhook Security] ⚠️ Request from non-whitelisted IP:', clientIP);
  }
  
  return isAllowed;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[GHTK Webhook] Received update:', JSON.stringify(body, null, 2));
    
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
    } = body;
    
    // ============================================
    // SECURITY LAYER 1: Validate Required Fields
    // ============================================
    if (!label_id || status_id === undefined) {
      console.error('[GHTK Webhook] ❌ Missing required fields:', { label_id, status_id });
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
      console.warn('[GHTK Webhook] ⚠️ Rate limit exceeded for:', label_id);
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
      console.error('[GHTK Webhook] ❌ Request from non-whitelisted IP');
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
        console.error('[GHTK Webhook] ❌ Invalid signature');
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid signature' 
        }, { status: 401 });
      }
    }
    
    // ============================================
    // PROCESS WEBHOOK
    // ============================================
    console.log('[GHTK Webhook] ✅ Security checks passed. Processing:', {
      trackingCode: label_id,
      orderId: partner_id,
      statusId: status_id,
      reasonCode: reason_code,
      actionTime: action_time
    });
    
    // Store webhook payload for frontend to fetch
    webhookQueue.push({
      label_id,
      partner_id,
      status_id: parseInt(status_id),
      action_time,
      reason_code,
      reason,
      weight: weight ? parseFloat(weight) : undefined,
      fee: fee ? parseInt(fee) : undefined,
      pick_money: pick_money ? parseInt(pick_money) : undefined,
      return_part_package: return_part_package ? parseInt(return_part_package) : 0,
      receivedAt: new Date().toISOString()
    });
    
    // Keep only last 100 webhooks in memory
    while (webhookQueue.length > 100) {
      webhookQueue.shift();
    }
    
    console.log('[GHTK Webhook] ✅ Stored in queue. Queue size:', webhookQueue.length);
    
    // CRITICAL: Must return HTTP 200 for GHTK to mark as successful
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook received successfully' 
    }, { status: 200 });
    
  } catch (error) {
    console.error('[GHTK Webhook] Error processing webhook:', error);
    
    // Still return 200 to prevent infinite retries
    return NextResponse.json({ 
      success: false, 
      message: 'Error processing webhook',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 });
  }
}

/**
 * GET /api/shipping/ghtk/webhook
 * Frontend polls this endpoint to get webhook updates
 * Returns and removes webhooks from queue
 */
export async function GET() {
  try {
    // Cleanup old rate limit entries
    rateLimiter.cleanup();
    
    if (webhookQueue.length === 0) {
      return NextResponse.json({ 
        success: true, 
        updates: [] 
      });
    }
    
    // Return all pending webhooks and clear queue
    const updates = [...webhookQueue];
    webhookQueue.length = 0;
    
    console.log('[GHTK Webhook] Polled updates, returning', updates.length, 'items');
    
    return NextResponse.json({ 
      success: true, 
      updates 
    });
    
  } catch (error) {
    console.error('[GHTK Webhook] Error polling webhooks:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
