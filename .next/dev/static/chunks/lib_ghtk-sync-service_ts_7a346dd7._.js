(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/ghtk-sync-service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ghtkSyncService",
    ()=>ghtkSyncService
]);
/**
 * GHTK Auto-Sync Service
 * Handles automatic synchronization of GHTK shipment statuses
 * 
 * Strategy: Webhook + Fallback Polling (Option 3)
 * - Primary: Webhook push from GHTK (real-time)
 * - Fallback: Periodic polling (every 5-10 minutes)
 * - On-demand: Sync when user views order
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ghtk$2d$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ghtk-constants.ts [app-client] (ecmascript)");
;
;
class GHTKSyncService {
    syncInterval;
    webhookPollInterval;
    mode = 'hybrid';
    pollingIntervalMs = 10 * 60 * 1000;
    webhookPollIntervalMs = 5 * 1000;
    isRunning = false;
    // Cache to avoid duplicate API calls
    cache = new Map();
    cacheTTL = 2 * 60 * 1000;
    constructor(mode = 'hybrid'){
        this.mode = mode;
    }
    /**
   * Start auto-sync service
   */ startAutoSync() {
        if (this.isRunning) {
            console.log('[GHTK Sync] Already running');
            return;
        }
        this.isRunning = true;
        console.log(`[GHTK Sync] Starting in ${this.mode} mode`);
        // Start webhook polling (primary mechanism)
        if (this.mode === 'webhook' || this.mode === 'hybrid') {
            this.startWebhookPolling();
        }
        // Start fallback polling (backup mechanism)
        if (this.mode === 'polling' || this.mode === 'hybrid') {
            this.startFallbackPolling();
        }
    }
    /**
   * Stop auto-sync service
   */ stopAutoSync() {
        if (!this.isRunning) return;
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = undefined;
        }
        if (this.webhookPollInterval) {
            clearInterval(this.webhookPollInterval);
            this.webhookPollInterval = undefined;
        }
        this.isRunning = false;
        console.log('[GHTK Sync] Stopped');
    }
    /**
   * Poll webhook endpoint for updates from GHTK
   * This checks if GHTK has pushed any status updates to our server
   */ startWebhookPolling() {
        console.log('[GHTK Sync] Starting webhook polling (every 5s)');
        // Run immediately
        this.checkWebhookUpdates();
        // Then poll every 5 seconds
        this.webhookPollInterval = setInterval(()=>{
            this.checkWebhookUpdates();
        }, this.webhookPollIntervalMs);
    }
    /**
   * Check for webhook updates from server
   */ async checkWebhookUpdates() {
        try {
            const response = await fetch((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApiUrl"])('/shipping/ghtk/webhook/poll'));
            const data = await response.json();
            if (data.success && data.updates && data.updates.length > 0) {
                console.log(`[GHTK Sync] Received ${data.updates.length} webhook updates`);
                // Process each webhook update
                for (const update of data.updates){
                    await this.processWebhookUpdate(update);
                }
            }
        } catch (error) {
            console.error('[GHTK Sync] Webhook poll error:', error);
        }
    }
    /**
   * Process a webhook update
   */ async processWebhookUpdate(update) {
        try {
            // Dynamically import to avoid circular dependencies
            const { useOrderStore } = await __turbopack_context__.A("[project]/features/orders/store.ts [app-client] (ecmascript, async loader)");
            const { processGHTKWebhook } = useOrderStore.getState();
            console.log('[GHTK Sync] Processing webhook update:', {
                trackingCode: update.label_id,
                statusId: update.status_id
            });
            processGHTKWebhook(update);
        } catch (error) {
            console.error('[GHTK Sync] Error processing webhook:', error);
        }
    }
    /**
   * Start fallback polling (for orders webhook might miss)
   */ startFallbackPolling() {
        console.log('[GHTK Sync] Starting fallback polling (every 10 min)');
        // Run immediately
        this.syncStaleOrders();
        // Then poll every 10 minutes
        this.syncInterval = setInterval(()=>{
            this.syncStaleOrders();
        }, this.pollingIntervalMs);
    }
    /**
   * Sync orders that haven't been updated recently
   */ async syncStaleOrders() {
        try {
            const { useOrderStore } = await __turbopack_context__.A("[project]/features/orders/store.ts [app-client] (ecmascript, async loader)");
            const { data: orders } = useOrderStore.getState();
            // Find orders with GHTK shipments that need syncing
            const stalePackagings = orders.flatMap((order)=>order.packagings.filter((p)=>p.carrier === 'GHTK' && p.trackingCode && this.shouldSync(p)).map((p)=>({
                        order,
                        packaging: p
                    })));
            if (stalePackagings.length === 0) {
                console.log('[GHTK Sync] No stale orders to sync');
                return;
            }
            console.log(`[GHTK Sync] Syncing ${stalePackagings.length} stale shipments...`);
            // Sync each one with rate limiting
            for (const { order, packaging } of stalePackagings){
                await this.syncOne(order.systemId, packaging.systemId, packaging.trackingCode);
                // Rate limiting: 200ms between requests
                await this.delay(200);
            }
            console.log('[GHTK Sync] Fallback sync completed');
        } catch (error) {
            console.error('[GHTK Sync] Fallback sync error:', error);
        }
    }
    /**
   * Check if packaging should be synced
   */ shouldSync(packaging) {
        // Don't sync if status is final
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ghtk$2d$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shouldSyncGHTKStatus"])(packaging.ghtkStatusId)) {
            return false;
        }
        // Don't sync if recently synced (< 5 minutes)
        if (packaging.lastSyncedAt) {
            const lastSync = new Date(packaging.lastSyncedAt).getTime();
            const now = Date.now();
            const diffMinutes = (now - lastSync) / 1000 / 60;
            if (diffMinutes < 5) {
                return false;
            }
        }
        return true;
    }
    /**
   * Sync single shipment by tracking code
   */ async syncOne(orderSystemId, packagingSystemId, trackingCode) {
        // Check cache first
        const cached = this.cache.get(trackingCode);
        if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
            console.log(`[GHTK Sync] Using cached data for ${trackingCode}`);
            return;
        }
        try {
            console.log(`[GHTK Sync] Fetching status for ${trackingCode}...`);
            const response = await fetch((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApiUrl"])(`/shipping/ghtk/track/${trackingCode}`));
            const data = await response.json();
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${data.error || 'Unknown error'}`);
            }
            if (data.success && data.order) {
                const { useOrderStore } = await __turbopack_context__.A("[project]/features/orders/store.ts [app-client] (ecmascript, async loader)");
                const { processGHTKWebhook } = useOrderStore.getState();
                // Convert tracking response to webhook format
                const webhookData = {
                    label_id: data.order.label_id,
                    partner_id: data.order.partner_id,
                    status_id: parseInt(data.order.status),
                    action_time: data.order.modified,
                    weight: data.order.weight ? parseFloat(data.order.weight) : undefined,
                    fee: data.order.ship_money ? parseInt(data.order.ship_money) : undefined,
                    pick_money: data.order.pick_money ? parseInt(data.order.pick_money) : undefined
                };
                processGHTKWebhook(webhookData);
                // Cache the result
                this.cache.set(trackingCode, {
                    timestamp: Date.now(),
                    data: webhookData
                });
                console.log(`[GHTK Sync] ✓ Synced ${trackingCode}: status ${data.order.status}`);
            } else {
                console.warn(`[GHTK Sync] ✗ Failed to sync ${trackingCode}:`, data.message);
            }
        } catch (error) {
            console.error(`[GHTK Sync] ✗ Error syncing ${trackingCode}:`, error);
            throw error;
        }
    }
    /**
   * Force sync specific order (called on page load)
   */ async syncOrder(orderSystemId) {
        try {
            const { useOrderStore } = await __turbopack_context__.A("[project]/features/orders/store.ts [app-client] (ecmascript, async loader)");
            const { findById } = useOrderStore.getState();
            const order = findById(orderSystemId);
            if (!order) {
                console.warn('[GHTK Sync] Order not found:', orderSystemId);
                return;
            }
            const ghtkPackagings = order.packagings.filter((p)=>p.carrier === 'GHTK' && p.trackingCode);
            if (ghtkPackagings.length === 0) {
                return;
            }
            console.log(`[GHTK Sync] Force syncing order ${order.id} (${ghtkPackagings.length} packages)...`);
            await Promise.all(ghtkPackagings.map((p)=>this.syncOne(order.systemId, p.systemId, p.trackingCode)));
            console.log(`[GHTK Sync] ✓ Order ${order.id} synced`);
        } catch (error) {
            console.error('[GHTK Sync] Order sync error:', error);
            throw error;
        }
    }
    /**
   * Utility: Delay helper
   */ delay(ms) {
        return new Promise((resolve)=>setTimeout(resolve, ms));
    }
    /**
   * Clear cache (useful for testing)
   */ clearCache() {
        this.cache.clear();
        console.log('[GHTK Sync] Cache cleared');
    }
    /**
   * Get sync status
   */ getStatus() {
        return {
            isRunning: this.isRunning,
            mode: this.mode,
            cacheSize: this.cache.size,
            pollingInterval: `${this.pollingIntervalMs / 1000}s`,
            webhookPollInterval: `${this.webhookPollIntervalMs / 1000}s`
        };
    }
}
const ghtkSyncService = new GHTKSyncService('hybrid');
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_ghtk-sync-service_ts_7a346dd7._.js.map