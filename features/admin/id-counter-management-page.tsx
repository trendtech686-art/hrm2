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
  type EntityType 
} from '@/lib/id-config';

// Import all stores to get counters
import { useEmployeeStore } from '@/features/employees/store';
import { useCustomerStore } from '@/features/customers/store';
import { useReceiptStore } from '@/features/receipts/store';
import { usePaymentStore } from '@/features/payments/store';
import { useComplaintStore } from '@/features/complaints/store';
import { useWarrantyStore } from '@/features/warranty/store';
// ... import other stores as needed

interface CounterData {
  entityType: EntityType;
  currentCounter: number;
  totalItems: number;
  nextId: string;
  displayName: string;
  prefix: string;
}

export function IDCounterManagementPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [resetDialog, setResetDialog] = React.useState<{ open: boolean; entity?: EntityType }>({ open: false });
  const [testId, setTestId] = React.useState('');
  const [testResult, setTestResult] = React.useState<{ valid: boolean; error?: string } | null>(null);

  // Get all counter data
  const counterData = React.useMemo((): CounterData[] => {
    const data: CounterData[] = [];
    
    // Example for employees
    const employeeStore = useEmployeeStore.getState();
    const employeeConfig = ID_CONFIG['employees'];
    data.push({
      entityType: 'employees',
      currentCounter: (employeeStore as any).businessIdCounter || 0,
      totalItems: employeeStore.data.length,
      nextId: `${employeeConfig.prefix}${String(((employeeStore as any).businessIdCounter || 0) + 1).padStart(employeeConfig.digitCount, '0')}`,
      displayName: employeeConfig.displayName,
      prefix: employeeConfig.prefix,
    });

    // Example for receipts
    const receiptStore = useReceiptStore.getState();
    const receiptConfig = ID_CONFIG['voucher-receipt'];
    
    data.push({
      entityType: 'voucher-receipt',
      currentCounter: (receiptStore as any).businessIdCounter || 0,
      totalItems: receiptStore.data.length,
      nextId: `${receiptConfig.prefix}${String(((receiptStore as any).businessIdCounter || 0) + 1).padStart(receiptConfig.digitCount, '0')}`,
      displayName: receiptConfig.displayName,
      prefix: receiptConfig.prefix,
    });
    
    // Example for payments
    const paymentStore = usePaymentStore.getState();
    const paymentConfig = ID_CONFIG['voucher-payment'];
    
    data.push({
      entityType: 'voucher-payment',
      currentCounter: (paymentStore as any).businessIdCounter || 0,
      totalItems: paymentStore.data.length,
      nextId: `${paymentConfig.prefix}${String(((paymentStore as any).businessIdCounter || 0) + 1).padStart(paymentConfig.digitCount, '0')}`,
      displayName: paymentConfig.displayName,
      prefix: paymentConfig.prefix,
    });

    // Add more entities as needed...
    
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
    const maxCounter = Math.max(...counterData.map(item => item.currentCounter));
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
    
    const result = validateIdFormat(entityType, testId.trim());
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
                <TableHead>Prefix</TableHead>
                <TableHead className="text-right">Counter</TableHead>
                <TableHead className="text-right">Total Items</TableHead>
                <TableHead>Next ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.entityType}>
                  <TableCell className="font-medium">{item.displayName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.prefix}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">{item.currentCounter}</TableCell>
                  <TableCell className="text-right">{item.totalItems}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{item.nextId}</code>
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
