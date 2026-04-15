/**
 * ID Counter Settings Page
 * 
 * Centralized management for:
 * - Entity prefixes & formats
 * - Counter values & next IDs
 * - ID validation & testing
 * - Statistics & monitoring
 * 
 * Ensures:
 * ✅ Correct prefix for all entities
 * ✅ No duplicate IDs
 * ✅ Proper counter increments
 * ✅ Integration with breadcrumb & router
 */

'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui/tabs';
import { 
  RefreshCw, 
  CheckCircle2, 
  Search,
  TrendingUp,
  Hash,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { 
  ID_CONFIG, 
  getEntityCategories, 
  type EntityType,
} from '../../../lib/id-config-constants'; // ✅ Client-safe import

// ✅ Import reusable components
import { StatsCard } from '../../../components/settings/stats-card';
import { CounterTable, type CounterTableRow } from '../../../components/settings/counter-table';
import { IDTester } from '../../../components/settings/id-tester';

// Import React Query hooks - only for small datasets
import { useBranches } from '../branches/hooks/use-branches';
import { useDepartments } from '../departments/hooks/use-departments';
import { useJobTitles } from '../job-titles/hooks/use-job-titles';
import { useReceiptTypes } from '../receipt-types/hooks/use-receipt-types';
import { usePaymentTypes } from '../payments/types/hooks/use-payment-types';
import { usePaymentMethods } from '../payments/methods/hooks/use-payment-methods';
import { useProvinces } from '../provinces/hooks/use-provinces';
import { useUnits } from '../units/hooks/use-units';
// 🚀 Use counts API instead of loading all data
import { useEntityCounts } from '../../../hooks/api/use-entity-counts';

// ✅ Update interface to match component
interface CounterInfo extends CounterTableRow {
  // Additional fields if needed
}

export function IDCounterSettingsPage() {
  const _router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedEntity, setSelectedEntity] = React.useState<CounterInfo | null>(null);

  // Page header
  useSettingsPageHeader({
    title: 'Quản lý ID & Prefix',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Cài đặt', href: '/settings' },
      { label: 'Quản lý ID & Prefix', href: '/settings/id-counters', isCurrent: true },
    ],
  });

  // 🚀 OPTIMIZED: Use single API call for counts instead of loading all data
  const { data: entityCounts } = useEntityCounts();
  
  // Only load small datasets that need all data
  const { data: branchesData } = useBranches();
  const { data: departmentsData } = useDepartments();
  const { data: jobTitlesData } = useJobTitles();
  const { data: receiptTypesData } = useReceiptTypes();
  const { data: paymentTypesData } = usePaymentTypes();
  const { data: paymentMethodsData } = usePaymentMethods();
  const { data: provincesData } = useProvinces();
  const { data: unitsData } = useUnits();

  // Gather counter data from React Query hooks
  const counterData = React.useMemo((): CounterInfo[] => {
    const data: CounterInfo[] = [];
    
    // Helper to add counter info from counts API
    const addCounterFromStats = (
      entityType: EntityType,
      stats?: { count: number; lastId?: string }
    ) => {
      const config = ID_CONFIG[entityType];
      if (!config || !stats) return;
      
      const nextId = `${config.prefix}${String(stats.count + 1).padStart(config.digitCount, '0')}`;
      
      // Health check
      let health: 'good' | 'warning' | 'error' = 'good';
      if (stats.count > 0 && !stats.lastId) health = 'warning';
      
      data.push({
        entityType,
        config,
        currentCounter: stats.count,
        totalItems: stats.count,
        nextId,
        lastCreated: stats.lastId,
        health,
      });
    };

    // Helper for small datasets loaded directly
    const addCounterFromData = (
      entityType: EntityType,
      items: unknown[],
      lastItem?: { id?: string }
    ) => {
      const config = ID_CONFIG[entityType];
      if (!config) return;
      
      const nextId = `${config.prefix}${String(items.length + 1).padStart(config.digitCount, '0')}`;
      
      let health: 'good' | 'warning' | 'error' = 'good';
      if (items.length > 0 && !lastItem?.id) health = 'warning';
      
      data.push({
        entityType,
        config,
        currentCounter: items.length,
        totalItems: items.length,
        nextId,
        lastCreated: lastItem?.id,
        health,
      });
    };

    // Use counts API for large entities
    if (entityCounts) {
      addCounterFromStats('employees', entityCounts.employees);
      addCounterFromStats('customers', entityCounts.customers);
      addCounterFromStats('complaints', entityCounts.complaints);
      addCounterFromStats('warranty', entityCounts.warranties);
      addCounterFromStats('orders', entityCounts.orders);
      addCounterFromStats('products', entityCounts.products);
      addCounterFromStats('penalties', entityCounts.penalties);
      addCounterFromStats('leaves', entityCounts.leaves);
      addCounterFromStats('suppliers', entityCounts.suppliers);
      addCounterFromStats('purchase-orders', entityCounts.purchaseOrders);
      addCounterFromStats('purchase-returns', entityCounts.purchaseReturns);
      addCounterFromStats('inventory-receipts', entityCounts.inventoryReceipts);
    }

    // Small datasets - load directly
    const branches = (branchesData as { data?: { id?: string }[] } | undefined)?.data ?? (branchesData as { id?: string }[] | undefined) ?? [];
    addCounterFromData('branches', branches, branches[branches.length - 1]);

    // Departments
    const departments = (departmentsData as { data?: { id?: string }[] } | undefined)?.data ?? (departmentsData as { id?: string }[] | undefined) ?? [];
    addCounterFromData('departments', departments, departments[departments.length - 1]);

    // Job Titles
    const jobTitles = (jobTitlesData as { data?: { id?: string }[] } | undefined)?.data ?? (jobTitlesData as { id?: string }[] | undefined) ?? [];
    addCounterFromData('job-titles', jobTitles, jobTitles[jobTitles.length - 1]);

    // Receipt Types
    const receiptTypes = (receiptTypesData as { data?: { id?: string }[] } | undefined)?.data ?? (receiptTypesData as { id?: string }[] | undefined) ?? [];
    addCounterFromData('receipt-types', receiptTypes, receiptTypes[receiptTypes.length - 1]);

    // Payment Types
    const paymentTypes = (paymentTypesData as { data?: { id?: string }[] } | undefined)?.data ?? (paymentTypesData as { id?: string }[] | undefined) ?? [];
    addCounterFromData('payment-types', paymentTypes, paymentTypes[paymentTypes.length - 1]);

    // Payment Methods
    const paymentMethods = (paymentMethodsData as { data?: { id?: string }[] } | undefined)?.data ?? (paymentMethodsData as { id?: string }[] | undefined) ?? [];
    addCounterFromData('payment-methods', paymentMethods, paymentMethods[paymentMethods.length - 1]);

    // Provinces
    const provinces = (provincesData as { data?: { id?: string }[] } | undefined)?.data ?? (provincesData as { id?: string }[] | undefined) ?? [];
    addCounterFromData('provinces', provinces, provinces[provinces.length - 1]);

    // Units
    const units = Array.isArray(unitsData) ? unitsData : (unitsData as { items?: { id?: string }[] } | undefined)?.items ?? [];
    addCounterFromData('units', units, units[units.length - 1]);

    return data;
  }, [
    entityCounts,
    branchesData,
    departmentsData,
    jobTitlesData,
    receiptTypesData,
    paymentTypesData,
    paymentMethodsData,
    provincesData,
    unitsData,
  ]);

  // Filter data
  const filteredData = React.useMemo(() => {
    let filtered = counterData;
    
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.config.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.config.prefix.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.entityType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      const categories = getEntityCategories();
      const categoryEntities = categories[selectedCategory] || [];
      filtered = filtered.filter(item => categoryEntities.includes(item.entityType as EntityType));
    }
    
    return filtered;
  }, [counterData, searchQuery, selectedCategory]);

  // Statistics
  const stats = React.useMemo(() => {
    const total = counterData.reduce((sum, item) => sum + item.totalItems, 0);
    const maxCounter = Math.max(...counterData.map(item => item.currentCounter));
    const withWarnings = counterData.filter(item => item.health === 'warning').length;
    const withErrors = counterData.filter(item => item.health === 'error').length;
    
    return {
      totalEntities: counterData.length,
      totalItems: total,
      maxCounter,
      withWarnings,
      withErrors,
    };
  }, [counterData]);

  const categories = getEntityCategories();

  return (
    <div className="space-y-6">
      {/* Statistics Cards - Using StatsCard component */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Entity Types"
          value={stats.totalEntities}
          description="Đang theo dõi"
          icon={Hash}
        />
        <StatsCard
          title="Tổng Records"
          value={stats.totalItems.toLocaleString()}
          description="Trên tất cả entities"
          icon={TrendingUp}
        />
        <StatsCard
          title="Counter cao nhất"
          value={stats.maxCounter}
          description="Số thứ tự"
          icon={RefreshCw}
        />
        <Card>
          <CardHeader className="pb-3">
            <CardTitle size="sm" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Health Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.withErrors > 0 ? (
              <Badge variant="destructive">Lỗi: {stats.withErrors}</Badge>
            ) : stats.withWarnings > 0 ? (
              <Badge variant="secondary">Cảnh báo: {stats.withWarnings}</Badge>
            ) : (
              <Badge variant="default">Hoạt động tốt</Badge>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {stats.withErrors === 0 && stats.withWarnings === 0 ? 'Không có vấn đề' : 'Cần kiểm tra'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="counters" className="space-y-4">
        <TabsList>
          <TabsTrigger value="counters">Counters</TabsTrigger>
          <TabsTrigger value="tester">ID Tester</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        {/* Counters Tab */}
        <TabsContent value="counters" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Bộ lọc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Tìm kiếm</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm theo tên, prefix, entity type..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="w-64">
                  <Label>Danh mục</Label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    {Object.keys(categories).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Counter Table - Using CounterTable component */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết Counters</CardTitle>
              <CardDescription>
                {filteredData.length} entity types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CounterTable 
                data={filteredData} 
                onViewDetails={setSelectedEntity}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ID Tester Tab - Using IDTester component */}
        <TabsContent value="tester" className="space-y-4">
          <IDTester 
            defaultEntityType="employees"
            onTestResult={(result) => {
              if (result.valid) {
                toast.success('✅ ID hợp lệ!');
              } else {
                toast.error(`❌ ${result.error}`);
              }
            }}
          />
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cấu hình ID</CardTitle>
              <CardDescription>Danh sách tất cả cấu hình prefix và format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(getEntityCategories()).map(([category, entities]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-sm mb-2">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {entities.map(entityType => {
                        const config = ID_CONFIG[entityType];
                        if (!config) return null;
                        return (
                          <div key={entityType} className="p-3 border rounded-md space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{config.displayName}</span>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">SystemId:</span>
                                <Badge variant="outline" className="text-xs font-mono">{config.systemIdPrefix}</Badge>
                                <code className="text-xs text-blue-600">{config.systemIdPrefix}{'0'.repeat(config.digitCount - 1)}1</code>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Business ID:</span>
                                <Badge variant="secondary" className="text-xs font-mono">{config.prefix}</Badge>
                                <code className="text-xs text-green-600">{config.prefix}{'0'.repeat(config.digitCount - 1)}1</code>
                              </div>
                            </div>
                            
                            <div className="text-xs text-muted-foreground">
                              Digits: {config.digitCount}
                            </div>
                            {config.allowCustomId && (
                              <Badge variant="secondary" className="text-xs">Custom ID OK</Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Entity Detail Dialog */}
      <Dialog open={!!selectedEntity} onOpenChange={() => setSelectedEntity(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedEntity?.config.displayName}</DialogTitle>
            <DialogDescription>
              Chi tiết cấu hình và counter
            </DialogDescription>
          </DialogHeader>
          
          {selectedEntity && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Entity Type</Label>
                  <p className="font-mono text-sm">{selectedEntity.entityType}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Prefix</Label>
                  <p className="font-mono text-sm">{selectedEntity.config.prefix}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Current Counter</Label>
                  <p className="font-mono text-sm">{selectedEntity.currentCounter}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Total Items</Label>
                  <p className="text-sm">{selectedEntity.totalItems}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Next ID</Label>
                  <p className="font-mono text-sm">{selectedEntity.nextId}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Digit Count</Label>
                  <p className="font-mono text-sm">{selectedEntity.config.digitCount}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">System ID Prefix</Label>
                  <p className="font-mono text-sm">{selectedEntity.config.systemIdPrefix}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Custom ID Allowed</Label>
                  <p className="font-mono text-sm">
                    {selectedEntity.config.allowCustomId ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
              
              {selectedEntity.lastCreated && (
                <div>
                  <Label className="text-xs text-muted-foreground">Last Created ID</Label>
                  <code className="text-sm bg-muted px-2 py-1 rounded block mt-1">
                    {selectedEntity.lastCreated}
                  </code>
                </div>
              )}
              
              <div className="p-3 border rounded-md bg-muted/50">
                <p className="text-sm font-medium mb-1">Sample IDs:</p>
                <div className="space-y-1 text-xs font-mono">
                  <div>{selectedEntity.config.prefix}{String(1).padStart(selectedEntity.config.digitCount, '0')}</div>
                  <div>{selectedEntity.config.prefix}{String(100).padStart(selectedEntity.config.digitCount, '0')}</div>
                  <div>{selectedEntity.config.prefix}{String(999999).padStart(selectedEntity.config.digitCount, '0')}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
