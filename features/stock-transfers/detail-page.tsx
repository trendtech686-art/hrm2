'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useStockTransfer, useStockTransferMutations } from './hooks/use-stock-transfers';
import { useBranchFinder } from '../settings/branches/hooks/use-all-branches';
import { useProductFinder } from '../products/hooks/use-all-products';
import { useProductTypeFinder } from '../settings/inventory/hooks/use-all-product-types';
import { useEmployeeFinder } from '../employees/hooks/use-all-employees';
import { usePrint } from '../../lib/use-print';
import { 
  convertStockTransferForPrint,
  mapStockTransferToPrintData, 
  mapStockTransferLineItems,
  createStoreSettings
} from '../../lib/print/stock-transfer-print-helper';
import { useStoreInfoData } from '../settings/store-info/hooks/use-store-info';
import { useAuth } from '../../contexts/auth-context';
import { usePageHeader } from '../../contexts/page-header-context';
import { useBreakpoint } from '../../contexts/breakpoint-context';
import { ROUTES } from '../../lib/router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { DetailField } from '../../components/ui/detail-field';
import { EntityActivityTable } from '@/components/shared/entity-activity-table';
import { DetailPageShell, mobileBleedCardClass } from '@/components/layout/page-section';
import { MobileCard, MobileCardBody, MobileCardHeader } from '@/components/mobile/mobile-card';
import { ImagePreviewDialog } from '../../components/ui/image-preview-dialog';
import { OptimizedImage } from '../../components/ui/optimized-image';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '../../components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { ArrowRight, Truck, Package, CheckCircle, XCircle, Printer, Edit, Eye, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { toast } from 'sonner';
import { asSystemId, type SystemId } from '../../lib/id-types';
import { Comments, type Comment as CommentType } from '../../components/Comments';
import { formatDateTime } from '@/lib/date-utils';
import { StockTransferWorkflowCard } from './components/stock-transfer-workflow-card';
import type { Subtask } from '../../components/shared/subtask-list';
import type { StockTransferStatus } from '@/lib/types/prisma-extended';
import { useComments } from '../../hooks/use-comments';

const formatCurrency = (value: number) => value.toLocaleString('vi-VN') + ' đ';

