'use client'

import * as React from "react"
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { Package, Settings2, SlidersHorizontal, Columns3, Layers, FileUp, Download, PlusCircle } from "lucide-react";

import { useProductStore } from "./store"
import { useActiveCategories, useCategoryFinder } from "../categories/hooks/use-all-categories"
import { useAllBranches } from "../settings/branches/hooks/use-all-branches"
import { useBrandFinder } from "../brands/hooks/use-all-brands"
import { useAllPricingPolicies } from "../settings/pricing/hooks/use-all-pricing-policies"
import { usePkgxSettingsStore } from "../settings/pkgx/store"
import { usePkgxBulkSync } from "../settings/pkgx/hooks/use-pkgx-bulk-sync"
import type { PkgxProductPayload } from "../settings/pkgx/types"
import { usePkgxSync } from "./hooks/use-pkgx-sync"
import { useAuth } from "@/contexts/auth-context"
import { asSystemId } from '@/lib/id-types';
import { getColumns } from "./columns"
import { usePrint } from '@/lib/use-print';
import { mapProductToLabelPrintData, createStoreSettings } from '@/lib/print/product-print-helper';
import { useStoreInfoData } from '../settings/store-info/hooks/use-store-info';
import { useProductsQuery } from "./hooks/use-products-query";
import { DEFAULT_PRODUCT_SORT, getFilteredProductsSnapshot, type ProductQueryParams, type ProductQueryResult } from "./product-service";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { usePageHeader } from "@/contexts/page-header-context";
import { useColumnVisibility } from '@/hooks/use-column-visibility';
import { useMediaQuery } from "@/lib/use-media-query";
import { useTableStateHandlers, TABLE_STATE_STORAGE_KEY, MOBILE_ROW_HEIGHT, MOBILE_LIST_HEIGHT } from "./hooks/use-table-state-handlers";
import { useProductImportHandler } from "./hooks/use-product-import-handler";
import type { Product } from "@/lib/types/prisma-extended"

import { ResponsiveDataTable } from "@/components/data-table/responsive-data-table"
import { PageFilters } from "@/components/layout/page-filters";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from "@/components/data-table/dynamic-column-customizer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MobileProductCard } from "./components/mobile-product-card";
import { ProductFilterControls } from "./components/product-filter-controls";
import { createBulkActions, createPkgxBulkActions } from "./components/product-bulk-actions";

const PkgxBulkSyncConfirmDialog = dynamic(() => import("../settings/pkgx/components/pkgx-bulk-sync-confirm-dialog").then(mod => ({ default: mod.PkgxBulkSyncConfirmDialog })), { ssr: false });
const PkgxLinkDialog = dynamic(() => import("./components/pkgx-link-dialog").then(mod => ({ default: mod.PkgxLinkDialog })), { ssr: false });
const ProductImportDialog = dynamic(() => import("./components/product-import-export-dialogs").then(mod => ({ default: mod.ProductImportDialog })), { ssr: false });
const ProductExportDialog = dynamic(() => import("./components/product-import-export-dialogs").then(mod => ({ default: mod.ProductExportDialog })), { ssr: false });

const defaultTableState: ProductQueryParams = { search: '', statusFilter: 'all', typeFilter: 'all', categoryFilter: 'all', comboFilter: 'all', stockLevelFilter: 'all', pkgxFilter: 'all', dateRange: undefined, pagination: { pageIndex: 0, pageSize: 20 }, sorting: DEFAULT_PRODUCT_SORT };

