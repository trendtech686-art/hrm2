
import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useProductStore } from './store.ts';
import { ProductFormComplete, type ProductFormCompleteValues } from './product-form-complete.tsx';
import {
  Card,
  CardContent,
} from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import type { Product } from './types.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useRouteMeta } from '../../hooks/use-route-meta';
import { useBranchStore } from '../settings/branches/store.ts';
import { useStockHistoryStore } from '../stock-history/store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { toast } from 'sonner';
import { formatDateCustom, getCurrentDate } from '@/lib/date-utils';

export function ProductFormPage() {
  const { systemId } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const { findById, add, update } = useProductStore();
  const { data: branches } = useBranchStore();
  const { addEntry: addStockHistoryEntry } = useStockHistoryStore();
  const { data: employees } = useEmployeeStore();
  const loggedInUser = employees[0];

  const isEditing = !!systemId;
  const product = React.useMemo(() => (systemId ? findById(systemId) : null), [systemId, findById]);
  const routeMeta = useRouteMeta();
  
  const handleCancel = () => {
    navigate('/products');
  };

  const pageActions = React.useMemo(() => (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        onClick={handleCancel}
      >
        Hủy
      </Button>
      <Button 
        type="submit" 
        form="product-form-complete"
      >
        {isEditing ? 'Cập nhật' : 'Tạo mới'}
      </Button>
    </div>
  ), [isEditing, handleCancel]);
  
  usePageHeader({
    actions: [pageActions],
    breadcrumb: product ? [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Sản phẩm', href: '/products', isCurrent: false },
      { label: product.name, href: `/products/${product.systemId}`, isCurrent: false },
      { label: 'Chỉnh sửa', href: '', isCurrent: true }
    ] : routeMeta?.breadcrumb as any
    // KHÔNG truyền title - để auto-generate từ MODULES config
  });
  
  const handleSubmit = (values: ProductFormCompleteValues) => {
    if (product) {
      // Edit mode - update existing product
      update(product.systemId, { 
        ...product, 
        ...values,
        updatedAt: new Date().toISOString(),
        updatedBy: loggedInUser?.systemId,
      });
      toast.success('Đã cập nhật sản phẩm thành công');
      navigate(`/products/${product.systemId}`);
    } else {
      // Create mode - add new product
      const defaultBranch = branches.find(b => b.isDefault);
      const inventoryByBranch: Record<string, number> = {};
      
      branches.forEach(branch => {
        inventoryByBranch[branch.systemId] = 0; // Start with 0, will be updated via stock receipts
      });

      const productToAdd: Omit<Product, 'systemId'> = {
        ...values,
        inventoryByBranch,
        committedByBranch: {},
        inTransitByBranch: {},
        createdAt: new Date().toISOString(),
        createdBy: loggedInUser?.systemId,
        isDeleted: false,
      } as Omit<Product, 'systemId'>;

      const newProduct = add(productToAdd);
      
      // Add initial stock history entry
      branches.forEach(branch => {
        addStockHistoryEntry({
          productId: newProduct.systemId, // ✅ Use systemId (internal key) not SKU
          date: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
          employeeName: loggedInUser?.fullName || 'Hệ thống',
          action: 'Khởi tạo sản phẩm',
          quantityChange: 0,
          newStockLevel: 0,
          documentId: values.id, // Display ID (SKU) for documentId
          branch: branch.name,
          branchSystemId: branch.systemId,
        });
      });
      
      toast.success('Đã thêm sản phẩm thành công');
      navigate(`/products/${newProduct.systemId}`);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <ProductFormComplete 
          initialData={product} 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditMode={isEditing}
        />
      </CardContent>
    </Card>
  );
}
