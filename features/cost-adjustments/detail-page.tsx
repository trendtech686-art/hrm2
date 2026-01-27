'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useCostAdjustmentById, useCostAdjustmentMutations } from './hooks/use-cost-adjustments';
import { useProductFinder } from '../products/hooks/use-all-products';
import { useProductTypeFinder } from '../settings/inventory/hooks/use-all-product-types';
import { useEmployeeFinder } from '../employees/hooks/use-all-employees';
import { useAllBranches, useBranchFinder } from '../settings/branches/hooks/use-all-branches';
import { useStoreInfoData } from '../settings/store-info/hooks/use-store-info';
import { useAuth } from '../../contexts/auth-context';
import { usePageHeader } from '../../contexts/page-header-context';
import { ROUTES } from '../../lib/router';
import { asSystemId, type SystemId } from '../../lib/id-types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { DetailField } from '../../components/ui/detail-field';
import { ActivityHistory, type HistoryEntry } from '../../components/ActivityHistory';
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
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { CheckCircle, XCircle, Printer, Package, TrendingUp, TrendingDown, Eye, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/date-utils';
import { Comments } from '../../components/Comments';
import { useComments } from '@/hooks/use-comments';
import type { CostAdjustmentStatus, CostAdjustment } from '@/lib/types/prisma-extended';
import { usePrint } from '../../lib/use-print';
import { convertCostAdjustmentForPrint, mapCostAdjustmentToPrintData, mapCostAdjustmentLineItems } from '../../lib/print/cost-adjustment-print-helper';

const formatCurrency = (value: number) => value.toLocaleString('vi-VN') + ' đ';

const getStatusVariant = (status: CostAdjustmentStatus): 'default' | 'secondary' | 'success' | 'destructive' => {
  switch (status) {
    case 'draft': return 'secondary';
    case 'confirmed': return 'success';
    case 'cancelled': return 'destructive';
    default: return 'default';
  }
};

const getStatusLabel = (status: CostAdjustmentStatus): string => {
  switch (status) {
    case 'draft': return 'Nháp';
    case 'confirmed': return 'Đã xác nhận';
    case 'cancelled': return 'Đã hủy';
    default: return status;
  }
};

// Build history entries from adjustment data
function buildHistoryEntries(adjustment: CostAdjustment): HistoryEntry[] {
  const entries: HistoryEntry[] = [];
  
  // Created entry
  if (adjustment.createdAt) {
    entries.push({
      id: `${adjustment.systemId}-created`,
      action: 'created',
      timestamp: new Date(adjustment.createdAt),
      user: {
        systemId: adjustment.createdBy || '',
        name: adjustment.createdByName ?? '',
      },
      description: `Tạo phiếu điều chỉnh giá vốn với ${adjustment.items.length} sản phẩm`,
    });
  }
  
  // Confirmed entry
  if (adjustment.confirmedDate) {
    entries.push({
      id: `${adjustment.systemId}-confirmed`,
      action: 'status_changed',
      timestamp: new Date(adjustment.confirmedDate),
      user: {
        systemId: adjustment.confirmedBySystemId || '',
        name: adjustment.confirmedByName || '',
      },
      description: `Xác nhận phiếu điều chỉnh giá vốn`,
      metadata: {
        oldValue: 'Nháp',
        newValue: 'Đã xác nhận',
        field: 'Trạng thái',
      },
    });
  }
  
  // Cancelled entry
  if (adjustment.cancelledDate) {
    entries.push({
      id: `${adjustment.systemId}-cancelled`,
      action: 'cancelled',
      timestamp: new Date(adjustment.cancelledDate),
      user: {
        systemId: adjustment.cancelledBySystemId || '',
        name: adjustment.cancelledByName || '',
      },
      description: adjustment.cancelReason 
        ? `Hủy phiếu: ${adjustment.cancelReason}`
        : 'Hủy phiếu điều chỉnh giá vốn',
    });
  }
  
  // Sort by timestamp descending (newest first)
  return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function CostAdjustmentDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { setPageHeader, clearPageHeader } = usePageHeader();
  const { user } = useAuth();
  const { findById: findEmployeeById } = useEmployeeFinder();
  const { findById: findProductById } = useProductFinder();
  const { findById: findProductTypeById } = useProductTypeFinder();
  const { data: adjustment } = useCostAdjustmentById(systemId);
  const { confirm, cancel } = useCostAdjustmentMutations({
    onSuccess: () => {
      toast.success('Cập nhật thành công');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { data: branches } = useAllBranches();
  const { findById: findBranchById } = useBranchFinder();
  const { info: storeInfo } = useStoreInfoData();
  
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState('');
  const [previewImage, setPreviewImage] = React.useState<{ url: string; title: string } | null>(null);
  
  const currentEmployee = user?.employeeId ? findEmployeeById(asSystemId(user.employeeId)) : null;
  const { print } = usePrint();

  const handlePrint = React.useCallback(() => {
    if (!adjustment) return;
    
    // CostAdjustment doesn't have branchSystemId, use default branch from store
    const defaultBranch = branches.find(b => b.isDefault) || branches[0];
    const branch = defaultBranch ? findBranchById(defaultBranch.systemId) : null;
    const storeSettings = {
      name: storeInfo?.companyName || storeInfo?.brandName || '',
      address: storeInfo?.headquartersAddress || '',
      phone: storeInfo?.hotline || '',
      email: storeInfo?.email || '',
      website: storeInfo?.website,
      taxCode: storeInfo?.taxCode,
      province: storeInfo?.province,
      logo: storeInfo?.logo,
    };

    const printData = convertCostAdjustmentForPrint(adjustment, { 
      branch,
      creatorName: adjustment.createdByName ?? undefined,
    });

    print('cost-adjustment', { 
      data: mapCostAdjustmentToPrintData(printData, storeSettings), 
      lineItems: mapCostAdjustmentLineItems(printData.items) 
    });
  }, [adjustment, branches, findBranchById, storeInfo, print]);

  const getProductTypeName = React.useCallback((productTypeSystemId: SystemId) => {
    const productType = findProductTypeById(productTypeSystemId);
    return productType?.name || 'Hàng hóa';
  }, [findProductTypeById]);

  // Comments from database
  const { 
    comments: dbComments, 
    addComment: dbAddComment, 
    deleteComment: dbDeleteComment 
  } = useComments('cost_adjustment', systemId || '');

  const comments = React.useMemo(() => 
    dbComments.map(c => ({
      id: c.systemId,
      content: c.content,
      author: {
        systemId: c.createdBy || 'system',
        name: c.createdByName || 'Hệ thống',
      },
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      attachments: c.attachments,
    })), 
    [dbComments]
  );

  const handleAddComment = (content: string, attachments?: string[], _parentId?: string) => {
    dbAddComment(content, attachments || []);
  };

  const handleUpdateComment = (_commentId: string, _content: string) => {
  };

  const handleDeleteComment = (commentId: string) => {
    dbDeleteComment(commentId);
  };

  const commentCurrentUser = React.useMemo(() => ({
    systemId: currentEmployee?.systemId || 'system',
    name: currentEmployee?.fullName || 'Hệ thống',
  }), [currentEmployee]);
  
  // Totals
  const totalOldValue = adjustment?.items.reduce((sum, item) => sum + item.oldCostPrice, 0) || 0;
  const totalNewValue = adjustment?.items.reduce((sum, item) => sum + item.newCostPrice, 0) || 0;
  const totalDifference = totalNewValue - totalOldValue;
  
  const handleConfirm = async () => {
    if (!adjustment || !currentEmployee) return;
    
    try {
      await confirm.mutateAsync(adjustment.systemId);
    } catch (_error) {
      // Error handled by mutation callbacks
    }
    setConfirmDialogOpen(false);
  };
  
  const handleCancel = React.useCallback(async () => {
    if (!adjustment || !currentEmployee) return;
    
    try {
      await cancel.mutateAsync(adjustment.systemId);
    } catch (_error) {
      // Error handled by mutation callbacks
    }
    setCancelDialogOpen(false);
    setCancelReason('');
  }, [adjustment, currentEmployee, cancel]);
  

  
  const headerActions = React.useMemo(() => {
    if (!adjustment) return null;
    
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" className="h-9" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          In phiếu
        </Button>
        
        {adjustment.status === 'draft' && (
          <>
            <Button 
              variant="default" 
              className="h-9"
              onClick={() => setConfirmDialogOpen(true)}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Xác nhận
            </Button>
            <Button 
              variant="destructive" 
              className="h-9"
              onClick={() => setCancelDialogOpen(true)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Hủy phiếu
            </Button>
          </>
        )}
      </div>
    );
  }, [adjustment, handlePrint]);
  
  const breadcrumb = React.useMemo(() => {
    if (!adjustment) return [];
    return [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Điều chỉnh giá vốn', href: '/cost-adjustments' },
      { label: adjustment.id, href: '' },
    ];
  }, [adjustment]);
  
  React.useEffect(() => {
    if (adjustment) {
      setPageHeader({
        title: `Phiếu điều chỉnh ${adjustment.id}`,
        subtitle: adjustment.reason || 'Điều chỉnh giá vốn sản phẩm',
        breadcrumb,
        showBackButton: true,
        backPath: '/cost-adjustments',
        actions: headerActions,
        badge: (
          <Badge variant={getStatusVariant(adjustment.status)}>
            {getStatusLabel(adjustment.status)}
          </Badge>
        ),
      });
    }
    return () => clearPageHeader();
  }, [adjustment, setPageHeader, clearPageHeader, breadcrumb, headerActions]);
  
  if (!adjustment) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Không tìm thấy phiếu điều chỉnh</p>
        <Button variant="link" onClick={() => router.push('/cost-adjustments')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-h6">Thông tin phiếu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailField label="Mã phiếu" value={adjustment.id} />
                <DetailField label="Mã tham chiếu" value={adjustment.referenceCode || '-'} />
              </div>
              <DetailField label="Lý do điều chỉnh" value={adjustment.reason || '-'} />
            </CardContent>
          </Card>
          
          {/* Notes */}
          {adjustment.note && (
            <Card>
              <CardHeader>
                <CardTitle className="text-h6">Ghi chú</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{adjustment.note}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Timeline Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-h6">Thông tin xử lý</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailField label="Ngày tạo" value={formatDateTime(adjustment.createdDate)} />
              <DetailField label="Người tạo" value={adjustment.createdByName} />
              
              {adjustment.confirmedDate && (
                <>
                  <Separator />
                  <DetailField label="Ngày xác nhận" value={formatDateTime(adjustment.confirmedDate)} />
                  <DetailField label="Người xác nhận" value={adjustment.confirmedByName} />
                </>
              )}
              
              {adjustment.cancelledDate && (
                <>
                  <Separator />
                  <DetailField label="Ngày hủy" value={formatDateTime(adjustment.cancelledDate)} />
                  <DetailField label="Người hủy" value={adjustment.cancelledByName} />
                  {adjustment.cancelReason && (
                    <DetailField label="Lý do hủy" value={adjustment.cancelReason} />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product List - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle className="text-h6">Danh sách sản phẩm ({adjustment.items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead className="w-15">Hình ảnh</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead className="w-25">Loại SP</TableHead>
                  <TableHead className="text-right">Giá vốn cũ</TableHead>
                  <TableHead className="text-center">→</TableHead>
                  <TableHead className="text-right">Giá vốn mới</TableHead>
                  <TableHead className="text-right">Chênh lệch</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adjustment.items.map((item, index) => {
                  const product = findProductById(item.productSystemId);
                  const productTypeName = product?.productTypeSystemId 
                    ? getProductTypeName(product.productTypeSystemId)
                    : 'Hàng hóa';
                  const imageUrl = product?.thumbnailImage || product?.galleryImages?.[0] || product?.images?.[0];
                  
                  return (
                    <TableRow key={index}>
                      <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                      <TableCell>
                        {imageUrl ? (
                          <div
                            className="group/thumbnail relative w-12 h-10 rounded border overflow-hidden bg-muted cursor-pointer"
                            onClick={() => setPreviewImage({ url: imageUrl, title: item.productName })}
                          >
                            <OptimizedImage src={imageUrl} alt={item.productName} className="w-full h-full object-cover transition-all group-hover/thumbnail:brightness-75" width={48} height={40} />
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
                          href={`/products/${item.productSystemId}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {item.productName}
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.productId}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{productTypeName}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatCurrency(item.oldCostPrice)}
                      </TableCell>
                      <TableCell className="text-center">
                        <ArrowRight className="h-4 w-4 inline text-muted-foreground" />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.newCostPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {item.adjustmentAmount !== 0 && (
                            item.adjustmentAmount > 0 ? (
                              <TrendingUp className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-destructive" />
                            )
                          )}
                          <span className={`font-medium ${
                            item.adjustmentAmount > 0 ? 'text-emerald-600' : 
                            item.adjustmentAmount < 0 ? 'text-destructive' : 
                            'text-muted-foreground'
                          }`}>
                            {item.adjustmentAmount >= 0 ? '+' : ''}{formatCurrency(item.adjustmentAmount)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={`text-right ${
                        item.adjustmentPercent > 0 ? 'text-emerald-600' : 
                        item.adjustmentPercent < 0 ? 'text-destructive' : 
                        'text-muted-foreground'
                      }`}>
                        {item.adjustmentPercent >= 0 ? '+' : ''}{item.adjustmentPercent.toFixed(1)}%
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
              <p className="text-sm text-muted-foreground">
                Tổng số sản phẩm: {adjustment.items.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Tổng giá vốn cũ: {formatCurrency(totalOldValue)}
              </p>
              <p className="text-sm text-muted-foreground">
                Tổng giá vốn mới: {formatCurrency(totalNewValue)}
              </p>
              <p className={`text-lg font-bold ${
                totalDifference > 0 ? 'text-emerald-600' : 
                totalDifference < 0 ? 'text-destructive' : ''
              }`}>
                Chênh lệch: {totalDifference >= 0 ? '+' : ''}{formatCurrency(totalDifference)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments - Full Width */}
      <Comments
        entityType="cost-adjustment"
        entityId={adjustment.systemId}
        comments={comments}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        currentUser={commentCurrentUser}
        title="Bình luận"
        placeholder="Thêm bình luận về phiếu điều chỉnh giá vốn..."
      />

      {/* Activity History - Full Width */}
      <ActivityHistory
        history={buildHistoryEntries(adjustment)}
        title="Lịch sử hoạt động"
        emptyMessage="Chưa có hoạt động"
      />

      {/* Confirm Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận điều chỉnh giá vốn?</AlertDialogTitle>
            <AlertDialogDescription>
              Giá vốn của {adjustment.items.length} sản phẩm sẽ được cập nhật. 
              Các đơn hàng tạo sau sẽ sử dụng giá vốn mới.
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hủy phiếu điều chỉnh</DialogTitle>
            <DialogDescription>
              Phiếu điều chỉnh sẽ bị hủy và giá vốn sản phẩm sẽ không thay đổi.
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
              Hủy phiếu
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
