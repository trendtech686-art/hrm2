import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInventoryCheckStore } from './store.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useBreakpoint } from '../../contexts/breakpoint-context.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs.tsx';
import { ArrowLeft, Check, Pencil, Trash2 } from 'lucide-react';
import { formatDateCustom } from '../../lib/date-utils.ts';
import { toast } from 'sonner';
import { SystemId, BusinessId } from '../../lib/id-types.ts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog.tsx';

export function InventoryCheckDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const { findById, balanceCheck, remove } = useInventoryCheckStore();
  const [showBalanceDialog, setShowBalanceDialog] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('all');
  const [creatorName, setCreatorName] = React.useState('');
  const [balancerName, setBalancerName] = React.useState('');

  // systemId from params (e.g., "INVCHECK000002")
  const check = findById(systemId as SystemId);

  // Load employee names
  React.useEffect(() => {
    if (check) {
      import('../employees/store.ts').then(({ useEmployeeStore }) => {
        const employeeStore = useEmployeeStore.getState();
        
        if (check.createdBy) {
          const creator = employeeStore.findById(check.createdBy as SystemId);
          setCreatorName(creator?.fullName || check.createdBy);
        }
        
        if (check.balancedBy) {
          const balancer = employeeStore.findById(check.balancedBy as SystemId);
          setBalancerName(balancer?.fullName || check.balancedBy);
        }
      });
    }
  }, [check]);

  const handleBalance = async () => {
    if (!check) return;
    try {
      await balanceCheck(check.systemId as SystemId);
      toast.success('Đã cân bằng phiếu kiểm hàng');
    } catch (error) {
      toast.error('Không thể cân bằng phiếu, vui lòng thử lại');
    } finally {
      setShowBalanceDialog(false);
    }
  };

  const handleDelete = () => {
    if (!check) return;
    if (check.status === 'balanced') {
      toast.error('Không thể xóa phiếu đã cân bằng');
      return;
    }
    if (!confirm('Bạn có chắc muốn xóa phiếu kiểm hàng này?')) return;
    remove(check.systemId as SystemId);
    toast.success('Đã xóa phiếu kiểm hàng');
    navigate('/inventory-checks');
  };

  const actions = React.useMemo(() => {
    if (!check) return [];
    
    const btns = [
      <Button key="back" variant="outline" onClick={() => navigate('/inventory-checks')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>
    ];

    // Sửa button - hiện cho cả draft và balanced
    btns.push(
      <Button key="edit" variant="outline" onClick={() => navigate(`/inventory-checks/${check.systemId}/edit`)}>
        <Pencil className="mr-2 h-4 w-4" />
        Sửa
      </Button>
    );

    if (check.status === 'draft') {
      btns.push(
        <Button key="balance" onClick={() => setShowBalanceDialog(true)}>
          <Check className="mr-2 h-4 w-4" />
          Cân bằng
        </Button>
      );
      btns.push(
        <Button key="delete" variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa
        </Button>
      );
    }

    return btns;
  }, [check, navigate]);

  // Breadcrumb with check id
  const breadcrumb = React.useMemo(() => [
    { label: 'Trang chủ', href: '/', isCurrent: false },
    { label: 'Kiểm hàng', href: '/inventory-checks', isCurrent: false },
    { label: check?.id || 'Chi tiết', href: '', isCurrent: true }
  ], [check]);

  // Context for page title (use business ID)
  const pageContext = React.useMemo(() => ({
    id: check?.id, // Business ID (PKK000001)
  }), [check]);

  // MUST call usePageHeader before any early returns
  usePageHeader({ 
    actions,
    breadcrumb,
    context: pageContext
  });

  // Filter items by tab
  const filteredItems = React.useMemo(() => {
    if (!check) return [];
    switch (activeTab) {
      case 'matched':
        return check.items.filter(item => item.difference === 0);
      case 'different':
        return check.items.filter(item => item.difference !== 0);
      default:
        return check.items;
    }
  }, [check, activeTab]);

  // Count stats
  const stats = React.useMemo(() => {
    if (!check) return { matched: 0, different: 0 };
    const matched = check.items.filter(item => item.difference === 0).length;
    const different = check.items.filter(item => item.difference !== 0).length;
    return { matched, different };
  }, [check]);

  const statusBadge = check ? (
    check.status === 'draft' ? (
      <Badge variant="outline">Nháp</Badge>
    ) : check.status === 'balanced' ? (
      <Badge variant="secondary">Đã cân bằng</Badge>
    ) : (
      <Badge variant="destructive">Đã hủy</Badge>
    )
  ) : null;

  // Early return AFTER all hooks
  if (!check) {
    return <div className="p-4">Không tìm thấy phiếu kiểm hàng</div>;
  }

  // Calculate total difference
  const totalDifference = check.items.reduce((sum, item) => sum + item.difference, 0);
  const positiveCount = check.items.filter(item => item.difference > 0).length;
  const negativeCount = check.items.filter(item => item.difference < 0).length;

  return (
    <div className="space-y-4">
      {/* Dashboard Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{check.items.length}</div>
            <p className="text-xs text-muted-foreground">Tổng sản phẩm</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.matched}</div>
            <p className="text-xs text-muted-foreground">Khớp</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.different}</div>
            <p className="text-xs text-muted-foreground">Lệch</p>
            {stats.different > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                (+{positiveCount} / -{negativeCount})
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className={`text-2xl font-bold ${
              totalDifference > 0 ? 'text-orange-600' : 
              totalDifference < 0 ? 'text-red-600' : 
              'text-green-600'
            }`}>
              {totalDifference > 0 ? '+' : ''}{totalDifference}
            </div>
            <p className="text-xs text-muted-foreground">Tổng chênh lệch</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Thông tin phiếu kiểm hàng</CardTitle>
            {statusBadge}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Mã phiếu</div>
              <div className="font-medium">{check.id}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Chi nhánh</div>
              <div>{check.branchName}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Ngày tạo</div>
              <div>{formatDateCustom(new Date(check.createdAt), 'dd/MM/yyyy HH:mm')}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Người tạo</div>
              <div>{creatorName || check.createdBy}</div>
            </div>
            {check.balancedAt && (
              <>
                <div>
                  <div className="text-sm text-muted-foreground">Ngày cân bằng</div>
                  <div>{formatDateCustom(new Date(check.balancedAt), 'dd/MM/yyyy HH:mm')}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Người cân bằng</div>
                  <div>{balancerName || check.balancedBy}</div>
                </div>
              </>
            )}
            {check.note && (
              <div className="md:col-span-2">
                <div className="text-sm text-muted-foreground">Ghi chú</div>
                <div>{check.note}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chi tiết hàng hóa</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Tất cả ({check.items.length})</TabsTrigger>
              <TabsTrigger value="matched">Khớp ({stats.matched})</TabsTrigger>
              <TabsTrigger value="different">Lệch ({stats.different})</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Desktop Table */}
          <div className="hidden md:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã SP</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>ĐVT</TableHead>
                  <TableHead className="text-right">Hệ thống</TableHead>
                  <TableHead className="text-right">Thực tế</TableHead>
                  <TableHead className="text-right">Chênh lệch</TableHead>
                  <TableHead>Lý do</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <button
                        onClick={() => navigate(`/products/${item.productSystemId}`)}
                        className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
                      >
                        {item.productId}
                      </button>
                    </TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell className="text-right">{item.systemQuantity}</TableCell>
                    <TableCell className="text-right">{item.actualQuantity}</TableCell>
                    <TableCell className="text-right">
                      <span className={item.difference < 0 ? 'text-red-600' : item.difference > 0 ? 'text-green-600' : ''}>
                        {item.difference > 0 ? '+' : ''}{item.difference}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.reason === 'damaged' ? 'Hư Hỏng' : 
                       item.reason === 'wear' ? 'Hao Mòn' :
                       item.reason === 'return' ? 'Trả Hàng' :
                       item.reason === 'transfer' ? 'Chuyển Hàng' :
                       item.reason === 'production' ? 'Sản Xuất' :
                       item.reason === 'other' ? 'Khác' : ''}
                    </TableCell>
                    <TableCell>{item.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredItems.map((item, idx) => (
              <Card key={idx}>
                <CardContent className="pt-4 space-y-2">
                  <div>
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-sm text-muted-foreground">
                      <button
                        onClick={() => navigate(`/products/${item.productSystemId}`)}
                        className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
                      >
                        {item.productId}
                      </button>
                      {' '} • {item.unit}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center py-2">
                    <div>
                      <div className="text-xs text-muted-foreground">Hệ thống</div>
                      <div className="font-medium">{item.systemQuantity}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Thực tế</div>
                      <div className="font-medium">{item.actualQuantity}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Lệch</div>
                      <div className={`font-medium ${item.difference < 0 ? 'text-red-600' : item.difference > 0 ? 'text-green-600' : ''}`}>
                        {item.difference > 0 ? '+' : ''}{item.difference}
                      </div>
                    </div>
                  </div>

                  {item.reason && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Lý do: </span>
                      <span className="font-medium">
                        {item.reason === 'damaged' ? 'Hư Hỏng' : 
                         item.reason === 'wear' ? 'Hao Mòn' :
                         item.reason === 'return' ? 'Trả Hàng' :
                         item.reason === 'transfer' ? 'Chuyển Hàng' :
                         item.reason === 'production' ? 'Sản Xuất' :
                         item.reason === 'other' ? 'Khác' : ''}
                      </span>
                    </div>
                  )}

                  {item.note && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Ghi chú: </span>
                      {item.note}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showBalanceDialog} onOpenChange={setShowBalanceDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận cân bằng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn cân bằng phiếu kiểm hàng này? Hành động này sẽ cập nhật số lượng tồn kho và không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleBalance}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
