/**
 * ID Counter Management Page
 * 
 * Central dashboard to view and manage ID counters for all entity types.
 * Use this to:
 * - View current counter values
 * - See next available IDs
 * - Reset counters (with confirmation)
 * - Validate ID formats
 * - Monitor ID usage statistics
 */

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Settings, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Search,
  TrendingUp,
  Hash
} from 'lucide-react';
import { toast } from 'sonner';
import {
  ID_CONFIG,
  getEntityCategories,
  validateIdFormat,
  formatCounterInfo,
  type EntityType,
  type BusinessId,
  type SystemId,
} from '@/lib/id-config';

// Import all stores to get counters
import { useEmployeeStore } from '@/features/employees/store';
import { useCustomerStore } from '@/features/customers/store';
import { useReceiptStore } from '@/features/receipts/store';
import { usePaymentStore } from '@/features/payments/store';
// ... import other stores as needed

interface CounterData {
  entityType: EntityType;
  totalItems: number;
  currentBusinessCounter: number;
  currentSystemCounter: number;
  nextBusinessId: BusinessId;
  nextSystemId: SystemId;
  displayName: string;
  prefix: string;
  systemIdPrefix: string;
  digitCount: number;
}

type CounterSource<T> = {
  entityType: EntityType;
  items: T[];
  businessIdAccessor: (item: T) => string | undefined;
  systemIdAccessor: (item: T) => string | undefined;
  counters?: { business?: number | null; system?: number | null };
};

