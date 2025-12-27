'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useInventoryCheckStore } from './store';
import { useProductStore } from '../products/store';
import { useProductTypeStore } from '../settings/inventory/product-type-store';
import { usePageHeader } from '../../contexts/page-header-context';
import { useBreakpoint } from '../../contexts/breakpoint-context';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Check, Pencil, XCircle, Printer } from 'lucide-react';
import { usePrint } from '../../lib/use-print';
import { 
  convertInventoryCheckForPrint,
  mapInventoryCheckToPrintData, 
  mapInventoryCheckLineItems,
  createStoreSettings,
} from '../../lib/print/inventory-check-print-helper';
import { useBranchStore } from '../settings/branches/store';
import { useStoreInfoStore } from '../settings/store-info/store-info-store';
import { formatDateCustom } from '../../lib/date-utils';
import { toast } from 'sonner';
import { SystemId, BusinessId, asSystemId } from '../../lib/id-types';
import { ActivityHistory, type HistoryEntry } from '../../components/ActivityHistory';
import { Comments, type Comment as CommentType } from '../../components/Comments';
import { InventoryCheckWorkflowCard } from './components/inventory-check-workflow-card';
import type { Subtask } from '../../components/shared/subtask-list';
import { ProductThumbnailCell } from '../../components/shared/read-only-products-table';
import { ImagePreviewDialog } from '../../components/ui/image-preview-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';

