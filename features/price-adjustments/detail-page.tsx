'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { usePriceAdjustment, usePriceAdjustmentMutations } from './hooks/use-price-adjustments';
import { useAllBranches, useBranchFinder } from '../settings/branches/hooks/use-all-branches';
import { useStoreInfoData } from '../settings/store-info/hooks/use-store-info';
import { useAuth } from '../../contexts/auth-context';
import { usePageHeader } from '../../contexts/page-header-context';
import { ROUTES } from '../../lib/router';
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
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { CheckCircle, XCircle, Printer, Pencil, TrendingUp, TrendingDown, ArrowRight, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductThumbnailCell } from '../../components/shared/read-only-products-table';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/date-utils';
import { Comments } from '../../components/Comments';
import { useComments } from '@/hooks/use-comments';
import type { PriceAdjustmentStatus, PriceAdjustment } from './types';
import { usePrint } from '../../lib/use-print';
import { 
  convertPriceAdjustmentForPrint, 
  mapPriceAdjustmentToPrintData, 
  mapPriceAdjustmentLineItems 
} from '../../lib/print/price-adjustment-print-helper';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useProductFinder } from '../products/hooks/use-all-products';
import { useEmployeeFinder } from '../employees/hooks/use-all-employees';
import { asSystemId } from '../../lib/id-types';

const formatCurrency = (value: number | undefined | null) => {
  if (value == null || isNaN(value)) return '0 đ';
  return value.toLocaleString('vi-VN') + ' đ';
};

const getStatusVariant = (status: PriceAdjustmentStatus): 'default' | 'secondary' | 'success' | 'destructive' => {
  const s = status?.toLowerCase?.() || status;
  switch (s) {
    case 'draft': return 'secondary';
    case 'confirmed': return 'success';
    case 'cancelled': return 'destructive';
    default: return 'default';
  }
};

const getStatusLabel = (status: PriceAdjustmentStatus): string => {
  const s = (status?.toLowerCase?.() || status) as string;
  const labels: Record<string, string> = {
    draft: 'Nháp',
    confirmed: 'Đã xác nhận',
    cancelled: 'Đã hủy',
  };
  return labels[s] || status;
};

