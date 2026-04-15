/**
 * GHTK Background Sync Cron API
 * POST /api/cron/sync-ghtk
 * 
 * Runs every 10 minutes to sync ALL stale GHTK shipment statuses.
 * Uses concurrent requests (5 parallel) with pagination for throughput.
 * 
 * Architecture:
 * - Primary: GHTK webhook push (real-time) → handled by /api/shipping/ghtk/webhook
 * - Backup: This cron catches any webhook misses
 * - On-demand: Auto-sync when viewing order detail page
 * 
 * Protected by CRON_SECRET (Vercel cron header).
 */

import { NextRequest, NextResponse } from 'next/server';
import { logError } from '@/lib/logger'
import {
  loadGHTKConfig,
  getActiveGHTKShipments,
  syncSinglePackaging,
  checkLateShipmentWarnings,
} from '@/lib/ghtk-sync';

// Process up to 4 minutes (leave 1 min buffer before Vercel 300s timeout)
const MAX_DURATION_MS = 4 * 60 * 1000;
const BATCH_SIZE = 100;
const CONCURRENCY = 5; // Parallel GHTK API calls

export const maxDuration = 300;

// Verify cron secret to prevent unauthorized access
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // If no secret configured, allow in development
  if (!cronSecret) {
    return process.env.NODE_ENV === 'development';
  }
  
  return authHeader === `Bearer ${cronSecret}`;
}

/**
 * Process an array of items with limited concurrency
 */
async function processWithConcurrency<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency: number,
  shouldStop: () => boolean,
): Promise<R[]> {
  const results: R[] = [];
  let index = 0;

  async function worker() {
    while (index < items.length && !shouldStop()) {
      const currentIndex = index++;
      results[currentIndex] = await fn(items[currentIndex]);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const ghtkConfig = await loadGHTKConfig();
    if (!ghtkConfig) {
      return NextResponse.json({
        success: true,
        message: 'GHTK is not configured',
        synced: 0, failed: 0,
      });
    }
    
    const results = { synced: 0, failed: 0, batches: 0, total: 0, errors: [] as string[] };
    const isTimedOut = () => Date.now() - startTime > MAX_DURATION_MS;
    
    // Paginated loop: process batches with concurrency until done or timeout
    while (!isTimedOut()) {
      const shipments = await getActiveGHTKShipments({
        maxAge: 10,   // Sync if not synced in last 10 minutes (matches cron interval)
        limit: BATCH_SIZE,
      });
      
      if (shipments.length === 0) break;
      
      results.batches++;
      results.total += shipments.length;
      
      // Process batch with concurrency control
      const batchResults = await processWithConcurrency(
        shipments,
        async (shipment) => {
          try {
            return await syncSinglePackaging(shipment, ghtkConfig);
          } catch (error) {
            return {
              success: false,
              message: error instanceof Error ? error.message : 'Unknown error',
              trackingCode: shipment.trackingCode,
            };
          }
        },
        CONCURRENCY,
        isTimedOut,
      );
      
      for (let i = 0; i < batchResults.length; i++) {
        const r = batchResults[i];
        if (!r) continue;
        if (r.success) {
          results.synced++;
        } else {
          results.failed++;
          if (results.errors.length < 10) {
            results.errors.push(`${shipments[i].trackingCode}: ${r.message}`);
          }
        }
      }
    }
    
    // Check for late shipment warnings (runs after sync completes)
    const warnings = await checkLateShipmentWarnings().catch(e => {
      logError('[GHTK Cron] Warning check failed', e);
      return { latePickup: 0, lateDelivery: 0 };
    });
    
    return NextResponse.json({
      success: true,
      message: `Synced ${results.synced}/${results.total}, failed ${results.failed} (${results.batches} batches)`,
      ...results,
      warnings,
      duration: Date.now() - startTime,
    });
    
  } catch (error) {
    logError('[GHTK Cron] Error', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - startTime,
    }, { status: 500 });
  }
}

// GET endpoint for health check
export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const ghtkConfig = await loadGHTKConfig();
    const shipments = await getActiveGHTKShipments({ maxAge: 10, limit: 1000 });
    
    return NextResponse.json({
      success: true,
      status: 'healthy',
      ghtkConfigured: !!ghtkConfig,
      pendingShipments: shipments.length,
      shipments: shipments.slice(0, 20).map(s => ({
        trackingCode: s.trackingCode,
        orderId: s.orderId,
        lastSynced: s.lastSyncedAt,
        deliveryStatus: s.deliveryStatus,
      })),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
