'use client'

import * as React from 'react';
import { Link, useLocation, useNavigate, useParams } from '@/lib/next-compat';
import { useStockTransferStore } from './store';
import { ProductImage, useProductImage } from '../products/components/product-image';
import { useBranchStore } from '../settings/branches/store';
import { useProductStore } from '../products/store';
import { useProductTypeStore } from '../settings/inventory/product-type-store';
import { useEmployeeStore } from '../employees/store';
import { usePrint } from '../../lib/use-print';
import { 
  convertStockTransferForPrint,
  mapStockTransferToPrintData, 
  mapStockTransferLineItems,
  createStoreSettings
} from '../../lib/print/stock-transfer-print-helper';
import { useStoreInfoStore } from '../settings/store-info/store-info-store';
import { useAuth } from '../../contexts/auth-context';
import { usePageHeader } from '../../contexts/page-header-context';
import { ROUTES, generatePath } from '../../lib/router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { DetailField } from '../../components/ui/detail-field';
import { ActivityHistory, type HistoryEntry } from '../../components/ActivityHistory';
import { ImagePreviewDialog } from '../../components/ui/image-preview-dialog';
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
import { ArrowRight, Truck, Package, CheckCircle, XCircle, Printer, Edit, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { asSystemId, type SystemId } from '../../lib/id-types';
import { Comments, type Comment as CommentType } from '../../components/Comments';
import { formatDate, formatDateTime } from '@/lib/date-utils';
import { StockTransferWorkflowCard } from './components/stock-transfer-workflow-card';
import type { Subtask } from '../../components/shared/subtask-list';
import type { StockTransferStatus, StockTransferItem, StockTransfer } from './types';

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

// Build history entries from transfer data
function buildHistoryEntries(transfer: StockTransfer): HistoryEntry[] {
  const entries: HistoryEntry[] = [];
  
  // Created entry
  if (transfer.createdDate) {
    entries.push({
      id: `${transfer.systemId}-created`,
      action: 'created',
      timestamp: new Date(transfer.createdDate),
      user: {
        systemId: transfer.createdBy || '',
        name: transfer.createdByName,
      },
      description: `Tạo phiếu chuyển kho với ${transfer.items.length} sản phẩm`,
    });
  }
  
  // Transferred entry
  if (transfer.transferredDate) {
    entries.push({
      id: `${transfer.systemId}-transferred`,
      action: 'status_changed',
      timestamp: new Date(transfer.transferredDate),
      user: {
        systemId: transfer.transferredBySystemId || '',
        name: transfer.transferredByName || '',
      },
      description: 'Xác nhận xuất kho, đang chuyển hàng',
      metadata: {
        oldValue: 'Chờ chuyển',
        newValue: 'Đang chuyển',
        field: 'Trạng thái',
      },
    });
  }
  
  // Received entry
  if (transfer.receivedDate) {
    entries.push({
      id: `${transfer.systemId}-received`,
      action: 'status_changed',
      timestamp: new Date(transfer.receivedDate),
      user: {
        systemId: transfer.receivedBySystemId || '',
        name: transfer.receivedByName || '',
      },
      description: 'Xác nhận nhận hàng hoàn thành',
      metadata: {
        oldValue: 'Đang chuyển',
        newValue: 'Hoàn thành',
        field: 'Trạng thái',
      },
    });
  }
  
  // Cancelled entry
  if (transfer.cancelledDate) {
    entries.push({
      id: `${transfer.systemId}-cancelled`,
      action: 'cancelled',
      timestamp: new Date(transfer.cancelledDate),
      user: {
        systemId: transfer.cancelledBySystemId || '',
        name: transfer.cancelledByName || '',
      },
      description: transfer.cancelReason 
        ? `Hủy phiếu: ${transfer.cancelReason}`
        : 'Hủy phiếu chuyển kho',
    });
  }
  
  // Sort by timestamp descending (newest first)
  return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function StockTransferDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const { findById, confirmTransfer, confirmReceive, cancelTransfer } = useStockTransferStore();
  const { findById: findProductById } = useProductStore();
  const { findById: findProductTypeById } = useProductTypeStore();
  const { findById: findEmployeeById } = useEmployeeStore();
  const { user } = useAuth();
  const { setPageHeader, clearPageHeader } = usePageHeader();

  const [confirmTransferOpen, setConfirmTransferOpen] = React.useState(false);
  const [confirmReceiveOpen, setConfirmReceiveOpen] = React.useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState('');
  const [receiveItems, setReceiveItems] = React.useState<{ productSystemId: SystemId; receivedQuantity: number }[]>([]);
  const [subtasks, setSubtasks] = React.useState<Subtask[]>([]);
  const [previewImage, setPreviewImage] = React.useState<{ url: string; title: string } | null>(null);

  const transfer = findById(asSystemId(systemId || ''));

  const { findById: findBranchById } = useBranchStore();
  const { info: storeInfo } = useStoreInfoStore();
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

  // Comments state with localStorage persistence
  type TransferComment = CommentType<SystemId>;
  const [comments, setComments] = React.useState<TransferComment[]>(() => {
    const saved = localStorage.getItem(`stock-transfer-comments-${systemId}`);
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    if (systemId) {
      localStorage.setItem(`stock-transfer-comments-${systemId}`, JSON.stringify(comments));
    }
  }, [comments, systemId]);

  const currentEmployee = React.useMemo(() => {
    if (!user?.employeeId) return null;
    return findEmployeeById(asSystemId(user.employeeId));
  }, [user, findEmployeeById]);

  const handleAddComment = (content: string, parentId?: string) => {
    const newComment: TransferComment = {
      id: asSystemId(`comment-${Date.now()}`),
      content,
      author: {
        systemId: currentEmployee?.systemId || asSystemId('system'),
        name: currentEmployee?.fullName || 'Hệ thống',
      },
      createdAt: new Date(),
      parentId: parentId as SystemId | undefined,
    };
    setComments(prev => [...prev, newComment]);
  };

  const handleUpdateComment = (commentId: string, content: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, content, updatedAt: new Date() } : c
    ));
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const commentCurrentUser = React.useMemo(() => ({
    systemId: currentEmployee?.systemId || asSystemId('system'),
    name: currentEmployee?.fullName || 'Hệ thống',
  }), [currentEmployee]);

  // Header actions based on status
  const headerActions = React.useMemo(() => {
    if (!transfer) return null;

    // Determine if can edit: pending/transferring = limited, completed = very limited
    const canEdit = transfer.status !== 'cancelled';

    return (
      <div className="flex items-center gap-2">
        {transfer.status === 'pending' && (
          <>
            <Button variant="destructive" className="h-9" onClick={() => setCancelDialogOpen(true)}>
              <XCircle className="mr-2 h-4 w-4" />
              Hủy
            </Button>
            <Button className="h-9" onClick={() => setConfirmTransferOpen(true)}>
              <Truck className="mr-2 h-4 w-4" />
              Chuyển hàng khỏi kho
            </Button>
          </>
        )}
        
        {transfer.status === 'transferring' && (
          <>
            <Button variant="destructive" className="h-9" onClick={() => setCancelDialogOpen(true)}>
              <XCircle className="mr-2 h-4 w-4" />
              Hủy
            </Button>
            <Button className="h-9" onClick={() => setConfirmReceiveOpen(true)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Nhận hàng vào kho
            </Button>
          </>
        )}

        <Button variant="outline" className="h-9" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          In phiếu
        </Button>
        
        {canEdit && (
          <Button variant="outline" className="h-9" onClick={() => navigate(`/stock-transfers/${transfer.systemId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Sửa
          </Button>
        )}
      </div>
    );
  }, [transfer, navigate]);

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
        actions: headerActions,
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
  }, [transfer, setPageHeader, clearPageHeader, breadcrumb, headerActions]);

  if (!transfer) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-h3 font-semibold">Không tìm thấy phiếu chuyển kho</h2>
        <Button variant="link" onClick={() => navigate('/stock-transfers')}>
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

    const success = confirmTransfer(transfer.systemId, currentEmployee.systemId);
    if (success) {
      toast.success('Đã xác nhận chuyển hàng khỏi kho');
    } else {
      toast.error('Không thể xác nhận chuyển hàng');
    }
    setConfirmTransferOpen(false);
  };

  const handleConfirmReceive = () => {
    if (!currentEmployee) {
      toast.error('Không tìm thấy thông tin nhân viên');
      return;
    }

    const success = confirmReceive(transfer.systemId, currentEmployee.systemId, receiveItems);
    if (success) {
      toast.success('Đã xác nhận nhận hàng vào kho');
    } else {
      toast.error('Không thể xác nhận nhận hàng');
    }
    setConfirmReceiveOpen(false);
  };

  const handleCancel = () => {
    if (!currentEmployee) {
      toast.error('Không tìm thấy thông tin nhân viên');
      return;
    }

    const success = cancelTransfer(transfer.systemId, currentEmployee.systemId, cancelReason);
    if (success) {
      toast.success('Đã hủy phiếu chuyển kho');
    } else {
      toast.error('Không thể hủy phiếu chuyển kho');
    }
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
    <div className="space-y-6">
      {/* Row 1: 3 columns - Thông tin chuyển kho + Thông tin xử lý + Quy trình */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Thông tin chuyển kho */}
        <Card>
          <CardHeader>
            <CardTitle className="text-h3">Thông tin chuyển kho</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField label="Mã phiếu" value={transfer.id} />
            <DetailField label="Mã tham chiếu" value={transfer.referenceCode || '-'} />
            <Separator />
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-body-xs text-muted-foreground mb-1">Chi nhánh chuyển</p>
                <p className="font-medium">{transfer.fromBranchName}</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-body-xs text-muted-foreground mb-1">Chi nhánh nhận</p>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-h3">Thông tin xử lý</CardTitle>
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
      <Card>
            <CardHeader>
              <CardTitle className="text-h3">Danh sách sản phẩm ({transfer.items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead className="w-[60px]">Hình ảnh</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="w-[100px]">Loại SP</TableHead>
                      <TableHead className="text-center">SL chuyển</TableHead>
                      {transfer.status === 'completed' && (
                        <TableHead className="text-center">SL nhận</TableHead>
                      )}
                      <TableHead className="text-center">CN Chuyển (Trước → Sau)</TableHead>
                      <TableHead className="text-center">CN Nhận (Trước → Sau)</TableHead>
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
                              >
                                <img src={imageUrl} alt={item.productName} className="w-full h-full object-cover transition-all group-hover/thumbnail:brightness-75" />
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
                            <Link 
                              to={`/products/${item.productSystemId}`}
                              className="font-medium text-primary hover:underline"
                            >
                              {item.productName}
                            </Link>
                            <p className="text-body-sm text-muted-foreground">{item.productId}</p>
                          </TableCell>
                          <TableCell className="text-body-sm text-muted-foreground">{productTypeName}</TableCell>
                          <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                          {transfer.status === 'completed' && (
                            <TableCell className="text-center font-medium">
                              {receivedQty}
                            </TableCell>
                          )}
                          <TableCell className="text-center">
                            <span className="text-muted-foreground">{fromBefore}</span>
                            <span className="mx-1">→</span>
                            <span className="font-medium text-red-600">{fromAfter}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-muted-foreground">{toBefore}</span>
                            <span className="mx-1">→</span>
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
              
              <Separator className="my-4" />
              
              <div className="flex justify-end">
                <div className="text-right space-y-1">
                  <p className="text-body-sm text-muted-foreground">Tổng số lượng chuyển: {totalQuantity}</p>
                  {transfer.status === 'completed' && totalReceived !== totalQuantity && (
                    <p className="text-body-sm text-muted-foreground">
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
      <ActivityHistory
        history={buildHistoryEntries(transfer)}
        title="Lịch sử hoạt động"
        emptyMessage="Chưa có hoạt động"
      />

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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Xác nhận nhận hàng vào kho</DialogTitle>
            <DialogDescription>
              Nhập số lượng thực tế nhận được cho từng sản phẩm
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-x-auto max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead className="text-center w-[100px]">SL chuyển</TableHead>
                  <TableHead className="text-center w-[120px]">SL nhận</TableHead>
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
            <Button variant="outline" className="h-9" onClick={() => setConfirmReceiveOpen(false)}>
              Hủy
            </Button>
            <Button className="h-9" onClick={handleConfirmReceive}>
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
            <Button variant="outline" className="h-9" onClick={() => setCancelDialogOpen(false)}>
              Đóng
            </Button>
            <Button variant="destructive" className="h-9" onClick={handleCancel}>
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
    </div>
  );
}