// Build history entries from adjustment data
function buildHistoryEntries(adjustment: PriceAdjustment): HistoryEntry[] {
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
      description: `Tạo phiếu điều chỉnh giá bán với ${adjustment.items?.length || 0} sản phẩm`,
    });
  }
  
  // Confirmed entry
  if (adjustment.confirmedDate) {
    entries.push({
      id: `${adjustment.systemId}-confirmed`,
      action: 'status_changed',
      timestamp: new Date(adjustment.confirmedDate),
      user: {
        systemId: adjustment.confirmedBy || '',
        name: adjustment.confirmedByName || '',
      },
      description: `Xác nhận phiếu điều chỉnh giá bán`,
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
        systemId: adjustment.cancelledBy || '',
        name: adjustment.cancelledByName || '',
      },
      description: adjustment.cancelReason 
        ? `Hủy phiếu: ${adjustment.cancelReason}`
        : 'Hủy phiếu điều chỉnh giá bán',
    });
  }
  
  // Sort by timestamp descending (newest first)
  return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// Items per page options
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function PriceAdjustmentDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { setPageHeader, clearPageHeader } = usePageHeader();
  const { user } = useAuth();
  const { findById: findEmployeeById } = useEmployeeFinder();
  const { findById: findProductById } = useProductFinder();
  const { data: adjustment, isLoading } = usePriceAdjustment(systemId);
  const { confirm, cancel } = usePriceAdjustmentMutations();
  const { data: branches } = useAllBranches();
  const { findById: findBranchById } = useBranchFinder();
  const { info: storeInfo } = useStoreInfoData();
  
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState('');
  const [previewImage, setPreviewImage] = React.useState<{ url: string; title: string } | null>(null);
  
  // Pagination state for items
  const [itemsPage, setItemsPage] = React.useState(1);
  const [itemsPageSize, setItemsPageSize] = React.useState(20);
  
  const currentEmployee = user?.employeeId ? findEmployeeById(asSystemId(user.employeeId)) : null;
  const { print } = usePrint();

  const handlePrint = React.useCallback(() => {
    if (!adjustment) return;
    
    const defaultBranch = branches.find(b => b.isDefault) || branches[0];
    const branch = defaultBranch ? findBranchById(defaultBranch.systemId) : null;
    const storeSettings = {
      name: storeInfo?.companyName || storeInfo?.brandName || '',
      address: storeInfo?.headquartersAddress || '',
      phone: storeInfo?.hotline || '',
      email: storeInfo?.email || '',
      website: storeInfo?.website,
      taxCode: storeInfo?.taxCode,
      logo: storeInfo?.logo,
    };

    const printData = convertPriceAdjustmentForPrint(adjustment, { 
      branch,
      creatorName: adjustment.createdByName ?? undefined,
    });

    print('price-adjustment', { 
      data: mapPriceAdjustmentToPrintData(printData, storeSettings), 
      lineItems: mapPriceAdjustmentLineItems(printData.items) 
    });
  }, [adjustment, branches, findBranchById, storeInfo, print]);

  const handleCopy = React.useCallback(() => {
    if (!adjustment) return;
    
    // Create a new adjustment from this one
    router.push(`/price-adjustments/new?copyFrom=${adjustment.systemId}`);
  }, [adjustment, router]);

  // Comments from database
  const { 
    comments: dbComments, 
    addComment: dbAddComment, 
    deleteComment: dbDeleteComment 
  } = useComments('price_adjustment', systemId || '');

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
  const items = adjustment?.items || [];
  const totalOldValue = items.reduce((sum, item) => sum + (item.oldPrice || 0), 0);
  const totalNewValue = items.reduce((sum, item) => sum + (item.newPrice || 0), 0);
  const totalDifference = totalNewValue - totalOldValue;
  
  // Pagination for items
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPageSize);
  const paginatedItems = items.slice((itemsPage - 1) * itemsPageSize, itemsPage * itemsPageSize);
  
  const handleConfirm = async () => {
    if (!adjustment) return;
    
    try {
      await confirm.mutateAsync({
        systemId: adjustment.systemId,
        confirmedBy: currentEmployee?.systemId || user?.employeeId || user?.systemId,
        confirmedByName: currentEmployee?.fullName || user?.name,
      });
      toast.success('Đã xác nhận phiếu điều chỉnh giá bán');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Không thể xác nhận phiếu');
    }
    setConfirmDialogOpen(false);
  };
  
  const handleCancel = React.useCallback(async () => {
    if (!adjustment) return;
    
    try {
      await cancel.mutateAsync({
        systemId: adjustment.systemId,
        cancelledBy: currentEmployee?.systemId || user?.employeeId || user?.systemId,
        cancelledByName: currentEmployee?.fullName || user?.name,
        reason: cancelReason || undefined,
      });
      toast.success('Đã hủy phiếu điều chỉnh giá bán');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Không thể hủy phiếu');
    }
    setCancelDialogOpen(false);
    setCancelReason('');
  }, [adjustment, currentEmployee, user, cancel, cancelReason]);
  
  const headerActions = React.useMemo(() => {
    if (!adjustment) return null;
    
    const isDraft = adjustment.status?.toLowerCase() === 'draft';
    
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" className="h-9" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          In phiếu
        </Button>
        
        <Button variant="outline" className="h-9" onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Sao chép
        </Button>
        
        {isDraft && (
          <>
            <Button 
              variant="outline" 
              className="h-9"
              onClick={() => router.push(`/price-adjustments/${systemId}/edit`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Sửa
            </Button>
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
  }, [adjustment, handlePrint, handleCopy, router, systemId]);
  
  const breadcrumb = React.useMemo(() => {
    if (!adjustment) return [];
    return [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Điều chỉnh giá bán', href: '/price-adjustments' },
      { label: adjustment.id || 'Chi tiết', href: '' },
    ];
  }, [adjustment]);
  
  React.useEffect(() => {
    if (adjustment) {
      setPageHeader({
        title: `Phiếu điều chỉnh ${adjustment.id}`,
        breadcrumb,
        showBackButton: true,
        backPath: '/price-adjustments',
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
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }
  
  if (!adjustment) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Không tìm thấy phiếu điều chỉnh</p>
        <Button variant="link" onClick={() => router.push('/price-adjustments')}>
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
              <CardTitle>Thông tin phiếu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailField label="Mã phiếu" value={adjustment.id} />
                <DetailField label="Bảng giá" value={adjustment.pricingPolicyName || '-'} />
              </div>
              <DetailField label="Lý do điều chỉnh" value={adjustment.reason || '-'} />
            </CardContent>
          </Card>
          
          {/* Notes */}
          {adjustment.note && (
            <Card>
              <CardHeader>
                <CardTitle>Ghi chú</CardTitle>
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
              <CardTitle>Thông tin xử lý</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailField label="Ngày tạo" value={formatDateTime(adjustment.createdAt)} />
              <DetailField label="Người tạo" value={adjustment.createdByName || '-'} />
              
              {adjustment.confirmedDate && (
                <>
                  <Separator />
                  <DetailField label="Ngày xác nhận" value={formatDateTime(adjustment.confirmedDate)} />
                  <DetailField label="Người xác nhận" value={adjustment.confirmedByName || '-'} />
                </>
              )}
              
              {adjustment.cancelledDate && (
                <>
                  <Separator />
                  <DetailField label="Ngày hủy" value={formatDateTime(adjustment.cancelledDate)} />
                  <DetailField label="Người hủy" value={adjustment.cancelledByName || '-'} />
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Danh sách sản phẩm ({totalItems})</CardTitle>
          {totalItems > 10 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Hiển thị</span>
              <Select
                value={itemsPageSize.toString()}
                onValueChange={(v) => {
                  setItemsPageSize(Number(v));
                  setItemsPage(1);
                }}
              >
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map(size => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">sản phẩm</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-15">#</TableHead>
                  <TableHead className="w-15">Hình ảnh</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead className="text-right">Giá cũ</TableHead>
                  <TableHead className="text-center">→</TableHead>
                  <TableHead className="text-right">Giá mới</TableHead>
                  <TableHead className="text-right">Chênh lệch</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Không có sản phẩm nào
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedItems.map((item, index) => {
                    const product = item.productSystemId ? findProductById(asSystemId(item.productSystemId)) : null;
                    const displayName = item.productName || product?.name || 'Sản phẩm';
                    const displayId = item.productId || product?.id || item.productSystemId;
                    const diff = (item.newPrice || 0) - (item.oldPrice || 0);
                    const globalIndex = (itemsPage - 1) * itemsPageSize + index;
                    
                    return (
                      <TableRow key={item.systemId || index}>
                        <TableCell className="text-muted-foreground">{globalIndex + 1}</TableCell>
                        <TableCell>
                          <ProductThumbnailCell
                            productSystemId={item.productSystemId}
                            product={product}
                            productName={displayName}
                            itemThumbnailImage={item.productImage ?? undefined}
                            onPreview={(url, title) => setPreviewImage({ url, title })}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            {item.productSystemId ? (
                              <Link 
                                href={`/products/${item.productSystemId}`}
                                className="font-medium text-primary hover:underline block"
                              >
                                {displayName}
                              </Link>
                            ) : (
                              <span className="font-medium">{displayName}</span>
                            )}
                            {displayId && (
                              <div className="text-body-xs text-muted-foreground">
                                {displayId}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatCurrency(item.oldPrice)}
                        </TableCell>
                        <TableCell className="text-center">
                          <ArrowRight className="h-4 w-4 inline text-muted-foreground" />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.newPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {diff !== 0 && (
                              diff > 0 ? (
                                <TrendingUp className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-destructive" />
                              )
                            )}
                            <span className={`font-medium ${
                              diff > 0 ? 'text-emerald-600' : 
                              diff < 0 ? 'text-destructive' : 
                              'text-muted-foreground'
                            }`}>
                              {diff >= 0 ? '+' : ''}{formatCurrency(diff)}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination for items */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Hiển thị {(itemsPage - 1) * itemsPageSize + 1} - {Math.min(itemsPage * itemsPageSize, totalItems)} / {totalItems} sản phẩm
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setItemsPage(p => Math.max(1, p - 1))}
                  disabled={itemsPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Trang {itemsPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setItemsPage(p => Math.min(totalPages, p + 1))}
                  disabled={itemsPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          <Separator className="my-4" />
          
          <div className="flex justify-end">
            <div className="text-right space-y-1">
              <p className="text-sm text-muted-foreground">
                Tổng số sản phẩm: {totalItems}
              </p>
              <p className="text-sm text-muted-foreground">
                Tổng giá cũ: {formatCurrency(totalOldValue)}
              </p>
              <p className="text-sm text-muted-foreground">
                Tổng giá mới: {formatCurrency(totalNewValue)}
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
        entityType="price-adjustment"
        entityId={adjustment.systemId}
        comments={comments}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        currentUser={commentCurrentUser}
        title="Bình luận"
        placeholder="Thêm bình luận về phiếu điều chỉnh giá bán..."
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
            <AlertDialogTitle>Xác nhận điều chỉnh giá bán?</AlertDialogTitle>
            <AlertDialogDescription>
              Giá bán của {totalItems} sản phẩm trong bảng giá <strong>{adjustment.pricingPolicyName}</strong> sẽ được cập nhật. 
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
              Phiếu điều chỉnh sẽ bị hủy và giá bán sản phẩm sẽ không thay đổi.
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