const parseCounterFromId = (value: string | undefined, prefix: string): number => {
  if (!value || !prefix) return 0;
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const normalizedValue = trimmed.toUpperCase();
  const normalizedPrefix = prefix.toUpperCase();
  if (!normalizedValue.startsWith(normalizedPrefix)) return 0;
  const numericPart = normalizedValue.slice(normalizedPrefix.length);
  const parsed = Number.parseInt(numericPart, 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getMaxCounterFromItems = <T,>(
  items: T[],
  accessor: (item: T) => string | undefined,
  prefix: string
): number => {
  if (!items.length) return 0;
  return items.reduce((max, item) => {
    const raw = accessor(item);
    const counter = parseCounterFromId(raw, prefix);
    return counter > max ? counter : max;
  }, 0);
};

const buildCounterData = <T,>(source: CounterSource<T>): CounterData => {
  const config = ID_CONFIG[source.entityType];
  if (!config) {
    throw new Error(`Counter config missing for entity: ${source.entityType}`);
  }

  const fallbackBusinessCounter = getMaxCounterFromItems(
    source.items,
    source.businessIdAccessor,
    config.prefix
  );
  const fallbackSystemCounter = getMaxCounterFromItems(
    source.items,
    source.systemIdAccessor,
    config.systemIdPrefix
  );

  const formatted = formatCounterInfo(source.entityType, {
    business: source.counters?.business ?? fallbackBusinessCounter,
    system: source.counters?.system ?? fallbackSystemCounter,
  });

  return {
    entityType: source.entityType,
    totalItems: source.items.length,
    currentBusinessCounter: formatted.currentBusinessCounter,
    currentSystemCounter: formatted.currentSystemCounter,
    nextBusinessId: formatted.nextBusinessId,
    nextSystemId: formatted.nextSystemId,
    displayName: formatted.displayName,
    prefix: formatted.prefix,
    systemIdPrefix: formatted.systemIdPrefix,
    digitCount: formatted.digitCount,
  };
};

export function IDCounterManagementPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [resetDialog, setResetDialog] = React.useState<{ open: boolean; entity?: EntityType }>({ open: false });
  const [testId, setTestId] = React.useState('');
  const [testResult, setTestResult] = React.useState<{ valid: boolean; error?: string } | null>(null);

  // Get all counter data
  const counterData = React.useMemo((): CounterData[] => {
    const data: CounterData[] = [];

    const employeeState = useEmployeeStore.getState();
    data.push(
      buildCounterData({
        entityType: 'employees',
        items: employeeState.data,
        businessIdAccessor: (employee) => employee.id,
        systemIdAccessor: (employee) => employee.systemId,
        counters: employeeState._counters
          ? {
              business: employeeState._counters.businessId,
              system: employeeState._counters.systemId,
            }
          : undefined,
      })
    );

    const customerState = useCustomerStore.getState();
    data.push(
      buildCounterData({
        entityType: 'customers',
        items: customerState.data,
        businessIdAccessor: (customer) => customer.id,
        systemIdAccessor: (customer) => customer.systemId,
        counters: customerState._counters
          ? {
              business: customerState._counters.businessId,
              system: customerState._counters.systemId,
            }
          : undefined,
      })
    );

    const receiptState = useReceiptStore.getState();
    data.push(
      buildCounterData({
        entityType: 'receipts',
        items: receiptState.data,
        businessIdAccessor: (receipt) => (receipt.id ? String(receipt.id) : undefined),
        systemIdAccessor: (receipt) => (receipt.systemId ? String(receipt.systemId) : undefined),
      })
    );

    const paymentState = usePaymentStore.getState();
    data.push(
      buildCounterData({
        entityType: 'payments',
        items: paymentState.data,
        businessIdAccessor: (payment) => (payment.id ? String(payment.id) : undefined),
        systemIdAccessor: (payment) => (payment.systemId ? String(payment.systemId) : undefined),
        counters: {
          business: paymentState.businessIdCounter,
          system: paymentState.systemIdCounter,
        },
      })
    );

    return data;
  }, []);

  // Filter data
  const filteredData = React.useMemo(() => {
    let filtered = counterData;
    
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.prefix.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.entityType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      const categories = getEntityCategories();
      const categoryEntities = categories[selectedCategory] || [];
      filtered = filtered.filter(item => categoryEntities.includes(item.entityType));
    }
    
    return filtered;
  }, [counterData, searchQuery, selectedCategory]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const total = counterData.reduce((sum, item) => sum + item.totalItems, 0);
    const maxCounter = counterData.length
      ? Math.max(...counterData.map(item => item.currentBusinessCounter))
      : 0;
    const entitiesWithData = counterData.filter(item => item.totalItems > 0).length;
    
    return {
      totalEntities: counterData.length,
      totalItems: total,
      maxCounter,
      entitiesWithData,
    };
  }, [counterData]);

  const handleResetCounter = (entityType: EntityType) => {
    setResetDialog({ open: true, entity: entityType });
  };

  const confirmReset = () => {
    if (!resetDialog.entity) return;
    
    // TODO: Implement counter reset logic
    toast.warning('⚠️ Reset counter chưa được implement. Cần thêm API để reset counter an toàn.');
    setResetDialog({ open: false });
  };

  const handleTestId = (entityType: EntityType) => {
    if (!testId.trim()) {
      setTestResult({ valid: false, error: 'Vui lòng nhập ID để kiểm tra' });
      return;
    }
    
    const result = validateIdFormat(testId.trim(), entityType);
    setTestResult(result);
    
    if (result.valid) {
      toast.success('✅ ID hợp lệ!');
    } else {
      toast.error(`❌ ${result.error}`);
    }
  };

  const categories = getEntityCategories();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ID Counter Management</h1>
          <p className="text-muted-foreground">
            Quản lý số thứ tự và prefix cho tất cả các loại entity
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Cài đặt
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Tổng Entity Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEntities}</div>
            <p className="text-xs text-muted-foreground">{stats.entitiesWithData} có dữ liệu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tổng Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Trên tất cả entities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Counter cao nhất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.maxCounter}</div>
            <p className="text-xs text-muted-foreground">Số thứ tự lớn nhất</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Trạng thái
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="default">Hoạt động tốt</Badge>
            <p className="text-xs text-muted-foreground mt-2">Không có lỗi</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bộ lọc</CardTitle>
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
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <option value="">Tất cả</option>
                {Object.keys(categories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Counter Table */}
      <Card>
        <CardHeader>
          <CardTitle>Counter Details</CardTitle>
          <CardDescription>
            {filteredData.length} entity types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entity Type</TableHead>
                <TableHead>Prefixes</TableHead>
                <TableHead className="text-right">Business Counter</TableHead>
                <TableHead className="text-right">System Counter</TableHead>
                <TableHead className="text-right">Total Items</TableHead>
                <TableHead>Next IDs</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.entityType}>
                  <TableCell className="font-medium">{item.displayName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant="secondary">{item.prefix}</Badge>
                      <Badge variant="outline" className="font-mono text-xs">
                        {item.systemIdPrefix}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">{item.currentBusinessCounter}</TableCell>
                  <TableCell className="text-right font-mono">{item.currentSystemCounter}</TableCell>
                  <TableCell className="text-right">{item.totalItems}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {item.nextBusinessId}
                      </code>
                      <code className="text-xs bg-muted/60 px-2 py-1 rounded">
                        {item.nextSystemId}
                      </code>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleTestId(item.entityType)}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleResetCounter(item.entityType)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ID Tester */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">ID Format Tester</CardTitle>
          <CardDescription>Kiểm tra định dạng ID có hợp lệ không</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Nhập ID để test (VD: NV000001, PT000123)"
                value={testId}
                onChange={(e) => setTestId(e.target.value)}
              />
            </div>
            <Button onClick={() => handleTestId('employees')}>
              Test
            </Button>
          </div>
          
          {testResult && (
            <div className={`p-3 rounded-md border ${testResult.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2">
                {testResult.valid ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <span className={testResult.valid ? 'text-green-700' : 'text-red-700'}>
                  {testResult.valid ? '✅ ID hợp lệ' : `❌ ${testResult.error}`}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetDialog.open} onOpenChange={(open) => setResetDialog({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>⚠️ Reset Counter</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn reset counter cho <strong>{resetDialog.entity}</strong>?
              <br />
              <span className="text-red-600">
                Hành động này có thể gây xung đột ID nếu không cẩn thận!
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialog({ open: false })}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmReset}>
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