export function InventoryCheckDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { isMobile } = useBreakpoint();
  const { findById, balanceCheck, cancelCheck } = useInventoryCheckStore();
  const { findById: findProductById } = useProductStore();
  const { findById: findProductTypeById } = useProductTypeStore();
  const [showBalanceDialog, setShowBalanceDialog] = React.useState(false);

  const getProductTypeName = React.useCallback((productTypeSystemId: string) => {
    const productType = findProductTypeById(productTypeSystemId as any);
    return productType?.name || 'Hàng hóa';
  }, [findProductTypeById]);
  const [activeTab, setActiveTab] = React.useState('all');
  const [creatorName, setCreatorName] = React.useState('');
  const [balancerName, setBalancerName] = React.useState('');
  const [subtasks, setSubtasks] = React.useState<Subtask[]>([]);
  const [previewImage, setPreviewImage] = React.useState<{ url: string; title: string } | null>(null);

  // systemId from params (e.g., "INVCHECK000002")
  const check = findById(systemId as SystemId);

  // Comments state with localStorage persistence
  type CheckComment = CommentType<SystemId>;
  const [comments, setComments] = React.useState<CheckComment[]>(() => {
    const saved = localStorage.getItem(`inventory-check-comments-${systemId}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Get current employee for comments
  const [currentEmployee, setCurrentEmployee] = React.useState<{ systemId: SystemId; fullName: string; avatar?: string } | null>(null);

  React.useEffect(() => {
    if (systemId) {
      localStorage.setItem(`inventory-check-comments-${systemId}`, JSON.stringify(comments));
    }
  }, [comments, systemId]);

  const handleAddComment = (content: string, attachments?: string[], parentId?: string) => {
    const newComment: CheckComment = {
      id: asSystemId(`comment-${Date.now()}`),
      content,
      author: {
        systemId: currentEmployee?.systemId || asSystemId('system'),
        name: currentEmployee?.fullName || 'Hệ thống',
        avatar: currentEmployee?.avatar,
      },
      createdAt: new Date().toISOString(),
      attachments,
      parentId: parentId as SystemId | undefined,
    };
    setComments(prev => [...prev, newComment]);
  };

  const handleUpdateComment = (commentId: string, content: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, content, updatedAt: new Date().toISOString() } : c
    ));
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const commentCurrentUser = React.useMemo(() => ({
    systemId: currentEmployee?.systemId || asSystemId('system'),
    name: currentEmployee?.fullName || 'Hệ thống',
    avatar: currentEmployee?.avatar,
  }), [currentEmployee]);

  // Load employee names
  React.useEffect(() => {
    if (check) {
      import('../employees/store').then(({ useEmployeeStore }) => {
        const employeeStore = useEmployeeStore.getState();
        
        if (check.createdBy) {
          const creator = employeeStore.findById(check.createdBy as SystemId);
          setCreatorName(creator?.fullName || check.createdBy);
          // Set current employee for comments (use creator as fallback)
          if (!currentEmployee && creator) {
            setCurrentEmployee({ systemId: creator.systemId, fullName: creator.fullName, avatar: creator.avatar });
          }
        }
        
        if (check.balancedBy) {
          const balancer = employeeStore.findById(check.balancedBy as SystemId);
          setBalancerName(balancer?.fullName || check.balancedBy);
        }
      });
    }
  }, [check, currentEmployee]);

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

  const handleCancel = () => {
    if (!check) return;
    if (check.status !== 'draft') {
      toast.error('Chỉ có thể hủy phiếu đang ở trạng thái Nháp');
      return;
    }
    if (!confirm('Bạn có chắc muốn hủy phiếu kiểm hàng này?')) return;
    cancelCheck(check.systemId as SystemId, 'Hủy từ trang chi tiết');
    toast.success('Đã hủy phiếu kiểm hàng');
    router.push('/inventory-checks');
  };

  const { findById: findBranchById } = useBranchStore();
  const { info: storeInfo } = useStoreInfoStore();
  const { print } = usePrint(check?.branchSystemId);

  const handlePrint = React.useCallback(() => {
    if (!check) return;

    const branch = check.branchSystemId ? findBranchById(check.branchSystemId) : undefined;

    // Use helper to prepare print data
    const storeSettings = createStoreSettings(storeInfo);
    const checkForPrint = convertInventoryCheckForPrint(check, { 
      branch: branch || undefined,
      creatorName,
    });

    const printData = mapInventoryCheckToPrintData(checkForPrint, storeSettings);
    const lineItems = mapInventoryCheckLineItems(checkForPrint.items);

    print('inventory-check', {
      data: printData,
      lineItems: lineItems
    });
  }, [check, creatorName, storeInfo, print, findBranchById]);

  const headerActions = React.useMemo(() => {
    if (!check) return [];

    const btns: React.ReactNode[] = [
      <Button
        key="print"
        variant="outline"
        size="sm"
        className="h-9"
        onClick={handlePrint}
      >
        <Printer className="mr-2 h-4 w-4" />
        In phiếu
      </Button>,
      <Button
        key="edit"
        variant="outline"
        size="sm"
        className="h-9"
        onClick={() => router.push(`/inventory-checks/${check.systemId}/edit`)}
      >
        <Pencil className="mr-2 h-4 w-4" />
        Sửa
      </Button>
    ];

    if (check.status === 'draft') {
      btns.push(
        <Button
          key="balance"
          size="sm"
          className="h-9"
          onClick={() => setShowBalanceDialog(true)}
        >
          <Check className="mr-2 h-4 w-4" />
          Cân bằng
        </Button>
      );
      btns.push(
        <Button
          key="cancel"
          variant="destructive"
          size="sm"
          className="h-9"
          onClick={handleCancel}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Hủy phiếu
        </Button>
      );
    }

    return btns;
  }, [check, handleCancel, router]);

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

  const statusBadge = React.useMemo(() => {
    if (!check) return null;
    if (check.status === 'draft') {
      return <Badge variant="outline">Nháp</Badge>;
    }
    if (check.status === 'balanced') {
      return <Badge variant="secondary">Đã cân bằng</Badge>;
    }
    return <Badge variant="destructive">Đã hủy</Badge>;
  }, [check]);

  // MUST call usePageHeader before any early returns
  usePageHeader({ 
    title: check ? `Phiếu kiểm hàng ${check.id}` : 'Chi tiết phiếu kiểm hàng',
    breadcrumb,
    badge: statusBadge,
    actions: headerActions,
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
            <div className="text-h2 font-bold">{check.items.length}</div>
            <p className="text-body-xs text-muted-foreground">Tổng sản phẩm</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-h2 font-bold text-green-600">{stats.matched}</div>
            <p className="text-body-xs text-muted-foreground">Khớp</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-h2 font-bold text-red-600">{stats.different}</div>
            <p className="text-body-xs text-muted-foreground">Lệch</p>
            {stats.different > 0 && (
              <p className="text-body-xs text-muted-foreground mt-1">
                (+{positiveCount} / -{negativeCount})
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className={`text-h2 font-bold ${
              totalDifference > 0 ? 'text-orange-600' : 
              totalDifference < 0 ? 'text-red-600' : 
              'text-green-600'
            }`}>
              {totalDifference > 0 ? '+' : ''}{totalDifference}
            </div>
            <p className="text-body-xs text-muted-foreground">Tổng chênh lệch</p>
          </CardContent>
        </Card>
      </div>

      {/* Thông tin chính và Quy trình xử lý */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        {/* Thông tin phiếu - 70% */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Thông tin phiếu kiểm hàng</CardTitle>
              {statusBadge}
            </div>
          </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-body-sm text-muted-foreground">Mã phiếu</div>
              <div className="font-medium">{check.id}</div>
            </div>
            <div>
              <div className="text-body-sm text-muted-foreground">Chi nhánh</div>
              <div>{check.branchName}</div>
            </div>
            <div>
              <div className="text-body-sm text-muted-foreground">Ngày tạo</div>
              <div>{formatDateCustom(new Date(check.createdAt), 'dd/MM/yyyy HH:mm')}</div>
            </div>
            <div>
              <div className="text-body-sm text-muted-foreground">Người tạo</div>
              <div>{creatorName || check.createdBy}</div>
            </div>
            {check.balancedAt && (
              <>
                <div>
                  <div className="text-body-sm text-muted-foreground">Ngày cân bằng</div>
                  <div>{formatDateCustom(new Date(check.balancedAt), 'dd/MM/yyyy HH:mm')}</div>
                </div>
                <div>
                  <div className="text-body-sm text-muted-foreground">Người cân bằng</div>
                  <div>{balancerName || check.balancedBy}</div>
                </div>
              </>
            )}
            {check.note && (
              <div className="md:col-span-2">
                <div className="text-body-sm text-muted-foreground">Ghi chú</div>
                <div>{check.note}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

        {/* Quy trình xử lý - 30% */}
        <div className="lg:col-span-3">
          <InventoryCheckWorkflowCard
            subtasks={subtasks}
            onSubtasksChange={setSubtasks}
            readonly={check.status === 'balanced' || check.status === 'cancelled'}
          />
        </div>
      </div>

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
                  <TableHead className="w-[60px]">Ảnh</TableHead>
                  <TableHead className="min-w-[200px]">Sản phẩm</TableHead>
                  <TableHead>Vị trí kho</TableHead>
                  <TableHead>ĐVT</TableHead>
                  <TableHead className="text-right">Hệ thống</TableHead>
                  <TableHead className="text-right">Thực tế</TableHead>
                  <TableHead className="text-right">Chênh lệch</TableHead>
                  <TableHead>Lý do</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item, idx) => {
                  const product = findProductById(item.productSystemId);
                  const productTypeName = product?.productTypeSystemId 
                    ? getProductTypeName(product.productTypeSystemId)
                    : 'Hàng hóa';
                  return (
                  <TableRow key={idx}>
                    <TableCell>
                      <ProductThumbnailCell
                        productSystemId={item.productSystemId}
                        product={product}
                        productName={item.productName}
                        onPreview={(url, title) => setPreviewImage({ url, title })}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <Link href={`/products/${item.productSystemId}`}
                          className="font-medium text-primary hover:underline block"
                        >
                          {item.productName}
                        </Link>
                        <div className="flex items-center gap-1 text-body-xs text-muted-foreground">
                          <span>{productTypeName}</span>
                          <span>-</span>
                          <Link href={`/products/${item.productSystemId}`}
                            className="text-primary hover:underline"
                          >
                            {item.productId}
                          </Link>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-body-sm">
                      {product?.warehouseLocation || '-'}
                    </TableCell>
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
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredItems.map((item, idx) => {
              const product = findProductById(item.productSystemId);
              return (
              <Card key={idx}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex gap-3">
                    <ProductThumbnailCell
                      productSystemId={item.productSystemId}
                      product={product}
                      productName={item.productName}
                      onPreview={(url, title) => setPreviewImage({ url, title })}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-body-sm text-muted-foreground">
                        <Link href={`/products/${item.productSystemId}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {item.productId}
                        </Link>
                        {' '} • {item.unit}
                      </div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-body-xs">
                          {product?.productType === 'single' ? 'Đơn' : 
                           product?.productType === 'combo' ? 'Combo' : 
                           product?.productType === 'service' ? 'Dịch vụ' : '-'}
                        </Badge>
                        {product?.warehouseLocation && (
                          <span className="text-body-xs text-muted-foreground">{product.warehouseLocation}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center py-2">
                    <div>
                      <div className="text-body-xs text-muted-foreground">Hệ thống</div>
                      <div className="font-medium">{item.systemQuantity}</div>
                    </div>
                    <div>
                      <div className="text-body-xs text-muted-foreground">Thực tế</div>
                      <div className="font-medium">{item.actualQuantity}</div>
                    </div>
                    <div>
                      <div className="text-body-xs text-muted-foreground">Lệch</div>
                      <div className={`font-medium ${item.difference < 0 ? 'text-red-600' : item.difference > 0 ? 'text-green-600' : ''}`}>
                        {item.difference > 0 ? '+' : ''}{item.difference}
                      </div>
                    </div>
                  </div>

                  {item.reason && (
                    <div className="text-body-sm">
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
                    <div className="text-body-sm">
                      <span className="text-muted-foreground">Ghi chú: </span>
                      {item.note}
                    </div>
                  )}
                </CardContent>
              </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <ImagePreviewDialog 
        open={!!previewImage} 
        onOpenChange={(open) => !open && setPreviewImage(null)} 
        images={previewImage ? [previewImage.url] : []} 
        title={previewImage?.title}
      />

      {/* Comments */}
      <Comments
        entityType="inventory-check"
        entityId={check.systemId}
        comments={comments}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        currentUser={commentCurrentUser}
        title="Bình luận"
        placeholder="Thêm bình luận về phiếu kiểm hàng..."
      />

      {/* Activity History */}
      <ActivityHistory
        history={check.activityHistory || []}
        title="Lịch sử thao tác"
        emptyMessage="Chưa có lịch sử thao tác"
        showFilters={false}
        groupByDate
        maxHeight="400px"
      />

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