const getStatusVariant = (status: StockTransferStatus): 'default' | 'secondary' | 'success' | 'destructive' | 'outline' => {
  switch (status) {
    case 'pending': return 'secondary';
    case 'transferring': return 'default';
    case 'completed': return 'success';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
};

const getStatusLabel = (status: StockTransferStatus): string => {
  switch (status) {
    case 'pending': return 'Chờ chuyển';
    case 'transferring': return 'Đang chuyển';
    case 'completed': return 'Hoàn thành';
    case 'cancelled': return 'Đã hủy';
    default: return status;
  }
};

export function StockTransferDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  
  // Note: transfer fetched later after hooks setup
  const { start: startMutation, complete: completeMutation, cancel: cancelMutation } = useStockTransferMutations({
    onStartSuccess: () => {
      toast.success('Đã xác nhận xuất kho');
      setConfirmTransferOpen(false);
    },
    onCompleteSuccess: () => {
      toast.success('Đã xác nhận nhận kho');
      setConfirmReceiveOpen(false);
    },
    onCancelSuccess: () => {
      toast.success('Đã hủy phiếu chuyển kho');
      setCancelDialogOpen(false);
      router.push('/stock-transfers');
    },
    onError: (error) => {
      toast.error('Lỗi', { description: error.message });
    }
  });
  
  const confirmTransfer = React.useCallback((systemId: string) => {
    startMutation.mutate(systemId);
  }, [startMutation]);
  
  const confirmReceive = React.useCallback((systemId: string, items?: { productSystemId: string; receivedQuantity: number }[]) => {
    completeMutation.mutate({ systemId, receivedItems: items });
  }, [completeMutation]);
  
  const cancelTransfer = React.useCallback((systemId: string, reason: string) => {
    cancelMutation.mutate({ systemId, reason });
  }, [cancelMutation]);
  
  const { findById: findProductById } = useProductFinder();
  const { findById: findProductTypeById } = useProductTypeFinder();
  const { findById: findEmployeeById } = useEmployeeFinder();
  const { user, can, isAdmin } = useAuth();
  const { isMobile } = useBreakpoint();
  const { setPageHeader, clearPageHeader } = usePageHeader();

  const [confirmTransferOpen, setConfirmTransferOpen] = React.useState(false);
  const [confirmReceiveOpen, setConfirmReceiveOpen] = React.useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState('');
  const [receiveItems, setReceiveItems] = React.useState<{ productSystemId: SystemId; receivedQuantity: number }[]>([]);
  const [subtasks, setSubtasks] = React.useState<Subtask[]>([]);
  const [previewImage, setPreviewImage] = React.useState<{ url: string; title: string } | null>(null);

  const { data: transfer } = useStockTransfer(asSystemId(systemId || ''));
  const { update: _updateTransfer } = useStockTransferMutations({});

  const { findById: findBranchById } = useBranchFinder();
  const { info: storeInfo } = useStoreInfoData();
  const { print } = usePrint(transfer?.fromBranchSystemId);

  const handlePrint = React.useCallback(() => {
    if (!transfer) return;

    const fromBranch = findBranchById(transfer.fromBranchSystemId);
    const toBranch = findBranchById(transfer.toBranchSystemId);
    const storeSettings = createStoreSettings(storeInfo);
    
    const transferForPrint = convertStockTransferForPrint(transfer, {
      fromBranch,
      toBranch,
    });

    print('stock-transfer', {
      data: mapStockTransferToPrintData(transferForPrint, storeSettings),
      lineItems: mapStockTransferLineItems(transferForPrint.items),
    });
  }, [transfer, findBranchById, storeInfo, print]);

  const getProductTypeName = React.useCallback((productTypeSystemId: SystemId) => {
    const productType = findProductTypeById(productTypeSystemId);
    return productType?.name || 'Hàng hóa';
  }, [findProductTypeById]);

  // ✅ Sử dụng useComments hook thay vì localStorage trực tiếp
  const { 
    comments: dbComments, 
    addComment: dbAddComment, 
    deleteComment: dbDeleteComment,
    updateComment: dbUpdateComment,
  } = useComments('stock_transfer', systemId || '');
  
  type TransferComment = CommentType<SystemId>;
  const comments = React.useMemo<TransferComment[]>(() => 
    dbComments.map(c => ({
      id: asSystemId(c.systemId),
      content: c.content,
      author: {
        systemId: asSystemId(c.createdBy || 'system'),
        name: c.createdByName || 'Hệ thống',
      },
      createdAt: new Date(c.createdAt),
      updatedAt: c.updatedAt ? new Date(c.updatedAt) : undefined,
      attachments: c.attachments,
    })), 
    [dbComments]
  );

  const currentEmployee = React.useMemo(() => {
    if (!user?.employeeId) return null;
    return findEmployeeById(asSystemId(user.employeeId));
  }, [user, findEmployeeById]);

  const handleAddComment = (content: string, attachments?: string[], _parentId?: string) => {
    dbAddComment(content, attachments || []);
  };

  const handleUpdateComment = (commentId: string, content: string) => {
    dbUpdateComment(commentId, content);
  };

  const handleDeleteComment = (commentId: string) => {
    dbDeleteComment(commentId);
  };

  const commentCurrentUser = React.useMemo(() => ({
    systemId: currentEmployee?.systemId || asSystemId('system'),
    name: currentEmployee?.fullName || 'Hệ thống',
  }), [currentEmployee]);

  // Header actions based on status
  const headerActions = React.useMemo(() => {
    if (!transfer) return null;

    // Determine if can edit: pending/transferring = limited, completed = very limited
    const canEdit = transfer.status !== 'cancelled' && (isAdmin || can('edit_stock_transfers'));

    return (
      <div className="flex items-center gap-2">
        {transfer.status === 'pending' && (
          <>
            <Button variant="destructive" onClick={() => setCancelDialogOpen(true)}>
              <XCircle className="mr-2 h-4 w-4" />
              Hủy
            </Button>
            <Button onClick={() => setConfirmTransferOpen(true)}>
              <Truck className="mr-2 h-4 w-4" />
              Chuyển hàng khỏi kho
            </Button>
          </>
        )}
        
        {transfer.status === 'transferring' && (
          <>
            <Button variant="destructive" onClick={() => setCancelDialogOpen(true)}>
              <XCircle className="mr-2 h-4 w-4" />
              Hủy
            </Button>
            <Button onClick={() => setConfirmReceiveOpen(true)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Nhận hàng vào kho
            </Button>
          </>
        )}

        <Button variant="outline" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          In phiếu
        </Button>
        
        {canEdit && (
          <Button variant="outline" onClick={() => router.push(`/stock-transfers/${transfer.systemId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Sửa
          </Button>
        )}
      </div>
    );
  }, [transfer, router, handlePrint, isAdmin, can]);

  // Mobile: gom tất cả actions vào dropdown
  const mobileHeaderActions = React.useMemo(() => {
    if (!transfer || !isMobile) return null;
    const canEdit = transfer.status !== 'cancelled' && (isAdmin || can('edit_stock_transfers'));

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {transfer.status === 'pending' && (
            <>
              <DropdownMenuItem onClick={() => setConfirmTransferOpen(true)}>
                <Truck className="mr-2 h-4 w-4" />
                Chuyển hàng khỏi kho
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setCancelDialogOpen(true)}>
                <XCircle className="mr-2 h-4 w-4" />
                Hủy
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {transfer.status === 'transferring' && (
            <>
              <DropdownMenuItem onClick={() => setConfirmReceiveOpen(true)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Nhận hàng vào kho
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setCancelDialogOpen(true)}>
                <XCircle className="mr-2 h-4 w-4" />
                Hủy
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            In phiếu
          </DropdownMenuItem>
          {canEdit && (
            <DropdownMenuItem onClick={() => router.push(`/stock-transfers/${transfer.systemId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Sửa
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }, [transfer, isMobile, router, handlePrint, isAdmin, can]);

  // Breadcrumb
  const breadcrumb = React.useMemo(() => {
    if (!transfer) return [];
    return [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Chuyển kho', href: ROUTES.INVENTORY.STOCK_TRANSFERS },
      { label: transfer.id, href: '' },
    ];
  }, [transfer]);

  React.useEffect(() => {
    if (transfer) {
      setPageHeader({
        title: `Phiếu chuyển kho ${transfer.id}`,
        breadcrumb,
        showBackButton: true,
        backPath: ROUTES.INVENTORY.STOCK_TRANSFERS,
        actions: isMobile ? mobileHeaderActions : headerActions,
        badge: (
          <Badge variant={getStatusVariant(transfer.status)}>
            {getStatusLabel(transfer.status)}
          </Badge>
        ),
      });
      
      // Initialize receive items
      setReceiveItems(transfer.items.map(item => ({
        productSystemId: item.productSystemId,
        receivedQuantity: item.quantity,
      })));
    }
    return () => clearPageHeader();
  }, [transfer, setPageHeader, clearPageHeader, breadcrumb, headerActions, isMobile, mobileHeaderActions]);

  if (!transfer) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-h3 font-semibold">Không tìm thấy phiếu chuyển kho</h2>
        <Button variant="link" onClick={() => router.push('/stock-transfers')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const handleConfirmTransfer = () => {
    if (!currentEmployee) {
      toast.error('Không tìm thấy thông tin nhân viên');
      return;
    }

    confirmTransfer(transfer.systemId);
    toast.success('Đã xác nhận chuyển hàng khỏi kho');
    setConfirmTransferOpen(false);
  };

  const handleConfirmReceive = () => {
    if (!currentEmployee) {
      toast.error('Không tìm thấy thông tin nhân viên');
      return;
    }

    confirmReceive(transfer.systemId, receiveItems);
    toast.success('Đã xác nhận nhận hàng vào kho');
    setConfirmReceiveOpen(false);
  };

  const handleCancel = () => {
    if (!currentEmployee) {
      toast.error('Không tìm thấy thông tin nhân viên');
      return;
    }

    cancelTransfer(transfer.systemId, cancelReason);
    toast.success('Đã hủy phiếu chuyển kho');
    setCancelDialogOpen(false);
    setCancelReason('');
  };

  const totalQuantity = transfer.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalReceived = transfer.items.reduce((sum, item) => sum + (item.receivedQuantity || 0), 0);
  
  // Calculate total value using product cost prices
  const totalValue = transfer.items.reduce((sum, item) => {
    const product = findProductById(item.productSystemId);
    const unitPrice = product?.costPrice || 0;
    return sum + (item.quantity * unitPrice);
  }, 0);

  return (
    <DetailPageShell gap="lg">
      {/* Row 1: 3 columns - Thông tin chuyển kho + Thông tin xử lý + Quy trình */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Thông tin chuyển kho */}
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <CardTitle size="lg">Thông tin chuyển kho</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField label="Mã phiếu" value={transfer.id} />
            <DetailField label="Mã tham chiếu" value={transfer.referenceCode || '-'} />
            <Separator />
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Chi nhánh chuyển</p>
                <p className="font-medium">{transfer.fromBranchName}</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Chi nhánh nhận</p>
                <p className="font-medium">{transfer.toBranchName}</p>
              </div>
            </div>
            {transfer.note && (
              <>
                <Separator />
                <DetailField label="Ghi chú" value={transfer.note} />
              </>
            )}
          </CardContent>
        </Card>

        {/* Column 2: Thông tin xử lý */}
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <CardTitle size="lg">Thông tin xử lý</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField label="Ngày tạo" value={formatDateTime(transfer.createdDate)} />
            <DetailField label="Người tạo" value={transfer.createdByName} />
            
            {transfer.transferredDate && (
              <>
                <Separator />
                <DetailField label="Ngày chuyển" value={formatDateTime(transfer.transferredDate)} />
                <DetailField label="Người chuyển" value={transfer.transferredByName} />
              </>
            )}
            
            {transfer.receivedDate && (
              <>
                <Separator />
                <DetailField label="Ngày nhận" value={formatDateTime(transfer.receivedDate)} />
                <DetailField label="Người nhận" value={transfer.receivedByName} />
              </>
            )}
            
            {transfer.cancelledDate && (
              <>
                <Separator />
                <DetailField label="Ngày hủy" value={formatDateTime(transfer.cancelledDate)} />
                <DetailField label="Người hủy" value={transfer.cancelledByName} />
                {transfer.cancelReason && (
                  <DetailField label="Lý do hủy" value={transfer.cancelReason} />
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Column 3: Quy trình xử lý */}
        <StockTransferWorkflowCard
          subtasks={subtasks}
          onSubtasksChange={setSubtasks}
          readonly={transfer.status === 'completed' || transfer.status === 'cancelled'}
        />
      </div>

      {/* Product List - Full Width */}
      <Card className={mobileBleedCardClass}>
            <CardHeader>
              <CardTitle size="lg">Danh sách sản phẩm ({transfer.items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead className="w-15">Hình ảnh</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="w-25">Loại SP</TableHead>
                      <TableHead className="text-center">SL chuyển</TableHead>
                      {transfer.status === 'completed' && (
                        <TableHead className="text-center">SL nhận</TableHead>
                      )}
                      <TableHead className="text-center">
                        <div className="flex flex-col">
                          <span>{transfer.fromBranchName}</span>
                          <span className="text-xs font-normal text-muted-foreground">(Trước → Sau)</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex flex-col">
                          <span>{transfer.toBranchName}</span>
                          <span className="text-xs font-normal text-muted-foreground">(Trước → Sau)</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Đơn giá</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                      <TableHead>Ghi chú</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transfer.items.map((item, index) => {
                      const product = findProductById(item.productSystemId);
                      const productTypeName = product?.productTypeSystemId 
                        ? getProductTypeName(product.productTypeSystemId)
                        : 'Hàng hóa';
                      const imageUrl = product?.thumbnailImage || product?.galleryImages?.[0] || product?.images?.[0];
                      const currentFromStock = product?.inventoryByBranch?.[transfer.fromBranchSystemId] || 0;
                      const currentToStock = product?.inventoryByBranch?.[transfer.toBranchSystemId] || 0;
                      const unitPrice = product?.costPrice || 0;
                      const lineTotal = item.quantity * unitPrice;
                      
                      // Calculate before/after based on status
                      const receivedQty = item.receivedQuantity ?? item.quantity;
                      let fromBefore: number, fromAfter: number, toBefore: number, toAfter: number;
                      
                      if (transfer.status === 'completed') {
                        // Already transferred: current is "after", calculate "before"
                        fromAfter = currentFromStock;
                        fromBefore = currentFromStock + item.quantity;
                        toAfter = currentToStock;
                        toBefore = currentToStock - receivedQty;
                      } else if (transfer.status === 'transferring') {
                        // In transit: from is "after", to is "before"
                        fromAfter = currentFromStock;
                        fromBefore = currentFromStock + item.quantity;
                        toBefore = currentToStock;
                        toAfter = currentToStock + item.quantity;
                      } else {
                        // Pending or cancelled: current is "before"
                        fromBefore = currentFromStock;
                        fromAfter = currentFromStock - item.quantity;
                        toBefore = currentToStock;
                        toAfter = currentToStock + item.quantity;
                      }
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                          <TableCell>
                            {imageUrl ? (
                              <div
                                className="group/thumbnail relative w-12 h-10 rounded border overflow-hidden bg-muted cursor-pointer"
                                onClick={() => setPreviewImage({ url: imageUrl, title: item.productName })}
                                onKeyDown={(e) => { if (e.key === 'Enter') setPreviewImage({ url: imageUrl, title: item.productName }); }}
                                role="button"
                                tabIndex={0}
                              >
                                <OptimizedImage src={imageUrl} alt={item.productName} className="w-full h-full object-cover transition-all group-hover/thumbnail:brightness-75" width={48} height={40} />
                                <div className="absolute inset-0 flex items-center justify-center md:opacity-0 md:group-hover/thumbnail:opacity-100 transition-opacity">
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
                            <Link href={`/products/${item.productSystemId}`}
                              className="font-medium text-primary hover:underline"
                            >
                              {item.productName}
                            </Link>
                            <p className="text-sm text-muted-foreground">{item.productId}</p>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{productTypeName}</TableCell>
                          <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                          {transfer.status === 'completed' && (
                            <TableCell className="text-center font-medium">
                              {receivedQty}
                            </TableCell>
                          )}
                          <TableCell className="text-center">
                            <span className="text-muted-foreground">{fromBefore}</span>
                            <span className="mx-1">?</span>
                            <span className="font-medium text-red-600">{fromAfter}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-muted-foreground">{toBefore}</span>
                            <span className="mx-1">?</span>
                            <span className="font-medium text-green-600">{toAfter}</span>
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatCurrency(unitPrice)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(lineTotal)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.note || '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile: card stack */}
              <div className="md:hidden space-y-3">
                {transfer.items.map((item, index) => {
                  const product = findProductById(item.productSystemId);
                  const productTypeName = product?.productTypeSystemId
                    ? getProductTypeName(product.productTypeSystemId)
                    : 'Hàng hóa';
                  const imageUrl = product?.thumbnailImage || product?.galleryImages?.[0] || product?.images?.[0];
                  const currentFromStock = product?.inventoryByBranch?.[transfer.fromBranchSystemId] || 0;
                  const currentToStock = product?.inventoryByBranch?.[transfer.toBranchSystemId] || 0;
                  const unitPrice = product?.costPrice || 0;
                  const lineTotal = item.quantity * unitPrice;
                  const receivedQty = item.receivedQuantity ?? item.quantity;
                  let fromBefore: number, fromAfter: number, toBefore: number, toAfter: number;

                  if (transfer.status === 'completed') {
                    fromAfter = currentFromStock;
                    fromBefore = currentFromStock + item.quantity;
                    toAfter = currentToStock;
                    toBefore = currentToStock - receivedQty;
                  } else if (transfer.status === 'transferring') {
                    fromAfter = currentFromStock;
                    fromBefore = currentFromStock + item.quantity;
                    toBefore = currentToStock;
                    toAfter = currentToStock + item.quantity;
                  } else {
                    fromBefore = currentFromStock;
                    fromAfter = currentFromStock - item.quantity;
                    toBefore = currentToStock;
                    toAfter = currentToStock + item.quantity;
                  }

                  return (
                    <MobileCard key={index} inert>
                      <MobileCardHeader className="items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          {imageUrl ? (
                            <button
                              type="button"
                              className="shrink-0 w-12 h-12 rounded border overflow-hidden bg-muted"
                              onClick={() => setPreviewImage({ url: imageUrl, title: item.productName })}
                            >
                              <OptimizedImage src={imageUrl} alt={item.productName} className="w-full h-full object-cover" width={48} height={48} />
                            </button>
                          ) : (
                            <div className="shrink-0 w-12 h-12 bg-muted rounded flex items-center justify-center">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-xs text-muted-foreground">#{index + 1}</div>
                            <Link
                              href={`/products/${item.productSystemId}`}
                              className="mt-0.5 block text-sm font-semibold text-primary hover:underline line-clamp-2"
                            >
                              {item.productName}
                            </Link>
                            <p className="mt-0.5 text-xs text-muted-foreground truncate">{item.productId}</p>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-xs uppercase tracking-wide text-muted-foreground">SL chuyển</div>
                          <div className="mt-0.5 text-sm font-semibold">{item.quantity}</div>
                          {transfer.status === 'completed' && (
                            <div className="mt-1 text-xs text-muted-foreground">Nhận: {receivedQty}</div>
                          )}
                        </div>
                      </MobileCardHeader>
                      <MobileCardBody>
                        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                          <div>
                            <dt className="text-xs text-muted-foreground">Loại SP</dt>
                            <dd className="font-medium truncate">{productTypeName}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-muted-foreground">Đơn giá</dt>
                            <dd className="font-medium">{formatCurrency(unitPrice)}</dd>
                          </div>
                          <div className="col-span-2">
                            <dt className="text-xs text-muted-foreground">
                              {transfer.fromBranchName} (Trước → Sau)
                            </dt>
                            <dd className="font-medium">
                              <span className="text-muted-foreground">{fromBefore}</span>
                              <span className="mx-1">→</span>
                              <span className="text-red-600">{fromAfter}</span>
                            </dd>
                          </div>
                          <div className="col-span-2">
                            <dt className="text-xs text-muted-foreground">
                              {transfer.toBranchName} (Trước → Sau)
                            </dt>
                            <dd className="font-medium">
                              <span className="text-muted-foreground">{toBefore}</span>
                              <span className="mx-1">→</span>
                              <span className="text-green-600">{toAfter}</span>
                            </dd>
                          </div>
                          <div className="col-span-2">
                            <dt className="text-xs text-muted-foreground">Thành tiền</dt>
                            <dd className="font-semibold">{formatCurrency(lineTotal)}</dd>
                          </div>
                        </dl>
                        {item.note && (
                          <p className="mt-3 text-xs italic text-muted-foreground">• {item.note}</p>
                        )}
                      </MobileCardBody>
                    </MobileCard>
                  );
                })}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-end">
                <div className="text-right space-y-1">
                  <p className="text-sm text-muted-foreground">Tổng số lượng chuyển: {totalQuantity}</p>
                  {transfer.status === 'completed' && totalReceived !== totalQuantity && (
                    <p className="text-sm text-muted-foreground">
                      Đã nhận: {totalReceived}
                    </p>
                  )}
                  <p className="text-h3 font-bold">Tổng giá trị: {formatCurrency(totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

      {/* Comments - Full Width */}
      <Comments
        entityType="stock-transfer"
        entityId={transfer.systemId}
        comments={comments}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        currentUser={commentCurrentUser}
        title="Bình luận"
        placeholder="Thêm bình luận về phiếu chuyển kho..."
      />

      {/* Activity History - Full Width */}
      <EntityActivityTable entityType="stock_transfer" entityId={systemId} />

      {/* Confirm Transfer Dialog */}
      <AlertDialog open={confirmTransferOpen} onOpenChange={setConfirmTransferOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận chuyển hàng khỏi kho?</AlertDialogTitle>
            <AlertDialogDescription>
              Hệ thống sẽ trừ tồn kho tại chi nhánh <strong>{transfer.fromBranchName}</strong> và 
              ghi nhận hàng đang về tại chi nhánh <strong>{transfer.toBranchName}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTransfer}>
              Xác nhận chuyển
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm Receive Dialog */}
      <Dialog open={confirmReceiveOpen} onOpenChange={setConfirmReceiveOpen}>
        <DialogContent mobileFullScreen className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Xác nhận nhận hàng vào kho</DialogTitle>
            <DialogDescription>
              Nhập số lượng thực tế nhận được cho từng sản phẩm
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-x-auto max-h-100">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead className="text-center w-25">SL chuyển</TableHead>
                  <TableHead className="text-center w-30">SL nhận</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfer.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">{item.productId}</p>
                    </TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        max={item.quantity}
                        value={receiveItems.find(r => r.productSystemId === item.productSystemId)?.receivedQuantity ?? item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          setReceiveItems(prev => prev.map(r => 
                            r.productSystemId === item.productSystemId 
                              ? { ...r, receivedQuantity: Math.min(value, item.quantity) }
                              : r
                          ));
                        }}
                        className="h-9 w-full text-center"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmReceiveOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmReceive}>
              Xác nhận nhận hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hủy phiếu chuyển kho?</DialogTitle>
            <DialogDescription>
              {transfer.status === 'transferring' 
                ? 'Hệ thống sẽ hoàn lại tồn kho về chi nhánh chuyển.'
                : 'Phiếu chuyển kho sẽ bị hủy.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2">
            <Label>Lý do hủy</Label>
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Nhập lý do hủy phiếu..."
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Đóng
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Xác nhận hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImagePreviewDialog
        images={previewImage ? [previewImage.url] : []}
        open={!!previewImage}
        onOpenChange={(open) => !open && setPreviewImage(null)}
        title={previewImage?.title}
      />
    </DetailPageShell>
  );
}
