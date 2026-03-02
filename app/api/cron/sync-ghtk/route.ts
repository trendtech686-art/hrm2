/**
 * GHTK Background Sync Cron API
 * POST /api/cron/sync-ghtk
 * 
 * Runs every 10 minutes to sync GHTK shipment statuses
 * This is a backup for webhook - catches any missed updates
 * 
 * Features:
 * - Only syncs active shipments (not delivered/cancelled)
 * - Only syncs if not synced in last 30 minutes
 * - Processes max 50 shipments per run to avoid timeout
 * - Protected by cron secret key
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  loadGHTKConfig,
  getActiveGHTKShipments,
  syncSinglePackaging,
} from '@/lib/ghtk-sync';

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

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  // Verify authorization
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ 
      success: false, 
      error: 'Unauthorized' 
    }, { status: 401 });
  }
  
  try {
    console.log('🔄 [GHTK Cron] Starting background sync...');
    
    // Load GHTK config
    const ghtkConfig = await loadGHTKConfig();
    if (!ghtkConfig) {
      console.log('⚠️ [GHTK Cron] GHTK is not configured, skipping sync');
      return NextResponse.json({
        success: true,
        message: 'GHTK is not configured',
        synced: 0,
        failed: 0,
      });
    }
    
    // Get active shipments that need sync
    const shipments = await getActiveGHTKShipments({
      maxAge: 30,  // Only sync if not synced in last 30 minutes
      limit: 50,   // Max 50 per run to avoid timeout
    });
    
    console.log(`📦 [GHTK Cron] Found ${shipments.length} shipments to sync`);
    
    if (shipments.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No shipments need sync',
        synced: 0,
        failed: 0,
        duration: Date.now() - startTime,
      });
    }
    
    // Sync each shipment
    const results = {
      synced: 0,
      failed: 0,
      errors: [] as string[],
    };
    
    for (const shipment of shipments) {
      try {
        const result = await syncSinglePackaging(shipment, ghtkConfig);
        
        if (result.success) {
          results.synced++;
        } else {
          results.failed++;
          results.errors.push(`${shipment.trackingCode}: ${result.message}`);
        }
        
        // Add small delay to avoid rate limiting from GHTK
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        results.failed++;
        results.errors.push(
          `${shipment.trackingCode}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }
    
    const duration = Date.now() - startTime;
    
    console.log(`✅ [GHTK Cron] Sync completed:`, {
      synced: results.synced,
      failed: results.failed,
      duration: `${duration}ms`,
    });
    
    return NextResponse.json({
      success: true,
      message: `Synced ${results.synced} shipments, ${results.failed} failed`,
      synced: results.synced,
      failed: results.failed,
      errors: results.errors.slice(0, 10), // Only return first 10 errors
      duration,
    });
    
  } catch (error) {
    console.error('❌ [GHTK Cron] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - startTime,
    }, { status: 500 });
  }
}

// GET endpoint for health check
export async function GET(request: NextRequest) {
  // Verify authorization
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ 
      success: false, 
      error: 'Unauthorized' 
    }, { status: 401 });
  }
  
  try {
    const ghtkConfig = await loadGHTKConfig();
    const shipments = await getActiveGHTKShipments({ maxAge: 30, limit: 100 });
    
    return NextResponse.json({
      success: true,
      status: 'healthy',
      ghtkConfigured: !!ghtkConfig,
      pendingShipments: shipments.length,
      shipments: shipments.map(s => ({
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
