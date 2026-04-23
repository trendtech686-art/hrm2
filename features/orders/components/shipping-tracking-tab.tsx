import * as React from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { formatDateTime } from '@/lib/date-utils';
import type { Order } from '../types';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Truck, RefreshCw } from 'lucide-react';
import { useOrderDetailActions } from '../hooks/use-order-detail-actions';
import { orderKeys } from '../hooks/use-orders';
import { logError } from '@/lib/logger'
import { mobileBleedCardClass } from '@/components/layout/page-section';

// Auto-sync if lastSyncedAt is older than this (in minutes)
const AUTO_SYNC_STALE_MINUTES = 5;

interface ShippingTrackingTabProps {
    order: Order;
}

export function ShippingTrackingTab({ order }: ShippingTrackingTabProps) {
    const { syncGHTKShipment } = useOrderDetailActions();
    const queryClient = useQueryClient();
    const [isSyncing, setIsSyncing] = React.useState(false);
    const isSyncingRef = React.useRef(false);
    const autoSyncedRef = React.useRef(false);
    
    const shippingPackaging = React.useMemo(() => {
        return order.packagings.find(
            (p) => p.deliveryMethod === 'Dịch vụ giao hàng' && p.status !== 'Hủy đóng gói'
        );
    }, [order.packagings]);

    const shouldAutoSync = React.useMemo(() => {
        if (!shippingPackaging?.trackingCode || shippingPackaging.carrier !== 'GHTK') return false;
        // Don't auto-sync final states
        const finalStatuses = ['DELIVERED', 'CANCELLED'];
        if (finalStatuses.includes(shippingPackaging.deliveryStatus || '')) return false;
        // Check staleness
        if (!shippingPackaging.lastSyncedAt) return true;
        const lastSync = new Date(shippingPackaging.lastSyncedAt).getTime();
        return Date.now() - lastSync > AUTO_SYNC_STALE_MINUTES * 60 * 1000;
    }, [shippingPackaging]);

    const doSync = React.useCallback(async () => {
        if (!shippingPackaging?.trackingCode || isSyncingRef.current) return;
        isSyncingRef.current = true;
        setIsSyncing(true);
        try {
            await syncGHTKShipment(order.systemId, shippingPackaging.systemId);
            await queryClient.invalidateQueries({ queryKey: orderKeys.detail(order.systemId) });
        } catch (error) {
            logError('GHTK sync error', error);
        } finally {
            isSyncingRef.current = false;
            setIsSyncing(false);
        }
    }, [shippingPackaging?.trackingCode, shippingPackaging?.systemId, order.systemId, syncGHTKShipment, queryClient]);

    // Auto-sync on mount if data is stale — runs once only
    React.useEffect(() => {
        if (shouldAutoSync && !autoSyncedRef.current) {
            autoSyncedRef.current = true;
            doSync();
        }
    }, [shouldAutoSync, doSync]);

    if (!shippingPackaging) {
        return (
            <Card className={mobileBleedCardClass}>
                <CardContent className="p-8 text-center text-muted-foreground">
                    <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Đơn hàng chưa được gửi qua đơn vị vận chuyển</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Link href={`/packaging/${shippingPackaging.systemId}`}
                    className="text-sm text-primary hover:underline"
                >
                    Xem chi tiết phiếu đóng gói →
                </Link>
                {shippingPackaging.carrier === 'GHTK' && shippingPackaging.trackingCode && (
                    <div className="flex items-center gap-2">
                        {isSyncing ? (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <RefreshCw className="h-3 w-3 animate-spin" />
                                Đang đồng bộ...
                            </span>
                        ) : shippingPackaging.lastSyncedAt ? (
                            <span className="text-xs text-muted-foreground">
                                Đồng bộ lúc: {formatDateTime(shippingPackaging.lastSyncedAt)}
                            </span>
                        ) : null}
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={doSync}
                            disabled={isSyncing}
                            title="Đồng bộ lại"
                        >
                            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
