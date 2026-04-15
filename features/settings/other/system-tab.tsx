'use client';

import * as React from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Database,
  Monitor,
  RefreshCw,
  Server,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import type { TabContentProps } from './types';

interface SystemRequirement {
  name: string;
  required: string;
  current: string;
  status: 'ok' | 'warning' | 'error';
}

interface SystemInfo {
  database: {
    size: string;
    tables: {
      users: number;
      activeUsers: number;
      orders: number;
      products: number;
      customers: number;
      employees: number;
      activityLogs: number;
    };
  };
  environment: {
    nodeEnv: string;
    nodeVersion: string;
    platform: string;
    arch: string;
    uptime: number;
    memoryUsage: {
      rss: number;
      heapUsed: number;
      heapTotal: number;
    };
  };
}

export function SystemTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const [isChecking, setIsChecking] = React.useState(false);

  // System requirements check (client-side)
  const [systemRequirements, setSystemRequirements] = React.useState<SystemRequirement[]>([
    { name: 'Trình duyệt', required: 'Chrome 90+, Firefox 88+, Safari 14+', current: '', status: 'ok' },
    { name: 'Cookies', required: 'Enabled', current: '', status: 'ok' },
    { name: 'Kết nối mạng', required: 'Online', current: '', status: 'ok' },
  ]);

  // Real server data from API
  const { data: systemInfo, refetch: refetchSystemInfo } = useQuery<SystemInfo>({
    queryKey: ['settings', 'system-info'],
    queryFn: async () => {
      const res = await fetch('/api/settings/system-info');
      if (!res.ok) throw new Error('Failed to fetch');
      return (await res.json()) as SystemInfo;
    },
    staleTime: 60 * 1000,
    enabled: isActive,
  });

  // Check system on mount
  React.useEffect(() => {
    checkSystem();
  }, []);

  const checkSystem = () => {
    setIsChecking(true);

    const userAgent = navigator.userAgent;
    let browserInfo = 'Unknown';
    let browserStatus: 'ok' | 'warning' | 'error' = 'ok';

    if (userAgent.includes('Chrome')) {
      const version = userAgent.match(/Chrome\/(\d+)/)?.[1];
      browserInfo = `Chrome ${version}`;
      browserStatus = parseInt(version || '0') >= 90 ? 'ok' : 'warning';
    } else if (userAgent.includes('Firefox')) {
      const version = userAgent.match(/Firefox\/(\d+)/)?.[1];
      browserInfo = `Firefox ${version}`;
      browserStatus = parseInt(version || '0') >= 88 ? 'ok' : 'warning';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browserInfo = 'Safari';
    } else if (userAgent.includes('Edg')) {
      const version = userAgent.match(/Edg\/(\d+)/)?.[1];
      browserInfo = `Edge ${version}`;
    }

    setSystemRequirements([
      { name: 'Trình duyệt', required: 'Chrome 90+, Firefox 88+, Safari 14+', current: browserInfo, status: browserStatus },
      { name: 'Cookies', required: 'Enabled', current: navigator.cookieEnabled ? 'Enabled' : 'Disabled', status: navigator.cookieEnabled ? 'ok' : 'error' },
      { name: 'Kết nối mạng', required: 'Online', current: navigator.onLine ? 'Online' : 'Offline', status: navigator.onLine ? 'ok' : 'error' },
    ]);

    setTimeout(() => setIsChecking(false), 300);
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const parts: string[] = [];
    if (days > 0) parts.push(`${days} ngày`);
    if (hours > 0) parts.push(`${hours} giờ`);
    parts.push(`${mins} phút`);
    return parts.join(' ');
  };

  // Register header actions
  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <Button key="check-system" variant="outline" onClick={() => { checkSystem(); refetchSystemInfo(); }} disabled={isChecking}>
        <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
        {isChecking ? 'Đang kiểm tra...' : 'Kiểm tra lại'}
      </Button>,
    ]);
  }, [isActive, isChecking, onRegisterActions, refetchSystemInfo]);

  const getStatusIcon = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const allSystemOk = systemRequirements.every(r => r.status === 'ok');

  // Browser info (real data)
  const browserInfoData = React.useMemo(() => ({
    screenRes: `${window.screen.width}x${window.screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cpuCores: navigator.hardwareConcurrency || 'N/A',
    deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory ? `${(navigator as Navigator & { deviceMemory?: number }).deviceMemory} GB` : 'N/A',
    online: navigator.onLine ? 'Online' : 'Offline',
  }), []);

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Tình trạng hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50">
            {allSystemOk ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-lg font-semibold text-green-600">Hệ thống hoạt động tốt</p>
                  <p className="text-sm text-muted-foreground">Tất cả yêu cầu đều đáp ứng</p>
                </div>
                {systemInfo && (
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Uptime: {formatUptime(systemInfo.environment.uptime)}</p>
                    <p>{systemInfo.environment.nodeEnv}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <AlertTriangle className="h-12 w-12 text-yellow-500 shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-yellow-600">Cần chú ý</p>
                  <p className="text-sm text-muted-foreground">Một số yêu cầu chưa đáp ứng</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Server Environment (real data from API) */}
      {systemInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Thông tin Server
            </CardTitle>
            <CardDescription>Dữ liệu thực từ server</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="p-3 rounded-lg border">
                <p className="text-xs text-muted-foreground mb-1">Node.js</p>
                <p className="font-mono font-medium">{systemInfo.environment.nodeVersion}</p>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="text-xs text-muted-foreground mb-1">Platform</p>
                <p className="font-mono font-medium">{systemInfo.environment.platform} ({systemInfo.environment.arch})</p>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="text-xs text-muted-foreground mb-1">Environment</p>
                <Badge variant={systemInfo.environment.nodeEnv === 'production' ? 'default' : 'secondary'}>
                  {systemInfo.environment.nodeEnv}
                </Badge>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="text-xs text-muted-foreground mb-1">Memory (Heap)</p>
                <p className="font-mono font-medium">{systemInfo.environment.memoryUsage.heapUsed} / {systemInfo.environment.memoryUsage.heapTotal} MB</p>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="text-xs text-muted-foreground mb-1">RSS Memory</p>
                <p className="font-mono font-medium">{systemInfo.environment.memoryUsage.rss} MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Database Stats (real data from API) */}
      {systemInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Cơ sở dữ liệu
            </CardTitle>
            <CardDescription>Thống kê PostgreSQL</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              <div className="p-3 rounded-lg border text-center">
                <p className="text-2xl font-bold text-primary">{systemInfo.database.size}</p>
                <p className="text-xs text-muted-foreground">Dung lượng DB</p>
              </div>
              <div className="p-3 rounded-lg border text-center">
                <p className="text-2xl font-bold">{systemInfo.database.tables.users}</p>
                <p className="text-xs text-muted-foreground">Users</p>
              </div>
              <div className="p-3 rounded-lg border text-center">
                <p className="text-2xl font-bold text-green-600">{systemInfo.database.tables.activeUsers}</p>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </div>
              <div className="p-3 rounded-lg border text-center">
                <p className="text-2xl font-bold">{systemInfo.database.tables.employees.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Nhân viên</p>
              </div>
              <div className="p-3 rounded-lg border text-center">
                <p className="text-2xl font-bold">{systemInfo.database.tables.customers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Khách hàng</p>
              </div>
              <div className="p-3 rounded-lg border text-center">
                <p className="text-2xl font-bold">{systemInfo.database.tables.orders.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Đơn hàng</p>
              </div>
              <div className="p-3 rounded-lg border text-center">
                <p className="text-2xl font-bold">{systemInfo.database.tables.products.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Sản phẩm</p>
              </div>
              <div className="p-3 rounded-lg border text-center">
                <p className="text-2xl font-bold">{systemInfo.database.tables.activityLogs.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Activity Logs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Browser & Client Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Trình duyệt & Client
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Màn hình</p>
              <p className="font-mono font-medium text-sm">{browserInfoData.screenRes}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Viewport</p>
              <p className="font-mono font-medium text-sm">{browserInfoData.viewportSize}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Ngôn ngữ</p>
              <p className="font-mono font-medium text-sm">{browserInfoData.language}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Múi giờ</p>
              <p className="font-mono font-medium text-sm">{browserInfoData.timezone}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">CPU Cores</p>
              <p className="font-mono font-medium text-sm">{browserInfoData.cpuCores}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Device Memory</p>
              <p className="font-mono font-medium text-sm">{browserInfoData.deviceMemory}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Trạng thái</p>
              <Badge variant={browserInfoData.online === 'Online' ? 'default' : 'destructive'} className="text-xs">
                {browserInfoData.online}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Requirements Check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Kiểm tra cấu hình
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemRequirements.map((req, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {getStatusIcon(req.status)}
                  <div>
                    <p className="font-medium">{req.name}</p>
                    <p className="text-xs text-muted-foreground">Yêu cầu: {req.required}</p>
                  </div>
                </div>
                <Badge variant={req.status === 'ok' ? 'default' : req.status === 'warning' ? 'secondary' : 'destructive'}>
                  {req.current}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
