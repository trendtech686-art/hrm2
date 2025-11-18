import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useProductStore } from './store.ts';
import { createSystemId } from '../../lib/id-config.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { ArrowLeft, Edit, Info, Printer } from 'lucide-react';
import { DetailField } from '../../components/ui/detail-field.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { Separator } from '../../components/ui/separator.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs.tsx';
import { ProgressiveImage } from '../../components/ui/progressive-image.tsx';
import { usePricingPolicyStore } from '../settings/pricing/store.ts';
import { useSupplierStore } from '../suppliers/store.ts';
import { useStockHistoryStore } from '../stock-history/store.ts';
import { getStockHistoryColumns } from '../stock-history/columns.tsx';
import { RelatedDataTable } from '../../components/data-table/related-data-table.tsx';
import { useBranchStore } from '../settings/branches/store.ts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { usePurchaseOrderStore } from '../purchase-orders/store.ts';
import { useInventoryReceiptStore } from '../inventory-receipts/store.ts';
import { useOrderStore } from '../orders/store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { useWarrantyStore } from '../warranty/store.ts';
import { useInventoryCheckStore } from '../inventory-checks/store.ts';
import { CommittedStockDialog } from './components/committed-stock-dialog.tsx';


const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export function ProductDetailPage() {
  const { systemId } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const { findById: findProductById } = useProductStore();
  const { findById: findSupplierById } = useSupplierStore();
  const { data: pricingPolicies } = usePricingPolicyStore();
  const { getHistoryForProduct } = useStockHistoryStore();
  const { data: branches } = useBranchStore();
  const { data: allPurchaseOrders } = usePurchaseOrderStore();
  const { data: allInventoryReceipts } = useInventoryReceiptStore();
  const { data: allOrders } = useOrderStore();
  const { findById: findEmployeeById } = useEmployeeStore();
  const { data: allWarranties } = useWarrantyStore();
  const { data: allInventoryChecks } = useInventoryCheckStore();
  
  const [historyBranchFilter, setHistoryBranchFilter] = React.useState<'all' | string>('all');
  const [committedDialogOpen, setCommittedDialogOpen] = React.useState(false);
  const [selectedBranch, setSelectedBranch] = React.useState<{ systemId: string; name: string } | null>(null);


  const product = React.useMemo(() => (systemId ? findProductById(createSystemId(systemId)) : null), [systemId, findProductById]);
  const supplier = React.useMemo(() => (product?.primarySupplierSystemId ? findSupplierById(product.primarySupplierSystemId) : null), [product, findSupplierById]);
  const createdByEmployee = React.useMemo(() => (product?.createdBy ? findEmployeeById(product.createdBy) : null), [product, findEmployeeById]);
  const updatedByEmployee = React.useMemo(() => (product?.updatedBy ? findEmployeeById(product.updatedBy) : null), [product, findEmployeeById]);
  // ✅ FIX: Use product.systemId (internal key) instead of product.id (SKU) for querying
  const productHistory = React.useMemo(() => (product ? getHistoryForProduct(product.systemId, historyBranchFilter) : []), [product, getHistoryForProduct, historyBranchFilter]);
  
  const stockHistoryColumns = React.useMemo(() => 
    getStockHistoryColumns(allPurchaseOrders, allInventoryReceipts, allOrders, allWarranties, allInventoryChecks),
    [allPurchaseOrders, allInventoryReceipts, allOrders, allWarranties, allInventoryChecks]
  );
  
  const pageActions = React.useMemo(() => (
    <div className="flex items-center gap-2 flex-wrap">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate(`/products/${systemId}/edit`)}
      >
        Sửa
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/products')}
      >
        Quay lại
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => alert('Chức năng đang phát triển')}
      >
        In
      </Button>
    </div>
  ), [navigate, systemId]);

  usePageHeader({
    title: product?.name || 'Chi tiết sản phẩm',
    actions: [pageActions],
  });

  if (!product) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Không tìm thấy sản phẩm</h2>
          <p className="text-muted-foreground mt-2">Sản phẩm bạn đang tìm kiếm không tồn tại.</p>
          <Button onClick={() => navigate('/products')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay về danh sách
          </Button>
        </div>
      </div>
    );
  }
  
  const salesPolicies = pricingPolicies.filter(p => p.type === 'Bán hàng');
  // FIX: Explicitly provide generic type to `reduce` to ensure correct type inference for the accumulator and the return value, resolving 'unknown' type errors.
  const totalInventory = Object.values(product.inventoryByBranch || {}).reduce<number>((sum, qty) => sum + Number(qty || 0), 0);

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'discontinued': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'active': return 'Đang hoạt động';
      case 'inactive': return 'Tạm ngừng';
      case 'discontinued': return 'Ngừng kinh doanh';
      default: return 'Không xác định';
    }
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case 'physical': return 'Hàng hóa';
      case 'service': return 'Dịch vụ';
      case 'digital': return 'Sản phẩm số';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
        {/* Status Badge Card */}
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant={getStatusBadgeVariant(product.status) as any}>
                        {getStatusLabel(product.status)}
                    </Badge>
                    <Separator orientation="vertical" className="h-6" />
                    <span className="text-sm text-muted-foreground">
                        Mã SKU: <span className="font-medium text-foreground">{product.id}</span>
                    </span>
                    <Separator orientation="vertical" className="h-6" />
                    <span className="text-sm text-muted-foreground">
                        Loại: <span className="font-medium text-foreground">{getTypeLabel(product.type)}</span>
                    </span>
                    {totalInventory > 0 && (
                        <>
                            <Separator orientation="vertical" className="h-6" />
                            <span className="text-sm text-muted-foreground">
                                Tồn kho: <span className="font-semibold text-foreground">{totalInventory}</span>
                            </span>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>

        {/* Product Images */}
        {product.images && product.images.length > 0 && (
          <Card>
              <CardHeader>
                  <CardTitle className="text-base font-semibold">Hình ảnh sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {product.images.map((imageUrl, index) => (
                          <div 
                              key={index}
                              className="relative aspect-square rounded-lg overflow-hidden border bg-muted hover:opacity-90 transition-opacity cursor-pointer"
                              onClick={() => window.open(imageUrl, '_blank')}
                          >
                              <ProgressiveImage
                                  src={imageUrl} 
                                  alt={`${product.name} - Ảnh ${index + 1}`}
                                  className="w-full h-full object-cover"
                              />
                              {index === 0 && (
                                  <div className="absolute top-2 left-2">
                                      <Badge className="text-xs">Ảnh chính</Badge>
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-4">
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Thông tin cơ bản</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <DetailField label="Tên sản phẩm/dịch vụ" value={product.name} />
                        {product.title && <DetailField label="Tiêu đề SEO" value={product.title} />}
                        {product.shortDescription && (
                          <DetailField label="Mô tả ngắn" value={product.shortDescription} />
                        )}
                        <DetailField label="Loại" value={getTypeLabel(product.type)} />
                        <DetailField 
                          label="Theo dõi tồn kho" 
                          value={product.isStockTracked !== false ? 'Có' : 'Không'} 
                        />
                        {product.tags && product.tags.length > 0 && (
                          <DetailField 
                            label="Tags" 
                            value={
                              <div className="flex flex-wrap gap-1">
                                {product.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                ))}
                              </div>
                            } 
                          />
                        )}
                        <DetailField label="Đơn vị tính" value={product.unit} />
                        {product.barcode && <DetailField label="Mã vạch" value={product.barcode} />}
                    </CardContent>
                 </Card>

                 {product.description && (
                   <Card>
                      <CardHeader>
                        <CardTitle className="text-base font-semibold">Mô tả chi tiết</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div 
                          className="prose prose-sm max-w-none text-sm text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                      </CardContent>
                   </Card>
                 )}
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-4">
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Giá & Kho</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <DetailField label="Giá vốn" value={formatCurrency(product.costPrice)} />
                        {product.lastPurchasePrice && (
                          <DetailField 
                            label="Giá nhập gần nhất" 
                            value={formatCurrency(product.lastPurchasePrice)} 
                          />
                        )}
                        {product.lastPurchaseDate && (
                          <DetailField 
                            label="Ngày nhập gần nhất" 
                            value={new Date(product.lastPurchaseDate).toLocaleDateString('vi-VN')} 
                          />
                        )}
                        {product.suggestedRetailPrice && (
                          <DetailField label="Giá bán lẻ đề xuất" value={formatCurrency(product.suggestedRetailPrice)} />
                        )}
                        {product.minPrice && (
                          <DetailField label="Giá tối thiểu" value={formatCurrency(product.minPrice)} />
                        )}
                        <Separator />
                        <DetailField 
                          label="Tổng tồn kho" 
                          value={<span className="font-semibold">{totalInventory}</span>} 
                        />
                        {product.reorderLevel && (
                          <DetailField label="Mức đặt hàng lại" value={product.reorderLevel} />
                        )}
                        {product.safetyStock && (
                          <DetailField label="Tồn kho an toàn" value={product.safetyStock} />
                        )}
                        {product.maxStock && (
                          <DetailField label="Mức tồn tối đa" value={product.maxStock} />
                        )}
                    </CardContent>
                 </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Bảng giá bán</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {salesPolicies.map(policy => (
                            <DetailField 
                                key={policy.systemId}
                                label={`${policy.name}${policy.isDefault ? ' (Mặc định)' : ''}`}
                                value={formatCurrency(product.prices[policy.systemId])} 
                            />
                        ))}
                    </CardContent>
                 </Card>

                 {(product.weight || product.dimensions || supplier) && (
                   <Card>
                      <CardHeader>
                        <CardTitle className="text-base font-semibold">Logistics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                          {product.weight && (
                            <DetailField label="Khối lượng" value={`${product.weight} ${product.weightUnit}`} />
                          )}
                          {product.dimensions && (
                            <DetailField 
                              label="Kích thước (D×R×C)" 
                              value={`${product.dimensions.length}×${product.dimensions.width}×${product.dimensions.height} cm`} 
                            />
                          )}
                          {supplier && (
                            <DetailField 
                              label="Nhà cung cấp chính" 
                              value={
                                <ReactRouterDOM.Link 
                                  to={`/suppliers/${supplier.systemId}`}
                                  className="text-primary hover:underline font-medium"
                                >
                                  {supplier.name}
                                </ReactRouterDOM.Link>
                              } 
                            />
                          )}
                      </CardContent>
                   </Card>
                 )}

                 {(product.totalSold || product.totalRevenue || product.viewCount || product.lastSoldDate) && (
                   <Card>
                      <CardHeader>
                        <CardTitle className="text-base font-semibold">Phân tích bán hàng</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                          {product.totalSold !== undefined && (
                            <DetailField label="Tổng đã bán" value={product.totalSold} />
                          )}
                          {product.totalRevenue && (
                            <DetailField label="Tổng doanh thu" value={formatCurrency(product.totalRevenue)} />
                          )}
                          {product.viewCount && (
                            <DetailField label="Lượt xem" value={product.viewCount} />
                          )}
                          {product.lastSoldDate && (
                            <DetailField 
                              label="Bán gần nhất" 
                              value={new Date(product.lastSoldDate).toLocaleDateString('vi-VN')} 
                            />
                          )}
                      </CardContent>
                   </Card>
                 )}

                 {(product.launchedDate || product.discontinuedDate || product.createdAt || product.updatedAt || createdByEmployee || updatedByEmployee) && (
                   <Card>
                      <CardHeader>
                        <CardTitle className="text-base font-semibold">Thông tin hệ thống</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                          {product.launchedDate && (
                            <DetailField 
                              label="Ngày ra mắt" 
                              value={new Date(product.launchedDate).toLocaleDateString('vi-VN')} 
                            />
                          )}
                          {product.discontinuedDate && (
                            <DetailField 
                              label="Ngày ngừng KD" 
                              value={new Date(product.discontinuedDate).toLocaleDateString('vi-VN')} 
                            />
                          )}
                          <Separator />
                          {product.createdAt && (
                            <DetailField 
                              label="Ngày tạo" 
                              value={new Date(product.createdAt).toLocaleString('vi-VN')} 
                            />
                          )}
                          {createdByEmployee && (
                            <DetailField 
                              label="Người tạo" 
                              value={
                                <ReactRouterDOM.Link 
                                  to={`/employees/${createdByEmployee.systemId}`}
                                  className="text-primary hover:underline font-medium"
                                >
                                  {createdByEmployee.fullName}
                                </ReactRouterDOM.Link>
                              } 
                            />
                          )}
                          {product.updatedAt && (
                            <DetailField 
                              label="Cập nhật lần cuối" 
                              value={new Date(product.updatedAt).toLocaleString('vi-VN')} 
                            />
                          )}
                          {updatedByEmployee && (
                            <DetailField 
                              label="Người cập nhật" 
                              value={
                                <ReactRouterDOM.Link 
                                  to={`/employees/${updatedByEmployee.systemId}`}
                                  className="text-primary hover:underline font-medium"
                                >
                                  {updatedByEmployee.fullName}
                                </ReactRouterDOM.Link>
                              } 
                            />
                          )}
                      </CardContent>
                   </Card>
                 )}
            </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="inventory" className="w-full">
            <TabsList>
                <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
                <TabsTrigger value="history">Lịch sử kho</TabsTrigger>
            </TabsList>
            <TabsContent value="inventory" className="mt-4">
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Tồn kho theo chi nhánh</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                       <div className="overflow-x-auto">
                        <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Chi nhánh</TableHead>
                                <TableHead>Điểm lưu kho</TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-1">
                                        Tồn kho 
                                        <Info className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                </TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-1">
                                        Giá trị tồn
                                        <Info className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                </TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-1">
                                        Có thể bán
                                        <Info className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                </TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-1">
                                        Đang giao dịch
                                        <Info className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                </TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-1">
                                        Hàng đang về
                                        <Info className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                </TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-1">
                                        Đang giao
                                        <Info className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {branches.map(branch => {
                                const onHand = product.inventoryByBranch[branch.systemId] || 0;
                                const committed = product.committedByBranch[branch.systemId] || 0;
                                const inTransit = product.inTransitByBranch[branch.systemId] || 0;
                                const available = onHand - committed;
                                
                                const incomingQuantity = allPurchaseOrders
                                  .filter(po => 
                                    po.branchSystemId === branch.systemId &&
                                    (po.status === 'Đặt hàng' || po.status === 'Đang giao dịch') &&
                                    po.deliveryStatus !== 'Đã nhập'
                                  )
                                  .reduce((total, po) => {
                                    const itemInPO = po.lineItems.find(item => item.productSystemId === product.systemId);
                                    if (!itemInPO) return total;

                                    const totalReceivedForPO = allInventoryReceipts
                                      .filter(receipt => receipt.purchaseOrderId === po.systemId) // ✅ Fixed: Match by systemId
                                      .reduce((receivedSum, receipt) => {
                                        const itemInReceipt = receipt.items.find(item => item.productSystemId === product.systemId);
                                        return receivedSum + (itemInReceipt ? Number(itemInReceipt.receivedQuantity) : 0);
                                      }, 0);
                                    
                                    const remainingToReceive = itemInPO.quantity - totalReceivedForPO;
                                    return total + (remainingToReceive > 0 ? remainingToReceive : 0);
                                  }, 0);

                                return (
                                <TableRow key={branch.systemId}>
                                    <TableCell className="font-medium">{branch.name}</TableCell>
                                    <TableCell className="text-muted-foreground">Kệ A1-05</TableCell>
                                    <TableCell className="font-semibold">{onHand}</TableCell>
                                    <TableCell>{formatCurrency(onHand * (product.costPrice || 0))}</TableCell>
                                    <TableCell className={available > 0 ? 'text-green-600 font-medium' : ''}>{available}</TableCell>
                                    <TableCell 
                                      className={committed > 0 ? 'text-orange-600 cursor-pointer hover:underline font-medium' : ''}
                                      onClick={() => {
                                        if (committed > 0) {
                                          setSelectedBranch({ systemId: branch.systemId, name: branch.name });
                                          setCommittedDialogOpen(true);
                                        }
                                      }}
                                    >
                                      {committed}
                                    </TableCell>
                                    <TableCell className={incomingQuantity > 0 ? 'text-blue-600' : ''}>{incomingQuantity}</TableCell>
                                    <TableCell className={inTransit > 0 ? 'text-purple-600' : ''}>{inTransit}</TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                       </Table>
                       </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="history" className="mt-4">
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Lịch sử xuất nhập kho</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <RelatedDataTable 
                            data={productHistory} 
                            columns={stockHistoryColumns} 
                            searchKeys={['action', 'documentId', 'employeeName']}
                            searchPlaceholder="Tìm kiếm lịch sử..."
                            dateFilterColumn="date"
                            dateFilterTitle="Ngày ghi nhận"
                            exportFileName={`Lich_su_kho_${product.id}`}
                        >
                            <Select value={historyBranchFilter} onValueChange={(v) => setHistoryBranchFilter(v)}>
                                <SelectTrigger className="h-8 w-full sm:w-[200px]">
                                    <SelectValue placeholder="Lọc chi nhánh" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                                    {branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </RelatedDataTable>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        {/* Committed Stock Dialog */}
        {selectedBranch && (
          <CommittedStockDialog
            open={committedDialogOpen}
            onOpenChange={setCommittedDialogOpen}
            productSystemId={product.systemId}
            branchSystemId={selectedBranch.systemId}
            branchName={selectedBranch.name}
            productName={product.name}
          />
        )}
    </div>
  );
}
