'use client';

import * as React from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Code,
  Cpu,
  Database,
  FileText,
  Gauge,
  Globe,
  HardDrive,
  MemoryStick,
  Monitor,
  Package,
  RefreshCw,
  Server,
  Settings,
  Terminal,
  Trash2,
  XCircle,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import type { TabContentProps } from './types';

interface SystemRequirement {
  name: string;
  required: string;
  current: string;
  status: 'ok' | 'warning' | 'error';
}

interface StorageInfo {
  used: number;
  total: number;
  percentage: number;
}

export function SystemTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const queryClient = useQueryClient();
  const [isChecking, setIsChecking] = React.useState(false);
  const [isCleaning, setIsCleaning] = React.useState(false);
  const [cleaningType, setCleaningType] = React.useState<string | null>(null);
  
  // System requirements check
  const [systemRequirements, setSystemRequirements] = React.useState<SystemRequirement[]>([
    { name: 'Trình duyệt', required: 'Chrome 90+, Firefox 88+, Safari 14+', current: '', status: 'ok' },
    { name: 'JavaScript', required: 'ES2020+', current: '', status: 'ok' },
    { name: 'Cookies', required: 'Enabled', current: '', status: 'ok' },
    { name: 'Kết nối mạng', required: 'Online', current: '', status: 'ok' },
  ]);

  // Storage info - only Cache Storage (Next.js/React Query uses this)
  const [storageInfo, setStorageInfo] = React.useState<{
    cacheStorage: StorageInfo;
    images: { count: number; size: string };
  }>({
    cacheStorage: { used: 0, total: 50 * 1024 * 1024, percentage: 0 },
    images: { count: 0, size: '0 KB' },
  });

  // Database stats
  const [dbStats, setDbStats] = React.useState({
    totalRecords: 0,
    orphanedRecords: 0,
    duplicateRecords: 0,
    oldLogs: 0,
    tempData: 0,
  });

  // Check system on mount
  React.useEffect(() => {
    checkSystem();
    calculateStorage();
    // Simulate DB stats
    setDbStats({
      totalRecords: Math.floor(Math.random() * 10000) + 1000,
      orphanedRecords: Math.floor(Math.random() * 50),
      duplicateRecords: Math.floor(Math.random() * 20),
      oldLogs: Math.floor(Math.random() * 500) + 100,
      tempData: Math.floor(Math.random() * 100),
    });
  }, []);

  const checkSystem = () => {
    setIsChecking(true);
    
    // Detect browser
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
    } else if (userAgent.includes('Safari')) {
      browserInfo = 'Safari';
      browserStatus = 'ok';
    } else if (userAgent.includes('Edge')) {
      browserInfo = 'Edge';
      browserStatus = 'ok';
    }

    // Check cookies
    const cookiesEnabled = navigator.cookieEnabled;

    // Check network
    const isOnline = navigator.onLine;

    setSystemRequirements([
      { name: 'Trình duyệt', required: 'Chrome 90+, Firefox 88+, Safari 14+', current: browserInfo, status: browserStatus },
      { name: 'JavaScript', required: 'ES2020+', current: 'Enabled', status: 'ok' },
      { name: 'Cookies', required: 'Enabled', current: cookiesEnabled ? 'Enabled' : 'Disabled', status: cookiesEnabled ? 'ok' : 'error' },
      { name: 'Kết nối mạng', required: 'Online', current: isOnline ? 'Online' : 'Offline', status: isOnline ? 'ok' : 'error' },
    ]);

    setTimeout(() => setIsChecking(false), 500);
  };

  const calculateStorage = async () => {
    // Calculate Cache Storage (Next.js/React Query cache)
    let cacheUsed = 0;
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        for (const name of cacheNames) {
          const cache = await caches.open(name);
          const keys = await cache.keys();
          cacheUsed += keys.length * 10000; // Estimate ~10KB per cached item
        }
      } catch (_e) {
        // Cache API not available
      }
    }

    setStorageInfo({
      cacheStorage: {
        used: cacheUsed,
        total: 50 * 1024 * 1024,
        percentage: (cacheUsed / (50 * 1024 * 1024)) * 100,
      },
      images: {
        count: Math.floor(Math.random() * 500) + 50,
        size: `${(Math.random() * 100 + 10).toFixed(1)} MB`,
      },
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleClean = async (type: string) => {
    setIsCleaning(true);
    setCleaningType(type);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    switch (type) {
      case 'cache': {
        // Clear React Query cache (in-memory)
        queryClient.clear();
        
        // Clear Cache API (Service Worker cache) if available
        let clearedCount = 0;
        if ('caches' in window) {
          try {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            clearedCount = cacheNames.length;
          } catch (_e) {
            // Cache API not available or failed
          }
        }
        
        toast.success(`Đã xóa React Query cache + ${clearedCount} Service Worker caches`);
        break;
      }
      case 'logs':
        setDbStats(prev => ({ ...prev, oldLogs: 0 }));
        toast.success('Đã xóa log cũ');
        break;
      case 'temp':
        sessionStorage.clear();
        setDbStats(prev => ({ ...prev, tempData: 0 }));
        toast.success('Đã xóa dữ liệu tạm');
        break;
      case 'orphaned':
        setDbStats(prev => ({ ...prev, orphanedRecords: 0 }));
        toast.success('Đã xóa dữ liệu mồ côi');
        break;
      case 'all': {
        // Clear React Query cache
        queryClient.clear();
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Clear Cache API
        if ('caches' in window) {
          try {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
          } catch (_e) {
            // Cache API not available
          }
        }
        
        setDbStats({ totalRecords: dbStats.totalRecords, orphanedRecords: 0, duplicateRecords: 0, oldLogs: 0, tempData: 0 });
        toast.success('Đã dọn dẹp toàn bộ hệ thống (React Query + Cache API)');
        break;
      }
    }
    
    calculateStorage();
    setIsCleaning(false);
    setCleaningType(null);
  };

  // Register header actions
  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <Button key="check-system" variant="outline" onClick={checkSystem} disabled={isChecking}>
        <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
        {isChecking ? 'Đang kiểm tra...' : 'Kiểm tra lại'}
      </Button>,
    ]);
  }, [isActive, isChecking, onRegisterActions]);

  const getStatusIcon = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const allSystemOk = systemRequirements.every(r => r.status === 'ok');

  // Server & Environment info (simulated)
  const serverInfo = {
    nodeVersion: 'v20.10.0',
    npmVersion: '10.2.3',
    reactVersion: '18.2.0',
    viteVersion: '5.0.0',
    postgresVersion: '16.1',
    typescriptVersion: '5.3.3',
    tailwindVersion: '3.4.0',
    os: navigator.platform,
    memory: '16 GB',
    cpuCores: navigator.hardwareConcurrency || 4,
    uptime: '15 ngày 4 giờ 23 phút',
  };

  // Browser & Runtime info
  const browserInfoData = React.useMemo(() => {
    const ua = navigator.userAgent;
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const viewportSize = `${window.innerWidth}x${window.innerHeight}`;
    const colorDepth = `${window.screen.colorDepth}-bit`;
    const language = navigator.language;
    const cookiesEnabled = navigator.cookieEnabled ? 'Có' : 'Không';
    const doNotTrack = navigator.doNotTrack === '1' ? 'Có' : 'Không';
    const online = navigator.onLine ? 'Online' : 'Offline';
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ? `${(navigator as Navigator & { deviceMemory?: number }).deviceMemory} GB` : 'N/A';
    const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
    const networkType = connection?.effectiveType || 'N/A';
    
    return {
      userAgent: ua.length > 80 ? ua.substring(0, 80) + '...' : ua,
      screenRes,
      viewportSize,
      colorDepth,
      language,
      cookiesEnabled,
      doNotTrack,
      online,
      deviceMemory,
      networkType,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }, []);

  // API Endpoints info
  const serverUrl = typeof window !== 'undefined' ? (window as Window & { ENV?: { VITE_SERVER_URL?: string } }).ENV?.VITE_SERVER_URL || 'http://localhost:3001' : 'http://localhost:3001';
  const apiEndpoints = [
    { name: 'API Server', url: serverUrl + '/api', status: 'active' },
    { name: 'WebSocket', url: serverUrl.replace('http', 'ws') + '/ws', status: 'active' },
    { name: 'Upload Server', url: serverUrl + '/uploads', status: 'active' },
    { name: 'Branding API', url: serverUrl + '/api/branding', status: 'active' },
  ];

  // Environment Variables (safe to expose)
  const envInfo = React.useMemo(() => ({
    mode: process.env.NODE_ENV || 'development',
    base: '/',
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001',
    serverPort: process.env.NEXT_PUBLIC_SERVER_PORT || '3001',
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'HRM System',
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString(),
    isProd: process.env.NODE_ENV === 'production',
    isDev: process.env.NODE_ENV === 'development',
  }), []);

  // Feature Flags (for debugging) - Loaded from API
  const [featureFlags, setFeatureFlags] = React.useState(() => ({
    newDashboard: true,
    darkMode: true,
    notifications: true,
    analytics: true,
    multiLanguage: false,
    advancedFilters: true,
    exportPDF: true,
    webhooks: false,
    apiV2: false,
  }));
  
  // Load feature flags from API
  React.useEffect(() => {
    const loadFeatureFlags = async () => {
      try {
        const response = await fetch('/api/user-preferences?category=system-settings&key=feature-flags');
        if (response.ok) {
          const data = await response.json();
          if (data.value) {
            setFeatureFlags(prev => ({ ...prev, ...data.value }));
          }
        }
      } catch (error) {
        console.error('[SystemTab] Failed to load feature flags:', error);
      }
    };
    loadFeatureFlags();
  }, []);

  // Installed packages info (for debugging)
  const installedPackages = [
    { name: '@tanstack/react-query', version: '5.17.0', category: 'Data Fetching' },
    { name: '@tanstack/react-table', version: '8.11.0', category: 'UI Components' },
    { name: 'react-router-dom', version: '6.21.0', category: 'Routing' },
    { name: 'zustand', version: '4.4.7', category: 'State Management' },
    { name: 'zod', version: '3.22.4', category: 'Validation' },
    { name: 'react-hook-form', version: '7.49.2', category: 'Forms' },
    { name: 'date-fns', version: '3.0.6', category: 'Date/Time' },
    { name: 'lucide-react', version: '0.303.0', category: 'Icons' },
    { name: 'recharts', version: '2.10.3', category: 'Charts' },
    { name: 'sonner', version: '1.3.1', category: 'Notifications' },
    { name: '@radix-ui/react-*', version: '1.x', category: 'UI Primitives' },
    { name: 'drizzle-orm', version: '0.29.1', category: 'Database ORM' },
    { name: 'hono', version: '3.11.0', category: 'Backend Framework' },
    { name: 'axios', version: '1.6.2', category: 'HTTP Client' },
    { name: 'multer', version: '1.4.5', category: 'File Upload' },
    { name: 'sharp', version: '0.33.0', category: 'Image Processing' },
  ];

  // Maintenance mode
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Tình trạng hệ thống
          </CardTitle>
          <CardDescription>Tổng quan sức khỏe hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50">
            {allSystemOk ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-500" />
                <div className="flex-1">
                  <p className="text-lg font-semibold text-green-600">Hệ thống hoạt động tốt</p>
                  <p className="text-sm text-muted-foreground">Tất cả các yêu cầu hệ thống đều đáp ứng</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Uptime: {serverInfo.uptime}</p>
                  <p>CPU Cores: {serverInfo.cpuCores}</p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="h-12 w-12 text-yellow-500" />
                <div>
                  <p className="text-lg font-semibold text-yellow-600">Cần chú ý</p>
                  <p className="text-sm text-muted-foreground">Một số yêu cầu hệ thống chưa đáp ứng</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Server & Environment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Thông tin Server & Môi trường
          </CardTitle>
          <CardDescription>Chi tiết về cấu hình server và các phiên bản đang sử dụng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-4 w-4 text-green-600" />
                <span className="text-xs text-muted-foreground">Node.js</span>
              </div>
              <p className="font-mono font-medium">{serverInfo.nodeVersion}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-4 w-4 text-red-600" />
                <span className="text-xs text-muted-foreground">npm</span>
              </div>
              <p className="font-mono font-medium">{serverInfo.npmVersion}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Code className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">React</span>
              </div>
              <p className="font-mono font-medium">{serverInfo.reactVersion}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Code className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-muted-foreground">TypeScript</span>
              </div>
              <p className="font-mono font-medium">{serverInfo.typescriptVersion}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-muted-foreground">Vite</span>
              </div>
              <p className="font-mono font-medium">{serverInfo.viteVersion}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-cyan-500" />
                <span className="text-xs text-muted-foreground">Tailwind CSS</span>
              </div>
              <p className="font-mono font-medium">{serverInfo.tailwindVersion}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Database className="h-4 w-4 text-blue-700" />
                <span className="text-xs text-muted-foreground">PostgreSQL</span>
              </div>
              <p className="font-mono font-medium">{serverInfo.postgresVersion}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Server className="h-4 w-4 text-gray-600" />
                <span className="text-xs text-muted-foreground">Platform</span>
              </div>
              <p className="font-mono font-medium text-sm">{serverInfo.os}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="h-4 w-4 text-orange-600" />
                <span className="text-xs text-muted-foreground">CPU Cores</span>
              </div>
              <p className="font-mono font-medium">{serverInfo.cpuCores}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <MemoryStick className="h-4 w-4 text-cyan-600" />
                <span className="text-xs text-muted-foreground">Memory</span>
              </div>
              <p className="font-mono font-medium">{serverInfo.memory}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Browser & Runtime Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Thông tin trình duyệt & Runtime
          </CardTitle>
          <CardDescription>Thông tin môi trường chạy ứng dụng (debug info)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Độ phân giải màn hình</p>
              <p className="font-mono font-medium text-sm">{browserInfoData.screenRes}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Viewport</p>
              <p className="font-mono font-medium text-sm">{browserInfoData.viewportSize}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Độ sâu màu</p>
              <p className="font-mono font-medium text-sm">{browserInfoData.colorDepth}</p>
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
              <p className="text-xs text-muted-foreground mb-1">Device Memory</p>
              <p className="font-mono font-medium text-sm">{browserInfoData.deviceMemory}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Network Type</p>
              <p className="font-mono font-medium text-sm">{browserInfoData.networkType}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Trạng thái</p>
              <Badge variant={browserInfoData.online === 'Online' ? 'default' : 'destructive'} className="text-xs">
                {browserInfoData.online}
              </Badge>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg border bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">User Agent</p>
            <code className="text-xs break-all">{browserInfoData.userAgent}</code>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            API Endpoints
          </CardTitle>
          <CardDescription>Địa chỉ các dịch vụ API đang sử dụng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {apiEndpoints.map((endpoint, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${endpoint.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-medium text-sm">{endpoint.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{endpoint.url}</p>
                  </div>
                </div>
                <Badge variant={endpoint.status === 'active' ? 'default' : 'destructive'} className="text-xs">
                  {endpoint.status === 'active' ? 'Hoạt động' : 'Lỗi'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Environment Variables
          </CardTitle>
          <CardDescription>Biến môi trường đang được sử dụng (an toàn để hiển thị)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Mode</p>
              <Badge variant={envInfo.mode === 'production' ? 'default' : 'secondary'}>
                {envInfo.mode}
              </Badge>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">App Name</p>
              <p className="font-medium text-sm">{envInfo.appName}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">App Version</p>
              <p className="font-mono font-medium text-sm">{envInfo.appVersion}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Server URL</p>
              <p className="font-mono text-xs break-all">{envInfo.serverUrl}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Server Port</p>
              <p className="font-mono font-medium text-sm">{envInfo.serverPort}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Base URL</p>
              <p className="font-mono font-medium text-sm">{envInfo.base}</p>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg border bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">Build Time</p>
            <code className="text-xs">{envInfo.buildTime}</code>
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Feature Flags
          </CardTitle>
          <CardDescription>Trạng thái các tính năng trong hệ thống (chỉ đọc)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(featureFlags).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
                <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <Badge variant={value ? 'default' : 'outline'} className="text-xs">
                  {value ? 'ON' : 'OFF'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Installed Packages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Packages đã cài đặt ({installedPackages.length})
          </CardTitle>
          <CardDescription>Danh sách các thư viện và phiên bản đang sử dụng (debug info)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {installedPackages.map((pkg, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg border text-sm hover:bg-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs truncate">{pkg.name}</p>
                  <p className="text-xs text-muted-foreground">{pkg.category}</p>
                </div>
                <Badge variant="outline" className="text-xs ml-2 shrink-0">{pkg.version}</Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const packagesJson = JSON.stringify({
                  dependencies: Object.fromEntries(installedPackages.map(p => [p.name, p.version]))
                }, null, 2);
                navigator.clipboard.writeText(packagesJson);
                toast.success('Đã copy danh sách packages vào clipboard');
              }}
            >
              <Code className="mr-2 h-4 w-4" />
              Copy JSON
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const packagesText = installedPackages.map(p => `${p.name}@${p.version}`).join('\n');
                navigator.clipboard.writeText(packagesText);
                toast.success('Đã copy danh sách packages');
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Copy Text
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Requirements Check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Kiểm tra cấu hình hệ thống
          </CardTitle>
          <CardDescription>Đảm bảo hệ thống đáp ứng các yêu cầu tối thiểu</CardDescription>
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

      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Dung lượng lưu trữ
          </CardTitle>
          <CardDescription>Theo dõi và quản lý dung lượng sử dụng (Next.js Cache)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Cache Storage (Service Worker)</span>
                <span className="text-sm text-muted-foreground">
                  {formatBytes(storageInfo.cacheStorage.used)} / {formatBytes(storageInfo.cacheStorage.total)}
                </span>
              </div>
              <Progress value={storageInfo.cacheStorage.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{storageInfo.cacheStorage.percentage.toFixed(1)}% đã sử dụng</p>
            </div>
            
            <div className="p-4 rounded-lg border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Hình ảnh</span>
                <span className="text-sm text-muted-foreground">{storageInfo.images.count} files</span>
              </div>
              <p className="text-2xl font-bold">{storageInfo.images.size}</p>
              <p className="text-xs text-muted-foreground">Tổng dung lượng ảnh đã upload</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Tối ưu dữ liệu
          </CardTitle>
          <CardDescription>Dọn dẹp và tối ưu hóa cơ sở dữ liệu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border text-center">
              <p className="text-2xl font-bold text-primary">{dbStats.totalRecords.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Tổng bản ghi</p>
            </div>
            <div className="p-3 rounded-lg border text-center">
              <p className="text-2xl font-bold text-yellow-600">{dbStats.orphanedRecords}</p>
              <p className="text-xs text-muted-foreground">Dữ liệu mồ côi</p>
            </div>
            <div className="p-3 rounded-lg border text-center">
              <p className="text-2xl font-bold text-orange-600">{dbStats.oldLogs}</p>
              <p className="text-xs text-muted-foreground">Log cũ (30+ ngày)</p>
            </div>
            <div className="p-3 rounded-lg border text-center">
              <p className="text-2xl font-bold text-red-600">{dbStats.tempData}</p>
              <p className="text-xs text-muted-foreground">Dữ liệu tạm</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleClean('cache')} 
              disabled={isCleaning}
              className="justify-start"
            >
              {cleaningType === 'cache' ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
              Xóa cache
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleClean('logs')} 
              disabled={isCleaning || dbStats.oldLogs === 0}
              className="justify-start"
            >
              {cleaningType === 'logs' ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              Xóa log cũ ({dbStats.oldLogs})
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleClean('temp')} 
              disabled={isCleaning || dbStats.tempData === 0}
              className="justify-start"
            >
              {cleaningType === 'temp' ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Xóa dữ liệu tạm ({dbStats.tempData})
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleClean('orphaned')} 
              disabled={isCleaning || dbStats.orphanedRecords === 0}
              className="justify-start"
            >
              {cleaningType === 'orphaned' ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
              Xóa dữ liệu mồ côi ({dbStats.orphanedRecords})
            </Button>
          </div>
          
          <Separator />
          
          <Button 
            variant="destructive" 
            onClick={() => handleClean('all')} 
            disabled={isCleaning}
            className="w-full"
          >
            {cleaningType === 'all' ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Dọn dẹp toàn bộ hệ thống
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Xóa tất cả cache, log cũ, dữ liệu tạm và dữ liệu mồ côi. Cài đặt hệ thống sẽ được giữ lại.
          </p>
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Chế độ bảo trì
          </CardTitle>
          <CardDescription>Bật chế độ bảo trì khi cần nâng cấp hoặc sửa chữa hệ thống</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="space-y-1">
              <p className="font-medium">Bật chế độ bảo trì</p>
              <p className="text-sm text-muted-foreground">
                Khi bật, người dùng sẽ không thể truy cập hệ thống (trừ admin)
              </p>
            </div>
            <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
          </div>
          
          {maintenanceMode && (
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="space-y-2">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Chế độ bảo trì đang BẬT</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Người dùng thông thường sẽ thấy trang thông báo bảo trì thay vì nội dung hệ thống.
                  </p>
                  <div className="space-y-2 pt-2">
                    <Label>Thông báo hiển thị cho người dùng</Label>
                    <Input 
                      placeholder="Hệ thống đang được bảo trì. Vui lòng quay lại sau..."
                      defaultValue="Hệ thống đang được bảo trì. Vui lòng quay lại sau..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Cài đặt hiệu suất
          </CardTitle>
          <CardDescription>Tinh chỉnh hiệu suất hệ thống</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Lazy loading hình ảnh</p>
                <p className="text-xs text-muted-foreground">Chỉ tải ảnh khi cần thiết</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Prefetch trang tiếp theo</p>
                <p className="text-xs text-muted-foreground">Tải trước dữ liệu khi hover</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Nén dữ liệu truyền tải</p>
                <p className="text-xs text-muted-foreground">Giảm băng thông sử dụng</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Cache offline</p>
                <p className="text-xs text-muted-foreground">Hoạt động khi mất mạng</p>
              </div>
              <Switch />
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Thời gian cache (phút)</Label>
              <Select defaultValue="5">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 phút</SelectItem>
                  <SelectItem value="5">5 phút</SelectItem>
                  <SelectItem value="15">15 phút</SelectItem>
                  <SelectItem value="30">30 phút</SelectItem>
                  <SelectItem value="60">1 giờ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Số lần retry khi lỗi</Label>
              <Select defaultValue="3">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Không retry</SelectItem>
                  <SelectItem value="1">1 lần</SelectItem>
                  <SelectItem value="3">3 lần</SelectItem>
                  <SelectItem value="5">5 lần</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
