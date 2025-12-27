'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSearchParamsWithSetter } from '@/lib/hooks/use-search-params-setter';
import { useProductStore } from './store';
import { ProductFormComplete, type ProductFormCompleteValues } from './product-form-complete';
import {
  Card,
  CardContent,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import type { Product } from '@/lib/types/prisma-extended';
import { usePageHeader } from '../../contexts/page-header-context';
import { useBranchStore } from '../settings/branches/store';
import { useStockHistoryStore } from '../stock-history/store';
import { useAuth } from '../../contexts/auth-context';
import { toast } from 'sonner';
import { formatDateCustom, getCurrentDate } from '@/lib/date-utils';
import { asSystemId, asBusinessId, type SystemId } from '@/lib/id-types';
import { useImageStore } from './image-store';
import { FileUploadAPI } from '@/lib/file-upload-api';
import { calculateComboStock } from './combo-utils';

export function ProductFormPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const [searchParams] = useSearchParamsWithSetter();
  const router = useRouter();
  const { findById, add, update, data: allProducts } = useProductStore();
  const { data: branches } = useBranchStore();
  const imageStore = useImageStore();
  const { addEntry: addStockHistoryEntry } = useStockHistoryStore();
  const { employee: authEmployee } = useAuth();
  const currentUserSystemId = authEmployee?.systemId ?? asSystemId('SYSTEM');
  const currentUserName = authEmployee?.fullName ?? 'Hệ thống';

  const isEditing = !!systemId;
  const product = React.useMemo(() => (systemId ? findById(asSystemId(systemId)) : null), [systemId, findById]);
  
  // Check if creating a combo from query param
  const isComboMode = searchParams.get('type') === 'combo';
  
  const handleCancel = () => {
    if (product) {
      imageStore.clearStagingImages(product.systemId);
    }
    router.push('/products');
  };

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
    const { _imageFiles, title, seoDescription, ...productData } = values;
    
    console.log('[FormPage] handleSubmit received _imageFiles:', _imageFiles);
    console.log('[FormPage] seoPkgx value:', values.seoPkgx);
    console.log('[FormPage] seoTrendtech value:', values.seoTrendtech);
    
    if (product) {
      // Edit mode - update existing product
      const updatedProduct: Product = {
        ...product,
        ...productData,
        ktitle: title, // Map title -> ktitle
        seoDescription: seoDescription, // Map seoDescription
        systemId: product.systemId,
        id: asBusinessId(productData.id),
        primarySupplierSystemId: productData.primarySupplierSystemId ? asSystemId(productData.primarySupplierSystemId) : undefined,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUserSystemId,
      };

      update(product.systemId, updatedProduct);
      
      // Confirm staging images if any
      console.log('[FormPage] Checking if need to confirm images...', { 
        hasImageFiles: !!_imageFiles, 
        keysLength: _imageFiles ? Object.keys(_imageFiles).length : 0 
      });
      
      if (_imageFiles && Object.keys(_imageFiles).length > 0) {
        console.log('[FormPage] Calling confirmAllImages...');
        await confirmAllImages(updatedProduct.systemId, productData, _imageFiles);
      } else {
        console.log('[FormPage] No images to confirm');
      }
      
      toast.success('Đã cập nhật sản phẩm thành công');
      router.push(`/products/${product.systemId}`);
      return updatedProduct;
    } else {
      // Create mode - add new product
      const defaultBranch = branches.find(b => b.isDefault);
      const inventoryByBranch: Record<SystemId, number> = {};
      
      branches.forEach(branch => {
        inventoryByBranch[branch.systemId] = 0; // Start with 0, will be updated via stock receipts
      });

      const productToAdd: Omit<Product, 'systemId'> = {
        ...productData,
        ktitle: title, // Map title -> ktitle
        seoDescription: seoDescription, // Map seoDescription
        id: asBusinessId(productData.id),
        primarySupplierSystemId: productData.primarySupplierSystemId ? asSystemId(productData.primarySupplierSystemId) : undefined,
        inventoryByBranch,
        committedByBranch: {},
        inTransitByBranch: {},
        createdAt: new Date().toISOString(),
        createdBy: currentUserSystemId,
        isDeleted: false,
      } as Omit<Product, 'systemId'>;

      const newProduct = add(productToAdd);
      
      // Confirm staging images if any
      if (_imageFiles && Object.keys(_imageFiles).length > 0) {
        await confirmAllImages(newProduct.systemId, productData, _imageFiles);
      }
      
      // Add initial stock history entry for all product types (including combo)
      branches.forEach(branch => {
        // Calculate initial stock level
        let initialStockLevel = 0;
        
        if (productData.type === 'combo' && productData.comboItems && productData.comboItems.length > 0) {
          // For combo: calculate stock from child products
          initialStockLevel = calculateComboStock(
            productData.comboItems,
            allProducts,
            branch.systemId
          );
        } else {
          // For regular products: use inventoryByBranch if set, otherwise 0
          initialStockLevel = productData.inventoryByBranch?.[branch.systemId] || 0;
        }
        
        addStockHistoryEntry({
          productId: newProduct.systemId, // ✅ Use systemId (internal key) not SKU
          date: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
          employeeName: currentUserName,
          action: 'Khởi tạo sản phẩm',
          quantityChange: initialStockLevel, // Initial quantity = stock level
          newStockLevel: initialStockLevel,
          documentId: asBusinessId(productData.id), // Display ID (SKU) for documentId
          branch: branch.name,
          branchSystemId: branch.systemId,
        });
      });
      
      toast.success('Đã thêm sản phẩm thành công');
      router.push(`/products/${newProduct.systemId}`);
      return newProduct;
    }
  };

  const confirmAllImages = async (
    productSystemId: string,
    productData: any,
    imageFiles: Record<string, any[]>
  ) => {
    try {
      console.log('[ConfirmImages] Starting confirm with:', { productSystemId, imageFiles });
      
      const productMetadata = {
        name: productData.name || product?.name || '',
        sku: productData.id || product?.id || '',
        confirmedBy: currentUserName,
      };
      
      for (const [imageType, files] of Object.entries(imageFiles)) {
        console.log(`[ConfirmImages] Processing ${imageType}:`, files);
        
        if (files.length > 0) {
          const sessionId = files[0]?.sessionId;
          console.log(`[ConfirmImages] SessionId for ${imageType}:`, sessionId);
          
          if (sessionId) {
            console.log(`[ConfirmImages] Calling API to confirm ${imageType}...`);
            const confirmedFiles = await FileUploadAPI.confirmStagingFiles(
              sessionId,
              productSystemId,
              'products',
              imageType,
              {
                ...productMetadata,
                imageType,
              }
            );
            console.log(`[ConfirmImages] API returned for ${imageType}:`, confirmedFiles);
            
            imageStore.updatePermanentImages(
              productSystemId,
              imageType as 'thumbnail' | 'gallery',
              confirmedFiles.map(f => ({
                id: f.id,
                sessionId: '',
                name: f.name,
                originalName: f.originalName,
                slug: f.slug,
                filename: f.filename,
                size: f.size,
                type: f.type,
                url: f.url,
                status: 'permanent' as const,
                uploadedAt: f.uploadedAt,
                metadata: f.metadata
              })),
              Date.now()
            );
            
            // Cleanup staging
            try {
              await FileUploadAPI.deleteStagingSession(sessionId);
            } catch (e) {
              console.warn('Failed to cleanup staging session:', e);
            }
          }
        }
      }
      
      imageStore.clearStagingImages(productSystemId);
      toast.success('Đã lưu hình ảnh thành công!');
    } catch (error) {
      console.error('Failed to confirm images:', error);
      toast.warning('Lưu hình ảnh thất bại', {
        description: 'Vui lòng thử upload lại sau.'
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <ProductFormComplete 
          initialData={product ?? null} 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditMode={isEditing}
          defaultType={isComboMode ? 'combo' : undefined}
        />
      </CardContent>
    </Card>
  );
}
