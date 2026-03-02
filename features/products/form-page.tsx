'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSearchParamsWithSetter } from '@/lib/hooks/use-search-params-setter';
import { useQueryClient } from '@tanstack/react-query';
import { useProductMutations } from './hooks/use-products';
import { ProductFormComplete, type ProductFormCompleteValues } from './product-form-complete';
import {
  Card,
  CardContent,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import type { Product } from '@/lib/types/prisma-extended';
import { usePageHeader } from '../../contexts/page-header-context';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { useAuth } from '../../contexts/auth-context';
import { toast } from 'sonner';
import { asSystemId, asBusinessId, type SystemId } from '@/lib/id-types';
import { useProduct } from './hooks/use-products';
import { useAllProducts } from './hooks/use-all-products';
import { Skeleton } from '../../components/ui/skeleton';
import { FileUploadAPI } from '@/lib/file-upload-api';

export function ProductFormPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const [searchParams] = useSearchParamsWithSetter();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { create: createMutation, update: updateMutation } = useProductMutations({});
  const { data: _allProducts = [] } = useAllProducts();
  const { data: branches } = useAllBranches();
  const { employee: authEmployee } = useAuth();
  const currentUserSystemId = authEmployee?.systemId ?? asSystemId('SYSTEM');
  const _currentUserName = authEmployee?.fullName ?? 'Hệ thống';

  const isEditing = !!systemId;
  
  // ✅ Use React Query to fetch product data from API, not Zustand store
  const { data: product, isLoading: isLoadingProduct } = useProduct(isEditing ? systemId : undefined);
  
  // Check if creating a combo from query param
  const isComboMode = searchParams.get('type') === 'combo';
  
  const handleCancel = React.useCallback(() => {
    router.push('/products');
  }, [router]);

  const headerActions = React.useMemo(() => [
    <Button 
      key="cancel"
      variant="outline"
      size="sm"
      className="h-9"
      onClick={handleCancel}
    >
      Hủy
    </Button>,
    <Button 
      key="submit"
      type="submit" 
      form="product-form-complete"
      size="sm"
      className="h-9"
    >
      {isEditing ? 'Cập nhật' : 'Tạo mới'}
    </Button>
  ], [handleCancel, isEditing]);

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
    
    
    if (product) {
      // Edit mode - update existing product
      const updatedProduct = {
        ...productData,
        ktitle: title, // Map title -> ktitle
        seoDescription: seoDescription, // Map seoDescription
        id: asBusinessId(productData.id),
        primarySupplierSystemId: productData.primarySupplierSystemId ? asSystemId(productData.primarySupplierSystemId) : undefined,
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
      
      // Invalidate product query trước khi redirect để đảm bảo detail page load data mới
      await queryClient.invalidateQueries({ queryKey: ['product', product.systemId] });
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      
      toast.success('Đã cập nhật sản phẩm thành công');
      router.push(`/products/${product.systemId}`);
      return { ...product, ...updatedProduct } as Product;
    } else {
      // Create mode - add new product
      const _defaultBranch = branches.find(b => b.isDefault);
      
      // Use inventoryByBranch from form if provided, otherwise initialize with 0 for all branches
      const formInventory = productData.inventoryByBranch || {};
      const inventoryByBranch: Record<SystemId, number> = {};
      
      branches.forEach(branch => {
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
      console.error('Failed to sync thumbnail from file table:', e);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {isEditing && isLoadingProduct ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <ProductFormComplete 
            initialData={product ?? null} 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditMode={isEditing}
            defaultType={isComboMode ? 'combo' : undefined}
          />
        )}
      </CardContent>
    </Card>
  );
}
