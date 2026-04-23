'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useInventoryCheck, useInventoryCheckMutations } from './hooks/use-inventory-checks';
// ⚡ OPTIMIZED: Removed useProductFinder, useProductTypeFinder - data comes from API
// ⚡ OPTIMIZED: Removed useBranchFinder - branches fetched lazily in print handler
import { useAuth } from '@/contexts/auth-context';
import { usePageHeader } from '../../contexts/page-header-context';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs } from '../../components/ui/tabs';
import { MobileTabsList, MobileTabsTrigger, mobileBleedCardClass } from '@/components/layout/page-section';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Check, Pencil, XCircle, Printer, Copy, Package, Eye, MoreHorizontal } from 'lucide-react';
import { usePrint } from '../../lib/use-print';
import { 
  convertInventoryCheckForPrint,
  mapInventoryCheckToPrintData, 
  mapInventoryCheckLineItems,
  createStoreSettings,
} from '../../lib/print/inventory-check-print-helper';
import { fetchPrintData } from '@/lib/lazy-print-data';
import { OptimizedImage } from '../../components/ui/optimized-image';
import { formatDateCustom } from '../../lib/date-utils';
import { toast } from 'sonner';
import { type SystemId, asSystemId } from '../../lib/id-types';
import { EntityActivityTable } from '@/components/shared/entity-activity-table';
import { DetailPageShell } from '@/components/layout/page-section';
import { Comments } from '../../components/Comments';
import { useComments } from '@/hooks/use-comments';
import { InventoryCheckWorkflowCard } from './components/inventory-check-workflow-card';
import type { Subtask } from '../../components/shared/subtask-list';
import { ImagePreviewDialog } from '../../components/ui/image-preview-dialog';
import { useBreakpoint } from '@/contexts/breakpoint-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
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
  const { data: check, isLoading } = useInventoryCheck(systemId);
  const { balance: balanceMutation, cancel: cancelMutation } = useInventoryCheckMutations({
    onBalanceSuccess: () => {
      toast.success('Đã cân bằng phiếu kiểm kê');
      setShowBalanceDialog(false);
      router.refresh();
    },
    onCancelSuccess: () => {
      toast.success('Đã hủy phiếu kiểm kê');
      setShowCancelDialog(false);
      router.push('/inventory-checks');
    },
    onError: (err) => toast.error(err.message)
  });
  // ⚡ OPTIMIZED: Removed useProductFinder, useProductTypeFinder - all data comes from API
  const { employee: authEmployee, can, isAdmin } = useAuth();
  const { isMobile } = useBreakpoint();
  const [showBalanceDialog, setShowBalanceDialog] = React.useState(false);
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);

  const [activeTab, setActiveTab] = React.useState('all');
  const [subtasks, setSubtasks] = React.useState<Subtask[]>([]);
  const [previewImage, setPreviewImage] = React.useState<{ url: string; title: string } | null>(null);
  
  // Pagination state for items list
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(20);
  const itemsPerPageOptions = [10, 20, 50, 100];

  // Get employee names from API data
  const creatorName = (check as unknown as Record<string, unknown>)?.createdByName as string || check?.createdBy || '';
  const balancerName = (check as unknown as Record<string, unknown>)?.balancedByName as string || check?.balancedBy || '';

  // Comments from database
  const { 
    comments: dbComments, 
    addComment: dbAddComment, 
    deleteComment: dbDeleteComment 
  } = useComments('inventory_check', systemId || '');

  const comments = React.useMemo(() => 
    dbComments.map(c => ({
      id: c.systemId as unknown as SystemId,
      content: c.content,
      author: {
        systemId: (c.createdBy || 'system') as unknown as SystemId,
        name: c.createdByName || 'Hệ thống',
        avatar: undefined,
      },
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      attachments: c.attachments,
    })), 
    [dbComments]
  );

  // Current employee for comments (from auth)
  const currentEmployee = authEmployee
    ? { systemId: authEmployee.systemId, fullName: authEmployee.fullName, avatar: undefined }
    : null;

  const handleAddComment = (content: string, attachments?: string[], _parentId?: string) => {
    dbAddComment(content, attachments || []);
  };

  const handleUpdateComment = (_commentId: string, _content: string) => {
  };

  const handleDeleteComment = (commentId: string) => {
    dbDeleteComment(commentId);
  };

  const commentCurrentUser = React.useMemo(() => ({
    systemId: currentEmployee?.systemId || asSystemId('system'),
    name: currentEmployee?.fullName || 'Hệ thống',
    avatar: currentEmployee?.avatar,
  }), [currentEmployee]);

  const handleBalance = async () => {
    if (!check) return;
    // ✅ Pass employee systemId, not name - action needs ID for StockHistory
    const balancedBy = currentEmployee?.systemId || 'SYSTEM';
    balanceMutation.mutate({ systemId: check.systemId, balancedBy });
    setShowBalanceDialog(false);
  };

  const handleCancel = React.useCallback(() => {
    if (!check) return;
    if (check.status?.toLowerCase() !== 'draft') {
      toast.error('Chỉ có thể hủy phiếu đang ở trạng thái Nháp');
      return;
    }
    setShowCancelDialog(true);
  }, [check]);

  const confirmCancel = React.useCallback(() => {
    if (!check) return;
    cancelMutation.mutate(check.systemId);
  }, [check, cancelMutation]);

  // Handle duplicate - navigate to new form with pre-filled data
  const handleDuplicate = React.useCallback(() => {
    if (!check) return;
    // Store check data in sessionStorage for the new form to pick up
    const duplicateData = {
      // ✅ Include source check info for display
      sourceCheckId: check.systemId,
      sourceCheckCode: check.id,
      branchSystemId: check.branchSystemId,
      note: check.note,
      items: check.items.map(item => {
        // Get productImage from API response
        const itemAny = item as typeof item & { productImage?: string };
        return {
          productSystemId: item.productSystemId,
          productId: item.productId,
          productName: item.productName,
          unit: item.unit,
          // ✅ Don't copy old systemQuantity - will be recalculated
          systemQuantity: 0, 
          actualQuantity: 0,
          difference: 0,
          reason: item.reason || 'other', // ✅ Default to 'other'
          note: item.note,
          // ✅ Copy product image
          thumbnailImage: itemAny.productImage || undefined,
        };
      }),
    };
    sessionStorage.setItem('inventoryCheckDuplicate', JSON.stringify(duplicateData));
    toast.success('Đã sao chép phiếu kiểm kê');
    router.push('/inventory-checks/new?duplicate=true');
  }, [check, router]);

  // ⚡ OPTIMIZED: Defer print template loading until print is clicked
  const { print } = usePrint({ enabled: false });

  // ⚡ OPTIMIZED: Lazy load print data and branches only when print is clicked
  const handlePrint = React.useCallback(async () => {
    if (!check) return;

    // Fetch print data and branches in parallel
    const [{ storeInfo }, branchesRes] = await Promise.all([
      fetchPrintData(),
      check.branchSystemId 
        ? fetch(`/api/branches/${check.branchSystemId}`).then(r => r.json()).catch(() => null)
        : Promise.resolve(null)
    ]);
    
    const branch = branchesRes?.data || branchesRes;

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
  }, [check, creatorName, print]);

  const headerActions = React.useMemo(() => {
    if (!check) return [];

    const btns: React.ReactNode[] = [
      <Button
        key="duplicate"
        variant="outline"
        size="sm"
        className="h-9"
        onClick={handleDuplicate}
        title="Sao chép phiếu kiểm kê"
      >
        <Copy className="mr-2 h-4 w-4" />
        Sao chép
      </Button>,
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
    ];

    if (isAdmin || can('edit_inventory_checks')) {
      btns.push(
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
      );
    }

    if (check.status?.toLowerCase() === 'draft') {
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
  }, [check, handleCancel, router, handlePrint, handleDuplicate]);

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
    const status = check.status?.toLowerCase();
    if (status === 'draft') {
      return <Badge variant="outline">Nháp</Badge>;
    }
    if (status === 'balanced' || status === 'completed') {
      return <Badge variant="secondary">Đã cân bằng</Badge>;
    }
    if (status === 'in_progress' || status === 'pending') {
      return <Badge variant="default">Đang xử lý</Badge>;
    }
    if (status === 'cancelled') {
      return <Badge variant="destructive">Đã hủy</Badge>;
    }
    return <Badge variant="outline">{check.status}</Badge>;
  }, [check]);

  const mobileHeaderActions = React.useMemo(() => {
    if (!isMobile || !check) return [];
    return [
      <DropdownMenu key="mobile-actions">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Sao chép
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            In phiếu
          </DropdownMenuItem>
          {(isAdmin || can('edit_inventory_checks')) && (
            <DropdownMenuItem onClick={() => router.push(`/inventory-checks/${check.systemId}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Sửa
            </DropdownMenuItem>
          )}
          {check.status?.toLowerCase() === 'draft' && (
            <>
              <DropdownMenuItem onClick={() => setShowBalanceDialog(true)}>
                <Check className="mr-2 h-4 w-4" />
                Cân bằng
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCancel} className="text-destructive">
                <XCircle className="mr-2 h-4 w-4" />
                Hủy phiếu
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>,
    ];
  }, [isMobile, check, handleDuplicate, handlePrint, handleCancel, isAdmin, can, router]);

  // MUST call usePageHeader before any early returns
  usePageHeader({ 
    title: check ? `Phiếu kiểm hàng ${check.id}` : 'Chi tiết phiếu kiểm hàng',
    breadcrumb,
    badge: statusBadge,
    actions: isMobile ? mobileHeaderActions : headerActions,
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

  // Paginated items
  const paginatedItems = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Reset to page 1 when tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Count stats
  const stats = React.useMemo(() => {
    if (!check) return { matched: 0, different: 0 };
    const matched = check.items.filter(item => item.difference === 0).length;
    const different = check.items.filter(item => item.difference !== 0).length;
    return { matched, different };
  }, [check]);

  // Early return AFTER all hooks
  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (!check) {
    return <div className="p-4">Không tìm thấy phiếu kiểm hàng</div>;
  }

  // Calculate total difference
  const totalDifference = check.items.reduce((sum, item) => sum + item.difference, 0);
  const positiveCount = check.items.filter(item => item.difference > 0).length;
  const negativeCount = check.items.filter(item => item.difference < 0).length;

  return (
    <DetailPageShell gap="md">
      {/* Dashboard Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={mobileBleedCardClass}>
          <CardContent className="pt-6">
            <div className="text-h2 font-bold">{check.items.length}</div>
            <p className="text-xs text-muted-foreground">Tổng sản phẩm</p>
          </CardContent>
        </Card>
        <Card className={mobileBleedCardClass}>
          <CardContent className="pt-6">
            <div className="text-h2 font-bold text-green-600">{stats.matched}</div>
            <p className="text-xs text-muted-foreground">Khớp</p>
          </CardContent>
        </Card>
        <Card className={mobileBleedCardClass}>
          <CardContent className="pt-6">
            <div className="text-h2 font-bold text-red-600">{stats.different}</div>
            <p className="text-xs text-muted-foreground">Lệch</p>
            {stats.different > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                (+{positiveCount} / -{negativeCount})
              </p>
            )}
          </CardContent>
        </Card>
        <Card className={mobileBleedCardClass}>
          <CardContent className="pt-6">
            <div className={`text-h2 font-bold ${
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

      {/* Thông tin chính và Quy trình xử lý */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        {/* Thông tin phiếu - 70% */}
        <Card className={cn("lg:col-span-7", mobileBleedCardClass)}>
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
              <div>{check.createdAt ? formatDateCustom(new Date(check.createdAt), 'dd/MM/yyyy HH:mm') : ''}</div>
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

        {/* Quy trình xử lý - 30% - Chỉ cho phép đánh dấu hoàn thành, không thêm/sửa/xóa */}
        <div className="lg:col-span-3">
          <InventoryCheckWorkflowCard
            subtasks={subtasks}
            onSubtasksChange={setSubtasks}
            readonly={true}
          />
        </div>
      </div>

      <Card className={mobileBleedCardClass}>
        <CardHeader>
          <CardTitle>Chi tiết hàng hóa</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <MobileTabsList>
              <MobileTabsTrigger value="all">Tất cả ({check.items.length})</MobileTabsTrigger>
              <MobileTabsTrigger value="matched">Khớp ({stats.matched})</MobileTabsTrigger>
              <MobileTabsTrigger value="different">Lệch ({stats.different})</MobileTabsTrigger>
            </MobileTabsList>
          </Tabs>

          {/* Desktop Table */}
          <div className="hidden md:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Ảnh</TableHead>
                  <TableHead className="min-w-50">Sản phẩm</TableHead>
                  <TableHead>Vị trí kho</TableHead>
                  <TableHead className="text-right">Hệ thống</TableHead>
                  <TableHead className="text-right">Thực tế</TableHead>
                  <TableHead className="text-right">Chênh lệch</TableHead>
                  <TableHead>Lý do</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map((item, idx) => {
                  const globalIndex = (currentPage - 1) * itemsPerPage + idx;
                  // Get image from API response (productImage field)
                  const itemAny = item as typeof item & { productImage?: string };
                  const imageUrl = itemAny.productImage;
                  
                  return (
                  <TableRow key={globalIndex}>
                    <TableCell>
                      {imageUrl ? (
                        <div
                          className="group/thumbnail relative w-12 h-10 rounded border overflow-hidden bg-muted cursor-pointer"
                          onClick={() => setPreviewImage({ url: imageUrl, title: item.productName })}
                        >
                          <OptimizedImage 
                            src={imageUrl} 
                            alt={item.productName} 
                            className="w-full h-full object-cover transition-all group-hover/thumbnail:brightness-75" 
                            width={48} 
                            height={40} 
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumbnail:opacity-100 transition-opacity">
                            <Eye className="w-4 h-4 text-white drop-shadow-md" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-12 h-10 bg-muted rounded flex items-center justify-center">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-medium">{item.productName}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>Hàng hóa</span>
                          <span>-</span>
                          <Link 
                            href={`/products/${item.productSystemId}`}
                            className="text-primary hover:underline font-medium"
                          >
                            {item.productId}
                          </Link>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">-</TableCell>
                    <TableCell className="text-right">{item.systemQuantity ?? '-'}</TableCell>
                    <TableCell className="text-right">{item.actualQuantity ?? '-'}</TableCell>
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
            {paginatedItems.map((item, idx) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + idx;
              const itemAny = item as typeof item & { productImage?: string };
              const imageUrl = itemAny.productImage;
              
              return (
              <Card key={globalIndex}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex gap-3">
                    {imageUrl ? (
                      <div
                        className="group/thumbnail relative w-12 h-10 rounded border overflow-hidden bg-muted cursor-pointer shrink-0"
                        onClick={() => setPreviewImage({ url: imageUrl, title: item.productName })}
                      >
                        <OptimizedImage 
                          src={imageUrl} 
                          alt={item.productName} 
                          className="w-full h-full object-cover" 
                          width={48} 
                          height={40} 
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-10 bg-muted rounded flex items-center justify-center shrink-0">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.productName}</div>
                      <div className="text-sm text-muted-foreground">
                        <Link href={`/products/${item.productSystemId}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {item.productId}
                        </Link>
                      </div>
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
              );
            })}
          </div>

          {/* Pagination */}
          {filteredItems.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t mt-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredItems.length)} / {filteredItems.length} sản phẩm
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Số dòng:</span>
                  <Select
                    value={String(itemsPerPage)}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 w-17">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {itemsPerPageOptions.map(opt => (
                        <SelectItem key={opt} value={String(opt)}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        className="w-9"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
              </div>
              )}
            </div>
          )}
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
      <EntityActivityTable entityType="inventory_check" entityId={systemId} />

      {/* Dialog xác nhận cân bằng */}
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

      {/* Dialog xác nhận hủy phiếu */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy phiếu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn hủy phiếu kiểm hàng {check?.id}? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Đóng</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hủy phiếu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DetailPageShell>
  );
}
