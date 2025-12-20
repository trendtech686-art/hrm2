import * as React from 'react';
import { Link } from '@/lib/next-compat';
import { formatDateTime } from '@/lib/date-utils';
import type { Order, Packaging } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Truck, RefreshCw } from 'lucide-react';
import { useOrderStore } from '../store';

interface ShippingTrackingTabProps {
    order: Order;
}

export function ShippingTrackingTab({ order }: ShippingTrackingTabProps) {
    const { syncGHTKShipment } = useOrderStore();
    const [isSyncing, setIsSyncing] = React.useState(false);
    
    // Find the active packaging with shipping partner
    const shippingPackaging = React.useMemo(() => {
        return order.packagings.find(
            (p) => p.deliveryMethod === 'Dịch vụ giao hàng' && p.status !== 'Hủy đóng gói'
        );
    }, [order.packagings]);

    const handleManualSync = async () => {
        if (!shippingPackaging?.trackingCode || isSyncing) return;
        
        setIsSyncing(true);
        try {
            await syncGHTKShipment(order.systemId);
        } catch (error) {
            console.error('Manual sync error:', error);
        } finally {
            setIsSyncing(false);
        }
    };

    if (!shippingPackaging) {
        return (
            <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                    <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Đơn hàng chưa được gửi qua đơn vị vận chuyển</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Link to packaging detail */}
            <div className="text-sm text-muted-foreground text-center">
                <Link 
                    to={`/packaging/${shippingPackaging.systemId}`}
                    className="text-primary hover:underline"
                >
                    Xem chi tiết phiếu đóng gói →
                </Link>
            </div>

            {/* Webhook Debug Panel (Dev Only) */}
            {process.env.NODE_ENV === 'development' && (
                <Card className="border-dashed border-amber-300 bg-amber-50/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-900">
                            🔧 Webhook Debug Log
                            <Badge variant="outline" className="ml-auto text-xs">DEV ONLY</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-xs text-muted-foreground mb-2">Webhook History:</p>
                            <ScrollArea className="h-48 w-full rounded-md border bg-background p-3">
                                <pre className="text-xs font-mono whitespace-pre-wrap">
                                    {JSON.stringify(
                                        {
                                            trackingCode: shippingPackaging.trackingCode,
                                            currentStatus: shippingPackaging.ghtkStatusId,
                                            lastSynced: shippingPackaging.lastSyncedAt,
                                            webhookHistory: shippingPackaging.ghtkWebhookHistory || [],
                                            reason: {
                                                code: shippingPackaging.ghtkReasonCode,
                                                text: shippingPackaging.ghtkReasonText,
                                            },
                                        },
                                        null,
                                        2
                                    )}
                                </pre>
                            </ScrollArea>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleManualSync}
                                disabled={isSyncing || !shippingPackaging.trackingCode}
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                                {isSyncing ? 'Đang sync...' : 'Manual Sync'}
                            </Button>
                            {shippingPackaging.lastSyncedAt && (
                                <span className="text-xs text-muted-foreground">
                                    Lần cuối: {formatDateTime(shippingPackaging.lastSyncedAt)}
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