export function ProductsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: products, remove, restore, getDeleted, add, update } = useProductStore();
  const { data: activeCategories } = useActiveCategories();
  const { findById: findCategoryById } = useCategoryFinder();
  useAllBranches(); // Keep for side effects
  const { findById: findBrandById } = useBrandFinder();
  const { employee: authEmployee } = useAuth();
  const { print: printSingleLabel, printMultiple } = usePrint();
  const { info: storeInfo } = useStoreInfoData();
  const { data: pricingPolicies } = useAllPricingPolicies();
  const { settings: pkgxSettings, addLog: addPkgxLog } = usePkgxSettingsStore();
  const { handlePkgxSyncImages } = usePkgxSync({ addPkgxLog });
  const { confirmAction: bulkConfirmAction, progress: bulkProgress, triggerBulkSync, executeAction: executeBulkAction, cancelConfirm: cancelBulkConfirm } = usePkgxBulkSync({ entityType: 'product', onLog: addPkgxLog });

  const deletedCount = React.useMemo(() => getDeleted().length, [getDeleted]);
  const defaultSellingPolicy = React.useMemo(() => pricingPolicies.find(p => p.type === 'Bán hàng' && p.isDefault), [pricingPolicies]);
  const storeSettings = React.useMemo(() => createStoreSettings(storeInfo), [storeInfo]);

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  const [isFilterSheetOpen, setFilterSheetOpen] = React.useState(false);
  const [isActionsSheetOpen, setActionsSheetOpen] = React.useState(false);
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  const [pkgxLinkDialogOpen, setPkgxLinkDialogOpen] = React.useState(false);
  const [productToLink, setProductToLink] = React.useState<Product | null>(null);

  const defaultColumnVisibility = React.useMemo(() => { const cols = getColumns(() => {}, () => {}, null as unknown as ReturnType<typeof useRouter>); const init: Record<string, boolean> = {}; cols.forEach(c => { if (c.id) init[c.id] = true; }); return init; }, []);
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('products', defaultColumnVisibility);
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  const [tableState, setTableState] = usePersistentState<ProductQueryParams>(TABLE_STATE_STORAGE_KEY, defaultTableState);

  const headerActions = React.useMemo(() => [
    <Button key="trash" variant="outline" size="sm" className="h-9" onClick={() => router.push('/products/trash')}><Package className="mr-2 h-4 w-4" />Thùng rác ({deletedCount})</Button>,
    ...(isMobile ? [<Button key="import" variant="ghost" size="sm" className="h-9" onClick={() => setActionsSheetOpen(true)}><Columns3 className="mr-2 h-4 w-4" />Tùy chọn bảng</Button>] : []),
    <DropdownMenu key="add-menu"><DropdownMenuTrigger asChild><Button size="sm" className="h-9"><PlusCircle className="mr-2 h-4 w-4" />Thêm sản phẩm</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => router.push('/products/new')}><Package className="mr-2 h-4 w-4" />Thêm sản phẩm đơn</DropdownMenuItem><DropdownMenuItem onClick={() => router.push('/products/new?type=combo')}><Layers className="mr-2 h-4 w-4" />Thêm Combo</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
  ], [deletedCount, router, isMobile]);
  usePageHeader({ title: 'Danh sách sản phẩm', breadcrumb: [{ label: 'Trang chủ', href: '/', isCurrent: false }, { label: 'Sản phẩm', href: '/products', isCurrent: true }], actions: headerActions, showBackButton: false });

  const handleDelete = React.useCallback((systemId: string) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);
  const handleRestore = React.useCallback((systemId: string) => { restore(asSystemId(systemId)); toast.success('Đã khôi phục sản phẩm'); }, [restore]);

  const handlePrintLabel = React.useCallback((product: Product) => {
    const catName = product.categorySystemId ? findCategoryById(product.categorySystemId)?.name || product.category : product.category;
    const brandName = product.brandSystemId ? findBrandById(product.brandSystemId)?.name || '' : '';
    const defPrice = defaultSellingPolicy ? product.prices?.[defaultSellingPolicy.systemId] : undefined;
    printSingleLabel('product-label', { data: mapProductToLabelPrintData(product, storeSettings, { category: catName, brand: brandName, price: defPrice ?? product.sellingPrice }) });
  }, [printSingleLabel, storeSettings, defaultSellingPolicy, findBrandById, findCategoryById]);

  const buildPkgxPayload = React.useCallback((product: Product): PkgxProductPayload => {
    const catMap = pkgxSettings.categoryMappings.find(m => m.hrmCategorySystemId === product.categorySystemId);
    const brand = product.brandSystemId ? findBrandById(product.brandSystemId) : undefined;
    const brandMap = brand ? pkgxSettings.brandMappings.find(m => m.hrmBrandSystemId === brand.systemId) : undefined;
    const { priceMapping } = pkgxSettings;
    let shopPrice = product.costPrice || 0;
    if (priceMapping.shopPrice && product.prices[priceMapping.shopPrice]) shopPrice = product.prices[priceMapping.shopPrice];
    else if (defaultSellingPolicy) shopPrice = product.prices[defaultSellingPolicy.systemId] || shopPrice;
    let marketPrice = shopPrice * 1.2;
    if (priceMapping.marketPrice && product.prices[priceMapping.marketPrice]) marketPrice = product.prices[priceMapping.marketPrice];
    const totalInventory = product.inventoryByBranch ? Object.values(product.inventoryByBranch).reduce((s, q) => s + (q || 0), 0) : 0;
    const seo = product.seoPkgx;
    return { goods_name: product.name, goods_sn: product.id, cat_id: catMap?.pkgxCatId || 0, brand_id: brandMap?.pkgxBrandId || 0, seller_note: product.sellerNote || '', shop_price: shopPrice, market_price: marketPrice, goods_number: totalInventory, goods_desc: seo?.longDescription || product.description || '', goods_brief: seo?.shortDescription || product.shortDescription || '', keywords: seo?.seoKeywords || product.tags?.join(', ') || product.name, meta_title: seo?.seoTitle || product.ktitle || product.name, meta_desc: seo?.metaDescription || product.seoDescription || '', original_img: product.thumbnailImage || product.images?.[0] || '', gallery_images: product.galleryImages || product.images || [], best: product.isFeatured || false, hot: product.isBestSeller || false, new: product.isNewArrival || false, ishome: product.isFeatured || false, is_on_sale: product.isPublished ?? (product.status === 'active') };
  }, [pkgxSettings, defaultSellingPolicy, findBrandById]);

  const handlePkgxPublish = React.useCallback(async (product: Product) => {
    if (product.pkgxId) { toast.warning('Sản phẩm đã được đăng lên PKGX'); return; }
    if (!pkgxSettings.enabled) { toast.error('Tích hợp PKGX chưa được bật'); return; }
    toast.loading('Đang đăng sản phẩm lên PKGX...', { id: 'pkgx-publish' });
    try {
      const payload = buildPkgxPayload(product);
      const { createProduct } = await import("@/lib/pkgx/api-service");
      const resp = await createProduct(payload);
      if (resp.success && resp.data) { const gid = resp.data.goods_id; update(product.systemId, { pkgxId: gid }); queryClient.setQueriesData<ProductQueryResult>({ queryKey: ['products'] }, old => old ? { ...old, items: old.items.map(it => it.systemId === product.systemId ? { ...it, pkgxId: gid } : it) } : old); toast.success(`Đã đăng sản phẩm lên PKGX! ID: ${gid}`, { id: 'pkgx-publish' }); addPkgxLog({ action: 'create_product', status: 'success', message: `Đã đăng: ${product.name}`, details: { productId: product.systemId, pkgxId: gid } }); }
      else throw new Error(resp.error);
    } catch (e) { toast.error(`Lỗi: ${e instanceof Error ? e.message : 'Unknown'}`, { id: 'pkgx-publish' }); addPkgxLog({ action: 'create_product', status: 'error', message: `Lỗi: ${product.name}`, details: { productId: product.systemId, error: e instanceof Error ? e.message : String(e) } }); }
  }, [pkgxSettings, buildPkgxPayload, update, addPkgxLog, queryClient]);

  const handlePkgxLink = React.useCallback((p: Product) => { setProductToLink(p); setPkgxLinkDialogOpen(true); }, []);
  const handlePkgxLinkSuccess = React.useCallback((pkgxId: number) => { if (productToLink) queryClient.setQueriesData<ProductQueryResult>({ queryKey: ['products'] }, old => old ? { ...old, items: old.items.map(it => it.systemId === productToLink.systemId ? { ...it, pkgxId } : it) } : old); }, [productToLink, queryClient]);
  const handlePkgxUnlink = React.useCallback((p: Product) => { update(p.systemId, { pkgxId: undefined }); queryClient.setQueriesData<ProductQueryResult>({ queryKey: ['products'] }, old => old ? { ...old, items: old.items.map(it => it.systemId === p.systemId ? { ...it, pkgxId: undefined } : it) } : old); toast.success(`Đã hủy liên kết PKGX: ${p.name}`); }, [update, queryClient]);

  const handleStatusChange = React.useCallback((p: Product, ns: 'active' | 'inactive') => { update(asSystemId(p.systemId), { status: ns }); queryClient.setQueriesData<ProductQueryResult>({ queryKey: ['products'] }, old => old ? { ...old, items: old.items.map(it => it.systemId === p.systemId ? { ...it, status: ns } : it) } : old); toast.success(`${p.name}: ${ns === 'active' ? 'Đang bán' : 'Ngừng bán'}`); }, [update, queryClient]);
  const handleInventoryChange = React.useCallback((p: Product, qty: number) => { const brs = Object.keys(p.inventoryByBranch); if (!brs.length) { toast.error('Không tìm thấy chi nhánh'); return; } const inv = { ...p.inventoryByBranch, [brs[0]]: qty }; update(asSystemId(p.systemId), { inventoryByBranch: inv }); queryClient.setQueriesData<ProductQueryResult>({ queryKey: ['products'] }, old => old ? { ...old, items: old.items.map(it => it.systemId === p.systemId ? { ...it, inventoryByBranch: inv } : it) } : old); toast.success(`Đã cập nhật tồn kho ${p.name}: ${qty}`); }, [update, queryClient]);
  const handleFieldUpdate = React.useCallback((p: Product, field: string, val: string | number | boolean) => { let ud: Partial<Product>; if (field.startsWith('prices.')) { const pid = field.replace('prices.', ''); ud = { prices: { ...p.prices, [pid]: val as number } }; } else ud = { [field]: val } as Partial<Product>; update(asSystemId(p.systemId), ud); queryClient.setQueriesData<ProductQueryResult>({ queryKey: ['products'] }, old => old ? { ...old, items: old.items.map(it => it.systemId === p.systemId ? { ...it, ...ud } : it) } : old); const labels: Record<string, string> = { pkgxId: 'ID PKGX', reorderLevel: 'Mức đặt hàng lại', safetyStock: 'Tồn kho an toàn', maxStock: 'Mức tồn tối đa', sellerNote: 'Ghi chú', isPublished: 'Đăng web', isFeatured: 'Nổi bật', isNewArrival: 'Mới về', isBestSeller: 'Bán chạy' }; const lbl = field.startsWith('prices.') ? 'Giá' : (labels[field] || field); const dv = typeof val === 'boolean' ? (val ? 'Bật' : 'Tắt') : val; toast.success(`Đã cập nhật ${lbl}: ${dv}`); }, [update, queryClient]);

  const columns = React.useMemo(() => getColumns(handleDelete, handleRestore, router, handlePrintLabel, handlePkgxPublish, handlePkgxLink, handlePkgxUnlink, handlePkgxSyncImages, handleStatusChange, handleInventoryChange, handleFieldUpdate), [handleDelete, handleRestore, router, handlePrintLabel, handlePkgxPublish, handlePkgxLink, handlePkgxUnlink, handlePkgxSyncImages, handleStatusChange, handleInventoryChange, handleFieldUpdate]);

  React.useEffect(() => { const iv: Record<string, boolean> = {}; columns.forEach(c => { iv[c.id!] = true; }); setColumnVisibility(iv); setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]); }, [columns, setColumnVisibility]);

  const updateTableState = React.useCallback((updater: (prev: ProductQueryParams) => ProductQueryParams) => { setTableState(prev => updater(prev)); }, [setTableState]);
  const { handleSearchChange, handleStatusFilterChange, handleTypeFilterChange, handleCategoryFilterChange, handleComboFilterChange, handleStockLevelFilterChange, handlePkgxFilterChange, handleDateRangeChange, handlePaginationChange, handleSortingChange } = useTableStateHandlers({ updateTableState });

  const { data: queryResult, isLoading, isFetching } = useProductsQuery(tableState);
  const pageData = queryResult?.items ?? [], totalRows = queryResult?.total ?? 0, pageCount = queryResult?.pageCount ?? 1;
  const filteredSnapshot = React.useMemo(() => getFilteredProductsSnapshot(tableState), [tableState]);
  const selectedProducts = React.useMemo(() => products.filter(p => rowSelection[p.systemId]), [products, rowSelection]);
  const allSelectedRows = selectedProducts;

  const handleImport = useProductImportHandler({ products, add, update, authEmployeeSystemId: authEmployee?.systemId });
  const confirmDelete = () => { if (idToDelete) { remove(asSystemId(idToDelete)); toast.success('Đã chuyển sản phẩm vào thùng rác'); } setIsAlertOpen(false); setIdToDelete(null); };

  const categoryOptions = React.useMemo(() => activeCategories.map(c => ({ label: c.path || c.name, value: c.systemId })).sort((a, b) => a.label.localeCompare(b.label)), [activeCategories]);
  const stockLevelCounts = React.useMemo(() => { const prods = products.filter(p => !p.isDeleted); const c = { outOfStock: 0, lowStock: 0, belowSafety: 0, highStock: 0 }; prods.forEach(p => { const t = Object.values(p.inventoryByBranch || {}).reduce((s, q) => s + q, 0); if (t <= 0) c.outOfStock++; if (t > 0 && p.reorderLevel !== undefined && t <= p.reorderLevel) c.lowStock++; if (p.safetyStock !== undefined && t < p.safetyStock) c.belowSafety++; if (p.maxStock !== undefined && t > p.maxStock) c.highStock++; }); return c; }, [products]);

  const renderFilterControls = () => <ProductFilterControls tableState={tableState} categoryOptions={categoryOptions} stockLevelCounts={stockLevelCounts} onStatusFilterChange={handleStatusFilterChange} onTypeFilterChange={handleTypeFilterChange} onCategoryFilterChange={handleCategoryFilterChange} onComboFilterChange={handleComboFilterChange} onStockLevelFilterChange={handleStockLevelFilterChange} onPkgxFilterChange={handlePkgxFilterChange} onDateRangeChange={handleDateRangeChange} />;

  const handlePrintLabels = React.useCallback((prods: Product[]) => { if (!prods.length) return; const opts = prods.map(p => { const cat = p.categorySystemId ? findCategoryById(p.categorySystemId)?.name || p.category : p.category; const br = p.brandSystemId ? findBrandById(p.brandSystemId)?.name || '' : ''; const pr = defaultSellingPolicy ? p.prices?.[defaultSellingPolicy.systemId] : undefined; return { data: mapProductToLabelPrintData(p, storeSettings, { category: cat, brand: br, price: pr ?? p.sellingPrice }) }; }); printMultiple('product-label', opts); }, [printMultiple, storeSettings, defaultSellingPolicy, findBrandById, findCategoryById]);
  const bulkActions = React.useMemo(() => createBulkActions({ handlePrintLabels, remove, update, setRowSelection }), [handlePrintLabels, remove, update]);
  const pkgxBulkActions = React.useMemo(() => createPkgxBulkActions({ triggerBulkSync, update, setRowSelection }), [triggerBulkSync, update]);

  const handleRowClick = React.useCallback((r: Product) => { router.push(`/products/${r.systemId}`); }, [router]);
  const renderMobileCard = React.useCallback((p: Product) => <MobileProductCard product={p} categories={activeCategories as unknown as import("@/features/settings/inventory/types").ProductCategory[]} onRowClick={handleRowClick} onDelete={handleDelete} />, [activeCategories, handleRowClick, handleDelete]);

  return (
    <div className="flex flex-col w-full h-full">
      {!isMobile ? <PageToolbar className="flex-wrap gap-2" leftActions={<><Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}><FileUp className="mr-2 h-4 w-4" />Nhập file</Button><Button variant="outline" size="sm" onClick={() => setIsExportOpen(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button></>} rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />} /> : (<><div className="py-3"><Button type="button" variant="outline" size="sm" className="w-full justify-center gap-2" onClick={() => setActionsSheetOpen(true)}><Settings2 className="h-4 w-4" />Tùy chọn bảng</Button></div><Sheet open={isActionsSheetOpen} onOpenChange={setActionsSheetOpen}><SheetContent side="bottom" className="space-y-4"><SheetHeader><SheetTitle>Hành động nhanh</SheetTitle><SheetDescription>Nhập, xuất và tùy chỉnh cột.</SheetDescription></SheetHeader><div className="space-y-3"><Button className="w-full justify-center" variant="outline" onClick={() => { setActionsSheetOpen(false); setIsImportOpen(true); }}>Nhập sản phẩm</Button><Button className="w-full justify-center" variant="outline" onClick={() => { setActionsSheetOpen(false); setIsExportOpen(true); }}>Xuất danh sách</Button><DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns}><Button className="w-full justify-center gap-2" variant="outline"><Columns3 className="h-4 w-4" />Tuỳ chỉnh cột</Button></DataTableColumnCustomizer></div></SheetContent></Sheet></>)}

      {!isMobile ? <PageFilters searchValue={tableState.search} onSearchChange={handleSearchChange} searchPlaceholder="Tìm kiếm sản phẩm...">{renderFilterControls()}</PageFilters> : (<><PageFilters searchValue={tableState.search} onSearchChange={handleSearchChange} searchPlaceholder="Tìm kiếm sản phẩm..."><Button type="button" variant="outline" size="sm" className="w-full sm:w-auto justify-center gap-2" onClick={() => setFilterSheetOpen(true)}><SlidersHorizontal className="h-4 w-4" />Bộ lọc nâng cao</Button></PageFilters><Sheet open={isFilterSheetOpen} onOpenChange={setFilterSheetOpen}><SheetContent side="bottom" className="space-y-4"><SheetHeader><SheetTitle>Bộ lọc sản phẩm</SheetTitle><SheetDescription>Lọc theo trạng thái, loại, danh mục.</SheetDescription></SheetHeader><div className="space-y-3">{renderFilterControls()}</div></SheetContent></Sheet></>)}

      <div className="pb-4"><ResponsiveDataTable columns={columns} data={pageData} renderMobileCard={renderMobileCard} pageCount={pageCount} pagination={tableState.pagination} setPagination={handlePaginationChange} rowCount={totalRows} rowSelection={rowSelection} setRowSelection={setRowSelection} allSelectedRows={allSelectedRows} onBulkDelete={undefined} bulkActions={bulkActions} pkgxBulkActions={pkgxBulkActions} sorting={tableState.sorting} setSorting={handleSortingChange} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} emptyTitle="Không có sản phẩm" emptyDescription="Thêm sản phẩm đầu tiên để bắt đầu" isLoading={isLoading || isFetching} mobileVirtualized mobileRowHeight={MOBILE_ROW_HEIGHT} mobileListHeight={MOBILE_LIST_HEIGHT} /></div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle><AlertDialogDescription>Sản phẩm sẽ được chuyển vào thùng rác. Bạn có thể khôi phục lại sau.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="h-9">Hủy</AlertDialogCancel><AlertDialogAction className="h-9" onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <ProductImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} existingData={products} onImport={handleImport} currentUser={authEmployee ? { systemId: authEmployee.systemId, name: authEmployee.fullName || authEmployee.id } : undefined} />
      <ProductExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} allData={products} filteredData={filteredSnapshot} currentPageData={pageData} selectedData={selectedProducts} currentUser={authEmployee ? { systemId: authEmployee.systemId, name: authEmployee.fullName || authEmployee.id } : { systemId: asSystemId('SYSTEM'), name: 'System' }} />
      <PkgxLinkDialog open={pkgxLinkDialogOpen} onOpenChange={setPkgxLinkDialogOpen} product={productToLink} onSuccess={handlePkgxLinkSuccess} />
      <PkgxBulkSyncConfirmDialog confirmAction={bulkConfirmAction} progress={bulkProgress} onConfirm={executeBulkAction} onCancel={cancelBulkConfirm} />
    </div>
  );
}
