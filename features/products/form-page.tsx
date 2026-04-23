'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSearchParamsWithSetter } from '@/lib/hooks/use-search-params-setter';
import { useProductMutations } from './hooks/use-products';
import { ProductFormComplete, type ProductFormCompleteValues, type ProductFormCompleteHandle } from './product-form-complete';
import {
  Card,
  CardContent,
} from '../../components/ui/card';
import { mobileBleedCardClass, FormPageFooter } from '@/components/layout/page-section';
import { cn } from '@/lib/utils';
import { Button } from '../../components/ui/button';
import type { Product } from '@/lib/types/prisma-extended';
import { usePageHeader } from '../../contexts/page-header-context';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { useAuth } from '../../contexts/auth-context';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { asSystemId, asBusinessId, type SystemId } from '@/lib/id-types';
import { useProduct } from './hooks/use-products';
import { Skeleton } from '../../components/ui/skeleton';
import { FileUploadAPI } from '@/lib/file-upload-api';
import { logError } from '@/lib/logger'

export function ProductFormPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const [searchParams] = useSearchParamsWithSetter();
  const router = useRouter();
  const { create: createMutation, update: updateMutation, isCreating, isUpdating } = useProductMutations({});
  const { data: branches } = useAllBranches();
  const { employee: authEmployee } = useAuth();
  const currentUserSystemId = authEmployee?.systemId ?? asSystemId('SYSTEM');
  const _currentUserName = authEmployee?.fullName ?? 'Hệ thống';

  const isEditing = !!systemId;
  
  // Ref to call form submit imperatively
  const formRef = React.useRef<ProductFormCompleteHandle>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const isBusy = isSaving || isCreating || isUpdating;
  
  // ✅ Use React Query to fetch product data from API, not Zustand store
  const { data: product, isLoading: isLoadingProduct } = useProduct(isEditing ? systemId : undefined);
  
  // Check if creating a combo from query param
  const isComboMode = searchParams.get('type') === 'combo';
  
  const handleCancel = React.useCallback(() => {
    router.push('/products');
  }, [router]);

  const handleSubmitClick = React.useCallback(() => {
    formRef.current?.submit();
  }, []);

  const headerActions = React.useMemo(() => [
    <Button 
      key="cancel"
      variant="outline"
      size="sm"
      className="hidden md:inline-flex h-9"
      onClick={handleCancel}
    >
      Hủy
    </Button>,
    <Button 
      key="submit"
      type="button"
      size="sm"
      className="hidden md:inline-flex h-9"
      disabled={isBusy}
      onClick={handleSubmitClick}
    >
      {isBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isBusy ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Tạo mới'}
    </Button>
  ], [handleCancel, isEditing, isBusy, handleSubmitClick]);

  const fallbackBreadcrumb = React.useMemo(() => (
    product ? [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Sản phẩm', href: '/products', isCurrent: false },
      { label: product.name, href: `/products/${product.systemId}`, isCurrent: false },
      { label: 'Chỉnh sửa', href: `/products/${product.systemId}/edit`, isCurrent: true }
    ] : [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Sản phẩm', href: '/products', isCurrent: false },
      { label: 'Thêm mới', href: '/products/new', isCurrent: true }
    ]
  ), [product]);
  
  usePageHeader({
    title: isEditing 
      ? `Chỉnh sửa sản phẩm ${product?.name ?? ''}` 
      : isComboMode 
        ? 'Thêm sản phẩm Combo mới' 
        : 'Thêm sản phẩm mới',
    subtitle: isEditing 
      ? 'Cập nhật thông tin, giá và tồn kho cho sản phẩm hiện có' 
      : isComboMode
        ? 'Tạo combo từ nhiều sản phẩm đơn lẻ với giá ưu đãi'
        : 'Hoàn tất thông tin sản phẩm để bắt đầu quản lý tồn kho',
    actions: headerActions,
    breadcrumb: fallbackBreadcrumb,
    showBackButton: true,
    backPath: product ? `/products/${product.systemId}` : '/products'
  });
  
  const handleSubmit = async (values: ProductFormCompleteValues): Promise<Product> => {
    const { title, seoDescription, ...productData } = values;
    setIsSaving(true);
    
    try {
      if (product) {
      // Edit mode - check if there are actual changes
      const hasChanges = () => {
        // Compare key fields that can be edited
        // Note: Form uses brandSystemId but API returns brandId
        const fieldMappings: Array<{ form: string; api: string }> = [
          { form: 'id', api: 'id' },
          { form: 'name', api: 'name' },
          { form: 'description', api: 'description' },
          { form: 'shortDescription', api: 'shortDescription' },
          { form: 'costPrice', api: 'costPrice' },
          { form: 'lastPurchasePrice', api: 'lastPurchasePrice' },
          { form: 'unit', api: 'unit' },
          { form: 'brandSystemId', api: 'brandId' },
          { form: 'categorySystemIds', api: 'categorySystemIds' },
          { form: 'tags', api: 'tags' },
          { form: 'isPublished', api: 'isPublished' },
          { form: 'isFeatured', api: 'isFeatured' },
          { form: 'warrantyPeriodMonths', api: 'warrantyPeriodMonths' },
          { form: 'weight', api: 'weight' },
          { form: 'weightUnit', api: 'weightUnit' },
          { form: 'barcode', api: 'barcode' },
          { form: 'slug', api: 'slug' },
          { form: 'thumbnailImage', api: 'thumbnailImage' },
          { form: 'galleryImages', api: 'galleryImages' },
          { form: 'videoLinks', api: 'videoLinks' },
          { form: 'primarySupplierSystemId', api: 'primarySupplierId' },
          { form: 'isStockTracked', api: 'isStockTracked' },
          { form: 'reorderLevel', api: 'reorderLevel' },
          { form: 'safetyStock', api: 'safetyStock' },
          { form: 'maxStock', api: 'maxStock' },
          { form: 'status', api: 'status' },
          // E-commerce display flags
          { form: 'sortOrder', api: 'sortOrder' },
          { form: 'isOnSale', api: 'isOnSale' },
          { form: 'isBestSeller', api: 'isBestSeller' },
          { form: 'isNewArrival', api: 'isNewArrival' },
          { form: 'publishedAt', api: 'publishedAt' },
          { form: 'launchedDate', api: 'launchedDate' },
          { form: 'discontinuedDate', api: 'discontinuedDate' },
          // Product type and category
          { form: 'type', api: 'type' },
          { form: 'productTypeSystemId', api: 'productTypeSystemId' },
          { form: 'storageLocationSystemId', api: 'storageLocationSystemId' },
          // Additional fields
          { form: 'dimensions', api: 'dimensions' },
          { form: 'seoPkgx', api: 'seoPkgx' },
          { form: 'seoTrendtech', api: 'seoTrendtech' },
          { form: 'warehouseLocation', api: 'warehouseLocation' },
          { form: 'subCategory', api: 'subCategory' },
          { form: 'subCategories', api: 'subCategories' },
          // Internal notes field
          { form: 'sellerNote', api: 'sellerNote' },
          // SEO fields
          { form: 'seoKeywords', api: 'seoKeywords' },
          // Label/Tem phụ fields
          { form: 'nameVat', api: 'nameVat' },
          { form: 'origin', api: 'origin' },
          { form: 'importerName', api: 'importerName' },
          { form: 'importerAddress', api: 'importerAddress' },
          { form: 'usageGuide', api: 'usageGuide' },
          // Combo fields
          { form: 'comboItems', api: 'comboItems' },
          { form: 'comboPricingType', api: 'comboPricingType' },
          { form: 'comboDiscount', api: 'comboDiscount' },
        ];
        
        // Helper to normalize values for comparison
        const normalize = (val: unknown, fieldName?: string): string => {
          if (val === null || val === undefined) return '';
          if (Array.isArray(val)) return JSON.stringify(val.sort());
          // Handle Prisma Decimal type
          if (typeof val === 'object' && val !== null && 'toNumber' in val) {
            return String((val as { toNumber: () => number }).toNumber());
          }
          // Handle Date objects
          if (val instanceof Date) {
            return val.toISOString().split('T')[0];
          }
          // Handle date strings (convert to YYYY-MM-DD)
          if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}(T|$)/.test(val)) {
            return val.split('T')[0];
          }
          // Handle type field case-insensitively
          if (fieldName === 'type' && typeof val === 'string') {
            return val.toUpperCase();
          }
          // Handle status field case-insensitively  
          if (fieldName === 'status' && typeof val === 'string') {
            return val.toUpperCase();
          }
          // Handle weightUnit case-insensitively (form: g/kg, db: GRAM/KILOGRAM)
          if (fieldName === 'weightUnit' && typeof val === 'string') {
            const v = val.toUpperCase();
            if (v === 'G') return 'GRAM';
            if (v === 'KG') return 'KILOGRAM';
            return v;
          }
          // Handle objects (like dimensions, seoPkgx, etc.)
          if (typeof val === 'object' && val !== null) {
            return JSON.stringify(val);
          }
          return String(val);
        };
        
        for (const { form, api } of fieldMappings) {
          const oldVal = (product as Record<string, unknown>)[api];
          const newVal = (productData as Record<string, unknown>)[form];
          
          if (normalize(oldVal, form) !== normalize(newVal, form)) {
            return true;
          }
        }
        
        // Check title (ktitle)
        if (normalize(product.ktitle) !== normalize(title)) {
          return true;
        }
        // Check seoDescription
        if (normalize(product.seoDescription) !== normalize(seoDescription)) {
          return true;
        }
        
        // Check prices changes
        const formPrices = productData.prices || {};
        const existingPrices: Record<string, number> = {};
        const apiPrices = (product as unknown as { prices?: Array<{ pricingPolicyId: string; price: number | string }> }).prices;
        if (Array.isArray(apiPrices)) {
          apiPrices.forEach((p) => {
            existingPrices[p.pricingPolicyId] = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
          });
        }
        const allPolicyIds = new Set([...Object.keys(formPrices), ...Object.keys(existingPrices)]);
        for (const policyId of allPolicyIds) {
          if ((formPrices[policyId] ?? 0) !== (existingPrices[policyId] ?? 0)) {
            return true;
          }
        }
        
        return false;
      };
      
      if (!hasChanges()) {
        toast.info('Không có thay đổi nào');
        return product as Product;
      }
      
      // Update existing product
      const updatedProduct = {
        ...productData,
        ktitle: title, // Map title -> ktitle
        seoDescription: seoDescription, // Map seoDescription
        id: asBusinessId(productData.id),
        // Map form field names to API field names
        brandId: productData.brandSystemId,
        primarySupplierId: productData.primarySupplierSystemId ? asSystemId(productData.primarySupplierSystemId) : undefined,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUserSystemId,
      };

      await updateMutation.mutateAsync({ 
        systemId: product.systemId, 
        ...updatedProduct 
      });
      
      // Với flow mới (upload trực tiếp), ảnh đã được lưu permanent khi upload
      // Chỉ cần sync thumbnailImage từ File table vào Product
      await syncThumbnailFromFileTable(product.systemId);
      
      // invalidateRelated already called by updateMutation.onSuccess — no inline calls needed
      
      toast.success('Đã cập nhật sản phẩm thành công');
      router.push(`/products/${product.systemId}`);
      return { ...product, ...updatedProduct } as Product;
    } else {
      // Create mode - add new product
      const _defaultBranch = branches?.find(b => b.isDefault);
      
      // Use inventoryByBranch from form if provided, otherwise initialize with 0 for all branches
      const formInventory = productData.inventoryByBranch || {};
      const inventoryByBranch: Record<SystemId, number> = {};
      
      (branches ?? []).forEach(branch => {
        // Use form value if provided, otherwise default to 0
        inventoryByBranch[branch.systemId] = formInventory[branch.systemId] ?? 0;
      });

      const productToAdd = {
        ...productData,
        ktitle: title, // Map title -> ktitle
        seoDescription: seoDescription, // Map seoDescription
        id: productData.id,
        costPrice: productData.costPrice ?? 0,
        primarySupplierSystemId: productData.primarySupplierSystemId ? asSystemId(productData.primarySupplierSystemId) : undefined,
        // Map brandSystemId -> brandId for API
        brandId: productData.brandSystemId,
        // Map categorySystemIds -> categoryIds for API
        categoryIds: productData.categorySystemIds,
        inventoryByBranch,
        committedByBranch: {},
        inTransitByBranch: {},
        isDeleted: false,
        // Pass current user info for stock history
        createdBy: currentUserSystemId,
      };
      

      const newProduct = await createMutation.mutateAsync(productToAdd) as unknown as Product;
      
      // Với flow mới (upload trực tiếp), ảnh đã được lưu permanent khi upload
      // Sync thumbnailImage từ File table vào Product
      await syncThumbnailFromFileTable(newProduct.systemId);
      
      // Stock history đã được tạo trong API route (app/api/products/route.ts)
      // Không cần tạo lại ở đây để tránh duplicate
      
      toast.success('Đã thêm sản phẩm thành công');
      router.push(`/products/${newProduct.systemId}`);
      return newProduct;
      }
    } catch (error) {
      console.error('[ProductForm] Error saving product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể lưu sản phẩm';
      toast.error(`Lỗi: ${errorMessage}`);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Sync thumbnailImage từ File table - đảm bảo product.thumbnailImage luôn khớp với File table
  const syncThumbnailFromFileTable = async (productSystemId: string) => {
    try {
      const files = await FileUploadAPI.getProductFiles(productSystemId);
      const thumbnailFile = files.find(f => f.documentName === 'thumbnail');
      const galleryFiles = files.filter(f => f.documentName === 'gallery');
      
      const updates: Record<string, unknown> = {};
      
      if (thumbnailFile) {
        updates.thumbnailImage = thumbnailFile.url;
        updates.imageUrl = thumbnailFile.url;
      }
      
      if (galleryFiles.length > 0) {
        updates.galleryImages = galleryFiles.map(f => f.url);
      }
      
      if (Object.keys(updates).length > 0) {
        await updateMutation.mutateAsync({
          systemId: productSystemId,
          ...updates,
        } as Parameters<typeof updateMutation.mutateAsync>[0]);
      }
    } catch (e) {
      logError('Failed to sync thumbnail from file table', e);
    }
  };

  return (
    <>
      <Card className={cn(mobileBleedCardClass, 'pb-[calc(env(safe-area-inset-bottom)+72px)] md:pb-0')}>
        <CardContent className="pt-6">
          {isEditing && isLoadingProduct ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <ProductFormComplete 
              ref={formRef}
              initialData={product ?? null} 
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isEditMode={isEditing}
              defaultType={isComboMode ? 'combo' : undefined}
            />
          )}
        </CardContent>
      </Card>
      {/* Mobile-only sticky action bar */}
      <FormPageFooter className="md:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCancel}
          className="h-10 flex-1"
        >
          Hủy
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={isBusy}
          onClick={handleSubmitClick}
          className="h-10 flex-1"
        >
          {isBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isBusy ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </FormPageFooter>
    </>
  );
}
